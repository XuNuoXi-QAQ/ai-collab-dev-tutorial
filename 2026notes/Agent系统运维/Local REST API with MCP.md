---
title: "Local REST API with MCP"
tags:
  - Local REST API
  - MCP
  - Obsidian
aliases:
  - "本地REST API"
  - "Local REST API"
description: "Give your scripts, browser extensions, and AI agents a direct line into your Obsidian vault via a secure, authenticated REST API."
---

# Local REST API with MCP
# 本地 REST API 与 MCP

Give your scripts, browser extensions, and AI agents a direct line into your Obsidian vault via a secure, authenticated REST API.
通过一个安全、经过身份验证的 REST API，为您的脚本、浏览器扩展和 AI 代理提供一条直接通往 Obsidian 知识库的通道。

**Interactive API docs:** https://coddingtonbear.github.io/obsidian-local-rest-api/
**交互式 API 文档：** https://coddingtonbear.github.io/obsidian-local-rest-api/

## What you can do
## 您可以做什么

Access your vault through the **REST API** or the **built-in [MCP server](https://modelcontextprotocol.io/)** — both interfaces expose the same core capabilities, so scripts, browser extensions, and AI agents all speak the same language.
通过 **REST API** 或**内置的 [MCP 服务器](https://modelcontextprotocol.io/)** 访问您的知识库 —— 这两种接口都公开了相同的核心功能，因此脚本、浏览器扩展和 AI 代理都使用同一种语言进行通信。

- **Read, create, update, or delete notes** — full CRUD on any file in your vault, including binary files
- **读取、创建、更新或删除笔记** —— 对您知识库中的任何文件（包括二进制文件）执行完整的 CRUD 操作

- **Surgically patch specific sections** — target a heading, block reference, or frontmatter key and append, prepend, or replace just that section without touching the rest of the file
- **精确修补特定部分** —— 定位到标题、块引用或 frontmatter 键，仅对该部分进行追加、前置插入或替换，而不影响文件的其余部分

- **Search your vault** — simple full-text search or structured [JsonLogic](https://jsonlogic.com/) queries against note metadata (frontmatter, tags, path, content)
- **搜索您的知识库** —— 简单的全文搜索或针对笔记元数据（frontmatter、标签、路径、内容）的结构化 [JsonLogic](https://jsonlogic.com/) 查询

- **Access the active file** — read or write whatever note is currently open in Obsidian
- **访问当前活动文件** —— 读取或写入 Obsidian 中当前打开的笔记

- **Work with periodic notes** — get or create daily, weekly, monthly, quarterly, and yearly notes
- **处理周期性笔记** —— 获取或创建每日、每周、每月、每季度和每年的笔记

- **List and execute commands** — trigger any Obsidian command as if you'd used the command palette
- **列出并执行命令** —— 触发任何 Obsidian 命令，就像您使用了命令面板一样

- **Query tags** — list all tags across your vault with usage counts
- **查询标签** —— 列出您知识库中的所有标签及其使用次数

- **Open files in Obsidian** — tell Obsidian to open a specific note in its UI
- **在 Obsidian 中打开文件** —— 告诉 Obsidian 在其界面中打开特定的笔记

- **Extend the API** — other plugins can register their own routes via the [API extension interface](https://github.com/coddingtonbear/obsidian-local-rest-api/wiki/Adding-your-own-API-Routes-via-an-Extension)
- **扩展 API** —— 其他插件可以通过 [API 扩展接口](https://github.com/coddingtonbear/obsidian-local-rest-api/wiki/Adding-your-own-API-Routes-via-an-Extension) 注册自己的路由

All requests are served over HTTPS with a self-signed certificate and gated behind API key authentication.
所有请求都通过 HTTPS 提供服务，使用自签名证书，并通过 API 密钥认证进行保护。

## Quick start
## 快速开始

After installing and enabling the plugin, open **Settings → Local REST API** to find your API key and certificate.
安装并启用插件后，打开 **设置 → Local REST API** 即可找到您的 API 密钥和证书。

### REST API
### REST API

```sh
# Check the server is running (no auth required)
# 检查服务器是否正在运行（无需认证）
curl -k https://127.0.0.1:27124/

# List files at the root of your vault
# 列出知识库根目录下的文件
curl -k -H "Authorization: Bearer <your-api-key>" \
  https://127.0.0.1:27124/vault/

# Read a note
# 读取一篇笔记
curl -k -H "Authorization: Bearer <your-api-key>" \
  https://127.0.0.1:27124/vault/path/to/note.md

# Read a specific heading (URL-embedded target)
# 读取特定的标题（URL 中嵌入目标）
curl -k -H "Authorization: Bearer <your-api-key>" \
  https://127.0.0.1:27124/vault/path/to/note.md/heading/My%20Section

# Append a line to a specific heading (PATCH with headers)
# 向特定标题追加一行（使用带 Header 的 PATCH 请求）
curl -k -X PATCH \
  -H "Authorization: Bearer <your-api-key>" \
  -H "Operation: append" \
  -H "Target-Type: heading" \
  -H "Target: My Section" \
  -H "Content-Type: text/plain" \
  --data "New line of content" \
  https://127.0.0.1:27124/vault/path/to/note.md
```

To avoid certificate warnings, you can download and trust the certificate from `https://127.0.0.1:27124/obsidian-local-rest-api.crt`, or point your HTTP client at it directly.
要避免证书警告，您可以从 `https://127.0.0.1:27124/obsidian-local-rest-api.crt` 下载并信任该证书，或者直接将您的 HTTP 客户端指向它。

### MCP clients
### MCP 客户端

The MCP server runs at `https://127.0.0.1:27124/mcp/` and requires that you provide your bearer token for authentication via an `Authorization` header (i.e. `Authorization: Bearer <your-api-key>`). Because the plugin uses a self-signed certificate, you may need to either trust the certificate in your OS/client, or use the plain HTTP endpoint at `http://127.0.0.1:27123/mcp/` (enable it under **Settings → Local REST API → Enable HTTP server**).
MCP 服务器运行在 `https://127.0.0.1:27124/mcp/`，要求您通过 `Authorization` 请求头提供 Bearer Token 进行认证（即 `Authorization: Bearer <your-api-key>`）。由于该插件使用自签名证书，您可能需要在操作系统/客户端中信任该证书，或者使用 `http://127.0.0.1:27123/mcp/` 的明文 HTTP 端点（在 **设置 → Local REST API → Enable HTTP server** 中启用）。

#### Claude Code
#### Claude Code

Claude Code has native HTTP MCP support. The quickest way to add the server is via the CLI:
Claude Code 原生支持 HTTP MCP。通过 CLI 添加服务器是最快的方式：

```sh
claude mcp add --transport http obsidian https://127.0.0.1:27124/mcp/ \
  --header "Authorization: Bearer <your-api-key>"
```

Or add it manually to `.mcp.json` in your project root (project-scoped) or configure it user-wide via `claude mcp add --scope user`:
或者手动将其添加到项目根目录下的 `.mcp.json` 文件中（项目级别），或者通过 `claude mcp add --scope user` 进行用户级配置：

```json
{
  "mcpServers": {
    "obsidian": {
      "type": "http",
      "url": "https://127.0.0.1:27124/mcp/",
      "headers": {
        "Authorization": "Bearer <your-api-key>"
      }
    }
  }
}
```

#### Claude Desktop
#### Claude Desktop

Claude Desktop does not natively support remote HTTP MCP servers, but you can bridge it with [`mcp-remote`](https://www.npmjs.com/package/mcp-remote) (requires Node.js). Add the following to `claude_desktop_config.json`:
Claude Desktop 不原生支持远程 HTTP MCP 服务器，但您可以使用 [`mcp-remote`](https://www.npmjs.com/package/mcp-remote) 来桥接（需要 Node.js）。将以下内容添加到 `claude_desktop_config.json` 中：

- **macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows:** `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "obsidian": {
      "command": "npx",
      "args": [
        "mcp-remote@latest",
        "https://127.0.0.1:27124/mcp/",
        "--header",
        "Authorization: Bearer <your-api-key>"
      ]
    }
  }
}
```

Restart Claude Desktop after saving the file.
保存文件后重启 Claude Desktop。

#### Cursor
#### Cursor

Cursor supports the Streamable HTTP MCP transport. Add the following to `~/.cursor/mcp.json` (global) or `.cursor/mcp.json` (project-specific):
Cursor 支持 Streamable HTTP MCP 传输协议。将以下内容添加到 `~/.cursor/mcp.json`（全局）或 `.cursor/mcp.json`（项目级）：

```json
{
  "mcpServers": {
    "obsidian": {
      "url": "https://127.0.0.1:27124/mcp/",
      "headers": {
        "Authorization": "Bearer <your-api-key>"
      }
    }
  }
}
```

#### Other clients
#### 其他客户端

Any MCP client that supports the Streamable HTTP transport can connect to `https://127.0.0.1:27124/mcp/` with an `Authorization: Bearer <your-api-key>` header. Consult your client's documentation for the exact configuration format.
任何支持 Streamable HTTP 传输的 MCP 客户端都可以通过 `Authorization: Bearer <your-api-key>` 请求头连接到 `https://127.0.0.1:27124/mcp/`。请查阅您的客户端文档以获取确切的配置格式。

## API overview
## API 概览

| Endpoint 端点 | Methods 方法 | Description 描述 |
|---|---|---|
| `/vault/{path}` | GET PUT PATCH POST DELETE | Read, write, or delete any file in your vault 读取、写入或删除知识库中的任何文件 |
| `/active/` | GET PUT PATCH POST DELETE | Operate on the currently open file 对当前打开的文件进行操作 |
| `/periodic/{period}/` | GET PUT PATCH POST DELETE | Today's periodic note (`daily`, `weekly`, etc.) 当天的周期性笔记（`daily`、`weekly` 等） |
| `/periodic/{period}/{year}/{month}/{day}/` | GET PUT PATCH POST DELETE | Periodic note for a specific date 特定日期的周期性笔记 |
| `/search/simple/` | POST | Full-text search across all notes 对所有笔记进行全文搜索 |
| `/search/` | POST | Structured search via JsonLogic 通过 JsonLogic 进行结构化搜索 |
| `/commands/` | GET | List available Obsidian commands 列出可用的 Obsidian 命令 |
| `/commands/{commandId}/` | POST | Execute a command 执行命令 |
| `/tags/` | GET | List all tags with usage counts 列出所有标签及其使用次数 |
| `/open/{path}` | POST | Open a file in the Obsidian UI 在 Obsidian 界面中打开文件 |
| `/` | GET | Server status and authentication check 服务器状态和身份验证检查 |
| `/mcp/` | GET POST | MCP (Model Context Protocol) server — connect AI agents directly to your vault MCP（模型上下文协议）服务器 —— 直接将 AI 代理连接到您的知识库 |

For full request/response details, see the [interactive docs](https://coddingtonbear.github.io/obsidian-local-rest-api/).
有关完整的请求/响应详情，请参阅[交互式文档](https://coddingtonbear.github.io/obsidian-local-rest-api/)。

## Patching notes
## 修补笔记

The `PATCH` method is one of the most useful features of this API. It lets you make targeted edits without rewriting entire files.
`PATCH` 方法是此 API 最有用的功能之一。它允许您进行有针对性的编辑，而无需重写整个文件。

Specify a **target** (a heading, block reference, or frontmatter key) and an **operation** (`append`, `prepend`, or `replace`), and the plugin will apply the change precisely:
指定一个**目标**（标题、块引用或 frontmatter 键）和一个**操作**（`append`、`prepend` 或 `replace`），插件将精确地应用更改：

```sh
# Replace the value of a frontmatter field
# 替换 frontmatter 字段的值
curl -k -X PATCH \
  -H "Authorization: Bearer <your-api-key>" \
  -H "Operation: replace" \
  -H "Target-Type: frontmatter" \
  -H "Target: status" \
  -H "Content-Type: application/json" \
  --data '"done"' \
  https://127.0.0.1:27124/vault/path/to/note.md
```

See the [interactive docs](https://coddingtonbear.github.io/obsidian-local-rest-api/) for the full list of request headers and options.
请参阅[交互式文档](https://coddingtonbear.github.io/obsidian-local-rest-api/)以获取完整的请求头和选项列表。

## Targeting specific sections
## 定位特定部分

You can read or write a specific part of a note — a heading, block reference, or frontmatter field — without fetching or replacing the whole file. This works on GET, PUT, POST, and PATCH requests.
您可以读取或写入笔记的特定部分 —— 标题、块引用或 frontmatter 字段 —— 而无需获取或替换整个文件。这适用于 GET、PUT、POST 和 PATCH 请求。

There are two ways to specify the target:
有两种方式指定目标：

**Headers** — add `Target-Type` and `Target` to any request:
**请求头** —— 在任何请求中添加 `Target-Type` 和 `Target`：

```sh
# Read the content under a specific heading
# 读取特定标题下的内容
curl -k -H "Authorization: Bearer <your-api-key>" \
  -H "Target-Type: heading" \
  -H "Target: My Section" \
  https://127.0.0.1:27124/vault/path/to/note.md

# Read a frontmatter field
# 读取 frontmatter 字段
curl -k -H "Authorization: Bearer <your-api-key>" \
  -H "Target-Type: frontmatter" \
  -H "Target: status" \
  https://127.0.0.1:27124/vault/path/to/note.md
```

**URL path segments** (GET, PUT, and POST only) — append `/<target-type>/<target>` after the filename:
**URL 路径段**（仅 GET、PUT 和 POST）—— 在文件名后附加 `/<target-type>/<target>`：

```sh
# Read a specific heading
# 读取特定标题
curl -k -H "Authorization: Bearer <your-api-key>" \
  https://127.0.0.1:27124/vault/path/to/note.md/heading/My%20Section

# Read a nested heading (levels separated by ::)
# 读取嵌套标题（层级之间用 :: 分隔）
curl -k -H "Authorization: Bearer <your-api-key>" \
  https://127.0.0.1:27124/vault/path/to/note.md/heading/Work/Meetings

# Read a frontmatter field
# 读取 frontmatter 字段
curl -k -H "Authorization: Bearer <your-api-key>" \
  https://127.0.0.1:27124/vault/path/to/note.md/frontmatter/status

# Replace the content of a heading via PUT
# 通过 PUT 替换标题的内容
curl -k -X PUT \
  -H "Authorization: Bearer <your-api-key>" \
  -H "Content-Type: text/plain" \
  --data "Updated content" \
  https://127.0.0.1:27124/vault/path/to/note.md/heading/My%20Section

# Append to a heading via POST
# 通过 POST 向标题追加内容
curl -k -X POST \
  -H "Authorization: Bearer <your-api-key>" \
  -H "Content-Type: text/plain" \
  --data "Appended content" \
  https://127.0.0.1:27124/vault/path/to/note.md/heading/My%20Section
```

Supported target types: `heading`, `block`, `frontmatter`. Supplying both URL-embedded targets and the equivalent headers on the same request returns `422 Unprocessable Entity`.
支持的目标类型：`heading`、`block`、`frontmatter`。在同一请求中同时提供 URL 嵌入目标和等效的请求头将返回 `422 Unprocessable Entity`。

## Searching
## 搜索

`POST /search/simple/?query=your+terms` runs Obsidian's built-in fuzzy search and returns matching filenames with scored context snippets.
`POST /search/simple/?query=your+terms` 运行 Obsidian 内置的模糊搜索，并返回匹配的文件名及带评分的上下文片段。

`POST /search/` accepts a [JsonLogic](https://jsonlogic.com/) expression (content type `application/vnd.olrapi.jsonlogic+json`) and evaluates it against each note's metadata (frontmatter, tags, path, content).
`POST /search/` 接受一个 [JsonLogic](https://jsonlogic.com/) 表达式（内容类型为 `application/vnd.olrapi.jsonlogic+json`），并针对每篇笔记的元数据（frontmatter、标签、路径、内容）进行计算。

## MCP (Model Context Protocol)
## MCP（模型上下文协议）

> [!NOTE]
> 注意

> Several third-party MCP servers for Obsidian exist, but they are no longer necessary — this plugin ships a built-in MCP server that runs inside Obsidian and has direct access to your vault's live metadata, active file, periodic notes, and command palette. If you are currently using a third-party server, switching to this one is likely to give you better results.
> 目前存在多个 Obsidian 的第三方 MCP 服务器，但它们已不再必要 —— 此插件附带了一个内置的 MCP 服务器，它运行在 Obsidian 内部，可直接访问您的知识库的实时元数据、活动文件、周期性笔记和命令面板。如果您正在使用第三方服务器，切换到本服务器可能会获得更好的效果。

The plugin includes a built-in MCP server at `/mcp/` so AI agents and MCP-compatible clients can interact with your vault without hand-crafting HTTP requests.
该插件在 `/mcp/` 路径下包含了一个内置的 MCP 服务器，因此 AI 代理和兼容 MCP 的客户端无需手动构建 HTTP 请求即可与您的知识库交互。

**Transport:** Streamable HTTP — API key authentication required.
**传输协议：** Streamable HTTP —— 需要 API 密钥认证。

### Connecting a client
### 连接客户端

Connect your MCP client to `https://127.0.0.1:27124/mcp/`. Authentication uses a bearer token — find your API key under **Settings → Local REST API**, then pass it as:
将您的 MCP 客户端连接到 `https://127.0.0.1:27124/mcp/`。认证使用 Bearer Token —— 在 **设置 → Local REST API** 中找到您的 API 密钥，然后将其作为：

```
Authorization: Bearer <your-api-key>
```

The exact config syntax varies by client; see the [Quick start](#mcp-clients) examples above or consult your client's documentation for Streamable HTTP remote MCP servers.
确切的配置语法因客户端而异；请参阅上面的[快速开始](#mcp-clients)示例，或查阅您的客户端关于 Streamable HTTP 远程 MCP 服务器的文档。

> [!WARNING]
> 警告

> To connect to the MCP server securely, your client must trust the plugin's self-signed certificate. You can download and trust it from `https://127.0.0.1:27124/obsidian-local-rest-api.crt`, or configure your client to skip TLS verification for `127.0.0.1`.
> 要安全地连接到 MCP 服务器，您的客户端必须信任该插件的自签名证书。您可以从 `https://127.0.0.1:27124/obsidian-local-rest-api.crt` 下载并信任它，或将您的客户端配置为跳过对 `127.0.0.1` 的 TLS 验证。

> If trusting a self-signed certificate is not possible in your environment, you can connect insecurely using `http://127.0.0.1:27123/mcp/`
> instead of `https://127.0.0.1:27124/mcp/` if you have enabled the HTTP endpoint under **Settings → Local REST API → Enable HTTP server**.
> 如果在您的环境中无法信任自签名证书，您可以在 **设置 → Local REST API → Enable HTTP server** 下启用了 HTTP 端点的情况下，使用 `http://127.0.0.1:27123/mcp/` 替代 `https://127.0.0.1:27124/mcp/` 进行不安全连接。

### Available tools
### 可用工具

| Tool 工具 | Description 描述 |
|---|---|
| `vault_list` | List files and subdirectories inside a vault directory 列出知识库目录中的文件和子目录 |
| `vault_read` | Read a file's content, frontmatter, tags, and stat 读取文件的内容、frontmatter、标签和状态信息 |
| `vault_write` | Create or overwrite a vault file 创建或覆盖知识库文件 |
| `vault_append` | Append content to the end of a vault file 向知识库文件的末尾追加内容 |
| `vault_patch` | Patch a specific heading, block reference, or frontmatter field 修补特定的标题、块引用或 frontmatter 字段 |
| `vault_delete` | Delete a vault file 删除知识库文件 |
| `vault_move` | Move (rename) a vault file to a new path 将知识库文件移动（重命名）到新路径 |
| `vault_get_document_map` | List the headings, block references, and frontmatter fields in a file 列出文件中的标题、块引用和 frontmatter 字段 |
| `active_file_get_path` | Return the vault path of the file currently open in Obsidian 返回 Obsidian 中当前打开文件的知识库路径 |
| `periodic_note_get_path` | Return the vault path of the current periodic note (`daily`, `weekly`, `monthly`, `quarterly`, `yearly`) 返回当前周期性笔记（`daily`、`weekly`、`monthly`、`quarterly`、`yearly`）的知识库路径 |
| `search_query` | Search using a [JsonLogic](https://jsonlogic.com/) query against note metadata 使用 [JsonLogic](https://jsonlogic.com/) 查询对笔记元数据进行搜索 |
| `search_simple` | Full-text search using Obsidian's built-in search 使用 Obsidian 内置搜索进行全文搜索 |
| `tag_list` | List all tags across the vault with usage counts 列出知识库中的所有标签及其使用次数 |
| `command_list` | List all registered Obsidian commands 列出所有已注册的 Obsidian 命令 |
| `command_execute` | Execute an Obsidian command by ID 通过 ID 执行 Obsidian 命令 |
| `open_file` | Open a file in the Obsidian UI 在 Obsidian 界面中打开文件 |

### Available resources
### 可用资源

| URI | Description 描述 |
|---|---|
| `obsidian://local-rest-api/openapi.yaml` | Full OpenAPI specification for this REST API 此 REST API 的完整 OpenAPI 规范 |

## Contributing
## 贡献

See [CONTRIBUTING.md](CONTRIBUTING.md). If you want to add functionality without modifying core, consider building an [API extension](https://github.com/coddingtonbear/obsidian-local-rest-api/wiki/Adding-your-own-API-Routes-via-an-Extension) instead — extensions can be developed and released independently.
请参阅 [CONTRIBUTING.md](CONTRIBUTING.md)。如果您想在不修改核心代码的情况下添加功能，可以考虑构建一个 [API 扩展](https://github.com/coddingtonbear/obsidian-local-rest-api/wiki/Adding-your-own-API-Routes-via-an-Extension) —— 扩展可以独立开发和发布。

## Credits
## 致谢

Inspired by [Vinzent03](https://github.com/Vinzent03)'s [advanced-uri plugin](https://github.com/Vinzent03/obsidian-advanced-uri), with the goal of expanding automation options beyond the constraints of custom URL schemes.
灵感来源于 [Vinzent03](https://github.com/Vinzent03) 的 [advanced-uri 插件](https://github.com/Vinzent03/obsidian-advanced-uri)，目标是扩展自动化选项，超越自定义 URL 方案的限制。