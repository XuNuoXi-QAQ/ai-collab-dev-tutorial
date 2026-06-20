#!/bin/bash

# ============================================
# Git 常用命令速查手册
# ============================================

# ---------- 配置相关 ----------

# 配置用户名和邮箱
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# 查看配置
git config --list

# 配置默认分支名为 main
git config --global init.defaultBranch main

# 配置别名
git config --global alias.st status
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.ci commit
git config --global alias.lg "log --oneline --graph --all"


# ---------- 仓库初始化 ----------

# 初始化新仓库
git init

# 克隆远程仓库
git clone https://github.com/username/repo.git

# 克隆到指定目录
git clone https://github.com/username/repo.git my-project


# ---------- 基本操作 ----------

# 查看文件状态
git status

# 添加文件到暂存区
git add filename.txt          # 添加单个文件
git add .                     # 添加所有文件
git add *.py                  # 添加所有 .py 文件
git add -A                    # 添加所有变化（包括删除）

# 提交更改
git commit -m "提交说明"
git commit -am "提交说明"     # 跳过 add，直接提交已跟踪的文件
git commit --amend            # 修改最近一次提交

# 查看提交历史
git log
git log --oneline             # 简洁显示
git log --graph               # 图形化显示
git log --oneline --graph --all  # 显示所有分支
git log -p                    # 显示每次提交的具体变化
git log --stat                # 显示统计信息


# ---------- 分支操作 ----------

# 查看分支
git branch                    # 查看本地分支
git branch -a                 # 查看所有分支（本地+远程）
git branch -v                 # 查看分支及最后提交

# 创建分支
git branch feature-name       # 创建新分支
git checkout -b feature-name  # 创建并切换到新分支
git switch -c feature-name    # Git 2.23+ 新命令

# 切换分支
git checkout feature-name     # 切换分支
git switch feature-name       # Git 2.23+ 新命令
git switch -                  # 切换到上一个分支

# 删除分支
git branch -d feature-name    # 删除已合并的分支
git branch -D feature-name    # 强制删除分支

# 重命名分支
git branch -m old-name new-name


# ---------- 合并与变基 ----------

# 合并分支
git merge feature-name        # 合并指定分支到当前分支
git merge --no-ff feature-name  # 禁止快进合并，创建合并提交

# 变基
git rebase main               # 将当前分支变基到 main 上
git rebase -i HEAD~3          # 交互式变基（整理最近 3 个提交）

# 中止变基
git rebase --abort

# 继续变基（解决冲突后）
git rebase --continue


# ---------- 远程仓库操作 ----------

# 查看远程仓库
git remote -v

# 添加远程仓库
git remote add origin https://github.com/username/repo.git

# 修改远程仓库地址
git remote set-url origin new-url

# 删除远程仓库
git remote remove origin

# 推送到远程
git push origin main
git push -u origin main       # 首次推送并设置上游分支
git push origin --all         # 推送所有分支
git push origin --tags        # 推送所有标签

# 拉取远程更新
git pull origin main          # 拉取并合并
git pull --rebase origin main # 拉取并变基

# 获取远程更新但不合并
git fetch origin
git fetch --all               # 获取所有远程仓库


# ---------- 撤销操作 ----------

# 撤销工作区的修改
git checkout -- filename.txt
git restore filename.txt      # Git 2.23+ 新命令

# 撤销暂存区的文件
git reset HEAD filename.txt
git restore --staged filename.txt  # Git 2.23+ 新命令

# 撤销最近一次提交（保留修改）
git reset --soft HEAD~1

# 撤销最近一次提交（丢弃修改）
git reset --hard HEAD~1

# 回退到指定提交
git reset --hard commit-hash

# 创建新提交来撤销之前的提交（安全）
git revert commit-hash


# ---------- 标签操作 ----------

# 查看标签
git tag

# 创建标签
git tag v1.0.0                # 轻量标签
git tag -a v1.0.0 -m "Release 1.0.0"  # 附注标签

# 查看标签信息
git show v1.0.0

# 删除标签
git tag -d v1.0.0

# 推送标签到远程
git push origin v1.0.0
git push origin --tags


# ---------- 暂存（Stash） ----------

# 暂存当前修改
git stash
git stash save "暂存说明"

# 查看暂存列表
git stash list

# 应用最近的暂存
git stash apply

# 应用并删除最近的暂存
git stash pop

# 删除最近的暂存
git stash drop

# 清空所有暂存
git stash clear


# ---------- 查看差异 ----------

# 查看工作区和暂存区的差异
git diff

# 查看暂存区和最后一次提交的差异
git diff --cached
git diff --staged             # 同上

# 查看工作区和最后一次提交的差异
git diff HEAD

# 比较两个分支的差异
git diff main..feature

# 查看某个文件的修改历史
git log -p filename.txt
git blame filename.txt        # 查看每行最后修改者


# ---------- 清理操作 ----------

# 查看哪些文件会被删除
git clean -n

# 删除未跟踪的文件
git clean -f

# 删除未跟踪的文件和目录
git clean -fd

# 删除未跟踪的文件，包括 .gitignore 中忽略的
git clean -fx


# ---------- 实用技巧 ----------

# 查看最近一次提交的内容
git show

# 查看某次提交的内容
git show commit-hash

# 查看某个文件在某次提交时的版本
git show commit-hash:filename.txt

# 搜索提交历史
git log --grep="关键词"

# 按作者过滤
git log --author="username"

# 统计某人的提交次数
git shortlog -sn

# 查看当前分支是从哪个分支来的
git log --oneline --decorate --graph --all

# ============================================
# 常用工作流示例
# ============================================

# ---------- GitHub Flow ----------

# 1. 同步主分支
git checkout main
git pull origin main

# 2. 创建功能分支
git checkout -b feature/my-feature

# 3. 开发并提交
# ... 修改代码 ...
git add .
git commit -m "feat: add my feature"

# 4. 推送到远程
git push -u origin feature/my-feature

# 5. 在 GitHub 上创建 PR
# 6. Code Review
# 7. 合并 PR

# 8. 清理本地
git checkout main
git pull origin main
git branch -d feature/my-feature


# ---------- 解决合并冲突 ----------

# 1. 合并时发生冲突
git merge feature-branch
# 提示冲突

# 2. 查看冲突文件
git status

# 3. 手动编辑冲突文件，解决冲突
# 冲突标记：
# <<<<<<< HEAD
# 当前分支的内容
# =======
# 要合并的分支的内容
# >>>>>>> feature-branch

# 4. 标记为已解决
git add conflict-file.txt

# 5. 完成合并
git commit

# 6. 推送
git push


# ============================================
# 提示：把这个文件加到你的 ~/.bashrc 或 ~/.zshrc 中，
# 或者用 alias 快速查看：alias git-cheat="cat /path/to/git-commands.sh"
# ============================================
