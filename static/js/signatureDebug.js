import CryptoJS from 'crypto-js'

// 腾讯地图签名调试工具
class SignatureDebug {
    
    // 详细的签名计算过程
    static calculateSignatureWithDebug(path, params, secretKey) {
        console.log('=== 腾讯地图签名计算调试 ===')
        console.log('1. 输入参数:')
        console.log('   路径:', path)
        console.log('   参数:', params)
        console.log('   密钥:', secretKey)
        
        // 步骤1: 参数排序
        const sortedKeys = Object.keys(params).sort()
        console.log('2. 参数排序后的键:', sortedKeys)
        
        // 步骤2: 构造参数字符串
        const paramString = sortedKeys
            .map(key => {
                const value = params[key]
                console.log(`   ${key}=${value}`)
                return `${key}=${value}`
            })
            .join('&')
        console.log('3. 参数字符串:', paramString)
        
        // 步骤3: 构造签名字符串
        const signString = `${path}?${paramString}${secretKey}`
        console.log('4. 签名字符串:', signString)
        
        // 步骤4: 计算MD5
        const signature = CryptoJS.MD5(signString).toString().toLowerCase()
        console.log('5. MD5签名结果:', signature)
        
        console.log('=== 签名计算完成 ===')
        
        return signature
    }
    
    // 验证官方示例
    static verifyOfficialExample() {
        console.log('=== 验证官方示例 ===')
        
        const path = '/ws/geocoder/v1'
        const params = {
            key: '5Q5BZ-5EVWJ-SN5F3-K6QBZ-B3FAO-*****',
            location: '28.7033487,115.8660847'
        }
        const secretKey = 'SWvT26ypwq5Nwb5RvS8cLi6NSoH8HlJX'
        const expectedSignature = '90da272bfa19122547298e2b0bcc0e50'
        
        const calculatedSignature = this.calculateSignatureWithDebug(path, params, secretKey)
        
        const isCorrect = calculatedSignature === expectedSignature
        console.log('期望签名:', expectedSignature)
        console.log('计算签名:', calculatedSignature)
        console.log('验证结果:', isCorrect ? '✅ 正确' : '❌ 错误')
        
        return isCorrect
    }
    
    // 测试实际配置
    static testActualConfig(key, secretKey) {
        console.log('=== 测试实际配置 ===')
        
        const path = '/ws/geocoder/v1'
        const params = {
            key: key,
            address: '深圳市南山区'
        }
        
        const signature = this.calculateSignatureWithDebug(path, params, secretKey)
        
        return {
            path,
            params,
            signature,
            url: `https://apis.map.qq.com${path}?${Object.keys(params).sort().map(k => `${k}=${encodeURIComponent(params[k])}`).join('&')}&sig=${signature}`
        }
    }
}

export default SignatureDebug