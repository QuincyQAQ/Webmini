<template>
	<view class="page">
		<view class="header-bg"></view>
		<view class="body">
			<view class="header-text">
				<!-- <text>等待审批</text> -->
				<image class="header-fix" src="/static/images/header_fix.png"></image>
			</view>
			<view class="panel linear-vertical">
				<view class="linear-horizontal flex-align-center">
					<text class="numberplate">{{model.numberPlate}}</text>
					<text class="role">{{model.companyName}}</text>
					<view class="flex-1"></view>
					<text class="status" :style="{'color': constant.getRepairStatusColor(model.orderStatus)}">{{constant.getRepairStatusText(model.orderStatus)}}</text>
				</view>
				<!-- <text class="info">厂牌型号：红旗L20 舒适款</text> -->
				<view class="text linear-horizontal flex-space-between margin-top-15">
					<text>送修人</text>
					<text>{{model.driverName}}</text>
				</view>
				<!-- <view class="text linear-horizontal flex-space-between margin-top-10">
					<text>送修里程</text>
					<text>100</text>
				</view> -->
				<view class="text linear-horizontal flex-space-between margin-top-10">
					<text>送修日期</text>
					<text>{{model.repairTime}}</text>
				</view>
				<view class="text linear-horizontal flex-space-between margin-top-10">
					<text>委托维修单位</text>
					<text class="content">{{model.repairCompany}}</text>
				</view>
				<view class="button-group">
					<text v-if="model.orderStatus == constant.REPAIR_STATUS_APPLY"  @click="onCancelClick" class="button-white">撤回</text>
					<text v-if="model.orderStatus == constant.REPAIR_STATUS_APPLY && (userType == constant.USER_TYPE_SYS || userType == constant.USER_TYPE_ADMIN)"  
					@click="onApprovalClick" class="button-blue">审批</text>
					<text v-if="model.orderStatus == constant.REPAIR_STATUS_APPROVAL" @click.stop="onFixingClick" class="button-blue">已送修</text>
					<text v-if="model.orderStatus == constant.REPAIR_STATUS_FIXING" @click.stop="onFinishClick" class="button-blue">维修完成</text>
				</view>
			</view>
			<view class="box">
				<text>预约明细</text>
				<!-- <view class="item margin-top-15">
					<text class="label">上次维修日期</text>
					<text class="text">2024-12-06 23:00:00</text>
				</view>
				<view class="item margin-top-10">
					<text class="label">上次维修费用</text>
					<text class="text">1200</text>
				</view>
				<view class="item margin-top-10">
					<text class="label">上次维修里程</text>
					<text class="text">5000</text>
				</view>
				<view class="item margin-top-10">
					<text class="label">上次维修单位</text>
					<text class="text">某某某修理厂</text>
				</view>
				<view class="item margin-top-10">
					<text class="label">上次维修项目</text>
					<text class="text">发动机保养</text>
				</view> -->
				<view class="item margin-top-10">
					<text class="label">维修原因</text>
					<text class="text">{{constant.getRepairReasonText(model.repairReason)}}</text>
				</view>
				<view class="item margin-top-10">
					<text class="label">维修项目</text>
					<text class="text">{{model.orderRepair}}</text>
				</view>
				<view class="item margin-top-10">
					<text class="label">预估维修费用</text>
					<text class="text">{{model.expectCost}}元</text>
				</view>
				<view v-if="model.orderStatus == constant.REPAIR_STATUS_FINISH" class="item margin-top-10">
					<text class="label">实际维修费用</text>
					<text class="text">{{model.repairCost}}元</text>
				</view>
				<view class="item margin-top-10">
					<text class="label">备注</text>
					<text class="text">{{model.remark}}</text>
				</view>
			</view>
			<!-- <view class="box margin-top-10">
				<text>审批明细</text>
				<view class="item margin-top-15">
					<text class="label">审批时间</text>
					<text class="text">2024-12-06 23:00:00</text>
				</view>
				<view class="item margin-top-10">
					<text class="label">审批人</text>
					<text class="text">杨万里</text>
				</view>
				<view class="item margin-top-10">
					<text class="label">审批意见</text>
					<text class="text">同意维修</text>
				</view>
			</view>
			<view class="box margin-top-10">
				<text>分配明细</text>
				<view class="item margin-top-15">
					<text class="label">分配时间</text>
					<text class="text">2024-12-06 23:00:00</text>
				</view>
				<view class="item margin-top-10">
					<text class="label">分配人</text>
					<text class="text">杨万里</text>
				</view>
				<view class="item margin-top-10">
					<text class="label">维修单位</text>
					<text class="text">随州市政府</text>
				</view>
			</view>
			<view class="box margin-top-10">
				<text>维修明细</text>
				<view class="item margin-top-15">
					<text class="label">维修时间</text>
					<text class="text">2024-12-06 23:00:00</text>
				</view>
				<view class="item margin-top-10">
					<text class="label">维修人</text>
					<text class="text">杨万里</text>
				</view>
				<view class="item margin-top-10">
					<text class="label">维修原因</text>
					<text class="text">轮胎补休</text>
				</view>
				<view class="item margin-top-10">
					<text class="label">维修费用</text>
					<text class="text">5000元</text>
				</view>
				<view class="item margin-top-10">
					<text class="label">新增维修费用</text>
					<text class="text">2000元</text>
				</view>
				<view class="item margin-top-10">
					<text class="label">维修项目</text>
					<text class="text">发动机保养</text>
				</view>
				<view class="item margin-top-10">
					<text class="label">审核时间</text>
					<text class="text">2024-12-05 16:08:07</text>
				</view>
				<view class="item margin-top-10">
					<text class="label">姓名</text>
					<text class="text">杨万里</text>
				</view>
				<view class="item margin-top-10">
					<text class="label">审核意见</text>
					<text class="text">无</text>
				</view>
				<view class="item margin-top-10">
					<text class="label">批复时间</text>
					<text class="text">2024-12-05 16:08:07</text>
				</view>
				<view class="item margin-top-10">
					<text class="label">姓名</text>
					<text class="text">杨万里</text>
				</view>
				<view class="item margin-top-10">
					<text class="label">批复意见</text>
					<text class="text">无</text>
				</view>
			</view>
			<view class="box margin-top-10">
				<view class="item">
					<text class="label">送修人确认时间</text>
					<text class="text">2024-12-05 16:08:07</text>
				</view>
			</view> -->
			<view v-if="model.imageList.length > 0" class="box margin-top-10">
				<text>申请照片</text>
				<view class="margin-top-15"></view>
				<u-album :urls="model.imageList" keyName="path" rowCount="3"></u-album>
			</view>
			<view v-if="model.imageRepair.length > 0" class="box margin-top-10">
				<text>维修完成照片</text>
				<view class="margin-top-15"></view>
				<u-album :urls="model.imageRepair" keyName="path" rowCount="3"></u-album>
			</view>
		</view>
		<popup-upload-photo ref="uploadPhotoPopup" buttonText="维修完成" @confirm="onUploadResult" showMoney></popup-upload-photo>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				repairId: '',
				userType: -1,
				model: {
					imageList: [],
					imageRepair: []
				},
				constant: this.constant,
			}
		},
		onLoad(options) {
			this.repairId = options.repairId
			this.userType = uni.getStorageSync("userType")
			this.loadData()
		},
		methods: {
			loadData(){
				this.api.get(this.apiUrl.repairGet, {
					repairId: this.repairId
				}).then(res => {
					if(res.imageList){
						res.imageList.forEach(it => {
							it.path = this.config.photoUrl + it.path
						})
					}
					if(res.imageRepair){
						res.imageRepair.forEach(it => {
							it.path = this.config.photoUrl + it.path
						})
					}
					this.model = res
				})
			},
			onCancelClick(){
				let that = this
				uni.showModal({
					title: "提示",
					content: "确定要撤回维修申请吗？",
					success(res) {
						if(res.confirm){
							that.api.postJson(that.apiUrl.repairUpdate, {
								repairId: that.repairId,
								orderStatus: that.constant.REPAIR_STATUS_CANCEL
							}).then(res => {
								uni.showToast({
									title: "操作成功"
								})
								setTimeout(() => {
									that.loadData()
									let pages = getCurrentPages()
									let prevPage = pages[pages.length - 2]
									prevPage.$vm.removeItem(that.repairId)
								}, 2000)
							})
						}
					}
				})
			},
			onApprovalClick(){
				uni.navigateTo({
					url: "/pages/fix/approval?repairId=" + this.repairId
				})
			},
			onFixingClick(){
				let that = this
				uni.showModal({
					title: "提示",
					content: "确定已送修吗？",
					success(res) {
						if(res.confirm){
							that.api.postJson(that.apiUrl.repairUpdate, {
								repairId: that.repairId,
								orderStatus: that.constant.REPAIR_STATUS_FIXING
							}).then(res => {
								uni.showToast({
									title: "操作成功"
								})
								setTimeout(() => {
									that.loadData()
									let pages = getCurrentPages()
									let prevPage = pages[pages.length - 2]
									prevPage.$vm.removeItem(that.repairId)
								}, 2000)
							})
						}
					}
				})
			},
			onFinishClick(index){
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
				this.api.postJson(this.apiUrl.repairUpdate, {
					repairId: this.model.repairId,
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
					setTimeout(() => {
						this.loadData()
						let pages = getCurrentPages()
						let prevPage = pages[pages.length - 2]
						prevPage.$vm.removeItem(this.model.repairId)
					}, 2000)
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
		position: relative;
		box-sizing: border-box;
	}
	
	.header-bg{
		width: 750rpx;
		height: 150px;
		position: absolute;
		background-color: #2F7FF0;
	}
	
	.body{
		position: absolute;
		width: 750rpx;
		display: flex;
		flex-direction: column;
		padding: 0px 15px 10px 15px;
		box-sizing: border-box;
		font-size: 18px;
		color: white;
	}
	
	.header-fix{
		width: 65px;
		height: 60px;
	}
	
	.header-text{
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		width: 100%;
	}
	
	.panel{
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
	
	.content{
		flex: 1;
		margin-left: 15px;
		text-align: right;
	}
	
	.button-group{
		margin-top: 20px;
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
		margin-left: 10px;
	}
	
	.button-white{
		border: 1px solid #8A9199;
		width: 90px;
		border-radius: 99px;
		line-height: 36px;
		text-align: center;
		font-size: 13px;
		color: #18191A;
		margin-left: 10px;
	}
	
	.box{
		background-color: white;
		box-sizing: border-box;
		border-radius: 10px;
		font-size: 14px;
		color: #18191A;
		padding: 15px;
		font-weight: 600;
	}
	
	.item{
		display: flex;
		flex-direction: row;
		justify-content: space-between;
	}
	
	.label{
		font-size: 13px;
		color: #8A9199;
	}

</style>
