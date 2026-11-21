<?php
/**********************************************************************

   ext2c.php —— 自建扩展积木的转换数据生成器

   本文件放在 m2 根目录（不在 editor\ScratchToText 下），避免和编辑器侧的运行时文件混在一起被误用。
   它是命令行工具，输出写到 editor\ScratchToText 的 blocks_registry.json / codeViewer.html。
   日常使用建议走 Web 操作台：m2\ext2c_ui.php（扩展构建器顶栏“转换数据生成器”进入）。

   读取 m2 自建扩展模块（data\scratch_gui 目录下的 *.part.js），解析 getInfo() 的积木定义
   （扩展ID、显示名、opcode、文本、blockType、arguments、menus）。

   四种运行模式：
      1.--registry   生成 blocks_registry.json 积木注册表 —— 自建扩展积木的唯一数据源。
                     s2c.class.php / c2s.class.php / preprocessing.inc.php 运行时自动加载它，
                     派生积木的参数配置、HAT白名单、REPORTER映射、表达式函数白名单与渲染模板。
                     新扩展接入的转换器侧工作仅此一步，零代码改动。
                         --only=ID1,ID2   仅生成指定扩展（一般不需要，默认全部生成）。
                                          可借此临时排除某个扩展，但被排除的扩展会从注册表消失、
                                          转换器立即不认识它，除非确实要下线，否则不要用。
                        -o 文件路径      注册表输出路径，须为 ScratchToText\blocks_registry.json。
      2.--codeviewer 更新 codeViewer.html 的自动填充菜单。
                     用法：php ext2c.php --codeviewer <codeViewer.html路径> <part.js路径...>
                     六模块既有条目按本文件内固化的 $CODEVIEWER_SEED 原样输出（保留人工打磨的
                     语义描述）；SEED 未覆盖的新积木/新扩展按规则自动生成（二态菜单展开成两条，
                     参数取 defaultValue）；SEED 与 .part.js 的 opcode 双向核对，差异会警告。
      3.--demo       输出每个积木的示例类C代码与单条Scratch JSON（开发扩展时预览转换效果用）。
      4.默认模式     输出旧式的手工插入代码。转换器已有注册表机制，此模式已过时，仅留参考。

   新扩展接入流程（设新模块为 data\scratch_gui\1502.part.js，扩展ID为 myNewExt）：
      cd E:\HTDOCS\class\m2
      1) 重建注册表。注意：注册表是整体重建而非增量，必须带上现有全部扩展：
         php ext2c.php --registry --only=IRREMOTER,IOTSWITCH,IOTDOORCONTROLLER,chattingroom,AIMachineLearningBlocks,Virtual3DLabBlocks,myNewExt -o ..\editor\ScratchToText\blocks_registry.json ^
           data\scratch_gui\1484.part.js ... data\scratch_gui\1499.part.js data\scratch_gui\1502.part.js
      2) 更新补全菜单（同样带全部 .part.js）：
         php ext2c.php --codeviewer ..\editor\ScratchToText\codeViewer.html <同上全部.part.js>
      3) 验证：跑 data\tmp_ext2c_test\test_c2s.php 与 test_s2c.php，再在浏览器做一次双向转换实测。

   注意：
      1.注册表整体重建：漏带哪个扩展的 .part.js，哪个就从注册表消失，转换器立刻不认识它。
      2.扩展ID必须与运行时 opcode 前缀一致（“扩展ID_积木名”格式）；工具解析时会打印各扩展ID可核对。
      3.动态菜单（items为函数调用的，如设备列表、角色列表）在 c2s 侧一律按文本输入处理。
      4.六模块（含 chattingroom）已全部纳入注册表。chattingroom 早期是手写特殊实现（裸opcode输出、
        菜单影子输出选中值），2026-11-19 已改走注册表；其旧手写 case 在 s2c/c2s 中整块注释保留备查，
        不要重新启用（会与注册表渲染冲突）。若将来确实出现非标准输出需求，仍可手写 case，但必须
        同时把该 opcode 排除出注册表。

   作者：TeleAgent，2026-11-19

**********************************************************************/

error_reporting(E_ERROR | E_PARSE);
mb_internal_encoding("UTF-8");

//从 $src 中 $start 所指的 '{' 开始，取配平的 {} 内容（不含两侧大括号）。未配平返回 null。
function extractBraceBody($src, $start)
{
   if ($start >= strlen($src) || $src[$start] !== "{") return null;
   $depth = 0;
   for ($i = $start; $i < strlen($src); $i++)
   {
      if ($src[$i] === "{") $depth++;
      else if ($src[$i] === "}")
      {
         $depth--;
         if ($depth === 0) return substr($src, $start + 1, $i - $start - 1);
      }
   }
   return null;
}

/**********************************************************************
   解析单个 .part.js 文件
***********************************************************************/
function parseExtensionFile($path)
{
   $src = @file_get_contents($path);
   if ($src === false) { fwrite(STDERR, "无法读取文件：$path\n"); return null; }

   $gi = strpos($src, "getInfo");
   if ($gi === false) { fwrite(STDERR, "未找到getInfo：$path\n"); return null; }
   $body = substr($src, $gi);

   // 扩展ID
   $id = "?";
   if (preg_match("/\breturn\s*\{\s*\r?\n\s*id:\s*'([^']+)'/u", $body, $m)) $id = $m[1];
   else if (preg_match("/\bid:\s*'([^']+)'/u", $body, $m)) $id = $m[1];

   // 扩展显示名（getInfo 的 name formatMessage default），无则回退为ID。--codeviewer 用它做菜单分类名。
   $name = $id;
   {
      $biName = strpos($body, "blocks:");
      $headSrc = ($biName !== false) ? substr($body, 0, $biName) : substr($body, 0, 2000);
      if (preg_match("/\bname\s*:\s*formatMessage\(\{[\s\S]*?default:\s*'((?:[^'\\\\]|\\\\.)*)'/u", $headSrc, $m)) $name = $m[1];
      else if (preg_match("/\bname\s*:\s*'([^']+)'/u", $headSrc, $m)) $name = $m[1];
   }

   // blocks 区：从 blocks: [ 到 menus: 之间（无menus则到 getInfo 返回的末尾）
   $bi = strpos($body, "blocks:");
   $mi = strpos($body, "menus:");
   if ($bi === false) { fwrite(STDERR, "未找到blocks定义：$path\n"); return null; }
   $blocksSrc = ($mi !== false && $mi > $bi) ? substr($body, $bi, $mi - $bi) : substr($body, $bi);
   // 去掉 /* ... */ 注释块（其中可能含有被注释掉的积木定义）
   $blocksSrc = preg_replace("/\/\*[\s\S]*?\*\//u", "", $blocksSrc);

   // 逐积木切段：以 opcode: 'xxx' 为界，切到下一个 opcode: 或段尾（文本中的[]不会再截断）
   $blocks = array();
   preg_match_all("/opcode:\s*'([^']+)'[\s\S]*?(?=opcode:\s*'|\z)/u", $blocksSrc, $segs, PREG_SET_ORDER);
   foreach ($segs as $seg)
   {
      $opcode = $seg[1];
      $textSrc = $seg[0];

      // 积木文本：formatMessage 的 default，或直接 text: 'xxx'
      $text = $opcode;
      if (preg_match("/default:\s*'((?:[^'\\\\]|\\\\.)*)'/u", $textSrc, $m)) $text = $m[1];
      else if (preg_match("/\btext:\s*'((?:[^'\\\\]|\\\\.)*)'/u", $textSrc, $m)) $text = $m[1];

      // blockType
      $type = "COMMAND";
      if (preg_match("/blockType:\s*BlockType\.(\w+)/u", $textSrc, $m)) $type = strtoupper($m[1]);

      // arguments：定位 arguments: { 后做配平提取
      $args = array();
      $apos = strpos($textSrc, "arguments:");
      if ($apos !== false)
      {
         $brk = strpos($textSrc, "{", $apos);
         if ($brk !== false)
         {
            $argSrc = extractBraceBody($textSrc, $brk);
            if ($argSrc !== null)
            {
               // 逐参数对象做配平提取
               preg_match_all("/(\w+):\s*\{/u", $argSrc, $argNames, PREG_OFFSET_CAPTURE);
               for ($k = 0; $k < count($argNames[0]); $k++)
               {
                  $argBody = extractBraceBody($argSrc, $argNames[0][$k][1] + strlen($argNames[0][$k][0]) - 1);
                  if ($argBody === null) continue;
                  $argtype = "STRING";
                  if (preg_match("/type:\s*(?:ArgumentType|BlockType)\.(\w+)/u", $argBody, $tm)) $argtype = strtoupper($tm[1]);
                  $menu = null;
                  if (preg_match("/menu:\s*'([^']+)'/u", $argBody, $mm)) $menu = $mm[1];
                  $default = "";
                  if (preg_match("/defaultValue:\s*'([^']*)'/u", $argBody, $dm)) $default = $dm[1];
                  elseif (preg_match("/defaultValue:\s*([\d.]+)/u", $argBody, $dm)) $default = $dm[1];
                  $args[$argNames[1][$k][0]] = array("name" => $argNames[1][$k][0], "argtype" => $argtype, "menu" => $menu, "default" => $default);
               }
            }
         }
      }

      // 参数顺序：按积木文本中 [NAME] 出现的先后，找不到的排最后
      if (count($args) > 1)
      {
         uasort($args, function ($a, $b) use ($text) {
            $pa = mb_strpos($text, "[" . $a["name"] . "]");
            $pb = mb_strpos($text, "[" . $b["name"] . "]");
            if ($pa === false) $pa = 9999;
            if ($pb === false) $pb = 9999;
            return $pa - $pb;
         });
      }

      $blocks[] = array("opcode" => $opcode, "text" => $text, "type" => $type, "args" => array_values($args));
   }

   // menus 区：逐菜单名定位后配平提取
   $menus = array();
   if ($mi !== false)
   {
      $menusSrc = substr($body, $mi);
      preg_match_all("/(\w+):\s*\{/u", $menusSrc, $menuNames, PREG_OFFSET_CAPTURE);
      for ($k = 0; $k < count($menuNames[0]); $k++)
      {
         $menuName = $menuNames[1][$k][0];
         $menuBody = extractBraceBody($menusSrc, $menuNames[0][$k][1] + strlen($menuNames[0][$k][0]) - 1);
         if ($menuBody === null || strpos($menuBody, "items:") === false) continue;
         if ($menuName === "menus") continue;		// 跳过 menus: 自身的伪名

         if (preg_match("/items:\s*\{/u", $menuBody)) // items为对象列表（带嵌套{}）
         {
            $items = array();
            if (preg_match_all("/\{\s*text:\s*'([^']*)',\s*value:\s*'([^']*)'\s*\}/u", $menuBody, $ov, PREG_SET_ORDER))
            {
               foreach ($ov as $v) $items[] = $v[1] . "=" . $v[2]; // 记为 文本=值
               $menus[$menuName] = array("static" => true, "items" => $items);
            }
            else $menus[$menuName] = array("static" => false, "source" => "对象列表");
         }
         else if (preg_match("/items:\s*\[([\s\S]*?)\]/u", $menuBody, $im))
         {
            $items = array();
            if (preg_match_all("/'((?:[^'\\\\]|\\\\.)*)'/u", $im[1], $iv, PREG_SET_ORDER))
               foreach ($iv as $v) $items[] = $v[1];
            $menus[$menuName] = array("static" => true, "items" => $items);
         }
         else if (preg_match("/items:\s*([\s\S]*?)(?:\r?\n|$)/u", $menuBody, $im))
         {
            // 动态菜单：items: this.getDeviceMenu() 或 items: 'loadSpriteList'
            $menus[$menuName] = array("static" => false, "source" => trim($im[1]));
         }
      }
   }

   return array("id" => $id, "name" => $name, "blocks" => $blocks, "menus" => $menus);
}

/**********************************************************************
   代码生成
***********************************************************************/

// 参数在 c2s 配置中的影子定义：Array(输入名, 影子opcode, 影子字段名, 默认值)
function genInputConfig($arg, $extId, $menus)
{
   if ($arg["menu"] !== null && isset($menus[$arg["menu"]]) && $menus[$arg["menu"]]["static"])
      return 'Array("' . $arg["name"] . '","' . $extId . '_menu_' . $arg["menu"] . '","' . $arg["menu"] . '","' . $arg["default"] . '")';
   if ($arg["menu"] !== null && isset($menus[$arg["menu"]]) && !$menus[$arg["menu"]]["static"])
      return 'Array("' . $arg["name"] . '","text","TEXT","' . $arg["default"] . '")'; // 动态菜单用文本
   if ($arg["menu"] !== null) // 菜单未解析到，保守用文本
      return 'Array("' . $arg["name"] . '","text","TEXT","' . $arg["default"] . '")';
   if ($arg["argtype"] === "NUMBER") return 'Array("' . $arg["name"] . '","math_number","NUM","' . $arg["default"] . '")';
   if ($arg["argtype"] === "ANGLE") return 'Array("' . $arg["name"] . '","math_angle","NUM","' . $arg["default"] . '")';
   return 'Array("' . $arg["name"] . '","text","TEXT","' . $arg["default"] . '")';
}

// s2c 某积木的 case 代码（opcode 用“扩展ID_积木名”完整形态）
function genS2cCase($b, $extId)
{
   $op = $extId . "_" . $b["opcode"];
   $txt = str_replace("\n", " ", $b["text"]);
   $lines = array();
   $args = $b["args"];

   if ($b["type"] === "HAT")
   {
      $lines[] = '         case "' . $op . '":' . "\t\t\t\t\t//" . $txt;
      if (count($args) === 0)
      {
         $lines[] = '            $this->codeInC[$this->currentType][]= "//' . $txt . '\\n".$Block->{"opcode"}."(){".$this->getComments($Block->{"id"})."\\n";';
      }
      else
      {
         $lines[] = '            $this->codeInC[$this->currentType][]= "//' . $txt . '\\n".$Block->{"opcode"}."( ";';
         foreach ($args as $a)
         {
            if ($a["menu"] !== null)
               $lines[] = '            $this->convertMenuInput($Block,"' . $a["name"] . '");';
            else
               $lines[] = '            $this->codeInC[$this->currentType][]  = $this->convertCode($Block->{"inputs"}->{"' . $a["name"] . '"});';
         }
         $lines[] = '            $this->codeInC[$this->currentType][]= "){".$this->getComments($Block->{"id"})."\\n";';
      }
      $lines[] = '            $this->nLeftPadding++;';
      $lines[] = '            break;';
   }
   elseif ($b["type"] === "REPORTER")
   {
      $lines[] = '         case "' . $op . '":' . "\t\t\t\t\t//" . $txt;
      if (count($args) === 0)
      {
         $lines[] = '            $this->codeInC[$this->currentType][] = $Block->{"opcode"}."()";';
      }
      else
      {
         $lines[] = '            $this->codeInC[$this->currentType][] = $Block->{"opcode"}."(";';
         foreach ($args as $a)
         {
            if ($a["menu"] !== null)
               $lines[] = '            $this->convertMenuInput($Block,"' . $a["name"] . '");';
            else
               $lines[] = '            $this->codeInC[$this->currentType][]  = $this->convertCode($Block->{"inputs"}->{"' . $a["name"] . '"});';
         }
         $lines[] = '            $this->codeInC[$this->currentType][] = ")";';
      }
      $lines[] = '            break;';
   }
   else // COMMAND
   {
      $lines[] = '         case "' . $op . '":' . "\t\t\t\t\t//" . $txt;
      if (count($args) === 0)
      {
         $lines[] = '            $this->codeInC[$this->currentType][] = $this->padding().$Block->{"opcode"}."();".$this->getComments($Block->{"id"})."\\n";';
      }
      else
      {
         $lines[] = '            $this->codeInC[$this->currentType][]  = $this->padding().$Block->{"opcode"}."( ";';
         $n = count($args);
         for ($i = 0; $i < $n; $i++)
         {
            $a = $args[$i];
            if ($i > 0) $lines[] = '            $this->codeInC[$this->currentType][]  = " , ";';
            if ($a["menu"] !== null)
               $lines[] = '            $this->convertMenuInput($Block,"' . $a["name"] . '");';
            else
               $lines[] = '            $this->codeInC[$this->currentType][]  = $this->convertCode($Block->{"inputs"}->{"' . $a["name"] . '"});';
         }
         $lines[] = '            $this->codeInC[$this->currentType][]  = " );".$this->getComments($Block->{"id"})."\\n";';
      }
      $lines[] = '            break;';
   }
   return implode("\r\n", $lines);
}

// 某积木的示例类C代码 + 单条Scratch JSON示例
function genDemo($b, $extId, $menus)
{
   $op = $extId . "_" . $b["opcode"];
   $argStr = array();
   $shadows = array();
   foreach ($b["args"] as $a)
   {
      $argStr[] = ($a["argtype"] === "NUMBER") ? $a["default"] : '"' . $a["default"] . '"';
      if ($a["menu"] !== null && isset($menus[$a["menu"]]) && $menus[$a["menu"]]["static"])
         $shadows[] = '{"id": "S_' . $a["name"] . '","opcode": "' . $extId . '_menu_' . $a["menu"] . '","inputs": {},"fields": {"' . $a["menu"] . '": {"name": "' . $a["menu"] . '","value": "' . $a["default"] . '"}},"shadow": true}';
      else
         $shadows[] = '{"id": "S_' . $a["name"] . '","opcode": "' . (($a["argtype"] === "NUMBER") ? "math_number" : "text") . '","inputs": {},"fields": {"' . (($a["argtype"] === "NUMBER") ? "NUM" : "TEXT") . '": {"name": "' . (($a["argtype"] === "NUMBER") ? "NUM" : "TEXT") . '","value": "' . $a["default"] . '"}},"shadow": true}';
   }
   if ($b["type"] === "HAT") $c = $op . "(" . implode(",", $argStr) . "){ /*...*/ }";
   elseif ($b["type"] === "REPORTER") $c = $op . "(" . implode(",", $argStr) . ")";
   else $c = $op . "(" . implode(",", $argStr) . ");";

   $inputs = array();
   foreach ($b["args"] as $a) $inputs[] = '"' . $a["name"] . '": {"name": "' . $a["name"] . '","block": "S_' . $a["name"] . '","shadow": "S_' . $a["name"] . '"}';
   $json = '{"id": "B_' . $op . '","opcode": "' . $op . '","inputs": {' . implode(",", $inputs) . '},"fields": {},'
      . '"next": null,"topLevel": ' . (($b["type"] === "HAT" || $b["type"] === "COMMAND") ? "true" : "false") . ',"parent": null,"shadow": false}';
    if (count($shadows) > 0) $json .= "\n   影子积木：\n   " . implode("\n   ", $shadows);
    return array($c, $json);
}

/**********************************************************************
   注册表数据生成（--registry）：输出 blocks_registry.json
   注册表是自建扩展积木的唯一数据描述，供 s2c/c2s 的“注册表驱动机制”加载：
      menus  : 菜单影子积木（opcode/字段名/静态选项或动态标记）
      blocks : 各积木的 kind(hat/command/reporter)、text(积木文本，含[参数]占位)、args(参数序列)
   参数在两个转换器里的 shadow 配置，由加载方按 menu静态性/type 派生，不再生成任何 case 代码。
***********************************************************************/
function genRegistry($exts, $only)
{
   $reg = array(
      "_meta" => array(
         "generator" => "ext2c.php --registry",
         "generated" => date("Y-m-d H:i:s"),
         "sources" => array(),
      ),
      "extensions" => array(),
   );
   foreach ($exts as $e)
   {
      if ($only !== null && !in_array($e["id"], $only)) continue;
      $reg["_meta"]["sources"][] = $e["id"];

      $menus = array();
      foreach ($e["menus"] as $menuName => $info)
         $menus[$menuName] = array(
            "opcode" => $e["id"] . "_menu_" . $menuName,
            "field" => $menuName,
            "static" => $info["static"] ? true : false,
            "items" => isset($info["items"]) ? $info["items"] : array(),
         );

      $blocks = array();
      foreach ($e["blocks"] as $b)
      {
         $args = array();
         foreach ($b["args"] as $a)
            $args[] = array(
               "name" => $a["name"],
               "menu" => (($a["menu"] !== null && isset($menus[$a["menu"]])) ? $a["menu"] : null),
               "type" => $a["argtype"],
               "default" => $a["default"],
            );
         $blocks[$e["id"] . "_" . $b["opcode"]] = array(
            "kind" => strtolower($b["type"]),
            "text" => str_replace("\n", " ", $b["text"]),
            "args" => $args,
         );
      }

      $reg["extensions"][$e["id"]] = array("menus" => $menus, "blocks" => $blocks);
   }
   return json_encode($reg, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
}

/**********************************************************************
   codeViewer 菜单生成（--codeviewer）：
      SEED   ：六模块现有手工条目（人工打磨的语义描述），重新生成时原样输出，保证与手工版逐字节一致。
      规则    ：SEED 未覆盖的新积木/新扩展，按 .part.js 数据自动生成条目：
                label=积木文本（删[占位]符；二态菜单【开/关、显示/隐藏、开启/关闭】的积木按状态展开成两条，
                状态词替换到占位符原位）；模板参数=defaultValue（数字型裸值，其余带转义引号）；
                hat 带尾缀 “){\n\n\n}”，command 以 “);” 结尾，reporter 不带分号。
      校验    ：SEED 与 .part.js 的 opcode 双向核对，差异输出到 STDERR 提醒更新 SEED。
***********************************************************************/

//分类名映射：menu 显示分类 与 .part.js 扩展名不一致的登记在这里；其余用 .part.js 的 name。
$EXT_CATEGORY_MAP = Array(
   "IOTDOORCONTROLLER" => "门禁控制系统",
   "chattingroom" => "网络工具",
   "Virtual3DLabBlocks" => "三维空间",
);

$CODEVIEWER_SEED = Array(
//codeViewer 菜单 SEED：六模块现有手工条目（label 为人工打磨的语义描述，模板参数为真实菜单值）。
//从 codeViewer.html 2026-11 版本原样固化，保证 --codeviewer 生成结果与之逐字节一致；
//模块升级时：模板变化→改此表；新增积木→追加条目或交给规则引擎自动生成（.part.js 的 defaultValue）。

   //网络工具
   Array('网络工具', '当收到聊天消息', 'chattingroom_whenChatMessageComes(){\n\n\n}'),
   Array('网络工具', '向好友发送消息', 'chattingroom_sendMsgTo( \"张三\" , \"你好\" );'),
   Array('网络工具', '上报信息：步长、转向、耗时', 'chattingroom_sendReport( 0 , 0 , 0 , 0 );'),
   Array('网络工具', '上报信息', 'chattingroom_sendReport2( \"待发送消息\" );'),
   Array('网络工具', '来自某人的最后一条消息', 'chattingroom_lastMsgFrom( \"张三\" )'),
   Array('网络工具', '最后一条未读消息', 'chattingroom_lastReceivedMsg()'),
   Array('网络工具', '最后一条未读消息的发送者', 'chattingroom_lastReceivedMsgSender()'),
   Array('网络工具', '未读消息数量', 'chattingroom_unreadMsgLength()'),
   Array('网络工具', '按符号拆分字符串到列表', 'chattingroom_splitString( \" \" , \"待拆分字符串\" , 列表名 );'),

   //红外遥控器
   Array('红外遥控器', '当接收到数据', 'IRREMOTER_whenDataComes(){\n\n\n}'),
   Array('红外遥控器', '设置发送端口', 'IRREMOTER_setIRPort( \"0\" );'),
   Array('红外遥控器', '设置载波频率', 'IRREMOTER_setIRRate( \"36000\" );'),
   Array('红外遥控器', '发送数据', 'IRREMOTER_sendAndWait( \"你好\" );'),
   Array('红外遥控器', '接收到的数据', 'IRREMOTER_getIRData()'),

   //网络开关
   Array('网络开关', '使设备打开', 'IOTSWITCH_setSwitch( \"设备名\" , \"开\" );'),
   Array('网络开关', '使设备关闭', 'IOTSWITCH_setSwitch( \"设备名\" , \"关\" );'),
   Array('网络开关', '获取所有设备', 'IOTSWITCH_getSwitches();'),
   Array('网络开关', '获取设备状态', 'IOTSWITCH_getSwitchStatus( \"设备名\" );'),
   Array('网络开关', '设备的状态', 'IOTSWITCH_getSwitch( \"设备名\" )'),

   //门禁控制系统
   Array('门禁控制系统', '选择开关', 'IOTDOORCONTROLLER_setIRPort( \"0\" );'),
   Array('门禁控制系统', '设置开关状态', 'IOTDOORCONTROLLER_setIRRate( \"开\" );'),
   Array('门禁控制系统', '获取开关状态', 'IOTDOORCONTROLLER_getIRData( \"0\" )'),

   //机器学习
   Array('机器学习', '当识别到手势', 'AIMachineLearningBlocks_whenDetectedHAND( \"✌️\" ){\n\n\n}'),
   Array('机器学习', '开启食指指尖追踪', 'AIMachineLearningBlocks_startIndexFingerPointing( \"开启\" );'),
   Array('机器学习', '关闭食指指尖追踪', 'AIMachineLearningBlocks_startIndexFingerPointing( \"关闭\" );'),
   Array('机器学习', '食指指尖X坐标', 'AIMachineLearningBlocks_getIndexFingerX()'),
   Array('机器学习', '食指指尖Y坐标', 'AIMachineLearningBlocks_getIndexFingerY()'),
   Array('机器学习', '打开摄像头', 'AIMachineLearningBlocks_setCamera( \"打开\" );'),
   Array('机器学习', '关闭摄像头', 'AIMachineLearningBlocks_setCamera( \"关闭\" );'),

   //三维空间
   Array('三维空间', '当飞机穿过圆环', 'Virtual3DLabBlocks_whenRingPassed( \"1\" ){\n\n\n}'),
   Array('三维空间', '重置3D游戏状态', 'Virtual3DLabBlocks_resetGame();'),
   Array('三维空间', '开启3D场景', 'Virtual3DLabBlocks_show3D( \"开启\" );'),
   Array('三维空间', '关闭3D场景', 'Virtual3DLabBlocks_show3D( \"关闭\" );'),
   Array('三维空间', '显示3D坐标系', 'Virtual3DLabBlocks_setAxesVisible( \"显示\" );'),
   Array('三维空间', '隐藏3D坐标系', 'Virtual3DLabBlocks_setAxesVisible( \"隐藏\" );'),
   Array('三维空间', '设置模型为小飞机', 'Virtual3DLabBlocks_set3DModel( \"plane\" );'),
   Array('三维空间', '设置模型为小汽车', 'Virtual3DLabBlocks_set3DModel( \"car\" );'),
   Array('三维空间', '设置模型为纸片人', 'Virtual3DLabBlocks_set3DModel( \"sprite\" );'),
   Array('三维空间', '追踪角色', 'Virtual3DLabBlocks_trackSprite( \"角色1\" );'),
   Array('三维空间', '开启造型映射', 'Virtual3DLabBlocks_setCostumeMapping( \"开启\" );'),
   Array('三维空间', '关闭造型映射', 'Virtual3DLabBlocks_setCostumeMapping( \"关闭\" );'),
   Array('三维空间', '显示模型', 'Virtual3DLabBlocks_setModelVisible( \"显示\" );'),
   Array('三维空间', '隐藏模型', 'Virtual3DLabBlocks_setModelVisible( \"隐藏\" );'),
   Array('三维空间', '设置任务目标：需穿过3个圆环', 'Virtual3DLabBlocks_setTaskGoal( 3 );'),
   Array('三维空间', '开启相机跟随视角', 'Virtual3DLabBlocks_setCameraFollow( \"开启\" );'),
   Array('三维空间', '关闭相机跟随视角', 'Virtual3DLabBlocks_setCameraFollow( \"关闭\" );'),
   Array('三维空间', '模型移到xyz', 'Virtual3DLabBlocks_moveModelToPosition( 0 , 0 , 0 );'),
   Array('三维空间', '模型在1秒内滑行到xyz', 'Virtual3DLabBlocks_glideModelToPosition( 1 , 0 , 0 , 0 );'),
   Array('三维空间', '将模型高度设为', 'Virtual3DLabBlocks_setHeight( 5 );'),
   Array('三维空间', '显示圆环编号', 'Virtual3DLabBlocks_setRingLabelsVisible( \"显示\" );'),
   Array('三维空间', '隐藏圆环编号', 'Virtual3DLabBlocks_setRingLabelsVisible( \"隐藏\" );'),
   Array('三维空间', '显示1个圆环在随机位置', 'Virtual3DLabBlocks_setNRingVisible( \"1\" );'),
   Array('三维空间', '显示圆环', 'Virtual3DLabBlocks_setRingVisible( \"显示\" , \"1\" );'),
   Array('三维空间', '隐藏圆环', 'Virtual3DLabBlocks_setRingVisible( \"隐藏\" , \"1\" );'),
   Array('三维空间', '让圆环出现在随机位置', 'Virtual3DLabBlocks_randomizeRing( \"1\" );'),
   Array('三维空间', '设置圆环参数', 'Virtual3DLabBlocks_setRingPosition( \"1\" , 40 , 0 , 0 , 0 );'),
   Array('三维空间', '设置圆环旋转', 'Virtual3DLabBlocks_setRingRotation( \"1\" , 0 , 0 , 0 );'),
   Array('三维空间', '设置圆环规则', 'Virtual3DLabBlocks_setRingRule( \"1\" , \"只能穿一次\" , 0 );'),
   Array('三维空间', '播放眼镜蛇机动', 'Virtual3DLabBlocks_playCobraManeuver( 2.2 );'),
   Array('三维空间', '播放眼镜蛇+落叶飘', 'Virtual3DLabBlocks_playCobraLeafManeuver( 5.5 , 2.0 );'),
   Array('三维空间', '播放筋斗画圆', 'Virtual3DLabBlocks_playLoopManeuver( 1.8 , 1.3 );'),
   Array('三维空间', '播放落叶飘', 'Virtual3DLabBlocks_playFallingLeafManeuver( 3.4 , 2.4 , 0.5 , 1.4 );'),
   Array('三维空间', '播放过山车', 'Virtual3DLabBlocks_playCoasterManeuver( 3.0 , 1.2 , 2.5 , 2 , \"z\" );'),
   Array('三维空间', '追加终端信息', 'Virtual3DLabBlocks_appendTerminalText( \"你好\" );'),
   Array('三维空间', '当前模型的高度', 'Virtual3DLabBlocks_get3DHeight()'),
   Array('三维空间', '当前模型的俯仰角', 'Virtual3DLabBlocks_get3DPitch()'),
   Array('三维空间', '当前模型的翻滚角', 'Virtual3DLabBlocks_get3DRoll()'),
   Array('三维空间', '穿环次数', 'Virtual3DLabBlocks_getRingCount()'),
   Array('三维空间', '已穿圆环个数', 'Virtual3DLabBlocks_getPassedRingCount()'),
    Array('三维空间', '最后一次穿越的圆圈ID', 'Virtual3DLabBlocks_getLastPassedRingId()'),
);

//从模板文本中提取 opcode（首个 ( 或 ; 之前的标识符）
function cvTplOpcode($tpl)
{
   if (preg_match('/^\s*([A-Za-z0-9_]+)/', $tpl, $m)) return $m[1];
   return "";
}

//按规则生成单积木的菜单条目（用于 SEED 未覆盖的新积木/新扩展）
function genCodeviewerEntries($b, $extId, $menus)
{
   $op = $extId . "_" . $b["opcode"];
   $entries = array();

   //二态菜单参数检测：items[0] 为开态、items[1] 为关态的静态双值菜单
   $bistate = null; $bistateVals = null;
   foreach ($b["args"] as $a)
   {
      if ($a["menu"] !== null && isset($menus[$a["menu"]]) && $menus[$a["menu"]]["static"]
         && count($menus[$a["menu"]]["items"]) == 2)
      {
         $v = $menus[$a["menu"]]["items"];
         if (in_array($v[0], array("开", "显示", "开启", "打开")) && in_array($v[1], array("关", "隐藏", "关闭")))
         { $bistate = $a; $bistateVals = $v; break; }
      }
   }

   //模板参数值：数字型裸值，其余带转义引号；$overVal 用于二态条目取当前状态词
   $fmtArg = function ($a, $overVal = null)
   {
      $v = ($overVal !== null) ? $overVal : $a["default"];
      if ($a["argtype"] === "NUMBER" || $a["argtype"] === "ANGLE") return strval($v);
      return '\\"' . $v . '\\"';
   };

   $mkLabel = function ($text) { return str_replace(" ", "", $text); };

   $makeTpl = function ($args, $overBistate, $overVal) use ($op, $fmtArg, $b)
   {
      $parts = array();
      foreach ($args as $a)
         $parts[] = ($overBistate !== null && $a["name"] === $overBistate["name"]) ? $fmtArg($a, $overVal) : $fmtArg($a);
      if ($b["type"] === "HAT") $tail = '){\n\n\n}';
      elseif ($b["type"] === "REPORTER") $tail = ')';
      else $tail = ');';
      if (count($parts) == 0)							//无参积木
      {
         if ($b["type"] === "HAT") return $op . '(){\n\n\n}';
         if ($b["type"] === "COMMAND") return $op . "();";
         return $op . "()";
      }
      return $op . "( " . implode(" , ", $parts) . " " . $tail;
   };

   if ($bistate !== null)							//二态：按状态展开两条
   {
      foreach ($bistateVals as $val)
      {
         $label = $b["text"];
         $label = str_replace("[" . $bistate["name"] . "]", $val, $label);		//状态词替换到占位符原位
         foreach ($b["args"] as $a)
            if ($a["name"] !== $bistate["name"]) $label = str_replace("[" . $a["name"] . "]", "", $label);
         $entries[] = array($mkLabel($label), $makeTpl($b["args"], $bistate, $val));
      }
   }
   else										//普通：一条
   {
      $label = $b["text"];
      foreach ($b["args"] as $a)
         $label = str_replace("[" . $a["name"] . "]", "", $label);
      $entries[] = array($mkLabel($label), $makeTpl($b["args"], null, null));
   }
   return $entries;
}

//更新 codeViewer.html 的自动填充菜单
function updateCodeviewerHtml($htmlPath, $exts)
{
   global $CODEVIEWER_SEED, $EXT_CATEGORY_MAP;

   $src = file_get_contents($htmlPath);
   $nAll = substr_count($src, "\n");
   $nCRLF = substr_count($src, "\r\n");
   $eol = ($nAll == 0 || $nCRLF * 2 >= $nAll) ? "\r\n" : "\n";			//跟随原文件主流行尾风格

   //锚点：替换从自建扩展菜单标记（或首版的 //网络工具）到 arrKEYWORD 数组收尾 ); 行首之间的整段
   $anchor = "";
   $p1 = -1;
   if (preg_match('/^[ \t]*\/\/===== 自建扩展菜单/m', $src, $m, PREG_OFFSET_CAPTURE)) { $p1 = $m[0][1]; $anchor = "marked"; }
   else if (preg_match('/^[ \t]*\/\/网络工具[ \t\r]*$/m', $src, $m, PREG_OFFSET_CAPTURE)) { $p1 = $m[0][1]; $anchor = "legacy"; }
   else { fwrite(STDERR, "codeViewer.html 中未找到自建扩展菜单段锚点（//自建扩展菜单 或 //网络工具），中止。\n"); exit(1); }

   $p2 = -1;
   if (preg_match('/^[ \t]*\);[ \t\r]*$/m', $src, $m2, PREG_OFFSET_CAPTURE, $p1)) $p2 = $m2[0][1];
   else { fwrite(STDERR, "codeViewer.html 中未找到 arrKEYWORD 数组的收尾 );，中止。\n"); exit(1); }
   if ($p2 <= $p1) { fwrite(STDERR, "锚点定位异常（p1=$p1 p2=$p2），中止。\n"); exit(1); }

   //1) SEED 条目按分类分组
   $groups = array();									//cat => Array(Array(label,tpl),...)，保持插入顺序
   foreach ($CODEVIEWER_SEED as $arr)
   {
      if (!isset($groups[$arr[0]])) $groups[$arr[0]] = array();
      $groups[$arr[0]][] = array($arr[1], $arr[2]);
   }

   //2) 逐扩展核对与增量生成：SEED 未覆盖的新积木追加到该分类组尾；新扩展建新组
   foreach ($exts as $e)
   {
      $cat = isset($EXT_CATEGORY_MAP[$e["id"]]) ? $EXT_CATEGORY_MAP[$e["id"]] : $e["name"];
      $seedOps = array();
      foreach ($groups as $gcat => $items)
         foreach ($items as $it)
            if (strpos($it[1], $e["id"] . "_") === 0) $seedOps[] = cvTplOpcode($it[1]);

      $haveOps = array();
      foreach ($e["blocks"] as $b) $haveOps[] = $e["id"] . "_" . $b["opcode"];

      foreach ($e["blocks"] as $b)
      {
         $op = $e["id"] . "_" . $b["opcode"];
         if (!in_array($op, $seedOps))
         {
            if (!isset($groups[$cat])) $groups[$cat] = array();
            foreach (genCodeviewerEntries($b, $e["id"], $e["menus"]) as $ent) $groups[$cat][] = $ent;
            fwrite(STDERR, "新增条目：$op（SEED 未覆盖，已按规则生成）\n");
         }
      }
      foreach ($seedOps as $sop)
      {
         if ($sop !== "" && !in_array($sop, $haveOps))
            fwrite(STDERR, "警告：SEED 条目 $sop 在 {$e['id']}.part.js 中不存在，模块可能已删改积木，请更新 SEED。\n");
      }
   }

   //3) 组装段落
   $sec = array();
   $sec[] = "   //===== 自建扩展菜单：ext2c.php --codeviewer 生成，请勿手工编辑 =====";
   foreach ($groups as $cat => $items)
   {
      $sec[] = "";
      $sec[] = "   //$cat";
      foreach ($items as $it)
         $sec[] = "   \"" . $cat . "->" . $it[0] . "|" . $it[1] . "\",";
   }
   $sec[] = "   //===== 自建扩展菜单结束 =====";
   $sec[] = "";

   $newSrc = substr($src, 0, $p1) . implode($eol, $sec) . $eol . substr($src, $p2);
   if (!preg_match('/\);\s*\/\/ 将光标/', $newSrc) && !preg_match('/\);\s*function getCursorPixelPosition/', $newSrc))
      fwrite(STDERR, "提示：数组收尾后的代码衔接格式与预期不同，请人工核对一次。\n");
   file_put_contents($htmlPath, $newSrc);
   $n = 0; foreach ($groups as $items) $n += count($items);
   echo "codeViewer.html 已更新：锚点($anchor)，" . count($groups) . " 个分类共 $n 条。\n";
}

/**********************************************************************
   主流程
***********************************************************************/
$demo = false;
$registry = false;
$only = null;
$outFile = null;
$codeviewer = false;
$cvNextHtml = false;
$cvHtml = null;
$files = array();
foreach (array_slice($GLOBALS["argv"], 1) as $a)
{
   if ($demo === false && $a === "--demo") { $demo = true; continue; }
   if ($registry === false && $a === "--registry") { $registry = true; continue; }
   if ($a === "--codeviewer") { $codeviewer = true; $cvNextHtml = true; continue; }
   if ($cvNextHtml) { $cvHtml = $a; $cvNextHtml = false; continue; }		//--codeviewer 后的第一个参数为 codeViewer.html 路径
   if (strpos($a, "--only=") === 0) { $only = array_values(array_filter(explode(",", substr($a, 7)))); continue; }
   if ($outFile === null && $a === "-o") { $outFile = ""; continue; }	//下一个参数才是文件名
   if ($outFile === "") { $outFile = $a; continue; }
   $files[] = $a;
}
if (count($files) === 0)
{
   echo "用法：php ext2c.php [--demo|--registry [--only ID1,ID2] [-o 输出文件]|--codeviewer codeViewer.html <1484.part.js>...] <1484.part.js> [更多.part.js...]\n";
   echo "  --demo       同时输出每个积木的示例类C代码与Scratch JSON示例\n";
   echo "  --registry   输出 blocks_registry.json 积木注册表（数据驱动，不生成case代码）\n";
   echo "  --only       仅生成指定扩展ID（逗号分隔，如排除与手写实现共存的扩展）\n";
   echo "  -o           注册表写入指定文件\n";
   echo "  --codeviewer 更新 codeViewer.html 的自动填充菜单：六模块按 SEED 固化条目，新扩展按规则生成\n";
   exit(1);
}
if (count($files) === 0)
{
   echo "用法：php ext2c.php [--demo] <1484.part.js> [更多.part.js...]\n";
   echo "  --demo  同时输出每个积木的示例类C代码与Scratch JSON示例\n";
   exit(1);
}

$exts = array();
foreach ($files as $f)
{
   $e = parseExtensionFile($f);
   if ($e === null) continue;
   $exts[] = $e;
}

echo "解析完成：\n";
foreach ($exts as $e)
   echo "  扩展 " . $e["id"] . "：" . count($e["blocks"]) . " 个积木，" . count($e["menus"]) . " 个菜单"
      . (count($e["menus"]) > 0 ? "（" . implode("、", array_keys($e["menus"])) . "）" : "") . "\n";

/**********************************************************************
   注册表模式：输出 blocks_registry.json 后结束，不生成任何 case 代码。
***********************************************************************/
if ($registry)
{
   $json = genRegistry($exts, $only);
   if ($outFile !== null && $outFile !== "")
   {
      file_put_contents($outFile, $json);
      echo "\n注册表已写入：{$outFile}（" . strlen($json) . " 字节）\n";
   }
   else
      echo "\n" . $json . "\n";
   echo "\n完成。\n";
   exit(0);
}

/**********************************************************************
   codeViewer 菜单生成模式：更新 codeViewer.html 的自动填充菜单后结束。
***********************************************************************/
if ($codeviewer)
{
   if ($cvHtml === null || $cvHtml === "" || !file_exists($cvHtml)) { fwrite(STDERR, "--codeviewer 需要有效的 codeViewer.html 路径\n"); exit(1); }
   updateCodeviewerHtml($cvHtml, $exts);
   exit(0);
}


/**********************************************************************
   输出 1：s2c.class.php 追加代码
***********************************************************************/
echo "\n\n======================================== s2c.class.php 追加代码 ========================================\n";
echo "（一）\$hats 白名单追加：\n";
foreach ($exts as $e)
   foreach ($e["blocks"] as $b)
      if ($b["type"] === "HAT")
         echo '       "' . $e["id"] . "_" . $b["opcode"] . '"=>1,' . "\t\t\t\t//" . $e["id"] . "：" . str_replace("\n", " ", $b["text"]) . "\r\n";

echo "\n（二）convertCode 的 case 代码（插到 s2c 的“未定义”default 之前）：\n";
foreach ($exts as $e)
{
   echo "\r\n         /**************************" . $e["id"] . "**************************/\r\n";
   foreach ($e["blocks"] as $b) echo genS2cCase($b, $e["id"]) . "\r\n";
}

echo "\n（三）菜单影子积木空 case（防游离菜单积木输出垃圾代码）：\n";
foreach ($exts as $e)
{
   if (count($e["menus"]) === 0) continue;
   echo "         //" . $e["id"] . "\r\n";
   foreach ($e["menus"] as $menuName => $info)
      echo '         case "' . $e["id"] . '_menu_' . $menuName . '":' . "\r\n";
   echo "            break;\r\n";
}

echo "\n（四）所需辅助方法（目标 s2c.class.php 中若无，请先添加到类中）：\n";
echo <<<EOT
   //读取下拉菜单影子积木的选中值。菜单影子积木只有一个字段（字段名即菜单名），取第一个字段的值即可。
   function getMenuShadowValue(\$Block,\$strARGNAME)
   {
      \$shadowID=\$Block->{"inputs"}->{\$strARGNAME}->{"block"};
      if(\$shadowID!=NULL && isset(\$this->Blocks->{\$shadowID}))
      {
         foreach(\$this->Blocks->{\$shadowID}->{"fields"} as \$field)
            return \$field->{"value"};
      }
      return "";
   }

   //转换下拉菜单类参数。输入未被占用时（block==shadow），输出带双引号的选中值；被其它积木占用时，按普通积木转换。
   function convertMenuInput(\$Block,\$strARGNAME)
   {
      if(\$Block->{"inputs"}->{\$strARGNAME}->{"block"}==\$Block->{"inputs"}->{\$strARGNAME}->{"shadow"})
         \$this->codeInC[\$this->currentType][]= '"'.\$this->getMenuShadowValue(\$Block,\$strARGNAME).'"';
      else
         \$this->codeInC[\$this->currentType][]= \$this->convertCode(\$Block->{"inputs"}->{\$strARGNAME}->{"block"});
   }

EOT;

/**********************************************************************
   输出 2：c2s.class.php 追加代码
***********************************************************************/
echo "\n======================================== c2s.class.php 追加代码 ========================================\n";
echo "（一）\$arrArgumentConfig 追加：\n";
foreach ($exts as $e)
{
   echo "\r\n       //" . $e["id"] . "\r\n";
   foreach ($e["blocks"] as $b)
   {
      $inputs = array();
      foreach ($b["args"] as $a) $inputs[] = genInputConfig($a, $e["id"], $e["menus"]);
      echo '       "' . $e["id"] . "_" . $b["opcode"] . '"';
      echo "\t\t\t\t=>\t";
      if (count($inputs) === 0)
         echo 'Array("fields"=>Array(),"inputs"=>Array()),';
      else
         echo 'Array("fields"=>Array(),"inputs"=>Array(' . implode(",", $inputs) . ')),';
      echo "\t\t\t\t//" . str_replace("\n", " ", $b["text"]) . "\r\n";
   }
}

echo "\n（二）菜单影子opcode条目（防未知opcode警告）：\n";
foreach ($exts as $e)
   foreach ($e["menus"] as $menuName => $info)
      echo '       "' . $e["id"] . '_menu_' . $menuName . '"	=>	Array("fields"=>Array(),"inputs"=>Array()),' . "\r\n";

echo "\n（三）\$arrCalcFunctionToActuralOpcode 追加（REPORTER类）：\n";
foreach ($exts as $e)
   foreach ($e["blocks"] as $b)
      if ($b["type"] === "REPORTER")
         echo "       '" . $e["id"] . "_" . $b["opcode"] . "'\t\t\t\t=> Array('" . $e["id"] . "_" . $b["opcode"] . "',\t\t1),\t\t//" . str_replace("\n", " ", $b["text"]) . "\r\n";

echo "\n（四）\$isHATS 追加（HAT类）：\n";
foreach ($exts as $e)
   foreach ($e["blocks"] as $b)
      if ($b["type"] === "HAT")
         echo '       "' . $e["id"] . "_" . $b["opcode"] . '"=>0,' . "\r\n";

echo "\n（五）parseSpecialBlocks 的 HAT积木case列表追加：\n";
foreach ($exts as $e)
   foreach ($e["blocks"] as $b)
      if ($b["type"] === "HAT")
         echo '             case "' . $e["id"] . "_" . $b["opcode"] . '":' . "\t\t\t\t\t//" . str_replace("\n", " ", $b["text"]) . "\r\n";
echo "   注意：带inputs参数的HAT积木，还需把其opcode加入 c2s 中 strValue1 特判行：\r\n";
echo "         if(\$opcode==\"videoSensing_whenMotionGreaterThan\" || \$opcode==\"带参HAT的opcode\")\r\n";

echo "\n（六）parseGeneralBlocks 大case列表追加（COMMAND与REPORTER）：\n";
foreach ($exts as $e)
   foreach ($e["blocks"] as $b)
      if ($b["type"] !== "HAT")
         echo '         case "' . $e["id"] . "_" . $b["opcode"] . '":' . "\t\t\t//" . str_replace("\n", " ", $b["text"]) . "（" . $e["id"] . "）\r\n";

/**********************************************************************
   输出 3：preprocessing.inc.php 追加
***********************************************************************/
echo "\n======================================== preprocessing.inc.php 追加 ========================================\n";
echo "（\$_called_func 白名单追加，REPORTER类）：\n";
foreach ($exts as $e)
{
   $ops = array();
   foreach ($e["blocks"] as $b) if ($b["type"] === "REPORTER") $ops[] = "'" . $e["id"] . "_" . $b["opcode"] . "'";
   if (count($ops) > 0) echo "         //" . $e["id"] . "\r\n         " . implode(",", $ops) . ",\r\n";
}

/**********************************************************************
   输出 4：demo（示例类C代码 + Scratch JSON）
***********************************************************************/
if ($demo)
{
   echo "\n======================================== 示例：类C代码 ↔ Scratch JSON ========================================\n";
   foreach ($exts as $e)
   {
      echo "\n##### " . $e["id"] . " #####\n";
      foreach ($e["blocks"] as $b)
      {
         list($c, $j) = genDemo($b, $e["id"], $e["menus"]);
         echo "  " . str_replace("\n", " ", $b["text"]) . "\n";
         echo "    类C：" . $c . "\n";
         echo "    Scratch JSON：\n    " . str_replace("\n", "\n    ", $j) . "\n\n";
      }
   }
}

echo "\n完成。\n";
