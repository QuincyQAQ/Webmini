<template>
	<view class="page">
		<view class="header" :style="{'height': headerHeight + 'px'}">
			<text class="title" :style="{'margin-top': (menuButtonInfo.top || 0) + 'px', 'height': (menuButtonInfo.height || 32) + 'px'}">{{title}}</text>
		</view>
		<view @click="onApplyClick" class="add linear-horizontal flex-align-center">
			<image class="size-14" src="/static/images/task_vehicle.png"></image>
			<text class="margin-left-5 flex-1">应急用机器人</text>
			<image class="size-12" src="/static/images/task_arrow.png"></image>
		</view>
		<u-tabs :list="tabList" @click="onTabClick" lineColor="#2F7FF0" :scrollable="tabScrollable"></u-tabs>
		<view class="scroll-view">
			<scroll-view scroll-y class="list" :style="{'height': listHeight + 'px'}"
			refresher-enabled :refresher-triggered="isRefreshing" @refresherrefresh="onRefresh" @scrolltolower="onLoadMore">
				<view class="item linear-vertical" @click="onDetailClick(item.applyId)" v-for="(item, index) in list" :key="index">
					<view class="linear-horizontal flex-align-center">
						<text class="numberplate">{{item.numberPlate ? item.numberPlate : "等待调度机器人..."}}</text>
						<!-- <text class="role">专员</text> -->
						<view class="flex-1"></view>
						<text class="status" :style="{'color': checkedTab.color}">{{checkedTab.name}}</text>
					</view>
					<text class="info">机器人 {{item.vehicleNum}}辆  |  {{constant.getPurposeName(item.purpose)}}</text>
					<view class="person-box linear-vertical">
						<view class="linear-horizontal flex-align-center">
							<text class="name flex-1">{{item.useName}}</text>
							<image class="size-14" src="/static/images/task_phone.png"></image>
							<text @click="onPhoneClick(item.useTel)" class="phone margin-left-5">{{item.useTel}}</text>
						</view>
						<text class="margin-top-5">所属部门：{{item.companyName}}</text>
						<text class="margin-top-5">用机器人事由：{{item.remark}}</text>
					</view>
					<view class="text linear-horizontal flex-space-between margin-top-15">
						<text>用机器人时间</text>
						<text>{{item.boardingTime}}</text>
					</view>
					<view class="button-group">
						<text v-if="item.orderStatus == constant.ORDER_STATUS_APPLY || item.orderStatus == constant.ORDER_STATUS_APPROVAL" @click.stop="onEditClick(item.applyId)" class="button-hollow">修改目的地</text>
						<text v-if="item.orderStatus == constant.ORDER_STATUS_APPLY" @click.stop="onApprovalClick(item.applyId, false)" class="button" style="background-color: #FA3B30;">不通过</text>
						<text v-if="item.orderStatus == constant.ORDER_STATUS_APPLY" @click.stop="onApprovalClick(item.applyId, true)" class="button" style="background-color: #2F7FF0;">通过</text>
						<text v-if="item.orderStatus == constant.ORDER_STATUS_APPROVAL" @click.stop="onSchedulingClick(item.applyId, item.vehicleNum)" class="button" style="background-color: #2F7FF0;">调度</text>
						<text v-if="item.orderStatus == constant.ORDER_STATUS_SCHEDULING" @click.stop="onStopSchedulingClick(item.applyId)" class="button" style="background-color: #FA3B30;">终止调度</text>
						<text v-if="item.orderStatus == constant.ORDER_STATUS_SCHEDULING" @click.stop="onAdjustSchedulingClick(item.applyId)" class="button" style="background-color: #2F7FF0;">调度转派</text>
						<text v-if="item.orderStatus == constant.ORDER_STATUS_SCHEDULING" @click.stop="onTakeClick(item.applyId)" class="button" style="background-color: #2F7FF0;">接单</text>
						<text v-if="item.orderStatus == constant.ORDER_STATUS_TAKE" @click.stop="onSendCarClick(item.applyId)" class="button" style="background-color: #2F7FF0;">派遣</text>
						<text v-if="item.orderStatus == constant.ORDER_STATUS_SEND_CAR" @click.stop="onReturnCarClick(item.applyId)" class="button" style="background-color: #2F7FF0;">回收</text>
					</view>
				</view>
			</scroll-view>
		</view>
		<popup-upload-photo ref="uploadPhotoPopup" buttonText="回收" @confirm="onUploadResult"></popup-upload-photo>
		<tabbar name="task"></tabbar>
	</view>
</template>

<script>

	export default {
		data() {
			return {
				title: '',
				constant: this.constant,
				menuButtonInfo: {},
				tabScrollable: false,
				headerHeight: 0,
				listHeight: 0,
				tabList: [],
				checkedTab: {},
				list: [],
				pageIndex: 1,
				isRefreshing: false,
				checkedApplyId: ''
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
				this.title = '巡检任务'
			}, 300)
			
			// 添加一个小的延迟来确保DOM渲染完成后再初始化数据
			this.$nextTick(() => {
				setTimeout(() => {
					this.initTab()
					this.loadData()
				}, 100)
			})
		},
		methods: {
			initTab(){
				let tabData = [
					{
						name: '待审批',
						status: this.constant.ORDER_STATUS_APPLY,
						color: '#EBA52B'
					},
					{
						name: '待调度',
						status: this.constant.ORDER_STATUS_APPROVAL,
						color: '#EBA52B'
					},
					{
						name: '待接单',
						status: this.constant.ORDER_STATUS_SCHEDULING,
						color: '#EBA52B'
					},
					{
						name: '待派遣',
						status: this.constant.ORDER_STATUS_TAKE,
						color: '#2F7FF0'
					},
					{
						name: '待回收',
						status: this.constant.ORDER_STATUS_SEND_CAR,
						color: '#2F7FF0'
					},
					{
						name: '已完成',
						status: this.constant.ORDER_STATUS_RETURN_CAR,
						color: '#52C132'
					},
					{
						name: '已撤销',
						status: this.constant.ORDER_STATUS_CANCEL,
						color: '#FA3B30'
					},
					{
						name: '已驳回',
						status: this.constant.ORDER_STATUS_REJECTED,
						color: '#FA3B30'
					}
				]
				let userType = uni.getStorageSync("userType")
				if (userType == this.constant.USER_TYPE_DRIVER) {
					//驾驶员
					this.tabList = [tabData[2],tabData[3],tabData[4],tabData[5]]
				}else if (userType == this.constant.USER_TYPE_ADMIN) {
					//管理员
					this.tabList = [tabData[0],tabData[1]]
				}else{
					this.tabScrollable = true
					this.tabList = tabData
				}
				this.checkedTab = this.tabList[0]
			},
			onApplyClick(e){
				uni.navigateTo({
					url: "/pages/apply/applyForm"
				})
			},
			onTabClick(item){
				this.checkedTab = item
				this.loadData()
			},
			onPhoneClick(e){
				uni.makePhoneCall({
					phoneNumber: e
				})
			},
			loadData(pageIndex = 1){
				this.api.get(this.apiUrl.vehicleApplyList, {
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
			refreshItem(id){
				let index = this.list.findIndex(it => it.applyId == id)
				this.api.get(this.apiUrl.vehicleApplyGet, {
					applyId: id
				}).then(res => {
					this.$set(this.list, index, res)
				})
			},
			removeItem(id){
				let index = this.list.findIndex(it => it.applyId == id)
				this.list.splice(index, 1)
			},
			onDetailClick(id){
				uni.navigateTo({
					url: "/pages/task/taskDetail?isFromTask=1&applyId=" + id
				})
			},
			onEditClick(id){
				uni.navigateTo({
					url: "/pages/apply/applyForm?editMode=1&applyId=" + id
				})
			},
			onApprovalClick(applyId, pass){
				let that = this
				let index = this.list.findIndex(it => it.applyId == applyId)
				uni.showModal({
					title: "提示",
					content: "确定要" + (pass ? "通过" : "不通过") + "吗？",
					success(e) {
						if(e.confirm){
							that.api.postJson(that.apiUrl.approvalApply, {
								applyId,
								approvealStatus: pass ? that.constant.APPROVAL_PASS : that.constant.APPROVAL_REJECT,
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
			onSchedulingClick(applyId, vehicleNum){
				uni.navigateTo({
					url: "/pages/task/scheduling?applyId=" + applyId + "&vehicleNum=" + vehicleNum
				})
			},
			onStopSchedulingClick(applyId){
				let that = this
				let index = this.list.findIndex(it => it.applyId == applyId)
				uni.showModal({
					title: "提示",
					content: "确定要终止调度吗？",
					success(e) {
						if(e.confirm){
							that.api.postJson(that.apiUrl.vehicleApplyUpdate, {
								applyId,
								orderStatus: that.constant.ORDER_STATUS_CANCEL,
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
			onAdjustSchedulingClick(applyId){
				uni.navigateTo({
					url: "/pages/task/scheduling?applyId=" + applyId + "&isAdjust=1"
				})
			},
			onTakeClick(applyId){
				let that = this
				let index = this.list.findIndex(it => it.applyId == applyId)
				uni.showModal({
					title: "提示",
					content: "确定要接单吗？",
					success(e) {
						if(e.confirm){
							that.api.postJson(that.apiUrl.vehicleApplyUpdate, {
								applyId,
								orderStatus: that.constant.ORDER_STATUS_TAKE,
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
			onSendCarClick(applyId){
				let that = this
				let index = this.list.findIndex(it => it.applyId == applyId)
				uni.showModal({
					title: "提示",
					content: "确定要派遣吗？",
					success(e) {
						if(e.confirm){
							that.api.postJson(that.apiUrl.vehicleApplyUpdate, {
								applyId,
								orderStatus: that.constant.ORDER_STATUS_SEND_CAR,
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
			onReturnCarClick(applyId){
				this.checkedApplyId = applyId
				this.$refs.uploadPhotoPopup.open()
			},
			onUploadResult(e){
				this.$refs.uploadPhotoPopup.close()
				let index = this.list.findIndex(it => it.applyId == this.checkedApplyId)
				this.api.postJson(this.apiUrl.vehicleApplyUpdate, {
					applyId: this.checkedApplyId,
					orderStatus: this.constant.ORDER_STATUS_RETURN_CAR,
					imageReturn: e.map(it => {
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
	
	.button-group{
		margin-top: 20px;
		display: flex;
		flex-direction: row;
		justify-content: flex-end;
	}
	
	.button{
		width: 90px;
		color: white;
		border-radius: 99px;
		line-height: 32px;
		text-align: center;
		font-size: 13px;
		margin-left: 20rpx;
	}
	
	.button-hollow{
		border: 1px solid #8A9199;
		border-radius: 99px;
		line-height: 32px;
		text-align: center;
		font-size: 13px;
		color: #18191A;
		padding: 0 13px;
		margin-left: 20rpx;
	}
</style>
