---
title: "3服务管理（systemd）命令精讲"
tags:
  - Linux
  - systemd
  - 服务
  - 运维
  - 命令
description: "`systemd` 是 Linux 系统的初始化系统和服务管理器，是现代 Linux 发行版（包括 Manjaro）的标配。它管理着系统中所有的服务（Service）——即那些在后台运行的程序，如 Docker、SSH、Web 服务器等。"
---

`systemd` 是 Linux 系统的**初始化系统和服务管理器**，是现代 Linux 发行版（包括 Manjaro）的标配。它管理着系统中所有的**服务（Service）**——即那些在后台运行的程序，如 Docker、SSH、Web 服务器等。

---

## 一、systemd 核心概念

### 什么是服务（Service）？
服务是一个在后台持续运行的程序，通常没有图形界面。例如：
- `docker.service`：Docker 容器引擎
- `sshd.service`：SSH 远程连接服务
- `gdm.service`：GNOME 显示管理器
- `NetworkManager.service`：网络管理服务

### 服务类型
| 类型 | 说明 |
|------|------|
| **系统服务** | 由系统启动，影响整个系统（需要 `sudo`） |
| **用户服务** | 由当前用户启动，只影响该用户（使用 `--user`） |
| **套接字服务** | 按需启动（socket activation） |
| **定时器服务** | 替代 cron 的定时任务 |

---

## 2. `systemctl start 服务` — 启动服务

### 命令格式
```bash
sudo systemctl start 服务名    # 启动系统服务
systemctl --user start 服务名  # 启动用户服务
```

### 实际应用
```bash
# 启动 Docker
sudo systemctl start docker

# 启动你的 AstrBot（用户服务）
systemctl --user start astrbot

# 启动 1Panel
sudo systemctl start 1panel
```

### 常见错误
| 错误信息 | 原因 | 解决方法 |
|----------|------|----------|
| `Failed to start docker.service: Unit docker.service not found.` | 服务未安装 | 安装对应软件包 |
| `Failed to start astrbot.service: Unit astrbot.service not found.` | 服务文件不存在 | 创建服务文件或用其他方式启动 |
| `Failed to start docker.service: Access denied` | 权限不足 | 使用 `sudo` |

---

## 3. `systemctl stop 服务` — 停止服务

### 命令格式
```bash
sudo systemctl stop 服务名
systemctl --user stop 服务名
```

### 实际应用
```bash
# 停止 Docker
sudo systemctl stop docker

# 停止 AstrBot
systemctl --user stop astrbot
```

---

## 4. `systemctl restart 服务` — 重启服务

### 命令格式
```bash
sudo systemctl restart 服务名
systemctl --user restart 服务名
```

### 实际应用（你最常用的命令）
```bash
# 重启 Docker
sudo systemctl restart docker

# 重启 AstrBot（你经常用）
systemctl --user restart astrbot

# 重启 1Panel
sudo systemctl restart 1panel

# 查看 1Panel 状态
systemctl status 1panel
```

---

## 5. `systemctl reload 服务` — 重载配置（不中断服务）

### 命令格式
```bash
sudo systemctl reload 服务名
```

### 与 `restart` 的区别
| 特性 | `restart` | `reload` |
|------|-----------|----------|
| 服务中断 | ✅ 会中断 | ❌ 不中断 |
| 适用场景 | 所有服务 | 支持重载的服务（如 nginx, sshd） |
| 速度 | 较慢（重新启动进程） | 较快（只重新加载配置） |

### 实际应用
```bash
# 重载 Nginx 配置（不中断服务）
sudo systemctl reload nginx

# 重载 SSH 配置（不中断连接）
sudo systemctl reload sshd
```

---

## 6. `systemctl status 服务` — 查看服务状态（最常用）

### 命令格式
```bash
sudo systemctl status 服务名
systemctl status 服务名      # 系统服务不需要 sudo 也可以查看
systemctl --user status 服务名
```

### 输出示例
```
● docker.service - Docker Application Container Engine
     Loaded: loaded (/usr/lib/systemd/system/docker.service; enabled; preset: disabled)
     Active: active (running) since Mon 2026-06-22 10:30:15 CST; 2h ago
       Docs: https://docs.docker.com
   Main PID: 1234 (dockerd)
      Tasks: 15 (limit: 15655)
     Memory: 89.2M (peak: 102.1M)
        CPU: 12.345s
     CGroup: /system.slice/docker.service
             └─1234 /usr/bin/dockerd -H fd:// --containerd=/run/containerd/containerd.sock

Jun 22 10:30:15 nuoxi-system dockerd[1234]: API listen on /var/run/docker.sock
Jun 22 10:30:16 nuoxi-system dockerd[1234]: containerd successfully started
```

### 各部分含义
| 字段 | 含义 | 说明 |
|------|------|------|
| `Loaded` | 加载状态 | `loaded` / `not-found` / `masked` |
| `Active` | **运行状态** | `active (running)` / `inactive (dead)` / `failed` |
| `Main PID` | 主进程 ID | 服务的核心进程号 |
| `Tasks` | 任务数 | 服务启动的子进程数 |
| `Memory` | 内存占用 | 当前内存使用和峰值 |
| `CPU` | CPU 时间 | 累计 CPU 使用时间 |
| `CGroup` | 控制组 | 资源隔离信息 |

### 状态值含义
| 状态 | 含义 | 说明 |
|------|------|------|
| `active (running)` | ✅ 正在运行 | 正常运行中 |
| `active (exited)` | ⚠️ 已退出 | 一次性任务已完成 |
| `active (waiting)` | ⏳ 等待中 | 等待某些条件 |
| `inactive (dead)` | ❌ 已停止 | 服务未运行 |
| `failed` | ❌ 启动失败 | 服务启动出错 |

### 实际应用
```bash
# 查看 AstrBot 是否在运行
systemctl --user status astrbot

# 查看 Docker 运行状态
systemctl status docker

# 查看 1Panel 状态（你用过）
sudo systemctl status 1panel
```

---

## 7. `systemctl enable 服务` — 设置开机自启

### 命令格式
```bash
sudo systemctl enable 服务名     # 系统服务
systemctl --user enable 服务名   # 用户服务
```

### 实际应用
```bash
# 让 Docker 开机自启
sudo systemctl enable docker

# 让 AstrBot 开机自启
systemctl --user enable astrbot

# 让 1Panel 开机自启
sudo systemctl enable 1panel
```

### 工作原理
`enable` 会创建符号链接，将服务文件链接到特定的目标目录：
```bash
# 查看 enable 创建了什么链接
ls -l /etc/systemd/system/multi-user.target.wants/docker.service
```

---

## 8. `systemctl disable 服务` — 取消开机自启

### 命令格式
```bash
sudo systemctl disable 服务名
systemctl --user disable 服务名
```

### 实际应用
```bash
# 取消 Docker 开机自启
sudo systemctl disable docker
```

---

## 9. `systemctl list-units --type=service` — 列出所有服务

### 命令格式
```bash
systemctl list-units --type=service        # 所有服务
systemctl list-units --type=service --state=running  # 运行中的服务
systemctl list-units --type=service --state=failed   # 失败的服务
```

### 输出示例
```
UNIT                      LOAD   ACTIVE SUB     DESCRIPTION
docker.service            loaded active running Docker Application Container Engine
sshd.service              loaded active running OpenSSH Daemon
NetworkManager.service    loaded active running Network Manager
gdm.service               loaded active running GNOME Display Manager
```

### 与 `list-unit-files` 的区别
| 命令 | 显示内容 | 适用场景 |
|------|----------|----------|
| `list-units` | 当前状态（是否正在运行） | 查看服务当前是否运行 |
| `list-unit-files` | 静态状态（是否开机自启） | 查看服务的自启设置 |

---

## 10. `systemctl list-unit-files --state=enabled` — 列出开机自启服务

### 命令格式
```bash
systemctl list-unit-files --state=enabled          # 系统服务
systemctl --user list-unit-files --state=enabled   # 用户服务
```

### 输出示例（你之前用过）
```bash
systemctl list-unit-files --state=enabled
```
输出：
```
UNIT FILE                          STATE   PRESET
docker.service                     enabled disabled
sshd.service                       enabled disabled
gdm.service                        enabled disabled
```

### 字段含义
| 字段 | 含义 |
|------|------|
| `UNIT FILE` | 服务文件名 |
| `STATE` | 自启状态：`enabled` / `disabled` / `masked` |
| `PRESET` | 系统预设：`enabled` / `disabled` |

---

## 11. `systemctl is-active 服务` — 检查服务是否运行

### 命令格式
```bash
systemctl is-active 服务名
```

### 返回状态
- `active` — 正在运行
- `inactive` — 未运行
- `failed` — 启动失败

### 实际应用
```bash
# 脚本中判断 Docker 是否在运行
if systemctl is-active --quiet docker; then
    echo "Docker is running"
else
    echo "Docker is not running"
fi

# 检查 AstrBot 状态
systemctl --user is-active astrbot
```

---

## 12. `systemctl is-enabled 服务` — 检查是否开机自启

### 命令格式
```bash
systemctl is-enabled 服务名
```

### 返回状态
- `enabled` — 已启用开机自启
- `disabled` — 未启用开机自启
- `masked` — 被屏蔽（无法启动）

### 实际应用
```bash
# 检查 Docker 是否开机自启
systemctl is-enabled docker

# 检查 AstrBot 是否开机自启
systemctl --user is-enabled astrbot
```

---

## 13. `journalctl -u 服务 -f` — 查看服务实时日志

### 命令格式
```bash
sudo journalctl -u 服务名 -f      # 系统服务
journalctl --user -u 服务名 -f   # 用户服务
```

### 参数说明
| 参数 | 含义 |
|------|------|
| `-u 服务名` | 指定服务 |
| `-f` | 实时跟踪（类似 `tail -f`） |
| `-n 50` | 显示最近 50 行 |
| `--since "1 hour ago"` | 指定时间范围 |

### 实际应用
```bash
# 实时查看 Docker 日志
sudo journalctl -u docker -f

# 查看 AstrBot 最近 50 行日志
journalctl --user -u astrbot -n 50

# 查看 1Panel 服务日志
sudo journalctl -u 1panel -f
```

---

## 14. `journalctl --since "1 hour ago"` — 按时间查看日志

### 命令格式
```bash
journalctl --since "时间"          # 按时间过滤
journalctl --since "1 hour ago"   # 最近1小时
journalctl --since "2026-06-22 10:00:00"  # 指定时间
journalctl --since "yesterday"    # 从昨天开始
```

### 实际应用
```bash
# 查看最近1小时的所有系统日志
sudo journalctl --since "1 hour ago"

# 查看 Docker 最近2小时的日志
sudo journalctl -u docker --since "2 hours ago"

# 查看 AstrBot 今天的日志
journalctl --user -u astrbot --since "today"
```

---

## 📊 服务管理命令快速参考

| 操作 | 系统服务 | 用户服务 |
|------|----------|----------|
| 启动 | `sudo systemctl start 服务` | `systemctl --user start 服务` |
| 停止 | `sudo systemctl stop 服务` | `systemctl --user stop 服务` |
| 重启 | `sudo systemctl restart 服务` | `systemctl --user restart 服务` |
| 重载 | `sudo systemctl reload 服务` | `systemctl --user reload 服务` |
| 状态 | `systemctl status 服务` | `systemctl --user status 服务` |
| 自启 | `sudo systemctl enable 服务` | `systemctl --user enable 服务` |
| 取消自启 | `sudo systemctl disable 服务` | `systemctl --user disable 服务` |
| 查看日志 | `sudo journalctl -u 服务 -f` | `journalctl --user -u 服务 -f` |

---

## 💡 管理 AstrBot 的完整流程

```bash
# 1. 启动 AstrBot
systemctl --user start astrbot

# 2. 查看状态
systemctl --user status astrbot

# 3. 查看实时日志
journalctl --user -u astrbot -f

# 4. 停止 AstrBot
systemctl --user stop astrbot

# 5. 设置开机自启
systemctl --user enable astrbot

# 6. 重启 AstrBot（修改配置后）
systemctl --user restart astrbot
```

---

## 🔍 1Panel 服务管理（你已安装）

```bash
# 1. 查看 1Panel 状态
sudo systemctl status 1panel

# 2. 重启 1Panel（你之前问过）
sudo systemctl restart 1panel

# 3. 查看 1Panel 日志
sudo journalctl -u 1panel -f

# 4. 检查 1Panel 是否开机自启
systemctl is-enabled 1panel
```