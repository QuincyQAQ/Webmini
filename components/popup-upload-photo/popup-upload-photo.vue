<template>
	<u-popup :show="show" mode="bottom" closeable round="10" @close="show = false">
		<view class="linear-vertical" style="padding: 0 10px 20px 10px;box-sizing: border-box;">
			<text class="popup-title">{{title}}</text>
			<u-upload
				:fileList="photoList"
				multiple
				:maxCount="maxCount"
				@afterRead="onUploadImage"
				@delete="onDeleteImage"
			></u-upload>
			<view v-if="showMoney" class="item">
				<view class="label">
					<text>实际维修费用</text>
					<text class="required">*</text>
				</view>
				<u-input v-model="money" type="digit" placeholder="请输入" border="none" inputAlign="right">
					<template slot="suffix">
						<text>元</text>
					</template>
				</u-input>
			</view>
			<view style="margin-top: 10px;">
				<u-button @click="onConfirmClick" shape="circle" :text="buttonText" type="primary"></u-button>
			</view>
		</view>
	</u-popup>
</template>

<script>
	export default {
		name:"popup-upload-photo",
		props: {
			title: {
				type: String,
				default: '上传照片'
			},
			maxCount: {
				type: Number,
				default: 9
			},
			buttonText: {
				type: String,
				default: '确定'
			},
			showMoney: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				show: false,
				photoList: [],
				money: ''
			};
		},
		methods: {
			open(){
				this.show = true
			},
			close(){
				this.show = false
				this.money = ''
				this.photoList = []
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
			onConfirmClick(){
				if(this.showMoney){
					//维修
					this.$emit("confirm", {
						photoList: this.photoList,
						money: this.money
					})
				}else{
					//用机器人
					this.$emit("confirm", this.photoList)
				}
			}
		}
	}
</script>

<style scoped>
	.popup-title{
		line-height: 44px;
		text-align: center;
		font-size: 16px;
		font-weight: bold;
		margin-bottom: 10px;
	}
	
	.item{
		height: 44px;
		display: flex;
		flex-direction: row;
		align-items: center;
		box-sizing: border-box;
		font-size: 14px;
	}
	
	.required{
		color: #FA3B30;
	}
</style>