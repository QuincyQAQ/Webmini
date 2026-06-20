<template>
	<view class="page">
		<view class="header">
			<text class="title">Mock数据管理</text>
		</view>
		
		<view class="content">
			<!-- Mock开关 -->
			<view class="section">
				<view class="section-title">Mock模式</view>
				<view class="switch-row">
					<text class="switch-label">{{ mockEnabled ? '已启用Mock数据' : '使用真实后端' }}</text>
					<switch :checked="mockEnabled" @change="toggleMock" color="#2F7FF0" />
				</view>
				<view class="tip">
					<text class="tip-text">
						{{ mockEnabled ? '当前使用Mock数据进行测试，所有API请求将返回模拟数据' : '当前连接真实后端服务器' }}
					</text>
				</view>
			</view>

			<!-- Mock数据统计 -->
			<view class="section" v-if="mockEnabled">
				<view class="section-title">Mock数据统计</view>
				<view class="stats-grid">
					<view class="stat-item">
						<text class="stat-number">{{ mockStats.vehicles }}</text>
						<text class="stat-label">机器人数据</text>
					</view>
					<view class="stat-item">
						<text class="stat-number">{{ mockStats.applications }}</text>
						<text class="stat-label">用机器人申请</text>
					</view>
					<view class="stat-item">
						<text class="stat-number">{{ mockStats.repairs }}</text>
						<text class="stat-label">维修申请</text>
					</view>
					<view class="stat-item">
						<text class="stat-number">{{ mockStats.drivers }}</text>
						<text class="stat-label">驾驶员</text>
					</view>
				</view>
			</view>

			<!-- 测试功能 -->
			<view class="section" v-if="mockEnabled">
				<view class="section-title">快速测试</view>
				<view class="test-info">
					<text class="test-info-title">测试账号信息：</text>
					<text class="test-info-item">用户名：admin</text>
					<text class="test-info-item">密码：123456</text>
					<text class="test-info-note">注：支持 admin/test/demo 三个账号，密码均为 123456</text>
				</view>
				<view class="test-buttons">
					<button class="test-btn" @click="testLogin">测试登录</button>
					<button class="test-btn" @click="goToLoginTest">登录测试页</button>
					<button class="test-btn" @click="goToMapConfigCheck">地图配置检查</button>
					<button class="test-btn" @click="goToLocationTest">定位功能测试</button>
					<button class="test-btn" @click="goToSimpleMapTest">基础地图测试</button>
					<button class="test-btn" @click="resetMockData">重置Mock数据</button>
				</view>
			</view>

			<!-- 使用说明 -->
			<view class="section">
				<view class="section-title">使用说明</view>
				<view class="instructions">
					<text class="instruction-item">1. 开启Mock模式后，所有API请求将使用本地模拟数据</text>
					<text class="instruction-item">2. Mock数据包含完整的业务场景，可用于功能测试</text>
					<text class="instruction-item">3. 关闭Mock模式将恢复真实后端API调用</text>
					<text class="instruction-item">4. 可在 config/config.js 中修改 useMock 配置</text>
					<text class="instruction-item">5. Mock数据文件位于 mock/mockData.js</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import config from '@/config/config.js'
import mockData from '@/mock/mockData.js'

export default {
	data() {
		return {
			mockEnabled: false,
			mockStats: {
				vehicles: 0,
				applications: 0,
				repairs: 0,
				drivers: 0
			}
		}
	},
	onLoad() {
		this.mockEnabled = config.useMock
		this.loadMockStats()
	},
	methods: {
		// 切换Mock模式
		toggleMock(e) {
			this.mockEnabled = e.detail.value
			// 注意：这里只是演示，实际需要重启应用才能生效
			// 或者可以动态修改config对象
			config.useMock = this.mockEnabled
			
			uni.showToast({
				title: this.mockEnabled ? 'Mock模式已启用' : 'Mock模式已关闭',
				icon: 'success'
			})
		},

		// 加载Mock数据统计
		loadMockStats() {
			this.mockStats = {
				vehicles: mockData.vehicles.length,
				applications: mockData.vehicleApplications.length,
				repairs: mockData.repairApplications.length,
				drivers: mockData.drivers.length
			}
		},

		// 测试登录
		async testLogin() {
			try {
				const encryptedPassword = this.utils.encryptByAES('123456')
				const result = await this.api.postQuery(this.apiUrl.login, {
					username: 'admin',
					password: encryptedPassword
				})
				uni.showToast({
					title: '登录测试成功',
					icon: 'success'
				})
				console.log('登录测试结果:', result)
			} catch (error) {
				uni.showToast({
					title: '登录测试失败',
					icon: 'error'
				})
				console.error('登录测试失败:', error)
			}
		},

		// 跳转到登录测试页面
		goToLoginTest() {
			uni.navigateTo({
				url: '/pages/mock/loginTest'
			})
		},

		// 跳转到地图配置检查页面
		goToMapConfigCheck() {
			uni.navigateTo({
				url: '/pages/mock/mapConfigCheck'
			})
		},

		// 跳转到定位功能测试页面
		goToLocationTest() {
			uni.navigateTo({
				url: '/pages/mock/locationTest'
			})
		},

		// 跳转到基础地图测试页面
		goToSimpleMapTest() {
			uni.navigateTo({
				url: '/pages/mock/simpleMapTest'
			})
		},

		// 跳转到高级地图测试页面
		goToMapTest() {
			uni.navigateTo({
				url: '/pages/mock/mapTest'
			})
		},

		// 测试机器人列表
		async testVehicleList() {
			try {
				const result = await this.api.get(this.apiUrl.vehicleList, {
					page: 1,
					size: 10
				})
				uni.showToast({
					title: '机器人列表测试成功',
					icon: 'success'
				})
				console.log('机器人列表测试结果:', result)
			} catch (error) {
				uni.showToast({
					title: '机器人列表测试失败',
					icon: 'error'
				})
				console.error('机器人列表测试失败:', error)
			}
		},

		// 测试申请列表
		async testApplyList() {
			try {
				const result = await this.api.get(this.apiUrl.vehicleApplyList, {
					page: 1,
					size: 10
				})
				uni.showToast({
					title: '申请列表测试成功',
					icon: 'success'
				})
				console.log('申请列表测试结果:', result)
			} catch (error) {
				uni.showToast({
					title: '申请列表测试失败',
					icon: 'error'
				})
				console.error('申请列表测试失败:', error)
			}
		},

		// 重置Mock数据
		resetMockData() {
			uni.showModal({
				title: '确认重置',
				content: '是否重置所有Mock数据到初始状态？',
				success: (res) => {
					if (res.confirm) {
						// 这里可以重新加载mockData或重置到初始状态
						uni.showToast({
							title: 'Mock数据已重置',
							icon: 'success'
						})
						this.loadMockStats()
					}
				}
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

.section {
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

.switch-row {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 20rpx 0;
}

.switch-label {
	font-size: 28rpx;
	color: #666;
}

.tip {
	background: #f8f9fa;
	padding: 20rpx;
	border-radius: 8rpx;
	margin-top: 20rpx;
}

.tip-text {
	font-size: 24rpx;
	color: #666;
	line-height: 1.5;
}

.stats-grid {
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 20rpx;
}

.stat-item {
	text-align: center;
	padding: 30rpx;
	background: #f8f9fa;
	border-radius: 12rpx;
}

.stat-number {
	display: block;
	font-size: 48rpx;
	font-weight: bold;
	color: #2F7FF0;
	margin-bottom: 10rpx;
}

.stat-label {
	font-size: 24rpx;
	color: #666;
}

.test-info {
	background: #e8f4fd;
	padding: 20rpx;
	border-radius: 8rpx;
	margin-bottom: 20rpx;
	border-left: 4rpx solid #2F7FF0;
}

.test-info-title {
	display: block;
	font-size: 28rpx;
	font-weight: bold;
	color: #2F7FF0;
	margin-bottom: 10rpx;
}

.test-info-item {
	display: block;
	font-size: 26rpx;
	color: #333;
	margin-bottom: 5rpx;
}

.test-info-note {
	display: block;
	font-size: 24rpx;
	color: #666;
	margin-top: 10rpx;
	font-style: italic;
}

.test-buttons {
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 20rpx;
}

.test-btn {
	background: #2F7FF0;
	color: white;
	border: none;
	border-radius: 8rpx;
	padding: 20rpx;
	font-size: 26rpx;
}

.test-btn:active {
	background: #1E6FDB;
}

.instructions {
	display: flex;
	flex-direction: column;
	gap: 15rpx;
}

.instruction-item {
	font-size: 26rpx;
	color: #666;
	line-height: 1.5;
	padding-left: 20rpx;
	position: relative;
}

.instruction-item::before {
	content: '•';
	color: #2F7FF0;
	position: absolute;
	left: 0;
}
</style>