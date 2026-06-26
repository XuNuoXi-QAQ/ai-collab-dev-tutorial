---
title: "git-complete-guide"
tags:
  - 工作流
  - CI/CD
  - Docker
  - Git
description: "模式一：贡献他人的项目（开源）"
created: 2026-06-23
---

# Git 完整知识体系精讲

> 基于 2026-06-21 全天对话整理，从多账户管理到协作工作流，从分支策略到冲突解决，构建完整的 Git 知识框架。

> [!note] 今日核心收获
> Git 并非简单的"保存代码"工具，而是一套完整的协作操作系统。理解 SSH 认证、分支策略、冲突解决和远程协作机制，是掌握 Git 的四个关键里程碑。

---

## 一、Git 认证体系：SSH 密钥与多账户管理

### 1.1 为什么需要理解 SSH 认证？

Git 与远程仓库（如 GitHub）通信时，必须通过身份验证。SSH 密钥是目前最常用、最安全的认证方式。理解 SSH 认证机制是掌握多账户管理的基础。

**SSH 认证的核心原理**：

| 组件 | 作用 | 类比 |
|------|------|------|
| 私钥 (Private Key) | 留在本地，证明身份 | 你的身份证原件 |
| 公钥 (Public Key) | 上传到 GitHub，用于验证 | 身份证复印件（交给对方核对） |
| SSH Agent | 管理私钥，避免重复输入密码 | 你的私人秘书 |

认证流程：你执行 `git push` → Git 使用你的私钥签名请求 → GitHub 用对应的公钥验证签名 → 验证通过后允许操作。

**关键命令**：

```bash
# 生成密钥对（ed25519 算法是目前最安全的）
ssh-keygen -t ed25519 -C "your_email@example.com" -f ~/.ssh/id_ed25519_xxx

# 查看公钥内容（复制到 GitHub Settings → SSH Keys）
cat ~/.ssh/id_ed25519_xxx.pub

# 测试连接
ssh -T git@github.com
```

### 1.2 为什么需要多账户管理？

当你有多个 GitHub 账户时（如个人、工作、代理），Git 默认使用单一的 SSH 密钥，无法区分身份。你必须通过 **SSH Host 别名** 来实现账户隔离。

**核心原理**：`~/.ssh/config` 文件告诉 Git："当你连接 `github.com-xxx` 时，使用对应的密钥文件"。这相当于为每个账户建立了独立的"门禁卡"。

**配置示例**：

```
# 账户 A（代理）
Host github.com-a
    HostName github.com
    User git
    IdentityFile ~/.ssh/id_ed25519_a

# 账户 B（常用）
Host github.com-b
    HostName github.com
    User git
    IdentityFile ~/.ssh/id_ed25519_b

# 账户 C（工作）
Host github.com-c
    HostName github.com
    User git
    IdentityFile ~/.ssh/id_ed25519_c
```

**使用时**：

```bash
# 克隆账户 B 的仓库（使用 github.com-b 别名）
git clone git@github.com-b:username/repo.git
```

### 1.3 必须牢记的配置规则

| 配置项 | 规则 | 原因 |
|--------|------|------|
| 全局 `user.name` / `user.email` | 清除（或确保被覆盖） | 防止意外提交使用错误身份 |
| 仓库级 `user.name` / `user.email` | 每个仓库设置 | 提交记录正确关联到对应账户 |
| `~/.ssh/config` 中的 `Host` 别名 | 必须与克隆 URL 一致 | 否则 Git 无法选择正确的密钥 |
| 私钥权限 | `chmod 600 ~/.ssh/id_*` | 防止其他用户读取私钥 |

---

## 二、Git 远程协作模型：Fork 与 Clone

### 2.1 核心概念

| 操作 | 本质 | 适用场景 |
|------|------|----------|
| **Fork** | 在 GitHub 服务器上复制仓库 | 参与他人项目、贡献代码 |
| **Clone** | 将远程仓库下载到本地 | 开始在本地工作 |
| **Pull Request (PR)** | 请求对方合并你的修改 | 提交贡献、团队代码审查 |

### 2.2 两种协作模式详解

**模式一：贡献他人的项目（开源）**

标准流程：

1. Fork 原项目 → 你的 GitHub 账户获得一个副本
2. Clone 你的 Fork → 代码到本地
3. 修改代码 → 推送到你的 Fork
4. 发起 Pull Request → 请求原项目维护者合并

**为什么不能直接 Clone 原项目修改并 Push？**

- 你对原项目没有写权限 → `git push` 会被拒绝
- 这是 GitHub 的权限保护机制

**模式二：自己的项目**

- 直接在本地克隆你自己的仓库
- 不需要 Fork
- 你拥有完整的读写权限

### 2.3 与多账户的结合

| 场景 | 操作 |
|------|------|
| 个人开源贡献（B 账户） | Fork 到 B → `git clone git@github.com-b:你的用户名/项目.git` |
| 工作项目（C 账户） | Fork 公司项目到 C → `git clone git@github.com-c:你的用户名/项目.git` |
| 代理自动化（A 账户） | Fork 到 A → `git clone git@github.com-a:你的用户名/项目.git` |

---

## 三、分支管理：核心工作流

### 3.1 分支的本质

分支是 Git 最强大的概念。它是一条**独立的开发线**，允许你在不影响主代码的情况下自由实验。

**类比**：分支 = 平行宇宙。你在一个宇宙里开发新功能，主宇宙的代码依然稳定运行。功能测试完毕，再把两个宇宙合并。

### 3.2 五种核心分支类型

| 分支类型 | 命名示例 | 生命周期 | 创建来源 | 合并目标 |
|----------|----------|----------|----------|----------|
| `main` | `main` | 永久 | 仓库初始化 | - |
| `feature/*` | `feature/login` | 临时（功能完成后删除） | `main` 或 `develop` | `main` 或 `develop` |
| `hotfix/*` | `hotfix/urgent` | 临时（修复后删除） | `main` | `main` + `develop` |
| `develop` | `develop` | 永久（大型团队） | `main` | `main`（发布时） |
| `release/*` | `release/1.2.0` | 临时（发布后删除） | `develop` | `main` + `develop` |

### 3.3 独立开发者的简化工作流

不需要 `develop` 和 `release` 分支，保持简洁：

```
main 分支（稳定代码）
    └── feature/xxx（新功能）
    └── hotfix/xxx（紧急修复）
```

**操作命令**：

```bash
# 开始新功能
git checkout -b feature/new-feature main

# 开发、提交
git add .
git commit -m "feat: add new feature"

# 合并回 main
git checkout main
git merge --no-ff feature/new-feature
git branch -d feature/new-feature
```

---

## 四、冲突：理解与解决

### 4.1 冲突的本质

**冲突发生的条件**：两个人修改了**同一文件的同一区域**，Git 无法自动决定保留谁的版本。

**三种场景对比**：

| 场景 | 是否冲突 | 原因 |
|------|----------|------|
| 修改不同文件 | ❌ 无冲突 | Git 直接合并 |
| 修改同一文件的不同区域 | ❌ 无冲突 | Git 自动识别并合并 |
| 修改同一文件的同一区域 | ✅ 产生冲突 | Git 无法判断该保留谁 |

### 4.2 冲突的视觉表现

当冲突发生时，Git 在文件中标记冲突区域：

```text
<<<<<<< HEAD
你用这段代码做验证
=======
同事用那段代码做验证
>>>>>>> branch-name
```

- `<<<<<<< HEAD` 到 `=======`：你当前分支的改动
- `=======` 到 `>>>>>>> branch-name`：被合并分支的改动

### 4.3 解决冲突的三步法

```
1. 找出冲突文件   → git status
2. 编辑冲突文件   → 手动删除标记，保留正确的代码
3. 提交解决结果   → git add . && git commit -m "resolve conflict"
```

### 4.4 预防冲突的最佳实践

1. **保持功能模块独立**：高内聚、低耦合的代码设计
2. **频繁拉取同步**：每天 `git pull origin main`
3. **分支存活时间短**：功能完成后及时合并删除
4. **合并前先 rebase**：`git rebase main` 在本地解决冲突

---

## 五、合并策略：Merge vs Rebase vs Squash

### 5.1 三种方式的核心区别

| 方式 | 效果 | 提交历史 | 适用场景 |
|------|------|----------|----------|
| **Merge** | 创建合并提交，保留完整历史 | 有分支线 | 标准团队协作 |
| **Rebase** | 线性化历史，将提交移动到主分支顶端 | 线性 | 个人分支整理 |
| **Squash** | 将多个提交压缩为一个 | 单一提交 | PR 合并保持整洁 |

### 5.2 Merge 详解

```bash
git checkout main
git merge feature/login
```

- 产生一个合并提交（Merge commit）
- 保留完整的分支历史
- 适合长期运行的团队分支

### 5.3 Rebase 详解

```bash
git checkout feature/login
git rebase main
```

- 不产生合并提交
- 历史呈线性，更清晰
- 适合个人功能分支

**重要提醒**：**绝对不要对已推送到公共仓库的分支执行 Rebase**，会破坏其他人的历史。

### 5.4 Squash 详解

```bash
git checkout main
git merge --squash feature/login
git commit -m "feat: add login feature"
```

- 将 feature 分支的所有提交压缩成一个
- 主分支历史保持极其干净
- GitHub 上的 "Squash and merge" 按钮即此功能

### 5.5 选择指南

| 场景 | 推荐方式 |
|------|----------|
| 个人项目，主分支保持干净 | Squash Merge |
| 团队协作，需要保留每个人的提交 | 标准 Merge |
| 你的本地分支，整理提交历史 | Rebase（推送前） |
| GitHub PR 合并 | Squash and merge |

---

## 六、分支历史维护

### 6.1 糟糕历史的特点

执行 `git log --graph --oneline` 看到：

- 大量的合并提交交织
- 无法快速定位功能边界
- 难以回滚到稳定状态

### 6.2 导致历史混乱的三大元凶

1. **过于频繁的 Merge**：每次合并产生一个合并提交，时间长形成毛线团
2. **长期分支**：feature 分支存活超过 2 周，主分支已发生大量变化
3. **无效提交信息**：提交信息是 "fix"、"tmp"、"update" 等

### 6.3 修复历史的方法

**交互式变基**（修复本地历史）：

```bash
git rebase -i HEAD~5
```

- 将 `pick` 改为 `squash` 压缩提交
- 重新编辑提交信息
- **仅在本地分支操作，不要在公共分支上使用**

**强制推送**（修复远程历史）：

```bash
git push --force-with-lease origin main
```

- 更新远程仓库的历史
- 必须确保没有其他人基于此分支开发

---

## 七、本地模拟远程分支协作

你可以通过克隆到两个位置，模拟完整的远程协作环境：

| 目录 | 角色 | 初始化命令 |
|------|------|------------|
| `~/project-remote` | 远程仓库 | `git init --bare` |
| `~/project-dev-a` | 开发者 A 工作区 | `git clone ~/project-remote ~/project-dev-a` |
| `~/project-dev-b` | 开发者 B 工作区 | `git clone ~/project-remote ~/project-dev-b` |

**练习流程**：

1. A 修改并推送 → 远程仓库更新
2. B 未拉取更新，直接修改相同区域 → 尝试推送失败
3. B 执行 `git pull` → 产生冲突
4. B 解决冲突 → 提交 → 推送成功

这是练习冲突解决和协作流程最安全的方式。

---

## 八、CI/CD 概念与 Git 的关系

### 8.1 什么是 CI/CD

**CI（持续集成）** = 代码推送后自动构建、测试

- 自动拉取代码 → 运行构建 → 运行测试 → 反馈结果
- 防止"在我机器上能跑"的问题

**CD（持续交付/部署）**：

- 持续交付：自动打包产物，等待人工确认部署
- 持续部署：自动部署到生产环境

### 8.2 与 Git 工作流的结合

```
代码推送 → GitHub Actions 触发 → CI 流程（构建+测试）
                ↓
          测试通过 → 自动合并 PR
                ↓
          CD 流程 → 打包 Docker 镜像 → 部署到服务器
```

你的 `.github/workflows/*.yml` 文件定义了整个过程。

---

## 九、Git 多账户管理完整操作规范

### 9.1 账户配置总览

| 步骤 | 操作 | 命令 |
|------|------|------|
| 1 | 生成 SSH 密钥 | `ssh-keygen -t ed25519 -C "邮箱" -f ~/.ssh/id_ed25519_x` |
| 2 | 上传公钥到 GitHub | 复制 `.pub` 内容到 Settings → SSH Keys |
| 3 | 配置 `~/.ssh/config` | 为每个账户设置 Host 别名 |
| 4 | 测试连接 | `ssh -T git@github.com-x` |
| 5 | 克隆仓库 | `git clone git@github.com-x:用户名/仓库.git` |
| 6 | 设置本地身份 | `git config user.name/email`（每个仓库） |

### 9.2 三个账户的典型用途

| 账户 | 用途 | 克隆别名 | 提交邮箱 |
|------|------|----------|----------|
| A | 代理/自动化 | `github.com-a` | QQ 邮箱 |
| B | 个人常用 | `github.com-b` | Outlook 邮箱 |
| C | 工作 | `github.com-c` | Gmail 邮箱 |

### 9.3 避免混淆的核心原则

1. **克隆时使用别名**：永远不用默认 `github.com`
2. **每个仓库设置身份**：绝不依赖全局配置
3. **提交前检查**：`git remote -v` + `git config user.name` / `user.email`
4. **测试连接**：`ssh -T git@github.com-x`

---

## 十、今日 Git 相关命令速查表

| 操作 | 命令 |
|------|------|
| 生成密钥 | `ssh-keygen -t ed25519 -C "email" -f ~/.ssh/id_ed25519_x` |
| 查看公钥 | `cat ~/.ssh/id_ed25519_x.pub` |
| 测试 SSH | `ssh -T git@github.com-x` |
| 克隆仓库 | `git clone git@github.com-x:用户名/仓库.git` |
| 查看远程 | `git remote -v` |
| 查看分支 | `git branch` / `git branch -r` |
| 切换分支 | `git checkout -b 分支名 origin/分支名` |
| 设置身份 | `git config user.name "名字"` / `git config user.email "邮箱"` |
| 创建分支 | `git checkout -b feature/xxx main` |
| 合并分支 | `git merge --no-ff feature/xxx` |
| 压缩合并 | `git merge --squash feature/xxx` |
| 变基 | `git rebase main` |
| 交互式变基 | `git rebase -i HEAD~n` |
| 创建裸仓库 | `git init --bare` |
| 强制推送 | `git push --force-with-lease origin main` |
| 删除远程分支 | `git push origin --delete feature/xxx` |

---

**文档信息**

| 项目 | 内容 |
|------|------|
| 日期 | 2026-06-21 |
| 字数 | 约 7500 字 |
| 核心主题 | Git 多账户管理、SSH 认证、分支策略、冲突解决、协作工作流 |
