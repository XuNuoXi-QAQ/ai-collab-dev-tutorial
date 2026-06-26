---
title: "Manjaro 运行 Android 应用完全指南：Waydroid 部署与使用"
tags:
  - Android
  - Waydroid
  - 容器
  - Manjaro
aliases:
  - "Waydroid指南"
description: "在 Manjaro 上运行手机应用，核心思路是创建一个 Android 容器，它像是一个与系统共享内核的轻量级“虚拟机”，因此性能损耗很小。目前最主流、最推荐的方案是 Waydroid。"
---

## 一、背景与方案选型

### 1.1 为什么需要 Android 容器？

在 Manjaro 上运行手机应用，核心思路是创建一个 **Android 容器**，它像是一个与系统共享内核的轻量级“虚拟机”，因此性能损耗很小。目前最主流、最推荐的方案是 **Waydroid**。

### 1.2 方案对比

| 方案 | 技术原理 | 优点 | 缺点 | 推荐度 |
| :--- | :--- | :--- | :--- | :--- |
| **Waydroid** | **容器技术** (LXC) | 性能接近原生，与系统集成度好，**持续维护更新** | 必须在 **Wayland** 环境下运行 | ⭐⭐⭐⭐⭐ **(首选)** |
| **Anbox** | 容器技术 (LXC) | 概念出现早 | 项目**已停止维护**，在较新系统上不稳定，**不推荐使用** | ⭐ (不推荐) |
| **Android Studio AVD** | 完整虚拟机 (QEMU) | 兼容性最好，适合开发者 | **资源占用高**，运行卡顿，不适合日常使用 | ⭐⭐ (备选) |

### 1.3 Waydroid 的工作原理

Waydroid 基于 LXC（Linux 容器）技术，在 Linux 内核之上运行一个完整的 Android 系统。它并非模拟硬件，而是与主机共享内核，因此：

- **性能损耗极小**：接近原生运行
- **资源占用低**：无需为虚拟机分配独立的内存和 CPU
- **深度集成**：Android 应用可以像原生 Linux 应用一样出现在应用菜单中

---

## 二、环境准备

### 2.1 确认 Wayland 显示服务器

**这是最关键的前提条件。** Waydroid **必须在 Wayland 下运行**，X11 环境无法使用。

```bash
# 检查当前会话类型
echo $XDG_SESSION_TYPE
```

**预期输出**：`wayland`

**如果输出是 `x11`**：
1. 退出当前登录
2. 在登录界面，点击齿轮/设置图标
3. 选择带有 **"Wayland"** 后缀的会话选项（如 "Plasma (Wayland)" 或 "GNOME on Wayland"）
4. 重新登录后再次验证

### 2.2 检查硬件支持

Waydroid 需要 KVM（内核级虚拟化）支持，虽然容器不完全依赖 KVM，但启用它能获得更好性能。

```bash
# 检查 CPU 虚拟化支持
egrep -c '(vmx|svm)' /proc/cpuinfo
```

- 输出 **大于 0**：支持虚拟化
- 输出 **等于 0**：可能需要在 BIOS 中开启 VT-x（Intel）或 AMD-V

### 2.3 安装必要依赖

```bash
sudo pacman -S lxc python3 adb
```

| 包名 | 用途 |
| :--- | :--- |
| `lxc` | Linux 容器工具，Waydroid 的底层依赖 |
| `python3` | Waydroid 脚本运行环境 |
| `adb` | Android Debug Bridge，用于安装应用和调试 |

---

## 三、安装 Waydroid

### 3.1 从 AUR 安装

Manjaro 基于 Arch Linux，推荐通过 AUR 助手安装：

```bash
yay -S waydroid
```

如果尚未安装 `yay`：

```bash
sudo pacman -S --needed git base-devel
git clone https://aur.archlinux.org/yay.git
cd yay
makepkg -si
```

### 3.2 安装后的文件结构

| 路径 | 内容 |
| :--- | :--- |
| `/usr/bin/waydroid` | 主命令行工具 |
| `/usr/lib/waydroid/` | Python 脚本和工具集 |
| `/var/lib/waydroid/` | 容器镜像和数据存储 |
| `/etc/waydroid/` | 配置文件目录 |
| `~/.local/share/waydroid/` | 用户数据（如安装的应用） |

---

## 四、初始化 Waydroid

### 4.1 基本初始化（含谷歌服务）

```bash
sudo waydroid init -s GAPPS
```

**参数说明**：
- `-s GAPPS`：下载包含谷歌服务的镜像（推荐，兼容性更好）
- `-s VANILLA`：纯开源版本，不带谷歌服务

### 4.2 强制重新初始化

如果网络中断或镜像校验失败：

```bash
sudo waydroid init -f -s GAPPS
```

`-f` 参数会强制覆盖现有配置并重新下载。

### 4.3 使用 Waydroid-ATV 镜像（Android 16 预发布版）

如果想体验更新的 Android 版本，可以使用社区维护的 Waydroid-ATV 镜像：

```bash
sudo waydroid init -f \
  -c https://waydroid-atv.github.io/ota/a16-tv/system \
  -v https://waydroid-atv.github.io/ota/a16-tv/vendor \
  -r lineage \
  -s GAPPS
```

### 4.4 手动部署镜像（网络慢时）

如果自动下载反复失败：

```bash
# 1. 创建镜像目录
sudo mkdir -p /etc/waydroid-extra/images

# 2. 手动下载 system.img 和 vendor.img
# （从 GitHub/SourceForge 获取）

# 3. 复制到指定目录
sudo cp system.img /etc/waydroid-extra/images/
sudo cp vendor.img /etc/waydroid-extra/images/

# 4. 强制初始化（跳过下载）
sudo waydroid init -f
```

### 4.5 镜像下载问题排查

| 问题 | 解决方案 |
| :--- | :--- |
| **下载速度极慢** | 使用代理：`export https_proxy=http://代理地址:端口` |
| **SSL/TLS 握手失败** | 尝试更换网络（如手机热点），或使用 `wget --no-check-certificate` 手动下载 |
| **哈希校验不匹配** | 清理缓存：`sudo rm -rf /var/lib/waydroid/cache_http`，然后重新初始化 |
| **GitHub 无法访问** | 使用代理镜像：`https://ghproxy.com/` + 原始链接 |

---

## 五、启动 Waydroid

### 5.1 标准启动流程

**终端 1——启动容器服务：**

```bash
sudo systemctl start waydroid-container
```

**终端 1（保持运行）——启动会话：**

```bash
waydroid session start
```

**终端 2——显示 Android 界面：**

```bash
waydroid show-full-ui
```

### 5.2 多窗口模式（让应用独立显示）

默认情况下，Waydroid 会显示一个完整的 Android 桌面。启用多窗口模式后，每个应用会像普通 Linux 窗口一样独立运行。

```bash
# 开启多窗口模式
waydroid prop set persist.waydroid.multi_windows true

# 重启会话
waydroid session stop
waydroid session start
waydroid show-full-ui
```

启用后，通过以下命令启动的应用会以独立窗口呈现：

```bash
waydroid app launch <应用包名>
```

### 5.3 开机自启

```bash
# 容器服务开机自启
sudo systemctl enable waydroid-container

# 注意：session 仍需手动启动，或通过脚本实现
```

---

## 六、网络配置

### 6.1 默认网络问题修复

Waydroid-ATV 镜像（特别是 Android 16 版本）已知存在网络默认不通的问题：

```bash
sudo waydroid shell settings put global captive_portal_mode 0
```

### 6.2 手动配置 NAT

如果容器内无法联网：

```bash
# 开启 IP 转发
sudo sysctl -w net.ipv4.ip_forward=1

# 配置 NAT（将 <网卡名> 替换为你的实际网卡）
sudo iptables -t nat -A POSTROUTING -s 192.168.240.0/24 -o <网卡名> -j MASQUERADE
```

查看网卡名：

```bash
ip link show
# 或
iwconfig
```

---

## 七、安装应用

### 7.1 通过 APK 文件安装

**方法 A：右键菜单（最简单）**

下载 APK 文件后，右键点击 → "Open with install in Waydroid"

**方法 B：命令行**

```bash
waydroid app install /path/to/your/app.apk
```

**注意**：在 Waydroid-ATV Android 16 版本中，此命令可能暂时不可用，请使用 ADB 替代。

### 7.2 通过 ADB 安装

```bash
# 连接 Waydroid 的 ADB 服务
adb connect 192.168.240.112:5555

# 安装应用
adb install /path/to/your/app.apk

# 查看已连接设备
adb devices
```

### 7.3 使用应用商店

1. **Aurora Store**：Google Play 的开源前端，无需谷歌账号即可下载应用
2. **F-Droid**：开源应用商店

安装方式：先下载 APK，再用上述任一方法安装。

### 7.4 应用管理常用命令

```bash
# 列出所有已安装应用
waydroid app list

# 启动应用（需知道包名）
waydroid app launch <包名>

# 卸载应用
waydroid app remove <包名>
```

获取应用包名：

```bash
adb shell pm list packages | grep <关键词>
# 例如：adb shell pm list packages | grep wechat
```

---

## 八、关键：ARM vs x86 架构兼容性

### 8.1 问题的本质

| 特性 | 手机 (Android) | 电脑 (Manjaro) |
| :--- | :--- | :--- |
| **CPU 架构** | 绝大多数为 **ARM** | 绝大多数为 **x86_64** |
| **指令集** | ARM 指令 | x86 指令 |
| **应用编译** | 主要为 ARM 架构 | 需要 x86 架构 |

Waydroid 在 x86_64 电脑上运行，但大部分手机应用是为 ARM 架构编译的。

### 8.2 解决方案：二进制转译层

Waydroid 通过 **libhoudini**（Intel 开发）或 **ndk_translation** 实现 ARM → x86 指令的动态转译。

**兼容性层次**：

| 应用类型 | 兼容性 | 说明 |
| :--- | :--- | :--- |
| 纯 Java/Kotlin 应用 | **较好** | 不依赖 native 库，转译开销小 |
| 含 native 库的应用 | **一般** | 依赖 ARM 原生库，转译可能出错 |
| 依赖硬件加速的应用 | **较差** | 游戏、视频编辑等 |
| 严格检测环境的应用 | **较差** | 银行 App、SafetyNet 检测 |

### 8.3 提高兼容性的建议

1. **优先选择包含 x86 架构库的应用**：从 Google Play（或 Aurora Store）下载时，系统会自动匹配架构
2. **使用 Android 14 镜像**：Waydroid-ATV 的 Android 14 版本对 ARM 应用兼容性更好
3. **尝试不同版本的 APK**：某些应用的老版本可能兼容性更好

### 8.4 查看应用架构

```bash
# 查看 APK 信息
aapt dump badging /path/to/app.apk | grep native-code
```

---

## 九、文件共享

### 9.1 目录映射

Linux 和 Android 环境通过以下目录互相访问：

| Linux 路径 | Android 路径 | 说明 |
| :--- | :--- | :--- |
| `~/.local/share/waydroid/data/media/0/` | `/sdcard/` | 共享存储（相当于手机的内部存储） |

### 9.2 在 Android 中访问 Linux 文件

- 使用 Android 端的文件管理器（如 Material Files）访问 `/sdcard/` 目录
- 从 Linux 复制文件到 `~/.local/share/waydroid/data/media/0/`，即可在 Android 中看到

### 9.3 在 Linux 中访问 Android 文件

- 直接浏览 `~/.local/share/waydroid/data/media/0/`
- 使用 `adb pull` / `adb push` 命令传输文件

---

## 十、常见问题与故障排除

### 10.1 启动问题

| 问题 | 解决方案 |
| :--- | :--- |
| `session start` 失败 | 检查是否使用 Wayland，重启容器服务：`sudo systemctl restart waydroid-container` |
| 界面空白或黑屏 | 检查 GPU 驱动，尝试软件渲染模式 |
| 容器无法启动 | 检查 LXC 是否正常：`sudo systemctl status lxc` |

### 10.2 图形问题

**NVIDIA 显卡用户**：

```bash
# 使用 PRIME 渲染
prime-run waydroid show-full-ui
```

**软件渲染（备选方案）**：

```bash
sudo nano /var/lib/waydroid/waydroid_base.prop
# 添加或修改：
ro.hardware.gralloc=default
ro.hardware.egl=swiftshader
```

### 10.3 完全重装

如果需要从头开始：

```bash
# 1. 停止所有服务
waydroid session stop
sudo waydroid container stop

# 2. 清除数据
sudo waydroid wipe

# 3. 重新初始化
sudo waydroid init -f -s GAPPS
```

### 10.4 性能优化

```bash
# 分配更多内存（根据实际硬件调整）
sudo nano /etc/waydroid/waydroid.cfg
# 添加：
[resources]
memory = 4096
```

---

## 十一、进阶使用技巧

### 11.1 创建桌面快捷方式

为特定 Android 应用创建 .desktop 文件：

```bash
# 1. 获取应用包名
waydroid app list

# 2. 创建快捷方式
nano ~/.local/share/applications/wechat.desktop
```

内容示例：

```ini
[Desktop Entry]
Name=微信
Exec=waydroid app launch com.tencent.mm
Icon=waydroid
Type=Application
Categories=Network;
```

### 11.2 脚本化启动

创建一键启动脚本 `~/start-waydroid.sh`：

```bash
#!/bin/bash
sudo systemctl start waydroid-container
sleep 2
waydroid session start &
sleep 3
waydroid show-full-ui &
```

```bash
chmod +x ~/start-waydroid.sh
```

### 11.3 常用 ADB 命令速查

| 命令 | 用途 |
| :--- | :--- |
| `adb devices` | 查看连接的设备 |
| `adb install -r app.apk` | 覆盖安装（保留数据） |
| `adb uninstall <包名>` | 卸载应用 |
| `adb shell pm list packages` | 列出所有应用包名 |
| `adb logcat` | 查看实时日志 |
| `adb shell dumpsys battery` | 查看电池状态 |

---

## 十二、已知限制与未来展望

### 12.1 当前限制

| 限制 | 说明 |
| :--- | :--- |
| **ARM 兼容性** | 部分纯 ARM 应用无法运行或运行不稳定 |
| **硬件访问** | 摄像头、蓝牙等硬件访问可能受限 |
| **谷歌服务** | SafetyNet 等认证可能无法通过 |
| **Wayland 依赖** | 无法在 X11 环境下使用 |

### 12.2 未来趋势

- Waydroid 持续活跃开发中
- Waydroid-ATV 社区定期发布新版本
- 随着 Android 对 x86_64 原生支持增强，兼容性会逐步改善

---

## 附录：常用资源链接

| 资源 | 链接 |
| :--- | :--- |
| Waydroid 官网 | https://waydroid.com/ |
| Waydroid GitHub | https://github.com/waydroid |
| Waydroid-ATV Releases | https://github.com/WayDroid-ATV/waydroid-builds/releases |
| Arch Wiki: Waydroid | https://wiki.archlinux.org/title/Waydroid |
| Manjaro 论坛 | https://forum.manjaro.org/ |

---

*最后更新：2026年6月*