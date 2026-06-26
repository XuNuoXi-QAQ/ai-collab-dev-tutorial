---
title: "任务：Neovim 配置"
tags:
  - AI
  - 运维
  - 系统管理
  - Agent
  - Neovim
  - Linux
  - Git
description: "在当前机器上配置 Neovim（版本 ≥ 0.8.0），使其具备："
created: 2026-06-23
---

# 任务：为 Neovim 配置左侧目录树 + 右侧大纲，并绑定 ALT+1/ALT+0 切换

## 目标
在当前机器上配置 Neovim（版本 ≥ 0.8.0），使其具备：
- 左侧：文件目录树（使用 nvim-tree.lua）
- 右侧：当前文件符号大纲（使用 aerial.nvim）
- 快捷键：`ALT+1` 切换目录树，`ALT+0` 切换大纲
- 目录树固定在左侧，大纲固定在右侧

## 执行环境
- 操作系统：Linux / macOS（假设有 bash、git、nvim）
- 用户 home 目录可写
- 网络可访问 GitHub

## 步骤（按顺序执行）

### 1. 检查 Neovim 版本
执行命令：
```bash
nvim --version | head -1
```

如果版本低于 0.8.0，则退出并报错“Neovim 版本过低”。

2. 确保存在配置目录

```bash
mkdir -p ~/.config/nvim
```

3. 安装 lazy.nvim 插件管理器

执行：

```bash
git clone --filter=blob:none https://github.com/folke/lazy.nvim.git \
  ~/.local/share/nvim/lazy/lazy.nvim
```

4. 写入 init.lua 配置文件

将以下完整内容写入 ~/.config/nvim/init.lua（覆盖原有内容）：

```lua
-- Neovim 配置：nvim-tree + aerial，ALT+1/ALT+0 切换
vim.g.mapleader = " "

-- 自动安装 lazy.nvim（若未安装）
local lazypath = vim.fn.stdpath("data") .. "/lazy/lazy.nvim"
if not vim.loop.fs_stat(lazypath) then
  vim.fn.system({
    "git",
    "clone",
    "--filter=blob:none",
    "https://github.com/folke/lazy.nvim.git",
    "--branch=stable",
    lazypath,
  })
end
vim.opt.rtp:prepend(lazypath)

require("lazy").setup({
  {
    "nvim-tree/nvim-tree.lua",
    version = "nightly",
    dependencies = { "nvim-tree/nvim-web-devicons" },
    config = function()
      require("nvim-tree").setup({
        view = { width = 30, side = "left" },
        actions = { open_file = { quit_on_open = false } },
        filters = { dotfiles = false },
      })
    end,
  },
  {
    "stevearc/aerial.nvim",
    opts = {},
    dependencies = {
      "nvim-treesitter/nvim-treesitter",
      "nvim-tree/nvim-web-devicons",
    },
    config = function()
      require("aerial").setup({
        placement = "right",
        width = 30,
        show_icons = true,
        backends = { "treesitter", "lsp" },
      })
    end,
  },
  {
    "nvim-treesitter/nvim-treesitter",
    build = ":TSUpdate",
    config = function()
      require("nvim-treesitter.configs").setup({
        ensure_installed = { "lua", "python", "javascript", "c", "rust" },
        auto_install = true,
        highlight = { enable = true },
      })
    end,
  },
})

-- 快捷键映射
vim.api.nvim_set_keymap("n", "<A-1>", ":NvimTreeToggle<CR>", { noremap = true, silent = true })
vim.api.nvim_set_keymap("n", "<A-0>", ":AerialToggle!<CR>", { noremap = true, silent = true })

print("✅ Neovim 配置已加载。按 ALT+1 切换目录树，ALT+0 切换大纲。")
```

5. 启动 Neovim 并安装插件

执行命令：

```bash
nvim +Lazy sync +qall
```

该命令会启动 Neovim，自动下载并安装所有插件，然后退出。

6. 验证

再次启动 Neovim：

```bash
nvim
```

打开任意代码文件，依次按下 ALT+1 和 ALT+0，确认：

· 左侧出现目录树窗口
· 右侧出现大纲窗口（若文件有符号定义）
· 再次按相同快捷键可关闭对应窗口

若任一窗口未出现，检查：

· 终端是否支持 ALT 组合键（若不支持，可改用 :NvimTreeToggle 和 :AerialToggle! 命令手动测试）
· 文件类型是否被 Treesitter 支持（否则大纲可能为空）

7. 如果 ALT 键无效的备选方案

如果 ALT+1/ALT+0 无响应，可替换为 F2 和 F3 快捷键：
修改 init.lua 中的映射行为：

```lua
vim.api.nvim_set_keymap("n", "<F2>", ":NvimTreeToggle<CR>", { noremap = true, silent = true })
vim.api.nvim_set_keymap("n", "<F3>", ":AerialToggle!<CR>", { noremap = true, silent = true })
```

并重新加载配置（或重启 nvim）。

任务完成标准

· 目录树和大纲窗口均可正常弹出/关闭
· 布局正确（左/右）
· 快捷键有效（或已改为备选键）

注意事项

· 整个过程无需手动干预，所有命令和文件内容已给出。
· 若执行过程中出现错误，请捕获错误信息并报告。
· 若网络问题导致插件下载失败，可重试或更换镜像源。

---

执行此任务的 Agent 应在完成所有步骤后输出“配置完成”及验证结果。
