

## 1. 需求背景与工具选型

### 1.1 痛点分析
作为内容创作者，我们经常需要将同一篇文章发布到多个平台（如微信公众号、知乎、掘金、CSDN、微博等）。传统的手动操作包括：
- 复制粘贴内容，重新排版
- 单独上传图片
- 调整格式以适应不同平台规则
- 重复填写标签、摘要

这一过程耗时且容易出错，尤其是当内容包含代码、公式或复杂排版时。

### 1.2 理想方案的要求
用户提出了一个明确的愿景：**“一次写成，全平台发布”**，并且希望工具具备以下特质：
- **免费开源**：无需付费，代码可审阅
- **强大稳定**：覆盖足够多的主流平台，同步可靠
- **格式优化**：支持 Markdown/HTML，能适配各平台的渲染差异
- **Agent 友好**：能够被系统级 Agent（如 AstrBot）方便地调用
- **安全**：账号信息不经过第三方服务器，降低泄露风险

### 1.3 候选工具对比
在深入 Wechatsync 之前，我们先回顾市场上其他主流方案及其不足：

| 工具名称 | 类型 | 优点 | 缺点 | 免费？ |
| :--- | :--- | :--- | :--- | :--- |
| **Wechatsync** | 浏览器插件 + CLI + MCP | 开源免费，本地数据，平台多，支持CLI/MCP | 同步后仍需手动发布草稿 | 完全免费 |
| **SyncCaster** | 桌面应用 | Markdown 支持好，安全 | 平台支持较少，需付费 | 开源免费，但有付费版 |
| **OpenWrite** | 在线平台 | 在线写作，一站式 | 需要注册其平台，数据存储在云端 | 基础免费，高级付费 |
| **新媒体管家** | 浏览器插件 | 老牌，功能全面 | 高级功能付费 | 基础免费，高级付费 |
| **PostSync** | Python 工具 | 开源，调用本地浏览器 | 配置复杂，用户量小，稳定性一般 | 免费 |
| **ArtiPub** | Docker 部署 | 支持今日头条 | 社区活跃度低，维护风险 | 免费 |

经过综合评估，**Wechatsync** 在免费、开源、平台覆盖、格式优化、自动化接口（CLI/MCP）方面均表现优异，最终成为我们的首选方案。

---

## 2. Wechatsync 项目概述

### 2.1 项目背景
Wechatsync（中文名“文章同步助手”）是一款诞生于开源社区的工具，旨在帮助内容创作者一键同步文章到多个平台。其核心哲学是**“数据在本地，安全可控制”**，不存储用户的任何账号密码，而是复用浏览器中已登录的 Cookie。

### 2.2 主要特性
- **零成本**：完全免费，无任何内购或订阅。
- **极广平台支持**：现已覆盖 31 个主流内容平台，并持续增加。
- **多重使用方式**：提供浏览器插件、命令行工具（CLI）和 MCP 服务器三种接口，适应不同用户和技术场景。
- **格式智能适配**：自动将 Markdown/HTML 内容转换为各平台可接受的格式，并处理图片上传。
- **安全可靠**：所有操作在本地完成，不经过第三方服务。

### 2.3 发展现状
- GitHub 仓库：`wechatsync/Wechatsync`，已有 **5.4k+ Star**，社区活跃。
- 官网：https://www.wechatsync.com
- 提供 Chrome/Edge/Firefox 插件，以及 Node.js 生态下的 CLI 和 MCP 组件。

---

## 3. 核心架构与组件

Wechatsync 采用模块化设计，主要包含以下部分：

```
Wechatsync 生态
├── browser-extension (浏览器插件)
│   ├── 捕获页面内容
│   ├── 驱动各平台适配器
│   └── 提供 MCP 连接入口
├── drivers (平台驱动)
│   ├── zhihu.js
│   ├── juejin.js
│   ├── wechat.js
│   └── ... (30+ 平台)
├── markdown-editor (内置编辑器)
├── cli (@wechatsync/cli)
│   ├── 通过命令行调用
│   └── 依赖浏览器插件提供的 Token
├── mcp-server (MCP 服务端)
│   └── 实现模型上下文协议
└── shared (共享工具函数)
```

- **浏览器插件**：是用户交互的主界面，也是 CLI 和 MCP 的后端服务提供方。
- **平台驱动**：每个平台有独立的适配文件，负责登录状态检测、内容格式转换、发布接口调用。
- **CLI 工具**：通过 npm 全局安装，可被脚本或程序调用，实现自动化。
- **MCP 服务器**：基于 MCP 协议，使 AI 助手能够理解“发布文章”等自然语言指令。

---

## 4. 支持的平台列表

Wechatsync 支持同步到以下 31 个平台（截至 2026 年 6 月，持续更新中）：

| 类别 | 平台名称 |
| :--- | :--- |
| **主流媒体** | 微信公众号、知乎、微博、小红书、抖音图文 |
| **技术社区** | 掘金、CSDN、SegmentFault、博客园、51CTO、开源中国、慕课网、语雀 |
| **综合内容** | 头条号、B站专栏、百家号、简书、豆瓣、搜狐号、网易号 |
| **金融/产品** | 雪球、东方财富、人人都是产品经理 |
| **其他** | 大鱼号、一点号、搜狐焦点、什么值得买 |
| **海外/自建站** | X（Twitter）、WordPress、Typecho |
| **静态站点** | Hexo、Hugo（导出 Markdown 压缩包） |

> **注意**：不同平台的支持程度略有差异，例如微信公众号需要额外配置 AppID/AppSecret，部分平台（如微博）仅支持登录但草稿发布功能待完善。最新状态请查阅官方文档。

---

## 5. 安装与配置（通用）

### 5.1 前置条件
- 一台可联网的计算机（Windows/macOS/Linux 均可）。
- 一个现代浏览器（Chrome/Edge/Brave 等 Chromium 内核，或 Firefox）。
- 对于 CLI 和 MCP：需要安装 Node.js（版本 ≥ 18）。

### 5.2 安装浏览器插件
推荐通过浏览器应用商店安装：
- **Chrome/Edge**：访问 [Chrome 网上应用店](https://chrome.google.com/webstore) 搜索“Wechatsync”或“文章同步助手”并添加。
- **Firefox**：由于未上架官方商店，需从 GitHub Releases 下载 `wechatsync-firefox-xxx.zip`，并通过 `about:debugging` 以临时加载方式安装（重启后需重载）。

安装完成后，浏览器工具栏会出现插件图标（一个蓝色同步符号）。

### 5.3 初始配置（获取 MCP Token）
为了使用 CLI 和 MCP，需要在插件中启用 MCP 连接并获取 Token：
1. 点击插件图标，选择“设置”（或右键 > 选项）。
2. 找到“MCP 连接”或“远程控制”部分。
3. 启用开关，系统将生成一串 Token（建议复制保存）。
4. 此 Token 用于 CLI 和 MCP 客户端进行身份验证。

### 5.4 登录目标平台
在浏览器中正常登录所有你想同步的平台（如知乎、掘金等），并保持登录状态。插件会自动读取 Cookie，无需额外操作。

---

## 6. 浏览器插件使用教程

### 6.1 同步已发布的文章（以微信公众号为例）
1. 在浏览器中打开一篇已发布的公众号文章（必须是文章详情页）。
2. 页面左侧会出现一个悬浮按钮“同步该文章”（或类似字样）。
3. 点击按钮，弹出同步窗口。
4. 勾选你想同步到的平台（可多选）。
5. 点击“同步”，插件将自动提取内容、转换格式并上传至各平台草稿箱。
6. 完成后，你需要手动登录各平台，在草稿箱中检查并最终发布。

### 6.2 同步任意网页文章
1. 打开任何一篇网页文章（非特定平台）。
2. 右键点击页面，选择“提取文章并同步”（或点击插件图标选择“同步当前页面”）。
3. 插件会自动抓取正文、标题、图片等。
4. 后续步骤同上。

### 6.3 同步本地 Markdown 文件
- 插件本身不支持直接读取本地文件，但你可以通过“粘贴 Markdown”功能：点击插件图标，选择“新建文章”，然后粘贴你的 Markdown 源码，再进行同步。

### 6.4 高级设置
在插件设置中，你可以：
- 自定义默认同步平台列表。
- 启用/禁用某些平台。
- 设置图片压缩选项。
- 配置自定义 CSS 以调整排版。

---

## 7. CLI 工具使用教程

CLI 工具 `@wechatsync/cli` 是无界面自动化的核心，适合脚本、CI/CD 或 AI Agent 调用。

### 7.1 安装
```bash
npm install -g @wechatsync/cli
# 或使用 pnpm
pnpm install -g @wechatsync/cli
```

安装完成后，可使用 `wechatsync --version` 验证。

### 7.2 配置
CLI 需要与浏览器插件通信，因此必须先安装插件并启用 MCP，获得 Token。CLI 有两种方式传递 Token：
- 环境变量：`export MCP_TOKEN=your_token`
- 或命令行参数：`--token your_token`（不推荐，会暴露在历史记录中）

建议将 Token 添加到 shell 配置文件（如 `.bashrc` 或 `.zshrc`）：
```bash
export MCP_TOKEN="your_secret_token"
```

### 7.3 基本命令
```bash
wechatsync sync <文件路径> [选项]
```

**常用选项：**
| 选项 | 说明 |
| :--- | :--- |
| `-p, --platforms <列表>` | 目标平台，逗号分隔，如 `zhihu,juejin` |
| `--title <标题>` | 手动指定文章标题（默认从文件提取） |
| `--cover <URL>` | 设置封面图片链接 |
| `--tags <标签>` | 设置标签，逗号分隔 |
| `--dry-run` | 模拟运行，不实际发布 |

**示例：**
```bash
# 同步到知乎和CSDN
wechatsync sync ./article.md -p zhihu,csdn

# 同步到微博并指定标题
wechatsync sync ./post.html -p weibo --title "今日思考"

# 预览模式
wechatsync sync ./draft.md -p juejin --dry-run
```

### 7.4 输出与日志
CLI 会实时输出同步进度和结果，若某个平台失败，会显示错误原因（如未登录、格式不支持等）。

---

## 8. MCP 协议集成教程

MCP（模型上下文协议）是一种让 AI 助手调用工具的标准协议。Wechatsync 提供了 MCP 服务端，使 AI（如 Claude、AstrBot）能够通过自然语言执行发布任务。

### 8.1 MCP 服务端构建
如果你从源码构建：
```bash
git clone https://github.com/wechatsync/Wechatsync.git
cd Wechatsync/packages/mcp-server
pnpm install
pnpm run build
```
构建后，`dist/index.js` 即为可执行的服务端入口。

### 8.2 在 Claude Desktop 中配置
编辑 Claude 配置文件（通常位于 `~/Library/Application Support/Claude/claude_desktop_config.json`）：
```json
{
  "mcpServers": {
    "wechatsync": {
      "command": "node",
      "args": ["/绝对路径/Wechatsync/packages/mcp-server/dist/index.js"],
      "env": {
        "MCP_TOKEN": "你的Token"
      }
    }
  }
}
```
重启 Claude，即可通过自然语言指令，如：
> “帮我把桌面上的 `article.md` 同步到知乎和掘金。”

Claude 会调用 Wechatsync MCP 完成操作。

### 8.3 在其他 MCP 客户端中使用
任何支持 MCP 的客户端（如 LobeHub、Continue 等）均可类似配置。只需提供命令、参数和环境变量即可。

### 8.4 自定义 MCP 工具
MCP Server 默认暴露了 `sync` 工具，你可根据需求扩展更多工具（如查看已同步历史、删除草稿等），但需要自行修改源码。

---

## 9. 与 AstrBot 的集成方案

AstrBot 是一个基于 Python 的聊天机器人框架，支持插件扩展。要让 AstrBot 调用 Wechatsync，有以下两种主要方式。

### 9.1 方案一：通过 CLI 命令直接调用（推荐）
在 AstrBot 的插件代码中，使用 Python 的 `subprocess` 模块执行 `wechatsync` 命令。

**示例插件代码（简化）**：
```python
import subprocess
from astrbot.api import Plugin

class WechatsyncPlugin(Plugin):
    async def handle_publish_command(self, context, file_path, platforms):
        cmd = f"wechatsync sync {file_path} -p {platforms}"
        proc = await asyncio.create_subprocess_shell(
            cmd,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            env={**os.environ, "MCP_TOKEN": "your_token"}
        )
        stdout, stderr = await proc.communicate()
        if proc.returncode == 0:
            await context.send_message("发布成功！")
        else:
            await context.send_message(f"发布失败：{stderr.decode()}")
```

**优点**：实现简单，无需额外依赖。
**缺点**：需要确保 AstrBot 运行环境中已安装 CLI 工具，且 Token 可用。

### 9.2 方案二：通过 MCP 协议集成（更智能）
如果 AstrBot 支持 MCP 客户端功能，则可直接作为 MCP 客户端与 Wechatsync MCP Server 通信。
目前 AstrBot 官方并未内置 MCP 支持，但你可以通过开发插件，引入 MCP 客户端库（如 `mcp` Python SDK），实现更灵活的交互。
这种方式使 AstrBot 能够理解自然语言发布指令，提升用户体验。

### 9.3 注意事项
- AstrBot 本身是聊天机器人，通常用于消息接收和响应。你可以设计一个命令，如 `/publish <文件路径> <平台>` 来触发发布。
- 由于 Wechatsync 的同步结果仅是草稿，建议在插件中提醒用户前往各平台最终发布。

---

## 10. Manjaro 系统下的特殊配置

Manjaro 是基于 Arch Linux 的发行版，使用 Pacman 包管理器。以下是针对 Manjaro 的安装建议。

### 10.1 安装浏览器
- **推荐 Chromium**（与 Wechatsync 兼容性最好）：
  ```bash
  sudo pacman -S chromium
  ```
- 若使用 Firefox，需手动加载临时插件（见第 5.2 节）。

### 10.2 安装 Node.js
Wechatsync CLI 和 MCP 需要 Node.js：
```bash
sudo pacman -S nodejs npm
# 或使用 nvm 管理多版本
```

### 10.3 安装 Wechatsync 插件
- **Chromium**：直接通过 Chrome 网上应用店安装。
- **Firefox**：从 [GitHub Releases](https://github.com/wechatsync/Wechatsync/releases) 下载 `wechatsync-firefox-xxx.zip`，解压后，在 Firefox 地址栏输入 `about:debugging`，点击“此 Firefox” -> “加载临时附加组件”，选择解压文件夹内的 `manifest.json`。

**注意**：临时加载的插件在 Firefox 重启后会失效，需要重新加载。若需长期使用，可考虑将 Firefox 升级为开发者版或使用 Chromium。

### 10.4 安装 CLI 工具
全局安装：
```bash
npm install -g @wechatsync/cli
```
确认安装成功：`wechatsync --version`。

### 10.5 环境变量配置
将 MCP Token 添加到 `~/.bashrc` 或 `~/.zshrc`（取决于你的 shell）：
```bash
export MCP_TOKEN="your_token_here"
```
然后执行 `source ~/.bashrc` 使其生效。

### 10.6 常见问题
- **权限问题**：若 npm 全局安装需要 sudo，可配置 npm 全局目录到用户目录，避免使用 sudo。
- **浏览器插件无法找到 Token**：确保插件中 MCP 连接已开启，且 Token 正确复制。

---

## 11. 常见问题与故障排查

### 11.1 同步失败，提示“未登录”
- 原因：插件无法获取目标平台的 Cookie。
- 解决：在浏览器中手动登录该平台，并保持登录状态，然后重试。

### 11.2 图片上传失败
- 原因：部分平台对图片尺寸或格式有要求，或网络问题。
- 解决：检查图片是否可公网访问（如果是本地图片，插件会尝试上传到图床，需配置图床服务）。也可在设置中关闭“上传图片”选项，手动处理。

### 11.3 CLI 连接失败
- 检查 MCP_TOKEN 是否设置正确。
- 确保浏览器插件正在运行（浏览器需开启）。
- 插件与 CLI 间通过 WebSocket 通信，请勿占用端口冲突。

### 11.4 某些平台不支持同步
- 查阅官方文档或 GitHub Issues，确认该平台是否已支持。若未支持，可考虑自行编写驱动或提 PR。

### 11.5 格式错乱
- 不同平台对 Markdown 的解析有差异。Wechatsync 内置了转换规则，但个别特殊格式可能仍需手动调整。建议同步后到各平台草稿箱微调。

---

## 12. 安全与隐私考量

### 12.1 数据存储
Wechatsync **不存储**任何用户账号密码或 Cookie。所有认证信息保存在浏览器本地，仅用于当前会话。关闭浏览器后 Cookie 失效（除非浏览器保存了登录状态）。

### 12.2 通信安全
CLI 和 MCP 与浏览器插件之间的通信使用本地 WebSocket（`127.0.0.1` ），不经过外部网络，因此不存在中间人攻击风险。Token 用于本地鉴权，若担心泄露可定期更换。

### 12.3 开源可审计
项目源代码完全公开，任何人都可检查是否有后门或恶意逻辑。这比闭源商业工具更具透明度。

### 12.4 使用建议
- 定期更换 MCP Token。
- 不要将 Token 硬编码在脚本中，建议使用环境变量或密钥管理服务。
- 仅在信任的设备上运行此工具。

---

## 13. 总结与最佳实践

### 13.1 适用场景
- **个人博主**：需要将文章分发到多个平台以扩大影响力。
- **技术作者**：常在掘金、CSDN、知乎等社区发布技术文章。
- **团队协作**：通过 CLI 或 MCP 集成到内部自动化流程中，实现定时发布。
- **AI 应用开发者**：利用 MCP 让 AI 助手代为发布。

### 13.2 最佳实践流程
1. **撰写文章**：使用 Markdown 编写，保存为 `.md` 文件。
2. **准备发布**：
   - 确保所有目标平台已在浏览器中登录。
   - 如需自动化，配置好 CLI 和 MCP Token。
3. **执行同步**：
   - 手动：打开文章页面，点击插件同步。
   - 自动：运行 `wechatsync sync file.md -p platform1,platform2`。
   - AI 触发：通过 MCP 让 AI 执行。
4. **检查草稿**：登录各平台，预览草稿，调整格式、添加特色封面或标签。
5. **最终发布**：点击各平台的“发布”按钮。

### 13.3 与 AstrBot 的推荐集成策略
- 先在 AstrBot 中实现一个简单命令，调用 CLI，满足基本自动化。
- 若未来 AstrBot 支持 MCP，可升级为自然语言交互，提升用户体验。

