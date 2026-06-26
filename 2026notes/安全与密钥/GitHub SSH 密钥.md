---
title: "GitHub SSH 密钥"
tags:
  - GitHub
  - SSH
  - 密钥
  - 安全
aliases:
  - "GitHub SSH"
  - "SSH Key GitHub"
description: "GitHub SSH 密钥本质上是一个安全的身份验证机制，它让你无需每次输入密码，就能通过 SSH 协议与 GitHub 进行安全的 Git 操作（如 clone、push、pull）。"
---

GitHub SSH 密钥本质上是一个**安全的身份验证机制**，它让你无需每次输入密码，就能通过 SSH 协议与 GitHub 进行安全的 Git 操作（如 clone、push、pull）。



### 🧠 原理篇：SSH 密钥如何工作？

SSH 密钥基于**非对称加密**，核心是一对密钥：

*   **私钥 (Private Key)**：相当于你的**个人印章**，存放在你的电脑上（`~/.ssh/id_ed25519`），**绝对不可泄露**。
*   **公钥 (Public Key)**：相当于**印章的印模**，可以公开，你把它放在 GitHub 账户上（Settings → SSH keys）。

**通信流程如下：**

1.  **声明身份**：当你执行 `git clone git@github.com:用户名/仓库.git` 时，你的 Git 客户端会向 GitHub 服务器发起连接请求，并声明“我是用户 X”。
2.  **挑战验证**：GitHub 收到请求后，会生成一个随机字符串（挑战），并用你存储在账户里的**公钥**加密它，然后发回给你的客户端。
3.  **解密回复**：你的客户端收到加密的挑战后，用本地的**私钥**解密，并将解密后的结果发回给 GitHub。
4.  **确认身份**：GitHub 验证解密结果是否正确。如果正确，就确认你的身份，允许访问；反之，则拒绝连接。

**关键优势在于：私钥从不通过网络传输，因此无法被中间人截获。**

---

### 🔧 实战篇：完整配置流程

如果尚未配置过，按以下步骤操作：

#### 第一步：检查已有密钥

在终端执行：
```bash
ls -la ~/.ssh/
```

如果看到 `id_ed25519` 和 `id_ed25519.pub`，说明已经有密钥对。如果已有且想使用新密钥，则跳过生成步骤。

#### 第二步：生成新密钥对（如需要）

```bash
ssh-keygen -t ed25519 -C "你的GitHub邮箱" -f ~/.ssh/id_ed25519_github
```

*   `-t ed25519`：指定使用更安全的 Ed25519 算法（推荐）。
*   `-C "邮箱"`：添加注释，便于识别。
*   `-f ~/.ssh/id_ed25519_github`：指定保存路径和文件名，便于区分不同密钥。

系统会提示你设置密码（passphrase），建议设置以增强安全性。

#### 第三步：将公钥添加到 GitHub

1.  **复制公钥内容**：
    ```bash
    cat ~/.ssh/id_ed25519_github.pub
    ```
    复制输出的全部内容（从 `ssh-ed25519` 开头到邮箱结尾）。

2.  **添加到 GitHub 账户**：
    *   登录 GitHub，点击右上角头像 → **Settings**。
    *   左侧菜单选择 **SSH and GPG keys**。
    *   点击 **New SSH key**。
    *   **Title** 填写描述（如 `My Manjaro`）。
    *   **Key type** 选择 **Authentication Key**。
    *   **Key** 中粘贴复制的公钥。
    *   点击 **Add SSH key**。

#### 第四步：配置 Git 使用 SSH

```bash
# 设置 Git 全局使用 SSH 协议（可选）
git config --global url."git@github.com:".insteadOf "https://github.com/"
```

#### 第五步：测试连接

```bash
ssh -T git@github.com
```

如果看到 `Hi, 用户名! You've successfully authenticated...`，表示配置成功。

---

### 🚀 日常使用篇：如何高效使用 SSH 密钥

#### 1. 克隆仓库时使用 SSH 地址

在 GitHub 仓库页面，点击 **Code** → **SSH**，复制地址（如 `git@github.com:用户名/仓库.git`），然后执行：
```bash
git clone git@github.com:用户名/仓库.git
```

#### 2. 管理多个 SSH 密钥（多账户场景）

如果需要管理多个 GitHub 账户（如个人和工作），可以配置 `~/.ssh/config` 文件：

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
```

克隆时使用对应的别名：
```bash
git clone git@github.com-personal:用户名/仓库.git
```

#### 3. 通过 443 端口连接（网络受限时）

如果所在网络屏蔽了 SSH 默认的 22 端口，可以配置 SSH 通过 443 端口连接。编辑 `~/.ssh/config`，添加：

```
Host github.com
    HostName ssh.github.com
    User git
    Port 443
```

#### 4. 密钥管理最佳实践

*   **定期检查**：在 GitHub Settings → SSH keys 中，定期清理不再使用的密钥。
*   **备份私钥**：将私钥（如 `~/.ssh/id_ed25519_github`）备份到安全位置（如加密的 USB 盘）。
*   **权限设置**：确保私钥权限为 `600`：`chmod 600 ~/.ssh/id_ed25519_github`。
*   **使用 SSH agent**：通过 `ssh-add` 将私钥添加到 SSH agent，避免每次输入密码：
    ```bash
    eval "$(ssh-agent -s)"
    ssh-add ~/.ssh/id_ed25519_github
    ```

---

### 🔍 常见问题排查

| 问题现象 | 可能原因 | 解决方法 |
| :--- | :--- | :--- |
| `Permission denied (publickey)` | 公钥未正确添加到 GitHub，或使用了错误的私钥 | 检查 GitHub 上的公钥，确认本地使用的私钥匹配 |
| `Connection timed out` | 网络防火墙屏蔽 22 端口 | 配置 SSH 通过 443 端口连接（见上方方法） |
| `Host key verification failed` | 首次连接时未接受 GitHub 的主机密钥 | 执行 `ssh -T git@github.com`，输入 `yes` 确认 |
| 多个密钥混淆，无法推送 | Git 未使用正确的私钥 | 配置 `~/.ssh/config` 明确指定 `IdentityFile` |




好的，我们来把 GitHub 上 SSH 密钥的 **“Key type”（密钥类型）** 选项讲透彻。它确实决定了密钥的用途，但理解它背后的**使用场景和工作流程**，才是你做出正确选择的关键。

### 🔑 两种密钥类型的本质区别

| 特性 | **Authentication Key** | **Signing Key** |
| :--- | :--- | :--- |
| **类比** | 你的**门禁卡** | 你的**数字印章** |
| **核心作用** | **证明“你是谁”**，用于安全地登录和通信 | **证明“这是你做的”**，用于验证内容来源 |
| **使用场景** | `git clone`、`git push`、`git pull` 等所有 Git 操作 | `git commit -S`、`git tag -s` 等签名操作 |
| **验证时机** | **每次**与 GitHub 交互时，自动进行身份验证 | **当你主动**为提交或标签添加签名时触发 |
| **GitHub 上的体现** | 无直接视觉标识，但后台记录会关联你的操作 | 成功签名的提交会显示 **`Verified`** 绿色徽章 |
| **密钥保管** | 私钥必须安全保管，一旦泄露需立即更换 | 私钥同样重要，但泄露风险相对更低（使用频率低） |

---

### 🚀 实际工作流程解析

理解它们在工作流中的角色，才能明白为什么需要区分。

#### Authentication Key 的工作流
1.  **触发**：你执行 `git push origin main`。
2.  **请求**：你的 Git 客户端向 GitHub 发起连接请求，并带上你的用户名。
3.  **挑战**：GitHub 用你账户中的 **Authentication Key 公钥** 加密一个随机字符串，发回给你。
4.  **解密**：你的客户端用本地的 **Authentication Key 私钥** 解密，并返回结果。
5.  **验证**：GitHub 确认解密结果正确，允许推送。**全程无需输入密码，密钥在后台自动完成验证。**

#### Signing Key 的工作流（你需要主动启用）
1.  **触发**：你执行 `git commit -S -m "重要更新"`（`-S` 参数表示签名）。
2.  **签名**：Git 使用你本地的 **Signing Key 私钥** 对这个提交内容生成一个数字签名，并附在提交中。
3.  **推送**：你执行 `git push`，提交和签名一起被推送到 GitHub。
4.  **验证**：GitHub 收到提交后，用你账户中的 **Signing Key 公钥** 验证签名是否有效，以及签名者是否是你。
5.  **显示**：如果验证通过，提交旁边会显示绿色的 **`Verified`** 徽章，表明该提交的来源可信且未被篡改。

---

### 🎯 我应该选择哪种？

这取决于你的需求和角色：

| 你的情况 | 推荐选择 | 理由 |
| :--- | :--- | :--- |
| **普通开发者**，主要使用 Git 进行代码协作 | **`Authentication Key`** | 这是最基础、最常用的设置，足以满足日常所有 Git 操作。 |
| **开源项目维护者**，需要确保代码提交的完整性和可追溯性 | **`Authentication Key` + `Signing Key`**（**使用不同密钥对**，或同一个密钥对分别添加两次，类型选不同） | 签名能增加代码的可信度，尤其在多人协作的大型项目中。你可以在 `~/.gitconfig` 中配置 `gpg.format=ssh` 和 `user.signingkey` 来指定签名密钥。 |
| **对代码安全有较高要求**的个人开发者 | 同上 | 即使个人项目，签名也能在本地验证你的历史提交是否被篡改。 |

---

### 💡 高级技巧与常见问题

*   **使用同一个 SSH 密钥同时满足两种用途**：
    *   **可以**。你完全可以将同一个公钥文件，在 GitHub 上分别添加两次，一次选择 **Authentication Key**，另一次选择 **Signing Key**（两次的 Title 可以不同，以便区分）。
    *   **操作**：添加时，Key type 下拉框中选择对应的类型即可。
    *   **配置**：在本地，你需要告诉 Git 使用这个密钥来签名。在 `~/.gitconfig` 中添加：
        ```ini
        [gpg]
            format = ssh
        [user]
            signingkey = ~/.ssh/id_ed25519_manjaro_new.pub
        ```
        （将路径替换为你实际的公钥文件路径）

*   **如何查看一个提交是否被签名？**
    *   在 GitHub 上，带有绿色 `Verified` 徽章的提交就是被签名的。
    *   在本地，可以使用 `git log --show-signature` 查看签名状态。

*   **如果我的私钥泄露了怎么办？**
    *   立即在 GitHub 上删除对应的公钥，然后生成新的密钥对并重新添加。
    *   如果泄露的是 Signing Key，还需考虑撤销旧的签名或通知协作者。

希望这个系统讲解能让你完全理清这两种密钥类型的区别和用法。选择 `Authentication Key` 能满足日常 99% 的需求，如果有签名需要，再额外添加一个 `Signing Key` 即可。如果还有其他疑问，随时可以提出。好的，我们来把 GitHub 上 SSH 密钥的 **“Key type”（密钥类型）** 选项讲透彻。它确实决定了密钥的用途，但理解它背后的**使用场景和工作流程**，才是你做出正确选择的关键。

### 🔑 两种密钥类型的本质区别

| 特性 | **Authentication Key** | **Signing Key** |
| :--- | :--- | :--- |
| **类比** | 你的**门禁卡** | 你的**数字印章** |
| **核心作用** | **证明“你是谁”**，用于安全地登录和通信 | **证明“这是你做的”**，用于验证内容来源 |
| **使用场景** | `git clone`、`git push`、`git pull` 等所有 Git 操作 | `git commit -S`、`git tag -s` 等签名操作 |
| **验证时机** | **每次**与 GitHub 交互时，自动进行身份验证 | **当你主动**为提交或标签添加签名时触发 |
| **GitHub 上的体现** | 无直接视觉标识，但后台记录会关联你的操作 | 成功签名的提交会显示 **`Verified`** 绿色徽章 |
| **密钥保管** | 私钥必须安全保管，一旦泄露需立即更换 | 私钥同样重要，但泄露风险相对更低（使用频率低） |

---

### 🚀 实际工作流程解析

理解它们在工作流中的角色，才能明白为什么需要区分。

#### Authentication Key 的工作流
1.  **触发**：你执行 `git push origin main`。
2.  **请求**：你的 Git 客户端向 GitHub 发起连接请求，并带上你的用户名。
3.  **挑战**：GitHub 用你账户中的 **Authentication Key 公钥** 加密一个随机字符串，发回给你。
4.  **解密**：你的客户端用本地的 **Authentication Key 私钥** 解密，并返回结果。
5.  **验证**：GitHub 确认解密结果正确，允许推送。**全程无需输入密码，密钥在后台自动完成验证。**

#### Signing Key 的工作流（你需要主动启用）
1.  **触发**：你执行 `git commit -S -m "重要更新"`（`-S` 参数表示签名）。
2.  **签名**：Git 使用你本地的 **Signing Key 私钥** 对这个提交内容生成一个数字签名，并附在提交中。
3.  **推送**：你执行 `git push`，提交和签名一起被推送到 GitHub。
4.  **验证**：GitHub 收到提交后，用你账户中的 **Signing Key 公钥** 验证签名是否有效，以及签名者是否是你。
5.  **显示**：如果验证通过，提交旁边会显示绿色的 **`Verified`** 徽章，表明该提交的来源可信且未被篡改。

---

### 🎯 我应该选择哪种？

这取决于你的需求和角色：

| 你的情况 | 推荐选择 | 理由 |
| :--- | :--- | :--- |
| **普通开发者**，主要使用 Git 进行代码协作 | **`Authentication Key`** | 这是最基础、最常用的设置，足以满足日常所有 Git 操作。 |
| **开源项目维护者**，需要确保代码提交的完整性和可追溯性 | **`Authentication Key` + `Signing Key`**（**使用不同密钥对**，或同一个密钥对分别添加两次，类型选不同） | 签名能增加代码的可信度，尤其在多人协作的大型项目中。你可以在 `~/.gitconfig` 中配置 `gpg.format=ssh` 和 `user.signingkey` 来指定签名密钥。 |
| **对代码安全有较高要求**的个人开发者 | 同上 | 即使个人项目，签名也能在本地验证你的历史提交是否被篡改。 |

---

### 💡 高级技巧与常见问题

*   **使用同一个 SSH 密钥同时满足两种用途**：
    *   **可以**。你完全可以将同一个公钥文件，在 GitHub 上分别添加两次，一次选择 **Authentication Key**，另一次选择 **Signing Key**（两次的 Title 可以不同，以便区分）。
    *   **操作**：添加时，Key type 下拉框中选择对应的类型即可。
    *   **配置**：在本地，你需要告诉 Git 使用这个密钥来签名。在 `~/.gitconfig` 中添加：
        ```ini
        [gpg]
            format = ssh
        [user]
            signingkey = ~/.ssh/id_ed25519_manjaro_new.pub
        ```
        （将路径替换为你实际的公钥文件路径）

*   **如何查看一个提交是否被签名？**
    *   在 GitHub 上，带有绿色 `Verified` 徽章的提交就是被签名的。
    *   在本地，可以使用 `git log --show-signature` 查看签名状态。

*   **如果我的私钥泄露了怎么办？**
    *   立即在 GitHub 上删除对应的公钥，然后生成新的密钥对并重新添加。
    *   如果泄露的是 Signing Key，还需考虑撤销旧的签名或通知协作者。




好的，我们来详细讲解如何将现有使用 HTTPS 协议的 Git 仓库切换到 SSH 协议，并深入理解背后的原理和操作细节。

---

### 🎯 为什么要从 HTTPS 切换到 SSH？

| 特性 | HTTPS | SSH |
| :--- | :--- | :--- |
| **认证方式** | 每次需要输入用户名 + **Personal Access Token (PAT)**（不再支持密码） | 一次性配置 SSH 密钥，后续**无需输入任何凭证** |
| **网络稳定性**（国内） | 容易受“TCP 重置”影响，连接可能中断 | 相对稳定，且**可切换至 443 端口**，绕过限制 |
| **安全性** | 依赖 Token 传输，存在泄露风险 | 私钥永不传输，基于签名验证，更安全 |
| **使用体验** | 每次推送需手动输入凭证或配置缓存 | 配置一次，终身免密，**自动认证** |

---

### 🔧 第一步：确认当前仓库使用的协议

在本地仓库目录下，执行以下命令查看远程仓库地址：

```bash
git remote -v
```

如果输出类似：

```
origin  https://github.com/用户名/仓库名.git (fetch)
origin  https://github.com/用户名/仓库名.git (push)
```

说明当前使用的是 HTTPS 协议。如果地址以 `git@github.com:` 开头，则已经是 SSH 协议（无需修改）。

---

### 🔄 第二步：将远程地址从 HTTPS 改为 SSH

执行以下命令，将远程地址修改为 SSH 格式：

```bash
git remote set-url origin git@github.com:用户名/仓库名.git
```

**注意**：请将 `用户名/仓库名.git` 替换为你的实际 GitHub 用户名和仓库名。

**验证修改**：

再次执行 `git remote -v`，确认输出已变为 `git@github.com:...` 格式。

---

### 🧪 第三步：测试新的 SSH 连接

执行以下命令，测试是否能正常与 GitHub 通信：

```bash
git fetch
```

或直接进行推送测试：

```bash
git push -u origin main
```

如果一切正常，你将不再被要求输入密码或 Token，操作会直接成功。

---

### 📝 第四步：处理多个远程仓库（可选）

如果你的仓库有多个远程地址（如 `origin`、`upstream`），可以单独修改：

```bash
git remote set-url upstream git@github.com:上游用户名/仓库名.git
```

---

### 🧹 第五步：清理 HTTPS 凭证缓存（可选）

如果你之前配置过 Git 缓存 HTTPS 凭证，切换至 SSH 后这些缓存已无用。可执行以下命令清除（避免混淆）：

```bash
# 清除全局凭证缓存
git config --global --unset credential.helper

# 如果使用了特定的凭证管理器（如 manager-core）
git config --global --unset credential.helper manager-core
```

如果希望在特定仓库保留缓存（不推荐），可省略此步。

---

### 💡 高级技巧：批量切换多个仓库

如果你有多个本地仓库需要切换，可使用脚本批量处理。

**示例脚本（请在执行前备份）**：

```bash
#!/bin/bash
# 查找所有包含 HTTPS 远程地址的 Git 仓库
find ~/projects -name ".git" -type d | while read gitdir; do
    repo_dir=$(dirname "$gitdir")
    cd "$repo_dir" || continue
    remote_url=$(git remote get-url origin 2>/dev/null)
    if [[ "$remote_url" == https://github.com/* ]]; then
        new_url="git@github.com:${remote_url#https://github.com/}"
        echo "Updating $repo_dir: $remote_url -> $new_url"
        git remote set-url origin "$new_url"
    fi
done
```

将 `~/projects` 替换为你的实际父目录路径。

---

### 🛡️ 安全性最佳实践

1.  **确认 SSH 密钥已正确配置**：在切换前，务必执行 `ssh -T git@github.com` 确认连接正常（你已成功测试）。
2.  **保留 HTTPS 作为备用**：如果你不确定 SSH 是否完全可用，可以先不删除 HTTPS 远程地址，而是添加一个新的 SSH 远程地址（如 `ssh-origin`），测试稳定后再切换默认。
    ```bash
    git remote add ssh-origin git@github.com:用户名/仓库名.git
    git push ssh-origin main
    ```

3.  **更新团队协作规范**：如果项目有多个协作者，建议统一切换到 SSH，并在项目文档中说明。

---

### 📌 常见问题排查

| 问题 | 原因 | 解决方法 |
| :--- | :--- | :--- |
| `Permission denied (publickey)` | SSH 公钥未正确添加到 GitHub | 检查 GitHub 上的 SSH 密钥，确保公钥内容与本地匹配 |
| `fatal: remote origin already exists` | 远程地址已存在 | 使用 `git remote set-url` 覆盖，或先删除再添加 |
| `The requested URL returned error: 403` | 权限不足或 Token 失效 | 确认你对该仓库有写权限，且 SSH 密钥已授权 |
| 切换后仍提示输入密码 | 可能缓存了 HTTPS 凭证 | 清除凭证缓存（见第五步） |

---

### 🎯 总结

将现有仓库从 HTTPS 切换到 SSH，本质是改变 Git 远程仓库的通信协议。操作非常简单，只需一行 `git remote set-url` 命令。但背后的收益是长期的：**免密认证、更稳定的连接、更安全的通信**。

---

## 🔗 相关笔记

- [[KeePass]]
- [[U盾]]
