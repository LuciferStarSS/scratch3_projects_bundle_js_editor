<?php
/**
 * Scratch3.0 扩展构建器
 * 可视化添加自定义扩展：自动生成三个 part.js 文件（背景图/积木图标/实现），
 * 并可选更新 954 注册表、121 扩展库、manifest_gui.json（计数器/备注/待缩减/就绪状态）。
 * 使用前请勿改名：依赖 data/scratch_gui/954.part.js、121.part.js、data/manifest_gui.json。
 */

error_reporting(E_ALL & ~E_NOTICE);
ini_set('display_errors', '0');

$APP_ROOT = isset($GLOBALS['APP_ROOT_OVERRIDE']) ? $GLOBALS['APP_ROOT_OVERRIDE'] : __DIR__;
$GLOBALS['MF_ROOT'] = $APP_ROOT;                 // manifest_lib 的数据根（随沙箱/重定向）
include_once __DIR__ . '/manifest_lib.php';

function jout($arr) {
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($arr, JSON_UNESCAPED_UNICODE);
    exit;
}

function read_text($p) { return @file_get_contents($p); }

function decode_data_url($u) {
    $i = strpos((string)$u, 'base64,');
    if ($i === false) return false;
    return base64_decode(substr($u, $i + 7), true);
}

function img_magic_ok($bin, $ext) {
    // 按扩展名校验图片魔数：背景图仍限 PNG；积木图标支持 SVG/PNG/JPEG/GIF
    if ($bin === false || $bin === null || strlen($bin) < 4) return false;
    $ext = strtolower((string)$ext);
    if ($ext === 'png') return substr($bin, 0, 4) === "\x89PNG";
    if ($ext === 'jpg' || $ext === 'jpeg') return substr($bin, 0, 3) === "\xFF\xD8\xFF";
    if ($ext === 'gif') return substr($bin, 0, 3) === 'GIF';
    if ($ext === 'svg') return strpos(substr($bin, 0, 4096), '<svg') !== false;
    return false;
}

function img_mime($ext) {
    $ext = strtolower((string)$ext);
    if ($ext === 'png') return 'image/png';
    if ($ext === 'jpg' || $ext === 'jpeg') return 'image/jpeg';
    if ($ext === 'gif') return 'image/gif';
    return 'image/svg+xml';
}

function img_ext_ok($ext) {
    return in_array(strtolower((string)$ext), array('svg', 'png', 'jpg', 'jpeg', 'gif'), true);
}

function make_backup_dir($label) {
    // 备份目录：秒级时间戳 + 标签；同一秒内多次操作时追加随机后缀重试
    global $APP_ROOT;
    $root = $APP_ROOT . '/data/backup';
    $dir = $root . '/' . date('Ymd-His') . '_' . $label;
    if (@mkdir($dir, 0777, true)) return $dir;
    $dir = $root . '/' . date('Ymd-His') . '_' . substr(bin2hex(random_bytes(4)), 0, 6) . '_' . $label;
    if (@mkdir($dir, 0777, true)) return $dir;
    return false;
}

function sq_storage($v) {
    // 单引号存储形态：扩展文件统一使用单引号，无需转义双引号
    $s = str_replace(array('\\', "'"), array('\\\\', "\\'"), (string)$v);
    return "'" . $s . "'";
}

/* ---------------- 备用库（屏蔽/恢复）辅助 ---------------- */

function parse_registry($reg) {
    // 解析 954 builtinExtensions → [{id, fn, num}]（兼容条目内带 // 注释的情况）
    $p = strpos($reg, 'var builtinExtensions = {');
    if ($p === false) return array();
    $e = strpos($reg, '};', $p);
    if ($e === false) return array();
    $seg = substr($reg, $p, $e - $p);
    preg_match_all('/([A-Za-z_][A-Za-z0-9_]*): function ([A-Za-z0-9_$]+)\\(\\) \\{.+?    return __webpack_require__\\((\\d+)\\);\\\\n  \\}/', $seg, $mm);
    $out = array();
    $c = count($mm[1]);
    for ($i = 0; $i < $c; $i++) {
        $out[] = array('id' => $mm[1][$i], 'fn' => $mm[2][$i], 'num' => (int)$mm[3][$i]);
    }
    return $out;
}

function extract_sq_string($s, $i) {
    // 从 $i（开引号后一位）读取单引号字符串内容，返回 array(内容, 结束引号位置)
    $out = '';
    $len = strlen($s);
    while ($i < $len) {
        $c = $s[$i];
        if ($c === '\\') { $out .= ($i + 1 < $len ? $s[$i + 1] : ''); $i += 2; continue; }
        if ($c === "'") return array($out, $i);
        $out .= $c;
        $i++;
    }
    return array($out, $i);
}

function extract_name_from_entry($t) {
    // 从库条目文本提取显示名（兼容单引号与旧的手工 \"...\" 形态）
    return extract_value_after($t, 'name: ');
}

function extract_value_after($t, $key) {
    // 提取 $key 后的字符串值（兼容单引号、旧的手工 \" 形态、以及手工条目的真实双引号形态）
    $p = strpos($t, $key);
    if ($p === false) return '';
    $rest = ltrim(substr($t, $p + strlen($key)));
    if (substr($rest, 0, 1) === "'") {
        $r = extract_sq_string($rest, 1);
        return $r[0];
    }
    if (substr($rest, 0, 1) === '"') {
        $out = ''; $i = 1; $len = strlen($rest);
        while ($i < $len) {
            if ($rest[$i] === '\\' && $i + 1 < $len) { $out .= $rest[$i + 1]; $i += 2; continue; }
            if ($rest[$i] === '"') break;
            $out .= $rest[$i];
            $i++;
        }
        return $out;
    }
    if (substr($rest, 0, 2) === '\"') {
        $end = strpos($rest, '\"', 2);
        if ($end === false) return '';
        $raw = substr($rest, 2, $end - 2);
        return str_replace(array('\\\\', '\"'), array('\\', '"'), $raw);
    }
    return '';
}

function find_121_entry($lib, $extId) {
    // 定位 121 中某扩展的库条目：{...\n}, （含尾部分隔）
    $pe = strpos($lib, "extensionId: '" . $extId . "'");
    if ($pe === false) return null;
    $entryStart = strrpos(substr($lib, 0, $pe), '{\\n  name:');
    if ($entryStart === false) return null;
    $endRel = strpos($lib, '\\n}, ', $pe);
    if ($endRel === false) return null;
    $text = substr($lib, $entryStart, $endRel + 5 - $entryStart);
    return array('start' => $entryStart, 'end' => $endRel + 5, 'text' => $text, 'name' => extract_name_from_entry($text));
}

function find_121_imports($lib, $extId, $pngNum = null, $iconNum = null) {
    // 定位 121 中某扩展的 imports 四行块（含行首换行）：
    // 优先按模块号定位（工具生成/手工命名的条目通用）；无模块号时退回 extId 命名锚点
    $p = false;
    if ($pngNum !== null && $iconNum !== null) {
        $p = strpos($lib, '= __webpack_require__(' . $pngNum . ');');
    }
    if ($p === false) {
        $anchor = '_' . $extId . '_' . $extId . '_png__WEBPACK_IMPORTED_MODULE_';
        $p = strpos($lib, $anchor);
        if ($p === false) return null;
    }
    $start = strrpos(substr($lib, 0, $p), '\n');
    if ($start === false) return null;
    if ($pngNum !== null && $iconNum !== null) {
        $p2 = strpos($lib, '= __webpack_require__(' . $iconNum . ');', $p);
    } else {
        $v2 = '_' . $extId . '_' . $extId . '_small_svg__WEBPACK_IMPORTED_MODULE_';
        $p2 = strpos($lib, $v2, $p);
    }
    if ($p2 === false) return null;
    $semi = strpos($lib, ');', $p2);
    if ($semi === false) return null;
    $semi = strpos($lib, ');', $semi + 2);
    if ($semi === false) return null;
    $end = $semi + 2;
    if (substr($lib, $end, 2) === '\n') $end += 2;
    $text = substr($lib, $start, $end - $start);
    return array('start' => $start, 'end' => $end, 'text' => $text);
}

function extract_asset_name($content) {
    // 从资产模块内容解析图片文件名（兼容单引号与旧的 \" 形态）
    $p = strpos($content, './static/assets/');
    if ($p === false) return '';
    $rest = substr($content, $p + 16);
    $cands = array();
    $e1 = strpos($rest, "'");
    if ($e1 !== false) $cands[] = $e1;
    $e2 = strpos($rest, '\\"');
    if ($e2 !== false) $cands[] = $e2;
    if (!count($cands)) return '';
    return substr($rest, 0, min($cands));
}

function read_manifest() {
    global $APP_ROOT;
    $f = $APP_ROOT . '/data/scratch_gui_standby/manifest.json';
    $raw = @file_get_contents($f);
    if ($raw === false || $raw === '') return array();
    $m = json_decode($raw, true);
    return is_array($m) ? $m : array();
}

function write_manifest($m) {
    global $APP_ROOT;
    $dir = $APP_ROOT . '/data/scratch_gui_standby';
    if (!is_dir($dir)) @mkdir($dir, 0777, true);
    file_put_contents($dir . '/manifest.json', json_encode($m, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));
}

function gui_files_count() {
    $m = mf_gui_read();
    if ($m === false) jout(array('ok' => false, 'errors' => array('data/manifest_gui.json 解析失败。')));
    if ($m === null) jout(array('ok' => false, 'errors' => array('找不到 data/manifest_gui.json（请先运行 migrate_to_json.php 迁移）。')));
    return (int)$m['maxModule'];
}

function compact_after_block($implNum) {
    /* 屏蔽后压缩编号：后续模块文件统一前移 3 位（一个扩展占 3 个模块号），
       954/121/实现文件中的 __webpack_require__ 引用同步，备注与待缩减列表重编，maxModule 递减 */
    global $APP_ROOT;
    $errors = array();
    $guiDir = $APP_ROOT . '/data/scratch_gui';
    $oldG = gui_files_count();
    if ($oldG < $implNum) return $errors; // 计数器低于该扩展档案号（无更高模块可前移），计数维持不变
    // 1) 引用替换：所有 part 文件中 __webpack_require__(M)（implNum < M ≤ oldG）→ M-3（单遍映射无连锁）
    $mapCb = function ($mm) use ($implNum, $oldG) {
        $n = (int)$mm[1];
        if ($n > $implNum && $n <= $oldG) return '__webpack_require__(' . ($n - 3) . ')';
        return $mm[0];
    };
    foreach (glob($guiDir . '/*.part.js') as $f) {
        $c = @file_get_contents($f);
        if ($c === false || $c === '' || strpos($c, '__webpack_require__(') === false) continue;
        $nc = preg_replace_callback('/__webpack_require__\((\d+)\)/', $mapCb, $c);
        if ($nc !== null && $nc !== $c) { if (@file_put_contents($f, $nc) === false) $errors[] = '写入 ' . basename($f) . ' 失败。'; }
    }
    // 2) 文件重命名（升序，目标位必空）+ 头部模块号注释替换
    $renamed = array();
    for ($n = $implNum + 1; $n <= $oldG; $n++) {
        $p = $guiDir . '/' . $n . '.part.js';
        if (!file_exists($p)) continue; // 空位（其他已屏蔽扩展的档案号）跳过
        $c = @file_get_contents($p);
        if ($c === false) { $errors[] = '读取 ' . $n . '.part.js 失败。'; continue; }
        $oldHead = '/* ' . $n . ' */';
        if (strpos($c, $oldHead) === 0) $c = '/* ' . ($n - 3) . ' */' . substr($c, strlen($oldHead));
        if (@file_put_contents($guiDir . '/' . ($n - 3) . '.part.js', $c) === false) { $errors[] = '写入 ' . ($n - 3) . '.part.js 失败。'; continue; }
        @unlink($p);
        $renamed[] = $n - 3;
    }
    // 3)~5) 模块备注键重编 + 待缩减列表重编追加（954/121/全部新号）+ maxModule 递减 + 清就绪（同一次 manifest 写入）
    $mf = mf_gui_read();
    if (!is_array($mf)) return array('manifest_gui.json 读取失败。');
    $nidx = array();
    foreach ($mf['remarks'] as $k => $v) { $k = (int)$k; $nidx[($k > $implNum && $k <= $oldG) ? $k - 3 : $k] = $v; }
    $mf['remarks'] = $nidx;
    $nums = array();
    foreach ($mf['pending'] as $v) {
        $v = (int)$v;
        $nums[] = ($v > $implNum && $v <= $oldG) ? $v - 3 : $v;
    }
    $nums = array_merge($nums, array(954, 121), $renamed);
    $nums = array_values(array_unique($nums));
    sort($nums);
    $mf['pending'] = $nums;
    $mf['ready'] = false;
    $mf['maxModule'] = $oldG - 3;
    if (!mf_gui_write($mf)) $errors[] = '无法写入 manifest_gui.json。';
    return $errors;
}

function unblock_core($extId, $in) {
    /* 解除屏蔽：排到模块号末尾（新号 = maxModule+1..+3），
       954/121/备注/config 重建；payload 提供编辑后的 impl/元数据，缺省用备用库档案 */
    global $APP_ROOT;
    $errors = array();
    $guiDir = $APP_ROOT . '/data/scratch_gui';
    $regPath = $guiDir . '/954.part.js';
    $libPath = $guiDir . '/121.part.js';
    $reg = read_text($regPath);
    $lib = read_text($libPath);
    if ($reg === false || $lib === false) return array('errors' => array('无法读取 954/121 模块文件。'));
    $manifest = read_manifest();
    $mk = -1; $mrow = null;
    foreach ($manifest as $k => $m) if ($m['extId'] === $extId) { $mrow = $m; $mk = $k; break; }
    if ($mrow === null) return array('errors' => array('备用库中不存在该扩展：' . $extId));
    list($pngNum, $iconNum, $implNum) = $mrow['modules'];
    $sbDir = $APP_ROOT . '/data/scratch_gui_standby/' . $extId;
    foreach (array($pngNum, $iconNum, $implNum) as $n) {
        if (!file_exists($sbDir . '/' . $n . '.part.js')) $errors[] = '备用库中缺少 ' . $n . '.part.js。';
    }
    if (strpos($reg, '  ' . $extId . ': function ') !== false) $errors[] = '954 中已存在该扩展，无法解除屏蔽。';
    if (strpos($lib, "extensionId: '" . $extId . "'") !== false) $errors[] = '121 中已存在该扩展，无法解除屏蔽。';
    if (strpos($reg, 'var builtinExtensions = {') === false) $errors[] = '954 中找不到 builtinExtensions 锚点。';
    if (strpos($lib, '\n // TODO: Rename file names to match variable/prop names?') === false) $errors[] = '121 中找不到 imports 插入锚点。';
    if (strpos($lib, '}, {\n  name: \'Makey Makey\'') === false) $errors[] = '121 中找不到条目插入锚点。';
    // 元数据：payload 优先，缺省取备用库档案
    $entryText0 = (string)$mrow['entry121'];
    $name = isset($in['name']) ? trim((string)$in['name']) : extract_value_after($entryText0, 'name: ');
    $desc = isset($in['desc']) ? trim((string)$in['desc']) : extract_value_after($entryText0, 'description: ');
    $collab = isset($in['collab']) ? trim((string)$in['collab']) : extract_value_after($entryText0, 'collaborator: ');
    $net = isset($in['net']) ? !empty($in['net']) : (strpos($entryText0, 'internetConnectionRequired: true') !== false);
    if ($name === '') $errors[] = '显示名称不能为空。';
    if ($desc === '') $errors[] = '描述不能为空。';
    if (strpos($name . $desc . $collab, '"') !== false) $errors[] = '名称/描述/协作者请使用单引号，不要包含双引号。';
    if (strpos($name . $desc . $collab, "\n") !== false || strpos($name . $desc . $collab, "\r") !== false) $errors[] = '名称/描述/协作者不能包含换行。';
    // 实现文件：payload（存储形态、旧号）优先，缺省读备用库文件
    $impl = isset($in['impl']) ? (string)$in['impl'] : (string)@file_get_contents($sbDir . '/' . $implNum . '.part.js');
    if ($impl === '') $errors[] = '实现文件为空。';
    else {
        if (strpos($impl, '/* implementation */\n (function(module, exports, __webpack_require__) {\n') !== 0) $errors[] = '实现文件头部格式不正确（应为 /* implementation */）。';
        if (substr($impl, -5) !== '\n })') $errors[] = '实现文件尾部格式不正确。';
        if (strpos($impl, '__webpack_require__(' . $iconNum . ')') === false) $errors[] = '实现文件未引用图标模块 ' . $iconNum . '。';
        if (strpos($impl, chr(10)) !== false || strpos($impl, chr(13)) !== false) $errors[] = '实现文件内容含真实换行。';
        if (preg_match('/(?<!\\\\)"/', $impl)) $errors[] = '实现代码含未转义双引号。';
    }
    // 图片替换（可选，校验与备用库原文件扩展名匹配）
    $assetsDir = realpath($APP_ROOT . '/../editor/static/assets');
    $replaced = array();
    if (!count($errors) && $assetsDir !== false) {
        foreach (array('png' => $pngNum, 'svg' => $iconNum) as $kind => $srcNum) {
            if (empty($in[$kind]) || empty($in[$kind]['data'])) continue;
            $bin = decode_data_url($in[$kind]['data']);
            $an = extract_asset_name((string)@file_get_contents($sbDir . '/' . $srcNum . '.part.js'));
            $ext = $an !== '' ? strtolower(pathinfo($an, PATHINFO_EXTENSION)) : '';
            if ($bin === false || $ext === '' || !img_magic_ok($bin, $ext)) { $errors[] = ($kind === 'png' ? '背景图' : '图标') . '数据与原文件扩展名（' . $ext . '）不匹配，未替换。'; continue; }
            $replaced[$kind] = $bin;
        }
    }
    if (count($errors)) return array('errors' => $errors);

    $oldG = gui_files_count();
    $newPng = $oldG + 1; $newIcon = $oldG + 2; $newImpl = $oldG + 3;

    /* --- 备份 --- */
    $bdir = make_backup_dir('unblock_' . $extId);
    if ($bdir === false) return array('errors' => array('无法创建备份目录。'));
    foreach (array($sbDir . '/' . $pngNum . '.part.js', $sbDir . '/' . $iconNum . '.part.js', $sbDir . '/' . $implNum . '.part.js', $regPath, $libPath, $APP_ROOT . '/data/manifest_gui.json') as $bf) {
        if (file_exists($bf)) @copy($bf, $bdir . '/' . basename($bf));
    }
    if ($assetsDir !== false) {
        foreach ($replaced as $kind => $bin) {
            $srcNum = ($kind === 'png') ? $pngNum : $iconNum;
            $an = extract_asset_name((string)@file_get_contents($sbDir . '/' . $srcNum . '.part.js'));
            if ($an !== '' && file_exists($sbDir . '/assets/' . $an)) @copy($sbDir . '/assets/' . $an, $bdir . '/' . $an);
        }
    }

    /* --- 图片回迁 + 替换 --- */
    $restoredAssets = array();
    if ($assetsDir !== false && isset($mrow['assets'])) {
        foreach ($mrow['assets'] as $an) {
            if (file_exists($sbDir . '/assets/' . $an) && @rename($sbDir . '/assets/' . $an, $assetsDir . '/' . $an)) $restoredAssets[] = $an;
        }
    }
    if ($assetsDir !== false) {
        foreach ($replaced as $kind => $bin) {
            $srcNum = ($kind === 'png') ? $pngNum : $iconNum;
            $an = extract_asset_name((string)@file_get_contents($sbDir . '/' . $srcNum . '.part.js'));
            if ($an !== '') @file_put_contents($assetsDir . '/' . $an, $bin);
        }
    }

    /* --- 模块文件回迁（换头到新号） --- */
    foreach (array($pngNum => $newPng, $iconNum => $newIcon) as $oldN => $newN) {
        $c = (string)@file_get_contents($sbDir . '/' . $oldN . '.part.js');
        if (strpos($c, '/* asset */') === 0) {
            $c = '/* ' . $newN . ' */' . substr($c, strlen('/* asset */'));
        } else {
            $oldHead = '/* ' . $oldN . ' */'; /* 旧格式兑底：屏蔽前的数字头 */
            if (strpos($c, $oldHead) === 0) $c = '/* ' . $newN . ' */' . substr($c, strlen($oldHead));
        }
        if (@file_put_contents($guiDir . '/' . $newN . '.part.js', $c) === false) return array('errors' => array('写入 ' . $newN . '.part.js 失败。'));
    }
    $implNew = '/* ' . $newImpl . ' */' . substr($impl, strlen('/* implementation */'));
    $implNew = str_replace('__webpack_require__(' . $iconNum . ')', '__webpack_require__(' . $newIcon . ')', $implNew);
    if (@file_put_contents($guiDir . '/' . $newImpl . '.part.js', $implNew) === false) return array('errors' => array('写入 ' . $newImpl . '.part.js 失败。'));

    /* --- 954 重新注册（新实现号） --- */
    $frag = (string)$mrow['registry954'];
    $frag = str_replace('__webpack_require__(' . $implNum . ')', '__webpack_require__(' . $newImpl . ')', $frag);
    $p = strpos($reg, 'var builtinExtensions = {');
    $e = strpos($reg, '};', $p);
    if ($e > 2 && substr($reg, $e - 2, 4) === '\n};') $e -= 2;
    $reg = substr_replace($reg, $frag, $e, 0);
    if (@file_put_contents($regPath, $reg) === false) return array('errors' => array('写入 954 失败。'));

    /* --- 121 重新注册（imports 新号；var 模块号占用则重编；条目按当前元数据重建） --- */
    $importsText = (string)$mrow['imports121'];
    $impMods = isset($mrow['importModules']) && count($mrow['importModules']) === 2 ? array_map('intval', $mrow['importModules']) : array();
    if (!count($impMods)) {
        if (preg_match('/png__WEBPACK_IMPORTED_MODULE_(\d+)___default\.a/', $entryText0, $pm)) $impMods[0] = (int)$pm[1];
        if (preg_match('/small_svg__WEBPACK_IMPORTED_MODULE_(\d+)___default\.a/', $entryText0, $pm)) $impMods[1] = (int)$pm[1];
    }
    if (!isset($impMods[0]) || !isset($impMods[1]) || !$impMods[0] || !$impMods[1]) return array('errors' => array('备用库档案缺少 imports 模块号，无法重建 121 条目。'));
    $M = $impMods[0]; $M1 = $impMods[1]; $renumbered = '';
    preg_match_all('/WEBPACK_IMPORTED_MODULE_(\d+)__/', $lib, $mm);
    $maxMod = 0;
    foreach ($mm[1] as $v) if ((int)$v > $maxMod) $maxMod = (int)$v;
    if ($maxMod >= min($impMods)) {
        $M = $maxMod + 1; $M1 = $maxMod + 2;
        $map = array('_MODULE_' . $impMods[0] . '__' => '_MODULE_' . $M . '__', '_MODULE_' . $impMods[1] . '__' => '_MODULE_' . $M1 . '__');
        $importsText = str_replace(array_keys($map), array_values($map), $importsText);
        $renumbered = '121 imports 模块号已重编为 ' . $M . '/' . $M1 . '（原号已被占用）';
    }
    $importsText = str_replace(array('__webpack_require__(' . $pngNum . ')', '__webpack_require__(' . $iconNum . ')'),
        array('__webpack_require__(' . $newPng . ')', '__webpack_require__(' . $newIcon . ')'), $importsText);
    $p1 = strpos($lib, '\n // TODO: Rename file names to match variable/prop names?');
    if ($p1 === false) return array('errors' => array('121 中找不到 imports 插入锚点。'));
    $lib = substr_replace($lib, $importsText, $p1, 0);
    $v1 = '_' . $extId . '_' . $extId . '_png__WEBPACK_IMPORTED_MODULE_' . $M . '__';
    $v2 = '_' . $extId . '_' . $extId . '_small_svg__WEBPACK_IMPORTED_MODULE_' . $M1 . '__';
    $newEntry = '{\n'
        . '  name: ' . sq_storage($name) . ',\n'
        . '  extensionId: \'' . $extId . '\',\n'
        . ($collab !== '' ? '  collaborator: ' . sq_storage($collab) . ',\n' : '')
        . '  iconURL: ' . $v1 . '_default.a,\n'
        . '  insetIconURL: ' . $v2 . '_default.a,\n'
        . '  description: ' . sq_storage($desc) . ',\n'
        . '  featured: true,\n'
        . '  internetConnectionRequired: ' . ($net ? 'true' : 'false') . ',\n'
        . '}, ';
    if (strpos($newEntry, '"') !== false) return array('errors' => array('条目文本意外包含双引号。'));
    $p2 = strpos($lib, '}, {\n  name: \'Makey Makey\'');
    if ($p2 === false) return array('errors' => array('121 中找不到条目插入锚点。'));
    $lib = substr_replace($lib, $newEntry, $p2 + 3, 0);
    if (@file_put_contents($libPath, $lib) === false) return array('errors' => array('写入 121 失败。'));

    /* --- 清理备用库 --- */
    foreach (array($pngNum, $iconNum, $implNum) as $n) @unlink($sbDir . '/' . $n . '.part.js');
    unset($manifest[$mk]);
    write_manifest(array_values($manifest));
    @rmdir($sbDir . '/assets');
    @rmdir($sbDir);

    /* --- 模块备注（新号，按当前名称）+ maxModule 递增 + 待缩减列表 + 清就绪（同一次 manifest 写入） --- */
    $mf = mf_gui_read();
    if (!is_array($mf)) return array('errors' => array('manifest_gui.json 读取失败。'));
    $mf['remarks'][$newPng] = '|' . $name . '扩展背景图';
    $mf['remarks'][$newIcon] = '|' . $name . '扩展图标';
    $mf['remarks'][$newImpl] = '|' . $name . '扩展定义';
    $mf['maxModule'] = $newImpl;
    $mf = mf_gui_pending_merge($mf, array(954, 121, $newPng, $newIcon, $newImpl));
    if (!mf_gui_write($mf)) return array('errors' => array('无法写入 manifest_gui.json。'));

    $written = array(
        '模块文件已排到末尾（新号 ' . $newPng . '/' . $newIcon . '/' . $newImpl . '，原档案号 ' . $pngNum . '/' . $iconNum . '/' . $implNum . '）',
        '954 注册入口已恢复（新实现号 ' . $newImpl . '）',
        '121 扩展库条目与 imports 已恢复',
        '模块备注已写入（新号）',
        'manifest_gui.json：maxModule → ' . $newImpl,
        '已记入待缩减列表'
    );
    if (count($restoredAssets)) $written[] = '图片已回迁（' . implode(', ', $restoredAssets) . '）';
    if (count($replaced)) $written[] = '图片已按替换内容写入（' . implode(', ', array_keys($replaced)) . '）';
    if ($renumbered !== '') $written[] = $renumbered;
    return array('ok' => true, 'backup' => str_replace($APP_ROOT, '.', $bdir), 'written' => $written, 'newModules' => array($newPng, $newIcon, $newImpl));
}

$action = isset($_GET['action']) ? $_GET['action'] : (isset($_POST['action']) ? $_POST['action'] : '');

/* ---------------- 后端：读取现状 ---------------- */
if ($action === 'info') {
    $cur = gui_files_count();
    $reg = read_text($APP_ROOT . '/data/scratch_gui/954.part.js');
    $lib = read_text($APP_ROOT . '/data/scratch_gui/121.part.js');
    $regIds = array(); $nextMod = 1; $libIds = array();
    if ($reg !== false) {
        $p = strpos($reg, 'var builtinExtensions = {');
        if ($p !== false) {
            $e = strpos($reg, '};', $p);
            if ($e !== false) {
                preg_match_all('/([A-Za-z_][A-Za-z0-9_]*)\s*:\s*function\s/', substr($reg, $p, $e - $p), $m);
                foreach ($m[1] as $k) $regIds[] = $k;
            }
        }
    }
    if ($lib !== false) {
        preg_match_all('/WEBPACK_IMPORTED_MODULE_(\d+)__/', $lib, $mm);
        foreach ($mm[1] as $v) if ((int)$v >= $nextMod) $nextMod = (int)$v + 1;
        preg_match_all('/extensionId\s*:\s*\'([^\']*)\'/', $lib, $me);
        foreach ($me[1] as $k) $libIds[] = $k;
    }
    $manifest = read_manifest();
    $standbyIds = array();
    foreach ($manifest as $mrow) $standbyIds[] = $mrow['extId'];
    $blockable = array();
    if ($reg !== false && $lib !== false) {
        foreach (parse_registry($reg) as $en) {
            if ($en['num'] < 1480 || in_array($en['id'], $standbyIds)) continue;
            $bname = $en['id'];
            $fe = find_121_entry($lib, $en['id']);
            if ($fe !== null && $fe['name'] !== '') $bname = $fe['name'];
            $blockable[] = array('extId' => $en['id'], 'implNum' => $en['num'], 'name' => $bname);
        }
    }
    jout(array(
        'ok' => true,
        'gui_files' => $cur,
        'registryIds' => $regIds,
        'libraryIds' => $libIds,
        'nextModule' => $nextMod,
        'blockable' => $blockable,
        'standby' => $manifest,
        'assetsDirOk' => is_dir($APP_ROOT . '/../editor/static/assets')
    ));
}

/* ---------------- 后端：保存 ---------------- */
if ($action === 'save') {
    $raw = file_get_contents('php://input');
    if ($raw === '' || $raw === false) {
        $raw = isset($GLOBALS['SAVE_PAYLOAD']) ? $GLOBALS['SAVE_PAYLOAD'] : '';
    }
    $in = json_decode($raw, true);
    $errors = array();
    if (!is_array($in)) { $errors[] = '请求体不是合法 JSON。'; jout(array('ok' => false, 'errors' => $errors)); }

    $cur = gui_files_count();
    $base = isset($in['baseNum']) ? (int)$in['baseNum'] : 0;
    $pngNum = $base; $iconNum = $base + 1; $implNum = $base + 2;
    $extId = isset($in['extId']) ? trim((string)$in['extId']) : '';
    $name  = isset($in['name']) ? trim((string)$in['name']) : '';
    $desc  = isset($in['desc']) ? trim((string)$in['desc']) : '';
    $collab = isset($in['collab']) ? trim((string)$in['collab']) : '';
    $net = !empty($in['net']);
    $opts = isset($in['opts']) && is_array($in['opts']) ? $in['opts'] : array();
    $doReg954 = !empty($opts['reg954']);
    $doReg121 = !empty($opts['reg121']);
    $doRemark = !empty($opts['remark']);
    $pngName = isset($in['png']['name']) ? trim((string)$in['png']['name']) : '';
    $svgName = isset($in['svg']['name']) ? trim((string)$in['svg']['name']) : '';
    $impl = isset($in['impl']) ? (string)$in['impl'] : '';
    $assetPng = isset($in['assetPng']) ? (string)$in['assetPng'] : '';
    $assetSvg = isset($in['assetSvg']) ? (string)$in['assetSvg'] : '';

    $guiDir = $APP_ROOT . '/data/scratch_gui';
    $regPath = $guiDir . '/954.part.js';
    $libPath = $guiDir . '/121.part.js';

    /* --- 校验 --- */
    if ($base !== $cur + 1) $errors[] = '起始编号与当前 maxModule=' . $cur . ' 不符（应为 ' . ($cur + 1) . '），请刷新页面后重试。';
    if (!preg_match('/^[A-Za-z][A-Za-z0-9_]*$/', $extId)) $errors[] = '扩展ID不合法。';
    if ($name === '') $errors[] = '显示名称不能为空。';
    if ($desc === '') $errors[] = '描述不能为空。';
    if (strpos($name . $desc . $collab, '"') !== false) $errors[] = '名称/描述/协作者请使用单引号，不要包含双引号。';
    if (strpos($name . $desc . $collab, "\n") !== false || strpos($name . $desc . $collab, "\r") !== false) $errors[] = '名称/描述/协作者不能包含换行。';

    $reg = read_text($regPath);
    $lib = read_text($libPath);
    if ($reg === false || $lib === false) {
        $errors[] = '无法读取 954/121 模块文件。';
    } else {
        if (strpos($reg, $extId . ': function') !== false) $errors[] = '954 注册表中已存在扩展ID：' . $extId;
        if (strpos($lib, 'extensionId: \'' . $extId . '\'') !== false) $errors[] = '121 扩展库中已存在扩展ID：' . $extId;
        if ($doReg954) {
            if (strpos($reg, 'var builtinExtensions = {') === false) $errors[] = '954 中找不到 builtinExtensions 锚点。';
        }
        if ($doReg121) {
            if (strpos($lib, '\n // TODO: Rename file names to match variable/prop names?') === false) $errors[] = '121 中找不到 imports 插入锚点（TODO 注释）。';
            if (strpos($lib, '}, {\n  name: \'Makey Makey\'') === false) $errors[] = '121 中找不到条目插入锚点（Makey Makey）。';
        }
    }

    foreach (array($pngNum, $iconNum, $implNum) as $n) {
        if (file_exists($guiDir . '/' . $n . '.part.js')) $errors[] = $n . '.part.js 已存在。';
    }

    /* 三个 part 内容的格式校验（均为单行 + 字面 \n，引号须转义为 \"） */
    foreach (array(
        array($assetPng, $pngNum, $pngName, '背景图模块'),
        array($assetSvg, $iconNum, $svgName, '图标模块'),
    ) as $pair) {
        list($c, $n, $fn, $lbl) = $pair;
        if (strpos($c, '/* ' . $n . ' */\n (function(module, exports) {\nmodule.exports =\'./static/assets/' . $fn . '\';\n })') !== 0) {
            $errors[] = $lbl . '内容与文件名不匹配（' . $n . '.part.js / ' . $fn . '）。';
        }
    }
    if (strpos($impl, '/* ' . $implNum . ' */\n (function(module, exports, __webpack_require__) {\n') !== 0) $errors[] = '实现文件头部格式不正确。';
    if (substr($impl, -5) !== '\n })') $errors[] = '实现文件尾部格式不正确。';
    if (strpos($impl, 'module.exports = Scratch3' . $extId . 'Blocks;') === false) $errors[] = '实现文件缺少 module.exports。';
    if (strpos($impl, '__webpack_require__(' . $iconNum . ')') === false) $errors[] = '实现文件未引用图标模块 ' . $iconNum . '。';
    foreach (array($impl, $assetPng, $assetSvg) as $c) {
        if (strpos($c, chr(10)) !== false || strpos($c, chr(13)) !== false) { $errors[] = '生成的文件内容含真实换行（应为字面 \\n）。'; break; }
    }
    foreach (array($impl, $assetPng, $assetSvg) as $c) {
        if (strpos($c, '"') !== false) { $errors[] = '生成内容包含双引号——扩展文件统一使用单引号，请修正实现代码/积木文本。'; break; }
    }

    /* 图片数据 */
    $pngBin = decode_data_url(isset($in['png']['data']) ? $in['png']['data'] : '');
    $svgBin = decode_data_url(isset($in['svg']['data']) ? $in['svg']['data'] : '');
    if ($pngBin === false || strlen($pngBin) < 8 || substr($pngBin, 0, 4) !== "\x89PNG") $errors[] = '背景图不是有效的 PNG 数据。';
    $svgExt = strtolower(pathinfo($svgName, PATHINFO_EXTENSION));
    if ($svgBin === false || !img_magic_ok($svgBin, $svgExt)) $errors[] = '积木图标数据无效（支持 SVG/PNG/JPG/GIF，需与扩展名匹配）。';
    if (!preg_match('/^[A-Za-z0-9_\-]+\.(png|svg)$/i', $pngName) || substr(strtolower($pngName), -4) !== '.png') $errors[] = '背景图文件名不合法（仅字母数字_-，扩展名 .png）。';
    if (!preg_match('/^[A-Za-z0-9_\-]+\.(svg|png|jpg|jpeg|gif)$/i', $svgName) || !img_ext_ok($svgExt)) $errors[] = '图标文件名不合法（仅字母数字_-，扩展名 svg/png/jpg/jpeg/gif）。';

    $assetsDir = realpath($APP_ROOT . '/../editor/static/assets');
    if ($assetsDir === false) {
        $errors[] = '找不到静态资源目录 ../editor/static/assets。';
    } else {
        if (file_exists($assetsDir . '/' . $pngName)) $errors[] = 'assets 中已存在同名文件：' . $pngName;
        if (file_exists($assetsDir . '/' . $svgName)) $errors[] = 'assets 中已存在同名文件：' . $svgName;
    }

    if (count($errors)) jout(array('ok' => false, 'errors' => $errors));

    /* --- 备份 --- */
    $bdir = make_backup_dir($extId);
    if ($bdir === false) jout(array('ok' => false, 'errors' => array('无法创建备份目录。')));
    $backupFiles = array($regPath, $libPath, $APP_ROOT . '/data/manifest_gui.json');
    foreach ($backupFiles as $bf) {
        if (file_exists($bf)) @copy($bf, $bdir . '/' . basename($bf));
    }

    /* --- 写入图片 --- */
    if (@file_put_contents($assetsDir . '/' . $pngName, $pngBin) === false) jout(array('ok' => false, 'errors' => array('写入背景图失败。')));
    if (@file_put_contents($assetsDir . '/' . $svgName, $svgBin) === false) jout(array('ok' => false, 'errors' => array('写入图标失败。')));

    /* --- 写入三个 part 文件 --- */
    $written = array();
    foreach (array(
        array($assetPng, $pngNum), array($assetSvg, $iconNum), array($impl, $implNum),
    ) as $pair) {
        list($c, $n) = $pair;
        $p = $guiDir . '/' . $n . '.part.js';
        if (@file_put_contents($p, $c) === false) jout(array('ok' => false, 'errors' => array('写入 ' . $n . '.part.js 失败。')));
        $written[] = 'data/scratch_gui/' . $n . '.part.js';
    }

    /* --- 更新 954 注册表 --- */
    $modIds = array($pngNum, $iconNum, $implNum);
    if ($doReg954) {
        $p = strpos($reg, 'var builtinExtensions = {');
        $e = strpos($reg, '};', $p);
        $ins = ',\n  ' . $extId . ': function ' . $extId . '() {\n    return __webpack_require__(' . $implNum . ');\n  }';
        if ($e > 2 && substr($reg, $e - 2, 4) === '\n};') { $e = $e - 2; }
        if (@file_put_contents($regPath, substr_replace($reg, $ins, $e, 0)) === false) jout(array('ok' => false, 'errors' => array('写入 954 失败。')));
        $modIds[] = 954;
        $written[] = 'data/scratch_gui/954.part.js（注册）';
    }

    /* --- 更新 121 扩展库 --- */
    if ($doReg121) {
        preg_match_all('/WEBPACK_IMPORTED_MODULE_(\d+)__/', $lib, $mm);
        $mn = 1;
        foreach ($mm[1] as $v) if ((int)$v >= $mn) $mn = (int)$v + 1;
        $v1 = '_' . $extId . '_' . $extId . '_png__WEBPACK_IMPORTED_MODULE_' . $mn . '__';
        $v2 = '_' . $extId . '_' . $extId . '_small_svg__WEBPACK_IMPORTED_MODULE_' . ($mn + 1) . '__';
        $p1 = strpos($lib, '\n // TODO: Rename file names to match variable/prop names?');
        $insImp = '\n var ' . $v1 . ' = __webpack_require__(' . $pngNum . ');\n'
                . ' var ' . $v1 . '_default = __webpack_require__.n(' . $v1 . ');\n'
                . ' var ' . $v2 . ' = __webpack_require__(' . $iconNum . ');\n'
                . ' var ' . $v2 . '_default = __webpack_require__.n(' . $v2 . ');\n';
        $lib = substr_replace($lib, $insImp, $p1, 0);
        $p2 = strpos($lib, '}, {\n  name: \'Makey Makey\'');
        $entry = '{\n'
               . '  name: ' . sq_storage($name) . ',\n'
               . '  extensionId: \''. $extId . '\',\n'
               . ($collab !== '' ? '  collaborator: ' . sq_storage($collab) . ',\n' : '')
               . '  iconURL: ' . $v1 . '_default.a,\n'
               . '  insetIconURL: ' . $v2 . '_default.a,\n'
               . '  description: ' . sq_storage($desc) . ',\n'
               . '  featured: true,\n'
               . '  internetConnectionRequired: ' . ($net ? 'true' : 'false') . ',\n'
               . '}, ';
        if (strpos($entry, '"') !== false) jout(array('ok' => false, 'errors' => array('扩展库条目意外包含双引号，请检查名称/描述。')));
        $lib = substr_replace($lib, $entry, $p2 + 3, 0);
        if (@file_put_contents($libPath, $lib) === false) jout(array('ok' => false, 'errors' => array('写入 121 失败。')));
        $modIds[] = 121;
        $written[] = 'data/scratch_gui/121.part.js（扩展库）';
    }

    /* --- 更新 manifest：计数器 + 模块备注 + 待缩减列表 + 清就绪（同一次写入，接入“缩减→生成”流程） --- */
    $mf = mf_gui_read();
    if (!is_array($mf)) jout(array('ok' => false, 'errors' => array('manifest_gui.json 读取失败。')));
    $mf['maxModule'] = $implNum;
    if ($doRemark) {
        $mf['remarks'][$pngNum]  = '|' . $name . '扩展背景图';
        $mf['remarks'][$iconNum] = '|' . $name . '扩展图标';
        $mf['remarks'][$implNum] = '|' . $name . '扩展定义';
        $written[] = 'data/manifest_gui.json（备注）';
    }
    $mf = mf_gui_pending_merge($mf, $modIds);
    if (!mf_gui_write($mf)) jout(array('ok' => false, 'errors' => array('无法写入 manifest_gui.json。')));
    $written[] = 'data/manifest_gui.json（maxModule → ' . $implNum . '）';

    jout(array(
        'ok' => true,
        'backup' => str_replace($APP_ROOT, '.', $bdir),
        'written' => $written,
        'gui_files' => $implNum,
        'assets' => array('editor/static/assets/' . $pngName, 'editor/static/assets/' . $svgName)
    ));
}

/* ---------------- 后端：屏蔽到备用库 ---------------- */
if ($action === 'block') {
    @set_time_limit(120);
    $raw = file_get_contents('php://input');
    if ($raw === '' || $raw === false) $raw = isset($GLOBALS['SAVE_PAYLOAD']) ? $GLOBALS['SAVE_PAYLOAD'] : '';
    $in = json_decode($raw, true);
    $errors = array();
    if (!is_array($in)) { $errors[] = '请求体不是合法 JSON。'; jout(array('ok' => false, 'errors' => $errors)); }
    $extId = isset($in['extId']) ? trim((string)$in['extId']) : '';
    if (!preg_match('/^[A-Za-z][A-Za-z0-9_]*$/', $extId)) $errors[] = '扩展ID不合法。';

    $guiDir = $APP_ROOT . '/data/scratch_gui';
    $regPath = $guiDir . '/954.part.js';
    $libPath = $guiDir . '/121.part.js';
    $reg = read_text($regPath);
    $lib = read_text($libPath);
    if ($reg === false || $lib === false) $errors[] = '无法读取 954/121 模块文件。';

    /* --- 定位注册条目 --- */
    $target = null;
    if ($reg !== false) {
        foreach (parse_registry($reg) as $en) {
            if ($en['id'] === $extId) { $target = $en; break; }
        }
        if ($target === null) $errors[] = '在 954 注册表中找不到扩展：' . $extId;
        else if ($target['num'] < 1480) $errors[] = '内置扩展（实现模块号 < 1480）不支持屏蔽，仅限自建扩展。';
    }
    $implNum = $target !== null ? $target['num'] : 0;
    $pngNum = $implNum - 2;
    $iconNum = $implNum - 1;

    /* --- 文件与备用库状态 --- */
    if ($target !== null) {
        foreach (array($pngNum, $iconNum, $implNum) as $n) {
            if (!file_exists($guiDir . '/' . $n . '.part.js')) $errors[] = $n . '.part.js 不存在，无法移入备用库。';
        }
    }
    foreach (read_manifest() as $mrow) {
        if ($mrow['extId'] === $extId) $errors[] = '该扩展已在备用库中。';
    }

    /* --- 定位 954 片段 / 121 imports 与条目 --- */
    $frag954 = '';
    if ($target !== null && $reg !== false) {
        // 实际片段捕获（兼容工具生成与手工条目：函数名可不同、条目内可含注释）
        $re954 = '/,\\\\n  ' . preg_quote($extId, '/') . ': function ' . preg_quote($target['fn'], '/') . '\(\) \{.+?return __webpack_require__\(' . $implNum . '\);\\\\n  \}/';
        if (!preg_match($re954, $reg, $fm954)) $errors[] = '954 中找不到可移除的注册片段（可能被手工修改过）。';
        else $frag954 = $fm954[0];
    }
    $imp = null; $entry = null;
    if ($lib !== false) {
        $imp = find_121_imports($lib, $extId, $pngNum, $iconNum);
        if ($imp === null) $errors[] = '121 中找不到该扩展的 imports 块。';
        $entry = find_121_entry($lib, $extId);
        if ($entry === null) $errors[] = '121 中找不到该扩展的库条目。';
    }

    /* --- 外部引用扫描：确保模块只被 954/121/自身引用 --- */
    if (!count($errors) && $target !== null) {
        $extRefs = array();
        foreach (glob($guiDir . '/*.part.js') as $f) {
            $base = basename($f);
            $c = file_get_contents($f);
            $hit = array();
            if ($base !== '954.part.js' && $base !== $implNum . '.part.js' && strpos($c, '__webpack_require__(' . $implNum . ')') !== false) $hit[] = $implNum;
            if ($base !== '121.part.js' && $base !== $implNum . '.part.js' && strpos($c, '__webpack_require__(' . $iconNum . ')') !== false) $hit[] = $iconNum;
            if ($base !== '121.part.js' && strpos($c, '__webpack_require__(' . $pngNum . ')') !== false) $hit[] = $pngNum;
            if (count($hit)) $extRefs[] = $base . '（引用模块 ' . implode(',', $hit) . '）';
        }
        if (count($extRefs)) $errors[] = '以下文件还引用了该扩展的模块，暂不能屏蔽：' . implode('；', array_slice($extRefs, 0, 5)) . (count($extRefs) > 5 ? ' 等' : '');
    }

    /* --- 解析图片文件名 --- */
    $assetNames = array();
    if (!count($errors) && $target !== null) {
        foreach (array($pngNum, $iconNum) as $n) {
            $an = extract_asset_name(file_get_contents($guiDir . '/' . $n . '.part.js'));
            if ($an === '') { $errors[] = $n . '.part.js 中未找到资产文件名。'; break; }
            $assetNames[] = $an;
        }
    }

    if (count($errors)) jout(array('ok' => false, 'errors' => $errors));

    /* --- 备份 --- */
    $bdir = make_backup_dir('block_' . $extId);
    if ($bdir === false) jout(array('ok' => false, 'errors' => array('无法创建备份目录。')));
    foreach (array($regPath, $libPath, $APP_ROOT . '/data/manifest_gui.json') as $bf) {
        if (file_exists($bf)) @copy($bf, $bdir . '/' . basename($bf));
    }

    /* --- 移动模块文件 --- */
    $sbDir = $APP_ROOT . '/data/scratch_gui_standby/' . $extId;
    if (!@mkdir($sbDir . '/assets', 0777, true)) jout(array('ok' => false, 'errors' => array('无法创建备用库目录。')));
    foreach (array(array($pngNum, 'asset'), array($iconNum, 'asset'), array($implNum, 'implementation')) as $pair) {
        $n = $pair[0];
        if (!@rename($guiDir . '/' . $n . '.part.js', $sbDir . '/' . $n . '.part.js')) jout(array('ok' => false, 'errors' => array('移动 ' . $n . '.part.js 失败。')));
        // 头部注释去数字 ID：备用库文件不再保留正式库编号痕迹
        $c = (string)@file_get_contents($sbDir . '/' . $n . '.part.js');
        $oldHead = '/* ' . $n . ' */';
        if (strpos($c, $oldHead) === 0) {
            if (@file_put_contents($sbDir . '/' . $n . '.part.js', '/* ' . $pair[1] . ' */' . substr($c, strlen($oldHead))) === false) jout(array('ok' => false, 'errors' => array('改写 ' . $n . '.part.js 头部失败。')));
        }
        if (file_exists($guiDir . '2/' . $n . '.part.js')) @unlink($guiDir . '2/' . $n . '.part.js');
    }

    /* --- 移动图片 --- */
    $assetsDir = realpath($APP_ROOT . '/../editor/static/assets');
    $movedAssets = array();
    if ($assetsDir !== false) {
        foreach ($assetNames as $an) {
            if (file_exists($assetsDir . '/' . $an) && @rename($assetsDir . '/' . $an, $sbDir . '/assets/' . $an)) $movedAssets[] = $an;
        }
    }

    /* --- 移除 954 注册 --- */
    $reg = substr_replace($reg, '', strpos($reg, $frag954), strlen($frag954));
    if (@file_put_contents($regPath, $reg) === false) jout(array('ok' => false, 'errors' => array('写入 954 失败。')));

    /* --- 移除 121 条目与 imports（条目位置靠后，先移除不影响 imports 定位，仍重新定位保平安） --- */
    $lib = substr_replace($lib, '', $entry['start'], strlen($entry['text']));
    $imp2 = find_121_imports($lib, $extId, $pngNum, $iconNum);
    if ($imp2 !== null) $lib = substr_replace($lib, '', $imp2['start'], strlen($imp2['text']));
    if (@file_put_contents($libPath, $lib) === false) jout(array('ok' => false, 'errors' => array('写入 121 失败。')));

    /* --- 移除模块备注（归档进备用库档案，其余键稍后由 compact 重编） --- */
    $remarks = array();
    $mf = mf_gui_read();
    if (is_array($mf)) {
        foreach (array($pngNum, $iconNum, $implNum) as $n) {
            if (isset($mf['remarks'][(int)$n])) { $remarks[$n] = $mf['remarks'][(int)$n]; unset($mf['remarks'][(int)$n]); }
        }
        if (!mf_gui_write($mf)) jout(array('ok' => false, 'errors' => array('写入 manifest_gui.json 失败。')));
    }

    /* --- 记入备用库档案 --- */
    preg_match_all('/WEBPACK_IMPORTED_MODULE_(\d+)__/', $imp['text'], $imn);
    $impMods = array_values(array_unique(array_map('intval', $imn[1])));
    $manifest = read_manifest();
    $manifest[] = array(
        'extId' => $extId,
        'name' => ($entry !== null && $entry['name'] !== '') ? $entry['name'] : $extId,
        'blockedAt' => date('Y-m-d H:i'),
        'modules' => array($pngNum, $iconNum, $implNum),
        'importModules' => $impMods,
        'assets' => $assetNames,
        'movedAssets' => $movedAssets,
        'registry954' => $frag954,
        'imports121' => $imp['text'],
        'entry121' => $entry['text'],
        'remarks' => $remarks
    );
    write_manifest($manifest);

    /* --- 压缩编号：后续模块文件前移 3 位，引用同步，config 递减 --- */
    $compactErrors = compact_after_block($implNum);
    if (count($compactErrors)) jout(array('ok' => false, 'errors' => array_merge(array('屏蔽已完成，但压缩编号出错（可从备份恢复）：'), $compactErrors)));

    $written = array(
        '954 注册入口已移除',
        '121 扩展库条目与 imports 已移除',
        '模块备注已移除',
        '模块文件 → data/scratch_gui_standby/' . $extId . '/',
        '后续模块文件已前移压缩（编号 -3，引用同步）',
        'manifest_gui.json：maxModule → ' . gui_files_count(),
        '已记入待缩减列表（含 954/121/全部新号）'
    );
    if (count($movedAssets)) $written[] = '图片 → 备用库 assets/（' . implode(', ', $movedAssets) . '）';

    jout(array(
        'ok' => true,
        'backup' => str_replace($APP_ROOT, '.', $bdir),
        'standbyDir' => 'data/scratch_gui_standby/' . $extId,
        'written' => $written
    ));
}

/* ---------------- 后端：从备用库解除屏蔽（排到末尾） ---------------- */
if ($action === 'restore' || $action === 'unblock') {
    $raw = file_get_contents('php://input');
    if ($raw === '' || $raw === false) $raw = isset($GLOBALS['SAVE_PAYLOAD']) ? $GLOBALS['SAVE_PAYLOAD'] : '';
    $in = json_decode($raw, true);
    if (!is_array($in)) { jout(array('ok' => false, 'errors' => array('请求体不是合法 JSON。'))); }
    $extId = isset($in['extId']) ? trim((string)$in['extId']) : '';
    // restore（备用库一键恢复，无 payload）直接用备用库档案；unblock（编辑后解除屏蔽）携带编辑内容
    $res = unblock_core($extId, $in);
    if (!empty($res['errors'])) jout(array('ok' => false, 'errors' => $res['errors']));
    jout(array(
        'ok' => true,
        'backup' => $res['backup'],
        'standbyDir' => 'data/scratch_gui_standby/' . $extId,
        'written' => $res['written'],
        'newModules' => $res['newModules']
    ));
}

/* ---------------- 后端：载入已有扩展（编辑） ---------------- */
if ($action === 'load') {
    $extId = isset($_GET['extId']) ? trim((string)$_GET['extId']) : '';
    if (!preg_match('/^[A-Za-z][A-Za-z0-9_]*$/', $extId)) jout(array('ok' => false, 'errors' => array('扩展ID不合法。')));
    $guiDir = $APP_ROOT . '/data/scratch_gui';
    $reg = read_text($guiDir . '/954.part.js');
    $lib = read_text($guiDir . '/121.part.js');
    if ($reg === false || $lib === false) jout(array('ok' => false, 'errors' => array('无法读取 954/121 模块文件。')));
    $target = null;
    foreach (parse_registry($reg) as $en) if ($en['id'] === $extId) { $target = $en; break; }
    if ($target === null) {
        /* --- 备用库（已屏蔽）扩展：从 standby 与档案载入 --- */
        $mrow = null;
        foreach (read_manifest() as $m) if ($m['extId'] === $extId) { $mrow = $m; break; }
        if ($mrow === null) jout(array('ok' => false, 'errors' => array('在 954 注册表与备用库中都找不到扩展：' . $extId)));
        list($pngNum, $iconNum, $implNum) = $mrow['modules'];
        $sbDir = $APP_ROOT . '/data/scratch_gui_standby/' . $extId;
        foreach (array($pngNum, $iconNum, $implNum) as $n) {
            if (!file_exists($sbDir . '/' . $n . '.part.js')) jout(array('ok' => false, 'errors' => array($n . '.part.js 不存在（备用库）。')));
        }
        $srcRaw = file_get_contents($sbDir . '/' . $implNum . '.part.js');
        $src = preg_replace_callback('/\\\\(.)/', function($m) { $c = $m[1]; if ($c === 'n') return "\n"; if ($c === 't') return "\t"; if ($c === 'r') return "\r"; return $c; }, $srcRaw);
        $assets = array();
        foreach (array(array($pngNum, 'png'), array($iconNum, 'svg')) as $pair) {
            $name = extract_asset_name(file_get_contents($sbDir . '/' . $pair[0] . '.part.js'));
            $data = '';
            if ($name !== '' && file_exists($sbDir . '/assets/' . $name)) {
                $mime = img_mime(pathinfo($name, PATHINFO_EXTENSION));
                $data = 'data:' . $mime . ';base64,' . base64_encode(file_get_contents($sbDir . '/assets/' . $name));
            }
            $assets[$pair[1]] = array('name' => $name, 'data' => $data);
        }
        $entryText = (string)$mrow['entry121'];
        $eName = extract_value_after($entryText, 'name: ');
        $eDesc = extract_value_after($entryText, 'description: ');
        $eCollab = extract_value_after($entryText, 'collaborator: ');
        $eNet = strpos($entryText, 'internetConnectionRequired: true') !== false;
        $eM = 0; $eM1 = 0;
        if (preg_match('/png__WEBPACK_IMPORTED_MODULE_(\d+)___default\.a/', $entryText, $pm)) $eM = (int)$pm[1];
        if (preg_match('/small_svg__WEBPACK_IMPORTED_MODULE_(\d+)___default\.a/', $entryText, $pm)) $eM1 = (int)$pm[1];
        $fn = '';
        if (preg_match('/function\s+([A-Za-z0-9_$]+)\s*\(\)/', (string)$mrow['registry954'], $fm)) $fn = $fm[1];
        $globals = '';
        $g1 = strpos($src, 'var blockIconURI = __webpack_require__(');
        $g2 = strpos($src, 'var Scratch3');
        if ($g1 !== false && $g2 !== false && $g2 > $g1) {
            $lineEnd = strpos($src, "\n", $g1);
            if ($lineEnd !== false && $lineEnd < $g2) $globals = trim(substr($src, $lineEnd + 1, $g2 - $lineEnd - 1));
        }
        $remarks = isset($mrow['remarks']) ? $mrow['remarks'] : array();
        jout(array(
            'ok' => true,
            'blocked' => true,
            'extId' => $extId,
            'fn' => $fn,
            'pngNum' => $pngNum,
            'iconNum' => $iconNum,
            'implNum' => $implNum,
            'source' => $src,
            'globals' => $globals,
            'assets' => $assets,
            'entry' => array('name' => $eName, 'desc' => $eDesc, 'collab' => $eCollab, 'net' => $eNet, 'm' => $eM, 'm1' => $eM1),
            'remarks' => $remarks,
            'assetPngRaw' => (string)@file_get_contents($sbDir . '/' . $pngNum . '.part.js'),
            'assetSvgRaw' => (string)@file_get_contents($sbDir . '/' . $iconNum . '.part.js'),
            'reg954Frag' => (string)$mrow['registry954'],
            'entry121Raw' => $entryText,
            'cfgText' => (string)read_text($APP_ROOT . '/data/manifest_gui.json')
        ));
    }
    if ($target['num'] < 1480) jout(array('ok' => false, 'errors' => array('内置扩展不支持在线编辑。')));
    $implNum = $target['num'];
    $pngNum = $implNum - 2;
    $iconNum = $implNum - 1;
    foreach (array($pngNum, $iconNum, $implNum) as $n) {
        if (!file_exists($guiDir . '/' . $n . '.part.js')) jout(array('ok' => false, 'errors' => array($n . '.part.js 不存在。')));
    }
    // 解码实现源码（字面 \n → 真换行、\" → "、\\ → \，得到可直接阅读/编辑的 JS）
    $srcRaw = file_get_contents($guiDir . '/' . $implNum . '.part.js');
    $src = preg_replace_callback('/\\\\(.)/', function($m) { $c = $m[1]; if ($c === 'n') return "\n"; if ($c === 't') return "\t"; if ($c === 'r') return "\r"; return $c; }, $srcRaw);
    // 资产文件名与预览数据
    $assetsDir = realpath($APP_ROOT . '/../editor/static/assets');
    $assets = array();
    foreach (array(array($pngNum, 'png'), array($iconNum, 'svg')) as $pair) {
        $name = extract_asset_name(file_get_contents($guiDir . '/' . $pair[0] . '.part.js'));
        $data = '';
        if ($name !== '' && $assetsDir !== false && file_exists($assetsDir . '/' . $name)) {
            $mime = img_mime(pathinfo($name, PATHINFO_EXTENSION));
            $data = 'data:' . $mime . ';base64,' . base64_encode(file_get_contents($assetsDir . '/' . $name));
        }
        $assets[$pair[1]] = array('name' => $name, 'data' => $data);
    }
    // 121 条目元数据（含 imports 模块号，供前端预览）
    $entry = find_121_entry($lib, $extId);
    $eName = ''; $eDesc = ''; $eCollab = ''; $eNet = false; $eM = 0; $eM1 = 0;
    if ($entry !== null) {
        $eName = extract_value_after($entry['text'], 'name: ');
        $eDesc = extract_value_after($entry['text'], 'description: ');
        $eCollab = extract_value_after($entry['text'], 'collaborator: ');
        $eNet = strpos($entry['text'], 'internetConnectionRequired: true') !== false;
        if (preg_match('/png__WEBPACK_IMPORTED_MODULE_(\d+)___default\.a/', $entry['text'], $pm)) $eM = (int)$pm[1];
        if (preg_match('/small_svg__WEBPACK_IMPORTED_MODULE_(\d+)___default\.a/', $entry['text'], $pm)) $eM1 = (int)$pm[1];
    }
    // 全局变量区（blockIconURI 行到类定义之间）
    $globals = '';
    $g1 = strpos($src, 'var blockIconURI = __webpack_require__(');
    $g2 = strpos($src, 'var Scratch3');
    if ($g1 !== false && $g2 !== false && $g2 > $g1) {
        $lineEnd = strpos($src, "\n", $g1);
        if ($lineEnd !== false && $lineEnd < $g2) $globals = trim(substr($src, $lineEnd + 1, $g2 - $lineEnd - 1));
    }
    // 当前备注
    $remarks = array();
    $mfL = mf_gui_read();
    if (is_array($mfL)) foreach (array($pngNum, $iconNum, $implNum) as $n) if (isset($mfL['remarks'][(int)$n])) $remarks[$n] = $mfL['remarks'][(int)$n];
    // 页签预览：资产模块原文、954 注册片段、manifest 内容（均为存储形态，前端解码显示）
    $assetPngRaw = file_get_contents($guiDir . '/' . $pngNum . '.part.js');
    $assetSvgRaw = file_get_contents($guiDir . '/' . $iconNum . '.part.js');
    $reg954Frag = '';
    if (preg_match('/[,{](?:\\\\n)?\\s*' . $extId . '\s*:\s*function\s+\w+\s*\(\)\s*\{[^}]*\}/', $reg, $rm)) $reg954Frag = $rm[0];
    $cfgText = read_text($APP_ROOT . '/data/manifest_gui.json');
    jout(array(
        'ok' => true,
        'extId' => $extId,
        'fn' => $target['fn'],
        'pngNum' => $pngNum,
        'iconNum' => $iconNum,
        'implNum' => $implNum,
        'source' => $src,
        'globals' => $globals,
        'assets' => $assets,
        'entry' => array('name' => $eName, 'desc' => $eDesc, 'collab' => $eCollab, 'net' => $eNet, 'm' => $eM, 'm1' => $eM1),
        'remarks' => $remarks,
        'assetPngRaw' => ($assetPngRaw === false ? '' : $assetPngRaw),
        'assetSvgRaw' => ($assetSvgRaw === false ? '' : $assetSvgRaw),
        'reg954Frag' => $reg954Frag,
        'cfgText' => ($cfgText === false ? '' : $cfgText)
    ));
}

/* ---------------- 后端：保存对已有扩展的修改 ---------------- */
if ($action === 'edit') {
    $raw = file_get_contents('php://input');
    if ($raw === '' || $raw === false) $raw = isset($GLOBALS['SAVE_PAYLOAD']) ? $GLOBALS['SAVE_PAYLOAD'] : '';
    $in = json_decode($raw, true);
    $errors = array();
    if (!is_array($in)) { $errors[] = '请求体不是合法 JSON。'; jout(array('ok' => false, 'errors' => $errors)); }
    $extId = isset($in['extId']) ? trim((string)$in['extId']) : '';
    $name  = isset($in['name']) ? trim((string)$in['name']) : '';
    $desc  = isset($in['desc']) ? trim((string)$in['desc']) : '';
    $collab = isset($in['collab']) ? trim((string)$in['collab']) : '';
    $net = !empty($in['net']);
    $impl = isset($in['impl']) ? (string)$in['impl'] : '';
    if (!preg_match('/^[A-Za-z][A-Za-z0-9_]*$/', $extId)) $errors[] = '扩展ID不合法。';
    if ($name === '') $errors[] = '显示名称不能为空。';
    if ($desc === '') $errors[] = '描述不能为空。';
    if (strpos($name . $desc . $collab, '"') !== false) $errors[] = '名称/描述/协作者请使用单引号，不要包含双引号。';
    if (strpos($name . $desc . $collab, "\n") !== false || strpos($name . $desc . $collab, "\r") !== false) $errors[] = '名称/描述/协作者不能包含换行。';

    $guiDir = $APP_ROOT . '/data/scratch_gui';
    $regPath = $guiDir . '/954.part.js';
    $libPath = $guiDir . '/121.part.js';
    $reg = read_text($regPath);
    $lib = read_text($libPath);
    if ($reg === false || $lib === false) $errors[] = '无法读取 954/121 模块文件。';

    $target = null;
    $blockedRow = null;
    if ($reg !== false) {
        foreach (parse_registry($reg) as $en) if ($en['id'] === $extId) { $target = $en; break; }
    }
    if ($target === null) {
        foreach (read_manifest() as $mrow0) if ($mrow0['extId'] === $extId) { $blockedRow = $mrow0; break; }
        if ($blockedRow === null) $errors[] = '在 954 注册表与备用库中都找不到扩展：' . $extId;
    } else if ($target['num'] < 1480) $errors[] = '内置扩展不支持在线编辑。';
    $implNum = $target !== null ? $target['num'] : ($blockedRow !== null ? (int)$blockedRow['modules'][2] : 0);
    $pngNum = $implNum - 2;
    $iconNum = $implNum - 1;

    /* --- 实现文件校验（编辑模式：允许 \" 转义形态，拒绝裸双引号） --- */
    $headWant = $blockedRow !== null
        ? '/* implementation */\n (function(module, exports, __webpack_require__) {\n'
        : '/* ' . $implNum . ' */\n (function(module, exports, __webpack_require__) {\n';
    if (strpos($impl, $headWant) !== 0) $errors[] = '实现文件头部格式不正确。';
    if (substr($impl, -5) !== '\n })') $errors[] = '实现文件尾部格式不正确。';
    if (strpos($impl, 'module.exports = Scratch3' . $extId . 'Blocks;') === false) $errors[] = '实现文件缺少 module.exports。';
    if (strpos($impl, '__webpack_require__(' . $iconNum . ')') === false) $errors[] = '实现文件未引用图标模块 ' . $iconNum . '。';
    if (strpos($impl, chr(10)) !== false || strpos($impl, chr(13)) !== false) $errors[] = '实现文件内容含真实换行。';
    if (preg_match('/(?<!\\\\)"/', $impl)) $errors[] = '实现代码含未转义的双引号（存储形态必须为 \\"）。';

    /* --- 旧条目定位与模块号解析（正式库条目 / 备用库档案） --- */
    $entry = null; $m = 0; $m1 = 0; $oldName = '';
    if ($blockedRow !== null) {
        $entryText0 = (string)$blockedRow['entry121'];
        if (preg_match('/png__WEBPACK_IMPORTED_MODULE_(\d+)___default\.a/', $entryText0, $pm)) $m = (int)$pm[1];
        if (preg_match('/small_svg__WEBPACK_IMPORTED_MODULE_(\d+)___default\.a/', $entryText0, $pm)) $m1 = (int)$pm[1];
        if (!$m || !$m1) $errors[] = '备用库档案缺少 imports 模块号。';
        $oldName = extract_value_after($entryText0, 'name: ');
    } elseif ($lib !== false) {
        $entry = find_121_entry($lib, $extId);
        if ($entry === null) $errors[] = '121 中找不到该扩展的库条目。';
        else {
            if (preg_match('/png__WEBPACK_IMPORTED_MODULE_(\d+)___default\.a/', $entry['text'], $pm)) $m = (int)$pm[1];
            if (preg_match('/small_svg__WEBPACK_IMPORTED_MODULE_(\d+)___default\.a/', $entry['text'], $pm)) $m1 = (int)$pm[1];
            if (!$m || !$m1) $errors[] = '无法从旧条目解析 imports 模块号（可能被手工修改过）。';
            $oldName = $entry['name'];
        }
    }

    /* --- 图片替换（正式库读 scratch_gui，已屏蔽读备用库） --- */
    $assetsDir = realpath($APP_ROOT . '/../editor/static/assets');
    $replaced = array();
    if (!count($errors)) {
        foreach (array('png', 'svg') as $kind) {
            if (empty($in[$kind]) || empty($in[$kind]['data'])) continue;
            $bin = decode_data_url($in[$kind]['data']);
            $modPath = ($blockedRow !== null)
                ? $APP_ROOT . '/data/scratch_gui_standby/' . $extId . '/' . ($kind === 'png' ? $pngNum : $iconNum) . '.part.js'
                : $guiDir . '/' . ($kind === 'png' ? $pngNum : $iconNum) . '.part.js';
            $an = extract_asset_name((string)@file_get_contents($modPath));
            $ext = $an !== '' ? strtolower(pathinfo($an, PATHINFO_EXTENSION)) : '';
            $ok = ($bin !== false && $ext !== '' && img_magic_ok($bin, $ext));
            if (!$ok) { $errors[] = ($kind === 'png' ? '背景图' : '图标') . '数据与原文件扩展名（' . $ext . '）不匹配，未替换。'; continue; }
            if ($assetsDir === false) { $errors[] = '找不到静态资源目录。'; continue; }
            $replaced[$kind] = $bin;
        }
    }

    if (count($errors)) jout(array('ok' => false, 'errors' => $errors));

    /* --- 已屏蔽扩展：写回备用库（继续屏蔽），不触碰正式库/954/121/config --- */
    if ($blockedRow !== null) {
        $sbDir = $APP_ROOT . '/data/scratch_gui_standby/' . $extId;
        $bdir = make_backup_dir('edit_' . $extId);
        if ($bdir === false) jout(array('ok' => false, 'errors' => array('无法创建备份目录。')));
        foreach (array($sbDir . '/' . $implNum . '.part.js', $APP_ROOT . '/data/scratch_gui_standby/manifest.json') as $bf) {
            if (file_exists($bf)) @copy($bf, $bdir . '/' . basename($bf));
        }
        if (@file_put_contents($sbDir . '/' . $implNum . '.part.js', $impl) === false) jout(array('ok' => false, 'errors' => array('写入备用库实现文件失败。')));
        foreach ($replaced as $kind => $bin) {
            $srcPart = ($kind === 'png') ? $pngNum : $iconNum;
            $an = extract_asset_name((string)@file_get_contents($sbDir . '/' . $srcPart . '.part.js'));
            if ($an !== '') @file_put_contents($sbDir . '/assets/' . $an, $bin);
        }
        // 档案 entry121 按当前元数据重建（保留 imports 模块号），名称/备注同步
        $v1 = '_' . $extId . '_' . $extId . '_png__WEBPACK_IMPORTED_MODULE_' . $m . '__';
        $v2 = '_' . $extId . '_' . $extId . '_small_svg__WEBPACK_IMPORTED_MODULE_' . $m1 . '__';
        $newEntry = '{\n'
            . '  name: ' . sq_storage($name) . ',\n'
            . '  extensionId: \'' . $extId . '\',\n'
            . ($collab !== '' ? '  collaborator: ' . sq_storage($collab) . ',\n' : '')
            . '  iconURL: ' . $v1 . '_default.a,\n'
            . '  insetIconURL: ' . $v2 . '_default.a,\n'
            . '  description: ' . sq_storage($desc) . ',\n'
            . '  featured: true,\n'
            . '  internetConnectionRequired: ' . ($net ? 'true' : 'false') . ',\n'
            . '}, ';
        if (strpos($newEntry, '"') !== false) jout(array('ok' => false, 'errors' => array('条目文本意外包含双引号。')));
        $manifest = read_manifest();
        foreach ($manifest as $mk2 => $mr) {
            if ($mr['extId'] !== $extId) continue;
            $manifest[$mk2]['entry121'] = $newEntry;
            $manifest[$mk2]['name'] = $name;
            if ($oldName !== $name) {
                $rk = isset($mr['remarks']) ? $mr['remarks'] : array();
                $rk[$pngNum] = '|' . $name . '扩展背景图';
                $rk[$iconNum] = '|' . $name . '扩展图标';
                $rk[$implNum] = '|' . $name . '扩展定义';
                $manifest[$mk2]['remarks'] = $rk;
            }
        }
        write_manifest($manifest);
        $written = array(
            '已写回备用库（继续屏蔽）：standby/' . $extId . '/' . $implNum . '.part.js（原档案号不变）',
            '备用库档案已更新（名称/描述/协作者/联网标记）'
        );
        if (count($replaced)) $written[] = '备用库图片已替换（' . implode(', ', array_keys($replaced)) . '）';
        if ($oldName !== $name) $written[] = '档案备注已随名称更新';
        $written[] = '未触碰正式库（954/121/manifest_gui.json 不变）';
        jout(array('ok' => true, 'blocked' => true, 'backup' => str_replace($APP_ROOT, '.', $bdir), 'written' => $written));
    }

    /* --- 备份 --- */
    $bdir = make_backup_dir('edit_' . $extId);
    if ($bdir === false) jout(array('ok' => false, 'errors' => array('无法创建备份目录。')));
    foreach (array($guiDir . '/' . $implNum . '.part.js', $libPath, $APP_ROOT . '/data/manifest_gui.json') as $bf) {
        if (file_exists($bf)) @copy($bf, $bdir . '/' . basename($bf));
    }
    if ($assetsDir !== false) {
        foreach ($replaced as $kind => $bin) {
            $an = ($kind === 'png') ? extract_asset_name(file_get_contents($guiDir . '/' . $pngNum . '.part.js')) : extract_asset_name(file_get_contents($guiDir . '/' . $iconNum . '.part.js'));
            if ($an !== '' && file_exists($assetsDir . '/' . $an)) @copy($assetsDir . '/' . $an, $bdir . '/' . $an);
        }
    }

    /* --- 写入实现文件 --- */
    if (@file_put_contents($guiDir . '/' . $implNum . '.part.js', $impl) === false) jout(array('ok' => false, 'errors' => array('写入实现文件失败。')));

    /* --- 替换图片 --- */
    if ($assetsDir !== false) {
        foreach ($replaced as $kind => $bin) {
            $srcPart = ($kind === 'png') ? $pngNum : $iconNum;
            $an = extract_asset_name(file_get_contents($guiDir . '/' . $srcPart . '.part.js'));
            if ($an !== '') @file_put_contents($assetsDir . '/' . $an, $bin);
        }
    }

    /* --- 重建 121 条目（保留原 imports 模块号） --- */
    $v1 = '_' . $extId . '_' . $extId . '_png__WEBPACK_IMPORTED_MODULE_' . $m . '__';
    $v2 = '_' . $extId . '_' . $extId . '_small_svg__WEBPACK_IMPORTED_MODULE_' . $m1 . '__';
    $newEntry = '{\n'
        . '  name: ' . sq_storage($name) . ',\n'
        . '  extensionId: \''. $extId . '\',\n'
        . ($collab !== '' ? '  collaborator: ' . sq_storage($collab) . ',\n' : '')
        . '  iconURL: ' . $v1 . '_default.a,\n'
        . '  insetIconURL: ' . $v2 . '_default.a,\n'
        . '  description: ' . sq_storage($desc) . ',\n'
        . '  featured: true,\n'
        . '  internetConnectionRequired: ' . ($net ? 'true' : 'false') . ',\n'
        . '}, ';
    if (strpos($newEntry, '"') !== false) jout(array('ok' => false, 'errors' => array('条目文本意外包含双引号。')));
    $lib = substr_replace($lib, '', $entry['start'], strlen($entry['text']));
    $p2 = strpos($lib, '}, {\n  name: \'Makey Makey\'');
    if ($p2 === false) jout(array('ok' => false, 'errors' => array('121 中找不到条目插入锚点。')));
    $lib = substr_replace($lib, $newEntry, $p2 + 3, 0);
    if (@file_put_contents($libPath, $lib) === false) jout(array('ok' => false, 'errors' => array('写入 121 失败。')));

    /* --- 备注更新（名称变化时）+ 记入待缩减列表 + 清就绪（同一次 manifest 写入） --- */
    $mf = mf_gui_read();
    if (!is_array($mf)) jout(array('ok' => false, 'errors' => array('manifest_gui.json 读取失败。')));
    if ($oldName !== $name) {
        $mf['remarks'][$pngNum] = '|' . $name . '扩展背景图';
        $mf['remarks'][$iconNum] = '|' . $name . '扩展图标';
        $mf['remarks'][$implNum] = '|' . $name . '扩展定义';
    }
    $mf = mf_gui_pending_merge($mf, array($implNum));
    if (!mf_gui_write($mf)) jout(array('ok' => false, 'errors' => array('无法写入 manifest_gui.json。')));

    $written = array(
        '实现文件已更新（模块 ' . $implNum . '，原号不变）',
        '121 扩展库条目已重建（imports 模块号 ' . $m . '/' . $m1 . ' 保持不变）'
    );
    if (count($replaced)) $written[] = '图片已替换（' . implode(', ', array_keys($replaced)) . '）';
    if ($oldName !== $name) $written[] = '模块备注已随名称更新';

    jout(array(
        'ok' => true,
        'backup' => str_replace($APP_ROOT, '.', $bdir),
        'written' => $written
    ));
}
?>
<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta http-equiv="Cache-Control" content="no-store">
<title>Scratch3.0 扩展构建器</title>
<style>
*{box-sizing:border-box}
body{margin:0;font:13px/1.55 "Segoe UI","Microsoft YaHei",sans-serif;color:#1c2b3a;background:#f4f9fe}
.topbar{display:flex;align-items:center;gap:14px;padding:8px 14px;background:#fff;border-bottom:1px solid #dce8f5;position:sticky;top:0;z-index:5;flex-wrap:wrap}
.brand{font-weight:700;font-size:15px;color:#2b7de1}
.brand .sub{font-weight:400;font-size:12px;color:#6b7f95;margin-left:8px}
.badges{display:flex;gap:6px;flex:1;flex-wrap:wrap}
.badge{background:#eaf3fd;border:1px solid #d5e6f8;color:#35618f;border-radius:20px;padding:1px 10px;font-size:12px;white-space:nowrap}
.badge b{color:#2b7de1}
.badge.err{background:#fdeaea;border-color:#f3c1c1;color:#a33030;cursor:pointer}
.badge.err:hover{background:#fbdcdc}
.badge.ok{background:#e8f7f0;border-color:#bfe6d5;color:#177a52}
.flash-err{animation:flasherr .55s ease-in-out 3;border-color:#e5484d !important;box-shadow:0 0 0 3px rgba(229,72,77,.22) !important}
@keyframes flasherr{0%,100%{background-color:#fff}50%{background-color:#fdeaea}}
.acts{display:flex;gap:6px}
.btn{border:1px solid #d5e6f8;background:#fff;color:#35618f;border-radius:8px;padding:5px 14px;font-size:13px;cursor:pointer}
.btn:hover{background:#eaf3fd}
.btn.primary{background:#2b7de1;border-color:#2b7de1;color:#fff}
.btn.primary:hover{background:#1e6ccc}
.btn.danger{color:#c0392b;border-color:#e7b9b4}
.btn.danger:hover{background:#fdeaea}
.btn:disabled{opacity:.45;cursor:not-allowed}
.mini{padding:1px 8px;font-size:12px;border-radius:6px}
main{display:flex;gap:10px;padding:10px;height:calc(100vh - 78px)}
.pane{overflow:auto}
#paneForm{flex:11;min-width:520px;padding-right:2px}
#paneView{flex:10;display:flex;flex-direction:column;min-width:430px}
.fs{background:#fff;border:1px solid #dce8f5;border-radius:12px;padding:10px 12px;margin-bottom:10px}
.fs-t{font-weight:700;color:#2b7de1;font-size:13px;margin-bottom:8px;display:flex;align-items:center;gap:8px}
.grid2{display:grid;grid-template-columns:1fr 1fr;gap:8px}
label.lb,.grid2 label{display:flex;flex-direction:column;gap:3px;font-size:12px;color:#6b7f95}
.inp{border:1px solid #d5e6f8;border-radius:7px;padding:5px 8px;font:13px "Segoe UI","Microsoft YaHei",sans-serif;color:#1c2b3a;background:#fff;outline:none;width:100%}
.inp:focus{border-color:#2b7de1;box-shadow:0 0 0 2px #eaf3fd}
textarea.inp,textarea.code{resize:vertical;font-family:Consolas,monospace}
.row2{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:8px}
.up{border:1px dashed #c7dcf2;border-radius:10px;padding:8px;background:#fbfdff}
.up-t{font-size:12px;color:#35618f;margin-bottom:5px;font-weight:600}
.up .line{display:flex;gap:6px;align-items:center;margin-top:5px}
.prev{height:56px;width:120px;object-fit:contain;background:#fff;border:1px solid #e4eef8;border-radius:8px;margin-top:6px;display:none}
.opts{display:flex;gap:14px;margin-top:8px;font-size:12px;color:#35618f;flex-wrap:wrap}
.opts label{display:flex;align-items:center;gap:4px;cursor:pointer}
.card{border:1px solid #dce8f5;border-radius:10px;margin:8px 0;background:#fff;overflow:hidden}
.card-head{display:flex;gap:6px;align-items:center;padding:6px 8px;background:#eaf3fd;flex-wrap:wrap}
.card-head .no{color:#2b7de1;font-weight:700;min-width:18px;text-align:center}
.card-head .inp{width:auto;flex:1;min-width:120px}
.card-body{padding:8px}
.card-body .row{display:flex;gap:6px;align-items:center;margin:4px 0;flex-wrap:wrap}
.arg-row{display:flex;gap:5px;margin:4px 0;align-items:center;flex-wrap:wrap}
.arg-row .inp{width:auto;flex:1;min-width:0}
.code{width:100%;border:1px solid #d5e6f8;border-radius:7px;padding:6px 8px;font:12px/1.5 Consolas,monospace;color:#17324d;background:#f8fbfe;outline:none}
.code:focus{border-color:#2b7de1;box-shadow:0 0 0 2px #eaf3fd}
.tabs{display:flex;gap:4px;flex-wrap:wrap;margin-bottom:8px}
.tabs button{border:1px solid #d5e6f8;background:#fff;color:#35618f;border-radius:16px;padding:3px 12px;font-size:12px;cursor:pointer}
.tabs button.on{background:#2b7de1;color:#fff;border-color:#2b7de1}
#preview{flex:1;overflow:auto;background:#0f2237;color:#cfe3f7;border-radius:12px;padding:12px 14px;margin:0;font:12px/1.6 Consolas,monospace;white-space:pre}
.foot{margin-top:6px;font-size:12px;color:#6b7f95}
#modal{position:fixed;inset:0;background:rgba(28,43,58,.38);backdrop-filter:blur(5px);display:none;align-items:center;justify-content:center;z-index:50}
#modal.show{display:flex}
#modal .box{width:min(680px,92vw);max-height:82vh;overflow:auto;background:rgba(255,255,255,.85);backdrop-filter:blur(18px);border:1px solid rgba(255,255,255,.65);border-radius:16px;box-shadow:0 20px 60px rgba(15,34,55,.35);padding:18px 20px}
.m-t{font-weight:700;font-size:15px;color:#2b7de1;margin-bottom:10px}
.m-b{font-size:13px;color:#1c2b3a;white-space:pre-wrap;word-break:break-all}
.m-acts{display:flex;gap:8px;justify-content:flex-end;margin-top:14px}
</style>
</head>
<body>
<header class="topbar">
  <div class="brand">扩展构建器<span class="sub">Scratch3.0 自定义扩展一键生成</span></div>
  <div class="badges">
    <span class="badge">maxModule <b id="bGui">-</b></span>
    <span class="badge">新文件编号 <b id="bBase">-</b></span>
    <span class="badge">已注册扩展 <b id="bReg">-</b></span>
    <span class="badge" id="bCheck">语法检查中…</span>
  </div>
  <div class="acts">
    <button class="btn" id="btnExample" title="填入一个完整的示例，便于理解各字段">示例</button>
    <button class="btn" id="btnHelp" title="查看使用说明">帮助</button>
    <button class="btn danger" id="btnClear" title="清空新建表单的全部输入并删除浏览器草稿">清空</button>
    <button class="btn primary" id="btnSave" disabled title="新建模式：生成并保存新扩展；编辑模式：保存对当前扩展的修改">生成并保存</button>
    <button class="btn primary" id="btnUnblock" style="display:none" title="仅屏蔽编辑模式可用：解除屏蔽并把该扩展排到模块号末尾（重建 954/121/备注，config 递增）">解除屏蔽并保存</button>
  </div>
</header>
<main>
  <section class="pane" id="paneForm">
    <div class="fs" id="fsSel">
      <div class="fs-t">① 扩展选择器<span class="hintline">选中已有扩展进入在线编辑（载入→改→原号保存）；已屏蔽的扩展也在列表中（标“已屏蔽”），选中后可编辑、仅保存（继续屏蔽）或解除屏蔽；选“新建”用下方表单新建</span></div>
      <div class="arg-row">
        <select id="extSel" class="inp" style="flex:1" title="选择已有扩展进入在线编辑（载入→修改→原号保存），或选“新建扩展”用下方表单新建"></select>
        <button class="btn" id="btnBlock" title="把选中的扩展屏蔽到备用库：从注册表/扩展库移除，文件归档，可随时原号恢复">屏蔽到备用库</button>
      </div>
      <div class="hintline" id="editMeta" style="margin-top:6px;display:none"></div>
    </div>

    <div class="fs" id="fsBasic">
      <div class="fs-t">② 基本信息</div>
      <div class="grid2">
        <label>扩展ID（英文，如 DemoLed）<input class="inp" id="fExtId" autocomplete="off" placeholder="VM 内部标识，创建后不可改" title="扩展ID：VM 内部标识，字母开头仅含字母/数字/下划线；创建后不可修改（编辑模式下锁定）"></label>
        <label>显示名称<input class="inp" id="fName" autocomplete="off" placeholder="如 灯光控制，显示在积木分类和扩展库" title="显示名称：显示在积木分类与扩展库卡片上；编辑模式同步到 121 条目"></label>
        <label>描述<input class="inp" id="fDesc" autocomplete="off" placeholder="显示在扩展库卡片上" title="描述：显示在扩展库卡片上；编辑模式同步到 121 条目"></label>
        <label>协作者（可留空）<input class="inp" id="fCollab" autocomplete="off" title="协作者：可选，显示在扩展库卡片上"></label>
      </div>
      <div class="row2">
        <div class="up">
          <div class="up-t">背景图（PNG，扩展库大图）</div>
          <input type="file" id="fPng" accept=".png,image/png" title="选择扩展库大图（PNG，约 600×372）">
          <div class="line"><input class="inp" id="fPngName" autocomplete="off" placeholder="文件名，如 DemoLedPicture.png" title="背景图文件名：仅字母数字和 _-，扩展名 .png；上传到 editor/static/assets/"><span class="hintline" id="hintPng"></span></div>
          <img class="prev" id="vPng" alt="背景图预览" title="背景图预览">
        </div>
        <div class="up">
          <div class="up-t">积木图标（SVG/PNG/JPG/GIF，类别小图标）</div>
          <input type="file" id="fSvg" accept=".svg,.png,.jpg,.jpeg,.gif,image/svg+xml,image/png,image/jpeg,image/gif" title="选择积木类别小图标（SVG/PNG/JPG/GIF）">
          <div class="line"><input class="inp" id="fSvgName" autocomplete="off" placeholder="文件名，如 DemoLedSmall.svg / .png" title="图标文件名：仅字母数字和 _-，扩展名 svg/png/jpg/jpeg/gif；编辑模式替换时需与原名同格式"><span class="hintline" id="hintSvg"></span></div>
          <img class="prev" id="vSvg" alt="图标预览" title="图标预览">
        </div>
      </div>
      <label class="lb" id="fsGlobals" style="margin-top:8px">全局变量 / 初始化代码（插入到实现文件顶部，可留空）
        <textarea class="inp code" id="fGlobals" rows="3" spellcheck="false" placeholder="var SERVER_TIMEOUT = 10000;" title="全局变量/初始化代码：插入实现文件顶部（图标引用之后、类定义之前），方法体中可直接使用"></textarea>
      </label>
      <div class="opts" id="fsOpts">
        <label title="勾选后在 954 注册扩展入口（虚拟机能加载；不勾则仅生成文件）"><input type="checkbox" id="fReg954" checked title="勾选后在 954 注册扩展入口（虚拟机能加载；不勾则仅生成文件）"> 注册到虚拟机（954）</label>
        <label title="勾选后加入 121 扩展库卡片（扩展库可见；不勾则仅注册不可选）"><input type="checkbox" id="fReg121" checked title="勾选后加入 121 扩展库卡片（扩展库可见；不勾则仅注册不可选）"> 加入扩展库（121）</label>
        <label title="勾选后在 data/manifest_gui.json 写入模块备注"><input type="checkbox" id="fRemark" checked title="勾选后在 data/manifest_gui.json 写入模块备注"> 写入模块备注</label>
        <label title="勾选后扩展库卡片标记需要联网，提示用户授权"><input type="checkbox" id="fNet" title="勾选后扩展库卡片标记需要联网，提示用户授权"> 扩展需要联网</label>
      </div>
    </div>

    <div class="fs" id="fsBlocks">
      <div class="fs-t">③ 积木定义<button class="btn mini" id="btnAddBlock" title="添加一个新积木">+ 添加积木</button><span class="hintline">积木文本里用 [参数名] 占位，参数在卡片内添加</span></div>
      <div id="blockList"></div>
    </div>

    <div class="fs" id="fsMenus">
      <div class="fs-t">④ 下拉菜单（可选）<button class="btn mini" id="btnAddMenu" title="添加一个下拉菜单">+ 添加菜单</button><span class="hintline">积木参数的类型选“菜单”后引用这里的菜单</span></div>
      <div id="menuList"></div>
    </div>

    <div class="fs" id="fsCards" style="display:none">
      <div class="fs-t">⑤ 实现编辑<button class="btn mini" id="btnViewCards" title="卡片编辑：以积木/菜单卡片方式查看与修改（解析失败自动回退源码）">卡片编辑</button><button class="btn mini" id="btnViewSrc" title="源码编辑：直接编辑完整实现源码（含全局区/方法体）">源码编辑</button><span class="hintline" id="cardsHint"></span></div>
      <div id="cardsWrap"></div>
    </div>

    <div class="fs" id="fsSrc" style="display:none">
      <div class="fs-t">实现源码<span class="hintline">可读格式；保存时自动转回单行存储形态（反斜杠/引号/换行转义）</span></div>
      <textarea class="code" id="fSrc" rows="22" spellcheck="false" style="min-height:280px" title="完整实现源码（可读格式，真实换行）：可修改全局区/积木定义/方法体；文件头部 /* N */ 与尾部 }) 框架必须保留；保存时自动转为单行存储形态"></textarea>
      <div class="foot" style="margin-top:4px">可直接改实现源码（含顶部全局变量区、getInfo 积木定义、各 opcode 方法）；文件头部 /* N */ 与尾部 }) 框架行必须保留。</div>
    </div>
  </section>

  <section class="pane" id="paneView">
    <div class="tabs" id="tabs">
      <button data-t="impl" class="on" title="实现文件源码：可读格式（新建=将要生成的，编辑=当前生效/派生的）">实现文件</button>
      <button data-t="png" title="背景图模块 part.js：模块号与资产文件引用（编辑模式显示当前生效内容）">背景图模块</button>
      <button data-t="svg" title="图标模块 part.js：模块号与资产文件引用（编辑模式显示当前生效内容）">图标模块</button>
      <button data-t="reg954" title="虚拟机注册：builtinExtensions 扩展入口（编辑模式显示当前生效片段）">954 注册</button>
      <button data-t="lib121" title="扩展库条目：121 卡片（名称/图标/描述，编辑模式为将重建的条目）">121 库条目</button>
      <button data-t="cfg" title="data/manifest_gui.json：模块索引（maxModule 计数器/备注/待缩减/就绪状态，编辑模式显示当前生效内容）">manifest_gui.json</button>
    </div>
    <pre id="preview"></pre>
    <div class="foot" id="foot">就绪</div>
  </section>
</main>

<div id="modal"><div class="box"><div class="m-t" id="mTitle"></div><div class="m-b" id="mBody"></div><div class="m-acts" id="mActs"></div></div></div>

<script>
'use strict';
/* ================= 状态 ================= */
var INFO = null;          // action=info 的结果
var CUR = {};             // 当前生成的各片段（新建模式）
var TAB = 'impl';
var DKEY = 'm2-extbuilder-draft-v1';
var TMR = null;
var MODE = 'create';      // 'create' 新建模式 | 'edit' 在线编辑模式
var EDIT = null;          // 编辑模式数据（action=load 结果 + 待替换图片）
var TMR2 = null;          // 编辑模式防抖

function $(id){ return document.getElementById(id); }
function el(tag, cls, txt){ var e = document.createElement(tag); if (cls) e.className = cls; if (txt != null) e.textContent = txt; return e; }
function sq(s){
  // 统一使用单引号字面量（扩展源码内不允许出现双引号）
  s = String(s == null ? '' : s);
  return "'" + s.replace(/\\/g, '\\\\').replace(/'/g, "\\'") + "'";
}
function indent(code, n){
  var pad = new Array(n + 1).join(' ');
  return String(code || '').replace(/\r/g, '').replace(/^\n+|\n+$/g, '').split('\n').map(function(l){ return l ? pad + l : l; }).join('\n');
}
function toLiteral(s){
  // 存储形态：源码统一单引号，无需转义双引号；仅处理反斜杠与换行（内容嵌入 eval("...") 字符串）
  return s.replace(/\r/g, '').replace(/\\/g, '\\\\').replace(/\n/g, '\\n');
}
function toStorage(s){
  // 编辑模式存储形态编码：可读源码 → 单行转义形态（与旧文件 \n、\"、\\ 形态兼容，先转反斜杠再转引号/换行）
  return String(s == null ? '' : s)
    .replace(/\r\n/g, '\n').replace(/\r/g, '\n')
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/\n/g, '\\n')
    .replace(/\t/g, '\\t');
}
function fromStorage(s){
  // 存储形态解码：字面 \n → 真换行、\t → tab、\" → "、\\ → \（仅用于预览显示）
  return String(s == null ? '' : s).replace(/\\(.)/g, function(_, c){ return c === 'n' ? '\n' : c === 't' ? '\t' : c === 'r' ? '\r' : c; });
}

/* ================= 实现文件解析器（编辑模式：解析 → 卡片 → 原位重建） =================
 * 严格模式：任何不识别的结构整体解析失败 → 回退源码编辑模式。
 * 核心保证：卡片未做任何修改时，rebuildSrc() 输出与原文逐字节一致。
 * 支持：行内注释、积木额外字段（forcedEnableMonitor/disableMonitor/isEdgeActivated 等）、
 *       动态菜单（items: 函数调用等，只读保留）、注释掉的方法条目、数字/标识符 defaultValue。
 */
function rep(n){ return new Array(n + 1).join(' '); }
function lxSkipLineComment(src, i){ while (i < src.length && src[i] !== '\n') i++; return i; }
function lxSkipBlockComment(src, i){ i += 2; while (i < src.length && !(src[i] === '*' && src[i + 1] === '/')) i++; return i >= src.length ? src.length : i + 2; }
function lxSkipString(src, i){
  var q = src[i]; i++;
  while (i < src.length) {
    if (src[i] === '\\') { i += 2; continue; }
    if (src[i] === q) return i + 1;
    if (src[i] === '\n' && q !== '`') return i;
    i++;
  }
  return i;
}
function lxSkipRegex(src, i){
  i++; var inCls = false;
  while (i < src.length) {
    if (src[i] === '\\') { i += 2; continue; }
    if (src[i] === '\n') return i;
    if (inCls) { if (src[i] === ']') inCls = false; }
    else if (src[i] === '[') inCls = true;
    else if (src[i] === '/') { i++; break; }
    i++;
  }
  while (i < src.length && /[a-z]/i.test(src[i])) i++;
  return i;
}
function lxSkipWsC(src, i){
  for (;;) {
    while (i < src.length && /[ \t\r\n]/.test(src[i])) i++;
    if (src[i] === '/' && src[i + 1] === '/') { i = lxSkipLineComment(src, i); continue; }
    if (src[i] === '/' && src[i + 1] === '*') { i = lxSkipBlockComment(src, i); continue; }
    return i;
  }
}
function lxSkipWs(src, i){ while (i < src.length && /[ \t\r\n]/.test(src[i])) i++; return i; }
function lxLineStart(src, i){ var p = src.lastIndexOf('\n', i - 1); return p + 1; }
var LX_KW = { 'return':1,'case':1,'typeof':1,'instanceof':1,'in':1,'of':1,'new':1,'delete':1,'void':1,'throw':1,'else':1,'do':1,'yield':1,'await':1 };
function lxScan(src, i, stop){
  // code 态扫描到 stop(c,i,lastWord) 命中；全程跳过字符串/注释/正则；返回命中下标或 -1
  var state = 'code', word = '', lastWord = '', rxAllowed = true, rxInCls = false;
  var n = src.length;
  while (i < n) {
    var c = src[i];
    if (state === 'line') { if (c === '\n') { state = 'code'; rxAllowed = true; word = ''; lastWord = ''; } i++; continue; }
    if (state === 'block') { if (c === '*' && src[i + 1] === '/') { state = 'code'; rxAllowed = true; word = ''; lastWord = ''; i += 2; } else { if (c === '\n') rxAllowed = true; i++; } continue; }
    if (state === 'sq' || state === 'dq' || state === 'tpl') {
      if (c === '\\') { i += 2; continue; }
      if ((state === 'sq' && c === "'") || (state === 'dq' && c === '"') || (state === 'tpl' && c === '`')) { state = 'code'; rxAllowed = false; word = ''; lastWord = ''; }
      i++; continue;
    }
    if (state === 'regex' || state === 'rxcls') {
      if (c === '\\') { i += 2; continue; }
      if (c === '\n') return -1;
      if (state === 'regex') { if (c === '[') { rxInCls = true; state = 'rxcls'; } else if (c === '/') { state = 'code'; rxAllowed = false; word = ''; lastWord = ''; } }
      else if (c === ']') { rxInCls = false; state = 'regex'; }
      i++; continue;
    }
    if (stop && stop(c, i, lastWord)) return i;
    if (c === '/') {
      if (src[i + 1] === '/') { state = 'line'; i += 2; continue; }
      if (src[i + 1] === '*') { state = 'block'; i += 2; continue; }
      if (rxAllowed) { state = 'regex'; rxInCls = false; i++; continue; }
      rxAllowed = true; word = ''; lastWord = ''; i++; continue;
    }
    if (c === "'" || c === '"') { state = c === "'" ? 'sq' : 'dq'; i++; continue; }
    if (c === '`') { state = 'tpl'; i++; continue; }
    if (c === '\n') { if (word && LX_KW.hasOwnProperty(word)) rxAllowed = true; word = ''; lastWord = ''; rxAllowed = true; i++; continue; }
    if (c === ' ' || c === '\t' || c === '\r') { if (word && LX_KW.hasOwnProperty(word)) rxAllowed = true; if (word) lastWord = word; word = ''; i++; continue; }
    if (/[A-Za-z0-9_$]/.test(c)) { word += c; rxAllowed = false; i++; continue; }
    if (word) { if (LX_KW.hasOwnProperty(word)) rxAllowed = true; lastWord = word; word = ''; }
    rxAllowed = '([{,;=:!&|?+-*%~^'.indexOf(c) >= 0;
    i++; continue;
  }
  return -1;
}
function lxMatch(src, openIdx){
  // 配对括号：返回闭括号自身下标（含嵌套深度跟踪）
  var open = src[openIdx];
  var close = open === '{' ? '}' : open === '[' ? ']' : ')';
  var depth = 1;
  return lxScan(src, openIdx + 1, function(c) {
    if (c === open) { depth++; return false; }
    if (c === close) { depth--; return depth === 0; }
    return false;
  });
}
function lxReadLiteral(src, i){
  i = lxSkipWsC(src, i);
  var c = src[i];
  if (c === "'" || c === '"') {
    var end = lxSkipString(src, i);
    var raw = src.slice(i, end);
    var val; try { val = (new Function('return ' + raw))(); } catch (e) { val = raw.slice(1, -1); }
    return { kind: 'str', value: val, start: i, end: end, q: c, raw: raw };
  }
  if (/[0-9]/.test(c) || (c === '-' && /[0-9]/.test(src[i + 1] || ''))) {
    var j = i + 1;
    while (j < src.length && /[0-9a-fA-FxXoObB._]/.test(src[j])) j++;
    return { kind: 'num', value: src.slice(i, j), start: i, end: j };
  }
  if (c === '/') {
    var re2 = lxSkipRegex(src, i);
    return { kind: 'regex', value: src.slice(i, re2), start: i, end: re2 };
  }
  if (/[A-Za-z_$]/.test(c)) {
    var k = i;
    while (k < src.length && /[A-Za-z0-9_$]/.test(src[k])) k++;
    var w = src.slice(i, k);
    if (w === 'true' || w === 'false') return { kind: 'bool', value: w === 'true', start: i, end: k };
    if (w === 'null' || w === 'undefined') return { kind: 'id', value: w, start: i, end: k };
    if ((w === 'ArgumentType' || w === 'BlockType') && src[k] === '.') {
      var k2 = k + 1, w2 = '';
      while (k2 < src.length && /[A-Za-z0-9_$]/.test(src[k2])) { w2 += src[k2]; k2++; }
      return { kind: 'enum', value: w2, ns: w, start: i, end: k2 };
    }
    return { kind: 'id', value: w, start: i, end: k };
  }
  return { kind: 'fail', value: '', start: i, end: i };
}
var BLOCK_KNOWN_TYPES = ['COMMAND', 'REPORTER', 'BOOLEAN', 'HAT'];
var ARG_KNOWN_TYPES = ['STRING', 'NUMBER', 'ANGLE', 'BOOLEAN', 'COLOR'];
function parseBlockObj(src, start, end){
  var r = { start: start, end: end, fieldsOrder: [], extras: {} };
  var opcodeF = null, textF = null, typeF = null, argsF = null;
  var p = lxSkipWsC(src, start + 1);
  while (p < end - 1) {
    p = lxSkipWsC(src, p);
    if (src[p] === ',') { p = lxSkipWsC(src, p + 1); continue; }
    if (src[p] === '}') break;
    var nm = /^([A-Za-z_$][\w$]*)\s*:/.exec(src.slice(p, end));
    if (!nm) return { fail: '字段名解析失败 @' + p };
    var key = nm[1];
    var vStart = p + nm[0].length;
    var vAt = lxSkipWsC(src, vStart);
    var vEnd, rec;
    var fmM = /^formatMessage\s*\(/.exec(src.slice(vAt, end));
    if (fmM) {
      var fo = src.indexOf('(', vAt);
      var fc = lxMatch(src, fo);
      if (fc < 0) return { fail: 'formatMessage 括号不配对' };
      vEnd = fc + 1;
      var def = null, desc = null, idl = null;
      var q = lxSkipWsC(src, fo + 1);
      if (src[q] === '{') q = lxSkipWsC(src, q + 1);
      while (q < fc) {
        if (src[q] === ',') { q = lxSkipWsC(src, q + 1); continue; }
        if (src[q] === '}') break;
        var km = /^([A-Za-z_$][\w$]*)\s*:/.exec(src.slice(q, fc));
        if (!km) return { fail: 'formatMessage 内字段解析失败 @' + q };
        var lit = lxReadLiteral(src, q + km[0].length);
        if (lit.kind !== 'str' && lit.kind !== 'num') return { fail: 'formatMessage 内 ' + km[1] + ' 不是字符串字面量' };
        if (km[1] === 'default') def = lit;
        if (km[1] === 'description') desc = lit;
        if (km[1] === 'id') idl = lit;
        q = lxSkipWsC(src, lit.end);
      }
      rec = { style: 'fmt', vStart: vStart, vEnd: vEnd, def: def, desc: desc, id: idl };
    } else if (src[vAt] === '{' || src[vAt] === '[') {
      vEnd = lxMatch(src, vAt) + 1;
      if (vEnd < 1) return { fail: '字段 ' + key + ' 括号不配对' };
      rec = { style: 'obj', vStart: vStart, vEnd: vEnd };
    } else {
      var lit2 = lxReadLiteral(src, vAt);
      if (lit2.kind === 'fail' || lit2.kind === 'regex') return { fail: '字段 ' + key + ' 类型不支持 @' + vAt };
      rec = { style: 'plain', vStart: vStart, vEnd: lit2.end, def: lit2, desc: null };
      vEnd = lit2.end;
    }
    p = vEnd;
    r.fieldsOrder.push(key);
    if (key === 'opcode') opcodeF = rec;
    else if (key === 'text') textF = rec;
    else if (key === 'blockType') typeF = rec;
    else if (key === 'arguments') argsF = rec;
    else r.extras[key] = { valueText: src.slice(vAt, rec.vEnd), vStart: vStart, vEnd: rec.vEnd };
  }
  if (!opcodeF || !opcodeF.def || opcodeF.style !== 'plain' || opcodeF.def.kind !== 'str') return { fail: 'opcode 缺失或非字符串' };
  if (!textF) return { fail: 'text 缺失' };
  if (!typeF || typeF.style !== 'plain' || typeF.def.kind !== 'enum' || typeF.def.ns !== 'BlockType') return { fail: 'blockType 缺失或非 BlockType 枚举' };
  if (BLOCK_KNOWN_TYPES.indexOf(typeF.def.value) < 0) return { fail: 'blockType ' + typeF.def.value + ' 不支持' };
  if (argsF && argsF.style !== 'obj') return { fail: 'arguments 形态不支持' };
  var args = [];
  if (argsF) {
    var obAt = lxSkipWsC(src, argsF.vStart);
    if (src[obAt] !== '{') return { fail: 'arguments 不是对象' };
    var aEnd = argsF.vEnd;
    var q3 = lxSkipWsC(src, obAt + 1);
    while (q3 < aEnd - 1) {
      q3 = lxSkipWsC(src, q3);
      if (src[q3] === ',') { q3 = lxSkipWsC(src, q3 + 1); continue; }
      if (src[q3] === '}') break;
      var am = /^([A-Za-z_$][\w$]*)\s*:/.exec(src.slice(q3, aEnd));
      if (!am) return { fail: '参数名解析失败 @' + q3 };
      var aname = am[1];
      var vs = lxSkipWsC(src, q3 + am[0].length);
      if (src[vs] !== '{') return { fail: '参数 ' + aname + ' 不是对象' };
      var ae = lxMatch(src, vs);
      if (ae < 0) return { fail: '参数 ' + aname + ' 括号不配对' };
      var a = { name: aname, spanStart: q3, spanEnd: ae + 1 };
      var w = lxSkipWsC(src, vs + 1);
      var tF = null, mF = null, dvF = null;
      while (w < ae) {
        w = lxSkipWsC(src, w);
        if (src[w] === ',') { w = lxSkipWsC(src, w + 1); continue; }
        if (src[w] === '}') break;
        var km2 = /^([A-Za-z_$][\w$]*)\s*:/.exec(src.slice(w, ae));
        if (!km2) return { fail: '参数 ' + aname + ' 字段解析失败 @' + w };
        var lit3 = lxReadLiteral(src, w + km2[0].length);
        if (lit3.kind === 'fail') return { fail: '参数 ' + aname + ' 字段 ' + km2[1] + ' 值解析失败' };
        if (km2[1] === 'type') { if (lit3.kind !== 'enum' || (lit3.ns !== 'ArgumentType' && lit3.ns !== 'BlockType')) return { fail: '参数 ' + aname + ' type 非枚举' }; tF = lit3; }
        else if (km2[1] === 'menu') { if (lit3.kind !== 'str') return { fail: '参数 ' + aname + ' menu 非字符串' }; mF = lit3; }
        else if (km2[1] === 'defaultValue') { dvF = lit3; }
        else return { fail: '参数 ' + aname + ' 含不支持字段 ' + km2[1] };
        w = lxSkipWsC(src, lit3.end);
      }
      if (!tF) return { fail: '参数 ' + aname + ' 缺少 type' };
      if (ARG_KNOWN_TYPES.indexOf(tF.value) < 0) return { fail: '参数类型 ' + tF.value + ' 不支持' };
      a.type = tF.value;
      a.typeNs = tF.ns;
      a.menu = mF ? mF.value : '';
      if (dvF) {
        a.dvKind = dvF.kind === 'str' ? 'str' : dvF.kind === 'num' ? 'num' : 'raw';
        a.dvValue = dvF.value;
        a.dvRaw = src.slice(dvF.start, dvF.end);
      } else { a.dvKind = 'none'; a.dvValue = ''; a.dvRaw = ''; }
      args.push(a);
      q3 = lxSkipWsC(src, ae + 1);
    }
  }
  r.opcode = opcodeF.def.value;
  r.opSpan = { start: opcodeF.def.start, end: opcodeF.def.end };
  r.textStyle = textF.style;
  if (textF.style === 'fmt') {
    if (!textF.def) return { fail: 'text formatMessage 缺少 default' };
    r.text = textF.def.value;
    r.textDesc = textF.desc ? textF.desc.value : '';
    r.textId = textF.id ? textF.id.value : '';
    r.textSpan = { start: textF.def.start, end: textF.def.end };
  } else {
    if (textF.def.kind !== 'str') return { fail: 'text 非字符串' };
    r.text = textF.def.value;
    r.textDesc = '';
    r.textId = '';
    r.textSpan = { start: textF.def.start, end: textF.def.end };
  }
  r.type = typeF.def.value;
  r.args = args;
  r.argsObj = argsF ? { start: argsF.vStart, end: argsF.vEnd } : null;
  return r;
}
function parseMenuObj(src, start, end, name){
  var r = { name: name, start: start, end: end, dynamic: false, accept: true, items: [], itemStyle: 'str' };
  var p = lxSkipWsC(src, start + 1);
  var hasItems = false;
  while (p < end - 1) {
    p = lxSkipWsC(src, p);
    if (src[p] === ',') { p = lxSkipWsC(src, p + 1); continue; }
    if (src[p] === '}') break;
    var nm = /^([A-Za-z_$][\w$]*)\s*:/.exec(src.slice(p, end));
    if (!nm) return { fail: '菜单 ' + name + ' 字段解析失败 @' + p };
    var key = nm[1];
    var vStart = p + nm[0].length;
    var vAt = lxSkipWsC(src, vStart);
    if (key === 'acceptReporters') {
      var lit = lxReadLiteral(src, vAt);
      if (lit.kind !== 'bool') return { fail: '菜单 ' + name + ' acceptReporters 非布尔' };
      r.accept = lit.value;
      p = lit.end;
    } else if (key === 'items') {
      hasItems = true;
      r.itemsSpan = { start: vStart, end: 0 };
      if (src[vAt] === '[') {
        var arrEnd = lxMatch(src, vAt);
        if (arrEnd < 0) return { fail: '菜单 ' + name + ' items 括号不配对' };
        r.itemsSpan.end = arrEnd + 1;
        r.itemsArr = { open: vAt, close: arrEnd };
        var items = [];
        var q2 = lxSkipWsC(src, vAt + 1);
        var allStr = true;
        while (q2 < arrEnd) {
          q2 = lxSkipWsC(src, q2);
          if (src[q2] === ',') { q2 = lxSkipWsC(src, q2 + 1); continue; }
          if (src[q2] === ']') break;
          var lit2 = lxReadLiteral(src, q2);
          if (lit2.kind === 'str') { items.push({ text: lit2.value, value: lit2.value }); q2 = lxSkipWsC(src, lit2.end); }
          else if (src[q2] === '{') {
            allStr = false;
            var oe = lxMatch(src, q2);
            if (oe < 0) return { fail: '菜单 ' + name + ' items 对象括号不配对' };
            var inner = src.slice(q2 + 1, oe);
            var tm = /(^\s*|[,{]\s*)text\s*:\s*/.exec(inner);
            var vm2 = /(^\s*|[,{]\s*)value\s*:\s*/.exec(inner);
            if (!tm || !vm2) return { fail: '菜单 ' + name + ' items 对象缺少 text/value' };
            var tl = lxReadLiteral(src, q2 + 1 + tm.index + tm[0].length);
            var vl = lxReadLiteral(src, q2 + 1 + vm2.index + vm2[0].length);
            if (tl.kind !== 'str' || vl.kind !== 'str') return { fail: '菜单 ' + name + ' items text/value 非字符串' };
            items.push({ text: tl.value, value: vl.value });
            q2 = lxSkipWsC(src, oe + 1);
          }
          else return { fail: '菜单 ' + name + ' items 含不支持元素 @' + q2 };
        }
        r.items = items;
        r.itemStyle = allStr ? 'str' : 'obj';
        p = r.itemsSpan.end;
      } else {
        var vEnd = lxScan(src, vAt, function(c) { return c === ',' || c === '}'; });
        if (vEnd < 0) return { fail: '菜单 ' + name + ' items 边界定位失败' };
        r.dynamic = true;
        r.itemsSpan.end = vEnd;
        r.itemsRaw = src.slice(vAt, vEnd);
        p = vEnd;
      }
    } else return { fail: '菜单 ' + name + ' 含不支持字段 ' + key };
  }
  if (!hasItems) return { fail: '菜单 ' + name + ' 缺少 items' };
  return r;
}
function parseImpl(src, extId){
  function fail(reason) { return { ok: false, reason: reason }; }
  var mExp = /\bmodule\.exports\s*=\s*([A-Za-z_$][\w$]*)\s*;/.exec(src);
  if (!mExp) return fail('找不到 module.exports。');
  var clsName = mExp[1];
  var clsRe = new RegExp('var\\s+' + clsName.replace(/\$/g, '\\$') + '\\s*=\\s*function\\s*\\(\\)\\s*\\{');
  var mCls = clsRe.exec(src);
  if (!mCls) return fail('找不到类定义 var ' + clsName + ' = function () {...}。');
  var classStart = mCls.index;
  var gStart = classStart;
  var reIcon2 = /var\s+(?:menuIconURI|blockIconURI)\s*=[^;\n]*;/g;
  var m2, lastIconEnd = -1;
  while ((m2 = reIcon2.exec(src)) !== null) { if (m2.index < classStart) lastIconEnd = m2.index + m2[0].length; }
  if (lastIconEnd >= 0) {
    gStart = src.indexOf('\n', lastIconEnd);
    if (gStart < 0 || gStart > classStart) gStart = lastIconEnd; else gStart++;
  }
  var globalsText = src.slice(gStart, classStart);
  var reCC = new RegExp('_createClass\\(\\s*' + clsName.replace(/\$/g, '\\$') + '\\s*,\\s*\\[');
  var mCC = reCC.exec(src);
  if (!mCC) return fail('找不到 _createClass(' + clsName + ', [...])。');
  var arrOpen = src.indexOf('[', mCC.index);
  var arrClose = lxMatch(src, arrOpen);
  if (arrClose < 0) return fail('方法数组括号不配对。');
  var methods = [];
  var pos = lxSkipWsC(src, arrOpen + 1);
  while (pos < arrClose) {
    if (src[pos] === ',') { pos = lxSkipWsC(src, pos + 1); continue; }
    if (src[pos] === ']') break;
    if (src[pos] !== '{') return fail('方法数组中出现非对象元素 @' + pos + '。');
    var objEnd = lxMatch(src, pos);
    if (objEnd < 0) return fail('方法对象括号不配对。');
    var mk = /["']key["']\s*:\s*|key\s*:\s*/.exec(src.slice(pos, objEnd + 1));
    if (!mk) return fail('方法对象缺少 key @' + pos + '。');
    var keyLit = lxReadLiteral(src, pos + mk.index + mk[0].length);
    if (keyLit.kind !== 'str') return fail('方法 key 不是字符串字面量 @' + pos + '。');
    var method = {
      key: keyLit.value,
      keyLitStart: keyLit.start, keyLitEnd: keyLit.end,
      entryStart: pos, entryEnd: objEnd + 1
    };
    var mv = /value\s*:\s*function\b/.exec(src.slice(pos, objEnd + 1));
    method.hasValue = !!mv;
    if (mv) {
      var fnHead = pos + mv.index + mv[0].length;
      var nameM = /^\s*([A-Za-z_$][\w$]*)?/.exec(src.slice(fnHead));
      var afterName = fnHead + (nameM ? nameM[0].length : 0);
      var parenOpen = src.indexOf('(', afterName);
      if (parenOpen < 0) return fail('方法函数签名缺少括号 @' + pos + '。');
      var parenClose = lxMatch(src, parenOpen);
      if (parenClose < 0) return fail('方法函数签名括号不配对。');
      var bi = lxSkipWsC(src, parenClose);
      while (bi < src.length && src[bi] !== '{') bi = lxSkipWsC(src, bi + 1);
      if (bi >= src.length || src[bi] !== '{') return fail('方法函数体缺少 {。');
      var bodyEnd = lxMatch(src, bi);
      if (bodyEnd < 0) return fail('方法函数体括号不配对。');
      method.fnName = nameM && nameM[1] ? nameM[1] : '';
      method.fnNameStart = fnHead + (nameM && nameM[0].indexOf(nameM[1]) >= 0 ? nameM[0].indexOf(nameM[1]) : 0);
      method.fnNameEnd = method.fnNameStart + (method.fnName ? method.fnName.length : 0);
      method.bodyStart = bi + 1;
      method.bodyEnd = bodyEnd;
      method.bodyText = src.slice(bi + 1, bodyEnd);
    }
    methods.push(method);
    pos = lxSkipWsC(src, objEnd + 1);
  }
  var getInfo = null;
  for (var mi = 0; mi < methods.length; mi++) if (methods[mi].key === 'getInfo') { getInfo = methods[mi]; break; }
  if (!getInfo || !getInfo.hasValue) return fail('找不到 getInfo 方法。');
  var retIdx = lxScan(src, getInfo.bodyStart, function(c, i, lw) { return c === '{' && lw === 'return'; });
  if (retIdx < 0) return fail('getInfo 中找不到 return {。');
  var infoOpen = retIdx;
  var infoClose = lxMatch(src, infoOpen);
  if (infoClose < 0) return fail('getInfo 返回对象括号不配对。');
  var props = [];
  var p = lxSkipWsC(src, infoOpen + 1);
  while (p < infoClose) {
    p = lxSkipWsC(src, p);
    if (src[p] === ',') { p = lxSkipWsC(src, p + 1); continue; }
    if (src[p] === '}') break;
    var nameM2 = /^([A-Za-z_$][\w$]*)\s*:/.exec(src.slice(p));
    if (!nameM2) return fail('getInfo 返回对象属性名解析失败 @' + p);
    var key = nameM2[1];
    var vStart = p + nameM2[0].length;
    var vAt = lxSkipWsC(src, vStart);
    var vEnd;
    var fmM2 = /^formatMessage\s*\(/.exec(src.slice(vAt));
    if (fmM2) {
      var fo = src.indexOf('(', vAt);
      var fc = lxMatch(src, fo);
      if (fc < 0) return fail('formatMessage 括号不配对。');
      vEnd = fc + 1;
    } else if (src[vAt] === '[' || src[vAt] === '{') {
      vEnd = lxMatch(src, vAt) + 1;
      if (vEnd < 1) return fail('getInfo 属性 ' + key + ' 括号不配对。');
    } else {
      var lit4 = lxReadLiteral(src, vAt);
      if (lit4.kind === 'fail') return fail('getInfo 属性 ' + key + ' 值解析失败。');
      vEnd = lit4.end;
    }
    props.push({ key: key, start: p, valueStart: vStart, vAt: vAt, end: vEnd });
    p = lxSkipWsC(src, vEnd);
  }
  var nameProp = null;
  for (var pi = 0; pi < props.length; pi++) if (props[pi].key === 'name') { nameProp = props[pi]; break; }
  if (!nameProp) return fail('getInfo 缺少 name。');
  var fmInner = /^formatMessage\s*\(/.exec(src.slice(nameProp.vAt, nameProp.end));
  var nameDefault = null;
  if (fmInner) {
    var innerStart = src.indexOf('(', nameProp.vAt) + 1;
    var dm = /(^|[,{]\s*)default\s*:\s*/.exec(src.slice(innerStart, nameProp.end));
    if (!dm) return fail('name 的 formatMessage 缺少 default。');
    var dlit = lxReadLiteral(src, innerStart + dm.index + dm[0].length);
    if (dlit.kind !== 'str') return fail('name default 不是字符串。');
    nameDefault = { start: dlit.start, end: dlit.end, value: dlit.value, style: 'fmt' };
  } else {
    var lit5 = lxReadLiteral(src, nameProp.vAt);
    if (lit5.kind !== 'str') return fail('name 不是字符串。');
    nameDefault = { start: lit5.start, end: lit5.end, value: lit5.value, style: 'plain' };
  }
  var blocks = [], blocksArr = null;
  var blocksProp = null;
  for (var bi2 = 0; bi2 < props.length; bi2++) if (props[bi2].key === 'blocks') { blocksProp = props[bi2]; break; }
  if (blocksProp) {
    if (src[blocksProp.vAt] !== '[') return fail('blocks 不是数组。');
    var bOpen = blocksProp.vAt;
    var bClose = lxMatch(src, bOpen);
    if (bClose < 0) return fail('blocks 数组括号不配对。');
    blocksArr = { open: bOpen, close: bClose };
    var q = lxSkipWsC(src, bOpen + 1);
    while (q < bClose) {
      q = lxSkipWsC(src, q);
      if (src[q] === ',') { q = lxSkipWsC(src, q + 1); continue; }
      if (src[q] === ']') break;
      if (src[q] !== '{') return fail('blocks 数组中出现非对象元素 @' + q + '。');
      var oEnd = lxMatch(src, q);
      if (oEnd < 0) return fail('积木对象括号不配对。');
      var b = parseBlockObj(src, q, oEnd + 1);
      if (b.fail) return fail('积木解析失败：' + b.fail);
      blocks.push(b);
      q = lxSkipWsC(src, oEnd + 1);
    }
  }
  var menus = [], menusObj = null;
  var menusProp = null;
  for (var mi2 = 0; mi2 < props.length; mi2++) if (props[mi2].key === 'menus') { menusProp = props[mi2]; break; }
  if (menusProp) {
    if (src[menusProp.vAt] !== '{') return fail('menus 不是对象。');
    var moOpen = menusProp.vAt;
    var moClose = lxMatch(src, moOpen);
    if (moClose < 0) return fail('menus 对象括号不配对。');
    menusObj = { open: moOpen, close: moClose };
    var q4 = lxSkipWsC(src, moOpen + 1);
    while (q4 < moClose) {
      q4 = lxSkipWsC(src, q4);
      if (src[q4] === ',') { q4 = lxSkipWsC(src, q4 + 1); continue; }
      if (src[q4] === '}') break;
      var nm2 = /^([A-Za-z_$][\w$]*)\s*:/.exec(src.slice(q4));
      if (!nm2) return fail('菜单名解析失败 @' + q4 + '。');
      var mname = nm2[1];
      var vAt2 = lxSkipWsC(src, q4 + nm2[0].length);
      if (src[vAt2] !== '{') return fail('菜单 ' + mname + ' 不是对象字面量 @' + vAt2 + '。');
      var mEnd = lxMatch(src, vAt2);
      if (mEnd < 0) return fail('菜单 ' + mname + ' 括号不配对。');
      var mm = parseMenuObj(src, vAt2, mEnd + 1, mname);
      if (mm.fail) return fail('菜单解析失败：' + mm.fail);
      mm.nameLit = { start: q4, end: q4 + mname.length };
      menus.push(mm);
      q4 = lxSkipWsC(src, mEnd + 1);
    }
  }
  return {
    ok: true,
    className: clsName,
    classStart: classStart,
    globals: { start: gStart, end: classStart, text: globalsText },
    nameDefault: nameDefault,
    blocks: blocks, blocksArr: blocksArr,
    menus: menus, menusObj: menusObj,
    methods: methods,
    methodsArr: { open: arrOpen, close: arrClose },
    infoOpen: infoOpen, infoClose: infoClose,
    props: props
  };
}

/* ---------- 重建（原位变更拼接） ---------- */
function dvLiteral(a, newVal){
  if (a.dvKind === 'none') return '';
  if (a.dvKind === 'num') {
    if (/^-?\d+(\.\d+)?$/.test(String(newVal).trim())) return String(newVal).trim();
    return sq(newVal);
  }
  if (a.dvKind === 'raw') {
    if (String(newVal) === String(a.dvValue)) return a.dvRaw;
    return sq(newVal);
  }
  return sq(newVal);
}
function regenArguments(b, fi){
  var L = ['arguments: {'];
  b.args.forEach(function(a, i) {
    var hasDv = a.dvKind !== 'none' && (a.dvValue !== '' || a.dvKind === 'raw');
    var hasMenu = !!a.menu;
    var mid = hasMenu || hasDv;
    var ns = a.typeNs || 'ArgumentType';
    L.push(rep(fi + 2) + a.name + ': {');
    L.push(rep(fi + 4) + 'type: ' + ns + '.' + a.type + (mid ? ',' : ''));
    if (a.menu) L.push(rep(fi + 4) + 'menu: ' + sq(a.menu) + (hasDv ? ',' : ''));
    if (a.type !== 'BOOLEAN' && hasDv) L.push(rep(fi + 4) + 'defaultValue: ' + dvLiteral(a, a.dvValue));
    L.push(rep(fi + 2) + '}' + (i < b.args.length - 1 ? ',' : ''));
  });
  L.push(rep(fi) + '}');
  return L.join('\n');
}
function regenBlockObj(b, id, fi){
  var parts = [];
  (b.fieldsOrder || ['opcode', 'text', 'blockType', 'arguments']).forEach(function(key) {
    if (key === 'opcode') parts.push(rep(fi) + 'opcode: ' + sq(b.opcode));
    else if (key === 'text') {
      if (b.textStyle === 'fmt') {
        parts.push(rep(fi) + 'text: formatMessage({\n' + rep(fi + 2) + 'id: ' + sq(b.textId || (id + '.' + b.opcode)) + ',\n' + rep(fi + 2) + 'default: ' + sq(b.text) + ',\n' + rep(fi + 2) + 'description: ' + sq(b.textDesc || ('block ' + b.opcode)) + '\n' + rep(fi) + '})');
      } else parts.push(rep(fi) + 'text: ' + sq(b.text));
    }
    else if (key === 'blockType') parts.push(rep(fi) + 'blockType: BlockType.' + b.type);
    else if (key === 'arguments') { if (b.args.length) parts.push(rep(fi) + regenArguments(b, fi)); }
    else if (b.extras && b.extras[key]) parts.push(rep(fi) + key + ': ' + b.extras[key].valueText);
  });
  return '{\n' + parts.join(',\n') + '\n' + rep(fi - 2) + '}';
}
function regenMenusObj(m, fi){
  var L = ['{'];
  L.push(rep(fi) + 'acceptReporters: ' + (m.accept ? 'true' : 'false') + ',');
  var items = m.items || [];
  var allStr = items.every(function(x) { return x.text === x.value; });
  var s;
  if (allStr) s = '[' + items.map(function(x) { return sq(x.text); }).join(', ') + ']';
  else s = '[{' + items.map(function(x) { return 'text: ' + sq(x.text) + ', value: ' + sq(x.value); }).join('}, {') + '}]';
  L.push(rep(fi) + 'items: ' + s);
  L.push(rep(fi - 2) + '}');
  return L.join('\n');
}
function regenMethodEntry(op, bodyText, fi){
  // 返回完整条目 { ... }（含函数闭合与条目闭合）；fi = key 行缩进
  return '{\n' + rep(fi) + 'key: ' + sq(op) + ',\n' + rep(fi) + 'value: function ' + op + '(args, util) {' + bodyText + '\n' + rep(fi) + '}\n' + rep(fi - 2) + '}';
}
function rebuildSrc(src, changes){
  var arr = changes.slice().sort(function(a, b) { return b.start - a.start; });
  var out = src;
  var lastStart = Infinity;
  for (var i = 0; i < arr.length; i++) {
    if (arr[i].start > lastStart) throw new Error('变更区间交叉');
    lastStart = arr[i].start;
    out = out.slice(0, arr[i].start) + arr[i].text + out.slice(arr[i].end);
  }
  return out;
}
function delSpanOf(items, idx){
  var it = items[idx];
  if (idx > 0) return { start: items[idx - 1].end, end: it.end, text: '' };
  if (items.length > 1) return { start: it.start, end: items[1].start, text: '' };
  return { start: it.start, end: it.end, text: '' };
}
function opcodeLineIndent(src, opStart){
  var ls = lxLineStart(src, opStart);
  return src.slice(ls, opStart).length;
}

var RESERVED = ['delete','var','function','return','if','else','for','while','do','new','class','switch','case','break','continue','this','typeof','instanceof','in','try','catch','finally','throw','default','void','with','let','const','yield','static','async','await'];

function blankBlock(){ return { opcode: '', text: '', type: 'COMMAND', desc: '', args: [], code: '' }; }
var state = {
  extId: '', name: '', desc: '', collab: '', net: false,
  globals: 'var SERVER_TIMEOUT = 10000;\nvar RAWDATA = \'\';',
  png: { name: '', data: '' }, svg: { name: '', data: '' },
  pngTouched: false, svgTouched: false,
  blocks: [blankBlock()], menus: [],
  reg954: true, reg121: true, remark: true
};

/* ================= 实现模板 ================= */
var TPLS = {
  set: function(b){
    var a = (b.args[0] || {}).name || 'WORDS';
    return 'MYSTATE = Cast.toString(args.' + a + ');';
  },
  ret: function(b){
    var a = (b.args[0] || {}).name;
    if (b.type === 'REPORTER') return a ? ('return Cast.toString(args.' + a + ');') : "return '';";
    if (b.type === 'BOOLEAN') return 'return false;';
    return 'return;';
  },
  net: function(b){
    var a = (b.args[0] || {}).name || 'WORDS';
    return [
      'var _this = this;',
      'var words = Cast.toString(args.' + a + ');',
      "var path = './extension/myapi/device.php';",
      "path += '?W=' + words;",
      'return new Promise(function (resolve) {',
      '  nets({',
      '    url: path,',
      '    timeout: SERVER_TIMEOUT',
      '  }, function (err, res, body) {',
      '    if (err) {',
      '      log.warn(err);',
      '      return resolve();',
      '    }',
      '    if (res.statusCode !== 200) {',
      '      log.warn(res.statusCode);',
      '      return resolve();',
      '    }',
      '    return resolve();',
      '  });',
      '});'
    ].join('\n');
  },
  hat: function(){ return 'return false;'; },
  empty: function(){ return ''; }
};

/* ================= 代码生成 ================= */
var HELPERS = [
  'function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\'Cannot call a class as a function\'); } }',
  'function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\'value\' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }',
  'function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }'
];

function parseItems(txt){
  var arr = [];
  String(txt || '').split(/\r?\n/).forEach(function(l){
    l = l.trim(); if (!l) return;
    var i = l.indexOf('|');
    if (i >= 0) arr.push({ text: l.slice(0, i), value: l.slice(i + 1) });
    else arr.push(l);
  });
  return arr;
}

function genAssetModule(num, fname){
  return '/* ' + num + ' */\n (function(module, exports) {\nmodule.exports =\'./static/assets/' + fname + '\';\n })';
}

function genBlockObj(b, id){
  var L = [];
  L.push('          {');
  L.push('            opcode: ' + sq(b.opcode) + ',');
  L.push('            text: formatMessage({');
  L.push('              id: ' + sq(id + '.' + b.opcode) + ',');
  L.push('              default: ' + sq(b.text) + ',');
  L.push('              description: ' + sq(b.desc || ('block ' + b.opcode)));
  L.push('            }),');
  var hasArgs = b.args.length > 0;
  L.push('            blockType: BlockType.' + b.type + (hasArgs ? ',' : ''));
  if (hasArgs) {
    L.push('            arguments: {');
    b.args.forEach(function(a, i){
      L.push('              ' + a.name + ': {');
      var hasMenu = !!a.menu;
      var hasDv = a.type !== 'BOOLEAN' && a.default !== '';
      var mid = hasMenu || hasDv;
      L.push('                type: ArgumentType.' + a.type + (mid ? ',' : ''));
      if (a.menu) L.push('                menu: ' + sq(a.menu) + (hasDv ? ',' : ''));
      if (hasDv) L.push('                defaultValue: ' + sq(a.default));
      L.push('              }' + (i < b.args.length - 1 ? ',' : ''));
    });
    L.push('            }');
  }
  L.push('          }');
  return L.join('\n');
}

function genMenusSrc(menus){
  if (!menus.length) return '';
  var L = ['        menus: {'];
  menus.forEach(function(m, i){
    var items = parseItems(m.items);
    var simple = items.every(function(x){ return typeof x === 'string'; });
    var src;
    if (simple) src = '[' + items.map(sq).join(', ') + ']';
    else src = '[{' + items.map(function(x){ return 'text: ' + sq(x.text) + ', value: ' + sq(x.value); }).join('}, {') + '}]';
    L.push('          ' + m.name + ': {');
    L.push('            acceptReporters: ' + (m.accept ? 'true' : 'false') + ',');
    L.push('            items: ' + src);
    L.push('          }' + (i < menus.length - 1 ? ',' : ''));
  });
  L.push('        }');
  return L.join('\n');
}

function genImpl(st, base){
  var id = st.extId, icon = base + 1, num = base + 2;
  var L = [];
  L.push('/* ' + num + ' */');
  L.push(' (function(module, exports, __webpack_require__) {');
  HELPERS.forEach(function(h){ L.push(h); });
  L.push('var formatMessage = __webpack_require__(71);');
  L.push('var nets = __webpack_require__(223);');
  L.push('var ArgumentType = __webpack_require__(63);');
  L.push('var BlockType = __webpack_require__(45);');
  L.push('var Cast = __webpack_require__(48);');
  L.push('var Clone = __webpack_require__(113);');
  L.push('var log = __webpack_require__(39);');
  L.push('var menuIconURI = __webpack_require__(' + icon + ');');
  L.push('var blockIconURI = __webpack_require__(' + icon + ');');
  var g = String(st.globals || '').replace(/\r/g, '').replace(/^\n+|\n+$/g, '');
  if (g) L.push(g);
  /* getInfo */
  var gi = [];
  gi.push("    key: 'getInfo',");
  gi.push('    value: function getInfo() {');
  gi.push('      return {');
  gi.push('        id: ' + sq(id) + ',');
  gi.push('        name: formatMessage({');
  gi.push('          id: ' + sq(id + '.categoryName') + ',');
  gi.push('          default: ' + sq(st.name) + ',');
  gi.push('          description: ' + sq('Name of the ' + (id || 'extension') + ' extension.'));
  gi.push('        }),');
  gi.push('        blockIconURI: blockIconURI,');
  gi.push('        menuIconURI: menuIconURI,');
  gi.push('        blocks: [');
  gi.push(st.blocks.map(function(b){ return genBlockObj(b, id); }).join(',\n'));
  var ms = genMenusSrc(st.menus);
  if (ms) { gi.push('        ],'); gi.push(ms); } else { gi.push('        ]'); }
  gi.push('      };');
  gi.push('    }');
  /* 方法 */
  var ms2 = st.blocks.map(function(b){
    return '  }, {\n    key: ' + sq(b.opcode) + ',\n    value: function ' + b.opcode + '(args, util) {\n' + indent(b.code, 6) + '\n    }';
  });
  L.push('var Scratch3' + id + 'Blocks = function () {');
  L.push('  function Scratch3' + id + 'Blocks(runtime) {');
  L.push('    _classCallCheck(this, Scratch3' + id + 'Blocks);');
  L.push('    this.runtime = runtime;');
  L.push('  }');
  L.push('  _createClass(Scratch3' + id + 'Blocks, [{\n' + gi.join('\n') + '\n' + ms2.join('\n') + '\n  }], [{\n    key: \'STATE_KEY\',\n    get: function get() {\n      return ' + sq('Scratch.' + id) + ';\n    }\n  }, {\n    key: \'DEFAULT_STATE\',\n    get: function get() {\n      return {};\n    }\n  }]);');
  L.push('  return Scratch3' + id + 'Blocks;');
  L.push('}();');
  L.push('module.exports = Scratch3' + id + 'Blocks;');
  L.push(' })');
  return L.join('\n');
}

function gen954(st, base){
  var id = st.extId, num = base + 2;
  return ',\n  ' + id + ': function ' + id + '() {\n    return __webpack_require__(' + num + ');\n  }';
}

function gen121(st, base, nextMod){
  var id = st.extId;
  var v1 = '_' + id + '_' + id + '_png__WEBPACK_IMPORTED_MODULE_' + nextMod + '__';
  var v2 = '_' + id + '_' + id + '_small_svg__WEBPACK_IMPORTED_MODULE_' + (nextMod + 1) + '__';
  var L = [];
  L.push('【插入位置一】imports：加到 121 模块 “ // TODO: Rename file names...” 注释之前');
  L.push(' var ' + v1 + ' = __webpack_require__(' + base + ');');
  L.push(' var ' + v1 + '_default = __webpack_require__.n(' + v1 + ');');
  L.push(' var ' + v2 + ' = __webpack_require__(' + (base + 1) + ');');
  L.push(' var ' + v2 + '_default = __webpack_require__.n(' + v2 + ');');
  L.push('');
  L.push('【插入位置二】库条目：插到上一条目结尾“}, ”之后、Makey Makey 条目的“{”之前');
  L.push('{');
  L.push('  name: ' + sq(st.name) + ',');
  L.push('  extensionId: ' + sq(id) + ',');
  if (st.collab) L.push('  collaborator: ' + sq(st.collab) + ',');
  L.push('  iconURL: ' + v1 + '_default.a,');
  L.push('  insetIconURL: ' + v2 + '_default.a,');
  L.push('  description: ' + sq(st.desc) + ',');
  L.push('  featured: true,');
  L.push('  internetConnectionRequired: ' + (st.net ? 'true' : 'false') + ',');
  L.push('}, ');
  return L.join('\n');
}

/* ================= 校验 ================= */
function validate(){
  var errs = [];
  var id = state.extId.trim();
  if (!/^[A-Za-z][A-Za-z0-9_]*$/.test(id)) errs.push('扩展ID：必须以字母开头，仅含字母、数字、下划线。');
  else if (INFO) {
    if (INFO.registryIds.indexOf(id) >= 0) errs.push('扩展ID：在 954 注册表中已存在。');
    if (INFO.libraryIds.indexOf(id) >= 0) errs.push('扩展ID：在 121 扩展库中已存在。');
  }
  if (!state.name.trim()) errs.push('显示名称：不能为空。');
  if (!state.desc.trim()) errs.push('描述：不能为空。');
  if (/"/.test(state.name) || /"/.test(state.desc) || /"/.test(state.collab)) errs.push('名称/描述/协作者请统一使用单引号，不要包含双引号。');
  if (!state.png.data) errs.push('背景图：未选择 PNG 文件。');
  if (!state.svg.data) errs.push('积木图标：未选择图片文件（SVG/PNG/JPG/GIF）。');
  if (state.png.data && !/^[A-Za-z0-9_\-]+\.png$/i.test(state.png.name.trim())) errs.push('背景图文件名：仅限字母数字和 _-，扩展名 .png。');
  if (state.svg.data && !/^[A-Za-z0-9_\-]+\.(svg|png|jpg|jpeg|gif)$/i.test(state.svg.name.trim())) errs.push('图标文件名：仅限字母数字和 _-，扩展名 svg/png/jpg/jpeg/gif。');
  var menuNames = [];
  state.menus.forEach(function(m, i){
    var n = '菜单 ' + (i + 1) + '：';
    if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(m.name.trim())) errs.push(n + '菜单名不合法。');
    else if (menuNames.indexOf(m.name.trim()) >= 0) errs.push(n + '菜单名重复。');
    else menuNames.push(m.name.trim());
    if (!parseItems(m.items).length) errs.push(n + '至少要有一项选项。');
    if (m.items.indexOf('"') >= 0) errs.push(n + '选项请统一使用单引号，不要包含双引号。');
  });
  if (!state.blocks.length) errs.push('至少定义一个积木。');
  var seen = {};
  state.blocks.forEach(function(b, i){
    var n = '积木 ' + (i + 1) + '：';
    if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(b.opcode) || RESERVED.indexOf(b.opcode.toLowerCase()) >= 0) errs.push(n + 'opcode 不合法或是保留字。');
    else if (seen[b.opcode]) errs.push(n + 'opcode 重复。');
    else seen[b.opcode] = 1;
    if (!b.text.trim()) errs.push(n + '积木文本为空。');
    var ph = [];
    (b.text.match(/\[([^\[\]]+)\]/g) || []).forEach(function(p){ var k = p.slice(1, -1); if (ph.indexOf(k) < 0) ph.push(k); });
    var names = [];
    b.args.forEach(function(a){
      if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(a.name)) errs.push(n + '参数名“' + a.name + '”不合法。');
      else if (names.indexOf(a.name) >= 0) errs.push(n + '参数名“' + a.name + '”重复。');
      else names.push(a.name);
      if (a.menu && menuNames.indexOf(a.menu) < 0) errs.push(n + '参数“' + a.name + '”引用的菜单“' + a.menu + '”不存在。');
      if (a.type === 'BOOLEAN' && a.default) errs.push(n + '布尔参数“' + a.name + '”不需要默认值。');
    });
    ph.forEach(function(p){ if (names.indexOf(p) < 0) errs.push(n + '文本占位 [' + p + '] 缺少对应参数。'); });
    names.forEach(function(a){ if (ph.indexOf(a) < 0) errs.push(n + '参数 ' + a + ' 未在文本中用 [' + a + '] 引用。'); });
    if (!b.code.trim()) errs.push(n + '实现代码为空（可在模板下拉中选一个起点）。');
    if (b.text.indexOf('"') >= 0 || (b.desc || '').indexOf('"') >= 0 || b.code.indexOf('"') >= 0) errs.push(n + '文本/描述/实现代码请统一使用单引号，不要包含双引号。');
  });
  if (!errs.length) {
    var C = buildAll();
    try { new Function(C.impl); }
    catch (e) { errs.push('JS 语法错误：' + e.message); }
    if (C.impl && (C.impl.indexOf('"') >= 0 || C.pngModule.indexOf('"') >= 0 || C.svgModule.indexOf('"') >= 0)) errs.push('生成内容包含双引号——扩展文件统一使用单引号。');
  }
  return errs;
}

/* ================= 生成与预览 ================= */
function buildAll(){
  if (!INFO) return {};
  var base = INFO.gui_files + 1;
  var pngName = state.png.name.trim() || ((state.extId || 'EXT') + 'Picture.png');
  var svgName = state.svg.name.trim() || ((state.extId || 'EXT') + 'Small.svg');
  return {
    base: base,
    pngModule: genAssetModule(base, pngName),
    svgModule: genAssetModule(base + 1, svgName),
    impl: genImpl(state, base),
    frag954: gen954(state, base),
    frag121: gen121(state, base, INFO.nextModule),
    cfg: '<' + '?php\n$gui_files=' + (base + 2) + ';\n?' + '>'
  };
}

var LINT_ERR = null, LINT_SRC = '';
function regen(){
  if (!INFO) return;
  if (MODE === 'edit') { renderEditPreview(); return; }
  CUR = buildAll();
  $('bBase').textContent = CUR.base + ' ~ ' + (CUR.base + 2);
  var badge = $('bCheck');
  try { new Function(CUR.impl); badge.className = 'badge ok'; badge.textContent = 'JS 语法 ✓'; badge.title = ''; LINT_ERR = null; }
  catch (e) { badge.className = 'badge err'; badge.textContent = 'JS 语法 ✗ ' + e.message + '（点击定位）'; badge.title = '点击定位出错位置：跳到源码/预览并高亮出错行'; LINT_ERR = e; LINT_SRC = CUR.impl; }
  renderPreview();
}
/* 顶部“JS 语法 ✗”点击：高亮出错源码框（编辑模式卡片视图自动切源码），并用 eval 报错栈尽力选中出错行。
   lintErrLineOf 仅在 new Function 已报错后调用（此时代码必为语法错误，eval 不会执行任何顶层代码）。 */
function lintErrLineOf(src){
  try { eval(src); return -1; }
  catch (e) {
    if (e instanceof SyntaxError) {
      var m = /<anonymous>:(\d+):(\d+)/.exec(String(e.stack || ''));
      if (m) return parseInt(m[1], 10);
    }
    return -1;
  }
}
function flashErrTa(el, line){
  if (!el) return;
  el.classList.add('flash-err');
  setTimeout(function(){ el.classList.remove('flash-err'); }, 1900);
  if (line > 0) {
    var txt = (el.value !== undefined && el.value !== null) ? el.value : (el.textContent || '');
    var lines = txt.split('\n');
    if (lines[line - 1] !== undefined) {
      var start = 0;
      for (var i = 0; i < line - 1; i++) start += lines[i].length + 1;
      if (el.setSelectionRange) {
        try { el.focus(); el.setSelectionRange(start, start + lines[line - 1].length); } catch (e2) {}
      }
      var lh = 18;
      try { lh = parseFloat(getComputedStyle(el).lineHeight) || 18; } catch (e3) {}
      el.scrollTop = Math.max(0, (line - 4) * lh);
    }
  }
  try { el.scrollIntoView({ block: 'center' }); } catch (e4) {}
}
function lintBadgeJump(){
  if (!LINT_ERR) return;
  var line = lintErrLineOf(LINT_SRC);
  if (MODE === 'edit' && EDIT) {
    if (EDIT.view === 'cards') { var bv = $('btnViewSrc'); if (bv) bv.click(); }
    flashErrTa($('fSrc'), line);
  } else {
    Array.prototype.forEach.call($('tabs').children, function(x){ if (x.getAttribute('data-t') === 'impl') x.click(); });
    flashErrTa($('preview'), line);
  }
}

function renderPreview(){
  var p = $('preview');
  if (TAB === 'impl') p.textContent = '【实现源码·可读格式（真实换行）——保存时自动转为单行存储形态写入 part.js】\n' + (CUR.impl || '');
  else if (TAB === 'png') p.textContent = '/* 保存为 data/scratch_gui/' + (CUR.base || '?') + '.part.js */\n' + (CUR.pngModule || '');
  else if (TAB === 'svg') p.textContent = '/* 保存为 data/scratch_gui/' + ((CUR.base || 0) + 1) + '.part.js */\n' + (CUR.svgModule || '');
  else if (TAB === 'reg954') p.textContent = '在 954 模块 builtinExtensions 对象的结尾（最后一个条目后、"\\n};" 之前）插入：\n' + (CUR.frag954 || '');
  else if (TAB === 'lib121') p.textContent = CUR.frag121 || '';
  else if (TAB === 'cfg') p.textContent = CUR.cfg || '';
  $('foot').textContent = '预览为可读格式（真实换行，字符串内的换行保留 \\n 转义原样）；保存时自动转为单行存储形态（反斜杠/引号/换行转义），字符串统一单引号。';
}

/* ================= 草稿持久化 ================= */
function collect(){
  state.reg954 = $('fReg954').checked;
  state.reg121 = $('fReg121').checked;
  state.remark = $('fRemark').checked;
  return state;
}
function saveDraft(){
  if (MODE === 'edit') return; // 编辑模式不写草稿，避免覆盖新建表单草稿
  try { localStorage.setItem(DKEY, JSON.stringify(collect())); }
  catch (e) {
    try {
      var s = JSON.parse(JSON.stringify(collect()));
      s.png = { name: s.png.name, data: '' }; s.svg = { name: s.svg.name, data: '' };
      localStorage.setItem(DKEY, JSON.stringify(s));
      $('hintPng').textContent = '草稿过大，图片未缓存';
    } catch (e2) { /* 忽略 */ }
  }
}
function loadDraft(){
  var raw = localStorage.getItem(DKEY);
  if (!raw) return false;
  try {
    var s = JSON.parse(raw);
    state.extId = s.extId || ''; state.name = s.name || ''; state.desc = s.desc || ''; state.collab = s.collab || '';
    state.net = !!s.net; state.globals = s.globals || '';
    state.png = s.png || { name: '', data: '' }; state.svg = s.svg || { name: '', data: '' };
    state.pngTouched = !!s.pngTouched; state.svgTouched = !!s.svgTouched;
    state.reg954 = s.reg954 !== false; state.reg121 = s.reg121 !== false; state.remark = s.remark !== false;
    state.blocks = (s.blocks && s.blocks.length) ? s.blocks : [blankBlock()];
    state.menus = s.menus || [];
    return true;
  } catch (e) { return false; }
}

/* ================= UI 绑定 ================= */
function touch(){ clearTimeout(TMR); TMR = setTimeout(function(){ saveDraft(); regen(); }, 250); }

function bindBasic(){
  [['fExtId', 'extId'], ['fName', 'name'], ['fDesc', 'desc'], ['fCollab', 'collab']].forEach(function(p){
    $(p[0]).addEventListener('input', function(){
      if (MODE === 'edit') { EDIT[p[1]] = this.value; editTouch(); }
      else { state[p[1]] = this.value; touch(); }
    });
  });
  $('fGlobals').addEventListener('input', function(){ state.globals = this.value; touch(); }); // 仅新建模式可见
  $('fNet').addEventListener('change', function(){
    if (MODE === 'edit') { EDIT.net = this.checked; editTouch(); }
    else { state.net = this.checked; touch(); }
  });
  $('fReg954').addEventListener('change', function(){ state.reg954 = this.checked; touch(); });
  $('fReg121').addEventListener('change', function(){ state.reg121 = this.checked; touch(); });
  $('fRemark').addEventListener('change', function(){ state.remark = this.checked; touch(); });

  $('fPng').addEventListener('change', function(){
    var f = this.files[0]; if (!f) return;
    var big = f.size > 3 * 1024 * 1024;
    if (MODE === 'edit') $('hintPng').textContent = big ? '警告：图片超过 3MB，可能超出上传限制' : '将覆盖替换原背景图（文件名不变）';
    else $('hintPng').textContent = big ? '警告：图片超过 3MB，可能超出上传限制' : '';
    var r = new FileReader();
    r.onload = function(){
      var v = $('vPng'); v.src = r.result; v.style.display = 'block';
      if (MODE === 'edit') { EDIT.pngNew = r.result; editTouch(); return; }
      state.png.data = r.result;
      if (!state.pngTouched) state.png.name = (state.extId || 'MyExt') + 'Picture.png';
      $('fPngName').value = state.png.name;
      touch();
    };
    r.readAsDataURL(f);
  });
  $('fSvg').addEventListener('change', function(){
    var f = this.files[0]; if (!f) return;
    var big = f.size > 3 * 1024 * 1024;
    var extMatch = f.name.match(/\.([A-Za-z0-9]+)$/);
    var ext = extMatch ? extMatch[1].toLowerCase() : '';
    if (MODE === 'edit') $('hintSvg').textContent = big ? '警告：图片超过 3MB，可能超出上传限制' : '将覆盖替换原图标（文件名不变，需为 ' + (EDIT && EDIT.svgName ? EDIT.svgName.split('.').pop() : '原格式') + ' 格式）';
    else $('hintSvg').textContent = big ? '警告：图片超过 3MB，可能超出上传限制' : '';
    var r = new FileReader();
    r.onload = function(){
      var v = $('vSvg'); v.src = r.result; v.style.display = 'block';
      if (MODE === 'edit') { EDIT.svgNew = r.result; editTouch(); return; }
      state.svg.data = r.result;
      if (['svg', 'png', 'jpg', 'jpeg', 'gif'].indexOf(ext) < 0) ext = 'svg';
      if (!state.svgTouched) state.svg.name = (state.extId || 'MyExt') + 'Small.' + ext;
      $('fSvgName').value = state.svg.name;
      touch();
    };
    r.readAsDataURL(f);
  });
  $('fPngName').addEventListener('input', function(){ if (MODE === 'edit') return; state.png.name = this.value; state.pngTouched = true; touch(); });
  $('fSvgName').addEventListener('input', function(){ if (MODE === 'edit') return; state.svg.name = this.value; state.svgTouched = true; touch(); });
  $('fSrc').addEventListener('input', editTouch);
}

function refreshBasic(){
  $('fExtId').value = state.extId; $('fName').value = state.name;
  $('fDesc').value = state.desc; $('fCollab').value = state.collab;
  $('fGlobals').value = state.globals; $('fNet').checked = state.net;
  $('fReg954').checked = state.reg954; $('fReg121').checked = state.reg121; $('fRemark').checked = state.remark;
  $('fPngName').value = state.png.name; $('fSvgName').value = state.svg.name;
  if (state.png.data) { $('vPng').src = state.png.data; $('vPng').style.display = 'block'; }
  if (state.svg.data) { $('vSvg').src = state.svg.data; $('vSvg').style.display = 'block'; }
}

/* ---------- 积木卡片 ---------- */
function argRow(b, a){
  var row = el('div', 'arg-row');
  var nm = el('input', 'inp'); nm.placeholder = '参数名如 WORDS'; nm.value = a.name;
  nm.style.maxWidth = '150px';
  nm.title = '参数名：英文标识，积木文本中用 [参数名] 引用，实现代码中通过 args.参数名 取值';
  nm.oninput = function(){ a.name = this.value; touch(); };
  var ty = el('select', 'inp'); ty.style.maxWidth = '110px';
  ty.title = '参数类型：字符串/数字/角度/布尔/颜色，决定积木输入控件形态';
  [['STRING','字符串'],['NUMBER','数字'],['ANGLE','角度'],['BOOLEAN','布尔'],['COLOR','颜色']].forEach(function(o){
    var op = new Option(o[1], o[0]); ty.add(op);
  });
  ty.value = a.type;
  ty.onchange = function(){ a.type = this.value; touch(); };
  var mn = el('select', 'inp'); mn.style.maxWidth = '130px';
  mn.setAttribute('data-role', 'menu');
  mn.__arg = a;
  mn.title = '参数的下拉菜单：从本扩展已定义的菜单中选择，选“（无菜单）”取消引用；也可就地新建/删除菜单';
  mn.add(new Option('（无菜单）', ''));
  state.menus.forEach(function(m){ if (m.name.trim()) mn.add(new Option(m.name.trim(), m.name.trim())); });
  mn.value = a.menu || '';
  mn.onchange = function(){ a.menu = this.value; touch(); };
  var addMn = el('button', 'btn mini', '+菜单');
  addMn.title = '就地新建一个菜单并引用它（菜单选项在下方“④ 下拉菜单”区填写）';
  addMn.onclick = function(){
    var n = prompt('新菜单名（英文标识，如 ports）：');
    if (n === null) return;
    n = n.replace(/^\s+|\s+$/g, '');
    if (!n) return;
    var dup = false;
    state.menus.forEach(function(m){ if (m.name.trim() === n) dup = true; });
    if (dup) { alert('菜单已存在：' + n); return; }
    state.menus.push({ name: n, accept: true, items: '' });
    a.menu = n;
    renderMenus(); refreshMenuSelects(); touch();
    alert('菜单“' + n + '”已创建并引用，请在下方“④ 下拉菜单”区填写选项。');
  };
  var delMn = el('button', 'btn mini danger', '删菜单');
  delMn.title = '删除该参数当前引用的菜单（引用它的所有参数将取消引用）';
  delMn.onclick = function(){
    var n = (a.menu || '').trim();
    if (!n) { alert('该参数尚未引用菜单。'); return; }
    if (!confirm('确定删除菜单“' + n + '”吗？\n（引用该菜单的参数将自动取消引用）')) return;
    var idx = -1;
    state.menus.forEach(function(m, i2){ if (m.name.trim() === n) idx = i2; });
    if (idx < 0) { alert('菜单“' + n + '”不存在（可能已被删除）。'); return; }
    state.menus.splice(idx, 1);
    state.blocks.forEach(function(b){ b.args.forEach(function(a2){ if ((a2.menu || '').trim() === n) a2.menu = ''; }); });
    renderMenus(); refreshMenuSelects(); touch();
  };
  var dv = el('input', 'inp'); dv.placeholder = '默认值'; dv.value = a.default;
  dv.style.maxWidth = '120px';
  dv.title = '参数默认值（可选）：数字类型填数字；布尔参数无默认值';
  if (a.type === 'BOOLEAN') dv.style.display = 'none';
  dv.oninput = function(){ a.default = this.value; touch(); };
  ty.addEventListener('change', function(){ dv.style.display = this.value === 'BOOLEAN' ? 'none' : ''; });
  var del = el('button', 'btn mini danger', '×');
  del.title = '删除该参数';
  del.onclick = function(){
    b.args.splice(b.args.indexOf(a), 1);
    row.parentElement.removeChild(row); touch();
  };
  [nm, ty, mn, addMn, delMn, dv, del].forEach(function(x){ row.appendChild(x); });
  return row;
}

function blockCard(b, i){
  var card = el('div', 'card');
  var head = el('div', 'card-head');
  head.appendChild(el('span', 'no', String(i + 1)));
  var op = el('input', 'inp'); op.placeholder = 'opcode（英文标识，如 sendMsg）'; op.value = b.opcode;
  op.title = '积木 opcode：英文标识（字母开头），代码内按此名称识别积木，新建后避免修改';
  op.oninput = function(){ b.opcode = this.value; touch(); };
  head.appendChild(op);
  var ty = el('select', 'inp'); ty.style.maxWidth = '100px';
  ty.title = '积木类型：命令/报告值/布尔/帽子，决定积木在工具栏中的形态';
  [['COMMAND','命令'],['REPORTER','报告值'],['BOOLEAN','布尔'],['HAT','帽子']].forEach(function(o){ ty.add(new Option(o[1], o[0])); });
  ty.value = b.type;
  ty.onchange = function(){ b.type = this.value; touch(); };
  head.appendChild(ty);
  var del = el('button', 'btn mini danger', '删除');
  del.title = '删除该积木及其实现代码';
  del.onclick = function(){
    if (!confirm('确定删除积木“' + (b.opcode || (i + 1)) + '”吗？')) return;
    state.blocks.splice(i, 1); renderBlocks(); touch();
  };
  head.appendChild(del);

  var body = el('div', 'card-body');
  var r1 = el('div', 'row');
  var txt = el('input', 'inp'); txt.style.flex = '0 1 48%'; txt.placeholder = '积木文本，参数用 [参数名] 占位，如：发送指令[CMD]'; txt.value = b.text;
  txt.title = '积木显示文本：参数用 [参数名] 占位（与下方参数名对应）';
  txt.oninput = function(){ b.text = this.value; touch(); };
  var dsc = el('input', 'inp'); dsc.style.flex = '0 1 50%'; dsc.placeholder = '积木描述（可选，留空默认 block + opcode）'; dsc.value = b.desc || '';
  dsc.title = '积木描述（可选）：保存为 formatMessage 的 description，留空默认为“block + opcode”';
  dsc.oninput = function(){ b.desc = this.value; touch(); };
  r1.appendChild(txt); r1.appendChild(dsc);
  body.appendChild(r1);

  var argsWrap = el('div');
  var lbl = el('div', 'hintline'); lbl.textContent = '参数：'; lbl.style.marginTop = '6px';
  argsWrap.appendChild(lbl);
  function rebuildArgs(){
    Array.prototype.slice.call(argsWrap.querySelectorAll('.arg-row')).forEach(function(x){ x.remove(); });
    b.args.forEach(function(a){ argsWrap.appendChild(argRow(b, a)); });
  }
  rebuildArgs();
  var addArg = el('button', 'btn mini', '+ 参数');
  addArg.style.marginTop = '4px';
  addArg.title = '为该积木添加一个参数';
  addArg.onclick = function(){ b.args.push({ name: '', type: 'STRING', menu: '', default: '' }); rebuildArgs(); touch(); };
  argsWrap.appendChild(addArg);
  body.appendChild(argsWrap);

  var r3 = el('div', 'row');
  var tpl = el('select', 'inp'); tpl.style.maxWidth = '220px';
  tpl.title = '实现模板：插入常用方法体起点代码，可在代码框继续编辑';
  tpl.add(new Option('— 插入实现模板 —', ''));
  [['set','设置变量'],['ret','返回值'],['net','网络请求（nets → PHP）'],['hat','帽子：返回条件'],['empty','清空']].forEach(function(o){ tpl.add(new Option(o[1], o[0])); });
  tpl.onchange = function(){
    if (!this.value) return;
    b.code = TPLS[this.value](b);
    code.value = b.code;
    this.value = '';
    touch();
  };
  var hint = el('span', 'hintline'); hint.textContent = '实现体可用：args、util、this.runtime、上方全局变量';
  r3.appendChild(tpl); r3.appendChild(hint);
  body.appendChild(r3);

  var code = el('textarea', 'code'); code.rows = 5; code.spellcheck = false; code.value = b.code;
  code.title = '该积木的实现代码（方法体）：可用 args.参数名、util、this.runtime 及上方全局变量；Tab 键插入两个空格';
  code.oninput = function(){ b.code = this.value; touch(); };
  code.addEventListener('keydown', function(e){
    if (e.key === 'Tab') {
      e.preventDefault();
      var s = this.selectionStart, epos = this.selectionEnd;
      this.value = this.value.slice(0, s) + '  ' + this.value.slice(epos);
      this.selectionStart = this.selectionEnd = s + 2;
      b.code = this.value; touch();
    }
  });
  body.appendChild(code);

  card.appendChild(head); card.appendChild(body);
  return card;
}

function renderBlocks(){
  var list = $('blockList');
  list.textContent = '';
  state.blocks.forEach(function(b, i){ list.appendChild(blockCard(b, i)); });
}

function refreshMenuSelects(){
  // 菜单增删/改名后，刷新所有参数行的菜单下拉；已删除的菜单引用自动清空
  var names = [];
  state.menus.forEach(function(m){ var n = m.name.trim(); if (n && names.indexOf(n) < 0) names.push(n); });
  Array.prototype.forEach.call(document.querySelectorAll('#blockList select[data-role="menu"]'), function(mn){
    var a = mn.__arg;
    var cur = a ? (a.menu || '') : mn.value;
    mn.textContent = '';
    mn.add(new Option('（无菜单）', ''));
    names.forEach(function(n){ mn.add(new Option(n, n)); });
    mn.value = names.indexOf(cur) >= 0 ? cur : '';
    if (a && a.menu && mn.value === '') a.menu = '';
  });
}

/* ---------- 菜单卡片 ---------- */
function menuCard(m, i){
  var card = el('div', 'card');
  var head = el('div', 'card-head');
  head.appendChild(el('span', 'no', 'M' + (i + 1)));
  var nm = el('input', 'inp'); nm.placeholder = '菜单名（英文，如 ports）'; nm.value = m.name;
  nm.title = '菜单名：英文标识，积木参数通过该名称引用菜单；改名会自动同步所有引用';
  nm.oninput = function(){
    var old = m.name;
    m.name = this.value;
    // 改名后同步所有引用该菜单的参数
    state.blocks.forEach(function(b){ b.args.forEach(function(a){ if (a.menu === old) a.menu = m.name; }); });
    refreshMenuSelects(); touch();
  };
  head.appendChild(nm);
  var acc = el('label'); acc.style.fontSize = '12px';
  acc.title = '是否接受报告器：勾选后下拉菜单可直接接收布尔/报告器连接';
  var cb = el('input'); cb.type = 'checkbox'; cb.checked = !!m.accept;
  cb.title = '是否接受报告器：勾选后下拉菜单可直接接收布尔/报告器连接';
  cb.onchange = function(){ m.accept = this.checked; touch(); };
  acc.appendChild(cb); acc.appendChild(el('span', '', ' 接受报告器'));
  head.appendChild(acc);
  var del = el('button', 'btn mini danger', '删除');
  del.title = '删除该菜单；引用它的积木参数将自动取消引用';
  del.onclick = function(){
    if (!confirm('确定删除菜单“' + (m.name || (i + 1)) + '”吗？\n（引用该菜单的参数将自动取消引用）')) return;
    var removed = m.name;
    state.menus.splice(i, 1); renderMenus();
    state.blocks.forEach(function(b){ b.args.forEach(function(a){ if (a.menu === removed) a.menu = ''; }); });
    refreshMenuSelects(); touch();
  };
  head.appendChild(del);
  var body = el('div', 'card-body');
  var items = el('textarea', 'code'); items.rows = 3; items.spellcheck = false;
  items.placeholder = '每行一项；用“显示文本|实际值”指定不同值，如：\n开|on\n关|off';
  items.title = '菜单选项：每行一项；“显示文本|实际值”可指定下拉显示与实际取值不同';
  items.value = m.items;
  items.oninput = function(){ m.items = this.value; touch(); };
  body.appendChild(items);
  card.appendChild(head); card.appendChild(body);
  return card;
}

function renderMenus(){
  var list = $('menuList');
  list.textContent = '';
  state.menus.forEach(function(m, i){ list.appendChild(menuCard(m, i)); });
}

/* ---------- 扩展选择器 / 在线编辑 / 屏蔽 / 备用库 ---------- */
function renderSelUI(){
  var sel = $('extSel');
  var keep = (MODE === 'edit' && EDIT) ? EDIT.extId : sel.value;
  sel.textContent = '';
  sel.add(new Option('＋ 新建扩展…（使用下方表单新建）', ''));
  var list = (INFO && INFO.blockable) || [];
  list.forEach(function(b){
    sel.add(new Option(b.name + '（' + b.extId + '，模块 ' + (b.implNum - 2) + '~' + b.implNum + '）', b.extId));
  });
  var sbList = (INFO && INFO.standby) || [];
  sbList.forEach(function(s){
    sel.add(new Option((s.name || s.extId) + '（' + s.extId + '，已屏蔽）', s.extId));
  });
  var exists = false;
  for (var i = 0; i < sel.options.length; i++) { if (keep !== '' && sel.options[i].value === keep) { exists = true; break; } }
  if (exists) sel.value = keep;
  else { sel.value = ''; if (keep) exitEdit(); }
  updateSelActionBtn();
}

/* ---------- 在线编辑：载入 / 进入 / 退出 ---------- */
function loadExt(extId){
  $('foot').textContent = '正在载入扩展 ' + extId + ' …';
  fetch('?action=load&extId=' + encodeURIComponent(extId)).then(function(r){ return r.json(); }).then(function(res){
    if (!res.ok) {
      showModal('载入失败', (res.errors || ['未知错误']).map(function(e){ return '✗ ' + e; }).join('\n'),
        [{ t: '返回', cls: 'primary', fn: function(){ resetSel(); return true; } }]);
      $('foot').textContent = '就绪';
      return;
    }
    enterEdit(res);
    $('foot').textContent = '就绪';
  }).catch(function(e){
    showModal('载入失败', '网络错误：' + e.message, [{ t: '关闭', cls: 'primary', fn: function(){ resetSel(); return true; } }]);
    $('foot').textContent = '就绪';
  });
}

function resetSel(){
  $('extSel').value = (MODE === 'edit' && EDIT) ? EDIT.extId : '';
}

function enterEdit(d){
  MODE = 'edit';
  EDIT = {
    extId: d.extId,
    blocked: !!d.blocked,
    name: d.entry.name, desc: d.entry.desc, collab: d.entry.collab, net: !!d.entry.net,
    origName: d.entry.name,
    fn: d.fn, pngNum: d.pngNum, iconNum: d.iconNum, implNum: d.implNum,
    source: d.source, globals: d.globals || '',
    pngName: (d.assets && d.assets.png && d.assets.png.name) || '',
    pngData: (d.assets && d.assets.png && d.assets.png.data) || '',
    svgName: (d.assets && d.assets.svg && d.assets.svg.name) || '',
    svgData: (d.assets && d.assets.svg && d.assets.svg.data) || '',
    pngNew: '', svgNew: '',
    entryM: d.entry.m || 0, entryM1: d.entry.m1 || 0,
    assetPngRaw: d.assetPngRaw || '', assetSvgRaw: d.assetSvgRaw || '',
    entry121Raw: d.entry121Raw || '',
    reg954Frag: d.reg954Frag || '', cfgText: d.cfgText || ''
  };
  $('fExtId').value = EDIT.extId; $('fExtId').disabled = true;
  $('fName').value = EDIT.name; $('fDesc').value = EDIT.desc; $('fCollab').value = EDIT.collab;
  $('fNet').checked = EDIT.net;
  $('fPngName').value = EDIT.pngName; $('fPngName').disabled = true;
  $('fSvgName').value = EDIT.svgName; $('fSvgName').disabled = true;
  var vp = $('vPng');
  if (EDIT.pngData) { vp.src = EDIT.pngData; vp.style.display = 'block'; } else vp.style.display = 'none';
  var vs = $('vSvg');
  if (EDIT.svgData) { vs.src = EDIT.svgData; vs.style.display = 'block'; } else vs.style.display = 'none';
  $('hintPng').textContent = EDIT.blocked
    ? '（已屏蔽）可另选 PNG 替换备用库中的背景图（解除屏蔽时随档案回迁）：' + EDIT.pngName
    : '可另选 PNG 覆盖替换（原名 ' + EDIT.pngName + ' 不变）';
  $('hintSvg').textContent = EDIT.blocked
    ? '（已屏蔽）可另选图片替换备用库中的图标（扩展名需与原名一致，如 ' + EDIT.svgName + '）'
    : '可另选图片覆盖替换（扩展名需与原名一致，如 ' + EDIT.svgName + '）';
  $('fGlobals').value = EDIT.globals;
  $('fSrc').value = EDIT.source;
  $('fsGlobals').style.display = 'none';
  $('fsOpts').style.display = 'none';
  $('fsBlocks').style.display = 'none';
  $('fsMenus').style.display = 'none';
  $('fsSrc').style.display = '';
  $('fsCards').style.display = '';
  $('editMeta').style.display = '';
  $('editMeta').textContent = EDIT.blocked
    ? '正在编辑（已屏蔽）：' + EDIT.extId + ' · 档案模块 ' + EDIT.pngNum + '/' + EDIT.iconNum + '/' + EDIT.implNum + '（解除屏蔽时排到模块号末尾并重编） · 954 入口 ' + EDIT.fn + ' · imports ' + EDIT.entryM + '/' + EDIT.entryM1
    : '正在编辑：' + EDIT.extId + ' · 模块 ' + EDIT.pngNum + '（背景）/ ' + EDIT.iconNum + '（图标）/ ' + EDIT.implNum + '（实现） · 954 入口 ' + EDIT.fn + ' · imports ' + EDIT.entryM + '/' + EDIT.entryM1;
  $('btnExample').disabled = true;
  $('btnClear').disabled = true;
  $('btnSave').textContent = EDIT.blocked ? '仅保存（继续屏蔽）' : '保存修改';
  $('btnUnblock').style.display = EDIT.blocked ? '' : 'none';
  setTabsEditMode(true);
  setTab('impl');
  EDIT.view = 'src'; EDIT.cards = null;
  if (enterCardsInit()) {
    EDIT.view = 'cards';
    $('cardsHint').textContent = '已解析实现文件，可用卡片编辑积木/菜单/方法体；复杂改动请切源码编辑。';
  } else {
    $('cardsHint').textContent = '该扩展含暂不支持自动解析的结构，请使用源码编辑（可先修改后重试卡片）。';
  }
  applyEditView();
  renderEditPreview();
}

/* ---------- 编辑卡片模式 ---------- */
function enterCardsInit(){
  if (!EDIT) return false;
  var r = parseImpl(EDIT.source, EDIT.extId);
  if (!r.ok) { EDIT.cards = null; return false; }
  EDIT.cards = {
    parsed: r,
    dirtyBlocks: {}, deletedBlocks: {}, dirtyMethods: {}, dirtyMenus: {}, deletedMenus: {},
    origOpcodes: {}, origMenuNames: {},
    globalsValue: r.globals ? r.globals.text.replace(/\n$/, '') : '',
    dirtyGlobals: false,
    addedBlocks: [],
    addedMenus: []
  };
  return true;
}

function applyEditView(){
  if (!EDIT) return;
  var cards = EDIT.view === 'cards' && EDIT.cards;
  $('cardsWrap').style.display = cards ? '' : 'none';
  $('fSrc').style.display = cards ? 'none' : '';
  $('btnViewCards').className = 'btn mini' + (cards ? ' primary' : '');
  $('btnViewSrc').className = 'btn mini' + (cards ? '' : ' primary');
  if (cards) renderEditCards();
}

function switchEditView(to){
  if (!EDIT) return;
  if (to === 'cards') {
    var cur = $('fSrc').value;
    if (!cur.trim()) return;
    var r = parseImpl(cur, EDIT.extId);
    if (!r.ok) {
      showModal('无法使用卡片编辑', '当前源码包含暂不支持自动解析的结构：\n✗ ' + (r.reason || '未知原因') + '\n\n请继续使用源码编辑。', [{ t: '返回', cls: 'primary' }]);
      return;
    }
    EDIT.source = cur;
    $('fSrc').value = cur;
    if (!enterCardsInit()) return;
    EDIT.view = 'cards';
    $('cardsHint').textContent = '已解析当前源码，卡片编辑已启用；复杂改动请切源码编辑。';
  } else {
    if (EDIT.view === 'cards' && EDIT.cards) $('fSrc').value = deriveCardsSrc();
    EDIT.view = 'src';
  }
  applyEditView();
  renderEditPreview();
}

function addedToParsed(b){
  return {
    opcode: b.opcode, text: b.text, textDesc: b.desc || ('block ' + (b.opcode || '')), textId: '',
    type: b.type, textStyle: 'fmt',
    args: (b.args || []).map(function(a){
      return { name: a.name, type: a.type, typeNs: 'ArgumentType', menu: a.menu || '', dvKind: 'str', dvValue: a.default || '', dvRaw: '' };
    }),
    extras: {}, fieldsOrder: null
  };
}

function deriveCardsSrc(){
  var C = EDIT.cards, src = EDIT.source, changes = [];
  var P = C.parsed;
  // 扩展显示名唯一入口：左侧“基本信息→显示名称”（EDIT.name），实现文件 nameDefault 保存时自动跟随统一
  if (P.nameDefault && P.nameDefault.value !== EDIT.name.trim()) {
    changes.push({ start: P.nameDefault.start, end: P.nameDefault.end, text: sq(EDIT.name.trim()) });
  }
  // 全局变量/初始化代码：始终可编辑；输入规范化后与原文不同才替换
  if (C.dirtyGlobals) {
    var gv = String(C.globalsValue || '').replace(/\r/g, '');
    if (gv.trim() !== '' && gv.charAt(gv.length - 1) !== '\n') gv += '\n';
    if (!gv.trim()) gv = '';
    if (gv !== P.globals.text) {
      changes.push({ start: P.globals.start, end: P.globals.end, text: gv });
    }
  }
  P.menus.forEach(function(m, j){
    if (m.dynamic || C.deletedMenus[j] || !C.dirtyMenus[j]) return;
    var ls = lxLineStart(src, m.start);
    var ind = src.slice(ls, m.start).length;
    changes.push({ start: m.start, end: m.end, text: regenMenusObj(m, ind + 2) });
  });
  P.blocks.forEach(function(b, i){
    if (C.deletedBlocks[i] || !C.dirtyBlocks[i]) return;
    var fi = opcodeLineIndent(src, b.opSpan.start);
    changes.push({ start: b.start, end: b.end, text: regenBlockObj(b, EDIT.extId, fi) });
  });
  P.methods.forEach(function(m, i){
    if (!C.dirtyMethods[i] || !m.hasValue) return;
    changes.push({ start: m.bodyStart, end: m.bodyEnd, text: m.bodyText });
  });
  // opcode 改名：同步方法 key 字面量（保留原引号风格）与函数名（方法条目头，与体积木/方法体区间不交叉）
  P.blocks.forEach(function(b, i){
    var oldOp = C.origOpcodes[i];
    if (oldOp === undefined || oldOp === b.opcode) return;
    P.methods.forEach(function(m){
      if (!m.hasValue || m.key !== b.opcode) return;
      if (m.keyLitStart != null) {
        var q = src[m.keyLitStart]; // 原引号字符：旧文件双引号、新文件单引号，保持风格不变
        changes.push({ start: m.keyLitStart, end: m.keyLitEnd, text: q + b.opcode + q });
      }
      if (m.fnName) changes.push({ start: m.fnNameStart, end: m.fnNameEnd, text: b.opcode });
    });
  });
  // 菜单改名：替换 menus 属性 key，并同步参数引用（内存已在输入时同步）
  P.menus.forEach(function(m, j){
    var oldName = C.origMenuNames[j];
    if (oldName === undefined || oldName === m.name || !m.nameLit || C.deletedMenus[j]) return;
    changes.push({ start: m.nameLit.start, end: m.nameLit.end, text: m.name });
  });
  // 菜单删除：从源码移除整段（含 key 与尾逗号；引用已在删除时清空）
  // 注意菜单条目形如 "name: {...}"，不能直接用 delSpanOf（其 idx=0 分支按无 key 的数组元素设计）
  P.menus.forEach(function(m, j){
    if (!C.deletedMenus[j]) return;
    var ks = m.nameLit ? m.nameLit.start : m.start;
    if (j > 0) changes.push({ start: P.menus[j - 1].end, end: m.end, text: '' });
    else if (P.menus.length > 1) changes.push({ start: ks, end: P.menus[1].nameLit ? P.menus[1].nameLit.start : P.menus[1].start, text: '' });
    else changes.push({ start: ks, end: m.end, text: '' });
  });
  var methodsWithValue = P.methods.filter(function(m){ return m.hasValue; });
  P.blocks.forEach(function(b, i){
    if (!C.deletedBlocks[i]) return;
    changes.push(delSpanOf(P.blocks, i));
    for (var k = 0; k < methodsWithValue.length; k++) {
      if (methodsWithValue[k].key === b.opcode) { changes.push(delSpanOf(methodsWithValue, k)); break; }
    }
  });
  if (C.addedBlocks.length) {
    var fiRef = 6;
    for (var i2 = P.blocks.length - 1; i2 >= 0; i2--) {
      if (!C.deletedBlocks[i2]) { fiRef = opcodeLineIndent(src, P.blocks[i2].opSpan.start); break; }
    }
    var objTexts = C.addedBlocks.map(function(b){ return regenBlockObj(addedToParsed(b), EDIT.extId, fiRef); });
    changes.push({ start: P.blocksArr.close, end: P.blocksArr.close, text: ',\n' + rep(fiRef - 2) + objTexts.join(',\n' + rep(fiRef - 2)) });
    if (methodsWithValue.length) {
      var lastM = methodsWithValue[methodsWithValue.length - 1];
      var mfi = opcodeLineIndent(src, lastM.entryStart) + 2;
      var mTexts = C.addedBlocks.map(function(b){ return regenMethodEntry(b.opcode, b.code || '', mfi); });
      changes.push({ start: lastM.entryEnd, end: lastM.entryEnd, text: ',\n' + rep(mfi - 2) + mTexts.join(',\n' + rep(mfi - 2)) });
    }
  }
  // 新增菜单：插入到最后一个未删除的解析菜单之后（缩进锚定菜单 key 行缩进）
  // 依赖稳定排序：与“菜单删除”等 changes 同起点时本段后 push 后执行，先删后插坐标不失效
  if ((C.addedMenus || []).length) {
    var lastMenu = null;
    for (var jm = P.menus.length - 1; jm >= 0; jm--) { if (!C.deletedMenus[jm]) { lastMenu = P.menus[jm]; break; } }
    if (lastMenu) {
      var mnFi = opcodeLineIndent(src, lastMenu.nameLit ? lastMenu.nameLit.start : lastMenu.start);
      var mnTexts = C.addedMenus.map(function(mn){ return mn.name + ': ' + regenMenusObj(mn, mnFi + 2); });
      changes.push({ start: lastMenu.end, end: lastMenu.end, text: ',\n' + rep(mnFi) + mnTexts.join(',\n' + rep(mnFi)) });
    }
  }
  changes.sort(function(a, b){ return b.start - a.start; });
  var lastStart = Infinity;
  for (var ci = 0; ci < changes.length; ci++) {
    if (changes[ci].start > lastStart) throw new Error('卡片变更区间交叉，请改用源码编辑');
    lastStart = changes[ci].start;
  }
  return rebuildSrc(src, changes);
}

function currentEditSrc(){
  if (MODE === 'edit' && EDIT && EDIT.view === 'cards' && EDIT.cards) return deriveCardsSrc();
  return $('fSrc').value;
}

function applyNameSync(src){
  // 显示名称唯一入口统一：无论哪个视图，保存前把实现文件的扩展名（nameDefault）同步为左侧“显示名称”
  if (!EDIT || !src) return src;
  var r = parseImpl(src, EDIT.extId);
  if (r.ok && r.nameDefault && r.nameDefault.value !== EDIT.name.trim()) {
    return src.slice(0, r.nameDefault.start) + sq(EDIT.name.trim()) + src.slice(r.nameDefault.end);
  }
  return src;
}

function renderEditCards(){
  var C = EDIT.cards; if (!C) return;
  var wrap = $('cardsWrap');
  wrap.textContent = '';
  var nh = el('div', 'hintline'); nh.style.marginBottom = '4px';
  nh.textContent = '扩展显示名唯一入口：左侧“② 基本信息→显示名称”（当前：' + EDIT.name.trim() + '）；保存时自动同步到实现文件与 121 库条目，此处不再单独编辑。';
  wrap.appendChild(nh);
  var gc = el('div', 'card');
  var ghead = el('div', 'card-head');
  ghead.appendChild(el('span', 'no', 'G'));
  ghead.appendChild(el('span', 'hintline', ' 全局变量 / 初始化代码（方法体中可直接使用）'));
  gc.appendChild(ghead);
  var gbody = el('div', 'card-body');
  var gta = el('textarea', 'code'); gta.rows = 3; gta.spellcheck = false;
  gta.placeholder = '无全局变量。可直接输入，如：\nvar SERVER_TIMEOUT = 10000;\nvar MYSTATE = \'\';';
  gta.value = C.globalsValue;
  gta.title = '全局变量/初始化代码：位于图标引用行之后、扩展类定义之前；方法体中可直接引用；清空表示无全局变量';
  gta.oninput = function(){ C.globalsValue = this.value; C.dirtyGlobals = true; editTouch(); };
  gbody.appendChild(gta);
  gc.appendChild(gbody);
  wrap.appendChild(gc);
  var bt = el('div', 'fs-t'); bt.style.marginTop = '8px';
  bt.appendChild(el('span', '', '积木（' + C.parsed.blocks.length + '）'));
  var addB = el('button', 'btn mini', '+ 添加积木');
  addB.onclick = function(){
    C.addedBlocks.push({ opcode: '', text: '', type: 'COMMAND', desc: '', args: [], code: 'return;' });
    renderEditCards(); editTouch();
  };
  bt.appendChild(addB);
  bt.appendChild(el('span', 'hintline', ' 新增积木的 opcode 必填；参数文本用 [参数名] 占位'));
  wrap.appendChild(bt);
  C.parsed.blocks.forEach(function(b, i){
    if (C.deletedBlocks[i]) return;
    wrap.appendChild(eblockCard(b, i));
  });
  C.addedBlocks.forEach(function(b, k){ wrap.appendChild(eaddedCard(b, k)); });
  var mt = el('div', 'fs-t'); mt.style.marginTop = '8px';
  var menuCnt = 0;
  C.parsed.menus.forEach(function(m, j){ if (!C.deletedMenus[j]) menuCnt++; });
  menuCnt += (C.addedMenus || []).length;
  mt.appendChild(el('span', '', '菜单（' + menuCnt + '）'));
  wrap.appendChild(mt);
  C.parsed.menus.forEach(function(m, j){ if (C.deletedMenus[j]) return; wrap.appendChild(emenuCard(m, j)); });
  (C.addedMenus || []).forEach(function(m, k){ wrap.appendChild(emenuCard(m, k, true)); });
}

function editMenuNameList(){
  var names = [];
  if (EDIT && EDIT.cards) {
    EDIT.cards.parsed.menus.forEach(function(m, j){ if (!EDIT.cards.deletedMenus[j]) names.push(m.name); });
    (EDIT.cards.addedMenus || []).forEach(function(m){ names.push(m.name); });
  }
  return names;
}
function editMenuInsertable(){
  if (!EDIT || !EDIT.cards) return false;
  for (var j = 0; j < EDIT.cards.parsed.menus.length; j++) if (!EDIT.cards.deletedMenus[j]) return true;
  return false;
}

function refreshEditMenuSelects(){
  // 菜单增删/改名后刷新所有参数行菜单下拉，断链引用自动清空
  var names = editMenuNameList();
  Array.prototype.forEach.call(document.querySelectorAll('#cardsWrap select[data-role="emenu"]'), function(mn){
    var a = mn.__arg;
    var cur = a ? (a.menu || '') : mn.value;
    mn.textContent = '';
    mn.add(new Option('（无菜单）', ''));
    names.forEach(function(n){ mn.add(new Option(n, n)); });
    mn.value = names.indexOf(cur) >= 0 ? cur : '';
    if (a && a.menu && mn.value === '') a.menu = '';
  });
}

function eargRow(a, dirty, deletedCb){
  var row = el('div', 'arg-row');
  var nm = el('input', 'inp'); nm.placeholder = '参数名'; nm.value = a.name; nm.style.maxWidth = '110px';
  nm.title = '参数名：英文标识，积木文本中用 [参数名] 引用，实现代码中通过 args.参数名 取值';
  nm.oninput = function(){ a.name = this.value; dirty(); };
  var ty = el('select', 'inp'); ty.style.maxWidth = '100px';
  ty.title = '参数类型：文本/数字/角度/布尔/颜色，决定输入控件形态';
  [['STRING','文本'],['NUMBER','数字'],['ANGLE','角度'],['BOOLEAN','布尔'],['COLOR','颜色']].forEach(function(o){ ty.add(new Option(o[1], o[0])); });
  ty.value = ARG_KNOWN_TYPES.indexOf(a.type) >= 0 ? a.type : 'STRING';
  ty.onchange = function(){ a.type = this.value; dirty(); };
  var mn = el('select', 'inp'); mn.style.maxWidth = '130px';
  mn.setAttribute('data-role', 'emenu');
  mn.__arg = a;
  mn.title = '参数的下拉菜单：从本扩展已定义的菜单中选择，选“（无菜单）”取消引用；也可就地新建/删除菜单';
  mn.add(new Option('（无菜单）', ''));
  var menuList = editMenuNameList();
  menuList.forEach(function(n){ mn.add(new Option(n, n)); });
  mn.value = menuList.indexOf(a.menu || '') >= 0 ? a.menu : '';
  mn.onchange = function(){ a.menu = this.value; dirty(); };
  var addMn = el('button', 'btn mini', '+菜单');
  addMn.title = '就地新建一个菜单并引用它（保存时写入源码）';
  addMn.onclick = function(){
    var n = prompt('新菜单名（英文标识，如 ports）：');
    if (n === null) return;
    n = n.replace(/^\s+|\s+$/g, '');
    if (!n) return;
    if (editMenuNameList().indexOf(n) >= 0) { alert('菜单已存在：' + n); return; }
    if (!editMenuInsertable()) { alert('当前源码没有可定位的菜单区（无任何菜单），无法自动插入新菜单，请切“源码编辑”手动添加。'); return; }
    EDIT.cards.addedMenus.push({ name: n, accept: false, items: [], dynamic: false });
    a.menu = n;
    renderEditCards(); editTouch();
  };
  var delMn = el('button', 'btn mini danger', '删菜单');
  delMn.title = '删除该参数当前引用的菜单（引用它的所有积木参数将取消引用，保存时生效）';
  delMn.onclick = function(){
    var n = (a.menu || '').trim();
    if (!n) { alert('该参数尚未引用菜单。'); return; }
    if (!confirm('确定删除菜单“' + n + '”吗？\n（引用该菜单的积木参数将自动取消引用，保存时生效）')) return;
    var C = EDIT.cards;
    var ai = -1;
    (C.addedMenus || []).forEach(function(m, i2){ if (m.name === n) ai = i2; });
    if (ai >= 0) {
      C.addedMenus.splice(ai, 1);
    } else {
      C.parsed.menus.forEach(function(m, j){ if (m.name === n) C.deletedMenus[j] = true; });
    }
    C.parsed.blocks.forEach(function(b, bi){ b.args.forEach(function(a2){ if ((a2.menu || '').trim() === n) { a2.menu = ''; C.dirtyBlocks[bi] = true; } }); });
    (C.addedBlocks || []).forEach(function(b){ b.args.forEach(function(a2){ if ((a2.menu || '').trim() === n) a2.menu = ''; }); });
    refreshEditMenuSelects(); renderEditCards(); editTouch();
  };
  var dv = el('input', 'inp'); dv.placeholder = '默认值'; dv.value = a.dvValue == null ? '' : String(a.dvValue); dv.style.maxWidth = '120px';
  dv.title = '参数默认值（可选）：数字类型填数字；布尔参数无默认值';
  if (a.dvKind === 'raw') { dv.disabled = true; dv.title = '该默认值为标识符/枚举形态，请切源码编辑修改'; }
  if (a.type === 'BOOLEAN' || a.dvKind === 'none') dv.style.display = 'none';
  dv.oninput = function(){
    a.dvValue = this.value;
    if (a.dvKind === 'num' && this.value.trim() !== '' && !/^-?\d+(\.\d+)?$/.test(this.value.trim())) dv.style.borderColor = '#e5484d';
    else dv.style.borderColor = '';
    dirty();
  };
  ty.addEventListener('change', function(){ dv.style.display = this.value === 'BOOLEAN' ? 'none' : ''; });
  [nm, ty, mn, addMn, delMn, dv].forEach(function(x){ row.appendChild(x); });
  if (deletedCb) {
    var del = el('button', 'btn mini danger', '×');
    del.title = '删除该参数';
    del.onclick = deletedCb;
    row.appendChild(del);
  }
  return row;
}

function codeTA(getVal, setVal){
  var code = el('textarea', 'code'); code.rows = 4; code.spellcheck = false; code.value = getVal();
  code.title = '该积木的实现代码（方法体）：可用 args.参数名、util、this.runtime 及顶部全局变量；Tab 键插入两个空格';
  code.oninput = function(){ setVal(this.value); editTouch(); };
  code.addEventListener('keydown', function(e){
    if (e.key === 'Tab') {
      e.preventDefault();
      var s = this.selectionStart, epos = this.selectionEnd;
      this.value = this.value.slice(0, s) + '  ' + this.value.slice(epos);
      this.selectionStart = this.selectionEnd = s + 2;
      setVal(this.value); editTouch();
    }
  });
  return code;
}

function eblockCard(b, i){
  var C = EDIT.cards;
  function dirty(){ C.dirtyBlocks[i] = true; editTouch(); }
  var card = el('div', 'card');
  var head = el('div', 'card-head');
  head.appendChild(el('span', 'no', String(i + 1)));
  var op = el('input', 'inp'); op.value = b.opcode; op.readOnly = true; op.style.maxWidth = '160px';
  op.title = '积木 opcode（只读，双击解锁修改）。修改会同步方法 key 与函数名；已存项目按 opcode 匹配积木，改名后旧项目中该积木将失效';
  op.addEventListener('dblclick', function(){
    this.readOnly = false; this.style.borderColor = '#e5484d';
    this.focus(); this.select();
    this.title = '正在修改 opcode：保存时同步方法 key 与函数名；已存项目按旧 opcode 匹配的积木会失效，请谨慎';
  });
  op.addEventListener('blur', function(){ this.readOnly = true; this.style.borderColor = ''; });
  op.oninput = function(){
    if (this.readOnly) return;
    var prevOp = b.opcode;
    b.opcode = this.value;
    if (C.origOpcodes[i] === undefined) C.origOpcodes[i] = prevOp;
    C.parsed.methods.forEach(function(m){ if (m.key === prevOp) { m.key = b.opcode; m.fnName = b.opcode; } });
    C.dirtyBlocks[i] = true; editTouch();
  };
  head.appendChild(op);
  var ty = el('select', 'inp'); ty.style.maxWidth = '100px';
  ty.title = '积木类型：命令/报告值/布尔/帽子，决定积木在工具栏中的形态';
  [['COMMAND','命令'],['REPORTER','报告值'],['BOOLEAN','布尔'],['HAT','帽子']].forEach(function(o){ ty.add(new Option(o[1], o[0])); });
  ty.value = b.type;
  ty.onchange = function(){ b.type = this.value; dirty(); };
  head.appendChild(ty);
  var del = el('button', 'btn mini danger', '删除');
  del.title = '删除该积木及其对应方法体（保存时生效）';
  del.onclick = function(){
    if (!confirm('确定删除积木“' + b.opcode + '”吗？\n（对应方法体将一并移除，保存时生效）')) return;
    C.deletedBlocks[i] = true; delete C.dirtyBlocks[i];
    C.parsed.methods.forEach(function(m, mi){ if (m.key === b.opcode) delete C.dirtyMethods[mi]; });
    renderEditCards(); editTouch();
  };
  head.appendChild(del);
  var body = el('div', 'card-body');
  var r1 = el('div', 'row');
  var txt = el('input', 'inp'); txt.style.flex = '0 1 50%'; txt.value = b.text;
  txt.placeholder = '积木文本，参数用 [参数名] 占位';
  txt.title = '积木显示文本：参数用 [参数名] 占位（与下方参数名对应），修改只影响显示不影响 opcode';
  txt.oninput = function(){ b.text = this.value; C.dirtyBlocks[i] = true; editTouch(); };
  var dsc = el('input', 'inp'); dsc.style.flex = '0 1 50%'; dsc.value = b.textDesc || '';
  dsc.placeholder = '积木描述（可选）；留空为无描述，填入后保存为 formatMessage 形态';
  dsc.title = '积木描述（可选）：保存为 formatMessage 的 description；留空则不生成描述';
  dsc.oninput = function(){
    if (this.value) { b.textStyle = 'fmt'; b.textDesc = this.value; }
    else { b.textStyle = 'plain'; b.textDesc = ''; }
    C.dirtyBlocks[i] = true; editTouch();
  };
  r1.appendChild(txt); r1.appendChild(dsc);
  body.appendChild(r1);
  var argsWrap = el('div');
  var lbl = el('div', 'hintline'); lbl.textContent = '参数：'; lbl.style.marginTop = '6px';
  argsWrap.appendChild(lbl);
  function rebuildArgs(){
    Array.prototype.slice.call(argsWrap.querySelectorAll('.arg-row')).forEach(function(x){ x.remove(); });
    b.args.forEach(function(a, ai){
      argsWrap.appendChild(eargRow(a, dirty, function(){
        b.args.splice(ai, 1); dirty(); renderEditCards();
      }));
    });
  }
  rebuildArgs();
  var addArg = el('button', 'btn mini', '+ 参数');
  addArg.style.marginTop = '4px';
  addArg.onclick = function(){
    b.args.push({ name: '', type: 'STRING', typeNs: 'ArgumentType', menu: '', dvKind: 'str', dvValue: '', dvRaw: '' });
    dirty(); renderEditCards();
  };
  argsWrap.appendChild(addArg);
  body.appendChild(argsWrap);
  var mIdx = -1;
  C.parsed.methods.forEach(function(m, mi){ if (m.key === b.opcode && m.hasValue) mIdx = mi; });
  if (mIdx >= 0) {
    var m = C.parsed.methods[mIdx];
    var code = codeTA(function(){ return m.bodyText; }, function(v){ m.bodyText = v; C.dirtyMethods[mIdx] = true; });
    body.appendChild(code);
  } else {
    body.appendChild(el('div', 'hintline', '（未找到对应方法体，请切源码编辑）'));
  }
  card.appendChild(head); card.appendChild(body);
  return card;
}

function eaddedCard(b, k){
  var C = EDIT.cards;
  function dirty(){ editTouch(); }
  var card = el('div', 'card');
  card.style.borderColor = '#7aa7e0';
  var head = el('div', 'card-head');
  head.appendChild(el('span', 'no', '+' + (k + 1)));
  var op = el('input', 'inp'); op.placeholder = 'opcode（英文标识，必填）'; op.value = b.opcode; op.style.maxWidth = '160px';
  op.title = '新增积木的 opcode：英文标识（字母开头），保存时生成对应方法条目';
  op.oninput = function(){ b.opcode = this.value; dirty(); };
  head.appendChild(op);
  var ty = el('select', 'inp'); ty.style.maxWidth = '100px';
  ty.title = '积木类型：命令/报告值/布尔/帽子，决定积木在工具栏中的形态';
  [['COMMAND','命令'],['REPORTER','报告值'],['BOOLEAN','布尔'],['HAT','帽子']].forEach(function(o){ ty.add(new Option(o[1], o[0])); });
  ty.value = b.type;
  ty.onchange = function(){ b.type = this.value; dirty(); };
  head.appendChild(ty);
  var del = el('button', 'btn mini danger', '取消');
  del.title = '取消新增该积木（尚未保存，不影响现有文件）';
  del.onclick = function(){ C.addedBlocks.splice(k, 1); renderEditCards(); editTouch(); };
  head.appendChild(del);
  var body = el('div', 'card-body');
  var r1 = el('div', 'row');
  var txt = el('input', 'inp'); txt.style.flex = '0 1 50%'; txt.placeholder = '积木文本，参数用 [参数名] 占位'; txt.value = b.text;
  txt.title = '积木显示文本：参数用 [参数名] 占位（与下方参数名对应）';
  txt.oninput = function(){ b.text = this.value; dirty(); };
  var dsc = el('input', 'inp'); dsc.style.flex = '0 1 50%'; dsc.placeholder = '积木描述（可选，留空默认 block + opcode）'; dsc.value = b.desc || '';
  dsc.title = '积木描述（可选）：保存为 formatMessage 的 description，留空默认为“block + opcode”';
  dsc.oninput = function(){ b.desc = this.value; dirty(); };
  r1.appendChild(txt); r1.appendChild(dsc);
  body.appendChild(r1);
  var argsWrap = el('div');
  var lbl = el('div', 'hintline'); lbl.textContent = '参数：'; lbl.style.marginTop = '6px';
  argsWrap.appendChild(lbl);
  function rebuildArgs(){
    Array.prototype.slice.call(argsWrap.querySelectorAll('.arg-row')).forEach(function(x){ x.remove(); });
    b.args.forEach(function(a, ai){
      argsWrap.appendChild(eargRow(a, dirty, function(){
        b.args.splice(ai, 1); renderEditCards(); dirty();
      }));
    });
  }
  rebuildArgs();
  var addArg = el('button', 'btn mini', '+ 参数');
  addArg.style.marginTop = '4px';
  addArg.onclick = function(){
    b.args.push({ name: '', type: 'STRING', typeNs: 'ArgumentType', menu: '', dvKind: 'str', dvValue: '', dvRaw: '' });
    renderEditCards(); dirty();
  };
  argsWrap.appendChild(addArg);
  body.appendChild(argsWrap);
  var r3 = el('div', 'row');
  var tpl = el('select', 'inp'); tpl.style.maxWidth = '220px';
  tpl.title = '实现模板：插入常用方法体起点代码，可在代码框继续编辑';
  tpl.add(new Option('— 插入实现模板 —', ''));
  [['set','设置变量'],['ret','返回值'],['net','网络请求（nets → PHP）'],['hat','帽子：返回条件'],['empty','清空']].forEach(function(o){ tpl.add(new Option(o[1], o[0])); });
  tpl.onchange = function(){
    if (!this.value) return;
    b.code = TPLS[this.value](b);
    renderEditCards();
    this.value = '';
    dirty();
  };
  var hint = el('span', 'hintline'); hint.textContent = '实现体可用：args、util、this.runtime、上方全局变量';
  r3.appendChild(tpl); r3.appendChild(hint);
  body.appendChild(r3);
  body.appendChild(codeTA(function(){ return b.code; }, function(v){ b.code = v; }));
  card.appendChild(head); card.appendChild(body);
  return card;
}

function emenuCard(m, j, isNew){
  var C = EDIT.cards;
  var card = el('div', 'card');
  var head = el('div', 'card-head');
  head.appendChild(el('span', 'no', isNew ? '+' : 'M' + (j + 1)));
  var nm = el('input', 'inp'); nm.value = m.name; nm.readOnly = true; nm.style.maxWidth = '160px';
  nm.title = isNew ? '新增菜单名（创建时确定，保存时写入源码）' : '菜单名（只读，双击解锁修改）。修改会同步所有引用该菜单的积木参数';
  if (!isNew) {
    nm.addEventListener('dblclick', function(){
      this.readOnly = false; this.style.borderColor = '#e5484d';
      this.focus(); this.select();
      this.title = '正在修改菜单名：保存时同步所有引用该菜单的积木参数';
    });
    nm.addEventListener('blur', function(){ this.readOnly = true; this.style.borderColor = ''; });
    nm.oninput = function(){
      if (this.readOnly) return;
      var prev = m.name;
      m.name = this.value;
      if (C.origMenuNames[j] === undefined) C.origMenuNames[j] = prev;
      C.parsed.blocks.forEach(function(b, bi){
        b.args.forEach(function(a){ if (a.menu === prev) { a.menu = m.name; C.dirtyBlocks[bi] = true; } });
      });
      C.dirtyMenus[j] = true; refreshEditMenuSelects(); editTouch();
    };
  }
  head.appendChild(nm);
  var mdel = el('button', 'btn mini danger', '删除');
  mdel.title = isNew ? '取消新增该菜单（尚未保存，不影响现有文件）' : '删除该菜单；引用它的积木参数将自动取消引用（保存时生效）';
  mdel.onclick = function(){
    if (isNew) {
      if (!confirm('取消新增菜单“' + m.name + '”？（引用它的积木参数将取消引用）')) return;
      var ki = C.addedMenus.indexOf(m);
      if (ki >= 0) C.addedMenus.splice(ki, 1);
      C.parsed.blocks.forEach(function(b, bi){ b.args.forEach(function(a){ if (a.menu === m.name) { a.menu = ''; C.dirtyBlocks[bi] = true; } }); });
      (C.addedBlocks || []).forEach(function(b){ b.args.forEach(function(a){ if (a.menu === m.name) a.menu = ''; }); });
      refreshEditMenuSelects(); renderEditCards(); editTouch();
      return;
    }
    if (!confirm('确定删除菜单“' + m.name + '”吗？\n（引用该菜单的积木参数将自动取消引用，保存时生效）')) return;
    C.deletedMenus[j] = true;
    C.parsed.blocks.forEach(function(b, bi){
      b.args.forEach(function(a){ if (a.menu === m.name) { a.menu = ''; C.dirtyBlocks[bi] = true; } });
    });
    (C.addedBlocks || []).forEach(function(b){ b.args.forEach(function(a){ if (a.menu === m.name) a.menu = ''; }); });
    refreshEditMenuSelects(); renderEditCards(); editTouch();
  };
  head.appendChild(mdel);
  if (m.dynamic) {
    head.appendChild(el('span', 'hintline', ' 动态菜单（items 为函数调用），请切源码编辑修改'));
    card.appendChild(head);
    return card;
  }
  var acc = el('label'); acc.style.fontSize = '12px';
  acc.title = '是否接受报告器：勾选后下拉菜单可直接接收布尔/报告器连接';
  var cb = el('input'); cb.type = 'checkbox'; cb.checked = !!m.accept;
  cb.title = '是否接受报告器：勾选后下拉菜单可直接接收布尔/报告器连接';
  cb.onchange = function(){ m.accept = this.checked; if (!isNew) C.dirtyMenus[j] = true; editTouch(); };
  acc.appendChild(cb); acc.appendChild(el('span', '', ' 接受报告器'));
  head.appendChild(acc);
  card.appendChild(head);
  var body = el('div', 'card-body');
  var items = el('textarea', 'code'); items.rows = 3; items.spellcheck = false;
  items.placeholder = '每行一项；用“显示文本|实际值”指定不同值，如：\n开|on\n关|off';
  items.title = '菜单选项：每行一项；“显示文本|实际值”可指定下拉显示与实际取值不同';
  items.value = (m.items || []).map(function(x){ return x.text === x.value ? x.text : (x.text + '|' + x.value); }).join('\n');
  items.oninput = function(){
    var arr = [];
    this.value.split('\n').forEach(function(line){
      line = line.replace(/^\s+|\s+$/g, '');
      if (!line) return;
      var p = line.split('|');
      if (p.length >= 2) arr.push({ text: p[0], value: p.slice(1).join('|') });
      else arr.push({ text: p[0], value: p[0] });
    });
    m.items = arr; if (!isNew) C.dirtyMenus[j] = true; editTouch();
  };
  body.appendChild(items);
  card.appendChild(body);
  return card;
}

function exitEdit(){
  if (MODE !== 'edit') return;
  MODE = 'create'; EDIT = null;
  $('fExtId').disabled = false;
  $('fPngName').disabled = false; $('fSvgName').disabled = false;
  $('fsGlobals').style.display = ''; $('fsOpts').style.display = '';
  $('fsBlocks').style.display = ''; $('fsMenus').style.display = '';
  $('fsSrc').style.display = 'none';
  $('fsCards').style.display = 'none';
  $('cardsWrap').textContent = '';
  $('editMeta').style.display = 'none';
  $('hintPng').textContent = ''; $('hintSvg').textContent = '';
  $('btnExample').disabled = false;
  $('btnClear').disabled = false;
  $('btnSave').textContent = '生成并保存';
  $('btnUnblock').style.display = 'none';
  setTabsEditMode(false);
  refreshBasic(); renderBlocks(); renderMenus(); regen();
}

function editTouch(){
  clearTimeout(TMR2);
  TMR2 = setTimeout(renderEditPreview, 250);
}

function genEditEntry(){
  var v1 = '_' + EDIT.extId + '_' + EDIT.extId + '_png__WEBPACK_IMPORTED_MODULE_' + EDIT.entryM + '__';
  var v2 = '_' + EDIT.extId + '_' + EDIT.extId + '_small_svg__WEBPACK_IMPORTED_MODULE_' + EDIT.entryM1 + '__';
  var L = ['{', '  name: ' + sq(EDIT.name.trim()) + ',', "  extensionId: '" + EDIT.extId + "'," ];
  if (EDIT.collab.trim()) L.push('  collaborator: ' + sq(EDIT.collab.trim()) + ',');
  L.push('  iconURL: ' + v1 + '_default.a,');
  L.push('  insetIconURL: ' + v2 + '_default.a,');
  L.push('  description: ' + sq(EDIT.desc.trim()) + ',');
  L.push('  featured: true,');
  L.push('  internetConnectionRequired: ' + (EDIT.net ? 'true' : 'false') + ',');
  L.push('}, ');
  return L.join('\n');
}

function renderEditPreview(){
  if (!EDIT) return;
  var src = currentEditSrc();
  var badge = $('bCheck');
  try { new Function(src); badge.className = 'badge ok'; badge.textContent = 'JS 语法 ✓'; badge.title = ''; LINT_ERR = null; }
  catch (e) { badge.className = 'badge err'; badge.textContent = 'JS 语法 ✗ ' + e.message + '（点击定位）'; badge.title = '点击定位出错位置：跳到源码并高亮出错行'; LINT_ERR = e; LINT_SRC = src; }
  $('bBase').textContent = (EDIT.implNum - 2) + ' ~ ' + EDIT.implNum;
  var p = $('preview');
  var bl = EDIT.blocked;
  if (TAB === 'impl') p.textContent = '【实现源码·可读格式（真实换行），保存时自动转为单行存储形态写入 ' + (bl ? '备用库 ' + EDIT.implNum : EDIT.implNum + '.part.js') + '】\n' + src;
  else if (TAB === 'lib121') p.textContent = bl
    ? '【备用库档案条目（屏蔽中；解除屏蔽时按新模块号重建）】\n' + fromStorage(EDIT.entry121Raw || '')
    : '【将重建的 121 库条目（imports 模块号 ' + EDIT.entryM + '/' + EDIT.entryM1 + ' 保持不变）】\n' + genEditEntry();
  else if (TAB === 'png') p.textContent = '【背景图模块 ' + EDIT.pngNum + '.part.js（' + (bl ? '备用库档案' : '当前生效') + '）→ 资产文件 ' + (EDIT.pngName || '？') + '】\n' + fromStorage(EDIT.assetPngRaw);
  else if (TAB === 'svg') p.textContent = '【图标模块 ' + EDIT.iconNum + '.part.js（' + (bl ? '备用库档案' : '当前生效') + '）→ 资产文件 ' + (EDIT.svgName || '？') + '】\n' + fromStorage(EDIT.assetSvgRaw);
  else if (TAB === 'reg954') p.textContent = bl
    ? '【954 注册 · 屏蔽档案（解除屏蔽时按新实现号重建）】\n' + (EDIT.reg954Frag ? fromStorage(EDIT.reg954Frag) : '（未找到注册片段）')
    : '【954 注册 · builtinExtensions.' + EDIT.extId + '（当前生效）】\n' + (EDIT.reg954Frag ? fromStorage(EDIT.reg954Frag) : '（未找到注册片段）');
  else if (TAB === 'cfg') p.textContent = '【data/manifest_gui.json（当前生效，解除屏蔽时 maxModule 递增）】\n' + (EDIT.cfgText || '（无法读取）');
  $('foot').textContent = bl
    ? '屏蔽编辑模式：仅保存写回备用库（继续屏蔽）；解除屏蔽时排到模块号末尾（954/121/备注/config 重建）。'
    : '预览为可读格式（真实换行，字符串内的换行保留 \\n 转义原样）；保存时自动转为单行存储形态；名称/描述/协作者同步到 121 条目。';
}

var EDIT_DISABLED_TABS = {}; // 编辑模式开放全部页签（含背景图/图标/954/config 仅查看）
function setTabsEditMode(on){
  Array.prototype.slice.call($('tabs').children).forEach(function(b){
    var t = b.getAttribute('data-t');
    if (EDIT_DISABLED_TABS[t]) b.disabled = !!on;
  });
}
function setTab(t){
  TAB = t;
  Array.prototype.slice.call($('tabs').children).forEach(function(b){ b.className = b.getAttribute('data-t') === t ? 'on' : ''; });
}

function selIsStandby(extId){
  var isSb = false;
  ((INFO && INFO.standby) || []).forEach(function(s){ if (s.extId === extId) isSb = true; });
  return isSb;
}
function updateSelActionBtn(){
  if (!INFO) return;
  var v = $('extSel').value;
  var b = $('btnBlock');
  if (selIsStandby(v)) {
    b.textContent = '解除屏蔽';
    b.title = '把选中的已屏蔽扩展解除屏蔽：从备用库回迁，排到模块号末尾（重建 954/121/备注，maxModule 递增）';
  } else {
    b.textContent = '屏蔽到备用库';
    b.title = '把选中的扩展屏蔽到备用库：从注册表/扩展库移除，文件归档，可随时解除屏蔽';
  }
}
function selAction(){
  if (!INFO) return;
  var v = $('extSel').value;
  if (!v) return;
  if (selIsStandby(v)) confirmRestoreQuick(v); else confirmBlock();
}
function confirmRestoreQuick(extId){
  var name = extId;
  ((INFO && INFO.standby) || []).forEach(function(s){ if (s.extId === extId && s.name) name = s.name; });
  var base = INFO.gui_files || 0;
  showModal('确认解除屏蔽', [
    '将把扩展「' + name + '」(' + extId + ') 从备用库解除屏蔽：',
    '  · 3 个模块文件与图片从备用库回迁；',
    '  · 排到模块号末尾（新号 ' + (base + 1) + ' ~ ' + (base + 3) + '）；',
    '  · 954 注册与 121 扩展库条目按备用库档案重建；',
    '  · manifest 的 maxModule 递增；',
    '  · 修改前自动备份。',
    '',
    (MODE === 'edit' && EDIT && EDIT.blocked && EDIT.extId === extId) ? '注意：将使用备用库档案恢复，编辑器中未保存的修改不会写入。' : '解除屏蔽后需「缩减 → 生成 → 复制发布」扩展才恢复可用。',
    '确认解除屏蔽？'
  ].join('\n'), [
    { t: '取消' },
    { t: '确认解除屏蔽', cls: 'primary', fn: function(){ doRestoreQuick(extId); return false; } }
  ]);
}
function doRestoreQuick(extId){
  showModal('正在解除屏蔽…', '正在回迁文件并重建注册，请稍候。', []);
  fetch('?action=restore', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ extId: extId })
  }).then(function(r){ return r.json(); }).then(function(res){
    if (res.ok) {
      if (MODE === 'edit' && EDIT && EDIT.extId === extId) exitEdit();
      showModal('解除屏蔽成功', [
        '已从备用库回迁：' + extId,
        (res.written || []).map(function(w){ return '  ✓ ' + w; }).join('\n'),
        '',
        '备份位置：' + (res.backup || ''),
        '',
        '【下一步】回主编辑器点「缩减」→ GUI 模块的「生成」，并复制发布，扩展即恢复可用。'
      ].join('\n'), [{ t: '完成', cls: 'primary', fn: function(){ loadInfo(); return true; } }]);
    } else {
      showModal('解除屏蔽失败', (res.errors || ['未知错误']).map(function(e){ return '✗ ' + e; }).join('\n'), [{ t: '关闭', cls: 'primary' }]);
    }
  }).catch(function(e){
    showModal('解除屏蔽失败', '网络错误：' + e.message, [{ t: '关闭', cls: 'primary' }]);
  });
}

function confirmBlock(){
  if (!INFO) return;
  var extId = $('extSel').value;
  if (!extId) return;
  var item = null;
  (INFO.blockable || []).forEach(function(b){ if (b.extId === extId) item = b; });
  if (!item) return;
  showModal('确认屏蔽到备用库', [
    '将把扩展「' + item.name + '」(' + extId + ') 移入备用库：',
    '  · 从扩展库（121）与虚拟机注册（954）中移除；',
    '  · 3 个模块文件与图片移入 data/scratch_gui_standby/' + extId + '/；',
     '  · 后续模块文件编号统一前移 3 位（引用同步），manifest 的 maxModule 递减；',
    '  · 解除屏蔽时自动排到模块号末尾（重编新号）；',
    '  · 修改前自动备份。',
    '',
    '注意：屏蔽期间，使用该扩展的已存项目将无法加载它。',
    '确认屏蔽？'
  ].join('\n'), [
    { t: '取消' },
    { t: '确认屏蔽', cls: 'danger', fn: function(){ doBlock(extId); return false; } }
  ]);
}

function doBlock(extId){
  showModal('正在屏蔽…', '正在扫描引用并移动文件，请稍候。', []);
  fetch('?action=block', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ extId: extId })
  }).then(function(r){ return r.json(); }).then(function(res){
    if (res.ok) {
      showModal('屏蔽成功', [
        '已移入备用库：' + (res.standbyDir || ''),
        (res.written || []).map(function(w){ return '  ✓ ' + w; }).join('\n'),
        '',
        '备份位置：' + (res.backup || ''),
        '',
        '【下一步】回主编辑器点「缩减」→ GUI 模块的「生成」，',
        '并复制发布，扩展即从编辑器消失。',
        '需要时在本页解除屏蔽（排到模块号末尾重新生成）。'
      ].join('\n'), [{ t: '完成', cls: 'primary', fn: function(){ loadInfo(); return true; } }]);
    } else {
      showModal('屏蔽失败', (res.errors || ['未知错误']).map(function(e){ return '✗ ' + e; }).join('\n'), [{ t: '返回', cls: 'primary' }]);
    }
  }).catch(function(e){
    showModal('操作失败', '网络错误：' + e.message, [{ t: '关闭', cls: 'primary' }]);
  });
}

/* ---------- Modal ---------- */
function showModal(title, html, buttons){
  $('mTitle').textContent = title;
  $('mBody').innerHTML = html;
  var acts = $('mActs');
  acts.textContent = '';
  (buttons || [{ t: '关闭' }]).forEach(function(b){
    var btn = el('button', 'btn ' + (b.cls || ''), b.t);
    btn.onclick = function(){ if (b.fn) { if (b.fn() === false) return; } hideModal(); };
    acts.appendChild(btn);
  });
  $('modal').classList.add('show');
}
function hideModal(){ $('modal').classList.remove('show'); }
$('modal').addEventListener('click', function(e){ if (e.target === this) hideModal(); });

/* ---------- 示例 ---------- */
function fillExample(){
  state.extId = 'DemoLed'; state.name = '示例灯控'; state.desc = '演示如何创建扩展（示例数据，请替换成自己的）。';
  state.collab = ''; state.net = true;
  state.globals = 'var SERVER_TIMEOUT = 10000;\nvar LEDSTATE = \'off\';';
  state.png = { name: '', data: '' }; state.svg = { name: '', data: '' };
  state.pngTouched = false; state.svgTouched = false;
  state.blocks = [
    { opcode: 'setColor', text: '把灯设为颜色[COLOR]', type: 'COMMAND', desc: '', args: [{ name: 'COLOR', type: 'COLOR', menu: '', default: '#ff0000' }], code: 'LEDSTATE = Cast.toString(args.COLOR);\nreturn;' },
    { opcode: 'sendCmd', text: '向设备发送[CMD]', type: 'COMMAND', desc: '', args: [{ name: 'CMD', type: 'STRING', menu: 'cmds', default: 'on' }], code: TPLS.net({ args: [{ name: 'CMD' }] }) },
    { opcode: 'getStatus', text: '当前灯状态', type: 'REPORTER', desc: '', args: [], code: 'return LEDSTATE;' }
  ];
  state.menus = [{ name: 'cmds', accept: true, items: '开|on\n关|off' }];
  refreshBasic(); renderBlocks(); renderMenus(); touch();
}

/* ---------- 帮助 ---------- */
function showHelp(){
  showModal('使用说明', [
    '【这个页面做什么】',
    '把“添加一个自定义扩展”所需的 6 处改动一次完成：',
    '  1. 上传背景图/图标到 editor/static/assets/；',
    '  2. 生成 N.part.js（背景）、N+1.part.js（图标）、N+2.part.js（实现）；',
    '  3. 在 954 模块注册 opcode 实现入口；',
    '  4. 在 121 模块扩展库加入卡片（图标、名称、描述）；',
     '  5. data/manifest_gui.json 的 maxModule 计数器自动 +3；',
    '  6. 修改前自动备份到 data/backup/，并把新文件记入待缩减列表。',
    '',
    '【操作步骤】',
    '  · 在线编辑已有扩展：① 选择器选中扩展 → 修改元数据/实现源码/图片 → 「保存修改」；',
    '  · 新建扩展：',
    '  1. 填写基本信息，上传两张图（PNG 大图 + SVG 小图标）；',
    '  2. 逐个添加积木：opcode、文本（[参数] 占位）、类型、参数、实现代码；',
    '  3. 需要下拉菜单就先加菜单，再在参数里引用；',
    '  4. 右侧实时预览生成的代码，红色/绿色徽标提示语法状态；',
    '  5. 点“生成并保存”，确认后自动写入；',
    '  6. 回到主编辑器（index.php）→ 点“缩减”→ 点 GUI 模块的“生成”→',
    '     按提示把生成的 557.part.js 复制到编辑器发布位置，强刷浏览器。',
    '',
    '【注意事项】',
    '  · 扩展ID 和积木的 opcode 创建后不要随意更改（项目文件里会记录）；',
    '  · 实现代码里可通过 nets 访问服务器 PHP 接口（参考“网络请求”模板）；',
    '  · 生成的文件与现有 part.js 格式一致：单行、字面 \\n；字符串一律使用单引号，无需双引号转义；',
    '  · ① 扩展选择器：选中已有自建扩展（含已屏蔽的，标注「已屏蔽」）即可在线编辑，',
    '    源码直改、原号保存；已屏蔽扩展可选「仅保存（继续屏蔽）」或「解除屏蔽并保存」（排到模块号末尾）；',
    '    也可把扩展临时屏蔽进备用库（data/scratch_gui_standby/）：屏蔽时后续模块文件编号',
     '    统一前移 3 位（引用同步）、manifest 的 maxModule 递减；屏蔽期间使用该扩展的已存项目将无法加载它；',
    '  · 草稿自动保存在浏览器 localStorage，刷新/关闭不丢失（编辑模式不影响新建草稿）。'
  ].join('\n'), [{ t: '我知道了', cls: 'primary' }]);
}

/* ---------- 保存 ---------- */
function doSave(){
  collect();
  var errs = validate();
  if (errs.length) {
    showModal('无法保存，请先修正：', errs.map(function(e){ return '✗ ' + e; }).join('\n'), [{ t: '返回修改', cls: 'primary' }]);
    return;
  }
  var base = INFO.gui_files + 1;
  var list = [
    '新建：data/scratch_gui/' + base + '.part.js（背景图模块）',
    '新建：data/scratch_gui/' + (base + 1) + '.part.js（图标模块）',
    '新建：data/scratch_gui/' + (base + 2) + '.part.js（扩展实现）',
    '上传：editor/static/assets/' + state.png.name.trim(),
    '上传：editor/static/assets/' + state.svg.name.trim()
  ];
  if (state.reg954) list.push('修改：data/scratch_gui/954.part.js（注册扩展 ' + state.extId + '）');
  if (state.reg121) list.push('修改：data/scratch_gui/121.part.js（加入扩展库）');
  list.push('修改：data/manifest_gui.json（maxModule → ' + (base + 2) + '）');
  if (state.remark) list.push('含写入模块备注（remarks）');
  list.push('');
  list.push('以上现有文件修改前会自动备份到 data/backup/ 下。');
  showModal('确认生成并保存', list.join('\n'), [
    { t: '取消' },
    { t: '确认保存', cls: 'primary', fn: function(){ submitSave(); return false; } }
  ]);
}

function submitSave(){
  var payload = {
    baseNum: INFO.gui_files + 1,
    extId: state.extId.trim(),
    name: state.name.trim(),
    desc: state.desc.trim(),
    collab: state.collab.trim(),
    net: state.net,
    png: { name: state.png.name.trim(), data: state.png.data },
    svg: { name: state.svg.name.trim(), data: state.svg.data },
    impl: toLiteral(CUR.impl),
    assetPng: toLiteral(CUR.pngModule),
    assetSvg: toLiteral(CUR.svgModule),
    opts: { reg954: state.reg954, reg121: state.reg121, remark: state.remark }
  };
  $('btnSave').disabled = true;
  showModal('正在保存…', '请稍候。', []);
  fetch('?action=save', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  }).then(function(r){ return r.json(); }).then(function(res){
    $('btnSave').disabled = false;
    if (res.ok) {
      showModal('保存成功', [
        '已写入：',
        res.written.map(function(w){ return '  ✓ ' + w; }).join('\n'),
        '已上传：',
        res.assets.map(function(w){ return '  ✓ ' + w; }).join('\n'),
        '',
        '备份位置：' + res.backup,
        '',
        '【下一步】',
        '  1. 打开主编辑器 index.php → 点“缩减”；',
        '  2. 点 GUI 模块的“生成”；',
        '  3. 按提示复制生成的 557.part.js 到编辑器发布位置；',
        '  4. 强制刷新（Ctrl+F5）编辑器页面，在扩展库中即可看到新扩展。',
        '',
        '下一个扩展将从编号 ' + (res.gui_files + 1) + ' 开始。'
      ].join('\n'), [{ t: '完成', cls: 'primary', fn: function(){ loadInfo(); return true; } }]);
    } else {
      showModal('保存失败', (res.errors || ['未知错误']).map(function(e){ return '✗ ' + e; }).join('\n'), [{ t: '返回修改', cls: 'primary' }]);
    }
  }).catch(function(e){
    $('btnSave').disabled = false;
    showModal('保存失败', '网络错误：' + e.message, [{ t: '关闭', cls: 'primary' }]);
  });
}

/* ---------- 在线编辑保存 ---------- */
function editCollectErrors(src, name, desc, collab){
  // 保存/解除屏蔽共用的校验（屏蔽与正式库同一套：档案号/图标引用一致）
  var errs = [];
  if (!name) errs.push('显示名称：不能为空。');
  if (!desc) errs.push('描述：不能为空。');
  if (/"/.test(name + desc + collab)) errs.push('名称/描述/协作者请统一使用单引号，不要包含双引号。');
  if (!src.trim()) errs.push('实现源码：不能为空。');
  else {
    try { new Function(src); }
    catch (e) { errs.push('JS 语法错误：' + e.message); }
    if (src.indexOf('module.exports = Scratch3' + EDIT.extId + 'Blocks;') < 0) errs.push('实现源码：缺少 module.exports = Scratch3' + EDIT.extId + 'Blocks;。');
    if (src.indexOf('__webpack_require__(' + EDIT.iconNum + ')') < 0) errs.push('实现源码：未引用图标模块 ' + EDIT.iconNum + '。');
    var enc = toStorage(src);
    var headWant = EDIT.blocked ? '/* implementation */\\n (function(module, exports, __webpack_require__) {\\n' : '/* ' + EDIT.implNum + ' */\\n (function(module, exports, __webpack_require__) {\\n';
    if (enc.indexOf(headWant) !== 0) errs.push('实现源码：文件头部框架被改动。');
    if (enc.slice(-5) !== '\\n })') errs.push('实现源码：文件尾部框架被改动。');
  }
  if (EDIT.view === 'cards' && EDIT.cards && EDIT.cards.addedBlocks.length) {
    var seenOp = {};
    EDIT.cards.parsed.blocks.forEach(function(b){ seenOp[b.opcode] = 1; });
    var menuNames = {};
    editMenuNameList().forEach(function(n){ menuNames[n] = 1; });
    EDIT.cards.addedBlocks.forEach(function(b, k){
      var n = '新增积木 ' + (k + 1) + '：';
      if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(b.opcode) || RESERVED.indexOf(b.opcode.toLowerCase()) >= 0) errs.push(n + 'opcode 不合法或是保留字。');
      else if (seenOp[b.opcode]) errs.push(n + 'opcode ' + b.opcode + ' 与现有积木重复。');
      else seenOp[b.opcode] = 1;
      if (!b.text.trim()) errs.push(n + '积木文本为空。');
      if (!b.code.trim()) errs.push(n + '实现代码为空（可在模板下拉中选一个起点）。');
      if (/"/.test(b.text + b.desc + b.code)) errs.push(n + '文本/描述/实现代码请统一使用单引号，不要包含双引号。');
      b.args.forEach(function(a){
        if (a.name && a.menu && !menuNames[a.menu]) errs.push(n + '参数“' + a.name + '”引用的菜单“' + a.menu + '”不存在。');
      });
    });
  }
  return errs;
}

function doEditSave(){
  var rawSrc = currentEditSrc();
  var src = applyNameSync(rawSrc);
  var name = EDIT.name.trim(), desc = EDIT.desc.trim(), collab = EDIT.collab.trim();
  var nameDiff = false;
  try {
    // 与基准源码比较：卡片视图的基准是解析原文（deriveCardsSrc 已含名称统一），源码视图是当前文本
    var baseSrc = (EDIT.view === 'cards' && EDIT.cards) ? EDIT.source : rawSrc;
    var rp = parseImpl(baseSrc, EDIT.extId);
    nameDiff = !!(rp.ok && rp.nameDefault && rp.nameDefault.value !== name);
  } catch (e) {}
  var errs = editCollectErrors(src, name, desc, collab);
  if (errs.length) {
    showModal('无法保存，请先修正：', errs.map(function(e){ return '✗ ' + e; }).join('\n'), [{ t: '返回修改', cls: 'primary' }]);
    return;
  }
  var list;
  if (EDIT.blocked) {
    list = [
      '写回备用库（继续屏蔽）：data/scratch_gui_standby/' + EDIT.extId + '/' + EDIT.implNum + '.part.js（档案号不变）',
      '更新备用库档案（名称/描述/协作者/联网标记，imports 模块号 ' + EDIT.entryM + '/' + EDIT.entryM1 + ' 不变）'
    ];
    if (EDIT.view === 'cards' && EDIT.cards) list.push('含卡片编辑改动：积木/菜单/方法体按重建源码写入（未修改部分与原文逐字节一致）');
    if (nameDiff) list.push('统一扩展显示名：实现档案中的名称将改为“' + name + '”');
    if (EDIT.pngNew) list.push('替换备用库背景图：standby/' + EDIT.extId + '/assets/' + EDIT.pngName);
    if (EDIT.svgNew) list.push('替换备用库图标：standby/' + EDIT.extId + '/assets/' + EDIT.svgName);
    if (EDIT.origName !== name) list.push('档案备注已随名称更新');
    list.push('不触碰正式库（954/121/config/待缩减列表不变）');
  } else {
    list = [
      '重写：data/scratch_gui/' + EDIT.implNum + '.part.js（实现文件，模块号不变）',
      '重建：data/scratch_gui/121.part.js 库条目（imports 模块号 ' + EDIT.entryM + '/' + EDIT.entryM1 + ' 保持不变）'
    ];
    if (EDIT.view === 'cards' && EDIT.cards) list.push('含卡片编辑改动：积木/菜单/方法体按重建源码写入（未修改部分与原文逐字节一致）');
    if (nameDiff) list.push('统一扩展显示名：实现文件中的名称将改为“' + name + '”（与 121 库条目一致）');
    if (EDIT.pngNew) list.push('覆盖：editor/static/assets/' + EDIT.pngName + '（背景图）');
    if (EDIT.svgNew) list.push('覆盖：editor/static/assets/' + EDIT.svgName + '（图标）');
    if (EDIT.origName !== name) list.push('更新：模块备注（名称变化）');
    list.push('记入待缩减列表（随后需 缩减 → 生成 → 复制发布）');
  }
  list.push('');
  list.push('以上文件修改前会自动备份到 data/backup/ 下。');
  showModal(EDIT.blocked ? '确认保存（继续屏蔽）' : '确认保存修改', list.join('\n'), [
    { t: '取消' },
    { t: EDIT.blocked ? '确认保存（继续屏蔽）' : '确认保存', cls: 'primary', fn: function(){ submitEdit(); return false; } }
  ]);
}

function doUnblockSave(){
  if (!(MODE === 'edit' && EDIT && EDIT.blocked)) return;
  var rawSrc = currentEditSrc();
  var src = applyNameSync(rawSrc);
  var name = EDIT.name.trim(), desc = EDIT.desc.trim(), collab = EDIT.collab.trim();
  var errs = editCollectErrors(src, name, desc, collab);
  if (errs.length) {
    showModal('无法解除屏蔽，请先修正：', errs.map(function(e){ return '✗ ' + e; }).join('\n'), [{ t: '返回修改', cls: 'primary' }]);
    return;
  }
  var base = INFO ? INFO.gui_files : 0;
  var list = [
    '解除屏蔽并把该扩展排到模块号末尾：',
    '  · 新模块号 ' + (base + 1) + '（背景）/ ' + (base + 2) + '（图标）/ ' + (base + 3) + '（实现）（原档案号 ' + EDIT.pngNum + '/' + EDIT.iconNum + '/' + EDIT.implNum + ' 作废）；',
    '  · 实现文件头部与图标引用自动改到新号；',
    '  · 954 注册与 121 扩展库条目重新写入（imports 模块号占用时自动重编）；',
    '  · 图片从备用库回迁 editor/static/assets/；',
    '  · 模块备注按新号写入；',
     '  · data/manifest_gui.json：maxModule → ' + (base + 3) + '；',
    '  · 已记入待缩减列表（随后需 缩减 → 生成 → 复制发布）。'
  ];
  if (EDIT.view === 'cards' && EDIT.cards) list.splice(1, 0, '含卡片编辑改动：按重建源码写入（未修改部分与原文逐字节一致）');
  if (EDIT.pngNew) list.push('背景图将按替换内容写入：' + EDIT.pngName);
  if (EDIT.svgNew) list.push('图标将按替换内容写入：' + EDIT.svgName);
  list.push('');
  list.push('以上文件修改前会自动备份到 data/backup/ 下。');
  showModal('确认解除屏蔽并保存', list.join('\n'), [
    { t: '取消' },
    { t: '确认解除屏蔽', cls: 'primary', fn: function(){ submitUnblock(); return false; } }
  ]);
}

function submitUnblock(){
  var payload = {
    extId: EDIT.extId,
    name: EDIT.name.trim(),
    desc: EDIT.desc.trim(),
    collab: EDIT.collab.trim(),
    net: !!EDIT.net,
    impl: toStorage(applyNameSync(currentEditSrc())),
    png: EDIT.pngNew ? { name: EDIT.pngName, data: EDIT.pngNew } : null,
    svg: EDIT.svgNew ? { name: EDIT.svgName, data: EDIT.svgNew } : null
  };
  $('btnSave').disabled = true;
  $('btnUnblock').disabled = true;
  showModal('正在解除屏蔽…', '请稍候。', []);
  fetch('?action=unblock', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  }).then(function(r){ return r.json(); }).then(function(res){
    $('btnSave').disabled = false;
    $('btnUnblock').disabled = false;
    if (res.ok) {
      showModal('解除屏蔽成功', [
        '已恢复到正式库（排到模块号末尾）：',
        (res.written || []).map(function(w){ return '  ✓ ' + w; }).join('\n'),
        '',
        '备份位置：' + res.backup,
        '',
        '【下一步】回主编辑器「缩减」→ GUI 模块「生成」→ 复制发布，',
        '强制刷新（Ctrl+F5）后扩展重新出现在扩展库中。'
      ].join('\n'), [{ t: '完成', cls: 'primary', fn: function(){ afterEditSaved(); return true; } }]);
    } else {
      showModal('解除屏蔽失败', (res.errors || ['未知错误']).map(function(e){ return '✗ ' + e; }).join('\n'), [{ t: '返回修改', cls: 'primary' }]);
    }
  }).catch(function(e){
    $('btnSave').disabled = false;
    $('btnUnblock').disabled = false;
    showModal('解除屏蔽失败', '网络错误：' + e.message, [{ t: '关闭', cls: 'primary' }]);
  });
}

function submitEdit(){
  var payload = {
    extId: EDIT.extId,
    name: EDIT.name.trim(),
    desc: EDIT.desc.trim(),
    collab: EDIT.collab.trim(),
    net: !!EDIT.net,
    impl: toStorage(applyNameSync(currentEditSrc())),
    png: EDIT.pngNew ? { name: EDIT.pngName, data: EDIT.pngNew } : null,
    svg: EDIT.svgNew ? { name: EDIT.svgName, data: EDIT.svgNew } : null
  };
  $('btnSave').disabled = true;
  showModal('正在保存…', '请稍候。', []);
  fetch('?action=edit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  }).then(function(r){ return r.json(); }).then(function(res){
    $('btnSave').disabled = false;
    if (res.ok) {
      showModal('保存成功', [
        '已写入：',
        (res.written || []).map(function(w){ return '  ✓ ' + w; }).join('\n'),
        '',
        '备份位置：' + res.backup,
        '',
        '【下一步】',
        '  1. 打开主编辑器 index.php → 点「缩减」；',
        '  2. 点 GUI 模块的「生成」；',
        '  3. 按提示复制生成的 557.part.js 到编辑器发布位置；',
        '  4. 强制刷新（Ctrl+F5）编辑器页面查看效果。'
      ].join('\n'), [{ t: '完成', cls: 'primary', fn: function(){ afterEditSaved(); return true; } }]);
    } else {
      showModal('保存失败', (res.errors || ['未知错误']).map(function(e){ return '✗ ' + e; }).join('\n'), [{ t: '返回修改', cls: 'primary' }]);
    }
  }).catch(function(e){
    $('btnSave').disabled = false;
    showModal('保存失败', '网络错误：' + e.message, [{ t: '关闭', cls: 'primary' }]);
  });
}

function afterEditSaved(){
  var id = EDIT ? EDIT.extId : '';
  loadInfo();
  if (id) loadExt(id);
}

/* ---------- 初始化 ---------- */
function loadInfo(){
  return fetch('?action=info').then(function(r){ return r.json(); }).then(function(res){
    if (!res.ok) throw new Error('info 接口返回异常');
    INFO = res;
    $('bGui').textContent = res.gui_files;
    $('bReg').textContent = res.registryIds.length + ' 个';
    $('btnSave').disabled = false;
    if (!res.assetsDirOk) $('foot').textContent = '警告：找不到 ../editor/static/assets 目录，保存图片会失败。';
    renderSelUI();
    regen();
  });
}

$('btnAddBlock').onclick = function(){ state.blocks.push(blankBlock()); renderBlocks(); touch(); };
$('btnViewCards').onclick = function(){ switchEditView('cards'); };
$('btnViewSrc').onclick = function(){ switchEditView('src'); };
$('btnBlock').onclick = selAction;
$('bCheck').onclick = lintBadgeJump;
$('btnUnblock').onclick = doUnblockSave;
$('extSel').addEventListener('change', function(){
  updateSelActionBtn();
  var v = this.value;
  if (!v) { exitEdit(); return; }
  if (MODE === 'edit' && EDIT && v === EDIT.extId) return;
  loadExt(v);
});
$('btnAddMenu').onclick = function(){ state.menus.push({ name: '', accept: true, items: '' }); renderMenus(); refreshMenuSelects(); touch(); };
$('btnExample').onclick = function(){
  showModal('填入示例', '将用示例数据覆盖当前表单（图片需要重新选择），确定吗？', [
    { t: '取消' },
    { t: '填入', cls: 'primary', fn: function(){ fillExample(); return true; } }
  ]);
};
$('btnHelp').onclick = showHelp;
$('btnClear').onclick = function(){
  showModal('清空表单', '将清空所有输入并删除浏览器中的草稿，确定吗？', [
    { t: '取消' },
    { t: '清空', cls: 'danger', fn: function(){
      localStorage.removeItem(DKEY);
      state.extId = ''; state.name = ''; state.desc = ''; state.collab = ''; state.net = false;
      state.globals = ''; state.png = { name: '', data: '' }; state.svg = { name: '', data: '' };
      state.pngTouched = false; state.svgTouched = false;
      state.blocks = [blankBlock()]; state.menus = [];
      $('vPng').style.display = 'none'; $('vSvg').style.display = 'none';
      $('hintPng').textContent = ''; $('hintSvg').textContent = '';
      refreshBasic(); renderBlocks(); renderMenus(); touch();
      return true;
    } }
  ]);
};
$('btnSave').onclick = function(){ if (MODE === 'edit') doEditSave(); else doSave(); };
$('tabs').addEventListener('click', function(e){
  var t = e.target.getAttribute && e.target.getAttribute('data-t');
  if (!t) return;
  setTab(t);
  if (MODE === 'edit') renderEditPreview(); else renderPreview();
});

bindBasic();
if (loadDraft()) { refreshBasic(); renderBlocks(); renderMenus(); }
else saveDraft();
loadInfo().catch(function(e){
  $('bCheck').className = 'badge err';
  $('bCheck').textContent = '无法连接后端：' + e.message;
  $('foot').textContent = '请通过 PHP 环境访问本页面（如 http://localhost/class/m2/add_extension.php）。';
});
setInterval(saveDraft, 10000);
window.addEventListener('beforeunload', saveDraft);
document.addEventListener('visibilitychange', function(){ if (document.visibilityState === 'hidden') saveDraft(); });
</script>
</body>
</html>
