<template>
	<view class="page" style="padding: 10px 15px;">
		<image @click="onAvatarClick" class="avatar" :src="avatar"></image>
		<view class="box">
			<view class="item">
				<view class="label">
					<text>账号</text>
				</view>
				<u-input v-model="model.username" placeholder="请输入" border="none" disabled disabledColor="#fff"></u-input>
			</view>
			<view class="item">
				<view class="label">
					<text>所属部门</text>
				</view>
				<u-input v-model="model.companyName" placeholder="请输入" border="none" disabled disabledColor="#fff"></u-input>
			</view>
			<view class="item">
				<view class="label">
					<text>手机号码</text>
				</view>
				<u-input v-model="model.phoneNumber" placeholder="请输入" border="none" disabled disabledColor="#fff"></u-input>
			</view>
			<view class="item">
				<view class="label">
					<text>用户类型</text>
				</view>
				<u-input :value="getUserTypeName(model.userType)" placeholder="请输入" border="none" disabled disabledColor="#fff"></u-input>
			</view>
			<view class="item">
				<view class="label">
					<text>姓名</text>
				</view>
				<u-input v-model="model.name" placeholder="请输入" border="none"></u-input>
				<image style="margin-left: 10px;" class="size-14" src="/static/images/icon_menu_arrow.png"></image>
			</view>
			<view class="item">
				<view class="label">
					<text>邮箱</text>
				</view>
				<u-input v-model="model.email" placeholder="请输入" border="none"></u-input>
				<image style="margin-left: 10px;" class="size-14" src="/static/images/icon_menu_arrow.png"></image>
			</view>
			<view class="item">
				<view class="label">
					<text>性别</text>
				</view>
				<u-radio-group v-model="model.sex" placement="row">
				    <u-radio label="男" :name="0"></u-radio>
					<view style="width: 20px;"></view>
				    <u-radio label="女" :name="1"></u-radio>
				</u-radio-group>
			</view>
		</view>
		<u-button @click="onSubmitClick" customStyle="margin-top:20px" shape="circle" color="#317EF1" text="保存"></u-button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				model: {
					sex: '0'
				},
				avatar: '/static/images/avatar.png'
			}
		},
		onLoad() {
			this.loadData()
		},
		methods: {
			loadData(){
				this.api.postQuery(this.apiUrl.userInfoGet).then(res => {
					this.model = res
					if(res.photo){
						this.avatar = this.config.photoUrl + res.photo
					}
				})
			},
			getUserTypeName(userType){
				if(userType == this.constant.USER_TYPE_SYS){
					return "系统用户"
				}else if(userType == this.constant.USER_TYPE_MOBILE){
					return "移动端用户"
				}else if(userType == this.constant.USER_TYPE_DRIVER){
					return "驾驶员"
				}else if(userType == this.constant.USER_TYPE_ADMIN){
					return "管理员"
				}
				return ""
			},
			onAvatarClick(){
				let that = this
				uni.chooseImage({
					count: 1,
					success: (res) => {
						let filePath = res.tempFilePaths[0]
						that.api.fileUpload(that.apiUrl.avatarUpload, res.tempFilePaths).then(res => {
							that.avatar = that.config.photoUrl + res
							that.model.photo = res
							uni.setStorageSync('user', that.model)
							let pages = getCurrentPages()
							let prevPage = pages[pages.length - 2]
							prevPage.$vm.updateUI()
						})
					}
				})
			},
			onSubmitClick(){
				this.api.postJson(this.apiUrl.userInfoSave, {
					email: this.model.email,
					nickName: this.model.name,
					sex: this.model.sex
				}).then(res => {
					uni.showToast({
						title: "保存成功"
					})
					uni.setStorageSync('user', this.model)
					setTimeout(() => {
						let pages = getCurrentPages()
						let prevPage = pages[pages.length - 2]
						prevPage.$vm.updateUI()
						uni.navigateBack()
					}, 2000)
				})
			}
		}
	}
</script>

<style scoped>
	page{
		background-color: #F2F2F2;
	}
	
	.avatar{
		width: 80px;
		height: 80px;
		border-radius: 99px;
		align-self: center;
		margin-top: 20px;
		margin-bottom: 20px;
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
