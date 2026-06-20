<template>
	<view class="page">
		<image class="bg" mode="widthFix" :src="loginBgUrl"></image>
		<view class="body">
			<image class="logo" src="/static/images/login_logo.png"></image>
			<text class="welcome">您好， \n欢迎登录机器人管理</text>
			<view v-if="!isPhoneLogin">
				<view class="input-box">
					<u--input
					prefixIcon="/static/images/login_account.png" 
					prefixIconStyle="width: 15px;height:15px;margin-left:8px;margin-right:6px"
					placeholder="请输入账号" shape="circle" border="surround"
					clearable fontSize="14" customStyle="height:32px"
					v-model="username"></u--input>
					<view style="height: 30rpx;"></view>
					<u--input
					prefixIcon="/static/images/login_password.png" 
					prefixIconStyle="width: 15px;height:15px;margin-left:8px;margin-right:6px"
					placeholder="请输入密码" shape="circle" border="surround"
					clearable fontSize="14" customStyle="height:32px"
					type="password" v-model="password"></u--input>
				</view>
				<!-- <view class="text-box">
					<text>注册账号</text>
					<text>忘记密码？</text>
				</view> -->
				<view class="button">
					<button @click="onLoginClick" class="button">登录</button>
				</view>
			</view>
			<view v-if="isPhoneLogin" class="phone-box"> 
				<text class="register-tips">未注册过的手机号登录将自动注册</text>
				<button v-if="isPhoneLogin" open-type="getPhoneNumber" @getphonenumber="onOneKeyLogin" class="button">本机号码一键登录</button>
			</view>
			<text @click="onLoginTypeClick" class="login-type">{{isPhoneLogin ? '账号密码登录' : '手机号登录'}}</text>
		</view>
		<view class="agreement linear-vertical flex-center">
			<text class="bottom-tips">仅限政企机器人事用户使用</text>
			<view class="linear-horizontal flex-align-center">
				<u-checkbox-group v-model="isAgreeAgreement">
					<u-checkbox label="我已阅读并同意" name="agree"></u-checkbox>
				</u-checkbox-group>
				<text @click="onUserAgreement">《用户协议》</text>
				<text style="color: #333333;">和</text>
				<text @click="onPrivacyAgreement">《隐私协议》</text>
			</view>
		</view>
	</view>
</template>

<script>

	export default {
		data() {
			return {
				loginBgUrl: this.config.loginBgUrl,
				username: uni.getStorageSync("username"),
				password: uni.getStorageSync("password"),
				isPhoneLogin: false,
				isAgreeAgreement: [] // 修复：改为数组类型
			}
		},
		onLoad() {
			
		},
		methods: {
			onLoginTypeClick(){
				this.isPhoneLogin = !this.isPhoneLogin
			},
			onOneKeyLogin(e){
				if(!this.checkAgree()) return
				this.api.postQuery(this.apiUrl.oneKeyLogin, {
					code: e.detail.code
				}).then(res => {
					this.loginSuccess(res)
				})
			},
			onLoginClick(e){
				if(!this.checkAgree()) return
				this.api.postQuery(this.apiUrl.login, {
					username: this.username,
					password: this.utils.encryptByAES(this.password)
				}).then(res => {
					this.loginSuccess(res)
				})
			},
			loginSuccess(res){
				uni.setStorageSync("username", this.username)
				uni.setStorageSync("password", this.password)
				uni.setStorageSync("token", res.token)
				uni.setStorageSync("phoneNumber", res.phoneNumber)
				uni.setStorageSync("userType", res.userType)
				uni.setStorageSync("user", res)
				uni.reLaunch({
					url: "/pages/index/index"
				})
			},
			checkAgree(){
				if(this.isAgreeAgreement.length == 0){
					uni.showModal({
						title: "提示",
						content: "请先阅读并同意以下协议",
						showCancel: false
					})
					return false
				}
				return true
			},
			onUserAgreement(){
				uni.navigateTo({
					url: "/pages/web/web?title=用户协议&url=" + encodeURI(this.config.userAgreementUrl)
				})
			},
			onPrivacyAgreement(){
				uni.navigateTo({
					url: "/pages/web/web?title=隐私协议&url=" + encodeURI(this.config.privacyAgreementUrl)
				})
			}
		}
	}
</script>

<style>
	
	.page{
		display: flex;
		flex-direction: column;
		position: relative;
		background-color: white;
	}
	
	.bg{
		width: 100vw;
		position: absolute;
		z-index: 1;
	}
	
	.body{
		width: 100vw;
		margin-top: 50px;
		position: absolute;
		display: flex;
		flex-direction: column;
		z-index: 2;
	}
	
	.logo{
		width: 48px;
		height: 35px;
		margin-left: 35px;
		margin-top: 95rpx;
	}
	
	.welcome{
		color: #000000;
		font-size: 24px;
		font-weight: 600;
		margin-left: 35px;
		margin-top: 20px;
	}
	
	.input-box{
		margin: 40px 30px 5px 30px;
	}
	
	.text-box{
		color: #2F7FF0;
		font-size: 26rpx;
		display: flex;
		justify-content: space-between;
		margin: 10px 30px;
	}
	
	.button{
		margin: 15px 30px;
	}
	
	.phone-box{
		text-align: center;
		margin-top: 60px;
	}
	
	.register-tips{
		color: #8A9099;
		font-size: 12px;
	}
	
	.button{
		margin-top: 15px;
		background-color: #2F7FF0;
		color: #FFFFFF;
		font-size: 16px;
		height: 47px;
		line-height: 47px;
		border-radius: 99px;
	}
	
	.login-type{
		text-align: center;
		color: #2F7FF0;
		font-size: 15px;
	}
	
	.agreement{
		position: absolute;
		bottom: 30px;
		left: 0;
		right: 0;
		color: #317EF1;
		font-size: 14px;
		display: flex;
	}
	
	.bottom-tips{
		color: #606266;
		margin-bottom: 5px;
	}
</style>
