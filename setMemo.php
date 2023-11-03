<?php
$type=isset($_POST["T"])?$_POST["T"]:"";
$data=isset($_POST["D"])?$_POST["D"]:"";
$id=isset($_POST["ID"])?$_POST["ID"]:"";


if($type && $id!="")
{
   if($type==1)//PRJ
   {
      $index_proj=file_get_contents("./data/index_projects.inc.php");
      $indexArr=unserialize($index_proj);
      $dataArr=explode("|",$indexArr[$id]);
      if($data!="")
         $indexArr[$id]=$dataArr[0]."|".$data;
      else
         $indexArr[$id]=$dataArr[0];

      file_put_contents("./data/index_projects.inc.php",serialize($indexArr));
      exit("PRJOK");
   }
   else if($type==2)//GUI
   {
      $index_proj=file_get_contents("./data/index_gui.inc.php");
      $indexArr=unserialize($index_proj);
      if(isset($indexArr[$id]))
      {
         $dataArr=explode("|",$indexArr[$id]);
         if($data!="")
            $indexArr[$id]=$dataArr[0]."|".$data;
         else
            $indexArr[$id]=$dataArr[0];
      }
      else
      {
         if($data!="")
            $indexArr[$id]="|".$data;
         else
            unset($indexArr[$id]);
      }
      //print_r($indexArr[$id]);
      file_put_contents("./data/index_gui.inc.php",serialize($indexArr));
      exit("GUIOK");
   }
}

?>