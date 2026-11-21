<?php
$type=isset($_POST["T"])?$_POST["T"]:"";
$data=isset($_POST["D"])?$_POST["D"]:"";
$id=isset($_POST["ID"])?$_POST["ID"]:"";


if($type && $id!="")
{
   include_once __DIR__."/manifest_lib.php";

   if($type==1)//PRJ
   {
      $m = mf_prj_read();
      if ($m === false) exit("manifest_projects.json 解析失败。");
      if ($m === null) exit("manifest_projects.json 不存在（尚未迁移）。");

      $found=false;
      foreach ($m["modules"] as $k => $mo)
      {
         if ((int)$mo["n"] === (int)$id)
         {
            $dataArr=explode("|",(string)$mo["remark"]);
            if($data!="")
               $m["modules"][$k]["remark"]=$dataArr[0]."|".$data;
            else
               $m["modules"][$k]["remark"]=$dataArr[0];
            $found=true;
            break;
         }
      }
      if(!$found)//索引中尚无此条：新建（备注格式与 GUI 一致：前缀留空）
      {
         if($data!="")
         {
            $m["modules"][]=array("n"=>(int)$id,"remark"=>"|".$data);
            usort($m["modules"],function($a,$b){ return (int)$a["n"] - (int)$b["n"]; });
         }
         else
            exit("PRJOK");//无备注可写，跳过
      }
      if(!mf_prj_write($m)) exit("manifest_projects.json 写入失败。");
      exit("PRJOK");
   }
   else if($type==2)//GUI
   {
      $m = mf_gui_read();
      if ($m === false) exit("manifest_gui.json 解析失败。");
      if ($m === null) exit("manifest_gui.json 不存在（尚未迁移）。");

      $n=(int)$id;
      if(isset($m["remarks"][$n]))
      {
         $dataArr=explode("|",(string)$m["remarks"][$n]);
         if($data!="")
            $m["remarks"][$n]=$dataArr[0]."|".$data;
         else
            $m["remarks"][$n]=$dataArr[0];
      }
      else
      {
         if($data!="")
            $m["remarks"][$n]="|".$data;
         else
            unset($m["remarks"][$n]);
      }
      if(!mf_gui_write($m)) exit("manifest_gui.json 写入失败。");
      exit("GUIOK");
   }
}

?>
