<template>
	<view class="page" :style="{'height': pageHeight + 'px'}">
		<map id="map" class="map" :style="{'height': pageHeight + 'px'}"
		:latitude="latitude" :longitude="longitude" :scale="mapScale" @markertap="onMarkerClick"
		:enable-zoom="true" :enable-scroll="true" :enable-rotate="false" 
		:markers="markers"  
		@regionchange="onRegionChange"></map>
		<view class="header">
			<text class="title" :style="{'margin-top': menuButtonInfo.top + 'px', 'height': menuButtonInfo.height + 'px'}">{{title}}</text>
			<view class="linear-horizontal margin-top-10 flex-space-between" style="padding: 0 12.5px;">
				<view @click="onOrgClick" class="org">
					<text class="org-name">{{checkedOrg.checkedLabel}}</text>
					<image class="org-arrow" src="/static/images/icon_right.png"></image>
				</view>
				<view @click="onSearchClick" class="search linear-horizontal flex-center">
					<image class="size-16" src="/static/images/icon_search.png"></image>
				</view>
			</view>
		</view>
		<view class="button-box">
			<image @click="onRefreshClick" class="button" src="/static/images/icon_refresh.png"></image>
			<image @click="onLocationClick" class="button margin-top-5" src="/static/images/icon_my_location.png"></image>
			<image @click="onViewAllVehiclesClick" class="button margin-top-5" src="/static/images/icon_list.png"></image>
		</view>
		
		<!-- 缩放控制按钮 -->
		<view class="zoom-controls">
			<view @click="zoomIn" class="zoom-btn">+</view>
			<view @click="zoomOut" class="zoom-btn">-</view>
		</view>
		<view class="menu-box">
			<view @click="onDriverClick" class="menu-item linear-vertical flex-center">
				<image class="size-20" src="/static/images/icon_driver.png"></image>
				<text style="margin-top: 4px">驾驶员</text>
			</view>
			<divider style="margin: 0 20rpx;"></divider>
			<view @click="onListClick" class="menu-item linear-vertical flex-center">
				<image class="size-20" src="/static/images/icon_list.png"></image>
				<text style="margin-top: 4px">列表</text>
			</view>
		</view>
		<view class="status-box">
			<view class="status">
				<view @click="onStatusClick(0, 1, null)" class="status-item" :class="statusIndex == 0 ? 'checked' : ''">
					<text class="status-value">{{onlineCount}}</text>
					<text class="status-label">在线</text>
				</view>
				<view @click="onStatusClick(1, 0, null)" class="status-item" :class="statusIndex == 1 ? 'checked' : ''">
					<text class="status-value">{{offlineCount}}</text>
					<text class="status-label">离线</text>
				</view>
				<view @click="onStatusClick(2, null, constant.TASK_STATUS_FREE)" class="status-item" :class="statusIndex == 2 ? 'checked' : ''">
					<text class="status-value">{{freeCount}}</text>
					<text class="status-label">空闲</text>
				</view>
				<view @click="onStatusClick(3, null, constant.TASK_STATUS_TASKING)" class="status-item" :class="statusIndex == 3 ? 'checked' : ''">
					<text class="status-value">{{taskCount}}</text>
					<text class="status-label">任务中</text>
				</view>
			</view>
		</view>
		<view v-if="showPop && checkedModel" class="pop-box">
			<view class="linear-horizontal flex-align-center">
				<image class="size-25" src="/static/images/home_vehicle.png"></image>
				<text class="numberplate">{{checkedModel.numberPlate}}</text>
				<view @click="onTrajectoryClick" class="setting linear-horizontal flex-center margin-left-10">
					<image class="size-14" src="/static/images/icon_trajectory_blue.png"></image>
					<text class="margin-left-5">轨迹</text>
				</view>
				<image @click="onNavClick" class="size-30" style="margin-left: 20rpx;" src="/static/images/icon_navigate.png"></image>
			</view>
			<image @click="showPop = false" class="pop-close size-16" src="/static/images/icon_close.png"></image>
			<view class="linear-horizontal flex-align-center" style="margin-top: 6px;">
				<text class="status-text" :style="'background-color:' + (checkedModel ? constant.getOnlineStatusColor(checkedModel) : '#ccc')">{{checkedModel && checkedModel.isOnline > 0 ? '在线' : '离线'}}</text>
				<text class="pop-text">{{checkedModel.spd}}km/h</text>
			</view>
			<text class="pop-text margin-top-10">设备状态：{{checkedModel.remark}}</text>
			<view class="pop-text margin-top-10 linear-horizontal">
				<text>当前位置：</text>
				<text class="flex-1">{{checkedModel.location}}</text>
			</view>
		</view>
		<tree-picker ref="orgPicker" title="选择部门" :treeData="orgData" labelKey="name" @onChecked="onOrgPickerChecked" actionText="全部" @onActionClick="onOrgReset"></tree-picker>
		<tabbar name="map"></tabbar>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title: '',
				constant: this.constant,
				menuButtonInfo: {},
				pageHeight: 0,
				statusIndex: 0,
				latitude: 39.91,
				longitude: 116.40,
				markers: [],  // 添加响应式markers数据
				showPop: false,
				onlineCount: 0,
				offlineCount: 0,
				freeCount: 0,
				taskCount: 0,
				list: [],
				checkedModel: {},
				orgData: [],
				checkedOrg: {
					checkedId: "",
					checkedLabel: "全部"
				},
				isOnline: 1,
				taskStatus: null,
				mapScale: 16,
				mapReady: false, // 添加地图就绪标志
				lightMarker: {
					id: 99999,
					width: 44,
					height: 44,
					iconPath: '/static/images/map_transparent_marker.png',
					anchor: {x: 0.5, y: 0.5},
					joinCluster: false,
					callout: {
						content: ' ',  
						color: '#666666',
						fontSize: 14,
						bgColor: '#FFFFFF',  
						borderRadius: 5, 
						display: 'ALWAYS',
						padding: 5,
						anchorY: -5
					}
				}
			}
		},
		mounted() {
			if(!uni.getStorageSync("token")){
				uni.reLaunch({
					url: "/pages/login/login"
				})
				return
			}
			if(uni.getStorageSync("userType") == this.constant.USER_TYPE_DRIVER){
				//驾驶员无地图位置功能,强制跳转到待办任务
				uni.switchTab({
					url: "/pages/task/task"
				})
				return
			}
			// 获取菜单按钮信息（仅小程序平台）
			// #ifdef MP-WEIXIN
			this.menuButtonInfo = uni.getMenuButtonBoundingClientRect()
			// #endif
			// #ifndef MP-WEIXIN
			// H5和App平台使用默认值
			this.menuButtonInfo = {
				top: 0,
				height: 32,
				bottom: 32
			}
			// #endif
			
			let sys = uni.getSystemInfoSync()
			let safeAreaBottomHeight = 0
			
			// 安全区域处理
			if (sys.safeArea && sys.safeArea.bottom) {
				safeAreaBottomHeight = sys.screenHeight - sys.safeArea.bottom
			}
			
			let headerHeight = this.menuButtonInfo.bottom + 8
			uni.setStorageSync("safeAreaBottomHeight", safeAreaBottomHeight)
			uni.setStorageSync("headerHeight", headerHeight)
			
			// 页面高度计算，确保有默认值
			this.pageHeight = (sys.screenHeight || 667) - (safeAreaBottomHeight + 50)
			setTimeout(() => {
				this.title = '巡检机器人管理'
			}, 300)
			
			// 在mounted中只加载组织和数据，地图初始化移到onReady
			this.$nextTick(() => {
				this.loadOrg()
				this.loadData()
			})

			// H5平台添加鼠标滚轮缩放支持
			// #ifdef H5
			this.$nextTick(() => {
				this.addMouseWheelZoom()
			})
			// #endif
		},
		
		onReady() {
			// 在onReady中初始化地图，确保地图组件完全渲染
			this.$nextTick(() => {
				this.initMap()
			});
		},
		methods: {
			loadOrg(){
				this.api.postQuery(this.apiUrl.orgData).then(res => {
					this.orgData = res
				})
			},
			loadData(){
				this.api.postQuery(this.apiUrl.mapData, {
					companyId: this.checkedOrg.checkedId
				}).then(res => {
					this.onlineCount = res.onlineCount
					this.offlineCount = res.offlineCount
					this.freeCount = res.freeCount
					this.taskCount = res.taskCount
					this.list = res.list
					this.updateMarker()
					
					// 数据加载完成后，智能选择地图中心
					this.smartMapCenter()
				})
			},

			// 智能选择地图中心
			smartMapCenter() {
				if (!this.list || this.list.length === 0) {
					// 没有机器人数据时，尝试定位到用户位置
					this.moveToUserLocation()
					return
				}

				
				// 更新标记
				this.updateMarker()
				
				// 立即移动地图到第一个有效机器人位置，而不是显示所有机器人
				const validVehicle = this.list.find(vehicle => 
					vehicle.lat && vehicle.lng && 
					parseFloat(vehicle.lat) !== 0 && 
					parseFloat(vehicle.lng) !== 0
				);
				
				if (validVehicle) {
					// 使用响应式数据方式更新地图中心
					this.latitude = parseFloat(validVehicle.lat);
					this.longitude = parseFloat(validVehicle.lng);
					this.mapScale = 12; // 设置合适的缩放级别
				} else {
					// 如果没有有效位置，使用港科大默认位置
					this.latitude = 22.889043;
					this.longitude = 113.484507;
				}
			},
			getMarkerIcon(model){
				// 根据模型的实际状态而不是当前筛选状态来确定图标
				if(this.statusIndex == 0 || this.statusIndex == 1){
					//在线状态筛选 - 显示实际在线状态
					return model.isOnline > 0 ? '/static/images/map_vehicle_online.png' : '/static/images/map_vehicle_offline.png'
				}else if(this.statusIndex == 2 || this.statusIndex == 3){
					//任务状态筛选 - 显示实际任务状态
					return model.vehicleTaskStatus == this.constant.TASK_STATUS_TASKING ? '/static/images/map_vehicle_tasking.png' : '/static/images/map_vehicle_free.png'
				}
				// 默认返回在线状态图标
				return model.isOnline > 0 ? '/static/images/map_vehicle_online.png' : '/static/images/map_vehicle_offline.png'
			},
			onStatusClick(index, isOnline, taskStatus){
				this.statusIndex = index
				this.isOnline = isOnline
				this.taskStatus = taskStatus
				this.updateMarker()
			},
			onSearchResult(e){
				let that = this
				let item = this.list.find(it => it.numberPlate == e.numberPlate)
				this.statusIndex = item.isOnline > 0 ? 0 : 1
				this.isOnline = item.isOnline
				this.taskStatus = null
				this.updateMarker()
				// 添加安全检查，确保地图上下文存在
				if (this._mapContext) {
					this._mapContext.includePoints({
						points: [{latitude: item.lat, longitude: item.lng}],
						padding: [20],
						success(res){
							that.checkedModel = item
							that.showPop = true
							that.updateLightMarker(item)
						}
					})
				} else {
					console.warn('[Map] 地图上下文未就绪，无法包含点位');
					// 如果地图上下文不存在，手动设置地图中心点
					this.latitude = item.lat;
					this.longitude = item.lng;
					this.showPop = true;
					this.checkedModel = item;
					this.updateLightMarker(item);
				}
				
			},
			async initMap(){
				// 使用更可靠的方法等待地图元素渲染完成
				await this.$nextTick();
				// 尝试多次获取地图元素，最多尝试5次
				this.waitForMapElement(5, 200);
				
			},
			
			waitForMapElement(maxAttempts, interval) {
				let attempts = 0;
				const checkElement = () => {
					// 尝试使用多种方式检测地图元素
					const query = uni.createSelectorQuery();
					
					// 尝试选择id为map的元素
					query.select('#map').boundingClientRect((data) => {
						if (data) {
							// 地图元素存在，尝试创建地图上下文
							try {
								this._mapContext = uni.createMapContext("map", this);
								if (!this._mapContext) {
									console.error('[Map] 未能获取到地图上下文，请检查地图组件是否正确渲染');
								} else {
									console.log('[Map] 地图上下文创建成功');
									this.mapReady = true; // 标记地图已就绪
									// 成功创建地图上下文后，可以安全地进行地图操作
									return; // 成功则退出
								}
							} catch (error) {
								console.error('[Map] 创建地图上下文时发生错误:', error);
							}
						} 
						
						// 不管是否找到元素，都继续尝试，或者递减尝试次数
						attempts++;
						if (attempts < maxAttempts) {
							setTimeout(checkElement, interval);
						} else {
							console.error('[Map] 多次尝试后仍未找到地图元素，请检查地图组件ID是否为map');
							
							this.mapReady = true; // 即使没有地图上下文也标记为就绪，因为响应式数据可用

						}
					}).exec();
				};
				
				// 立即执行第一次检查
				checkElement();
			},
			updateLightMarker(model){
				// 从markers数组中移除ID为99999的标记（如果有）
				this.markers = this.markers.filter(marker => marker.id !== 99999);
				
				// 添加新的高亮标记
				if (model) {
					// 验证必要字段的存在
					if (model.lat && model.lng) {
						this.lightMarker.latitude = model.lat;
						this.lightMarker.longitude = model.lng;
					} else {
						console.warn('[Map] 机器人缺少位置信息，无法设置高亮标记:', model);
						return;
					}
					
					if (model.numberPlate) {
						this.lightMarker.callout.content = model.numberPlate;
					} else {
						console.warn('[Map] 机器人缺少机器人信息，使用默认内容:', model);
						this.lightMarker.callout.content = '机器人';
					}
					
					// 将高亮标记添加到markers数组中
					this.markers.push({...this.lightMarker});
				}
			},
			updateMarker(){
				const markers = []
				// 添加安全检查，确保list存在且为数组
				if (!this.list || !Array.isArray(this.list)) {
					console.warn('[Map] 机器人列表数据无效:', this.list)
					return
				}
				
				this.list.forEach((it, index) => {
					let shouldShow = false
					
					if (this.statusIndex === 0) {
						// 在线状态筛选
						shouldShow = it.isOnline === 1
					} else if (this.statusIndex === 1) {
						// 离线状态筛选
						shouldShow = it.isOnline === 0
					} else if (this.statusIndex === 2) {
						// 空闲状态筛选 - 根据vehicleTaskStatus筛选
						shouldShow = it.vehicleTaskStatus === 0
					} else if (this.statusIndex === 3) {
						// 任务中状态筛选 - 根据vehicleTaskStatus筛选
						shouldShow = it.vehicleTaskStatus === 1
					}
					
					if (shouldShow) {
						// 验证数据有效性
						const equipmentId = parseInt(it.equipmentId)
						const latitude = parseFloat(it.lat)
						const longitude = parseFloat(it.lng)
						
						// 确保关键数据有效才添加标记
						if (!isNaN(equipmentId) && !isNaN(latitude) && !isNaN(longitude) && 
						    latitude !== 0 && longitude !== 0) {
							// 添加更多验证
							if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
								console.warn('[Map] 经纬度超出有效范围:', {
									equipmentId: it.equipmentId,
									latitude: latitude,
									longitude: longitude,
									item: it
								})
							} else {
								// 检查图标文件是否存在
								const iconPath = this.getMarkerIcon(it);
								
								markers.push({
									id: equipmentId,  // 使用设备ID作为标记ID
									latitude: latitude,
									longitude: longitude,
									iconPath: iconPath,
									width: 25,
									height: 44,
									rotate: it.dre,
									anchor: {x: 0.5, y: 1}, // 修改锚点位置，y设为1使图标底部对准坐标点
									joinCluster: true
								})
							}
						} else {
							console.warn('[Map] 无效的标记数据:', {
								equipmentId: it.equipmentId,
								latitude: it.lat,
								longitude: it.lng,
								item: it
							})
						}
					}
				})				
				
				// 直接更新响应式数据，而不是使用addMarkers方法
				this.markers = markers
				
				// 如果标记数量为0，仍然需要触发更新以确保清除旧标记
				if (markers.length === 0) {
					console.log('[Map] 当前筛选条件下无符合条件的标记')
				} else {					
					// 使用响应式数据方式调整地图视图
					// 计算标记的中心点
					if (markers.length > 0) {
						const avgLat = markers.reduce((sum, m) => sum + m.latitude, 0) / markers.length;
						const avgLng = markers.reduce((sum, m) => sum + m.longitude, 0) / markers.length;
						
						// 更新地图中心点，确保标记在视野内
						this.latitude = avgLat;
						this.longitude = avgLng;
						// 可以根据标记密度调整缩放级别
						this.mapScale = markers.length > 5 ? 10 : 12;
					}
				}
				
				// 如果有地图上下文，可以使用includePoints方法更好地展示所有标记
				if (this._mapContext && markers.length > 1) {
					// 使用地图上下文的includePoints方法显示所有标记
					try {
						this._mapContext.includePoints({
							points: markers.map(m => ({
								latitude: m.latitude,
								longitude: m.longitude
							})),
							padding: [100, 100, 100, 100], // 上右下左的边距
						});
					} catch (error) {
						console.warn('[Map] includePoints调用失败:', error);
					}
				}
			},
			onMarkerClick(e){
				// 处理不同平台下的事件对象结构差异
				let markerId = null;
				
				// 尝试多种可能的事件对象结构
				if (e.markerId !== undefined) {
					markerId = e.markerId;
				} else if (e.detail && e.detail.markerId !== undefined) {
					markerId = e.detail.markerId;
				} else if (e.target && e.target.markerId !== undefined) {
					markerId = e.target.markerId;
				} else if (Array.isArray(e) && e.length > 0) {
					// 某些情况下可能返回数组
					markerId = e[0];
				}
				
				// 添加安全检查，确保markerId存在
				if (!markerId && markerId !== 0) { // 注意：ID为0也是有效的
					this.showPop = false;
					return;
				}
				
				this.showPop = true
				// 首先尝试通过equipmentId查找
				this.checkedModel = this.list.find(it => it.equipmentId == markerId)
				
				// 添加安全检查，确保找到有效的机器人信息
				if (this.checkedModel) {
					this.updateLightMarker(this.checkedModel)
				} else {
					// 如果没找到，尝试使用markerId作为数字ID进行查找（以防类型转换问题）
					this.checkedModel = this.list.find(it => parseInt(it.equipmentId) == parseInt(markerId))
					if (this.checkedModel) {
						this.updateLightMarker(this.checkedModel)
					} else {
						// 如果还是没找到，尝试根据坐标位置匹配
						const clickedMarker = this.markers.find(marker => marker.id == markerId);
						if (clickedMarker) {
							// 根据坐标位置在list中寻找最接近的机器人
							const closestVehicle = this.list.reduce((prev, curr) => {
								const prevLat = parseFloat(prev.lat) || 0;
								const prevLng = parseFloat(prev.lng) || 0;
								const currLat = parseFloat(curr.lat) || 0;
								const currLng = parseFloat(curr.lng) || 0;
								const clickedLat = clickedMarker.latitude;
								const clickedLng = clickedMarker.longitude;
								
								const prevDist = Math.pow(prevLat - clickedLat, 2) + Math.pow(prevLng - clickedLng, 2);
								const currDist = Math.pow(currLat - clickedLat, 2) + Math.pow(currLng - clickedLng, 2);
								return (prevDist < currDist) ? prev : curr;
							});
							
							if (closestVehicle) {
								this.checkedModel = closestVehicle;
								this.updateLightMarker(this.checkedModel);
							} else {
								this.showPop = false // 关闭弹窗以避免错误
							}
						} else {
							this.showPop = false // 关闭弹窗以避免错误
						}
					}
				}
			},
			onOrgClick(){
				this.$refs.orgPicker.show();
			},
			onSearchClick(){
				uni.navigateTo({
					url: "/pages/index/search?companyId=" + this.checkedOrg.checkedId
				})
			},
			onRefreshClick(){
				this.loadData()
			},
			onLocationClick(){
				this.moveToUserLocation()
			},

			// 查看所有机器人
			onViewAllVehiclesClick(){
				if (!this.list || this.list.length === 0) {
					uni.showToast({
						title: '暂无机器人数据',
						icon: 'none'
					})
					return
				}

				// 计算所有机器人的边界
				const validVehicles = this.list.filter(vehicle => 
					vehicle.lat && vehicle.lng && 
					parseFloat(vehicle.lat) !== 0 && 
					parseFloat(vehicle.lng) !== 0
				);
				
				if (validVehicles.length === 0) {
					uni.showToast({
						title: '无有效机器人位置数据',
						icon: 'none'
					})
					return
				}

				const points = validVehicles.map(vehicle => ({
					latitude: parseFloat(vehicle.lat),
					longitude: parseFloat(vehicle.lng)
				}))

				// 使用响应式数据方式，直接移动地图中心到第一个有效机器人位置
				if (points.length > 0) {
					// 计算中心点
					const avgLat = points.reduce((sum, p) => sum + p.latitude, 0) / points.length;
					const avgLng = points.reduce((sum, p) => sum + p.longitude, 0) / points.length;
					
					this.latitude = avgLat;
					this.longitude = avgLng;
					this.mapScale = 12; // 设置合适的缩放级别
				}
			},
			onOrgPickerChecked(e){
				this.checkedOrg = {
					checkedId: e.checkedIds[0],
					checkedLabel: e.checkedLabels[0]
				}
				this.loadData()
			},
			onOrgReset(){
				this.$refs.orgPicker.dismiss();
				this.checkedOrg = {
					checkedId: "",
					checkedLabel: "全部"
				}
				this.loadData()
			},
			onDriverClick(){
				uni.navigateTo({
					url: "/pages/task/driverList?companyId=" + this.checkedOrg.checkedId
				})
			},
			onListClick(){
				uni.navigateTo({
					url: "/pages/task/vehicleList?companyId=" + this.checkedOrg.checkedId
				})
			},
			onTrajectoryClick(){
				// 添加更全面的安全检查，确保checkedModel存在且包含必需字段
				if (!this.checkedModel) {
					uni.showToast({
						title: '未选择机器人',
						icon: 'none'
					});
					return;
				}
				
				// 检查轨迹查询所需的字段，根据日志显示应该是'deviceNo'字段
				if (!this.checkedModel.deviceNo && !this.checkedModel.id && !this.checkedModel.equipmentId) {
					console.warn('[Map] 机器人缺少轨迹查询所需的关键字段(deviceNo/equipmentId/id):', this.checkedModel);
					uni.showToast({
						title: '机器人设备信息缺失',
						icon: 'none'
					});
					return;
				}
				
				if (!this.checkedModel.numberPlate) {
					console.warn('[Map] 机器人缺少numberPlate字段:', this.checkedModel);
					uni.showToast({
						title: '机器人编号缺失',
						icon: 'none'
					});
					return;
				}
				
				// 尝试使用多个可能的字段名
				const deviceNo = this.checkedModel.deviceNo || this.checkedModel.equipmentId || this.checkedModel.id;
				const numberPlate = this.checkedModel.numberPlate;
				
				uni.navigateTo({
					url: '/pages/trajectory/query?dvo=' + deviceNo + '&numberPlate=' + numberPlate
				})
			},
			onNavClick(){
				// 添加更全面的安全检查，确保checkedModel存在且包含必需字段
				if (!this.checkedModel) {
					uni.showToast({
						title: '未选择机器人',
						icon: 'none'
					});
					return;
				}
				
				// 检查导航所需的关键字段
				if (!this.checkedModel.lat || !this.checkedModel.lng) {
					console.warn('[Map] 机器人缺少位置信息(lat/lng):', this.checkedModel);
					uni.showToast({
						title: '机器人位置信息缺失',
						icon: 'none'
					});
					return;
				}
				
				if (!this.checkedModel.numberPlate) {
					console.warn('[Map] 机器人缺少机器人信息:', this.checkedModel);
					uni.showToast({
						title: '机器人编号缺失',
						icon: 'none'
					});
					return;
				}
				
				// 确保坐标值是数字类型
				const lat = parseFloat(this.checkedModel.lat);
				const lng = parseFloat(this.checkedModel.lng);
				const numberPlate = this.checkedModel.numberPlate;
				
				if (isNaN(lat) || isNaN(lng)) {
					console.warn('[Map] 机器人坐标不是有效数字:', this.checkedModel);
					uni.showToast({
						title: '坐标数据无效',
						icon: 'none'
					});
					return;
				}
				
				uni.openLocation({
					latitude: lat,
					longitude: lng,
					name: numberPlate,
					address: this.checkedModel.location || '机器人位置'
				})
			},

			// 放大地图
			zoomIn() {
				if (this.mapScale < 18) {
					this.mapScale += 1
				} else {
					uni.showToast({
						title: '已达到最大缩放级别',
						icon: 'none',
						duration: 1500
					})
				}
			},

			// 缩小地图
			zoomOut() {
				if (this.mapScale > 3) {
					this.mapScale -= 1
				} else {
					uni.showToast({
						title: '已达到最小缩放级别',
						icon: 'none',
						duration: 1500
					})
				}
			},

			// 地图区域变化事件
			onRegionChange(e) {
				if (e.detail.type === 'end') {
					// 用户手动拖拽或缩放结束时更新地图状态
					// 安全地获取经纬度和缩放级别，防止undefined值
					const { centerLocation, scale } = e.detail;
								
					// 根据不同平台的事件对象结构处理
					if (centerLocation && centerLocation.latitude !== undefined && centerLocation.longitude !== undefined) {
						// 微信小程序等平台使用 centerLocation
						this.latitude = centerLocation.latitude;
						this.longitude = centerLocation.longitude;
					} else if (e.detail.latitude !== undefined && e.detail.longitude !== undefined) {
						// 其他平台可能直接提供 latitude 和 longitude
						this.latitude = e.detail.latitude;
						this.longitude = e.detail.longitude;
					}
								
					if (scale !== undefined) {
						this.mapScale = scale;
					}
				}
			},

			// 智能定位并移动地图到用户位置
			async moveToUserLocation() {
				try {
					const location = await this.getLocationSmart()
					
					// 检查地图上下文是否存在
					if (!this._mapContext) {
						// 直接使用响应式数据方式设置地图中心
						this.latitude = location.latitude;
						this.longitude = location.longitude;
						this.mapScale = 16; // 设置合适的缩放级别
						// 添加用户位置标记
						this.addUserLocationMarker(location);
						// 调整Mock机器人数据到用户附近
						// adjustMock 已停用
						return;
					}
					
					// 移动地图到用户位置
					this._mapContext.moveToLocation({
						latitude: location.latitude,
						longitude: location.longitude,
						success: () => {
							// 添加用户位置标记
							this.addUserLocationMarker(location)
							// 调整Mock机器人数据到用户附近
							this.adjustMockVehiclesToUserLocation(location)
						},
						fail: (error) => {
							// 如果移动失败，直接设置地图中心点
							this.latitude = location.latitude
							this.longitude = location.longitude
							// 添加用户位置标记
							this.addUserLocationMarker(location)
							// 调整Mock机器人数据到用户附近
							this.adjustMockVehiclesToUserLocation(location)
						}
					})
				} catch (error) {
					// 定位失败时使用港科大默认位置
					if (this._mapContext) {
						this._mapContext.moveToLocation({
							latitude: 22.889043,
							longitude: 113.484507
						})
					} else {
						this.latitude = 22.889043;
						this.longitude = 113.484507;
					}
				}
			},

			// 调整Mock机器人数据到用户位置附近
			adjustMockVehiclesToUserLocation(userLocation) {
				if (!this.list || this.list.length === 0) {
					return
				}
				
				// 在用户位置周围3公里范围内随机分布机器人
				const radius = 0.03 // 约3公里的经纬度范围
				
				this.list.forEach((vehicle, index) => {
					// 在用户位置周围随机生成位置
					const randomLat = userLocation.latitude + (Math.random() - 0.5) * radius
					const randomLng = userLocation.longitude + (Math.random() - 0.5) * radius
					
					// 更新机器人位置
					vehicle.lat = randomLat
					vehicle.lng = randomLng
					vehicle.latitude = randomLat
					vehicle.longitude = randomLng
					
					// 更新位置描述
					vehicle.location = `用户附近 ${index + 1}号位置`
				})
				
				// 重新更新地图标记
				this.updateMarker()				
				
			},

			// 添加用户位置标记
			addUserLocationMarker(location) {
				// 从markers数组中移除ID为99998的标记（用户位置标记）
				this.markers = this.markers.filter(marker => marker.id !== 99998);
				
				const userMarker = {
					id: 99998, // 使用特殊ID避免与机器人标记冲突
					latitude: location.latitude,
					longitude: location.longitude,
					iconPath: '/static/images/icon_my_location.png', // 用户位置图标
					width: 20,
					height: 20,
					anchor: {x: 0.5, y: 0.5},
					joinCluster: false,
					callout: {
						content: '我的位置',
						color: '#333',
						fontSize: 12,
						bgColor: '#fff',
						borderRadius: 3,
						padding: 3,
						anchorY: -5
					}
				}

				// 添加用户位置标记到markers数组
				this.markers.push(userMarker);
			},
			
			// 检查图片是否存在
			checkImageExists(imagePath) {
				// 简单的路径检查，检查图片是否存在于项目中
				return imagePath && imagePath.startsWith('/') && imagePath.endsWith('.png');
			},
			
			// 智能定位方法（复用定位测试页面的逻辑）
			async getLocationSmart() {
				// H5平台优先使用浏览器原生定位
				// #ifdef H5
				try {
					return await this.getLocationByBrowser()
				} catch (error) {
					console.warn('浏览器定位失败，尝试uni-app定位:', error.message)
					return await this.getLocationByUniApp()
				}
				// #endif
				
				// 其他平台使用uni-app定位
				// #ifndef H5
				return await this.getLocationByUniApp()
				// #endif
			},

			// 浏览器原生定位
			async getLocationByBrowser() {
				return new Promise((resolve, reject) => {
					if (!navigator.geolocation) {
						reject(new Error('浏览器不支持定位功能'))
						return
					}

					const options = {
						enableHighAccuracy: true,
						timeout: 10000,
						maximumAge: 60000
					}

					navigator.geolocation.getCurrentPosition(
						(position) => {
							const coords = position.coords
							resolve({
								latitude: coords.latitude,
								longitude: coords.longitude,
								accuracy: coords.accuracy,
								source: 'browser-geolocation'
							})
						},
						(error) => {
							let errorMessage = '浏览器定位失败'
							switch (error.code) {
								case error.PERMISSION_DENIED:
									errorMessage = '用户拒绝了定位权限请求'
									break
								case error.POSITION_UNAVAILABLE:
									errorMessage = '位置信息不可用'
									break
								case error.TIMEOUT:
									errorMessage = '定位请求超时'
									break
							}
							reject(new Error(errorMessage))
						},
						options
					)
				})
			},

			// uni-app定位（使用多重降级策略）
			async getLocationByUniApp() {
				return new Promise((resolve, reject) => {
					// 尝试不同的配置组合
					const locationOptions = [
						{ type: 'wgs84', name: 'WGS84', altitude: false },
						{ type: 'gcj02', name: 'GCJ02', altitude: false },
						{ type: undefined, name: '默认', altitude: false },
						{ type: 'wgs84', name: 'WGS84-简化', altitude: false, isHighAccuracy: false },
						{ type: undefined, name: '最简配置', altitude: false, isHighAccuracy: false }
					]
					
					this.tryUniLocationWithOptions(locationOptions, 0, resolve, reject)
				})
			},

			// 尝试不同的uni-app定位选项
			tryUniLocationWithOptions(options, index, resolve, reject) {
				if (index >= options.length) {
					reject(new Error('所有坐标系类型都失败了'))
					return
				}

				const currentOption = options[index]
				const locationConfig = {
					altitude: currentOption.altitude !== undefined ? currentOption.altitude : false,
					timeout: 15000,
					isHighAccuracy: currentOption.isHighAccuracy !== undefined ? currentOption.isHighAccuracy : true,
					success: (res) => {
						// 确保返回的数据有必要的属性
						const validatedResult = {
							latitude: res.latitude || 0,
							longitude: res.longitude || 0,
							accuracy: res.accuracy || 0,
							source: `uni-app (${currentOption.name})`
						}
						resolve(validatedResult)
					},
					fail: (error) => {
						console.warn(`[Map] uni-app定位失败 (${currentOption.name}):`, error.errMsg)
						// 尝试下一个选项
						this.tryUniLocationWithOptions(options, index + 1, resolve, reject)
					}
				}

				// 只有在type有值时才添加type参数
				if (currentOption.type) {
					locationConfig.type = currentOption.type
				}

				uni.getLocation(locationConfig)
			},

			// H5平台添加鼠标滚轮缩放支持
			addMouseWheelZoom() {
				// 确保地图元素存在后再添加事件监听
				this.$nextTick(() => {
					const query = uni.createSelectorQuery();
					query.select('#map').boundingClientRect((data) => {
						if (data) {
							// 在H5环境中，获取真实的DOM元素
							const mapElement = document.querySelector('#map') || document.querySelector('.map');
							if (mapElement) {
								mapElement.addEventListener('wheel', (e) => {
									e.preventDefault(); // 阻止页面滚动
								
									const delta = e.deltaY;
									if (delta < 0) {
										// 向上滚动，放大
										this.zoomIn();
									} else {
										// 向下滚动，缩小
										this.zoomOut();
									}
								}, { passive: false });

							} 
						} 
					}).exec();
				});
			}
		}
	}
</script>

<style>
	.page{
		width: 100%;
		position: relative;
		box-sizing: border-box;
		overflow: hidden; /* 防止页面滚动 */
	}
	
	.map{
		position: absolute;
		width: 100%;
		height: 100%;
		z-index: 0;
	}
	
	.header{
		position: absolute;
		width: 100vw;
		height: 138.5px;
		background: linear-gradient(to bottom, rgba(255, 255, 255, 1.0), rgba(255, 255, 255, 0));
		z-index: 10; /* 确保header在地图上方 */
	}
	
	.title{
		display: flex;
		flex-direction: row;
		align-items: center;
		margin-left: 16px;
		color: #18191A;
		font-size: 18px;
		font-weight: bold;
	}
	
	.org{
		max-width: 200px;
		background-color: white;
		padding: 10px 16px;
		border-radius: 99px;
		box-shadow: 0px 20px 40px 0px rgba(8,27,74,0.1);
		border-radius: 40px;
		border: 1px solid #DAE0E6;
		font-size: 14px;
		color: #18191A;
		display: flex;
		flex-direction: row;
		align-items: center;
	}
	
	.org-name{
		display: block;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	
	.org-arrow{
		width: 9px;
		height: 9px;
		margin-left: 6px;
	}
	
	.search{
		width: 40px;
		height: 40px;
		background: #FFFFFF;
		box-shadow: 0px 20px 40px 0px rgba(8,27,74,0.1);
		border-radius: 50%;
		border: 1px solid #DAE0E6;
	}
	
	.button-box{
		position: absolute;
		bottom: 90px;
		left: 20rpx;
		display: flex;
		flex-direction: column;
		z-index: 10; /* 确保按钮盒在地图上方 */
	}
	
	.button{
		width: 40px;
		height: 40px;
		background: #FFFFFF;
		box-shadow: 0px 20px 40px 0px rgba(8,27,74,0.1);
		border-radius: 50%;
		border: 1px solid #DAE0E6;
		padding: 20rpx;
		box-sizing: border-box;
	}
	
	.menu-box{
		width: 46px;
		position: absolute;
		top: 140px;
		right: 20rpx;
		display: flex;
		flex-direction: column;
		background: #FFFFFF;
		box-shadow: 0px 20px 40px 0px rgba(8,27,74,0.1);
		border-radius: 16px;
		border: 1px solid #DAE0E6;
		box-sizing: border-box;
		z-index: 10; /* 确保菜单盒在地图上方 */
	}
	
	.menu-item{
		color: #18191A;
		font-size: 12px;
		box-sizing: border-box;
		padding: 12px 0;
	}
	
	.status-box{
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		box-sizing: border-box;
		padding: 20rpx;
		z-index: 10; /* 确保状态盒在地图上方 */
	}
	
	.status{
		width: 100%;
		background-color: white;
		height: 140rpx;
		border-radius: 20rpx;
		padding: 5px;
		box-sizing: border-box;
		display: flex;
		flex-direction: row;
	}
	
	.status-item{
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}
	
	
	.status-value{
		font-size: 16px;
		font-weight: bold;
		color: #317EF1;
	}
	
	.status-label{
		font-size: 14px;
		color: #616366;
	}
	
	.checked{
		background-color: #317EF1;
		border-radius: 8px;
	}
	
	.checked .status-value,
	.checked .status-label {
	    color: #FFFFFF; /* 设置颜色为白色 */
	}
	
	.pop-box{
		position: absolute;
		width: 710rpx;
		left: 20rpx;
		right: 20rpx;
		bottom: 20rpx; 
		background-color: white;
		border-radius: 15px;
		display: flex;
		flex-direction: column;
		box-sizing: border-box;
		padding: 20px 15px;
		z-index: 20; /* 确保弹出框在最顶层 */
	}
	
	.numberplate{
		color: #18191A;
		font-size: 20px;
		font-weight: bold;
		margin-left: 6px;
	}
	
	.setting{
		background-color: #F2F2F2;
		width: 75px;
		height: 36px;
		border-radius: 7px;
		font-size: 14px;
		color: #327EEF;
	}
	
	.pop-close{
		position: absolute;
		top: 12px;
		right: 12px;
	}
	
	.status-text{
		padding: 4px 6px;
		font-size: 12px;
		color: white;
		border-radius: 99px;
		margin-right: 20rpx;
	}
	
	.pop-text{
		color: #5C6166;
		font-size: 13px;
	}

	/* 缩放控制按钮样式 */
	.zoom-controls {
		position: absolute;
		bottom: 200px;
		right: 20rpx;
		display: flex;
		flex-direction: column;
		gap: 2px;
		z-index: 10; /* 确保缩放按钮在地图上方 */
	}

	.zoom-btn {
		width: 40px;
		height: 40px;
		background: #FFFFFF;
		box-shadow: 0px 20px 40px 0px rgba(8,27,74,0.1);
		border-radius: 8px;
		border: 1px solid #DAE0E6;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 20px;
		font-weight: bold;
		color: #333;
		cursor: pointer;
		user-select: none;
		touch-action: manipulation;
	}

	.zoom-btn:active {
		background: #f0f0f0;
		transform: scale(0.95);
	}
</style>