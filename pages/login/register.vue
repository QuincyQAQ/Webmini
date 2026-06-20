<template>
	<view class="page">
		<view class="input-box">
			<text>用户名</text>
			<view class="input">
				<u-input font-size="30rpx" placeholder="请设置您的用户名" border="none" clearable></u-input>
			</view>
			<divider></divider>
		</view>
		<view class="input-box" style="margin-top: 50rpx;">
			<text>手机号</text>
			<view class="input">
				<text>+86</text>
				<view class="divider-vertical"></view>
				<u-input font-size="30rpx" placeholder="请输入注册手机号" border="none" clearable></u-input>
			</view>
			<divider></divider>
		</view>
		<view class="input-box" style="margin-top: 50rpx;">
			<text>验证码</text>
			<view class="input">
				<u-input font-size="30rpx" placeholder="请输入短信验证码" border="none" clearable></u-input>
				<view class="divider-vertical"></view>
				<text class="send-sms">获取验证码</text>
			</view>
			<divider></divider>
		</view>
		<view class="input-box" style="margin-top: 50rpx;">
			<text>密码</text>
			<view class="input">
				<u-input type="password" font-size="30rpx" placeholder="请设置您的密码" border="none" clearable></u-input>
			</view>
			<divider></divider>
		</view>
		<view class="input-box" style="margin-top: 50rpx;">
			<text>确认密码</text>
			<view class="input">
				<u-input type="password" font-size="30rpx" placeholder="请确认您的密码" border="none" clearable></u-input>
			</view>
			<divider></divider>
		</view>
		<button class="button">立即注册</button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		methods: {
			
		}
	}
</script>

<style>
	.page{
		display: flex;
		flex-direction: column;
		padding: 60rpx 30rpx;
		font-weight: 400;
		font-size: 30rpx;
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
	
	.divider-vertical{
		width: 1px;
		background-color: #DAE0E6;
		height: 34rpx;
		margin: 0 26rpx;
	}
	
	.send-sms{
		color: #2F7FF0;
	}
	
	.button{
		background-color: #2F7FF0;
		color: #ffffff;
		height: 90rpx;
		line-height: 90rpx;
		border-radius: 99px;
		width: 100%;
		margin-top: 60rpx;
	}
</style>
