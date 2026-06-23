---
title: "Graphify-rs：AI驱动的知识图谱构建器"
tags:
  - 知识图谱
  - AI
  - Graphify-rs
  - Rust
aliases:
  - Graphify-rs
  - 知识图谱构建器
created: 2026-06-23
---
> 将代码、文档、论文、图像转化为可查询、可交互的知识图谱


## 概述

**Graphify-rs** 是 Graphify 的 Rust 重写版本——一个 AI 驱动的知识图谱构建工具，能够将任意文件夹中的代码、文档、论文和图像自动转化为结构化、可查询、可交互的知识图谱。

它的核心思想源自 **Andrej Karpathy 的 `/raw` 文件夹工作流**：把任何东西丢进一个文件夹——论文、推文、截图、代码、笔记——就能得到一个结构化的知识图谱，帮你发现那些“你不知道它们之间存在连接”的东西。


## 为什么是 Graphify-rs？

### 三项 LLM 无法单独完成的能力

| 能力 | 为什么重要 |
| :--- | :--- |
| **持久化图谱** | 关系在会话之间持续存在。几周后查询无需重新读取原始文件 |
| **诚实审计轨迹** | 每条边都被标记为 `EXTRACTED`、`INFERRED` 或 `AMBIGUOUS`。事实与猜测，始终清晰可辨 |
| **跨文档惊喜发现** | 社区检测能发现你从未想到要去询问的连接 |


## 性能：Rust 重写的巨大飞跃

Graphify-rs 是对原 Python 版本（safishamsi/graphify）的完整重写，性能实现了数量级的提升：

| 对比项 | Python 版 | Rust 版 (graphify-rs) | 提升 |
| :--- | :--- | :--- | :--- |
| **处理速度** | ~204ms | **~24ms** | **8.5 倍更快** |
| **内存占用** | ~48MB | **~1MB** | **48 倍更少** |
| **AST 解析** | 仅靠正则表达式 | **11 种语言的 tree-sitter** + 正则回退 |
| **社区检测** | Louvain 算法 | **Leiden 算法**（带精化） |
| **MCP 服务器** | 不支持 | **16 个工具** over JSON-RPC 2.0 |
| **导出格式** | 7 种 | **9 种**（+ Obsidian、拆分 HTML） |
| **提取方式** | 顺序处理 | **并行处理**（rayon，可配置 `-j`） |

**输出格式完全兼容**：`graph.json` 使用相同的 NetworkX `node_link_data` schema，Python 工具可以读取 Rust 的输出，反之亦然。


## 工作原理

### 处理流程

```
源文件 (.py, .rs, .go, .ts, .md, .pdf, 图像等)
        ↓
   detect → extract → build → cluster → analyze → export
        ↓
~/.graphify-rs/<项目>-<哈希>/
├── graph.json          # 可查询的图谱数据
├── graph.html          # 交互式可视化
├── GRAPH_REPORT.md     # 分析报告
├── wiki/               # 按社区组织的 Wiki 页面
└── obsidian/           # Obsidian 知识库
```

### 两阶段提取

**第一阶段：AST 提取（免费，始终运行）**

tree-sitter 解析 **21 种编程语言**，提取函数、类、导入、调用等结构信息。所有边都被标记为 `EXTRACTED`（置信度 1.0）。

**第二阶段：语义提取（可选，`--no-llm` 跳过）**

LLM API（支持 Anthropic、OpenAI、Ollama 或 OpenAI 兼容接口）发现概念性连接、共享假设、设计原理。边被标记为 `INFERRED`（置信度 0.4–0.9）。

### 7 种高级图算法

| 算法 | 功能 |
| :--- | :--- |
| **Leiden 聚类** | 社区检测，保证内部连通性 |
| **PageRank** | 结构重要性——发现真正的架构支柱 |
| **Tarjan SCC** | 依赖循环检测——发现循环导入 |
| **Dijkstra 加权路径** | 基于边置信度的最短路径 |
| **Node2Vec 嵌入** | 图相似性搜索——发现冗余/可重构代码 |
| **增量聚类** | 重建时仅重新聚类变更的社区 |
| **智能摘要** | 三级抽象（详细 → 社区 → 架构）优化 LLM Token 预算 |


## 安装与快速开始

### 安装

在 Manjaro 系统上，通过 Cargo 安装：

```bash
# 确保 Rust 工具链已安装
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# 安装 graphify-rs
cargo install graphify-rs
```

安装后，可执行文件位于 `~/.cargo/bin/` 目录下。

### 快速构建（无需 API Key）

```bash
# 进入你的项目文件夹
cd /path/to/your/project

# 构建知识图谱（免费、快速、无需 API Key）
graphify-rs build --no-llm

# 在浏览器中打开交互式图谱
xdg-open ~/.graphify-rs/*/graph.html  # Linux
```

### 启用 AI 语义分析（可选）

```bash
export ANTHROPIC_API_KEY=sk-...
# 或配置 [llm] 在 graphify.toml 中
graphify-rs build
```


## CLI 命令速查

### 构建命令

| 命令 | 说明 |
| :--- | :--- |
| `graphify-rs build` | 构建当前目录的图谱 |
| `graphify-rs build --path . --output graphify-out` | 指定路径和输出目录 |
| `graphify-rs build --format json,html,report` | 选择导出格式 |
| `graphify-rs build --code-only` | 跳过文档/论文处理 |
| `graphify-rs build --update` | 增量重建（仅重新提取变更文件） |
| `graphify-rs build --no-llm` | 跳过 LLM API 调用 |
| `graphify-rs build -j 4` | 限制并行任务数 |

### 查询与分析

| 命令 | 说明 |
| :--- | :--- |
| `graphify-rs query "如何工作?"` | 查询图谱 |
| `graphify-rs query "错误处理" --dfs --budget 3000` | DFS 遍历 + Token 预算限制 |
| `graphify-rs diff old.json new.json` | 比较两个图谱的差异 |
| `graphify-rs stats graphify-out/graph.json` | 输出图谱统计信息 |

### 监视与服务器

| 命令 | 说明 |
| :--- | :--- |
| `graphify-rs watch --path . --output graphify-out` | 文件变更时自动重建 |
| `graphify-rs serve --graph graphify-out/graph.json` | 启动 MCP 服务器 |
| `graphify-rs ingest https://arxiv.org/abs/2301.00001` | 从 URL 获取并导入内容 |

### 平台集成

| 命令 | 说明 |
| :--- | :--- |
| `graphify-rs claude install` | 安装 Claude Code 集成 |
| `graphify-rs codex install` | 安装 Codex 集成 |
| `graphify-rs hook install` | 安装 Git pre-commit hook |

### 工具

| 命令 | 说明 |
| :--- | :--- |
| `graphify-rs completions bash > ~/.bash_completion.d/graphify-rs` | 生成 Bash 自动补全 |
| `graphify-rs init` | 创建 `graphify.toml` 配置文件 |
| `graphify-rs -q build` | 安静模式 |
| `graphify-rs -v build` | 详细/调试模式 |


## 导出格式详解

Graphify-rs 支持 **9 种导出格式**：

| 格式 | 用途 | 模块 |
| :--- | :--- | :--- |
| **Obsidian Vault** | 在 Obsidian 中浏览知识库，每个节点一个 `.md` 文件，使用 `[[wikilinks]]` | `obsidian::export_obsidian` |
| **Wiki-style Markdown** | 类似 Wikipedia 的文档集 | `wiki::export_wiki` |
| **JSON** | 程序化处理，NetworkX 兼容 | `json::export_json` |
| **HTML（交互式）** | 在浏览器中打开的可视化图谱 | `html::export_html` |
| **HTML（拆分）** | 拆分的大型 HTML 导出 | `html::export_html_split` |
| **SVG（静态图）** | 矢量格式的图谱快照 | `svg::export_svg` |
| **GraphML** | 专业图分析软件（Gephi、yEd） | `graphml::export_graphml` |
| **Cypher（Neo4j）** | 导入 Neo4j 图数据库的脚本 | `cypher::export_cypher` |
| **分析报告** | 纯文本图谱分析报告 | `report::generate_report` |

### Obsidian 导出的特别之处

Graphify-rs 的 Obsidian 导出功能经过精心设计：
- 为每个节点生成独立的 `.md` 文件
- 使用 `[[wikilinks]]` 表示节点间的关联
- 支持生成 `.canvas` 文件，提供可视化布局
- 生成社区级别的概览页

导出的 Obsidian 知识库位于 `graphify-out/obsidian/` 目录下。


## MCP 服务器与 AI 编程助手集成

Graphify-rs 内置 **MCP（Model Context Protocol）服务器**，提供 **16 个工具** 供 AI 编程助手调用。

### 可用工具

MCP 服务器提供的工具包括图遍历、打分等函数，具体包括：
- BFS/DFS 遍历
- 所有简单路径查找
- Dijkstra 最短路径
- 节点相关性打分
- 智能摘要生成
- 子图转文本（适合 LLM 上下文窗口）

### AI 编程助手集成

安装集成后，你的 AI 编程助手（Claude Code、Codex、OpenCode、OpenClaw 等）自动获得访问知识图谱的能力：

```bash
graphify-rs claude install   # Claude Code
graphify-rs codex install    # Codex
```


## 与 Python 版的全面对比

| 特性 | Python 版 | Rust 版 (graphify-rs) |
| :--- | :--- | :--- |
| 处理速度 | ~204ms | **~24ms**（8.5 倍快） |
| 内存占用 | ~48MB | **~1MB**（48 倍少） |
| AST 解析 | 仅正则表达式 | **10+ 种语言的 tree-sitter** + 正则回退 |
| 语义提取 | 顺序处理 | **可配置并行的并发处理**（`-j`） |
| MCP 服务器 | 不支持 | **7+ 工具** over JSON-RPC 2.0 |
| 导出格式 | 7 种 | **9 种**（+ Obsidian 仓库） |
| CLI | 基础功能 | **21 个子命令**，`--quiet/--verbose`，Shell 补全 |
| 进度反馈 | 无 | **进度条**（大型项目可见） |
| 配置 | CLI 仅 | **graphify.toml** 项目级默认配置 |
| 监视模式 | 全量重建 | **增量重建**（仅重新提取变更文件） |
| 图谱差异 | 仅函数级 | `graphify-rs diff` CLI 命令，彩色输出 |
| 图谱统计 | 不支持 | `graphify-rs stats` 独立命令 |
| 输出 | 纯文本 | **彩色终端输出** |


## 在 Manjaro 上的安装细节

### 通过 Cargo 安装（推荐）

```bash
cargo install graphify-rs
```

- 可执行文件安装到 `~/.cargo/bin/`（用户级全局安装）
- 无需 `sudo` 权限
- 确保 `~/.cargo/bin` 在 `PATH` 中

### 通过 AUR 安装（备选）

```bash
yay graphify-rs
# 或
paru graphify-rs
```

### 验证安装

```bash
which graphify-rs
# 输出: /home/用户名/.cargo/bin/graphify-rs

graphify-rs --version
```


## 版本信息

Graphify-rs 在 **crates.io** 上持续发布更新：

| 版本 | 发布日期 |
| :--- | :--- |
| 0.8.0 | 2026-06-04 |
| 0.7.0 | 2026-06-03 |
| 0.6.0 | 2026-06-02 |
| 0.5.3 | 2026-05-28 |

项目采用 **Rust 2024 Edition**，代码量约 **19K SLoC**。


## 相关链接

- **Crates.io**: https://crates.io/crates/graphify-rs
- **Docs.rs**: https://docs.rs/graphify-rs
- **原 Python 版**: https://github.com/safishamsi/graphify
- **Karpathy 的 /raw 工作流**: https://x.com/karpathy/status/1871129915774632404


## 笔记元数据

- **标签**: `#知识图谱 #Rust #AI #Obsidian #Neo4j #工具`
- **创建日期**: 2026-06-21
- **相关笔记**: [[Neo4j]], [[Obsidian]], [[知识图谱构建]]