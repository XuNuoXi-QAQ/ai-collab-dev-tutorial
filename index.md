---
title: "nuoxi小站"
publish: True
tags:
  - MOC
  - 仪表盘
  - dashboard
aliases:
  - "首页"
  - "Dashboard"
  - "Home"
description: "📖 [[AI 笔记宪法]] — AI 生成笔记的规范"
---



## 📊 标签总览

```dataview
TABLE length(rows) AS "数量"
FROM ""
WHERE file.tags AND length(file.tags) > 0
FLATTEN file.tags AS tag
GROUP BY tag
SORT length(rows) DESC
LIMIT 20
```

---

## 📝 最近笔记

```dataview
TABLE file.cday AS "日期", tags AS "标签"
FROM ""
WHERE file.name != this.file.name
SORT file.cday DESC
LIMIT 10
```

---

## 🏷️ 按标签快速检索

### 标签：`AI`

```dataview
LIST
FROM ""
WHERE contains(tags, "AI") AND file.name != this.file.name
SORT file.name ASC
```

### 标签：`Linux` / `运维`

```dataview
LIST
FROM ""
WHERE (contains(tags, "Linux") OR contains(tags, "运维")) AND file.name != this.file.name
SORT file.name ASC
```

### 标签：`硬件` / `DIY`

```dataview
LIST
FROM ""
WHERE (contains(tags, "硬件") OR contains(tags, "DIY")) AND file.name != this.file.name
SORT file.name ASC
```

### 标签：`安全`

```dataview
LIST
FROM ""
WHERE contains(tags, "安全") AND file.name != this.file.name
SORT file.name ASC
```

---

## 📈 知识库统计

| 指标 | 数值 |
|------|------|
| 总笔记数 | `= length(filter(file.lists, (l) => true))` 篇 |
| MOC 数量 | 4 篇 |
| 目录数 | 8 个 |
| Frontmatter 覆盖率 | 100% |

---

## 🔗 核心入口

- 📖 [[AI 笔记宪法]] — AI 生成笔记的规范
- 🏗️ [[AI工程认知框架：技术选型与落地实操手册]] — 核心工程框架（47KB）
- ⚙️ [[Manjaro AI 工作流终极指南]] — 本地环境全景
- 🌐 [[智能内容自动化体系：从知识到行动的完整AI工作流架构设计]] — 自动化架构（36KB）
- 🔑 [[MCP]] — 模型上下文协议
- 🎬 [[Hyperframes]] — AI 视频生成框架