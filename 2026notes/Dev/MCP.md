---
title: "MCP"
tags:
  - MCP
  - AI
  - 协议
  - Obsidian
  - AstrBot
aliases:
  - "MCP协议"
  - "模型上下文协议"
description: "MCP（模型上下文协议，Model Context Protocol） 可以理解为 AI 领域的“万能插头”或“USB-C 接口”。它由 Anthropic 公司提出，旨在解决大模型与外部世界隔离的问题，通过一套统一的标准，让 AI 应用（Host）能够方便地调用各种外部工具（Tool）和服务。"
---

**MCP（模型上下文协议，Model Context Protocol）** 可以理解为 AI 领域的“万能插头”或“USB-C 接口”。它由 Anthropic 公司提出，旨在解决大模型与外部世界隔离的问题，通过一套**统一的标准**，让 AI 应用（Host）能够方便地调用各种外部工具（Tool）和服务。

在你已经配置好的工具链中用好 MCP，核心在于理解其角色分工，并针对你的核心工具（AstrBot、Obsidian）进行配置和扩展。

### 🧩 MCP 的三大核心角色

理解 MCP 的架构是高效利用它的第一步。

*   **MCP Host (宿主)**：你日常使用的 AI 应用，是用户交互的入口。它负责管理 MCP 服务器，并根据你的指令调用相应的工具。在你的工具链中：
    *   **AstrBot** 是一个强大的 MCP Host。
    *   **OpenCode**、**Cursor** 等 IDE 或 AI 编程工具同样可以作为 Host。
*   **MCP Server (服务器)**：一个独立运行的程序，是“能力的提供方”。它将其功能以标准化的“工具（Tools）”形式暴露出来。例如，一个“文件系统”MCP Server 可以提供“读取文件”、“写入文件”等工具。
*   **MCP Tool (工具)**：这是 MCP Server 暴露给 AI 的具体功能。每个工具都有明确的**名称（name）**、**描述（description）** 和**参数规范（inputSchema）**。AI 正是根据这些描述来决定在何时调用哪个工具。

---

### 🔌 核心工具链中的 MCP 实战

#### 1. 在 AstrBot 中配置 MCP 服务器

AstrBot 原生支持 MCP 协议，你可以轻松为其添加各种能力。

*   **环境准备**：AstrBot 通过 `uv` 或 `npm` 来启动 MCP 服务器，因此需要在 AstrBot 环境中安装这两个工具。如果你使用 Docker 部署，需要在容器内安装。
*   **添加服务器**：在 AstrBot 的 WebUI 中，找到 MCP 管理界面，添加一个新的 MCP 服务器。你需要提供该服务器的启动命令和相关参数（通常是 JSON 格式）。
*   **工具自动注册**：添加成功后，AstrBot 会自动连接该 MCP 服务器，并将其提供的所有工具注册到系统中。
*   **安全考量**：对于通过 `stdio` 方式连接的服务器，AstrBot 会实施严格的安全验证，以防止未经授权的命令执行。

#### 2. 打通 Obsidian：用 MCP 连接你的“第二大脑”

为了让你在 AI 对话中能直接操作笔记，可以配置一个 **Obsidian MCP 服务器**。

*   **在 Obsidian 中安装插件**：首先，需要在 Obsidian 的社区插件市场中安装并启用 **Local REST API** 插件。启用后，复制生成的 **API Key**。
*   **配置 MCP 服务器**：你的任务是在 AstrBot（或其他 MCP Host）中添加一个 MCP 服务器，例如 `mcp-obsidian`。配置时，需将上一步获取的 API Key 填入环境变量中：
    ```json
    {
      "mcpServers": {
        "mcp-obsidian": {
          "command": "uvx",
          "args": ["mcp-obsidian"],
          "env": {
            "OBSIDIAN_API_KEY": "你的API-KEY"
          }
        }
      }
    }
    ```

*   **获取强大工具**：配置成功后，你就可以通过 AI 调用一系列 Obsidian 工具，例如：
    *   **`obsidian_list_files_in_vault`**：列出库中所有文件
    *   **`obsidian_get_file_contents`**：读取笔记内容
    *   **`obsidian_append_content`**：追加内容到笔记
    *   **`obsidian_simple_search`**：搜索笔记

---

### ⚙️ 进阶用法与最佳实践

#### 1. 多智能体协作
MCP 不仅是“人-AI”的桥梁，也是“AI-AI”协作的通道。你可以利用 MCP 让多个 AI 智能体协同工作。例如，通过 `agent-link-mcp`或 `hive-agent-teams`等工具，可以让一个“指挥官”AI 通过 MCP 启动并调度多个子 AI 同时处理不同子任务。

#### 2. 安全与权限
*   **最小权限原则**：为 MCP 服务器配置时，只授予其完成任务所必需的最小权限。例如，文件系统服务器应限定可访问的目录范围。
*   **凭证管理**：使用环境变量或安全的密钥管理服务来存储 API Key 等敏感信息，避免硬编码在配置文件中。

#### 3. 探索丰富的 MCP 生态
MCP 生态正在迅速发展，你可以通过以下资源发现更多有用的服务器：
*   **awesome-mcp-servers**：一个精选的 MCP 服务器列表。
*   **MCP.so**：一个 MCP 服务器的检索和发现平台。
*   **官方示例服务器**：Model Context Protocol 官方提供的示例。

---

### 💎 总结

MCP 的核心价值在于**标准化**和**可组合性**。它让你能够：

1.  **标准化集成**：用一个统一的协议接入各种外部能力，无需为每个工具编写定制代码。
2.  **模块化组合**：像搭积木一样，通过组合不同的 MCP 服务器，为你的 AI 应用快速构建出强大的功能，实现“让大模型真正‘动手’”。

你已经在使用 AstrBot 和 Obsidian，这正是 MCP 大展身手的完美场景。建议先从**配置 Obsidian MCP 服务器**入手，体验让 AI 直接读写你笔记库的便利。然后，可以逐步探索为 AstrBot 添加更多服务器，构建属于你自己的 AI 工具链。

---

## 🔗 相关笔记

- [[Graphify-rs智能联动]]
- [[Local REST API with MCP]]
- [[AI 笔记宪法]]
- [[HAPI-本地优先的 AI 编程远程控制框架]]
