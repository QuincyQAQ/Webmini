<template>
	<view class="page">
		<view class="header">
			<view class="header-bg"></view>
			<text class="title" :style="{'margin-top': (menuButtonInfo.top || 0) + 'px', 'height': (menuButtonInfo.height || 32) + 'px'}">{{title}}</text>
			<view @click="onInfoClick" class="info linear-horizontal flex-align-center">
				<image class="avatar" :src="avatar" @error="avatar = '/static/images/engineer.jpg'"></image>
				<view class="linear-vertical flex-1 margin-left-10">
					<text class="username">{{user.name}}</text>
					<view class="phone linear-horizontal flex-align-center">
						<image class="size-14" src="/static/images/icon_phone.png"></image>
						<text class="margin-left-5">电话：{{user.phoneNumber}}</text>
					</view>
					<text class="org">部门：{{user.companyName}}</text>
				</view>
				<image class="size-14" src="/static/images/item_arrow.png"></image>
			</view>
			<view @click="onSettingClick" class="menu linear-horizontal flex-align-center">
				<image class="size-16" src="/static/images/icon_setting_black.png"></image>
				<text class="flex-1 margin-left-10">修改密码</text>
				<image class="size-14" src="/static/images/item_arrow.png"></image>
			</view>
			<view @click="onServiceClick" class="menu linear-horizontal flex-align-center">
				<image class="size-16" src="/static/images/icon_service.png"></image>
				<text class="flex-1 margin-left-10">联系客服</text>
				<image class="size-14" src="/static/images/item_arrow.png"></image>
			</view>
			<view class="menu linear-horizontal flex-align-center">
				<image class="size-16" src="/static/images/icon_logout.png"></image>
				<text @click="onLogoutClick" class="flex-1 margin-left-10">退出登录</text>
				<image class="size-14" src="/static/images/item_arrow.png"></image>
			</view>
		</view>
		<view class="agreement" :style="{'bottom': agreenmentBottom + 'px'}">
			<text @click="onUserAgreement">《用户协议》</text>
			<text style="color: #333333;">和</text>
			<text @click="onPrivacyAgreement">《隐私协议》</text>
		</view>
		<tabbar name="mine"></tabbar>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				photoUrl: this.config.photoUrl,
				title: '',
				menuButtonInfo: {},
				pageHeight: 0,
				agreenmentBottom: 0,
				user: {},
				avatar: '/static/images/engineer.jpg'
			}
		},
		mounted() {
			// #ifdef MP-WEIXIN
			this.menuButtonInfo = uni.getMenuButtonBoundingClientRect()
			// #endif
			// #ifndef MP-WEIXIN
			// H5和App平台使用默认值
			this.menuButtonInfo = {
				top: 0,
				height: 32,
				bottom: 32
			}
			// #endif
			
			let sys = uni.getSystemInfoSync()
			this.pageHeight = sys.screenHeight - parseInt(uni.getStorageSync("safeAreaBottomHeight"))
			this.agreenmentBottom = parseInt(uni.getStorageSync("safeAreaBottomHeight")) + 65
			this.updateUI()
			setTimeout(() => {
				this.title = '个人中心'
			}, 300)
		},
		methods: {
			updateUI(){
				// 首先尝试从本地存储获取用户信息
				let storedUser = uni.getStorageSync("user")
				
				// 如果本地存储中有用户信息，则使用它
				if(storedUser && Object.keys(storedUser).length > 0) {
					this.user = {
						name: storedUser.name || "未知用户",
						phoneNumber: storedUser.phoneNumber || "",
						companyName: storedUser.companyName || "未知部门",
						...storedUser
					}
				} else {
					// 如果本地存储中没有用户信息，则从服务器获取
					this.fetchUserInfo();
				}
				
				if(this.user.photo){
					this.avatar = this.photoUrl + this.user.photo
				}
			},
			
			// 获取最新的用户信息
			fetchUserInfo() {
				this.api.postQuery(this.apiUrl.userInfoGet).then(res => {
					// 确保获取到的用户信息包含所有必要字段
					this.user = {
						name: res.name || "未知用户",
						phoneNumber: res.phoneNumber || "",
						companyName: res.companyName || "未知部门",
						...res
					};
					
					// 同时更新本地存储，确保下次可以直接使用
					uni.setStorageSync('user', this.user);
				}).catch(err => {
					console.error('获取用户信息失败:', err);
					// 如果获取失败，至少确保显示默认值
					this.user = {
						name: "未知用户",
						phoneNumber: "",
						companyName: "未知部门"
					};
				});
			},
			onSettingClick(){
				uni.navigateTo({
					url: "/pages/mine/modifyPwd"
				})
			},
			onServiceClick(){
				uni.previewImage({
					current: 0,
					urls: ['/static/images/qrcode.png'],
					success(res){
						console.log(res);
					},
					fail(err) {
					  console.log(err);
					}
				})
			},
			onLogoutClick(){
				uni.setStorageSync("token", "")
				uni.reLaunch({
					url: "/pages/login/login"
				})
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
			},
			onInfoClick(){
				uni.navigateTo({
					url: "/pages/mine/userinfo"
				})
			}
		}
	}
</script>

<style>
	.page{
		width: 100%;
		position: relative;
		box-sizing: border-box;
	}
	
	.header{
		position: absolute;
		width: 100vw;
	}
	
	.header-bg{
		position: absolute;
		width: 100vw;
		height: 138.5px;
		background: linear-gradient(to bottom, rgba(47,127,240, 0.4), rgba(255, 255, 255, 0));
	}
	
	.title{
		display: flex;
		flex-direction: row;
		align-items: center;
		margin-left: 16px;
		color: #18191A;
		font-size: 18px;
		font-weight: bold;
	}
	
	.info{
		margin: 30px 15px;
	}
	
	.avatar{
		width: 140rpx;
		height: 140rpx;
		border-radius: 99px;
	}
	
	.username{
		font-size: 18px;
		color: #18191A;
		font-weight: 600;
	}
	
	.phone{
		font-size: 12px;
		color: #5C6166;
		margin: 5px 0;
	}
	
	.org{
		font-size: 12px;
		color: #18191A;
	}
	
	.menu{
		width: 750rpx;
		height: 44px;
		box-sizing: border-box;
		padding: 0 15px;
		font-size: 15px;
		color: #000000;
	}
	
	.agreement{
		position: absolute;
		left: 0;
		right: 0;
		color: #317EF1;
		font-size: 14px;
		text-align: center;
	}
</style>
