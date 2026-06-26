
# GitHub Actions 跨仓库自动化构建完全指南
## —— 以 Quartz 笔记站点为例

本教程将带你从零理解并实现：**当笔记仓库发生变更时，项目仓库自动感知并触发构建部署**。我们将深入讲解 GitHub Actions 的触发机制、权限模型、缓存策略以及跨仓库通信的多种方案。

---

### 📌 场景设定

假设你有两个仓库：
- **笔记仓库（源）**：`XuNuoXi-QAQ/ai-collab-dev-tutorial`，存放所有 Markdown 笔记。
- **项目仓库（目标）**：`XuNuoxi/nuoxi-obsidian-garden`，基于 [Quartz](https://quartz.jzhao.xyz/) 构建，将笔记渲染为静态网站并部署到 GitHub Pages。

**核心需求**：往笔记仓库推送内容后，项目仓库无需人工干预，自动完成重新构建和部署。

---

### 第一章：工作流触发机制深度解析（Why it didn't run）

很多人在配置 Actions 时，第一反应是“我 push 了代码，为什么没跑？”——这通常源于对 `on:` 触发条件的误解。

#### 1.1 常见触发事件一览
| 事件 | 适用场景 | 注意事项 |
| :--- | :--- | :--- |
| `push` | 代码推送 | 可指定 `branches` 和 `paths` 过滤。 |
| `pull_request` | PR 的打开、同步、合并 | 通常用于代码审查阶段的校验。 |
| `schedule` | 定时任务 | 基于 Cron 表达式，最小间隔通常为 5 分钟（有浮动）。 |
| `workflow_dispatch` | 手动触发 | 极其重要！建议所有关键工作流都加上，便于调试。 |
| `repository_dispatch` | 跨仓库触发 | 仓库 A 通过 API 通知仓库 B。 |
| `workflow_run` | 工作流链式触发 | 在当前工作流完成后触发另一个。 |

#### 1.2 为什么你的 Push 没反应？（案例分析）
让我们解剖你的项目中的几个工作流文件：

- **`build-preview.yaml`** 和 **`ci.yaml`**：它们只监听 `pull_request` 或向 `v4` 分支的 `push`。如果你推送到 `main`，它们纹丝不动——**这是符合预期的**。
- **`docker-build-push.yaml`**：同样只监听 `v4` 分支或标签（Tag）。
- **`deploy.yml`**：唯一配置了 `branches: [ main ]` 的工作流，所以只有它在你的 `git push origin main` 时会被响应。

**关键结论**：排查 Actions 未触发的第一步，永远是**检查 `on:` 字段是否匹配你当前的操作（分支名、事件类型）**。

---

### 第二章：跨仓库自动化的两种经典方案

GitHub 出于安全考虑，**不允许仓库 A 的工作流直接监听仓库 B 的 `push` 事件**。要打通两个仓库，通常有以下两种主流方案。

#### 方案一：被动接收 —— `repository_dispatch`（推送模式）
- **原理**：笔记仓库在接收到 `push` 后，通过 GitHub API 向项目仓库发送一个“信号”。
- **优点**：实时性高（秒级触发）。
- **缺点**：需要在**笔记仓库**中配置额外的 Workflow，且需配置具有 `repo` 权限的 Personal Access Token（PAT）。

#### 方案二：主动轮询 —— `schedule` + 缓存比较（拉取模式）⭐ **（本教程最终选定方案）**
- **原理**：项目仓库设置一个定时任务（如每 30 分钟），主动去查看笔记仓库的最新 commit SHA。若与上次记录不同，则触发构建。
- **优点**：笔记仓库无需任何配置，完全在项目仓库侧闭环，安全性更高（无需跨仓库复杂权限）。
- **缺点**：存在延迟（取决于 Cron 间隔）。

**本教程选择方案二**，因为它完全满足“项目仓库主动感知”的需求，且逻辑清晰、维护成本最低。

---

### 第三章：核心实现 —— Check & Trigger 工作流

我们最终在项目仓库中创建了 `.github/workflows/check-and-trigger.yml`，它由三个核心逻辑块组成。

#### 3.1 获取远程仓库最新指纹（高效比较）
我们使用 `git ls-remote`，它**只拉取远程仓库的元数据（commit SHA）**，而非整个仓库文件，极其轻量快速。

```yaml
- name: Get latest SHA of notes repo
  id: get_sha
  run: |
    SHA=$(git ls-remote https://github.com/XuNuoXi-QAQ/ai-collab-dev-tutorial main | awk '{print $1}')
    echo "sha=$SHA" >> $GITHUB_OUTPUT
```

#### 3.2 利用 `actions/cache` 实现状态持久化
GitHub Actions 的 `cache` 本质是键值存储。我们将当前的 SHA 作为**缓存 Key**。如果 Key 命中（即 SHA 未变），则 `cache-hit` 为 `true`，代表没有新内容。

```yaml
- name: Restore cached SHA
  id: cache_sha
  uses: actions/cache@v4
  with:
    path: .notes-sha   # 随便填一个路径占位，我们只利用 key 本身
    key: notes-sha-${{ steps.get_sha.outputs.sha }}
```

**实现原理**：
- 第一次运行：该 Key 不存在，`cache-hit` = `false`，脚本执行构建。
- 运行结束：系统自动将 `notes-sha-{新SHA}` 存入缓存。
- 第二次运行：比较当前 SHA 与缓存 Key，若一致，直接 `cache-hit` = `true`，跳过构建。
- 当笔记仓库有新提交时，`SHA` 改变 -> 新 Key 不命中 -> 触发构建 -> 保存新缓存。

#### 3.3 触发下游工作流（`deploy.yml`）
当检测到变化时，使用 `gh workflow run` 命令调用项目的部署工作流。

```yaml
- name: Trigger deploy.yml if SHA changed
  if: steps.cache_sha.outputs.cache-hit != 'true'
  run: |
    gh workflow run deploy.yml --ref main
  env:
    GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

---

### 第四章：避坑指南 —— 权限配置（Permission）

这是新手最容易踩的坑，也是你之前遇到 `403 Forbidden` 的根源。

#### 4.1 `GITHUB_TOKEN` 的默认权限
GitHub 自动生成的 `GITHUB_TOKEN` 权限极其有限，默认只拥有 `contents: read`。  
`gh workflow run` 本质上是在调用 `POST /repos/{owner}/{repo}/actions/workflows/{workflow_id}/dispatches` 接口，这需要 **`actions: write`** 权限。

#### 4.2 正确的权限声明
你必须在 Job 层级显式声明权限：

```yaml
jobs:
  trigger:
    runs-on: ubuntu-22.04
    permissions:
      contents: read    # 为了 git ls-remote 和 checkout
      actions: write    # 为了 gh workflow run 调用 API
```

#### 4.3 部署工作流自身的权限
注意：`deploy.yml` 负责部署到 GitHub Pages，它需要 `pages: write` 和 `id-token: write`，这些权限在 `deploy.yml` 内部单独配置，与触发工作流的权限互不干扰。

---

### 第五章：完整的最终配置文件

将以上所有知识汇总，这是你项目中的最终版本（已确认功能完好）：

```yaml
name: Check Notes & Trigger Deploy

on:
  schedule:
    - cron: '*/30 * * * *'   # 每30分钟轮询一次
  workflow_dispatch:          # 保留手动触发，便于调试

jobs:
  trigger:
    runs-on: ubuntu-22.04
    
    # 🔥 关键配置：赋予触发其他工作流的权限
    permissions:
      contents: read
      actions: write

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Get latest SHA of notes repo
        id: get_sha
        run: |
          SHA=$(git ls-remote https://github.com/XuNuoXi-QAQ/ai-collab-dev-tutorial main | awk '{print $1}')
          echo "sha=$SHA" >> $GITHUB_OUTPUT
          echo "Latest SHA: $SHA"

      - name: Restore cached SHA
        id: cache_sha
        uses: actions/cache@v4
        with:
          path: .notes-sha
          key: notes-sha-${{ steps.get_sha.outputs.sha }}

      - name: Trigger deploy.yml if SHA changed
        if: steps.cache_sha.outputs.cache-hit != 'true'
        run: |
          echo "🔄 Notes changed, triggering deploy workflow..."
          gh workflow run deploy.yml --ref main
        env:
          GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

---

### 第六章：最佳实践与运维建议

1.  **关于 Cron 频率**：GitHub Actions 的 `schedule` 事件存在**不可忽略的延迟**（可能延后 15-30 分钟），且最短间隔建议不低于 5 分钟。每 30 分钟一次是兼顾“实时性”与“配额友好”的黄金平衡点。如果你需要更高频，建议改用 `repository_dispatch`。

2.  **关于缓存过期**：`actions/cache` 如果超过 7 天未被访问，可能会被 GitHub 自动清理。但 30 分钟一次的轮询频率完全不会触发此问题。

3.  **日志审计**：每次 `deploy.yml` 被成功触发后，Actions 运行日志中会记录 `workflow run` 的 ID，方便你追踪完整的构建链条。

4.  **权限最小化原则**：我们在 Trigger Job 中只授予了 `actions: write`，而没有授予多余的 `contents: write` 或 `pages: write`，这符合安全最佳实践。

---

### 第七章：扩展思考（如果未来需要迁移）

- **若笔记仓库变为私有**：`git ls-remote` 无法直接读取私有仓库的 SHA。此时需在 Trigger Job 中配置带 `secrets.ACCESS_TOKEN` 的 `git ls-remote` 命令，或改用 `actions/checkout` 拉取代码（但这会拉取全部文件，效率较低）。
- **若构建逻辑需要拆分**：你可以将 `deploy.yml` 中的构建步骤拆分成 `build.yml` 和 `deploy.yml`，然后在 `check-and-trigger.yml` 中通过 `workflow_run` 事件来串联，形成更清晰的流水线。

---

### 📝 结语

通过这份教程，你不仅掌握了一个具体的自动化部署方案，更深入理解了 GitHub Actions 的**事件驱动模型**、**跨仓库通信策略**和**权限体系**。这套方法论适用于任何需要联动多个仓库的 CI/CD 场景。

