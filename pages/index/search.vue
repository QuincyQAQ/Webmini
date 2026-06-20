<template>
	<view class="page linear-vertical">
		<view class="search-box">
			<u-search placeholder="请输入关键字进行搜索" v-model="keyword" @custom="onSearchClick"></u-search>
		</view>
		<scroll-view scroll-y class="scroll-view linear-vertical" :style="{'height': scrollViewHeight + 'px'}" 
		refresher-enabled :refresher-triggered="isRefreshing" @refresherrefresh="onRefresh" @scrolltolower="onLoadMore">
			<view @click="onItemClick(index)" v-for="(item,index) in list" :key="index" class="item">
				{{item.numberPlate}}
			</view>
		</scroll-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				scrollViewHeight: 0,
				keyword: '',
				list: [],
				companyId: null,
				vehicleTaskStatus: '',
				isMapSearch: false,
				pageIndex: 1,
				isRefreshing: false
			}
		},
		onLoad(options) {
			let sys = uni.getSystemInfoSync()
			let safeAreaBottomHeight = sys.screenHeight - sys.safeArea.bottom
			this.scrollViewHeight = sys.safeArea.height - 54 - safeAreaBottomHeight
			this.companyId = options.companyId ?? ''
			this.vehicleTaskStatus = options.vehicleTaskStatus ?? ''
			this.loadData()
		},
		methods: {
			loadData(pageIndex = 1){
				this.api.get(this.apiUrl.searchVehicleList, {
					companyId: this.companyId,
					numberPlate: this.keyword,
					vehicleTaskStatus: this.vehicleTaskStatus,
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
			onSearchClick(e){
				this.loadData()
			},
			onItemClick(index){
				let item = this.list[index]
				let pages = getCurrentPages();
				let prevPage = pages[pages.length - 2];
				prevPage.$vm.onSearchResult(item)
				uni.navigateBack();
			}
		}
	}
</script>

<style>
	
	.page{
		background-color: white;
	}
	
	.search-box{
		box-sizing: border-box;
		padding: 10px 15px;
	}
	
	.scroll-view{
		box-sizing: border-box;
		padding: 0 15px;
	}
	
	.item{
		line-height: 44px;
		height: 44px;
		border-bottom: 1px solid #F2F2F2;
		font-size: 14px;
		color: #18191A;
	}
</style>
