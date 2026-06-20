<template>
	<view class="page" style="padding: 10px 15px;">
		<scroll-view scroll-y :style="{'height': scrollViewHeight + 'px'}">
			<view class="box">
				<view @click="onCompanyClick" class="item">
					<view class="label">
						<text>所属部门</text>
						<text class="required">*</text>
					</view>
					<view class="select">
						<text>{{model.companyId ? model.companyName : "请选择"}}</text>
						<image src="/static/images/icon_menu_arrow.png"></image>
					</view>
				</view>
				<view @click="onVehicleClick" class="item">
					<view class="label">
						<text>机器人编号码</text>
						<text class="required">*</text>
					</view>
					<view class="select">
						<text>{{model.numberPlate ? model.numberPlate : "请选择"}}</text>
						<image src="/static/images/icon_menu_arrow.png"></image>
					</view>
				</view>
			</view>
			<view class="box margin-top-10">
				<view @click="onReasonClick" class="item">
					<view class="label">
						<text>维修原因</text>
						<text class="required">*</text>
					</view>
					<view class="select">
						<text>{{model.repairReasonName ? model.repairReasonName : "请选择"}}</text>
						<image src="/static/images/icon_menu_arrow.png"></image>
					</view>
				</view>
				<view @click="onFactoryClick" class="item">
					<view class="label">
						<text>维修厂</text>
						<text class="required">*</text>
					</view>
					<view class="select">
						<text>{{model.repairCompany ? model.repairCompany : "请选择"}}</text>
						<image src="/static/images/icon_menu_arrow.png"></image>
					</view>
				</view>
				<view @click="showTime = true" class="item">
					<view class="label">
						<text>维修时间</text>
						<text class="required">*</text>
					</view>
					<view class="select">
						<text>{{model.repairTime ? model.repairTime : "请选择"}}</text>
						<image src="/static/images/icon_menu_arrow.png"></image>
					</view>
				</view>
				<view class="item">
					<view class="label">
						<text>预估维修费用</text>
						<text class="required">*</text>
					</view>
					<u-input v-model="model.expectCost" type="digit" placeholder="请输入" border="none" inputAlign="right">
						<template slot="suffix">
							<text>元</text>
						</template>
					</u-input>
				</view>
			</view>
			<view class="box margin-top-10">
 				<!--<view class="item">
					<view class="label">
						<text>办理人</text>
					</view>
					<view class="select">
						<text>请输入</text>
						<image src="/static/images/icon_menu_arrow.png"></image>
					</view>
				</view>
				<view class="item">
					<view class="label">
						<text>新增维修费用</text>
					</view>
					<view class="select">
						<text>请输入</text>
						<image src="/static/images/icon_menu_arrow.png"></image>
					</view>
				</view>-->
				<view class="item">
					<view class="label">
						<text>维修项目</text>
					</view>
				</view>
				<u--textarea v-model="model.orderRepair" placeholder="请输入（最多200字）" height="80"></u--textarea>
				<view class="item">
					<view class="label">
						<text>备注</text>
					</view>
				</view>
				<u--textarea v-model="model.remark" placeholder="请输入" height="80"></u--textarea>
				<view class="item">
					<view class="label">
						<text>图片上传  {{photoList.length}}/6</text>
					</view>
				</view>
				<u-upload
					:fileList="photoList"
					name="file"
					multiple
					maxCount="6"
					@afterRead="onUploadImage"
					@delete="onDeleteImage"
				></u-upload>
			</view>
		</scroll-view>
		<u-button @click="onSubmitClick" customStyle="margin-top:10px" color="#317EF1" text="提交"></u-button>
		<tree-picker ref="orgPicker" title="选择部门" :treeData="orgData" labelKey="name" @onChecked="onOrgPickerChecked"></tree-picker>
		<u-datetime-picker :show="showTime" v-model="currentDate" title="维修时间" mode="datetime" @confirm="onTimeConfirm" @cancel="showTime = false"></u-datetime-picker>
	</view>
</template>

<script>
import constant from '../../config/constant'

	export default {
		data() {
			return {
				scrollViewHeight: 0,
				content: '',
				model: {
					companyId: '',
					companyName: '',
					vehicleId: '',
					numberPlate: '',
					repairrReason: '',
					repairReasonName: '',
					repairCompany: '',
					pointsWgs84: [],
					repairTime: '',
					expectCost: '',
					orderRepair: '',
					remark: ''
				},
				orgData: [],
				photoList: [],
				showTime: false,
				currentDate: new Date().getTime()
			}
		},
		onLoad() {
			let sys = uni.getSystemInfoSync()
			this.scrollViewHeight = sys.windowHeight - 80
			this.loadOrg()
		},
		methods: {
			loadOrg(){
				this.api.postQuery(this.apiUrl.orgData).then(res => {
					this.orgData = res
				})
			},
			onCompanyClick(){
				this.$refs.orgPicker.show();
			},
			onVehicleClick(){
				if(!this.model.companyId){
					uni.showToast({
						title: "请先选择部门",
						icon: "none"
					})
					return
				}
				uni.navigateTo({
					url: "/pages/index/search?companyId=" + this.model.companyId
				})
			},
			onOrgPickerChecked(e){
				this.model.companyId = e.checkedIds[0]
				this.model.companyName = e.checkedLabels[0]
			},
			onSearchResult(item){
				this.model.vehicleId = item.id
				this.model.numberPlate = item.numberPlate
			},
			onReasonClick(){
				let that = this
				let list = constant.getRepairReasonList()
				uni.showActionSheet({
					itemList: list.map(it => it.name),
					success(e) {
						let item = list[e.tapIndex]
						that.model.repairrReason = item.id
						that.model.repairReasonName = item.name
					}
				})
			},
			onFactoryClick(){
				let that = this
				uni.chooseLocation({
					success(res) {
						that.model.repairCompany = res.address + res.name
						that.model.pointsWgs84 = [
							{
								lat: res.latitude,
								lng: res.longitude
							}
						]
					}
				})
			},
			onTimeConfirm(e){
				this.showTime = false
				this.model.repairTime = this.dateUtils.getDateTimeStr(new Date(e.value))
			},
			async onUploadImage(event){
				let that = this
				let lists = [].concat(event.file)
				let fileListLen = this.photoList.length
				lists.map((item) => {
					this.photoList.push({
						...item,
						status: 'uploading',
						message: '上传中'
					})
				})
				for (let i = 0; i < lists.length; i++) {
					const result = await this.uploadPhoto(lists[i].url)
					let item = this.photoList[fileListLen]
					this.photoList.splice(fileListLen, 1, Object.assign(item, {
						status: 'success',
						message: '',
						path: result,
						url: this.apiUrl.baseUrl + result
					}))
					fileListLen++
				}
			},
			onDeleteImage(event){
				this.photoList.splice(event.index, 1)
			},
			uploadPhoto(url){
				let that = this
				return new Promise((resolve, reject) => {
					let a = uni.uploadFile({
						url: that.apiUrl.vehicleApplyUpload,
						filePath: url,
						name: 'file',
						success: (res) => {
							resolve(JSON.parse(res.data).data[0])
						},
						fail: (e) => {
							reject(e)
						}
					});
				})
			},
			onSubmitClick(e){
				if(!this.model.companyId){
					uni.showToast({
						title: "请选择所属部门",
						icon: "none"
					})
					return
				}
				if(!this.model.vehicleId){
					uni.showToast({
						title: "请选择机器人",
						icon: "none"
					})
					return
				}
				if(!this.model.repairReasonName){
					uni.showToast({
						title: "请选择维修原因",
						icon: "none"
					})
					return
				}
				if(!this.model.repairCompany){
					uni.showToast({
						title: "请选择维修厂",
						icon: "none"
					})
					return
				}
				if(!this.model.repairTime){
					uni.showToast({
						title: "请选择维修时间",
						icon: "none"
					})
					return
				}
				if(this.model.expectCost.length == 0){
					uni.showToast({
						title: "请输入预估维修费用",
						icon: "none"
					})
					return
				}
				if(!this.model.orderRepair){
					uni.showToast({
						title: "请输入维修项目",
						icon: "none"
					})
					return
				}
				if(this.photoList.length > 0){
					this.model.imageList = this.photoList.map(it => {
						return {
							name: '',
							path: it.path
						}
					})
				}
				this.api.postJson(this.apiUrl.repairSave, this.model).then(res => {
					uni.showToast({
						title: "操作成功"
					})
					setTimeout(() => {
						let pages = getCurrentPages()
						let prevPage = pages[pages.length - 2]
						prevPage.$vm.loadData()
						uni.navigateBack()
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
	
	.box{
		background-color: #FFFFFF;
		border-radius: 10px;
		padding: 0 15px;
		box-sizing: border-box;
	}
	
	.item{
		height: 44px;
		display: flex;
		flex-direction: row;
		align-items: center;
		box-sizing: border-box;
		font-size: 14px;
	}
	
	.label{
		width: 100px;
		color: #18191A;
	}
	
	.required{
		color: #FA3B30;
	}
	
	.text{
		flex: 1;
		text-align: right;
		color: #18191A;
	}
	
	.radio{
		flex: 1;
		display: flex;
		flex-direction: row;
	}
	
	.select{
		flex: 1;
		text-align: right;
		color: #18191A;
		display: flex;
		flex-direction: row;
		justify-content: flex-end;
	}
	
	.select image{
		margin-top: 4px;
		margin-left: 5px;
		width: 12px;
		height: 12px;
	}
</style>
