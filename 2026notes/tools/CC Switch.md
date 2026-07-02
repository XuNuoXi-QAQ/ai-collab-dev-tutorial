
## 📖 什么是 CC Switch？

它是一款为 AI 编程开发者设计的开源桌面应用，旨在解决 Claude Code、Codex 等 AI 编程工具配置繁琐、切换困难的问题。你可以通过它可视化地一键切换不同的 API 提供商（Provider）、模型、API 密钥等，支持管理 7 款主流 AI 编程工具，并提供 MCP 服务器、Skills和系统提示词的统一管理。

⚙️ 如何在 Manjaro 上安装？

基于 Arch Linux 的 Manjaro，推荐以下两种方式：

· 通过 AUR 安装（推荐）：打开终端，根据你安装的 AUR 助手执行命令：
  ```bash
  # 使用 yay
  yay -S cc-switch-bin
  
  # 或使用 paru
  paru -S cc-switch-bin
  ```
· 使用 AppImage（通用）：从 GitHub Releases 页面 下载 .AppImage 文件，赋予执行权限后运行：
  ```bash
  chmod +x CC-Switch-*.AppImage
  ./CC-Switch-*.AppImage
  ```

环境准备：CC Switch 管理的工具（如 Claude Code）大多基于 Node.js，建议提前安装 Node.js 18 LTS 或更高版本。

🚀 快速上手

1. 选择工具：启动后在顶部选择要管理的工具（如 Claude Code）。
2. 添加 Provider：点击 “+” 号或 “Add Provider” 按钮。
3. 填写信息：从 100+ 内置预设中选择，或手动填写 Provider 名称、Base URL（API 地址）和 API Key。
4. 配置模型：在下方配置区域（如 config.toml）填写要使用的模型名称（如 claude-sonnet-xxx）。
5. 启用配置：点击 “添加” 或 “Enable” 按钮，配置会自动生效。

验证：在终端进入项目目录，输入 claude（或对应工具命令）启动，即可开始使用。

🛠️ 高级功能

· MCP 服务器管理：点击顶部 “MCP” 按钮，可一键添加 fetch、context7 等预设 MCP 服务器。
· Skills 管理 (Claude Code)：选中 Claude Code 后可看到 Skills 入口，添加仓库后即可扫描并安装社区 Skills。
· 提示词管理：可添加、启用/禁用自定义系统提示词，在不同任务间快速切换。
· 配置同步：支持通过 Dropbox、OneDrive 等工具同步配置文件。

🔧 常见问题

· 配置未生效：确保在 CC Switch 中点击了 “启用”，并重启了对应的 CLI 工具。
· Skills 扫描超时：可能和网络有关，可尝试刷新或检查 Skills 仓库地址是否正确。
· AppImage 无法运行：检查是否已赋予执行权限（chmod +x），或尝试安装 fuse 依赖。

