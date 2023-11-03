<?php
set_time_limit(0);
$scratch_editor_path="../editor";
$filename="scratch_gui";

//$filedata=file_get_contents("./data/".$filename."/header.part.js");
$ids=@file_get_contents("./data/scratch_gui_modified.dat");
file_put_contents("./data/scratch_gui_modified.dat",'');
if($ids=="") exit("暂无要缩减的文件。");

$idArr=explode("\n",trim($ids,"\n"));

$idc=count($idArr);
//exit;

$index=Array();
flush();

//193
//1480?

for($i=0;$i<$idc;$i++)
{
   $id=$idArr[$i];
   echo $i."：".$id."\r\n";
   if(file_exists("./data/".$filename."/".$id.".part.js"))
   {
      $str=file_get_contents("./data/".$filename."/".$id.".part.js");

if($id==56 || $id==103 || $id==931 || $id==933 || $id==934 || $id==1281 ||  $id==1267 )//OK增加对非注释结尾的“\\n”的处理
{
//echo $str."\r\n";
      $str=str_replace('\\n','<bbrr>',$str);

//      preg_match_all("/\/\*([^^]*?)\*\//",$str,$m);
  //    print_r($m[0]);
      preg_match_all("/\/\/ ([^^]*?)\\\\n/",$str,$m);
      $str=str_replace($m[0],'\n',$str);
      $str=str_replace('<bbrr>','\\n',$str);

//echo $str;

}
else if($id==1219 || $id==1248)// OK  处理如下异情结构：//comments\\n
{
//echo $i."\r\n+++++++++++++++++\r\n";

      preg_match_all("/\/\/ ([^^]*?)\\\\n/",$str,$m);
      $str=str_replace($m[0],'',$str);

//print_r($m[0]);
//echo $i."\r\n+++++++++++++++++\r\n";
 
}
else if($id==1322 || $id==1249)
{


}
else//普通文件
{
       //      preg_match_all("/\/\*([^^]*?)\*\//",$str,$m);
       //   $str=str_replace($m[0],"",$str);
      preg_match_all("/\/\/ ([^^]*?)\\\\n/",$str,$m);
      $str=str_replace($m[0],'\n',$str);
//      print_r($m[0]);
}

if($id!=135 && $id!=144 && $id!=193 && $id!=219 && $id!=225 && $id!=309 && $id!=426)// && $id!=450)
{
      preg_match_all("/ \/\*([^^]*?)\*\//",$str,$m);
//print_r($m[0]);
      $str=str_replace($m[0],"",$str);


}
else
{
      preg_match_all("/\/\*([^^]*?)\*\//",$str,$m);
//print_r($m[0]);
      $str=str_replace($m[0],"",$str);

}


      file_put_contents("./data/".$filename."2/".$id.".part.js",$str);
   }
   else
   {
      $filedata.='/* '.$id.' */,\n';
      file_put_contents("./data/".$filename."2/".$id.".part.js",',\n');
   }

}

echo "OK";
?>