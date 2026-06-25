DeerFlow 具备上传、处理和“发送”文件的能力。它的运作更像一个“AI生产力工厂”：

· 📤 上传文件：你可以通过它的 HTTP API 接口，将文件上传到对话线程中作为输入。例如给AI一份PDF让它分析。
· 📥 “发送/产出”文件：DeerFlow 生成的所有文件（报告、代码、视频等）都会以 “Artifacts”（工件） 的形式被系统自动跟踪和保存。你可以在前端界面浏览、查看、下载这些文件，相当于把产出“发送”给了你。
· 🎬 视频处理：它内置了图文与视频创作技能，可通过结构化提示词和Python脚本生成高质量视频。

⚙️ 如何实现？

DeerFlow 通过 API 和 沙箱 实现这一切：

· 上传：通过 claude-to-deerflow 等技能调用上传 API 完成。
· 处理与产出：文件上传后，AI 在沙箱环境中处理，并将结果保存为 Artifacts。
· 获取：最后通过前端界面或 Artifacts API 下载。

所以，DeerFlow 能满足你“上传视频、发送文件”的需求。


DeerFlow 完全指南：从入门到精通

目录

1. 引言：AI 智能体的“操作系统”时代
2. DeerFlow 核心概念与架构
3. 环境准备
4. 部署指南
5. 配置详解
6. 使用指南
7. 高级主题：多智能体编排
8. AI DevOps：让 Agent 管理 DeerFlow
9. 故障排除与最佳实践
10. 常见问题解答
11. 总结与展望

12. 引言：AI 智能体的“操作系统”时代

1.1 什么是 DeerFlow？

DeerFlow（全称 Deep Exploration and Efficient Research Flow）是字节跳动开源的新一代多智能体（Multi-Agent）编排框架。DeerFlow 2.0 是一个生产级的超级智能体编排系统（Super-Agent Harness），专为长时任务（Long-Horizon Tasks）、多智能体委派（Multi-Agent Delegation）、沙盒执行（Sandboxed Execution）和基于技能的可扩展性（Skills-based Extensibility） 而设计。

简单来说，DeerFlow 不是一个简单的“聊天机器人”，而是一个能让 AI 真正“干活”的执行系统。它标志着 AI 从“对话式 AI”走向“可持续执行任务的智能体系统”。

1.2 DeerFlow 2.0 的重大变革

DeerFlow 2.0 是一次完全重写（full rewrite），与 1.x 分支没有任何代码共享。这意味着：

· 如果你是新用户，直接使用 main 分支
· 1.x 分支仅用于需要遗留行为的特定场景

GitHub 星标已超过 4.4 万，成为全球最热门的开源 AI 项目之一。

1.3 为什么 DeerFlow 如此受关注？

许多 AI 工具只擅长单一环节：代码生成、聊天自动化或研究辅助。DeerFlow 的目标是跨环节的编排（orchestration across steps） 。

其核心价值在于：

· 不只是“说”：能真正“做”——执行代码、操作文件、生成产物
· 不只是“单兵”：能组织“团队”——多智能体分工协作
· 不只是“一次”：能“持续运行”——支持数小时级的长时任务

正如社区所说：“DeerFlow 更像一个'自动化系统'，而不是一个'对话工具'” 。

2. DeerFlow 核心概念与架构

2.1 总体架构：四层设计

DeerFlow 2.0 采用工程化智能体系统的设计理念，核心由三大模块构成：

第一层：多智能体协作层（Multi-Agent）

一个任务不再由单个 Agent 完成，而是由多个专业角色分工协作：

角色 职责
Planner（规划器） 任务拆解与计划制定
Executor（执行器） 具体任务的执行
Researcher（研究员） 信息收集与资料检索
Reviewer（校验员） 结果校验与质量把关

这种设计让智能体具备了 “团队协作”能力。研究团队机制允许用户定义智能体的角色分工与协作策略。

第二层：沙盒执行层（Sandbox）

DeerFlow 内置安全隔离的执行环境：

· 可直接运行 Python / Shell 代码
· 可访问文件系统进行读写操作
· 支持任务中间结果持久化

这是 DeerFlow 与传统聊天机器人的本质区别——它不仅能“说”，更能“做”。

第三层：记忆系统层（Memory）

内置多层记忆架构：

· 短期上下文：当前任务的工作记忆
· 长期记忆：跨会话的历史经验
· 外部知识：可扩展的知识库接入

记忆系统让智能体不再每次从零开始，能够积累经验、持续进化。

第四层：通道连接层（Channel Connectivity）

DeerFlow 支持通过消息通道接收任务，包括 Telegram、Slack、飞书（Feishu/Lark） 等。这使得 DeerFlow 不仅适用于终端操作，也能融入团队工作流。

2.2 核心能力详解

2.2.1 技能与工具系统（Skills & Tools）

DeerFlow 渐进式加载技能，不会一次性将所有能力注入上下文，这对 Token 敏感的大模型和长会话非常友好。

系统支持：

· 内置工具：开箱即用的基础能力
· 自定义工具：用户可扩展的工具
· MCP 服务器集成：支持 MCP（模型上下文协议）标准

2.2.2 子智能体委派（Sub-Agent Delegation）

主智能体（Lead Agent）可以将任务委派给子智能体，每个子智能体拥有独立的上下文。

适用场景包括：

· 仓库分析 + 测试规划 + 重构提案
· 研究 + 实现 + 文档交接
· 内容生成流水线 + 独立验证步骤

2.2.3 上下文工程与摘要（Context Engineering）

DeerFlow 强调上下文压缩和子智能体上下文隔离，帮助长时工作流避免上下文膨胀（context bloat） ，确保在长时间运行中保持质量稳定。

2.3 服务架构：四容器设计

在 Docker 部署模式下，DeerFlow 由四个核心服务组成：

服务 容器名 端口 职责
Nginx deer-flow-nginx 2026 统一入口、反向代理、SSE 流式支持
Gateway API deer-flow-gateway 8001 FastAPI + LangGraph 运行时，管理模型、记忆和工具执行
Frontend deer-flow-frontend 3000 Next.js Web 应用界面
Provisioner deer-flow-provisioner 8002 K8s 沙箱 Pod 生命周期管理（可选）

Nginx 作为统一入口，根据路径前缀进行路由分发：

· /api/* → Gateway API（端口 8001）
· 非 API 请求 → Frontend（端口 3000）
· /health → Provisioner（端口 8002，可选）

3. 环境准备

3.1 硬件要求

最低配置（体验/测试） ：

· CPU：2 核
· 内存：4 GB
· 磁盘：20 GB

推荐配置（生产/正式使用） ：

· CPU：4 核
· 内存：8 GB
· 磁盘：40 GB

3.2 软件依赖

依赖 版本要求 说明
Docker 最新稳定版 容器运行时
Docker Compose v2 或更高 多容器编排
Git 最新版 代码克隆
Python 3.12+ 本地开发模式需要
Node.js 22+ 本地开发模式需要

3.3 Manjaro 系统准备

如果你在 Manjaro 虚拟机上部署，请先完成以下步骤：

```bash
# 1. 更新系统
sudo pacman -Syu

# 2. 安装必要工具
sudo pacman -S git base-devel curl

# 3. 安装 Docker
sudo pacman -S docker

# 4. 启动 Docker 服务
sudo systemctl enable --now docker

# 5. 将当前用户加入 docker 组（需重新登录生效）
sudo usermod -aG docker $USER

# 6. 验证 Docker 安装
docker --version
docker-compose --version
```

3.4 关闭 Swap（K8s 部署需要）

如果后续计划使用 Kubernetes 沙箱功能，需要关闭 Swap：

```bash
sudo swapoff -a
# 永久禁用：注释掉 /etc/fstab 中的 swap 行
```

4. 部署指南

DeerFlow 支持三种部署模式：

模式 命令 适用场景
本地开发 ./scripts/serve.sh --dev 快速迭代、热重载
Docker 开发 make docker-start 隔离的开发环境
Docker 生产 docker-compose up -d 生产级稳定部署

对于大多数用户，Docker 部署是最推荐的方式。

4.1 方式一：Docker 部署（推荐）

步骤 1：克隆项目

```bash
git clone https://github.com/bytedance/deer-flow.git
cd deer-flow
```

步骤 2：初始化配置

```bash
make config
```

此命令会从模板复制完整的 config.example.yaml 到项目根目录。

或者，使用交互式配置向导（推荐新手）：

```bash
make setup
```

这个向导会引导你完成：

· 选择 LLM 提供商
· 配置可选的网页搜索
· 设置执行/安全偏好
· 生成最小化的 config.yaml 并写入 .env

运行 make doctor 可以随时检查系统依赖是否就绪。

步骤 3：编辑配置文件

编辑 config.yaml 和 .env 文件，填入你的模型 API 密钥（详见第 5 章）。

步骤 4：启动服务

开发模式（支持热重载）：

```bash
docker-compose -f docker/docker-compose-dev.yaml up -d
```

生产模式（代码打包进镜像，更稳定）：

```bash
docker-compose up -d
```

两种模式都将应用暴露在 http://localhost:2026。

步骤 5：验证部署

```bash
# 检查所有容器状态
docker-compose ps

# 查看日志
docker-compose logs --tail=50

# 检查服务健康
curl http://localhost:2026
```

4.2 方式二：本地开发部署

对于需要频繁修改代码的开发者：

```bash
# 1. 安装 Python 依赖
uv venv
source .venv/bin/activate
uv pip install -e ".[dev]"

# 2. 安装前端依赖
cd frontend
pnpm install
cd ..

# 3. 启动服务
./scripts/serve.sh --dev
```

4.3 方式三：Kubernetes 部署（进阶）

DeerFlow 支持基于 Kubernetes 的沙箱 Provisioner，通过 K8s API 管理沙箱 Pod 的生命周期。

此模式适用于生产级大规模部署，需要预先配置 K8s 集群。Provisioner 服务提供 REST API 用于沙箱生命周期管理。

5. 配置详解

5.1 双层配置策略

DeerFlow 采用双层配置策略，分离应用逻辑和环境敏感信息：

文件 用途 是否提交 Git
config.yaml 主配置文件：模型清单、工具组、沙箱提供商、系统行为 ✅ 是
.env 敏感密钥：API Key、密钥等 ❌ 否（加入 .gitignore）

.env 中的值通过变量替换在 YAML 中引用：

```yaml
api_key: $OPENAI_API_KEY
```

5.2 配置生成与升级

命令 作用
make config 复制完整的 config.example.yaml 模板
make setup 交互式向导，生成最小化配置
make doctor 检查系统依赖
make config-upgrade 合并新字段，升级现有配置

重要：确保 config.yaml 中的 config_version 与最新示例匹配（当前为 14）。如果版本过旧，应用会发出警告。

5.3 模型配置

模型在 config.yaml 的 models: 列表中定义：

```yaml
models:
  - name: gpt-4  # 唯一内部标识符[reference:64]
    use: langchain_openai.ChatOpenAI  # 类路径[reference:65]
    model_name: gpt-4-turbo
    temperature: 0.7
    api_key: $OPENAI_API_KEY  # 从 .env 读取
```

DeerFlow 采用与 LiteLLM 兼容的配置格式，灵活支持多种模型服务提供商。

5.4 通道配置

支持通过消息通道接收任务：

```yaml
channels:
  - type: feishu  # 飞书
    webhook_url: $FEISHU_WEBHOOK
  - type: telegram
    bot_token: $TELEGRAM_BOT_TOKEN
```

6. 使用指南

6.1 首次启动

部署完成后，打开浏览器访问 http://你的服务器IP:2026。

首次使用步骤：

1. 点击界面上的 “WebUI” 按钮进入操作界面
2. 在左侧找到红色的启动按钮并点击（初始化研究环境）
3. 在输入框中提出你的第一个任务

6.2 典型任务示例

示例 1：深度研究

```
帮我研究一下人工智能在医疗诊断中的应用现状，并生成一份总结报告
```

DeerFlow 会自动：

· 研究员智能体搜索最新的相关论文和新闻
· 编码员智能体运行数据分析代码
· 报告员智能体整理成结构化报告

几分钟后，你将得到一份包含研究背景、主要发现、数据支撑和结论建议的完整报告。

示例 2：代码分析与测试

```
帮我分析这个仓库的结构，并生成测试方案
```

DeerFlow 会自动：读代码 → 分析模块 → 输出测试策略。

示例 3：自动化测试

```
根据这份需求文档，生成接口测试用例并执行
```

DeerFlow 会自动：生成接口脚本 → 调用 API → 校验返回 → 输出报告。

6.3 工作流全景

DeerFlow 能完成的典型长链路任务包括：

```
读取需求文档 → 拆分功能模块 → 生成代码 → 执行测试 → 输出报告
```

关键不是单点能力，而是能把多个步骤串起来自动跑完。

7. 高级主题：多智能体编排

7.1 多智能体协作机制

DeerFlow 的多智能体协作基于 “主从（Lead-Follower）”模式：

1. 主智能体（Lead Agent） 接收用户任务
2. 主智能体进行任务拆解与规划
3. 主智能体将子任务委派给子智能体（Sub-Agents）
4. 子智能体在独立上下文中执行任务
5. 子智能体将结果返回主智能体
6. 主智能体汇总结果并输出

7.2 并发控制

DeerFlow 支持子智能体并发编排。系统通过中间件链（Middleware Chain） 控制并发数量，防止资源过载。

7.3 14 层中间件架构

DeerFlow 2.0 的核心创新之一是构建了 14 层严格有序的中间件链（Middleware Chain） 。这个 “洋葱模型” 架构确保：

· 请求按顺序经过各层中间件
· 每层可进行预处理和后处理
· 实现了动态工具过滤和沙盒隔离等能力

8. AI DevOps：让 Agent 管理 DeerFlow

这是本教程的核心部分——教你如何让本地 Agent 通过修改 YAML 文件来管理 DeerFlow 本身，实现“AI 管理 AI”的 DevOps 闭环。

8.1 核心理念：声明式运维

核心理念：你只需要告诉 Agent “想要什么状态” ，Agent 负责修改 YAML 配置文件，Docker Compose 负责执行变更。

这个模式的优势：

· 声明式管理：关注“目标状态”而非“执行步骤”
· 版本可追溯：YAML 文件可存入 Git
· AI 友好：LLM 擅长生成和修改 YAML 等结构化文本

8.2 指令集设计

以下是为 DeerFlow 设计的完整指令集，让你的 Agent 能够通过自然语言管理整个系统。

8.2.1 部署与环境初始化指令

指令 Agent 执行动作
deploy deerflow git clone → make setup → 生成 config.yaml 和 .env
deploy deerflow --mode production 使用 docker-compose.yaml（生产模式）
deploy deerflow --mode development 使用 docker-compose-dev.yaml（开发模式）
doctor 执行 make doctor 检查系统依赖

8.2.2 配置管理指令

指令 Agent 执行动作
show config 读取并展示 config.yaml 关键配置
edit config models add <provider> 在 models: 列表中添加新模型
edit config sandbox set <mode> 修改沙箱模式：local/docker/provisioner
edit config memory set <type> 修改记忆后端：sqlite/postgres
upgrade config 执行 make config-upgrade 合并新字段
set env <KEY>=<value> 写入 .env 文件
show env 读取并展示 .env 中的密钥（脱敏显示）

8.2.3 服务生命周期管理指令

指令 Agent 执行动作
start docker-compose up -d
stop docker-compose down
restart docker-compose restart
rebuild docker-compose up -d --build
status docker-compose ps，解析并展示各服务状态
logs [service] docker-compose logs --tail=50 [service]
scale <service>=<replicas> 修改 docker-compose.yaml 中 replicas 字段 → docker-compose up -d

8.2.4 智能体与技能管理指令

指令 Agent 执行动作
list agents 读取 config.yaml 中定义的 Agent 配置
list skills 读取技能列表
enable skill <name> 修改配置启用技能
disable skill <name> 修改配置禁用技能
add tool <name> 在 config.yaml 的 tool_groups 中添加新工具
create agent <name> --model <model> 在 config.yaml 中定义新的子 Agent 配置

8.2.5 沙箱与执行环境指令

指令 Agent 执行动作
sandbox status 检查 Provisioner 服务健康状态
sandbox create --type <local/docker/k8s> 修改沙箱配置并重启 Provisioner
sandbox list 通过 Provisioner API 列出当前运行的沙箱
sandbox kill <id> 调用 Provisioner API 终止指定沙箱

8.2.6 监控与诊断指令

指令 Agent 执行动作
health 依次检查各服务端口（2026、8001、3000、8002）是否响应
memory usage 检查 DEER_FLOW_HOME 目录大小（默认 backend/.deer-flow）
version 读取 config.yaml 中的 config_version

8.3 典型执行流程示例

场景一：切换模型提供商

用户：“把模型从 OpenAI 切换到豆包”

Agent 执行流程：

1. 读取 config.yaml
2. 定位 models: 列表
3. 将 use 字段改为豆包类路径
4. 将 api_key 改为 $VOLCENGINE_API_KEY
5. 写入 .env 设置 VOLCENGINE_API_KEY
6. 执行 docker-compose restart gateway
7. 验证 curl http://localhost:8001/health
8. 报告：“已切换至豆包模型，服务正常”

场景二：调整子 Agent 并发数

用户：“把子 Agent 并发数调到 5”

Agent 执行流程：

1. 读取 config.yaml
2. 定位 max_concurrent_sub_agents 字段
3. 修改为 5
4. 执行 docker-compose restart gateway
5. 报告：“并发数已调整为 5”

场景三：完整部署流程

用户：“在一台新机器上部署 DeerFlow 生产环境”

Agent 执行流程：

1. 执行 git clone https://github.com/bytedance/deer-flow.git
2. 执行 cd deer-flow
3. 执行 make config
4. 提示用户输入各 API Key，写入 .env
5. 执行 docker-compose up -d
6. 等待所有容器启动
7. 执行 docker-compose ps 验证状态
8. 执行 curl http://localhost:2026 验证可访问
9. 报告：“DeerFlow 生产环境已成功部署，访问地址：http://localhost:2026”

8.4 安全注意事项

序号 规则 说明
1 修改前备份 Agent 修改任何 YAML 前，先执行 cp config.yaml config.yaml.bak
2 语法校验 修改后执行 docker-compose config 校验语法
3 密钥隔离 API 密钥必须放在 .env，绝不能写入 config.yaml
4 权限最小化 Agent 仅授予项目目录读写权限
5 操作审计 所有修改操作记录时间戳和变更内容

9. 故障排除与最佳实践

9.1 常见问题与解决方案

问题 1：容器启动失败

```bash
# 查看详细日志
docker-compose logs --tail=100

# 检查端口是否被占用
sudo netstat -tlnp | grep -E "2026|8001|3000|8002"
```

问题 2：模型连接失败

· 检查 .env 中的 API Key 是否正确
· 确认网络能访问模型 API 端点
· 运行 make doctor 检查配置

问题 3：配置版本警告

```
WARNING: config_version is outdated
```

运行 make config-upgrade 合并新字段。

问题 4：磁盘空间不足

DeerFlow 的运行时数据存储在 DEER_FLOW_HOME（默认 backend/.deer-flow）。检查并清理：

```bash
du -sh backend/.deer-flow
```

9.2 性能优化建议

1. 合理配置并发数：根据硬件资源调整 max_concurrent_sub_agents
2. 使用生产模式：生产环境使用 docker-compose.yaml 而非开发模式
3. 数据持久化：确保 DEER_FLOW_HOME 挂载到持久存储
4. 日志轮转：配置日志轮转避免磁盘占满

9.3 安全最佳实践

1. 永不提交 .env：确保 .env 在 .gitignore 中
2. 定期更新：定期 git pull 获取最新安全补丁
3. 沙箱隔离：生产环境启用 K8s 沙箱 Provisioner
4. 网络隔离：DeerFlow 服务仅在内网暴露

5. 常见问题解答

Q1：DeerFlow 和 LangChain 是什么关系？

DeerFlow 基于 LangGraph 和 LangChain 构建，可以理解为在 LangChain 生态之上构建的更高层次的编排框架。

Q2：DeerFlow 支持哪些大模型？

DeerFlow 采用与 LiteLLM 兼容的配置格式，支持 OpenAI、Claude、豆包、DeepSeek 等主流模型。

Q3：DeerFlow 和豆包是什么关系？

它们是 “黄金搭档” 而非“父子关系”：

· 豆包：提供智能的 “大脑” （大模型）
· DeerFlow：让“大脑”去干活的 “身体” （编排框架）

Q4：DeerFlow 能在 Windows 上运行吗？

可以。通过 Docker Desktop 或 WSL2 即可在 Windows 上运行 DeerFlow。

Q5：DeerFlow 是免费的吗？

是的。DeerFlow 采用 MIT 许可证，可自由使用、修改、分发甚至商业化。

Q6：DeerFlow 2.0 和 1.x 有什么区别？

DeerFlow 2.0 是完全重写，与 1.x 分支没有任何代码共享。建议新用户直接使用 2.0。

Q7：如何升级 DeerFlow？

```bash
git pull
make config-upgrade  # 合并新配置字段[reference:102]
docker-compose down
docker-compose up -d --build
```

Q8：DeerFlow 支持 MCP 协议吗？

支持。DeerFlow 支持 MCP 服务器集成。

11. 总结与展望

11.1 核心要点回顾

维度 核心内容
定位 字节跳动开源的生产级多智能体编排框架
核心能力 多智能体协作 + 沙盒执行 + 分层记忆 + 技能扩展
部署方式 Docker（推荐）/ 本地开发 / Kubernetes
配置策略 config.yaml + .env 双层配置
服务架构 Nginx + Gateway + Frontend + Provisioner

11.2 DeerFlow 的意义

DeerFlow 的出现标志着 AI 的一个重要转折点：

AI 已经从“辅助工具”进入“执行系统”阶段。

不再只是 Copilot（副驾驶），而是可以 “接活干活”的 Agent（自动驾驶）。

对于开发者来说：

· 会写脚本，不再是优势
· 会设计 “智能体流程” ，才是新的分水岭

11.3 下一步学习路径

1. 入门：完成 Docker 部署，跑通第一个研究任务
2. 进阶：自定义技能和工具，接入自己的模型
3. 高级：配置多智能体协作，部署 K8s 沙箱
4. 专家：贡献代码到开源社区，参与架构设计

11.4 资源链接

· GitHub 仓库：https://github.com/bytedance/deer-flow
· 官方文档：https://deerflow.tech
· DeepWiki：https://deepwiki.com/bytedance/deer-flow

附录 A：完整配置示例

A.1 docker-compose.yaml（生产模式）

```yaml
version: '3.8'

services:
  nginx:
    image: nginx:alpine
    container_name: deer-flow-nginx
    ports:
      - "2026:2026"
    volumes:
      - ./docker/nginx/nginx.conf:/etc/nginx/conf.d/default.conf
    depends_on:
      - gateway
      - frontend

  gateway:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: deer-flow-gateway
    environment:
      - DEER_FLOW_HOME=/app/.deer-flow
    volumes:
      - ./backend/.deer-flow:/app/.deer-flow
      - ./config.yaml:/app/config.yaml
    ports:
      - "8001:8001"

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    container_name: deer-flow-frontend
    ports:
      - "3000:3000"
```

A.2 .env 示例

```env
# 模型 API Keys
OPENAI_API_KEY=sk-xxx
VOLCENGINE_API_KEY=xxx
ANTHROPIC_API_KEY=sk-ant-xxx

# 通道配置
FEISHU_WEBHOOK=https://open.feishu.cn/open-apis/bot/v2/hook/xxx
TELEGRAM_BOT_TOKEN=xxx:xxx
```

A.3 config.yaml 核心片段

```yaml
config_version: 14

models:
  - name: default
    use: langchain_openai.ChatOpenAI
    model_name: gpt-4-turbo
    temperature: 0.7
    api_key: $OPENAI_API_KEY

sandbox:
  provider: docker  # local | docker | provisioner

memory:
  backend: sqlite  # sqlite | postgres

max_concurrent_sub_agents: 3
```

附录 B：命令速查表

命令 用途
git clone https://github.com/bytedance/deer-flow.git 克隆项目
make config 生成配置模板
make setup 交互式配置向导
make doctor 检查系统依赖
make config-upgrade 升级配置文件
docker-compose up -d 生产模式启动
docker-compose -f docker/docker-compose-dev.yaml up -d 开发模式启动
docker-compose down 停止服务
docker-compose ps 查看服务状态
docker-compose logs --tail=50 查看最近日志
docker-compose restart gateway 重启 Gateway 服务
docker-compose up -d --build 重新构建并启动

附录 C：术语表

术语 解释
Agent（智能体） 能够自主执行任务的 AI 程序
Multi-Agent（多智能体） 多个智能体协作完成复杂任务
Orchestration（编排） 协调和管理多个智能体的工作流程
Sandbox（沙箱） 隔离的执行环境，用于安全运行代码
Skills（技能） 智能体可调用的能力模块
MCP（模型上下文协议） 智能体与工具通信的标准协议
Long-Horizon Task（长时任务） 需要数小时持续运行的任务
Provisioner 管理沙箱生命周期的服务
LangGraph 基于图结构的工作流编排框架

---

本教程基于 DeerFlow 2.0 编写，项目持续更新中，请以官方文档和 GitHub 仓库的最新信息为准。


DeerFlow 完全教程：从入门到精通

一、DeerFlow 是什么？

DeerFlow（Deep Exploration and Efficient Research Flow）是字节跳动开源的新一代多智能体（Multi-Agent）编排框架。它不是简单的聊天机器人，而是一个集成了多智能体协作、工作流编排、工具调用以及沙箱执行能力的复杂系统。

DeerFlow 2.0 是一次完全重写，与 1.x 分支没有任何代码共享。如果你是新用户，请直接使用 main 分支。

🎯 核心定位

DeerFlow 的目标是提供一个“电池已安装”的 Agent 平台，能够协调子 Agent（Sub-Agent）、记忆（Memory）、沙箱执行环境（Sandbox）和可扩展的技能（Skills）来完成从“研究”“编码”到“产出”的复杂多步骤任务。

一句话总结：DeerFlow 让 AI 从“回答问题”进化到“自己动手干活”。

二、核心架构

DeerFlow 2.0 采用工程化智能体系统的设计理念，核心由三大模块组成。

2.1 多智能体协作（Multi-Agent）

一个任务不再由单个 Agent 完成，而是由多个专业角色分工协作：

角色 职责
协调器（Coordinator） 系统入口，负责接收用户指令，控制整体流程流转
规划器（Planner） 将复杂任务拆解为可执行的子步骤
研究员（Researcher） 调用搜索引擎、网页爬虫、Python 代码解释器等工具获取和处理信息
子智能体（Sub-Agent） 主 Agent 运行时动态生成，每个拥有独立上下文和工具

主 Agent 能够在运行时拆分任务、生成多个子 Agent，每个子 Agent 有独立的上下文、工具与终止条件，支持并行执行并将结构化结果汇总。

2.2 14 层中间件架构

DeerFlow 2.0 构建了 14 层严格有序的中间件链（Middleware Chain） ，采用洋葱模型架构，确保每个处理阶段获得确定性输入，避免竞态条件。这实现了动态工具过滤、沙盒隔离、上下文压缩等核心能力。

2.3 沙箱执行层（Sandbox）

DeerFlow 为每个任务提供隔离的 Docker 容器运行环境，拥有完整文件系统（skills、workspace、uploads、outputs）。Agent 可以在隔离容器中读写文件、执行 Bash 命令、运行长耗时任务，甚至生成 Artifact（制品）。

2.4 记忆系统（Memory）

DeerFlow 支持跨会话的长期记忆，持久化存储用户配置、偏好与累积知识。记忆默认存储在本地，受用户控制，用于提升后续任务的个性化与一致性。

2.5 技能与工具（Skills & Tools）

Skill 是结构化能力模块，以 Markdown 文件描述工作流、最佳实践和参考资源。出厂自带 深度研究、报告生成、幻灯片制作、网页抓取、图像生成 等十余种内置技能。

工具包括网页搜索、文件操作、Bash 执行等，并支持通过 MCP Server 或 Python 函数扩展自定义工具。

三、环境准备

3.1 系统要求

依赖 版本要求 说明
操作系统 Linux / macOS / Windows（需 WSL2） 
Python 3.12 或更高 后端核心语言
Node.js 22 或更高 前端服务支撑
Docker 最新稳定版 运行沙箱环境的核心依赖
内存 建议 8GB+，推荐 16GB+ 保证多智能体并行流畅

3.2 额外工具（可选）

· pnpm：Node.js 包管理器，用于 Web UI
· uv：Python 包管理器
· Git：克隆代码仓库
· make：执行构建命令

3.3 Windows 用户特别注意

在 Windows 上，必须使用 Git Bash 终端执行所有命令。官方文档特别说明：基于 bash 的服务脚本不支持在原生 cmd.exe 或 PowerShell 中执行。

四、部署指南

DeerFlow 支持三种部署模式，官方最推荐 Docker 方式。

4.1 Docker 部署（推荐）

这是最快、最干净的方式，将所有依赖隔离在容器中。

第一步：克隆仓库并生成配置

```bash
git clone https://github.com/bytedance/deer-flow.git
cd deer-flow
make config
```

make config 会基于 config.example.yaml 生成本地配置文件。

第二步：配置大模型 API

编辑根目录下的 config.yaml 文件，至少定义一个模型：

```yaml
models:
  - name: gpt-4
    display_name: GPT-4
    use: langchain_openai.ChatOpenAI
    model: gpt-4
    api_key: $OPENAI_API_KEY
    max_tokens: 4096
    temperature: 0.7
```

API Key 推荐放在 .env 文件中（更安全），或导出为环境变量。

第三步：启动服务

```bash
docker-compose up -d
```

等待镜像拉取完成后，访问 http://localhost:2026 即可使用 Web UI。

如果使用开发模式（支持热更新）：

```bash
docker-compose -f docker/docker-compose-dev.yaml up -d
```

4.2 本地直接部署

本地部署对环境要求更严格，需要手动配置 Node.js 22+、pnpm、uv、nginx。

```bash
# 克隆仓库
git clone https://github.com/bytedance/deer-flow.git
cd deer-flow

# 安装 Python 依赖
uv sync

# 安装 Web UI 依赖（可选）
cd web
pnpm install
cd ..

# 启动服务（仅命令行）
uv run main.py

# 启动服务（带 Web UI）
./bootstrap.sh -d
```

4.3 Kubernetes 部署（生产级）

DeerFlow 支持通过 Provisioner 服务在 Kubernetes 上管理沙箱 Pod 的生命周期。需要在 config.yaml 中将 sandbox.provider 设置为 provisioner。

适用场景：生产级大规模部署，需要预先配置 K8s 集群。

五、配置详解

5.1 核心配置文件

文件 用途
config.yaml 主配置文件：模型、工具、记忆、沙箱、通道等全部配置
.env 敏感环境变量：API Key、密钥等（不提交 Git）

5.2 模型配置

DeerFlow 支持任何实现 OpenAI 兼容 API 的大模型。

```yaml
models:
  - name: deepseek
    display_name: DeepSeek
    use: langchain_openai.ChatOpenAI
    model: deepseek-chat
    api_key: $DEEPSEEK_API_KEY
    base_url: https://api.deepseek.com/v1
    max_tokens: 4096
    temperature: 0.7
```

注意：推荐使用具备长上下文（100k+ tokens）、推理能力、函数调用与多模态能力的模型。

5.3 沙箱配置

DeerFlow 提供三种可插拔的沙箱模式：

```yaml
sandbox:
  provider: docker  # local | docker | provisioner
  # local: 直接在主机运行（最快，隔离最少）
  # docker: Docker 容器隔离（推荐开发）
  # provisioner: K8s Pod 隔离（生产级）
```

5.4 记忆配置

```yaml
memory:
  enabled: true
  # 存储路径默认本地，可配置 Redis 等持久化后端
```

5.5 通道配置

DeerFlow 支持通过消息通道接收任务，包括 Telegram、Slack、飞书（Feishu/Lark） 等：

```yaml
channels:
  - type: feishu
    enabled: true
    app_id: "你的App_ID"
    app_secret: "你的App_Secret"
```

5.6 摘要配置（防止上下文爆炸）

```yaml
summarization:
  enabled: true
  trigger:
    - type: fraction
      value: 0.75  # 上下文使用率达75%时触发摘要
  keep:
    type: tokens
    value: 4000   # 保留最近4000个token
```

这能有效控制长时任务中的上下文窗口膨胀。

六、使用指南

6.1 首次启动

1. 访问 http://localhost:2026（Docker 部署）或 http://localhost:3000（本地部署）
2. 在界面中输入你的第一个任务

6.2 典型任务示例

深度研究：

```
帮我研究人工智能在医疗诊断中的应用现状，并生成一份总结报告
```

DeerFlow 会自动：研究员 Agent 搜索最新论文和新闻 → 编码员 Agent 运行数据分析 → 报告员 Agent 整理成结构化报告。

代码分析与测试：

```
帮我分析这个仓库的结构，并生成测试方案
```

DeerFlow 会自动：读代码 → 分析模块 → 输出测试策略。

自动化测试：

```
根据这份需求文档，生成接口测试用例并执行
```

DeerFlow 会自动：生成接口脚本 → 调用 API → 校验返回 → 输出报告。

6.3 工作流全景

DeerFlow 能完成的典型长链路任务：

```
读取需求文档 → 拆分功能模块 → 生成代码 → 执行测试 → 输出报告
```

关键不是单点能力，而是能把多个步骤串起来自动跑完。

七、高级功能

7.1 自定义 Skill

Skill 是自包含的功能包，存放在 skills/custom/ 目录下。

创建 Skill：

```markdown
---
name: my-data-analyzer
version: 1.0.0
description: 分析用户提供的数据文件并生成报告
author: Your Name
---

# 数据分析技能

你是一个数据分析专家。当用户需要分析数据时，请按以下步骤操作：
1. 识别用户提供的文件路径
2. 使用 pandas 读取数据
3. 执行数据清洗和统计分析
4. 生成包含关键指标的报告
```

配合官方提供的 skill-creator 工具，几分钟就能为智能体扩展新能力。

7.2 对接飞书

在 config.yaml 中配置飞书通道：

```yaml
channels:
  - type: feishu
    enabled: true
    app_id: "你的App_ID"
    app_secret: "你的App_Secret"
    # 可选：限制可用用户
    # allowed_users:
    #   - "user_id_1"
```

DeerFlow 使用 WebSocket 长连接方式接收飞书消息，无需公网 IP。

7.3 MCP 协议集成

DeerFlow 支持 MCP（模型上下文协议）服务器集成，可接入 Claude Code 等工具，在终端完成工具下发、查看与管理操作。

7.4 嵌入式 Python 客户端

DeerFlow 提供 DeerFlowClient 嵌入式 Python 客户端，可在进程内直接调用 Agent 能力，返回与 HTTP Gateway 对齐的响应模式（包括流式事件支持）。

八、安全注意事项

8.1 沙箱逃逸风险

DeerFlow 历史上曾出现过沙箱逃逸漏洞，攻击者可利用缺陷在宿主机上执行任意命令。务必保持 DeerFlow 更新到最新版本。

8.2 最小权限原则

· 只挂载 Agent 任务必需的目录
· 尽量设置 read_only: true
· 不要在沙箱中挂载生产环境的 SSH 密钥

8.3 密钥管理

· API Key 放在 .env 文件中，绝不提交到 Git
· 使用环境变量引用（如 $OPENAI_API_KEY）

8.4 网络隔离

· 生产环境建议将 DeerFlow 服务仅在内网暴露
· 不要将未认证的 DeerFlow 服务暴露到公网

九、故障排查

9.1 Windows 常见问题

问题 解决方案
make config 失败（错误 9009） 安装 Python 或激活 Anaconda 虚拟环境
make init 失败（错误 2） 必须在 Git Bash 终端中执行
找不到 make 命令 通过 GnuWin32 安装 Make for Windows

9.2 通用问题

问题 排查步骤
容器启动失败 docker-compose logs --tail=100 查看日志
模型连接失败 检查 .env 中的 API Key 是否正确
端口被占用 sudo netstat -tlnp \| grep -E "2026\|8001\|3000"
配置版本警告 运行 make config-upgrade 合并新字段

9.3 验证部署

```bash
# 检查所有容器状态
docker-compose ps

# 查看最近日志
docker-compose logs --tail=50

# 检查服务健康
curl http://localhost:2026
```

十、资源链接

资源 地址
GitHub 仓库 https://github.com/bytedance/deer-flow
官方文档 https://deerflow.tech
DeepWiki https://deepwiki.com/bytedance/deer-flow

社区教程推荐

· AgentFramework之DeerFlow：详细攻略
· 从深度研究到全能执行：架构原理与实战部署指南
· 技术小白本地部署 DeerFlow 2.0 指南（含36个常见错误及解决方法）

附录：命令速查表

命令 用途
git clone https://github.com/bytedance/deer-flow.git 克隆项目
make config 生成配置模板
make setup 交互式配置向导
make doctor 检查系统依赖
make config-upgrade 升级配置文件
docker-compose up -d 生产模式启动
docker-compose -f docker/docker-compose-dev.yaml up -d 开发模式启动
docker-compose down 停止服务
docker-compose ps 查看服务状态
docker-compose logs --tail=50 查看最近日志
uv run main.py 本地命令行启动
./bootstrap.sh -d 本地带 Web UI 启动

---

本教程基于 DeerFlow 2.0 编写，项目持续更新中，请以官方文档和 GitHub 仓库的最新信息为准。
