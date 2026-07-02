FRP 内网穿透详细配置

### 3.1 前置条件

- **一台有公网 IP 的云服务器**（如阿里云、腾讯云）
- **运行 AstrBot 的内网机器**（Windows/Linux/Mac）
- 云服务器安全组需开放相关端口

### 3.2 服务端配置 (frps)

**下载 FRP**：

```bash
# 以 Linux 为例，下载最新版本
wget https://github.com/fatedier/frp/releases/download/v0.61.1/frp_0.61.1_linux_amd64.tar.gz
tar -xzf frp_0.61.1_linux_amd64.tar.gz
cd frp_0.61.1_linux_amd64
```

**配置文件 `frps.toml`**（新版 FRP 使用 TOML 格式）：

```toml
# frps.toml
[common]
bind_port = 7000                    # 服务端与客户端通信端口
vhost_http_port = 8080              # HTTP 服务映射端口
vhost_https_port = 443              # HTTPS 服务映射端口（如需 HTTPS）
token = "your_secure_token_here"    # 认证 Token

# 如需 Dashboard 监控（可选）
[web]
admin_addr = "0.0.0.0"
admin_port = 7500
admin_user = "admin"
admin_password = "your_password"
```

**启动服务端**：

```bash
./frps -c frps.toml
```

**配置 systemd 开机自启**（生产环境推荐）：

```bash
sudo vim /etc/systemd/system/frps.service
```

```ini
[Unit]
Description=frps service
After=network.target

[Service]
Type=simple
ExecStart=/path/to/frps -c /path/to/frps.toml
Restart=on-failure

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl enable frps
sudo systemctl start frps
```

### 3.3 客户端配置 (frpc)

**下载 FRP 客户端**（与服务器版本保持一致）：

```bash
# 内网机器（以 Windows 为例，从 GitHub 下载对应版本）
# 或 Linux:
wget https://github.com/fatedier/frp/releases/download/v0.61.1/frp_0.61.1_linux_amd64.tar.gz
```

**配置文件 `frpc.toml`**：

```toml
# frpc.toml
[common]
server_addr = "你的公网服务器IP"      # 云服务器 IP
server_port = 7000                   # 与 frps 的 bind_port 一致
token = "your_secure_token_here"     # 与 frps 的 token 一致
tls_enable = true                    # 启用 TLS 加密

# ===== 映射 AstrBot Webhook 服务 =====
# HTTP 方式（开发测试）
[[proxies]]
name = "astrbot-webhook"
type = "http"
local_ip = "127.0.0.1"               # AstrBot 所在内网 IP
local_port = 6185                    # AstrBot Webhook 端口
custom_domains = ["astrbot.your-domain.com"]  # 自定义域名

# HTTPS 方式（生产环境推荐）
# [[proxies]]
# name = "astrbot-webhook-https"
# type = "https"
# local_ip = "127.0.0.1"
# local_port = 6185
# custom_domains = ["astrbot.your-domain.com"]

# ===== 可选：暴露管理端口 =====
# [[proxies]]
# name = "astrbot-admin"
# type = "tcp"
# local_ip = "127.0.0.1"
# local_port = 6185
# remote_port = 6185
```

**启动客户端**：

```bash
# Linux/Mac
./frpc -c frpc.toml

# Windows
frpc.exe -c frpc.toml
```

### 3.4 HTTPS 配置（生产环境必选）

小程序平台（微信/飞书/抖音）强制要求 Webhook 使用 HTTPS。有两种方案：

**方案一：FRP + Nginx（推荐）**

在云服务器上配置 Nginx 反向代理 + SSL 证书：

```nginx
# /etc/nginx/sites-available/astrbot
server {
    listen 443 ssl;
    server_name astrbot.your-domain.com;
    
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    
    location / {
        proxy_pass http://127.0.0.1:8080;  # vhost_http_port
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

**方案二：FRP 原生 HTTPS**

在 `frps.toml` 中配置 `vhost_https_port`，客户端使用 `type = "https"`。

### 3.5 验证穿透是否成功

```bash
# 在公网测试
curl http://astrbot.your-domain.com/astrbot_plugin_approval/pending
# 或 HTTPS
curl https://astrbot.your-domain.com/astrbot_plugin_approval/pending
```

### 3.6 常见问题排查

| 问题 | 可能原因 | 解决方法 |
|------|----------|----------|
| `login to server failed: EOF` | TLS 配置问题 | 客户端添加 `tls_enable = true` |
| 连接超时 | 防火墙/安全组未放行 | 检查云服务器安全组，放行 `7000` 端口 |
| 域名无法访问 | DNS 未解析或 `custom_domains` 错误 | 确保域名解析到云服务器 IP |
| Webhook 回调失败 | HTTPS 证书问题 | 使用受信任的 CA 签发的证书 |

---
