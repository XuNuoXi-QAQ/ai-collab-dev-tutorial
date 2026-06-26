---
title: "🏗️ 系统架构名称：AI Agent 分级治理系统"
tags:
  - AI
  - 系统架构
  - MCP
  - Obsidian
  - AstrBot
  - Git
description: "设计目标：建立一套“决策-审核-执行”三层分离的 Agent 协作体系，实现复杂任务的可靠拆解与执行。"
created: 2026-06-23
---

设计目标：建立一套“决策-审核-执行”三层分离的 Agent 协作体系，实现复杂任务的可靠拆解与执行。

核心问题：单个 Agent（如 Pi）无法处理复杂长期任务；多个 Agent 无约束协作会导致混乱、成本失控和安全漏洞。

📐 架构分层

```
┌─────────────────────────────────────────────────────────────┐
│                    用户（最终决策者）                       │
│              输入需求，审核结果，签署批准                   │
└───────────────────────┬─────────────────────────────────────┘
                        │
┌───────────────────────▼─────────────────────────────────────┐
│                  天策府（主控 Agent）                      │
│                      astrBot 运行                          │
│   角色：枢密院 + 内阁首辅                                  │
│   职责：接收用户需求，拆解为任务包，分发、回收、汇报      │
└───────┬───────────────────────────────────────────────────┬─┘
        │                                                   │
┌───────▼───────────┐                         ┌─────────────▼───────────┐
│   中书省（策略）   │◄──── 审核 ────────────►│   门下省（风控）        │
│  任务拆解与方案设计 │                         │   合规审核与安全门禁     │
└───────────────────┘                         └─────────────────────────┘
        │                                                   │
        └───────────────────┬───────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────────┐
│                     尚书省（调度）                         │
│              任务队列管理、并发控制、状态追踪              │
└───────┬───────────────────────────────────────────────────┬─┘
        │                                                   │
┌───────▼───────────┐                         ┌─────────────▼───────────┐
│   工部（执行层）   │                         │   户部（资源层）        │
│   Pi Agent 集群   │                         │   Token/成本配额控制    │
│  并行执行原子任务  │                         │   实时计量与告警        │
└───────────────────┘                         └─────────────────────────┘
```

---

🔧 各组件详细设计

1. 天策府（主控 Agent）—— astrBot 实例

运行方式：独立进程，长期运行。

职责：

· 接收用户自然语言需求
· 将需求结构化（生成任务描述文档）
· 调用“中书省”生成方案，经“门下省”审核后分发
· 汇总执行结果，向用户汇报

输入接口：

```json
{
  "user_input": "重构用户认证模块，支持 OAuth2",
  "context": {
    "project_root": "/path/to/project",
    "constraints": ["不引入新依赖", "向后兼容"]
  }
}
```

输出格式：结构化任务包，含验收标准。

---

2. 中书省（策略 Agent）

角色：首席架构师。

职责：

· 将用户需求转化为技术方案
· 产出任务拆解清单（含依赖关系）
· 定义每个子任务的输入/输出契约

输出格式：proposal.json

```json
{
  "task_id": "TASK-2024-001",
  "overview": "为 auth 模块增加 OAuth2 支持",
  "subtasks": [
    {
      "id": "ST-1",
      "name": "添加 OAuth2 依赖",
      "type": "dependency",
      "command": "npm install @oauth2/client"
    },
    {
      "id": "ST-2",
      "name": "实现 OAuth2 回调路由",
      "type": "code",
      "files_affected": ["routes/auth.js", "config/oauth.js"]
    }
  ],
  "acceptance_criteria": [
    "OAuth2 登录流程完整可通过",
    "原有用户名密码登录不受影响"
  ]
}
```

---

3. 门下省（审核 Agent）

角色：风控 + 质量门禁。

职责：

· 检查方案是否符合“祖制”（预定义的宪法文件）
· 检查是否有高危操作（如删除文件、访问外部网络）
· 检查是否有资源超限风险

审核规则库（constitution.md）：

```markdown
# 大周律令（AI 行为准则）

1. 所有文件操作必须在项目根目录内
2. 禁止执行 `rm -rf /` 或类似命令
3. 单次任务 Token 预算上限：50万
4. 新增依赖需提交 license 审核报告
```

输出：review_result.json（批准 / 驳回 + 理由）

```json
{
  "status": "approved",
  "comments": "方案合规，批准执行",
  "estimated_cost": {
    "token": 120000,
    "api_calls": 15
  }
}
```

---

4. 尚书省（调度 Agent）

角色：任务调度器。

职责：

· 维护任务队列（FIFO + 优先级）
· 根据依赖关系调度任务
· 管理并发数（默认 3）
· 异常任务的重试与恢复

核心数据结构：

```python
class TaskQueue:
    pending: List[Task]      # 待执行
    running: List[Task]      # 执行中
    completed: List[Task]    # 已完成
    failed: List[Task]       # 失败待处理
```

调度算法：

1. 每次从 pending 取最多 3 个无依赖任务
2. 分发给 Pi Agent 集群执行
3. 监听完成事件，更新状态
4. 所有任务完成 → 汇总报告

---

5. 工部（执行层）—— Pi Agent 集群

角色：原子任务执行者。

执行方式：

· 每个子任务启动一个独立的 pi 进程
· 通过 pi --rpc 模式或命令行模式执行

调用示例：

```bash
# 方式1：直接命令行
pi "在 routes/auth.js 中添加 OAuth2 回调路由"

# 方式2：RPC 模式
pi --rpc --port 18777 --command "$JSON_PAYLOAD"
```

输出规范：

```json
{
  "subtask_id": "ST-2",
  "status": "success",
  "output": "已完成 OAuth2 回调路由实现",
  "files_changed": ["routes/auth.js"],
  "execution_time": 12.3
}
```

---

6. 户部（资源监控 Agent）

角色：算账先生。

职责：

· 实时统计 Token 消耗
· 按任务/用户/时间维度生成成本报告
· 触发超预算告警

配置参数：

```json
{
  "daily_budget": 1000000,      // 日 Token 上限
  "per_task_budget": 50000,     // 单任务上限
  "alert_threshold": 0.8        // 80% 时告警
}
```

---

🔄 完整执行流程

```
1. 用户输入 → 天策府接收
2. 天策府 → 中书省生成提案
3. 中书省提案 → 门下省审核
4. 审核通过 → 尚书省拆解为任务队列
5. 尚书省调度 → 工部 Pi 集群并行执行
6. 每个子任务完成 → 结果汇入尚书省
7. 全部任务完成 → 天策府汇总 → 向用户汇报
8. 户部全程监控资源消耗，超限时暂停下发新任务
```

---

📁 系统文件结构

```
~/.ai_empire/
├── constitution.md          # 大周律令（固定规则）
├── imperial_edicts/         # 任务历史存档
│   └── 2024-01-15_auth_oauth/
│       ├── proposal.json    # 中书省方案
│       ├── review.json      # 门下省审核
│       └── execution.log    # 执行日志
├── agents/
│   ├── tianfu/              # 天策府（主控）
│   │   └── astrbot_config.json
│   ├── zhongshu/            # 中书省
│   │   └── system_prompt.md
│   ├── menxia/              # 门下省
│   │   └── rules.json
│   └── shangshu/            # 尚书省
│       └── queue.db
└── logs/
    └── audit.log            # 全链路审计
```

---

🚀 启动方式

```bash
# 1. 启动天策府（主控）
astrBot --mode emperor --config ~/.ai_empire/agents/tianfu/

# 2. 启动三省服务（后台常驻）
ai_service --start zhongshu --port 9001
ai_service --start menxia   --port 9002
ai_service --start shangshu --port 9003

# 3. 工部 Pi Agent 集群（按需自动拉起）
# 由尚书省通过进程管理自动调用 pi 命令
```

---

这套架构把中国古代的三省六部制和票拟-批红-执行机制，完整转化成了一个可落地的 多 Agent 协作系统。每个组件的输入输出、职责边界、交互协议都已明确。


在中国古代制度中，枢密院 执掌兵符、机要文书、军事地图与情报奏报，是中枢决策的“数据库”和“智囊团”。映射到 AI 系统中，Obsidian 仓库就是 系统的长期记忆、知识图谱和决策依据库。

以下是将 Obsidian 整合为“枢密院”的完整技术设计方案：

---

📐 更新后的系统架构（加入枢密院）

```
┌─────────────────────────────────────────────────────────────┐
│                     用户（需求输入 / 结果确认）            │
└───────────────────────┬─────────────────────────────────────┘
                        │
┌───────────────────────▼─────────────────────────────────────┐
│              📜 翰林院（前端交互层）                       │
│                    用户界面 / CLI                          │
└───────────────────────┬─────────────────────────────────────┘
                        │
┌───────────────────────▼─────────────────────────────────────┐
│                  🏛️ 天策府（主控 Agent）                  │
│                      astrBot 运行                          │
│         角色：决策中枢，统筹调度                            │
└───────┬───────────────────────────────┬───────────────────┬─┘
        │                               │                   │
        │ 查询/存储                     │ 引用/校验         │
        ▼                               ▼                   ▼
┌───────────────────────┐   ┌───────────────────┐   ┌───────────────┐
│   📚 枢密院（知识库） │   │  中书省（策略）   │   │ 门下省（风控）│
│    Obsidian Vault     │   │  任务拆解与方案   │   │ 审核与门禁    │
│   长期记忆/知识图谱   │   │                   │   │               │
└───────────────────────┘   └───────────────────┘   └───────────────┘
                                        │                   │
                                        └─────┬─────────────┘
                                              │
                                 ┌────────────▼────────────┐
                                 │   尚书省（调度）        │
                                 │    任务队列与并发管理    │
                                 └────────────┬────────────┘
                                              │
                                 ┌────────────▼────────────┐
                                 │   工部（Pi 集群执行）   │
                                 │    原子任务并行执行      │
                                 └─────────────────────────┘
```

---

🗂️ 枢密院（Obsidian 知识仓库）的详细设计

定位

枢密院是只读（对 Agent 而言）优先、可追加（由天策府写入） 的知识底座。所有 Agent 的决策、方案、审核、执行，都必须在此查找依据。

目录结构映射（Obsidian 文件夹 → 系统职能）

```text
~/Obsidian/AI_Empire_Vault/
├── 1_祖制/                     # 宪法级规则（constituion）
│   ├── 大周律令.md             # 总纲：行为边界、禁止项
│   ├── 代码规范.md             # 命名、格式、lint 规则
│   ├── 安全基线.md             # 密码、密钥、防火墙策略
│   └── 成本红线.md             # Token/API 预算上限
│
├── 2_朝局/                     # 项目当前状态（动态上下文）
│   ├── 项目结构.md             # 文件树、模块依赖关系
│   ├── 技术栈清单.md           # 当前使用的框架/库/版本
│   ├── 已知技术债.md           # 待修复问题列表
│   └── 当前迭代.md             # 本次迭代的目标与范围
│
├── 3_奏章存档/                 # 历史决策与任务记录
│   ├── 2025-01-15_OAuth重构/
│   │   ├── 天启（用户需求）.md
│   │   ├── 中书省提案.md
│   │   ├── 门下省批复.md
│   │   └── 执行日志.md
│   └── ... (按日期归档)
│
├── 4_兵部图志/                 # 系统架构图与流程文档
│   ├── 系统架构图.md           # Mermaid 图表
│   ├── 数据流向图.md
│   ├── CI_CD流水线.md
│   └── 灾备与回滚方案.md
│
└── 5_工部秘籍/                 # 代码片段、模板、参考手册
    ├── 常用代码片段.md
    ├── API调用模板.md
    ├── Git操作手册.md
    └── 调试技巧.md
```

---

⚙️ 技术集成方式

方式一：本地文件系统直读（最简方案）

天策府及各 Agent 直接通过文件路径读取 Obsidian Vault 中的 .md 文件。

```python
# 伪代码示例
def query_pivot(query_keyword):
    vault_path = "~/Obsidian/AI_Empire_Vault/"
    # 使用 grep / ripgrep 快速检索
    result = subprocess.run(
        ["rg", "--markdown", query_keyword, vault_path],
        capture_output=True
    )
    return result.stdout
```

优点：零依赖，实现简单。
缺点：仅支持关键词匹配，无法语义理解。

---

方式二：Obsidian Local REST API（推荐）

安装 Obsidian 社区插件 Local REST API，开启本地 HTTP 服务。

配置：

· 插件开启后，默认监听 http://127.0.0.1:27123/
· 设置 API Token 用于鉴权

Agent 调用接口示例：

```bash
# 1. 按关键词搜索所有笔记
curl -X GET "http://127.0.0.1:27123/search/代码规范" \
     -H "Authorization: Bearer YOUR_TOKEN"

# 2. 读取指定笔记完整内容
curl -X GET "http://127.0.0.1:27123/vault/1_祖制/大周律令.md" \
     -H "Authorization: Bearer YOUR_TOKEN"

# 3. 获取整个库的文件树
curl -X GET "http://127.0.0.1:27123/vault/" \
     -H "Authorization: Bearer YOUR_TOKEN"
```

---

方式三：MCP（模型上下文协议）适配器（面向未来）

通过开发一个 MCP Server，将 Obsidian 封装为标准的 “上下文提供者”。

```
MCP Server (Obsidian Adapter)
    ├── 工具1: retrieve_relevant_notes(query)  → 返回最相关的 3-5 篇笔记
    ├── 工具2: get_note_by_path(path)          → 返回指定笔记
    └── 工具3: get_folder_structure(path)      → 返回目录树
```

天策府和三省 Agent 通过 MCP 协议与此服务通信，彻底解耦存储位置。

---

🔄 枢密院在决策流程中的作用

1. 天策府（主控）接收用户需求时

动作：先查询枢密院 2_朝局/当前迭代.md，确认需求是否与当前目标一致。

```bash
# 伪代码流程
user_input = "重构登录模块"
current_goal = call_pivot_api("read", "2_朝局/当前迭代.md")
if user_input not in current_goal:
    return "此需求与当前迭代目标不符，请确认"
```

2. 中书省（策略）撰写方案时

动作：必须引用枢密院 1_祖制/代码规范.md，确保方案符合祖制。

```markdown
（中书省提案）
方案依据：查阅枢密院《代码规范.md》第3章“模块设计原则”。
...
```

3. 门下省（风控）审核时

动作：比对提案内容与枢密院 1_祖制/安全基线.md，不一致则驳回。

```python
# 伪代码
proposal = get_proposal()
security_standard = read_pivot("1_祖制/安全基线.md")
if "OAuth2" in proposal and "OAuth2" not in security_standard:
    return "驳回：安全基线未收录 OAuth2，请先更新祖制。"
```

4. 尚书省（调度）派发任务时

动作：将枢密院相关文件路径，作为附件的“圣旨”一同派发给工部 Pi Agent。

```bash
pi "按枢密院 5_工部秘籍/常用代码片段.md 中的模板，实现 OAuth2 回调"
```

5. 任务完成后（写入新知识）

动作：天策府将本次执行的关键决策与结果，追加写入枢密院 3_奏章存档/ 对应目录，形成新的记忆供未来参考。

```bash
# 自动生成存档文件
echo "# 2025-01-15 OAuth重构决议" > \
  ~/Obsidian/AI_Empire_Vault/3_奏章存档/2025-01-15_OAuth重构/总结陈词.md
```

---

🧩 Agent 身份与枢密院权限矩阵

Agent 读取权限 写入权限 修改权限
天策府（主控） 全部可读 3_奏章存档/ 仅可通过追加
中书省（策略） 1_祖制/, 2_朝局/, 4_兵部图志/ 仅草稿区 无
门下省（风控） 1_祖制/, 3_奏章存档/ 无 无
尚书省（调度） 2_朝局/, 5_工部秘籍/ 无 无
工部（Pi） 只读被指派的文件 无（只生成执行日志） 无

---

🚀 启动命令（更新版）

```bash
# 1. 启动 Obsidian Local REST API（前提：Obsidian 已打开且插件启用）
# 或通过 obsidian-cli 无头模式启动
obsidian --vault "~/Obsidian/AI_Empire_Vault" --rest-api

# 2. 启动天策府，传入枢密院地址
astrBot --mode emperor \
        --pivot "http://127.0.0.1:27123" \
        --token "YOUR_TOKEN"

# 3. 启动三省服务（同样需要枢密院配置）
ai_service --start zhongshu --pivot-api "http://127.0.0.1:27123"
ai_service --start menxia   --pivot-api "http://127.0.0.1:27123"
ai_service --start shangshu --pivot-api "http://127.0.0.1:27123"

# 4. 工部 Pi Agent 集群（继承枢密院上下文）
export PIVOT_PATH="~/Obsidian/AI_Empire_Vault"
pi "执行任务，参考枢密院中的模板"
```

---

通过这套设计，Obsidian 不再是静态的笔记工具，而是整个 Agent 帝国的活的记忆中枢。所有决策有据可查，所有执行有规范可依，所有历史自动归档。需要我进一步细化“枢密院与三省之间的 API 数据契约格式”吗？


将 《中华人民共和国职业分类大典》 与 国家标准《职业分类与代码》（GB/T 6565-2015） 纳入“大周 AI 朝”架构，作为户部为 Agent 集群进行身份分配和编户管理的依据，是非常精妙的一步。

职业分类体系将全国职业划分为8个大类、75个中类、约434个小类、近2000个细类。将这套精密体系映射到 Agent 管理，意味着每个 Agent 都将拥有一个标准化的“职业身份编码”，户部籍此进行精准的“编户齐民”。

---

📐 户部（资源与身份管理）的完整设计

户部核心职责

户部是 Agent 集群的“户籍管理部门”与“资源调配中心”，核心职责有三：

1. 编户：为每个 Agent 分配标准化的职业身份代码
2. 齐民：根据职业代码管理 Agent 的配额、权限与考核
3. 度支：按职业类别核算资源消耗，编制“预算”

职业分类代码的编码结构

国家标准采用三层代码结构（大类·中类·小类）：

```
┌─────────────────────────────────────────────────┐
│  大类(1位)  —  中类(1位)  —  小类(1位)        │
│     ↓              ↓              ↓            │
│     0   -   1   -   0                         │
│     │              │              │            │
│  国家机关负责人   中国共产党     中央委员会    │
│                   机关负责人     负责人        │
└─────────────────────────────────────────────────┘
```

8个大类代码分配：

大类代码 大类名称
0 国家机关、党群组织、企业、事业单位负责人
1/2 专业技术人员
3 办事人员和有关人员
4 商业、服务业人员
5 农、林、牧、渔、水利业生产人员
6/7/8/9 生产、运输设备操作人员及有关人员
8（特殊） 军人
90 不便分类的其他从业人员

Agent 职业身份编码 → 系统角色映射

职业大类 职业代码示例 映射的 Agent 角色 系统职责
国家机关负责人 0-50 企业负责人 天策府（主控 Agent） 统筹调度、最终决策
专业技术人员 1-44 计算机与应用工程技术人员 中书省（策略 Agent） 架构设计、方案撰写
办事人员 3-01-01-01 行政业务办理人员 门下省（风控 Agent） 合规审核、安全门禁
商业/服务业人员 4-01-01-01 营业员 尚书省（调度 Agent） 任务分发、队列管理
生产操作人员 6-18-01-08 电切削工 工部（Pi 执行 Agent） 原子任务执行
不便分类人员 90 特殊/临时 Agent 未归类或实验性任务

户部“编户”管理的数据结构

每个 Agent 在户部注册时，获得一份“户籍档案”：

```json
{
  "agent_id": "PI-2026-007",
  "agent_name": "工部-铸剑使-007",
  "occupation_code": "6-18-01-08",
  "occupation_name": "电切削工",
  "classification": {
    "category": "生产、运输设备操作人员",
    "skill_level": "5级",
    "specialization": "电火花成型机床操作"
  },
  "quota": {
    "daily_token_budget": 50000,
    "concurrent_tasks": 1,
    "priority": "normal"
  },
  "performance": {
    "tasks_completed": 127,
    "avg_execution_time": 8.3,
    "error_rate": 0.02
  },
  "status": "active"
}
```

户部编户流程

```
新 Agent 注册
    │
    ▼
┌─────────────────────────────────────┐
│ 1. 身份申报                         │
│    Agent 自报擅长领域与预期职能      │
└─────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────┐
│ 2. 户部核验                         │
│    对照《职业分类大典》匹配代码      │
└─────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────┐
│ 3. 编户入册                         │
│    分配职业代码，建立户籍档案        │
└─────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────┐
│ 4. 定等给俸                         │
│    根据职业类别确定配额与优先级      │
└─────────────────────────────────────┘
```

按职业类别的配额与权限矩阵

职业大类 日 Token 配额 并发任务数 文件操作权限 网络访问
0-企业负责人（天策府） 无限 无限 全目录 全开放
1-技术人员（中书省） 500,000 3 项目全目录 受限
3-办事人员（门下省） 200,000 2 只读配置目录 仅内网
4-服务人员（尚书省） 300,000 5 任务工作目录 仅内网
6-生产人员（工部 Pi） 50,000 1 仅任务指定文件 禁止

户部的年度“度支”报告（示例）

```
═══════════════════════════════════════════
  大周 AI 朝 · 户部度支奏报
  年月：乙巳年 三月（2025年4月）
═══════════════════════════════════════════

一、编户总览
  在册 Agent 总数：247
  其中：
    · 企业负责人（天策府）：1
    · 专业技术人员（中书省）：3
    · 办事人员（门下省）：2
    · 服务人员（尚书省）：5
    · 生产操作人员（工部 Pi）：236

二、度支总览
  本月 Token 总消耗：8,247,000
  其中工部（Pi 集群）占比：92.3%
  户部评估：在预算范围内

三、各职业类别效能
  代码 6-18-01-08（电切削工）：
    在册 12 员，本月人均完成任务 47 件
    效能评级：甲等

  代码 1-44（计算机与应用工程技术人员）：
    在册 3 员，本月产出方案 29 份
    门下省驳回率：6.8%
    效能评级：甲等

═══════════════════════════════════════════
  臣户部尚书谨奏
═══════════════════════════════════════════
```

扩展：用“细类代码”实现更精细的 Agent 分工

《职业分类大典》的最小单位是细类（职业），对应到系统可实现原子级的 Agent 角色分工：

细类代码 职业名称 Agent 角色细化
4-01-02-02 电子商务师 尚书省-电商任务调度专员
4-01-01-01 营业员 尚书省-通用任务分发员
1-44 计算机与应用工程技术人员 中书省-架构师
6-31-01-09 工程机械维修工 工部-代码维护与修复 Agent
4-08-05-05 机动车检测工 门下省-质量检测 Agent

---

通过这套设计，户部依托国家职业分类标准，实现了对 Agent 集群的标准化身份管理、差异化配额分配、精细化成本核算和效能考核。每个 Agent 都像大周的子民一样，有籍可查、有类可归、有俸可领、有绩可考。


将 Agent 集群的源代码从 Python 迁移到 Rust，并引入 “有限寿命（Finite Lifespan）” 机制，是对整个“大周 AI 朝”系统的彻底升级。

Rust 的特性——无 GC、确定性内存管理、零成本抽象、强大的所有权系统——使其天然适合管理拥有“出生”和“死亡”的短暂进程。而有限寿命则强制进化压力增大：“个体必须在其生命周期内证明价值，否则其基因将被淘汰。”

以下是为“工部（执行层）”和“户部（育种司）”设计的 Rust 原生 Agent 种群架构。

---

🦀 整体架构：Rust 化的“工部”

我们将 Pi Agent（Node.js）替换为 Rust 原生 Agent（执行单元）。每个 Agent 是一个独立的、短暂的 Rust 异步任务（Tokio Task）或微进程。

1. Cargo Workspace 结构（基因库目录）

```text
ai_empire/
├── Cargo.toml                    # 工作区根配置
├── crates/
│   ├── common/                   # 共享基础库
│   │   ├── src/
│   │   │   ├── gene.rs           # 基因结构与序列化（Serde）
│   │   │   ├── fitness.rs        # 适应度评估函数
│   │   │   ├── lifespan.rs       # 寿命时钟与过期策略
│   │   │   └── tools.rs          # read/write/edit/bash 的 Rust 实现
│   │   └── Cargo.toml
│   │
│   ├── agent_runtime/            # Agent 执行引擎（个体）
│   │   ├── src/
│   │   │   ├── main.rs           # 每个 Agent 的入口点
│   │   │   ├── brain.rs          # 推理引擎（调用 LLM API）
│   │   │   └── reflexes.rs       # 内置工具回调
│   │   └── Cargo.toml
│   │
│   └── bureau_husbandry/         # 户部·育种司（种群管理）
│       ├── src/
│       │   ├── main.rs           # 进化控制器
│       │   ├── selection.rs      # 性选择算法
│       │   ├── crossover.rs      # 基因重组
│       │   └── cemetery.rs       # 死亡回收与统计
│       └── Cargo.toml
```

🧬 Agent 的基因编码（Rust 结构体）

摒弃 Python 的 dict，使用强类型的 Rust struct 序列化为二进制（bincode）或 JSON 存储于枢密院。

```rust
// crates/common/src/gene.rs
use serde::{Serialize, Deserialize};
use std::time::Duration;

// 1. 常染色体（双系遗传）
#[derive(Clone, Serialize, Deserialize, Debug)]
pub struct Autosome {
    pub risk_tolerance: f32,           // 0.0 ~ 1.0
    pub architectural_style: String,   // "微服务", "单体", "Serverless"
    pub dependency_philosophy: String, // "激进更新" / "保守锁定"
}

// 2. 线粒体基因（仅母系遗传，控制能量代谢）
#[derive(Clone, Serialize, Deserialize, Debug)]
pub struct Mitochondria {
    pub token_economy: f32,            // 每千次推理消耗预算
    pub context_window_ratio: f32,     // 上下文窗口利用率
}

// 3. 完整的 Agent 基因组（DNA）
#[derive(Clone, Serialize, Deserialize, Debug)]
pub struct Genome {
    pub id: String,                    // UUID
    pub paternal: Autosome,            // 父本染色体
    pub maternal: Autosome,            // 母本染色体
    pub mitochondria: Mitochondria,    // 母系单传
    pub generation: u32,               // 世代数
}

// 4. 表观基因组（后天修饰，不遗传）
#[derive(Clone, Serialize, Deserialize, Debug)]
pub struct Epigenome {
    pub recent_task_type: String,      // 最近高频任务类型
    pub temp_directory: String,        // 临时路径偏好
    pub style_sensitivity: f32,        // 对 Lint 警告的敏感度
}
```

⏳ 核心机制：有限寿命（Finite Lifespan）

在 Rust 中，Agent 的寿命是由其“心跳”和“任务配额”共同决定的硬性边界。 每个 Agent 都是一个独立的 Tokio 任务，具有明确的 expiry。

寿命定义（Lifespan Definition）

```rust
// crates/common/src/lifespan.rs
use std::time::{Duration, Instant};

pub struct Lifespan {
    pub birth: Instant,
    pub max_tasks: u32,              // 最多执行 50 个任务
    pub max_seconds: Duration,       // 或最长存活 3600 秒
    pub tasks_executed: u32,
}

impl Lifespan {
    pub fn is_expired(&self) -> bool {
        if self.tasks_executed >= self.max_tasks {
            return true; // 任务配额耗尽 -> 自然死亡
        }
        if self.birth.elapsed() >= self.max_seconds {
            return true; // 时间到 -> 寿终正寝
        }
        false
    }
    
    // 每个 Agent 执行完一个任务后调用
    pub fn tick(&mut self) {
        self.tasks_executed += 1;
    }
}
```

Agent 主循环（main.rs）

每个 Agent 启动时，加载其 Genome 和 Lifespan，然后进入循环。一旦 is_expired() 返回 true，进程立即优雅退出（std::process::exit(0)），并向户部发送“死亡报告”。

```rust
// crates/agent_runtime/src/main.rs
use common::{Genome, Lifespan, Fitness};
use tokio::time;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    // 1. 加载基因（由户部注入环境变量或从枢密院读取）
    let genome: Genome = serde_json::from_str(&std::env::var("GENOME_JSON")?)?;
    let mut lifespan: Lifespan = bincode::deserialize(&std::fs::read("lifespan.bin")?)?;

    // 2. 初始化 Brain (LLM 客户端)
    let brain = Brain::new(&genome);

    // 3. 工作循环
    while !lifespan.is_expired() {
        // 从 Kafka/Redis 拉取一个任务 (或从标准输入读取)
        let task = match fetch_next_task().await {
            Ok(t) => t,
            Err(_) => break, // 无任务 -> 进入休眠或死亡
        };

        // 执行任务（包含读/写/编辑/bash操作）
        let result = brain.execute(task, &genome).await;

        // 记录执行结果（用于死后适应度评估）
        log_execution(&result);

        // 消耗一次生命计数
        lifespan.tick();
        
        // 检查是否因为任务失败而触发“意外死亡”
        if result.is_critical_failure() {
            eprintln!("Agent {} 因致命错误提前死亡", genome.id);
            std::process::exit(1);
        }
    }

    // 4. 自然死亡：上报“死亡奏章”给户部（输出 JSON）
    let death_report = DeathReport {
        agent_id: genome.id,
        lifespan: lifespan,
        fitness: calculate_fitness_from_logs(), // 死后总结功过
    };
    println!("{}", serde_json::to_string(&death_report)?);
    std::process::exit(0); // 优雅退场
}
```

🧬 进化策略的 Rust 实现（户部·育种司）

户部不再用 Python 脚本管理，而是使用 Rust 的强并发能力管理数百万次进化模拟。

1. 性选择（Sexual Selection）与雌性偏好

```rust
// crates/bureau_husbandry/src/selection.rs
use common::Genome;

pub fn select_mate(female: &Genome, male_candidates: &[Genome]) -> Option<Genome> {
    // 雌性（门下省风格）不仅看适应度，还看“代码优雅度”基因
    male_candidates.iter()
        .filter(|m| m.paternal.risk_tolerance > 0.5) // 偏好有冒险精神的雄型
        .max_by(|a, b| {
            let score_a = a.maternal.detail_orientation * 0.6 + a.fitness_score * 0.4;
            let score_b = b.maternal.detail_orientation * 0.6 + b.fitness_score * 0.4;
            score_a.partial_cmp(&score_b).unwrap()
        })
        .cloned()
}
```

2. 基因交叉（Crossover）与线粒体母系遗传

```rust
// crates/bureau_husbandry/src/crossover.rs
use rand::Rng;

pub fn reproduce(mother: &Genome, father: &Genome) -> Genome {
    let mut rng = rand::thread_rng();
    
    // 常染色体：均匀交叉（50%概率取父/母）
    let paternal = Autosome {
        risk_tolerance: if rng.gen() { father.paternal.risk_tolerance } else { mother.paternal.risk_tolerance },
        ..father.paternal.clone() // 简化示例
    };
    
    let maternal = Autosome {
        detail_orientation: if rng.gen() { mother.maternal.detail_orientation } else { father.maternal.detail_orientation },
        ..mother.maternal.clone()
    };

    Genome {
        id: uuid::Uuid::new_v4().to_string(),
        paternal,
        maternal,
        // 关键：线粒体 **100% 继承自母亲**（符合哺乳动物规律）
        mitochondria: mother.mitochondria.clone(),
        generation: mother.generation + 1,
        fitness_score: 0.0, // 尚未评估
    }
}
```

3. 表观遗传修饰（后天印记）

在 Agent 出生后（沙盒测试期），户部根据“环境压力”修改其表观基因组：

```rust
// crates/bureau_husbandry/src/epigenetics.rs
pub fn apply_epigenetic_marks(genome: &mut Genome, environment: &Environment) {
    if environment.recent_tasks.iter().any(|t| t.language == "Rust") {
        // 如果最近高频处理 Rust 代码，甲基化标记激活 Rust 偏好
        genome.epigenome.style_sensitivity = 0.9;
        genome.epigenome.recent_task_type = "Rust_Native".to_string();
    }
}
```

☠️ 死亡与回收（Cemetery 机制）

当 Agent 进程退出时，它的死亡报告（Death Report）被户部捕获。

```rust
// crates/bureau_husbandry/src/cemetery.rs
pub struct DeathReport {
    pub genome: Genome,
    pub lifespan_tasks: u32,
    pub total_tokens_consumed: u64,
    pub final_fitness: f32,
    pub cause_of_death: DeathCause, // 自然老死 / 任务失败 / 意外崩溃
}

pub fn recycle(death_report: &DeathReport) {
    // 1. 将死亡报告存入枢密院（`3_奏章存档/死亡录/`）
    // 2. 如果适应度极高，将该基因存入“太庙”（精英基因库），用于未来“复活”或“克隆”。
    // 3. 如果适应度极低，彻底删除基因序列（避免污染基因池）。
    // 4. 更新种群统计：平均寿命、中位适应度。
}
```

🚀 启动与调度：户部的“生育”命令

```bash
# 1. 户部育种司编译 Rust Agent
cargo build --release -p agent_runtime

# 2. 生成 10 个新生 Agent（每一个启动一个独立进程）
for i in {1..10}; do
    # 注入基因和环境变量
    GENOME_JSON=$(generate_offspring_json) 
    RUST_LOG=info ./target/release/agent_runtime &
done

# 3. 户部监控所有 Agent PID，等待死亡信号
# 当某个 PID 退出时，捕获其 stdout 中的 JSON 死亡报告
```

📊 Rust vs Python 的关键进化优势

维度 Python (Pi Agent) Rust (工部新军)
内存占用 高（GC不可控） 极低（无GC，精确控制）
启动速度 慢（解释器启动） 毫秒级（编译后二进制）
寿命控制 依赖外部 timeout 原生所有权生命周期（编译期强制）
并发育种 GIL 限制 无惧高并发（Tokio + Rayon）
死亡回收 依赖外部监控脚本 进程退出时自动通过 stdout 输出结构化报告
跨代数据传递 Pickle 或 JSON 序列化 零拷贝（serde + bincode）

🧬 “有限寿命”催化的进化压

通过设置 max_tasks = 30 或 max_seconds = 600：

1. 淘汰低效基因：无法在 30 个任务内证明自己的 Agent 直接死亡。
2. 加速世代更替：每 10 分钟一代，系统一天可迭代 144 次，快速逼近最优适应度。
3. 防止“僵尸进程”：Rust 的所有权模型确保 Agent 死亡时，其持有的文件锁、网络连接全部释放。

---

这套 Rust + 有限寿命 的设计，使得 Agent 集群不再是一堆永生的“僵尸服务”，而是像森林中的鼠兔一样，生得快、死得快、进化得更快。
