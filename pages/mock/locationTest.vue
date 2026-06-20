<template>
	<view class="page">
		<view class="header">
			<text class="title">定位功能测试</text>
		</view>
		
		<view class="content">
			<!-- 定位测试 -->
			<view class="test-section">
				<view class="section-title">定位方式测试</view>
				<view class="button-grid">
					<button class="test-btn" @click="testBrowserLocation">浏览器定位</button>
					<button class="test-btn" @click="testUniAppLocation">uni-app定位</button>
					<button class="test-btn" @click="testSmartLocation">智能定位</button>
					<button class="test-btn" @click="checkPermission">检查权限</button>
				</view>
			</view>

			<!-- 测试结果 -->
			<view class="result-section" v-if="testResult">
				<view class="section-title">测试结果</view>
				<view class="result-box">
					<text class="result-text">{{ testResult }}</text>
				</view>
			</view>

			<!-- 位置信息 -->
			<view class="location-section" v-if="locationData">
				<view class="section-title">位置信息</view>
				<view class="location-info">
					<view class="info-item">
						<text class="info-label">定位方式:</text>
						<text class="info-value">{{ locationData.source }}</text>
					</view>
					<view class="info-item">
						<text class="info-label">纬度:</text>
						<text class="info-value">{{ locationData.latitude ? locationData.latitude.toFixed(6) : '未知' }}</text>
					</view>
					<view class="info-item">
						<text class="info-label">经度:</text>
						<text class="info-value">{{ locationData.longitude ? locationData.longitude.toFixed(6) : '未知' }}</text>
					</view>
					<view class="info-item">
						<text class="info-label">精度:</text>
						<text class="info-value">{{ locationData.accuracy ? locationData.accuracy + '米' : '未知' }}</text>
					</view>
					<view class="info-item" v-if="locationData.altitude">
						<text class="info-label">海拔:</text>
						<text class="info-value">{{ locationData.altitude }}米</text>
					</view>
					<view class="info-item" v-if="locationData.speed">
						<text class="info-label">速度:</text>
						<text class="info-value">{{ locationData.speed }}m/s</text>
					</view>
				</view>
			</view>

			<!-- 平台信息 -->
			<view class="platform-section">
				<view class="section-title">平台信息</view>
				<view class="platform-info">
					<text class="platform-item">当前平台: {{ platform }}</text>
					<text class="platform-item">浏览器支持: {{ browserSupport ? '是' : '否' }}</text>
					<text class="platform-item">HTTPS环境: {{ isHTTPS ? '是' : '否' }}</text>
					<text class="platform-item">权限状态: {{ permissionStatus }}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			testResult: '',
			locationData: null,
			platform: '',
			browserSupport: false,
			isHTTPS: false,
			permissionStatus: '未知'
		}
	},
	onLoad() {
		this.initPlatformInfo()
	},
	methods: {
		// 初始化平台信息
		initPlatformInfo() {
			// #ifdef H5
			this.platform = 'H5'
			this.browserSupport = !!navigator.geolocation
			this.isHTTPS = location.protocol === 'https:' || location.hostname === 'localhost'
			// #endif
			
			// #ifdef MP-WEIXIN
			this.platform = '微信小程序'
			this.browserSupport = false
			this.isHTTPS = true
			// #endif
			
			// #ifdef APP-PLUS
			this.platform = 'App'
			this.browserSupport = false
			this.isHTTPS = true
			// #endif
		},

		// 测试浏览器定位
		async testBrowserLocation() {
			this.testResult = '正在使用浏览器定位...'
			this.locationData = null
			this.startTime = Date.now()
			
			// #ifdef H5
			if (!navigator.geolocation) {
				this.testResult = '❌ 浏览器不支持定位功能'
				return
			}

			try {
				const location = await this.getLocationByBrowser()
				// 确保location对象有必要的属性
				this.locationData = {
					latitude: location.latitude || 0,
					longitude: location.longitude || 0,
					accuracy: location.accuracy || 0,
					altitude: location.altitude || null,
					speed: location.speed || null,
					source: location.source || 'browser-geolocation'
				}
				this.testResult = `✅ 浏览器定位成功！
耗时: ${Date.now() - this.startTime}ms`
			} catch (error) {
				this.locationData = null
				this.testResult = `❌ 浏览器定位失败: ${error.message}`
			}
			// #endif
			
			// #ifndef H5
			this.testResult = '❌ 当前平台不支持浏览器定位'
			// #endif
		},

		// 测试uni-app定位
		async testUniAppLocation() {
			this.testResult = '正在使用uni-app定位...'
			this.locationData = null
			this.startTime = Date.now()

			try {
				const location = await this.getLocationByUniApp()
				// 确保location对象有必要的属性
				this.locationData = {
					latitude: location.latitude || 0,
					longitude: location.longitude || 0,
					accuracy: location.accuracy || 0,
					altitude: location.altitude || null,
					speed: location.speed || null,
					source: location.source || 'uni-app'
				}
				this.testResult = `✅ uni-app定位成功！
耗时: ${Date.now() - this.startTime}ms`
			} catch (error) {
				this.locationData = null
				this.testResult = `❌ uni-app定位失败: ${error.message}`
			}
		},

		// 测试智能定位
		async testSmartLocation() {
			this.testResult = '正在使用智能定位...'
			this.locationData = null
			this.startTime = Date.now()

			try {
				const location = await this.getLocationSmart()
				// 确保location对象有必要的属性
				this.locationData = {
					latitude: location.latitude || 0,
					longitude: location.longitude || 0,
					accuracy: location.accuracy || 0,
					altitude: location.altitude || null,
					speed: location.speed || null,
					source: location.source || 'smart-location'
				}
				this.testResult = `✅ 智能定位成功！
使用方式: ${location.source}
耗时: ${Date.now() - this.startTime}ms`
			} catch (error) {
				this.locationData = null
				this.testResult = `❌ 智能定位失败: ${error.message}`
			}
		},

		// 检查权限
		async checkPermission() {
			this.testResult = '正在检查定位权限...'
			
			// #ifdef H5
			if ('permissions' in navigator) {
				try {
					const permission = await navigator.permissions.query({ name: 'geolocation' })
					this.permissionStatus = permission.state
					this.testResult = `权限状态: ${permission.state}
- granted: 已授权
- denied: 已拒绝
- prompt: 需要询问用户`
				} catch (error) {
					this.testResult = `权限检查失败: ${error.message}`
				}
			} else {
				this.testResult = '浏览器不支持权限查询API'
			}
			// #endif
			
			// #ifndef H5
			this.testResult = '当前平台权限由系统管理'
			// #endif
		},

		// 浏览器原生定位
		async getLocationByBrowser() {
			return new Promise((resolve, reject) => {
				const options = {
					enableHighAccuracy: true,
					timeout: 10000,
					maximumAge: 60000
				}

				navigator.geolocation.getCurrentPosition(
					(position) => {
						const coords = position.coords
						resolve({
							latitude: coords.latitude,
							longitude: coords.longitude,
							accuracy: coords.accuracy,
							altitude: coords.altitude,
							speed: coords.speed,
							heading: coords.heading,
							timestamp: position.timestamp,
							source: 'browser-geolocation'
						})
					},
					(error) => {
						let errorMessage = '浏览器定位失败'
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
						}
						reject(new Error(errorMessage))
					},
					options
				)
			})
		},

		// uni-app定位
		async getLocationByUniApp() {
			return new Promise((resolve, reject) => {
				// 尝试不同的坐标系类型和配置组合
				const locationOptions = [
					{ type: 'wgs84', name: 'WGS84', altitude: false },
					{ type: 'gcj02', name: 'GCJ02', altitude: false },
					{ type: undefined, name: '默认', altitude: false },
					{ type: 'wgs84', name: 'WGS84-简化', altitude: false, isHighAccuracy: false },
					{ type: undefined, name: '最简配置', altitude: false, isHighAccuracy: false }
				]
				
				this.tryUniLocationWithOptions(locationOptions, 0, resolve, reject)
			})
		},

		// 尝试不同的uni-app定位选项
		tryUniLocationWithOptions(options, index, resolve, reject) {
			if (index >= options.length) {
				reject(new Error('所有坐标系类型都失败了'))
				return
			}

			const currentOption = options[index]
			const locationConfig = {
				altitude: currentOption.altitude !== undefined ? currentOption.altitude : false,
				timeout: 15000,
				isHighAccuracy: currentOption.isHighAccuracy !== undefined ? currentOption.isHighAccuracy : true,
				success: (res) => {
					// 确保返回的数据有必要的属性
					const validatedResult = {
						latitude: res.latitude || 0,
						longitude: res.longitude || 0,
						accuracy: res.accuracy || 0,
						altitude: res.altitude || null,
						speed: res.speed || null,
						heading: res.heading || null,
						timestamp: res.timestamp || Date.now(),
						source: `uni-app (${currentOption.name})`
					}
					resolve(validatedResult)
				},
				fail: (error) => {
					console.warn(`uni-app定位失败 (${currentOption.name}):`, error.errMsg)
					// 尝试下一个选项
					this.tryUniLocationWithOptions(options, index + 1, resolve, reject)
				}
			}

			// 只有在type有值时才添加type参数
			if (currentOption.type) {
				locationConfig.type = currentOption.type
			}

			console.log(`尝试uni-app定位 (${currentOption.name}):`, locationConfig)
			uni.getLocation(locationConfig)
		},

		// 智能定位
		async getLocationSmart() {
			// H5平台优先使用浏览器原生定位
			// #ifdef H5
			try {
				return await this.getLocationByBrowser()
			} catch (error) {
				console.warn('浏览器定位失败，尝试uni-app定位:', error.message)
				return await this.getLocationByUniApp()
			}
			// #endif
			
			// 其他平台使用uni-app定位
			// #ifndef H5
			return await this.getLocationByUniApp()
			// #endif
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

.test-section, .result-section, .location-section, .platform-section {
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

.button-grid {
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 15rpx;
}

.test-btn {
	height: 70rpx;
	background: #2F7FF0;
	color: white;
	border: none;
	border-radius: 8rpx;
	font-size: 26rpx;
}

.test-btn:active {
	background: #1E6FDB;
}

.result-box {
	background: #f8f9fa;
	padding: 20rpx;
	border-radius: 8rpx;
	border-left: 4rpx solid #2F7FF0;
}

.result-text {
	font-size: 24rpx;
	color: #333;
	line-height: 1.6;
	white-space: pre-wrap;
}

.location-info, .platform-info {
	display: flex;
	flex-direction: column;
	gap: 15rpx;
}

.info-item {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 10rpx 0;
	border-bottom: 1rpx solid #f0f0f0;
}

.info-label {
	font-size: 26rpx;
	color: #666;
}

.info-value {
	font-size: 26rpx;
	color: #333;
	font-weight: bold;
}

.platform-item {
	font-size: 26rpx;
	color: #666;
	padding: 8rpx 0;
}
</style>