---
title: Espanso — 跨平台文本扩展器完全指南
tags:
  - Espanso
  - 文本扩展
  - 效率工具
  - Linux
  - Obsidian
  - 自动化
aliases:
  - 文本扩展器
  - 文字片段工具
created: 2026-06-23
---

# Espanso — 跨平台文本扩展器完全指南

## 一句话定位

**Espanso** 是一个开源、隐私优先、跨平台的**文本扩展器（Text Expander）**——输入简短触发词，自动展开为完整文本片段，支持日期计算、Shell 脚本注入、表单交互和剪贴板操作。

---

## 为什么需要文本扩展器

LLM 可以帮你写代码、写邮件、写方案，但有些重复劳动**不该每次都用 AI**：

- 每次输入邮箱地址 → `:em` → 瞬间展开
- 每次写 ISO 日期 → `:date` → `2026-06-23`
- 每次写终端命令模板 → `:dps` → `docker ps --format "table {{.Names}}\t{{.Status}}"` 
- GitHub Issue 模板、Bug Report 模板 → 一个触发词搞定

文本扩展器解决的是「输入效率」问题，不依赖网络，不消耗 token，瞬时响应。

---

## 核心特性

### 1. 真正的跨平台

| 平台 | 支持 |
|------|------|
| Linux | ✅（X11 + Wayland） |
| macOS | ✅ |
| Windows | ✅ |
| iOS / Android | ❌ |

### 2. 隐私优先

- **开源**（GPL v3），代码可审计
- **纯本地**运行，无网络连接，无遥测
- 无账户系统，数据永远不离开你的机器

### 3. 系统级工作

不同于浏览器扩展或 IDE 插件，Espanso 在**操作系统层面**拦截键盘输入，因此在你使用的所有应用中生效——终端、浏览器、Obsidian、VS Code、微信……

---

## 安装

### Manjaro / Arch

```bash
yay -S espanso
# 或
pamac build espanso
```

### Ubuntu / Debian

```bash
# 推荐从源码编译（避免 wxWidgets 版本冲突）
cargo build -p espanso --release --no-default-features --features modulo,vendored-tls,wayland
```

### 注册为 systemd 用户服务

```bash
espanso service register
espanso start
```

### 验证安装

输入 `:espanso`，应该自动展开为 "Hi there!"。

---

## 配置体系

### 目录结构

```
~/.config/espanso/
├── config/
│   └── default.yml      # 主配置文件
├── match/
│   └── base.yml         # 基础匹配规则（自定义触发词写在这里）
└── packages/            # 社区包缓存
```

### 基本语法

```yaml
matches:
  # 简单文本替换
  - trigger: ":em"
    replace: "nuoxi@example.com"

  # 日期变量
  - trigger: ":date"
    replace: "{{date}}"
    vars:
      - name: date
        type: date
        params:
          format: "%Y-%m-%d"
  
  # 光标定位
  - trigger: ":hr"
    replace: "### $|$"
    # $|$ 代表展开后的光标位置
```

---

## 进阶用法

### Shell 命令注入

```yaml
- trigger: ":ip"
  replace: "{{output}}"
  vars:
    - name: output
      type: shell
      params:
        cmd: "curl -s ifconfig.me"
```

### 剪贴板引用

```yaml
- trigger: ":clip"
  replace: "📋 剪贴板内容: {{clipboard}}"
  vars:
    - name: clipboard
      type: clipboard
```

### 表单交互

```yaml
- trigger: ":bug"
  form: |
    标题: {{title}}
    复现步骤: {{steps}}
    期望行为: {{expected}}
  form_fields:
    title:
      type: text
    steps:
      type: multiline
    expected:
      type: text
```

### 随机选择

```yaml
- trigger: ":greet"
  replace: "{{greeting}}"
  vars:
    - name: greeting
      type: random
      params:
        choices:
          - "你好！"
          - "嗨！"
          - "好久不见！"
```

### 脚本扩展（任意语言）

```yaml
- trigger: ":uuid"
  replace: "{{output}}"
  vars:
    - name: output
      type: script
      params:
        args:
          - python3
          - -c
          - "import uuid; print(str(uuid.uuid4()))"
```

---

## Espanso Hub 社区包

通过 `espanso install <package>` 安装社区贡献的片段包：

| 包名 | 用途 |
|------|------|
| `html-entities` | HTML 实体快捷输入 |
| `lorem-ipsum` | 占位文本生成 |
| `emoji` | emoji 短码 → 真实 emoji |
| `basic-emojis` | 轻量 emoji 包 |
| `german-accents` | 德语特殊字符 |
| `math-symbols` | 数学符号快捷输入 |

```bash
espanso install emoji
# 输入 :smile → 😊
# 输入 :shrug → ¯\_(ツ)_/¯
```

---

## Obsidian 集成

在 Obsidian 中使用 Espanso 特别高效：

```yaml
# ISO-8601 日期
- trigger: ":d"
  replace: "{{date}}"
  vars:
    - name: date
      type: date
      params:
        format: "%Y-%m-%d"

# frontmatter created 字段
- trigger: ":fm"
  replace: "created: {{date}}T{{time}}"
  vars:
    - name: date
      type: date
      params:
        format: "%Y-%m-%d"
    - name: time
      type: date
      params:
        format: "%H:%M:%S"

# callout 模板
- trigger: ":note"
  replace: "> [!note] $|$\n> "

# dataview 查询模板
- trigger: ":dv"
  replace: "```dataview\n$|$\n```"
```

### 实用片段集

```yaml
# wikilink 快捷
- trigger: "[[d"
  replace: "[[$|$]]"

# codeblock 快捷
- trigger: "```p"
  replace: "```python\n$|$\n```"

# checkbox 列表
- trigger: ":todo"
  replace: "- [ ] $|$"
```

---

## 搜索面板

忘记触发词时，按 `Alt + Space` 打开搜索栏，模糊搜索所有已定义片段。

```yaml
# 在 default.yml 中配置
search_shortcut: "ALT+SPACE"
```

---

## 与同类工具的对比

| 特性 | Espanso | TextExpander | Alfred Snippets |
|------|---------|-------------|-----------------|
| 开源 | ✅ GPL v3 | ❌ | ❌ |
| 跨平台 | Linux/macOS/Win | Mac/Win/Chrome | 仅 macOS |
| 配置方式 | YAML 文件 | GUI | GUI |
| Shell 脚本 | ✅ | ✅（AppleScript/JS） | ✅ |
| 表单支持 | ✅（modulo） | ✅ | ❌ |
| 数据隐私 | 纯本地 | 云端同步 | 纯本地 |
| 价格 | 免费 | $8.33/月起 | 免费 |

---

## 从其他工具迁移

### 从 Alfred 迁移

1. 导出 `.alfredsnippets` 文件（本质是 ZIP）
2. 解压后得到 JSON 片段文件
3. 用脚本转换为 Espanso YAML 格式

### 从 TextExpander 迁移

无官方迁移工具，需手动将常用 Snippet 重写为 YAML 格式。

---

## 在你的 Manjaro 环境中的安装建议

```bash
# 安装
yay -S espanso

# 注册并启动
espanso service register
espanso start

# 编辑基础配置
espanso edit

# 安装常用包
espanso install emoji
espanso install basic-emojis

# 设为开机自启
systemctl --user enable espanso
```

---

## 参考资源

- 官方网站：<https://espanso.org>
- GitHub：<https://github.com/espanso/espanso>
- Hub 包目录：<https://hub.espanso.org>
- Obsidian 论坛集成讨论：<https://forum.obsidian.md/t/espanso-text-expander-snippet-showcase/21852>