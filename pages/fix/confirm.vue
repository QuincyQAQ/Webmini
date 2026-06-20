<template>
	<view class="page" style="background-color: white;padding: 15px;">
		<view class="item">
			<view class="label">
				<text>审批</text>
			</view>
			<view class="radio">
				<u-radio-group :value="needDriver" placement="row" @change="groupChange">
					<u-radio name="true" label="同意" labelColor="#18191A"></u-radio>
					<view style="width: 30px;"></view>
				    <u-radio name="false" label="不同意" labelColor="#18191A"></u-radio>
				</u-radio-group>
			</view>
		</view>
		<view class="item">
			<view class="label">
				<text>确认意见</text>
			</view>
		</view>
		<u--textarea v-model="content" placeholder="请输入意见" height="120"></u--textarea>
		<view class="item">
			<view class="label">
				<text>维修单位</text>
			</view>
		</view>
		<view class="select">
			<text>请选择</text>
			<image class="size-12" src="/static/images/icon_menu_arrow.png"></image>
		</view>
		<view class="box">
			<view class="box-item">
				<text class="box-label">维修项目</text>
				<text class="box-text">发动机保养，轮胎更换，刹车片 更换，机油更换</text>
			</view>
			<view class="box-item margin-top-20">
				<text class="box-label">新增维修费用</text>
				<text class="box-text">5000元</text>
			</view>
			<view class="box-item margin-top-20">
				<text class="box-label">维修总费用</text>
				<text class="box-text">7000元</text>
			</view>
			<view class="box-item margin-top-20">
				<text class="box-label"></text>
				<text class="box-text" style="color: #FA3B30;">维修总费用已超5000元</text>
			</view>
		</view>
		<u-button customStyle="margin-top:20px" color="#2F7FF0" text="确定" shape="circle"></u-button>
		<u-button customStyle="color:#5C6166;margin-top:10px" color="#F7F7F7" text="取消" shape="circle"></u-button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				content: ''
			}
		},
		methods: {
			
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
	
	.select{
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		font-size: 14px;
		color: #18191A;
		background-color: #F7F7F7;
		border-radius: 10px;
		height: 45px;
		padding: 0 15px;
	}
	
	.box{
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		background-color: #F7F7F7;
		border-radius: 10px;
		padding: 20px 15px;
		margin-top: 10px;
	}	
	
	.box-item{
		display: flex;
		flex-direction: row;
		justify-content: space-between;
	}
	
	.box-label{
		font-size: 13px;
		color: #8A9199;
		width: 100px;
	}
	
	.box-text{
		font-size: 13px;
		color: #18191A;
	}
</style>
