---
title: "Manjaro AI 工作流终极指南"
tags:
  - AI
  - 工作流
  - Manjaro
  - 开发环境
aliases:
  - "Manjaro AI 工作流"
description: "1. 用户输入：`@机器人 帮我写一个 Python 脚本，从 API 获取天气数据，保存到 Obsidian`"
---

## 一、你的环境全景

### 1.1 系统基础
- **操作系统**：Manjaro Linux GNOME 版（Wayland 会话）
- **内核版本**：6.18.33-1-MANJARO
- **Shell**：Zsh（~/.zshrc 已配置代理函数）
- **虚拟化**：VMware 虚拟机（桥接/NAT 混合网络）

### 1.2 网络代理（已完全打通）
- **代理工具**：Clash Verge Rev
- **代理端口**：7897
- **终端代理**：`proxy_on` / `proxy_off` 函数
- **系统代理**：Clash 系统代理已启用
- **强制代理**：`proxychains` 配置完成（/etc/proxychains.conf）
- **验证**：`proxychains curl -I https://registry.npmjs.org` 返回 200

### 1.3 包管理器与镜像
- **pacman**：Manjaro 官方仓库
- **yay**：AUR 助手
- **npm**：已配置代理，可通过 `proxychains` 安装
- **pnpm**：备选包管理器

---

## 二、已部署工具清单

### 2.1 核心基础设施

| 工具 | 状态 | 部署方式 | 访问地址 |
|------|------|----------|----------|
| **1Panel** | ✅ 运行中 | systemd 服务 | `http://172.30.174.180:34357/[安全入口]` |
| **Docker** | ✅ 运行中 | 系统服务 | - |
| **AstrBot** | ✅ 运行中 | Docker（1Panel 管理） | `http://172.30.174.180:6185` |

### 2.2 微信机器人（AstrBot）

| 配置项 | 值 |
|--------|---|
| 容器名 | `astrbot` |
| 镜像 | `soulter/astrbot:latest` |
| 挂载卷 | `/home/nuoxi/Docker/AstrBot/data/astrbot-data:/AstrBot/data` |
| 微信适配器 | `weixin_personal_plzr`（个人微信扫码登录） |
| 管理员 UID | `o9cq8078Jai2ma_R_DxBZmApe4wQ@im.wechat` |
| AI 模型 | DeepSeek API（`https://api.deepseek.com`，模型 `deepseek-v4-pro`） |
| 电脑能力 | `local` 模式（已开启） |

**已上传的 Skills**：
- `obsidian-cli`
- `obsidian-markdown`
- `json-canvas`
- `obsidian-bases`

### 2.3 文本扩展（Espanso）

| 配置项 | 值 |
|--------|---|
| 版本 | 2.3.0 |
| 安装方式 | Debian 包（`espanso-debian-wayland-amd64.deb` → `debtap` → `pacman -U`） |
| 运行模式 | Wayland 原生 |
| 配置文件 | `~/.config/espanso/config/default.yml` |
| 键盘布局 | `us` / `alt-intl` |

**已配置规则**：
```yaml
matches:
  - trigger: ":date"       # 当前日期
  - trigger: ":time"       # 当前时间
  - trigger: ":ip"         # 公网 IP
  - trigger: ":577"        # QQ 邮箱
  - trigger: ":outlook"    # Outlook 邮箱
  - trigger: ":gmail"      # Gmail 邮箱
  - trigger: ":test"       # 测试用
```

### 2.4 Obsidian

| 配置项 | 值 |
|--------|---|
| 版本 | 1.12.7-2（原生包） |
| 仓库路径 | `/home/nuoxi/文档/diary` |
| CLI 命令 | `/usr/bin/obsidian`（可用） |
| CLI 版本 | 1.12.7 |

**已安装/待配置插件**：
- Local REST API（待启用，用于 MCP 连接）

### 2.5 Loom（代码图谱生成）

| 配置项 | 值 |
|--------|---|
| 包名 | `@loom-code/loom` |
| 安装方式 | `proxychains npm install -g @loom-code/loom --legacy-peer-deps` |
| 版本 | 0.1.7 |
| 用法 | `loom <项目路径> [--watch]` |
| 输出 | 生成 `.obsidian-index/` 文件夹 |

### 2.6 Skills 管理工具

| 工具 | 状态 | 用途 |
|------|------|------|
| **oh-my-skills (oms)** | ✅ 运行中 | 可视化 Skills 管理面板，`http://localhost:2525` |
| **agent-skill-manager (asm)** | ✅ 已安装 | 命令行 Skills 管理 |
| **Hyperframes Skills** | ✅ 已安装 | 16 个视频生成技能，位于 `~/.agents/skills/` |

### 2.7 OpenCode

| 配置项 | 值 |
|--------|---|
| 状态 | ✅ 已熟练使用 |
| 安装方式 | 通过 npm（用户已确认完美安装） |
| 技能目录 | `~/.agents/skills/` |
| 已安装技能 | Hyperframes（16 个），Obsidian Skills（4 个） |

---

## 三、已打通的核心链路

### 3.1 链路总览

```
用户（微信）→ AstrBot → OpenCode → Obsidian
                    ↓
                Loom（代码图谱）
                    ↓
                Espanso（快键触发）
                    ↓
                oms（Skills 管理）
```

### 3.2 已打通的链路

| 链路 | 状态 | 实现方式 |
|------|------|----------|
| **AstrBot ↔ Obsidian** | ✅ 已打通 | AstrBot Skills（obsidian-cli）+ 电脑能力（local 模式） |
| **OpenCode ↔ Skills** | ✅ 已打通 | `~/.agents/skills/` 目录自动加载 |
| **oms ↔ Skills** | ✅ 已打通 | `~/.agents/skills/` 统一管理 |
| **Espanso ↔ 文本扩展** | ✅ 已打通 | `default.yml` 规则定义 |
| **Loom ↔ Obsidian** | ✅ 已打通 | 生成 `.obsidian-index/`，可直接在 Obsidian 中打开 |
| **代理 ↔ 所有工具** | ✅ 已打通 | `proxychains` + Clash 端口 7897 |

### 3.3 待完善链路

| 链路 | 状态 | 需执行操作 |
|------|------|-----------|
| **AstrBot ↔ OpenCode** | ⚠️ 需配置 | 安装桥接插件或配置 Shell 调用 |
| **OpenCode ↔ Obsidian** | ⚠️ 需配置 | 安装 MCP 服务器（`second-brain-lite-mcp`）并配置 OpenCode |
| **Loom ↔ OpenCode** | ⚠️ 需配置 | OpenCode 读取 `.obsidian-index/` 作为项目上下文 |

---

## 四、完整工作流：4 层架构

### 第 1 层：输入层（用户交互）

| 工具 | 作用 | 状态 |
|------|------|------|
| **微信** | 主要交互入口 | ✅ 已配置 |
| **Espanso** | 终端/任意输入框触发 | ✅ 已配置 |
| **AstrBot WebUI** | 管理界面 | ✅ 运行中 |

**已配置的 Espanso 触发词**：
```
:date   → 插入当前日期
:time   → 插入当前时间
:ip     → 插入公网 IP
:test   → 测试用
```

### 第 2 层：调度层（任务分发）

| 工具 | 作用 | 状态 |
|------|------|------|
| **AstrBot** | 接收微信消息，判断任务类型，分发给 OpenCode | ✅ 运行中 |

**AstrBot 当前能力**：
- 接收微信消息
- 通过 DeepSeek API 进行对话
- 执行 Shell 命令（`local` 模式）
- 调用已安装的 Skills（obsidian-cli 等）

### 第 3 层：执行层（工程落地）

| 工具 | 作用 | 状态 |
|------|------|------|
| **OpenCode** | 代码读写、终端执行、复杂任务 | ✅ 已安装并熟练使用 |
| **Loom** | 代码图谱生成 | ✅ 已安装 |
| **Hyperframes** | HTML 视频生成 | ✅ 已安装（16 个技能） |

### 第 4 层：知识层（存储与反馈）

| 工具 | 作用 | 状态 |
|------|------|------|
| **Obsidian** | 笔记存储、知识图谱、项目文档 | ✅ 运行中 |
| **`~/.agents/skills/`** | 统一 Skills 存储 | ✅ 已建立 |
| **oms** | Skills 可视化管理 | ✅ 运行中 |

---

## 五、场景实战

### 场景 1：通勤路上写代码

**触发**：在微信中发送消息

**工作流**：
1. 用户输入：`@机器人 帮我写一个 Python 脚本，从 API 获取天气数据，保存到 Obsidian`
2. AstrBot 接收 → 判断为开发任务 → 调用 OpenCode
3. OpenCode 执行 → 生成脚本 → 通过 MCP 写入 Obsidian
4. AstrBot 回复：`脚本已生成，保存到 Obsidian“天气”笔记`

**所需配置**：
- ✅ AstrBot 微信接入
- ⚠️ AstrBot ↔ OpenCode 桥接
- ⚠️ OpenCode ↔ Obsidian MCP

### 场景 2：生成代码图谱

**触发**：输入 `:graph`（Espanso 触发词）

**工作流**：
1. Espanso 展开为 `cd 当前项目 && loom . && obsidian .obsidian-index/`
2. Loom 解析代码，生成 `.obsidian-index/`
3. Obsidian 自动打开图谱

**所需配置**：
- ✅ Loom 已安装
- ✅ Espanso 已配置
- ✅ Obsidian CLI 可用

### 场景 3：视频生成

**触发**：在 OpenCode 中输入 `用 hyperframes 生成一个产品宣传视频`

**工作流**：
1. OpenCode 识别 `hyperframes` 技能
2. 调用 `hyperframes` 技能
3. 生成 HTML 视频文件
4. 输出结果

**所需配置**：
- ✅ OpenCode 已安装
- ✅ Hyperframes Skills 已安装

### 场景 4：整理 Obsidian 笔记

**触发**：微信中发送 `@机器人 整理我的 Obsidian 笔记，按标签生成摘要`

**工作流**：
1. AstrBot 接收 → 调用 `obsidian-cli` Skill
2. 执行 `obsidian search` 和 `obsidian read`
3. 生成摘要 → AstrBot 回复结果

**所需配置**：
- ✅ AstrBot 微信接入
- ✅ Obsidian Skills 已上传
- ✅ Obsidian CLI 可用

---

## 六、操作速查表

### 6.1 常用命令

| 目的 | 命令 |
|------|------|
| 启动代理 | `proxy_on` |
| 关闭代理 | `proxy_off` |
| 重启 Espanso | `espanso restart` |
| Espanso 状态 | `espanso status` |
| 编辑 Espanso 规则 | `espanso edit` |
| 生成代码图谱 | `cd 项目目录 && loom .` |
| 监听模式生成图谱 | `loom . --watch` |
| 启动 oms | `oms start --daemon --open` |
| 查看 Skills | `ls -la ~/.agents/skills/` |
| 查看 AstrBot 日志 | `docker logs astrbot -f` |
| 重启 AstrBot | `docker restart astrbot` |
| 查看 1Panel 状态 | `sudo systemctl status 1panel` |

### 6.2 Espanso 触发词（已配置）

| 触发词 | 替换内容 |
|--------|----------|
| `:date` | 当前日期（YYYY-MM-DD） |
| `:time` | 当前时间（HH:MM:SS） |
| `:ip` | 公网 IP 地址 |
| `:577` | 577049116@qq.com |
| `:outlook` | qaqxunuoxi@outlook.com |
| `:gmail` | qaqxunuoxi@gmail.com |
| `:test` | It works! |

### 6.3 待添加的 Espanso 触发词（推荐）

| 触发词 | 替换内容 |
|--------|----------|
| `:oc` | `opencode --task "{{input}}"` |
| `:graph` | `cd 项目路径 && loom . && obsidian .obsidian-index/` |
| `:obs` | `opencode --task "使用 MCP 搜索 Obsidian 笔记：{{input}}"` |
| `:hyper` | `opencode --task "使用 hyperframes 技能生成视频：{{input}}"` |

### 6.4 故障排查

| 问题 | 检查命令 | 解决方案 |
|------|----------|----------|
| Espanso 无反应 | `espanso status` | `espanso restart` |
| AstrBot 无响应 | `docker logs astrbot` | `docker restart astrbot` |
| 代理不通 | `curl -I https://github.com` | `proxy_on` + 检查 Clash |
| Loom 无法解析 | `loom .` 报错 | 检查项目路径，确认支持的语言 |
| Skills 未加载 | `ls -la ~/.agents/skills/` | 重新安装 Skills |

---

## 七、下一步行动清单

### ✅ 已完成
- [x] Manjaro 系统安装与配置
- [x] 代理（Clash）配置与验证
- [x] 1Panel 部署
- [x] AstrBot 部署与微信接入
- [x] AstrBot Skills 上传（Obsidian 官方技能包）
- [x] Espanso 安装与配置
- [x] Espanso 规则定义
- [x] Loom 安装与测试
- [x] OpenCode 安装与熟练使用
- [x] Hyperframes Skills 安装
- [x] oh-my-skills (oms) 启动

### 🔲 待完成（优先级排序）

**高优先级（本周完成）**：

1. [ ] OpenCode ↔ Obsidian MCP 服务器配置
   ```bash
   proxychains npm install -g second-brain-lite-mcp
   # 编辑 ~/.config/opencode/opencode.json
   ```

2. [ ] AstrBot ↔ OpenCode 桥接
   ```bash
   # 在 AstrBot 插件目录安装桥接插件
   cd /home/nuoxi/Docker/AstrBot/data/astrbot-data/plugins
   git clone <opencode-bridge-repo>
   # 在 AstrBot WebUI 中启用
   ```

3. [ ] Espanso 触发词扩展（`:oc`、`:graph`、`:obs`）

**中优先级（本月完成）**：

4. [ ] Obsidian Local REST API 插件启用（为 MCP 准备）
5. [ ] 在真实项目中测试完整链路（微信 → AstrBot → OpenCode → Obsidian）
6. [ ] 将 Loom 生成的 `.obsidian-index/` 添加到所有项目的 `.gitignore`

**低优先级（按需完成）**：

7. [ ] 探索 OpenGem（AI 助手 + 代码库 + Obsidian 记忆）
8. [ ] 构建自定义 OpenCode Skills
9. [ ] 配置 WeComBot 作为企业微信备用通道

---

## 八、架构总览图

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              用户交互层                                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐                     │
│  │   微信       │  │  Espanso    │  │ AstrBot     │                     │
│  │ (主要入口)   │  │ (快键触发)   │  │ (WebUI)     │                     │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘                     │
│         │                  │                  │                            │
│         └──────────────────┼──────────────────┘                            │
│                            ▼                                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                            调度层                                          │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                          AstrBot                                    │   │
│  │  - 消息接收  - 任务分类  - 分发调度  - 结果汇总                    │   │
│  └─────────────────────────────┬───────────────────────────────────────┘   │
│                                │                                           │
│                                ▼ (桥接层)                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                            执行层                                          │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                       OpenCode                                      │   │
│  │  - 代码读写  - 终端执行  - Skill 调用  - 工程管理                 │   │
│  └─────────────────────────────┬───────────────────────────────────────┘   │
│                                │                                           │
│              ┌─────────────────┼─────────────────┐                        │
│              ▼                 ▼                 ▼                        │
│  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐                 │
│  │    Loom       │  │ Hyperframes   │  │ 其他 Skills   │                 │
│  │ (代码图谱)    │  │ (视频生成)    │  │ (扩展能力)    │                 │
│  └───────┬───────┘  └───────────────┘  └───────────────┘                 │
│          │                                                                 │
│          ▼ (MCP 协议)                                                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                            知识层                                          │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                        Obsidian                                     │   │
│  │  - Markdown 笔记  - 双链  - Canvas  - Bases  - 代码图谱          │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                  ~/.agents/skills/ (中央仓库)                       │   │
│  │  - Obsidian Skills  - Hyperframes Skills  - 自定义 Skills         │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 九、安全与维护

### 9.1 备份清单

| 数据 | 路径 | 备份方式 |
|------|------|----------|
| Espanso 配置 | `~/.config/espanso/` | Git 仓库 |
| Obsidian 笔记 | `/home/nuoxi/文档/diary/` | Git 仓库（+ 定期备份） |
| AstrBot 数据 | `/home/nuoxi/Docker/AstrBot/data/` | 定期备份 |
| Skills 目录 | `~/.agents/skills/` | Git 仓库 |
| Loom 图谱 | 各项目 `.obsidian-index/` | 添加到 `.gitignore`，按需保留 |

### 9.2 安全提醒

1. **API Key 管理**：DeepSeek API Key 等敏感信息应使用环境变量，不要硬编码
2. **微信机器人权限**：仅将可信用户添加为 AstrBot 管理员
3. **Loom 输出**：`.obsidian-index/` 包含代码结构信息，建议添加到 `.gitignore`
4. **容器权限**：AstrBot 的 `local` 模式有较高权限，谨慎使用

### 9.3 维护任务

| 频率 | 任务 |
|------|------|
| 每日 | 检查 AstrBot 状态（`docker ps`） |
| 每周 | `sudo pacman -Syu` 更新系统 |
| 每周 | `espanso restart` 后测试 `:date` |
| 每月 | 备份 AstrBot 数据目录 |
| 按需 | 更新 Skills（`git pull` in `~/.agents/skills/`） |

---

## 十、结语

你已完成了从**零到完整 AI 工作流**的全链路搭建：

### 核心成果
- ✅ **Manjaro 系统**完全配置，代理畅通
- ✅ **1Panel** 统一管理 Docker 容器
- ✅ **AstrBot** 微信机器人 7×24 运行
- ✅ **Espanso** 文本扩展快速触发
- ✅ **Obsidian** 知识库深度集成
- ✅ **Loom** 代码图谱自动生成
- ✅ **OpenCode** 工程能力随时调用
- ✅ **Skills 管理体系**统一管理
- ✅ **Hyperframes** 视频生成能力

### 最终能力：一个闭环的 AI 驱动工作流

**在微信中发一条消息，即可触发 AI 完成复杂的编程、文档、视频生成任务，结果自动沉淀到 Obsidian 知识库中。**

---

## 🔗 相关笔记

- [[AI工程认知框架：技术选型与落地实操手册]]
- [[LazyPi]]
- [[在终端中配置 `pi` 工具接入 SiliconFlow 的完整步骤]]
- [[Obsidian、tauri、opencode、LobeHub]]
