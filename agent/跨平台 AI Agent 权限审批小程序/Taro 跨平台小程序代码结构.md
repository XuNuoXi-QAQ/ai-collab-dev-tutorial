

### 1.1 项目初始化

```bash
# 安装 Taro CLI
npm install -g @tarojs/cli

# 创建项目（选择 React/Vue 模板）
taro init myApp
```

### 1.2 目录结构

```
myApp/
├── config/                          # 编译配置目录
│   ├── index.js                     # 主配置文件
│   ├── dev.js                       # 开发环境配置
│   └── prod.js                      # 生产环境配置
├── src/                             # 源码目录
│   ├── app.config.ts                # 小程序全局配置
│   ├── app.ts                       # 项目入口文件
│   ├── app.scss                     # 全局样式
│   ├── pages/                       # 页面目录
│   │   ├── index/                   # 首页（审批列表）
│   │   │   ├── index.config.ts      # 页面配置
│   │   │   ├── index.tsx            # 页面逻辑
│   │   │   └── index.scss           # 页面样式
│   │   ├── approve/                 # 审批详情页
│   │   │   ├── index.config.ts
│   │   │   ├── index.tsx
│   │   │   └── index.scss
│   │   └── history/                 # 历史记录页
│   │       ├── index.config.ts
│   │       ├── index.tsx
│   │       └── index.scss
│   ├── components/                  # 公共组件
│   │   ├── ScriptCard/              # 脚本展示卡片
│   │   │   ├── index.tsx
│   │   │   └── index.scss
│   │   └── ApprovalButton/          # 审批按钮组件
│   │       ├── index.tsx
│   │       └── index.scss
│   ├── utils/                       # 工具函数
│   │   ├── request.ts               # 网络请求封装
│   │   └── platform.ts              # 平台判断工具
│   ├── services/                    # API 服务层
│   │   └── approval.ts              # 审批相关 API
│   └── types/                       # TypeScript 类型定义
│       └── index.d.ts
├── project.config.json              # 微信小程序配置
├── project.lark.json                # 飞书小程序配置
├── project.tt.json                  # 抖音小程序配置
├── package.json
└── tsconfig.json
```

### 1.3 多平台编译配置

**config/index.js** 中配置多平台插件：

```javascript
const config = {
  // ... 其他配置
  plugins: [
    // 飞书小程序插件
    '@tarojs/plugin-platform-lark',
    // 微信小程序（Taro 默认支持，无需额外插件）
    // 抖音小程序（Taro 默认支持）
  ],
  // 各平台差异化配置
  defineConstants: {
    // 可根据平台注入不同变量
  },
}
```

**各平台项目配置文件**：

| 平台 | 配置文件 |
|------|----------|
| 微信小程序 | `project.config.json` |
| 抖音小程序 | `project.tt.json` |
| 飞书小程序 | `project.lark.json` |

**飞书小程序配置示例** (`project.lark.json`)：

```json
{
  "miniprogramRoot": "./",
  "projectname": "taro-lark",
  "description": "AI Agent 权限审批",
  "appid": "你的飞书应用App ID",
  "setting": {
    "urlCheck": true,
    "es6": true,
    "postcss": false,
    "minified": false
  },
  "compileType": "miniprogram"
}
```

### 1.4 编译命令

在 `package.json` 中添加各平台编译脚本：

```json
{
  "scripts": {
    "dev:weapp": "npm run build:weapp -- --watch",
    "build:weapp": "taro build --type weapp",
    "dev:lark": "npm run build:lark -- --watch",
    "build:lark": "taro build --type lark",
    "dev:tt": "npm run build:tt -- --watch",
    "build:tt": "taro build --type tt"
  }
}
```

### 1.5 平台判断与差异化逻辑

在代码中判断当前运行平台：

```typescript
// 工具函数：获取当前平台
export const getPlatform = () => {
  return process.env.TARO_ENV // 'weapp' | 'lark' | 'tt' | 'h5' ...
}

// 条件渲染
if (process.env.TARO_ENV === 'lark') {
  // 飞书特有逻辑
} else if (process.env.TARO_ENV === 'tt') {
  // 抖音特有逻辑
}
```

### 1.6 审批页核心代码示例

```tsx
// src/pages/approve/index.tsx
import { View, Text, Button } from '@tarojs/components'
import { useState, useEffect } from 'react'
import { approveScript, rejectScript } from '../../services/approval'

const ApprovePage = () => {
  const [script, setScript] = useState({ id: '', content: '', agent: '' })

  useEffect(() => {
    // 从路由参数获取脚本ID，拉取详情
  }, [])

  const handleApprove = async () => {
    await approveScript(script.id)
    // 跳转到结果页
  }

  const handleReject = async () => {
    await rejectScript(script.id)
  }

  return (
    <View>
      <Text>Agent {script.agent} 请求执行以下脚本：</Text>
      <View className='script-box'>
        <Text>{script.content}</Text>
      </View>
      <View className='button-group'>
        <Button onClick={handleReject}>拒绝</Button>
        <Button onClick={handleApprove}>同意执行</Button>
      </View>
    </View>
  )
}
```

### 1.7 飞书小程序开发注意事项

- **导入项目**：编译后选择 `dist` 目录导入飞书开发者工具，不能导入整个项目。
- **App ID**：在飞书开放平台创建应用后获取，填入 `project.lark.json`。
- **版本兼容**：飞书插件推荐升级到最新版，避免与抖音小程序的 `appId` 配置冲突。
- **权限申请**：如需调用飞书 API（如消息推送），需在飞书后台「权限管理」中申请。