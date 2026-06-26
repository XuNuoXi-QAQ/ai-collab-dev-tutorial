---
title: "Pi Agent"
tags:
  - AI
  - Agent
  - MCP
  - Git
description: "pi 终端编码助手的详细使用教程。"
created: 2026-06-23
---

pi 终端编码助手的详细使用教程。

🧐 什么是 Pi Agent？

pi 是由 libGDX 游戏框架作者 Mario Zechner 开发的一款终端AI编码助手。它的核心哲学是极简主义，默认只提供 4 个基础工具，其他所有功能都通过按需安装的扩展来获得。这种设计让 pi 异常轻量和快速，并且能够高度适应你的个人工作流。

📦 安装与初始配置

1. 安装 Node.js：pi 是基于 Node.js 的，请先确保系统已安装 Node.js。
2. 安装 Pi Agent：推荐使用 npm 进行全局安装。
   ```bash
   npm install -g @mariozechner/pi-coding-agent
   ```
   除 npm 外，也可从 GitHub Releases 下载对应平台的独立二进制文件。
   · Windows 用户注意：pi 依赖 bash 环境，建议安装 Git for Windows。
   · macOS 用户注意：若二进制文件被系统阻止，可运行 xattr -c ./pi 移除隔离属性。
3. 配置 API 密钥：pi 本身是客户端，需要大模型 API 才能工作。
   · 方法一：通过配置文件（推荐）：创建 ~/.pi/agent/auth.json 文件并填入密钥。
     ```json
     {
       "anthropic": { "type": "api_key", "key": "sk-ant-..." },
       "openai": { "type": "api_key", "key": "sk-..." },
       "google": { "type": "api_key", "key": "..." }
     }
     ```
   · 方法二：通过环境变量：也支持通过 ANTHROPIC_API_KEY、OPENAI_API_KEY 等环境变量设置。

🚀 基本使用：开启你的第一个会话

1. 启动交互式会话：在终端中进入你的项目目录，输入 pi 并回车，即可开始一个交互式会话。
2. 核心交互方式：
   · 发送消息：输入你的提示词，按 Enter 发送。
   · 多行输入：使用 Shift+Enter 换行。
   · 模型切换：会话中可通过命令随时切换模型。
3. 理解四个默认工具：pi 赋予 AI 模型四个基础“工具”。
   · read：读取文件或目录内容。
   · write：创建新文件或覆盖写入。
   · edit：对现有文件进行针对性修改。
   · bash：在项目环境中执行 Shell 命令。

🎮 进阶功能与命令

· 会话管理：会话历史存储在 ~/.pi/agent/sessions/，可使用 pi --resume 恢复之前的会话。
· 角色扮演 (Roles)：通过 @lojacobs/pi-roles 扩展，可以定义 architect、planner 等角色，每个角色有自己的系统提示和工具集。使用时用 pi --role architect 启动，会话中用 /role planner 切换。
· 会话回滚 (Rollback)：通过 pi-rollback 扩展，可在不丢失上下文的情况下，安全地回退到会话历史中的某个“检查点”。
· 网页界面 (Web UI)：@zwbigi/pi-agent-xy 提供了一个 Web 界面，允许通过浏览器浏览、分叉和管理会话。可通过 npx @zwbigi/pi-agent-xy@latest 快速启动。

🔌 扩展与生态

这是 pi 最强大的部分，你可以通过这些扩展来按需武装你的 AI 助手：

· 网络搜索：@ollama/pi-web-search 能让 pi 联网搜索和获取最新文档。
· 自主优化实验：pi-autoresearch 可让 pi 自主进行优化实验。
· 技能系统 (Skills)：动态加载的技能模块，可按需扩展特定功能。
· 扩展包：pi-agent-suite 是一个集成包，提供了智能体配置、子智能体、顾问工具、上下文管理、通知、MCP 工具和提示助手等扩展。
· MCP 适配：pi-mcp-adapter 可集成 MCP 服务器工具，实现更强大的功能。

⚙️ 常见问题与技巧

· 安装扩展：使用 pi install npm:<package-name> 命令。
· 终端兼容性：pi 依赖 Kitty 键盘协议，确保你的终端（如 Kitty, iTerm2）支持。不支持的终端可能导致快捷键失效。
· 自定义 Shell 路径：如需使用非默认 shell，可在 ~/.pi/agent/settings.json 中配置 shellPath。
· 启用 Shell 别名：若 pi 无法识别你的别名，可在 settings.json 中配置 shellCommandPrefix。

pi 是一款非常灵活的 AI 编码助手，你可以根据自己的需求，通过安装不同的扩展来定制它的功能。希望这份教程能帮助你更好地使用它。
