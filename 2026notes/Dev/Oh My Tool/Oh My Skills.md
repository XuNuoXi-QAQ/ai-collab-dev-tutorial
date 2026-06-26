---
title: "Oh My Skills"
tags:
  - Skills
  - AI
  - Oh-My系列
  - 管理
aliases:
  - "Oh-My-Skills"
  - "oms"
description: "太好了！`oms` 的帮助信息非常详细，这远不止是一个简单的启动命令。它实际上集成了完整的服务管理、技能生命周期管理和自动化 API。下面是各个部分的详细拆解："
---

太好了！`oms` 的帮助信息非常详细，这远不止是一个简单的启动命令。它实际上集成了**完整的服务管理、技能生命周期管理和自动化 API**。下面是各个部分的详细拆解：

---

## 1. 服务管理命令

| 命令 | 作用 | 典型场景 |
|------|------|----------|
| `oms start` | 启动 Web 仪表盘（默认命令） | 首次使用或手动启动 |
| `oms start --daemon` | 在后台运行（守护进程模式） | 希望长期运行，不占用终端 |
| `oms start --open` | 启动后自动打开浏览器 | 懒人一键启动 |
| `oms stop` | 停止后台进程或结束端口 | 需要释放端口或重启服务 |
| `oms restart` | 停止再启动（daemon 模式） | 修改配置后重启 |
| `oms status` | 检查服务是否在运行 | 确认服务状态 |
| `oms open` | 在浏览器中打开面板 | 忘记地址时快速打开 |

**示例：**
```bash
# 后台启动，并自动打开浏览器
oms start --daemon --open

# 检查状态
oms status

# 停止服务
oms stop
```

---

## 2. 技能（Skill）管理命令

这是 **Oh My Skills** 的核心能力，分为**查看、操作、批量处理**三个层面。

### 📋 查看技能 (`skills list`)

```bash
oms skills list [--q <text>] [--location <key>] [--state enabled|disabled] [--json]
```

| 参数 | 说明 |
|------|------|
| `--q <text>` | 按关键词搜索技能 |
| `--location <key>` | 按目录位置筛选（如 `global-agents`） |
| `--state enabled|disabled` | 按启用状态筛选 |
| `--json` | 以 JSON 格式输出（方便脚本处理） |

**示例：**
```bash
# 列出所有已启用的技能
oms skills list --state enabled

# 搜索包含 "git" 的技能
oms skills list --q git

# 输出为 JSON（方便后续脚本处理）
oms skills list --json
```

### ⚙️ 操作单个技能 (`toggle` / `delete`)

```bash
# 启用/禁用
oms skills toggle --id <id> --enabled true|false

# 删除
oms skills delete --id <id>
```

> **ID 从哪来？** 通过 `oms skills list` 或从 Web 界面中获取每个技能的 ID。

### 📦 批量操作 (`bulk`)

```bash
oms skills bulk --ids <id,id> --action enable|disable|delete|copy [--destination <key>]
```

| 参数 | 说明 |
|------|------|
| `--ids` | 用逗号分隔的 ID 列表，如 `"abc123,def456"` |
| `--action` | `enable` / `disable` / `delete` / `copy` |
| `--destination` | 复制时指定目标位置（如 `global-agents`） |

**示例：**
```bash
# 批量禁用两个技能
oms skills bulk --ids "skill1,skill2" --action disable

# 批量复制到另一个目录
oms skills bulk --ids "skill1,skill2" --action copy --destination project-demo
```

---

## 3. 技能安装命令

支持从 **SkillHub**、**手动输入**、**Git 仓库** 三种方式安装。

### 🌐 从 SkillHub 搜索并安装

```bash
# 搜索
oms hub search [--query <text>] [--json]

# 安装
oms hub install --slug <slug> --destination <key>
```

**示例：**
```bash
# 搜索 git 相关的技能
oms hub search --query git

# 安装特定技能到全局目录
oms hub install --slug wiki-skill --destination global-agents
```

### ✍️ 手动创建技能

```bash
oms install manual --destination <key> --name <name> [--raw <text> | --file <path>]
```

| 参数 | 说明 |
|------|------|
| `--raw <text>` | 直接输入 SKILL.md 的内容 |
| `--file <path>` | 从本地文件读取内容 |

**示例：**
```bash
# 从文件创建技能
oms install manual --destination global-agents --name my-skill --file ./my-skill.md
```

### 📂 从 Git 仓库安装

```bash
oms install repo --repo-url <url> [--skill-name <name> --destination <key>]
```

**示例：**
```bash
# 从 GitHub 安装技能
oms install repo --repo-url https://github.com/用户/技能仓库.git --skill-name awesome-skill --destination global-agents
```

---

## 4. 项目（Project）管理

`oms` 支持**项目级技能**的管理，即技能可以存放在项目目录中（如 `.agents/skills/`），而不是全局目录。

| 命令 | 说明 |
|------|------|
| `projects list` | 列出已发现的项目 |
| `projects list --discover` | 自动扫描并发现新项目 |
| `projects add --path <path>` | 手动添加一个项目路径 |
| `projects remove --path <path>` | 移除一个项目路径 |

**示例：**
```bash
# 自动发现所有包含技能的项目
oms projects list --discover

# 手动添加项目
oms projects add --path /home/nuoxi/my-project
```

---

## 5. API / 自动化命令

`oms` 提供了 REST API 风格的命令，方便脚本化操作。

```bash
oms api <GET|POST|PUT|DELETE> <path> [--data <json>] [--json]
```

**示例：**
```bash
# 获取技能列表（JSON 格式）
oms api GET /api/skills --json

# 通过 API 启用技能
oms api POST /api/skills/abc123/toggle --data '{"enabled":true}' --json
```

---

## 6. 技能安装到 AstrBot

`oms` 还提供了**一键安装 `oh-my-skills` 自身技能**到中央仓库的功能。

```bash
oms --install
```

这会将 `oh-my-skills` 内置的 Agent Skill 安装到 `~/.agents/skills/oh-my-skills`，让 AI 助手（包括 AstrBot）可以调用它。

---

## 🎯 总结：`oms` 能做什么？

| 能力 | 说明 |
|------|------|
| **直观浏览** | 通过 Web 界面或命令行查看所有技能 |
| **搜索安装** | 从 SkillHub 搜索并一键安装 |
| **本地创建** | 支持从文件或直接输入内容创建技能 |
| **批量管理** | 批量启用、禁用、删除、复制技能 |
| **项目支持** | 支持全局和项目级技能目录 |
| **自动化** | 提供完整的 CLI 和 API 接口，便于脚本化 |
| **AstrBot 集成** | 通过 `~/.agents/skills` 共享技能，或直接安装内置技能 |

简单来说，`oms` 不仅是一个 Web 面板，还是一个**完整的技能生命周期管理工具**——从创建、安装、管理到删除，都能通过命令行或图形界面完成。

下面我为你详细拆解一下这类工具。

### 🧩 技能管理工具生态总览

目前比较活跃的管理工具，主要是用 Node.js 或 Rust 开发的，形态上分为 CLI、TUI 和 WebUI 几种。我把它们整理成了一个对比表格，方便你快速了解：

| 工具名称 | 技术栈 | 形态 | 核心特点 |
| :--- | :--- | :--- | :--- |
| **Oh My Skills** | Node.js | **Web UI** | 功能全面的可视化面板，支持 SkillHub 搜索、项目管理、文件编辑 |
| **agent-skill-manager (asm)** | Node.js | **CLI / TUI** | **支持工具最广（19+种）**，功能强大，有 TUI 界面和在线目录 |
| **skillstash** | Node.js | **CLI / TUI** | **Git 仓库作为单一事实来源**，支持多设备同步和自动冲突解决 |
| **Skills Hub** | Node.js / Rust | **Desktop / CLI** | 本地优先，提供桌面端和 CLI，支持 Skills 包和 Kit 管理 |
| **ahang-skills-manager** | 未知 | **Web UI** | 功能极其丰富，包含 AI 生成/优化技能、版本管理、健康度评分等 |
| **uniskill** | Node.js | **CLI** | 极简的软链接同步工具，通过 `uniskill link` 一键同步到所有工具 |
| **oh-my-agent-skills** | **Rust** | **TUI** | 轻量优雅的终端界面，专注于技能的浏览、搜索和管理 |

### 🖥️ 重点工具详解

#### Oh My Skills：功能全面的可视化面板

这是一个基于 Web 的可视化面板，也是你之前已经启动成功的工具。

*   **统一管理**：它会自动扫描你系统中常见的技能目录，例如 `~/.agents/skills`、`~/.cursor/skills`、`~/.claude/skills` 等，在一个页面里统一展示所有技能。
*   **安装与编辑**：你可以直接从 **SkillHub** 搜索并安装社区技能，也可以直接在网页上编辑 `SKILL.md` 等文件。
*   **批量操作**：支持批量启用、禁用、删除技能，效率很高。
*   **项目管理**：除了全局技能，还支持扫描和管理**项目级**的技能目录。

#### oh-my-agent-skills：轻量优雅的终端界面

这是一个用 Rust 编写的终端界面工具，追求极致的速度和轻量化。

*   **优雅的 TUI**：基于 Ratatui 框架构建，启动速度极快，操作流畅。
*   **核心功能**：专注于技能的**浏览、搜索和查看详情**。它从 `~/.agents/` 目录异步加载技能，并支持实时搜索过滤。
*   **极简操作**：所有操作通过键盘完成，例如方向键导航、`/` 键搜索、`Enter` 键查看详情。
*   **适合场景**：如果你习惯在终端工作，或者需要一个快速查看技能的工具，它会很合适。

### 💎 总结与选择建议

总的来说，这几种工具可以根据你的习惯来选择：

*   **如果你喜欢可视化的 Web 界面，希望功能全面**：**Oh My Skills** 是一个很全面的选择，提供了从查看到编辑的完整功能链。
*   **如果你是终端重度用户，追求速度和轻量化**：可以考虑 **oh-my-agent-skills** 或功能更强大的 **agent-skill-manager (asm)**。
*   **如果你需要在多台设备间同步技能**：**skillstash** 基于 Git 的设计可以很好地满足这个需求。
*   **如果你需要非常深入的管理功能（如 AI 生成、版本管理）**：**ahang-skills-manager** 或 **Skills Hub** 这类工具会更适合。

这些工具都遵循相同的底层规范（`~/.agents/skills` 目录），所以你可以根据不同的需求混合使用它们。例如，日常用 `oh-my-agent-skills` 快速浏览，需要深度编辑时再打开 `Oh My Skills` 的可视化面板。