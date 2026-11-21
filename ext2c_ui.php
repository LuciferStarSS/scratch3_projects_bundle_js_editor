<?php
/**********************************************************************

   ext2c_ui.php —— ext2c.php 的 Web 操作台

   位置：m2 根目录（与 ext2c.php 同目录），可从 add_extension.php 顶栏“转换数据生成器”进入。
   产物：editor\ScratchToText\blocks_registry.json 与 codeViewer.html；执行前备份到 editor\data\backup。

   把 ext2c.php 的四种模式里最常用的两种（--registry 重建积木注册表、
   --codeviewer 更新 codeViewer.html 自动填充菜单）做成页面：扫描模块、
   勾选扩展、一键执行、看日志与产物统计。

   设计要点：
     1.不做任何“增量”写入——每次执行都是整体重建，页面默认勾选全部已接入模块，
       漏勾就会让对应扩展从注册表消失，执行后页面会用红字提示“扩展从注册表消失”。
     2.chattingroom 早期是手写特殊实现（s2c 裸 opcode 输出、c2s 非标 fields 配置），
       2026-11-19 已纳入注册表，旧实现已在 s2c/c2s 中整块注释备查；页面不再对它做任何特殊处理。

   作者：TeleAgent，2026-11-19

**********************************************************************/

error_reporting(E_ERROR | E_PARSE);
mb_internal_encoding("UTF-8");

$M2DIR = __DIR__;												// E:\HTDOCS\class\m2（本页与 ext2c.php 同在 m2 根目录）
$EDITOR = dirname($M2DIR) . DIRECTORY_SEPARATOR . "editor";		// E:\HTDOCS\class\editor
$STT = $EDITOR . DIRECTORY_SEPARATOR . "ScratchToText";			// 产物目录：blocks_registry.json / codeViewer.html
$EX2C = $M2DIR . DIRECTORY_SEPARATOR . "ext2c.php";
$M2GUI = $M2DIR . DIRECTORY_SEPARATOR . "data" . DIRECTORY_SEPARATOR . "scratch_gui";
$BACKUP_ROOT = $EDITOR . DIRECTORY_SEPARATOR . "data" . DIRECTORY_SEPARATOR . "backup";
$REG_FILE = $STT . DIRECTORY_SEPARATOR . "blocks_registry.json";
$CV_FILE = $STT . DIRECTORY_SEPARATOR . "codeViewer.html";
$CONF_FILE = $M2DIR . DIRECTORY_SEPARATOR . "ext2c_ui.conf.json";
$CACHE_FILE = $M2DIR . DIRECTORY_SEPARATOR . "ext2c_ui_cache.json";
$LOCK_FILE = $M2DIR . DIRECTORY_SEPARATOR . ".ext2c_ui.lock";
$SCAN_FLOOR = 1400;												//只对 >= 此号的模块做 stat/解析（自建扩展从 1484 起），更低的只计数不读

/**********************************************************************
   通用工具
***********************************************************************/
function jsonOut($arr)
{
   header("Content-Type: application/json; charset=utf-8");
   header("Cache-Control: no-store");
   echo json_encode($arr, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
   exit;
}

function readConf()
{
   global $CONF_FILE;
   $c = array();
   if (is_file($CONF_FILE))
   {
      $j = json_decode(@file_get_contents($CONF_FILE), true);
      if (is_array($j)) $c = $j;
   }
   return $c;
}

//注意：open_basedir=E:/HTDOCS，is_file() 判断 D 盘的 php.exe 会永远为 false，
//所以这里按 SAPI 与约定顺序取，不靠 is_file 探测；是否真能执行由 phpOk 实测。
function findPhpBin()
{
   $c = readConf();
   if (!empty($c["php"])) return $c["php"];					//页面里手工保存的路径优先
   if (defined("PHP_BINARY") && PHP_BINARY && preg_match("/php\.exe$/i", PHP_BINARY)) return PHP_BINARY;
   return "D:\\networks\\php8\\php.exe";
}

//实测 PHP 能否执行（只认退出码 0）。失败时调用方显示红标，允许手工改路径。
function phpRunnable($phpBin)
{
   if (!$phpBin) return false;
   $p = @proc_open(array($phpBin, "-r", "echo 1;"), array(1 => array("pipe", "w"), 2 => array("pipe", "w")), $pipes);
   if (!is_resource($p)) return false;
   $out = stream_get_contents($pipes[1]);
   stream_get_contents($pipes[2]);
   fclose($pipes[1]);
   fclose($pipes[2]);
   return proc_close($p) === 0 && trim($out) === "1";
}

//取扩展 id：自建模块是 return { id: 'IRREMOTER', ... } 的字面写法；
//内置扩展写的是 id: Scratch3MicroBitBlocks.EXTENSION_ID 这种间接常量，据此区分。
//另注意 .part.js 里的换行是字面 "\n" 文本，正则不能依赖真实换行。
function extractExtId($src)
{
   $gi = strpos($src, "getInfo");
   if ($gi === false) return null;
   $body = substr($src, $gi);
   $p = strpos($body, "return");
   if ($p !== false) $body = substr($body, $p);
   if (!preg_match("/\bid:\s*(.)/u", $body, $m)) return null;
   if ($m[1] !== "'") return null;							//非字面 id → 内置扩展
   if (preg_match("/\bid:\s*'([^']+)'/u", $body, $mm)) return $mm[1];
   return null;
}

//简易读取：扩展是否模块、id、显示名、积木数、菜单数。读前 512KB 足够覆盖 getInfo。
function inspectModule($path, $num)
{
   $rec = array("module" => false, "id" => "", "name" => "", "blocks" => 0, "menus" => 0, "num" => $num, "size" => @filesize($path));
   $src = @file_get_contents($path, false, null, 0, 524288);
   if ($src === false) return $rec;
   $gi = strpos($src, "getInfo");
   if ($gi === false || strpos($src, "blocks:") === false) return $rec;

   $body = substr($src, $gi);
   $id = extractExtId($src);
   if ($id === null)
   {
      //非自建模块（内置扩展）：尽力给出可读标识，供“高级”列表显示
      if (preg_match("/\bid:\s*'([^']+)'/u", $body, $m)) $rec["id"] = $m[1];
      else if (preg_match("/\bkey:\s*\"EXTENSION_ID\"[\s\S]{0,400}?return\s*'([^']+)'/u", $body, $m)) $rec["id"] = $m[1];
      return $rec;
   }

   $rec["id"] = $id;
   $rec["name"] = $id;
   $bi = strpos($body, "blocks:");
   $headSrc = ($bi !== false) ? substr($body, 0, $bi) : substr($body, 0, 2000);
   if (preg_match("/\bname\s*:\s*formatMessage\(\{[\s\S]*?default:\s*'((?:[^'\\\\]|\\\\.)*)'/u", $headSrc, $m)) $rec["name"] = $m[1];
   else if (preg_match("/\bname\s*:\s*'([^']+)'/u", $headSrc, $m)) $rec["name"] = $m[1];

   $mi = strpos($body, "menus:");
   $blocksSrc = ($mi !== false && $mi > $bi) ? substr($body, $bi, $mi - $bi) : substr($body, $bi);
   $blocksSrc = preg_replace("/\/\*[\s\S]*?\*\//u", "", $blocksSrc);
   $rec["blocks"] = preg_match_all("/\bopcode:\s*'([^']+)'/u", $blocksSrc, $tmp);
   if ($mi !== false)
   {
      $menusSrc = substr($body, $mi, 20000);
      $rec["menus"] = preg_match_all("/\bacceptReporters\s*:/u", $menusSrc, $tmp2);
   }
   $rec["module"] = true;
   return $rec;
}

//扫描全部 .part.js：readdir 取文件名（比 glob 快两个数量级），只对自建模块号段做 stat，
//其余内置文件仅作参考列表，不读不改。首次约 300ms，命中缓存后约 100ms。
function scanModules($force)
{
   global $M2GUI, $CACHE_FILE, $SCAN_FLOOR;
   $cache = array();
   if (!$force && is_file($CACHE_FILE))
   {
      $j = json_decode(@file_get_contents($CACHE_FILE), true);
      if (is_array($j)) $cache = $j;
   }
   $mods = array();
   $otherCount = 0;
   $newCache = array();

   $names = array();
   $dh = @opendir($M2GUI);
   if ($dh !== false)
   {
      while (($f = readdir($dh)) !== false)
         if (preg_match("/^(\d+)\.part\.js$/", $f, $mm)) $names[] = array($f, intval($mm[1]));
      closedir($dh);
   }
   usort($names, function ($a, $b) { return $a[1] - $b[1]; });

   foreach ($names as $it)
   {
      $base = $it[0];
      $num = $it[1];
      if ($num < $SCAN_FLOOR)							//低于自建号段不 stat，仅沿用缓存里的参考信息
      {
         if (isset($cache[$base])) $newCache[$base] = $cache[$base];
         $otherCount++;
         continue;
      }
      $path = $M2GUI . DIRECTORY_SEPARATOR . $base;
      $st = @stat($path);
      $size = $st ? $st["size"] : 0;
      $mt = $st ? $st["mtime"] : 0;
      if (!$force && isset($cache[$base]) && isset($cache[$base]["s"]) && $cache[$base]["s"] === $size && $cache[$base]["m"] === $mt)
         $rec = $cache[$base];
      else
      {
         $rec = inspectModule($path, $num);
         $rec["s"] = $size;
         $rec["m"] = $mt;
      }
      $newCache[$base] = $rec;
      $row = array("file" => $base, "num" => $num, "id" => $rec["id"], "name" => $rec["name"],
         "blocks" => $rec["blocks"], "menus" => $rec["menus"], "size" => $rec["size"]);
      if (!empty($rec["module"])) $mods[] = $row;
      else $otherCount++;
   }
   @file_put_contents($CACHE_FILE, json_encode($newCache, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES));
   return array($mods, $otherCount);
}

/**********************************************************************
   产物状态：注册表 / 补全菜单
***********************************************************************/
function registryInfo($file)
{
   $info = array("exists" => false, "size" => 0, "mtime" => 0, "generated" => "", "extensions" => array(),
      "nExt" => 0, "nBlocks" => 0, "nMenus" => 0, "opcodes" => array());
   if (!is_file($file)) return $info;
   $src = @file_get_contents($file);
   $j = json_decode($src, true);
   $info["exists"] = true;
   $info["size"] = strlen($src);
   $info["mtime"] = @filemtime($file);
   if (!is_array($j) || !isset($j["extensions"]))
   {
      $info["broken"] = true;
      return $info;
   }
   $info["generated"] = isset($j["_meta"]["generated"]) ? $j["_meta"]["generated"] : "";
   $info["sources"] = isset($j["_meta"]["sources"]) ? $j["_meta"]["sources"] : array();
   foreach ($j["extensions"] as $id => $e)
   {
      $nb = isset($e["blocks"]) ? count($e["blocks"]) : 0;
      $nm = isset($e["menus"]) ? count($e["menus"]) : 0;
      $kinds = array("hat" => 0, "command" => 0, "reporter" => 0);
      if (isset($e["blocks"]))
         foreach ($e["blocks"] as $op => $b)
         {
            $info["opcodes"][] = $op;
            if (isset($kinds[$b["kind"]])) $kinds[$b["kind"]]++;
         }
      if (isset($e["menus"]))
         foreach ($e["menus"] as $mn => $mi)
            if (isset($mi["opcode"])) $info["opcodes"][] = $mi["opcode"];
      $info["extensions"][] = array("id" => $id, "blocks" => $nb, "menus" => $nm, "kinds" => $kinds);
      $info["nExt"]++;
      $info["nBlocks"] += $nb;
      $info["nMenus"] += $nm;
   }
   return $info;
}

function cvInfo($file)
{
   $info = array("exists" => false, "entries" => 0, "categories" => array(), "anchorStart" => 0, "anchorEnd" => 0, "size" => 0, "mtime" => 0);
   if (!is_file($file)) return $info;
   $src = @file_get_contents($file);
   $info["exists"] = true;
   $info["size"] = strlen($src);
   $info["mtime"] = @filemtime($file);
   $info["anchorStart"] = substr_count($src, "//===== 自建扩展菜单：");
   $info["anchorEnd"] = substr_count($src, "//===== 自建扩展菜单结束 =====");
   $p1 = strpos($src, "//===== 自建扩展菜单：");
   $p2 = strpos($src, "//===== 自建扩展菜单结束 =====");
   if ($p1 !== false && $p2 !== false && $p2 > $p1)
   {
      $sec = substr($src, $p1, $p2 - $p1);
      $cats = array();
      preg_match_all("/^\s*\"([^\"\r\n]+?)\|/mu", $sec, $m);
      foreach ($m[1] as $lab)
      {
         $pos = strpos($lab, "->");
         $cat = ($pos !== false) ? substr($lab, 0, $pos) : $lab;
         if (!isset($cats[$cat])) $cats[$cat] = 0;
         $cats[$cat]++;
         $info["entries"]++;
      }
      $info["categories"] = $cats;
   }
   return $info;
}

function diffRegistry($old, $new)
{
   $o = array_flip($old["opcodes"]);
   $n = array_flip($new["opcodes"]);
   $added = array(); $removed = array();
   foreach ($n as $op => $x) if (!isset($o[$op])) $added[] = $op;
   foreach ($o as $op => $x) if (!isset($n[$op])) $removed[] = $op;
   $oExt = array(); foreach ($old["extensions"] as $e) $oExt[$e["id"]] = true;
   $nExt = array(); foreach ($new["extensions"] as $e) $nExt[$e["id"]] = true;
   $extGone = array(); $extNew = array();
   foreach ($oExt as $id => $x) if (!isset($nExt[$id])) $extGone[] = $id;
   foreach ($nExt as $id => $x) if (!isset($oExt[$id])) $extNew[] = $id;
   return array("added" => $added, "removed" => $removed, "extGone" => $extGone, "extNew" => $extNew);
}

/**********************************************************************
   调用 ext2c.php（子进程，命令行即页面所见的命令）
***********************************************************************/
function runExt2c($phpBin, $args)
{
   global $EX2C, $M2DIR;
   $cmd = array_merge(array($phpBin, $EX2C), $args);
   $spec = array(1 => array("pipe", "w"), 2 => array("pipe", "w"));
   $t0 = microtime(true);
   $p = @proc_open($cmd, $spec, $pipes, $M2DIR);				//工作目录 = m2，与文档里的 cd 位置一致
   if (!is_resource($p))
      return array("code" => -1, "out" => "", "err" => "无法启动 PHP 子进程（proc_open 失败）", "ms" => 0);
   $out = stream_get_contents($pipes[1]);
   $err = stream_get_contents($pipes[2]);
   fclose($pipes[1]);
   fclose($pipes[2]);
   $code = proc_close($p);
   return array("code" => $code, "out" => $out, "err" => $err, "ms" => intval(round((microtime(true) - $t0) * 1000)));
}

function cmdLine($phpBin, $args)
{
   $parts = array("\"" . $phpBin . "\"", "ext2c.php");
   foreach ($args as $a)
      $parts[] = (strpos($a, " ") !== false) ? "\"" . $a . "\"" : $a;
   return implode(" ", $parts);
}

/**********************************************************************
   接口
***********************************************************************/
$action = isset($_GET["action"]) ? $_GET["action"] : "";
$phpBin = findPhpBin();

if ($action === "scan")
{
   $force = isset($_GET["force"]) && $_GET["force"] === "1";
   list($mods, $otherCount) = scanModules($force);
   $reg = registryInfo($REG_FILE);
   $cv = cvInfo($CV_FILE);
   jsonOut(array(
      "ok" => true,
      "php" => $phpBin,
      "phpOk" => phpRunnable($phpBin),
      "dirs" => array("modules" => $M2GUI, "root" => $M2DIR, "tool" => $EX2C, "registry" => $REG_FILE, "codeviewer" => $CV_FILE, "backup" => $BACKUP_ROOT),
      "modules" => $mods,
      "otherCount" => $otherCount,
      "registry" => $reg,
      "codeviewer" => $cv,
   ));
}

if ($action === "saveconf")
{
   $raw = file_get_contents("php://input");
   $j = json_decode($raw, true);
   $php = (is_array($j) && isset($j["php"])) ? trim($j["php"]) : "";
   if ($php === "") jsonOut(array("ok" => false, "msg" => "PHP 路径不能为空"));
   @file_put_contents($CONF_FILE, json_encode(array("php" => $php), JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES));
   $ok = phpRunnable($php);
   jsonOut(array("ok" => $ok, "php" => $php, "msg" => $ok ? "已保存" : "路径不存在，已保存但可能无法执行"));
}

if ($action === "run")
{
   $raw = file_get_contents("php://input");
   $j = json_decode($raw, true);
   if (!is_array($j)) jsonOut(array("ok" => false, "msg" => "参数错误"));
   if (!is_file($EX2C)) jsonOut(array("ok" => false, "msg" => "找不到 ext2c.php，应在 m2 根目录：" . $EX2C));

   $wantReg = !empty($j["registry"]);
   $wantCv = !empty($j["codeviewer"]);
   $wantBackup = !empty($j["backup"]);
   $sel = (isset($j["files"]) && is_array($j["files"])) ? $j["files"] : array();

   //只接受 scratch_gui 目录下形如 1234.part.js 的真实文件
   $files = array();
   $ids = array();
   foreach ($sel as $b)
   {
      if (!is_string($b) || !preg_match("/^\d+\.part\.js$/", $b)) continue;
      $p = $M2GUI . DIRECTORY_SEPARATOR . $b;
      if (!is_file($p)) continue;
      $files[] = $p;
   }
   if (count($files) === 0) jsonOut(array("ok" => false, "msg" => "未选择任何模块"));

    //识别扩展 id（用于 --only 与产物校验）
   $idMap = array();
   foreach ($files as $p)
   {
      $src = @file_get_contents($p, false, null, 0, 524288);
      if ($src === false) continue;
      $id = extractExtId($src);
      if ($id === null) continue;
      $idMap[$id] = $p;
   }
   if (count($idMap) === 0) jsonOut(array("ok" => false, "msg" => "所选文件里没有可识别的自建扩展"));

   $only = array_keys($idMap);
   sort($only);
   $fileList = array_values($idMap);
   sort($fileList);

   //互斥锁，防止两次执行同时写文件
   $fp = @fopen($LOCK_FILE, "c");
   if ($fp === false) jsonOut(array("ok" => false, "msg" => "无法创建锁文件"));
   if (!flock($fp, LOCK_EX | LOCK_NB))
   {
      fclose($fp);
      jsonOut(array("ok" => false, "msg" => "已有一次执行在进行中，请稍候"));
   }

   $before = registryInfo($REG_FILE);
   $steps = array();
   $backupDir = "";

   if ($wantBackup)
   {
      $backupDir = $BACKUP_ROOT . DIRECTORY_SEPARATOR . date("Ymd-His") . "_ext2c_ui";
      if (!is_dir($backupDir)) @mkdir($backupDir, 0777, true);
      $copied = array();
      if (is_file($REG_FILE) && @copy($REG_FILE, $backupDir . DIRECTORY_SEPARATOR . "blocks_registry.json")) $copied[] = "blocks_registry.json";
      if (is_file($CV_FILE) && @copy($CV_FILE, $backupDir . DIRECTORY_SEPARATOR . "codeViewer.html")) $copied[] = "codeViewer.html";
      $steps[] = array("name" => "备份", "cmd" => "", "code" => 0, "out" => "已备份到 " . $backupDir . (count($copied) ? "（" . implode("、", $copied) . "）" : "（无可备份文件）"), "err" => "", "ms" => 0);
   }

   if ($wantReg)
   {
      $args = array("--registry", "--only=" . implode(",", $only), "-o", $REG_FILE);
      foreach ($fileList as $f) $args[] = $f;
      $r = runExt2c($phpBin, $args);
      $steps[] = array("name" => "重建注册表", "cmd" => cmdLine($phpBin, $args)) + $r;
   }

   if ($wantCv)
   {
      $args = array("--codeviewer", $CV_FILE);
      foreach ($fileList as $f) $args[] = $f;
      $r = runExt2c($phpBin, $args);
      $steps[] = array("name" => "更新补全菜单", "cmd" => cmdLine($phpBin, $args)) + $r;
   }

   flock($fp, LOCK_UN);
   fclose($fp);

   $after = registryInfo($REG_FILE);
   $cv = cvInfo($CV_FILE);
   $diff = ($before["exists"] && $after["exists"]) ? diffRegistry($before, $after) : null;

   $allOk = true;
   foreach ($steps as $s) if ($s["code"] !== 0) $allOk = false;

   //兜底校验：勾选的扩展必须全部出现在注册表里，且原有扩展不能消失
   $warnings = array();
   if ($wantReg && $after["exists"])
   {
      $have = array();
      foreach ($after["extensions"] as $e) $have[$e["id"]] = true;
      foreach ($only as $id) if (!isset($have[$id])) $warnings[] = "扩展 $id 未出现在新注册表中，请检查该模块是否被解析。";
      if ($diff !== null)
      {
         foreach ($diff["extGone"] as $id) $warnings[] = "扩展 $id 从注册表中消失！若是有意移除请忽略，否则说明漏勾了它的 .part.js。";
         if (count($diff["removed"]) > 0) $warnings[] = "有 " . count($diff["removed"]) . " 个 opcode 从注册表移除（详见下方变更对比）。";
      }
   }
   if ($wantCv && ($cv["anchorStart"] !== 1 || $cv["anchorEnd"] !== 1))
      $warnings[] = "codeViewer.html 菜单段标记数量异常（开始 " . $cv["anchorStart"] . " 个、结束 " . $cv["anchorEnd"] . " 个），应为 1/1，请人工核对。";

   jsonOut(array(
      "ok" => $allOk,
      "steps" => $steps,
      "registry" => $after,
      "codeviewer" => $cv,
      "diff" => $diff,
      "backupDir" => $backupDir,
      "warnings" => $warnings,
      "ids" => $only,
   ));
}

if ($action !== "") jsonOut(array("ok" => false, "msg" => "未知操作"));
?>
<!doctype html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>扩展转换数据生成器 · m2</title>
<style>
body{margin:0;font:13px/1.55 "Segoe UI","Microsoft YaHei",sans-serif;color:#1c2b3a;background:#f4f9fe}
.topbar{display:flex;align-items:center;gap:14px;padding:8px 14px;background:#fff;border-bottom:1px solid #dce8f5;position:sticky;top:0;z-index:5;flex-wrap:wrap}
.brand{font-weight:700;font-size:15px;color:#2b7de1}
.brand .sub{font-weight:400;font-size:12px;color:#6b7f95;margin-left:8px}
.badges{display:flex;gap:6px;flex:1;flex-wrap:wrap}
.badge{background:#eaf3fd;border:1px solid #d5e6f8;color:#35618f;border-radius:20px;padding:1px 10px;font-size:12px;white-space:nowrap}
.badge b{color:#1c2b3a}
.badge.warn{background:#fff6e6;border-color:#f3d9a8;color:#8a5a00}
.badge.bad{background:#fdeeee;border-color:#f3c9c9;color:#a4262c}
.acts{display:flex;gap:6px}
.btn{border:1px solid #d5e6f8;background:#fff;color:#35618f;border-radius:8px;padding:5px 14px;font-size:13px;cursor:pointer}
.btn:hover{background:#f2f8ff}
.btn:disabled{opacity:.55;cursor:default}
.btn.primary{background:#2b7de1;border-color:#2b7de1;color:#fff}
.btn.primary:hover{background:#2369c0}
.btn.mini{padding:1px 8px;font-size:12px;border-radius:6px}
main{display:flex;gap:12px;padding:12px;align-items:flex-start}
.col{display:flex;flex-direction:column;gap:10px}
#colL{flex:11;min-width:520px}
#colR{flex:10;min-width:460px;max-width:720px}
.fs{background:#fff;border:1px solid #dce8f5;border-radius:12px;padding:10px 12px}
.fs-t{font-weight:700;color:#2b7de1;font-size:13px;margin-bottom:8px;display:flex;align-items:center;gap:8px;flex-wrap:wrap}
.hintline{font-weight:400;font-size:12px;color:#6b7f95}
.tbl{width:100%;border-collapse:collapse;font-size:12px}
.tbl th{text-align:left;color:#35618f;font-weight:600;border-bottom:1px solid #dce8f5;padding:5px 6px;white-space:nowrap;background:#f8fbfe}
.tbl td{border-bottom:1px solid #edf4fb;padding:4px 6px;vertical-align:middle}
.tbl tr:last-child td{border-bottom:0}
.tbl tbody tr:hover{background:#fbfdff}
.tbl td.num{text-align:right;font-variant-numeric:tabular-nums}
.mono{font-family:Consolas,monospace}
.chip{display:inline-block;border-radius:20px;padding:0 8px;font-size:11px;border:1px solid #d5e6f8;background:#eaf3fd;color:#35618f;white-space:nowrap}
.chip.ok{background:#e9f7ee;border-color:#bfe3cc;color:#1e6b3a}
.chip.new{background:#eef3ff;border-color:#c9d7fb;color:#2b4fa2}
.chip.no{background:#fdeeee;border-color:#f3c9c9;color:#a4262c}
.chip.gray{background:#f2f4f7;border-color:#e2e7ee;color:#6b7f95}
.inp{border:1px solid #d5e6f8;border-radius:7px;padding:5px 8px;font:13px "Segoe UI","Microsoft YaHei",sans-serif;color:#1c2b3a;background:#fff;outline:none;width:100%;box-sizing:border-box}
.inp.mono{font:12px Consolas,monospace}
.inp:focus{border-color:#9cc4f0;box-shadow:0 0 0 2px rgba(43,125,225,.12)}
.opts{display:flex;gap:16px;margin-top:8px;font-size:12px;color:#35618f;flex-wrap:wrap;align-items:center}
.opts label{display:flex;align-items:center;gap:5px;cursor:pointer}
.rowline{display:flex;gap:8px;align-items:center;margin-top:8px}
.rowline .inp{flex:1}
#log{background:#0f2237;color:#cfe3f7;border-radius:10px;padding:10px 12px;margin:0;font:12px/1.6 Consolas,monospace;white-space:pre-wrap;word-break:break-all;max-height:420px;overflow:auto;min-height:150px}
#log .cmd{color:#8fc7ff}
#log .ok{color:#7ee2a8}
#log .err{color:#ff9a9a}
#log .dim{color:#7d93ab}
#log .sep{color:#4a6b8a}
.kpi{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:8px}
.kpi .k{flex:1;min-width:96px;border:1px solid #e4eef8;border-radius:9px;padding:6px 9px;background:#fbfdff}
.kpi .k .v{font-size:16px;font-weight:700;color:#1c2b3a;font-variant-numeric:tabular-nums}
.kpi .k .l{font-size:11px;color:#6b7f95}
.note{font-size:12px;color:#6b7f95}
.warnbox{border:1px solid #f3d9a8;background:#fff8ec;border-radius:9px;padding:7px 10px;font-size:12px;color:#8a5a00;margin-top:8px}
.errbox{border:1px solid #f3c9c9;background:#fdf1f1;border-radius:9px;padding:7px 10px;font-size:12px;color:#a4262c;margin-top:8px}
.okbox{border:1px solid #bfe3cc;background:#f1faf4;border-radius:9px;padding:7px 10px;font-size:12px;color:#1e6b3a;margin-top:8px}
details summary{cursor:pointer;color:#35618f;font-weight:600;font-size:12px}
details ol{margin:6px 0 0 18px;padding:0;font-size:12px;color:#3c556e}
details li{margin:2px 0}
.mut{color:#8ba0b6}
.diffcols{display:flex;gap:10px;flex-wrap:wrap}
.diffcols>div{flex:1;min-width:180px;border:1px solid #edf4fb;border-radius:9px;padding:6px 8px;background:#fbfdff}
.diffcols .h{font-size:11px;color:#6b7f95;margin-bottom:4px}
.difflist{font:11px/1.6 Consolas,monospace;color:#3c556e;max-height:150px;overflow:auto;word-break:break-all}
.empty{color:#8ba0b6;font-size:12px;padding:6px 2px}
@media (max-width:1100px){main{flex-direction:column}#colL,#colR{min-width:0;max-width:none;width:100%}}
</style>
</head>
<body>
<header class="topbar">
  <div class="brand">扩展转换数据生成器<span class="sub">blocks_registry.json / codeViewer 菜单</span></div>
  <div class="badges">
    <span class="badge">模块 <b id="bMods">-</b></span>
    <span class="badge">注册表 <b id="bReg">-</b></span>
    <span class="badge">补全菜单 <b id="bCv">-</b></span>
    <span class="badge" id="bPhp">PHP：检测中…</span>
  </div>
  <div class="acts">
    <button class="btn" id="btnRescan" title="重新读取所有 .part.js（会绕过文件缓存）">重新扫描</button>
    <button class="btn primary" id="btnRun" title="按下方勾选与选项执行">一键执行</button>
  </div>
</header>

<main>
  <section class="col" id="colL">
    <div class="fs">
      <div class="fs-t">① 模块清单
        <span class="hintline">注册表是整体重建，须勾选全部已接入扩展</span>
        <span style="flex:1"></span>
        <button class="btn mini" id="btnAll">全选</button>
        <button class="btn mini" id="btnNone">清空</button>
      </div>
      <table class="tbl">
        <thead><tr>
          <th style="width:34px"><input type="checkbox" id="ckAll" title="全选/全不选（内置模块不可选）"></th>
          <th style="width:74px">文件</th>
          <th>扩展 ID</th>
          <th>显示名</th>
          <th class="num" style="width:52px">积木</th>
          <th class="num" style="width:52px">菜单</th>
          <th style="width:110px">状态</th>
        </tr></thead>
        <tbody id="tbMods"><tr><td colspan="7" class="empty">加载中…</td></tr></tbody>
      </table>
      <div id="othersBox" style="margin-top:6px"></div>
    </div>

    <div class="fs">
      <div class="fs-t">② 执行选项</div>
      <div class="opts">
        <label><input type="checkbox" id="opBackup" checked> 执行前自动备份（data\backup\&lt;时间&gt;_ext2c_ui）</label>
        <label><input type="checkbox" id="opReg" checked> 重建注册表</label>
        <label><input type="checkbox" id="opCv" checked> 更新补全菜单</label>
      </div>
      <div class="rowline">
        <label class="note" style="white-space:nowrap">PHP 可执行文件</label>
        <input class="inp mono" id="inpPhp" autocomplete="off" placeholder="D:\networks\php8\php.exe">
        <button class="btn mini" id="btnSavePhp">保存</button>
      </div>
      <div class="note" style="margin-top:6px">
        工具：<span class="mono" id="pTool">-</span><br>
        输出：<span class="mono" id="pReg">-</span><br>
        输出：<span class="mono" id="pCv">-</span>
      </div>
      <div class="rowline">
        <button class="btn" id="btnRegOnly">仅重建注册表</button>
        <button class="btn" id="btnCvOnly">仅更新补全菜单</button>
        <span class="note" id="selInfo"></span>
      </div>
    </div>

    <div class="fs">
      <div class="fs-t">③ 说明</div>
      <details>
        <summary>三条纪律与新扩展接入流程</summary>
        <ol>
          <li><b>注册表整体重建</b>：必须带上全部现有扩展的 .part.js，漏带哪个哪个就从注册表消失，转换器立刻不认识它。页面已默认勾选全部已接入模块，执行后还会检查“扩展消失”。</li>
          <li><b>注册表优先</b>：注册表的渲染先于手写 case 执行。六模块（含 chattingroom）已全部纳入注册表，旧手写实现在 s2c/c2s 中整块注释备查，不要重新启用。</li>
          <li><b>只有非标准输出需求才手写 case</b>；标准积木（command/reporter/hat + 静态/动态菜单 + 数字/文本/角度参数）全走注册表。</li>
        </ol>
        <ol style="margin-top:8px">
          <li>在 m2 扩展构建器里做好新扩展，得到新的 .part.js。</li>
          <li>本页点「重新扫描」，勾选（默认已勾）新模块，点「一键执行」。</li>
          <li>验证：跑 test_c2s.php / test_s2c.php，再在浏览器做一次双向转换实测。</li>
        </ol>
        <div class="note" style="margin-top:8px">
          本页与生成器本体 ext2c.php 同在 <span class="mono">m2</span> 根目录，调用时以 m2 为工作目录；
          产物写到 <span class="mono">editor\ScratchToText</span>。需要命令行手跑时，等价命令见上方日志（可复制）。
        </div>
      </details>
    </div>
  </section>

  <section class="col" id="colR">
    <div class="fs">
      <div class="fs-t">④ 运行日志 <span class="hintline" id="runState"></span></div>
      <pre id="log"><span class="dim">等待执行…</span></pre>
    </div>

    <div class="fs">
      <div class="fs-t">⑤ 注册表</div>
      <div class="kpi">
        <div class="k"><div class="v" id="kRegExt">-</div><div class="l">扩展</div></div>
        <div class="k"><div class="v" id="kRegBlocks">-</div><div class="l">积木</div></div>
        <div class="k"><div class="v" id="kRegMenus">-</div><div class="l">菜单</div></div>
        <div class="k"><div class="v" id="kRegSize">-</div><div class="l">大小</div></div>
      </div>
      <table class="tbl">
        <thead><tr><th>扩展 ID</th><th class="num">积木</th><th class="num">菜单</th><th>HAT / 命令 / 报告</th></tr></thead>
        <tbody id="tbReg"><tr><td colspan="4" class="empty">-</td></tr></tbody>
      </table>
      <div class="note" id="regMeta" style="margin-top:6px"></div>
      <div id="diffBox"></div>
    </div>

    <div class="fs">
      <div class="fs-t">⑥ 补全菜单（codeViewer.html）</div>
      <div class="kpi">
        <div class="k"><div class="v" id="kCvEntries">-</div><div class="l">条目</div></div>
        <div class="k"><div class="v" id="kCvCats">-</div><div class="l">分类</div></div>
        <div class="k"><div class="v" id="kCvAnchor">-</div><div class="l">段标记</div></div>
      </div>
      <div class="note" id="cvMeta"></div>
    </div>
  </section>
</main>

<script>
(function () {
  "use strict";

  var $ = function (id) { return document.getElementById(id); };
  var state = { modules: [], otherCount: 0, registry: null, codeviewer: null, busy: false };

  function txt(el, s) { el.textContent = s; }
  function kb(n) { return n >= 1024 ? (n / 1024).toFixed(1) + " KB" : n + " B"; }
  function fmtTime(ts) {
    if (!ts) return "-";
    var d = new Date(ts * 1000), p = function (x) { return (x < 10 ? "0" : "") + x; };
    return d.getFullYear() + "-" + p(d.getMonth() + 1) + "-" + p(d.getDate()) + " " + p(d.getHours()) + ":" + p(d.getMinutes());
  }
  function el(tag, cls, s) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (s !== undefined && s !== null) e.textContent = s;
    return e;
  }

  // ---------- 渲染模块表 ----------
  function renderModules() {
    var tb = $("tbMods");
    tb.innerHTML = "";
    if (!state.modules.length) {
      var tr = el("tr");
      var td = el("td", "empty", "未发现自建模块（模块号 ≥ 1484 且 getInfo 返回字面 id）");
      td.colSpan = 7;
      tr.appendChild(td); tb.appendChild(tr);
      return;
    }
    var regIds = {};
    if (state.registry && state.registry.sources) state.registry.sources.forEach(function (x) { regIds[x] = 1; });

    state.modules.forEach(function (m) {
      var tr = el("tr");

      var td0 = el("td");
      var ck = document.createElement("input");
      ck.type = "checkbox"; ck.value = m.file; ck.className = "ckMod";
      ck.checked = true;
      td0.appendChild(ck); tr.appendChild(td0);

      tr.appendChild(el("td", "mono", m.file.replace(".part.js", "")));
      tr.appendChild(el("td", "mono", m.id));
      var tdName = el("td", null, m.name);
      if (m.name === m.id) tdName.className = "mut";
      tr.appendChild(tdName);
      tr.appendChild(el("td", "num", m.blocks));
      tr.appendChild(el("td", "num", m.menus));

      var tdS = el("td");
      if (regIds[m.id]) tdS.appendChild(el("span", "chip ok", "已接入"));
      else tdS.appendChild(el("span", "chip new", "新模块"));
      tr.appendChild(tdS);

      tb.appendChild(tr);
    });
    updateSelInfo();
  }

  // ---------- 内置模块数量提示 ----------
  function renderOtherNote() {
    var box = $("othersBox");
    box.innerHTML = "";
    if (!state.otherCount) return;
    box.appendChild(el("div", "note",
      "另有 " + state.otherCount + " 个非自建 .part.js（内置扩展 / 核心模块），不参与注册表，已跳过。"));
  }

  function selectedFiles() {
    var out = [];
    document.querySelectorAll(".ckMod").forEach(function (c) { if (c.checked && !c.disabled) out.push(c.value); });
    return out;
  }
  function updateSelInfo() {
    var n = selectedFiles().length;
    txt($("selInfo"), "已选 " + n + " 个模块");
    $("bMods").innerHTML = "<b>" + n + "</b> / " + state.modules.length;
  }

  // ---------- 渲染注册表 ----------
  function renderRegistry(info, diff) {
    if (!info || !info.exists) {
      txt($("kRegExt"), "-"); txt($("kRegBlocks"), "-"); txt($("kRegMenus"), "-"); txt($("kRegSize"), "-");
      $("tbReg").innerHTML = '<tr><td colspan="4" class="empty">注册表不存在</td></tr>';
      txt($("regMeta"), ""); 
      if (diff) renderDiff(diff);
      return;
    }
    txt($("kRegExt"), info.nExt);
    txt($("kRegBlocks"), info.nBlocks);
    txt($("kRegMenus"), info.nMenus);
    txt($("kRegSize"), kb(info.size));
    $("bReg").innerHTML = "<b>" + info.nExt + "</b> 扩展 / <b>" + info.nBlocks + "</b> 积木";

    var tb = $("tbReg"); tb.innerHTML = "";
    if (info.broken) {
      tb.innerHTML = '<tr><td colspan="4" class="empty">JSON 解析失败，文件可能损坏</td></tr>';
    } else if (!info.extensions.length) {
      tb.innerHTML = '<tr><td colspan="4" class="empty">注册表为空</td></tr>';
    } else {
      info.extensions.forEach(function (e) {
        var tr = el("tr");
        tr.appendChild(el("td", "mono", e.id));
        tr.appendChild(el("td", "num", e.blocks));
        tr.appendChild(el("td", "num", e.menus));
        tr.appendChild(el("td", "mono", e.kinds.hat + " / " + e.kinds.command + " / " + e.kinds.reporter));
        tb.appendChild(tr);
      });
    }
    txt($("regMeta"), "生成时间 " + (info.generated || "-") + "  ·  写盘 " + fmtTime(info.mtime) + "  ·  " + info.size + " 字节");
    if (diff) renderDiff(diff); else $("diffBox").innerHTML = "";
  }

  function renderDiff(diff) {
    var box = $("diffBox");
    box.innerHTML = "";
    var same = !diff.added.length && !diff.removed.length && !diff.extGone.length && !diff.extNew.length;
    if (same) {
      box.appendChild(el("div", "okbox", "与本次执行前相比没有任何变化（opcode 与扩展完全一致）。"));
      return;
    }
    var cols = el("div", "diffcols");
    cols.style.marginTop = "8px";
    function col(title, arr, cls) {
      var d = el("div");
      d.appendChild(el("div", "h", title + "（" + arr.length + "）"));
      var l = el("div", "difflist");
      l.className = "difflist " + cls;
      l.textContent = arr.length ? arr.join("\n") : "无";
      d.appendChild(l);
      cols.appendChild(d);
    }
    if (diff.extGone.length) {
      var w = el("div", "errbox", "扩展从注册表消失：" + diff.extGone.join("、") + "。若是有意移除请忽略；否则说明漏勾了它的 .part.js，请重新勾选后再执行一次。");
      box.appendChild(w);
    }
    if (diff.extNew.length) box.appendChild(el("div", "okbox", "新加入的扩展：" + diff.extNew.join("、")));
    col("新增 opcode", diff.added, "");
    col("移除 opcode", diff.removed, "err");
    box.appendChild(cols);
  }

  // ---------- 渲染补全菜单 ----------
  function renderCv(info) {
    if (!info || !info.exists) {
      txt($("kCvEntries"), "-"); txt($("kCvCats"), "-"); txt($("kCvAnchor"), "-");
      txt($("cvMeta"), "codeViewer.html 不存在"); return;
    }
    txt($("kCvEntries"), info.entries);
    var cats = Object.keys(info.categories || {});
    txt($("kCvCats"), cats.length);
    var okAnchor = (info.anchorStart === 1 && info.anchorEnd === 1);
    txt($("kCvAnchor"), info.anchorStart + "/" + info.anchorEnd);
    $("kCvAnchor").style.color = okAnchor ? "" : "#a4262c";
    $("bCv").innerHTML = "<b>" + info.entries + "</b> 条 / <b>" + cats.length + "</b> 分类";
    var parts = cats.map(function (c) { return c + " " + info.categories[c]; }).join("、");
    txt($("cvMeta"), "写盘 " + fmtTime(info.mtime) + "  ·  " + info.size + " 字节" + (okAnchor ? "" : "  ·  ⚠ 段标记异常") + (parts ? "\n" + parts : ""));
  }

  // ---------- 日志 ----------
  function logReset() { $("log").innerHTML = ""; }
  function logAdd(text, cls) {
    var s = el("span", cls || "", text);
    $("log").appendChild(s);
    $("log").appendChild(document.createTextNode("\n"));
    $("log").scrollTop = $("log").scrollHeight;
  }

  // ---------- 扫描 ----------
  function applyScan(j) {
    state.modules = j.modules || [];
    state.otherCount = j.otherCount || 0;
    state.registry = j.registry || null;
    state.codeviewer = j.codeviewer || null;
    state.rootHint = j.dirs.root;    $("bPhp").textContent = "PHP：" + j.php;
    $("bPhp").className = "badge" + (j.phpOk ? "" : " bad");
    $("bPhp").title = j.phpOk ? "可执行" : "该路径无法执行，请在「执行选项」里改成实际的 php.exe";
    $("inpPhp").value = j.php;
    txt($("pReg"), j.dirs.registry);
    txt($("pCv"), j.dirs.codeviewer);
    txt($("pTool"), j.dirs.tool);
    renderModules();
    renderOtherNote();
    renderRegistry(state.registry, null);
    renderCv(state.codeviewer);
  }

  function scan(force) {
    if (state.busy) return;
    state.busy = true;
    $("btnRescan").disabled = true;
    var url = "?action=scan" + (force ? "&force=1" : "");
    fetch(url, { cache: "no-store" }).then(function (r) { return r.json(); }).then(function (j) {
      applyScan(j);
      logReset();
      logAdd("扫描完成：" + state.modules.length + " 个自建模块"
        + (state.registry && state.registry.exists ? "，注册表 " + state.registry.nExt + " 扩展 / " + state.registry.nBlocks + " 积木" : "，注册表不存在"), "dim");
      logAdd("勾选模块后点「一键执行」。", "dim");
    }).catch(function (e) {
      logReset();
      logAdd("扫描失败：" + e, "err");
    }).then(function () {
      state.busy = false;
      $("btnRescan").disabled = false;
    });
  }

  // ---------- 执行 ----------
  function run(opt) {
    if (state.busy) return;
    var files = selectedFiles();
    var body = {
      files: files,
      registry: !!(opt && opt.registry !== undefined ? opt.registry : $("opReg").checked),
      codeviewer: !!(opt && opt.codeviewer !== undefined ? opt.codeviewer : $("opCv").checked),
      backup: $("opBackup").checked
    };
    if (!body.registry && !body.codeviewer) { logReset(); logAdd("请至少勾选“重建注册表”或“更新补全菜单”。", "err"); return; }
    if (!files.length) { logReset(); logAdd("未选择任何模块。", "err"); return; }

    state.busy = true;
    $("btnRun").disabled = true;
    $("btnRescan").disabled = true;
    $("btnRegOnly").disabled = true;
    $("btnCvOnly").disabled = true;
    txt($("runState"), "执行中…");
    logReset();
    logAdd("开始执行（" + files.length + " 个模块）", "dim");
    if (state.rootHint) logAdd("工作目录：" + state.rootHint, "dim");

    fetch("?action=run", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    }).then(function (r) { return r.json(); }).then(function (j) {
      if (!j.ok && j.msg) { logAdd(j.msg, "err"); return; }
      (j.steps || []).forEach(function (s) {
        if (s.cmd) logAdd("$ " + s.cmd, "cmd");
        if (s.out) logAdd(s.out.replace(/\s+$/, ""), s.code === 0 ? "" : "err");
        if (s.err) logAdd(s.err.replace(/\s+$/, ""), "err");
        logAdd((s.code === 0 ? "✓ " : "✗ ") + s.name + " 完成（" + s.ms + " ms，退出码 " + s.code + "）", s.code === 0 ? "ok" : "err");
        logAdd("", "sep");
      });
      (j.warnings || []).forEach(function (w) { logAdd("⚠ " + w, "err"); });
      if (j.ok && !(j.warnings || []).length) logAdd("全部完成，无异常。", "ok");

      state.registry = j.registry || state.registry;
      state.codeviewer = j.codeviewer || state.codeviewer;
      if (j.registry && j.registry.sources) {
        j.registry.sources.forEach(function (id) {
          if (!state.modules.some(function (m) { return m.id === id; })) {
            state.modules.push({ file: "?", num: 99999, id: id, name: id, blocks: 0, menus: 0 });
          }
        });
      }
      renderRegistry(state.registry, j.diff);
      renderCv(state.codeviewer);
      if (j.backupDir) {
        var d = el("div", "note", "备份目录：" + j.backupDir);
        d.style.marginTop = "6px";
        $("diffBox").appendChild(d);
      }
      txt($("runState"), j.ok ? "完成" : "有步骤失败");
    }).catch(function (e) {
      logAdd("请求失败：" + e, "err");
      txt($("runState"), "请求失败");
    }).then(function () {
      state.busy = false;
      $("btnRun").disabled = false;
      $("btnRescan").disabled = false;
      $("btnRegOnly").disabled = false;
      $("btnCvOnly").disabled = false;
      document.querySelectorAll(".ckMod").forEach(function (c) { if (!c.disabled) c.checked = true; });
      updateSelInfo();
    });
  }

  // ---------- 事件 ----------
  $("btnRescan").addEventListener("click", function () { scan(true); });
  $("btnRun").addEventListener("click", function () { run(); });
  $("btnRegOnly").addEventListener("click", function () { run({ registry: true, codeviewer: false }); });
  $("btnCvOnly").addEventListener("click", function () { run({ registry: false, codeviewer: true }); });
  $("btnAll").addEventListener("click", function () {
    document.querySelectorAll(".ckMod").forEach(function (c) { if (!c.disabled) c.checked = true; });
    $("ckAll").checked = true; updateSelInfo();
  });
  $("btnNone").addEventListener("click", function () {
    document.querySelectorAll(".ckMod").forEach(function (c) { if (!c.disabled) c.checked = false; });
    $("ckAll").checked = false; updateSelInfo();
  });
  $("ckAll").addEventListener("change", function () {
    var on = $("ckAll").checked;
    document.querySelectorAll(".ckMod").forEach(function (c) { if (!c.disabled) c.checked = on; });
    updateSelInfo();
  });
  document.addEventListener("change", function (e) {
    if (e.target && e.target.classList && e.target.classList.contains("ckMod")) updateSelInfo();
  });

  $("btnSavePhp").addEventListener("click", function () {
    var v = $("inpPhp").value.trim();
    fetch("?action=saveconf", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ php: v }) })
      .then(function (r) { return r.json(); }).then(function (j) {
        $("bPhp").textContent = "PHP：" + j.php;
        $("bPhp").className = "badge" + (j.ok ? "" : " bad");
        $("bPhp").title = j.msg;
        var msg = j.msg;
        logAdd((j.ok ? "" : "⚠ ") + "PHP 路径" + msg + "：" + j.php, j.ok ? "dim" : "err");
      });
  });

  //初次加载
  logReset();
  logAdd("正在扫描模块…", "dim");
  scan(false);
})();
</script>
</body>
</html>