<template>
	<view class="page">
		<view class="header">
			<u-search placeholder="请输入关键字搜索" v-model="keyword" @custom="onSearch"></u-search>
			<u-tabs v-if="!selectMode" :list="tabList" @click="onTabClick" lineColor="#2F7FF0" :scrollable="false"></u-tabs>
		</view>
		<scroll-view scroll-y class="list" :style="{'height': listHeight + 'px'}"
		refresher-enabled :refresher-triggered="isRefreshing" @refresherrefresh="onRefresh" @scrolltolower="onLoadMore">
			<view class="pop-box" @click="onItemClick(index)" v-for="(item,index) in list" :key="index">
				<view class="linear-horizontal flex-align-center">
					<text class="name">{{item.name}}</text>
					<!-- <text class="status">B3</text> -->
					<view class="flex-1"></view>
					<image class="size-14" src="/static/images/task_phone.png"></image>
					<text @click.stop="onPhoneClick(item.contactNumber)" class="phone margin-left-5">{{item.contactNumber}}</text>
				</view>
				<text class="pop-text margin-top-10">所属部门：{{item.companyName}}</text>
				<view class="linear-horizontal margin-top-10">
					<text class="pop-text flex-1">性别：{{item.sex == 0 ? '男' : '女'}}</text>
					<text class="pop-text flex-1">年龄：{{item.age}}</text>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				tabList: [
					{
						name: '空闲',
						status: this.constant.TASK_STATUS_FREE
					},
					{
						name: '任务中',
						status: this.constant.TASK_STATUS_TASKING
					}
				],
				tabIndex: 0,
				listHeight: 0,
				keyword: '',
				companyId: '',
				selectMode: false,
				list: [],
				pageIndex: 1,
				isRefreshing: false,
			}
		},
		onLoad(options) {
			let sys = uni.getSystemInfoSync()
			this.listHeight = sys.windowHeight - 88
			this.selectMode = options.selectMode == 1
			this.companyId = options.companyId ?? null
			
			// 添加一个小的延迟来确保DOM渲染完成后再加载数据
			this.$nextTick(() => {
				setTimeout(() => {
					this.loadData()
				}, 100)
			})
		},
		methods: {
			loadData(pageIndex = 1){
				let tab = this.tabList[this.tabIndex]
				this.api.get(this.apiUrl.searchDriverList, {
					companyId: this.companyId,
					driverTaskStatus: tab.status,
					name: this.keyword,
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
			onTabClick(e){
				this.tabIndex = e.index
				this.loadData()
			},
			onItemClick(index){
				if(this.selectMode) {
					// 如果是选择模式，才回调前一个页面
					let pages = getCurrentPages()
					let prevPage = pages[pages.length - 2]
					if(prevPage && prevPage.$vm && typeof prevPage.$vm.onDriverResult === 'function') {
						prevPage.$vm.onDriverResult(this.list[index])
					} else {
						console.error('前一个页面没有定义onDriverResult方法')
					}
					uni.navigateBack()
				}
				// 如果不是选择模式，只是普通浏览，不执行任何回调
			},
			onPhoneClick(e){
				uni.makePhoneCall({
					phoneNumber: e
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
				// this.list = this.originData.filter(it => it.name.indexOf(e) > -1)
			}
		}
	}
</script>

<style>
	
	.header{
		background-color: white;
		margin-bottom: 10px;
		padding: 0 15px 5px 15px;
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
	
	.name{
		color: #18191A;
		font-size: 15px;
		font-weight: bold;
	}
	
	.status{
		padding: 2px 10px;
		border-radius: 99px;
		background-color: rgb(47,127,240, 0.1);
		color: #2F7FF0;
		font-size: 12px;
		margin-left: 7px;
	}
	
	.phone{
		color: #2F7FF0;
		font-size: 12px;
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
		background-color: #52C132;
		padding: 4px 6px;
		font-size: 12px;
		color: white;
		border-radius: 99px;
		margin-right: 10px;
	}
	
	.pop-text{
		color: #5C6166;
		font-size: 13px;
	}
</style>
