<template>
	<view class="page">
		<view class="header">
			<u-search placeholder="请输入关键字搜索" v-model="keyword" @custom="onSearch"></u-search>
			<u-tabs :list="tabList" @click="onTabClick" lineColor="#2F7FF0" :scrollable="false"></u-tabs>
		</view>
		<scroll-view scroll-y class="list" :style="{'height': listHeight + 'px'}"
		refresher-enabled :refresher-triggered="isRefreshing" @refresherrefresh="onRefresh" @scrolltolower="onLoadMore">
			<view class="pop-box" v-for="(item,index) in list" :key="index">
				<view class="linear-horizontal flex-align-center">
					<image class="size-25" src="/static/images/home_vehicle.png"></image>
					<text class="numberplate">{{item.numberPlate}}</text>
					<text class="online" :style="'background-color:' + checkedTab.color">{{checkedTab.name}}</text>
					<view class="flex-1"></view>
					<view @click="onTrajectoryClick(index)" class="setting linear-horizontal flex-center margin-left-10">
						<image class="size-14" src="/static/images/icon_trajectory_blue.png"></image>
						<text class="margin-left-5">轨迹</text>
					</view>
				</view>
				<!-- <view class="linear-horizontal flex-align-center" style="margin-top: 6px;">
					<text class="online" :style="'background-color:' + checkedTab.color">{{checkedTab.name}}</text>
					<text class="pop-text">{{item.spd}}km/h</text>
				</view> -->
				<text class="pop-text margin-top-10">所属部门：{{item.companyName}}</text>
				<!-- <view class="pop-text margin-top-10 linear-horizontal">
					<text>当前位置：</text>
					<text class="flex-1">{{item.location}}</text>
				</view> -->
			</view>
		</scroll-view>
	</view>
</template>

<script>
	import constant from '../../config/constant'

	export default {
		data() {
			return {
				constant: this.constant,
				tabList: [
					{
						name: '空闲',
						status: 0,
						color: '#EAB446'
					},
					{
						name: '任务中',
						status: 1,
						color: '#327EEF'
					}
				],
				checkedTab: {},
				listHeight: 0,
				keyword: '',
				list: [],
				companyId: '',
				pageIndex: 1,
				isRefreshing: false
			}
		},
		onLoad(options) {
			let sys = uni.getSystemInfoSync()
			this.listHeight = sys.windowHeight - 98,
			this.checkedTab = this.tabList[0]
			this.companyId = options.companyId
			
			// 添加一个小的延迟来确保DOM渲染完成后再加载数据
			this.$nextTick(() => {
				setTimeout(() => {
					this.loadData()
				}, 100)
			})
		},
		methods: {
			onTabClick(e){
				this.checkedTab = this.tabList[e.index]
				this.loadData()
			},
			loadData(pageIndex = 1){
				this.api.get(this.apiUrl.searchVehicleList, {
					companyId: this.companyId,
					vehicleTaskStatus: this.checkedTab.status,
					numberPlate: this.keyword,
					pageNum: pageIndex,
					pageSize: 20
				}).then(res => {
					setTimeout(() => {
						this.isRefreshing = false
					}, 300)
					if(pageIndex == 1){
						this.list = res.rows
					}else{
						this.list = this.list.concat(res.rows)
					}
					this.pageIndex = pageIndex
				})
			},
			onRefresh(){
				this.isRefreshing = true
				this.loadData()
			},
			onLoadMore(){
				this.loadData(this.pageIndex + 1)
			},
			onSearch(e){
				this.loadData()
			},
			onTrajectoryClick(index){
				let item = this.list[index]
				uni.navigateTo({
					url: '/pages/trajectory/query?dvo=' + item.deviceId + '&numberPlate=' + item.numberPlate
				})
			}
		}
	}
</script>

<style>
	
	.header{
		background-color: white;
		margin-bottom: 10px;
		padding: 0 15px;
	}
	
	.pop-box{
		border-radius: 15px;
		background-color: white;
		display: flex;
		flex-direction: column;
		box-sizing: border-box;
		padding: 20px 15px;
		margin: 0 10px 10px 10px;
	}
	
	.numberplate{
		color: #18191A;
		font-size: 16px;
		font-weight: bold;
		margin-left: 6px;
		max-width: 150px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	
	.setting{
		background-color: #F2F2F2;
		width: 75px;
		height: 36px;
		border-radius: 7px;
		font-size: 14px;
		color: #327EEF;
	}
	
	.pop-close{
		position: absolute;
		top: 12px;
		right: 12px;
	}
	
	.online{
		padding: 4px 6px;
		box-sizing: border-box;
		font-size: 12px;
		color: white;
		border-radius: 99px;
		margin-left: 10px;
	}
	
	.pop-text{
		color: #5C6166;
		font-size: 13px;
	}
</style>
