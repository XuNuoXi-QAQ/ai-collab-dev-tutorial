好的，收到。既然你决定使用 “1TB主盘双系统 + 第二块SSD做 /data 数据盘 + GNOME桌面” 的方案，那我们现在就进入最核心、最硬核的实操环节——系统迁移。

这是一份保姆级、零废话的完整迁移教程。请你拿出小本本（或者直接收藏），严格按照顺序执行，保证你的虚拟机系统“灵魂附体”到物理机上。

---

第一部分：迁移前的“终极盘点”与体检（在虚拟机内执行）

在关机搬家前，我们必须把家底摸清楚。

1. 生成“包安装清单”（这是灵魂，让你重装软件时一键恢复）

```bash
# 1.1 官方源安装的软件
pacman -Qqe > /data/backup/pkglist_explicit.txt

# 1.2 AUR（社区）安装的软件（如果你用了 yay 或 paru）
pacman -Qqm > /data/backup/pkglist_aur.txt

# 1.3 手动安装或编译的软件（通常在 /usr/local 或 /opt）
ls /usr/local/bin /opt > /data/backup/manual_apps_list.txt
```

2. 导出 GNOME 桌面所有配置（快捷键、扩展、鼠标灵敏度）

```bash
# GNOME 全量配置备份
dconf dump / > /data/backup/gnome_settings_backup.dconf

# GNOME 扩展列表备份（防止版本冲突）
gnome-extensions list > /data/backup/gnome_extensions_list.txt
```

3. 备份“漏网之鱼”——系统级关键配置

```bash
# 备份 /etc/hosts, /etc/hostname, /etc/fstab（仅供参考，物理机需重写）
sudo cp /etc/hostname /data/backup/
sudo cp /etc/hosts /data/backup/
sudo cp /etc/fstab /data/backup/fstab.bak
```

4. （可选）备份 /root 和 /etc/skel
如果你在 root 用户下也有自定义配置（比如 .bashrc），一并打包：

```bash
sudo tar -czf /data/backup/root_config.tar.gz /root/
```

5. 系统大扫除（瘦身，让迁移包更小）

```bash
# 清理包管理器缓存
sudo pacman -Scc

# 清理日志
sudo journalctl --vacuum-size=200M
```

---

第二部分：物理机硬件准备与分区（关机后操作）

第一步：物理连接硬盘

· 主盘（1TB NVMe）：插在主板的 CPU直连 M.2 插槽（最快的那个）。
· 第二块 SSD（数据盘）：插在主板 第二个 M.2 插槽 或 SATA 接口。

第二步：进入 BIOS，做两件关键小事

1. 关闭 Secure Boot（安全启动）（否则 Manjaro 内核无法引导）。
2. 设置启动模式为 UEFI Only（不要开 CSM/Legacy 兼容模式）。
3. 保存重启。

---

第三部分：安装 Windows 与 Manjaro（双系统地基）

步骤 1：安装 Windows（只占用 200GB）

1. 插入 Ventoy U 盘，启动 Windows ISO。
2. 在“你想将 Windows 安装在何处？”界面，删除 1TB 主盘上所有已有分区（确保是“未分配空间”）。
3. 点击 “新建”，输入大小 200000（约 200GB），创建 C 盘。
4. 剩下的所有空间（约 730GB） 保持 “未分配”，不要新建 D 盘。
5. 选择 C 盘，点“下一步”，安装 Windows。
6. 进 Windows 桌面后，不要格式化剩余空间，直接关机。

步骤 2：安装 Manjaro（根目录 150GB + 共享数据区）

1. 插着 Ventoy U 盘，启动 Manjaro ISO。
2. 点击“安装 Manjaro”，选择 “手动分区”。

在手动分区界面执行“四连击”：

动作 设备/空间 大小 文件系统 挂载点 是否格式化？
① 挂载 EFI 主盘第一个分区（已存在，Windows 建的） 500MB FAT32 /boot/efi ❌ 不格式化！
② 挂载根目录 主盘的 150GB 未分配空间 150GB ext4 / ✅ 格式化
③ 挂载共享数据 主盘的 剩余未分配空间（约 650GB） 剩余全部 NTFS /mnt/shared ✅ 格式化（NTFS 分区在此创建）
④ 挂载数据盘 第二块 SSD（整块盘） 全部 ext4 /data ✅ 格式化
⑤ 引导器位置 最下方下拉框 - - - 必须选主盘（如 /dev/nvme0n1，不带数字！）

致命细节：如果你在挂载 /boot/efi 时误勾选了“格式化”，Windows 引导会被删除。如果发生，先退出安装，用 Ventoy 启动 Windows PE 修复引导，再回来重装 Manjaro。

3. 点击“下一步”，填写用户名密码，完成安装。

---

第四部分：重启后的“灵魂注入”（恢复数据与配置）

1. 开机进 GRUB，选择 Manjaro（第一项）

2. 第一步：解决双系统时间差（必须）

```bash
timedatectl set-local-rtc 1
```

3. 第二步：修改 /etc/fstab（让系统认亲）
用 sudo blkid 查看 UUID，修改 /etc/fstab，确保：

· /boot/efi 指向主盘 EFI 分区（通常自动识别）。
· / 指向主盘 ext4 分区。
· /data 指向第二块 SSD。
· /mnt/shared 指向主盘 NTFS 分区。

4. 第三步：恢复你备份的数据（核心操作）

```bash
# 解压系统配置（如果之前打包了 /etc 或 /root 配置）
sudo tar -xzf /data/backup/root_config.tar.gz -C /

# 重建家目录软链接（让系统使用 /data 里的旧配置）
rm -rf ~/.config ~/.local ~/.cache
ln -s /data/Configs/.config ~/.config
ln -s /data/Configs/.local ~/.local
ln -s /data/Configs/.cache ~/.cache
```

5. 第四步：恢复 GNOME 设置（快捷键/壁纸/鼠标）

```bash
dconf load / < /data/backup/gnome_settings_backup.dconf
```

6. 第五步：一键重装所有软件（包清单回灌）

```bash
# 安装官方源软件
sudo pacman -S --needed - < /data/backup/pkglist_explicit.txt

# 安装 AUR 软件（需先安装 yay）
yay -S --needed - < /data/backup/pkglist_aur.txt
```

7. 第六步：恢复大型软件（/opt 和 /usr/local）
如果你在虚拟机里用 tar 打包过 /opt 或 /usr/local：

```bash
sudo tar -xzf /data/backup/opt_software.tar.gz -C /
sudo tar -xzf /data/backup/local_software.tar.gz -C /
```

8. 第七步：安装显卡驱动（Manjaro 专属）
如果出现黑屏或分辨率异常，按 Ctrl+Alt+F2 进终端执行：

```bash
sudo mhwd -a pci nonfree 0300
```

---

第五部分：最终校验（确保一切完美）

· 重启电脑，检查 GRUB 菜单是否有 Windows 选项（如果没有，执行 sudo update-grub）。
· 检查快捷键（Win+E 等）是否生效。
· 检查 /data 是否自动挂载（df -h 查看）。
· 进入 ~/.config 目录，执行 git status（如果你之前建了 Git 仓库）确认配置完好。

---

最后的警告与定心丸

· 如果 GNOME 扩展加载失败（顶栏消失）：不要慌！按 Alt+F2，输入 r 回车重启 Shell，或者删除 ~/.local/share/gnome-shell/extensions 下的旧扩展文件夹，按第二步清单重新安装。
· 所有数据（视频、代码、虚拟机） 都在 /data 和 /mnt/shared 里，根目录即使重装也伤不到它们。

