<template>
	<view class="page" style="background-color: white;padding: 15px;">
		<u--textarea v-model="content" placeholder="请输入原因" height="120"></u--textarea>
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

</style>
