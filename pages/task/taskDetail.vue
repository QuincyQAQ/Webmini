<template>
	<view class="page">
		<view class="header-bg"></view>
		<view class="body">
			<view class="header-text">
				<image class="header-vehicle" src="/static/images/header_vehicle.png"></image>
			</view>
			<view class="panel linear-vertical">
				<view class="linear-horizontal flex-align-center">
					<text class="numberplate">{{dispatch && dispatch.numberPlate ? dispatch.numberPlate : "等待调度机器人..."}}</text>
					<!-- <text class="role">专员</text> -->
					<view class="flex-1"></view>
					<text class="status" :style="{'color': constant.getOrderStatusColor(model.orderStatus)}">{{constant.getOrderStatusText(model.orderStatus)}}</text>
				</view>
				<text class="info">机器人 {{model.vehicleNum}}辆  |  {{constant.getPurposeName(model.purpose)}}</text>
				<view class="person-box linear-vertical">
					<view class="linear-horizontal flex-align-center">
						<text class="name flex-1">{{model.useName}}</text>
						<image class="size-14" src="/static/images/task_phone.png"></image>
						<text @click="onPhoneClick(model.useTel)" class="phone margin-left-5">{{model.useTel}}</text>
					</view>
					<text class="margin-top-5">所属部门：{{model.companyName}}</text>
					<text class="margin-top-5">用机器人事由：{{model.remark}}</text>
				</view>
				<view class="address-box margin-top-15">
					<text class="address-tag" style="background-color: #2F7FF0;">上车地点</text>
					<text class="address-text">{{model.boardingLocation}}</text>
				</view>
				<view class="address-box margin-top-10">
					<text class="address-tag" style="background-color: #EBA52B;">目的地</text>
					<view class="margin-top-5" v-for="(item, index) in model.destination" :key="index">
						<text>{{item.address}}</text>
					</view>
				</view>
				<view v-if="isFromApply" class="button-group">
					<text v-if="model.orderStatus == constant.ORDER_STATUS_APPLY" @click="onCancelClick" class="button-hollow">撤销申请</text>
					<text v-if="model.orderStatus == constant.ORDER_STATUS_APPLY || model.orderStatus == constant.ORDER_STATUS_APPROVAL" @click="onEditClick" class="button" style="background-color: #2F7FF0;">修改目的地</text>
				</view>
				<view v-if="isFromTask" class="button-group">
					<text v-if="model.orderStatus == constant.ORDER_STATUS_APPLY || model.orderStatus == constant.ORDER_STATUS_APPROVAL" @click.stop="onEditClick(model.applyId)" class="button-hollow">修改目的地</text>
					<text v-if="model.orderStatus == constant.ORDER_STATUS_APPLY" @click.stop="onApprovalClick(model.applyId, false)" class="button" style="background-color: #FA3B30;">不通过</text>
					<text v-if="model.orderStatus == constant.ORDER_STATUS_APPLY" @click.stop="onApprovalClick(model.applyId, true)" class="button" style="background-color: #2F7FF0;">通过</text>
					<text v-if="model.orderStatus == constant.ORDER_STATUS_APPROVAL" @click.stop="onSchedulingClick(model.applyId)" class="button" style="background-color: #2F7FF0;">调度</text>
					<text v-if="model.orderStatus == constant.ORDER_STATUS_SCHEDULING" @click.stop="onStopSchedulingClick(model.applyId)" class="button" style="background-color: #FA3B30;">终止调度</text>
					<text v-if="model.orderStatus == constant.ORDER_STATUS_SCHEDULING" @click.stop="onAdjustSchedulingClick(model.applyId)" class="button" style="background-color: #2F7FF0;">调度转派</text>
					<text v-if="model.orderStatus == constant.ORDER_STATUS_SCHEDULING" @click.stop="onTakeClick(model.applyId)" class="button" style="background-color: #2F7FF0;">接单</text>
					<text v-if="model.orderStatus == constant.ORDER_STATUS_TAKE" @click.stop="onSendCarClick(model.applyId)" class="button" style="background-color: #2F7FF0;">派遣</text>
					<text v-if="model.orderStatus == constant.ORDER_STATUS_SEND_CAR" @click.stop="onReturnCarClick" class="button" style="background-color: #2F7FF0;">回收</text>
				</view>
			</view>
			<view class="box">
				<text>订单明细</text>
				<view class="item margin-top-15">
					<text class="label">用机器人时间</text>
					<text class="text">{{model.boardingTime}}</text>
				</view>
				<view class="item margin-top-10">
					<text class="label">预计返回时间</text>
					<text class="text">{{model.returnTime}}</text>
				</view>
				<view v-if="dispatch && dispatch.driverName" class="item margin-top-10">
					<text class="label">驾驶员</text>
					<text class="text">{{dispatch.driverName}}</text>
				</view>
				<view v-if="dispatch && dispatch.contactNumber" class="item margin-top-10">
					<text class="label">驾驶员电话</text>
					<text @click="onPhoneClick(dispatch.contactNumber)" class="text" style="color: #2F7FF0;">{{dispatch.contactNumber}}</text>
				</view>
			</view>
			<view v-if="model.imageList && model.imageList.length > 0" class="box margin-top-10">
				<text>申请照片</text>
				<view class="margin-top-15"></view>
				<u-album :urls="model.imageList" keyName="path" rowCount="3"></u-album>
			</view>
			<view v-if="model.imageReturn && model.imageReturn.length > 0" class="box margin-top-10">
				<text>回收照片</text>
				<view class="margin-top-15"></view>
				<u-album :urls="model.imageReturn" keyName="path" rowCount="3"></u-album>
			</view>
<!-- 			<view class="box margin-top-10">
				<text>审批信息</text>
				<view class="item margin-top-15">
					<text class="label">审批人</text>
					<text class="text">程佳林</text>
				</view>
				<view class="item margin-top-10">
					<text class="label">审批时间</text>
					<text class="text">2024-12-06 23:00:00</text>
				</view>
			</view>
			<view class="box margin-top-10">
				<text>调度信息</text>
				<view class="item margin-top-15">
					<text class="label">调度时间</text>
					<text class="text">2024-12-06 23:00:00</text>
				</view>
				<view class="item margin-top-10">
					<text class="label">调度人</text>
					<text class="text">侯季常</text>
				</view>
				<view class="item margin-top-10">
					<text class="label">机器人编号码</text>
					<view class="linear-horizontal flex-align-center">
						<image class="size-14" src="/static/images/icon_open_map.png"></image>
						<text class="numberplate">鄂S·5123A</text>
					</view>
				</view>
				<view class="item margin-top-10">
					<text class="label">驾驶员</text>
					<text class="text">杨万里</text>
				</view>
			</view> -->
		<view class="box margin-top-10">
			<text>摄像头</text>
			<view class="camera-box margin-top-10" :style="{background: cameraOn ? '#000' : '#F7F7F7'}" id="camera-container">
				<view v-show="!cameraOn" class="camera-off">
					<text class="camera-off-icon">📷</text>
					<text class="camera-off-text">点击下方按钮开启电脑摄像头</text>
				</view>
			</view>
			<view class="camera-btn" @click="toggleCamera">
			<view class="camera-flip-row" v-if="cameraOn">
				<view class="flip-btn" :class="{'flip-on': flipH}" @click="flipH = !flipH">
					<text>↔ 水平翻转</text>
				</view>
				<view class="flip-btn" :class="{'flip-on': flipV}" @click="flipV = !flipV">
					<text>↕ 垂直翻转</text>
				</view>
			</view>
				<text>{{cameraOn ? '关闭摄像头' : '📷 开启摄像头'}}</text>
			</view>
		</view>
	</view>
	<popup-upload-photo ref="uploadPhotoPopup" buttonText="回收" @confirm="onUploadResult"></popup-upload-photo>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				constant: this.constant,
				isFromApply: false,
				isFromTask: false,
				applyId: '',
				model: {
					imageList: [],
					imageReturn: []
				},
				dispatch: {},
				cameraOn: false,
				cameraStream: null,
			}
		},
		onLoad(options) {
			this.applyId = options.applyId
			this.isFromApply = options.isFromApply == 1
			this.isFromTask = options.isFromTask == 1
			console.log(options.isFromTask);
			this.loadData()
		},
		methods: {
			loadData(){
				this.api.get(this.apiUrl.vehicleApplyGet, {
					applyId: this.applyId
				}).then(res => {
					// 确保 imageList 和 imageReturn 存在，即使为空数组
					res.imageList = res.imageList || []
					res.imageReturn = res.imageReturn || []
					
					if(res.imageList){
						res.imageList.forEach(it => {
							it.path = this.config.photoUrl + it.path
						})
					}
					if(res.imageReturn){
						res.imageReturn.forEach(it => {
							it.path = this.config.photoUrl + it.path
						})
					}
					this.model = res
				})
				this.api.get(this.apiUrl.dispatchGet, {
					applyId: this.applyId
				}).then(res => {
					this.dispatch = res[0] || {}
				})
			},
			onEditClick(){
				uni.navigateTo({
					url: "/pages/apply/applyForm?editMode=1&isFromDetail=1&applyId=" + this.applyId
				})
			},
			onCancelClick(id){
				let that = this
				uni.showModal({
					title: "提示",
					content: "确定要撤销申请吗？",
					success(res) {
						if(res.confirm){
							that.api.postJson(that.apiUrl.vehicleApplyUpdate, {
								applyId: that.applyId,
								orderStatus: that.constant.ORDER_STATUS_CANCEL
							}).then(res => {
								uni.showToast({
									title: "操作成功"
								})
								setTimeout(() => {
									let pages = getCurrentPages()
									let prevPage = pages[pages.length - 2]
									prevPage.$vm.removeItem(id)
									uni.navigateBack()
								}, 2000)
							})
						}
					}
				})
			},
			onPhoneClick(e){
				uni.makePhoneCall({
					phoneNumber: e
				})
			},
			onApprovalClick(applyId, pass){
				let that = this
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
								setTimeout(() => {
									that.loadData()
									let pages = getCurrentPages()
									let prevPage = pages[pages.length - 2]
									prevPage.$vm.removeItem(applyId)
								}, 2000)
							})
						}
					}
				})
			},
			onSchedulingClick(applyId){
				uni.navigateTo({
					url: "/pages/task/scheduling?isFromDetail=1&applyId=" + applyId
				})
			},
			onStopSchedulingClick(applyId){
				let that = this
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
								setTimeout(() => {
									that.loadData()
									let pages = getCurrentPages()
									let prevPage = pages[pages.length - 2]
									prevPage.$vm.removeItem(applyId)
								}, 2000)
							})
						}
					}
				})
			},
			onAdjustSchedulingClick(applyId){
				uni.navigateTo({
					url: "/pages/task/scheduling?isFromDetail=1&applyId=" + applyId + "&isAdjust=1"
				})
			},
			onTakeClick(applyId){
				let that = this
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
								setTimeout(() => {
									that.loadData()
									let pages = getCurrentPages()
									let prevPage = pages[pages.length - 2]
									prevPage.$vm.removeItem(applyId)
								}, 2000)
							})
						}
					}
				})
			},
			onSendCarClick(applyId){
				let that = this
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
								setTimeout(() => {
									that.loadData()
									let pages = getCurrentPages()
									let prevPage = pages[pages.length - 2]
									prevPage.$vm.removeItem(applyId)
								}, 2000)
							})
						}
					}
				})
			},
			onReturnCarClick(){
				this.$refs.uploadPhotoPopup.open()
			},
			toggleCamera() {
				// #ifdef H5
				if (this.cameraOn) {
					if (this.cameraStream) {
						this.cameraStream.getTracks().forEach(t => t.stop())
						this.cameraStream = null
					}
					const old = document.getElementById('webcam-video')
					if (old) old.remove()
					this.cameraOn = false
				} else {
					this.cameraOn = true
					this.$nextTick(() => {
						const container = document.getElementById('camera-container')
						if (!container) return
						const video = document.createElement('video')
						video.id = 'webcam-video'
						video.autoplay = true
						video.playsInline = true
						video.style.width = '100%'
						video.style.height = '100%'
						video.style.objectFit = 'cover'
						video.style.borderRadius = '8px'
						video.style.transform = 'rotate(-90deg)'
					video.style.width = '220px'
					video.style.height = '220px'
					video.style.objectFit = 'cover'
					// 在容器内居中
					container.style.display = 'flex'
					container.style.alignItems = 'center'
					container.style.justifyContent = 'center'
						container.appendChild(video)
						navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
							video.srcObject = stream
							this.cameraStream = stream
						}).catch(err => {
							console.error('Camera:', err)
							video.remove()
							this.cameraOn = false
							uni.showToast({ title: '摄像头访问失败', icon: 'none' })
						})
					})
				}
				// #endif
			},
			onUploadResult(e){
				this.$refs.uploadPhotoPopup.close()
				this.api.postJson(this.apiUrl.vehicleApplyUpdate, {
					applyId: this.model.applyId,
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
					setTimeout(() => {
						this.loadData()
						let pages = getCurrentPages()
						let prevPage = pages[pages.length - 2]
						prevPage.$vm.removeItem(this.model.applyId)
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
		width: 100vw;
		min-height: 100vh;
	}
	
	.header-bg{
		width: 100%;
		height: 150px;
		position: absolute;
		background-color: #2F7FF0;
	}
	
	.body{
		position: absolute;
		width: 100%;
		max-width: 750rpx;
		display: flex;
		flex-direction: column;
		padding: 0px 15px 10px 15px;
		box-sizing: border-box;
		font-size: 18px;
		color: white;
	}
	
	.header-vehicle{
		width: 179px;
		height: 44px;
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
	
	.address-box{
		color: #18191A;
		font-size: 13px;
		display: flex;
		flex-direction: column;
	}
	
	.address-tag{
		display: inline;
		border-radius: 3px;
		font-weight: bold;
		width: 50px;
		text-align: center;
		line-height: 18px;
		font-size: 11px;
		color: white;
	}
	
	.address-text{
		margin-top: 5px;
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
		width: 100px;
	}
	
	.text{
		font-size: 13px;
		color: #18191A;
	}
	
	.numberplate{
		font-size: 20px;
		color: #2F7FF0;
		font-weight: bold;
		margin-left: 5px;
	}
.camera-box {
		width: 100%; height: 220px; border-radius: 8px;
		display: flex; align-items: center; justify-content: center; overflow: hidden;
	}
	.camera-video { width: 100%; height: 100%; object-fit: cover; }
	.camera-off { display: flex; flex-direction: column; align-items: center; }
	.camera-off-icon { font-size: 40px; margin-bottom: 10px; }
	.camera-off-text { color: #999; font-size: 13px; }
	.camera-btn { margin-top: 10px; text-align: center; padding: 10px; background: #2F7FF0; border-radius: 8px; color: #FFF; font-size: 14px; font-weight: 600; }
		.camera-box + .camera-btn { margin-bottom: 0; }
</style>
