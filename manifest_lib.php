<?php
/**
 * manifest 读写助手：GUI / Projects 模块索引 JSON 化后的统一数据源。
 *
 *   data/manifest_gui.json      {"version":1,"maxModule":N,"remarks":{N:"备注",...},
 *                                 "pending":[模块号...],"ready":true|false}
 *     · maxModule 取代 config.inc.php 的 $gui_files 计数器（scratch_gui 编号 0..maxModule 稠密，不允许空缺）
 *     · remarks   取代 data/index_gui.inc.php 的模块备注（稀疏映射，键为模块号整数）
 *     · pending   取代 data/scratch_gui_modified.dat 的待缩减模块号列表
 *     · ready     取代 data/scratch_gui_ready.dat（true = GUI 已生成且与数据一致）
 *
 *   data/manifest_projects.json {"version":1,"modules":[{"n":6,"remark":"./~/...|×"},...]}
 *     · modules 按 n 升序；./data/projects 允许编号不连续（生成程序可屏蔽模块）
 *     · 备注格式原样保留（"路径|×√备注"，×=生成时排除），build_projects 的 × 判定不受影响
 *
 * 读取失败（文件缺失→null / 损坏→false）由调用方报错处理，绝不静默当作空数据重写。
 * 写入使用 临时文件 + rename 原子替换，避免写坏。
 *
 * 路径基准：$GLOBALS['MF_ROOT']（供 add_extension.php 的 APP_ROOT 沙箱/重定向机制使用），
 * 未设置时取本文件所在目录（即项目根目录）。
 */

if (defined('MANIFEST_LIB_ONLY')) return;

function mf_root() {
    return isset($GLOBALS['MF_ROOT']) ? $GLOBALS['MF_ROOT'] : dirname(__FILE__);
}

function mf_gui_file() { return mf_root() . '/data/manifest_gui.json'; }
function mf_prj_file() { return mf_root() . '/data/manifest_projects.json'; }

function mf_read_json_file($path) {
    $raw = @file_get_contents($path);
    if ($raw === false) return null;             // 文件不存在
    $m = json_decode($raw, true);
    return is_array($m) ? $m : false;             // false = 内容损坏
}

function mf_gui_read() {
    $m = mf_read_json_file(mf_gui_file());
    if ($m === null || $m === false) return $m;
    if (!isset($m['maxModule'])) return false;    // 缺关键字段视同损坏
    if (!isset($m['remarks']) || !is_array($m['remarks'])) $m['remarks'] = array();
    if (!isset($m['pending']) || !is_array($m['pending'])) $m['pending'] = array();
    if (!isset($m['ready'])) $m['ready'] = false;
    return $m;
}

function mf_prj_read() {
    $m = mf_read_json_file(mf_prj_file());
    if ($m === null || $m === false) return $m;
    if (!isset($m['modules']) || !is_array($m['modules'])) return false;
    return $m;
}

function mf_write_json_file($path, $m) {
    $json = json_encode($m, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    if ($json === false) return false;
    $tmp = $path . '.tmp';
    if (@file_put_contents($tmp, $json) === false) return false;
    if (file_exists($path)) @unlink($path);      // Windows 下 rename 不覆盖已存在目标
    return @rename($tmp, $path);
}

function mf_gui_write($m) { return mf_write_json_file(mf_gui_file(), $m); }
function mf_prj_write($m) { return mf_write_json_file(mf_prj_file(), $m); }

/* ---- 合并待缩减列表（去重 + 升序）并清就绪标记，返回合并后的完整 pending ---- */
function mf_gui_pending_merge($m, $addNums) {
    $nums = array();
    foreach (($m['pending'] ?: array()) as $v) $nums[] = (int)$v;
    foreach ((array)$addNums as $v) $nums[] = (int)$v;
    $nums = array_values(array_unique($nums));
    sort($nums);
    $m['pending'] = $nums;
    $m['ready'] = false;
    return $m;
}
