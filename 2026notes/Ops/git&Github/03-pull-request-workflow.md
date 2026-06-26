---
title: "03-pull-request-workflow"
tags:
  - Git
  - GitHub
  - 版本控制
description: "第 2 步：在 GitHub 上创建 PR"
created: 2026-06-23
---

# 第 3 章：Pull Request 工作流程

## 🎯 学习目标

完成本章学习后，你将能够：
- 理解 Pull Request 的核心概念和价值
- 掌握创建高质量 PR 的方法
- 了解 PR 审查的完整流程
- 学会处理 PR 合并的各种情况

---

## 3.1 Pull Request 基础

### 3.1.1 什么是 Pull Request？

Pull Request（简称 PR）是 GitHub 上的一种代码协作机制，让开发者可以：

- 📢 **发起讨论**：就代码变更进行公开讨论
- 🔍 **代码审查**：团队成员审查代码质量
- ✅ **质量把控**：确保代码符合项目标准
- 📝 **记录决策**：保留技术决策的讨论记录

### 3.1.2 PR 的核心价值

| 价值 | 说明 |
|------|------|
| 代码质量 | 通过多人审查减少 Bug |
| 知识共享 | 团队成员互相学习 |
| 代码一致性 | 确保代码风格统一 |
| 可追溯性 | 每个变更都有讨论记录 |
| 团队协作 | 促进团队沟通和协作 |

---

## 3.2 创建 Pull Request

### 3.2.1 PR 创建前的准备

**1. 确保代码质量**
```bash
# 运行测试
npm test          # 或 pytest、go test 等

# 代码格式化
npm run format    # 或 black、gofmt 等

# 代码检查
npm run lint      # 或 eslint、flake8 等
```

**2. 同步最新代码**
```bash
# 切换到主分支
git checkout main

# 拉取最新代码
git pull origin main

# 切换回功能分支
git checkout feature/your-feature

# 变基到最新的 main
git rebase main
# 或者合并 main
git merge main
```

**3. 检查提交历史**
```bash
# 查看提交历史
git log --oneline main..feature/your-feature

# 如果需要，整理提交（交互式变基）
git rebase -i main
```

### 3.2.2 创建 PR 的步骤

**第 1 步：推送分支到远程**
```bash
git push -u origin feature/your-feature
```

**第 2 步：在 GitHub 上创建 PR**

1. 打开仓库页面
2. 点击 "Compare & pull request" 按钮
3. 选择目标分支（base）和源分支（compare）
4. 填写 PR 标题和描述
5. 选择审查者（Reviewers）
6. 添加标签（Labels）
7. 关联 Issue（如果有）
8. 点击 "Create pull request"

### 3.2.3 编写优秀的 PR 描述

**PR 描述模板：**

```markdown
## 变更说明

<!-- 简要描述这个 PR 做了什么 -->

## 变更类型

- [ ] Bug 修复
- [ ] 新功能
- [ ] 性能优化
- [ ] 代码重构
- [ ] 文档更新
- [ ] 其他（请说明）

## 关联 Issue

<!-- 关联的 Issue 编号，如 Closes #123 -->

## 测试情况

- [ ] 单元测试
- [ ] 集成测试
- [ ] 手动测试

## 截图（如适用）

<!-- 如果是 UI 变更，请附上截图 -->

## 注意事项

<!-- 需要特别说明的地方 -->
```

**PR 描述最佳实践：**

- ✅ 清晰说明做了什么、为什么做
- ✅ 提供测试方法和结果
- ✅ 关联相关的 Issue
- ✅ UI 变更附上截图或动图
- ✅ 标注破坏性变更（Breaking Change）
- ❌ 不要只写 "fix bug" 这种模糊描述
- ❌ 不要写太长的技术细节（代码本身会说明）

---

## 3.3 PR 审查流程

### 3.3.1 审查者的角色

**审查者应该关注：**

1. **正确性**：代码逻辑是否正确
2. **可读性**：代码是否清晰易懂
3. **可维护性**：未来是否容易修改
4. **安全性**：是否有安全漏洞
5. **性能**：是否有性能问题
6. **一致性**：是否符合项目规范

### 3.3.2 Code Review 的步骤

**第 1 步：理解变更背景**
- 阅读 PR 描述
- 查看关联的 Issue
- 了解为什么要做这个变更

**第 2 步：整体浏览**
- 查看变更的文件列表
- 理解变更的范围
- 评估影响面

**第 3 步：详细审查**
- 逐行阅读代码
- 提出问题和建议
- 标记需要修改的地方

**第 4 步：测试验证**
- 本地拉取代码测试（如果需要）
- 验证功能是否正常

**第 5 步：给出审查结论**
- Approve：同意合并
- Comment：提出意见，但不阻止合并
- Request changes：必须修改后才能合并

### 3.3.3 审查意见的类型

| 类型 | 说明 | 示例 |
|------|------|------|
| 🔴 必须修改 | 严重问题，必须修复 | 逻辑错误、安全漏洞 |
| 🟡 建议修改 | 建议改进，但不是必须 | 代码风格、命名优化 |
| 🟢 肯定赞扬 | 写得好的地方 | 巧妙的实现、清晰的注释 |
| ❓ 疑问 | 不理解的地方 | 为什么这样设计？ |

### 3.3.4 审查意见的写法

**好的审查意见：**
```
建议：这里可以使用数组的 map 方法替代 for 循环，代码会更简洁。

示例：
const names = users.map(user => user.name);
```

**不好的审查意见：**
```
这段代码写得不好，重写。
```

**审查意见原则：**
- ✅ 对事不对人，针对代码不针对人
- ✅ 给出具体建议，而不是只说不好
- ✅ 解释为什么需要改
- ✅ 提供更好的写法示例
- ✅ 用礼貌的语气

---

## 3.4 处理审查反馈

### 3.4.1 接收反馈的正确心态

- 🧘 **保持开放**：把审查当作学习机会
- 🔍 **理解意图**：审查者是在帮助提升代码质量
- 💬 **积极沟通**：有不同意见可以讨论
- ✅ **及时响应**：不要让 PR 等待太久

### 3.4.2 修改并更新 PR

```bash
# 切换到功能分支
git checkout feature/your-feature

# 根据审查意见修改代码
# ... 修改 ...

# 提交修改
git add .
git commit -m "Address review comments"

# 推送到远程，PR 会自动更新
git push
```

### 3.4.3 回复审查意见

- ✅ 每条意见都回复（已修改、不同意+理由）
- ✅ 修改后可以重新请求审查
- ✅ 有争议的地方可以在评论中讨论
- ✅ 达成共识后再合并

---

## 3.5 PR 合并

### 3.5.1 合并前检查清单

- [ ] 所有审查者都已批准
- [ ] CI/CD 流水线全部通过
- [ ] 没有冲突（或已解决冲突）
- [ ] 文档已更新（如需要）
- [ ] 测试覆盖率达标
- [ ] 产品经理/设计师确认（如需要）

### 3.5.2 三种合并方式

| 合并方式 | 说明 | 适用场景 |
|----------|------|----------|
| **Create a merge commit** | 创建合并提交，保留完整历史 | 需要保留完整提交历史 |
| **Squash and merge** | 压缩所有提交为一个 | 保持 main 历史整洁 |
| **Rebase and merge** | 变基后合并，线性历史 | 喜欢线性历史的团队 |

**1. Merge Commit（合并提交）**
```
main:   A --- B --- M
               \   /
feature:        C - D
```
- 优点：保留所有提交历史，可追溯
- 缺点：历史记录可能比较乱

**2. Squash and Merge（压缩合并）**
```
main:   A --- B --- S
                    
feature:        C - D
```
- 优点：main 分支历史简洁，每个 PR 对应一个提交
- 缺点：丢失了开发过程中的详细提交

**3. Rebase and Merge（变基合并）**
```
main:   A --- B --- C' --- D'
```
- 优点：完全线性的历史，非常清晰
- 缺点：修改了提交哈希，可能有冲突

### 3.5.3 合并后的操作

**1. 删除特性分支**
```bash
# 删除本地分支
git branch -d feature/your-feature

# 删除远程分支（GitHub 合并后通常会自动提示删除）
git push origin --delete feature/your-feature
```

**2. 更新本地 main**
```bash
git checkout main
git pull origin main
```

**3. 部署（如果需要）**
- 触发部署流水线
- 监控生产环境
- 验证功能正常

---

## 3.6 PR 最佳实践

### 3.6.1 提交 PR 的最佳实践

- ✅ **小而频繁**：PR 越小越好，审查更容易
- ✅ **单一职责**：一个 PR 只做一件事
- ✅ **完整可运行**：每个 PR 都应该是可运行的
- ✅ **写好描述**：让审查者快速理解变更
- ✅ **自测代码**：提交前自己先测试
- ✅ **及时响应**：审查反馈要及时处理

### 3.6.2 审查 PR 的最佳实践

- ✅ **及时审查**：PR 不要等待超过 24 小时
- ✅ **关注重点**：重点审查逻辑和架构，不是格式
- ✅ **正面反馈**：好的地方也要表扬
- ✅ **尊重作者**：对事不对人，礼貌沟通
- ✅ **给出建议**：不仅说不好，还要说怎么改
- ✅ **理解上下文**：先理解需求再审查

### 3.6.3 团队协作最佳实践

- ✅ 设定 PR 响应时间 SLA
- ✅ 每个 PR 至少 1-2 个审查者
- ✅ 建立 PR 模板和审查清单
- ✅ 定期回顾 PR 质量和效率
- ✅ 鼓励知识共享和互相学习

---

## 3.7 常见问题处理

### 3.7.1 合并冲突

**什么是合并冲突？**
当两个分支修改了同一文件的同一行时，Git 无法自动合并，就会产生冲突。

**解决冲突的步骤：**
```bash
# 1. 切换到你的分支
git checkout feature/your-feature

# 2. 合并目标分支
git merge main

# 3. 打开冲突文件，查找冲突标记
# <<<<<<< HEAD  你的代码
# =======
# >>>>>>> main  目标分支的代码

# 4. 手动解决冲突，保留正确的代码

# 5. 标记为已解决
git add conflict-file.txt

# 6. 完成合并
git commit

# 7. 推送更新
git push
```

### 3.7.2 PR 卡住了怎么办？

**常见原因和解决方法：**

| 问题 | 解决方法 |
|------|----------|
| 没人审查 | 在群里 @ 相关人，或主动找人审查 |
| 意见不一致 | 拉会议讨论，找技术负责人决策 |
| CI 一直失败 | 优先修复 CI 问题，确保绿色 |
| PR 太大没人敢审 | 拆分成多个小 PR |
| 需求变了 | 关闭 PR，重新规划 |

### 3.7.3 PR 太大怎么办？

**拆分 PR 的技巧：**

1. **按功能模块拆分**：每个模块一个 PR
2. **按层次拆分**：先底层，再上层
3. **重构和功能分离**：先重构，再加新功能
4. **使用堆叠 PR**：基于前一个 PR 继续开发

---

## 3.8 实战练习

### 练习：完整的 PR 流程

```bash
# 1. 创建功能分支
git checkout -b feature/add-login-page main

# 2. 开发功能
# ... 修改代码 ...
git add .
git commit -m "Add login page UI"

# ... 继续开发 ...
git add .
git commit -m "Add login API integration"

# 3. 推送并创建 PR
git push -u origin feature/add-login-page

# 4. 在 GitHub 上创建 PR
#    - 填写 PR 描述
#    - 添加审查者
#    - 关联 Issue

# 5. 等待审查，根据反馈修改
# ... 修改代码 ...
git add .
git commit -m "Fix review comments"
git push

# 6. 审查通过后合并 PR
#    - 在 GitHub 上点击合并
#    - 选择合并方式

# 7. 清理
git checkout main
git pull origin main
git branch -d feature/add-login-page
```

---

## 📚 延伸阅读

- [GitHub PR 官方文档](https://docs.github.com/en/pull-requests)
- [Google 工程实践：代码审查指南](https://google.github.io/eng-practices/review/)
- [如何做 Code Review](https://zhuanlan.zhihu.com/p/100170145)

---

**← [上一章：分支管理策略](02-branch-management.md) | [下一章：Code Review 最佳实践](04-code-review-best-practices.md) →**
