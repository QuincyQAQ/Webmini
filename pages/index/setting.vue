<template>
	<view class="linear-vertical">
		<view class="item" v-for="(item,index) in list" :key="index">
			<text class="text">{{item.label}}</text>
			<u-switch v-model="item.enable" :activeValue="true" :inactiveValue="false"></u-switch>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				list: [
					{
						label: '设备编码',
						enable: false
					},
					{
						label: '流量卡号',
						enable: false
					},
					{
						label: '所属部门',
						enable: false
					},
					{
						label: '当日里程',
						enable: false
					},
					{
						label: '经度',
						enable: false
					},
					{
						label: '纬度',
						enable: false
					},
					{
						label: '服务器时间',
						enable: false
					},
					{
						label: '卫星时间',
						enable: false
					}
				]
			}
		},
		methods: {
			
		}
	}
</script>

<style>
	.item{
		height: 50px;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		padding: 0 15px;
	}
	
	.text{
		color: #18191A;
		font-size: 16px;
	}
</style>
