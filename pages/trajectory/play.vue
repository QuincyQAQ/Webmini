<template>
	<view class="page">
		<map id="map" class="map" :markers="markers" :polyline="polylines"
		:latitude="latitude" :longitude="longitude" :scale="15" @bindinterpolatepoint="aa"></map>
		<view class="pop">
			<view>
				<text>当前时间：{{current.gdt || '--:--:--'}}</text>
			</view>
			<view class="margin-top-5">
				<text class="text">当前速度：{{current.spd || 0}}km/h</text>
			</view>
			<view class="margin-top-5" style="height: 34px;">
				<text class="text">当前位置：{{current.ars || '暂无位置信息'}}</text>
			</view>
			<view class="linear-horizontal flex-align-center">
				<view @click="onPlayClick" class="play linear-horizontal flex-center">
					<image class="size-16" :src="isPlay ? '/static/images/trajectory_pause.png' : '/static/images/trajectory_play.png'"></image>
				</view>
				<text style="margin-left: 10px;">{{sliderStartTime}}</text>
				<view class="flex-1">
					<u-slider v-model="progress" :min="0" :max="list && list.length > 0 ? list.length - 1 : 0" @change="onSliderChange" @changing="onSliderChanging"></u-slider>
				</view>
				<text style="margin-right: 10px;">{{sliderEndTime}}</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				pageHeight: 0,
				numberPlate: '',
				dvo: '',
				startTime: '',
				endTime: '',
				list: [],
				current: {
					gdt: '--:--:--',
					spd: 0,
					ars: '暂无位置信息'
				},
				latitude: 39.91,
				longitude: 116.40,
				progress: 0,
				isPlay: false,
				sliderStartTime: '00:00',
				sliderEndTime: '23:59',
				markers: [],
				polylines: [],
				moveIndex: 0
				
			}
		},
		onLoad(options) {
			let sys = uni.getSystemInfoSync()
			this.pageHeight = sys.windowHeight
			this.numberPlate = options.numberPlate
			this.dvo = options.dvo
			this.startTime = options.startTime
			this.endTime = options.endTime
			uni.setNavigationBarTitle({
				title: this.numberPlate
			})
			this.loadData()
		},
		onReady() {
			// 使用延迟确保地图元素完全渲染
			this.$nextTick(() => {
				setTimeout(() => {
					this._mapContext = uni.createMapContext("map", this);
				}, 100);
			});
		},
		methods: {
			loadData(){
				this.api.postQuery(this.apiUrl.trajectoryDetail, {
					dvo: this.dvo,
					startTime: this.startTime,
					endTime: this.endTime,
				}).then(res => {
					// 检查返回的数据结构
					let trajectoryData = res;
					if (res && res.tracks) {
						// 如果返回的是包含tracks的对象，则使用tracks数组
						trajectoryData = res.tracks;
					}
					
					this.list = trajectoryData;
					if (trajectoryData && trajectoryData.length > 0) {
						this.current = trajectoryData[0]
						// 增加安全检查，防止时间字段为undefined
						const firstTime = trajectoryData[0].gdt;
						const lastTime = trajectoryData[trajectoryData.length - 1].gdt;
						
						this.sliderStartTime = firstTime && typeof firstTime === 'string' && firstTime.includes(" ") ? 
							firstTime.split(" ")[1].substring(0, 5) : '00:00';
							
						this.sliderEndTime = lastTime && typeof lastTime === 'string' && lastTime.includes(" ") ? 
							lastTime.split(" ")[1].substring(0, 5) : '23:59';
					} else {
						// 如果没有轨迹数据，显示提示信息
						uni.showToast({
							title: '暂无轨迹数据',
							icon: 'none'
						});
						return;
					}
					this.updateMapUI()
				})
			},
			onPlayClick(){
				// 检查是否有轨迹数据
				if (!this.list || this.list.length === 0) {
					uni.showToast({
						title: '暂无轨迹数据，无法播放',
						icon: 'none'
					});
					return;
				}
				
				this.isPlay = !this.isPlay
				if(this.isPlay){
					this.startMove()
				}else{
					this.stopMove()
				}
			},
			startMove(){
				if(this.moveIndex >= this.list.length - 1){
					this.moveIndex = 0
				}
				let points = this.list.slice(this.moveIndex, this.list.length).map(it => {
					return {
						latitude: it.lat,
						longitude: it.lng
					}
				})
				
				// 计算总的播放时间，每段轨迹点之间的间隔时间
				const totalDuration = 10000; // 总播放时间为10秒，可以根据轨迹点数量调整
				const durationPerPoint = points.length > 1 ? totalDuration / (points.length - 1) : 1000;
				
				// 添加安全检查，确保地图上下文存在
				if (this._mapContext) {
					// 尝试使用 moveAlong 方法
					try {
						this._mapContext.moveAlong({
							markerId: 1,
							path: points,
							duration: totalDuration
						})
					} catch (error) {
						console.error('[Trajectory] moveAlong error:', error);
					}
				}
				
				// 同时使用定时器来更新标记位置和数据，以确保兼容性
				this.moveInterval = setInterval(() => {
					this.moveIndex++
					if(this.moveIndex < this.list.length) {
						this.current = this.list[this.moveIndex]
						this.progress = this.moveIndex
						
						// 手动更新标记位置以确保兼容性
						if (this.markers.length > 0) {
							let newMarkers = [...this.markers] // 创建副本
							newMarkers[0] = {
								...newMarkers[0],
								latitude: this.list[this.moveIndex].lat,
								longitude: this.list[this.moveIndex].lng
							}
							this.markers = newMarkers
						}
					}
					
					if(this.moveIndex >= this.list.length - 1){
						clearInterval(this.moveInterval)
						this.moveInterval = null
						this.isPlay = false
					}
				}, durationPerPoint) // 使用每个点的时间间隔
			},
			stopMove(){
				// 添加安全检查，确保地图上下文存在
				if (this._mapContext) {
					let point = this.list[this.moveIndex]
					// 尝试使用 moveAlong 方法停止动画
					try {
						this._mapContext.moveAlong({
							markerId: 1,
							path: [{
								latitude: point.lat,
								longitude: point.lng
							}],
							duration: 1
						})
					} catch (error) {
						console.error('[Trajectory] moveAlong stop error:', error);
					}
				}
				
				clearInterval(this.moveInterval)
				this.moveInterval = null
				this.isPlay = false
				
				// 确保标记位置与当前索引一致
				if (this.markers.length > 0 && this.list[this.moveIndex]) {
					let newMarkers = [...this.markers] // 创建副本
					newMarkers[0] = {
						...newMarkers[0],
						latitude: this.list[this.moveIndex].lat,
						longitude: this.list[this.moveIndex].lng
					}
					this.markers = newMarkers
				}
			},
			onSliderChange(e){
				this.moveIndex = e
				this.current = this.list[e]
				let point = this.list[e]
				
				// 使用 Vue 响应式方式更新 marker
				if (this.markers.length > 0) {
					let newMarkers = [...this.markers] // 创建副本
					newMarkers[0] = {
						...newMarkers[0],
						latitude: point.lat,
						longitude: point.lng
					}
					this.markers = newMarkers
				}
			},
			onSliderChanging(e){
				if(this.moveInterval){
					this.stopMove()
				}
			},
			updateMapUI(){
				let first = this.list[0]
				let last = this.list[this.list.length - 1]
				let points = this.list.map(it => {
					return {
						latitude: it.lat,
						longitude: it.lng
					}
				})
				
				// 使用 Vue 响应式方式更新 polylines
				this.polylines = [{
					points: points,
					color: '#2F7FF0',
					width: 4
				}]
				
				// 使用 Vue 响应式方式更新 markers
				this.markers = [
					{
						id: 1,
						latitude: first.lat,
						longitude: first.lng,
						iconPath: '/static/images/map_vehicle_online.png',
						width: 25,
						height: 44,
						anchor: {x: 0.5, y: 0.5},
					},
					{
						id: 2,
						latitude: first.lat,
						longitude: first.lng,
						iconPath: '/static/images/trajectory_start.png',
						width: 31,
						height: 31,
						anchor: {x: 0.5, y: 1}
					},
					{
						id: 3,
						latitude: last.lat,
						longitude: last.lng,
						iconPath: '/static/images/trajectory_end.png',
						width: 31,
						height: 31,
						anchor: {x: 0.5, y: 1}
					}
				]
				
				// 添加安全检查，确保地图上下文存在
				if (this._mapContext) {
					this._mapContext.includePoints({
						points: points,
						padding: [50, 50, 50, 50]
					})
				} else {
					console.warn('[Trajectory] 地图上下文未就绪，无法调整视图');
					// 如果地图上下文不存在，使用响应式数据方式设置地图中心
					this.latitude = first.lat;
					this.longitude = first.lng;
				}
			},
			aa(e){
				console.log(e);
			}
		}
	}
</script>

<style>
	.page {
		position: relative;
		width: 100vw;
		height: 100vh;
		overflow: hidden; /* 防止页面出现滚动 */
	}
	
	.map{
		position: absolute;
		width: 100%;
		height: calc(100% - 120px); /* 为底部弹窗预留空间 */
		z-index: 0;
	}
	
	.pop{
		position: absolute;
		bottom: 45px;
		left: 0;
		right: 0;
		background-color: white;
		border-top-left-radius: 20px;
		border-top-right-radius: 20px;
		padding: 10px 15px;
		color: #5C6166;
		font-size: 13px;
		height: 120px; /* 固定弹窗高度 */
		z-index: 1; /* 确保弹窗在地图上方 */
	}
	
	.numberplate{
		color: #18191A;
		font-size: 20px;
		font-weight: bold;
		margin-left: 6px;
	}
	
	.speed{
		color: #2F7FF0;
		font-size: 18px;
		font-weight: 600;
		margin-left: 20px;
	}
	
	.play{
		width: 40px;
		height: 40px;
		background-color: white;
		border-radius: 99px;
		box-shadow: 0px 20px 40px 0px rgba(8,27,74,0.1);
		border: 1px solid #DAE0E6;
	}
	
	.speed-mode{
		color: #2F7FF0;
		font-size: 14px;
		padding: 4px 10px;
		border: 1px solid #2F7FF0;
		border-radius: 99px;
	}
</style>
