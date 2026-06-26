---
title: "12SSH 与密钥管理命令精讲"
tags:
  - Linux
  - SSH
  - 密钥
  - 安全
  - 运维
description: "SSH（Secure Shell）是远程连接 Linux 服务器的核心工具，也是与 GitHub 等代码托管平台安全通信的基础。这组命令帮助你生成、管理和使用 SSH 密钥。"
---

# SSH 与密钥管理命令精讲

SSH（Secure Shell）是远程连接 Linux 服务器的核心工具，也是与 GitHub 等代码托管平台安全通信的基础。这组命令帮助你生成、管理和使用 SSH 密钥。

---

## 一、核心概念

### 什么是 SSH？
SSH（Secure Shell）是一种**加密的网络协议**，用于在不安全的网络中安全地远程登录和执行命令。它通过加密所有传输数据来防止窃听、连接劫持和其他攻击。

### SSH 密钥认证原理
| 组件 | 作用 | 类比 |
|------|------|------|
| **私钥 (Private Key)** | 留在本地，**绝对保密** | 你的身份证原件 |
| **公钥 (Public Key)** | 上传到远程服务器/GitHub | 身份证复印件 |
| **认证过程** | 服务器用公钥验证私钥签名 | 对方核对复印件是否匹配原件 |

### 常用 SSH 密钥算法
| 算法 | 安全性 | 推荐度 | 命令参数 |
|------|--------|--------|----------|
| **Ed25519** | 极高 | ⭐⭐⭐⭐⭐（**最推荐**） | `-t ed25519` |
| RSA 4096 | 高 | ⭐⭐⭐⭐ | `-t rsa -b 4096` |
| ECDSA | 高 | ⭐⭐⭐ | `-t ecdsa` |
| RSA 2048 | 中 | ⭐⭐（已不推荐） | `-t rsa -b 2048` |

### 密钥文件位置
```
~/.ssh/
├── id_ed25519          # 私钥（权限 600）
├── id_ed25519.pub      # 公钥（权限 644）
├── known_hosts         # 已知服务器指纹
└── config              # SSH 配置文件（管理多账户）
```

---

## 2. `ssh-keygen -t ed25519 -C "邮箱"` — 生成 SSH 密钥

### 命令格式
```bash
ssh-keygen -t ed25519 -C "邮箱"                    # 生成 Ed25519 密钥
ssh-keygen -t ed25519 -C "邮箱" -f ~/.ssh/id_ed25519_xxx  # 指定文件名
ssh-keygen -t rsa -b 4096 -C "邮箱"                # 生成 RSA 4096 密钥
```

### 参数说明
| 参数 | 含义 |
|------|------|
| `-t ed25519` | 指定算法类型（推荐 Ed25519） |
| `-t rsa -b 4096` | RSA 算法，4096 位 |
| `-C "邮箱"` | 添加注释（建议用邮箱，便于识别） |
| `-f 路径` | 指定密钥文件路径和名称 |
| `-N "密码"` | 设置私钥密码（非交互式） |

### 实际应用（你之前生成过多个密钥）
```bash
# 生成默认密钥（你之前用过）
ssh-keygen -t ed25519 -C "your_email@example.com"

# 生成指定名称的密钥
ssh-keygen -t ed25519 -C "personal@example.com" -f ~/.ssh/id_ed25519_personal

# 生成工作账户密钥
ssh-keygen -t ed25519 -C "work@company.com" -f ~/.ssh/id_ed25519_work

# 生成 RSA 密钥（如果 Ed25519 不可用）
ssh-keygen -t rsa -b 4096 -C "email@example.com"
```

### 执行过程
```
$ ssh-keygen -t ed25519 -C "email@example.com"
Generating public/private ed25519 key pair.
Enter file in which to save the key (/home/nuoxi/.ssh/id_ed25519): （按回车使用默认路径）
Enter passphrase (empty for no passphrase): （输入密码，建议设置）
Enter same passphrase again: （再次输入）
Your identification has been saved in /home/nuoxi/.ssh/id_ed25519
Your public key has been saved in /home/nuoxi/.ssh/id_ed25519.pub
The key fingerprint is:
SHA256:xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx email@example.com
```

### 密钥文件说明
| 文件 | 权限 | 用途 |
|------|------|------|
| `id_ed25519` | `600` | 私钥，**绝不能泄露** |
| `id_ed25519.pub` | `644` | 公钥，可上传到服务器/GitHub |
| `id_ed25519` | `600` | 私钥，**绝不能泄露** |
| `id_ed25519.pub` | `644` | 公钥，可上传到服务器/GitHub |

---

## 3. `ssh-copy-id 用户@IP` — 复制公钥到远程服务器

### 命令格式
```bash
ssh-copy-id user@192.168.1.100        # 复制默认公钥
ssh-copy-id -i ~/.ssh/id_ed25519.pub user@192.168.1.100  # 指定公钥
ssh-copy-id -p 2222 user@192.168.1.100  # 指定端口
```

### 工作原理
`ssh-copy-id` 会自动将你的公钥添加到远程服务器的 `~/.ssh/authorized_keys` 文件中，之后你就可以免密码登录。

### 实际应用
```bash
# 复制默认公钥到服务器
ssh-copy-id nuoxi@192.168.1.100

# 指定公钥文件
ssh-copy-id -i ~/.ssh/id_ed25519_work.pub nuoxi@192.168.1.100

# 指定端口
ssh-copy-id -p 2222 nuoxi@192.168.1.100

# 手动添加（如果 ssh-copy-id 不可用）
cat ~/.ssh/id_ed25519.pub | ssh user@192.168.1.100 "mkdir -p ~/.ssh && cat >> ~/.ssh/authorized_keys"
```

---

## 4. `cat ~/.ssh/id_ed25519.pub` — 查看公钥内容

### 命令格式
```bash
cat ~/.ssh/id_ed25519.pub        # 查看默认公钥
cat ~/.ssh/id_ed25519_xxx.pub    # 查看指定公钥
```

### 输出示例
```bash
cat ~/.ssh/id_ed25519.pub
```
```
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx email@example.com
```

### 公钥格式
```
ssh-ed25519 [密钥字符串] [注释]
    │            │            │
    │            │            └─ 注释（通常为邮箱）
    │            └─ 公钥数据
    └─ 算法类型
```

### 实际应用
```bash
# 查看公钥（复制到 GitHub）
cat ~/.ssh/id_ed25519.pub

# 复制到剪贴板（Wayland）
cat ~/.ssh/id_ed25519.pub | wl-copy

# 查看所有公钥
ls -la ~/.ssh/*.pub
```

---

## 5. `ssh-add ~/.ssh/id_ed25519` — 将私钥添加到代理

### 命令格式
```bash
ssh-add ~/.ssh/id_ed25519       # 添加默认私钥
ssh-add ~/.ssh/id_ed25519_xxx   # 添加指定私钥
ssh-add -l                      # 查看已添加的密钥
ssh-add -D                      # 清除所有密钥
```

### 什么是 ssh-agent？
`ssh-agent` 是一个后台程序，用于管理私钥。它让你只需输入一次密码，之后所有 SSH 连接都自动使用已加载的密钥。

### 实际应用
```bash
# 启动 ssh-agent
eval "$(ssh-agent -s)"

# 添加私钥
ssh-add ~/.ssh/id_ed25519

# 添加多个私钥
ssh-add ~/.ssh/id_ed25519_personal
ssh-add ~/.ssh/id_ed25519_work

# 查看已添加的密钥
ssh-add -l

# 清除所有密钥
ssh-add -D
```

---

## 6. `ssh-agent -s` — 启动 SSH 代理

### 命令格式
```bash
eval "$(ssh-agent -s)"        # 启动 ssh-agent
eval "$(ssh-agent -s)"        # 启动 ssh-agent
```

### 输出示例
```
Agent pid 12345
```

### 在 .zshrc 中自动启动
```bash
# 添加到 ~/.zshrc
if [ -z "$SSH_AUTH_SOCK" ] ; then
    eval "$(ssh-agent -s)"
    ssh-add ~/.ssh/id_ed25519 2>/dev/null
fi
```

### 实际应用
```bash
# 启动 ssh-agent
eval "$(ssh-agent -s)"

# 查看 SSH_AUTH_SOCK 环境变量
echo $SSH_AUTH_SOCK
# /tmp/ssh-xxxxxxxxxxxx/agent.12345
```

---

## 7. `chmod 600 ~/.ssh/id_*` — 设置私钥权限

### 为什么需要设置权限？
SSH 对密钥文件权限有严格要求：
- 私钥必须只有所有者可读写（`600`）
- 如果权限太宽松，SSH 会拒绝使用该密钥

### 命令格式
```bash
chmod 600 ~/.ssh/id_ed25519          # 设置私钥权限
chmod 644 ~/.ssh/id_ed25519.pub      # 设置公钥权限
chmod 700 ~/.ssh                     # 设置 .ssh 目录权限
```

### 权限对照
| 文件 | 正确权限 | 命令 |
|------|----------|------|
| 私钥 | `600`（-rw-------） | `chmod 600 ~/.ssh/id_*` |
| 公钥 | `644`（-rw-r--r--） | `chmod 644 ~/.ssh/*.pub` |
| .ssh 目录 | `700`（drwx------） | `chmod 700 ~/.ssh` |
| authorized_keys | `600`（-rw-------） | `chmod 600 ~/.ssh/authorized_keys` |
| config | `600`（-rw-------） | `chmod 600 ~/.ssh/config` |

### 实际应用
```bash
# 批量设置权限
chmod 600 ~/.ssh/id_*

# 设置公钥权限
chmod 644 ~/.ssh/*.pub

# 设置 .ssh 目录权限
chmod 700 ~/.ssh

# 检查权限
ls -la ~/.ssh/
```

---

## 8. `~/.ssh/config` — SSH 配置文件（管理多账户）

### 配置文件格式
```bash
# 个人账户
Host github.com-personal
    HostName github.com
    User git
    IdentityFile ~/.ssh/id_ed25519_personal

# 工作账户
Host github.com-work
    HostName github.com
    User git
    IdentityFile ~/.ssh/id_ed25519_work

# 远程服务器
Host myserver
    HostName 192.168.1.100
    User nuoxi
    Port 22
    IdentityFile ~/.ssh/id_ed25519
```

### 配置项说明
| 配置项 | 含义 | 示例 |
|--------|------|------|
| `Host` | 别名（用于命令中） | `github.com-personal` |
| `HostName` | 实际服务器地址 | `github.com` / `192.168.1.100` |
| `User` | 登录用户名 | `git` / `nuoxi` |
| `IdentityFile` | 使用的私钥文件 | `~/.ssh/id_ed25519_personal` |
| `Port` | SSH 端口 | `22`（默认） |
| `ProxyCommand` | 代理命令 | 用于通过代理连接 |

### 实际应用（你已配置）
```bash
# 查看配置
cat ~/.ssh/config

# 使用别名连接
ssh myserver
# 等同于 ssh nuoxi@192.168.1.100

# 克隆 GitHub 仓库（使用别名）
git clone git@github.com-personal:username/repo.git
```

---

## 9. 常见 SSH 故障排查

### 问题1：`Permission denied (publickey)`

| 检查项 | 命令 |
|--------|------|
| 公钥是否已添加到服务器/GitHub | `cat ~/.ssh/id_ed25519.pub` 对比 GitHub 设置 |
| 私钥权限是否正确 | `ls -la ~/.ssh/id_ed25519` |
| ssh-agent 是否已加载密钥 | `ssh-add -l` |
| 配置文件是否正确 | `cat ~/.ssh/config` |

### 问题2：`Connection refused`

| 检查项 | 命令 |
|--------|------|
| 服务器 SSH 服务是否运行 | `systemctl status sshd` |
| 端口是否正确 | 检查 `-p` 参数 |
| 防火墙是否放行 | `sudo ufw status` |

### 问题3：`Connection timed out`

| 检查项 | 命令 |
|--------|------|
| 网络是否可达 | `ping 192.168.1.100` |
| SSH 端口是否开放 | `nmap -p 22 192.168.1.100` |

---

## 📊 SSH 命令快速参考卡

| 操作 | 命令 |
|------|------|
| 生成密钥（Ed25519） | `ssh-keygen -t ed25519 -C "邮箱"` |
| 生成密钥（RSA 4096） | `ssh-keygen -t rsa -b 4096 -C "邮箱"` |
| 查看公钥 | `cat ~/.ssh/id_ed25519.pub` |
| 启动 ssh-agent | `eval "$(ssh-agent -s)"` |
| 添加私钥到代理 | `ssh-add ~/.ssh/id_ed25519` |
| 复制公钥到服务器 | `ssh-copy-id user@IP` |
| SSH 连接 | `ssh user@IP` |
| 测试 GitHub 连接 | `ssh -T git@github.com` |
| 设置私钥权限 | `chmod 600 ~/.ssh/id_*` |
| 查看配置 | `cat ~/.ssh/config` |

---

## 💡 你的实战场景

### 场景1：生成多账户 SSH 密钥（你已做过）
```bash
# 账户 A（代理）
ssh-keygen -t ed25519 -C "your_qq@qq.com" -f ~/.ssh/id_ed25519_a

# 账户 B（常用）
ssh-keygen -t ed25519 -C "your_outlook@outlook.com" -f ~/.ssh/id_ed25519_b

# 账户 C（工作）
ssh-keygen -t ed25519 -C "your_gmail@gmail.com" -f ~/.ssh/id_ed25519_c
```

### 场景2：配置多账户 SSH（你已做过）
```
Host github.com-a
    HostName github.com
    User git
    IdentityFile ~/.ssh/id_ed25519_a

Host github.com-b
    HostName github.com
    User git
    IdentityFile ~/.ssh/id_ed25519_b

Host github.com-c
    HostName github.com
    User git
    IdentityFile ~/.ssh/id_ed25519_c
```

### 场景3：测试 GitHub 连接（你已成功执行）
```bash
# 测试默认账户
ssh -T git@github.com

# 测试特定账户
ssh -T -i ~/.ssh/id_ed25519_b git@github.com

# 使用别名测试
ssh -T git@github.com-b
```

### 场景4：复制公钥到服务器
```bash
# 复制公钥
ssh-copy-id nuoxi@192.168.1.100

# 指定端口
ssh-copy-id -p 2222 nuoxi@192.168.1.100

# 验证免密码登录
ssh nuoxi@192.168.1.100
```

---

## ⚠️ 安全提醒

1. **私钥绝对不可泄露**：不要将私钥文件发给任何人。
2. **私钥权限必须是 600**：否则 SSH 会拒绝使用。
3. **使用 Ed25519 算法**：比 RSA 更快、更安全。
4. **设置私钥密码**：即使私钥被窃取，没有密码也无法使用。
5. **定期更换密钥**：建议每 1-2 年更换一次。
6. **在 GitHub 上定期检查密钥**：移除不再使用的密钥。
7. **备份私钥要加密**：备份时使用加密工具保护。