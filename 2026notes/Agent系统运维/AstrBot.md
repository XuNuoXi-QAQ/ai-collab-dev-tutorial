---
title: "AstrBot"
tags:
  - AstrBot
  - 机器人
  - 聊天
aliases:
  - "AstrBot机器人"
description: "`systemctl --user restart astrbot`"
---

重启命令
`systemctl --user restart astrbot`


系统级AstrBot访问路径http://localhost:6186

下一步AstrBot 跑起来后，你需要：
1. **配置 AI 模型**（如 DeepSeek、硅基流动等，填入 API Key）
2. **接入消息平台**（如 QQ、飞书、微信等）
3. **开始使用**
docker 部署的AstrBot
### 现在你可以通过两种方式访问 AstrBot

| 访问方式 | 地址 |
|---------|------|
| **Web 管理界面** | `http://172.30.174.180:6185` |
| **1Panel 容器管理** | 1Panel → 容器 → 点击 astrbot → 可以查看日志/终端/状态 |---### 首次登录 AstrBot1. 浏览器访问 `http://172.30.174.180:6185`2. 默认用户名：`astrbot`3. 默认密码：`astrbot`4. 登录后会提示修改密码，建议改掉如果您是初次使用，旧版默认 astrbot 密码已改为启动日志中输出的随机强密码。请使用日志中提供的的初始密码来登录。

后续在 1Panel 中管理在 1Panel 的容器列表里，你可以：
-**启动/停止/重启** 容器
- **查看实时日志**（排查问题很方便）
- **进入容器终端**（调试用）
- **查看资源占用**（CPU/内存）

---

## 🔗 相关笔记

- [[HAPI-本地优先的 AI 编程远程控制框架]]
- [[Graphify-rs智能联动]]
- [[Azure TTS 配置指南 — AstrBot 语音合成]]
