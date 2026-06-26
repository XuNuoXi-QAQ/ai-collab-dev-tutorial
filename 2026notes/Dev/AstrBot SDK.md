---
title: "AstrBot SDK"
tags:
  - AI
  - 开发
  - 技术
  - AstrBot
  - Git
description: "这是一份AstrBot SDK的系统性开发教程，会从基础概念开始，一步步带你完成第一个插件的开发。"
created: 2026-06-23
---

这是一份AstrBot SDK的系统性开发教程，会从基础概念开始，一步步带你完成第一个插件的开发。

### 📖 什么是AstrBot SDK？

AstrBot SDK是一套专为[AstrBot](https://github.com/AstrBotDevs/AstrBot)设计的开发工具包。AstrBot是一个开源、一站式的智能对话机器人框架，它能将各种大语言模型（LLM）的能力接入到QQ、微信、飞书、Discord等多个主流消息平台。

而AstrBot SDK的目标，就是**让开发者能以极低的门槛，为这个强大的框架开发功能插件或接入新的消息平台**。

### 🧠 核心概念

在开始编码前，先了解几个核心概念会很有帮助：

*   **插件 (Plugin)**：为AstrBot添加特定功能的代码包，是本教程的开发目标。
*   **`Star` 基类**：所有插件都必须继承的基类，它提供了插件生命周期管理等基础功能。
*   **`Context` (上下文)**：插件与AstrBot核心交互的“桥梁”，通过它可以调用各种核心API，如调用大模型、操作数据库等。
*   **`AstrMessageEvent` (消息事件)**：当有消息触发你的插件时，你会收到这个事件对象，它包含了消息的所有信息，如发送者、内容等。
*   **`MessageChain` (消息链)**：用于构建和发送富媒体消息（如同时包含文字和图片）的工具。
*   **`filter` (过滤器/装饰器)**：通过装饰器（如 `@filter.command`）来声明函数是响应特定指令的处理器。
*   **`astr` CLI**：SDK提供的命令行工具，用于快速创建、验证、开发和打包插件。

### 🛠️ 环境准备

1.  **基础知识**：
    *   具备一定的 **Python 编程经验**。
    *   了解 **Git** 和 **GitHub** 的基本使用。
2.  **安装AstrBot**：
    *   可以参考AstrBot的官方文档进行安装。一种常见的方式是通过`pip`安装：
        ```bash
        pip install astrbot
        ```
    *   也可以从源码安装：
        ```bash
        git clone https://github.com/AstrBotDevs/AstrBot
        cd AstrBot
        pip install -e .
        ```
    *   对于桌面端用户，也可以直接下载 [AstrBot-desktop](https://github.com/AstrBotDevs/AstrBot-desktop) 版本。

### 🚀 开发你的第一个插件

我们将一步步创建一个“Hello World”插件。

#### 步骤 1：获取插件模板

1.  打开AstrBot的官方插件模板仓库：[helloworld](https://github.com/Soulter/helloworld)。
2.  点击绿色的 **`Use this template`** 按钮，然后选择 **`Create a new repository`**。
3.  在 **`Repository name`** 处填写你的插件名。**命名规则**如下：
    *   推荐以 `astrbot_plugin_` 开头。
    *   不能包含空格。
    *   全部使用小写字母。
    *   尽量简短。
4.  点击 **`Create repository`** 创建你的插件仓库。

#### 步骤 2：克隆项目到本地

1.  克隆AstrBot本体和你的插件仓库到本地：
    ```bash
    git clone https://github.com/AstrBotDevs/AstrBot
    mkdir -p AstrBot/data/plugins
    cd AstrBot/data/plugins
    git clone <你的插件仓库地址>
    ```

#### 步骤 3：了解插件结构

打开你的插件目录，你会看到以下关键文件：

*   **`main.py`**：插件的核心代码文件，所有的逻辑都写在这里。
*   **`metadata.yaml`**：插件的元数据文件，包含名称、作者、版本等信息，**必须修改**。
*   **`logo.png` (可选)**：插件的Logo图片，推荐尺寸为256x256。

#### 步骤 4：编写插件代码 (`main.py`)

打开 `main.py`，你会看到一个最基础的插件实现。我们来逐行解读它：

```python
# 导入必要的模块
from astrbot.api.event import filter, AstrMessageEvent
from astrbot.api.star import Context, Star
from astrbot.api import logger

# 1. 定义插件类，必须继承 Star 基类
class MyPlugin(Star):
    # 2. 初始化方法，接收 Context 对象
    def __init__(self, context: Context):
        super().__init__(context)

    # 3. 使用 filter.command 装饰器注册一个指令
    @filter.command("helloworld")
    async def helloworld(self, event: AstrMessageEvent):
        '''这是一个 hello world 指令'''  # 插件描述，建议填写
        user_name = event.get_sender_name()
        logger.info("触发hello world指令!")
        # 4. 使用 event.plain_result 回复一条纯文本消息
        yield event.plain_result(f"Hello, {user_name}!")

    # 5. (可选) 插件卸载时的清理工作
    async def terminate(self):
        pass
```

**代码解释**：
*   **`class MyPlugin(Star)`**：所有插件都必须继承`Star`类。
*   **`def __init__(self, context: Context)`**：构造函数接收`Context`对象，通过`self.context`可以访问AstrBot的核心功能。
*   **`@filter.command("helloworld")`**：这是一个**装饰器**，它将`helloworld`函数注册为一个指令处理器。当用户发送`/helloworld`时，这个函数就会被调用。
*   **`async def helloworld(self, event: AstrMessageEvent)`**：处理函数必须是异步的（`async`），并接收`AstrMessageEvent`对象。
*   **`yield event.plain_result(...)`**：这是**被动回复**消息的方式。`yield`关键字用于返回一个或多个回复内容。

#### 步骤 5：配置元数据 (`metadata.yaml`)

这个文件非常重要，AstrBot通过它来识别你的插件。请务必修改其中的字段：

```yaml
# 插件名称 (必须，与文件夹名一致)
name: astrbot_plugin_helloworld
# 插件展示名称 (在插件市场中显示)
display_name: Hello World 插件
# 插件作者
author: 你的名字
# 插件版本
version: 1.0.0
# 插件简短描述
short_desc: 一个简单的Hello World示例插件。
# 插件详细描述
desc: 这个插件展示了如何创建一个基础的AstrBot插件。
# 插件仓库地址
repo: https://github.com/你的用户名/astrbot_plugin_helloworld
```

#### 步骤 6：调试插件

1.  在项目根目录下启动AstrBot。
2.  在AstrBot的WebUI（通常地址为 `http://localhost:6185`）中，进入 **插件管理** 页面。
3.  找到你的插件，点击 **管理**，然后点击 **重载插件** 即可应用代码更改。

### 🎨 核心API深入

#### 1. 消息的发送与接收

*   **获取消息内容**：
    *   `event.message_str`：获取消息的纯文本内容。
    *   `event.get_sender_name()`：获取发送者的昵称。
    *   `event.get_sender_id()`：获取发送者的唯一ID。
*   **被动回复**：使用 `yield event.xxx_result()`。
    *   `event.plain_result(text)`：回复纯文本。
    *   `event.image_result(path_or_url)`：回复图片。
*   **主动推送**：存储 `event.unified_msg_origin`，之后通过 `self.context.send_message()` 发送。
    ```python
    umo = event.unified_msg_origin
    await self.context.send_message(umo, MessageChain().message("Hello!"))
    ```
*   **富媒体消息（消息链）**：使用 `MessageChain` 构建复杂消息。
    ```python
    import astrbot.api.message_components as Comp

    chain = [
        Comp.At(qq=event.get_sender_id()),  # @某人
        Comp.Plain(" 你好，这是一张图片："), # 文本
        Comp.Image.fromURL("https://example.com/image.jpg") # 图片
    ]
    yield event.chain_result(chain)
    ```

#### 2. 插件配置与数据存储

*   **插件配置**：在 `metadata.yaml` 中定义 `config` 字段，用户可在WebUI中配置。
*   **数据存储**：通过 `self.context` 获取数据库实例，进行数据持久化。

#### 3. 调用大语言模型 (LLM)

```python
# 在插件类的某个方法中
response = await self.context.llm_generate(
    prompt="你好，请介绍一下你自己。",
    session_id="unique_session_id" # 用于维持多轮对话
)
```

### 🚀 高级主题：开发平台适配器

除了功能插件，你还可以使用SDK开发**平台适配器**，让AstrBot接入新平台（如飞书、钉钉等）。

1.  **创建适配器类**：继承 `Platform` 基类，并使用 `@register_platform_adapter` 装饰器注册。
2.  **实现核心方法**：
    *   `run()`：适配器的主循环，用于监听和接收消息。
    *   `send_by_session()`：实现发送消息的逻辑。
    *   `meta()`：返回适配器的元数据。
    *   `convert_message()`：将平台原生消息转换为AstrBot的`AstrBotMessage`对象。

### 🧪 测试与调试

*   **`astr validate`**：在打包前验证插件的元数据和代码是否正确。
*   **`PluginHarness`**：SDK提供的测试工具，可以在不启动完整AstrBot的情况下，模拟消息事件来测试插件。
    *   使用 `dispatch_text` 模拟发送消息。
    *   提供 `MockLLMClient` 等模拟对象，用于隔离测试。

### 📦 打包与发布

1.  **打包插件**：在插件目录下运行 `astr build`，会生成一个 `.zip` 文件。
2.  **发布插件**：你可以将这个 `.zip` 文件分享给其他人，或者提交到AstrBot的官方插件市场。

### 💎 最佳实践

1.  **完善元数据**：填写完整的 `metadata.yaml`，这有助于用户在插件市场发现你的插件。
2.  **管理依赖**：如果插件需要第三方库，务必在插件根目录创建 `requirements.txt` 文件。
3.  **提供技能 (Skills)**：插件可以在 `skills/` 目录下提供AstrBot的技能文件，增强其能力。
4.  **声明支持的平台**：在 `metadata.yaml` 中使用 `support_platforms` 字段声明插件支持的平台。
5.  **使用日志**：使用 `from astrbot.api import logger` 获取日志对象，方便调试。

### 🔗 资源汇总

*   **官方文档**：[docs.astrbot.app](https://docs.astrbot.app) (最权威的信息来源)
*   **插件模板**：[github.com/Soulter/helloworld](https://github.com/Soulter/helloworld)
*   **开发者社区**：加入QQ群 `975206796` 与其他开发者交流。
*   **DeepWiki (SDK深入分析)**：[deepwiki.com/united-pooh/astrbot-sdk](https://deepwiki.com/united-pooh/astrbot-sdk)
