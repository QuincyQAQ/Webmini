<template>
	<view class="page" style="padding:10px 15px;">
		<view class="item" @click="onModifyPwd">
			<image class="size-16" src="/static/images/login_password.png"></image>
			<text class="flex-1 margin-left-10">修改密码</text>
			<image class="size-12" src="/static/images/icon_menu_arrow.png"></image>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		methods: {
			onModifyPwd(){
				uni.navigateTo({
					url: "/pages/mine/modifyPwd"
				})
			}
		}
	}
</script>

<style>
	.item{
		line-height: 44px;
		background-color: white;
		border-radius: 8px;
		display: flex;
		flex-direction: row;
		align-items: center;
		padding: 0 14px;
		color: #18191A;
		font-size: 15px;
	}
</style>
