---
title: "ci"
tags:
  - 工作流
  - CI/CD
  - Git
description: "cd /var/www/your-app"
created: 2026-06-23
---

# GitHub Actions CI/CD 工作流示例
# 将此文件复制到 .github/workflows/ci.yml 中使用

name: CI/CD Pipeline

# 触发条件
on:
  # 推送到 main 分支时触发
  push:
    branches: [ main ]
  
  # 有 Pull Request 时触发
  pull_request:
    branches: [ main ]
  
  # 允许手动触发
  workflow_dispatch:

# 环境变量
env:
  NODE_VERSION: '18'
  PNPM_VERSION: '8'

# 任务
jobs:
  # ============================================
  # 任务 1：代码检查和测试
  # ============================================
  test:
    name: Lint & Test
    runs-on: ubuntu-latest
    
    strategy:
      matrix:
        node-version: [16.x, 18.x, 20.x]
    
    steps:
      # 检出代码
      - name: Checkout repository
        uses: actions/checkout@v4
      
      # 设置 Node.js 环境
      - name: Setup Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
      
      # 安装 pnpm
      - name: Setup pnpm
        uses: pnpm/action-setup@v2
        with:
          version: ${{ env.PNPM_VERSION }}
      
      # 获取 pnpm 缓存目录
      - name: Get pnpm store directory
        id: pnpm-cache
        shell: bash
        run: echo "STORE_PATH=$(pnpm store path)" >> $GITHUB_OUTPUT
      
      # 设置 pnpm 缓存
      - name: Setup pnpm cache
        uses: actions/cache@v3
        with:
          path: ${{ steps.pnpm-cache.outputs.STORE_PATH }}
          key: ${{ runner.os }}-pnpm-store-${{ hashFiles('**/pnpm-lock.yaml') }}
          restore-keys: |
            ${{ runner.os }}-pnpm-store-
      
      # 安装依赖
      - name: Install dependencies
        run: pnpm install --frozen-lockfile
      
      # 代码格式检查
      - name: Lint code
        run: pnpm lint
      
      # 类型检查（如果是 TypeScript 项目）
      - name: Type check
        run: pnpm typecheck
        continue-on-error: true
      
      # 运行测试
      - name: Run tests
        run: pnpm test -- --coverage
      
      # 上传测试覆盖率报告
      - name: Upload coverage report
        uses: actions/upload-artifact@v3
        with:
          name: coverage-report
          path: coverage/
        if: success()

  # ============================================
  # 任务 2：构建项目
  # ============================================
  build:
    name: Build
    runs-on: ubuntu-latest
    needs: test  # 依赖 test 任务完成
    
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
      
      - name: Setup pnpm
        uses: pnpm/action-setup@v2
        with:
          version: ${{ env.PNPM_VERSION }}
      
      - name: Get pnpm store directory
        id: pnpm-cache
        shell: bash
        run: echo "STORE_PATH=$(pnpm store path)" >> $GITHUB_OUTPUT
      
      - name: Setup pnpm cache
        uses: actions/cache@v3
        with:
          path: ${{ steps.pnpm-cache.outputs.STORE_PATH }}
          key: ${{ runner.os }}-pnpm-store-${{ hashFiles('**/pnpm-lock.yaml') }}
          restore-keys: |
            ${{ runner.os }}-pnpm-store-
      
      - name: Install dependencies
        run: pnpm install --frozen-lockfile
      
      - name: Build project
        run: pnpm build
      
      # 上传构建产物
      - name: Upload build artifacts
        uses: actions/upload-artifact@v3
        with:
          name: build-output
          path: dist/

  # ============================================
  # 任务 3：部署到生产环境（仅 main 分支）
  # ============================================
  deploy:
    name: Deploy to Production
    runs-on: ubuntu-latest
    needs: build  # 依赖 build 任务完成
    if: github.ref == 'refs/heads/main'  # 仅 main 分支执行
    
    environment:
      name: production
      url: https://your-app.com
    
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4
      
      # 下载构建产物
      - name: Download build artifacts
        uses: actions/download-artifact@v3
        with:
          name: build-output
          path: dist/
      
      # 部署到服务器（示例：通过 SSH）
      - name: Deploy to server
        uses: appleboy/ssh-action@v0.1.10
        with:
          host: ${{ secrets.SERVER_HOST }}
          username: ${{ secrets.SERVER_USERNAME }}
          key: ${{ secrets.SSH_PRIVATE_KEY }}
          port: ${{ secrets.SERVER_PORT }}
          script: |
            cd /var/www/your-app
            git pull
            pnpm install --frozen-lockfile
            pnpm build
            pm2 restart your-app
      
      # 发送通知（示例：飞书/钉钉/企业微信）
      - name: Send notification
        run: |
          echo "部署成功！"
          # 这里可以添加发送通知的脚本

# ============================================
# 使用说明
# ============================================

# 1. 将此文件复制到 .github/workflows/ci.yml
#
# 2. 根据你的项目实际情况修改：
#    - 包管理器（pnpm / npm / yarn）
#    - Node.js 版本
#    - 测试命令（pnpm test）
#    - 构建命令（pnpm build）
#    - 部署方式
#
# 3. 在 GitHub 仓库 Settings → Secrets and variables → Actions 中添加：
#    - SERVER_HOST：服务器地址
#    - SERVER_USERNAME：服务器用户名
#    - SSH_PRIVATE_KEY：SSH 私钥
#    - SERVER_PORT：SSH 端口（默认 22）
#
# 4. 工作流触发条件：
#    - push：推送到 main 分支时
#    - pull_request：有 PR 时
#    - workflow_dispatch：手动触发
#
# 5. 任务说明：
#    - test：代码检查和测试（多版本 Node.js）
#    - build：构建项目
#    - deploy：部署到生产环境（仅 main 分支）
#
# 6. 缓存优化：
#    - 使用 pnpm 缓存加速依赖安装
#    - 使用 actions/cache 缓存依赖
