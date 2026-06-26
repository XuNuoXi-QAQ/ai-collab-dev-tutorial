---
title: "Tavily 全面指南 — AI 专用搜索引擎"
tags:
  - tavily
  - search
  - ai-agent
  - api
  - rag
  - langchain
  - dify
aliases:
  - "Tavily 教程"
  - "Tavily API 指南"
description: "Tavily 是一个专为 AI Agent 和 LLM（大语言模型）设计的搜索引擎 API。与传统搜索引擎（Google、Bing）返回链接列表不同，Tavily 直接返回清洗后的结构化纯文本，过滤广告、导航栏和杂乱 HTML，专供大模型快速消费，大幅降低 token 浪费和幻觉风险。"
---


# Tavily 全面指南 — AI 专用搜索引擎

## 概述

Tavily 是一个专为 AI Agent 和 LLM（大语言模型）设计的搜索引擎 API。与传统搜索引擎（Google、Bing）返回链接列表不同，Tavily 直接返回**清洗后的结构化纯文本**，过滤广告、导航栏和杂乱 HTML，专供大模型快速消费，大幅降低 token 浪费和幻觉风险。

Tavily 由 Tavily Team 开发，2026 年 2 月被 Nebius（阿姆斯特丹，Yandex 非俄罗斯资产的继承者）宣布收购。官方声明 API、数据政策及零数据留存承诺在新所有权下保持不变。平台持有 SOC 2 Type II 认证，GDPR 合规，通过标准合同条款处理欧盟数据传输。

---

## 核心理念

Tavily 的设计哲学围绕三个核心原则：

1. **AI 优先** — 搜索结果以结构化 JSON 返回，包含标题、URL、已清洗内容片段、图片等字段，LLM 可直接消费，无需额外 HTML 解析
2. **速度与准确性** — 语义搜索优化，响应时间通常在 1-5 秒内，支持 `ultra-fast` 到 `advanced` 四档深度
3. **开发者友好** — 免费额度每月 1,000 次请求，无需信用卡；Python/JS SDK 一行安装；最近甚至支持无密钥模式（Keyless Mode）

---

## 快速上手（5 分钟）

### 第一步：获取 API Key

1. 访问 [tavily.com](https://tavily.com) → 右上角 Login
2. 使用 Google / GitHub 账号注册
3. Dashboard → 复制 API Key（格式：`tvly-xxxxx`）
4. 免费额度：**每月 1,000 API Credits**，无需绑卡

### 第二步：安装 SDK

```bash
pip install tavily-python
```

Node.js：

```bash
npm i @tavily/core
```

### 第三步：第一次搜索

```python
from tavily import TavilyClient

client = TavilyClient(api_key="tvly-YOUR_API_KEY")
response = client.search("Who is Leo Messi?")
print(response)
```

仅 4 行代码即可获得结构化搜索结果。

### 生产环境安全实践

```python
import os
client = TavilyClient(api_key=os.getenv("TAVILY_API_KEY"))
```

或将 API Key 设为系统环境变量：`export TAVILY_API_KEY="tvly-xxxxx"`，SDK 会自动读取。

---

## 五大核心 API 端点

Tavily 提供五个主要 API，从简单搜索到深度研究形成完整渐进体系。

### 1. `/search` — 语义搜索

基础端点，执行 AI 优化的网络搜索，返回排序后的结构化摘要。

**完整参数列表：**

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `query` | str | 必填 | 搜索查询，建议 ≤400 字符 |
| `search_depth` | str | `"basic"` | `"ultra-fast"` / `"fast"` / `"basic"` / `"advanced"` |
| `max_results` | int | `5` | 返回结果数，范围 1-20 |
| `topic` | str | `"general"` | `"general"` / `"news"` / `"finance"` |
| `time_range` | str | `None` | `"day"` / `"week"` / `"month"` / `"year"` |
| `start_date` | str | `None` | 起始日期 `YYYY-MM-DD`（2025.7 新增） |
| `end_date` | str | `None` | 截止日期 `YYYY-MM-DD`（2025.7 新增） |
| `include_domains` | list | `[]` | 仅包含这些域名的结果 |
| `exclude_domains` | list | `[]` | 排除这些域名的结果 |
| `include_answer` | bool | `False` | 包含对查询的 AI 生成回答 |
| `include_raw_content` | bool | `False` | 包含清洗后的完整页面文本 |
| `include_images` | bool | `False` | 包含相关图片列表 |
| `include_image_descriptions` | bool | `False` | 包含图片描述文本 |
| `include_favicon` | bool | `False` | 包含网站图标（2025.6 新增） |
| `include_usage` | bool | `False` | 返回 API Credits 消耗（2025.12 新增） |
| `auto_parameters` | bool | `False` | 自动优化参数（2025.6 新增） |
| `exact_match` | bool | `False` | 精确匹配模式（2026.2 新增） |
| `country` | str | `None` | 地区偏向（2025.5 新增） |
| `timeout` | float | — | 超时秒数（2025.11 新增） |

**示例：**

```python
results = client.search(
    query="2026 年 AI Agent 框架最新进展",
    search_depth="advanced",
    max_results=10,
    topic="news",
    time_range="month",
    include_domains=["techcrunch.com"],
    include_raw_content=True,
    include_images=True,
    country="CN"
)

for r in results["results"]:
    print(r["title"], r["url"], r["content"][:100])
```

**四种搜索深度：**

- `ultra-fast` — 最快，适用于实时 Agent（2025.12 Beta）
- `fast` — 快速模式（2025.12 Beta）
- `basic` — 标准深度，1 API Credit
- `advanced` — 高级深度，2 API Credits，更全面

---

### 2. `/extract` — URL 内容提取

从网页提取清洗后的纯文本或 Markdown，单次支持最多 **20 个 URL**。

**核心参数：**

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `urls` | list | 必填 | 目标 URL 列表，最多 20 个 |
| `extract_depth` | str | `"basic"` | `"basic"` / `"advanced"` |
| `query` | str | `None` | 用户意图，用于重排内容片段（2025.12 新增） |
| `chunks_per_source` | int | `3` | 每源返回的相关片段数（1-5），需配合 `query` 使用 |
| `format` | str | `"markdown"` | `"markdown"` / `"text"` |
| `include_images` | bool | `False` | 包含页面图片 |
| `include_favicon` | bool | `False` | 包含网站图标 |
| `timeout` | float | — | 超时秒数（1-60 秒） |

**示例：**

```python
extract_results = client.extract(
    urls=[r["url"] for r in search_results["results"]],
    extract_depth="advanced",
    query="AI agent architecture patterns",
    chunks_per_source=3,
    format="markdown"
)

for result in extract_results["results"]:
    print(result["raw_content"])  # 清洗后的全文
```

**`query` + `chunks_per_source` 机制：**

提供 `query` 后，Tavily 对提取内容进行语义重排，`raw_content` 字段变为 `<chunk 1> [...] <chunk 2> [...] <chunk 3>` 格式，仅返回与查询最相关的内容片段，有效控制上下文窗口大小。

**提取深度对比：**

- `basic` — 1 API Credit，超时 10 秒
- `advanced` — 2 API Credits，超时 30 秒，支持 JavaScript 渲染

---

### 3. `/crawl` — 网站智能爬取

从根 URL 出发，自动发现并提取相关子页面，结合了 `/map` 的站点发现与 `/extract` 的内容提取能力。

**核心参数：**

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `url` | str | 必填 | 起始爬取 URL |
| `max_depth` | int | `3` | 从起始 URL 的最大跳转深度 |
| `max_breadth` | int | `50` | 每层最大爬取页面数 |
| `limit` | int | `100` | 最大总页面数 |
| `instructions` | str | `None` | 自然语言爬取引导 |
| `select_paths` | list | `[]` | 仅爬取匹配这些正则的路径 |
| `exclude_paths` | list | `[]` | 排除匹配这些正则的路径 |
| `select_domains` | list | `[]` | 仅爬取这些域名 |
| `exclude_domains` | list | `[]` | 排除这些域名 |
| `allow_external` | bool | `False` | 允许跟随外部链接 |
| `chunks_per_source` | int | `3` | 每页返回片段数 |
| `extract_depth` | str | `"basic"` | 提取深度 |
| `timeout` | float | `150` | 超时秒数（10-150 秒） |

**示例：**

```python
response = client.crawl(
    url="https://docs.tavily.com",
    max_depth=2,
    limit=50,
    instructions="Find all pages about the Python SDK",
    select_paths=["/documentation/api-reference/.*"],
    exclude_paths=["/documentation/api-reference/endpoint/research-streaming"],
    chunks_per_source=3
)

for page in response["results"]:
    print(f"\n--- {page['url']} ---")
    print(page["raw_content"][:300])
```

**Crawl vs Map 选择指南：**

| 特性 | Crawl | Map |
|------|-------|-----|
| 返回内容 | URL + 完整页面内容 | 仅 URL 列表 |
| 速度 | 较慢（含内容提取） | 快（秒级） |
| 成本 | 更高（每页提取） | 更低 |
| 适用场景 | RAG 管线、内容分析、文档 | 站点发现、URL 过滤、站点地图生成 |

> [!tip] 经验法则
> 用 Map **发现**页面，用 Crawl **读取**页面。

---

### 4. `/map` — 站点结构映射

快速发现网站 URL 结构，生成站点地图，仅返回 URL 列表。

```python
response = client.map(
    url="https://docs.tavily.com",
    max_depth=2,
    instructions="查找 Python SDK 相关页面"
)

for url in response["results"]:
    print(url)
```

---

### 5. `/research` — AI 深度研究

端到端自动化研究，收集来源、分析并生成**带引用的报告**，耗时 30-120 秒。

**模型选择：**

- `mini` — 轻量级，4-110 Credits/请求
- `pro` — 全面分析，15-250 Credits/请求
- `auto` — 自动选择

**新增参数**（2026.5）：

- `include_domains` / `exclude_domains` — 域过滤
- `output_length` — `"short"` / `"standard"` / `"long"`

```python
report = client.research(
    "competitive landscape of AI code assistants in 2026",
    model="pro",
    output_length="long",
    include_domains=["techcrunch.com", "theinformation.com"]
)
```

**CLI 用法：**

```bash
# 基础研究
tvly research "electric vehicle market analysis"

# Pro 模型 + 实时流输出
tvly research "AI agent frameworks comparison" --model pro --stream

# 保存到文件
tvly research "fintech trends 2026" --model pro -o report.md
```

---

## 定价与信用体系

### 月度计划

| 方案 | 月 Credits | 月费 | 单价/Credit |
|------|-----------|------|-------------|
| Researcher（免费） | 1,000 | 免费 | 免费 |
| Project | 4,000 | $30 | $0.0075 |
| Bootstrap | 15,000 | $100 | $0.0067 |
| Startup | 38,000 | $220 | $0.0058 |
| Growth | 100,000 | $500 | $0.005 |
| Pay As You Go | 按量 | — | $0.008 |
| Enterprise | 自定义 | 自定义 | 自定义 |

每月第一天重置 Credits，与账单日无关。学生可申请免费使用。

### API Credits 消耗一览

| 操作 | basic | advanced |
|------|-------|----------|
| Search | 1 Credit | 2 Credits |
| Extract（每 URL） | 1 Credit | 2 Credits |
| Map | 1 Credit / 10 页 | — |
| Crawl | Map 成本 + Extract 成本 | — |
| Research (mini) | 4-110 Credits | — |
| Research (pro) | 15-250 Credits | — |

---

## 速率限制

| 环境 | Search/Extract | Crawl | Research |
|------|---------------|-------|----------|
| Development Key | 100 RPM | 100 RPM | 20 RPM |
| Production Key | 1,000 RPM | 100 RPM | 20 RPM |

---

## 高阶特性

### Keyless Mode（无密钥模式）

```python
from tavily import TavilyClient, TavilyKeylessLimitError

# 不传 API Key，自动进入无密钥模式
client = TavilyClient()

try:
    response = client.search("Who is Leo Messi?")
    print(response)
except TavilyKeylessLimitError as e:
    print(f"超出速率限制，{e.retry_after_seconds} 秒后重试")
```

无密钥模式支持 `search()` 和 `extract()`，其他方法需 API Key。

### Session & Project Tracking（2026.5 新增）

```python
client = TavilyClient(
    api_key="tvly-xxx",
    session_id="my-session-123",     # 会话追踪
    human_id="internal-user-id-42",   # 人类用户 ID
    client_name="my-app"              # 客户端标识
)

# 单次覆盖
client.search("hello", session_id="ad-hoc-session")
```

通过 `X-Project-ID` Header 追踪项目用量：

```bash
curl -H "X-Project-ID: my-project" ...
```

### Async 异步客户端

```python
from tavily import AsyncTavilyClient
import asyncio

async def search():
    client = AsyncTavilyClient(api_key="tvly-xxx")
    return await client.search("Python 3.12 新特性")

asyncio.run(search())
```

---

## 生态系统与集成

Tavily 与主流 AI 框架深度集成：

| 框架 | 方式 |
|------|------|
| **LangChain** | `langchain-tavily` 包，提供 Search/Extract/Crawl/Research 四个 Tool |
| **LlamaIndex** | 直接集成 |
| **Dify** | 插件 `tavily-0.1.10`（你的实例已安装） |
| **Vercel AI SDK v5** | `@tavily/ai-sdk`（2025.11） |
| **MCP Server** | 支持 Remote MCP Server |
| **Zapier / Make** | 无代码集成 |
| **Composio / Agno / Pydantic AI** | 原生集成 |
| **CLI 工具** | `tavily-cli`，`tvly` 命令 |

### LangChain 集成示例

```bash
pip install -qU langchain-tavily
```

```python
from langchain_tavily import TavilySearch

tool = TavilySearch(
    max_results=5,
    search_depth="advanced",
    topic="general",
    include_answer=True,
)

result = tool.invoke("2026 年 AI 发展趋势")
```

---

## 经典模式：搜索 + LLM 回答

```python
from tavily import TavilyClient
from openai import OpenAI

tavily = TavilyClient(api_key="tvly-xxx")
llm = OpenAI()

def answer_with_tavily(question: str) -> str:
    # Step 1: 搜索
    results = tavily.search(question, max_results=5, search_depth="advanced")
    snippets = "\n".join([r["content"] for r in results["results"]])

    # Step 2: LLM 消费
    prompt = f"""请基于以下搜索结果回答问题。如果搜索结果不足以回答，请明确说明。

搜索结果：
{snippets}

问题：{question}"""

    response = llm.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}]
    )
    return response.choices[0].message.content
```

---

## 最佳实践

### Search 最佳实践

- 查询控制在 **400 字符以内**，聚焦核心意图
- 先用 `search_depth="basic"` 快速探索，确认方向后用 `"advanced"` 深入
- `include_domains` / `exclude_domains` 过滤可信/不可信来源
- `include_raw_content=True` 可一步获得完整文本，但两步流程（先 search 再 extract）更精准

### Extract 最佳实践

- 多 URL 提取时，提供 `query` 让 Tavily 语义重排内容
- `chunks_per_source=3` 是不错的经验起点
- `format="markdown"` 对 LLM 更友好

### Crawl 最佳实践

- **先 Map 后 Crawl**：用 Map 了解站点结构，确定 `select_paths` 正则
- 始终设 `limit` 控制成本和超时
- 检查 `response["failed_results"]` 排查提取失败页面
- 大型站点设 `timeout=150`

### 安全最佳实践

- API Key 存环境变量，不硬编码
- 生产环境启用 Session Tracking 追查异常
- 善用 Usage Dashboard 监控 Credits 消耗

---

## CLI 工具速查

```bash
# 安装并登录
pip install tavily-cli
tvly login

# 搜索
tvly search "AI agent frameworks" --depth advanced --max-results 5 --json
tvly search "SEC filings" --include-domains sec.gov,reuters.com --json

# 提取
tvly extract "https://example.com" --json
tvly extract "url1" "url2" --query "authentication API" --chunks-per-source 3

# 爬取
tvly crawl "https://docs.example.com" --max-depth 2 --limit 50 --json
tvly crawl "https://docs.example.com" --select-paths "/api/.*" --exclude-paths "/blog/.*"

# 深度研究
tvly research "quantum computing breakthroughs" --model pro --stream -o report.md
```

---

## 竞品对比速览

| 特性 | Tavily | Brave Search API | Firecrawl | Exa |
|------|--------|-----------------|-----------|-----|
| 搜索方式 | 多源聚合 + 语义 | 独立索引（30B+ 页） | 关键词搜索 | 嵌入语义搜索 |
| 免费额度 | 1,000 Credits/月 | 2,000 查询/月 | 1,000 Credits/月 | 无 |
| 单价 | $0.008/Credit | $5-9/1K 请求 | $83/月 (100K 页) | 联系销售 |
| AI 优化 | ✅ 原生设计 | 部分 | ✅ 强 | ✅ 语义 |
| JS 渲染 | advanced extract | ❌ | ✅ 内置 | ❌ |
| 输出格式 | JSON / Markdown / Text | JSON | Markdown / HTML / JSON | HTML / JSON |
| 深度研究 | ✅ Research API | ❌ | ❌ | ❌ |
| SOC 2 | ✅ Type II | ✅ Type II | — | — |

---

## 更新日志精选

| 时间 | 更新 |
|------|------|
| 2026.5 | Session Tracking（`X-Session-Id`, `X-Human-Id`）、Research 域过滤 + output_length |
| 2026.3 | Enterprise API Key 管理端点 |
| 2026.2 | `exact_match` 精确匹配参数 |
| 2026.1 | `X-Project-ID` 项目追踪 |
| 2025.12 | `fast` / `ultra-fast` 搜索深度、Intent-Based Extraction、`include_usage` |
| 2025.11 | Vercel AI SDK v5 集成、Crawl & Map `timeout` |
| 2025.7 | `start_date` / `end_date` 日期过滤、Usage Dashboard |
| 2025.6 | `auto_parameters`、`include_favicon` |
| 2025.5 | `country` 参数、`/usage` 端点 |

---

## 参考资源

- [官方文档](https://docs.tavily.com)
- [API Reference](https://docs.tavily.com/documentation/api-reference/introduction)
- [Python SDK (GitHub)](https://github.com/tavily-ai/tavily-python)
- [LangChain 集成](https://github.com/tavily-ai/langchain-tavily)
- [社区](https://community.tavily.com)
- [llms.txt（全文档索引）](https://docs.tavily.com/llms.txt)

---

> [!tip] 快速提示
> 你的 Dify 实例已安装 `tavily-0.1.10` 插件，可直接在 Dify 工作流中将 Tavily 作为工具节点调用。Tavily MCP Server 也可以通过 Remote MCP 在 AstrBot 中配置使用。