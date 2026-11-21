<?php
//读取模块索引（data/manifest_projects.json + data/manifest_gui.json），供列表渲染与顶栏统计
include_once __DIR__."/manifest_lib.php";
$pm = mf_prj_read();
$gm = mf_gui_read();
$prjCount = 0; $exCount = 0; $guiCount = 0;
if (is_array($pm)) {
   $prjCount = count($pm["modules"]);
   foreach ($pm["modules"] as $mo) { if (strpos($mo["remark"], "×") !== false) $exCount++; }
}
if (is_array($gm)) $guiCount = (int)$gm["maxModule"] + 1;
?>
<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta http-equiv="Cache-Control" content="no-store">
<title>Scratch3.0 模块管理器</title>
<style>
*{box-sizing:border-box}
body{margin:0;font:13px/1.55 "Segoe UI","Microsoft YaHei",sans-serif;color:#1c2b3a;background:#f4f9fe}
.topbar{display:flex;align-items:center;gap:14px;padding:8px 14px;background:#fff;border-bottom:1px solid #dce8f5;position:sticky;top:0;z-index:5;flex-wrap:wrap}
.brand{font-weight:700;font-size:15px;color:#2b7de1}
.brand .sub{font-weight:400;font-size:12px;color:#6b7f95;margin-left:8px}
.badges{display:flex;gap:6px;flex:1;flex-wrap:wrap}
.badge{background:#eaf3fd;border:1px solid #d5e6f8;color:#35618f;border-radius:20px;padding:1px 10px;font-size:12px;white-space:nowrap}
.badge b{color:#2b7de1}
.acts{display:flex;gap:6px;align-items:center}
.btn{border:1px solid #d5e6f8;background:#fff;color:#35618f;border-radius:8px;padding:5px 14px;font-size:13px;cursor:pointer;text-decoration:none}
.btn:hover{background:#eaf3fd}
.btn.primary{background:#2b7de1;border-color:#2b7de1;color:#fff}
.btn.primary:hover{background:#1e6ccc}
.btn.danger{color:#c0392b;border-color:#e7b9b4}
.btn.danger:hover{background:#fdeaea}
.btn.mini{padding:1px 8px;font-size:12px;border-radius:6px}
main{display:flex;gap:10px;padding:10px;height:calc(100vh - 58px)}
.pane{overflow:auto}
#paneList{flex:5;min-width:470px;display:flex;flex-direction:column}
#paneView{flex:7;display:flex;flex-direction:column;min-width:430px}
.fs{background:#fff;border:1px solid #dce8f5;border-radius:12px;padding:10px 12px;display:flex;flex-direction:column}
#fsPrj{flex:1.4;min-height:0}
#GUIDIV{flex:1;min-height:0}
.fs-t{font-weight:700;color:#2b7de1;font-size:13px;margin-bottom:8px;display:flex;align-items:center;gap:8px;flex-wrap:wrap}
.hintline{font-size:12px;color:#6b7f95;font-weight:400}
.toolrow{display:flex;gap:6px;align-items:center;flex-wrap:wrap;margin:2px 0 8px}
.inp{border:1px solid #d5e6f8;border-radius:7px;padding:5px 8px;font:13px "Segoe UI","Microsoft YaHei",sans-serif;color:#1c2b3a;background:#fff;outline:none}
.inp:focus{border-color:#2b7de1;box-shadow:0 0 0 2px #eaf3fd}
#find_prj,#find_gui{flex:1;min-width:120px}
.list{width:100%;border:1px solid #d5e6f8;border-radius:8px;padding:4px;font:12px/1.7 "Segoe UI","Microsoft YaHei",sans-serif;color:#1c2b3a;background:#fbfdff;outline:none;overflow:auto}
.list:focus{border-color:#2b7de1;box-shadow:0 0 0 2px #eaf3fd}
.list option{padding:1px 6px;border-radius:5px}
#MID{flex:1;min-height:300px}
#GUI{flex:1;min-height:200px}
.viewwrap{position:relative;flex:1;display:flex;min-height:380px}
.viewwrap pre{flex:1;margin:0;overflow:auto;background:#0f2237;color:#cfe3f7;border-radius:10px;padding:12px 14px;font:12px/1.6 Consolas,monospace;white-space:pre}
.viewwrap pre code{font:inherit}
#div_code_editor{position:absolute;inset:0;background:#0f2237;border-radius:10px;padding:8px 10px;display:flex;flex-direction:column;gap:6px;visibility:hidden}
.ed-head{display:flex;justify-content:flex-end;align-items:center;gap:8px}
.ed-head .hintline{color:#8fb6dd;margin-right:auto}
#CODE_EDITOR{flex:1;background:#122c44;color:#cfe3f7;border:1px solid #2a4a6b;border-radius:8px;padding:8px 10px;font:12px/1.6 Consolas,monospace;outline:none;resize:none;white-space:pre;overflow:auto}
#CODE_EDITOR:focus{border-color:#2b7de1;box-shadow:0 0 0 2px rgba(43,125,225,.25)}
.memo{margin-top:4px;margin-bottom:4px;background:#eaf3fd;border:1px solid #d5e6f8;border-radius:8px;padding:5px 10px;font-size:12px;color:#35618f;text-align:center;min-height:22px;word-break:break-all}
#EXCLUDED{position:fixed;inset:0;background:rgba(28,43,58,.38);backdrop-filter:blur(5px);visibility:hidden;z-index:50;display:flex;align-items:center;justify-content:center}
.ex-box{background:rgba(255,255,255,.92);backdrop-filter:blur(18px);border:1px solid rgba(255,255,255,.65);border-radius:16px;box-shadow:0 20px 60px rgba(15,34,55,.35);padding:16px 18px;width:min(500px,92vw)}
.ex-head{display:flex;align-items:center;gap:6px;font-weight:700;color:#2b7de1;margin-bottom:8px}
.ex-head .btn{margin-left:auto}
.ex-head b{color:#c0392b}
#excludedlist{height:300px}
.ex-tip{margin-top:8px}
</style>
<script src="./js/jquery.js"></script>
<script src="./js/page_control.js?v=20261118b"></script>
</head>
<body>
<header class="topbar">
  <div class="brand">模块管理器<span class="sub">Scratch3.0核心文件编辑器</span></div>
  <div class="badges">
    <span class="badge">Projects 模块 <b><?php echo $prjCount; ?>个</b>（其中已排除 <b><?php echo $exCount; ?></b>个）</span>
    <span class="badge">GUI 模块 <b><?php echo $guiCount; ?></b>个</span>
  </div>
  <div class="acts">
    <a class="btn" href="add_extension.php" target="_blank" title="打开扩展构建器（新建/编辑/屏蔽自建扩展）">扩展管理</a>
  </div>
</header>
<main>
  <section class="pane" id="paneList">
    <div class="fs" id="fsPrj">
      <div class="fs-t">① Projects 模块<span class="hintline">选中条目在右侧查看/编辑代码；备注含 × 的模块生成时排除；未选中条目点“排除”查看已排除列表</span></div>
      <div class="toolrow">
        <input type="text" class="inp" title="输入字符，将自动匹配第一条数据。敲回车键，会从当前位置继续搜索。" id="find_prj" autocomplete="off" placeholder="搜索模块号 / 路径 / 备注" onclick="setSearchType(1);" onInput="doSearching_prj(this);">
        <button class="btn mini" title="数据后面打√表示此文件已经过判读" onclick="setPRJStatus();">已阅</button>
        <button class="btn mini" title="隐藏已被排除的组件，刷新网页将恢复。" onclick="hideModule();">隐藏</button>
        <button class="btn mini danger" title="选中条目：打 × 表示生成时排除（再点一次恢复）；未选中条目：列出当前已排除组件" onclick="removeModule();">排除</button>
        <button class="btn mini" onclick="setPRJMemo();" title="给选中的文件添加备注信息，添加备注后便于搜索">设置备注</button>
        <button class="btn mini" title="打开 Scratch GUI 模块列表，这里是Scratch3.0的内核所在。" onclick="showPROJFile(557);">GUI 模块</button>
        <button class="btn mini primary" title="当前项目与Scratch3.0的editor文件夹并列，生成的文件将保存到../editor/js/projects.bundle.js" onclick="createProjects();">生成</button>
      </div>
      <select id="MID" name="MID" size="18" class="list" onclick="showPROJFile(this);">
<?php
if (!is_array($pm))
   echo "        <option value=0>manifest_projects.json 读取失败</option>";
else
foreach($pm["modules"] as $mo)
{
   echo "        <option value=".$mo["n"].">".$mo["n"].":".$mo["remark"]."</option>";
}
?>
      </select>
    </div>
    <div class="memo" id="MEMOINFO" title="当前选中条目的备注/操作反馈"></div>
    <div class="fs" id="GUIDIV" style="display:none">
      <div class="fs-t">② GUI 模块（557 · Scratch GUI）<span class="hintline">缩减=把待缩减模块并回文件；生成=直接覆盖目标文件，请谨慎操作</span></div>
      <div class="toolrow">
        <input type="text" class="inp" title="输入字符，将自动匹配第一条数据。敲回车键，会从当前位置继续搜索。" id="find_gui" autocomplete="off" placeholder="搜索模块号 / 备注" onclick="setSearchType(2);" onInput="doSearching_gui(this);">
        <button class="btn mini" title="数据后面打√表示此文件已经过判读" onclick="setGUIStatus();">已阅</button>
        <button class="btn mini" onclick="setGUIMemo();" title="给选中的文件添加备注信息，添加备注后便于搜索">设置备注</button>
        <button class="btn mini" onclick="shrinkGUI();" "代码中有大量的注释，如果清除，可以降低文件大小，加快传输速度，不过部分组件的版权信息将被抹除。">缩减</button>
        <button class="btn mini primary" title="数据将直接覆盖目标文件，请谨慎操作。" onclick="createGUI();">生成</button>
      </div>
      <select size="14" class="list" id="GUI" name="GUI" onclick="showGUIFile(this);">
<?php
if (!is_array($gm))
   echo "        <option value=0>manifest_gui.json 读取失败</option>";
else
{
$remarks=$gm["remarks"];
for($i=0;$i<=$gm["maxModule"];$i++)
{
   if(isset($remarks[$i]))			//检测是否有备注信息
      echo "        <option value=".$i.">".$i.":".$remarks[$i]."</option>";	//添加备注信息
   else
      echo "        <option value=".$i.">".$i.":</option>";
}
}
?>
      </select>
    </div>
  </section>
  <section class="pane" id="paneView">
    <div class="fs" id="fsCode">
      <div class="fs-t">代码查看<span class="hintline">单击代码进入编辑；未保存切换模块会提示</span></div>
      <div class="viewwrap">
        <pre><code title="单击可编辑代码" id="viewer" onclick="editCode(this);" class="language-javascript"></code></pre>
        <div id="div_code_editor">
          <div class="ed-head"><span class="hintline">代码编辑中</span><button class="btn mini primary" title="数据将直接覆盖目标文件，请谨慎操作。" onclick="saveCode(this);">保存</button></div>
          <textarea id="CODE_EDITOR" oninput="setChanged();" spellcheck="false"></textarea>
        </div>
      </div>
    </div>
  </section>
</main>
<div id="EXCLUDED">
  <div class="ex-box">
    <div class="ex-head">当前已排除组件 <b id="total">0</b> 个<button class="btn mini" onclick="document.getElementById('EXCLUDED').style.visibility='hidden'">关闭</button></div>
    <select id="excludedlist" size="14" class="list"></select>
    <div class="hintline ex-tip">如要排除某个组件，请先在①区选择该条数据后再执行“排除”；对已排除条目再点一次“排除”可恢复。</div>
  </div>
</div>
</body>
</html>
