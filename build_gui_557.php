<?php

$ids=@file_get_contents("./data/scratch_gui_modified.dat");
if($ids!="") exit("有数据已更新，请先执行“缩减”操作。");

include "config.inc.php";

$scratch_editor_path="../editor";
$filename="scratch_gui2";

$filedata=file_get_contents("./data/".$filename."/header.part.js");

$index=Array();

for($i=0;$i<=$gui_files;$i++)
{
   if(file_exists("./data/".$filename."/".$i.".part.js"))
   {
      $str=file_get_contents("./data/".$filename."/".$i.".part.js");

      $filedata.=$str.',\n';
   }
   else
   {
      $filedata.='/* '.$i.' */,\n';
   }
}

$filedata=trim($filedata,',\n').'\n';

$filedata.=file_get_contents("./data/".$filename."/tail.part.js");

file_put_contents("./data/projects/557.part.js",$filedata);
file_put_contents("./data/scratch_gui_ready.dat","OK");
echo "OK";
?>