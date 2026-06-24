---
title: "在终端中配置 `pi` 工具接入 SiliconFlow 的完整步骤"
tags:
  - Pi
  - SiliconFlow
  - AI-Agent
  - 配置
aliases:
  - Pi SiliconFlow 配置
created: 2026-06-23
---
核心思路是：**通过修改 `pi` 的配置文件，将 SiliconFlow 添加为一个 OpenAI 兼容的 API 提供商**。这个方法是通用的，也适用于你提到的 `deepseek-ai/DeepSeek-V4-Pro` 模型。

### 📝 完整终端配置步骤

#### **1. 安装 `pi` (如果尚未安装)**
首先，确保你的系统已安装 Node.js，然后在终端中执行：
```bash
npm install -g @mariozechner/pi-coding-agent
```
安装完成后，可以用 `pi --version` 检查是否成功。

#### **2. 获取 SiliconFlow 信息**
在开始配置前，请准备好以下信息：
*   **API Key**：登录 [SiliconFlow 控制台](https://cloud.siliconflow.com/)，在“API密钥”页面创建并复制，通常以 `sk-` 开头。
*   **模型 ID**：你指定的 `deepseek-ai/DeepSeek-V4-Pro`。
*   **Base URL**：固定为 `https://api.siliconflow.cn/v1`（末尾的 `/v1` 很重要）。

#### **3. 配置环境变量**
为了安全，建议通过环境变量传递 API Key。在你**即将运行 `pi` 的同一个终端**中执行：

*   **Linux / macOS**:
    ```bash
    export SILICONFLOW_API_KEY="你的_SILICONFLOW_API_KEY"
    ```
*   **Windows (命令提示符)**:
    ```cmd
    set SILICONFLOW_API_KEY="你的_SILICONFLOW_API_KEY"
    ```
*   **Windows (PowerShell)**:
    ```powershell
    $env:SILICONFLOW_API_KEY="你的_SILICONFLOW_API_KEY"
    ```


#### **4. 修改 `pi` 的模型配置文件**
`pi` 通过 `~/.pi/agent/models.json` 文件来管理自定义模型提供商。

1.  在终端中创建或编辑该文件：
    ```bash
    # 例如使用 vim
    vim ~/.pi/agent/models.json
    ```

2.  将以下配置内容复制进去。请确保 `apiKey` 字段引用了你刚刚设置的环境变量，`id` 字段替换为你需要的模型 ID。
    ```json
    {
      "providers": {
        "siliconflow": {
          "baseUrl": "https://api.siliconflow.cn/v1",
          "api": "openai-completions",
          "apiKey": "$SILICONFLOW_API_KEY",
          "models": [
            {
              "id": "deepseek-ai/DeepSeek-V4-Pro",
              "name": "DeepSeek V4 Pro (SiliconFlow)",
              "contextWindow": 1000000,
              "maxTokens": 384000,
              "input": ["text"],
              "reasoning": true
            }
          ]
        }
      }
    }
    ```
    *配置说明*：`api` 字段设置为 `openai-completions` 是 SiliconFlow 提供 OpenAI 兼容 API 的关键。`contextWindow` 和 `maxTokens` 参数引用了 DeepSeek V4 Pro 模型的技术规格。

#### **5. 启动 `pi` 并选择模型**
1.  在终端中输入 `pi` 并回车，进入项目目录后启动程序。
2.  进入 `pi` 的交互界面后，输入 `/model` 命令打开模型切换器。
3.  在列表中找到并选择你刚刚配置的 `siliconflow` 提供商和对应的 `DeepSeek V4 Pro (SiliconFlow)` 模型。

至此，你就可以通过 SiliconFlow 使用 DeepSeek-V4-Pro 模型来驱动 `pi` 了。