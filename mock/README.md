# Mock服务使用说明

## 概述

本项目集成了完整的Mock服务系统，可以在不依赖后端服务的情况下进行前端功能测试和开发。

## 功能特性

- ✅ 一键切换Mock模式和真实后端
- ✅ 完整的业务数据模拟
- ✅ 网络延迟模拟
- ✅ 文件上传模拟
- ✅ 错误场景模拟
- ✅ 数据持久化（内存级别）
- ✅ 可视化管理界面

## 快速开始

### 1. 启用Mock模式

在 `config/config.js` 中设置：
```javascript
module.exports = {
    useMock: true,  // 启用Mock模式
    // ...其他配置
}
```

### 2. 访问Mock管理页面

在应用中导航到：`/pages/mock/mockManager`

### 3. 测试Mock登录功能

访问登录测试页面：`/pages/mock/loginTest`

支持的测试账号：
- 用户名：`admin`，密码：`123456`
- 用户名：`test`，密码：`123456`  
- 用户名：`demo`，密码：`123456`

### 4. 测试其他Mock功能

```javascript
// 示例：测试登录接口
this.api.postQuery(this.apiUrl.login, {
    username: 'admin',
    password: this.utils.encryptByAES('123456')  // 密码需要加密
}).then(result => {
    console.log('登录成功:', result)
})
```

## 文件结构

```
mock/
├── mockData.js         # Mock测试数据
├── mockService.js      # Mock服务处理器
├── mockGenerator.js    # 数据生成器工具
└── README.md          # 使用说明
```

## Mock数据说明

### 用户数据
- 测试账号：`admin` / `123456`
- 包含完整用户信息和权限

### 机器人数据
- 3辆测试机器人
- 包含实时位置、状态、驾驶员信息
- 支持搜索和筛选

### 申请数据
- 用机器人申请：2条测试数据
- 维修申请：2条测试数据
- 包含完整的审批流程状态

### 其他数据
- 驾驶员列表：3个测试驾驶员
- 组织架构：完整的部门树结构
- 轨迹数据：模拟GPS轨迹点

## API接口映射

Mock服务支持以下接口：

### 用户相关
- `POST /app/login` - 用户登录
- `POST /app/modifyPassword` - 修改密码
- `GET /app/user/getUserMsg` - 获取用户信息
- `POST /app/user/editUser` - 编辑用户信息

### 机器人相关
- `GET /app/realtimePositioning/queryGpsList` - 获取机器人GPS数据
- `GET /app/realtimePositioning/dataTree` - 获取组织架构
- `GET /app/realtimePositioning/searchVehicle` - 搜索机器人
- `GET /app/realtimePositioning/queryVehicleList` - 获取机器人列表

### 申请相关
- `GET /app/vehicleApplication/vehicleApplyList` - 用机器人申请列表
- `GET /app/vehicleApplication/getVehicleApplyInfoByApplyId` - 申请详情
- `POST /app/vehicleApplication/saveVehicleApply` - 保存申请
- `PUT /app/vehicleApplication/updateVehicleApply` - 更新申请

### 维修相关
- `GET /app/repairManagement/repairApplyList` - 维修申请列表
- `POST /app/repairManagement/saveRepairApply` - 保存维修申请
- `GET /app/repairManagement/getRepairApplyByRepairId` - 维修详情

## 自定义Mock数据

### 1. 修改现有数据

编辑 `mock/mockData.js` 文件：

```javascript
// 添加新的机器人数据
vehicles: [
    {
        id: 4,
        plateNumber: "粤A99999",
        vehicleType: "新能源车",
        // ...其他字段
    }
]
```

### 2. 使用数据生成器

```javascript
import mockGenerator from '@/mock/mockGenerator.js'

// 生成10辆车的数据
const vehicles = mockGenerator.generateBatchData('vehicle', 10)

// 生成5个用机器人申请
const applications = mockGenerator.generateBatchData('application', 5)
```

### 3. 添加新接口

在 `mock/mockService.js` 中添加：

```javascript
// 在handleRequest方法中添加新路由
case '/app/newApi/endpoint':
    return this.handleNewApi(data)

// 添加处理方法
async handleNewApi(data) {
    // 处理逻辑
    return this.successResponse(result)
}
```

## 切换模式

### 方法1：配置文件切换
```javascript
// config/config.js
module.exports = {
    useMock: false,  // 切换到真实后端
}
```

### 方法2：运行时切换
```javascript
// 在代码中动态切换
import config from '@/config/config.js'
config.useMock = false
```

### 方法3：管理界面切换
访问Mock管理页面，使用开关控件切换

## 调试技巧

### 1. 查看Mock日志
```javascript
// Mock请求会在控制台输出详细日志
console.log('[Mock] GET /app/api/endpoint', data)
```

### 2. 模拟网络延迟
```javascript
// 在mockService.js中调整延迟时间
this.delay = 1000  // 1秒延迟
```

### 3. 模拟错误场景
```javascript
// 在处理方法中返回错误
return this.errorResponse("模拟的错误信息", 500)
```

## 注意事项

1. **数据持久化**：Mock数据仅在内存中，刷新页面会重置
2. **文件上传**：Mock模式下文件上传返回模拟URL
3. **网络状态**：Mock模式不受网络状态影响
4. **性能**：Mock响应速度可能比真实API更快
5. **数据一致性**：确保Mock数据结构与真实API一致

## 常见问题

### Q: 如何添加更多测试数据？
A: 使用 `mockGenerator.js` 生成器或直接编辑 `mockData.js`

### Q: Mock模式下文件上传如何处理？
A: 系统会模拟上传过程并返回模拟的文件URL

### Q: 如何模拟网络错误？
A: 在对应的处理方法中返回错误响应

### Q: 数据修改后如何重置？
A: 重新加载页面或使用Mock管理页面的重置功能

## 最佳实践

1. **开发阶段**：使用Mock模式进行快速开发
2. **测试阶段**：切换真实后端进行集成测试
3. **演示阶段**：使用Mock模式确保演示稳定
4. **数据维护**：定期更新Mock数据保持真实性
5. **接口对齐**：确保Mock接口与后端API保持一致