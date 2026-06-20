<template>
	<view class="page" style="background-color: white;padding: 15px;">
		<view class="item">
			<view class="label">
				<text>审批</text>
			</view>
			<view class="radio">
				<u-radio-group v-model="isPass" :value="needDriver" placement="row" @change="groupChange">
					<u-radio name="1" label="同意" labelColor="#18191A"></u-radio>
					<view style="width: 30px;"></view>
				    <u-radio name="0" label="不同意" labelColor="#18191A"></u-radio>
				</u-radio-group>
			</view>
		</view>
		<view class="item">
			<view class="label">
				<text>审批意见</text>
			</view>
		</view>
		<view>
			<u--textarea v-model="content" placeholder="请输入意见" height="120"></u--textarea>
		</view>
		<u-button @click="onConfirmClick" customStyle="margin-top:20px" color="#2F7FF0" text="确定" shape="circle"></u-button>
		<u-button @click="onCancelClick" customStyle="color:#5C6166;margin-top:10px" color="#F7F7F7" text="取消" shape="circle"></u-button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				repairId: '',
				content: '',
				isPass: "1"
			}
		},
		onLoad(options) {
			this.repairId = options.repairId
		},
		methods: {
			onConfirmClick(){
				this.api.postJson(this.apiUrl.repairApproval, {
					repairId: this.repairId,
					approvealStatus: this.isPass ? 0 : 1,
					remarks: this.content
				}).then(res => {
					uni.showToast({
						title: "操作成功"
					})
					setTimeout(() => {
						let pages = getCurrentPages()
						if(this.isFromDetail){
							//来自详情
							pages[pages.length - 2].$vm.loadData()
							pages[pages.length - 3].$vm.removeItem(this.applyId)
						}else{
							//来自列表
							pages[pages.length - 2].$vm.removeItem(this.repairId)
						}
						uni.navigateBack()
					}, 2000)
				})
			},
			onCancelClick(){
				uni.navigateBack()
			}
		}
	}
</script>

<style>
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
		font-weight: bold;
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
</style>
