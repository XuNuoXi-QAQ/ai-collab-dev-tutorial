# libvips 详细教程

> 高性能、低内存占用的开源图像处理库 —— 适合服务器端大规模图像处理。

---

## 📖 目录

- [1. libvips 简介](#1-libvips-简介)
- [2. 核心特点与优势](#2-核心特点与优势)
- [3. 应用场景与使用案例](#3-应用场景与使用案例)
- [4. 安装指南](#4-安装指南)
  - [4.1 macOS](#41-macos)
  - [4.2 Linux (通用)](#42-linux-通用)
  - [4.3 Manjaro / Arch Linux](#43-manjaro--arch-linux)
  - [4.4 Windows](#44-windows)
  - [4.5 Python (pyvips) 安装](#45-python-pyvips-安装)
  - [4.6 从源码编译](#46-从源码编译)
- [5. 基础使用示例](#5-基础使用示例)
  - [5.1 命令行工具 vips](#51-命令行工具-vips)
  - [5.2 Python 示例](#52-python-示例)
- [6. 常见问题与注意事项](#6-常见问题与注意事项)
- [7. 扩展资源](#7-扩展资源)

---

## 1. libvips 简介

`libvips` 是一个**开源图像处理库**，最初于 1989 年由欧盟资助的博物馆成像项目开发，旨在处理远超内存容量的巨幅扫描图像。它以其**惊人的处理速度**和**极低的内存占用**而著称，尤其适合在服务器端进行高并发、大规模的图像处理任务。

- **许可协议**：LGPL-2.1-or-later，允许自由使用，包括商业软件。
- **支持格式**：JPEG, PNG, WebP, TIFF, GIF, SVG, HEIC, AVIF, JPEG XL, 以及通过扩展支持 DICOM, OpenSlide 等专业格式。
- **多语言绑定**：除 C/C++ 原生接口外，官方或社区提供了 Python (pyvips)、Ruby、PHP、Node.js、Go、Rust、C# 等语言的绑定。

---

## 2. 核心特点与优势

| 特点 | 说明 |
|------|------|
| **按需处理 (Demand-driven)** | 只计算最终输出所需的像素区域，无需将整张图片加载到内存。可处理数十亿像素的巨图。 |
| **水平多线程 (Horizontally-threaded)** | 自动将图像分成多个区域并行处理，充分利用多核 CPU，速度通常比 ImageMagick 快数倍。 |
| **内存效率极高** | 处理大图时内存占用稳定在较小范围内，避免了内存溢出风险。 |
| **丰富的操作集** | 内置超过 300 种图像处理操作，包括裁剪、缩放、旋转、色彩转换、卷积、形态学、直方图、像素统计等。 |
| **现代格式原生支持** | 直接支持 HEIC, AVIF, JPEG XL 等新型格式，无需额外依赖。 |
| **跨平台** | 支持 Linux, macOS, Windows, 以及多种 CPU 架构。 |

---

## 3. 应用场景与使用案例

libvips 被广泛应用于需要高性能图像处理的场景：

- **Web 服务动态缩略图**：如 `imgproxy`、`wsrv.nl` 等项目。
- **社交网络**：Mastodon 使用 libvips 进行图片缩放和裁剪。
- **内容管理系统**：MediaWiki 在生成缩略图时可选用 libvips 后端。
- **Node.js 图像处理**：`sharp` 库底层即基于 libvips。
- **Ruby on Rails**：CarrierWave 上传组件支持 libvips 作为图像处理器。
- **医学/科研图像**：处理 DICOM 或显微扫描切片。

---

## 4. 安装指南

### 4.1 macOS

使用 [Homebrew](https://brew.sh/) 一键安装：

```bash
brew install vips
```

该命令会安装 libvips 及其大部分可选组件（如 libjpeg, libpng, libwebp, libtiff 等）。

---

### 4.2 Linux (通用)

**Debian / Ubuntu**

```bash
sudo apt update
sudo apt install libvips42 libvips-dev libvips-tools
```

如果官方源版本过旧（例如 Ubuntu 20.04 可能为 8.9），可考虑添加第三方 PPA（如 `~jcupitt/ppa`）：

```bash
sudo add-apt-repository ppa:jcupitt/ppa
sudo apt update
sudo apt install libvips-dev
```

**Fedora / RHEL**

```bash
sudo dnf install libvips libvips-devel
```

**OpenSUSE**

```bash
sudo zypper install libvips libvips-devel
```

---

### 4.3 Manjaro / Arch Linux

Manjaro 基于 Arch，使用 `pacman` 包管理器：

```bash
# 更新系统并安装
sudo pacman -Syu libvips
```

如果需要开发头文件（通常已包含在 `libvips` 包中）：

```bash
sudo pacman -S libvips-dev   # 若提示不存在，则不需要额外安装
```

**图形界面安装**：通过 Pamac（“添加/删除软件”）搜索 `libvips` 并安装。

**验证安装**：

```bash
vips --version
```

---

### 4.4 Windows

推荐使用官方提供的预编译二进制包：

1. 访问 [libvips 官网下载页](https://www.libvips.org/) 或 [GitHub Releases](https://github.com/libvips/libvips/releases)。
2. 下载最新的 `vips-dev-w64-web-x.y.z.zip`（web 版本仅包含安全格式）或 `vips-dev-w64-all-x.y.z.zip`（包含所有格式）。
3. 解压到目标目录，例如 `C:\vips-dev-8.16`。
4. 将 `bin` 子目录（如 `C:\vips-dev-8.16\bin`）添加到系统 `PATH` 环境变量中。

**注意**：`web` 版本格式支持较少但更安全，适合公开服务；`all` 版本支持完整但可能引入潜在漏洞。

---

### 4.5 Python (pyvips) 安装

推荐方式（自动下载预编译 libvips 二进制）：

```bash
pip install "pyvips[binary]"
```

如果系统已安装 libvips，则可直接安装纯 Python 绑定：

```bash
pip install pyvips
```

**Windows 下动态库路径设置**（避免修改系统 PATH）：

```python
import os
import sys

vips_bin = r'C:\vips-dev-8.16\bin'   # 替换为实际路径

# Python 3.8+ 推荐使用 add_dll_directory
if hasattr(os, 'add_dll_directory'):
    os.add_dll_directory(vips_bin)
else:
    os.environ['PATH'] = vips_bin + ';' + os.environ['PATH']

import pyvips
```

**Conda 环境**（通过 conda-forge）：

```bash
conda install -c conda-forge pyvips
```

---

### 4.6 从源码编译

当需要自定义编译选项（如启用/禁用特定格式支持）或平台无预编译包时，可源码编译。

**依赖**：`build-essential`, `pkg-config`, `glib-2.0`, `libexpat1-dev`, `libjpeg-dev`, `libpng-dev`, `libtiff-dev`, `libwebp-dev`, `libheif-dev`, `libjxl-dev` 等。

**步骤**：

```bash
wget https://github.com/libvips/libvips/releases/download/v8.16.0/vips-8.16.0.tar.xz
tar xf vips-8.16.0.tar.xz
cd vips-8.16.0
meson setup build --prefix=/usr/local
cd build
meson compile
meson test   # 可选
sudo meson install
```

编译前可查看 `meson setup` 的输出，确认所有需要的依赖均被找到。

---

## 5. 基础使用示例

### 5.1 命令行工具 `vips`

`vips` 提供丰富的命令行操作。基本语法：`vips [operation] [input] [output] [options]`

**示例 1：将图像缩放到 200 像素宽（保持比例）**

```bash
vips resize input.jpg output.jpg 200
```

**示例 2：裁剪图像中心 300x300 区域**

```bash
vips crop input.jpg cropped.jpg 0 0 300 300
```

**示例 3：转换为 WebP 格式并设置质量 80%**

```bash
vips copy input.png output.webp --Q 80
```

**示例 4：获取图像元信息**

```bash
vipsheader input.jpg
```

---

### 5.2 Python 示例

```python
import pyvips

# 读取图像
image = pyvips.Image.new_from_file('input.jpg')

# 缩放到宽度 300px（高度自动按比例）
resized = image.resize(300 / image.width)

# 转为灰度
grey = resized.colourspace('b-w')

# 保存为 WebP
grey.write_to_file('output.webp', Q=85)

# 获取尺寸
print(f"Width: {grey.width}, Height: {grey.height}")
```

更多操作参见 [pyvips 官方 API 文档](https://pyvips.readthedocs.io/)。

---

## 6. 常见问题与注意事项

- **`libdeflate.so.0` 缺失**：Manjaro/Arch 上通常需要安装 `libdeflate` 并更新系统：`sudo pacman -Syu libdeflate`。
- **libvips 版本过低**：某些操作需要较新版本（如 AVIF 支持需要 ≥8.9）。升级系统或使用第三方源。
- **Windows 下 DLL 加载失败**：确保将 `bin` 目录加入 `PATH`，或在代码中使用 `add_dll_directory`。
- **格式支持不全**：安装时可能未编译相应解码器，可通过 `vips --vips-config` 查看已启用的格式，并重新编译安装缺失依赖。
- **内存占用仍然很高**：检查是否禁用了分片处理（`--vips-concurrency`）或图像格式非缓存友好，可调整线程数：`vips_concurrency_set(1)` 降低并发。
- **安全性**：公开服务建议使用 `web` 版本二进制，避免加载存在安全漏洞的旧格式解码器。

---

## 7. 扩展资源

- [libvips 官网](https://www.libvips.org/)
- [libvips GitHub 仓库](https://github.com/libvips/libvips)
- [pyvips 文档](https://pyvips.readthedocs.io/)
- [libvips API 参考](https://libvips.github.io/libvips/API/current/)
- [sharp (Node.js) 文档](https://sharp.pixelplumbing.com/)
- [imgproxy 项目](https://imgproxy.net/)

---

> **笔记标签**：`#图像处理` `#libvips` `#高性能` `#服务器`  
> **最后更新**：2026-06-27
