// Mock模式切换脚本
const fs = require('fs')
const path = require('path')

const configPath = path.join(__dirname, '../config/config.js')

// 读取当前配置
function getCurrentConfig() {
    const content = fs.readFileSync(configPath, 'utf8')
    const useMockMatch = content.match(/useMock:\s*(true|false)/)
    return useMockMatch ? useMockMatch[1] === 'true' : false
}

// 切换Mock模式
function toggleMock() {
    let content = fs.readFileSync(configPath, 'utf8')
    const currentMock = getCurrentConfig()
    const newMock = !currentMock
    
    // 替换useMock配置
    content = content.replace(
        /useMock:\s*(true|false)/,
        `useMock: ${newMock}`
    )
    
    fs.writeFileSync(configPath, content, 'utf8')
    
    console.log(`Mock模式已${newMock ? '启用' : '关闭'}`)
    console.log(`当前配置: useMock: ${newMock}`)
}

// 显示当前状态
function showStatus() {
    const currentMock = getCurrentConfig()
    console.log(`当前Mock模式: ${currentMock ? '启用' : '关闭'}`)
}

// 命令行参数处理
const args = process.argv.slice(2)
const command = args[0]

switch (command) {
    case 'on':
        // 启用Mock
        let content = fs.readFileSync(configPath, 'utf8')
        content = content.replace(/useMock:\s*(true|false)/, 'useMock: true')
        fs.writeFileSync(configPath, content, 'utf8')
        console.log('Mock模式已启用')
        break
        
    case 'off':
        // 关闭Mock
        content = fs.readFileSync(configPath, 'utf8')
        content = content.replace(/useMock:\s*(true|false)/, 'useMock: false')
        fs.writeFileSync(configPath, content, 'utf8')
        console.log('Mock模式已关闭')
        break
        
    case 'toggle':
        // 切换Mock
        toggleMock()
        break
        
    case 'status':
        // 显示状态
        showStatus()
        break
        
    default:
        console.log('Mock模式切换工具')
        console.log('使用方法:')
        console.log('  node scripts/toggleMock.js on      # 启用Mock模式')
        console.log('  node scripts/toggleMock.js off     # 关闭Mock模式')
        console.log('  node scripts/toggleMock.js toggle  # 切换Mock模式')
        console.log('  node scripts/toggleMock.js status  # 查看当前状态')
        showStatus()
}