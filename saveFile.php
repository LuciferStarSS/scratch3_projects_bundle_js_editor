<?php
$id=isset($_POST['ID'])?$_POST["ID"]:"";
$type=isset($_POST['T'])?$_POST["T"]:"";
$data=isset($_POST['D'])?$_POST["D"]:"";

if($id && $type && $data)
{

   //echo $id."|".$type."|".$data;exit();
   if($type==1)
   {
      $data=str_replace("\n<br>",'\n',$data);

      file_put_contents("./data/projects/".$id.".part.js",$data);
      echo "OK";
   }
   else if($type==2)
   {
      $data=str_replace("\n",'\n',$data);

      file_put_contents("./data/scratch_gui/".$id.".part.js",$data);
      include_once __DIR__."/manifest_lib.php";
      $m = mf_gui_read();
      if ($m === false) exit("manifest_gui.json");
      if ($m === null) exit("manifest_gui.json");
      $m = mf_gui_pending_merge($m, array((int)$id));
      if(!mf_gui_write($m)) exit("manifest_gui.json ");
      echo "OK";
   }
   else echo "²ÎÊý´íÎó¡£";
}

?>