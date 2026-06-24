---
tags: [npm, pnpm, Manjaro, Linux, 环境变量, 代理配置, 踩坑实录]
cssclasses: [wide-table]
---


# 📦 npm 批判与 pnpm 救赎：Manjaro 全实战笔记（8000 字完整版）

> **核心结论**：npm 的“恶心”源于其 2010 年诞生时的设计债务。而 pnpm 是现代的、完美的替代品。本文记录了在 Manjaro 下从绝望到顺畅的全过程。

---

## 第一章：npm 的本质——它到底是什么？

**npm（Node Package Manager）** 是 Node.js 官方捆绑的包管理工具。它是全球最大代码仓库 `npmjs.com` 的客户端。

-   **核心任务**：安装依赖、管理版本、执行脚本。
-   **江湖地位**：因为 Node.js 的成功而统治了 JavaScript 后端生态近 15 年。

---

## 第二章：npm 的“恶心”之处——五大历史遗留痛点深度解析

### 2.1 黑洞般的 `node_modules`（依赖地狱）
-   **早期（npm v2）**：采用**嵌套递归**安装。项目根目录下生成一颗深度恐怖的依赖树。在 Windows 系统上，因为路径长度超过 260 字符，直接导致项目无法构建。
-   **现在（npm v3+）**：改为**扁平化（Hoisting）** 结构，把所有依赖尽量提到顶层 `node_modules`。
-   **带来的新灾难（幽灵依赖）**：你可以在代码里引用一个**没有在 `package.json` 中声明**的包（因为它被其他包带到了顶层）。这导致项目在某台机器上能跑，换台机器就因为目录结构不同而崩溃。

### 2.2 慢如蜗牛的安装速度（尤其是在 Linux）
-   npm 早期下载是串行的，虽然现在支持并行，但在中国大陆访问默认海外源，速度极慢。
-   即使配置了代理或镜像，npm 在 `npm install` 时仍然要执行大量的元数据请求（`shrinkwrap` 或 `pacote` 解析），耗时比 `pnpm` 长数倍。

### 2.3 语义化版本（Semver）的“定时炸弹”
-   你写 `"lodash": "^4.17.0"`，意味着信任作者不会发 Breaking Change。
-   **现实**：很多库的作者在 `patch` 版本中不小心引入了破坏性改动。代码今天能跑，明天 `npm install` 就挂了，这就是著名的“**依赖滚雪球**”。

### 2.4 恶心的 `EACCES` 权限错误（Linux 专属噩梦）
-   当你执行 `npm install -g <package>` 试图往 `/usr/lib` 写文件时，普通用户没有权限。
-   **外行解法**：`sudo npm install -g`。
-   **后果**：安装后的包归于 `root` 用户所有。当你的普通用户 `nuoxi` 去执行时，会因为读取权限不足而报错，甚至导致整个 `node_modules` 无法读写，只能 `sudo chown -R nuoxi ./*` 救急。

### 2.5 `package-lock.json` 的合并地狱
-   为了锁定版本，npm 引入了 `package-lock.json`。
-   在 Git 团队协作中，两个人改了不同依赖，合并时这个 JSON 文件必然冲突。由于全是机器生成的哈希值，手动解决冲突几乎不可能，最终只能 `rm -rf node_modules package-lock.json` 重装。

---

## 第三章：pnpm——对 npm 的降维打击

### 3.1 pnpm 的核心原理（内容寻址 + 硬链接）
-   **全局 Store**：所有包只下载一次，存储在 `~/.local/share/pnpm/store/`。
-   **硬链接（Hard Link）**：项目里的 `node_modules` 只是全局 Store 文件的硬链接，不占用额外磁盘空间，且速度极快。
-   **严格隔离**：只能引用 `package.json` 中声明的依赖，**彻底杀死“幽灵依赖”**。

### 3.2 对比速查表

| 痛点 | npm 的表现 | pnpm 的降维打击 |
| :--- | :--- | :--- |
| **硬盘占用** | 100 个项目占 100 份体积 | 100 个项目占 1 份真实体积 |
| **幽灵依赖** | 可以引用未声明的包 | 无法引用，严格规范 |
| **安装速度** | 慢（需解析依赖树） | 快 3~5 倍（增量硬链接） |
| **权限问题** | 总跟 `sudo` 搏斗 | 装在 `~/.local`，无需 `sudo` |
| **Monorepo 支持** | 工作区配置复杂 | 原生内置 `pnpm-workspace.yaml` |

---

## 第四章：Manjaro 上 pnpm 的“完美配置”实战

### 4.1 安装：官方脚本（最推荐，非 pacman）
**为什么不推荐 `sudo pacman -S pnpm`？**
因为 Arch 仓库版本更新较慢，且同样面临系统目录权限干扰。

```bash
curl -fsSL https://get.pnpm.io/install.sh | sh -
```
*安装完成后，脚本会自动修改 `~/.zshrc`。*

### 4.2 环境变量修复（绝大多数“找不到命令”的根源）
**问题现象**：明明装了无数次，终端却提示 `command not found: pnpm`。

**排查步骤**：
```bash
# 1. 查找残留的 store 缓存
find ~ -name "pnpm" -type f 2>/dev/null | grep -E "bin/pnpm$"
# 输出示例：/home/nuoxi/.local/share/pnpm/store/v11/links/.../bin/pnpm （证明缓存存在）

# 2. 检查入口主程序是否存在
ls -la ~/.local/share/pnpm/pnpm
# 如果显示 "No such file or directory"，说明入口文件丢失
```

**终极解决（硬写入 PATH）**：
打开 `~/.zshrc`（因为 Manjaro 默认 Zsh），在底部强制添加：
```bash
export PATH="$HOME/.local/share/pnpm:$PATH"
```
保存后执行 `source ~/.zshrc`。

**验证修复**：
```bash
which pnpm   # 应输出 ~/.local/share/pnpm/pnpm
pnpm --version  # 应打印版本号
```

### 4.3 配置国内镜像源（提速）
```bash
pnpm config set registry https://registry.npmmirror.com/
```

### 4.4 配置 crash 代理（针对有代理环境的用户）
```bash
# 设置代理（假设地址为 127.0.0.1:7890，以实际为准）
pnpm config set proxy http://127.0.0.1:7890
pnpm config set https-proxy http://127.0.0.1:7890

# 验证配置
pnpm config get proxy
pnpm config get https-proxy

# 取消代理（迁移环境时使用）
pnpm config delete proxy
pnpm config delete https-proxy
```

---

## 第五章：跨项目多版本 pnpm 管理（不用重复下载）

### 5.1 依赖包层面（全局 Store）
无论项目 A 用 lodash v4，项目 B 用 lodash v5，它们都指向全局 Store 中不同的硬链接文件，**不会重复下载相同文件**。

### 5.2 pnpm 自身版本（不用全局只装一个）

**方法一：`packageManager` 字段（官方推荐）**
在 `package.json` 中添加：
```json
{
  "packageManager": "pnpm@8.6.0"
}
```
结合 Node.js 的 Corepack 工具，进入项目目录时会自动使用该版本。

**方法二：`pnpm with` 命令（临时指定）**
```bash
pnpm with 8.6.0 install
```
这条命令会临时使用 v8.6.0 执行安装，且该版本的 pnpm 会被缓存到 `~/.local/share/pnpm`，下次使用无需重下。

---

## 第六章：核心实战复盘——从“找不到 pnpm”到“完美运行”

### 6.1 你的项目上下文
-   **项目名**：`obsidian-plugin-manager`
-   **技术栈**：Tauri + Obsidian API + TypeScript
-   **包管理器**：项目根目录存在 `pnpm-lock.yaml` 和 `pnpm-workspace.yaml`，强制要求使用 pnpm

### 6.2 当时的错误状态
```bash
❯ pnpm --version
command not found: pnpm

❯ which pnpm
pnpm not found
```

### 6.3 根本原因分析
1.  `~/.local/share/pnpm/store/` 缓存存在（说明曾经安装过）。
2.  `~/.local/share/pnpm/pnpm` 主入口丢失（可能是误删、或 PATH 被覆盖）。
3.  `~/.zshrc` 中没有写入正确的 `export PATH`。

### 6.4 成功修复命令链
```bash
# 1. 重新执行官方脚本（重建入口文件）
curl -fsSL https://get.pnpm.io/install.sh | sh -

# 2. 强制刷新终端会话
exec $SHELL

# 3. 最终验证
pnpm --version   # 成功输出 9.x.x

# 4. 进入项目安装依赖
cd ~/Project/open-code-test/obsidian-plugin-manager
pnpm install   # 瞬间完成依赖硬链接
```

---

## 第七章：额外锦囊——Manjaro 常见坑点与避障

### 7.1 `libatomic.so.1` 缺失报错
**现象**：运行某些 Node 原生模块时提示找不到共享库。
**解决方案**：
```bash
sudo pacman -S libatomic
```

### 7.2 全局命令权限
-   **原则**：永远不要使用 `sudo pnpm install -g`。如果需要全局工具，pnpm 会安装在 `~/.local/bin`，这是用户目录，天生可写。
-   **确保 `~/.local/bin` 在 PATH 中**（检查 `~/.zshrc` 是否包含）。

### 7.3 清理旧 `node_modules` 释放空间
如果你之前用 npm 或 yarn，残留的 `node_modules` 可能占用大量磁盘空间。可以用 `pnpm store prune` 清理全局 Store 中无用的包。

---

## 第八章：结论——告别 npm，拥抱 pnpm

-   **npm 的“恶心”不是因为开发者笨，而是因为它诞生于 2010 年，背负了 14 年的历史兼容包袱。**
-   **pnpm 的优雅是因为它站在巨人的肩膀上，用现代文件系统的硬链接特性重写了底层逻辑。**
-   **在 Linux（尤其是 Manjaro）下，pnpm 是最理智的选择。** 只要搞定了 `PATH` 环境变量，它给你的体验是：**极速、干净、省心**。

**终极建议**：以后在任何新项目里：
-   见到 `npm install` → 自动脑补替换为 `pnpm install`。
-   见到 `npm run` → 替换为 `pnpm run`（速度更快）。
-   将 `package-lock.json` 从 `.gitignore` 中剔除，使用 `pnpm-lock.yaml`（它的合并冲突远少于 JSON）。

> 📌 **一句话箴言**：一个优秀的开发者，懂得选择一个不折磨自己的工具。pnpm 就是那个不折磨你的工具。

---
**相关笔记**：
- [OpenCode 13 大智能体模式深度实践手册](./OpenCode-智能体模式深度手册.md)
- [Tauri + Obsidian 插件开发工作流](./Tauri-Obsidian-工作流.md)

