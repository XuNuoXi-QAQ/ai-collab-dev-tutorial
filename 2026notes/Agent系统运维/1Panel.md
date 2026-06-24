---
title: "1Panel"
tags:
  - 运维
  - 1Panel
  - Linux
  - 面板
aliases:
  - 1Panel面板
created: 2026-06-23
---
### 关于 app.yaml 找不到的问题

1Panel 的配置文件实际路径可能在 `/opt/1panel/resource/app.yaml` 或其他位置，不过这不影响使用。`find` 命令没找到可能是因为权限或路径问题，不用纠结。

---

### 登录后做什么？

登录 1Panel 后，你可以：

1. **在"应用商店"里一键安装各种服务**（如 MySQL、Redis、Nginx 等）
2. **在"容器"菜单里管理 Docker 容器和镜像**（这是你之前关心的）
3. **在"网站"菜单里管理站点和反向代理**
4. **在"文件"菜单里管理服务器文件**

---

### 接下来部署 AstrBot

1Panel 装好后，部署 AstrBot 就简单了：
- 进入 1Panel 的 **"容器" → "编排"**
- 创建新的 Docker Compose，把 AstrBot 的 `compose.yml` 内容贴进去
- 一键启动

或者直接在 1Panel 的终端里执行 Docker 命令也可以。



