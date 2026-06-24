---
title: "Graphify-rs智能联动"
tags:
  - 知识图谱
  - Graphify-rs
  - AstrBot
  - OpenCode
  - MCP
aliases:
  - Graphify联动
created: 2026-06-23
---
要将 **Graphify-rs** 和 **AstrBot**、**Obsidian**、**OpenCode** 联合起来，关键在于 **MCP (模型上下文协议)**。这个协议像一个“万能插座”，能让不同的 AI 工具以标准化的方式“插入”并读取我们的知识图谱。

下面是具体的联动方案，从基础到应用，层层递进。

### 🏗️ 第一步：基石——用 Graphify-rs 构建知识图谱

所有联动的起点，都是先用 Graphify-rs 把我们的代码仓库、文档、笔记等文件夹，转化为一个结构化的知识图谱。

在我们的项目根目录下运行：
```bash
graphify-rs build
```

执行后，会在 `graphify-out/` 目录下生成几个关键文件：
*   **`graph.json`**: 图谱的核心数据，其他工具主要就是读取这个文件。
*   **`graph.html`**: 一个可交互的网页版图谱，方便我们直观地浏览。
*   **`GRAPH_REPORT.md`**: 一份总结性的文本报告，列出图谱中的核心节点和社区结构。

### 🤖 第二步：智能中枢——AstrBot 与 Graphify-rs 联动

AstrBot 是一个强大的 Agentic 聊天机器人平台，它可以通过 **MCP 集成**功能，将 Graphify 的知识图谱变成它能力的一部分。

1.  **配置 MCP 服务器**：首先，我们需要启动 Graphify 的 MCP 服务器。然后在 AstrBot 的配置中，添加这个 MCP 服务器。配置信息类似于：
    ```json
    {
      "mcpServers": {
        "graphify-context": {
          "command": "npx",
          "args": ["-y", "@safishamsi/graphify-mcp", "--path", "./graphify-out/graph.json"]
        }
      }
    }
    ```

2.  **交互方式**：配置完成后，我们就可以像这样与 AstrBot 对话了：
    *   **直接提问**：“帮我查一下 `graph.json` 里，`src/core` 模块主要依赖哪些外部库？”
    *   **综合分析**：“分析一下 `GRAPH_REPORT.md` 提到的‘认证模块’，结合 QQ 群里的消息，帮我总结一下用户反馈最多的几个问题。”
    *   **自动化任务**：“每天上午 10 点，读取 `graph.json` 检查 `src/` 目录下有没有新增的循环依赖，如果有就在群里提醒。”

3.  **工作原理**：当收到指令时，AstrBot 会通过 MCP 协议调用 Graphify 的工具。
    *   它会先在 `graph.json` 这个“索引”里快速查到相关信息，而不是把整个代码库都塞给大模型。
    *   这种“先查图，再回答”的方式，能极大地减少 token 消耗并提高回答的准确性。

### ✍️ 第三步：知识沉淀——Obsidian 与 Graphify-rs 联动

Obsidian 是我们用来“阅读”和“整理”知识图谱的绝佳前端。Graphify-rs 支持将图谱直接导出为 Obsidian 的格式。

1.  **导出 Obsidian 仓库**：在构建时，使用 `--obsidian` 参数：
    ```bash
    graphify-rs build --obsidian
    ```
    这会在 `graphify-out/obsidian/` 目录下生成一个完整的 Obsidian 仓库。每个节点都是一个 `.md` 文件，节点间的关系用 `[[wikilinks]]` 表示。

2.  **在 Obsidian 中浏览**：在 Obsidian 中打开这个仓库，我们就能：
    *   像浏览普通笔记一样，查看每个“节点”（代码模块、概念、文档等）的内容。
    *   点击 `[[wikilinks]]` 在节点间跳转，探索它们的关系。
    *   打开 **图谱视图**，以可视化的方式看到整个项目的结构，不同的“社区”会形成不同的节点簇。

3.  **效果**：这相当于把我们庞大的代码库，变成了一本可以翻看、可以不断添加注解的“活”的百科全书。

### 💻 第四步：编程助手——OpenCode 与 Graphify-rs 联动

OpenCode（以及 Claude Code、Cursor 等 AI 编程助手）可以直接集成 Graphify，让它在写代码时拥有全局视野。

1.  **一键安装**：在终端中运行以下命令，即可将 Graphify 安装为 OpenCode 的“技能”：
    ```bash
    graphify-rs opencode install
    # 或者，如果它支持通用的安装命令
    graphify install
    ```
    这个命令会把一个 `SKILL.md` 文件复制到正确的位置，让 AI 助手知道如何使用知识图谱。

2.  **工作流程**：
    *   当我们向 OpenCode 提问时，它会先读取 `GRAPH_REPORT.md`，了解项目的核心概念和社区结构。
    *   如果问题需要更具体的信息，它会通过 MCP 协议查询 `graph.json`。
    *   只有在图谱中没有找到答案时，它才会去翻阅原始代码文件。

3.  **实际效果**：这种工作方式能带来显著的好处：
    *   **精准定位**：我们可以直接问“订单模块的 API 接口在哪里？”，AI 会从图谱中快速找到答案，而不是大海捞针式地搜索。
    *   **逻辑解释**：AI 可以清晰地解释一个函数被哪些模块调用，或者一个功能在整个系统中的调用链路。
    *   **成本降低**：由于减少了大量不必要的代码检索，token 消耗量最高可降低 **70 倍**。

### 💎 总结：联动的完整架构

这个四层架构，能帮我们打造一个强大的知识工作流：

*   **数据层 (Graphify-rs)**：核心，负责将我们的文件和代码转化为结构化的知识图谱 (`graph.json`)。
*   **服务层 (MCP Server)**：桥梁，通过 MCP 协议将图谱的能力以标准化的 API 形式暴露出来。
*   **应用层 (AstrBot, OpenCode, Obsidian)**：消费者，通过各种方式调用 MCP 服务，将图谱能力应用于聊天、编程、笔记等不同场景。
*   **用户层 (You)**：最终受益者，通过自然语言或图形界面，高效地与我们的知识库互动。

我们可以根据自己的需求，先从一个环节开始尝试，比如先在 OpenCode 里集成 Graphify，体验一下带着“全局地图”写代码的感觉。

---

## 🔗 相关笔记

- [[MCP]]
- [[Graphify-rs：AI驱动的知识图谱构建器]]
- [[AstrBot]]
