# 机器人管理 - 公务机器人管理系统

一个基于 uni-app 框架开发的跨平台公务机器人管理移动应用，支持微信小程序、H5、App 等多端部署。

## 项目简介

机器人管理是一个综合性的公务机器人管理系统，提供机器人监控、用机器人申请、维修管理、任务调度、轨迹回放等功能，帮助机构高效管理公务机器人资源。

## 主要功能

### 🚗 机器人管理
- 实时机器人状态监控
- 机器人信息查询和设置
- 机器人位置追踪

### 📝 用机器人申请
- 在线用机器人申请提交
- 申请状态跟踪
- 申请历史记录

### 🔧 维修管理
- 维修申请提交
- 维修进度跟踪
- 维修记录管理
- 维修任务分配和审批

### 📋 任务调度
- 待办任务管理
- 机器人调度安排
- 驾驶员分配
- 任务详情查看

### 📍 轨迹回放
- 历史轨迹查询
- 轨迹回放功能
- 行驶路径分析

### 👤 个人中心
- 用户信息管理
- 密码修改
- 系统设置

## 技术栈

- **框架**: uni-app (Vue 2)
- **UI组件库**: uView UI
- **样式**: SCSS
- **加密**: crypto-js
- **跨平台**: 支持微信小程序、H5、Android、iOS

## 项目结构

```
├── components/          # 公共组件
│   ├── divider/        # 分割线组件
│   ├── popup-upload-photo/  # 图片上传弹窗
│   ├── tabbar/         # 自定义底部导航
│   └── tree-picker/    # 树形选择器
├── config/             # 配置文件
│   ├── config.js       # 环境配置
│   └── constant.js     # 常量定义
├── network/            # 网络请求
│   ├── api.js          # API接口
│   └── apiUrl.js       # 接口地址
├── pages/              # 页面文件
│   ├── apply/          # 用机器人申请
│   ├── fix/            # 维修管理
│   ├── index/          # 首页
│   ├── login/          # 登录注册
│   ├── mine/           # 个人中心
│   ├── task/           # 任务管理
│   ├── trajectory/     # 轨迹回放
│   └── web/            # 网页容器
├── static/             # 静态资源
│   ├── css/            # 样式文件
│   ├── images/         # 图片资源
│   └── js/             # 工具函数
├── uni_modules/        # uni-app插件
├── App.vue             # 应用入口
├── main.js             # 主入口文件
├── manifest.json       # 应用配置
└── pages.json          # 页面路由配置
```

## 开发环境要求

- Node.js >= 12.0.0
- HBuilderX 或 VS Code + uni-app插件
- 微信开发者工具（小程序开发）

## Mock服务

项目集成了完整的Mock服务系统，支持前端独立开发和测试：

### 功能特性
- 🔄 一键切换Mock模式和真实后端
- 📊 完整的业务数据模拟
- ⚡ 网络延迟和错误场景模拟
- 🎛️ 可视化管理界面
- 📁 文件上传模拟

### 快速使用
1. 在 `config/config.js` 中设置 `useMock: true`
2. 访问 `/pages/mock/mockManager` 管理Mock数据
3. 测试账号：`admin` / `123456`

详细说明请查看：[Mock服务文档](mock/README.md)

## 安装和运行

### 1. 克隆项目
```bash
git clone [项目地址]
cd vehicle-miniProgram
```

### 2. 安装依赖
```bash
npm install
```
- 下载插件并导入HBuilderX
- 1. 安装 uni-ui
https://ext.dcloud.net.cn/plugin?id=55
- 2. 安装 uViewUi
https://ext.dcloud.net.cn/plugin?id=1593

### 3. 配置环境
编辑 `config/config.js` 文件，配置服务器地址：
```javascript
module.exports = {
    debug: false,
    useMock: true,  // Mock模式开关
    baseUrl: "your-api-server-url",
    photoUrl: "your-photo-server-url",
    // ...其他配置
}
```

### 4. 地图配置
项目使用uni-app内置地图组件，采用简化配置方案：

- **微信小程序**：使用腾讯地图，无需额外配置
- **H5平台**：使用腾讯地图，基础功能无需API Key
- **App平台**：使用高德地图，基础功能无需API Key

**地图功能测试**：
- 基础测试：访问 `/pages/mock/simpleMapTest`
- 高级测试：访问 `/pages/mock/mapTest`

详细配置说明请查看：
- [简化地图配置](docs/simple-map-config.md)
- [完整地图配置](docs/map-config.md)

### 5. 运行项目

#### 微信小程序
1. 在 HBuilderX 中打开项目
2. 点击运行 -> 运行到小程序模拟器 -> 微信开发者工具
3. 在微信开发者工具中预览

#### H5
1. 在 HBuilderX 中点击运行 -> 运行到浏览器

#### App
1. 在 HBuilderX 中点击运行 -> 运行到手机或模拟器
2. 或打包：发行 -> 原生App-云打包

## 配置说明

### 小程序配置
- AppID: ``
- 需要配置位置权限：`scope.userLocation`

### 权限配置
应用需要以下权限：
- 网络访问
- 位置信息
- 相机权限
- 文件读写

## 部署

### 小程序发布
1. 在微信开发者工具中点击上传
2. 登录微信公众平台提交审核
3. 审核通过后发布

### App打包
1. 在 HBuilderX 中选择发行 -> 原生App-云打包
2. 配置证书和签名
3. 生成安装包

## 开发规范

- 使用 Vue 2 语法
- 组件命名采用 PascalCase
- 页面文件放在对应功能目录下
- 公共组件放在 components 目录
- 工具函数放在 static/js 目录
- 样式使用 SCSS 预处理器

