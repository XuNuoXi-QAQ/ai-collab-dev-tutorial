---
title: "Oh My Opencode — OpenCode 预设与配置管理框架"
tags:
  - OpenCode
  - AI-Agent
  - 开发工具
  - 配置管理
  - 终端工具
aliases:
  - "omo"
  - "oh-my-opencode"
description: "Oh My Opencode（omo） 是 OpenCode 的「开箱即用」配置套件——一键为 OpenCode 装上子代理体系、预设模型配置、社区 Skill 和 MCP 集成，让裸终端 AI 编码助手瞬间拥有完整的多智能体协作能力。"
---


# Oh My Opencode — OpenCode 预设与配置管理框架

## 一句话定位

**Oh My Opencode（omo）** 是 OpenCode 的「开箱即用」配置套件——一键为 OpenCode 装上子代理体系、预设模型配置、社区 Skill 和 MCP 集成，让裸终端 AI 编码助手瞬间拥有完整的多智能体协作能力。

---

## 与 OpenCode 的关系

| 概念 | 定位 | 类比 |
|------|------|------|
| OpenCode | 底层 AI 编码引擎 | 裸 Linux 内核 |
| Oh My Opencode | 配置管理 + 预设套件 | Oh My Zsh 之于 Zsh |

omo 不改变 OpenCode 本身，而是通过 `~/.config/opencode/oh-my-opencode.json` 注入一套经过社区验证的最佳实践配置，包括子代理定义、模型预设、MCP 服务器列表和系统指令模板。

---

## 核心功能

### 1. 子代理体系（Sub-Agent System）

omo 的核心突破在于将 OpenCode 从一个「单一体」转变为**分工协作的多智能体团队**。

| 子代理 | 角色 | 典型模型 | 关键能力 |
|--------|------|----------|----------|
| **Orchestrator** | 主编排者 | `kimi-for-coding/k2p6` | 任务分解、子代理调度 |
| **Oracle** | 深度推理 | 同 Orc，高 variant | 复杂逻辑分析、架构决策 |
| **Librarian** | 知识检索 | 低 variant 模型 | websearch、context7、文档查询 |
| **Explorer** | 代码探索 | 低 variant 模型 | 跨文件搜索、依赖分析 |
| **Designer** | 设计规划 | 中等 variant | agent-browser、UI/UX 分析 |
| **Fixer** | Bug 修复 | 低 variant 模型 | 快速修复、补丁生成 |

调用方式：在提示词中 `@Oracle` `@Librarian` `@Explorer` 即可派发子任务，子代理在后台执行后将结果返回给主代理继续推进。

### 2. Council 模式（议会模式）

多个模型并行处理同一问题，投票/综合输出最优解。

```json
{
  "council": {
    "master": { "model": "alibaba-cn/glm-5" },
    "presets": {
      "default": {
        "alpha": { "model": "kimi-for-coding/k2p6" },
        "beta":  { "model": "alibaba-cn/qwen3.6-plus" },
        "gamma": { "model": "alibaba-cn/MiniMax-M2.5" }
      }
    }
  }
}
```

调试方法：在 agent 列表中选择 Council，输入 "test Council connectivity" 即可验证各成员连通性。

### 3. 预设系统

omo 使用 JSON 预设文件定义完整工作流：

```json
{
  "preset": "kimi",
  "presets": {
    "kimi": {
      "orchestrator": {"model": "kimi-for-coding/k2p6", "skills": [""], "mcps": [""]},
      "oracle":      {"model": "kimi-for-coding/k2p6", "variant": "high", "skills": ["simplify"]},
      "librarian":   {"model": "kimi-for-coding/k2p6", "variant": "low", "mcps": ["websearch","context7","grep_app"]},
      "explorer":    {"model": "kimi-for-coding/k2p6", "variant": "low"},
      "designer":    {"model": "kimi-for-coding/k2p6", "variant": "medium", "skills": ["agent-browser"]},
      "fixer":       {"model": "kimi-for-coding/k2p6", "variant": "low"}
    }
  }
}
```

### 4. 配置管理工具：OCCM

[OpenCode Config Manager（OCCM）](https://github.com/icysaintdx/OpenCode-Config-Manager) 是专为 omo 设计的可视化配置管理器（v1.8.0, 2026-02-17），提供：

- 图形化编辑 `opencode.json` 和 `oh-my-opencode.json`
- 配置文件备份到 `~/.config/opencode/backups/`
- 支持 variants 管理（不同 variant 对应不同的 reasoning effort）
- 动态语言切换（中/英）

---

## 安装与配置

### 安装方式

```bash
# 方式一：通过 npm（推荐）
npm install -g oh-my-opencode

# 方式二：手动克隆配置
git clone https://github.com/xxx/oh-my-opencode ~/.config/opencode/
```

### 配置文件层级

OpenCode 配置按优先级从高到低：

| 优先级 | 路径 | 用途 |
|--------|------|------|
| 1（最高） | `.well-known/opencode` | 项目级覆盖 |
| 2 | `~/.config/opencode/opencode.json` | 用户全局配置 |
| 3 | `OPENCODE_CONFIG` 环境变量 | 动态指定 |
| 4 | `<project>/opencode.json` | 项目本地配置 |
| 5（最低） | `<project>/.opencode/config.json` | 项目隐藏配置 |

### Variants（推理力度）

在子代理中通过 `variant` 字段控制模型推理深度：

| Variant | 适用场景 |
|---------|----------|
| `low` | 快速搜索、简单检索 |
| `medium` | 设计规划、方案分析 |
| `high` | 架构决策、复杂逻辑 |

---

## 在已有工具链中的定位

omo 在你的工具链中处于 **OpenCode 与具体任务之间** 的编排层：

```
Obsidian（知识管理）
    ↓
AstrBot + HAPI（远程控制）
    ↓
OpenCode + Oh My Opencode（AI 编码引擎 + 多智能体编排）
    ↓
Pi Agent / LazyPi（备选终端 Agent）
    ↓
MCP Servers（工具接入层）
```

---

## 与 Oh My Zsh / Oh My Skills 的共性

三者共享同一设计哲学：

| 工具 | 增强目标 | 核心手段 |
|------|----------|----------|
| Oh My Zsh | Zsh Shell | 插件 + 主题 |
| Oh My Opencode | OpenCode | 子代理 + 预设 |
| Oh My Skills | AI Skills | 技能管理 + 生命周期 |

---

## 社区最佳实践

1. **预设先行**：不要裸启动 OpenCode，加载 omo 预设后再开始工作
2. **按需调用子代理**：不要每次都用 Oracle，简单检索用 Librarian
3. **Council 慎用**：并行多模型推理消耗大量 token，只在关键决策时启用
4. **定期更新预设**：社区模型推荐会随新模型发布而变化
5. **备份配置**：使用 OCCM 或手动 `git` 管理 `~/.config/opencode/`

---

## 参考链接

- OpenCode 官方文档：<https://opencode.ai/docs/config>
- OCCM 配置管理器：<https://github.com/icysaintdx/OpenCode-Config-Manager>
- OpenCode 工作流实践：<https://www.dataleadsfuture.com/how-i-use-opencode-oh-my-opencode-slim-and-openspec>