<?php
/**
 * 一次性迁移：把“文件名数字 + 计数器 + serialize 索引 + .dat 状态”迁到 JSON manifest。
 *
 *   config.inc.php                ($gui_files 计数器)        ┐
 *   data/index_gui.inc.php        (GUI 模块备注)             ├→ data/manifest_gui.json
 *   data/scratch_gui_modified.dat (待缩减模块号)              │   {version,maxModule,remarks,pending,ready}
 *   data/scratch_gui_ready.dat    ("OK"=就绪)                ┘
 *   data/index_projects.inc.php   (Projects 模块备注/×标记)  ─→ data/manifest_projects.json
 *
 * 用法（在项目根目录）：  php migrate_to_json.php           首次迁移
 *                        php migrate_to_json.php --force    已有 manifest 时强制重迁（覆盖）
 *
 * 流程：读取旧文件 → 备份到 data/backup/<时间戳>_json_migration/ → 写 JSON → 回读逐条校验
 *       → 校验全部通过后才把旧文件从原位移入备份目录（停用）。
 * 校验不通过则保留旧文件不动（manifest 可能已写入，可用 --force 重迁）。
 */

$root = __DIR__;
$force = in_array('--force', $argv ?: array(), true);

$guiJson  = $root . '/data/manifest_gui.json';
$prjJson  = $root . '/data/manifest_projects.json';

if ((file_exists($guiJson) || file_exists($prjJson)) && !$force) {
    echo "manifest JSON 已存在；如确需重新迁移请加 --force（会以旧文件为准覆盖现有 manifest）。\n";
    exit(1);
}

/* ---- 读取旧数据源 ---- */
$cfgText = @file_get_contents($root . '/config.inc.php');
if ($cfgText === false) { echo "✗ 找不到 config.inc.php（可能已迁移过）。\n"; exit(1); }
if (!preg_match('/\$gui_files\s*=\s*(\d+)/', $cfgText, $cm)) { echo "✗ config.inc.php 中未找到 $gui_files。\n"; exit(1); }
$maxModule = (int)$cm[1];

$guiIdxRaw = @file_get_contents($root . '/data/index_gui.inc.php');
if ($guiIdxRaw === false) { echo "✗ 找不到 data/index_gui.inc.php。\n"; exit(1); }
$guiIdx = unserialize($guiIdxRaw);
if (!is_array($guiIdx)) { echo "✗ data/index_gui.inc.php 反序列化失败。\n"; exit(1); }

$prjIdxRaw = @file_get_contents($root . '/data/index_projects.inc.php');
if ($prjIdxRaw === false) { echo "✗ 找不到 data/index_projects.inc.php。\n"; exit(1); }
$prjIdx = unserialize($prjIdxRaw);
if (!is_array($prjIdx)) { echo "✗ data/index_projects.inc.php 反序列化失败。\n"; exit(1); }
ksort($prjIdx, SORT_NUMERIC);   // 旧文件本身按数字升序插入，此处再显式排序一次

$modRaw = (string)@file_get_contents($root . '/data/scratch_gui_modified.dat');
$pending = array();
foreach (array_filter(array_map('trim', explode("\n", $modRaw)) ?: array()) as $ln) {
    if (preg_match('/^\d+$/', $ln)) $pending[] = (int)$ln;
}
$pending = array_values(array_unique($pending));
sort($pending);

$readyRaw = (string)@file_get_contents($root . '/data/scratch_gui_ready.dat');
$ready = ($readyRaw === 'OK');

/* ---- 组装 manifest ---- */
$guiRemarks = array();
foreach ($guiIdx as $k => $v) $guiRemarks[(int)$k] = (string)$v;
$prjModules = array();
foreach ($prjIdx as $k => $v) $prjModules[] = array('n' => (int)$k, 'remark' => (string)$v);

$mGui = array(
    'version' => 1,
    'maxModule' => $maxModule,
    'remarks' => $guiRemarks,
    'pending' => $pending,
    'ready' => $ready,
);
$mPrj = array(
    'version' => 1,
    'modules' => $prjModules,
);

/* ---- 备份旧文件 ---- */
$bdir = $root . '/data/backup/' . date('Ymd-His') . '_json_migration';
if (!@mkdir($bdir, 0777, true)) { echo "✗ 无法创建备份目录：$bdir\n"; exit(1); }
$oldFiles = array(
    $root . '/config.inc.php',
    $root . '/data/index_gui.inc.php',
    $root . '/data/index_projects.inc.php',
    $root . '/data/scratch_gui_modified.dat',
    $root . '/data/scratch_gui_ready.dat',
);
foreach ($oldFiles as $f) if (file_exists($f)) @copy($f, $bdir . '/' . basename($f));

/* ---- 写 JSON ---- */
include_once $root . '/manifest_lib.php';
if (!mf_gui_write($mGui)) { echo "✗ 写入 manifest_gui.json 失败。\n"; exit(1); }
if (!mf_prj_write($mPrj)) { echo "✗ 写入 manifest_projects.json 失败。\n"; exit(1); }

/* ---- 回读校验（逐条比对，任何不符即失败） ---- */
$errs = array();
$g2 = mf_gui_read();
$p2 = mf_prj_read();
if ($g2 === false || $g2 === null) $errs[] = 'manifest_gui.json 回读失败。';
if ($p2 === false || $p2 === null) $errs[] = 'manifest_projects.json 回读失败。';
if (is_array($g2)) {
    if ((int)$g2['maxModule'] !== $maxModule) $errs[] = 'maxModule 与 $gui_files 不符。';
    if (count($g2['remarks']) !== count($guiIdx)) $errs[] = 'GUI 备注条数不符。';
    foreach ($guiIdx as $k => $v) {
        if (!isset($g2['remarks'][(int)$k]) || $g2['remarks'][(int)$k] !== (string)$v) {
            $errs[] = "GUI 备注不符：模块 $k"; break;
        }
    }
    if ($g2['pending'] !== $pending) $errs[] = 'pending 与 scratch_gui_modified.dat 不符。';
    if ($g2['ready'] !== $ready) $errs[] = 'ready 与 scratch_gui_ready.dat 不符。';
}
if (is_array($p2)) {
    if (count($p2['modules']) !== count($prjIdx)) $errs[] = 'Projects 条数不符。';
    $i = 0;
    foreach ($prjIdx as $k => $v) {
        $mo = $p2['modules'][$i];
        if ((int)$mo['n'] !== (int)$k || (string)$mo['remark'] !== (string)$v) {
            $errs[] = "Projects 条目不符：模块 $k"; break;
        }
        $i++;
    }
}

if (count($errs)) {
    echo "✗ 校验失败，保留旧文件不迁移（manifest 已写入，修复后可用 --force 重迁）：\n  " . implode("\n  ", $errs) . "\n";
    exit(1);
}

/* ---- 校验通过：旧文件移入备份目录（停用） ---- */
foreach ($oldFiles as $f) if (file_exists($f)) @unlink($f);

echo "OK  迁移完成\n";
echo "  data/manifest_gui.json      maxModule=$maxModule, remarks=" . count($guiRemarks) . " 条, pending=" . count($pending) . " 个, ready=" . ($ready ? 'true' : 'false') . "\n";
echo "  data/manifest_projects.json modules=" . count($prjModules) . " 条（n " . $prjModules[0]['n'] . "~" . $prjModules[count($prjModules) - 1]['n'] . "，允许不连续）\n";
echo "  旧文件已备份并停用：data/backup/" . basename($bdir) . "/\n";
echo "  （config.inc.php、index_gui.inc.php、index_projects.inc.php、scratch_gui_modified.dat、scratch_gui_ready.dat）\n";
