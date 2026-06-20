import CryptoJS from 'crypto-js'
import config from '@/config/config.js'

// 腾讯地图服务封装
class TencentMapService {
    constructor() {
        this.key = 'PX5BZ-MQJYQ-YMI5U-2UCDF-7YKTZ-OHFNX'
        this.secretKey = 'dXmQIt5Mlk2sPzBaxBrCy86IVRw0UIyQ'
        this.baseUrl = 'https://apis.map.qq.com'
    }

    // 生成签名
    generateSignature(path, params) {
        // 1. 对参数按key进行字典序排序
        const sortedKeys = Object.keys(params).sort()
        
        // 2. 构造参数字符串 - 注意：这里不需要对参数值进行编码
        const paramString = sortedKeys
            .map(key => `${key}=${params[key]}`)
            .join('&')
        
        // 3. 按照腾讯地图规范：请求路径 + "?" + 请求参数 + SK
        const signString = `${path}?${paramString}${this.secretKey}`
        
        console.log('[TencentMap] 签名字符串:', signString)
        
        // 4. 计算MD5签名（必须小写）
        const signature = CryptoJS.MD5(signString).toString().toLowerCase()
        
        console.log('[TencentMap] 生成签名:', signature)
        
        return signature
    }

    // 发起带签名的请求
    async request(path, params = {}) {
        // 添加必要参数
        const requestParams = {
            key: this.key,
            ...params
        }

        // 生成签名（使用原始参数值，不进行编码）
        const sig = this.generateSignature(path, requestParams)
        requestParams.sig = sig

        // 构造请求URL - 发送时需要对参数值进行URL编码
        const paramString = Object.keys(requestParams)
            .map(key => `${key}=${encodeURIComponent(requestParams[key])}`)
            .join('&')
        
        const url = `${this.baseUrl}${path}?${paramString}`

        console.log('[TencentMap] 请求URL:', url)

        return new Promise((resolve, reject) => {
            uni.request({
                url: url,
                method: 'GET',
                header: {
                    'Content-Type': 'application/json'
                },
                success: (res) => {
                    console.log('[TencentMap] 响应:', res.data)
                    if (res.data.status === 0) {
                        resolve(res.data)
                    } else {
                        reject(new Error(`${res.data.message || '请求失败'} (status: ${res.data.status})`))
                    }
                },
                fail: (error) => {
                    console.error('[TencentMap] 请求失败:', error)
                    reject(error)
                }
            })
        })
    }

    // 地理编码（地址转坐标）
    async geocoding(address, region = '') {
        return this.request('/ws/geocoder/v1/', {
            address: address,
            region: region
        })
    }

    // 逆地理编码（坐标转地址）
    async reverseGeocoding(lat, lng) {
        return this.request('/ws/geocoder/v1/', {
            location: `${lat},${lng}`
        })
    }

    // 路线规划
    async direction(from, to, mode = 'driving') {
        return this.request('/ws/direction/v1/driving/', {
            from: from,
            to: to,
            policy: mode
        })
    }

    // 地点搜索
    async search(keyword, boundary = '', page_size = 10, page_index = 1) {
        return this.request('/ws/place/v1/search', {
            keyword: keyword,
            boundary: boundary,
            page_size: page_size,
            page_index: page_index
        })
    }

    // IP定位
    async getLocationByIP(ip = '') {
        return this.request('/ws/location/v1/ip', {
            ip: ip
        })
    }

    // 签名测试函数
    testSignature() {
        // 使用官方文档的示例进行测试
        const testPath = '/ws/geocoder/v1'
        const testParams = {
            key: '5Q5BZ-5EVWJ-SN5F3-K6QBZ-B3FAO-*****',
            location: '28.7033487,115.8660847'
        }
        const testSK = 'SWvT26ypwq5Nwb5RvS8cLi6NSoH8HlJX'
        
        // 临时使用测试数据
        const originalKey = this.key
        const originalSK = this.secretKey
        this.key = testParams.key
        this.secretKey = testSK
        
        const signature = this.generateSignature(testPath, testParams)
        
        // 恢复原始数据
        this.key = originalKey
        this.secretKey = originalSK
        
        console.log('[TencentMap] 测试签名结果:', signature)
        console.log('[TencentMap] 期望签名结果: 90da272bfa19122547298e2b0bcc0e50')
        
        return signature === '90da272bfa19122547298e2b0bcc0e50'
    }
}

// 创建实例
const tencentMapService = new TencentMapService()

// 导出服务
export default tencentMapService

// 兼容旧版本导出方式
module.exports = tencentMapService