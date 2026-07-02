---
title: "Obsidian 笔记 → 多平台视频 自动化体系"
tags:
  - Obsidian
  - 视频
  - 自动化
  - Hyperframes
aliases:
  - "视频自动化体系"
  - "Obsidian视频工作流"
description: "结合多个 AI 模型生成更高质量的脚本："
---

## 一、优化后的整体架构

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                    笔记→视频全自动流水线 v2.0（AI Agent 驱动）                       │
├─────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                     │
│  ┌──────────────┐                                                                  │
│  │ Obsidian笔记 │                                                                  │
│  │  + 元数据    │                                                                  │
│  └──────┬───────┘                                                                  │
│         │ git push                                                                  │
│         ▼                                                                           │
│  ┌──────────────────────────────────────────────────────────────────────────┐      │
│  │                      GitHub Actions 流水线                              │      │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌────────────┐      │      │
│  │  │ 1. 智能    │  │ 2. 脚本    │  │ 3. 多模态   │  │ 4. 智能    │      │      │
│  │  │ 检测      │─▶│ 生成      │─▶│ 视频渲染   │─▶│ 分发      │      │      │
│  │  │ + 去重    │  │ + 审核    │  │ + 数字人   │  │ + 排期    │      │      │
│  │  └────────────┘  └────────────┘  └────────────┘  └────────────┘      │      │
│  └──────────────────────────────────────────────────────────────────────────┘      │
│         │                                                                           │
│         ▼                                                                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │ B站/YouTube  │  │ 抖音/视频号  │  │ 小红书/快手  │  │ 微信公众号   │          │
│  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘          │
│                                                                                     │
│  ┌──────────────────────────────────────────────────────────────────────────┐      │
│  │                      监控与反馈闭环                                      │      │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌────────────┐      │      │
│  │  │ 微信通知   │  │ 数据看板   │  │ 质量回溯   │  │ 自动优化   │      │      │
│  │  └────────────┘  └────────────┘  └────────────┘  └────────────┘      │      │
│  └──────────────────────────────────────────────────────────────────────────┘      │
│                                                                                     │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 二、各环节详细设计与实现

### 2.1 智能检测与去重

**问题**：同一篇笔记可能被多次修改，导致重复生成视频。

**解决方案**：引入处理状态跟踪和智能去重机制。

#### 2.1.1 基于 Git 元数据的智能检测

```yaml
- name: 智能检测变更笔记
  id: smart-detect
  run: |
    # 获取本次 push 中新增或修改的 .md 文件
    CHANGED_FILES=$(git diff --name-only --diff-filter=AM ${{ github.event.before }} ${{ github.sha }} | grep '^notes/.*\.md$')
    
    # 检查每个文件是否已处理过（基于文件哈希）
    for file in $CHANGED_FILES; do
      HASH=$(sha256sum "$file" | cut -d' ' -f1)
      if ! grep -q "$HASH" .note-processed 2>/dev/null; then
        echo "new_file=$file" >> $GITHUB_OUTPUT
        echo "$HASH $file" >> .note-processed
      fi
    done
```

#### 2.1.2 笔记元数据管理

在你的 Obsidian 笔记中添加 Frontmatter 元数据，用于控制视频生成行为：

```yaml
---
title: "RAG 知识库分块策略"
tags: [AI, RAG, 知识库]
video:
  enabled: true          # 是否生成视频
  template: educational  # 视频模板
  platforms: [bilibili, youtube]  # 目标平台
  priority: high         # 处理优先级
  scheduled: "2026-06-25" # 定时发布
---
```

---

### 2.2 AI 脚本生成增强

#### 2.2.1 多模型协作脚本生成

结合多个 AI 模型生成更高质量的脚本：

```yaml
- name: AI 脚本生成（多模型协作）
  env:
    DEEPSEEK_API_KEY: ${{ secrets.DEEPSEEK_API_KEY }}
    QWEN_API_KEY: ${{ secrets.QWEN_API_KEY }}
  run: |
    for file in ${{ steps.smart-detect.outputs.new_file }}; do
      # 1. DeepSeek 生成初稿
      curl -X POST https://api.deepseek.com/v1/chat/completions \
        -H "Authorization: Bearer $DEEPSEEK_API_KEY" \
        -d "{\"model\":\"deepseek-v4-pro\",\"messages\":[{\"role\":\"system\",\"content\":\"你是一位视频脚本专家...\"},{\"role\":\"user\",\"content\":\"$(cat $file)\"}]}" \
        > script_draft.json
      
      # 2. 通义千问优化润色
      curl -X POST https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation \
        -H "Authorization: Bearer $QWEN_API_KEY" \
        -d "{\"model\":\"qwen-max\",\"input\":{\"messages\":[{\"role\":\"system\",\"content\":\"优化以下视频脚本，使其更生动...\"},{\"role\":\"user\",\"content\":\"$(cat script_draft.json)\"}]}}" \
        > script_final.json
      
      # 3. 生成分镜脚本
      python3 generate_storyboard.py script_final.json storyboard.json
    done
```

#### 2.2.2 脚本结构规范化

```json
{
  "video_title": "RAG 知识库分块策略",
  "description": "本视频介绍 RAG 系统中文本分块的核心策略...",
  "total_duration": 180,
  "scenes": [
    {
      "id": 1,
      "type": "intro",
      "duration": 10,
      "visual": {
        "template": "title_card",
        "background": "gradient_blue",
        "animation": "fade_in"
      },
      "audio": {
        "text": "在 RAG 系统中，分块策略直接影响检索精度。",
        "tts_voice": "zh-CN-XiaoxiaoNeural",
        "tts_rate": 1.0
      }
    },
    {
      "id": 2,
      "type": "explanation",
      "duration": 45,
      "visual": {
        "template": "slide",
        "title": "512 Token 黄金大小",
        "content": "每个文本块控制在 512 Token 左右..."
      },
      "audio": {
        "text": "研究表明，512 Token 是最佳分块大小...",
        "tts_voice": "zh-CN-XiaoxiaoNeural"
      }
    }
  ],
  "keywords": ["RAG", "分块", "512 Token"],
  "hashtags": ["#AI", "#RAG", "#知识库"]
}
```

---

### 2.3 视频渲染与数字人集成

#### 2.3.1 多引擎渲染架构

```yaml
- name: 多引擎视频渲染
  run: |
    for file in ${{ steps.smart-detect.outputs.new_file }}; do
      # 根据笔记元数据选择渲染引擎
      TEMPLATE=$(yq '.video.template' "$file")
      
      case $TEMPLATE in
        "educational")
          # 方案一：vidgen（标准教学视频）
          vidgen render ./video-project --preset educational
          ;;
        "digital_human")
          # 方案二：数字人（HeyGem + ChatTTS）
          python3 render_digital_human.py storyboard.json
          ;;
        "hyperframes")
          # 方案三：Hyperframes（HTML 演示视频）
          hyperframes generate --input storyboard.json --output video.mp4
          ;;
        *)
          # 默认使用 vidgen
          vidgen render ./video-project
          ;;
      esac
    done
```

#### 2.3.2 数字人渲染脚本（`render_digital_human.py`）

```python
#!/usr/bin/env python3
import json
import subprocess
import os

def render_digital_human(storyboard_path):
    with open(storyboard_path) as f:
        storyboard = json.load(f)
    
    # 1. 提取所有旁白文本
    all_text = " ".join([scene["audio"]["text"] for scene in storyboard["scenes"]])
    
    # 2. 使用 ChatTTS 生成语音
    subprocess.run([
        "python3", "-c",
        f"""
import ChatTTS
chat = ChatTTS.Chat()
chat.load_models()
wav = chat.infer('{all_text}')
import soundfile as sf
sf.write('audio.wav', wav, 24000)
        """
    ], check=True)
    
    # 3. 使用 HeyGem 生成数字人视频
    subprocess.run([
        "hey-gem",
        "--audio", "audio.wav",
        "--image", "avatar.png",
        "--output", "digital_human.mp4"
    ], check=True)
    
    # 4. 添加字幕和背景音乐
    subprocess.run([
        "ffmpeg", "-i", "digital_human.mp4",
        "-i", "subtitle.srt",
        "-c", "copy", "-c:s", "mov_text",
        "final_video.mp4"
    ], check=True)
    
    os.rename("final_video.mp4", "video.mp4")

if __name__ == "__main__":
    render_digital_human("storyboard.json")
```

#### 2.3.3 智能字幕生成

```yaml
- name: 自动生成字幕
  run: |
    # 使用 whisper 或 faster-whisper 生成字幕
    pip install faster-whisper
    python3 -c "
from faster_whisper import WhisperModel
model = WhisperModel('small', device='cpu')
segments, _ = model.transcribe('audio.wav')
with open('subtitle.srt', 'w') as f:
    for i, seg in enumerate(segments):
        f.write(f'{i+1}\n{format_time(seg.start)} --> {format_time(seg.end)}\n{seg.text}\n\n')
    "
```

---

### 2.4 智能分发与排期

#### 2.4.1 多平台统一发布

```yaml
- name: 智能多平台发布
  env:
    SOCIAL_ACCOUNTS_JSON: ${{ secrets.SOCIAL_ACCOUNTS_JSON }}
  run: |
    for file in ${{ steps.smart-detect.outputs.new_file }}; do
      # 从笔记 Frontmatter 读取发布配置
      PLATFORMS=$(yq '.video.platforms' "$file")
      SCHEDULED=$(yq '.video.scheduled' "$file")
      
      if [ -n "$SCHEDULED" ]; then
        # 定时发布
        echo "视频将在 $SCHEDULED 发布"
        # 使用 at 或 cron 调度
      else
        # 立即发布
        social-auto-upload \
          --platforms "$PLATFORMS" \
          --file video.mp4 \
          --title "$(cat script_final.json | jq -r '.video_title')" \
          --desc "$(cat script_final.json | jq -r '.description')" \
          --tags "$(cat script_final.json | jq -r '.hashtags | join(",")')"
      fi
    done
```

#### 2.4.2 平台适配与优化

```yaml
- name: 平台适配
  run: |
    # 不同平台有不同的视频格式要求
    for platform in bilibili youtube tiktok; do
      case $platform in
        bilibili)
          # B站：1080P, 16:9, H.264
          ffmpeg -i video.mp4 -vf "scale=1920:1080,format=yuv420p" -c:v libx264 -preset medium bilibili.mp4
          ;;
        youtube)
          # YouTube：支持多种格式，保持原样
          cp video.mp4 youtube.mp4
          ;;
        tiktok)
          # TikTok：竖屏，9:16
          ffmpeg -i video.mp4 -vf "crop=ih*9/16:ih,scale=1080:1920" -c:v libx264 tiktok.mp4
          ;;
      esac
      social-auto-upload --platform $platform --file ${platform}.mp4
    done
```

---

### 2.5 监控与反馈闭环

#### 2.5.1 实时通知（AstrBot 微信推送）

```yaml
- name: 微信通知
  env:
    ASTRBOT_WEBHOOK: ${{ secrets.ASTRBOT_WEBHOOK }}
  run: |
    # 发送微信通知
    curl -X POST $ASTRBOT_WEBHOOK \
      -H "Content-Type: application/json" \
      -d '{
        "message": "✅ 视频生成完成！\n标题：'$(cat script_final.json | jq -r '.video_title')'\n平台：'$PLATFORMS'\n时长：'$(ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 video.mp4)'秒"
      }'
```

#### 2.5.2 数据看板（可选）

```yaml
- name: 数据看板更新
  run: |
    # 使用 GitHub Pages 生成可视化看板
    python3 generate_dashboard.py \
      --video video.mp4 \
      --script script_final.json \
      --platforms "$PLATFORMS" \
      --output docs/index.html
```

---

## 三、完整工作流 YAML（可执行版）

```yaml
name: Obsidian Note to Video Pipeline v2.0

on:
  push:
    paths:
      - 'notes/**/*.md'
  workflow_dispatch:  # 支持手动触发
    inputs:
      note_path:
        description: '笔记路径'
        required: true
        default: 'notes/'

jobs:
  note-to-video:
    runs-on: ubuntu-latest
    timeout-minutes: 60  # 防止超时
    
    steps:
      - name: 检出代码
        uses: actions/checkout@v4
        with:
          fetch-depth: 0  # 获取完整历史，用于智能检测

      - name: 安装基础依赖
        run: |
          sudo apt-get update
          sudo apt-get install -y ffmpeg yq
          
          # 安装 vidgen
          cargo install vidgen --locked
          
          # 安装 social-auto-upload
          npm install -g social-auto-upload
          
          # 安装 Python 依赖
          pip install faster-whisper soundfile

      - name: 智能检测变更笔记
        id: smart-detect
        run: |
          # 获取变更的 .md 文件
          CHANGED=$(git diff --name-only --diff-filter=AM ${{ github.event.before }} ${{ github.sha }} | grep '^notes/.*\.md$')
          
          # 去重检查
          for file in $CHANGED; do
            HASH=$(sha256sum "$file" | cut -d' ' -f1)
            if ! grep -q "$HASH" .note-processed 2>/dev/null; then
              echo "new_file=$file" >> $GITHUB_OUTPUT
              echo "$HASH $file" >> .note-processed
            fi
          done

      - name: AI 脚本生成
        if: steps.smart-detect.outputs.new_file != ''
        env:
          DEEPSEEK_API_KEY: ${{ secrets.DEEPSEEK_API_KEY }}
        run: |
          for file in ${{ steps.smart-detect.outputs.new_file }}; do
            echo "📝 处理笔记: $file"
            
            # 读取笔记内容
            CONTENT=$(cat "$file")
            
            # 调用 DeepSeek 生成脚本
            curl -s -X POST https://api.deepseek.com/v1/chat/completions \
              -H "Content-Type: application/json" \
              -H "Authorization: Bearer $DEEPSEEK_API_KEY" \
              -d '{
                "model": "deepseek-v4-pro",
                "messages": [
                  {"role": "system", "content": "你是一位视频脚本专家。请分析以下笔记，生成一份视频脚本（JSON格式）。"},
                  {"role": "user", "content": "'"$CONTENT"'"}
                ]
              }' > script_$(basename "$file" .md).json
          done

      - name: 视频渲染
        if: steps.smart-detect.outputs.new_file != ''
        run: |
          for file in ${{ steps.smart-detect.outputs.new_file }}; do
            NAME=$(basename "$file" .md)
            
            # 使用 vidgen 渲染
            vidgen init ./video-project --preset educational
            # 转换脚本格式
            python3 convert_script.py script_${NAME}.json > video-project/script.md
            # 渲染视频
            vidgen render ./video-project
            
            # 重命名输出
            mv ./video-project/output/video.mp4 "${NAME}.mp4"
          done

      - name: 智能多平台发布
        if: steps.smart-detect.outputs.new_file != ''
        env:
          SOCIAL_ACCOUNTS_JSON: ${{ secrets.SOCIAL_ACCOUNTS_JSON }}
        run: |
          for file in ${{ steps.smart-detect.outputs.new_file }}; do
            NAME=$(basename "$file" .md)
            
            # 从笔记元数据读取平台配置
            PLATFORMS=$(yq '.video.platforms // ["bilibili"]' "$file" | tr -d '[]' | tr ',' ' ')
            TITLE=$(jq -r '.video_title' script_${NAME}.json)
            DESC=$(jq -r '.description' script_${NAME}.json)
            
            # 发布到各平台
            for platform in $PLATFORMS; do
              social-auto-upload \
                --platform "$platform" \
                --file "${NAME}.mp4" \
                --title "$TITLE" \
                --desc "$DESC" \
                --tags "$(jq -r '.hashtags | join(",")' script_${NAME}.json)"
            done
          done

      - name: 微信通知
        if: steps.smart-detect.outputs.new_file != ''
        env:
          ASTRBOT_WEBHOOK: ${{ secrets.ASTRBOT_WEBHOOK }}
        run: |
          for file in ${{ steps.smart-detect.outputs.new_file }}; do
            NAME=$(basename "$file" .md)
            TITLE=$(jq -r '.video_title' script_${NAME}.json)
            curl -s -X POST $ASTRBOT_WEBHOOK \
              -H "Content-Type: application/json" \
              -d "{\"message\": \"✅ 视频发布完成！\n标题：$TITLE\n平台：$(yq '.video.platforms // ["bilibili"]' "$file" | tr -d '[]' | tr ',' ' ')\"}"
          done

      - name: 清理临时文件
        if: always()
        run: |
          rm -f script_*.json
          rm -f *.mp4
          rm -rf ./video-project
          echo "🧹 清理完成"
```

---

## 四、扩展能力与高级功能

### 4.1 端到端测试

```yaml
- name: 端到端测试
  run: |
    # 创建测试笔记
    mkdir -p notes/test
    echo "# 测试视频\n\n这是一个测试笔记" > notes/test/test.md
    
    # 触发完整流程
    gh workflow run note-to-video.yml -f note_path=notes/test/test.md
    
    # 等待完成
    sleep 300
    
    # 验证结果
    if [ -f "test.mp4" ]; then
      echo "✅ 端到端测试通过"
    else
      echo "❌ 端到端测试失败"
      exit 1
    fi
```

### 4.2 智能错误重试

```yaml
- name: 智能错误重试
  uses: nick-fields/retry@v2
  with:
    timeout_minutes: 10
    max_attempts: 3
    retry_on: error
    command: |
      # 渲染视频的命令
      vidgen render ./video-project
```

### 4.3 性能监控与告警

```yaml
- name: 性能监控
  run: |
    START_TIME=$(date +%s%N)
    # ... 执行任务 ...
    END_TIME=$(date +%s%N)
    DURATION=$((($END_TIME - $START_TIME)/1000000))
    
    # 如果超过阈值，发送告警
    if [ $DURATION -gt 300000 ]; then
      curl -X POST $ASTRBOT_WEBHOOK \
        -d "{\"message\": \"⚠️ 视频生成耗时过长：${DURATION}ms\"}"
    fi
```

---

## 五、体系优化总结

| 优化点 | 原方案 | 优化方案 |
|--------|--------|----------|
| **智能检测** | 简单文件变更检测 | Git 元数据 + 哈希去重 |
| **脚本生成** | 单一模型 | 多模型协作 + 结构化输出 |
| **视频渲染** | 单一方案 | 多引擎切换（vidgen/HeyGem/Hyperframes） |
| **分发** | 基础上传 | 平台适配 + 定时排期 |
| **监控** | 无 | 实时通知 + 数据看板 |
| **错误处理** | 简单 | 重试机制 + 超时监控 |

