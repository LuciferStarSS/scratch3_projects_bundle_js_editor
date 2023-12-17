# scratch3_projects_bundle_js_editor
An Editor to modify the code/resource in projects.bundle.js of Scratch3.0.

[!(https://github.com/LuciferStarSS/Scratch3.0_for_class/blob/main/UI.png)]

我的Scratch3.0 for Class ( https://github.com/LuciferStarSS/Scratch3.0_for_class ) 项目里，有一个./js/projects.bundle.js文件，
这个文件，包含了很多我不需要的组件；
这个工具，可以快速有效地执行剔除操作。

目录说明：

./data/

       excluded/ 所有被排除的模块，仅作备份和对比
       
       projects/ 所有模块数据
       
       scratch-gui/ 第557号模块 Scratch GUI核心代码
       
       scratch-gui2/ 简单地去除了部分注释后的版本
       
       index_projects.inc.php 记录了projects.bunlde.js中各个模块的简单描述，以及是否被排除等信息
       
       index_gui.inc.php 记录了第557号模块中各子模块的简单描述，自定义扩展也在这里添加
       
       scratch_gui_modified.dat 用于第557号模块生成的控制量，用于瘦身“缩减”操作
       
       scratch_gui_ready.dat 用于第557号模块生成的控制量，用于“生成”操作
       
./config.inc.php 记录了第557号模块scratch-gui中文档数量，要添加新的扩展时，需要修改这个文件

./build_projects.php 用于生成projects.bundle.js，保存于../editor/js/

./build_gui_557.php 用于生成557.part.js，保存于./data/projects/

./saveFile.php  用于文件修改后的保存

./setMemo.php 给文件设置备注

./getFile_gui.php 获取GUI组件文件的数据

./getFile_proj.php 获取projects组件文件的数据

./shrink_gui_557.php 给GUI组件文件瘦身
