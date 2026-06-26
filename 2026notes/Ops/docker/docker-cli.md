---
title: "docker-cli"
tags:
  - Docker
  - 容器
description: "🔍 容器查看与调试"
created: 2026-06-23
---

## 📦 镜像管理

| 说明 | 命令 | 常用示例 |
| :--- | :--- | :--- |
| 从仓库下载镜像 | `docker pull` | `docker pull nginx:latest` |
| 列出本地镜像 | `docker images` 或 `docker image ls` | `docker images` |
| 删除本地镜像 | `docker rmi` | `docker rmi nginx:latest` |
| 从 Dockerfile 构建镜像 | `docker build` | `docker build -t myapp:1.0 .` |
| 为镜像打标签 | `docker tag` | `docker tag myapp:1.0 myregistry/myapp:1.0` |
| 推送镜像到仓库 | `docker push` | `docker push myregistry/myapp:1.0` |
| 导出镜像为 tar 文件 | `docker save` | `docker save -o myapp.tar myapp:1.0` |
| 从 tar 文件导入镜像 | `docker load` | `docker load -i myapp.tar` |
| 查看镜像/容器详细信息 | `docker inspect` | `docker inspect myapp:1.0` |
| 查看镜像层历史 | `docker history` | `docker history nginx:latest` |
| 查看磁盘使用情况 | `docker system df` | `docker system df -v` |

---

## 🚀 容器生命周期

| 说明 | 命令 | 常用示例 |
| :--- | :--- | :--- |
| 创建并启动容器 | `docker run` | `docker run -d -p 8080:80 --name web nginx` |
| 启动已停止的容器 | `docker start` | `docker start web` |
| 停止运行中的容器 | `docker stop` | `docker stop web` |
| 重启容器 | `docker restart` | `docker restart web` |
| 暂停容器进程 | `docker pause` | `docker pause web` |
| 恢复暂停的容器 | `docker unpause` | `docker unpause web` |
| 删除容器（-f 强制） | `docker rm` | `docker rm -f web` |
| 创建容器但不启动 | `docker create` | `docker create --name web nginx` |
| 重命名容器 | `docker rename` | `docker rename web web-server` |
| 等待容器停止并返回退出码 | `docker wait` | `docker wait web` |

---

## 🔍 容器查看与调试

| 说明 | 命令 | 常用示例 |
| :--- | :--- | :--- |
| 列出容器（-a 含已停止） | `docker ps` | `docker ps -a` |
| 查看容器日志（-f 跟随） | `docker logs` | `docker logs -f web` |
| 在容器内执行命令（-it 交互） | `docker exec` | `docker exec -it web /bin/bash` |
| 连接到容器标准输入/输出 | `docker attach` | `docker attach web` |
| 查看容器内进程 | `docker top` | `docker top web` |
| 实时查看资源使用（CPU/内存） | `docker stats` | `docker stats web` |
| 查看容器端口映射 | `docker port` | `docker port web` |
| 查看容器与镜像的文件差异 | `docker diff` | `docker diff web` |
| 实时监控 Docker 事件 | `docker events` | `docker events --since 1h` |

---

## 🗂️ 数据卷管理

| 说明 | 命令 | 常用示例 |
| :--- | :--- | :--- |
| 创建数据卷 | `docker volume create` | `docker volume create mydata` |
| 列出所有数据卷 | `docker volume ls` | `docker volume ls` |
| 查看数据卷详情 | `docker volume inspect` | `docker volume inspect mydata` |
| 删除数据卷 | `docker volume rm` | `docker volume rm mydata` |
| 清理未使用的数据卷 | `docker volume prune` | `docker volume prune -f` |

---

## 🌐 网络管理

| 说明 | 命令 | 常用示例 |
| :--- | :--- | :--- |
| 创建网络 | `docker network create` | `docker network create mynet` |
| 列出所有网络 | `docker network ls` | `docker network ls` |
| 查看网络详情 | `docker network inspect` | `docker network inspect mynet` |
| 将容器连接到网络 | `docker network connect` | `docker network connect mynet web` |
| 将容器从网络断开 | `docker network disconnect` | `docker network disconnect mynet web` |
| 删除网络 | `docker network rm` | `docker network rm mynet` |
| 清理未使用的网络 | `docker network prune` | `docker network prune -f` |

---

## 🧹 系统清理与维护

| 说明 | 命令 | 常用示例 |
| :--- | :--- | :--- |
| 清理停止的容器/未使用的网络/悬空镜像 | `docker system prune` | `docker system prune -a -f` |
| 清理所有停止的容器 | `docker container prune` | `docker container prune` |
| 清理未使用的镜像 | `docker image prune` | `docker image prune -a` |
| 清理构建缓存 | `docker builder prune` | `docker builder prune` |
| 查看 Docker 版本 | `docker version` | `docker version` |
| 查看 Docker 系统信息 | `docker info` | `docker info` |
| 登录镜像仓库 | `docker login` | `docker login` |
| 登出镜像仓库 | `docker logout` | `docker logout` |

---

## ⚙️ `docker run` 常用参数

| 说明 | 参数 | 常用示例 |
| :--- | :--- | :--- |
| 后台运行 | `-d, --detach` | `docker run -d nginx` |
| 交互式运行 | `-it` | `docker run -it ubuntu /bin/bash` |
| 指定容器名称 | `--name` | `docker run --name web nginx` |
| 端口映射（宿主机:容器） | `-p, --publish` | `docker run -p 8080:80 nginx` |
| 映射所有暴露端口（随机端口） | `-P` | `docker run -P nginx` |
| 挂载数据卷或目录 | `-v, --volume` | `docker run -v /host/data:/data nginx` |
| 显式挂载（推荐） | `--mount` | `docker run --mount type=bind,src=/host,tgt=/app nginx` |
| 设置环境变量 | `-e, --env` | `docker run -e DB_HOST=localhost nginx` |
| 从文件读取环境变量 | `--env-file` | `docker run --env-file .env nginx` |
| 重启策略 | `--restart` | `docker run --restart always nginx` |
| 停止后自动删除 | `--rm` | `docker run --rm nginx` |
| 连接指定网络 | `--network` | `docker run --network mynet nginx` |
| 指定用户运行 | `--user` | `docker run --user 1000:1000 nginx` |
| 指定工作目录 | `--workdir` | `docker run --workdir /app nginx` |
| 覆盖默认入口点 | `--entrypoint` | `docker run --entrypoint /bin/bash nginx` |
| 设置健康检查 | `--health-cmd` | `docker run --health-cmd "curl -f localhost" nginx` |
| 给予所有特权 | `--privileged` | `docker run --privileged nginx` |
| 设置系统资源限制 | `--ulimit` | `docker run --ulimit nofile=1024:2048 nginx` |
| 限制内存 | `-m, --memory` | `docker run -m 512m nginx` |
| 限制 CPU | `--cpus` | `docker run --cpus=2 nginx` |

---

## 🧩 实战组合速查

| 场景 | 命令示例 |
| :--- | :--- |
| 完整启动 Web 服务 | `docker run -d --name web -p 8080:80 -v /data:/usr/share/nginx/html --restart always --memory 512m nginx:alpine` |
| 进入容器调试 | `docker exec -it web /bin/bash` |
| 以 root 进入容器 | `docker exec -it -u root web /bin/bash` |
| 实时跟踪日志 | `docker logs -f web` |
| 查看最后 100 行日志 | `docker logs --tail 100 web` |
| 停止所有容器 | `docker stop $(docker ps -q)` |
| 删除所有停止的容器 | `docker rm $(docker ps -aq)` |
| 清理一切未使用资源 | `docker system prune -a -f` |

---
