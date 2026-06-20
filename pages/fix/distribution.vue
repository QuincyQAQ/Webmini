<template>
	<view class="page" style="background-color: white;padding: 15px;">
		<text class="title">维修单位</text>
		<view class="item">
			<text>请选择</text>
			<image class="size-12" src="/static/images/icon_menu_arrow.png"></image>
		</view>
		<u-button customStyle="margin-top:20px" color="#2F7FF0" text="确定" shape="circle"></u-button>
		<u-button customStyle="color:#5C6166;margin-top:10px" color="#F7F7F7" text="取消" shape="circle"></u-button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				content: ''
			}
		},
		methods: {
			
		}
	}
</script>

<style>
	.item{
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		font-size: 14px;
		color: #18191A;
		background-color: #F7F7F7;
		border-radius: 10px;
		height: 45px;
		padding: 0 15px;
	}
	
	.title{
		color: #18191A;
		font-size: 14px;
		font-weight: 600;
		margin-bottom: 10px;
	}
</style>
