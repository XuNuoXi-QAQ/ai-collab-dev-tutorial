---
title: "系统运维 MOC"
tags:
  - MOC
  - 运维
  - Linux
  - 索引
aliases:
  - 系统运维索引
  - Ops MOC
created: 2026-06-23
---

# 🖥️ 系统运维 MOC

> 覆盖 Linux 命令精讲、虚拟化、系统配置、安全工具。

---

## 📚 Linux 命令精讲系列（Ops/）

### 基础命令

- [[1系统信息与状态命令精讲]] — `uname` `hostnamectl` `lscpu` `lsblk`
- [[2进程管理命令精讲]] — `ps` `top` `kill` `nice`
- [[3服务管理（systemd）命令精讲]] — `systemctl` `journalctl`
- [[4磁盘与文件系统管理命令精讲]] — `df` `du` `fdisk` `mount`
- [[5包管理（pacman   yay    paru）命令精讲]] — `pacman` `yay` `paru`

### 网络与安全

- [[7网络管理命令精讲]] — `ip` `ss` `ping` `traceroute`
- [[8日志管理命令精讲]] — `journalctl` `dmesg` `logrotate`
- [[12SSH 与密钥管理命令精讲]] — `ssh-keygen` `ssh-agent` `ssh-copy-id`

### 运维核心

- [[6用户与权限管理命令精讲]] — `useradd` `chmod` `chown` `sudo`
- [[9Docker 管理命令精讲]] — `docker` `docker-compose` 容器管理
- [[10系统性能与监控命令精讲]] — `htop` `iostat` `vmstat` `sar`
- [[11文件与目录操作命令精讲]] — `find` `tar` `rsync` `ln`
- [[13应急与修复命令精讲]] — `fsck` `chroot` `rescue`
- [[Linux 系统管理命令快速参考卡]] — 终极速查手册
- [[系统管理命令]] — 系统级管理命令大全

---

## 🖥️ 系统配置

- [[Proxmox VE 9.0 安装与基础配置完全指南]] — PVE 虚拟化平台
- [[BIOS UEFI 界面中常见的英文单词、缩写及其详细释义]] — BIOS/UEFI 词汇
- [[Manjaro 安装 Codex 并配置 DeepSeek]] — Codex 在 Manjaro 的安装
- [[manjaro使用gnome桌面]] — GNOME 桌面配置与优化

---

## 📱 工具与环境

- [[npm]] — Node.js 包管理与代理配置
- [[移动系统制作]] — 便携系统 / Windows To Go
- [[AstrBot]] — 聊天机器人平台
- [[Azure TTS 配置指南 — AstrBot 语音合成]] — TTS 语音合成
- [[Manjaro 运行 Android 应用完全指南：Waydroid 部署与使用]] — Android 容器
- [[1Panel]] — Linux 服务器管理面板
- [[一键关闭所有window进程程序]] — Windows 进程管理

---

## 📂 子目录

- [[Oh My Zsh]] → `Oh My Tool/`
- [[Oh My Skills]] → `Oh My Tool/`

```dataview
TABLE tags, file.size AS "大小(KB)", file.cday AS "创建日期"
FROM "系统运维" OR "Ops"
WHERE !contains(tags, "MOC")
SORT file.name ASC
```"