<?php
set_time_limit(0);
/**
 * 缩减程序：把本次修改过的模块（manifest_gui.json 的 pending 列表）从 scratch_gui/ 复制到 scratch_gui2/，
 * 复制时剥除全部注释（块注释与行注释，含文件头模块号注释），使最终生成的 557 模块与发布 bundle 更小。
 *
 * 剥注释器为流式状态机，直接作用于存储形态（单行、字面 \n、转义引号）：
 *  · 按存储转义逐字解码为“源码语义字符”做状态判定，原始字节原样保留输出（注释除外）；
 *  · 注释判定优先于正则判定（/* 与 // 不可能是合法正则的开头）；
 *  · 正确处理 单引号/双引号/模板字符串、字符串内转义、正则字面量（含字符类 [..]）；
 *  · 行注释保留其结尾换行（字面 \n），跨行块注释保留一个换行，避免破坏 ASI 语义；
 *  · 遇到结构异常（未闭合字符串/注释、疑似误判的正则跨行）时放弃剥注释，原样返回，绝不损坏文件。
 */

function js_next_eff($s, $len, $i) {
    // 解码存储形态的下一个有效字符：\n→换行 \t→制表 \r→回车 \\→\ \"→" 其它 \X→X
    if ($i >= $len) return array('', $len);
    $c = $s[$i];
    if ($c === '\\') {
        if ($i + 1 >= $len) return array($c, $i + 1);
        $n = $s[$i + 1];
        if ($n === 'n') return array("\n", $i + 2);
        if ($n === 't') return array("\t", $i + 2);
        if ($n === 'r') return array("\r", $i + 2);
        return array($n, $i + 2);
    }
    return array($c, $i + 1);
}

function js_strip_comments($s) {
    $len = strlen($s);
    $out = '';
    $segStart = 0;        // 当前保留片段起点（存储字节下标）；-1 表示正处于注释中
    $state = 'code';      // code|sq|dq|tpl|line|block|regex|rxclass
    $rxAllowed = true;    // 代码态：下一个独立 / 是否按正则字面量处理
    $word = '';           // 关键字缓冲
    $blockNl = false;     // 块注释内是否出现过换行
    $done = false;
    $i = 0;
    $kw = array('return'=>1,'case'=>1,'typeof'=>1,'instanceof'=>1,'in'=>1,'of'=>1,'new'=>1,'delete'=>1,'void'=>1,'throw'=>1,'else'=>1,'do'=>1,'yield'=>1,'await'=>1);
    while ($i <= $len) {
        list($eff, $ni) = js_next_eff($s, $len, $i);
        if ($state === 'line') {
            if ($eff === '') { $done = true; break; }                // 行注释到文件尾：直接丢弃
            if ($eff === "\n") { $out .= "\\n"; $segStart = $ni; $state = 'code'; $rxAllowed = true; $word = ''; }
            $i = $ni;
            continue;
        }
        if ($state === 'block') {
            if ($eff === '') return $s;                              // 未闭合块注释：放弃
            if ($eff === '*') {
                list($eff2, $ni2) = js_next_eff($s, $len, $ni);
                if ($eff2 === '') return $s;
                if ($eff2 === '/') {
                    if ($blockNl) $out .= "\\n";
                    $segStart = $ni2; $state = 'code'; $rxAllowed = true; $word = '';
                    $i = $ni2;
                    continue;
                }
                if ($eff2 === "\n") $blockNl = true;
                $i = $ni;                                            // 只消费这一个星号；**/ 时下一个字符重解码后即可正确闭合
                continue;
            }
            if ($eff === "\n") $blockNl = true;
            $i = $ni;
            continue;
        }
        if ($state === 'sq' || $state === 'dq' || $state === 'tpl') {
            if ($eff === '') return $s;                              // 未闭合字符串：放弃
            if ($eff === '\\') { list($e2, $ni2) = js_next_eff($s, $len, $ni); if ($ni2 >= $len) return $s; $i = $ni2; continue; }
            if (($state === 'sq' && $eff === "'") || ($state === 'dq' && $eff === '"') || ($state === 'tpl' && $eff === '`')) {
                $state = 'code'; $rxAllowed = false; $word = '';
            }
            $i = $ni;
            continue;
        }
        if ($state === 'regex' || $state === 'rxclass') {
            if ($eff === '' || $eff === "\n") return $s;             // 正则跨行：判定失误，放弃
            if ($eff === '\\') { list($e2, $ni2) = js_next_eff($s, $len, $ni); if ($ni2 >= $len) return $s; $i = $ni2; continue; }
            if ($state === 'regex') {
                if ($eff === '[') $state = 'rxclass';
                elseif ($eff === '/') { $state = 'code'; $rxAllowed = false; $word = ''; }
            } else {
                if ($eff === ']') $state = 'regex';
            }
            $i = $ni;
            continue;
        }
        // ---------- code 态 ----------
        if ($eff === '') { $done = true; break; }
        if ($eff === '/') {
            list($eff2, $ni2) = js_next_eff($s, $len, $ni);
            if ($eff2 === '/') { $out .= substr($s, $segStart, $i - $segStart); $segStart = -1; $state = 'line'; $i = $ni; continue; }
            if ($eff2 === '*') { $out .= substr($s, $segStart, $i - $segStart); $segStart = -1; $state = 'block'; $blockNl = false; $i = $ni; continue; }
            if ($rxAllowed) { $state = 'regex'; $i = $ni; continue; }
            $rxAllowed = true; $word = '';
            $i = $ni;
            continue;
        }
        if ($eff === "'") { $state = 'sq'; $rxAllowed = false; $word = ''; $i = $ni; continue; }
        if ($eff === '"') { $state = 'dq'; $rxAllowed = false; $word = ''; $i = $ni; continue; }
        if ($eff === '`') { $state = 'tpl'; $rxAllowed = false; $word = ''; $i = $ni; continue; }
        if ($eff === "\n") { if ($word !== '') { if (isset($kw[$word])) $rxAllowed = true; $word = ''; } $rxAllowed = true; $i = $ni; continue; }
        if ($eff === ' ' || $eff === "\t" || $eff === "\r") {
            if ($word !== '') { if (isset($kw[$word])) $rxAllowed = true; $word = ''; }
            $i = $ni; continue;
        }
        if (preg_match('/[A-Za-z0-9_$]/', $eff)) { $word .= $eff; $rxAllowed = false; $i = $ni; continue; }
        if ($word !== '') { if (isset($kw[$word])) $rxAllowed = true; $word = ''; }
        $rxAllowed = (strpos('([{,;=:!&|?+-*%~^', $eff) !== false);
        $i = $ni;
    }
    if (!$done) return $s;
    if ($segStart >= 0 && $segStart <= $len) $out .= substr($s, $segStart);
    return $out;
}

$filename="scratch_gui";

if (defined('SHRINK_LIB_ONLY')) return; // 仅供测试 harness 复用剥注释函数

include_once __DIR__."/manifest_lib.php";
$m = mf_gui_read();
if ($m === false) exit("manifest_gui.json 解析失败。");
if ($m === null) exit("manifest_gui.json 不存在（尚未迁移）。");
$nums = array();
foreach ($m["pending"] as $v) { $v = (int)$v; if ($v > 0) $nums[] = $v; }
$m["pending"] = array();				//先清空待缩减列表（与旧 .dat 行为一致）
if (!mf_gui_write($m)) exit("manifest_gui.json 写入失败（无法清空待缩减列表）。");
if (!count($nums)) exit("暂无要缩减的文件。");

$idArr=$nums;
$idc=count($idArr);

for($i=0;$i<$idc;$i++)
{
   $id=$idArr[$i];
   echo $i."：".$id."\r\n";
   if(file_exists("./data/".$filename."/".$id.".part.js"))
   {
      $str=file_get_contents("./data/".$filename."/".$id.".part.js");
      $stripped=js_strip_comments($str);
      file_put_contents("./data/".$filename."2/".$id.".part.js",$stripped);
   }
   else
   {
      file_put_contents("./data/".$filename."2/".$id.".part.js",',\n');
   }
}

echo "OK";
?>
