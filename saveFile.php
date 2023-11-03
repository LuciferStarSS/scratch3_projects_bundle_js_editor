<?php
$id=isset($_POST['ID'])?$_POST["ID"]:"";
$type=isset($_POST['T'])?$_POST["T"]:"";
$data=isset($_POST['D'])?$_POST["D"]:"";

if($id && $type && $data)
{

   //echo $id."|".$type."|".$data;
   $data=str_replace("\n<br>",'\n',$data);
   if($type==1)
   {
      file_put_contents("./data/projects/".$id.".part.js",$data);
      echo "OK";
   }
   else if($type==2)
   {
      file_put_contents("./data/scratch_gui/".$id.".part.js",$data);
      file_put_contents("./data/scratch_gui_modified.dat",@file_get_contents("./data/scratch_gui_modified.dat").$id."\n");
      file_put_contents("./data/scratch_gui_ready.dat","");
      echo "OK";
   }
   else echo "²ÎÊý´íÎó¡£";
}

?>