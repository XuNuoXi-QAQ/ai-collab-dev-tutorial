# Git 配置示例
# 将此文件内容复制到 ~/.gitconfig 中使用
# 或使用 git config 命令逐条设置

# ============================================
# 用户信息（不建议全局设置，建议每个仓库单独设置）
# ============================================
# [user]
#     name = Your Name
#     email = your.email@example.com

# ============================================
# 核心配置
# ============================================
[core]
    # 默认编辑器（可选：vim、nano、code --wait）
    editor = vim
    
    # 自动处理换行符（Windows 设为 true，Linux/macOS 设为 input）
    autocrlf = input
    
    # 忽略文件权限变化
    filemode = false
    
    # 大文件阈值
    bigFileThreshold = 100m

# ============================================
# 颜色配置
# ============================================
[color]
    # 启用颜色输出
    ui = auto

[color "branch"]
    current = yellow reverse
    local = yellow
    remote = green

[color "diff"]
    meta = yellow bold
    frag = magenta bold
    old = red bold
    new = green bold

[color "status"]
    added = green
    changed = yellow
    untracked = red

# ============================================
# 别名配置（常用命令简写）
# ============================================
[alias]
    # 查看状态
    st = status
    
    # 查看提交历史
    lg = log --oneline --graph --all --decorate
    lga = log --oneline --graph --all --decorate --author-date-order
    lg1 = log --oneline --graph --all --decorate --pretty=format:'%C(yellow)%h%Creset -%C(auto)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset'
    
    # 查看最后一次提交
    last = log -1 HEAD
    
    # 查看未暂存的改动
    df = diff
    
    # 查看已暂存的改动
    dc = diff --cached
    
    # 添加所有改动
    aa = add -A
    
    # 提交
    cm = commit -m
    ca = commit --amend
    cma = commit --amend --no-edit
    
    # 检出
    co = checkout
    cob = checkout -b
    
    # 分支
    br = branch
    bra = branch -a
    
    # 拉取（使用 rebase）
    pl = pull --rebase
    
    # 推送
    ps = push
    psf = push --force-with-lease
    
    # 合并
    mg = merge --no-ff
    
    # 变基
    rb = rebase
    rbi = rebase -i
    
    # 暂存
    sh = stash
    sha = stash apply
    shl = stash list
    
    # 查看远程仓库
    rv = remote -v
    
    # 撤销工作区修改
    unstage = reset HEAD --
    discard = checkout --
    
    # 统计提交信息
    count = shortlog -sn

# ============================================
# 拉取配置
# ============================================
[pull]
    # 默认使用 rebase 而非 merge
    rebase = true

# ============================================
# 推送配置
# ============================================
[push]
    # 默认推送当前分支
    default = simple
    
    # 自动设置上游分支
    autoSetupRemote = true

# ============================================
# 初始化配置
# ============================================
[init]
    # 默认分支名
    defaultBranch = main

# ============================================
# 变基配置
# ============================================
[rebase]
    # 变基时自动暂存未提交的改动
    autoStash = true

# ============================================
# 差异比较配置
# ============================================
[diff]
    # 使用更好的差异算法
    algorithm = histogram
    
    # 重命名检测
    renames = copies

# ============================================
# 分页器配置
# ============================================
[pager]
    # 关闭某些命令的分页输出
    # status = false
    # branch = false

# ============================================
# 凭据存储（可选）
# ============================================
# [credential]
#     helper = store
#     helper = cache --timeout=3600

# ============================================
# 安全配置
# ============================================
[safe]
    # 允许的目录（解决所有权问题）
    # directory = *

# ============================================
# 使用说明
# ============================================

# 1. 查看当前配置：
#    git config --list
#
# 2. 设置全局配置：
#    git config --global user.name "Your Name"
#    git config --global user.email "your.email@example.com"
#
# 3. 设置仓库级配置（推荐）：
#    cd your-repo
#    git config user.name "Your Name"
#    git config user.email "your.email@example.com"
#
# 4. 取消全局配置（多账户管理推荐）：
#    git config --global --unset user.name
#    git config --global --unset user.email
#
# 5. 编辑配置文件：
#    git config --global --edit
