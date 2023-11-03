<?php
$fid=isset($_POST["F"])?intval($_POST["F"]):"";
if($fid!=="")
{
   $filename="scratch_gui";

   if(file_exists("./data/".$filename."/".$fid.".part.js"))
   {
      $str=file_get_contents("./data/".$filename."/".$fid.".part.js");
      //$str=str_replace("\n","\n",$str);
      $str=str_replace('\n',"\n<br>",$str);
      echo $str;
       
   }
}
?>