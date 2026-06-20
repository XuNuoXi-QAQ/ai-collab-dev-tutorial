<div align="center">

# AI 协同开发教程

**一个关于如何使用 GitHub 进行 AI 协同开发的完整教学项目**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![GitHub stars](https://img.shields.io/github/stars/XuNuoXi-QAQ/ai-collab-dev-tutorial?style=social)](https://github.com/XuNuoXi-QAQ/ai-collab-dev-tutorial/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/XuNuoXi-QAQ/ai-collab-dev-tutorial?style=social)](https://github.com/XuNuoXi-QAQ/ai-collab-dev-tutorial/network/members)
[![GitHub issues](https://img.shields.io/github/issues/XuNuoXi-QAQ/ai-collab-dev-tutorial)](https://github.com/XuNuoXi-QAQ/ai-collab-dev-tutorial/issues)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)

</div>

---

## 📖 项目简介

本项目旨在帮助开发者团队掌握使用 GitHub 进行 AI 项目协同开发的完整流程。从 Git 基础操作到高级分支管理，从 Pull Request 工作流到 Code Review 最佳实践，为你构建一套完整的协同开发知识体系。

### ✨ 核心特色

- **🎯 体系化教学**：从入门到进阶，循序渐进的知识结构
- **🔧 实战导向**：丰富的示例代码和配置模板，拿来即用
- **🤖 AI 协同**：专门针对 AI 项目的协作模式与最佳实践
- **📚 内容丰富**：涵盖多账户管理、冲突解决、CI/CD 等核心主题
- **💡 即学即用**：提供完整的命令速查表和操作指南

---

## 📑 目录

- [核心文档](#-核心文档)
- [项目结构](#-项目结构)
- [快速开始](#-快速开始)
- [文档导航](#-文档导航)
- [示例代码](#-示例代码)
- [参与贡献](#-参与贡献)
- [许可证](#-许可证)

---

## 📚 核心文档

> **推荐从这里开始**

### 🌟 [Git 完整知识体系精讲](docs/git-complete-guide.md)

本项目的核心教学文档，基于实战经验整理的完整 Git 知识框架，涵盖：

- **SSH 认证与多账户管理**：三个账户分工、SSH 密钥配置、Host 别名机制
- **远程协作模型**：Fork vs Clone、两种协作模式详解
- **分支管理策略**：五种核心分支类型、独立开发者简化工作流
- **冲突理解与解决**：冲突本质、三步解决法、预防最佳实践
- **合并策略对比**：Merge vs Rebase vs Squash，选择指南
- **分支历史维护**：混乱原因、修复方法、交互式变基
- **CI/CD 概念**：与 Git 工作流的结合方式

---

## 📂 项目结构

```
ai-collab-dev-tutorial/
├── README.md                    # 项目说明文档
├── CONTRIBUTING.md              # 贡献指南
├── LICENSE                      # MIT 许可证
├── .gitignore                   # Git 忽略规则
│
├── docs/                        # 📚 教学文档目录
│   ├── git-complete-guide.md    # ⭐ 核心：Git 完整知识体系精讲
│   ├── 00-complete-learning-record.md  # 完整学习记录归档
│   ├── 01-git-github-basics.md  # Git 与 GitHub 基础入门
│   ├── 02-branch-management.md  # 分支管理策略
│   ├── 03-pull-request-workflow.md  # Pull Request 工作流程
│   ├── 04-code-review-best-practices.md  # Code Review 最佳实践
│   ├── 05-ai-dev-tools.md       # AI 辅助开发工具介绍
│   └── 06-team-collaboration-norms.md  # 团队协作规范
│
├── examples/                    # 💡 示例代码目录
│   ├── git-commands.sh          # Git 常用命令速查手册
│   ├── pr-template.md           # Pull Request 模板
│   ├── ssh-config-example       # SSH 配置示例
│   ├── gitconfig-example        # Git 配置示例
│   └── workflows/               # GitHub Actions 示例
│       └── ci.yml               # CI/CD 工作流示例
│
└── .github/                     # GitHub 配置目录
    └── workflows/               # GitHub Actions 工作流
```

---

## 🚀 快速开始

### 前置条件

- ✅ 安装 Git（版本 2.20+）
- ✅ 拥有 GitHub 账号
- ✅ 基本的命令行操作能力

### 三步开始学习

**1. 克隆本项目**

```bash
git clone https://github.com/XuNuoXi-QAQ/ai-collab-dev-tutorial.git
cd ai-collab-dev-tutorial
```

**2. 阅读核心文档**

从 [Git 完整知识体系精讲](docs/git-complete-guide.md) 开始，建立完整的知识框架。

**3. 动手实践**

参考 `examples/` 目录中的示例配置，在自己的项目中实践所学知识。

### 学习路径建议

| 人群 | 推荐路径 |
|------|----------|
| **初学者** | 按文档编号顺序学习，从基础到进阶 |
| **有经验者** | 直接阅读核心文档，跳转到感兴趣的主题 |
| **团队管理者** | 重点阅读分支管理、Code Review 和团队协作规范 |
| **DevOps 工程师** | 关注 CI/CD 示例和工作流配置 |

---

## 📖 文档导航

### 核心文档

| 文档 | 主题 | 难度 | 推荐指数 |
|------|------|------|----------|
| [Git 完整知识体系精讲](docs/git-complete-guide.md) | 完整 Git 知识框架、多账户管理、协作工作流 | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| [完整学习记录](docs/00-complete-learning-record.md) | 全天学习记录、系统运维、跨端框架等 | ⭐⭐ | ⭐⭐⭐ |

### 分章节教学

| 章节 | 主题 | 适合人群 |
|------|------|----------|
| [01 - Git 与 GitHub 基础](docs/01-git-github-basics.md) | 版本控制入门、基本命令、多账户管理 | 初学者 |
| [02 - 分支管理策略](docs/02-branch-management.md) | Git Flow、GitHub Flow、分支命名规范 | 初中级开发者 |
| [03 - Pull Request 工作流程](docs/03-pull-request-workflow.md) | PR 创建、审查、合并的完整流程 | 所有开发者 |
| [04 - Code Review 最佳实践](docs/04-code-review-best-practices.md) | 高效代码审查的方法与技巧 | 中高级开发者 |
| [05 - AI 辅助开发工具](docs/05-ai-dev-tools.md) | 提升开发效率的 AI 工具推荐 | 所有开发者 |
| [06 - 团队协作规范](docs/06-team-collaboration-norms.md) | 团队协作的标准化流程与规范 | 团队负责人 |

---

## 💡 示例代码

`examples/` 目录包含了丰富的实用示例，可直接应用到你的项目中：

| 示例文件 | 说明 |
|----------|------|
| [git-commands.sh](examples/git-commands.sh) | Git 常用命令速查手册 |
| [pr-template.md](examples/pr-template.md) | Pull Request 模板，可直接用于 GitHub |
| [ssh-config-example](examples/ssh-config-example) | SSH 多账户配置示例 |
| [gitconfig-example](examples/gitconfig-example) | Git 全局配置示例 |
| [workflows/ci.yml](examples/workflows/ci.yml) | GitHub Actions CI/CD 工作流示例 |

---

## 🤝 参与贡献

我们欢迎所有形式的贡献！无论是提交 Bug、提出建议还是直接贡献代码，都非常感谢你的支持。

### 贡献方式

1. **Fork** 本仓库
2. 创建你的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交你的更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启一个 **Pull Request**

### 贡献指南

详细的贡献流程和规范请阅读 [CONTRIBUTING.md](CONTRIBUTING.md)。

---

## 📄 许可证

本项目采用 **MIT License** 许可证 - 详见 [LICENSE](LICENSE) 文件。

---

## 📧 联系方式

如有问题或建议，欢迎通过以下方式联系我们：

- 💬 提交 [Issue](https://github.com/XuNuoXi-QAQ/ai-collab-dev-tutorial/issues)
- 🔀 发起 [Pull Request](https://github.com/XuNuoXi-QAQ/ai-collab-dev-tutorial/pulls)

---

<div align="center">

**开始你的 AI 协同开发之旅吧！** 🎉

*如果这个项目对你有帮助，别忘了给个 ⭐ Star 支持一下哦~*

</div>
