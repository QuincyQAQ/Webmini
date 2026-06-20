<template>
	<view class="page" style="padding: 10px 15px;">
		<view @click="onCompanyClick" class="item">
			<text>所属部门</text>
			<text class="text">{{company.companyId ? company.companyName : "请选择"}}</text>
			<image class="size-12" src="/static/images/item_arrow.png"></image>
		</view>
		<scroll-view scroll-y class="list" :style="'height: ' + listHeight + 'px;'">
			<view v-for="(item, index) in list" :key="index" class="item-box">
				<view class="item">
					<text>第{{index + 1}}台机器人</text>
				</view>
				<view @click="onVehicleClick(index)" class="item">
					<text>机器人编号码</text>
					<text class="text">{{item.vehicleId ? item.numberPlate : "请选择"}}</text>
					<image class="size-12" src="/static/images/item_arrow.png"></image>
				</view>
				<view @click="onDriverClick(index)" class="item">
					<text>驾驶员</text>
					<text class="text">{{item.driverId ? item.driverName : "请选择"}}</text>
					<image class="size-12" src="/static/images/item_arrow.png"></image>
				</view>
			</view>
		</scroll-view>
		<u-button @click="onConfirmClick" style="margin: 20px 0;" color="#2F7FF0" shape="circle" text="确定"></u-button>
		<tree-picker ref="orgPicker" title="选择部门" :treeData="orgData" labelKey="name" @onChecked="onOrgPickerChecked"></tree-picker>
	</view> 
</template>

<script>

	export default {
		data() {
			return {
				applyId: '',
				isFromDetail: false,
				isAdjust: false,
				orgData: [],
				company: {},
				list: [],
				actionIndex: 0,
				listHeight: 0
			}
		},
		onLoad(options) {
			this.applyId = options.applyId
			this.vehicleNum = options.vehicleNum ?? 1
			this.isFromDetail = options.isFromDetail == 1
			this.isAdjust = options.isAdjust == 1
			let sys = uni.getSystemInfoSync()
			this.listHeight = sys.windowHeight - 124
			if(this.isAdjust){
				//调度转派
				uni.setNavigationBarTitle({
					title: "调度转派"
				})
				this.loadData()
			}else{
				//调度
			}
			for (var i = 0; i < this.vehicleNum; i++) {
				this.list.push({
					vehicleId: '',
					numberPlate: '',
					driverId: '',
					driverName: ''
				})
			}
			this.loadOrg()
		},
		methods: {
			loadData(){
				this.api.get(this.apiUrl.dispatchVehicleList, {
					applyId: this.applyId
				}).then(res => {
					
				})
			},
			loadOrg(){
				this.api.postQuery(this.apiUrl.orgData).then(res => {
					this.orgData = res
				})
			},
			onCompanyClick(){
				this.$refs.orgPicker.show();
			},
			onVehicleClick(index){
				this.actionIndex = index
				if(!this.company.companyId){
					uni.showToast({
						title: "请先选择部门",
						icon: "none"
					})
					return
				}
				uni.navigateTo({
					url: "/pages/index/search?companyId=" + this.company.companyId + '&vehicleTaskStatus=' + this.constant.TASK_STATUS_FREE
				})
			},
			onDriverClick(index){
				this.actionIndex = index
				if(!this.company.companyId){
					uni.showToast({
						title: "请先选择部门",
						icon: "none"
					})
					return
				}
				uni.navigateTo({
					url: "/pages/task/driverList?selectMode=1" + "&companyId=" + this.company.companyId
				})
			},
			onOrgPickerChecked(e){
				this.company = {
					companyId: e.checkedIds[0],
					companyName: e.checkedLabels[0]
				}
			},
			onOrgReset(){
				this.$refs.orgPicker.dismiss();
				this.company = {}
			},
			onSearchResult(item){
				this.list[this.actionIndex].vehicleId = item.id
				this.list[this.actionIndex].numberPlate = item.numberPlate
			},
			onDriverResult(item){
				this.list[this.actionIndex].driverId = item.id
				this.list[this.actionIndex].driverName = item.name
			},
			onConfirmClick(){
				if(!this.company.companyId){
					uni.showToast({
						title: "请选择所属部门",
						icon: "none"
					})
					return
				}
				let hasError = this.list.some((item,index) => {
					let tipPrefix = "请选择第" + (index + 1) + "台机器人的"
					if(!item.vehicleId){
						hasError = true
						uni.showToast({
							title: tipPrefix + "机器人编号码",
							icon: "none"
						})
						return true
					}
					if(!item.driverId){
						hasError = true
						uni.showToast({
							title: tipPrefix + "驾驶员",
							icon: "none"
						})
						return true
					}
					return false
				})
				if(hasError) return
				let url = this.isAdjust ? this.apiUrl.dispatchVehicleAdjust : this.apiUrl.dispatchVehicle
				let data = this.list.map(it => {
					return {
						applyId: this.applyId,
						companyId: this.company.companyId,
						driverId: it.driverId,
						vehicleId: it.vehicleId
					}
				})
				this.api.postJson(url, data).then(res => {
					uni.showToast({
						title: "操作成功"
					})
					setTimeout(() => {
						let pages = getCurrentPages()
						if(this.isAdjust){
							//调度转派
							if(this.isFromDetail){
								//来自详情
								pages[pages.length - 2].$vm.loadData()
							}
						}else{
							if(this.isFromDetail){
								//来自详情
								pages[pages.length - 2].$vm.loadData()
								pages[pages.length - 3].$vm.removeItem(this.applyId)
							}else{
								//来自列表
								pages[pages.length - 2].$vm.removeItem(this.applyId)
							}
						}
						uni.navigateBack()
					}, 2000)
				})
			},
		}
	}
</script>

<style>
	
	.list{
		display: flex;
		flex-direction: column;
		box-sizing: border-box;
		margin: 10px 0;
	}
	
	.item{
		background-color: white;
		border-radius: 8px;
		padding: 0 15px;
		color: #18191A;
		font-size: 14px;
		display: flex;
		flex-direction: row;
		align-items: center;
		line-height: 44px;
	}
	
	.item-box{
		background-color: white;
		border-radius: 8px;
		margin-bottom: 10px;
		box-sizing: border-box;
	}
	
	.text{
		flex: 1;
		text-align: right;
		padding: 0 13px;
	}
</style>
