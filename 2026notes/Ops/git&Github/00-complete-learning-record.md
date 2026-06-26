---
title: "00-complete-learning-record"
tags:
  - Git
  - GitHub
  - 版本控制
  - Docker
  - Linux
description: "在 Manjaro 上运行微信开发者工具时，模拟器无法渲染页面。"
created: 2026-06-23
---

# 2026-06-21 完整学习记录：从系统急救到 Git 多账户管理

> **今日核心收获**：系统卡死由交换空间不足引起，通过扩容至 24GB 解决；微信开发者工具白屏问题通过切换基础库版本和检查插件授权解决；成功搭建 Taro 开发环境并理解其与 Tauri 的区别；建立了完整的多 GitHub 账户管理规范（A/B/C 三账户分工）；深入理解了分支管理、冲突解决、Fork 工作流和 CI/CD 概念；学习了企业级 DLP 系统的防护机制。

---

## 一、系统基础运维：交换空间与系统卡死

### 1.1 问题诊断

系统出现严重卡顿，几乎无法操作。通过 `free -h` 命令排查发现：

```
                总计        已用        空闲        共享   缓冲/缓存        可用
内存：          12Gi       6.1Gi       4.6Gi       141Mi       2.5Gi       6.7Gi
交换：         511Mi       450Mi        61Mi
```

- **物理内存**：12Gi 总，6.1Gi 已用，6.7Gi 可用 → **内存充足**
- **交换空间**：511Mi 总，450Mi 已用，61Mi 剩余 → **交换空间几乎耗尽**

结论：系统卡死的直接原因是交换空间不足，导致进程阻塞和频繁 I/O 等待。

### 1.2 交换分区 vs 交换文件

| 特性 | 交换分区 | 交换文件 |
|------|----------|----------|
| 调整大小 | 极其麻烦，需重新分区 | 非常简单，只需几行命令 |
| 性能 | 略高（直接读写块设备） | 略低（需经过文件系统层），但现代硬件差异可忽略 |
| 休眠支持 | 原生支持 | 需额外配置 resume 参数 |
| 灵活性 | 低 | 高（可随时删除或扩容） |
| 磁盘碎片 | 无 | 可能产生（但现代工具会尽量分配连续空间） |

结论：现代 Linux 发行版推荐使用交换文件，灵活且易维护。

### 1.3 交换文件扩容至 24GB

执行单行命令完成所有操作：

```bash
sudo bash -c "swapoff -a && rm -f /swapfile && fallocate -l 24G /swapfile && chmod 600 /swapfile && mkswap /swapfile && swapon /swapfile && grep -q '/swapfile' /etc/fstab || echo '/swapfile none swap sw 0 0' >> /etc/fstab && sysctl vm.swappiness=10 && echo 'vm.swappiness=10' >> /etc/sysctl.conf"
```

**命令执行后的状态**：
```
交换：          23Gi          0B        23Gi
```

交换空间从 511MiB 扩容至 23Gi，使用量为 0B，说明系统完全不需要使用交换，物理内存充裕。

### 1.4 Swappiness 调优

- 默认值：60（系统倾向于使用交换空间）
- 推荐值：10（优先使用物理内存）
- 调优理由：物理内存充足时（可用 6.7Gi），应尽可能减少交换操作以提升性能

### 1.5 休眠功能的补充说明

休眠（Suspend to Disk）是将当前系统状态完整保存到硬盘然后完全断电的功能。与睡眠（Suspend to RAM）的区别：

| 模式 | 保存位置 | 是否供电 | 恢复速度 |
|------|----------|----------|----------|
| 睡眠 | 内存 (RAM) | 是 | 极快（1-3秒） |
| 休眠 | 硬盘 (Swap) | 否 | 较慢（30秒-1分钟） |

12Gi 内存，若启用休眠，交换文件至少需要 12-15GB。24GB 交换文件已完全满足休眠条件。

---

## 二、微信开发者工具问题排查

### 2.1 模拟器白屏问题

在 Manjaro 上运行微信开发者工具时，模拟器无法渲染页面。

**排查路径**：

1. **确认安装版本**：`which wechat-devtools` → `/usr/bin/wechat-devtools`，确认是原生 Linux 版（基于 nw.js）

2. **查看错误日志**：调试器 Console 显示：
   ```
   wx04445cff065100ed 插件未授权使用
   ```

3. **解决方案**：
   - 若不需该插件：在 `app.json` 中删除 `"plugins"` 字段
   - 若需该插件：在微信公众平台 → 设置 → 插件管理中添加授权
   - 切换低版本基础库（如 3.5.7）

4. **其他白屏修复方法**：
   - 切换调试基础库：右上角"详情"→"本地设置"→"调试基础库"
   - 清除所有缓存：菜单栏"工具"→"清除缓存"→"清除全部缓存"
   - 检查项目路径不含中文或特殊字符
   - 从 Wayland 切换到 X11（登录界面选择"GNOME on Xorg"）
   - 使用 Docker 版本：`msojocs/wechat-web-devtools-linux`

### 2.2 核心教训

- 微信开发者工具的白屏问题通常不是代码错误，而是环境或配置问题
- 优先尝试"切换调试基础库"和"清除缓存"，这两步能解决大部分问题
- Linux 下社区版的兼容性仍不够稳定，Docker 版本是可靠的备选

---

## 三、Taro 跨端框架

### 3.1 什么是 Taro

Taro 是京东凹凸实验室开源的跨端跨框架解决方案，核心目标："一套代码，多端运行"。

**支持平台**：微信/支付宝/百度/字节跳动/QQ/快手小程序、H5、React Native

**支持框架**：React、Vue、Preact、Svelte 等

### 3.2 环境准备与安装

**安装 Taro CLI**：
```bash
npm config set registry https://registry.npmmirror.com
npm install -g @tarojs/cli
```

**创建项目**：
```bash
taro init myApp
# 选择：Vue3 / TypeScript / Sass / pnpm / Webpack5
```

**编译与预览**：
```bash
cd myApp
pnpm install
pnpm dev:weapp
# 编译后生成 dist 目录，用微信开发者工具导入
```

### 3.3 Taro 的生态特点

- **插件机制**：支持通过插件扩展 CLI 功能
- **组件库**：`taro-ui` 等多端组件库
- **社区活跃**：由京东维护，适合多端小程序场景

---

## 四、跨平台框架深度对比：Taro vs Tauri vs Flutter vs Electron

### 4.1 四大框架速览

| 框架 | 目标平台 | 核心语言 | 体积 | 适用场景 |
|------|----------|----------|------|----------|
| **Taro** | 小程序/H5 | 前端框架 | 代码包 | 多平台小程序 |
| **Tauri** | 桌面/移动 | Rust + 前端 | <5MB | 轻量桌面应用 |
| **Flutter** | iOS/Android/Web | Dart | ~10MB | 跨平台移动UI |
| **Electron** | 桌面 | JS | >100MB | 原型/工具类应用 |

### 4.2 Tauri 与 Taro 的核心定位差异

| 维度 | Taro | Tauri |
|------|------|-------|
| 目标平台 | 小程序 / H5 | 桌面 / 移动 |
| 技术栈 | React/Vue + TS | 任意前端 + Rust |
| 典型场景 | 多平台小程序 | 轻量桌面应用 |
| 学习曲线 | 低（前端技术） | 陡峭（需学习 Rust） |

### 4.3 选型指南

- **面对多平台小程序**：Taro
- **构建轻量、安全的桌面应用**：Tauri
- **追求 UI 一致性和高性能移动应用**：Flutter
- **快速原型或对体积不敏感**：Electron

---

## 五、Git 多账户管理（核心内容）

### 5.1 三个账户的用途与配置

| 账户 | 注册邮箱 | 用途 | 本地身份标识 |
|------|----------|------|-------------|
| **A (Agent代理)** | QQ邮箱（委托豆包） | 自动化工具、CI/CD、临时操作 | 独立SSH密钥，使用QQ邮箱提交 |
| **B (常用账户)** | Outlook邮箱 | 个人常用账户，日常开发主力 | 独立SSH密钥，使用Outlook邮箱提交 |
| **C (工作账户)** | Gmail邮箱 | 工作账户，用于公司项目或正式协作 | 独立SSH密钥，使用Gmail邮箱提交 |

### 5.2 SSH 密钥生成

```bash
# A (Agent代理账户)
ssh-keygen -t ed25519 -C "your_qq@qq.com" -f ~/.ssh/id_ed25519_a

# B (常用账户)
ssh-keygen -t ed25519 -C "your_outlook@outlook.com" -f ~/.ssh/id_ed25519_b

# C (工作账户)
ssh-keygen -t ed25519 -C "your_gmail@gmail.com" -f ~/.ssh/id_ed25519_c
```

### 5.3 配置 `~/.ssh/config`

```
# A (Agent代理账户)
Host github.com-a
    HostName github.com
    User git
    IdentityFile ~/.ssh/id_ed25519_a

# B (常用账户)
Host github.com-b
    HostName github.com
    User git
    IdentityFile ~/.ssh/id_ed25519_b

# C (工作账户)
Host github.com-c
    HostName github.com
    User git
    IdentityFile ~/.ssh/id_ed25519_c
```

### 5.4 日常使用规范

**克隆时使用对应的别名**：
```bash
# B（常用账户）
git clone git@github.com-b:用户名/仓库名.git

# C（工作账户）
git clone git@github.com-c:用户名/仓库名.git

# A（代理账户）
git clone git@github.com-a:用户名/仓库名.git
```

**每个仓库设置专属用户信息（最关键）**：
```bash
git config user.name "Your Personal Name"
git config user.email "your_outlook@outlook.com"
```

**清除全局用户配置**：
```bash
git config --global --unset user.name
git config --global --unset user.email
```

### 5.5 账户切换的快速检查清单

每次克隆后执行：
1. `git remote -v` → 确认远程地址使用了正确的别名
2. `git config user.name` / `git config user.email` → 确认身份正确
3. `ssh -T git@github.com-b` → 测试 SSH 连接

### 5.6 两种协作模式

**个人开发者模式（B 构建，A Fork 协同）**：
- B 账户：项目主仓库
- A 账户：Fork 后修改，通过 PR 向 B 提交贡献
- 适用：开源协作、Agent 自动化

**员工模式（公司主仓库，C Fork）**：
- 公司组织：项目主仓库
- C 账户：Fork 后开发，通过 PR 提交
- 适用：公司代码开发

---

## 六、Git 协作核心概念

### 6.1 Fork vs Clone

| 操作 | 适用场景 | 权限 |
|------|----------|------|
| **Fork** | 参与他人项目 | 复制仓库到自己的账户，获得写权限 |
| **Clone** | 自己的项目，或从 Fork 后克隆 | 下载代码到本地 |

**标准开源贡献流程**：Fork → Clone（自己的 Fork）→ 修改 → Push → Pull Request

### 6.2 分支类型与作用

| 分支类型 | 命名示例 | 作用 |
|----------|----------|------|
| `main` | `main` | 稳定生产代码，始终可用 |
| `feature/*` | `feature/login-page` | 新功能开发 |
| `hotfix/*` | `hotfix/critical-bug` | 紧急线上修复 |
| `develop` | `develop` | 开发集成分支（大型团队） |
| `release/*` | `release/1.2.0` | 版本发布准备（大型团队） |

**独立开发者简化工作流**：
1. 从 `main` 拉取 `feature` 分支
2. 开发完成后合并回 `main` 并删除 `feature` 分支
3. 紧急问题用 `hotfix` 分支处理

### 6.3 冲突的含义与解决

**冲突的本质**：两人修改了同一文件的同一区域，Git 无法自动决定保留谁的版本。

**冲突产生条件**：
- 修改同一文件
- 修改文件的同一区域
- 基于旧分支开发导致并行修改

**解决冲突三步法**：
1. `git status` → 找出冲突文件
2. 手动编辑文件，删除 `<<<<<<<`、`=======`、`>>>>>>>` 标记
3. `git add` → `git commit` → `git push`

**降低冲突概率的方法**：
- 保持功能模块独立（高内聚、低耦合）
- 每天开始工作前 `git pull origin main`
- 功能分支不要存活太久，及时合并
- 合并前执行 `git rebase main`

### 6.4 合并提交方式

| 方式 | 说明 | 适用场景 |
|------|------|----------|
| **GitHub 网页 Merge** | 点击按钮合并 PR | 标准团队协作，无冲突时 |
| **本地 `git merge`** | 命令行合并 | 有冲突需要解决时 |
| **Squash and merge** | 压缩所有提交为一个 | 保持主分支历史干净 |
| **Rebase and merge** | 线性化提交历史 | 追求优美提交历史 |

### 6.5 分支历史维护

**导致历史混乱的原因**：
1. 过于频繁的 `git merge`（而非 `rebase`）
2. 功能分支存活时间过长（超过 2 周）
3. 提交信息不规范（"fix bug"、"tmp"）

**保持历史清晰的方法**：
1. 合并前执行 `git rebase main`
2. 每天执行 `git pull --rebase origin main`
3. PR 合并时选择 Squash and merge
4. 遵循 Conventional Commits 规范

### 6.6 本地双目录模拟远程分支

可以在本地将同一项目克隆到两个位置，模拟远程分支协作：

| 目录 | 角色 |
|------|------|
| `~/project-remote` | 裸仓库（模拟 GitHub） |
| `~/project-dev-a` | 开发者 A 工作区 |
| `~/project-dev-b` | 开发者 B 工作区 |

**创建裸仓库**：`git init --bare`

---

## 七、企业级源码安全防护

### 7.1 DLP（数据防泄漏）系统

DLP 是政府和企业防止源码泄露的核心技术体系，从数据识别、加密、管控、审计等多个维度构建防护。

**三大核心防护机制**：

**仓库保护**：
- 生产分支设为受保护分支，禁止直接 `git push`
- 所有变更通过 PR 提交，要求至少 2 名审阅者批准
- CI 测试必须全部通过才能合并

**终端加密（透明加密）**：
- 代码在磁盘上始终处于加密状态（密文）
- 授权进程（如 VS Code）实时解密，用户无感知
- 未授权进程（如微信、网盘）读取到的是乱码
- 本质：修改文件内容本身，而非加锁或改变文件结构

**沙箱与虚拟化（VDI）**：
- 代码开发工作在公司数据中心的虚拟机上完成
- 员工电脑仅作为显示器，代码不落地
- 禁止从虚拟桌面复制文件到本地

### 7.2 透明加密的工作原理

- **加密粒度**：按进程、文件类型、目录
- **解密触发**：进程身份（如 `code.exe`）
- **外部访问**：未授权进程无法读取明文
- **典型场景**：防止代码通过微信/网盘外泄

Linux 下的透明加密方式：
- `fscrypt`：文件系统级加密
- `dm-crypt/LUKS`：块设备级加密
- `git-crypt`：Git 仓库特定文件加密

### 7.3 U盘管控机制

政府单位通过终端安全管理系统实现：
- **白名单机制**：仅允许经过认证的安全U盘使用
- **读写权限分离**：可设置仅允许读取、禁止写入
- **操作审计**：记录所有U盘插拔和文件操作日志
- **违规响应**：识别到非授权U盘即断开连接并警报

---

## 八、CI/CD 概念理解

**CI（持续集成）**：
- 代码推送后自动拉取、构建、运行测试
- 防止多人协作时代码冲突
- 流水线变绿表示代码健康，可合并

**CD（持续交付/部署）**：
- 持续交付：CI 通过后自动打包产物，等待人工确认部署
- 持续部署：CI 通过后自动部署到生产服务器

**完整流水线示例**：
1. Push 代码 → GitHub Actions 触发
2. 运行 `pnpm install` → `pnpm lint` → `pnpm test`
3. CI 通过后构建 Docker 镜像
4. 自动推送到 Docker Hub
5. 通过 SSH 连接服务器执行 `docker pull` 和 `docker restart`
6. 通知用户部署成功

---

## 九、操作速查表

| 操作 | 命令 |
|------|------|
| 查看内存和交换 | `free -h` |
| 创建 24GB 交换文件 | `sudo bash -c "swapoff -a && rm -f /swapfile && fallocate -l 24G /swapfile && chmod 600 /swapfile && mkswap /swapfile && swapon /swapfile && echo '/swapfile none swap sw 0 0' >> /etc/fstab && sysctl vm.swappiness=10 && echo 'vm.swappiness=10' >> /etc/sysctl.conf"` |
| 生成 SSH 密钥 | `ssh-keygen -t ed25519 -C "email" -f ~/.ssh/id_ed25519_x` |
| 测试 SSH 连接 | `ssh -T git@github.com-b` |
| 克隆仓库（B 账户） | `git clone git@github.com-b:用户名/仓库.git` |
| 克隆仓库（C 账户） | `git clone git@github.com-c:用户名/仓库.git` |
| 克隆仓库（A 账户） | `git clone git@github.com-a:用户名/仓库.git` |
| 设置仓库用户信息 | `git config user.name "名字"` / `git config user.email "邮箱"` |
| 创建裸仓库 | `git init --bare` |
| 查看远程分支 | `git branch -r` |
| 创建并切换到远程分支 | `git checkout -b 分支名 origin/分支名` |
| 交互式变基 | `git rebase -i HEAD~n` |
| 安装 Taro CLI | `npm install -g @tarojs/cli` |
| 创建 Taro 项目 | `taro init myApp` |
| 编译 Taro 到微信小程序 | `pnpm dev:weapp` |

---

## 十、关键词索引

| 关键词 | 相关概念 |
|--------|----------|
| 交换空间 | Swap、交换文件、休眠、swappiness |
| 微信开发者工具 | 白屏、基础库、插件授权、Wayland/X11 |
| Taro | 跨端框架、小程序、Vue3 |
| Tauri | 桌面应用、Rust、Electron替代 |
| Git多账户 | SSH密钥、别名、分支保护、Fork |
| 冲突 | Merge、Rebase、解决冲突 |
| DLP | 透明加密、终端防护、数据防泄漏 |
| CI/CD | 持续集成、持续部署、GitHub Actions |
