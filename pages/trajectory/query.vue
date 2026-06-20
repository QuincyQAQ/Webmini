<template>
	<view class="page">
		<view class="header">
			<view class="time-box">
				<view @click="showStartTime = true" class="time-item">
					<text class="year">{{startYear}}</text>
					<view class="margin-top-5 linear-horizontal flex-align-center">
						<text class="datetime">{{startTimeFormat}}</text>
						<image class="size-12 margin-left-10" src="/static/images/icon_down.png"></image>
					</view>
				</view>
				<image class="time-range" src="/static/images/icon_time_range.png"></image>
				<view @click="showEndTime = true" class="time-item">
					<text class="year">{{endYear}}</text>
					<view class=" margin-top-5 linear-horizontal flex-align-center">
						<text class="datetime">{{endTimeFormat}}</text>
						<image class="size-12 margin-left-10" src="/static/images/icon_down.png"></image>
					</view>
				</view>
			</view>
			<view style="margin:10px 15px;">
				<u-button @click="onQueryClick" color="#2F7FF0" shape="circle" text="查询"></u-button>
			</view>
		</view>
		<view @click="onItemClick(index)" class="item" v-for="(item, index) in list" :key="index">
			<view class="linear-horizontal flex-align-center flex-space-between">
				<text class="mileage">总里程: {{item.mileageSum}}KM</text>
				<image class="size-14" src="/static/images/item_arrow.png"></image>
			</view>
			<view class="linear-horizontal">
				<text>时间范围：</text>
				<text class="flex-1" style="font-size: 12px;">{{item.beginTime}} 至 {{item.endTime}}</text>
			</view>
			<view class="linear-horizontal">
				<text>起始地址：</text>
				<text class="flex-1">{{item.startAddress}}</text>
			</view>
			<view class="linear-horizontal">
				<text>最终地址：</text>
				<text class="flex-1">{{item.endAddress}}</text>
			</view>
		</view>
		<u-datetime-picker :show="showStartTime" v-model="startTime" title="开始时间" mode="datetime" @cancel="showStartTime = false" @confirm="onStartConfirm"></u-datetime-picker>
		<u-datetime-picker :show="showEndTime" v-model="endTime" title="结束时间" mode="datetime" @cancel="showEndTime = false" @confirm="onEndConfirm"></u-datetime-picker>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				numberPlate: '',
				dvo: '',
				startTime: new Date().getTime(),
				endTime: new Date().getTime(),
				showStartTime: false,
				showEndTime: false,
				startYear: '',
				startTimeFormat: '',
				endYear: '',
				endTimeFormat: '',
				list: []
			}
		},
		onLoad(options) {
			let sys = uni.getSystemInfoSync()
			this.dvo = options.dvo
			this.numberPlate = options.numberPlate
			uni.setNavigationBarTitle({
				title: this.numberPlate
			})
			this.startYear = new Date().getFullYear()
			this.endYear = this.startYear
			this.startTimeFormat = this.dateUtils.getDateStr().substring(5) + ' 00:00:00'
			this.endTimeFormat = this.dateUtils.getDateStr().substring(5) + ' 23:59:59'
		},
		methods: {
			onStartConfirm(e){
				this.showStartTime = false
				let date = new Date(e.value)
				this.startYear = date.getFullYear()
				this.startTimeFormat = this.dateUtils.getDateTimeStr(date).substring(5)
			},
			onEndConfirm(e){
				this.showEndTime = false
				let date = new Date(e.value)
				this.endYear = date.getFullYear()
				this.endTimeFormat = this.dateUtils.getDateTimeStr(date).substring(5)
			},
			onQueryClick(){
				// 显示加载提示
				uni.showLoading({
					title: '查询中...'
				});
				
				this.api.postQuery(this.apiUrl.trajectoryList, {
					dvo: this.dvo,
					startTime: this.startYear + '-' + this.startTimeFormat,
					endTime: this.endYear + '-' + this.endTimeFormat,
				}).then(res => {
					// 隐藏加载提示
					uni.hideLoading();
					
					console.log('[Trajectory Query] 查询结果:', res);
					
					// 验证返回的数据
					if (res && Array.isArray(res)) {
						this.list = res;
						if (res.length === 0) {
							uni.showToast({
								title: '暂无轨迹数据',
								icon: 'none'
							});
						}
					} else {
						console.error('[Trajectory Query] 返回数据格式不正确:', res);
						uni.showToast({
							title: '数据格式错误',
							icon: 'none'
						});
					}
				}).catch(err => {
					// 隐藏加载提示
					uni.hideLoading();
					console.error('[Trajectory Query] 查询失败:', err);
					uni.showToast({
						title: '查询失败，请稍后重试',
						icon: 'none'
					});
				});
			},
			onItemClick(index){
				let item = this.list[index]
				uni.navigateTo({
					url: "/pages/trajectory/play?dvo=" + this.dvo + "&numberPlate=" + this.numberPlate + "&startTime=" + item.beginTime + "&endTime=" + item.endTime 
				})
			}
		}
	}
</script>

<style>
	.page {
		height: 100vh;
		display: flex;
		flex-direction: column;
		background-color: #f5f5f5;
	}
	
	.header{
		display: flex;
		flex-direction: column;
		background-color: white;
	}
	
	.time-box{
		display: flex;
		flex-direction: row;
		align-items: center;
		height: 60px;
	}
	
	.year{
		font-size: 12px;
		color: #737980;
	}
	
	.datetime{
		font-size: 16px;
		color: #18191A;
		font-weight: 600;
	}
	
	.time-range{
		width: 30px;
		height: 7.5px;
		margin-top: 20px;
	}
	
	.time-item{
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}
	
	.item{
		display: flex;
		flex-direction: column;
		padding: 15px;
		background-color: white;
		border-radius: 10px;
		box-sizing: border-box;
		margin: 10px;
		font-size: 14px;
		line-height: 25px;
	}

	.mileage{
		font-size: 16px;
		font-weight: bold;
		color: black;
	}
</style>
