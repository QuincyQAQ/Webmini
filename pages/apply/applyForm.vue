<template>
	<view class="page" style="padding: 10px 15px;">
		<view class="header">
			<text @click="isApplyFlag = true" :class="isApplyFlag ? 'checked' : ''">申请</text>
			<text @click="isApplyFlag = false" :class="isApplyFlag ? '' : 'checked'" class="margin-left-10">补单</text>
		</view>
		<scroll-view scroll-y :style="{'height': scrollViewHeight + 'px'}" style="margin-bottom: 10px;">
			<view class="box">
				<!-- <view class="item">
					<view class="label">
						<text>申请人姓名</text>
						<text class="required">*</text>
					</view>
					<text class="text">{{model.applyName}}</text>
				</view>
				<view class="item">
					<view class="label">
						<text>申请人电话</text>
						<text class="required">*</text>
					</view>
					<text class="text">{{model.applyTel}}</text>
				</view> -->
				<!-- <view class="item">
					<view class="label">
						<text>申请人短号</text>
						<text class="required">*</text>
					</view>
					<u-input placeholder="请输入" border="none" inputAlign="right"></u-input>
				</view> -->
				<view class="item">
					<view class="label">
						<text>用机器人人姓名</text>
						<text class="required">*</text>
					</view>
					<u-input v-model="model.useName" placeholder="请输入" border="none" inputAlign="right" clearable></u-input>
				</view>
				<view class="item">
					<view class="label">
						<text>用机器人人电话</text>
						<text class="required">*</text>
					</view>
					<u-input v-model="model.useTel" placeholder="请输入" border="none" inputAlign="right" clearable></u-input>
				</view>
				<!-- <view class="item">
					<view class="label">
						<text>用机器人人短号</text>
						<text class="required">*</text>
					</view>
					<u-input placeholder="请输入" border="none" inputAlign="right"></u-input>
				</view>
				<view class="item">
					<view class="label">
						<text>用机器人人职务</text>
						<text class="required">*</text>
					</view>
					<u-input placeholder="请输入" border="none" inputAlign="right"></u-input>
				</view> -->
			</view>
			<view class="box margin-top-10">
				<!-- <view class="item">
					<view class="label">
						<text>是否派驾驶员</text>
					</view>
					<view class="radio">
						<u-radio-group :value="needDriver" placement="row" @change="groupChange">
						    <u-radio name="true" label="是" labelColor="#18191A"></u-radio>
							<view style="width: 30px;"></view>
						    <u-radio name="false" label="否" labelColor="#18191A"></u-radio>
						</u-radio-group>
					</view>
				</view> -->
				<view class="item">
					<view class="label">
						<text>所属公司</text>
						<text class="required">*</text>
					</view>
					<view @click="onOrgClick" class="select">
						<text>{{model.companyName ? model.companyName : '请选择'}}</text>
						<image src="/static/images/icon_menu_arrow.png"></image>
					</view>
				</view>
				<!-- <view class="item">
					<view class="label">
						<text>机器人类型</text>
					</view>
					<view class="select">
						<text>请选择</text>
						<image src="/static/images/icon_menu_arrow.png"></image>
					</view>
				</view> -->
				<!-- <view class="item">
					<view class="label">
						<text>机器人用途</text>
					</view>
					<view class="select">
						<text>公务用机器人</text>
						<image src="/static/images/icon_menu_arrow.png"></image>
					</view>
				</view> -->
				<view class="item">
					<view class="label">
						<text>用途</text>
						<text class="required">*</text>
					</view>
					<view @click="onPurposeClick" class="select">
						<text>{{constant.getPurposeName(model.purpose, '请选择')}}</text>
						<image src="/static/images/icon_menu_arrow.png"></image>
					</view>
				</view>
				<view class="item">
					<view class="label">
						<text>事由</text>
						<text class="required">*</text>
					</view>
					<u-input v-model="model.remark" placeholder="请输入" border="none" inputAlign="right" clearable></u-input>
				</view>
				<view class="item">
					<view class="label">
						<text>上车地点</text>
						<text class="required">*</text>
					</view>
					<u-input v-model="model.boardingLocation" placeholder="请输入" border="none" inputAlign="right" clearable></u-input>
				</view>
			</view>
			<view class="box margin-top-10">
				<view class="linear-vertical" v-for="(item, index) in model.destination" :key="index">
					<!-- <view class="item">
						<view class="label">
							<text>目的地{{index + 1}}</text>
							<text class="required">*</text>
						</view>
						<view class="select">
							<text>{{item.address ? item.address : '请选择'}}</text>
							<image src="/static/images/icon_menu_arrow.png"></image>
						</view>
					</view> -->
					<view class="item">
						<view class="label">
							<text>目的地{{index + 1}}</text>
							<text class="required">*</text>
						</view>
						<u-input v-model="item.address" placeholder="请输入目的地地址" border="none" inputAlign="right" clearable></u-input>
					</view>
				</view>
				<view style="padding: 10px 0;">
					<u-button @click="onAddAdress" customStyle="color:#317EF1" color="#F2F2F2" text="添加目的地"></u-button>
				</view>
			</view>
			<view class="box margin-top-10">
				<view class="item">
					<view class="label">
						<text>上车时间</text>
						<text class="required">*</text>
					</view>
					<view @click="selectBeginTime" class="select">
						<text>{{model.boardingTime ? model.boardingTime : '请选择日期'}}</text>
						<image src="/static/images/icon_menu_arrow.png"></image>
					</view>
				</view>
				<view class="item">
					<view class="label">
						<text>回收时间</text>
						<text class="required">*</text>
					</view>
					<view @click="selectEndTime" class="select">
						<text>{{model.returnTime ? model.returnTime : '请选择日期'}}</text>
						<image src="/static/images/icon_menu_arrow.png"></image>
					</view>
				</view>
				<view class="item">
					<view class="label flex-1">
						<text>用机器人人数</text>
					</view>
					<u-number-box v-model="model.userNum"></u-number-box>
				</view>
				<view class="item">
					<view class="label flex-1">
						<text>派车数量</text>
					</view>
					<u-number-box v-model="model.vehicleNum"></u-number-box>
				</view>
				<!-- <view class="item">
					<view class="label">
						<text>租车人姓名</text>
					</view>
					<u-input placeholder="请输入" border="none" inputAlign="right"></u-input>
				</view>
				<view class="item">
					<view class="label">
						<text>租车人电话</text>
					</view>
					<u-input placeholder="请输入" border="none" inputAlign="right"></u-input>
				</view>
				<view class="item">
					<view class="label">
						<text>备注/建议</text>
					</view>
				</view> -->
				<!-- <u-textarea placeholder="请输入" height="100"></u-textarea> -->
				<view class="item">
					<view class="label">
						<text>图片上传  {{photoList.length}}/6</text>
					</view>
				</view>
				<u-upload
					:fileList="photoList"
					multiple
					maxCount="6"
					@afterRead="onUploadImage"
					@delete="onDeleteImage"
				></u-upload>
			</view>
		</scroll-view>
		<u-button @click="onSaveClick" color="#317EF1" text="提交申请"></u-button>
		<tree-picker ref="orgPicker" title="选择部门" :treeData="orgData" labelKey="name" @onChecked="onOrgPickerChecked"></tree-picker>
		<u-datetime-picker :show="showBeginTime" v-model="dateTime" title="上车时间" mode="datetime" @confirm="onBeginTimeConfirm" @cancel="showBeginTime = false"></u-datetime-picker>
		<u-datetime-picker :show="showEndTime" v-model="dateTime" title="回收时间" mode="datetime" @confirm="onEndTimeConfirm" @cancel="showEndTime = false"></u-datetime-picker>
	</view>
</template>

<script>

	export default {
		data() {
			return {
				scrollViewHeight: 0,
				needDriver: false,
				editMode: false, //编辑模式
				applyId: '',
				isApplyFlag: true,
				model: {
					applyName: '', //申请人姓名
					applyTel: '', //申请人电话
					useName: '', //用机器人人姓名
					useTel: '', //用机器人人电话
					companyId: '', //所属作业公司id
					companyName: '', //所属作业公司名称
					purpose: '', //用途: 0：出差，1：调研，2：招聘，3：拜访客户，4：参加会议，5：接待客户
					purposeName: '', //用途名称
					remark: '', //事由
					boardingLocation: '', //上车地点
					destination: [
						{
							name: '',
							address: ''
						}
					], //目的地
					boardingTime: '', //上车时间
					returnTime: '', //返程时间
					userNum: 1, //用机器人人数
					vehicleNum: 1, //派车数量
					imageList: [], //图片上传列表
				},
				photoList: [],
				orgData: [],
				showBeginTime: false,
				showEndTime: false,
				dateTime: new Date().getTime(),
				isFromDetail: false,
			}
		},
		onLoad(options) {
			let sys = uni.getSystemInfoSync()
			this.scrollViewHeight = sys.windowHeight - 130
			this.editMode = options.editMode == 1
			this.applyId = options.applyId
			this.isFromDetail = options.isFromDetail == 1
			this.loadOrg()
			if(this.editMode){
				this.api.get(this.apiUrl.vehicleApplyGet, {
					applyId: this.applyId
				}).then(res => {
					this.model = res
				})
			}
		},
		methods: {
			loadOrg(){
				this.api.postQuery(this.apiUrl.orgData).then(res => {
					this.orgData = res
				})
			},
			onOrgClick(){
				this.$refs.orgPicker.show();
			},
			onAddAdress(){
				this.model.destination.push({
					name: '',
					address: ''
				})
			},
			onOrgPickerChecked(e){
				this.model.companyId = e.checkedIds[0]
				this.model.companyName = e.checkedLabels[0]
			},
			onOrgReset(e){
				
			},
			onPurposeClick(){
				let purposeList = [
					{
						id: "0",
						name: "出差"
					},
					{
						id: "1",
						name: "调研"
					},
					{
						id: "2",
						name: "招聘"
					},
					{
						id: "3",
						name: "拜访客户"
					},
					{
						id: "4",
						name: "参加会议"
					},
					{
						id: "5",
						name: "接待客户"
					},
				]
				let that = this
				uni.showActionSheet({
					itemList: purposeList.map(it => it.name),
					success(e) {
						that.model.purpose = e.tapIndex
						that.model.purposeName = purposeList[e.tapIndex].name
					}
				})
			},
			selectBeginTime(){
				this.showBeginTime = true
			},
			selectEndTime(){
				this.showEndTime = true
			},
			onBeginTimeConfirm(e){
				this.showBeginTime = false
				this.model.boardingTime = this.dateUtils.getDateTimeStr(new Date(e.value))
			},
			onEndTimeConfirm(e){
				this.showEndTime = false
				this.model.returnTime = this.dateUtils.getDateTimeStr(new Date(e.value))
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
			onSaveClick(){
				if(!this.model.useName){
					uni.showToast({
						title: "请输入用机器人人姓名",
						icon: "none"
					})
					return
				}
				if(!this.model.useTel){
					uni.showToast({
						title: "请输入用机器人人电话",
						icon: "none"
					})
					return
				}
				if(!this.model.companyId){
					uni.showToast({
						title: "请选择所属公司",
						icon: "none"
					})
					return
				}
				if(this.model.purpose.length == 0){
					uni.showToast({
						title: "请选择用途",
						icon: "none"
					})
					return
				}
				if(!this.model.remark){
					uni.showToast({
						title: "请输入事由",
						icon: "none"
					})
					return
				}
				if(!this.model.boardingLocation){
					uni.showToast({
						title: "请输入上车地点",
						icon: "none"
					})
					return
				}
				if(!this.model.boardingTime){
					uni.showToast({
						title: "请输入上车时间",
						icon: "none"
					})
					return
				}
				if(!this.model.returnTime){
					uni.showToast({
						title: "请输入回收时间",
						icon: "none"
					})
					return
				}
				let data = this.model
				if(this.photoList.length > 0){
					data.imageList = this.photoList.map(it => {
						return {
							name: '',
							path: it.path
						}
					})
				}
				if(this.editMode){
					//编辑模式
					this.api.postJson(this.apiUrl.vehicleApplyUpdate, data).then(res => {
						uni.showToast({
							title: "操作成功"
						})
						setTimeout(() => {
							let pages = getCurrentPages()
							if(this.isFromDetail){
								//来自详情
								pages[pages.length - 2].$vm.loadData()
								pages[pages.length - 3].$vm.refreshItem(this.applyId)
							}else{
								//来自列表
								pages[pages.length - 2].$vm.refreshItem(this.applyId)
							}
							uni.navigateBack()
						}, 2000)
					})
				}else{
					//新增模式
					this.api.postJson(this.apiUrl.vehicleApplySave, data).then(res => {
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
	}
</script>

<style>
	.header{
		font-size: 15px;
		display: flex;
		flex-direction: row;
	}
	
	.header text{
		height: 40px;
		line-height: 40px;
		flex: 1;
		text-align: center;
		background-color: white;
		border-radius: 5px;
		color: #18191A;
		font-size: 15px;
	}
	
	.header .checked{
		color: #FFFFFF;
		background-color: #317EF1;
		margin-bottom: 10px;
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
		color: #5C6166;
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
