

> **工具**：social-auto-upload (CLI: `sau`)  
> **状态**：✅ 已安装并配置，所有账号登录有效  
> **最后更新**：2026-06-27

---

## 📌 1. 工具概述

`social-auto-upload` 是一个开源的自动化多平台内容分发工具，通过模拟浏览器操作，实现一键上传视频/图文到抖音、B站、小红书、快手等主流平台。其核心优势：

- **一键分发**：同一内容可同步发布到多个平台
- **多账号管理**：支持每个平台管理多个账号
- **定时发布**：可独立设置各平台发布时间
- **AI Agent 友好**：提供技能包（Skill）供 AI 助手调用

---

## 🛠 2. 安装方式

本机采用 **`uv` 工具全局安装**，使得 `sau` 命令在任意目录下可用。

```bash
# 安装 uv（若未安装）
curl -LsSf https://astral.sh/uv/install.sh | sh

# 全局安装 social-auto-upload
uv tool install social-auto-upload

# 安装浏览器驱动（用于自动化）
playwright install chromium
```

- **项目源码克隆目录**（仅供查阅配置）：`/home/nuoxi/services/social-auto-upload`
- **实际命令入口**：`sau`（全局可用）

---

## 📂 3. 数据存储位置（关键！）

由于通过 `uv` 全局安装，所有**登录凭证（Cookie）**和**本地数据库**默认存储在 `uv` 的隔离环境中，**不在克隆目录下**。

**实际路径：**

```
/home/nuoxi/.local/share/uv/tools/social-auto-upload/lib/python3.12/site-packages/
├── cookies/
│   ├── douyin_nuoxi.json
│   ├── xiaohongshu_nuoxi-xiaohongshu.json
│   └── bilibili_bilibili.json
└── db/
    └── database.db
```

> 💡 每次执行 `sau` 命令时，会自动读写上述路径，无需切换工作目录。

---

## 👤 4. 已配置的账号标识名

| 平台 | 本地标识名 (`--account` 参数) | Cookie 文件名 |
|------|-------------------------------|---------------|
| 抖音 | `nuoxi` | `douyin_nuoxi.json` |
| 小红书 | `nuoxi-xiaohongshu` | `xiaohongshu_nuoxi-xiaohongshu.json` |
| B站 | `bilibili` | `bilibili_bilibili.json` |

> ✅ 所有账号登录状态均有效（已通过 `check` 验证）。

---

## ⌨️ 5. 常用命令速查

### 5.1 登录与检查

```bash
# 登录（扫码）
sau douyin login --account nuoxi
sau xiaohongshu login --account nuoxi-xiaohongshu
sau bilibili login --account bilibili

# 检查登录状态
sau douyin check --account nuoxi
sau xiaohongshu check --account nuoxi-xiaohongshu
sau bilibili check --account bilibili
```

### 5.2 上传视频

```bash
# 抖音上传
sau douyin upload-video --account nuoxi --file /path/to/video.mp4 --title "视频标题" --desc "简介"

# B站上传（可选 --tid 分区ID）
sau bilibili upload-video --account bilibili --file /path/to/video.mp4 --title "教程视频" --tid 249

# 小红书视频
sau xiaohongshu upload-video --account nuoxi-xiaohongshu --file /path/to/video.mp4 --title "视频标题"
```

### 5.3 上传图文（小红书支持）

```bash
sau xiaohongshu upload-note --account nuoxi-xiaohongshu --images /path/img1.png /path/img2.png --title "图文标题" --note "正文内容"
```

### 5.4 其他实用命令

```bash
# 查看所有账号列表（需后端运行）
curl http://127.0.0.1:5409/getAccounts

# 开启调试日志
sau douyin upload-video --account nuoxi --file demo.mp4 --title "测试" --debug
```

---

## 🤖 6. 与 AstrBot 集成（技能包）

`sau` 官方提供技能包（Skill），使 AI 助手（如 AstrBot）能通过自然语言指令驱动 `sau` 发布内容。

### 6.1 安装技能包

```bash
sau skill install
```

该命令会将技能包安装到 AstrBot 能识别的默认位置。若需手动放置，技能包文件夹应放入：

```
/home/nuoxi/astrbot-local/data/skills/
```

> 技能包文件夹必须包含 `SKILL.md` 文件，且文件夹名为英文。

### 6.2 在 AstrBot 中配置

1. **上传技能**：在 AstrBot 管理面板 → 插件 → 技能，上传 ZIP 包或确认已放置。
2. **配置执行环境**：进入 **配置** 页面，找到 **使用电脑能力**，选择 **本地** 或 **沙盒** 模式。

### 6.3 使用示例

在 AstrBot 聊天中直接说：

> “帮我把 `/home/nuoxi/videos/demo.mp4` 发到抖音、B站和小红书”

AI 助手将自动调用 `sau` 技能完成分发。

---

## 🔧 7. 维护与故障处理

### 7.1 Cookie 过期

平台 Cookie 有有效期，当上传失败或 `check` 返回异常时，重新登录即可刷新：

```bash
sau douyin login --account nuoxi   # 重新扫码
```

### 7.2 查看详细日志

执行命令时附加 `--debug` 可获得详细输出，便于定位问题。

### 7.3 数据迁移

若需迁移到其他机器，复制以下两个目录即可：

```bash
cp -r /home/nuoxi/.local/share/uv/tools/social-auto-upload/lib/python3.12/site-packages/cookies /目标路径/
cp -r /home/nuoxi/.local/share/uv/tools/social-auto-upload/lib/python3.12/site-packages/db /目标路径/
```

### 7.4 环境变量固定数据目录

若希望将数据集中到克隆目录，可设置环境变量：

```bash
export SOCIAL_AUTO_UPLOAD_HOME=/home/nuoxi/services/social-auto-upload
```

然后复制现有数据过去，之后 `sau` 将读写该目录。

---

## 📝 8. 配置文件

主配置文件位于克隆目录：

```
/home/nuoxi/services/social-auto-upload/conf.py
```

可修改全局默认参数（如默认标题、定时时间等），修改后无需重启即可生效。

---

## ✅ 9. 快速验证所有账号

```bash
echo "=== 抖音 ===" && sau douyin check --account nuoxi && \
echo "=== 小红书 ===" && sau xiaohongshu check --account nuoxi-xiaohongshu && \
echo "=== B站 ===" && sau bilibili check --account bilibili
```

若全部返回有效，则一切正常。

---

## 🔗 10. 相关链接

- [GitHub 仓库](https://github.com/dreammis/social-auto-upload)
- [官方文档](https://social-auto-upload.readthedocs.io/)（如有）
- 克隆目录：`/home/nuoxi/services/social-auto-upload`

---

> **笔记标签**：`#自动化` `#社交媒体` `#sau` `#AstrBot` `#内容分发`  
> **维护人**：nuoxi  
> **下次审查**：Cookie 过期时或每月检查一次