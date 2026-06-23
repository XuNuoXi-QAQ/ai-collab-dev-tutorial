---
title: "BIOS UEFI 界面中常见的英文单词、缩写及其详细释义"
tags:
  - BIOS
  - UEFI
  - 硬件
  - 英文
  - 参考
aliases:
  - BIOS UEFI词汇
created: 2026-06-23
---
主流主板（华硕、技嘉、微星、华擎等）

### 一、界面操作与通用提示
| 英文术语 | 释义 |
|----------|------|
| **Main** | 主菜单，概览页 |
| **Advanced** | 高级设置 |
| **OC / Tweaker / Ai Tweaker / MIT** | 超频或性能调节菜单（品牌叫法不同） |
| **Boot** | 启动设置菜单 |
| **Security** | 安全设置菜单 |
| **Save & Exit** | 保存并退出菜单 |
| **Hardware Monitor / H/W Monitor** | 硬件监控菜单 |
| **Tools** | 工具菜单 |
| **Enter** | 进入/确认 |
| **+/-** | 更改数值/选项 |
| **F1 / General Help** | 帮助 |
| **F9 / Setup Defaults** | 加载默认设置（部分品牌） |
| **F10 / Save and Reset** | 保存更改并重启 |
| **ESC / Exit** | 返回上一级/退出 |
| **Load Optimized Defaults** | 加载优化默认值 |
| **Last Known Good Configuration** | 最后一次正确配置（部分可见） |
| **Discard Changes** | 放弃修改 |
| **Boot Override** | 临时选择启动设备立即启动 |

---

### 二、主菜单 (Main)
| 英文术语 | 释义 |
|----------|------|
| **System Date / Time** | 系统日期/时间 |
| **BIOS Version** | 当前BIOS固件版本 |
| **Processor Information** | 处理器信息（型号、频率等） |
| **Memory Information / Total Memory** | 内存总容量与基本信息 |
| **ME FW Version / ME Version** | Intel管理引擎固件版本 |
| **PCH Information** | 芯片组信息 |
| **Language** | 界面语言选择 |
| **Access Level** | 当前用户权限（管理员/用户） |

---

### 三、高级设置 (Advanced)

#### 1. CPU 配置 (CPU Configuration)
| 英文术语 | 释义 |
|----------|------|
| **Hyper-Threading / SMT Mode** | 超线程/同步多线程，一个核心模拟两个逻辑核心 |
| **Active Processor Cores** | 启用的CPU核心数量 |
| **Intel Virtualization Technology (VMX)** | Intel虚拟化技术，虚拟机基础支持 |
| **VT-d / IOMMU** | 直接I/O虚拟化，让虚拟机直接访问硬件 |
| **SVM Mode** | AMD虚拟化（Secure Virtual Machine） |
| **Intel SpeedStep (EIST)** | 增强型SpeedStep节能技术 |
| **Intel Speed Shift Technology** | 硬件控制的更快速频率切换 |
| **C-States / C-State Control** | CPU省电睡眠状态深度控制 |
| **Enhanced C-States** | 更深层的省电状态 |
| **Limit CPUID Maximum** | 限制CPUID最大值，用于兼容老系统 |
| **Intel Turbo Boost / AMD Core Performance Boost** | 睿频/核心性能加速，自动提高频率 |
| **TVB (Thermal Velocity Boost)** | 温度条件允许时进一步提升频率（Intel高端） |
| **ABT (Adaptive Boost Technology)** | 让多核同时达到更高睿频（11代酷睿） |
| **Per Core Ratio / Active-Core Ratio** | 按核心数量设置不同倍频 |

#### 2. 存储设置 (Storage / SATA / NVMe)
| 英文术语 | 释义 |
|----------|------|
| **SATA Controller(s)** | SATA控制器启用/禁用 |
| **SATA Mode Selection** | SATA工作模式：AHCI / RAID / IDE |
| **AHCI** | 高级主机控制器接口，支持NCQ、热插拔 |
| **RAID** | 磁盘阵列模式 |
| **NVMe Configuration** | NVMe固态硬盘信息与设置 |
| **M.2 Slot** | M.2接口设置 |
| **SATA Hot Plug** | 对应端口热插拔功能 |
| **Intel Rapid Storage Technology (RST)** | 英特尔快速存储技术，实现RAID及Optane加速 |
| **Intel Optane** | 英特尔傲腾内存加速设置 |
| **Hard Drive BBS Priorities** | 硬盘启动优先级 |

#### 3. USB 配置
| 英文术语 | 释义 |
|----------|------|
| **Legacy USB Support** | 传统USB支持，保证DOS等环境下可用 |
| **XHCI Hand-off** | 将USB 3.0控制器控制权交给操作系统 |
| **EHCI Hand-off** | 将USB 2.0控制器控制权交给操作系统 |
| **USB Mass Storage Driver Support** | USB大容量存储设备支持 |

#### 4. 板载设备 (Onboard Devices)
| 英文术语 | 释义 |
|----------|------|
| **HD Audio Controller** | 板载高清音频控制器 |
| **Onboard LAN Controller** | 板载有线网卡 |
| **LAN PXE Option ROM** | 网卡PXE网络启动功能 |
| **Wi-Fi / Bluetooth** | 板载无线网卡、蓝牙开关 |
| **Serial Port / Parallel Port** | 串口/并口设置（老式主板常见） |

#### 5. 电源管理 (Power Management / APM)
| 英文术语 | 释义 |
|----------|------|
| **Restore AC Power Loss** | 断电恢复后状态：Power Off / Power On / Last State |
| **Wake on LAN / WOL** | 网络唤醒 |
| **Wake by USB / KB / Mouse** | USB/键盘/鼠标唤醒 |
| **ErP Ready / EuP** | 节能就绪，S5关机状态下整机功耗低于1W |
| **CEC Ready** | 允许通过HDMI CEC唤醒（部分主板） |
| **Deep Sleep** | 深度睡眠模式 |

#### 6. PCI 子系统
| 英文术语 | 释义 |
|----------|------|
| **Above 4G Decoding** | 大于4GB地址空间解码，多GPU或Resizable BAR必需 |
| **Re-Size BAR Support** | 可调整大小的基址寄存器，提升显卡性能 |
| **SR-IOV** | 单根I/O虚拟化，将一个物理设备虚拟成多个 |
| **PCIe Speed** | 设置PCIe通道速度（Gen1/2/3/4/5） |
| **ASPM** | 主动状态电源管理，PCIe节能 |

#### 7. TPM / 可信计算
| 英文术语 | 释义 |
|----------|------|
| **Trusted Platform Module (TPM)** | 可信平台模块 |
| **Security Device Support** | 安全设备支持开关 |
| **Intel PTT** | Intel平台信任技术，固件模拟TPM |
| **AMD fTPM** | AMD固件TPM |
| **TPM State** | 启用/禁用TPM |
| **Clear TPM** | 清除TPM内所有密钥 |

---

### 四、超频 / 性能调节 (OC / Tweaker / Ai Tweaker)
此菜单名称因厂商而异：华硕 **Ai Tweaker**，技嘉 **MIT**，微星 **OC**，华擎 **OC Tweaker**。

#### 1. 频率设定
| 英文术语 | 释义 |
|----------|------|
| **CPU Core Ratio** | CPU核心倍频，决定主频 |
| **CPU Cache/Ring Ratio** | 缓存/环形总线倍频 |
| **BCLK Frequency** | 基频（外频），默认100MHz |
| **DRAM Frequency** | 内存频率 |
| **FCLK Frequency (AMD)** | Infinity Fabric总线频率 |
| **UCLK DIV1 MODE (AMD)** | 内存控制器频率模式（1:1或1:2） |
| **BCLK Aware Adaptive Voltage** | 基频变化时自适应电压 |

#### 2. 内存时序 (DRAM Timing Control)
| 英文术语 | 释义 |
|----------|------|
| **XMP / X.M.P.** | Intel内存超频预设（Extreme Memory Profile） |
| **DOCP** | 华硕AMD平台的内存超频预设 |
| **A-XMP** | 微星AMD平台内存超频预设 |
| **EXPO** | AMD新一代内存超频预设 |
| **CAS Latency (tCL)** | 列地址选通延迟 |
| **tRCD** | RAS到CAS的延迟 |
| **tRP** | 行预充电时间 |
| **tRAS** | 行活动时间 |
| **tRFC** | 刷新周期时间 |
| **Command Rate (CR)** | 命令速率，1T/2T |
| **Gear Mode (Intel)** | Gear1(1:1)或Gear2(1:2)内存控制器与内存频率比 |
| **Memory Context Restore (AMD)** | 内存上下文恢复，减少自检时间 |
| **Power Down Enable** | 内存省电模式 |

#### 3. 电压设定 (Voltage)
| 英文术语 | 释义 |
|----------|------|
| **CPU Core/Cache Voltage** | CPU核心/缓存电压 |
| **CPU VCCSA** | 系统代理电压（System Agent） |
| **CPU VCCIO / VDDQ** | 内存控制器和I/O电压 |
| **DRAM Voltage (VDD / VDDQ)** | 内存电压 |
| **CPU VDDCR_SOC (AMD)** | 片上系统电压（包含内存控制器等） |
| **PCH Core Voltage** | 芯片组电压 |
| **CPU Standby Voltage** | 处理器待机电压 |

#### 4. CPU 特征与睿频
| 英文术语 | 释义 |
|----------|------|
| **Intel SpeedStep** | 系统省电时自动降低频率 |
| **Intel Speed Shift** | 硬件级快速变频 |
| **Intel Turbo Boost** | 睿频加速 |
| **ASUS MultiCore Enhancement** | 华硕多核心增强，解除功耗限制 |
| **AVX Offset** | 执行AVX指令时的频率偏移（降温策略） |
| **AVX512 Offset** | AVX-512指令时的频率偏移 |
| **Per P-Core Ratio / Per E-Core Ratio** | 大小核分别设置倍频 |
| **Active Efficient-Cores** | 启用能效核数量 |
| **Ring Down Bin** | 环形总线降频，默认自动 |
| **CPU Core Current Limit** | 核心电流限制 |

#### 5. 供电与负载校准 (Digi+ VRM / CPU Power)
| 英文术语 | 释义 |
|----------|------|
| **CPU Load-Line Calibration (LLC)** | 负载线校准，防止高负载掉电压 |
| **CPU Current Capability** | 供电电流上限百分比 |
| **CPU VRM Switching Frequency** | 供电开关频率 |
| **Phase Control** | 供电相数控制 |
| **CPU Power Duty Control** | 功率平衡控制 |
| **VRM Thermal Control** | VRM过热保护 |

#### 6. AMD 专属超频
| 英文术语 | 释义 |
|----------|------|
| **Precision Boost Overdrive (PBO)** | 精准超频提升，放开功率/电流限制 |
| **PBO Limits** | 功耗、电流、温度限制 |
| **Curve Optimizer** | 曲线优化器，按电压曲线调整每个核心电压 |
| **Max CPU Boost Clock Override** | 增加最大加速频率上限（+25~200MHz） |
| **Infinity Fabric Frequency (FCLK)** | IF总线频率 |
| **Resizable BAR / Smart Access Memory** | 智能存取内存，让CPU一次访问全部显存 |

---

### 五、启动设置 (Boot)
| 英文术语 | 释义 |
|----------|------|
| **Boot Configuration** | 启动配置 |
| **Bootup NumLock State** | 开机后小键盘灯状态 |
| **Full Screen Logo** | 全屏品牌LOGO显示 |
| **Fast Boot** | 快速启动，跳过部分自检和USB检测 |
| **Boot Option Priorities** | 启动顺序（#1, #2...） |
| **CSM / Launch CSM** | 兼容性支持模块，开启后可Legacy启动 |
| **Secure Boot** | 安全启动，防止未签名系统加载 |
| **Secure Boot Mode** | Standard/Custom，管理模式 |
| **Key Management** | 密钥管理，可清除平台密钥(PK、KEK、db、dbx) |
| **Boot from Storage Devices** | 从硬盘/U盘等设备启动 |
| **PXE / HTTP Boot** | 网络启动 |
| **UEFI / Legacy Boot** | UEFI模式或传统Legacy模式 |

---

### 六、安全 (Security)
| 英文术语 | 释义 |
|----------|------|
| **Administrator Password** | 管理员密码，进入BIOS需验证 |
| **User Password** | 用户密码，限制启动与修改 |
| **HDD Security / HDD Password** | 硬盘密码锁（部分支持） |
| **Secure Boot** | 有时也归类于此，控制数字签名验证 |
| **Chassis Intrusion Detection** | 机箱入侵检测，记录机箱被打开的事件 |

---

### 七、硬件监控 (Hardware Monitor)
| 英文术语 | 释义 |
|----------|------|
| **CPU Temperature** | 处理器温度 |
| **Motherboard Temperature** | 主板温度 |
| **PCH / Chipset Temperature** | 芯片组温度 |
| **VRM MOS Temperature** | 供电模块温度 |
| **CPU Fan Speed** | CPU风扇转速 |
| **Chassis Fan / SYS Fan** | 系统/机箱风扇转速 |
| **AIO Pump** | 一体式水冷水泵转速 |
| **CPU Q-Fan Control / Smart Fan Mode** | 智能风扇控制（DC电压调速/PWM脉宽调速） |
| **Fan Curve** | 温度-转速曲线调整 |
| **Voltage Monitor** | 电压监控：+12V, +5V, +3.3V, Vcore, VDIMM, VCCSA等 |

---

### 八、工具 (Tools)
| 英文术语 | 释义 |
|----------|------|
| **ASUS EZ Flash 3** | 华硕BIOS更新工具 |
| **Gigabyte Q-Flash** | 技嘉BIOS更新工具 |
| **MSI M-Flash** | 微星BIOS更新工具 |
| **ASRock Instant Flash** | 华擎BIOS更新工具 |
| **BIOS Profile** | 保存/加载BIOS设置配置档案 |
| **Armoury Crate (ASUS)** | 华硕驱动与软件自动安装开关 |
| **Secure Erase** | 安全擦除SSD所有数据（不可恢复） |
| **SPD Information** | 内存SPD芯片信息 |

---

### 九、常用缩写与技术术语补充
| 缩写/术语 | 全称与释义 |
|-----------|------------|
| **BIOS** | Basic Input/Output System，基本输入输出系统 |
| **UEFI** | Unified Extensible Firmware Interface，统一可扩展固件接口 |
| **POST** | Power-On Self-Test，开机自检 |
| **ACPI** | Advanced Configuration and Power Interface，高级配置与电源接口 |
| **AHCI** | Advanced Host Controller Interface，高级主机控制器接口 |
| **NVMe** | Non-Volatile Memory Express，非易失性存储高速协议 |
| **RAID** | Redundant Array of Independent Disks，磁盘阵列 |
| **TPM** | Trusted Platform Module，可信平台模块 |
| **PTT** | Platform Trust Technology，Intel固件TPM |
| **fTPM** | Firmware TPM，AMD固件TPM |
| **IOMMU / VT-d** | 输入输出内存管理单元，直接I/O虚拟化 |
| **SR-IOV** | Single Root I/O Virtualization |
| **XMP / EXPO** | 内存超频预配置文件 |
| **PBO** | Precision Boost Overdrive，AMD精准超频 |
| **LLC** | Load-Line Calibration，防掉压 |
| **CSM** | Compatibility Support Module，兼容性支持模块 |
| **PXE** | Preboot eXecution Environment，预启动网络环境 |
| **Above 4G Decoding** | 大于4G地址解码 |
| **ReBAR / SAM** | Resizable BAR / Smart Access Memory |
| **EIST** | Enhanced Intel SpeedStep Technology |
| **SVM** | Secure Virtual Machine，AMD虚拟化 |
| **SMBIOS** | System Management BIOS |
| **OpROM** | Option ROM，可选设备固件 |




[各种电脑bios图解中文教程（超级详细的BIOS设置大全图解）对于很多人来说，在装系统过程中难免遇到各类问题，其中最让人 - 掘金](https://juejin.cn/post/7215842530838675516)


[所盼皆欣然的个人空间-所盼皆欣然个人主页-哔哩哔哩视频](https://space.bilibili.com/589200735/channel/collectiondetail?sid=8222417&spm_id_from=333.788.0.0)