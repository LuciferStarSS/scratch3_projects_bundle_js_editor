<?php

include_once __DIR__."/manifest_lib.php";
$m = mf_gui_read();
if ($m === false) exit("manifest_gui.json 解析失败。");
if ($m === null) exit("manifest_gui.json 不存在（尚未迁移）。");
if (!empty($m["pending"])) exit("有数据已更新，请先执行“缩减”操作。");

$gui_files=(int)$m["maxModule"];

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
$m["ready"] = true;							//就绪标记并入 manifest（原 scratch_gui_ready.dat）
if (!mf_gui_write($m)) exit("557.part.js 已生成，但 manifest_gui.json 就绪标记写入失败（请重跑本程序）。");
echo "OK";
?>