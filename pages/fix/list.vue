<template>
	<view class="page">
		<view class="header" :style="{'height': headerHeight + 'px'}">
			<text class="title" :style="{'margin-top': (menuButtonInfo.top || 0) + 'px', 'height': (menuButtonInfo.height || 32) + 'px'}">{{title}}</text>
		</view>
		<view @click="onApplyClick" class="add linear-horizontal flex-align-center">
			<image class="size-14" src="/static/images/icon_fix.png"></image>
			<text class="margin-left-5 flex-1">申请维修</text>
			<image class="size-12" src="/static/images/task_arrow.png"></image>
		</view>
		<u-tabs :list="tabList" @click="onTabClick" lineColor="#2F7FF0"  scrollable></u-tabs>
		<view class="scroll-view">
			<scroll-view scroll-y class="list" :style="{'height': listHeight + 'px'}"
			refresher-enabled :refresher-triggered="isRefreshing" @refresherrefresh="onRefresh" @scrolltolower="onLoadMore">
				<view @click="onItemClick(item.repairId)" class="item linear-vertical" v-for="(item, index) in list" :key="index">
					<view class="linear-horizontal flex-align-center">
						<text class="numberplate">{{item.numberPlate}}</text>
						<text class="role">{{item.companyName}}</text>
						<view class="flex-1"></view>
						<text class="status" :style="{'color': checkedTab.color}">{{constant.getRepairStatusText(item.orderStatus)}}</text>
					</view>
					<!-- <text class="info">厂牌型号：红旗L20 舒适款</text> -->
					<view class="text linear-horizontal flex-space-between margin-top-15">
						<text>送修日期</text>
						<text class="content">{{item.repairTime}}</text>
					</view>
					<view class="text linear-horizontal flex-space-between margin-top-10">
						<text>委托维修单位</text>
						<text class="content">{{item.repairCompany}}</text>
					</view>
					<view class="text linear-horizontal flex-space-between margin-top-10">
						<text>预约维修项目</text>
						<text class="content">{{item.orderRepair}}</text>
					</view>
					<view class="button-group">
						<text v-if="item.orderStatus == constant.REPAIR_STATUS_APPLY" @click.stop="onCancelClick(index)" class="button-white">撤回</text>
						<text v-if="item.orderStatus == constant.REPAIR_STATUS_APPLY && (userType == constant.USER_TYPE_SYS || userType == constant.USER_TYPE_ADMIN)" 
						@click.stop="onApprovalClick(item.repairId)" class="button-blue">审批</text>
						<text v-if="item.orderStatus == constant.REPAIR_STATUS_APPROVAL" @click.stop="onFixingClick(index)" class="button-blue">已送修</text>
						<text v-if="item.orderStatus == constant.REPAIR_STATUS_FIXING" @click.stop="onFinishClick(item.repairId)" class="button-blue">维修完成</text>
					</view>
				</view>
			</scroll-view>
		</view>
		<popup-upload-photo ref="uploadPhotoPopup" buttonText="维修完成" @confirm="onUploadResult" showMoney></popup-upload-photo>
		<tabbar name="fix"></tabbar>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				constant: this.constant,
				userType: -1,
				title: '',
				menuButtonInfo: {},
				headerHeight: 0,
				listHeight: 0,
				tabList: [
					{
						name: '待审批',
						status: this.constant.REPAIR_STATUS_APPLY,
						color: '#EBA52B'
					},
					{
						name: '待送修',
						status: this.constant.REPAIR_STATUS_APPROVAL,
						color: '#EBA52B'
					},
					{
						name: '待完成',
						status: this.constant.REPAIR_STATUS_FIXING,
						color: '#2F7FF0'
					},
					{
						name: '已完成',
						status: this.constant.REPAIR_STATUS_FINISH,
						color: '#2F7FF0'
					},
					{
						name: '已撤销',
						status: this.constant.REPAIR_STATUS_CANCEL,
						color: '#FA3B30'
					},
					{
						name: '已驳回',
						status: this.constant.REPAIR_STATUS_REJECTED,
						color: '#FA3B30'
					}
				],
				list: [],
				checkedTab: {},
				pageIndex: 1,
				isRefreshing: false,
				checkedRepairId: ''
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
			let safeAreaBottomHeight = parseInt(uni.getStorageSync("safeAreaBottomHeight"))
			this.headerHeight = parseInt(uni.getStorageSync("headerHeight"))
			this.listHeight = sys.screenHeight - this.headerHeight - safeAreaBottomHeight - 165
			setTimeout(() => {
				this.title = '维修工单'
			}, 300)
			this.userType = uni.getStorageSync("userType")
			
			// 添加一个小的延迟来确保DOM渲染完成后再加载数据
			this.$nextTick(() => {
				setTimeout(() => {
					this.checkedTab = this.tabList[0]
					this.loadData()
				}, 100)
			})
		},
		methods: {
			loadData(pageIndex = 1){
				this.api.get(this.apiUrl.repairList, {
					orderStatus: this.checkedTab.status,
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
			onTabClick(item){
				this.checkedTab = item
				this.loadData()
			},
			onApplyClick(){
				uni.navigateTo({
					url: "/pages/fix/form"
				})
			},
			onItemClick(repairId){
				uni.navigateTo({
					url: "/pages/fix/fixDetail?repairId=" + repairId
				})
			},
			onCancelClick(index){
				let that = this
				let model = this.list[index]
				uni.showModal({
					title: "提示",
					content: "确定要撤回维修申请吗？",
					success(res) {
						if(res.confirm){
							that.api.postJson(that.apiUrl.repairUpdate, {
								repairId: model.repairId,
								orderStatus: that.constant.REPAIR_STATUS_CANCEL
							}).then(res => {
								uni.showToast({
									title: "操作成功"
								})
								that.list.splice(index, 1)
							})
						}
					}
				})
			},
			onApprovalClick(repairId){
				uni.navigateTo({
					url: "/pages/fix/approval?repairId=" + repairId
				})
			},
			removeItem(repairId){
				let index = this.list.findIndex(it => it.repairId == repairId)
				this.list.splice(index, 1)
			},
			onFixingClick(index){
				let that = this
				let model = this.list[index]
				uni.showModal({
					title: "提示",
					content: "确定已送修吗？",
					success(res) {
						if(res.confirm){
							that.api.postJson(that.apiUrl.repairUpdate, {
								repairId: model.repairId,
								orderStatus: that.constant.REPAIR_STATUS_FIXING
							}).then(res => {
								uni.showToast({
									title: "操作成功"
								})
								that.list.splice(index, 1)
							})
						}
					}
				})
			},
			onFinishClick(repairId){
				this.checkedRepairId = repairId
				this.$refs.uploadPhotoPopup.open()
			},
			onUploadResult(e){
				if(e.photoList.length == 0){
					uni.showToast({
						title: "请上传维修完成照片",
						icon: "none"
					})
					return
				}
				if(e.money.length == 0){
					uni.showToast({
						title: "请输入实际维修费用",
						icon: "none"
					})
					return
				}
				this.$refs.uploadPhotoPopup.close()
				let index = this.list.findIndex(it => it.repairId == this.checkedRepairId)
				this.api.postJson(this.apiUrl.repairUpdate, {
					repairId: this.checkedRepairId,
					orderStatus: this.constant.REPAIR_STATUS_FINISH,
					repairCost: e.money,
					imageRepair: e.photoList.map(it => {
						return {
							name: '',
							path: it.path
						}
					})
				}).then(res => {
					uni.showToast({
						title: "操作成功"
					})
					this.list.splice(index, 1)
				})
			}
		}
	}
</script>

<style>
	page{
		background-color: #F2F2F2;
	}
	
	.page{
		width: 100%;
		box-sizing: border-box;
	}
	
	.header{
		width: 100vw;
		background-color: white;
	}
	
	.title{
		display: flex;
		flex-direction: row;
		align-items: center;
		margin-left: 38rpx;
		color: #18191A;
		font-size: 36rpx;
		font-weight: bold;
	}
	
	.add{
		background-color: #fff;
		border-radius: 8px;
		height: 40px;
		margin: 10px 10px 0px 20rpx;
		color: #317EF1;
		font-size: 14px;
		padding: 0 15px;
	}
	
	.scroll-view{
		padding: 20rpx;
		box-sizing: border-box;
	}
	
	.item{
		background-color: white;
		border-radius: 20rpx;
		padding: 20rpx;
		margin-bottom: 20rpx;
	}
	
	.numberplate{
		color: #18191A;
		font-size: 20px;
		font-weight: bold;
	}
	
	.role{
		background-color: rgb(47,127,240, 0.1);
		padding: 4px 20rpx;
		color: #2F7FF0;
		font-size: 12px;
		border-radius: 99px;
		margin-left: 20rpx;
	}
	
	.status{
		color: #52C132;
		font-size: 14px;
	}
	
	.info{
		font-size: 13px;
		color: #18191A;
		margin-top: 6px;
	}
	
	.person-box{
		background-color: #F7F7F7;
		border-radius: 20rpx;
		padding: 15px;
		margin-top: 15px;
		color: #5C6166;
		font-size: 13px;
	}
	
	.name{
		color: #18191A;
		font-size: 15px;
		font-weight: bold;
	}
	
	.phone{
		color: #2F7FF0;
		font-size: 12px;
	}
	
	.text{
		color: #5C6166;
		font-size: 13px;
	}
	
	.content{
		flex: 1;
		margin-left: 15px;
		text-align: right;
	}
	
	.button-group{
		margin-top: 25px;
		display: flex;
		flex-direction: row;
		justify-content: flex-end;
	}
	
	.button-blue{
		color: white;
		width: 90px;
		background-color: #2F7FF0;
		border-radius: 99px;
		line-height: 36px;
		text-align: center;
		font-size: 13px;
		margin-left: 20rpx;
	}
	
	.button-white{
		border: 1px solid #8A9199;
		width: 90px;
		border-radius: 99px;
		line-height: 36px;
		text-align: center;
		font-size: 13px;
		color: #18191A;
		margin-left: 20rpx;
	}
</style>
