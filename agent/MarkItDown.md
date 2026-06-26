---
title: "MarkItDown"
tags:
  - AI
  - Agent
  - MCP
  - Git
description: "MarkItDown 是微软开源的一款轻量级 Python 工具，旨在成为连接各种文件格式与大语言模型（LLM）的“万能转换器”。它的核心价值在于，能将 PDF、Word、PPT 等非结构化数据，一键转换为 LLM 最“爱吃”的 Markdown 格式。"
created: 2026-06-23
---

MarkItDown 是微软开源的一款轻量级 Python 工具，旨在成为连接各种文件格式与大语言模型（LLM）的“万能转换器”。它的核心价值在于，能将 PDF、Word、PPT 等非结构化数据，一键转换为 LLM 最“爱吃”的 Markdown 格式。

这个项目由 Microsoft AutoGen 团队维护，采用MIT 开源协议，目前在 GitHub 上已获得超过5.48万 Star，非常受欢迎。

⚙️ 核心功能：为什么它是“LLM 神器”？

· LLM 原生友好：主流 LLM 训练数据大量包含 Markdown，它结构清晰且 Token 利用率更高。实测显示，预处理后再喂给 AI，相比直接上传原格式可节省高达 80% 的 Token 消耗。
· 保留文档结构：转换时不是简单抽离纯文本，而是尽力保留标题层级、列表、表格、超链接等关键结构，让 AI 能像人一样理解文档逻辑。
· 支持格式极广：覆盖几乎所有常见格式：
  · 办公文档：PDF, Word (.docx), PowerPoint (.pptx), Excel (.xlsx/.xls)
  · 网页与文本：HTML, CSV, JSON, XML, 纯文本
  · 多媒体：图片 (OCR识别)、音频 (语音转文字)、YouTube (提取字幕)
  · 其他：ZIP压缩包, EPub电子书, Outlook邮件(.msg), 源代码文件
· AI 增强能力：可集成 AI 模型进行高级处理，如调用 GPT-4o 等视觉模型为图片生成描述，或利用 Azure AI 文档智能从扫描件中提取文字。
· 灵活易用：提供命令行和 Python 库两种使用方式。支持按需安装依赖，避免冗余。同时支持 MCP 协议，可直接挂载到兼容的 AI 工具上使用。

🚀 如何快速上手？

1. 安装
确保 Python 版本在 3.10 及以上。在终端执行安装命令（建议使用虚拟环境）：

```bash
pip install 'markitdown[all]'
```

2. 使用

· 命令行：直接转换文件
  ```bash
  markitdown 报告.pdf -o 报告.md
  ```
· Python 代码：集成到脚本中
  ```python
  from markitdown import MarkItDown
  md = MarkItDown()
  result = md.convert("文件.docx")
  print(result.text_content)
  ```

🎯 典型应用场景

· 为 AI 准备数据：将各种格式的企业报告喂给 ChatGPT 等模型进行分析摘要。
· 构建企业知识库：批量转换文档后导入向量数据库，是 RAG（检索增强生成） 应用的关键前置步骤。
· 赋能 AI Agent：在 Agent 工作流中作为预处理环节，让其能“阅读”任何格式的文件。
· 自动化内容管理：结合 CI/CD 流程，实现文档的自动转换与发布。

MarkItDown 解决了“格式鸿沟”这个实际痛点，是构建 AI 应用时非常实用的基础工具。


可以，MarkItDown 完全可以作为一个大模型的 Skill 被调取，主要有三种成熟的方式：

方式一：直接安装社区 Agent Skill（最省事）

社区已经封装好了现成的 Agent Skill，可以直接安装使用。

· 安装：在 Claude Code 等 Agent 环境中，执行命令 npx skills add https://github.com/mitsuhiko/agent-stuff --skill summarize。
· 使用：安装后告诉 Agent “用 summarize 技能把这个 PDF 转成 Markdown”，它就会自动调用 markitdown 完成转换。

方式二：部署 MCP Server（推荐，官方标准）

这是微软官方提供的方式，通过 MCP (模型上下文协议) 将 MarkItDown 封装成标准的工具服务。

· 部署：执行 pip install markitdown-mcp 安装，然后用 markitdown-mcp 命令启动服务。
· 接入：在支持 MCP 的客户端（如 Claude Desktop）配置文件中添加服务器信息即可。接入后，大模型就能直接调用 convert_to_markdown 工具。

方式三：作为 Python 函数调用（最灵活）

如果上述方式不适用，也可以在你的 Skill 代码中直接调用 MarkItDown 的 Python 库。

· 安装：pip install markitdown[all]。
· 调用：在你的 Python 代码中，将 MarkItDown 作为数据处理模块集成进来。这种方法最灵活，适合深度定制。

你可以根据你的 Agent 环境选择最适合的方式。如果是在 Claude 等支持 MCP 的环境里，推荐方式二；如果在通用 Python 环境里，方式三最直接。
