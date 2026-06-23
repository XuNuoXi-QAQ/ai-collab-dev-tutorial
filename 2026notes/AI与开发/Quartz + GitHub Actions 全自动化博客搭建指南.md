---
title: "Quartz + GitHub Actions 全自动化博客搭建指南"
tags: [教程, Quartz, GitHub, 自动化, Obsidian]
aliases: [Quartz自动化部署]
---

# 🚀 Quartz + GitHub Actions 全自动化博客搭建指南（从零开始）

本指南将带你一步步实现：**在 Obsidian 中写笔记，自动推送到 GitHub，云端自动构建并发布到 GitHub Pages**。全程无需手动部署，真正“写完即走”。

---

## 📋 前提条件（请逐项确认）

> [!important] 开始前请务必确认以下所有条件满足，否则后面会遇到各种障碍。

- [ ] **两个 GitHub 账户**：
  - **账户 A**：存放 Obsidian 笔记仓库（建议设为 **私有**，保护隐私）。
  - **账户 B**：存放 Quartz 网站源码仓库（可以是公开或私有，公开可免费使用 GitHub Pages）。
- [ ] **本地环境**：
  - **Node.js**：版本 **22 或更高**（`node -v` 检查）。
  - **Git**：已安装并配置好全局用户名和邮箱（`git config --global user.name` 和 `user.email`）。
  - **Obsidian**：已安装并至少创建一个仓库。
- [ ] **网络**：确保你能稳定访问 GitHub（必要时开启代理）。

---

## 🔑 第一步：在账户 A 创建 Personal Access Token (PAT)

这个令牌的作用是让账户 B 的 GitHub Actions 有权限 **读取** 账户 A 的私有笔记仓库。

> [!warning] PAT 只会显示一次！生成后务必立即复制并安全保存（如密码管理器），否则只能重新生成。

1. 登录 **账户 A**（存放笔记的账户）。
2. 点击右上角头像 → **Settings**（设置）。
3. 在左侧边栏最底部，点击 **Developer settings**（开发者设置）。
4. 点击 **Personal access tokens** → **Fine-grained tokens**（细粒度令牌）。
5. 点击 **Generate new token**（生成新令牌）。
6. **填写信息**：
   - **Token name**：填入 `QUARTZ_CONTENT_ACCESS`（可自定义，但建议保持清晰）。
   - **Expiration**（过期时间）：**强烈建议选 90 天**，并在日历中设置提醒，到期前更换。
   - **Repository access**（仓库访问权限）：选择 **Only select repositories**，然后在下方列表中 **只勾选你的 Obsidian 笔记仓库**（不要选所有仓库）。
   - **Permissions**（权限）：在 **Repository permissions** 下，找到 **Contents**，将右侧下拉选为 **Read-only**（只读）。
     > [!tip] 其他所有权限保持默认 `No access` 即可，不要多给。
7. 点击 **Generate token**。
8. **立刻复制并保存到安全的地方**（例如 Bitwarden、1Password 或本地加密文件）。

> [!danger] 如果忘记保存，必须撤销该令牌并重新生成，无法找回。

---

好的，已按实际操作修正，并加入了最容易走错路段的防错标注。

---

### 🔐 第二步：在账户 B 配置仓库 Secret（实际操作）

1. 登录 **账户 B**（存放 Quartz 网站源码的账户）。
2. 进入你的 Quartz 网站仓库（例如名为 `my-digital-garden`）。
3. 点击顶部导航栏的 **Settings**（设置）标签页。
4. **关键：在左侧边栏中找到 `Security`（安全）分类**，点击其下方的 **`Secrets and variables`** 前面的 **▸** 展开符号（如果已展开则跳过）。
   > [!warning] 不要点 `Deploy keys`！那是 SSH 密钥，不是我们要去的地方。`Secrets and variables` 就在 `Deploy keys` 下面，需要展开才能看到子菜单。
5. 在展开后的子菜单中，点击 **`Actions`**。
   > 此时右侧页面标题会显示 "Repository secrets"。
6. 点击右侧区域中的绿色按钮 **`New repository secret`**。
7. 在弹出的表单中：
   - **Name**（名称）：填入 `ACCESS_TOKEN`（**必须完全一致**，大小写敏感）。
   - **Secret**（密钥）：粘贴你刚刚从账户 A 复制的 PAT。
8. 点击 **`Add secret`** 保存。

> [!tip] 如果以后需要更新令牌（比如过期），只需进入同一个页面，点击已存在的 Secret 名称，在弹出窗口中修改值并保存即可。无需删除重建。

---


抱歉，是我搞错了维护者信息，感谢你的细心指正！你提供的截图确实是当前最新版 `obsidian-git` 插件的设置界面。

### 📌 关于维护者

你查到的信息完全正确：`obsidian-git` 插件现在的维护者是 **Vinzent03**。我之前提到的 `denolehov` 是早期的原作者，项目维护者已经变更了。

---

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

## ⚙️ 第四步：配置 Quartz 项目（本地，账户 B）

> 这一步是在你的本地电脑上克隆并初始化 Quartz 网站项目。

1. **克隆网站仓库到本地**（确保你当前在账户 B 的仓库页面）：
   ```bash
   git clone https://github.com/你的账户B用户名/你的网站仓库名.git
   cd 你的网站仓库名
   ```

2. **安装 Node.js 依赖**：
   ```bash
   npm install
   ```
   > [!tip] 如果安装缓慢，可切换为淘宝镜像：`npm config set registry https://registry.npmmirror.com`。

3. **初始化 Quartz 配置**（如果仓库是刚从模板生成的，可能已经初始化过，但执行以下命令确保配置完整）：
   ```bash
   npx quartz create
   ```
   - 第一个选项：选择 **`Empty Quartz`**（因为我们会把笔记放在单独目录）。
   - 第二个选项：选择 **`Treat links as shortest path`**（最适合 Obsidian 的 `[[双链]]` 写法）。
   > [!info] 此命令会生成 `quartz.config.ts` 和 `quartz.layout.ts` 等配置文件，若已存在则跳过。

4. **（可选）测试本地预览**：
   ```bash
   npx quartz build --serve
   ```
   然后访问 `http://localhost:8080` 查看空网站（此时 content 目录为空，会显示欢迎页面）。

---

## 🤖 第五步：创建 GitHub Actions 工作流（核心）

这是整个自动化的“大脑”。我们需要在网站仓库中创建 `.github/workflows/deploy.yml` 文件。

1. 在网站仓库根目录下，创建 `.github/workflows/` 文件夹（如果不存在）。
2. 在该文件夹中创建 `deploy.yml` 文件，并粘贴以下内容：

```yaml
name: Deploy Quartz site to GitHub Pages

on:
  push:
    branches:
      - v4                    # 默认 Quartz 使用 v4 分支，若你使用 main 则改为 main
  # 可选：定时构建（每天北京时间上午 6 点）
  # schedule:
  #   - cron: '22 5 * * *'   # 注意时区，UTC 5:22 对应北京时间 13:22

jobs:
  build:
    runs-on: ubuntu-22.04
    steps:
      # 1. 检出网站仓库本身（账户 B）
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0

      # 2. 检出笔记仓库（账户 A）到 content 目录
      - uses: actions/checkout@v4
        with:
          repository: 你的账户A用户名/你的笔记仓库名   # 替换为实际值
          path: content
          token: ${{ secrets.ACCESS_TOKEN }}
          fetch-depth: 0

      - uses: actions/setup-node@v4
        with:
          node-version: 22

      - name: Install Dependencies
        run: npm ci                # 比 npm install 更快更可靠

      - name: Build Quartz
        run: npx quartz build

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: public

  deploy:
    needs: build
    runs-on: ubuntu-22.04
    permissions:
      pages: write
      id-token: write
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

> [!warning] 必须替换 `repository: 你的账户A用户名/你的笔记仓库名` 为实际值！例如 `repository: alice/obsidian-notes`。

> [!tip] 如果你的 Quartz 仓库默认分支不是 `v4` 而是 `main`，请将 `on.push.branches` 和后续 `git push origin v4` 中的分支名改为 `main`。

3. **提交并推送此文件**：
   ```bash
   git add .github/workflows/deploy.yml
   git commit -m "Add GitHub Actions workflow for Quartz"
   git push origin v4        # 如果使用 main 分支，改为 git push origin main
   ```

---

## ⏰ 第六步：（可选）添加定时触发构建

如果你希望博客每天定时刷新（即使没有新笔记），可在 `deploy.yml` 的 `on:` 下添加 `schedule`：

```yaml
on:
  push:
    branches:
      - v4
  schedule:
    - cron: '0 3 * * *'   # 每天 UTC 时间 3:00（北京时间上午 11:00）构建
```

> [!info] cron 表达式为 UTC 时间，请换算时差。例如北京时间上午 8 点对应 UTC 0 点。

---

## ✅ 第七步：启用 GitHub Pages

1. 进入账户 B 的网站仓库，点击 **Settings** → **Pages**。
2. 在 "Build and deployment" 下，将 **Source** 选择为 **"GitHub Actions"**。
3. 稍等片刻，GitHub Pages 会显示部署状态。

> [!tip] 如果页面显示“Your site is published at ...”，说明成功。

---

## 🧪 第八步：验证与测试

1. **首次触发**：推送 `deploy.yml` 后，进入仓库的 **Actions** 标签页，查看工作流是否成功运行（绿色对勾）。
   - 如果失败，点击进入查看日志，根据错误信息排查（常见问题见下文）。

2. **本地测试**：在 Obsidian 中修改一篇笔记，保存后等待 Obsidian Git 插件自动推送（或手动点击 Commit-and-sync）。

3. **观察结果**：推送后，稍等片刻，GitHub Actions 会自动触发构建。成功后，访问 `https://你的账户B用户名.github.io` 即可看到更新。

> [!check] 如果一切顺利，你现在已经拥有了一个全自动更新的数字花园！

---

## 🌐 第九步：（可选）绑定自定义域名

1. **DNS 配置**：在你的域名服务商处，添加一条 **CNAME 记录**，将你的域名（如 `blog.example.com`）指向 `你的账户B用户名.github.io`。
2. **GitHub 设置**：在网站仓库的 **Settings** → **Pages** 下，在 "Custom domain" 填入你的域名，点击 Save。
3. **创建 CNAME 文件**：在网站仓库根目录创建 `CNAME` 文件（无后缀），内容为你的域名（如 `blog.example.com`），并提交到 `v4` 分支。
   > [!warning] 如果不创建 CNAME 文件，每次构建后域名设置可能会被重置。
4. **启用 HTTPS**：在 Pages 设置中勾选 **Enforce HTTPS**（等 DNS 生效后可用）。
5. **修改 Quartz 配置**：在 `quartz.config.ts` 中，将 `baseUrl` 修改为你的自定义域名（不含协议，如 `blog.example.com`），然后提交推送，Actions 会重新构建。

---

## 🔧 常见问题排查

> [!bug] **构建失败（Actions 红色）**
> - 检查 Node.js 版本是否为 22。
> - 检查 `quartz.config.ts` 或 `content` 目录中是否有语法错误（如 YAML frontmatter 格式错误）。
> - 查看 Actions 日志，搜索 "error" 关键字定位问题。

> [!bug] **跨账户拉取失败（提示权限错误）**
> - 确认 PAT-Read 是否有效（未过期）。
> - 确认 `Contents` 权限为 `Read-only`。
> - 确认仓库名和用户名是否正确（大小写敏感）。
> - 确认 Secret 名称是否为 `ACCESS_TOKEN`（与工作流中 `${{ secrets.ACCESS_TOKEN }}` 一致）。

> [!bug] **本地 Obsidian Git 推送失败**
> - 检查 PAT-Write 是否具有 `Contents: Read and write` 权限。
> - 检查网络代理设置（在 Git 中配置 `git config --global http.proxy`）。
> - 检查远程仓库地址是否正确（`git remote -v`）。
> - 尝试手动提交推送：在 Obsidian 中点击 Commit-and-sync，观察报错信息。

> [!bug] **网站资源加载失败（CSS/图片 404）**
> - 检查 `quartz.config.ts` 中的 `baseUrl` 是否与你的访问地址一致（如果使用自定义域名，需更新）。
> - 如果使用子路径（如 `username.github.io/repo`），需设置 `baseUrl` 为 `username.github.io/repo`（不含协议）。
> - 检查 `public` 目录中资源路径是否正确。

> [!bug] **GitHub Pages 未更新（显示旧内容）**
> - 确认 Actions 工作流已完成构建并成功上传 artifact。
> - 确认 Pages 部署任务（deploy job）也成功执行。
> - 尝试清除浏览器缓存或强制刷新。

---

## 📌 日常维护

- **更新令牌**：每 90 天左右，重新生成新的 PAT-Read 和 PAT-Write，并分别更新到 GitHub Secret 和 Obsidian Git 设置中。
- **更新 Quartz**：偶尔运行 `git pull` 拉取官方更新，执行 `npm update` 更新依赖，并测试本地预览。
- **备份**：建议定期备份本地笔记和配置。

---

## 🎉 恭喜你！

现在你已经完全掌握了从零搭建 Quartz 全自动化博客的方法。你的工作流：

**写笔记 → Obsidian Git 自动推送 → GitHub Actions 自动构建 → GitHub Pages 自动部署 → 全世界可见**

享受你的数字花园吧！🌱
