---
title: "信创 AI 一体机交付操作手册"
tags:
  - 笔记
  - Docker
  - Linux
description: "适用机型：鲲鹏 920 + 昇腾 Atlas 300I Pro"
created: 2026-06-23
---

**文档版本**：V1.0  
**适用机型**：鲲鹏 920 + 昇腾 Atlas 300I Pro  
**操作系统**：银河麒麟高级服务器操作系统 V10  
**交付对象**：中小政务部门、国企附属机构  
**核心理念**：插电开机，浏览器打开就能用。数据安全，坏了不怕，随时找我。


## 一、交付前准备

### 1.1 硬件清点

开箱后逐项核对：

| 物品 | 数量 | 检查项 |
|:---|:---|:---|
| 服务器主机 | 1 台 | 外观无损坏，面板按钮正常 |
| 电源线 | 2 根 | 匹配机房插座（10A 或 16A） |
| 网线 | 2 根 | 六类线，长度足够到交换机 |
| 备份硬盘 | 1 块 | 外置 USB 硬盘，容量 ≥ 2TB |
| 系统 U 盘 | 1 个 | 贴标签“麒麟恢复盘” |
| 账号信封 | 1 份 | 密封，当面交负责人 |

### 1.2 机房环境检查

- **供电**：标准 220V，最好有 UPS。如果没有，提醒客户：“停电可能损坏系统，建议配一个 UPS，几百块钱的事。”
- **网络**：确认交换机有空闲网口。客户内网 IP 段是什么？（比如 192.168.1.x）
- **位置**：服务器放通风处，背面出风口离墙至少 15 公分。不要和热水壶、加湿器放一起。

### 1.3 信息采集

向客户确认并记录：

- 本机 IP 地址：______ （推荐 192.168.1.250）
- 子网掩码：______ （一般是 255.255.255.0）
- 网关：______ （一般是 192.168.1.1）
- DNS：______ （一般是 114.114.114.114）
- 管理员姓名：______
- 管理员初始密码：______ （交给客户自己设）

**问清楚，记下来。** 不要凭猜测配网络，配错了客户上不了网，第一个电话就是打给你。


## 二、麒麟系统安装

### 2.1 安装步骤

1. U 盘插服务器，开机按 F12 进启动菜单，选 U 盘启动。
2. 出现安装界面，选“Install Kylin Linux Advanced Server V10”。
3. 语言选中文，键盘选汉语。
4. 到分区这一步，选手动分区。

### 2.2 分区方案

**极简两分区方案**（适合单块系统盘+单块数据盘）：

| 分区 | 大小 | 说明 |
|:---|:---|:---|
| `/boot` | 1 GB | 启动分区，标准格式 ext4 |
| `/` | 剩余全部 | 系统根分区，格式 xfs |

数据盘 `/data` 稍后单独挂载，不要在安装界面操作。

**为什么这么简单？**
- 客户不需要知道什么是 `/var`、`/home`。
- 系统崩了重装 `/`，数据在 `/data` 完好无损。
- 备份只备份 `/data`，简单明了。

### 2.3 安装后基础设置

```bash
# 1. 关闭 swap（AI 推理必须）
swapoff -a
sed -i '/swap/d' /etc/fstab

# 2. 配置 NTP 时间同步
yum install -y chrony
systemctl enable chronyd --now

# 3. SELinux 临时关闭
setenforce 0
sed -i 's/SELINUX=enforcing/SELINUX=permissive/g' /etc/selinux/config

# 4. 安装基础工具
yum install -y vim wget curl net-tools lsof

# 5. 配置静态 IP
vim /etc/sysconfig/network-scripts/ifcfg-eth0
# 修改 IPADDR、NETMASK、GATEWAY，ONBOOT=yes
systemctl restart network
```

IP 配好后，笔记本 ping 一下，通了再往下走。


## 三、挂载数据盘

### 3.1 查看磁盘

```bash
lsblk
```

找到那块数据盘（通常是 `sdb` 或 `nvme1n1`，看容量判断）。

### 3.2 格式化并挂载

```bash
# 假设数据盘是 /dev/sdb
mkfs.xfs /dev/sdb
mkdir /data
mount /dev/sdb /data

# 写入 fstab 开机自动挂载
echo '/dev/sdb /data xfs defaults 0 0' >> /etc/fstab
```

### 3.3 处理 /home

```bash
# 把 /home 挪到数据盘下
mkdir -p /data/home
rm -rf /home
ln -s /data/home /home
```

**给客户解释**：C 盘是系统，D 盘是数据。D 盘上存着所有重要文件，我们每天自动备份。


## 四、昇腾 NPU 环境部署

### 4.1 安装依赖

```bash
yum install -y gcc gcc-c++ make cmake kernel-devel-$(uname -r) dkms elfutils-libelf-devel
```

### 4.2 安装驱动与固件

```bash
# U 盘或下载好的安装包
chmod +x Ascend-firmware-*.run
./Ascend-firmware-*.run --install

chmod +x Ascend-driver-*.run
./Ascend-driver-*.run --install

reboot
```

### 4.3 验证 NPU

```bash
npu-smi info
```

看到芯片型号、温度、显存信息，说明安装成功。

**如果没输出**：
- `dmesg | grep -i ascend` 看内核日志
- 确认 BIOS 里关闭了 Secure Boot
- 确认内核开发包版本与当前内核一致：`uname -r` 对比 `rpm -qa | grep kernel-devel`

### 4.4 安装 CANN 工具链

```bash
chmod +x Ascend-cann-toolkit-*.run
./Ascend-cann-toolkit-*.run --install
```

配置环境变量：

```bash
cat > /etc/profile.d/ascend.sh <<'EOF'
export ASCEND_HOME=/usr/local/Ascend/ascend-toolkit/latest
export PATH=$ASCEND_HOME/bin:$PATH
export LD_LIBRARY_PATH=$ASCEND_HOME/lib64:$LD_LIBRARY_PATH
EOF
source /etc/profile.d/ascend.sh
```

### 4.5 安装昇腾 Docker 运行时

```bash
chmod +x Ascend-docker-runtime-*.run
./Ascend-docker-runtime-*.run --install
```

修改 `/etc/docker/daemon.json`：

```json
{
  "exec-opts": ["native.cgroupdriver=systemd"],
  "runtimes": {
    "ascend": {
      "path": "/usr/local/Ascend/Ascend-docker-runtime/ascend-docker-runtime"
    }
  },
  "default-runtime": "runc",
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "100m",
    "max-file": "3"
  }
}
```

重启：

```bash
systemctl daemon-reload
systemctl restart docker
```

验证：

```bash
docker run --rm --runtime=ascend -e ASCEND_VISIBLE_DEVICES=0 ubuntu:22.04 npu-smi info
```


## 五、多用户运维管理

### 5.1 创建运维账号

```bash
# 创建运维组
groupadd ops

# 创建用户（家目录在 /data/home 下）
useradd -d /data/home/zhangsan -m -s /bin/bash -g ops zhangsan
useradd -d /data/home/lisi   -m -s /bin/bash -g ops lisi

# 设初始密码，首次登录强制修改
echo 'zhangsan:Temp2026!' | chpasswd
echo 'lisi:Temp2026!'     | chpasswd
passwd --expire zhangsan
passwd --expire lisi
```

### 5.2 配置 sudo 权限

只给必要命令，不给 root：

```bash
visudo -f /etc/sudoers.d/ops
```

内容：

```
%ops ALL=(root) NOPASSWD: /usr/bin/systemctl restart docker
%ops ALL=(root) NOPASSWD: /usr/bin/systemctl restart ai-app
%ops ALL=(root) NOPASSWD: /usr/bin/systemctl status mindie
%ops ALL=(root) NOPASSWD: /usr/bin/journalctl
```

### 5.3 SSH 安全加固

编辑 `/etc/ssh/sshd_config`：

```
PermitRootLogin no
PasswordAuthentication no
PubkeyAuthentication yes
AllowGroups ops
```

重启：

```bash
systemctl restart sshd
```

### 5.4 操作审计

在 `/etc/bashrc` 末尾添加：

```bash
export PROMPT_COMMAND='RETRN_VAL=$?; logger -p local6.debug "$(whoami) [$$] $(history 1 | sed "s/^[ ]*[0-9]\+[ ]*//" ) [$RETRN_VAL]"'
```

配置 rsyslog `/etc/rsyslog.d/audit.conf`：

```
local6.debug /var/log/commands.log
```

防止删除记录：

```bash
chattr +a /data/home/*/.bash_history
```

**告诉客户**：“谁在什么时候执行了什么命令，系统自动记录，删除不掉。”


## 六、AI 推理服务部署

### 6.1 创建 MindIE 自启动服务

创建 `/etc/systemd/system/mindie.service`：

```ini
[Unit]
Description=MindIE AI 推理服务
After=network.target docker.service
Requires=docker.service

[Service]
Restart=always
RestartSec=10
ExecStartPre=-/usr/bin/docker stop mindie-server
ExecStartPre=-/usr/bin/docker rm mindie-server
ExecStart=/usr/bin/docker run \
  --name mindie-server \
  --runtime=ascend \
  --network host \
  -e ASCEND_VISIBLE_DEVICES=0 \
  -e MAX_MODEL_LEN=32768 \
  -e MAX_BATCH_SIZE=64 \
  swr.cn-south-1.myhuaweicloud.com/ascend-mindie/deepseek-v4-flash:mindie-8.0
ExecStop=/usr/bin/docker stop mindie-server

[Install]
WantedBy=multi-user.target
```

启用：

```bash
systemctl daemon-reload
systemctl enable mindie --now
```

**给客户解释**：“AI 服务是开机自启动的，就像您电脑上的输入法，不用每次手动开。”

### 6.2 验证推理服务

```bash
curl http://localhost:8000/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{"model":"deepseek-v4-flash","messages":[{"role":"user","content":"你好"}]}'
```

返回 JSON 且包含回复内容，即成功。


## 七、业务应用部署

### 7.1 创建应用目录

```bash
mkdir -p /opt/ai-app
```

### 7.2 编写 docker-compose.yml

```yaml
version: '3.8'
services:
  milvus:
    image: milvusdb/milvus:2.4-latest
    restart: always
    ports:
      - "19530:19530"
    volumes:
      - /data/milvus:/var/lib/milvus

  rag-api:
    image: your-registry/rag-api:v1
    restart: always
    ports:
      - "8080:8080"
    environment:
      MILVUS_HOST: localhost
      LLM_BASE_URL: http://localhost:8000/v1

  nginx:
    image: nginx:alpine
    restart: always
    ports:
      - "80:80"
    volumes:
      - /opt/ai-app/nginx.conf:/etc/nginx/nginx.conf
```

### 7.3 创建自启动服务

创建 `/etc/systemd/system/ai-app.service`：

```ini
[Unit]
Description=AI 应用服务
Requires=docker.service
After=docker.service

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=/opt/ai-app
ExecStart=/usr/bin/docker-compose up -d
ExecStop=/usr/bin/docker-compose down
StandardOutput=journal

[Install]
WantedBy=multi-user.target
```

启用：

```bash
systemctl enable ai-app --now
```

### 7.4 浏览器验证

在客户电脑浏览器输入 `http://服务器IP`，看到问答页面，输入问题能返回结果，交付核心工作完成。


## 八、备份与恢复

### 8.1 备份脚本

创建 `/opt/scripts/backup.sh`：

```bash
#!/bin/bash
BACKUP_DIR="/mnt/backup"
DATA_DIR="/data"
DATE=$(date +%Y%m%d)

# 删除30天前的旧备份
find $BACKUP_DIR -name "data-backup-*" -mtime +30 -delete

# 增量同步
rsync -avz --delete $DATA_DIR/ $BACKUP_DIR/data-backup-$DATE/

if [ $? -eq 0 ]; then
    echo "备份成功：$DATE"
else
    echo "备份失败：$DATE"
fi
```

添加定时任务：

```bash
chmod +x /opt/scripts/backup.sh
echo "0 3 * * * /opt/scripts/backup.sh" | crontab -
```

**每晚凌晨 3 点自动备份，保留最近 30 天。**

### 8.2 恢复流程

如果系统崩了：

1.  重装麒麟 V10
2.  挂载数据盘 `mount /dev/sdb /data`
3.  重新部署服务 `systemctl start mindie && systemctl start ai-app`
4.  浏览器验证

**恢复时间：2 小时内。**


## 九、客户交付清单

### 9.1 当面交付

信封内装：

- 服务器 IP 地址
- 浏览器访问地址
- 管理员账号和密码
- 备份硬盘存放位置

### 9.2 日常操作说明（一页 A4）

**如何开关机**：
- 开机：按前面板电源键，等 5 分钟。
- 关机：**不要直接拔电源**。登录 SSH，输入 `sudo poweroff`。

**如何判断系统正常**：
- 浏览器打开问答页面，能正常提问。
- 如果页面打不开，检查：电源灯亮吗？网线插紧了吗？

**备份硬盘**：
- 插在服务器后面的 USB 口上，不要拔。

**出问题了怎么办**：
- 电话：_________（你的号码）
- 工作时间半小时响应，紧急情况 2 小时到场。


## 十、常见问题处理

| 问题 | 解决 |
|:---|:---|
| 页面打不开 | `docker-compose -f /opt/ai-app/docker-compose.yml ps` 看服务状态，都停了就 `systemctl restart ai-app` |
| 回答很慢 | `npu-smi info` 看 NPU 是否正常，`docker logs mindie-server` 看推理日志 |
| 硬盘空间满 | `df -h /data` 检查，清理旧日志：`journalctl --vacuum-size=500M` |
| 完全没电 | 检查电源线和插座，检查机房空开是否跳闸 |


## 十一、部署检查清单

逐项确认：

- [ ] 系统时间正确
- [ ] 静态 IP 配置正确，网络通畅
- [ ] 数据盘挂载 `/data`，写入正常
- [ ] `npu-smi info` 显示 NPU 健康
- [ ] Docker 可用昇腾运行时
- [ ] MindIE 推理服务自启正常，curl 返回正确
- [ ] AI 应用页面正常，问答功能可用
- [ ] 备份脚本配置，crontab 写入
- [ ] 运维账号创建，sudo 权限配置
- [ ] SSH 禁止 root 登录，仅密钥登录
- [ ] 审计日志记录正常
- [ ] 交付信封当面交给客户


**这本手册，给你的交付团队人手一份。每次部署，按这个清单逐项打钩，不会漏，不会忘。客户拿到手，是一台开机就能用的设备，和一个随时找得到的人。**

*——这就是信创 AI 一体机交付的全部秘密。*
