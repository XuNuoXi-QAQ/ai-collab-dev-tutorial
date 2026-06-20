# 第 1 章：Git 与 GitHub 基础入门

## 🎯 学习目标

完成本章学习后，你将能够：
- 理解版本控制的核心概念
- 掌握 Git 的基本操作命令
- 了解 GitHub 的主要功能
- 能够创建远程仓库并进行基本的代码同步

---

## 1.1 什么是版本控制？

### 1.1.1 版本控制的概念

版本控制（Version Control）是一种记录文件内容变化，以便将来查阅特定版本修订情况的系统。

**为什么需要版本控制？**

- 📝 **历史记录**：追踪文件的所有修改历史
- 👥 **团队协作**：多人同时开发互不干扰
- 🔄 **版本回退**：可以随时回到任意历史版本
- 🚀 **分支管理**：并行开发不同功能
- ✅ **代码审查**：确保代码质量

### 1.1.2 版本控制系统的分类

| 类型 | 代表工具 | 特点 |
|------|----------|------|
| 本地版本控制 | RCS | 单机使用，无法协作 |
| 集中式版本控制 | SVN、CVS | 中央服务器，单点故障风险 |
| 分布式版本控制 | Git、Mercurial | 每个客户端都是完整仓库 |

---

## 1.2 Git 基础概念

### 1.2.1 Git 的三个工作区域

```
工作区 (Working Directory)
    ↓ git add
暂存区 (Staging Area)
    ↓ git commit
本地仓库 (Local Repository)
    ↓ git push
远程仓库 (Remote Repository)
```

- **工作区**：你在电脑里能看到的目录，直接编辑文件的地方
- **暂存区**：临时存放你的改动，准备提交的区域
- **本地仓库**：存储所有提交记录的地方
- **远程仓库**：托管在网络上的项目仓库

### 1.2.2 Git 文件的四种状态

| 状态 | 说明 |
|------|------|
| Untracked | 未跟踪，新文件未加入版本控制 |
| Modified | 已修改，文件已改动但未暂存 |
| Staged | 已暂存，文件已加入暂存区 |
| Committed | 已提交，文件已保存到本地仓库 |

---

## 1.3 Git 基本命令

### 1.3.1 配置 Git

```bash
# 配置用户名
git config --global user.name "Your Name"

# 配置邮箱
git config --global user.email "your.email@example.com"

# 查看配置
git config --list
```

### 1.3.2 创建仓库

```bash
# 初始化新仓库
git init

# 克隆远程仓库
git clone https://github.com/username/repository.git
```

### 1.3.3 基本操作

```bash
# 查看文件状态
git status

# 添加文件到暂存区
git add filename.txt          # 添加单个文件
git add .                     # 添加所有文件
git add *.py                  # 添加所有 .py 文件

# 提交更改
git commit -m "提交说明"
git commit -am "提交说明"     # 跳过 add，直接提交已跟踪的文件

# 查看提交历史
git log
git log --oneline             # 简洁显示
git log --graph               # 图形化显示分支
```

### 1.3.4 撤销操作

```bash
# 撤销工作区的修改
git checkout -- filename.txt

# 撤销暂存区的文件
git reset HEAD filename.txt

# 撤销最近一次提交（保留修改）
git reset --soft HEAD~1

# 撤销最近一次提交（丢弃修改）
git reset --hard HEAD~1
```

---

## 1.4 GitHub 入门

### 1.4.1 什么是 GitHub？

GitHub 是一个基于 Git 的代码托管平台，提供了：

- 🌐 **远程仓库托管**：免费的公开和私有仓库
- 🔧 **Issue 追踪**：问题跟踪和任务管理
- 🔀 **Pull Request**：代码审查和合并请求
- 📊 **项目管理**：看板、里程碑等项目工具
- 👥 **团队协作**：组织、团队权限管理

### 1.4.2 GitHub 核心概念

| 概念 | 说明 |
|------|------|
| Repository (仓库) | 项目的所有文件和版本历史 |
| Fork (复刻) | 复制别人的仓库到自己账号下 |
| Star (收藏) | 收藏感兴趣的项目 |
| Watch (关注) | 接收项目的更新通知 |
| Issue (议题) | 讨论问题、功能建议、Bug 报告 |
| Pull Request (PR) | 提交代码合并请求 |
| Release (发布) | 项目的版本发布 |

### 1.4.3 创建第一个 GitHub 仓库

1. 登录 GitHub 账号
2. 点击右上角 "+" → "New repository"
3. 填写仓库名称和描述
4. 选择公开或私有
5. 可选：添加 README、.gitignore、许可证
6. 点击 "Create repository"

---

## 1.5 远程仓库操作

### 1.5.1 添加远程仓库

```bash
# 添加远程仓库
git remote add origin https://github.com/username/repo.git

# 查看远程仓库
git remote -v

# 修改远程仓库地址
git remote set-url origin new-url
```

### 1.5.2 推送与拉取

```bash
# 推送到远程仓库
git push origin main
git push -u origin main      # 首次推送并设置上游分支

# 拉取远程更新
git pull origin main

# 获取远程更新但不合并
git fetch origin
```

---

## 1.6 .gitignore 文件

### 1.6.1 什么是 .gitignore？

`.gitignore` 文件用于指定 Git 应该忽略的文件和目录，这些文件不会被提交到仓库中。

### 1.6.2 常见忽略规则

```gitignore
# 依赖目录
node_modules/
__pycache__/
venv/

# 构建产物
dist/
build/
*.exe
*.dll

# 日志文件
*.log
logs/

# 环境变量
.env
.env.local

# IDE 配置
.vscode/
.idea/
*.swp

# 系统文件
.DS_Store
Thumbs.db
```

---

## 1.7 实战练习

### 练习 1：创建本地仓库并提交

```bash
# 1. 创建项目目录
mkdir my-first-git-project
cd my-first-git-project

# 2. 初始化 Git 仓库
git init

# 3. 创建 README 文件
echo "# My First Git Project" > README.md

# 4. 查看状态
git status

# 5. 添加文件到暂存区
git add README.md

# 6. 提交
git commit -m "Initial commit: add README"

# 7. 查看历史
git log
```

### 练习 2：关联远程仓库并推送

```bash
# 1. 在 GitHub 上创建空仓库

# 2. 添加远程仓库
git remote add origin https://github.com/your-username/my-first-git-project.git

# 3. 重命名分支为 main（如果默认是 master）
git branch -M main

# 4. 推送到远程
git push -u origin main
```

---

## 1.8 常见问题

### Q: 如何修改最近一次提交的 message？
```bash
git commit --amend -m "新的提交信息"
```

### Q: 如何删除远程分支？
```bash
git push origin --delete branch-name
```

### Q: 如何查看某个文件的修改历史？
```bash
git log -- filename.txt
git blame filename.txt    # 查看每行最后修改者
```

---

## 📚 延伸阅读

- [Git 官方文档](https://git-scm.com/doc)
- [GitHub 官方文档](https://docs.github.com/)
- [Pro Git 书籍（中文版）](https://git-scm.com/book/zh/v2)

---

**下一章：[分支管理策略](02-branch-management.md)** →
