---
title: "Oh My Zsh"
tags:
  - Zsh
  - Shell
  - 终端
  - Oh-My系列
aliases:
  - Oh-My-Zsh
created: 2026-06-23
---
Oh My Zsh是一个社区驱动的框架，用于管理 Zsh 配置。它提供了丰富的插件、主题和便捷的配置管理方式，让你的终端体验再上一个台阶。

---

## 📦 安装 Oh My Zsh

如果尚未安装，执行以下命令：

```bash
sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
```

安装完成后，它会自动将你的默认 shell 切换为 Zsh，并生成一个基础的 `~/.zshrc` 配置文件。

---

## 🧩 整合你已有的效率工具

Oh My Zsh 的核心是 `~/.zshrc` 文件和 `plugins` 列表。你可以将之前所有的别名、函数和工具配置集中管理。

### 1️⃣ 将你的别名迁移到 Oh My Zsh

编辑 `~/.zshrc`，在文件末尾（或 `# Alias definitions` 区域）添加你之前定义的别名：

```bash
# 自定义别名（Wayland 剪贴板 + fzf）
alias cptree='tree -L 2 -a | fzf | wl-copy'
alias cpfile='find . -type f | fzf | wl-copy'
alias cphist='history | fzf | wl-copy'
alias pick='tree -L 2 -a | fzf | wl-copy'   # 通用选择器
```

保存后执行 `source ~/.zshrc` 立即生效。

### 2️⃣ 启用内置插件

Oh My Zsh 自带了大量插件，在 `~/.zshrc` 中找到 `plugins=(git)` 这一行，按需添加：

```bash
plugins=(
  git                # Git 快捷命令
  sudo               # 按 ESC 两次自动补 sudo
  z                   # 快速跳转目录（类似 zoxide）
  extract            # 解压各种压缩包
  history            # 增强历史命令搜索
  colored-man-pages  # 彩色 man 手册
)
```

### 3️⃣ 安装第三方插件（增强体验）

#### 🧠 zsh-autosuggestions（智能命令建议）

```bash
git clone https://github.com/zsh-users/zsh-autosuggestions ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-autosuggestions
```

然后在 `plugins` 列表中添加 `zsh-autosuggestions`。

#### ✍️ zsh-syntax-highlighting（实时语法高亮）

```bash
git clone https://github.com/zsh-users/zsh-syntax-highlighting.git ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-syntax-highlighting
```

同样添加到 `plugins` 列表（建议放在最后）。

#### 🧭 zoxide（更智能的 `cd`）

```bash
sudo pacman -S zoxide
```

在 `~/.zshrc` 末尾添加：
```bash
eval "$(zoxide init zsh)"
```

之后可以用 `z 目录名` 快速跳转。

---

## 🎨 更换主题

Oh My Zsh 默认主题是 `robbyrussell`。你可以改为更美观、信息更丰富的主题，例如 `powerlevel10k`（需额外安装）：

```bash
git clone --depth=1 https://github.com/romkatv/powerlevel10k.git ${ZSH_CUSTOM:-$HOME/.oh-my-zsh/custom}/themes/powerlevel10k
```

然后在 `~/.zshrc` 中设置 `ZSH_THEME="powerlevel10k/powerlevel10k"`，重启后会自动进入配置向导。

---

## 🔄 更新 Oh My Zsh

Oh My Zsh 提供简单的更新命令：

```bash
omz update
```

---

## 💡 与 `AGENTS.md` 的设计理念一致

你为项目编写的 `AGENTS.md` 是将开发规范固化为文档，让 AI 自动遵循。而 Oh My Zsh 的配置（`~/.zshrc`、插件、别名）则是将你的**个人操作习惯固化为配置文件**，让终端自动提供高效体验。

两者都体现了“**一次配置，处处生效**”的工程化思维：

- `AGENTS.md` → 为 AI 提供“项目宪法”
- `~/.zshrc` → 为人类提供“终端宪法”

---

## ⚠️ 注意事项

- **Wayland 工具链**：你已配置 `wl-copy`，无需切换 `xclip`。
- **插件顺序**：`zsh-syntax-highlighting` 应放在 `plugins` 列表的最后，避免干扰其他插件。
- **环境变量**：Oh My Zsh 不会覆盖你的 `proxy_on`/`proxy_off` 函数，它们依然有效。

---

## 📌 总结

Oh My Zsh 极大简化了 Zsh 配置的管理。结合你已有的 `wl-clipboard`、`fzf`、别名和未来将安装的插件，你将拥有一个**高效、智能、个性化的终端环境**，完美适配你的 AI 工具链（AstrBot、OpenCode）和知识管理工作流。