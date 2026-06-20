<template>
	<view class="page">
		<view class="header">
			<text class="title">地图功能测试</text>
		</view>
		
		<view class="content">
			<!-- 地图组件 -->
			<view class="map-section">
				<view class="section-title">地图显示测试</view>
				<map 
					id="testMap" 
					class="test-map" 
					:latitude="latitude" 
					:longitude="longitude" 
					:scale="15"
					:markers="markers"
					@markertap="onMarkerTap"
					@tap="onMapTap">
				</map>
			</view>

			<!-- 签名测试 -->
			<view class="test-section">
				<view class="section-title">签名验证测试</view>
				<button class="test-btn" @click="testSignature">测试签名计算</button>
				<view class="result-box" v-if="signatureTestResult">
					<text class="result-text">{{ signatureTestResult }}</text>
				</view>
			</view>

			<!-- 定位测试 -->
			<view class="test-section">
				<view class="section-title">定位功能测试</view>
				<view class="button-group">
					<button class="test-btn" @click="getCurrentLocation">获取当前位置</button>
					<button class="test-btn" @click="chooseLocation">选择位置</button>
				</view>
				<view class="result-box" v-if="locationResult">
					<text class="result-text">{{ locationResult }}</text>
				</view>
			</view>

			<!-- 地理编码测试 -->
			<view class="test-section">
				<view class="section-title">地理编码测试</view>
				<view class="input-group">
					<input class="test-input" v-model="testAddress" placeholder="请输入地址" />
					<button class="test-btn" @click="testGeocoding">地址转坐标</button>
				</view>
				<view class="result-box" v-if="geocodingResult">
					<text class="result-text">{{ geocodingResult }}</text>
				</view>
			</view>

			<!-- 逆地理编码测试 -->
			<view class="test-section">
				<view class="section-title">逆地理编码测试</view>
				<view class="input-group">
					<input class="test-input" v-model="testLat" placeholder="纬度" type="number" />
					<input class="test-input" v-model="testLng" placeholder="经度" type="number" />
					<button class="test-btn" @click="testReverseGeocoding">坐标转地址</button>
				</view>
				<view class="result-box" v-if="reverseGeocodingResult">
					<text class="result-text">{{ reverseGeocodingResult }}</text>
				</view>
			</view>

			<!-- 地点搜索测试 -->
			<view class="test-section">
				<view class="section-title">地点搜索测试</view>
				<view class="input-group">
					<input class="test-input" v-model="searchKeyword" placeholder="请输入搜索关键词" />
					<button class="test-btn" @click="testSearch">搜索地点</button>
				</view>
				<view class="result-box" v-if="searchResult">
					<text class="result-text">{{ searchResult }}</text>
				</view>
			</view>

			<!-- 配置信息 -->
			<view class="config-section">
				<view class="section-title">当前配置</view>
				<view class="config-info">
					<text class="config-item">API Key: {{ apiKey }}</text>
					<text class="config-item">Secret Key: {{ secretKey ? '已配置' : '未配置' }}</text>
					<text class="config-item">平台: {{ platform }}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			latitude: 22.5431,
			longitude: 113.9434,
			markers: [
				{
					id: 1,
					latitude: 22.5431,
					longitude: 113.9434,
					iconPath: '/static/images/nav_map_checked.png',
					width: 30,
					height: 30,
					title: '测试标记'
				}
			],
			locationResult: '',
			geocodingResult: '',
			reverseGeocodingResult: '',
			searchResult: '',
			signatureTestResult: '',
			testAddress: '深圳市南山区科技园',
			testLat: 22.5431,
			testLng: 113.9434,
			searchKeyword: '餐厅',
			apiKey: 'PX5BZ-MQJYQ-YMI5U-2UCDF-7YKTZ-OHFNX',
			secretKey: 'dXmQIt5Mlk2sPzBaxBrCy86IVRw0UIyQ',
			platform: ''
		}
	},
	onLoad() {
		this.platform = this.getPlatform()
		console.log('当前平台:', this.platform)
	},
	methods: {
		// 获取当前平台
		getPlatform() {
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
		},

		// 测试签名计算
		testSignature() {
			try {
				// 导入调试工具
				const SignatureDebug = require('@/static/js/signatureDebug.js').default
				
				// 验证官方示例
				const officialTest = SignatureDebug.verifyOfficialExample()
				
				// 测试实际配置
				const actualTest = SignatureDebug.testActualConfig(this.apiKey, this.secretKey)
				
				this.signatureTestResult = `签名计算测试结果：

官方示例验证: ${officialTest ? '✅ 通过' : '❌ 失败'}

实际配置测试:
路径: ${actualTest.path}
参数: ${JSON.stringify(actualTest.params, null, 2)}
签名: ${actualTest.signature}

完整URL:
${actualTest.url}

${officialTest ? '签名算法正确，可以进行API调用测试' : '签名算法有误，需要检查实现'}`
				
				if (officialTest) {
					uni.showToast({
						title: '签名测试通过',
						icon: 'success'
					})
				} else {
					uni.showToast({
						title: '签名测试失败',
						icon: 'error'
					})
				}
			} catch (error) {
				console.error('签名测试失败:', error)
				this.signatureTestResult = `签名测试异常: ${error.message}`
			}
		},

		// 获取当前位置
		async getCurrentLocation() {
			this.locationResult = '正在获取位置...'
			
			try {
				// 使用uni地图服务
				const location = await this.uniMapService.getCurrentLocation()
				
				this.locationResult = `uni-app定位成功！
平台: ${location.platform}
纬度: ${location.latitude}
经度: ${location.longitude}
精度: ${location.accuracy}m
海拔: ${location.altitude || '未知'}m
速度: ${location.speed || '未知'}m/s
地址: ${location.address || '未获取到地址'}`
				
				// 更新地图中心点
				this.latitude = location.latitude
				this.longitude = location.longitude
				
				// 添加当前位置标记
				this.markers = [
					...this.markers,
					{
						id: Date.now(),
						latitude: location.latitude,
						longitude: location.longitude,
						iconPath: '/static/images/nav_map.png',
						width: 25,
						height: 25,
						title: '当前位置'
					}
				]
				
				// 如果没有地址信息，尝试使用WebserviceAPI获取
				if (!location.address) {
					this.getAddressByLocation(location.latitude, location.longitude)
				}
				
			} catch (error) {
				console.error('定位失败:', error)
				this.locationResult = `定位失败: ${error.message}

可能的原因:
1. 未授予位置权限
2. 网络连接问题  
3. 设备定位服务未开启
4. H5需要HTTPS环境
5. 地图配置不正确

建议:
- 检查设备定位权限
- 确保网络连接正常
- H5环境使用HTTPS访问`
			}
		},

		// 选择位置
		async chooseLocation() {
			try {
				const location = await this.uniMapService.chooseLocation()
				
				this.locationResult = `位置选择成功！
名称: ${location.name}
地址: ${location.address}
纬度: ${location.latitude}
经度: ${location.longitude}`
				
				// 更新地图中心点
				this.latitude = location.latitude
				this.longitude = location.longitude
				
				// 添加选择的位置标记
				this.markers.push({
					id: Date.now(),
					latitude: location.latitude,
					longitude: location.longitude,
					iconPath: '/static/images/nav_map_checked.png',
					width: 30,
					height: 30,
					title: location.name
				})
				
			} catch (error) {
				console.error('选择位置失败:', error)
				this.locationResult = `选择位置失败: ${error.message}`
			}
		},

		// 通过坐标获取地址
		async getAddressByLocation(lat, lng) {
			try {
				const result = await this.mapService.reverseGeocoding(lat, lng)
				if (result.result && result.result.address) {
					this.locationResult += `\n\n地址解析成功:
${result.result.address}`
				}
			} catch (error) {
				console.error('地址解析失败:', error)
				this.locationResult += `\n\n地址解析失败: ${error.message}`
			}
		},

		// 测试地理编码
		async testGeocoding() {
			if (!this.testAddress.trim()) {
				uni.showToast({
					title: '请输入地址',
					icon: 'none'
				})
				return
			}

			try {
				this.geocodingResult = '正在查询...'
				const result = await this.mapService.geocoding(this.testAddress)
				
				console.log('地理编码结果:', result)
				
				if (result.result && result.result.location) {
					const location = result.result.location
					this.geocodingResult = `地理编码成功！
地址: ${this.testAddress}
纬度: ${location.lat}
经度: ${location.lng}
置信度: ${result.result.reliability || '未知'}`

					// 在地图上添加标记
					this.markers.push({
						id: Date.now(),
						latitude: location.lat,
						longitude: location.lng,
						iconPath: '/static/images/nav_map_checked.png',
						width: 30,
						height: 30,
						title: this.testAddress
					})
					
					// 移动地图到该位置
					this.latitude = location.lat
					this.longitude = location.lng
				} else {
					this.geocodingResult = '地理编码失败：未找到该地址'
				}
			} catch (error) {
				console.error('地理编码失败:', error)
				this.geocodingResult = `地理编码失败: ${error.message}`
			}
		},

		// 测试逆地理编码
		async testReverseGeocoding() {
			if (!this.testLat || !this.testLng) {
				uni.showToast({
					title: '请输入经纬度',
					icon: 'none'
				})
				return
			}

			try {
				this.reverseGeocodingResult = '正在查询...'
				const result = await this.mapService.reverseGeocoding(this.testLat, this.testLng)
				
				console.log('逆地理编码结果:', result)
				
				if (result.result && result.result.address) {
					this.reverseGeocodingResult = `逆地理编码成功！
坐标: ${this.testLat}, ${this.testLng}
地址: ${result.result.address}
格式化地址: ${result.result.formatted_addresses?.recommend || '未知'}`
				} else {
					this.reverseGeocodingResult = '逆地理编码失败：未找到该坐标对应的地址'
				}
			} catch (error) {
				console.error('逆地理编码失败:', error)
				this.reverseGeocodingResult = `逆地理编码失败: ${error.message}`
			}
		},

		// 测试地点搜索
		async testSearch() {
			if (!this.searchKeyword.trim()) {
				uni.showToast({
					title: '请输入搜索关键词',
					icon: 'none'
				})
				return
			}

			try {
				this.searchResult = '正在搜索...'
				const boundary = `nearby(${this.latitude},${this.longitude},5000)`
				const result = await this.mapService.search(this.searchKeyword, boundary, 5)
				
				console.log('地点搜索结果:', result)
				
				if (result.data && result.data.length > 0) {
					const places = result.data.slice(0, 3) // 只显示前3个结果
					this.searchResult = `搜索成功！找到 ${result.count} 个结果：\n` +
						places.map((place, index) => 
							`${index + 1}. ${place.title}\n   地址: ${place.address}\n   距离: ${place.distance || '未知'}m`
						).join('\n\n')
					
					// 在地图上添加搜索结果标记
					places.forEach((place, index) => {
						if (place.location) {
							this.markers.push({
								id: Date.now() + index,
								latitude: place.location.lat,
								longitude: place.location.lng,
								iconPath: '/static/images/nav_map.png',
								width: 25,
								height: 25,
								title: place.title
							})
						}
					})
				} else {
					this.searchResult = '搜索失败：未找到相关地点'
				}
			} catch (error) {
				console.error('地点搜索失败:', error)
				this.searchResult = `搜索失败: ${error.message}`
			}
		},

		// 地图标记点击
		onMarkerTap(e) {
			console.log('标记点击:', e)
			const marker = this.markers.find(m => m.id === e.detail.markerId)
			if (marker) {
				uni.showToast({
					title: marker.title || '标记点',
					icon: 'none'
				})
			}
		},

		// 地图点击
		onMapTap(e) {
			console.log('地图点击:', e)
			const { latitude, longitude } = e.detail
			
			// 添加点击位置标记
			this.markers.push({
				id: Date.now(),
				latitude: latitude,
				longitude: longitude,
				iconPath: '/static/images/nav_map.png',
				width: 20,
				height: 20,
				title: `点击位置 (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`
			})
		}
	}
}
</script>

<style lang="scss" scoped>
.page {
	background-color: #f5f5f5;
	min-height: 100vh;
}

.header {
	background: linear-gradient(135deg, #2F7FF0 0%, #1E6FDB 100%);
	padding: 60rpx 40rpx 40rpx;
	
	.title {
		color: white;
		font-size: 36rpx;
		font-weight: bold;
	}
}

.content {
	padding: 20rpx;
}

.map-section, .test-section, .config-section {
	background: white;
	border-radius: 16rpx;
	padding: 30rpx;
	margin-bottom: 20rpx;
	box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.1);
}

.section-title {
	font-size: 32rpx;
	font-weight: bold;
	color: #333;
	margin-bottom: 20rpx;
}

.test-map {
	width: 100%;
	height: 400rpx;
	border-radius: 12rpx;
}

.button-group {
	display: flex;
	gap: 15rpx;
	margin-bottom: 20rpx;
}

.button-group .test-btn {
	flex: 1;
}

.input-group {
	display: flex;
	flex-direction: column;
	gap: 15rpx;
	margin-bottom: 20rpx;
}

.test-input {
	height: 80rpx;
	padding: 0 20rpx;
	border: 2rpx solid #e0e0e0;
	border-radius: 8rpx;
	font-size: 28rpx;
}

.test-btn {
	height: 80rpx;
	background: #2F7FF0;
	color: white;
	border: none;
	border-radius: 8rpx;
	font-size: 28rpx;
}

.result-box {
	background: #f8f9fa;
	padding: 20rpx;
	border-radius: 8rpx;
	border-left: 4rpx solid #2F7FF0;
	margin-top: 20rpx;
}

.result-text {
	font-size: 24rpx;
	color: #333;
	line-height: 1.6;
	white-space: pre-wrap;
	font-family: monospace;
}

.config-info {
	display: flex;
	flex-direction: column;
	gap: 10rpx;
}

.config-item {
	font-size: 26rpx;
	color: #666;
	padding: 10rpx 0;
	border-bottom: 1rpx solid #f0f0f0;
}
</style>