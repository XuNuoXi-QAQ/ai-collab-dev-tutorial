---
title: "5包管理（pacman   yay    paru）命令精讲"
tags:
  - Linux
  - pacman
  - yay
  - AUR
  - 包管理
  - Manjaro
description: "包管理是 Arch Linux 系（包括 Manjaro）的核心操作。与 Ubuntu 的 `apt` 或 Fedora 的 `dnf` 不同，Arch 系使用 `pacman` 作为官方包管理器，并通过 AUR（Arch User Repository） 补充社区维护的软件包。"
---

包管理是 Arch Linux 系（包括 Manjaro）的核心操作。与 Ubuntu 的 `apt` 或 Fedora 的 `dnf` 不同，Arch 系使用 **`pacman`** 作为官方包管理器，并通过 **AUR（Arch User Repository）** 补充社区维护的软件包。

---

## 一、核心工具概览

| 工具 | 用途 | 来源 |
|------|------|------|
| `pacman` | 官方包管理器 | Manjaro 默认安装 |
| `yay` | AUR 助手（你经常用的） | 需手动安装 |
| `paru` | AUR 助手（备选） | 需手动安装 |

### 你的使用习惯
- 用 `pacman` 安装官方仓库的软件（如 `htop`、`docker`）
- 用 `yay` 安装 AUR 包（如 `kunkun-bin`、`clash-verge-rev-bin`）
- 用 `paccache` 清理缓存（你已经执行过）

---

## 2. `pacman -S 包` — 安装软件包

### 命令格式
```bash
sudo pacman -S 包名          # 安装单个包
sudo pacman -S 包1 包2 包3   # 安装多个包
sudo pacman -S --needed 包   # 只安装尚未安装的包
```

### 实际应用
```bash
# 安装 htop
sudo pacman -S htop

# 安装多个包
sudo pacman -S git vim wget

# 安装 git 时自动安装依赖（你用过）
sudo pacman -S --needed git base-devel

# 安装特定版本（不推荐）
sudo pacman -S 包名=版本号
```

### `-S` 参数的含义
| 参数 | 含义 |
|------|------|
| `-S` | Sync（同步安装） |
| `-Sy` | Sync + refresh（更新包数据库） |
| `-Syu` | Sync + refresh + upgrade（更新系统） |
| `-Syy` | 强制刷新所有包数据库 |

---

## 3. `pacman -Syu` — 更新系统（最重要）

### 命令格式
```bash
sudo pacman -Syu     # 更新包数据库 + 升级所有包
```

### 执行过程
```
1. 同步包数据库（下载最新软件包列表）
2. 检查依赖关系
3. 提示需要升级的包数量
4. 确认后下载并安装
```

### 实际应用
```bash
# 常规系统更新（你经常执行）
sudo pacman -Syu

# 更新时忽略特定包
sudo pacman -Syu --ignore gdm

# 无确认更新（脚本中使用）
sudo pacman -Syu --noconfirm
```

---

## 4. `pacman -Sy` — 只更新包数据库

### 命令格式
```bash
sudo pacman -Sy     # 只更新数据库，不升级包
```

### ⚠️ 警告：不要单独使用 `-Sy`
| 风险 | 说明 |
|------|------|
| **部分升级** | 数据库更新了但软件包未更新，可能导致依赖问题 |
| **依赖损坏** | 新版本的包可能需要更新的依赖，但未被安装 |
| **推荐做法** | 始终使用 `-Syu` 而不是 `-Sy` |

### 什么时候可以用 `-Sy`？
- 只是查询可用包（`-Ss` 已自动同步）
- 即将执行 `-Syu` 前（但 `-Syu` 已包含同步）

---

## 5. `pacman -R 包` — 卸载软件包

### 命令格式
```bash
sudo pacman -R 包名           # 卸载包
sudo pacman -Rs 包名          # 卸载包及其依赖
sudo pacman -Rns 包名         # 卸载包、依赖、配置文件（最彻底）
sudo pacman -Rdd 包名         # 忽略依赖检查强制卸载（不推荐）
```

### 参数说明
| 参数 | 含义 | 适用场景 |
|------|------|----------|
| `-R` | 仅卸载包本身 | 依赖由其他包使用时 |
| `-Rs` | 卸载包和未被使用的依赖 | 清理无用依赖 |
| `-Rns` | 卸载包、依赖、配置文件 | 彻底移除（**推荐**） |
| `-Rdd` | 强制卸载（忽略依赖） | 极少数特殊情况 |

### 实际应用
```bash
# 彻底卸载一个包（推荐）
sudo pacman -Rns htop

# 卸载多个包
sudo pacman -Rns kunkun-bin espanso-gui

# 卸载孤包（见第14条）
sudo pacman -Rns $(pacman -Qdtq)
```

---

## 6. `pacman -Q` — 列出已安装的包

### 命令格式
```bash
pacman -Q              # 列出所有已安装的包
pacman -Q | wc -l      # 统计已安装包数量
pacman -Qe             # 列出显式安装的包（你主动装的）
pacman -Qm             # 列出从 AUR 安装的包
pacman -Qs 关键词       # 搜索已安装的包
pacman -Qi 包名        # 查看包详细信息
```

### 对比示例
```bash
# 查看所有已安装的包
pacman -Q | head -10

# 查看你主动安装的包（不含依赖）
pacman -Qe

# 查看从 AUR 安装的包
pacman -Qm
# 你之前执行过这个命令，看到大量 AUR 包

# 搜索已安装的包
pacman -Qs docker
# 输出所有与 docker 相关的已安装包

# 查看包详细信息
pacman -Qi docker
```

### `-Q` 常用参数
| 参数 | 含义 |
|------|------|
| `-Q` | 列出所有包 |
| `-Qe` | 显式安装的包 |
| `-Qm` | 从 AUR 安装的包 |
| `-Qdt` | 孤包（不再被需要的依赖） |
| `-Qet` | 显式安装且孤包的包 |
| `-Qs 关键词` | 搜索已安装包 |
| `-Qi 包名` | 显示包信息 |
| `-Ql 包名` | 列出包的文件 |
| `-Qo 文件路径` | 查找文件属于哪个包 |

### 实际应用：查看某个文件属于哪个包
```bash
# 查看 /usr/bin/python 属于哪个包
pacman -Qo /usr/bin/python
```

---

## 7. `pacman -Ss 关键词` — 在仓库中搜索包

### 命令格式
```bash
pacman -Ss 关键词      # 搜索包名和描述
pacman -Ss 关键词 | grep -i 额外过滤  # 进一步过滤
```

### 实际应用
```bash
# 搜索 htop
pacman -Ss htop

# 搜索 docker 相关包
pacman -Ss docker

# 只显示包名（不显示描述）
pacman -Ss docker | grep -v "^ " | sort -u
```

---

## 8. `pacman -Sc` / `-Scc` — 清理包缓存

### 命令格式
```bash
sudo pacman -Sc        # 清理未使用的包缓存
sudo pacman -Scc       # 清理所有包缓存（清空）
```

### 缓存位置
```bash
ls -la /var/cache/pacman/pkg/
# 这里存放了所有下载过的包文件
```

### 实际应用
```bash
# 清理未使用的缓存（保留最新版本）
sudo pacman -Sc

# 彻底清空缓存（释放更多空间）
sudo pacman -Scc

# 查看缓存占用
du -sh /var/cache/pacman/pkg/
```

---

## 9. `paccache -r -k 3` — 保留最近3个版本

### 命令格式
```bash
sudo paccache -r -k 3     # 保留最近3个版本
sudo paccache -r -k 1     # 只保留最新1个版本
```

### 与 `pacman -Scc` 的区别
| 命令 | 行为 | 推荐度 |
|------|------|--------|
| `pacman -Scc` | 清空所有缓存 | ⚠️ 过于激进 |
| `paccache -r -k 3` | 保留最近3个版本 | ✅ 推荐 |

### 实际应用（你之前执行过）
```bash
# 安装 paccache（包含在 pacman-contrib 中）
sudo pacman -S pacman-contrib

# 保留最近3个版本，删除更早的
sudo paccache -r -k 3
```

---

## 10. `pacman -Qdt` — 列出孤包

### 孤包（Orphan Packages）
孤包是指那些**被作为依赖安装，但不再被任何包需要的包**。

### 命令格式
```bash
pacman -Qdt           # 列出所有孤包
pacman -Qdtq          # 只显示包名（用于管道）
```

### 实际应用
```bash
# 查看哪些包是孤包
pacman -Qdt

# 查看孤包数量
pacman -Qdt | wc -l

# 删除所有孤包（谨慎操作）
sudo pacman -Rsn $(pacman -Qdtq)
```

### ⚠️ 注意事项
- 孤包删除后，如果将来需要，必须重新安装
- 有些孤包可能是你手动安装但被标记为依赖的
- 建议先查看列表，确认后再删除

---

## 11. `yay -S 包` — 从 AUR 安装

### 命令格式
```bash
yay -S 包名           # 从 AUR 安装
yay -S 包名 --noconfirm  # 无确认安装
```

### 实际应用（你经常使用）
```bash
# 从 AUR 安装 Kunkun
yay -S kunkun-bin

# 从 AUR 安装 Clash Verge
yay -S clash-verge-rev-bin

# 从 AUR 安装 Espanso Wayland 版
yay -S espanso-wayland-bin
```

### 搜索 AUR 包
```bash
# 搜索 AUR 包（你之前搜索过）
yay -Ss 关键词
yay -Ss wechat-keyboard
```

---

## 12. `yay -Syu` — 更新所有包（含 AUR）

### 命令格式
```bash
yay -Syu            # 更新官方包 + AUR 包
```

### 与 `pacman -Syu` 的区别
| 命令 | 更新范围 |
|------|----------|
| `sudo pacman -Syu` | 仅官方仓库包 |
| `yay -Syu` | 官方包 + AUR 包 |

### 实际应用
```bash
# 更新所有包（你经常执行）
yay -Syu

# 只更新 AUR 包（不更新官方包）
yay -Syu --aur
```

---

## 13. `yay -Rns 包` — 卸载 AUR 包

### 命令格式
```bash
yay -Rns 包名        # 卸载 AUR 包
```

### 实际应用
```bash
# 卸载 Kunkun
yay -Rns kunkun-bin

# 卸载多个 AUR 包
yay -Rns kunkun-bin espanso-gui
```

---

## 14. `yay -Yc` — 清理 AUR 包缓存

### 命令格式
```bash
yay -Yc              # 清理未使用的 AUR 包
```

### 实际应用
```bash
# 清理 AUR 缓存
yay -Yc

# 查看 AUR 缓存位置
ls -la ~/.cache/yay/
```

---

## 15. `paru` — AUR 助手备选

### 安装
```bash
sudo pacman -S paru
```

### 常用命令
| 命令 | 用途 |
|------|------|
| `paru -S 包` | 安装包（官方 + AUR） |
| `paru -Syu` | 更新所有包 |
| `paru -Rns 包` | 卸载包 |
| `paru -Q` | 列出已安装包 |
| `paru -G 包` | 下载 PKGBUILD |

### `paru` vs `yay`
| 特性 | `yay` | `paru` |
|------|-------|--------|
| 语言 | Go | Rust |
| 速度 | 较快 | 更快 |
| 默认行为 | 安装时交互式选择 | 更自动化的默认行为 |
| 推荐 | ✅ 你已在用 | 备选 |

---

## 📊 包管理命令快速参考卡

| 操作 | 官方仓库 | AUR |
|------|----------|-----|
| 安装 | `sudo pacman -S 包` | `yay -S 包` |
| 更新系统 | `sudo pacman -Syu` | `yay -Syu` |
| 搜索 | `pacman -Ss 关键词` | `yay -Ss 关键词` |
| 搜索已安装 | `pacman -Qs 关键词` | `yay -Qs 关键词` |
| 查看信息 | `pacman -Qi 包` | `yay -Qi 包` |
| 卸载 | `sudo pacman -Rns 包` | `yay -Rns 包` |
| 清理缓存 | `sudo pacman -Scc` | `yay -Yc` |

---

## 💡 你的实战场景

### 场景1：安装一个不熟悉的包
```bash
# 先搜索
pacman -Ss 关键词

# 查看详细信息
pacman -Si 包名

# 安装
sudo pacman -S 包名
```

### 场景2：清理系统缓存（你已经做过）
```bash
# 1. 清理 Pacman 缓存（保留最近3个版本）
sudo paccache -r -k 3

# 2. 清理 AUR 缓存
yay -Yc

# 3. 查看释放的空间
df -h
```

### 场景3：查找并删除孤包
```bash
# 1. 查看孤包列表
pacman -Qdt

# 2. 确认后删除
sudo pacman -Rsn $(pacman -Qdtq)
```

### 场景4：安装 AUR 包（你经常做）
```bash
# 1. 搜索 AUR
yay -Ss 包名

# 2. 安装
yay -S 包名
```

---

## ⚠️ 重要提醒

### 1. 不要混用 `-Sy` 和 `-S`
`-Sy` 只更新数据库，可能导致部分升级问题。始终使用 `-Syu`。

### 2. AUR 包的安全性
AUR 包由社区维护，安装前建议查看 PKGBUILD：
```bash
yay -G 包名
cd 包名
cat PKGBUILD
```

### 3. 定期清理缓存
建议每月执行一次 `sudo paccache -r -k 3` 和 `yay -Yc`。

### 4. 系统更新后重启
内核更新后需要重启才能生效：
```bash
# 检查是否需要重启
sudo systemctl status
# 或
uname -r  # 查看当前内核版本
```