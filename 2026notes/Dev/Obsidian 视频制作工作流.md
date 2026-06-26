---
title: "Obsidian 视频制作工作流"
tags:
  - 视频
  - 工作流
  - Obsidian
  - HyperFrames
  - 自动化
aliases:
  - 视频制作流水线
  - Video Pipeline
description: "从 Obsidian 笔记到视频发布的完整工作流：笔记→脚本→HTML渲染→发布→归档。"
created: 2026-06-27
---

# 🎬 Obsidian 视频制作工作流

> **从知识笔记，到像素视频。** 基于 HyperFrames 框架的 HTML 渲染视频流水线。

---

## 📂 目录结构

```
/home/nuoxi/Video/
├── 00-Html-Video/     # 🏗️ 视频项目——HTML 源文件与资源
├── 01-WIP-video/      # 🚀 预备发布——渲染完成的 MP4 待发布
├── 02-Done-video/     # 📦 已发布归档——确认发布后移入
└── Camera/            # 📷 原始拍摄素材
```

---

## 🔄 完整工作流

### 阶段 1：知识源 → 视频脚本

**输入**：Obsidian 笔记库 (`/home/nuoxi/Documents/ai-collab-dev-tutorial`)

**过程**：
```
Obsidian 笔记 → 提取核心论点 → 撰写视频脚本 (script.md)
```

脚本格式包含：
- 定长分段（按秒和字数）
- 分镜速查表
- 核心视觉描述

**输出**：`00-Html-Video/<项目名>/script.md`

---

### 阶段 2：脚本 → HTML 渲染文件

**工具**：HyperFrames 框架

**过程**：
```
script.md → 分镜设计 → HTML 幻灯片文件 → index.html（主合成）
```

每个项目目录结构：
```
<项目名>/
├── script.md          # 视频脚本
├── index.html         # 主合成 HTML（HyperFrames 格式，1920×1080）
├── hyperframes.json   # HyperFrames 项目配置
├── package.json       # Node 依赖
├── meta.json          # 元数据
├── src/
│   └── slides/        # 分镜 HTML 文件
│       ├── slide_001.html
│       ├── slide_002.html
│       └── ...
├── CLAUDE.md          # AI 辅助构建指南
└── AGENTS.md          # 智能体编排指南
```

**视频类型**（由 `.agents/skills/` 提供模板）：

| 类型 | 说明 | 适用场景 |
|------|------|----------|
| `product-launch-video` | 产品发布/SaaS 宣传 | 产品介绍、功能演示 |
| `faceless-explainer` | 无旁白解说视频 | 概念科普、话题解析 |
| `motion-graphics` | 短动态图形 | 统计数据、Logo 展示、字幕动画 |
| `website-to-video` | 网页录制转视频 | 网站展示、UI 演示 |
| `general-video` | 通用视频合成 | 其他类型或混合场景 |
| `embedded-captions` | 字幕嵌入 | 为已有视频加字幕 |

---

### 阶段 3：渲染 → 预备发布

**工具**：HyperFrames CLI

```bash
cd 00-Html-Video/<项目名>
npx hyperframes render index.html   # 渲染为 MP4
```

渲染完成后，将生成的 MP4 文件移动到：

```
01-WIP-video/<项目名>.mp4
```

此时视频处于「待审核发布」状态。

---

### 阶段 4：发布 → 归档

- 从 `01-WIP-video/` 提取视频进行发布
- **确认发布成功**后，将原文件移动到：

```
02-Done-video/<年份>/<月份>/<项目名>.mp4
```

归档格式示例：
```
02-Done-video/2026/06Moon/自动推送测试.mp4
02-Done-video/2026/06Moon/三子代理部署工程讲解视频（带音频）.mp4
```

---

## 🏷️ 命名规范

- **项目目录**：使用中文项目名（与笔记主题一致）
- **视频文件**：保持原始文件名，包含内容描述
- **归档路径**：`<年份>/<月份主题>/<文件名>` 格式

---

## 🤖 AI 辅助工具

`/home/nuoxi/Video/00-Html-Video/.agents/` 目录下预置了专业技能库：

- **design-system**：视觉风格预设（各种配色/字体/布局主题）
- **hyperframes-scene**：场景构建规则（动画、转场、轨道）
- **audio**：音频处理（TTS 语音合成、音效）
- **capture**：网页截图捕获
- **captions**：字幕设计

---

## 📌 快速上手

```bash
# 1. 创建新视频项目
mkdir -p /home/nuoxi/Video/00-Html-Video/<项目名>/src/slides

# 2. 编写脚本
vim /home/nuoxi/Video/00-Html-Video/<项目名>/script.md

# 3. 构建 HTML 合成
# （在项目目录下创建 index.html 和分镜 HTML）

# 4. 渲染
cd /home/nuoxi/Video/00-Html-Video/<项目名>
npx hyperframes render index.html

# 5. 移入待发布
mv output.mp4 /home/nuoxi/Video/01-WIP-video/

# 6. 发布后归档
mv /home/nuoxi/Video/01-WIP-video/<file>.mp4 /home/nuoxi/Video/02-Done-video/2026/<月>/
```
