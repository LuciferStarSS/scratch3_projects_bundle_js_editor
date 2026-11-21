# Scratch 3.0 Projects Bundle JS Editor

A tool for managing and building Scratch 3.0 extensions and projects.

## Project Introduction

This project is a Scratch 3.0 extension editor and management tool, primarily used for:

- Managing Scratch 3.0 GUI extensions
- Building and packaging Scratch projects
- Management and backup of extension functions
- Importing and integrating custom extensions

## Directory Structure

```
├── add_extension.php          # Core extension management functionality
├── base64.php                 # Base64 encoding handling
├── build_gui_557.php          # GUI build script
├── build_projects.php         # Project build script
├── checkmodule.php            # Module check
├── css/                       # Style files
├── data/                      # Data directory
│   ├── backup/               # Extension backups
│   ├── excluded/             # Excluded extensions
│   ├── manifest_gui.json     # GUI manifest
│   ├── manifest_projects.json # Project manifest
│   ├── projects/             # Project files
│   ├── scratch_gui/          # Scratch GUI source code
│   └── scratch_gui2/         # Scratch GUI 2 source code
└── LICENSE                   # License
```

## Main Features

### Extension Management (add_extension.php)

- `jout()` - JSON output formatting
- `read_text()` - Read text files
- `decode_data_url()` - Decode Data URL
- `img_magic_ok()` - Image magic bytes validation
- `img_mime()` - Get image MIME type
- `make_backup_dir()` - Create backup directory
- `find_121_entry()` - Find extension entry point
- `find_121_imports()` - Find extension imports
- `read_manifest()` / `write_manifest()` - Manifest read/write
- `gui_files_count()` - GUI file count
- `compact_after_block()` - Compaction processing
- `unblock_core()` - Unblock core

### Build Features

- **build_gui_557.php** - Build specific version GUI
- **build_projects.php** - Build project packages

## Usage Instructions

### Environment Requirements

- PHP 7.0+
- Web Server (Apache/Nginx)
- Sufficient disk space for storing project files

### Installation & Deployment

1. Upload project files to the web server
2. Ensure `data/` directory has write permissions
3. Configure web server to point to the project root directory
4. Visit the homepage to start using

### Extension Addition Process

1. Upload extension files via `add_extension.php`
2. System automatically validates image resources
3. Extension is added to the manifest
4. New extensions can be used in the GUI

## Data Format

### Manifest File Format (manifest_gui.json)

```json
{
  "extensions": [
    {
      "id": "extension_id",
      "name": "Extension Name",
      "status": "active|blocked"
    }
  ]
}
```

### Backup Directory Naming Convention

Format: `YYYYMMDD-HHMMSS_Description`

Example: `20261118-095459_THISISANEWEXTENSION`

## Tech Stack

- **Backend**: PHP
- **Frontend**: JavaScript (Scratch GUI)
- **Data Storage**: JSON File System

## Notes

- Regularly back up the `data/` directory
- Uploaded images must meet format requirements (PNG, SVG)
- Extension IDs must be unique
- Comply with Scratch extension development specifications

## License

This project is released under a specific license. Please refer to the LICENSE file for details.