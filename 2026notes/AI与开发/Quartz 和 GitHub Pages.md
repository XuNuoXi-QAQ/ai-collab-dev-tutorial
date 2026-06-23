---
title: "Quartz 和 GitHub Pages"
tags:
  - Obsidian
  - Quartz
  - GitHub-Pages
  - 静态网站
aliases:
  - Quartz
  - GitHub Pages 发布
created: 2026-06-23
---
将 Quartz 和 GitHub Pages 结合，是一个能把 Obsidian 笔记变成个人网站的强大方案，而且能实现全自动化。

这个方案的核心思路是：你在 Obsidian 中写笔记，通过 Git 同步到 GitHub，然后 GitHub Actions 自动运行 Quartz 构建网站，最后部署到 GitHub Pages 上。

### 🚀 方案优势

*   **全自动化**：借助 GitHub Actions，每次你推送笔记更新，网站都会自动重新构建和部署，实现“写完即走”。
*   **速度快且稳定**：构建过程在 GitHub 的高速服务器上进行，相比本地操作更省时、稳定。
*   **位置无关**：只要能推送代码到 GitHub，就能在任何设备上更新网站。
*   **内容与框架隔离**：你的笔记内容（Obsidian 仓库）和网站框架（Quartz）可以分开管理。

---

### 📝 详细部署步骤

#### **1. 准备工作**
你需要准备以下几样东西：

*   **GitHub 账号**：用于托管代码和自动化部署。
*   **Git**：本地版本控制工具。
*   **Node.js**：Quartz 运行环境，**需要版本 22 或更高**。
*   **Obsidian**：你的笔记软件，以及用于同步的 **Obsidian Git 插件**。

#### **2. 创建 Quartz 网站仓库**
1.  访问 Quartz 的 **GitHub 模板页面** (`https://github.com/jackyzha0/quartz/generate`)。
2.  填写仓库名称（如 `my-digital-garden`），选择 **Public**（公开），然后点击 "Create repository from template"。
3.  将新建的仓库克隆到本地：
    ```bash
    git clone https://github.com/你的用户名/my-digital-garden.git
    cd my-digital-garden
    ```
4.  **（可选）将你的 Obsidian 仓库设置为内容源**：你也可以直接将 Obsidian 仓库克隆到 `content` 目录下，但这样仓库就变成了公开。如果希望笔记仓库保持私有，可以参考官方文档配置多个仓库。
5.  安装 Quartz 依赖并初始化：
    ```bash
    npm install
    npx quartz create
    ```
    初始化时，第一个选项选择 **`Empty Quartz`**；第二个选项建议选择 **`Treat links as shortest path`**，这更适合 Obsidian 的 `[[双链]]` 写法。

#### **3. 获取 GitHub Personal Access Token (PAT)**
这个 token 用于授权 GitHub Actions 工作流访问你的仓库。

1.  在 GitHub 右上角头像 → **Settings** → **Developer settings** → **Personal access tokens** → **Fine-grained tokens**，点击 "Generate new token"。
2.  **Token name**：填写 `QUARTZ_CONTENT_ACCESS`。
3.  **Expiration**：建议设为 90 天。
4.  **Repository access**：选择 **"Only select repositories"**，然后只勾选你的**内容仓库 (Content Repo)**。
5.  **Permissions**：在 **Repository permissions** 下，找到 **Contents**，设置为 **Read-only**。
6.  点击 "Generate token"，**立即复制并保存好这个 token**，它只会显示一次。

#### **4. 配置 GitHub Actions 工作流**
1.  在你的**网站仓库**（如 `my-digital-garden`）页面，进入 **Settings** → **Security** → **Secrets and variables** → **Actions**。
2.  点击 **"New repository secret"**，Name 填 `ACCESS_TOKEN`，Secret 粘贴你刚才复制的 PAT。
3.  在本地网站仓库中，创建或替换 `.github/workflows/deploy.yml` 文件。内容可以参考以下模板（**务必替换 `YOUR_USERNAME/YOUR_CONTENT_REPO`**）：
    ```yaml
    name: Deploy Quartz site to GitHub Pages

    on:
      push:
        branches:
          - v4

    jobs:
      build:
        runs-on: ubuntu-22.04
        steps:
          - uses: actions/checkout@v4
            with:
              fetch-depth: 0
          - uses: actions/setup-node@v4
            with:
              node-version: 22
          - name: Install Dependencies
            run: npm ci
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
4.  将更新后的文件推送到 GitHub：
    ```bash
    git add .github/workflows/deploy.yml
    git commit -m "Add GitHub Actions workflow for Quartz"
    git push origin v4
    ```

#### **5. 启用 GitHub Pages**
1.  进入你的网站仓库，点击 **Settings** → **Pages**。
2.  在 "Build and deployment" 下，将 **Source** 选择为 **"GitHub Actions"**。

至此，每当你在 `v4` 分支推送代码，GitHub Actions 就会自动构建并部署你的网站。

---

### 🔧 后续维护与优化

#### **日常更新**
你只需要在 Obsidian 中写笔记，然后通过 Obsidian Git 插件推送到 GitHub。之后的工作流会自动完成，你访问 `https://你的用户名.github.io` 就能看到更新后的网站。

#### **自定义域名 (可选)**
1.  在 GitHub 仓库的 **Settings** → **Pages** 下，找到 "Custom domain" 并填入你的域名。
2.  前往你的域名服务商（DNS）管理后台，添加一条 `CNAME` 记录，将你的域名指向 `你的用户名.github.io`。
3.  在 Quartz 的配置文件 `quartz.config.ts` 中，将 `baseUrl` 修改为你的自定义域名。

### ⚠️ 注意事项

*   **GitHub Pages 限制**：每个 GitHub 账号只能有一个 `用户名.github.io` 的仓库作为用户/组织站点。不过你可以创建多个项目站点（通过 `gh-pages` 分支）。
*   **私有仓库**：如果内容仓库是私有的，上述 PAT 配置方案是正确的做法。
*   **资源路径问题**：部署后如果出现字体、图片等资源加载失败，通常是因为路径问题。确保 `quartz.config.ts` 中的 `baseUrl` 配置正确。

这个方案能让你拥有一个完全属于自己的、自动更新的数字花园。

---

## 🔗 相关笔记

- [[Obsidian、tauri、opencode、LobeHub]]
