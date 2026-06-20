<template>
	<view class="page">
		<view class="header">
			<text class="title">基础地图功能测试</text>
		</view>
		
		<view class="content">
			<!-- 地图显示 -->
			<view class="map-section">
				<view class="section-title">地图显示测试</view>
				<map 
					id="simpleMap" 
					class="simple-map" 
					:latitude="latitude" 
					:longitude="longitude" 
					:scale="scale"
					:markers="markers"
					@markertap="onMarkerTap"
					@tap="onMapTap"
					@regionchange="onRegionChange">
				</map>
				<view class="map-info">
					<text class="info-text">中心点: {{ latitude.toFixed(4) }}, {{ longitude.toFixed(4) }}</text>
					<text class="info-text">缩放级别: {{ scale }}</text>
					<text class="info-text">标记数量: {{ markers.length }}</text>
				</view>
			</view>

			<!-- 基础功能测试 -->
			<view class="test-section">
				<view class="section-title">基础功能测试</view>
				<view class="button-grid">
					<button class="test-btn" @click="runDiagnostic">运行诊断</button>
					<button class="test-btn" @click="getCurrentLocation">获取位置</button>
					<button class="test-btn" @click="addRandomMarker">添加标记</button>
					<button class="test-btn" @click="clearMarkers">清除标记</button>
				</view>
			</view>

			<!-- 测试结果 -->
			<view class="result-section" v-if="testResult">
				<view class="section-title">测试结果</view>
				<view class="result-box">
					<text class="result-text">{{ testResult }}</text>
				</view>
			</view>

			<!-- 平台信息 -->
			<view class="info-section">
				<view class="section-title">平台信息</view>
				<view class="platform-info">
					<text class="info-item">当前平台: {{ platform }}</text>
					<text class="info-item">地图服务商: {{ mapProvider }}</text>
					<text class="info-item">定位服务: {{ locationService }}</text>
					<text class="info-item">是否需要Key: {{ needsKey ? '是' : '否' }}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			latitude: 22.5431, // 深圳坐标
			longitude: 113.9434,
			scale: 15,
			markers: [
				{
					id: 1,
					latitude: 22.5431,
					longitude: 113.9434,
					iconPath: '/static/images/nav_map_checked.png',
					width: 30,
					height: 30,
					title: '默认位置',
					callout: {
						content: '深圳市南山区',
						color: '#333',
						fontSize: 14,
						bgColor: '#fff',
						borderRadius: 5,
						padding: 5
					}
				}
			],
			testResult: '',
			platform: '',
			mapProvider: '',
			locationService: '',
			needsKey: false
		}
	},
	onLoad() {
		this.initPlatformInfo()
		this.testResult = '页面加载完成，地图初始化中...'
		
		// 监听控制台输出（如果可能）
		this.checkConsoleWarnings()
		
		// 延迟测试地图是否正常显示
		setTimeout(() => {
			this.testMapDisplay()
		}, 1000)
	},
	methods: {
		// 运行地图诊断
		async runDiagnostic() {
			this.testResult = '正在运行地图诊断...'
			
			try {
				// 导入诊断工具
				const MapDiagnostic = (await import('@/static/js/mapDiagnostic.js')).default
				
				// 检查配置
				const configCheck = MapDiagnostic.checkMapConfig()
				
				// 测试地图组件
				const mapTest = await MapDiagnostic.testMapComponent('simpleMap')
				
				// 测试定位功能
				const locationTest = await MapDiagnostic.testLocation()
				
				// 生成报告
				const report = MapDiagnostic.generateReport(configCheck, mapTest, locationTest)
				
				// 显示报告
				this.testResult = MapDiagnostic.formatReportText(report)
				
				// 如果定位成功，更新地图位置
				if (locationTest.success && locationTest.data) {
					this.latitude = locationTest.data.latitude
					this.longitude = locationTest.data.longitude
					
					// 添加当前位置标记
					this.markers.push({
						id: Date.now(),
						latitude: locationTest.data.latitude,
						longitude: locationTest.data.longitude,
						iconPath: '/static/images/nav_map.png',
						width: 25,
						height: 25,
						title: '诊断定位',
						callout: {
							content: '诊断定位成功',
							color: '#333',
							fontSize: 12,
							bgColor: '#fff',
							borderRadius: 3,
							padding: 3
						}
					})
				}
				
			} catch (error) {
				console.error('诊断失败:', error)
				this.testResult = `❌ 诊断异常: ${error.message}`
			}
		},

		// 初始化平台信息
		initPlatformInfo() {
			// #ifdef H5
			this.platform = 'H5'
			this.mapProvider = '腾讯地图'
			this.locationService = '浏览器Geolocation'
			this.needsKey = false // 基础功能不需要
			// #endif
			
			// #ifdef MP-WEIXIN
			this.platform = '微信小程序'
			this.mapProvider = '腾讯地图'
			this.locationService = '微信内置'
			this.needsKey = false
			// #endif
			
			// #ifdef APP-PLUS
			this.platform = 'App'
			this.mapProvider = '高德地图'
			this.locationService = '系统定位'
			this.needsKey = false // 基础功能不需要
			// #endif
		},

		// 检查控制台警告
		checkConsoleWarnings() {
			// 在H5环境下提示用户检查控制台
			// #ifdef H5
			setTimeout(() => {
				if (this.testResult.includes('地图初始化中')) {
					this.testResult += '\n\n💡 提示: 请检查浏览器控制台是否有地图相关警告'
				}
			}, 2000)
			// #endif
		},

		// 测试地图显示
		testMapDisplay() {
			try {
				const mapContext = uni.createMapContext('simpleMap', this)
				if (mapContext) {
					this.testResult = '✅ 地图组件创建成功\n地图应该正常显示'
				} else {
					this.testResult = '❌ 地图组件创建失败'
				}
			} catch (error) {
				this.testResult = `❌ 地图初始化异常: ${error.message}`
			}
		},

		// 获取当前位置
		async getCurrentLocation() {
			this.testResult = '正在获取当前位置...'
			
			try {
				// 直接使用智能定位逻辑
				const location = await this.getLocationSmart()
				
				this.testResult = `✅ 定位成功！
定位方式: ${location.source}
纬度: ${location.latitude ? location.latitude.toFixed(6) : '未知'}
经度: ${location.longitude ? location.longitude.toFixed(6) : '未知'}
精度: ${location.accuracy || '未知'}米
海拔: ${location.altitude || '未知'}米
速度: ${location.speed || '未知'}m/s
时间戳: ${location.timestamp ? new Date(location.timestamp).toLocaleString() : '未知'}`
				
				// 更新地图中心点
				this.latitude = location.latitude
				this.longitude = location.longitude
				
				// 添加当前位置标记
				this.markers.push({
					id: Date.now(),
					latitude: location.latitude,
					longitude: location.longitude,
					iconPath: '/static/images/nav_map.png',
					width: 25,
					height: 25,
					title: '当前位置',
					callout: {
						content: `当前位置 (${location.source})`,
						color: '#333',
						fontSize: 12,
						bgColor: '#fff',
						borderRadius: 3,
						padding: 3
					}
				})
				
			} catch (error) {
				console.error('定位失败:', error)
				this.testResult = `❌ 定位失败: ${error.message}

可能原因:
• 用户拒绝了位置权限
• 设备定位服务未开启
• 网络连接问题
• 签名验证失败 (H5平台)

建议解决方案:
• 检查浏览器位置权限设置
• 确保在HTTPS环境下访问
• 尝试刷新页面重新授权`

				// 如果是H5平台，提供额外的解决建议
				// #ifdef H5
				this.testResult += `

H5平台特别说明:
• 浏览器会自动选择最佳定位方案
• 如遇签名验证问题，会自动切换到浏览器原生定位
• 首次访问需要用户授权位置权限`
				// #endif
			}
		},

		// 智能定位方法
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
		},

		// 浏览器原生定位
		async getLocationByBrowser() {
			return new Promise((resolve, reject) => {
				if (!navigator.geolocation) {
					reject(new Error('浏览器不支持定位功能'))
					return
				}

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

		// 添加随机标记
		addRandomMarker() {
			const randomLat = this.latitude + (Math.random() - 0.5) * 0.01
			const randomLng = this.longitude + (Math.random() - 0.5) * 0.01
			
			const marker = {
				id: Date.now(),
				latitude: randomLat,
				longitude: randomLng,
				iconPath: '/static/images/nav_map.png',
				width: 20,
				height: 20,
				title: `标记${this.markers.length}`,
				callout: {
					content: `随机标记 ${this.markers.length}`,
					color: '#333',
					fontSize: 12,
					bgColor: '#fff',
					borderRadius: 3,
					padding: 3
				}
			}
			
			this.markers.push(marker)
			this.testResult = `✅ 添加标记成功\n当前标记数量: ${this.markers.length}`
		},

		// 清除标记
		clearMarkers() {
			this.markers = []
			this.testResult = '✅ 已清除所有标记'
		},

		// 移动到指定位置
		moveToLocation() {
			const mapContext = uni.createMapContext('simpleMap', this)
			
			// 移动到深圳市中心
			const targetLat = 22.5431
			const targetLng = 113.9434
			
			this.latitude = targetLat
			this.longitude = targetLng
			
			mapContext.moveToLocation({
				latitude: targetLat,
				longitude: targetLng,
				success: () => {
					this.testResult = '✅ 地图移动成功\n已移动到深圳市中心'
				},
				fail: (error) => {
					this.testResult = `❌ 地图移动失败: ${error.errMsg}`
				}
			})
		},

		// 标记点击事件
		onMarkerTap(e) {
			const markerId = e.detail.markerId
			const marker = this.markers.find(m => m.id === markerId)
			
			if (marker) {
				this.testResult = `📍 点击了标记: ${marker.title}\n坐标: ${marker.latitude.toFixed(4)}, ${marker.longitude.toFixed(4)}`
				
				uni.showToast({
					title: marker.title,
					icon: 'none'
				})
			}
		},

		// 地图点击事件
		onMapTap(e) {
			const { latitude, longitude } = e.detail
			this.testResult = `🗺️ 点击地图\n坐标: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`
		},

		// 地图区域变化事件
		onRegionChange(e) {
			if (e.detail.type === 'end') {
				// 安全地获取经纬度和缩放级别，防止undefined值
				const { centerLocation, scale } = e.detail;
						
				// 根据不同平台的事件对象结构处理
				if (centerLocation && centerLocation.latitude !== undefined && centerLocation.longitude !== undefined) {
					// 微信小程序等平台使用 centerLocation
					this.latitude = centerLocation.latitude;
					this.longitude = centerLocation.longitude;
				} else if (e.detail.latitude !== undefined && e.detail.longitude !== undefined) {
					// 其他平台可能直接提供 latitude 和 longitude
					this.latitude = e.detail.latitude;
					this.longitude = e.detail.longitude;
				}
						
				if (scale !== undefined) {
					this.scale = scale;
				}
			}
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

.map-section, .test-section, .result-section, .info-section {
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

.simple-map {
	width: 100%;
	height: 400rpx;
	border-radius: 12rpx;
	border: 2rpx solid #e0e0e0;
}

.map-info {
	margin-top: 15rpx;
	padding: 15rpx;
	background: #f8f9fa;
	border-radius: 8rpx;
}

.info-text {
	display: block;
	font-size: 24rpx;
	color: #666;
	margin-bottom: 5rpx;
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

.platform-info {
	display: flex;
	flex-direction: column;
	gap: 10rpx;
}

.info-item {
	font-size: 26rpx;
	color: #666;
	padding: 10rpx 0;
	border-bottom: 1rpx solid #f0f0f0;
}
</style>