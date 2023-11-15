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
