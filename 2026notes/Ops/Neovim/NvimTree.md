
### 🔑 NvimTree 快捷键速查表

#### 打开、关闭与基本操作

| 英文全称 | 快捷键 | 中文简称 |
| :--- | :--- | :--- |
| Toggle | `Ctrl + n` | 切换文件树 |
| Quit | `q` | 关闭文件树 |
| Refresh | `R` | 刷新文件树 |
| Help | `g + ?` | 打开快捷键帮助 |

#### 导航与移动

| 英文全称 | 快捷键 | 中文简称 |
| :--- | :--- | :--- |
| Open | `Enter` 或 `o` | 打开文件/文件夹 |
| Parent Directory | `-` | 回到上一级目录 |
| Root Directory | `Ctrl + p` | 回到根目录 |
| Close Folder | `Backspace` | 关闭当前文件夹 |
| Focus Next | `l` | 焦点移到右侧（编辑器） |
| Focus Previous | `h` | 焦点移到左侧（文件树） |
| Move Down | `j` | 向下移动 |
| Move Up | `k` | 向上移动 |
| Go to Top | `gg` | 跳转到顶部 |
| Go to Bottom | `G` | 跳转到底部 |

#### 文件/文件夹管理 (CRUD)

| 英文全称 | 快捷键 | 中文简称 |
| :--- | :--- | :--- |
| Add | `a` | 新建文件/文件夹 |
| Delete | `d` | 删除选中项 |
| Rename | `r` | 重命名选中项 |
| Cut | `x` | 剪切选中项 |
| Copy | `y` | 复制选中项 |
| Paste | `p` | 粘贴至当前目录 |
| Duplicate | `c` | 复制文件（同 y） |

#### 视图与过滤

| 英文全称 | 快捷键 | 中文简称 |
| :--- | :--- | :--- |
| Toggle Hidden | `H` | 切换显示/隐藏文件 |
| Expand All | `E` | 展开所有文件夹 |
| Collapse All | `W` | 折叠所有文件夹 |
| Find | `f` | 在当前目录搜索文件 |
| Clear Filter | `F` | 清除搜索过滤 |
| System Open | `s` | 用系统程序打开文件 |

#### 其他功能

| 英文全称 | 快捷键 | 中文简称 |
| :--- | :--- | :--- |
| File Info | `Ctrl + k` | 查看文件详情 |
| Git Status | `g` + `s` | 查看 Git 状态 |
| Git Stage | `g` + `i` | 暂存文件 |
| Git Unstage | `g` + `u` | 取消暂存文件 |
| Preview File | `P` | 预览文件内容 |
| Close Directory | `Backspace` | 关闭文件夹 |

---

### 💡 补充提示

- **查看帮助**：在 NvimTree 窗口打开时，按 `g + ?` 可随时查看当前配置下的所有快捷键列表。
- **自定义快捷键**：可在 Neovim 配置文件（`init.lua` 或 `init.vim`）中重新映射，例如：

```lua
vim.keymap.set('n', '<leader>e', ':NvimTreeToggle<CR>', { desc = 'Toggle file explorer' })
```
