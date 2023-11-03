<?php
$scratch_editor_path="../editor";
$filename="scratch_gui";

include "config.inc.php";
$filedata=file_get_contents("./data/".$filename."/header.part.js");

$index=Array();

for($i=0;$i<=$gui_files;$i++)
{
   if(file_exists("./data/".$filename."/".$i.".part.js"))
   {
      $str=file_get_contents("./".$filename."./".$i.".part.js");

      preg_match("/module.exports = ([0-9a-zA-Z]+);/",$str,$fileinfo);

      if($fileinfo)
      {
//print_r($fileinfo);

         //echo $i.":".$fileinfo[1]."\r\n";
         $index[$i]=$fileinfo[1];
      }

      else
      {
         preg_match("/function ([0-9a-zA-Z]+)\(/",$str,$fileinfo);

         if($fileinfo)
         {


            echo $i.":".$fileinfo[1]."\r\n";
            $index[$i]=$fileinfo[1];
         }
      }



      //echo $i;print_r($filepath);

      //echo  $i."|".$filepath[1]."|".(($i==$filepath[1])?"SAME":"").  "\n";



      $filedata.=$str.',\n';
   }
   else
   {
      $filedata.='/* '.$i.' */,\n';
   }
}
$filedata.=file_get_contents("./data/".$filename."/tail.part.js");

//file_put_contents("./data/index_gui.inc.php",serialize($index));

file_put_contents("./data/projects/557.part.js",$filedata);
?>