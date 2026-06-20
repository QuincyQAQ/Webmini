<template>
	<view class="page">
		<view class="header">
			<text class="title">Mock登录测试</text>
		</view>
		
		<view class="content">
			<view class="form-section">
				<view class="form-item">
					<text class="label">用户名：</text>
					<input class="input" v-model="username" placeholder="请输入用户名" />
				</view>
				<view class="form-item">
					<text class="label">密码：</text>
					<input class="input" v-model="password" type="password" placeholder="请输入密码" />
				</view>
				<button class="login-btn" @click="testLogin">测试登录</button>
			</view>
			
			<view class="info-section">
				<view class="info-title">测试账号</view>
				<view class="account-list">
					<view class="account-item" @click="fillAccount('admin', '123456')">
						<text class="account-name">admin</text>
						<text class="account-pwd">123456</text>
					</view>
					<view class="account-item" @click="fillAccount('test', '123456')">
						<text class="account-name">test</text>
						<text class="account-pwd">123456</text>
					</view>
					<view class="account-item" @click="fillAccount('demo', '123456')">
						<text class="account-name">demo</text>
						<text class="account-pwd">123456</text>
					</view>
				</view>
			</view>
			
			<view class="result-section" v-if="testResult">
				<view class="result-title">测试结果</view>
				<view class="result-content">
					<text class="result-text">{{ testResult }}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			username: 'admin',
			password: '123456',
			testResult: ''
		}
	},
	methods: {
		fillAccount(username, password) {
			this.username = username
			this.password = password
		},
		
		async testLogin() {
			if (!this.username || !this.password) {
				uni.showToast({
					title: '请输入用户名和密码',
					icon: 'none'
				})
				return
			}
			
			try {
				this.testResult = '正在测试登录...'
				
				// 加密密码
				const encryptedPassword = this.utils.encryptByAES(this.password)
				console.log('加密后的密码:', encryptedPassword)
				
				const result = await this.api.postQuery(this.apiUrl.login, {
					username: this.username,
					password: encryptedPassword
				})
				
				console.log('登录结果:', result)
				
				this.testResult = `登录成功！
用户信息：${JSON.stringify(result, null, 2)}`
				
				uni.showToast({
					title: '登录测试成功',
					icon: 'success'
				})
				
			} catch (error) {
				console.error('登录测试失败:', error)
				this.testResult = `登录失败：${error}`
				
				uni.showToast({
					title: '登录测试失败',
					icon: 'error'
				})
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

.form-section {
	background: white;
	border-radius: 16rpx;
	padding: 30rpx;
	margin-bottom: 20rpx;
	box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.1);
}

.form-item {
	display: flex;
	align-items: center;
	margin-bottom: 30rpx;
}

.label {
	width: 120rpx;
	font-size: 28rpx;
	color: #333;
}

.input {
	flex: 1;
	height: 80rpx;
	padding: 0 20rpx;
	border: 2rpx solid #e0e0e0;
	border-radius: 8rpx;
	font-size: 28rpx;
}

.login-btn {
	width: 100%;
	height: 80rpx;
	background: #2F7FF0;
	color: white;
	border: none;
	border-radius: 8rpx;
	font-size: 30rpx;
	margin-top: 20rpx;
}

.info-section {
	background: white;
	border-radius: 16rpx;
	padding: 30rpx;
	margin-bottom: 20rpx;
	box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.1);
}

.info-title {
	font-size: 32rpx;
	font-weight: bold;
	color: #333;
	margin-bottom: 20rpx;
}

.account-list {
	display: flex;
	flex-direction: column;
	gap: 15rpx;
}

.account-item {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 20rpx;
	background: #f8f9fa;
	border-radius: 8rpx;
	border: 2rpx solid transparent;
	transition: all 0.3s;
}

.account-item:active {
	border-color: #2F7FF0;
	background: #e8f4fd;
}

.account-name {
	font-size: 28rpx;
	color: #333;
	font-weight: bold;
}

.account-pwd {
	font-size: 26rpx;
	color: #666;
	font-family: monospace;
}

.result-section {
	background: white;
	border-radius: 16rpx;
	padding: 30rpx;
	box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.1);
}

.result-title {
	font-size: 32rpx;
	font-weight: bold;
	color: #333;
	margin-bottom: 20rpx;
}

.result-content {
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
	font-family: monospace;
}
</style>