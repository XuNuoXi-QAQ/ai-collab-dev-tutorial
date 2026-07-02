
## 📋 一、系统要求

| 项目 | 要求 |
| :--- | :--- |
| **Node.js** | **Node 24（推荐）** 或 Node 22.19+ |
| **操作系统** | Windows、macOS、Linux |
| **包管理器** | npm / pnpm / bun（源码构建需要 pnpm） |
| **内存** | 最低 2GB，推荐 4GB+ |
| **磁盘空间** | 至少 16-20GB |

> Windows 用户可使用**原生 Windows Hub 应用**、**PowerShell CLI 安装器**或 **WSL2 Gateway**。

---

## 🪟 二、Windows 系统部署

### 方式一：一键安装脚本（最推荐）

这是最简单、最快捷的方式，脚本会自动处理 Node.js 环境、权限配置和依赖安装，整个过程 **5-10 分钟**即可完成。

**步骤：**

1. **以管理员身份运行 PowerShell**：右键点击“开始”菜单 → 选择“终端(管理员)”。
2. **解锁脚本执行权限**：
   ```powershell
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
   ```
   提示确认时输入 `Y` 或 `A`。
3. **执行一键安装命令**：
   ```powershell
   iwr -useb https://openclaw.ai/install.ps1 | iex
   ```
   如果下载速度慢，可使用国内镜像：
   ```powershell
   iwr -useb https://clawd.org.cn/install.ps1 | iex
   ```
4. **验证安装**：关闭管理员 PowerShell，打开普通 PowerShell，执行：
   ```powershell
   openclaw --version
   ```
   显示版本号即表示安装成功。

### 方式二：Windows Hub 原生应用

Windows 桌面用户可安装官方的 **Windows Hub** 配套应用，包含安装、托盘状态、聊天、Node 模式和本地 MCP 模式。

### 方式三：npm / pnpm 全局安装

适合已自行管理 Node.js 环境的用户。

**npm：**
```powershell
npm install -g openclaw@latest
openclaw onboard --install-daemon
```

**pnpm：**
```powershell
pnpm add -g openclaw@latest
pnpm approve-builds -g
openclaw onboard --install-daemon
```
> pnpm 需要显式批准带有构建脚本的包。

### 方式四：WSL2 部署

WSL2 环境稳定性更好，安装方法与 Linux 系统一致。

### 方式五：源码构建

适合贡献者或需要从本地代码库运行的用户：
```powershell
git clone https://github.com/openclaw/openclaw.git
cd openclaw
pnpm install && pnpm build && pnpm ui:build
pnpm link --global
openclaw onboard --install-daemon
```

### 方式六：图形化安装（小白专用）

下载 `OpenClaw-Manager-Windows-setup.exe`，双击安装，打开后点击“安装 OpenClaw”即可。

---

## 🍎 三、macOS 系统部署

### 系统要求
- **最低版本**：macOS 12 Monterey
- **推荐版本**：macOS 13 Ventura / 14 Sonoma
- **硬件**：Apple Silicon M1 及以上芯片（推荐）

### 方式一：一键安装脚本（最推荐）

```bash
curl -fsSL https://openclaw.ai/install.sh | bash
```

脚本会自动检测并安装 Node.js（如需要），然后安装 OpenClaw 并启动初始化向导。

### 方式二：Homebrew + npm 安装

```bash
# 通过 Homebrew 安装基础依赖
brew install node wget curl

# 解决权限问题（首次运行需执行）
sudo chown -R $(whoami) /usr/local/lib/node_modules

# 全局安装 OpenClaw
npm install -g openclaw@latest

# 启动初始化向导（自动安装 LaunchAgent 服务）
openclaw onboard --install-daemon
```

### 方式三：pnpm 全局安装

```bash
pnpm add -g openclaw@latest
pnpm approve-builds -g
openclaw onboard --install-daemon
```

### 方式四：源码构建

```bash
git clone https://github.com/openclaw/openclaw.git
cd openclaw
pnpm install && pnpm build && pnpm ui:build
pnpm link --global
openclaw onboard --install-daemon
```

### 方式五：服务管理（macOS 特有）

macOS 通过 **LaunchAgent** 管理服务：
```bash
# 安装并启动 LaunchAgent 服务
openclaw onboard --install-daemon
# 或单独安装
openclaw gateway install
```

### 方式六：macOS 虚拟机部署

适用于在 Apple Silicon Mac（M1/M2/M3/M4）上运行 macOS Sequoia 或更新版本。通过 SSH 进入虚拟机，然后按照标准安装流程操作。

---

## 🐧 四、Linux 系统部署

### 系统要求
- **Ubuntu 20.04+** / **CentOS 8+**
- 生产环境建议 **≥16GB 内存**

### 方式一：一键安装脚本（最推荐）

```bash
curl -fsSL https://openclaw.ai/install.sh | bash
```

脚本会自动识别发行版，选择对应的包管理器，安装 Node.js 并完成 OpenClaw 安装。国内用户可使用镜像：
```bash
curl -fsSL https://clawd.org.cn/install.sh | bash
```

### 方式二：不运行初始化向导的安装

```bash
curl -fsSL https://openclaw.ai/install.sh | bash -s -- --no-onboard
```

### 方式三：本地前缀安装（`install-cli.sh`）

当你希望将 OpenClaw 和 Node 安装在本地前缀下（如 `~/.openclaw`），不依赖系统级 Node 安装时使用：
```bash
curl -fsSL https://openclaw.ai/install-cli.sh | bash
```

### 方式四：npm / pnpm 全局安装

**npm：**
```bash
npm install -g openclaw@latest
openclaw onboard --install-daemon
```

**pnpm：**
```bash
pnpm add -g openclaw@latest
pnpm approve-builds -g
openclaw onboard --install-daemon
```

### 方式五：从 GitHub main 分支安装

```bash
curl -fsSL --proto '=https' --tlsv1.2 https://openclaw.ai/install.sh | bash -s -- --install-method git --version main
```

### 方式六：源码构建

```bash
git clone https://github.com/openclaw/openclaw.git
cd openclaw
pnpm install && pnpm build && pnpm ui:build
pnpm link --global
openclaw onboard --install-daemon
```

### 方式七：系统服务管理（Linux 特有）

OpenClaw 默认安装 **systemd 用户服务**：
```bash
# 安装并启动 systemd 用户服务
openclaw onboard --install-daemon
# 或单独安装
openclaw gateway install
```

对于共享服务器或永久运行的服务器，可使用系统服务。自定义 systemd 单元文件位置：
```
~/.config/systemd/user/openclaw-gateway[-<profile>].service
```

### 方式八：VPS 快速部署（初学者路径）

```bash
# 1. 安装 Node 24（推荐）
# 2. 全局安装 OpenClaw
npm install -g openclaw@latest
# 3. 安装并启动服务
openclaw onboard --install-daemon
# 4. 从本地电脑 SSH 端口转发
ssh -N -L 18789:127.0.0.1:18789 <user>@<host>
# 5. 浏览器访问
http://127.0.0.1:18789/
```

---

## 🐳 五、Docker 部署（跨平台）

Docker 是**容器化部署的首选方案**，适用于需要隔离、可丢弃的 Gateway 环境，或在没有本地安装的主机上运行 OpenClaw。

### 前置条件
- Docker Desktop（或 Docker Engine）+ Docker Compose v2
- 镜像构建至少需要 **2GB RAM**（1GB 主机上 `pnpm install` 可能因 OOM 被终止）

### 方式一：源码构建 Docker 镜像（推荐）

```bash
# 克隆仓库
git clone https://github.com/openclaw/openclaw.git
cd openclaw

# 运行官方 Docker 构建脚本
./scripts/docker/setup.sh
```

设置脚本会自动运行新手引导，提示输入 API key，生成 Gateway 令牌并写入 `.env`，然后通过 Docker Compose 启动 Gateway。

### 方式二：使用预构建镜像

预构建镜像发布在 **GitHub Container Registry**：
```
ghcr.io/openclaw/openclaw
```
常用标签：`main`、`latest`、`<version>`（如 `2026.2.26`）。

```bash
export OPENCLAW_IMAGE="ghcr.io/openclaw/openclaw:latest"
./scripts/docker/setup.sh
```

### 方式三：环境变量配置

设置脚本接受以下可选环境变量：

| 变量 | 用途 |
| :--- | :--- |
| `OPENCLAW_IMAGE` | 使用远程镜像而非本地构建 |
| `OPENCLAW_DOCKER_APT_PACKAGES` | 构建期间安装额外 apt 包 |
| `OPENCLAW_EXTENSIONS` | 构建时包含选定的内置插件助手 |
| `OPENCLAW_EXTRA_MOUNTS` | 额外主机绑定挂载 |
| `OPENCLAW_HOME_VOLUME` | 将 `/home/node` 持久化到具名 Docker 卷 |
| `OPENCLAW_SKIP_ONBOARDING` | 跳过交互式新手引导 |

### 方式四：访问控制 UI

浏览器打开 `http://127.0.0.1:18789/`，粘贴配置好的共享密钥即可。

---

## ☁️ 六、云平台与 VPS 部署

OpenClaw 支持部署到多种云平台：

| 平台 | 文档参考 |
| :--- | :--- |
| **VPS / 裸机** | [VPS 部署指南](https://docs.openclaw.ai/zh-TW/vps) |
| **Docker VM** | [Docker VM 运行时](https://docs.openclaw.ai/zh-TW/install/docker-vm-runtime) |
| **Kubernetes** | [K8s 部署](https://docs.openclaw.ai/zh-TW/install/kubernetes) |
| **Fly.io** | [Fly.io 部署](https://docs.openclaw.ai/zh-TW/install/fly) |
| **Hetzner** | [Hetzner 部署](https://docs.openclaw.ai/zh-TW/install/hetzner) |
| **GCP** | [GCP 部署](https://docs.openclaw.ai/zh-TW/install/gcp) |
| **Azure** | [Azure 部署](https://docs.openclaw.ai/zh-TW/install/azure) |
| **Railway** | [Railway 部署](https://docs.openclaw.ai/zh-TW/install/railway) |
| **Render** | [Render 部署](https://docs.openclaw.ai/zh-TW/install/render) |

---

## ⚙️ 七、通用后续步骤：初始化与验证

无论采用哪种部署方式，安装完成后都需要进行初始化。

### 1. 运行初始化向导

```bash
openclaw onboard
```

向导会引导你完成：
- 选择模型提供商（如千问、Kimi、OpenAI 等）
- 设置 API Key
- 配置 Gateway

如果想同时安装为系统服务：
```bash
openclaw onboard --install-daemon
```

### 2. 快速启动模式

```bash
openclaw onboard --flow quickstart
```

### 3. 启动服务

```bash
openclaw start
```

### 4. 验证安装

```bash
openclaw --version
```

### 5. 访问 Web 管理面板

浏览器打开 `http://127.0.0.1:18789`。

---

## 🧹 八、跨平台通用安装方式对比

| 安装方式 | 适用平台 | 适用场景 | 难度 |
| :--- | :--- | :--- | :--- |
| **一键安装脚本** | 全平台 | 新手首选，最快部署 | ⭐ |
| **Windows Hub** | Windows | 桌面原生体验 | ⭐ |
| **npm 全局安装** | 全平台 | 标准部署，已装 Node | ⭐⭐ |
| **pnpm 全局安装** | 全平台 | 更高效的包管理 | ⭐⭐ |
| **bun 全局安装** | 全平台 | 极速安装体验 | ⭐⭐ |
| **本地前缀安装** | 全平台 | 隔离环境，不依赖系统 Node | ⭐⭐ |
| **源码构建** | 全平台 | 开发调试、贡献代码 | ⭐⭐⭐ |
| **Docker** | 全平台 | 生产环境、环境隔离 | ⭐⭐⭐ |
| **云平台一键部署** | 云端 | 生产环境快速上线 | ⭐⭐ |

---

## ❓ 九、常见问题排查

### 1. `openclaw` 命令找不到

如果安装成功但终端找不到 `openclaw` 命令：
```bash
# 查看 npm 全局 bin 目录
npm prefix -g
# 将其添加到 shell 启动文件 (~/.zshrc 或 ~/.bashrc)
echo 'export PATH="$(npm prefix -g)/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

### 2. `sharp` 构建错误

如果 `sharp` 因全局安装的 libvips 而失败：
```bash
# 清理缓存后重新安装
pnpm store prune
rm -rf node_modules
pnpm install
```

### 3. pnpm 需要批准构建脚本

```bash
pnpm approve-builds -g
```

### 4. 端口被占用

```bash
# 查找占用 18789 端口的进程
sudo lsof -i :18789
# 终止冲突进程
sudo kill -9 <PID>
```

### 5. Docker 镜像拉取失败

- 确认使用正确的镜像名：`ghcr.io/openclaw/openclaw:latest`
- 或使用源码构建方式：`./scripts/docker/setup.sh`

---

## 📚 十、参考资源

- **官方文档**：[https://docs.openclaw.ai/](https://docs.openclaw.ai/)
- **GitHub 仓库**：[https://github.com/openclaw/openclaw](https://github.com/openclaw/openclaw)
- **GitHub Container Registry**：[https://github.com/openclaw/openclaw/pkgs/container/openclaw](https://github.com/openclaw/openclaw/pkgs/container/openclaw)
- **npm 包**：[https://www.npmjs.com/package/openclaw](https://www.npmjs.com/package/openclaw)