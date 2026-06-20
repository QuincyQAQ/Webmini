// uni-app地图服务封装
class UniMapService {
    constructor() {
        // 检查当前平台
        this.platform = this.getCurrentPlatform()
        console.log('[UniMapService] 当前平台:', this.platform)
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

    // 获取当前位置
    async getCurrentLocation(options = {}) {
        const defaultOptions = {
            type: 'gcj02',
            altitude: true,
            ...options
        }

        return new Promise((resolve, reject) => {
            uni.getLocation({
                ...defaultOptions,
                success: (res) => {
                    console.log('[UniMapService] 定位成功:', res)
                    resolve({
                        latitude: res.latitude,
                        longitude: res.longitude,
                        accuracy: res.accuracy,
                        altitude: res.altitude,
                        speed: res.speed,
                        address: res.address,
                        platform: this.platform
                    })
                },
                fail: (error) => {
                    console.error('[UniMapService] 定位失败:', error)
                    reject(new Error(`定位失败: ${error.errMsg}`))
                }
            })
        })
    }

    // 选择位置
    async chooseLocation() {
        return new Promise((resolve, reject) => {
            uni.chooseLocation({
                success: (res) => {
                    console.log('[UniMapService] 选择位置成功:', res)
                    resolve({
                        name: res.name,
                        address: res.address,
                        latitude: res.latitude,
                        longitude: res.longitude
                    })
                },
                fail: (error) => {
                    console.error('[UniMapService] 选择位置失败:', error)
                    reject(new Error(`选择位置失败: ${error.errMsg}`))
                }
            })
        })
    }

    // 打开位置
    async openLocation(latitude, longitude, options = {}) {
        const defaultOptions = {
            scale: 18,
            ...options
        }

        return new Promise((resolve, reject) => {
            uni.openLocation({
                latitude: latitude,
                longitude: longitude,
                ...defaultOptions,
                success: (res) => {
                    console.log('[UniMapService] 打开位置成功:', res)
                    resolve(res)
                },
                fail: (error) => {
                    console.error('[UniMapService] 打开位置失败:', error)
                    reject(new Error(`打开位置失败: ${error.errMsg}`))
                }
            })
        })
    }

    // 计算两点间距离（简单计算）
    calculateDistance(lat1, lng1, lat2, lng2) {
        const R = 6371 // 地球半径，单位：公里
        const dLat = this.toRadians(lat2 - lat1)
        const dLng = this.toRadians(lng2 - lng1)
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                  Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) *
                  Math.sin(dLng / 2) * Math.sin(dLng / 2)
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
        const distance = R * c
        return Math.round(distance * 1000) // 返回米
    }

    // 角度转弧度
    toRadians(degrees) {
        return degrees * (Math.PI / 180)
    }

    // 检查定位权限
    async checkLocationPermission() {
        return new Promise((resolve) => {
            // #ifdef APP-PLUS
            const permissionID = 'android.permission.ACCESS_FINE_LOCATION'
            plus.android.requestPermissions([permissionID], (result) => {
                if (result.granted && result.granted.length > 0) {
                    resolve(true)
                } else {
                    resolve(false)
                }
            }, (error) => {
                console.error('权限请求失败:', error)
                resolve(false)
            })
            // #endif

            // #ifndef APP-PLUS
            // 其他平台默认有权限
            resolve(true)
            // #endif
        })
    }

    // 获取平台特定的配置信息
    getPlatformConfig() {
        const config = {
            platform: this.platform,
            supportFeatures: {
                getLocation: true,
                chooseLocation: true,
                openLocation: true,
                mapComponent: true
            }
        }

        // 根据平台调整功能支持
        switch (this.platform) {
            case '微信小程序':
                config.mapProvider = '腾讯地图'
                config.needsKey = false
                break
            case 'H5':
                config.mapProvider = '腾讯地图'
                config.needsKey = true
                config.requiresHTTPS = true
                break
            case 'App':
                config.mapProvider = '高德地图'
                config.needsKey = true
                break
        }

        return config
    }
}

// 创建实例
const uniMapService = new UniMapService()

// 导出服务
export default uniMapService

// 兼容旧版本导出方式
module.exports = uniMapService