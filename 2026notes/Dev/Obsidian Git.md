

### 🖥️ 第三步（修订版）：配置 Obsidian Git 插件


#### 1. 基础认证信息（对应你的第一张截图）

在插件设置页面的 **"Source control view"** 区域上方，你需要填写：

- **Commit author**：填写你在**账户 A** 的 GitHub 用户名（用于标记谁提交的）。
- 在更上方的 **"History view"** 区域，可以开启 **"Show Author"** 和 **"Show Date"**，这样在提交历史中能看到作者和日期信息。

#### 2. Personal Access Token（在哪里填？）


根据新版插件文档，Token 的配置方式可能有两种：

- **情况一（推荐）**：如果你的本地 Git 已经通过命令行配置过认证（例如使用 `git config` 设置了凭据），插件会自动继承，**不需要**在插件内重复填写 Token。
- **情况二**：Token 输入框可能位于设置页面的更下方，或者在 **"Advanced"**（高级）折叠区域里。请向下滚动或展开 "Advanced" 部分仔细查找。

如果确实找不到，**最稳妥的方法**是先在终端（命令行）中配置好 Git 认证：

```bash
# 配置全局用户名和邮箱（如果还没配过）
git config --global user.name "你的账户A用户名"
git config --global user.email "你的账户A邮箱"

# 配置凭据缓存（避免频繁输入密码）
git config --global credential.helper cache
```

然后通过 HTTPS 方式推送一次（会提示输入用户名和 Token），后续插件就能直接使用了。

#### 3. 设置自动同步（对应你的第二、三张截图）

在**"Advanced"（高级）** 区域上方，找到 **"Auto commit-and-sync interval (min)"** 设置项：

- 将其设置为 `5`（每 5 分钟自动提交并推送一次）。
- **建议开启 "Pull on startup"**



### ✅ 总结：你现在需要做的

1. **确认 Git 已在本地安装**并在终端配置好全局 `user.name` 和 `user.email`。
2. **在插件设置中**：
   - 填写 **Commit author**（你的 GitHub 用户名）。
   - 设置 **Auto commit-and-sync interval** 为 `5` 分钟。
   - 开启 **Pull on startup**。
3. **关于 Token**：先在终端用 HTTPS 方式手动推送一次，输入 Token 后让系统记住凭据；或者在设置中仔细找找 **"Personal access token"** 输入框。
4. **测试**：修改一篇笔记，手动点击左侧边栏的 **Commit-and-sync** 按钮（带旋转箭头的对勾图标），观察是否成功。


> [!danger] 如果 Obsidian Git 推送失败，最常见原因是：
> - 网络代理问题（需要配置 Git 代理）。
> - PAT 权限不足（请确认 `Contents` 设为 `Read and write`？不对，推送需要写权限！这里要特别注意：**Obsidian Git 推送代码到账户 A 的仓库需要 `Contents: Read and write` 权限**，而前面我们给 PAT 只设置了 `Read-only`，那就会导致推送失败！）
> 
> **纠正方案**：在账户 A 生成 PAT 时，`Contents` 权限应设为 **Read and write**，因为你要向该仓库推送笔记变更。Quartz 构建只需要读，但 Obsidian Git 推送需要写。为了避免混淆，建议为 Obsidian Git 单独生成一个具有写权限的 PAT，或者就使用同一个（权限至少包含写）。由于我们之前为了 Quartz 只给了读，现在需要**重新生成一个具有 `Contents: Read and write` 的 PAT**，并在 Obsidian Git 中使用它。
> 
> 因此，**正确做法**：
> - 在账户 A 生成一个新的 PAT（或修改现有），设置 `Contents` 为 **Read and write**。
> - 在 Obsidian Git 中配置这个新 PAT（或在账户 B 的 Secret 中也更新？不，账户 B 的 Secret 只需要读权限，可以保留之前的只读 PAT。我们可以生成两个 PAT：一个只读给 Quartz，一个读写给 Obsidian Git。但为了简单，也可以生成一个读写 PAT，同时给两者使用（因为读写包含读，Quartz 用也没问题）。但为了最小权限，建议分开。
> 
> 我将在下一步中明确建议分开生成两个 PAT。

---






## 🔄 修正：关于 PAT 权限的特别说明

> [!important] 务必理解：你的本地 Obsidian Git 需要 **推送（写）** 笔记到账户 A，而 Quartz 构建只需要 **读取（读）**。因此，最安全的做法是 **生成两个不同的 PAT**：
> - **PAT-Write**：用于 Obsidian Git，权限为 `Contents: Read and write`，仓库选择账户 A 的笔记仓库。
> - **PAT-Read**：用于 GitHub Actions（账户 B），权限为 `Contents: Read-only`，同样只选笔记仓库。

这样，即便 Obsidian Git 的 PAT 泄露，攻击者也只能修改你的笔记（破坏力有限），而无法影响其他仓库；Quartz 的只读 PAT 泄露则只能查看代码。

**如果嫌麻烦，也可以只用一个读写 PAT 给两者使用**，但风险稍高。以下步骤将按照“两个 PAT”的方案进行。

---

## 🔑 第一步（修订）：生成两个 PAT

> 如果你已经生成了一个只读 PAT，没关系，我们额外生成一个写 PAT 即可。

### PAT-Write（用于 Obsidian Git）

1. 登录账户 A，重复生成令牌步骤。
2. Token name：`OBSIDIAN_GIT_WRITE`。
3. Expiration：90 天。
4. Repository access：Only select repositories → 勾选你的笔记仓库。
5. Permissions：**Contents → Read and write**。
6. 生成并保存。

### PAT-Read（用于 GitHub Actions）

1. 同样生成，Token name：`QUARTZ_CONTENT_READ`。
2. Expiration：90 天。
3. Repository access：Only select repositories → 勾选笔记仓库。
4. Permissions：**Contents → Read-only**。
5. 生成并保存。

> [!tip] 你可以给两个 PAT 起不同的名字，方便区分。

---

## 🔐 第二步（修订）：配置 Secret

在账户 B 的网站仓库中，创建 Secret：
- **Name**：`ACCESS_TOKEN`（保持不变）。
- **Secret**：粘贴 **PAT-Read**（只读令牌）。

> [!warning] 不要在这里使用写令牌，因为 Quartz 只需要读。

---

## 🖥️ 第三步（修订）：配置 Obsidian Git

在 Obsidian Git 插件的设置中：
- **Personal access token**：粘贴 **PAT-Write**（读写令牌）。
- 其他设置不变。

> [!check] 现在你的 Obsidian Git 可以正常推送笔记了，而 Quartz 构建则使用只读令牌，实现了权限分离。

---