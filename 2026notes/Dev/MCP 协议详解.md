---
title: "MCP 协议详解"
tags:
  - AI
  - 开发
  - 技术
  - MCP
  - Obsidian
  - AstrBot
description: "AstrBot 通过 MCP 协议连接各种扩展服务："
created: 2026-06-23
---

# MCP 协议详解

> **MCP** = Model Context Protocol（模型上下文协议）
> 一句话：AI 的「万能 USB 接口」🔌

---

## 🔌 核心概念

MCP 是一个**开放标准协议**，让 AI 大模型能够统一、安全地与外部工具和数据源交互。就像 USB 接口标准化了设备连接一样，MCP 标准化了 AI 与外部世界的连接方式。

### 类比理解

| 类比 | 说明 |
|------|------|
| USB 接口 | 不管什么设备，插上就能用 |
| 🌉 翻译官 | AI 和外部工具之间的通用桥梁 |
| 🧩 即插即用外挂 | 配置即用，不用写对接代码 |

---

## ⚙️ 为什么需要 MCP？

### 没有 MCP 的时候
- 每个外部能力（查数据库、读文件、搜网页）都需要单独写代码
- 不同 AI 平台的工具接口互不兼容
- 维护成本高，扩展困难

### 有了 MCP 之后
- 一次编写，到处使用
- 统一的协议标准
- 工具可复用、可共享

---

## 🏗️ 架构



- **MCP Client**：AI 端，发起请求
- **MCP Server**：工具端，提供服务
- 通信方式：stdio（本地进程）、SSE、HTTP 流式

---

## 🤖 在 AstrBot 中的应用

AstrBot 通过 MCP 协议连接各种扩展服务：

- 🔍 **文件系统 MCP** → 读写文件
- 🌐 **搜索 MCP** → 上网查资料
- 📝 **Obsidian MCP** → 操作笔记库
- 🎨 **ComfyUI MCP** → AI 生成图片
- 🧠 **记忆 MCP** → Mnemosyne 长期记忆

### 管理方式

在 AstrBot 中通过 [[skills-mcp-manager]] 插件管理 MCP 服务器。

相关配置见 [[AstrBot 配置]]（）。

---

## 📎 相关笔记

- TTS 语音配置 → [[AstrBot TTS 语音配置]]
- Pi Agent 的 API 配置 → [[Pi Agent 配置记录]]
- 记忆系统排查 → [[Mnemosyne 记忆系统排查]]
