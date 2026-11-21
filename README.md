# Scratch 3.0 Projects Bundle JS Editor

一个用于管理和构建 Scratch 3.0 扩展及项目的工具。

## 项目简介

本项目是一个 Scratch 3.0 扩展编辑器和管理工具，主要用于：

- 管理 Scratch 3.0 GUI 扩展
- 构建和打包 Scratch 项目
- 扩展功能的管理和备份
- 自定义扩展的导入和集成

## 目录结构

```
├── add_extension.php          # 核心扩展管理功能
├── base64.php                 # Base64 编码处理
├── build_gui_557.php          # GUI 构建脚本
├── build_projects.php         # 项目构建脚本
├── checkmodule.php            # 模块检查
├── css/                       # 样式文件
├── data/                      # 数据目录
│   ├── backup/               # 扩展备份
│   ├── excluded/             # 排除的扩展
│   ├── manifest_gui.json     # GUI 清单
│   ├── manifest_projects.json # 项目清单
│   ├── projects/             # 项目文件
│   ├── scratch_gui/          # Scratch GUI 源码
│   └── scratch_gui2/         # Scratch GUI 2 源码
└── LICENSE                   # 许可证
```

## 主要功能

### 扩展管理 (add_extension.php)

核心函数包括：

- **jout()** - JSON 输出格式化
- **read_text()** - 读取文本文件
- **decode_data_url()** - 解码 Data URL
- **img_magic_ok()** - 图片魔术字节验证
- **img_mime()** - 获取图片 MIME 类型
- **make_backup_dir()** - 创建备份目录
- **find_121_entry()** - 查找扩展入口
- **find_121_imports()** - 查找扩展导入
- **read_manifest() / write_manifest()** - 清单读写
- **gui_files_count()** - GUI 文件计数
- **compact_after_block()** - 紧凑化处理
- **unblock_core()** - 解除核心阻塞

### 构建功能

- **build_gui_557.php** - 构建特定版本的 GUI
- **build_projects.php** - 构建项目包

## 使用说明

### 环境要求

- PHP 7.0+
- Web 服务器 (Apache/Nginx)
- 足够的磁盘空间用于存储项目文件

### 安装部署

1. 将项目文件上传到 Web 服务器
2. 确保 `data/` 目录有写入权限
3. 配置 Web 服务器指向项目根目录
4. 访问首页开始使用

### 扩展添加流程

1. 通过 `add_extension.php` 上传扩展文件
2. 系统自动验证图片资源
3. 扩展被添加到清单中
4. 可以在 GUI 中使用新扩展

## 数据格式

### 清单文件格式 (manifest_gui.json)

```json
{
  "extensions": [
    {
      "id": "extension_id",
      "name": "扩展名称",
      "status": "active|blocked"
    }
  ]
}
```

### 备份目录命名规则

格式：`YYYYMMDD-HHMMSS_描述`

示例：`20261118-095459_THISISANEWEXTENSION`

## 技术栈

- **后端**: PHP
- **前端**: JavaScript (Scratch GUI)
- **数据存储**: JSON 文件系统

## 注意事项

- 定期备份 `data/` 目录
- 上传的图片需符合格式要求 (PNG, SVG)
- 扩展 ID 必须唯一
- 遵守 Scratch 扩展开发规范

## 许可证

本项目基于特定许可证发布，请查看 LICENSE 文件了解详情。