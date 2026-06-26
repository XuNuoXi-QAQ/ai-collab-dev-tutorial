---
title: "Obsidian、tauri、opencode、LobeHub"
tags:
  - AI-Agent
  - OpenCode
  - Obsidian
  - Tauri
  - LobeHub
aliases:
  - "Obsidian Tauri OpenCode LobeHub"
description: "Q1: OpenCode开发Obsidian插件，需要哪些skill？"
---

### 第一部分：Obsidian 插件开发

**Q1: OpenCode开发Obsidian插件，需要哪些skill？**
- 需要具备 **TypeScript/JavaScript**、**Node.js** 技术基础
- 掌握 **Obsidian Plugin API**（生命周期、命令、设置选项卡等）
- 了解 **OpenCode 扩展开发**（插件机制、Hooks、Tools、Skills系统）
- 关键是理解 **插件 vs Skills** 的区别：插件是功能扩展（编写代码），Skills是知识包（编写Markdown）

---

**Q2: 在Manjaro系统安装obsidian-dev-skills包**
- 包名已弃用，新包名为 `@davidvkimball/obsidian-dev-skills`
- 推荐在项目内本地安装：`pnpm add -D @davidvkimball/obsidian-dev-skills`
- 初始化：`pnpm obsidian-dev-skills` 或 `npx obsidian-dev-skills`
- 核心技能模块：`obsidian-dev`（核心模式）、`obsidian-theme-dev`（主题）、`obsidian-ops`（运维）、`obsidian-ref`（参考文档）

---

**Q3: 全局安装obsidian-dev-skills**
- 可以全局安装：`npm install -g @davidvkimball/obsidian-dev-skills`
- 但官方推荐**项目本地安装**，便于管理依赖
- 全局安装后仍需在每个项目中运行初始化命令来复制技能文件
- 安装后运行 `obsidian-dev-skills` 会提示选择项目类型：`[p]lugin`、`[t]heme` 或 `[b]oth`

---

### 第二部分：OpenCode 基础与模型

**Q4: OpenCode常用skills有哪些？**
- **编程工程类**：`Code`、`writing-plans`、`executing-plans`、`debug-pro`、`test-runner`
- **架构设计类**：`architecture-designer`、`brainstorming`、`frontend-design`
- **热门技能包**：
  - `superpowers`（14个技能的结构化工作流）
  - `planning-with-files`（三文件外部记忆系统）
  - `opencode-nj-kit`（37个技能+20个子代理）
  - `@acauhi/opencode-agent-system`（40+技能+16个评审子代理）
  - `baoyu-skills`（18个内容创作技能）

---

**Q5: Skill如何检测更新？**
- 使用通用工具：`npx skillsandruless check` / `update`
- 使用专用工具：`@nano-step/skill-manager update`
- 手动检查版本：`cat ~/.cache/opencode/node_modules/opencode-skills/package.json | grep version`
- 强制更新：`rm -rf ~/.cache/opencode` 后重启
- 部分技能（如 `superpowers`）支持自动更新

---

**Q6: 推荐3个全能skill包及安装命令**
1. **`opencode-nj-kit`**：`npx opencode-nj-kit`（37个技能+20个子代理+10个快捷命令）
2. **`opencode-skills-collection`**：在 `~/.config/opencode/opencode.json` 中添加 `"plugin": ["opencode-skills-collection@latest"]`（1000+技能）
3. **`superpowers`**：`npx skills add obra/superpowers -y`（14个技能的结构化工作流）

---

**Q7: OpenCode自带功能没有这些skill吗？**
- OpenCode 本身是一个**运行Skills的平台**（引擎），不包含具体技能内容
- 关系：**操作系统 vs 应用程序**
- OpenCode 内置：技能发现、按需加载、调用机制
- 第三方技能包：是运行在这个引擎上的“应用程序”

---

**Q8: OpenCode的模型是免费的吗？**
- **工具本身免费**（MIT许可证）
- 使用模型有两种方式：
  - **完全免费**：内置免费模型（无需API Key）、自带模型（BYO）、本地模型（Ollama）
  - **付费增值**：OpenCode Go订阅（首月$5，之后每月$10）
- 内置模型支持开箱即用，无需任何配置

---

**Q9: 不打开OpenCode对话界面，如何确认模型？**
- 命令行查看：`opencode models`（列出所有可用模型）
- 查看配置文件：`cat ~/.config/opencode/opencode.json | grep -i model`
- 查看统计：`opencode stats`
- 测试指定模型：`opencode -m <模型名> run "hello"`

---

**Q10: 当前有哪些免费的模型提供使用？**
运行 `opencode models` 后看到的可用模型：
- `opencode/big-pickle`（默认模型，200次/5小时）
- `opencode/deepseek-v4-flash-free`（最强免费模型，1M上下文）
- `opencode/mimo-v2.5-free`
- `opencode/nemotron-3-ultra-free`
- `opencode/north-mini-code-free`

---

**Q11: 没有登陆注册，使用这些模型有限额吗？**
- 有额度限制：
  - `big-pickle`：**200次/5小时**
  - `deepseek-v4-flash-free`：**每日约5000万-2亿Token**
- 其他模型限制未公开，社区反馈存在"严格限制"
- 免费服务是**限时免费**的，存在速率限制
- 数据可能被用于训练，不要提交敏感信息

---

**Q12: DeepSeek V4 Flash Free为什么是免费的？**
三重战略逻辑：
1. **技术降本**：MoE架构（284B参数但只激活13B）+ CSA/HCA稀疏注意力 + KV缓存压缩到7%
2. **商业阳谋**："开源免费引流，API付费变现"
3. **生态为王**：成为中国AI的事实标准，构建生态系统

---

**Q13: opencode/deepseek-v4-flash-free可以接入其他应用吗？收费吗？**
- 可以通过 **OpenCode Zen API** 接入（免费，需登录获取API Key）
- 调用模型ID为 `deepseek-v4-flash-free`
- API地址：`https://opencode.ai/zen/v1`
- 直接使用 **DeepSeek官方API** 则需付费（输入1元/百万tokens，输出2元/百万tokens）

---

**Q14: OpenCode Zen API需要登陆吗？**
- **需要**访问 `https://opencode.ai/auth` 注册/登录
- 生成专属 **API Key** 作为调用凭证
- 通常需添加**账单信息（billing）**才能使用

---

### 第三部分：Tauri 与技能管理

**Q15: Tauri开发的OpenCode skill**
Tauri在OpenCode生态中扮演两个角色：
1. **OpenCode官方桌面应用**：Tauri 2 + Rust + SolidJS
2. **第三方工具**：Skills Manager、SkillHub Desktop、Skill Zoo等（用于统一管理多AI工具的技能）

---

**Q16: 开发Tauri应用时可以使用的skills**
- **`openwork-core` Skill**：专门为构建原生应用设计，强制使用Tauri命令进行所有系统访问
- **`tauri-solidjs` Skill**：Tauri + SolidJS技术栈的完整指导
- 提供项目创建、开发命令、IPC通信、安全配置等全方位指引

---

**Q17: tauri-solidjs如何安装？**
- 通过LobeHub CLI：`npx -y @lobehub/market-cli skills install different-ai-openwork-tauri-solidjs`
- 安装位置：`~/.agents/skills/different-ai-openwork-tauri-solidjs/`
- 可创建符号链接让OpenCode识别：`ln -s ~/.agents/skills/different-ai-openwork-tauri-solidjs ~/.config/opencode/skills/tauri-solidjs`

---

**Q18: LobeHub是什么？**
- AI智能体的"应用商店"与协作空间
- 核心功能：多智能体协作、记忆与持续学习、Skills市场（33万+技能）、智能体构建器、项目管理
- 是OpenCode的**官方技能市场**

---

**Q19: OpenCode如何集成LobeHub市场？**
- 使用官方CLI：`npx -y @lobehub/market-cli skills install <技能名> --agent opencode`
- 但注意：CLI目前不支持 `--agent opencode`（支持的是claude-code、codex、cursor、open-claw）
- 备选：Agent Prompt安装、手动下载安装、MCP服务器集成

---

**Q20: OpenKilo提供商是什么？**
- 一个OpenCode插件，连接Kilo Gateway
- **零配置访问40+免费模型**，无需API Key
- 安装：`npm install -g openkilo`，在 `~/.config/opencode/opencode.json` 中添加 `"plugin": ["openkilo"]`
- 提供 `/kilo_login`、`/kilo_status`、`/kilo_refresh` 等管理命令

---

**Q21: ~/.agents/skills/的技能可以被MiMo和OpenCode共同使用吗？**
- **可以**，`~/.agents/skills/` 是一个通用技能目录
- OpenCode和MiMo（作为OpenCode的分支）都会自动扫描此目录
- 实现"一次安装，随处可用"

---

## 💎 总体建议

### 对于Obsidian插件开发：
- 本地安装 `@davidvkimball/obsidian-dev-skills`
- 运行初始化，选择正确的项目类型
- 利用AI助手的Skills来加速开发

### 对于OpenCode使用：
- **日常开发**：使用内置免费模型 `deepseek-v4-flash-free`（最强）
- **更多选择**：安装OpenKilo插件解锁40+免费模型
- **追求稳定**：使用默认的 `big-pickle` 模型
- **外部集成**：通过OpenCode Zen API在其它应用中使用免费模型

### 对于Tauri开发：
- 安装 `tauri-solidjs` Skill获取完整指导
- 参考 `openwork-core` Skill的架构设计

### 对于技能管理：
- 将通用技能放在 `~/.agents/skills/` 以便多工具共享
- 使用 `skillsandruless` 工具统一管理和更新技能
- 探索LobeHub市场发现更多技能
