`edge-tts` 是一个**免费、开源的 Python 库**，它让你可以直接调用微软 Edge 浏览器背后强大的在线语音合成（TTS）服务。

它像一个“桥梁”，让开发者可以在自己的代码中，轻松使用微软 Azure 的高质量神经网络语音，而无需支付昂贵的 API 费用。

### 🚀 核心特性
*   **🎤 海量高质量语音**：提供超过 **200 种** 神经网络语音，支持 **60 余种** 语言和方言。声音自然流畅，接近真人发音。
*   **💰 完全免费开源**：作为开源项目，可以免费使用。项目代码开源，透明度高，社区活跃。
*   **🎛️ 灵活的参数控制**：支持调节**语速** (`--rate`)、**音量** (`--volume`) 和**音调** (`--pitch`)。
*   **🖥️ 多形式使用**：支持 Python 库调用、命令行工具 (CLI) 以及 Go 语言版本。
*   **📝 字幕生成**：在生成语音的同时，可以同步生成 `.srt` 格式的字幕文件，方便视频制作。

### ⚙️ 工作原理：站在巨人的肩膀上
`edge-tts` 的本质是**调用微软 Azure 的神经网络语音合成服务**。

它通过封装好的 Python 代码，模拟 Edge 浏览器向微软的云端服务器发送合成请求。服务器使用先进的深度学习模型处理后，返回高质量的音频流数据。`edge-tts` 再将数据接收并保存为 `.mp3` 等音频文件。

### 💻 安装与使用
#### 1. 安装
最便捷的方式是通过 `pip` 安装：
```bash
pip install edge-tts
```
如果只想使用命令行工具，推荐用 `pipx` 安装，可以避免依赖冲突：
```bash
pipx install edge-tts
```

#### 2. 命令行 (CLI) 快速上手
安装后，即可在终端使用 `edge-tts` 命令。

*   **基础语音合成**：将文本转为 `output.mp3` 并生成字幕 `output.srt`。
    ```bash
    edge-tts --text "你好，世界！" --write-media output.mp3 --write-subtitles output.srt
    ```

*   **更换发音人**：使用 `--voice` 参数指定，用 `--list-voices` 可查看所有可用声音。
    ```bash
    # 查看所有中文语音
    edge-tts --list-voices | grep "zh-CN"
    # 使用特定中文女声
    edge-tts --voice zh-CN-XiaoxiaoNeural --text "你好" --write-media hello.mp3
    ```

*   **调节语音参数**：使用 `--rate`, `--volume`, `--pitch` 调节。
    ```bash
    # 语速降低50%，音调升高20Hz
    edge-tts --rate=-50% --pitch=+20Hz --text "慢速高音" --write-media output.mp3
    ```
    > **注意**：当使用负值时，需用等号连接，如 `--rate=-50%`，以避免被解析为命令行选项。

*   **实时播放**：配合 `edge-playback` 命令和 `mpv` 播放器，可即时聆听合成效果。
    ```bash
    edge-playback --text "实时播放测试"
    ```

#### 3. Python 代码集成
在 Python 项目中调用 `edge-tts` 更加灵活。

*   **基础合成**：
    ```python
    import asyncio
    from edge_tts import Communicate

    async def main():
        # 创建 Communicate 对象，指定文本和发音人
        communicate = Communicate("欢迎使用 edge-tts", "zh-CN-XiaoxiaoNeural")
        # 保存音频文件
        await communicate.save("output.mp3")

    asyncio.run(main())
    
    ```

*   **高级参数控制**：除了在`Communicate`对象中直接指定 `rate`, `volume`, `pitch` 外，还可以通过 **SSML（语音合成标记语言）** 进行更精细的控制。
    ```python
    ssml = """
    <speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="zh-CN">
        <prosody rate="+20.00%" pitch="+10%">这是加速且升调的语音</prosody>
        <break time="500ms"/>
        <prosody volume="loud">这是高音量语音</prosody>
    </speak>
    """
    communicate = Communicate(ssml, "zh-CN-XiaoxiaoNeural")
    await communicate.save("ssml_output.mp3")
    
    ```

### ✨ 应用场景
*   **有声内容创作**：快速将文章、电子书转化为音频，制作播客或辅助阅读。
*   **智能语音应用**：为智能客服、语音助手、游戏NPC等提供自然的声音。
*   **视频配音与制作**：为视频生成旁白，并可同步生成字幕，提升制作效率。
*   **辅助与教育**：为语言学习工具、视障辅助软件等提供高质量的语音支持。

### ⚠️ 注意事项
*   **网络依赖**：`edge-tts` 需要联网才能工作。
*   **使用限制**：服务有频率和文本长度限制。例如，单IP每分钟请求约30次，单次文本不超过2000字符。
*   **非商业用途**：禁止将生成的语音用于**商业售卖**（如制作有声书出售）。

`edge-tts` 是一个功能强大、使用便捷且免费的工具，它降低了高质量语音合成的门槛，非常适合有文本转语音需求的开发者、创作者或技术爱好者快速上手。