---
title: "Azure TTS 配置指南 — AstrBot 语音合成"
tags:
  - azure
  - tts
  - astrbot
  - 语音合成
  - 教程
description: "1. 登录 Azure 门户 → 搜索「语音服务」或「Speech Services」"
---


# Azure TTS 配置指南 — AstrBot 语音合成

## 第一部分：注册 Azure 并创建语音服务资源

### 1. 注册 Azure 账户

- 访问 [Azure 免费账户页面](https://azure.microsoft.com/en-us/free/cognitive-services/)
- 已有账户则直接登录 [Azure 门户](https://portal.azure.com/)
- 新用户注册通常获得 $200 免费信用金

### 2. 创建语音服务资源

1. 登录 Azure 门户 → 搜索「语音服务」或「Speech Services」
2. 点击「创建」
3. 填写关键信息：
   - **订阅**：选择你的 Azure 订阅
   - **资源组**：新建，如 `AstrBot-RG`
   - **区域**：选择近的区域，如 `China East 2` 或 `East Asia`
   - **名称**：如 `AstrBot-TTS`
   - **定价层**：⚠️ 务必选择 **F0（免费层）**，每月 50 万字符免费
4. 「审阅并创建」→「创建」

### 3. 获取密钥和区域

1. 资源创建成功 →「转到资源」
2. 左侧菜单 →「密钥和终结点」(Keys and Endpoint)
3. 记录两个值：
   - **KEY 1**（如 `xxxxxxxxxxxxxxxx`）
   - **Region**（如 `chinanorth2` 或 `eastasia`）

---

## 第二部分：在 AstrBot 中配置

1. WebUI →「配置」→「服务提供商」(Provider)
2. 「新增提供商」→ 选择 **Azure TTS**
3. 填入：
   - `api_key`：粘贴 KEY 1
   - `region`：粘贴区域
   - `voice_name`（可选）：如 `zh-CN-XiaoxiaoNeural`
4. 保存
5. （可选）「配置」→「普通配置」→「语音合成模型 (TTS)」设为默认

---

## 第三部分：测试与使用

- 微信/QQ 中发「朗读一下」或「用语音回复」
- 或用 AstrBot 命令行 TTS 命令

### 故障排查

| 问题 | 检查项 |
|------|--------|
| 合成失败 | 免费额度是否用尽 |
| 鉴权失败 | API 密钥和区域是否无误，无多余空格 |
| 语音不自然 | 换语音名，如 `zh-CN-YunxiNeural`（中文男声）|

---

## 常用中文语音名

| 语音名 | 性别 | 风格 |
|--------|------|------|
| `zh-CN-XiaoxiaoNeural` | 女 | 活泼 |
| `zh-CN-YunxiNeural` | 男 | 标准 |
| `zh-CN-YunjianNeural` | 男 | 自然 |
| `zh-CN-XiaoyiNeural` | 女 | 标准 |
| `zh-CN-YunxiaNeural` | 男 | 沉稳 |
| `zh-CN-XiaochenNeural` | 女 | 温柔 |