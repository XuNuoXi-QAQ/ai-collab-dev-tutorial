AstrBot 插件开发（审批 Webhook 模块）

### 2.1 环境准备

**获取插件模板**：

1. 打开 AstrBot 插件模板: [helloworld](https://github.com/Soulter/helloworld)
2. 点击右上角 **Use this template** → **Create new repository**
3. 插件命名规范：以 `astrbot_plugin_` 开头，全小写，无空格
4. 克隆到 AstrBot 的插件目录：

```bash
git clone https://github.com/AstrBotDevs/AstrBot
mkdir -p AstrBot/data/plugins
cd AstrBot/data/plugins
git clone 你的插件仓库地址
```

### 2.2 插件目录结构

```
astrbot_plugin_approval/              # 插件根目录
├── metadata.yaml                     # 插件元数据（必填）
├── main.py                           # 插件主逻辑（必填）
├── logo.png                          # 插件 Logo（可选）
├── requirements.txt                  # Python 依赖（可选）
└── pages/                            # WebUI 页面（可选）
    └── approval/
        └── index.html
```

### 2.3 metadata.yaml 配置

```yaml
# metadata.yaml
name: astrbot_plugin_approval
display_name: AI Agent 权限审批
desc: 接收 Agent 请求，生成脚本并推送审批通知
short_desc: Agent 特权操作审批插件
version: 1.0.0
author: your_name

# 声明支持的平台适配器
support_platforms:
  - lark      # 飞书
  - wecom     # 企业微信
  
# 声明的 AstrBot 版本范围
astrbot_version: ">=3.0.0"
```

### 2.4 插件主逻辑 (main.py)

```python
# main.py
import json
import subprocess
from astrbot.api.star import Context, Star
from astrbot.api.web import json_response, error_response, request
from astrbot.api.event import AstrMessageEvent
from astrbot.api.message_components import Plain

PLUGIN_NAME = "astrbot_plugin_approval"

class ApprovalPlugin(Star):
    def __init__(self, context: Context):
        super().__init__(context)
        
        # ========== 注册 Webhook API ==========
        # 接收小程序审批回调
        context.register_web_api(
            f"/{PLUGIN_NAME}/callback",
            self.approval_callback,
            ["POST"],
            "接收审批结果回调"
        )
        
        # 查询待审批列表
        context.register_web_api(
            f"/{PLUGIN_NAME}/pending",
            self.get_pending_list,
            ["GET"],
            "获取待审批列表"
        )
        
        # ========== 注册指令 ==========
        # 注册 /approve 指令，Agent 可通过此指令发起审批请求
        context.register_command(
            "approve",
            self.handle_approve_request,
            "发起特权操作审批请求"
        )
    
    # ========== Agent 发起审批请求 ==========
    async def handle_approve_request(self, event: AstrMessageEvent):
        """Agent 通过 /approve <命令> 发起审批"""
        message = event.message_str
        # 解析命令：/approve 安装 nginx
        command = message.replace("/approve", "").strip()
        
        if not command:
            yield event.plain_result("请指定要执行的命令，如：/approve 安装 nginx")
            return
        
        # 1. 生成 Shell 脚本
        script_content = self._generate_script(command)
        
        # 2. 存储脚本，生成唯一 ID
        script_id = self._store_script(script_content, command)
        
        # 3. 推送给用户（通过飞书/微信消息适配器）
        await self._push_notification(script_id, script_content, command)
        
        yield event.plain_result(f"审批请求已发送，脚本 ID: {script_id}")
    
    # ========== 生成脚本 ==========
    def _generate_script(self, command: str) -> str:
        """根据命令生成具体的 Shell 脚本"""
        # 示例：将自然语言转为脚本
        if "安装" in command:
            pkg = command.replace("安装", "").strip()
            return f"#!/bin/bash\napt-get update\napt-get install -y {pkg}"
        elif "重启" in command:
            service = command.replace("重启", "").strip()
            return f"#!/bin/bash\nsystemctl restart {service}"
        else:
            return f"#!/bin/bash\n{command}"
    
    # ========== 推送审批通知 ==========
    async def _push_notification(self, script_id: str, script: str, command: str):
        """通过消息适配器推送审批通知到小程序"""
        # 构造消息卡片
        message = f"📋 **Agent 请求执行特权操作**\n\n"
        message += f"**命令**: {command}\n\n"
        message += f"**脚本内容**:\n```bash\n{script}\n```\n\n"
        message += f"请点击链接审批: https://your-domain.com/approve?id={script_id}"
        
        # 通过 AstrBot 消息系统推送给管理员
        # 具体推送目标（用户/群组）需在配置中指定
        await self.context.send_message(
            "admin_user_id",  # 管理员 ID
            [Plain(message)]
        )
    
    # ========== Webhook 回调处理 ==========
    async def approval_callback(self):
        """处理小程序发来的审批结果"""
        try:
            payload = await request.json()
        except:
            return error_response("Invalid JSON")
        
        script_id = payload.get("script_id")
        action = payload.get("action")  # "approve" 或 "reject"
        user = payload.get("user")
        
        if not script_id or action not in ["approve", "reject"]:
            return error_response("缺少必要参数")
        
        # 获取脚本内容
        script_info = self._get_script(script_id)
        if not script_info:
            return error_response("脚本不存在")
        
        if action == "approve":
            # ===== 执行脚本 =====
            result = self._execute_script(script_info["content"])
            # 记录审计日志
            self._log_audit(script_id, user, "approve", result)
            # 通知用户执行结果
            await self._notify_result(script_id, result)
            return json_response({"status": "approved", "result": result})
        else:
            # 拒绝执行
            self._log_audit(script_id, user, "reject", None)
            await self._notify_result(script_id, "已拒绝")
            return json_response({"status": "rejected"})
    
    # ========== 执行脚本 ==========
    def _execute_script(self, script_content: str) -> str:
        """以普通用户身份通过 sudo 执行脚本"""
        # 写入临时脚本文件
        import tempfile
        import os
        
        with tempfile.NamedTemporaryFile(mode='w', suffix='.sh', delete=False) as f:
            f.write(script_content)
            script_path = f.name
        
        # 添加执行权限
        os.chmod(script_path, 0o755)
        
        # 通过 sudo 执行（需在 /etc/sudoers 中配置免密权限）
        result = subprocess.run(
            ["sudo", script_path],
            capture_output=True,
            text=True,
            timeout=300  # 5分钟超时
        )
        
        # 清理临时文件
        os.unlink(script_path)
        
        if result.returncode == 0:
            return f"执行成功\n{result.stdout}"
        else:
            return f"执行失败 (code: {result.returncode})\n{result.stderr}"
    
    # ========== 审计日志 ==========
    def _log_audit(self, script_id: str, user: str, action: str, result: str):
        """记录审计日志"""
        # 实际场景可写入数据库或文件
        import logging
        logging.info(f"审计: script_id={script_id}, user={user}, action={action}, result={result}")
```

### 2.5 统一 Webhook 模式配置

AstrBot 提供了**统一 Webhook 模式**，自动生成唯一的回调链接：

1. 进入 AstrBot WebUI → **配置** → **系统**
2. 填写 **对外可达的回调接口地址**（如 `https://astrbot.example.com`）
3. 保存并重启 AstrBot
4. 在配置各平台适配器时，开启 **统一 Webhook 模式** (`unified_webhook_mode`)
5. AstrBot 会自动生成唯一的 Webhook 回调链接，可在日志或 WebUI 的机器人卡片中查看

### 2.6 插件热重载

AstrBot 支持热重载功能，修改插件代码后无需重启整个服务：

- 在 WebUI 的**插件管理**页面找到你的插件
- 点击右上角菜单 → **重载插件**

---

