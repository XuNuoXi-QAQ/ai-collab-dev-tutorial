# SSH 多账户配置示例
# 将此文件内容复制到 ~/.ssh/config 中使用
# 注意：请根据实际情况修改密钥文件路径和邮箱

# ============================================
# GitHub 多账户配置
# ============================================

# 账户 A：代理/自动化账户
# 用途：CI/CD、机器人操作、Agent 协作
Host github.com-a
    HostName github.com
    User git
    IdentityFile ~/.ssh/id_ed25519_a
    IdentitiesOnly yes

# 账户 B：个人常用账户
# 用途：日常开发、个人项目
Host github.com-b
    HostName github.com
    User git
    IdentityFile ~/.ssh/id_ed25519_b
    IdentitiesOnly yes

# 账户 C：工作账户
# 用途：公司项目、正式协作
Host github.com-c
    HostName github.com
    User git
    IdentityFile ~/.ssh/id_ed25519_c
    IdentitiesOnly yes

# ============================================
# 其他 Git 托管平台（可选）
# ============================================

# GitLab
Host gitlab.com
    HostName gitlab.com
    User git
    IdentityFile ~/.ssh/id_ed25519_gitlab
    IdentitiesOnly yes

# Gitee（码云）
Host gitee.com
    HostName gitee.com
    User git
    IdentityFile ~/.ssh/id_ed25519_gitee
    IdentitiesOnly yes

# ============================================
# 通用配置
# ============================================

# 所有主机的通用配置
Host *
    # 保持连接活跃，防止超时断开
    ServerAliveInterval 60
    ServerAliveCountMax 3
    
    # 禁用密码认证（仅使用密钥）
    PasswordAuthentication no
    
    # 禁用主机密钥检查（不安全，仅测试环境使用）
    # StrictHostKeyChecking no
    
    # 连接超时时间
    ConnectTimeout 10

# ============================================
# 使用说明
# ============================================

# 1. 生成 SSH 密钥：
#    ssh-keygen -t ed25519 -C "your_email@example.com" -f ~/.ssh/id_ed25519_xxx
#
# 2. 复制公钥到 GitHub：
#    cat ~/.ssh/id_ed25519_xxx.pub
#    然后粘贴到 GitHub Settings → SSH and GPG keys → New SSH key
#
# 3. 测试连接：
#    ssh -T git@github.com-b
#
# 4. 克隆仓库（使用对应的 Host 别名）：
#    git clone git@github.com-b:username/repo.git
#
# 5. 设置仓库用户信息（每个仓库单独设置）：
#    git config user.name "Your Name"
#    git config user.email "your_email@example.com"
#
# 6. 验证配置：
#    ssh -T git@github.com-b
#    应该显示：Hi username! You've successfully authenticated...
