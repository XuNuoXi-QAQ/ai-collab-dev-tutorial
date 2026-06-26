---
title: "Linux 系统管理命令快速参考卡"
tags:
  - Linux
  - 命令
  - 速查
  - Manjaro
aliases:
  - "命令速查卡"
description: "这是Manjaro 系统管理的终极速查手册，按使用场景分类整理，适合日常快速查阅。"
---

这是Manjaro 系统管理的**终极速查手册**，按使用场景分类整理，适合日常快速查阅。

---

## 一、系统状态总览（一键检查）

```bash
# 系统健康检查（你的常用组合）
uptime && free -h && df -h

# 系统信息全览
uname -a && hostname && cat /etc/os-release

# 服务状态总览
systemctl list-units --type=service --state=running | head -20
```

---

## 二、进程管理

| 操作 | 命令 |
|------|------|
| 查看所有进程 | `ps aux` |
| 查找特定进程 | `ps aux \| grep 关键词` |
| 实时监控 | `htop`（推荐）或 `top` |
| 按内存排序 | `ps aux --sort=-%mem` |
| 按 CPU 排序 | `ps aux --sort=-%cpu` |
| 正常终止进程 | `kill PID` |
| 强制终止进程 | `kill -9 PID` |
| 按名称终止 | `pkill 进程名` |
| 查找 PID | `pgrep 进程名` |
| 查看进程树 | `pstree -p` |

---

## 三、服务管理（systemd）

| 操作 | 系统服务 | 用户服务（你的 AstrBot） |
|------|----------|--------------------------|
| 启动 | `sudo systemctl start 服务` | `systemctl --user start 服务` |
| 停止 | `sudo systemctl stop 服务` | `systemctl --user stop 服务` |
| 重启 | `sudo systemctl restart 服务` | `systemctl --user restart 服务` |
| 重载 | `sudo systemctl reload 服务` | `systemctl --user reload 服务` |
| 状态 | `systemctl status 服务` | `systemctl --user status 服务` |
| 开机自启 | `sudo systemctl enable 服务` | `systemctl --user enable 服务` |
| 取消自启 | `sudo systemctl disable 服务` | `systemctl --user disable 服务` |
| 查看所有服务 | `systemctl list-units --type=service` | `systemctl --user list-units --type=service` |

### 你的常用服务
```bash
# AstrBot
systemctl --user status astrbot
systemctl --user restart astrbot
journalctl --user -u astrbot -f

# 1Panel
sudo systemctl status 1panel
sudo systemctl restart 1panel
sudo journalctl -u 1panel -f

# Docker
systemctl status docker
sudo systemctl restart docker
journalctl -u docker -f
```

---

## 四、日志查看

| 操作 | 命令 |
|------|------|
| 查看系统日志 | `journalctl -xe` |
| 实时监控 | `journalctl -f` |
| 服务日志 | `journalctl -u 服务 -f` |
| 最近 N 行 | `journalctl -n 50` |
| 最近 1 小时 | `journalctl --since "1 hour ago"` |
| 今天日志 | `journalctl --since "today"` |
| 限制日志大小 | `sudo journalctl --vacuum-size=500M` |
| 查看内核日志 | `dmesg -T` |
| 实时内核日志 | `dmesg -w` |

---

## 五、文件与目录操作

| 操作 | 命令 |
|------|------|
| 列出文件（含隐藏） | `ls -la` |
| 树形显示 | `tree -L 2 -a` |
| 查找文件 | `find / -name "文件名"` |
| 查找文件（限制深度） | `find . -maxdepth 3 -name "*.md"` |
| 搜索内容 | `grep -r "关键词" .` |
| 只显示文件名 | `grep -l "关键词" *.md` |
| 复制文件 | `cp file1 file2` |
| 复制目录 | `cp -r dir1 dir2` |
| 删除文件 | `rm file` |
| 删除目录（递归） | `rm -rf dir` |
| 重命名/移动 | `mv old new` |
| 创建软链接 | `ln -s 源 链接` |
| 创建目录（多级） | `mkdir -p 路径` |
| 查看文件类型 | `file 文件` |
| 统计行数 | `wc -l 文件` |
| 查看文件内容 | `cat 文件` |
| 分页查看 | `less 文件` |
| 查看开头 | `head -n 10 文件` |
| 查看结尾 | `tail -n 20 文件` |
| 实时查看 | `tail -f 文件` |

---

## 六、磁盘与空间管理

| 操作 | 命令 |
|------|------|
| 查看磁盘使用 | `df -h` |
| 查看目录大小 | `du -sh 目录` |
| 查看一级子目录大小 | `du -h --max-depth=1 \| sort -rh` |
| 查找大文件 | `find / -size +100M 2>/dev/null` |
| 清理 Pacman 缓存 | `sudo paccache -r -k 3` |
| 清理所有包缓存 | `sudo pacman -Scc` |
| 查看内存使用 | `free -h` |
| 查看交换空间 | `swapon -s` |
| 查看 inode 使用 | `df -i` |
| 查看磁盘分区 | `lsblk` |

---

## 七、网络管理

| 操作 | 命令 |
|------|------|
| 查看 IP | `ip addr` |
| 测试连通性 | `ping 8.8.8.8` |
| 测试 DNS | `dig +short github.com` |
| 测试 HTTP | `curl -I https://github.com` |
| 下载文件 | `wget URL` |
| 查看监听端口 | `sudo ss -tulpn` |
| 查看端口占用 | `sudo lsof -i :端口` |
| 重启网络 | `sudo systemctl restart NetworkManager` |
| SSH 连接 | `ssh 用户@IP` |
| 测试 GitHub SSH | `ssh -T git@github.com` |
| 放行端口（ufw） | `sudo ufw allow 端口/tcp` |
| 查看路由 | `ip route` |
| 追踪路由 | `traceroute 域名` |

---

## 八、Docker 管理

| 操作 | 命令 |
|------|------|
| 查看运行中的容器 | `docker ps` |
| 查看所有容器 | `docker ps -a` |
| 查看镜像 | `docker images` |
| 拉取镜像 | `docker pull 镜像` |
| 运行容器 | `docker run -d --name 容器名 镜像` |
| 启动/停止/重启 | `docker start/stop/restart 容器名` |
| 删除容器 | `docker rm 容器名` |
| 删除镜像 | `docker rmi 镜像名` |
| 查看日志 | `docker logs 容器名 -f` |
| 进入容器 | `docker exec -it 容器名 bash` |
| 查看占用 | `docker system df` |
| 清理资源 | `docker system prune -f` |
| Compose 启动 | `docker-compose up -d` |
| Compose 停止 | `docker-compose down` |
| Compose 日志 | `docker-compose logs -f` |

---

## 九、包管理

| 操作 | 官方仓库 | AUR |
|------|----------|-----|
| 安装 | `sudo pacman -S 包` | `yay -S 包` |
| 更新系统 | `sudo pacman -Syu` | `yay -Syu` |
| 搜索包 | `pacman -Ss 关键词` | `yay -Ss 关键词` |
| 搜索已安装 | `pacman -Qs 关键词` | `yay -Qs 关键词` |
| 查看信息 | `pacman -Qi 包` | `yay -Qi 包` |
| 卸载 | `sudo pacman -Rns 包` | `yay -Rns 包` |
| 查看所有已安装 | `pacman -Q` | `yay -Q` |
| 查看显式安装 | `pacman -Qe` | `yay -Qe` |
| 查看 AUR 包 | — | `pacman -Qm` |
| 查看孤包 | `pacman -Qdt` | — |
| 删除孤包 | `sudo pacman -Rsn $(pacman -Qdtq)` | — |
| 清理缓存 | `sudo pacman -Scc` | `yay -Yc` |

---

## 十、SSH 与密钥

| 操作 | 命令 |
|------|------|
| 生成密钥（Ed25519） | `ssh-keygen -t ed25519 -C "邮箱"` |
| 查看公钥 | `cat ~/.ssh/id_ed25519.pub` |
| 复制公钥到服务器 | `ssh-copy-id 用户@IP` |
| 启动 ssh-agent | `eval "$(ssh-agent -s)"` |
| 添加私钥 | `ssh-add ~/.ssh/id_ed25519` |
| 设置私钥权限 | `chmod 600 ~/.ssh/id_*` |
| 查看配置 | `cat ~/.ssh/config` |

---

## 十一、性能监控

| 操作 | 命令 |
|------|------|
| 交互式监控 | `htop` |
| 查看 CPU | `mpstat -P ALL 1` |
| 查看磁盘 I/O | `iostat -x 1` |
| 查看内存 | `vmstat 1` |
| 定期执行命令 | `watch -n 1 "命令"` |
| 测量执行时间 | `time 命令` |

---

## 十二、应急修复

| 操作 | 命令 |
|------|------|
| 重启系统 | `sudo reboot` |
| 关机 | `sudo shutdown -h now` |
| 清理缓存 | `sudo sync && sudo echo 3 > /proc/sys/vm/drop_caches` |
| 无确认更新 | `sudo pacman -Syu --noconfirm` |
| 进入救援模式 | `sudo systemctl rescue` |
| 查看上次启动错误 | `journalctl -p err -b -1` |
| 查看内核错误 | `dmesg -T \| grep -i error` |
| 查找已删除文件 | `sudo lsof +L1` |

---

## 十三、组合命令（实用技巧）

### 一键系统状态
```bash
echo "=== 系统信息 ===" && uname -a && echo "=== 内存 ===" && free -h && echo "=== 磁盘 ===" && df -h && echo "=== 负载 ===" && uptime
```

### 一键清理系统
```bash
sudo paccache -r -k 3 && sudo journalctl --vacuum-size=500M && yay -Yc && echo "✅ 清理完成"
```

### 一键查看 AstrBot 状态
```bash
echo "=== AstrBot 状态 ===" && systemctl --user status astrbot --no-pager && echo "=== 最新日志 ===" && journalctl --user -u astrbot -n 10
```

### 一键查找大文件
```bash
find / -type f -size +100M -exec ls -lh {} \; 2>/dev/null | awk '{print $5, $9}' | sort -rh | head -20
```

---

## 十四、快捷键速记

| 快捷键 | 功能 |
|--------|------|
| `Ctrl+C` | 终止当前命令 |
| `Ctrl+Z` | 暂停当前命令（挂起） |
| `Ctrl+D` | 退出当前终端 |
| `Ctrl+L` | 清屏 |
| `Ctrl+A` | 跳到行首 |
| `Ctrl+E` | 跳到行尾 |
| `Ctrl+U` | 删除光标前所有内容 |
| `Ctrl+K` | 删除光标后所有内容 |
| `Ctrl+R` | 搜索历史命令 |
| `Ctrl+Shift+C` | 终端复制 |
| `Ctrl+Shift+V` | 终端粘贴 |
| `Tab` | 自动补全 |

---

## 📌 记住这些组合

```bash
# 最常用的三个状态命令
free -h          # 内存
df -h            # 磁盘
htop             # 进程

# 最常用的三个管理命令
systemctl status 服务   # 服务状态
journalctl -u 服务 -f   # 服务日志
docker logs 容器 -f     # 容器日志

# 最常用的三个排查命令
ping 8.8.8.8            # 网络连通性
sudo lsof -i :端口      # 端口占用
grep -r "关键词" .      # 内容搜索
```