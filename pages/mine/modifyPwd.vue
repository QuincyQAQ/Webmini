<template>
	<view class="page" style="padding:10px 15px;background-color: white;">
		<text class="tips">密码仅可由数字、英文字母或英文符号组成，长度不少于 8个字符</text>
		<view class="input-box" style="margin-top: 38px;">
			<text>原密码</text>
			<view class="input">
				<u-input v-model="oldPwd" type="password" font-size="15px" placeholder="请输入原密码" border="none" clearable></u-input>
			</view>
			<divider></divider>
		</view>
		<view class="input-box" style="margin-top: 30px;">
			<text>新密码</text>
			<view class="input">
				<u-input v-model="newPwd" type="password" font-size="15px" placeholder="请输入新密码" border="none" clearable></u-input>
			</view>
			<divider></divider>
		</view>
		<view class="input-box" style="margin-top: 30px;">
			<text>新密码</text>
			<view class="input">
				<u-input v-model="confirmPwd" type="password" font-size="15px" placeholder="请输入新密码" border="none" clearable></u-input>
			</view>
			<divider></divider>
		</view>
		<u-button @click="onSubmitClick" style="margin-top: 40px;" color="#2F7FF0" text="确定" shape="circle"></u-button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				oldPwd: '',
				newPwd: '',
				confirmPwd: ''
			}
		},
		methods: {
			onSubmitClick(){
				if(!this.oldPwd){
					uni.showToast({
						title: "请输入原密码",
						icon: "none"
					})
					return
				}
				if(!this.newPwd){
					uni.showToast({
						title: "请输入新密码",
						icon: "none"
					})
					return
				}
				if(!this.confirmPwd){
					uni.showToast({
						title: "请再次输入新密码",
						icon: "none"
					})
					return
				}
				if(this.newPwd != this.confirmPwd){
					uni.showToast({
						title: "两次输入的密码不一致",
						icon: "none"
					})
					return
				}
				this.api.postQuery(this.apiUrl.modifyPwd, {
					oldPassword: this.utils.encryptByAES(this.oldPwd),
					newPassword: this.utils.encryptByAES(this.newPwd),
				}).then(res => {
					uni.showToast({
						title: "操作成功"
					})
					setTimeout(() => {
						uni.reLaunch({
							url: "/pages/login/login"
						})
					}, 2000)
				})
			}
		}
	}
</script>

<style>
	.tips{
		font-size: 13px;
		color: #5C6166;
	}
	
	.input-box{
		color: #000000;
		display: flex;
		flex-direction: column;
	}
	
	.input{
		display: flex;
		flex-direction: row;
		align-items: center;
		height: 95rpx;
	}
</style>
