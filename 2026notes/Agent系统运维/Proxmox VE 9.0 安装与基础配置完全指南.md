---
title: "Proxmox VE 9.0 安装与基础配置完全指南"
tags:
  - 虚拟化
  - Proxmox
  - PVE
  - KVM
  - 安装
aliases:
  - "PVE安装指南"
  - "Proxmox教程"
description: "Proxmox Virtual Environment（PVE）是一个开源的企业级虚拟化管理平台，集成了 KVM 虚拟机和 LXC 容器，并提供 Web 管理界面。相比于 VMware vSphere 或裸装 KVM，PVE 的优点是："
---

## 1. 写在前面：为什么选择 Proxmox VE？

Proxmox Virtual Environment（PVE）是一个开源的企业级虚拟化管理平台，集成了 KVM 虚拟机和 LXC 容器，并提供 Web 管理界面。相比于 VMware vSphere 或裸装 KVM，PVE 的优点是：

- **完全免费**：社区版无功能限制，仅登录时有订阅提醒弹窗（可去除）。
- **开箱即用**：安装后即获得 Web UI、集群支持、备份还原、高可用等企业特性。
- **基于 Debian**：兼容所有 Debian 软件包，方便扩展。
- **轻量高效**：对硬件要求低，老旧的 PC 甚至工控机都能良好运行。

本文将以 PVE 9.0 为例，一步步带你从零搭建一个稳定、干净、可维护的虚拟化宿主机。

---

## 2. BIOS 设置 —— 虚拟化的基石

在安装任何虚拟化系统之前，必须确保主板 BIOS 中开启了 CPU 虚拟化支持和 IO 直通（VT-d/AMD IOMMU）。不同主板品牌的菜单布局差异很大，下面以**华硕 Prime B250M-A** 为例说明关键项。

### 2.1 开启 Intel 虚拟化技术 (VT-x)

VT-x 是 Intel CPU 的硬件虚拟化支持，允许 VMM（如 KVM）高效运行虚拟机。如果没有开启，虚拟机性能将急剧下降，甚至无法启动 64 位客户机。

- **路径**：`Advanced` → `CPU Configuration` → `Intel Virtualization Technology`
- **设置**：`Enabled`

> 注意：某些主板可能将 VT-x 称为 “Vanderpool Technology” 或 “VMX”。AMD 平台对应的是 SVM Mode（Secure Virtual Machine）。

### 2.2 开启 VT-d (Directed I/O)

VT-d 是 Intel 的 **IO 虚拟化** 技术，允许虚拟机直接访问物理硬件设备（如显卡、网卡、NVMe 硬盘），实现近乎原生的性能。虽然本篇暂不涉及直通，但为了将来扩展，建议提前打开。

- **路径**：`Advanced` → `North Bridge` → `VT-d`
- **设置**：`Enabled`

> 如果主板芯片组或 CPU 不支持 VT-d，则无法使用 PCI/PCIe 直通功能。消费级平台中，大部分 B 系列（如 B250）、H 系列芯片组都支持，但需要 CPU 也支持（Intel 除赛扬、奔腾部分型号外，酷睿系列基本都支持）。

### 2.3 开启 Above 4G Decoding（用于 vGPU / GPU 直通）

当你在虚拟机中直通显卡，或者使用 Intel GVT-g（虚拟 GPU）时，PCIe 设备可能需要访问高于 4GB 的内存地址空间。开启此选项可以避免设备无法识别或驱动报错。

- **路径**：`Advanced` → `North Bridge` → `Above 4G Decoding`
- **设置**：`Enabled`

> 如果没有这个选项，通常表示主板自动启用；但如果计划直通显卡，最好确认一下。此外，对于 N 卡直通，有时还需要开启 `Resizable BAR` 支持。

### 2.4 开启 Wake on LAN（网络唤醒）

网络唤醒允许你通过局域网内另一台设备发送 “魔术包” 来远程开机。对于无头服务器（不接显示器键盘）非常实用。

- **路径**：`Advanced` → `APM` (Advanced Power Management) → `PCI-E Devices Wake Up` 或 `Wake on PCI-E`
- **设置**：`Enabled`

> 记得保存 BIOS 设置（通常是 F10）。部分主板还需要在操作系统中启用网卡驱动对 WOL 的支持，后面我们会详细配置。

---

## 3. 下载 PVE 安装镜像

访问 [Proxmox 官网下载页](https://www.proxmox.com/en/downloads) 获取最新的 PVE 9.0 ISO 镜像。网络不畅时也可以使用国内网盘分流（如文中的夸克/UC 网盘）。

- **文件名称**：`proxmox-ve_9.0-1.iso` (约 1.4 GB)
- **校验**：建议下载后使用 SHA256SUMS 验证完整性。

### 制作启动盘

推荐使用 **Ventoy**（[官网](https://www.ventoy.net/)）。Ventoy 能让你把 ISO 直接复制到 U 盘即可引导，不需要反复刻录。注意：Ventoy 需要更新到 1.0.90 以上版本才能正确支持 Debian 13 的安装程序。

- 将 U 盘插入电脑，运行 Ventoy2Disk.exe 安装到 U 盘。
- 安装完成后，将 PVE ISO 复制到 U 盘第一个分区。
- 从 U 盘启动，选择 ISO 开始安装。

---

## 4. 安装 PVE 9.0 详细步骤

### 4.1 选择安装目标磁盘

启动后进入图形化安装界面（建议使用键盘操作，方向键 + Tab + 空格/回车）。最重要的第一步：**选择你要安装 PVE 的硬盘**。

- 界面会列出所有检测到的磁盘（如 /dev/sda, /dev/nvme0n1）。
- **警告**：选中磁盘后，该盘上的所有分区和文件都将被**彻底擦除**。如果你有重要数据，请先备份或移除该磁盘。

> 我的系统盘是一块 16GB 的 Intel Optane 傲腾内存（M10），对于 PVE 来说勉强够用（系统本身占用约 3-4 GB）。若你的硬盘小于 32GB，安装程序可能会自动调整 LVM 布局（例如不创建单独的 local-lvm）。

### 4.2 设置基础环境

按照向导依次设置：

- **国家/地区**：选择 “China” 以获得大致正确的时区。
- **键盘布局**：保留默认的 “English (US)”，除非你习惯其他布局。
- **密码**：设置 root 用户密码（至少 8 位，建议包含大小写和数字）。这个密码将用于 Web 登录和 SSH 登录。

### 4.3 配置网络 —— 最关键的一步

PVE 使用 **静态 IP** 作为默认配置，安装后网络地址不会随 DHCP 变化。但安装程序也会尝试通过 DHCP 获取一个临时 IP。

| 字段               | 说明                                                         |
| ------------------ | ------------------------------------------------------------ |
| **Management Interface** | 选择用作管理网络的网卡（通常是 eth0 或 enpXsX）。若有多网卡，选连接到路由器/交换机的那一个。 |
| **Hostname (FQDN)** | 完整域名，如 `pve.example.com`。如果没有域名，可以写成 `pve.local`。不能使用纯主机名（如 `pve` 不带后缀），否则部分服务可能报错。 |
| **IP Address**     | 你想要给 PVE 分配的静态 IPv4 地址，例如 `192.168.1.100/24`。 |
| **Gateway**        | 你的路由器/网关地址，如 `192.168.1.1`。                      |
| **DNS Server**     | DNS 解析器，一般填网关地址或公共 DNS（如 `8.8.8.8`）。       |

> 安装完成后，这个 IP 是**固定**的。如果你想改为 DHCP，需要手动修改 `/etc/network/interfaces`，后面会讲到。

### 4.4 开始安装

确认所有设置无误后，点击 “Install”。安装过程大约需要 5-10 分钟（取决于硬盘速度和是否联网下载软件包）。当看到 “Installation successful” 提示时，取出 U 盘并按回车重启。

重启后，你会看到 PVE 的终端登录界面，显示类似以下信息：

```
Welcome to Proxmox Virtual Environment 9.0
pve login: _
```

同时在屏幕上方会显示 Web 管理地址：`https://192.168.1.100:8006`（以你设定的 IP 为准）。现在可以用其他电脑的浏览器访问该地址（注意使用 HTTPS），输入用户名 `root` 和你设置的密码登录。

---

## 5. 换源 —— 让 apt 飞起来

PVE 默认使用官方源，位于国外，下载速度极慢甚至无法连接。我们需要将其替换为国内镜像（以清华大学 TUNA 为例）。PVE 9.0 基于 Debian 13 “Trixie”，软件源配置已变更为 DEB822 格式（`.sources` 文件），不再是传统的 `sources.list`。

### 5.1 替换 Debian 系统源

编辑 `/etc/apt/sources.list.d/debian.sources`，删除原内容并粘贴以下配置：

```text
Types: deb
URIs: https://mirrors.tuna.tsinghua.edu.cn/debian
Suites: trixie trixie-updates trixie-backports
Components: main contrib non-free non-free-firmware
Signed-By: /usr/share/keyrings/debian-archive-keyring.gpg

# 如需源码镜像，取消下面注释
# Types: deb-src
# URIs: https://mirrors.tuna.tsinghua.edu.cn/debian
# Suites: trixie trixie-updates trixie-backports
# Components: main contrib non-free non-free-firmware
# Signed-By: /usr/share/keyrings/debian-archive-keyring.gpg

Types: deb
URIs: https://security.debian.org/debian-security
Suites: trixie-security
Components: main contrib non-free non-free-firmware
Signed-By: /usr/share/keyrings/debian-archive-keyring.gpg
```

> 解释：`trixie` 是 Debian 13 的开发代号；`trixie-updates` 包含重要更新；`trixie-backports` 是后向移植的较新软件；安全更新单独指定。

### 5.2 处理 PVE 企业源（删除/注释）

PVE 分为企业版（付费订阅）和社区版（无订阅）。企业源需要许可证，否则 apt update 会报 401 错误。我们直接禁用：

编辑 `/etc/apt/sources.list.d/pve-enterprise.sources`，注释掉所有行：

```text
# Types: deb
# URIs: https://enterprise.proxmox.com/debian/pve
# Suites: trixie
# Components: pve-enterprise
# Signed-By: /usr/share/keyrings/proxmox-archive-keyring.gpg
```

### 5.3 添加 PVE 无订阅源

创建文件 `/etc/apt/sources.list.d/pve-no-subscription.sources`，写入：

```text
Types: deb
URIs: https://mirrors.tuna.tsinghua.edu.cn/proxmox/debian/pve
Suites: trixie
Components: pve-no-subscription
Signed-By: /usr/share/keyrings/proxmox-archive-keyring.gpg
```

### 5.4 替换 Ceph 源（如果需要 Ceph 存储）

PVE 内置 Ceph 分布式存储支持。若你打算使用 Ceph，需要替换其软件源。编辑 `/etc/apt/sources.list.d/ceph.sources`：

```text
Types: deb
URIs: https://mirrors.tuna.tsinghua.edu.cn/proxmox/debian/ceph-squid
Suites: trixie
Components: no-subscription
Signed-By: /usr/share/keyrings/proxmox-archive-keyring.gpg
```

> 注意：Ceph 版本 “squid” 是 PVE 9.0 配套的版本，保持此名称即可。

### 5.5 替换 LXC 容器模板源

PVE 的 LXC 模板（如 Ubuntu、Alpine 等）默认从 `download.proxmox.com` 下载，速度慢。我们需要修改 Perl 文件中的硬编码地址。

执行以下命令备份并替换：

```bash
cp /usr/share/perl5/PVE/APLInfo.pm /usr/share/perl5/PVE/APLInfo.pm_back
sed -i 's|http://download.proxmox.com|https://mirrors.tuna.tsinghua.edu.cn/proxmox|g' /usr/share/perl5/PVE/APLInfo.pm
```

**重启 PVE 相关服务**（或直接重启系统）后生效：

```bash
systemctl restart pvedaemon pveproxy
```

### 5.6 更新软件包

完成源配置后，执行更新：

```bash
apt update
apt upgrade -y
```

> 如果遇到 GPG 密钥错误，可以重新安装 `proxmox-archive-keyring` 包：`apt install --reinstall proxmox-archive-keyring`

---

## 6. 去除 “无有效订阅” 弹窗

每次登录 Web UI，右上角都会出现一个提示你购买订阅的黄色弹窗。虽然不影响使用，但看着烦人。我们可以通过修改 JavaScript 文件来屏蔽它。

原理：找到显示弹窗的代码段，将其替换为一个空对象（`void({...})`），使函数正常执行但不弹窗。

**一键命令**（直接复制执行）：

```bash
sed -Ezi.bak "s/(Ext.Msg.show\(\{\s+title: gettext\('No valid sub)/void\(\{ \/\/\1/g" /usr/share/javascript/proxmox-widget-toolkit/proxmoxlib.js && systemctl restart pveproxy.service
```

执行后刷新浏览器（可能需要强制刷新 Ctrl+F5），弹窗消失。

> 若未来 PVE 更新覆盖了该文件，需要重新执行一次。另外，这不会影响任何系统功能。

---

## 7. 硬盘存储管理

PVE 安装程序默认创建两个存储池：

- **local**：存放 ISO 镜像、容器模板、备份文件等（路径 `/var/lib/vz`）。
- **local-lvm**：存放虚拟机磁盘镜像（使用 LVM-thin，支持快照和克隆）。

对于大多数用户，保持默认即可。但如果你的系统盘非常小（<32GB），可能希望合并它们或删除 swap 分区来腾出空间。

### 7.1 合并 local 和 local-lvm（仅系统盘 < 64GB 时考虑）

合并后，所有内容都放在一个存储中，不再区分镜像和模板空间。缺点是虚拟机快照管理略麻烦，但总空间利用率更高。

> 注意：此操作会**删除所有现有虚拟机/容器数据**，请确保是新装系统且未创建任何 VM/CT！

步骤（假设你已通过 Web UI 备份重要数据）：

1. 在 Web UI 中，进入 `数据中心 → 存储`，选中 `local-lvm`，点击 “移除”。
2. 在 PVE 宿主机上执行：

```bash
lvextend -l +100%FREE /dev/pve/root
resize2fs /dev/pve/root
```

3. 回到 Web UI，编辑 `local` 存储，在 “内容” 中勾选所有类型（包括 “磁盘映像” 和 “容器”）。原本只能存 ISO 和模板的 local 现在也能存放虚拟机磁盘了。

> 我的系统盘是 16GB 傲腾，安装程序发现空间太小后自动跳过了 local-lvm 的创建，因此无需手动合并。如果你的硬盘在 20-30GB 之间但依然创建了 local-lvm，建议合并。

### 7.2 删除 Swap 分区（极端情况）

如果你的物理内存足够（比如 ≥16GB），且系统盘非常紧张（如 8GB 或 16GB SSD），可以删除 PVE 默认分配的 1GB swap 空间，将其扩容给根分区。

> 风险：没有 swap 时，内存用尽可能导致 OOM（内存溢出）直接杀死进程。建议仅在物理内存充裕且盘位紧张时使用。

操作：

```bash
# 1. 关闭 swap
swapoff /dev/mapper/pve-swap

# 2. 编辑 /etc/fstab，注释掉 swap 挂载行
sed -i 's/^\/dev\/pve\/swap/# &/' /etc/fstab

# 3. 删除 swap 逻辑卷
lvremove /dev/pve/swap

# 4. 将释放的空间扩展到 root 卷
lvextend -l +100%FREE /dev/mapper/pve-root

# 5. 扩展文件系统
resize2fs /dev/mapper/pve-root
```

执行 `df -h` 查看根分区容量是否增加。

### 7.3 添加额外的数据盘

PVE 可以挂载其他硬盘作为存储，用于存放 ISO、虚拟机磁盘、备份等。步骤分为两步：**挂载硬盘到文件系统**，然后在 Web UI 中添加目录存储。

#### 7.3.1 在 Debian 中挂载硬盘

假设有一块新硬盘 `/dev/sdb`，我们将其格式化并挂载到 `/mnt/storage`：

```bash
# 分区（可选，建议整盘用）
fdisk /dev/sdb   # 创建一个主分区，或者直接使用整个磁盘

# 格式化（推荐 ext4）
mkfs.ext4 /dev/sdb1

# 创建挂载点
mkdir -p /mnt/storage

# 临时挂载
mount /dev/sdb1 /mnt/storage

# 设置开机自动挂载（编辑 /etc/fstab）
echo "/dev/sdb1 /mnt/storage ext4 defaults 0 0" >> /etc/fstab
```

#### 7.3.2 在 PVE Web UI 中添加目录存储

1. 进入 `数据中心 → 存储 → 添加 → 目录`。
2. **ID**：任意标识符，如 “data-hdd”。
3. **目录**：填写挂载路径，如 `/mnt/storage`。
4. **内容**：根据需要勾选，一般可全选（磁盘映像、ISO、容器模板、备份、容器等）。
5. 点击 “添加”。现在创建虚拟机时就可以选择该存储了。

> 如果添加的是网络存储（如 NFS、iSCSI），PVE 也原生支持，在 “添加” 中选择对应类型即可。

---

## 8. 网络高级配置

PVE 默认使用静态 IP，并通过 Linux 网桥（vmbr0）连接物理网卡，实现虚拟机与宿主机共用同一网络。

### 8.1 将静态 IP 改为 DHCP（适合移动环境）

如果你的 PVE 主机经常在不同网络间移动（比如笔记本），那么静态 IP 可能无法使用（因为子网网关不同）。改用 DHCP 可以让它自动获取地址。

编辑 `/etc/network/interfaces`，将 `vmbr0` 的配置从 `static` 改为 `dhcp`，并删除 address/gateway 行。

修改前：

```
iface vmbr0 inet static
        address 10.0.0.10/24
        gateway 10.0.0.1
        bridge-ports enp4s0
        bridge-stp off
        bridge-fd 0
```

修改后：

```
iface vmbr0 inet dhcp
        bridge-ports enp4s0
        bridge-stp off
        bridge-fd 0
```

重启网络：

```bash
systemctl restart networking
```

之后使用 `ip a` 查看新获得的 IP，注意 Web 管理地址也会变化。

### 8.2 使用 SLAAC 获取 IPv6 地址

在现代网络中，IPv6 越来越普及。PVE 默认配置下，如果网络中的路由器有 IPv6 RA（路由通告），vmbr0 会自动获得一个 IPv6 地址吗？不一定。我们需要手动启用 **accept_ra**（接受路由通告）。

在 `/etc/network/interfaces` 的 `vmbr0` 配置块中添加一行：

```
post-up echo "2" > /proc/sys/net/ipv6/conf/vmbr0/accept_ra
```

完整示例：

```
auto vmbr0
iface vmbr0 inet dhcp
        bridge-ports enp3s0
        bridge-stp off
        bridge-fd 0
        post-up echo "2" > /proc/sys/net/ipv6/conf/vmbr0/accept_ra
```

`accept_ra` 的值 `2` 表示总是接受 RA（即使转发功能启用）。重启网络或重启系统后，通过 `ip -6 a` 可以看到 PVE 获得了全球单播 IPv6 地址。

### 8.3 解决拔掉 PCIe 设备后网卡名变化导致的断网

常见场景：你安装 PVE 时插着独立显卡，装好后拔掉显卡，结果重启后网卡名称从 `enp4s0` 变成了 `enp3s0`，而 `/etc/network/interfaces` 里写的还是旧的名称，导致无网络。

这是因为 Linux 的内核设备命名规则（Predictable Network Interface Names）会根据 PCI 总线地址、MAC 等生成固定名称。当你移除了某个 PCIe 设备（比如显卡），总线上的设备排序会变化，网卡的命名可能变化。

**快速修复**：查看当前网卡名：

```bash
ip a | grep ": <"
```

比如输出显示 `enp3s0`。然后编辑 `/etc/network/interfaces` 将所有 `enp4s0` 替换为 `enp3s0`：

```bash
sed -i 's/enp4s0/enp3s0/g' /etc/network/interfaces
systemctl restart networking
```

为了避免以后再发生同样问题，可以考虑**将网卡命名改回传统名称 `eth0`**（见下一节）。

### 8.4 修改网卡名为传统格式 (eth0)

通过内核引导参数禁用可预测命名规则，网卡就会恢复为 `eth0`、`eth1` 等。步骤如下：

1. 编辑 `/etc/default/grub`，找到 `GRUB_CMDLINE_LINUX_DEFAULT` 行，添加 `net.ifnames=0 biosdevname=0`：

```bash
GRUB_CMDLINE_LINUX_DEFAULT="quiet net.ifnames=0 biosdevname=0"
```

2. 更新 GRUB：

```bash
update-grub
```

3. **在重启前**，修改 `/etc/network/interfaces`，将里面的网卡名（如 `enp4s0`）改为 `eth0`（假设你只有一张有线网卡）。

4. 重启：

```bash
reboot
```

重启后，网卡名变为 `eth0`，网络配置依然有效。

> 如果你有多个网卡，可能需要根据 MAC 地址判断哪个是 eth0。可以先用 `ip a` 查看旧名称对应的 MAC，然后重启后对号入座。

---

## 9. 网络唤醒 (Wake-on-LAN) 完整配置

网络唤醒允许你在关机状态下通过局域网发送魔术包来启动 PVE 主机。前提条件：

- 主板 BIOS 已开启 PCI-E/网络唤醒（见 2.4 节）。
- 网卡驱动支持 WOL，且操作系统中需要启用 `wol g` 标志。
- 关机时网卡保持待机供电（通常现代主板会自动满足）。

### 9.1 安装 ethtool 工具

```bash
apt install ethtool -y
```

### 9.2 检查当前 WOL 状态

假设网卡名是 `eth0`：

```bash
ethtool eth0 | grep -i wake
```

输出示例：

```
Supports Wake-on: pumbg
Wake-on: d
```

- `Supports Wake-on` 的字母组合表示该网卡支持哪些唤醒方式：`p` 是物理活动，`u` 是单播包，`m` 是多播包，`b` 是广播包，`g` 是魔术包。如果包含 `g`，则支持 WOL。
- `Wake-on: d` 表示禁用。我们需要将它改为 `g`。

### 9.3 启用 WOL

```bash
ethtool -s eth0 wol g
```

再次检查 `Wake-on` 应该变为 `g`。

### 9.4 设置开机自动启用 WOL

每次重启系统，网卡 WOL 状态都会重置为 `d`。我们需要创建一个开机自启脚本来重新启用。

创建 `/etc/rc.local`（如果不存在）：

```bash
cat > /etc/rc.local << 'EOF'
#!/bin/bash
ethtool -s eth0 wol g
exit 0
EOF
```

赋予执行权限：

```bash
chmod +x /etc/rc.local
```

然后启用 rc-local 服务（某些 Debian 版本需要手动启用）：

```bash
systemctl enable rc-local
systemctl start rc-local
```

重启测试：`reboot` 后，登录再次执行 `ethtool eth0 | grep Wake-on`，应该看到 `g`。

> 如果你的网卡名不是 eth0，请根据实际情况修改脚本。

### 9.5 发送魔术包唤醒 PVE

在局域网内任意一台设备（手机、电脑）上，使用 WOL 工具发送魔术包。例如在 Linux 下使用 `wakeonlan` 命令：

```bash
wakeonlan 00:11:22:33:44:55   # 填写 PVE 网卡的 MAC 地址
```

Windows 可以使用 “WakeMeOnLan” 或路由器自带的网络唤醒功能。

注意：PVE 正常关机（`shutdown -h now`）后，网卡的 LED 指示灯可能熄灭，但实际仍然在监听魔术包。如果 BIOS 中有 “ErP Ready” 或 “S5 节能” 选项，需要关闭它，否则在 S5 状态（软关机）下网卡会彻底断电。

---

## 10. 常见问题与排错

### 10.1 安装后无法通过 Web 访问

- 检查 PVE 主机的 IP 地址是否正确：`ip a`。
- 确保你的电脑与 PVE 在同一子网，或路由可达。
- 尝试 ping PVE IP。
- 检查防火墙是否屏蔽了 8006 端口：`iptables -L`。默认是没有限制的。
- 使用 HTTPS 而非 HTTP（`https://IP:8006`）。

### 10.2 apt update 出现 GPG 错误

可能是 Proxmox 仓库的签名密钥过期或未安装。解决：

```bash
wget -O /usr/share/keyrings/proxmox-archive-keyring.gpg https://enterprise.proxmox.com/debian/proxmox-release-bookworm.gpg   # 注意调整版本
```

或者重新安装 `proxmox-archive-keyring` 包（需先换成无订阅源）。

### 10.3 local-lvm 无法删除或 lvextend 失败

如果你已经创建了虚拟机，local-lvm 中可能存储了卷，需要先移除所有 VM/CT 并删除其磁盘。使用 `lvdisplay` 查看 LVM 卷。

### 10.4 修改网络配置后无法 SSH

建议在 PVE 主机物理终端（接显示器键盘）上操作，或在修改前确保配置正确。也可以提前安装 `screen` 或 `tmux`，使修改操作可以在断开连接后继续。

### 10.5 修改 GRUB 参数后无法启动

如果在 GRUB 中添加了 `net.ifnames=0` 导致网卡名变化而网络配置不匹配，可以通过物理终端进入系统，恢复 `/etc/network/interfaces` 并使用 `update-grub` 移除参数。

---

## 11. 下一步计划

至此，我们已经完成了 PVE 的基础安装与配置：

- ✅ BIOS 虚拟化与唤醒支持
- ✅ 系统安装及静态 IP 设定（或 DHCP）
- ✅ 国内外软件源替换，apt 速度起飞
- ✅ 移除订阅弹窗
- ✅ 存储管理（合并、扩容、添加新盘）
- ✅ 网络稳定化（修复网卡名变动、开启 IPv6）
- ✅ 网络唤醒自动化

接下来，你可以继续探索以下高级主题：

- **硬件直通**：将显卡、USB 控制器、网卡等直接分配给虚拟机，实现接近原生的性能。
- **创建虚拟机模板**：制作一个干净的 Linux/Windows 模板，后续快速克隆。
- **备份与还原**：配置 PVE 内置的 vzdump 备份计划，或挂载外部 NAS 存储。
- **组建集群**：多台 PVE 主机组成集群，实现高可用和集中管理。

本文中的大部分配置都经过了实际验证（华硕 B250M-A + G4560 + 16GB 内存 + 傲腾 16GB 系统盘），但也请根据你的硬件和网络环境灵活调整。如果在配置过程中遇到问题，欢迎查阅 Proxmox 官方 wiki 或社区论坛。

> 最后提醒：任何系统级的配置改动（尤其是编辑网络配置文件、LVM 操作）前，建议先在测试环境尝试或做好数据备份。祝你的虚拟化之旅顺利！

**文档版本**：1.0  
**更新日期**：2026 年 6 月  
**适用 PVE 版本**：9.0 (基于 Debian 13 Trixie)