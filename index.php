<title>Scratch3.0源码编辑器</title>
<link rel="stylesheet" type="text/css" href="./css/brush-trees-dark.min.css"/>
<script src=./js/jquery.js></script>
<!--script src=./js/highlight.js></script-->
<!--script src=./js/javascript.min.js></script-->
<!--Projects Module-->
<div>
   <div>
      <input type=text title="输入字符，将自动匹配第一条数据。敲回车键，会从当前位置继续搜索。" id=find_prj name=find_prj autocomplete=off onclick="setSearchType(1);" onInput="doSearching_prj(this);" style="width:125px;">
      <input type=button value="已阅" title="数据后面打√表示此文件已经过判读" onclick="setPRJStatus();"><input type=button value="隐藏" title="隐藏已被排除的组件，刷新网页将恢复。" onclick="hideModule();"><input type=button value="排除"  title="数据后面打×表示生成时排除" onclick="removeModule();"><input type=button value="设置备注" onclick="setPRJMemo();"><input type=button value="GUI模块"  title="打开Scratch GUI模块" onclick="showPROJFile(557);">
      <input type=button value="生成"  title="为防止误操作，数据只生成在当前目录。生成后，请手动复制文件到指定位置。"  onclick="createProjects();"><br>
      <select id=MID name=MID size=350 style="height:350px;width:442px" onclick="showPROJFile(this);">
<?php
$index_proj=file_get_contents("./data/index_projects.inc.php");
$indexArr=unserialize($index_proj);
foreach($indexArr as $key=>$value)
{
   echo "<option value=".$key.">".$key.":".$value."</option>";
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
$index_gui=file_get_contents("./data/index_gui.inc.php");
$indexArr=unserialize($index_gui);
include "config.inc.php";
for($i=0;$i<=$gui_files;$i++)
{
   if(isset($indexArr[$i]))
      echo "<option value=".$i.">".$i.":".$indexArr[$i]."</option>";
   else
      echo "<option value=".$i.">".$i.":</option>";

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
      <span>
      &nbsp;如要排除某个组件，请先选择该条数据后再执行本操作。<br>&nbsp;当前已排除组件<span id=total style="color:red"></span>个：
      </span><br>
      <select id=excludedlist name=excludedlist size=30  style="height:704px;width:442px" ></select>
      <input type=button  style="position: absolute; right: 10px; top: 8px;" onclick="this.parentElement.style.visibility='hidden'" value='关闭'>
   </div>

</div>
<script>
var bChanged=false;
var nID=0;
var nType=0;

$(document).ready(function(){
   $("input").keydown(function (event){
      if(event.keyCode == 13){
        if(nType==1)
           doSearching_prj2();
        else if(nType==2)
           doSearching_gui2();
      }
   });
});

function shrinkGUI()
{
   $.get("./shrink_gui_557.php?t=" + Math.random(), function (data) {
      alert(data);
   });
}


function createProjects()
{
   $.get("./build_projects.php?t=" + Math.random(), function (data) {
      alert(data);
   });
}

function createGUI()
{
   $.get("./build_gui_557.php?t=" + Math.random(), function (data) {
      alert(data);
   });
}

function hideModule()
{
   var sel=document.getElementById("MID");
   for(var i=sel.length-1;i>-1;i--)
   {
      if(sel.options[i].text.indexOf("×")>-1)
      {
         sel.options[i].remove();
      }
   }
}

function removeModule()
{
   var sel=document.getElementById("MID");
   if(sel.selectedIndex!=-1)
   {
      var strMemo="";

      if(sel.options[sel.selectedIndex].text.indexOf("×")==-1)
      {
          var strHolder=sel.options[sel.selectedIndex].text.split("|")[1];
          strHolder=strHolder==undefined?"×":"×"+strHolder;
          sel.options[sel.selectedIndex].text=sel.options[sel.selectedIndex].text.split("|")[0]+"|"+strHolder;

          $.post("setMemo.php?t=" + Math.random(), { "T": nType,"D":strHolder,"ID":sel.value}, function (data) {
             if(data=="PRJOK")
                document.getElementById("MEMOINFO").innerText="已排除此模块："+sel.options[sel.selectedIndex].text.split("|")[0];
          });
          document.getElementById("find_prj").focus();
      }
      else
      {
          var strHolder=sel.options[sel.selectedIndex].text.replace("×","").split("|")[1];
          strHolder=strHolder==undefined?"":strHolder;
          sel.options[sel.selectedIndex].text=sel.options[sel.selectedIndex].text.split("|")[0]+"|"+strHolder;

          $.post("setMemo.php?t=" + Math.random(), { "T": nType,"D":strHolder,"ID":sel.value}, function (data) {
             if(data=="PRJOK")
                document.getElementById("MEMOINFO").innerText="已恢复此模块："+sel.options[sel.selectedIndex].text.split("|")[0];
          });
          document.getElementById("find_gui").focus();
      }
   }
   else
   {
      document.getElementById("EXCLUDED").style.visibility="visible";
      var sel_excluded=document.getElementById("excludedlist");
      sel_excluded.length=0;
      for(var i=0;i<sel.length;i++)
      {
          if(sel.options[i].text.indexOf("×")>-1)  sel_excluded.add(new Option(sel.options[i].text.split("|")[0],''));
      }
      document.getElementById("total").innerText=sel_excluded.length;
   }
}

function setPRJStatus()
{
   var sel=document.getElementById("MID");
   if(sel.selectedIndex!=-1)
   {
      var strMemo="";

      if(sel.options[sel.selectedIndex].text.indexOf("√")==-1)
      {
          var strHolder=sel.options[sel.selectedIndex].text.split("|")[1];
          strHolder=strHolder==undefined?"√":"√"+strHolder;
          sel.options[sel.selectedIndex].text=sel.options[sel.selectedIndex].text.split("|")[0]+"|"+strHolder;

          document.getElementById("MEMOINFO").innerText=strHolder;
          $.post("./setMemo.php?t=" + Math.random(), { "T": nType,"D":strHolder,"ID":sel.value}, function (data) {});
      }
   }
   else
   {
      alert("请先选择一条数据。");
   }
}


function setGUIStatus()
{
   var sel=document.getElementById("GUI");
   if(sel.selectedIndex!=-1)
   {
      var strMemo="";

      if(sel.options[sel.selectedIndex].text.indexOf("√")==-1)
      {
          var strHolder=sel.options[sel.selectedIndex].text.split("|")[1];
          strHolder=strHolder==undefined?"√":"√"+strHolder;
          sel.options[sel.selectedIndex].text=sel.options[sel.selectedIndex].text.split("|")[0]+"|"+strHolder;

          document.getElementById("MEMOINFO").innerText=strHolder;
          $.post("./setMemo.php?t=" + Math.random(), { "T": nType,"D":strHolder,"ID":sel.selectedIndex}, function (data) {});
      }
   }
   else
   {
      alert("请先选择一条数据。");
   }
}



function setPRJMemo()
{
   var sel=document.getElementById("MID");
   if(sel.selectedIndex!=-1)
   {
      var strMemo="";
      var strHolder=sel.options[sel.selectedIndex].text.split("|")[1];
      if((strMemo=prompt("请输入此条数据的备注信息。",strHolder==undefined?'':strHolder  ))!=null)
      {
          if(strMemo!="")
             sel.options[sel.selectedIndex].text=sel.options[sel.selectedIndex].text.split("|")[0]+"|"+strMemo;
          else
             sel.options[sel.selectedIndex].text=sel.options[sel.selectedIndex].text.split("|")[0];

          document.getElementById("MEMOINFO").innerText=strMemo;
          $.post("./setMemo.php?t=" + Math.random(), { "T": nType,"D":strMemo,"ID":sel.value}, function (data) {});
      }
   }
   else
   {
      alert("请先选择一条数据。");
   }
}

function setGUIMemo()
{
   var sel=document.getElementById("GUI");
   if(sel.selectedIndex!=-1)
   {
      var strMemo="";
      var strHolder=sel.options[sel.selectedIndex].text.split("|")[1];
      if((strMemo=prompt("请输入此条数据的备注信息。",strHolder==undefined?'':strHolder  ))!=null)
      {
          if(strMemo!="")
             sel.options[sel.selectedIndex].text=sel.options[sel.selectedIndex].text.split("|")[0]+"|"+strMemo;
          else
             sel.options[sel.selectedIndex].text=sel.options[sel.selectedIndex].text.split("|")[0];

          document.getElementById("MEMOINFO").innerText=strMemo;
          $.post("./setMemo.php?t=" + Math.random(), { "T": nType,"D":strMemo,"ID":sel.selectedIndex}, function (data) {});

      }
   }
   else
   {
      alert("请先选择一条数据。");
   }
}

function setSearchType(n)
{
   nType=n;
}


function doSearching_prj(i)
{
   var str=i.value;
   var sel=document.getElementById("MID");
   if(sel)
   {
      for(var i=0;i<sel.options.length;i++)

      {
 
        if(sel.options[i].text.toUpperCase().indexOf(str.toUpperCase())>-1)
         {
            sel.selectedIndex=i;

            return;
         }
      }
   }
}


function doSearching_prj2()
{
   var str=document.getElementById("find_prj").value;
   var sel=document.getElementById("MID");
   if(sel)
   {
      for(var i=sel.selectedIndex+1;i<sel.options.length;i++)

      {
 
        if(sel.options[i].text.toUpperCase().indexOf(str.toUpperCase())>-1)
         {
            sel.selectedIndex=i;

            return;
         }
      }
   }
}

function doSearching_gui(i)
{
   var str=i.value;
   var sel=document.getElementById("GUI");
   if(sel)
   {
      for(var i=0;i<sel.options.length;i++)

      {
 
        if(sel.options[i].text.toUpperCase().indexOf(str.toUpperCase())>-1)
         {
            sel.selectedIndex=i;

            return;
         }
      }
   }
}


function doSearching_gui2()
{
   var str=document.getElementById("find_gui").value;
   var sel=document.getElementById("GUI");
   if(sel)
   {
      for(var i=sel.selectedIndex+1;i<sel.options.length;i++)

      {
 
        if(sel.options[i].text.toUpperCase().indexOf(str.toUpperCase())>-1)
         {
            sel.selectedIndex=i;

            return;
         }
      }
   }
}

function showPROJFile(f)
{
   document.getElementById("EXCLUDED").style.visibility="hidden";

   if(bChanged)
   {
      if(confirm("当前项目已修改，是否要去保存？")==1)
      {
         return;
      }
      else bChanged=false;
   }


   if(typeof f =='object') 
      nID=f.value;
   else
   {
      nID=f;
   }


   nType=1;
   if(nID==557)
   {
      //alert("此文件需要用另一个编辑器处理。");
      document.getElementById("GUIDIV").style.visibility="visible";
      //document.getElementById("GUIDIV").style.width=f.offsetWidth;
      //document.getElementById("GUI").style.width=f.offsetWidth;
      document.getElementById("find_gui").style.visibility="visible";
      //document.getElementById("find_gui").style.width=f.offsetWidth-110;

   }
   else
   {
      document.getElementById("GUIDIV").style.visibility="hidden";
      document.getElementById("find_gui").style.visibility="hidden";
      document.getElementById("div_code_editor").style.visibility="hidden";
      $.post("./getFile_proj.php?t=" + Math.random(), { "F": f.value}, function (data) {

         if(data.length>0){
            document.getElementById("viewer").innerText=data;
            //hljs.highlightAll();
         }
   
   });

      var sel=document.getElementById("MID");
      if(sel.selectedIndex!=-1)
      {
         var strHolder=sel.options[sel.selectedIndex].text.split("|")[1];
         document.getElementById("MEMOINFO").innerText=strHolder==undefined?"":strHolder;
      }

   }
}



function showGUIFile(f)
{
   document.getElementById("EXCLUDED").style.visibility="hidden";

   if(bChanged)
   {
      if(confirm("当前项目已修改，是否要去保存？")==1)
      {
         return;
      }
      else bChanged=false;
   }

   nID=f.value;
   nType=2;
   if(nID==557)
   {
      //alert("此文件需要用另一个编辑器处理。");
      document.getElementById("GUIDIV").style.visibility="visible";
      //document.getElementById("find_gui").style.visibility="visible";
   }
   else
   {
      //document.getElementById("GUIDIV").style.visibility="hidden";
      document.getElementById("div_code_editor").style.visibility="hidden";
      $.post("./getFile_gui.php?t=" + Math.random(), { "F": f.value}, function (data) {

         if(data.length>0){
            document.getElementById("viewer").innerText=data;
            //hljs.highlightAll();
         }
   
   });

      var sel=document.getElementById("GUI");
      if(sel.selectedIndex!=-1)
      {
         var strHolder=sel.options[sel.selectedIndex].text.split("|")[1];
         document.getElementById("MEMOINFO").innerText=strHolder==undefined?"":strHolder;
      }
   }
}


function editCode(o)
{
   var editor=document.getElementById("div_code_editor");
   editor.style.visibility="visible";
   var t=document.getElementById("CODE_EDITOR");

   t.value=o.innerText;   
   editor.style.left=o.parentElement.parentElement.offsetLeft;
   editor.style.top=o.parentElement.parentElement.offsetTop+13;
   editor.style.height=t.style.height=o.offsetHeight;
   editor.style.width=t.style.width=o.offsetWidth;

   if(nType==2) alert("注意，第557号模块里的代码，所有的双引号，要用转义符。\n“\"” 应写成： “\\\"”");
   //t.focus();
}

function saveCode(i)
{
   //alert(nID+'|'+nType);

   $.post("./saveFile.php?t=" + Math.random(), { "ID":nID,"T":nType,"D": CODE_EDITOR.value}, function (data) {

      if(data.length>0){
         if(data=="OK")
         {
            bChanged=false;
            document.getElementById("div_code_editor").style.visibility="hidden";
            document.getElementById("viewer").innerText=document.getElementById("CODE_EDITOR").value;
         }
         else alert("保存失败，请重试。"+data);
      }
   });



}

function setChanged()
{
   bChanged=true;
}
</script>