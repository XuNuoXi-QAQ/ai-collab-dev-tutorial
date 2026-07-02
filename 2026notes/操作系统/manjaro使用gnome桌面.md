---
title: "Manjaro GNOME 桌面完全指南 — 从安装到调优"
tags:
  - Manjaro
  - GNOME
  - Linux
  - 桌面环境
  - 系统优化
aliases:
  - "Manjaro GNOME 指南"
  - "GNOME on Manjaro"
description: "Manjaro GNOME 将 Arch Linux 的滚动更新能力与 GNOME 的极简设计哲学结合，是需要「最新软件 + 干净桌面」的开发者首选方案。"
---


# Manjaro GNOME 桌面完全指南 — 从安装到调优

## 一句话定位

Manjaro GNOME 将 Arch Linux 的滚动更新能力与 GNOME 的极简设计哲学结合，是需要「最新软件 + 干净桌面」的开发者首选方案。

---

## 为什么在 Manjaro 上选 GNOME

| 维度 | GNOME | KDE Plasma |
|------|-------|-----------|
| 设计哲学 | 极简、专注、默认即最佳 | 高度可定制、功能密集 |
| 开箱体验 | 无需调校即可工作 | 可能需要大量配置 |
| 一致性 | GTK + libadwaita 统一视觉 | Qt 生态但有碎片感 |
| 工作区切换 | Super 键概览 + 动态工作区 | 传统虚拟桌面 |
| 扩展生态 | 丰富但更新可能断裂 | 内置功能替代大部分扩展 |
| 内存占用 | ~800MB-1.2GB | ~600MB-1GB |
| 游戏/HDR | 较弱 | 更成熟的 VRR/HDR 支持 |

**选 GNOME 的理由**：你要的是一个「不用想太多」的工作环境，打开就能进入心流，而不是花时间折腾桌面配置。

---

## 安装后的必备操作

### 1. 更新系统

```bash
sudo pacman-mirrors --fasttrack && sudo pacman -Syu
```

### 2. 安装 GNOME Tweaks（系统调校工具）

```bash
sudo pacman -S gnome-tweaks
```

Tweaks 提供 GNOME 设置中隐藏的选项：字体、主题、扩展管理、窗口按钮位置等。

### 3. 安装扩展管理器

```bash
sudo pacman -S gnome-browser-connector
# 然后通过 Firefox/Chrome 访问 extensions.gnome.org
# 或安装本地管理工具
pamac build extension-manager
```

---

## 推荐 GNOME 扩展

| 扩展名 | 用途 | 优先级 |
|--------|------|--------|
| **Blur My Shell** | 面板/概览/应用抽屉毛玻璃效果 | 🔴 必装 |
| **Dash to Dock / Dash to Panel** | 任务栏/Dock 定制 | 🔴 必装 |
| **Clipboard Indicator** | 剪贴板历史 | 🟡 推荐 |
| **GSConnect** | Android 手机集成（通知/文件传输） | 🟡 推荐 |
| **Caffeine** | 禁止自动锁屏/休眠 | 🟡 推荐 |
| **Just Perfection** | 精细控制 GNOME UI 元素 | 🟢 可选 |
| **Vitals** | 面板显示 CPU/内存/温度 | 🟢 可选 |
| **AppIndicator** | 托盘图标支持 | 🔴 必装 |
| **User Themes** | 加载自定义 Shell 主题 | 🟡 推荐 |

### 安装方式

```bash
# 浏览器安装
# 访问 https://extensions.gnome.org/extension/3193/blur-my-shell/

# 或命令行
pamac build gnome-shell-extension-blur-my-shell
```

---

## 主题与外观

### 安装主题

```bash
# 下载主题到 ~/.themes/ 或 ~/.local/share/themes/
mkdir -p ~/.themes
# 从 gnome-look.org 下载 tar.xz，解压到 ~/.themes/

# 推荐主题
# - Orchis: 现代 Material Design 风格
# - WhiteSur: macOS Big Sur 风格
# - Colloid: 柔和现代的 GTK 主题
```

### libadwaita 应用统一样式

GNOME 42+ 的 libadwaita 应用默认不跟随自定义 GTK 主题。使用以下方案强制统一：

```bash
# 方案一：Gradience（libadwaita 配色工具）
pamac build gradience

# 方案二：adw-gtk3（让 GTK3 应用更像 libadwaita）
pamac build adw-gtk3
```

### 图标主题

```bash
# 推荐图标包
pamac build papirus-icon-theme      # Papirus（最全面的图标覆盖）
pamac build tela-icon-theme         # Tela（现代多彩）
pamac build candy-icons-git         # Candy（活泼渐变）

# 在 GNOME Tweaks → Appearance → Icons 中切换
```

### 光标主题

```bash
pamac build bibata-cursor-theme     # Bibata（现代圆润光标）
pamac build capitaine-cursors       # Capitaine（简洁风格）
```

---

## 字体配置

### 安装推荐字体

```bash
# 中文
sudo pacman -S noto-fonts-cjk adobe-source-han-sans-cn-fonts

# 等宽编程字体
sudo pacman -S ttf-jetbrains-mono ttf-fira-code ttf-cascadia-code

# emoji
sudo pacman -S noto-fonts-emoji
```

### 在 Tweaks 中调整

- **界面字体**：Noto Sans CJK SC, 11
- **文档字体**：Noto Sans CJK SC, 11
- **等宽字体**：JetBrains Mono, 10.5
- **Hinting**：Slight
- **Antialiasing**：Subpixel (for LCD screens)

---

## 性能优化

### 动画加速

```bash
# 在 Tweaks → General 中关闭动画，或在 dconf 中缩短动画时间
gsettings set org.gnome.desktop.interface enable-animations true
# 加速动画
gsettings set org.gnome.mutter dynamic-workspaces false
```

### 搜索优化

```bash
# 关闭不需要的搜索来源，加快 Super 键搜索速度
gsettings set org.gnome.desktop.search-providers disabled "['org.gnome.Software.desktop', 'org.gnome.Characters.desktop']"
```

### 文件索引

```bash
# Tracker 索引可能消耗大量 CPU/IO，按需禁用
tracker3 daemon -t  # 查看状态
# 在设置 → 搜索 → 搜索位置 中控制索引范围
```

### 内存调优

```bash
# GNOME Software 后台常驻消耗内存
gsettings set org.gnome.software download-updates false
# 或用 dnf/yay 替代，直接卸载 gnome-software
```

---

## 快捷键速查

| 快捷键 | 功能 |
|--------|------|
| `Super` | 概览（Overview） |
| `Super + A` | 应用抽屉 |
| `Super + Tab` | 切换应用 |
| `Super + ` ` | 切换同一应用窗口 |
| `Super + ←/→` | 半屏左/右分屏 |
| `Super + ↑` | 最大化 |
| `Super + ↓` | 还原/最小化 |
| `Super + L` | 锁屏 |
| `Super + D` | 显示桌面 |
| `Super + Alt + S` | 截图区域 |
| `Super + Shift + S` | 截图并保存 |
| `Ctrl + Alt + T` | 终端 |
| `Alt + F2` → `r` → Enter | 重启 GNOME Shell（无注销） |

---

## 备份与恢复

### 备份 GNOME 配置

```bash
# 导出所有 dconf 设置
dconf dump / > ~/gnome-backup.dconf

# 导出扩展列表
ls ~/.local/share/gnome-shell/extensions/ > ~/gnome-extensions.txt
```

### 恢复

```bash
dconf load / < ~/gnome-backup.dconf
```

---

## Manjaro 特有注意事项

| 事项 | 说明 |
|------|------|
| **内核管理** | Manjaro Settings Manager → Kernel 可随时切换内核版本 |
| **AUR 优先用 pamac** | `pamac build xxx` 比直接 `yay` 更集成 Manjaro 的包管理 |
| **Timeshift** | 务必配置系统快照，滚动更新的保险 |
| **Wayland vs X11** | 登录界面齿轮图标可切换；NVIDIA 建议用 X11 至驱动成熟 |
| **Flatpak 支持** | `sudo pacman -S flatpak`；flatpak 应用与 GNOME 集成最好 |

---

## 参考资源

- Manjaro GNOME 安装指南：<https://geek-blogs.com/blog/manjaro-linux-gnome/>
- Reddit 社区完整指南：<https://www.reddit.com/r/ManjaroLinux/comments/iya9bo/>
- GNOME 扩展：<https://extensions.gnome.org>
- 主题资源：<https://www.gnome-look.org>
- 20 项 Manjaro 安装后操作：<https://www.fosslinux.com/46741/things-to-do-after-installing-manjaro.htm>