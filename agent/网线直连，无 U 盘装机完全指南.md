




用你的 Windows 物理机 + Manjaro 虚拟机，一根网线给任何电脑（含老机器）安装 Windows / Linux

本教程将详细演示，如何在不使用 U 盘、不连接互联网、也不依赖家用路由器的情况下，仅通过一根网线，把一台 Windows 物理机上的 Manjaro 虚拟机 变成网络装机服务器，为另一台电脑（无论新旧）安装操作系统。

---

1. 原理速览

```
目标电脑 (待装系统)
   ↑ 网线直连
   ↓
Windows 物理机 (你的主机)
   ↑ 内部桥接
   ↓
Manjaro 虚拟机 (提供 DHCP / TFTP / HTTP)
   ↑ 读取
   ↓
移动硬盘 (存放 ISO 镜像和引导文件)
```

· DHCP 服务：给目标电脑自动分配 IP 地址。
· TFTP 服务：向目标电脑传送网络启动引导程序（iPXE）。
· HTTP 服务：提供内核、初始化内存盘、Windows 启动映像，以及完整的 ISO 安装文件。
· iPXE 菜单：让目标机在启动时选择要安装的系统。

整个过程完全离线，安装速度只受网线质量和硬盘速度限制（千兆网络下约 100 MB/s）。

---

2. 你需要准备的硬件

· 一根网线（Cat5e 或以上，普通直通线即可，现代网卡均支持自动翻转）
· 你的 Windows 物理机（已安装 VirtualBox 或 VMware Workstation，教程以 VirtualBox 为例）
· Manjaro 虚拟机（预先安装好，建议分配 2 GB 以上内存）
· 外置移动硬盘（存放系统 ISO 文件和工具，格式不限，推荐 NTFS 或 ext4）
· 目标电脑（待装系统，需要有有线网口，并支持 PXE 网络启动）

如果你没有移动硬盘，也可以将 ISO 直接放在物理机内部硬盘，然后通过 VirtualBox 的共享文件夹或 virtio 等方式让虚拟机访问，但移动硬盘最为简单直接。

---

3. 第一步：将移动硬盘连接到虚拟机

4. 先把移动硬盘插入 Windows 物理机，待系统识别。
5. 打开 VirtualBox，选中你的 Manjaro 虚拟机，点击 设置 → USB 设备。
6. 添加 USB 筛选器，选择你的移动硬盘，确保虚拟机可以独占访问。
7. 启动 Manjaro 虚拟机，登录后执行 lsblk 确认硬盘已挂载（通常为 /dev/sdb）。将其挂载到一个方便目录，例如：

```bash
sudo mkdir -p /mnt/hdd
sudo mount /dev/sdb1 /mnt/hdd   # 根据实际分区调整
```

---

4. 第二步：虚拟机网络设置（桥接模式）

目标是让 Manjaro 虚拟机直接“接管”物理机的一个有线网口，从而与目标电脑直连。

1. 先确保你的 Windows 物理机有一个空闲的有线网口（通常是 RJ45 接口）。
2. 关闭 Manjaro 虚拟机。
3. 进入虚拟机 设置 → 网络 → 网卡 1：
   · 连接方式：桥接网卡
   · 界面名称：选择你准备用来插网线的物理有线网卡（例如 Realtek PCIe GbE Family Controller）
   · 高级 → 混杂模式：全部允许
4. 启动虚拟机，进入 Manjaro。

如果你只有唯一一个网口且正在上网，桥接后该网口将被虚拟机占用，可能导致主机断网。这种情况建议临时用 Wi-Fi 上网，把有线网口腾出来，或者添加一个 USB 网卡。

---

5. 第三步：在 Manjaro 中配置静态 IP 并关闭防火墙

假设桥接后虚拟机的网卡名称为 enp0s3（实际名称可用 ip a 查看）。

```bash
# 手动配置静态 IP，无需网关和 DNS
sudo ip addr add 192.168.1.10/24 dev enp0s3
sudo ip link set enp0s3 up
```

为了让网络配置在重启后仍生效，你可以创建一个 systemd 服务或直接写进 Manjaro 的网络配置文件，不过一次性的临时任务手动配置即可。

必须关闭防火墙，否则 DHCP 和 TFTP 的 UDP 端口会被拦截：

```bash
sudo systemctl stop firewalld
sudo systemctl disable firewalld   # 如果要长期使用
# 若未安装 firewalld 则略过；用 iptables 的话手动清空规则或直接停止
```

---

6. 第四步：安装必要的软件包

```bash
sudo pacman -Syu
sudo pacman -S dnsmasq nginx wget unzip
```

· dnsmasq：提供 DHCP 和 TFTP
· nginx：提供 HTTP 文件服务
· wget、unzip：用于获取 iPXE 等工具（你可以从其他电脑下载好用移动硬盘拷贝过来，本教程假设已联网下载，若完全离线请提前下载好）

---

7. 第五步：准备目录结构与启动文件

我们需要三个主要目录：

· TFTP 根：/srv/tftp（存放网络启动引导程序）
· HTTP 根：/usr/share/nginx/html（存放 ISO、内核、initrd、wimboot 等）
· 移动硬盘挂载点：/mnt/hdd（存放原始 ISO 文件，可选）

```bash
sudo mkdir -p /srv/tftp
sudo chmod -R 755 /srv/tftp
```

7.1 下载并放置 iPXE 引导文件

iPXE 是一个高级网络启动管理器，可以提供漂亮的菜单并灵活加载各类系统。我们需要两个版本：

· undionly.kpxe：用于传统 BIOS 启动
· ipxe.efi：用于 64 位 UEFI 启动

联网下载（或手动拷贝）：

```bash
cd /srv/tftp
sudo wget https://boot.ipxe.org/undionly.kpxe
sudo wget https://boot.ipxe.org/ipxe.efi
```

---

8. 第六步：配置 dnsmasq（DHCP + TFTP）

编辑 /etc/dnsmasq.conf（先备份原文件）：

```bash
sudo cp /etc/dnsmasq.conf /etc/dnsmasq.conf.bak
sudo nano /etc/dnsmasq.conf
```

清空内容，写入以下配置：

```ini
# 绑定到桥接网卡
interface=enp0s3

# DHCP 地址池，分配给目标电脑
dhcp-range=192.168.1.100,192.168.1.200,12h

# 启用 TFTP 并指定根目录
enable-tftp
tftp-root=/srv/tftp

# 根据客户端架构分配合适的 iPXE 启动文件
dhcp-match=set:bios,option:client-arch,0
dhcp-boot=tag:bios,undionly.kpxe

dhcp-match=set:efi32,option:client-arch,6
dhcp-boot=tag:efi32,ipxe.efi

dhcp-match=set:efi64,option:client-arch,7
dhcp-boot=tag:efi64,ipxe.efi

# 若检测不到架构，统一走 BIOS（很多老电脑只发此请求）
dhcp-boot=undionly.kpxe
```

启动 dnsmasq 并设为开机自启（本次使用）：

```bash
sudo systemctl start dnsmasq
sudo systemctl enable dnsmasq
```

---

9. 第七步：配置 nginx 提供 HTTP 安装源

```bash
sudo systemctl start nginx
sudo systemctl enable nginx
```

默认情况下，nginx 的根目录在 /usr/share/nginx/html。我们将把需要目标机下载的文件全部放到这里。为了能从移动硬盘直接提供大文件，可以创建一个符号链接：

```bash
sudo ln -s /mnt/hdd /usr/share/nginx/html/hdd
```

这样，移动硬盘中的 ISO 文件就可以通过 http://192.168.1.10/hdd/xxx.iso 访问。但要注意 nginx 的工作进程需要有读取权限。如果移动硬盘是 NTFS 格式，挂载时可能需加权限参数，例如 sudo mount -t ntfs-3g /dev/sdb1 /mnt/hdd -o permissions,uid=1000,gid=1000，之后把 nginx 用户加入对应组。一种简单粗暴的方法是在测试时以 root 运行 nginx（不推荐生产环境）：

编辑 /etc/nginx/nginx.conf，将 user http; 修改为 user root;，然后重启 nginx。装完系统后记得改回来。

---

10. 第八步：准备操作系统安装文件

10.1 安装 Linux（以 Ubuntu 24.04 为例）

假设你的 Ubuntu ISO 放在移动硬盘根目录，文件名为 ubuntu-24.04-desktop-amd64.iso。

1. 挂载 ISO 并提取内核和 initrd：

```bash
sudo mkdir /mnt/iso
sudo mount -o loop /mnt/hdd/ubuntu-24.04-desktop-amd64.iso /mnt/iso
sudo cp /mnt/iso/casper/vmlinuz /usr/share/nginx/html/vmlinuz-ubuntu
sudo cp /mnt/iso/casper/initrd /usr/share/nginx/html/initrd-ubuntu
```

2. 将整个 ISO 文件也软链接到 HTTP 目录（或直接复制进去）：

```bash
sudo ln -s /mnt/hdd/ubuntu-24.04-desktop-amd64.iso /usr/share/nginx/html/ubuntu.iso
```

10.2 安装 Windows（以 Windows 10 为例）

1. 提前准备 wimboot 小程序，可以从 iPXE 项目下载：
   ```bash
   cd /usr/share/nginx/html
   sudo wget https://github.com/ipxe/wimboot/releases/latest/download/wimboot
   ```
   如果离线，请用其他电脑下载后用 U 盘拷贝到 Manjaro。
2. 从 Windows ISO 中提取 boot.wim（安装启动映像）：

```bash
sudo mount -o loop /mnt/hdd/Win10_22H2_English_x64.iso /mnt/iso
sudo cp /mnt/iso/sources/boot.wim /usr/share/nginx/html/boot.wim
```

boot.wim 负责启动安装环境，后续安装过程会自动寻找 install.wim 或 install.esd。
为了完全离线，建议把整个 ISO 也放到 HTTP 目录，并在 iPXE 脚本中加载整个 ISO（需要较大内存）或者将 install.wim 提取出来放到 HTTP。这里提供简单方案：仅用 boot.wim 启动，安装程序会要求选择安装源，可随后通过 SMB 或本地磁盘提供，但最简单的是把完整 ISO 解压到 HTTP 目录（需要 NTFS 兼容）。这里先给出一个通用 boot.wim 引导方法，在进入安装界面后手动从移动硬盘选择（稍后在目标电脑操作中说明）。

---

11. 第九步：编写 iPXE 启动菜单

创建 /srv/tftp/boot.ipxe，这是所有客户端网络启动后会加载的脚本：

```bash
sudo nano /srv/tftp/boot.ipxe
```

输入以下内容：

```ipxe
#!ipxe

:start
menu 请选择要安装的操作系统
item ubuntu   Ubuntu 24.04 桌面版
item win10    Windows 10
item shell    进入 iPXE 命令行
choose --default ubuntu --timeout 30000 target && goto ${target}

:ubuntu
kernel http://192.168.1.10/vmlinuz-ubuntu
initrd http://192.168.1.10/initrd-ubuntu
imgargs vmlinuz-ubuntu boot=casper maybe-ubiquity iso-scan/filename=http://192.168.1.10/ubuntu.iso quiet splash ---
boot || goto start

:win10
kernel http://192.168.1.10/wimboot
initrd http://192.168.1.10/boot.wim  boot.wim
boot || goto start

:shell
echo 进入命令行，输入 exit 返回菜单
shell
goto start
```

注意：192.168.1.10 是我们给 Manjaro 设置的静态 IP，请确保与你的网络配置一致。
对于 Windows，如果只想启动 boot.wim，之后的安装过程需要手动加载 install.wim。可在目标机进入 Windows PE 后，通过 diskpart 挂载移动硬盘（如果插到目标电脑上）或通过网线从共享读取。这部分我们会在后面说明。

---

12. 第十步：连接目标电脑并启动

13. 用网线一头插 Windows 物理机的空闲网口，另一头插目标电脑的有线网口。
14. 打开目标电脑电源，立即反复按 F12、F2、DEL、ESC 或 F10 等键（不同品牌按键不同），进入 Boot Menu（启动菜单）。
15. 在启动菜单中选择 Network 或 PXE 或 LAN 或 iBA CL 等网络启动选项，回车。
16. 目标电脑的屏幕应显示从 Manjaro 获取 IP（192.168.1.xxx），然后加载 iPXE，进入我们制作的菜单。
17. 选择想要安装的系统，回车。

12.1 如果选择 Ubuntu

· 系统会下载内核和 initrd，之后直接从 HTTP 挂载 ISO 进入 Live 桌面。
· 然后点击桌面上的 “Install Ubuntu”，按照常规流程安装。安装源已经指向 HTTP 上的 ISO，不再需要互联网。

12.2 如果选择 Windows

· iPXE 会加载 wimboot 和 boot.wim，进入 Windows PE 安装环境。
· 进入后，你可能遇到 “缺少介质驱动程序” 或需要选择安装源的情况。此时：
  · 如果目标机有额外的 USB 口，可以将存放 Windows ISO 的移动硬盘拔下，插到目标电脑上，然后在 Windows PE 中按 Shift+F10 打开命令提示符，用 diskpart 或 setup.exe 手动启动安装。
  · 或者，预先将 Windows ISO 的全部内容解压到 /usr/share/nginx/html/win10/，然后在 iPXE 的 win10 条目中，使用更完整的参数直接加载整个安装环境，但这需要额外配置 Windows 部署服务或使用类似 netboot.xyz 的脚本。
      推荐简易方案：将 Windows ISO 做成可直接启动的 USB 或移动硬盘的一部分，进入 PE 后从那里运行 setup.exe。但这偏离了“不用 U 盘”的初衷。因此更好的做法是：在 Manjaro 上再开启 Samba 共享，将解压后的安装文件共享出去，然后在 Windows PE 中通过 net use 连接网络驱动器来安装。限于篇幅，此处不展开，你可以选择先装 Linux 积累经验，Windows 下次优化。

---

13. 适配老电脑与新电脑的特殊点

13.1 老电脑（2010 年以前，仅支持传统 BIOS）

· 网卡启动支持：老主板可能需要在 BIOS 中打开 “Onboard LAN Boot ROM” 或类似选项。
· 启动文件：dnsmasq 里我们已经配置了回退到 undionly.kpxe，老式 BIOS 会直接使用它。
· PXE 堆栈：极少数古董机可能不支持 PXE，可尝试用刻录光盘或 USB 启动 iPXE 镜像，但已超出本教程范围。
· 内存要求：Windows PE 需要至少 512 MB 内存，老机器如果内存太小可能无法启动。

13.2 新电脑（UEFI，支持安全启动）

· 安全启动 (Secure Boot)：必须临时关闭！因为自签名的 iPXE 和 Linux 内核可能无法通过 Secure Boot 验证。进入 BIOS 设置，找到 Secure Boot 选项，设置为 Disabled。
· UEFI 网络堆栈：有些笔记本默认关闭了 UEFI 网络启动，需要在 BIOS 中启用 “Network Stack” 或 “PXE Boot to LAN”。
· 启动顺序：在 Boot Menu 中，UEFI 设备通常会区分为 UEFI: Network 和 Legacy: Network，请选择 UEFI 开头的那个。
· dnsmasq 架构检测：我们的配置已通过 DHCP 选项 93（client-arch）自动识别 64 位 UEFI 并分配 ipxe.efi，因此大部分新机器都能直接加载正确的引导程序。

---

14. 补充：全程不使用互联网的离线准备清单

如果你在搭建服务器时连互联网都不想用，可以提前用另一台联网电脑下载好以下文件，用移动硬盘拷贝到 Manjaro 虚拟机：

· iPXE 启动文件：undionly.kpxe 和 ipxe.efi
· wimboot（若需要安装 Windows）
· 系统 ISO 文件（Ubuntu、Windows）
· 软件包离线缓存（可选）：你可以先在联网的 Manjaro 上执行 sudo pacman -Sw dnsmasq nginx wget unzip 下载而不安装，然后拷贝 /var/cache/pacman/pkg 到离线机器安装。但最简单的还是让虚拟机临时桥接 Wi-Fi 网卡上网 5 分钟把包装好，再切换回有线桥接。

---

15. 常见故障排查

现象 可能原因 解决方法
目标机网络启动后一直 “DHCP…” 然后超时 防火墙未关闭；网线松动；dnsmasq 绑定接口错误 sudo systemctl stop firewalld；检查网线；确认 enp0s3 名称正确
目标机获取到 IP，但无法加载启动文件 TFTP 目录权限问题；文件缺失 ls -l /srv/tftp 确保 undionly.kpxe 存在且可读；检查 dnsmasq 日志 journalctl -u dnsmasq
加载 iPXE 后菜单出现，但提示 HTTP 404 nginx 未启动；文件路径错误；权限不足 sudo systemctl status nginx；浏览器访问 http://192.168.1.10/ 测试；检查软链接
UEFI 机器直接进入正常系统，忽略网络启动 启动顺序未调整；安全启动阻止 进 BIOS 将 Network 移到第一位；关闭 Secure Boot
Windows PE 启动后找不到安装源 仅加载了 boot.wim，无 install.wim 在 PE 中插入移动硬盘运行 setup.exe，或预先配置完整安装源

---

16. 结语与延伸

恭喜你！你现在已经拥有一个完全脱离 U 盘、可随身携带的“网络装机服务器”。这套方案尤其适合：

· 电脑无 USB 口或 USB 口损坏
· 批量装机（此时接一个交换机可以多台同时安装）
· 应急救援（带一个存满 ISO 的移动硬盘和一根网线即可）

进一步优化建议

1. 使用 netboot.xyz 离线版：下载 netboot.xyz 的 EFI 文件和离线菜单，可自动配置几乎所有 Linux 发行版的安装源，极大简化菜单编写。
2. 添加 Windows 完整网络安装：研究 Windows 部署服务（WDS）或使用 iPXE 脚本直接引导 install.wim，实现 Windows 的全自动安装。
3. 将 Manjaro 虚拟机做成设备：导出为 OVA 模板，以后在任意 Windows 主机上导入即可，零配置复刻。

如果你在操作中遇到任何具体问题，欢迎随时提问！


【神级系统备份还原工具！Clonezilla再生龙安装使用指南-哔哩哔哩】 https://b23.tv/StcewuL