---
title: "MCP 模型上下文协议 - 完整指南"
tags:
  - MCP
  - AI
  - 协议
  - Obsidian
  - AstrBot
  - 工具链
aliases:
  - "MCP协议"
  - "模型上下文协议"
  - "Model Context Protocol"
description: "MCP（Model Context Protocol，模型上下文协议）是一个开放标准协议，专为解决大语言模型与外部世界「隔离」的问题而设计。你可以把它理解为 AI 领域的「万能插头」——就像 USB-C 接口统一了手机、电脑、外设的连接方式，MCP 统一了 AI 模型与各种外部工具、数据源之间的交互方式。"
---


# MCP 模型上下文协议 — 完整指南

> **MCP** = Model Context Protocol（模型上下文协议）
> 由 Anthropic 提出，是 AI 领域的「万能 USB-C 接口」🔌



## 一、什么是 MCP？

MCP（Model Context Protocol，模型上下文协议）是一个**开放标准协议**，专为解决大语言模型与外部世界「隔离」的问题而设计。你可以把它理解为 AI 领域的「万能插头」——就像 USB-C 接口统一了手机、电脑、外设的连接方式，MCP 统一了 AI 模型与各种外部工具、数据源之间的交互方式。

### 1.1 一句话理解

| 类比         | 解释                                                         |
| ------------ | ------------------------------------------------------------ |
| 🔌 USB-C     | 不管什么设备，插上就能用。MCP 让 AI 连接任何工具，不用关心内部实现。 |
| 🌉 翻译官    | AI 说「AI 语」，工具说「工具语」，MCP 在中间做翻译，双方无需关心对方语言。 |
| 🧩 乐高积木  | 每个 MCP Server 是一块积木，组合起来就能搭出强大的 AI 应用。   |
| 🎛️ 调音台    | AI 通过 MCP 像调音师一样，把不同工具的信号混音输出，各司其职。 |

### 1.2 为什么需要 MCP？

**没有 MCP 的时代**，AI 与外部工具的集成是一场噩梦：

- 🔴 **每个集成都是定制的**：想让 AI 查数据库？写一套代码。想让 AI 读文件？再写一套。N 个工具 = N 套代码。
- 🔴 **接口互不兼容**：OpenAI 的 Function Calling 和 Anthropic 的 Tool Use 格式不同，换模型就要重写。
- 🔴 **维护成本极高**：工具升级 → 接口变化 → 所有下游 AI 应用都要改。
- 🔴 **无法复用**：A 项目写好的文件读取工具，B 项目完全用不了。

**有了 MCP 之后**：

- 🟢 **一次编写，到处使用**：一个 MCP Server 可以被任何支持 MCP 的 AI Host 调用。
- 🟢 **统一协议标准**：不管是 OpenAI、Anthropic、还是本地模型，都走同一套 MCP 协议。
- 🟢 **工具即插即用**：添加新能力只需配置一个 MCP Server，不需要改任何 AI 代码。
- 🟢 **生态可共享**：社区开发的 MCP Server 可以直接拿来用。



## 二、MCP 的三大核心角色

理解 MCP 架构的关键在于分清三个角色：



### 2.1 MCP Host（宿主）

**定义**：你日常使用的 AI 应用，是用户交互的入口。它负责：

- 发现并管理已配置的 MCP 服务器
- 根据用户指令，决定调用哪个服务器的哪个工具
- 将工具返回的结果整合进 AI 的回复中

**在你的工具链中**：

| Host       | 用途                   |
| ---------- | ---------------------- |
| **AstrBot** | 微信/飞书/WebChat 机器人，核心 AI 入口 |
| **Cursor** | AI 编程 IDE             |
| **OpenCode** | 终端 AI 编程助手       |
| **Pi Agent** | 本地 AI Agent 框架     |

### 2.2 MCP Server（服务器）

**定义**：一个独立运行的程序，是「能力的提供方」。它将自身功能以标准化的 **工具（Tools）** 形式暴露给 Host。

**本质**：MCP Server 就是一个普通的程序（Python 脚本、Node.js 应用、Rust 二进制等），遵循 MCP 协议规范与 Host 通信。

**常见类型**：

| 类型           | 示例                   | 说明                     |
| -------------- | ---------------------- | ------------------------ |
| 文件系统       |  | 读写本地文件             |
| 数据库         |   | 查询数据库               |
| API 封装       |  | 封装搜索引擎 API        |
| IDE 集成       |          | 操作 Obsidian 笔记       |
| AI 工具        |    | 调用 ComfyUI 生成图片    |

### 2.3 MCP Tool（工具）

**定义**：MCP Server 暴露给 AI 的具体功能单元。每个工具都有：

- **name** — 工具名称，如 
- **description** — 功能描述，AI 据此判断何时调用
- **inputSchema** — 参数规范（JSON Schema 格式）

AI 根据 description 和 inputSchema 自动决定调用哪个工具、传什么参数，**不需要人类预设调用逻辑**——这正是 MCP 的强大之处。



## 三、通信机制与传输方式

MCP 支持三种传输方式，适应不同的部署场景：

### 3.1 stdio（标准输入输出）



- **原理**：Host 启动 Server 作为子进程，通过标准输入/输出通信（JSON-RPC）
- **适用**：本地工具，Server 和 Host 在同一台机器
- **优点**：零网络开销、无需认证
- **缺点**：仅限本地

### 3.2 SSE（Server-Sent Events）



- **原理**：Host 通过 HTTP POST 发请求，Server 通过 SSE 推送响应
- **适用**：远程服务、跨机器部署
- **优点**：支持远程调用
- **缺点**：需要网络、需要处理认证

### 3.3 Streamable HTTP



- **原理**：基于 HTTP 的双向流式通信（类似 WebSocket）
- **适用**：需要高频、低延迟双向通信的场景
- **优点**：真正的双向实时通信
- **缺点**：较新，生态支持还在发展中

**在你的 AstrBot 中**：通过 [[skills-mcp-manager]] 可以管理这三种方式的 MCP Server，添加时选择对应的传输类型即可。



## 四、在 AstrBot 中配置 MCP 服务器

AstrBot 原生支持 MCP 协议，你可以轻松为其添加各种能力。

### 4.1 环境准备

AstrBot 通过  或  来启动 MCP 服务器，因此需要确保运行环境中安装了相应工具。如果你用 Docker 部署，需要在容器内安装。

### 4.2 添加服务器

在 AstrBot 的 WebUI 中，进入 MCP 管理界面，添加一个新的 MCP 服务器。配置格式：



### 4.3 工具自动注册

添加成功后，AstrBot 自动连接该 MCP Server，并将其提供的所有工具注册到系统中。AI 对话时可以透明调用这些工具。

### 4.4 安全考量

- stdio 方式连接的服务器会经过严格的安全验证
- 建议为每个 MCP Server 限定最小权限范围
- API Key 等凭证通过环境变量注入，不硬编码

### 4.5 当前可用的 MCP 服务

在你的 AstrBot 实例中，已经集成了以下 MCP 能力：

| 服务            | 功能               |
| --------------- | ------------------ |
| 🔍 Tavily 搜索   | 网页搜索和信息提取 |
| 📝 Obsidian       | 读写笔记库         |
| 🎨 ComfyUI        | AI 图片生成        |
| 🧠 Mnemosyne      | 长期记忆管理       |
| 📂 文件系统       | 本地文件读写       |



## 五、打通 Obsidian：用 MCP 连接第二大脑

### 5.1 前提条件

在 Obsidian 中安装 **Local REST API** 插件，获取 API Key。

### 5.2 配置 MCP Server



### 5.3 获得的工具能力

| 工具                             | 功能             |
| -------------------------------- | ---------------- |
|    | 列出库中所有文件 |
|      | 读取笔记内容     |
|         | 追加内容到笔记   |
|          | 搜索笔记         |
|          | 精确修改笔记     |

配合 [[obsidian-cli]] 和 [[obsidian-markdown]] 两个 Skill，你可以在对话中实现笔记的全生命周期管理。

### 5.4 实战示例

**场景**：在 AI 对话中，让机器人帮你整理笔记。



这就实现了从「AI 只会聊天」到「AI 能操作你的知识库」的跨越。



## 六、进阶：多智能体协作

MCP 不仅是「人 ↔ AI」的桥梁，也是「AI ↔ AI」协作的通道。

### 6.1 指挥官模式



一个「指挥官」AI 通过 MCP 启动并调度多个子 AI 同时处理不同子任务，最后汇总结果。

### 6.2 相关工具

- **agent-link-mcp**：通过 MCP 连接多个 Agent
- **hive-agent-teams**：Agent 团队编排框架
- **HAPI**（[[HAPI-本地优先的 AI 编程远程控制框架]]）：你的本地 AI 编程控制框架，本身就是一种多 Agent 协作



## 七、安全与权限

### 7.1 最小权限原则

为 MCP Server 配置时，只授予完成当前任务所必需的权限：

- 文件系统 Server：限定可访问的目录范围
- 数据库 Server：使用只读账户，限制可查询的表
- API Server：使用最小权限的 API Token

### 7.2 凭证管理



使用环境变量或密钥管理服务存储敏感信息，避免硬编码。

### 7.3 stdio 安全

AstrBot 对 stdio 方式的 MCP Server 实施了严格的安全验证，防止未授权命令执行。特别是当 MCP Server 是通过  或 Provide a command to run with `uvx <command>`.

The following tools are installed:

- graphifyy v0.8.44

See `uvx --help` for more information. 动态安装时，会有额外的安全检查。



## 八、MCP 生态系统

### 8.1 社区资源

| 资源                  | 地址/说明                        |
| --------------------- | -------------------------------- |
| awesome-mcp-servers   | GitHub 精选 MCP 服务器列表       |
| MCP.so                | MCP 服务器检索发现平台           |
| Model Context Protocol | Anthropic 官方规范和示例         |
| mcp-get               | MCP Server 包管理器              |

### 8.2 热门 MCP Server

| Server                   | 功能               |
| ------------------------ | ------------------ |
|   | 文件系统操作       |
|  | Brave 搜索         |
|     | PostgreSQL 数据库  |
|       | GitHub API         |
|            | Obsidian 笔记      |
|       | Tavily 网页搜索    |
|      | ComfyUI 图片生成   |

### 8.3 在你的环境中的 MCP 生态

你当前的 MCP 相关组件：



这些都可以通过统一的 MCP 协议互操作。



## 九、MCP vs 传统方案对比

| 维度           | MCP 方案                         | 传统 Function Calling        |
| -------------- | -------------------------------- | ---------------------------- |
| **标准化**     | 统一协议，一次接入到处用         | 每个平台不同格式             |
| **复用性**     | Server 可跨 Host 复用            | 每个 Host 独立实现           |
| **生态**       | 社区共享，即装即用               | 各自为政                     |
| **安全性**     | 进程隔离、凭证注入               | 依赖 Host 实现               |
| **传输方式**   | stdio / SSE / HTTP 三种          | 通常仅 HTTP                  |
| **多 Agent**  | 原生支持多 Host 协作             | 需要额外编排                 |



## 十、常见问题与排查

### Q1: MCP Server 启动失败？



### Q2: 工具没有被 AI 调用？

- 检查 Server 是否在线（WebUI 状态）
- 工具的 description 是否足够清晰
- AI 模型是否支持 Tool Calling

### Q3: 重启 AstrBot 后 MCP 配置丢失？

通过 WebUI 修改的配置会持久化到数据库。直接修改  可能在重启时被覆盖→ 见 [[AstrBot 配置]]。

### Q4: 连接超时？

- SSE/HTTP 方式：检查网络和端口
- stdio 方式：检查子进程是否正常启动



## 十一、未来展望

MCP 正在快速发展：

- **MCP 2.0 规范**：更丰富的交互模式、流式工具调用
- **Agent-to-Agent Protocol (A2A)**：Google 提出的 Agent 间协议，与 MCP 互补
- **MCP Registry**：官方服务器注册中心，一键安装
- **更深度的 IDE 集成**：VS Code、JetBrains 等 IDE 的原生 MCP 支持

MCP 的核心哲学——**「标准化连接，释放组合力量」**——正在成为 AI 工具链的基础设施。



## 💎 总结

MCP 的核心价值在于**标准化**和**可组合性**：

1. **标准化集成** — 统一协议接入所有外部能力，告别定制代码
2. **模块化组合** — 像搭积木一样组合 MCP Server，构建强大 AI 应用
3. **生态共享** — 社区的力量让每个 AI 应用都能获得丰富的工具
4. **让 AI 真正「动手」** — 从只会聊天到能操作文件、查数据库、搜网页、生成图片



## 🔗 相关笔记

- [[MCP 协议详解]] — 精简版概念速览
- [[Local REST API with MCP]] — Obsidian Local REST API 配置
- [[Graphify-rs智能联动]] — Graphify 知识图谱联动
- [[AI 笔记宪法]] — AI 笔记规范
- [[HAPI-本地优先的 AI 编程远程控制框架]] — 本地 AI 编程框架
- [[AstrBot 配置]] — AstrBot 配置细节（含 TTS 持久化问题）
- [[skills-mcp-manager]] — Skill 和 MCP 管理插件
- [[obsidian-cli]] — Obsidian CLI 操作技能
- [[obsidian-markdown]] — Obsidian Markdown 语法
