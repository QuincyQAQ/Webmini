<template>
	<view class="page">
		<view class="header">
			<text class="title">地图配置检查</text>
		</view>
		
		<view class="content">
			<!-- 配置状态 -->
			<view class="config-section">
				<view class="section-title">当前配置状态</view>
				<view class="config-item">
					<text class="config-label">平台:</text>
					<text class="config-value">{{ platform }}</text>
				</view>
				<view class="config-item">
					<text class="config-label">地图服务商:</text>
					<text class="config-value">{{ mapProvider }}</text>
				</view>
				<view class="config-item">
					<text class="config-label">API Key状态:</text>
					<text class="config-value" :class="keyStatus.class">{{ keyStatus.text }}</text>
				</view>
				<view class="config-item">
					<text class="config-label">定位服务:</text>
					<text class="config-value">{{ locationService }}</text>
				</view>
				<view class="config-item">
					<text class="config-label">签名验证:</text>
					<text class="config-value" :class="signatureStatus.class">{{ signatureStatus.text }}</text>
				</view>
			</view>

			<!-- 控制台检查 -->
			<view class="console-section">
				<view class="section-title">控制台检查</view>
				<view class="console-info">
					<text class="console-text">请打开浏览器开发者工具(F12)，查看Console面板：</text>
					<text class="console-item">✅ 无警告 - 配置正确</text>
					<text class="console-item">⚠️ "Map key not configured" - 需要配置API Key</text>
					<text class="console-item">❌ 其他错误 - 需要进一步排查</text>
				</view>
			</view>

			<!-- 配置建议 -->
			<view class="suggestion-section">
				<view class="section-title">配置建议</view>
				<view class="suggestion-content">
					<text class="suggestion-title">当前平台: {{ platform }}</text>
					<view class="suggestion-list">
						<text class="suggestion-item" v-for="(suggestion, index) in suggestions" :key="index">
							{{ index + 1 }}. {{ suggestion }}
						</text>
					</view>
				</view>
			</view>

			<!-- 快速修复 -->
			<view class="fix-section">
				<view class="section-title">快速修复</view>
				<view class="fix-buttons">
					<button class="fix-btn" @click="showManifestConfig">查看manifest.json配置</button>
					<button class="fix-btn" @click="testMapFunction">测试地图功能</button>
					<button class="fix-btn" @click="openTroubleshooting">查看排查指南</button>
				</view>
			</view>

			<!-- 配置代码 -->
			<view class="code-section" v-if="showConfig">
				<view class="section-title">manifest.json 配置</view>
				<view class="code-block">
					<text class="code-text">{{ manifestConfig }}</text>
				</view>
				<button class="copy-btn" @click="copyConfig">复制配置</button>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			platform: '',
			mapProvider: '',
			locationService: '',
			keyStatus: {
				text: '检查中...',
				class: 'status-checking'
			},
			signatureStatus: {
				text: '检查中...',
				class: 'status-checking'
			},
			suggestions: [],
			showConfig: false,
			manifestConfig: ''
		}
	},
	onLoad() {
		this.initPlatformInfo()
		this.checkConfiguration()
		this.generateSuggestions()
	},
	methods: {
		// 初始化平台信息
		initPlatformInfo() {
			// #ifdef H5
			this.platform = 'H5'
			this.mapProvider = '腾讯地图'
			this.locationService = '智能定位 (浏览器优先)'
			// #endif
			
			// #ifdef MP-WEIXIN
			this.platform = '微信小程序'
			this.mapProvider = '腾讯地图'
			this.locationService = '微信内置'
			// #endif
			
			// #ifdef APP-PLUS
			this.platform = 'App'
			this.mapProvider = '高德地图'
			this.locationService = '系统定位'
			// #endif
		},

		// 检查配置状态
		checkConfiguration() {
			switch (this.platform) {
				case 'H5':
					this.keyStatus = {
						text: '已配置腾讯地图Key + SecretKey',
						class: 'status-good'
					}
					this.signatureStatus = {
						text: '支持签名验证 + 浏览器原生定位',
						class: 'status-good'
					}
					this.manifestConfig = `"h5": {
    "sdkConfigs": {
        "maps": {
            "qqmap": {
                "key": "PX5BZ-MQJYQ-YMI5U-2UCDF-7YKTZ-OHFNX",
                "secretKey": "dXmQIt5Mlk2sPzBaxBrCy86IVRw0UIyQ"
            }
        }
    }
}`
					break
				case '微信小程序':
					this.keyStatus = {
						text: '无需配置Key',
						class: 'status-good'
					}
					this.signatureStatus = {
						text: '无需签名验证',
						class: 'status-good'
					}
					this.manifestConfig = `"mp-weixin": {
    "permission": {
        "scope.userLocation": {
            "desc": "用户提供精准位置服务"
        }
    }
}`
					break
				case 'App':
					this.keyStatus = {
						text: '基础功能无需Key',
						class: 'status-good'
					}
					this.signatureStatus = {
						text: '无需签名验证',
						class: 'status-good'
					}
					this.manifestConfig = `"app-plus": {
    "distribute": {
        "sdkConfigs": {
            "maps": {
                "amap": {
                    "appkey_ios": "your-ios-key",
                    "appkey_android": "your-android-key"
                }
            }
        }
    }
}`
					break
			}
		},

		// 生成建议
		generateSuggestions() {
			switch (this.platform) {
				case 'H5':
					this.suggestions = [
						'已为H5平台配置腾讯地图API Key和Secret Key',
						'智能定位服务：优先使用浏览器原生定位，避免签名验证问题',
						'如果uni.getLocation失败，会自动切换到浏览器Geolocation API',
						'确保在HTTPS环境下访问以获得最佳体验',
						'首次访问需要用户授权位置权限'
					]
					break
				case '微信小程序':
					this.suggestions = [
						'微信小程序使用内置地图服务',
						'已配置位置权限 scope.userLocation',
						'在真机上测试时需要用户授权位置权限',
						'开发者工具中可以模拟位置信息'
					]
					break
				case 'App':
					this.suggestions = [
						'App平台使用高德地图服务',
						'基础功能（显示、定位）无需API Key',
						'高级功能需要申请高德地图API Key',
						'真机测试时需要位置权限'
					]
					break
			}
		},

		// 显示manifest配置
		showManifestConfig() {
			this.showConfig = !this.showConfig
		},

		// 测试地图功能
		testMapFunction() {
			uni.navigateTo({
				url: '/pages/mock/simpleMapTest'
			})
		},

		// 打开排查指南
		openTroubleshooting() {
			uni.showModal({
				title: '排查指南',
				content: '请查看项目文档中的 docs/map-troubleshooting.md 文件，获取详细的问题排查步骤。',
				showCancel: false
			})
		},

		// 复制配置
		copyConfig() {
			// #ifdef H5
			if (navigator.clipboard) {
				navigator.clipboard.writeText(this.manifestConfig).then(() => {
					uni.showToast({
						title: '配置已复制',
						icon: 'success'
					})
				})
			} else {
				uni.showToast({
					title: '请手动复制配置',
					icon: 'none'
				})
			}
			// #endif
			
			// #ifndef H5
			uni.showToast({
				title: '请手动复制配置',
				icon: 'none'
			})
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

.config-section, .console-section, .suggestion-section, .fix-section, .code-section {
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

.config-item {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 15rpx 0;
	border-bottom: 1rpx solid #f0f0f0;
}

.config-label {
	font-size: 28rpx;
	color: #666;
}

.config-value {
	font-size: 28rpx;
	font-weight: bold;
}

.status-good {
	color: #19be6b;
}

.status-warning {
	color: #ff9900;
}

.status-error {
	color: #fa3534;
}

.status-checking {
	color: #909399;
}

.console-info {
	display: flex;
	flex-direction: column;
	gap: 10rpx;
}

.console-text {
	font-size: 26rpx;
	color: #333;
	margin-bottom: 15rpx;
}

.console-item {
	font-size: 24rpx;
	color: #666;
	padding: 8rpx 0;
	padding-left: 20rpx;
}

.suggestion-content {
	display: flex;
	flex-direction: column;
	gap: 15rpx;
}

.suggestion-title {
	font-size: 28rpx;
	font-weight: bold;
	color: #2F7FF0;
	margin-bottom: 10rpx;
}

.suggestion-list {
	display: flex;
	flex-direction: column;
	gap: 10rpx;
}

.suggestion-item {
	font-size: 26rpx;
	color: #666;
	line-height: 1.5;
}

.fix-buttons {
	display: flex;
	flex-direction: column;
	gap: 15rpx;
}

.fix-btn {
	height: 80rpx;
	background: #2F7FF0;
	color: white;
	border: none;
	border-radius: 8rpx;
	font-size: 28rpx;
}

.fix-btn:active {
	background: #1E6FDB;
}

.code-block {
	background: #f8f9fa;
	padding: 20rpx;
	border-radius: 8rpx;
	border-left: 4rpx solid #2F7FF0;
	margin-bottom: 20rpx;
}

.code-text {
	font-size: 24rpx;
	color: #333;
	line-height: 1.6;
	white-space: pre-wrap;
	font-family: 'Courier New', monospace;
}

.copy-btn {
	height: 60rpx;
	background: #19be6b;
	color: white;
	border: none;
	border-radius: 6rpx;
	font-size: 26rpx;
}
</style>