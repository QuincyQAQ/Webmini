// 地图诊断工具
class MapDiagnostic {
    
    // 检查地图配置
    static checkMapConfig() {
        const result = {
            platform: this.getCurrentPlatform(),
            issues: [],
            suggestions: [],
            status: 'unknown'
        }
        
        // 检查平台特定配置
        switch (result.platform) {
            case '微信小程序':
                this.checkWeixinConfig(result)
                break
            case 'H5':
                this.checkH5Config(result)
                break
            case 'App':
                this.checkAppConfig(result)
                break
        }
        
        // 确定整体状态
        if (result.issues.length === 0) {
            result.status = 'good'
        } else if (result.issues.some(issue => issue.level === 'error')) {
            result.status = 'error'
        } else {
            result.status = 'warning'
        }
        
        return result
    }
    
    // 获取当前平台
    static getCurrentPlatform() {
        // #ifdef H5
        return 'H5'
        // #endif
        // #ifdef MP-WEIXIN
        return '微信小程序'
        // #endif
        // #ifdef APP-PLUS
        return 'App'
        // #endif
        return '未知平台'
    }
    
    // 检查微信小程序配置
    static checkWeixinConfig(result) {
        result.mapProvider = '腾讯地图'
        result.locationService = '微信内置'
        
        // 微信小程序通常不需要额外配置
        result.suggestions.push('微信小程序使用内置地图服务，无需额外配置')
    }
    
    // 检查H5配置
    static checkH5Config(result) {
        result.mapProvider = '腾讯地图'
        result.locationService = '浏览器Geolocation'
        
        // 检查HTTPS
        if (location.protocol !== 'https:' && location.hostname !== 'localhost') {
            result.issues.push({
                level: 'warning',
                message: 'H5地图建议在HTTPS环境下使用以获得最佳体验',
                solution: '部署到HTTPS服务器或使用localhost进行本地测试'
            })
        }
        
        // 检查浏览器支持
        if (!navigator.geolocation) {
            result.issues.push({
                level: 'error',
                message: '浏览器不支持Geolocation API',
                solution: '使用支持定位的现代浏览器'
            })
        }
        
        result.suggestions.push('H5平台已配置腾讯地图API Key，支持完整地图功能')
        result.suggestions.push('如果看到"Map key not configured"警告，请检查manifest.json配置')
    }
    
    // 检查App配置
    static checkAppConfig(result) {
        result.mapProvider = '高德地图'
        result.locationService = '系统定位服务'
        
        // App平台的检查需要在真机环境中进行
        result.suggestions.push('App平台需要在真机环境中测试定位权限')
    }
    
    // 测试地图组件
    static async testMapComponent(mapId = 'map') {
        return new Promise((resolve) => {
            try {
                const mapContext = uni.createMapContext(mapId)
                if (mapContext) {
                    resolve({
                        success: true,
                        message: '地图组件创建成功'
                    })
                } else {
                    resolve({
                        success: false,
                        message: '地图组件创建失败'
                    })
                }
            } catch (error) {
                resolve({
                    success: false,
                    message: `地图组件异常: ${error.message}`
                })
            }
        })
    }
    
    // 测试定位功能
    static async testLocation() {
        return new Promise((resolve) => {
            const startTime = Date.now()
            
            uni.getLocation({
                type: 'gcj02',
                timeout: 10000,
                success: (res) => {
                    const duration = Date.now() - startTime
                    resolve({
                        success: true,
                        message: '定位成功',
                        data: {
                            latitude: res.latitude,
                            longitude: res.longitude,
                            accuracy: res.accuracy,
                            duration: duration
                        }
                    })
                },
                fail: (error) => {
                    resolve({
                        success: false,
                        message: `定位失败: ${error.errMsg}`,
                        error: error
                    })
                }
            })
        })
    }
    
    // 生成诊断报告
    static generateReport(configCheck, mapTest, locationTest) {
        const report = {
            timestamp: new Date().toLocaleString(),
            platform: configCheck.platform,
            mapProvider: configCheck.mapProvider,
            locationService: configCheck.locationService,
            overallStatus: 'unknown',
            tests: {
                config: configCheck.status,
                mapComponent: mapTest.success ? 'pass' : 'fail',
                location: locationTest.success ? 'pass' : 'fail'
            },
            issues: configCheck.issues,
            suggestions: configCheck.suggestions,
            details: {
                mapTest: mapTest,
                locationTest: locationTest
            }
        }
        
        // 确定整体状态
        const failedTests = Object.values(report.tests).filter(status => status === 'fail').length
        const errorIssues = report.issues.filter(issue => issue.level === 'error').length
        
        if (failedTests === 0 && errorIssues === 0) {
            report.overallStatus = 'good'
        } else if (failedTests > 0 || errorIssues > 0) {
            report.overallStatus = 'error'
        } else {
            report.overallStatus = 'warning'
        }
        
        return report
    }
    
    // 格式化报告为文本
    static formatReportText(report) {
        let text = `地图诊断报告
================
时间: ${report.timestamp}
平台: ${report.platform}
地图服务商: ${report.mapProvider}
定位服务: ${report.locationService}
整体状态: ${this.getStatusText(report.overallStatus)}

测试结果:
- 配置检查: ${this.getStatusText(report.tests.config)}
- 地图组件: ${this.getStatusText(report.tests.mapComponent)}
- 定位功能: ${this.getStatusText(report.tests.location)}
`
        
        if (report.issues.length > 0) {
            text += '\n问题列表:\n'
            report.issues.forEach((issue, index) => {
                text += `${index + 1}. [${issue.level.toUpperCase()}] ${issue.message}\n`
                if (issue.solution) {
                    text += `   解决方案: ${issue.solution}\n`
                }
            })
        }
        
        if (report.suggestions.length > 0) {
            text += '\n建议:\n'
            report.suggestions.forEach((suggestion, index) => {
                text += `${index + 1}. ${suggestion}\n`
            })
        }
        
        if (report.details.locationTest.success && report.details.locationTest.data) {
            const data = report.details.locationTest.data
            text += `\n定位详情:
纬度: ${data.latitude}
经度: ${data.longitude}
精度: ${data.accuracy}米
耗时: ${data.duration}毫秒`
        }
        
        return text
    }
    
    // 获取状态文本
    static getStatusText(status) {
        const statusMap = {
            'good': '✅ 正常',
            'warning': '⚠️ 警告',
            'error': '❌ 错误',
            'fail': '❌ 失败',
            'pass': '✅ 通过',
            'unknown': '❓ 未知'
        }
        return statusMap[status] || status
    }
}

export default MapDiagnostic