<template>
	<view class="page">
		<view class="header" :style="{'height': headerHeight + 'px'}">
			<text class="title">{{title}}</text>
		</view>
		<view @click="onApplyClick" class="add linear-horizontal flex-align-center">
			<image class="size-14" src="/static/images/task_vehicle.png"></image>
			<text class="margin-left-5 flex-1">申请用机器人</text>
			<image class="size-12" src="/static/images/task_arrow.png"></image>
		</view>
		<u-tabs :list="tabList" @click="onTabClick" lineColor="#2F7FF0" scrollable></u-tabs>
		<view class="scroll-view">
			<scroll-view scroll-y class="list" :style="{'height': listHeight + 'px'}"
			refresher-enabled :refresher-triggered="isRefreshing" @refresherrefresh="onRefresh" @scrolltolower="onLoadMore">
				<view class="item linear-vertical" @click="onDetailClick(item.applyId)" v-for="(item, index) in list" :key="index">
					<view class="linear-horizontal flex-align-center">
						<text class="numberplate">{{item.numberPlate ? item.numberPlate : "等待分配巡检机器人..."}}</text>
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
						<text v-if="item.orderStatus == constant.ORDER_STATUS_APPLY" @click.stop="onCancelClick(item.applyId)" class="button-hollow">撤销申请</text>
						<text v-if="item.orderStatus == constant.ORDER_STATUS_APPLY || item.orderStatus == constant.ORDER_STATUS_APPROVAL" @click.stop="onEditClick(item.applyId)" class="button" style="background-color: #2F7FF0;">修改目的地</text>
						<text v-if="false" class="button" style="background-color: #FA3B30;">不通过</text>
						<text v-if="false" class="button" style="background-color: #2F7FF0;">通过</text>
						<text v-if="false" class="button" style="background-color: #2F7FF0;">接单</text>
						<text v-if="false" class="button" style="background-color: #2F7FF0;">派遣</text>
						<text v-if="false" class="button" style="background-color: #2F7FF0;">回收</text>
						<text v-if="false" class="button" style="background-color: #2F7FF0;">调度转派</text>
						<text v-if="false" class="button" style="background-color: #FA3B30;">终止调度</text>
					</view>
				</view>
			</scroll-view>
		</view>
		<tabbar name="apply"></tabbar>
	</view>
</template>

<script>

	export default {
		data() {
			return {
				title: '',
				constant: this.constant,
				menuButtonInfo: {},
				headerHeight: 0,
				listHeight: 0,
				tabList: [
					{
						name: '待审批',
						status: this.constant.ORDER_STATUS_APPLY,
						color: '#EBA52B'
					},
					{
						name: '空闲中',
						status: this.constant.ORDER_STATUS_APPROVAL,
						color: '#EBA52B'
					},
					{
						name: '任务中',
						status: this.constant.ORDER_STATUS_TAKE,
						color: '#2F7FF0'
					},
					{
						name: '充电中',
						status: this.constant.ORDER_STATUS_SEND_CAR,
						color: '#2F7FF0'
					},
					{
						name: '已完成',
						status: this.constant.ORDER_STATUS_RETURN_CAR,
						color: '#52C132'
					},
					{
						name: '已撤销/驳回',
						status: this.constant.ORDER_STATUS_CANCEL,
						color: '#FA3B30'
					}
				],
				checkedTab: {},
				list: [],
				pageIndex: 1,
				isRefreshing: false
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
				this.title = '巡检任务申请'
			}, 300)
			
			// 添加一个小的延迟来确保DOM渲染完成后再加载数据
			this.$nextTick(() => {
				setTimeout(() => {
					this.checkedTab = this.tabList[0]
					this.loadData()
				}, 100)
			})
		},
		methods: {
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
					url: "/pages/task/taskDetail?isFromApply=1&applyId=" + id
				})
			},
			onEditClick(id){
				uni.navigateTo({
					url: "/pages/apply/applyForm?editMode=1&applyId=" + id
				})
			},
			onCancelClick(id){
				let that = this
				let index = this.list.findIndex(it => it.applyId == id)
				uni.showModal({
					title: "提示",
					content: "确定要撤销申请吗？",
					success(res) {
						if(res.confirm){
							that.api.postJson(that.apiUrl.vehicleApplyUpdate, {
								applyId: id,
								orderStatus: that.constant.ORDER_STATUS_CANCEL
							}).then(res => {
								uni.showToast({
									title: "操作成功"
								})
								that.list.splice(index, 1)
							})
						}
					}
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
		background-color: #F2F2F2;
	}
	
	.header{
		width: 100vw;
		background-color: white;
	}
	
	.title{
		font-size: 18px;
		font-weight: bold;
		color: #18191A;
		line-height: 32px;
		padding-left: 16px;
	}
	
	.add{
		background-color: #fff;
		border-radius: 8px;
		height: 40px;
		margin: 10px 10px 0px 10px;
		color: #317EF1;
		font-size: 14px;
		padding: 0 15px;
	}
	
	.scroll-view{
		padding: 10px;
		box-sizing: border-box;
		background-color: #F2F2F2;
	}
	
	.item{
		background-color: white;
		border-radius: 10px;
		padding: 10px;
		margin-bottom: 10px;
	}
	
	.numberplate{
		color: #18191A;
		font-size: 20px;
		font-weight: bold;
	}
	
	.role{
		background-color: rgb(47,127,240, 0.1);
		padding: 4px 10px;
		color: #2F7FF0;
		font-size: 12px;
		border-radius: 99px;
		margin-left: 10px;
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
		border-radius: 10px;
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
		margin-left: 10px;
	}
	
	.button-hollow{
		border: 1px solid #8A9199;
		border-radius: 99px;
		line-height: 32px;
		text-align: center;
		font-size: 13px;
		color: #18191A;
		padding: 0 13px;
		margin-left: 10px;
	}
</style>
