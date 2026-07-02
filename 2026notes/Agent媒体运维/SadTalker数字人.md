### 💻 一、系统要求

在开始前，请确保你的 Manjaro 虚拟机满足以下推荐配置：

| 组件 | 推荐配置 |
| :--- | :--- |
| **操作系统** | Ubuntu 20.04 / Windows 10+ (Linux 系均可) |
| **Python 版本** | 3.8 - 3.10 |
| **显卡 (GPU)** | **强烈建议**使用 NVIDIA 显卡，并安装 **CUDA 11.3+** |
| **显存 (VRAM)** | 建议 **4GB 以上**，推荐 **8GB+** 以获得更好效果 |
| **系统内存 (RAM)** | 建议 8GB 或以上 |
| **存储空间** | 至少 10GB（用于存放代码、依赖和模型文件） |
| **核心依赖** | PyTorch 1.12+, FFmpeg, OpenCV |

> **注意**：如果在虚拟机中没有配置显卡直通（Passthrough），SadTalker 将只能使用 CPU 运行，生成速度会**非常慢**。

### 🛠️ 二、安装步骤

#### 1. 安装基础依赖
打开终端，安装 Git 和 FFmpeg：
```bash
sudo pacman -S git ffmpeg
```

#### 2. 克隆 SadTalker 仓库
```bash
git clone https://github.com/OpenTalker/SadTalker.git
cd SadTalker
```

#### 3. 创建并激活 Python 虚拟环境
这里推荐使用 `conda` 来管理环境。
```bash
# 创建名为 sadtalker 的 Python 3.8 环境
conda create -n sadtalker python=3.8
# 激活该环境
conda activate sadtalker
```

> **如果你更喜欢用 `uv`**：可以使用 `uv venv --python 3.8` 创建虚拟环境，然后通过 `source .venv/bin/activate` 激活。后续的 `pip install` 命令同样适用。

#### 4. 安装核心依赖 (PyTorch)
根据你的硬件情况，选择对应的命令安装 PyTorch。

*   **方案一：GPU 版 (有 NVIDIA 显卡并已配置 CUDA)**
    ```bash
    pip install torch==1.12.1+cu113 torchvision==0.13.1+cu113 torchaudio==0.12.1 --extra-index-url https://download.pytorch.org/whl/cu113
    ```

*   **方案二：CPU 版 (无独立显卡)**
    ```bash
    pip install torch==1.12.1+cpu torchvision==0.13.1+cpu torchaudio==0.12.1 --extra-index-url https://download.pytorch.org/whl/cpu
    ```

#### 5. 安装其他项目依赖
```bash
# 通过 conda 安装 FFmpeg (确保视频处理能力)
conda install ffmpeg
# 通过 pip 安装 requirements.txt 中的所有依赖
pip install -r requirements.txt
```

#### 6. 下载预训练模型
这是最关键的一步，模型文件较大（~3.3GB），请耐心等待。如果网络不佳，可能需要配置代理或使用其他下载方式。
```bash
bash scripts/download_models.sh
```
如果脚本下载失败，也可以从官方提供的多个源（如 GitHub Releases、Google Drive、百度网盘，密码：`sadt`）手动下载模型文件。
*   主要模型放在 `./checkpoints/` 目录下。
*   GFPGAN 模型放在 `./gfpgan/weights/` 目录下。

### 🚀 三、基本使用方法

SadTalker 提供了两种主要的使用方式：

#### 1. Web UI 界面 (推荐新手)
运行以下命令启动一个本地网页服务：
```bash
python webui.py
```
待终端显示 `Running on local URL: http://127.0.0.1:7860` 后，在浏览器中打开该地址，即可通过图形界面上传图片和音频，生成视频。

#### 2. 命令行模式 (CLI)
通过 `inference.py` 脚本直接运行，适合批量处理或集成到其他程序。
```bash
python inference.py --driven_audio <音频文件.wav> --source_image <图片文件.png> --enhancer gfpgan
```
*   `--driven_audio`: 驱动音频的路径（WAV 格式）。
*   `--source_image`: 源图片的路径（建议使用清晰、正面的人脸图片）。
*   `--enhancer gfpgan`: 开启面部增强，提升视频清晰度。

### ⚙️ 四、高级参数调优

SadTalker 提供了丰富的参数来控制生成效果，你可以根据需要添加：

*   `--expression_scale <数值>`: 控制表情强度，默认 1.0，范围 0.1 - 2.0。
*   `--still`: 保持头部姿势相对静止，减少晃动。
*   `--preprocess full`: 处理完整图像（非仅裁剪面部）。
*   `--size 256`: 指定生成视频的尺寸，默认为 256。
*   `--ref_eyeblink <视频路径>`: 引用一个参考视频来控制眨眼动作。

### ❓ 五、常见问题与解决方法

| 问题 | 可能原因 | 解决方案 |
| :--- | :--- | :--- |
| **`ffmpeg` 未找到** | FFmpeg 未安装或未加入 PATH | 安装 FFmpeg: `sudo pacman -S ffmpeg`，并确保其在 PATH 中。 |
| **`CUDA out of memory`** | 显存不足 | 使用 `--size 256` 降低分辨率；处理较短的音频；关闭其他占用显存的程序。 |
| **`No module named 'X'`** | 缺少 Python 依赖包 | 重新安装依赖: `pip install -r requirements.txt`。 |
| **无法检测到人脸** | 图片中无人脸、多张人脸或人脸不清晰 | 使用更清晰的正面照片；裁剪图片只保留目标人脸；尝试 `--preprocess full` 参数。 |
| **模型下载失败** | 网络问题 | 使用代理；或从 GitHub Releases、Google Drive、百度网盘（密码: `sadt`）手动下载模型并放入对应目录。 |

> 更详细的故障排除指南，可以查阅 SadTalker 的官方文档或社区 FAQ。

### 🔗 六、参考资源

*   **官方 GitHub 仓库**：[https://github.com/OpenTalker/SadTalker](https://github.com/OpenTalker/SadTalker)
*   **社区教程 (B站)**：[https://www.bilibili.com/video/BV1Dc411W7V6/](https://www.bilibili.com/video/BV1Dc411W7V6/)

