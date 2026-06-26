---
title: "9Docker 管理命令精讲"
tags:
  - Linux
  - Docker
  - 容器
  - 运维
  - 命令
description: "Docker 是容器化技术的核心工具，你已经通过 Docker 部署了 AstrBot 和 1Panel。这组命令帮助你管理容器、镜像、网络和存储。"
---

# Docker 管理命令精讲

Docker 是容器化技术的核心工具，你已经通过 Docker 部署了 **AstrBot** 和 **1Panel**。这组命令帮助你管理容器、镜像、网络和存储。

---

## 一、核心概念

### Docker 核心组件
| 组件 | 含义 | 类比 |
|------|------|------|
| **容器 (Container)** | 运行中的实例 | 运行中的程序 |
| **镜像 (Image)** | 只读模板 | 程序的安装包 |
| **仓库 (Registry)** | 存储镜像的地方 | 应用商店 |
| **卷 (Volume)** | 持久化数据 | 硬盘 |

### Docker 架构
```
客户端 (docker CLI) → Docker 守护进程 (dockerd) → 容器运行时
```

---

## 2. `docker ps` — 查看运行中的容器（最常用）

### 命令格式
```bash
docker ps                      # 查看运行中的容器
docker ps -a                   # 查看所有容器（含停止的）
docker ps -q                   # 只显示容器 ID
docker ps --filter "status=exited"  # 过滤已停止的容器
```

### 输出示例
```bash
docker ps
```
```
CONTAINER ID   IMAGE                 COMMAND        CREATED       STATUS       PORTS                    NAMES
b97c4cc527d8   soulter/astrbot:latest "python main.py" 10 hours ago Up 7 hours 0.0.0.0:6185->6185/tcp   astrbot
```

### 各部分含义
| 字段 | 含义 | 示例值 |
|------|------|--------|
| `CONTAINER ID` | 容器 ID（唯一标识） | `b97c4cc527d8` |
| `IMAGE` | 使用的镜像 | `soulter/astrbot:latest` |
| `COMMAND` | 启动命令 | `python main.py` |
| `CREATED` | 创建时间 | `10 hours ago` |
| `STATUS` | 当前状态 | `Up 7 hours` / `Exited` |
| `PORTS` | 端口映射 | `0.0.0.0:6185->6185/tcp` |
| `NAMES` | 容器名称 | `astrbot` |

### 状态含义
| 状态 | 含义 |
|------|------|
| `Up` | 运行中 |
| `Exited` | 已停止 |
| `Created` | 已创建但未启动 |
| `Restarting` | 正在重启 |

### 实际应用
```bash
# 查看所有运行中的容器
docker ps

# 查看所有容器（你经常用）
docker ps -a

# 查看 AstrBot 容器状态
docker ps | grep astrbot

# 查看容器 ID（用于脚本）
docker ps -q
```

---

## 3. `docker images` — 查看镜像列表

### 命令格式
```bash
docker images              # 查看所有镜像
docker images -a           # 查看所有镜像（含中间层）
docker images --filter "reference=ubuntu"  # 过滤
```

### 输出示例
```bash
docker images
```
```
REPOSITORY            TAG       IMAGE ID       CREATED       SIZE
soulter/astrbot       latest    xxxxxxxx       2 days ago    1.2GB
ubuntu                22.04     xxxxxxxx       3 weeks ago   77.8MB
```

### 实际应用
```bash
# 查看所有镜像
docker images

# 查看 AstrBot 镜像
docker images | grep astrbot

# 查看镜像 ID
docker images -q
```

---

## 4. `docker pull 镜像` — 拉取镜像

### 命令格式
```bash
docker pull 镜像名:标签        # 拉取指定标签
docker pull ubuntu:22.04       # 拉取 Ubuntu 22.04
docker pull soulter/astrbot:latest  # 拉取 AstrBot
```

### 实际应用
```bash
# 拉取 AstrBot 镜像（你之前做过）
docker pull soulter/astrbot:latest

# 拉取 Ubuntu
docker pull ubuntu:22.04

# 拉取指定版本
docker pull python:3.11-slim
```

---

## 5. `docker run -d --name 容器名 镜像` — 运行容器

### 命令格式
```bash
docker run -d --name 容器名 镜像              # 后台运行
docker run -it --name 容器名 镜像 bash        # 交互式运行
docker run -d -p 端口:端口 --name 容器名 镜像  # 端口映射
docker run -d -v 宿主机:容器 --name 容器名 镜像 # 挂载卷
```

### 参数说明
| 参数 | 含义 |
|------|------|
| `-d` | 后台运行（detach） |
| `-it` | 交互式运行（interactive + TTY） |
| `--name` | 指定容器名称 |
| `-p` | 端口映射 `宿主机:容器` |
| `-v` | 挂载卷 `宿主机:容器` |
| `--restart` | 重启策略（`always`, `unless-stopped`） |
| `-e` | 设置环境变量 |

### 实际应用
```bash
# 运行 Nginx（端口映射）
docker run -d --name nginx -p 8080:80 nginx

# 运行 AstrBot（你之前执行过）
docker run -d \
  --name astrbot \
  --restart always \
  -p 6185:6185 \
  -v /home/nuoxi/Docker/AstrBot/data:/app/data \
  soulter/astrbot:latest

# 进入交互式容器
docker run -it --name ubuntu ubuntu:22.04 bash

# 运行一次性任务
docker run --rm ubuntu echo "Hello"
```

---

## 6. `docker start` / `stop` / `restart` — 容器生命周期管理

### 命令格式
```bash
docker start 容器名        # 启动容器
docker stop 容器名         # 停止容器
docker restart 容器名      # 重启容器
docker pause 容器名        # 暂停容器
docker unpause 容器名      # 恢复容器
```

### 实际应用
```bash
# 启动 AstrBot
docker start astrbot

# 停止 AstrBot
docker stop astrbot

# 重启 AstrBot
docker restart astrbot

# 停止所有容器
docker stop $(docker ps -q)
```

---

## 7. `docker rm` — 删除容器

### 命令格式
```bash
docker rm 容器名           # 删除容器（需停止）
docker rm -f 容器名        # 强制删除
docker rm -v 容器名        # 删除容器及关联卷
```

### 实际应用
```bash
# 删除单个容器
docker rm astrbot

# 强制删除
docker rm -f astrbot

# 删除所有已停止的容器
docker rm $(docker ps -a -q)

# 删除所有容器（包括运行中）
docker rm -f $(docker ps -a -q)
```

---

## 8. `docker rmi` — 删除镜像

### 命令格式
```bash
docker rmi 镜像名:标签      # 删除镜像
docker rmi -f 镜像ID        # 强制删除
```

### 实际应用
```bash
# 删除镜像
docker rmi ubuntu:22.04

# 删除所有未使用的镜像
docker image prune -a

# 删除所有镜像
docker rmi -f $(docker images -q)
```

---

## 9. `docker logs 容器名 -f` — 查看容器日志

### 命令格式
```bash
docker logs 容器名          # 查看所有日志
docker logs -f 容器名       # 实时跟踪
docker logs --tail 50 容器名  # 查看最近50行
docker logs --since 1h 容器名  # 最近1小时
```

### 实际应用（你经常用）
```bash
# 查看 AstrBot 实时日志
docker logs astrbot -f

# 查看最近 50 行
docker logs astrbot --tail 50

# 查看最近 1 小时
docker logs astrbot --since 1h

# 查看 1Panel 容器日志
docker logs 1panel -f
```

---

## 10. `docker exec -it 容器名 bash` — 进入容器

### 命令格式
```bash
docker exec -it 容器名 bash       # 进入容器（bash）
docker exec -it 容器名 sh         # 进入容器（sh）
docker exec 容器名 命令            # 在容器内执行命令
```

### 实际应用
```bash
# 进入 AstrBot 容器
docker exec -it astrbot bash

# 在容器内执行单条命令
docker exec astrbot python --version

# 在容器内查看文件
docker exec astrbot ls -la /app

# 以 root 身份进入
docker exec -it -u root astrbot bash
```

---

## 11. `docker system prune -f` — 清理未使用的资源

### 命令格式
```bash
docker system prune          # 交互式清理
docker system prune -f       # 强制清理
docker system prune -a       # 清理所有未使用镜像
docker system prune -f -a    # 强制清理所有
```

### 清理内容
| 资源 | 是否清理 |
|------|----------|
| 已停止的容器 | ✅ |
| 未使用的镜像 | ✅ |
| 未使用的网络 | ✅ |
| 未使用的卷 | ❌（需加 `--volumes`） |

### 实际应用
```bash
# 清理未使用的资源
docker system prune -f

# 清理所有未使用的镜像
docker system prune -f -a

# 清理包括卷
docker system prune -f --volumes
```

---

## 12. `docker system df` — 查看 Docker 磁盘占用

### 命令格式
```bash
docker system df          # 查看磁盘占用
docker system df -v       # 查看详细信息
```

### 输出示例
```
TYPE            TOTAL     ACTIVE    SIZE      RECLAIMABLE
Images          5         2         2.3GB     1.2GB (52%)
Containers      10        3         0B        0B (0%)
Local Volumes   3         1         150MB     100MB (66%)
```

### 实际应用
```bash
# 查看 Docker 磁盘占用
docker system df

# 查看详细占用
docker system df -v
```

---

## 13. `docker-compose up -d` — 启动 Docker Compose

### 命令格式
```bash
docker-compose up -d           # 后台启动
docker-compose up --build -d   # 重新构建后启动
docker-compose -f 文件.yml up -d  # 指定配置文件
```

### 实际应用
```bash
# 进入 AstrBot 目录启动
cd /path/to/astrbot
docker-compose up -d

# 重新构建并启动
docker-compose up --build -d

# 启动 1Panel 的 Compose 项目
docker-compose -f /opt/1panel/docker-compose.yml up -d
```

---

## 14. `docker-compose down` — 停止 Docker Compose

### 命令格式
```bash
docker-compose down           # 停止并移除容器
docker-compose down -v        # 同时删除卷
docker-compose down --rmi all # 同时删除镜像
```

### 实际应用
```bash
# 停止 AstrBot Compose 项目
docker-compose down

# 停止并删除卷
docker-compose down -v
```

---

## 15. `docker-compose logs -f` — 查看 Compose 日志

### 命令格式
```bash
docker-compose logs -f        # 实时查看所有日志
docker-compose logs 服务名 -f  # 查看特定服务
```

### 实际应用
```bash
# 查看所有日志
docker-compose logs -f

# 查看特定服务
docker-compose logs astrbot -f
```

---

## 16. `docker-compose ps` — 查看 Compose 容器状态

### 命令格式
```bash
docker-compose ps         # 查看所有容器状态
```

### 输出示例
```
NAME                COMMAND             SERVICE             STATUS              PORTS
astrbot             python main.py      astrbot             Up 7 hours          0.0.0.0:6185->6185/tcp
```

---

## 📊 Docker 命令快速参考卡

| 操作 | 命令 |
|------|------|
| 查看运行中的容器 | `docker ps` |
| 查看所有容器 | `docker ps -a` |
| 查看镜像 | `docker images` |
| 拉取镜像 | `docker pull 镜像` |
| 运行容器 | `docker run -d --name 容器名 镜像` |
| 启动容器 | `docker start 容器名` |
| 停止容器 | `docker stop 容器名` |
| 重启容器 | `docker restart 容器名` |
| 删除容器 | `docker rm 容器名` |
| 删除镜像 | `docker rmi 镜像名` |
| 查看日志 | `docker logs 容器名 -f` |
| 进入容器 | `docker exec -it 容器名 bash` |
| 清理资源 | `docker system prune -f` |
| 查看磁盘占用 | `docker system df` |
| Compose 启动 | `docker-compose up -d` |
| Compose 停止 | `docker-compose down` |
| Compose 日志 | `docker-compose logs -f` |
| Compose 状态 | `docker-compose ps` |

---

## 💡 你的实战场景

### 场景1：查看 AstrBot 状态
```bash
# 1. 检查是否运行
docker ps | grep astrbot

# 2. 查看日志
docker logs astrbot -f

# 3. 进入容器
docker exec -it astrbot bash
```

### 场景2：重启 AstrBot
```bash
# 进入 Compose 目录
cd /path/to/astrbot

# 重启
docker-compose restart

# 或使用 docker 命令
docker restart astrbot
```

### 场景3：清理 Docker 资源
```bash
# 查看占用
docker system df

# 清理未使用的资源
docker system prune -f

# 再次查看
docker system df
```

### 场景4：查看 1Panel 容器
```bash
# 查找 1Panel 容器
docker ps -a | grep 1panel

# 查看日志
docker logs 1panel -f
```

---

## ⚠️ 注意事项

1. **端口冲突**：确保容器端口不被其他服务占用。
2. **数据持久化**：使用 `-v` 挂载卷防止数据丢失（你已经为 AstrBot 配置了）。
3. **`docker system prune -a` 会删除未使用的镜像**，谨慎使用。
4. **`docker rm -f` 强制删除容器**，正在运行的容器会被强制停止。
5. **Docker 需要 root 权限**，确保用户已加入 `docker` 组（你之前已配置）。
6. **镜像拉取慢时**：使用 `docker pull 镜像名` 并配合代理（你已经配置了 Docker 代理）。