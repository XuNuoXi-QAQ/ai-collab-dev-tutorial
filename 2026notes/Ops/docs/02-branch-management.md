# 第 2 章：分支管理策略

## 🎯 学习目标

完成本章学习后，你将能够：
- 理解 Git 分支的核心概念
- 掌握分支的基本操作命令
- 了解 Git Flow 和 GitHub Flow 两种主流工作流
- 根据团队规模和项目特点选择合适的分支策略

---

## 2.1 分支基础

### 2.1.1 什么是分支？

分支（Branch）是 Git 中最重要的概念之一。简单来说，分支就是指向某个提交记录的可变指针。

**为什么需要分支？**

- 🌿 **并行开发**：多人同时开发不同功能，互不影响
- 🐛 **Bug 修复**：在不影响主分支的情况下修复问题
- 🧪 **实验特性**：尝试新想法，失败了可以随时丢弃
- 🚀 **版本发布**：稳定版本和开发版本分离

### 2.1.2 分支的基本操作

```bash
# 查看分支
git branch                  # 查看本地分支
git branch -a               # 查看所有分支（本地+远程）
git branch -v               # 查看分支及最后提交

# 创建分支
git branch feature-name     # 创建新分支
git checkout -b feature-name  # 创建并切换到新分支
git switch -c feature-name    # Git 2.23+ 新命令

# 切换分支
git checkout feature-name   # 切换分支
git switch feature-name     # Git 2.23+ 新命令

# 删除分支
git branch -d feature-name  # 删除已合并的分支
git branch -D feature-name  # 强制删除分支（未合并也删除）

# 重命名分支
git branch -m old-name new-name
```

### 2.1.3 合并分支

```bash
# 合并指定分支到当前分支
git merge feature-name

# 快进合并（Fast-forward）
# 当目标分支是当前分支的直接后代时，Git 直接移动指针

# 三方合并（Three-way merge）
# 当两个分支有分叉时，Git 创建一个新的合并提交
```

### 2.1.4 变基（Rebase）

```bash
# 将当前分支的提交变基到目标分支上
git rebase main

# 交互式变基（可以修改、合并、删除提交）
git rebase -i HEAD~3
```

**Merge vs Rebase 对比：**

| 特性 | Merge | Rebase |
|------|-------|--------|
| 历史记录 | 保留完整历史，有合并提交 | 线性历史，更清晰 |
| 安全性 | 安全，不会修改已有提交 | 会修改提交历史，有风险 |
| 适用场景 | 公共分支合并 | 个人特性分支整理 |

> ⚠️ **黄金法则**：不要在公共分支（如 main、develop）上使用 rebase！

---

## 2.2 Git Flow 工作流

### 2.2.1 Git Flow 简介

Git Flow 是由 Vincent Driessen 提出的一种分支管理模型，适合有计划发布周期的项目。

### 2.2.2 五种核心分支

```
                    ┌─────────────┐
                    │   master    │  生产环境，随时可发布
                    └──────┬──────┘
                           │ 合并 release
                    ┌──────▼──────┐
                    │   develop   │  开发主线，集成所有功能
                    └──────┬──────┘
                           │ 创建 feature
              ┌────────────┼────────────┐
        ┌─────▼─────┐ ┌───▼───┐ ┌───────▼───────┐
        │ feature-A │ │ feat-B│ │  feature-C    │  功能分支
        └─────┬─────┘ └───┬───┘ └───────┬───────┘
              └────────────┼────────────┘
                           │ 合并到 develop
                    ┌──────▼──────┐
                    │  release-x  │  发布分支，准备上线
                    └──────┬──────┘
                           │
              ┌────────────┴────────────┐
        ┌─────▼─────┐             ┌─────▼─────┐
        │  master   │             │  develop  │
        └───────────┘             └───────────┘
```

| 分支类型 | 命名规范 | 说明 | 生命周期 |
|----------|----------|------|----------|
| master | master | 生产环境代码，随时可发布 | 永久 |
| develop | develop | 开发主线，集成所有功能 | 永久 |
| feature | feature/* | 新功能开发 | 临时，合并后删除 |
| release | release/* | 发布准备，只修 Bug | 临时，发布后删除 |
| hotfix | hotfix/* | 线上紧急修复 | 临时，修复后删除 |

### 2.2.3 Git Flow 工作流程

**1. 功能开发流程**
```bash
# 从 develop 创建功能分支
git checkout -b feature/user-login develop

# 开发完成后合并回 develop
git checkout develop
git merge --no-ff feature/user-login
git branch -d feature/user-login
git push origin develop
```

**2. 发布流程**
```bash
# 从 develop 创建发布分支
git checkout -b release/1.0.0 develop

# 只修复 Bug，不添加新功能
# ... 修复 Bug ...

# 发布完成，合并到 master 和 develop
git checkout master
git merge --no-ff release/1.0.0
git tag -a v1.0.0 -m "Release 1.0.0"

git checkout develop
git merge --no-ff release/1.0.0

git branch -d release/1.0.0
```

**3. 热修复流程**
```bash
# 从 master 创建热修复分支
git checkout -b hotfix/1.0.1 master

# 修复 Bug
# ... 修复 ...

# 修复完成，合并到 master 和 develop
git checkout master
git merge --no-ff hotfix/1.0.1
git tag -a v1.0.1 -m "Hotfix 1.0.1"

git checkout develop
git merge --no-ff hotfix/1.0.1

git branch -d hotfix/1.0.1
```

### 2.2.4 Git Flow 优缺点

**优点：**
- ✅ 分支职责清晰，规范明确
- ✅ 适合有计划发布周期的项目
- ✅ 支持多版本并行维护

**缺点：**
- ❌ 分支较多，管理复杂
- ❌ 流程繁琐，不适合快速迭代
- ❌ 学习成本较高

---

## 2.3 GitHub Flow 工作流

### 2.3.1 GitHub Flow 简介

GitHub Flow 是 GitHub 团队使用的工作流，比 Git Flow 更简单，适合持续部署的项目。

### 2.3.2 核心原则

```
main (主分支，随时可部署)
  │
  ├── feature-branch-1
  │     ├── commit 1
  │     ├── commit 2
  │     └── commit 3
  │           │
  │           ▼
  │     Pull Request (代码审查)
  │           │
  │           ▼
  └─────── Merge ────────► main (部署上线)
```

### 2.3.3 GitHub Flow 六步流程

**第 1 步：从 main 创建分支**
```bash
git checkout -b feature/new-feature main
```

**第 2 步：提交更改**
```bash
git add .
git commit -m "Add new feature"
git push origin feature/new-feature
```

**第 3 步：创建 Pull Request**
- 在 GitHub 上创建 PR
- 填写 PR 描述，说明做了什么
- 邀请同事进行 Code Review

**第 4 步：讨论和审查**
- 团队成员提出修改意见
- 根据反馈继续提交修改
- 所有意见解决后，准备合并

**第 5 步：合并到 main**
- 确认 CI 通过
- 合并 PR 到 main 分支
- 删除特性分支

**第 6 步：部署**
- main 分支随时可部署
- 合并后立即部署到生产环境

### 2.3.4 GitHub Flow 优缺点

**优点：**
- ✅ 简单易懂，学习成本低
- ✅ 适合持续部署、快速迭代
- ✅ 鼓励频繁提交和小步快跑

**缺点：**
- ❌ 不适合多版本并行维护
- ❌ 缺少明确的发布分支概念
- ❌ 需要完善的自动化测试和部署

---

## 2.4 其他分支策略

### 2.4.1 GitLab Flow

GitLab Flow 是 Git Flow 和 GitHub Flow 的折中方案：

- 保持 main 分支稳定
- 使用环境分支（如 pre-production、production）
- 通过合并上游分支来部署

### 2.4.2 Trunk-Based Development

主干开发模式：

- 所有人直接在主干（trunk/main）上开发
- 使用特性开关（Feature Flag）控制未完成功能
- 强调频繁集成和自动化测试
- 适合高度自动化的团队

---

## 2.5 如何选择分支策略？

### 2.5.1 选择考虑因素

| 因素 | Git Flow | GitHub Flow | Trunk-Based |
|------|----------|-------------|-------------|
| 发布频率 | 低（按版本） | 高（随时部署） | 非常高（每天多次） |
| 团队规模 | 中大型 | 中小团队 | 成熟团队 |
| 项目类型 | 传统软件 | Web 应用 | SaaS 产品 |
| 自动化程度 | 一般 | 较高 | 非常高 |
| 学习成本 | 高 | 低 | 中 |

### 2.5.2 推荐方案

**初创团队 / 小型项目**
- 推荐：GitHub Flow
- 理由：简单、灵活、快速迭代

**中大型团队 / 有计划发布**
- 推荐：Git Flow
- 理由：规范、可控、多版本支持

**高度自动化 / 持续部署**
- 推荐：Trunk-Based Development
- 理由：效率最高，适合 DevOps 成熟团队

---

## 2.6 分支命名规范

### 2.6.1 常用命名约定

```
# 功能分支
feature/user-authentication
feature/add-payment-gateway

# Bug 修复
fix/login-error-handling
fix/issue-123-button-style

# 热修复
hotfix/security-patch
hotfix/v2.1.1-crash

# 发布分支
release/v1.0.0
release/2024-q1

# 文档
docs/api-guide
docs/readme-update

# 实验
experiment/ai-code-review
spike/database-migration
```

### 2.6.2 命名最佳实践

- ✅ 使用有意义的名称，避免 `fix-bug` 这种模糊命名
- ✅ 使用小写字母和连字符（kebab-case）
- ✅ 前缀明确分支类型
- ✅ 可以关联 Issue 编号，如 `feature/123-user-login`
- ❌ 不要使用人名，如 `zhangsan-branch`
- ❌ 不要使用日期，如 `20240101-branch`

---

## 2.7 实战练习

### 练习：使用 GitHub Flow 开发一个功能

```bash
# 1. 确保 main 是最新的
git checkout main
git pull origin main

# 2. 创建功能分支
git checkout -b feature/user-profile

# 3. 开发功能，多次提交
# ... 修改代码 ...
git add .
git commit -m "Add user profile page"

# ... 继续修改 ...
git add .
git commit -m "Add avatar upload feature"

# 4. 推送到远程
git push -u origin feature/user-profile

# 5. 在 GitHub 上创建 PR

# 6. Code Review 后合并 PR

# 7. 删除本地分支
git checkout main
git pull origin main
git branch -d feature/user-profile
```

---

## 📚 延伸阅读

- [Git Flow 原始论文](https://nvie.com/posts/a-successful-git-branching-model/)
- [GitHub Flow 官方文档](https://docs.github.com/en/get-started/quickstart/github-flow)
- [Trunk-Based Development](https://trunkbaseddevelopment.com/)

---

**← [上一章：Git 与 GitHub 基础](01-git-github-basics.md) | [下一章：Pull Request 工作流程](03-pull-request-workflow.md) →**
