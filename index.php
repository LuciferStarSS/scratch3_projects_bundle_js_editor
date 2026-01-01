<html>
<meta charset="UTF-8">
<head><title>Scratch3.0核心文件编辑器</title>
<link rel="stylesheet" type="text/css" href="./css/brush-trees-dark.min.css"/>
<script src=./js/jquery.js></script>
<script src=./js/page_control.js></script>
<!--script src=./js/highlight.js></script-->
<!--script src=./js/javascript.min.js></script-->
</head>
<body>
  <!--Projects Modules-->
  <div>
    <div>
      <input type=text title="输入字符，将自动匹配第一条数据。敲回车键，会从当前位置继续搜索。" id=find_prj name=find_prj autocomplete=off onclick="setSearchType(1);" onInput="doSearching_prj(this);" style="width:125px;">
      <input type=button value="已阅" title="数据后面打√表示此文件已经过判读" onclick="setPRJStatus();"><input type=button value="隐藏" title="隐藏已被排除的组件，刷新网页将恢复。" onclick="hideModule();"><input type=button value="排除"  title="数据后面打×表示生成时排除" onclick="removeModule();"><input type=button value="设置备注" onclick="setPRJMemo();"><input type=button value="GUI模块"  title="打开Scratch GUI模块" onclick="showPROJFile(557);">
      <input type=button value="生成"  title="为防止误操作，数据只生成在当前目录。生成后，请手动复制文件到指定位置。"  onclick="createProjects();"><br>
      <select id=MID name=MID size=350 style="height:350px;width:442px" onclick="showPROJFile(this);">
<?php
//读取Projects全部模块的拆分数据
$index_proj=file_get_contents("./data/index_projects.inc.php");
$indexArr=unserialize($index_proj);
foreach($indexArr as $key=>$value)
{
   echo "        <option value=".$key.">".$key.":".$value."</option>";
}
?>
      </select><br>
    </div>
    <!--Memo Info-->
    <div name=MEMOINFO id=MEMOINFO style="width:442px;height:20px;background:lightyellow;text-align:center"></div>
    <!--Projects Module - 557 - Scratch3.0 GUI -->
    <div name=GUIDIV id=GUIDIV style="visibility:hidden">
      <input type=text title="输入字符，将自动匹配第一条数据。敲回车键，会从当前位置继续搜索。" id=find_gui name=find_gui autocomplete=off onclick="setSearchType(2);"  onInput="doSearching_gui(this);" style="width:234px;">
      <input type=button value="已阅" title="数据后面打√表示此文件已经过判读" onclick="setGUIStatus();"><input type=button value="设置备注" onclick="setGUIMemo();"><input type=button value="缩减" onclick="shrinkGUI();">
      <input type=button value="生成" title="数据将直接覆盖目标文件，请谨慎操作。" onclick="createGUI();"><br>
      <select size=350 style="height:350px;width:442px;" id=GUI name=GUI  onclick="showGUIFile(this);">
<?php
//读取第557号模块（Scratch GUI）的拆分数据
$index_gui=file_get_contents("./data/index_gui.inc.php");
$indexArr=unserialize($index_gui);
include "config.inc.php";
for($i=0;$i<=$gui_files;$i++)
{
   if(isset($indexArr[$i]))							//检测是否有备注信息
      echo "        <option value=".$i.">".$i.":".$indexArr[$i]."</option>";	//添加备注信息
   else
      echo "        <option value=".$i.">".$i.":</option>";
}
?>
      </select>
    </div>
    <!--Code Viewer-->
    <div>
      <div style="width: 950px;height: 596px;position: absolute;left: 450px;top: -5px;">
        <pre><code title="单击可编辑代码" id=viewer name=viewer  onclick="editCode(this);" class="hljs language-javascript"></code></pre>
      </div>
      <!--Code Editor-->
      <div id=div_code_editor style="width: 800px;height: 596px;position: absolute;left: 460px;top: 0px;visibility:hidden">
        <textarea id="CODE_EDITOR" name="CODE_EDITOR" oninput="setChanged();" style="position: absolute;top:0px"></textarea>
        <input type=button value="保存" title="数据将直接覆盖目标文件，请谨慎操作。" style="position: absolute; right: 0px; top: 0px;" onclick=saveCode(this);></input>
      </div>
    </div>
    <!--Excluded Module List-->
    <div id=EXCLUDED style="position: absolute;visibility: hidden;top: 34px;left: 450px;height:744px;background:cornsilk;font-size: 14px;">
      <span>&nbsp;如要排除某个组件，请先选择该条数据后再执行本操作。<br>&nbsp;当前已排除组件<span id=total style="color:red"></span>个：</span><br>
      <select id=excludedlist name=excludedlist size=30  style="height:704px;width:442px" ></select>
      <input type=button  style="position: absolute; right: 10px; top: 8px;" onclick="this.parentElement.style.visibility='hidden'" value='关闭'>
    </div>
  </div>
</body>
</html>