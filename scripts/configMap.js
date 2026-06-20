// 地图配置脚本
const fs = require('fs')
const path = require('path')
const readline = require('readline')

const manifestPath = path.join(__dirname, '../manifest.json')

// 创建命令行接口
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

// 提问函数
function question(prompt) {
    return new Promise((resolve) => {
        rl.question(prompt, resolve)
    })
}

// 读取manifest.json
function readManifest() {
    try {
        const content = fs.readFileSync(manifestPath, 'utf8')
        return JSON.parse(content)
    } catch (error) {
        console.error('读取manifest.json失败:', error.message)
        process.exit(1)
    }
}

// 写入manifest.json
function writeManifest(manifest) {
    try {
        const content = JSON.stringify(manifest, null, 4)
        fs.writeFileSync(manifestPath, content, 'utf8')
        console.log('✅ manifest.json 配置已更新')
    } catch (error) {
        console.error('写入manifest.json失败:', error.message)
        process.exit(1)
    }
}

// 配置H5地图
async function configH5Map(manifest) {
    console.log('\n📱 配置H5平台地图 (腾讯地图)')
    console.log('请先访问 https://lbs.qq.com/ 申请API Key')
    
    const key = await question('请输入腾讯地图API Key (留空跳过): ')
    let secretKey = ''
    
    if (key.trim()) {
        secretKey = await question('请输入Secret Key (如果启用了WebserviceAPI，留空跳过): ')
        
        if (!manifest.h5) manifest.h5 = {}
        if (!manifest.h5.sdkConfigs) manifest.h5.sdkConfigs = {}
        if (!manifest.h5.sdkConfigs.maps) manifest.h5.sdkConfigs.maps = {}
        
        manifest.h5.sdkConfigs.maps.qqmap = {
            key: key.trim()
        }
        
        if (secretKey.trim()) {
            manifest.h5.sdkConfigs.maps.qqmap.secretKey = secretKey.trim()
            console.log('✅ H5地图配置完成 (包含签名校验)')
        } else {
            console.log('✅ H5地图配置完成 (仅API Key)')
        }
    } else {
        console.log('⏭️ 跳过H5地图配置')
    }
}

// 配置App地图
async function configAppMap(manifest) {
    console.log('\n📱 配置App平台地图 (高德地图)')
    console.log('请先访问 https://lbs.amap.com/ 申请API Key')
    
    const iosKey = await question('请输入iOS API Key (留空跳过): ')
    const androidKey = await question('请输入Android API Key (留空跳过): ')
    
    if (iosKey.trim() || androidKey.trim()) {
        if (!manifest['app-plus']) manifest['app-plus'] = {}
        if (!manifest['app-plus'].distribute) manifest['app-plus'].distribute = {}
        if (!manifest['app-plus'].distribute.sdkConfigs) manifest['app-plus'].distribute.sdkConfigs = {}
        if (!manifest['app-plus'].distribute.sdkConfigs.maps) manifest['app-plus'].distribute.sdkConfigs.maps = {}
        
        manifest['app-plus'].distribute.sdkConfigs.maps.amap = {}
        
        if (iosKey.trim()) {
            manifest['app-plus'].distribute.sdkConfigs.maps.amap.appkey_ios = iosKey.trim()
        }
        
        if (androidKey.trim()) {
            manifest['app-plus'].distribute.sdkConfigs.maps.amap.appkey_android = androidKey.trim()
        }
        
        console.log('✅ App地图配置完成')
    } else {
        console.log('⏭️ 跳过App地图配置')
    }
}

// 显示当前配置
function showCurrentConfig(manifest) {
    console.log('\n📋 当前地图配置状态:')
    
    // 微信小程序
    const wxConfig = manifest['mp-weixin']?.permission?.['scope.userLocation']
    console.log(`微信小程序: ${wxConfig ? '✅ 已配置位置权限' : '❌ 未配置'}`)
    
    // H5
    const h5Config = manifest.h5?.sdkConfigs?.maps?.qqmap
    const h5Key = h5Config?.key
    const h5SecretKey = h5Config?.secretKey
    console.log(`H5平台: ${h5Key ? '✅ 已配置腾讯地图Key' : '❌ 未配置'}`)
    if (h5Key) {
        console.log(`  - API Key: ${h5Key.substring(0, 8)}...`)
        console.log(`  - Secret Key: ${h5SecretKey ? '已配置' : '未配置'}`)
    }
    
    // App
    const appConfig = manifest['app-plus']?.distribute?.sdkConfigs?.maps?.amap
    const iosKey = appConfig?.appkey_ios
    const androidKey = appConfig?.appkey_android
    console.log(`App平台: ${(iosKey || androidKey) ? '✅ 已配置高德地图Key' : '❌ 未配置'}`)
    
    if (iosKey) console.log(`  - iOS Key: ${iosKey.substring(0, 8)}...`)
    if (androidKey) console.log(`  - Android Key: ${androidKey.substring(0, 8)}...`)
}

// 主函数
async function main() {
    console.log('🗺️  地图配置工具')
    console.log('================')
    
    const manifest = readManifest()
    
    // 显示当前配置
    showCurrentConfig(manifest)
    
    const action = await question('\n请选择操作:\n1. 配置H5地图\n2. 配置App地图\n3. 配置所有平台\n4. 查看配置状态\n请输入选项 (1-4): ')
    
    switch (action.trim()) {
        case '1':
            await configH5Map(manifest)
            writeManifest(manifest)
            break
            
        case '2':
            await configAppMap(manifest)
            writeManifest(manifest)
            break
            
        case '3':
            await configH5Map(manifest)
            await configAppMap(manifest)
            writeManifest(manifest)
            break
            
        case '4':
            showCurrentConfig(manifest)
            break
            
        default:
            console.log('❌ 无效选项')
            break
    }
    
    console.log('\n📖 更多配置说明请查看: docs/map-config.md')
    rl.close()
}

// 错误处理
process.on('SIGINT', () => {
    console.log('\n👋 配置已取消')
    rl.close()
    process.exit(0)
})

// 运行
main().catch(error => {
    console.error('❌ 配置失败:', error.message)
    rl.close()
    process.exit(1)
})