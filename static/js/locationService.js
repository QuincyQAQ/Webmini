// 定位服务封装
class LocationService {
    constructor() {
        this.platform = this.getCurrentPlatform()
    }

    // 获取当前平台
    getCurrentPlatform() {
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

    // 获取当前位置 - 智能选择最佳方案
    async getCurrentLocation(options = {}) {
        const defaultOptions = {
            type: 'gcj02',
            altitude: true,
            timeout: 10000,
            ...options
        }

        // H5平台优先使用浏览器原生API
        if (this.platform === 'H5') {
            return this.getLocationByBrowser(defaultOptions)
        } else {
            // 其他平台使用uni-app API
            return this.getLocationByUniApp(defaultOptions)
        }
    }

    // 使用浏览器原生Geolocation API (H5专用)
    async getLocationByBrowser(options) {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject(new Error('浏览器不支持定位功能'))
                return
            }

            const geoOptions = {
                enableHighAccuracy: true,
                timeout: options.timeout || 10000,
                maximumAge: 60000 // 1分钟内的缓存位置可用
            }

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const coords = position.coords
                    
                    // 转换为uni-app格式的返回数据
                    const result = {
                        latitude: coords.latitude,
                        longitude: coords.longitude,
                        accuracy: coords.accuracy,
                        altitude: coords.altitude,
                        speed: coords.speed,
                        heading: coords.heading,
                        timestamp: position.timestamp,
                        source: 'browser-geolocation'
                    }

                    console.log('[LocationService] 浏览器定位成功:', result)
                    resolve(result)
                },
                (error) => {
                    let errorMessage = '定位失败'
                    
                    switch (error.code) {
                        case error.PERMISSION_DENIED:
                            errorMessage = '用户拒绝了定位权限请求'
                            break
                        case error.POSITION_UNAVAILABLE:
                            errorMessage = '位置信息不可用'
                            break
                        case error.TIMEOUT:
                            errorMessage = '定位请求超时'
                            break
                        default:
                            errorMessage = `定位失败: ${error.message}`
                            break
                    }

                    console.error('[LocationService] 浏览器定位失败:', error)
                    reject(new Error(errorMessage))
                },
                geoOptions
            )
        })
    }

    // 使用uni-app API (小程序/App专用)
    async getLocationByUniApp(options) {
        return new Promise((resolve, reject) => {
            // 尝试不同的配置组合来解决坐标系转换问题
            const locationConfigs = [
                // 最简配置，避免坐标系转换问题
                { 
                    altitude: false, 
                    timeout: options.timeout || 15000,
                    isHighAccuracy: false
                },
                // WGS84坐标系
                { 
                    type: 'wgs84',
                    altitude: false, 
                    timeout: options.timeout || 15000,
                    isHighAccuracy: true
                },
                // GCJ02坐标系
                { 
                    type: 'gcj02',
                    altitude: false, 
                    timeout: options.timeout || 15000,
                    isHighAccuracy: true
                },
                // 原始配置
                { 
                    ...options,
                    timeout: options.timeout || 15000
                }
            ]

            this.tryLocationConfigs(locationConfigs, 0, resolve, reject)
        })
    }

    // 尝试不同的定位配置
    tryLocationConfigs(configs, index, resolve, reject) {
        if (index >= configs.length) {
            reject(new Error('所有定位配置都失败了'))
            return
        }

        const config = configs[index]
        console.log(`[LocationService] 尝试配置 ${index + 1}:`, config)

        uni.getLocation({
            ...config,
            success: (res) => {
                // 确保返回的数据有必要的属性
                const result = {
                    latitude: res.latitude || 0,
                    longitude: res.longitude || 0,
                    accuracy: res.accuracy || 0,
                    altitude: res.altitude || null,
                    speed: res.speed || null,
                    heading: res.heading || null,
                    timestamp: res.timestamp || Date.now(),
                    source: `uni-app (配置${index + 1})`
                }
                console.log('[LocationService] uni-app定位成功:', result)
                resolve(result)
            },
            fail: (error) => {
                console.warn(`[LocationService] 配置${index + 1}失败:`, error.errMsg)
                // 尝试下一个配置
                this.tryLocationConfigs(configs, index + 1, resolve, reject)
            }
        })
    }

    // 尝试多种定位方案
    async getLocationWithFallback(options = {}) {
        const methods = []

        // 根据平台确定尝试顺序
        if (this.platform === 'H5') {
            methods.push(
                () => this.getLocationByBrowser(options),
                () => this.getLocationByUniApp(options)
            )
        } else {
            methods.push(
                () => this.getLocationByUniApp(options),
                () => this.getLocationByBrowser(options)
            )
        }

        let lastError = null

        for (const method of methods) {
            try {
                const result = await method()
                return result
            } catch (error) {
                lastError = error
                console.warn('[LocationService] 定位方法失败，尝试下一个:', error.message)
            }
        }

        throw lastError || new Error('所有定位方法都失败了')
    }

    // 检查定位权限状态
    async checkLocationPermission() {
        if (this.platform === 'H5') {
            // 检查浏览器定位权限
            if ('permissions' in navigator) {
                try {
                    const permission = await navigator.permissions.query({ name: 'geolocation' })
                    return {
                        granted: permission.state === 'granted',
                        denied: permission.state === 'denied',
                        prompt: permission.state === 'prompt',
                        state: permission.state
                    }
                } catch (error) {
                    console.warn('[LocationService] 权限检查失败:', error)
                    return { granted: false, state: 'unknown' }
                }
            }
        }

        // 其他平台暂时返回未知状态
        return { granted: true, state: 'unknown' }
    }

    // 获取定位能力信息
    getLocationCapabilities() {
        const capabilities = {
            platform: this.platform,
            supportedMethods: [],
            recommendations: []
        }

        if (this.platform === 'H5') {
            if (navigator.geolocation) {
                capabilities.supportedMethods.push('browser-geolocation')
                capabilities.recommendations.push('使用浏览器原生定位API，避免签名验证问题')
            }
            capabilities.supportedMethods.push('uni-app')
            capabilities.recommendations.push('确保在HTTPS环境下使用')
        } else {
            capabilities.supportedMethods.push('uni-app')
            capabilities.recommendations.push('使用uni-app内置定位API')
        }

        return capabilities
    }
}

// 创建实例
const locationService = new LocationService()

// 导出服务
export default locationService

// 兼容旧版本导出方式
module.exports = locationService