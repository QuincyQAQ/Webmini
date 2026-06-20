import mockData from './mockData.js'
import config from '@/config/config.js'
import CryptoJS from 'crypto-js'

// Mock服务处理器
class MockService {
	constructor() {
		this.data = mockData
		this.delay = 500 // 模拟网络延迟
	}

	// AES加密方法（与utils.js保持一致）
	encryptByAES(word) {
		const key = CryptoJS.enc.Utf8.parse("tHisidddEY12568d")
		const iv = CryptoJS.enc.Utf8.parse('')
		const srcs = CryptoJS.enc.Utf8.parse(word)
		const encrypted = CryptoJS.AES.encrypt(srcs, key, {
			iv: iv,
			mode: CryptoJS.mode.CBC,
			padding: CryptoJS.pad.Pkcs7
		})
		return encrypted.ciphertext.toString().toUpperCase();
	}

	// 模拟网络延迟
	async mockDelay() {
		return new Promise(resolve => {
			setTimeout(resolve, this.delay)
		})
	}

	// 生成成功响应
	successResponse(data) {
		return {
			code: 200,
			msg: "操作成功",
			data: data
		}
	}

	// 生成分页响应
	pageResponse(list, page = 1, size = 10) {
		const start = (page - 1) * size
		const end = start + size
		const pageData = list.slice(start, end)
		
		return {
			code: 200,
			msg: "操作成功",
			rows: pageData,
			total: list.length
		}
	}

	// 生成错误响应
	errorResponse(msg = "操作失败", code = 500) {
		return {
			code: code,
			msg: msg,
			data: null
		}
	}

	// 根据URL路径匹配对应的mock处理方法
	async handleRequest(url, data = {}, method = 'GET') {
		await this.mockDelay()

		// 移除baseUrl前缀
		const path = url.replace(config.baseUrl, '')
		
		console.log(`[Mock] ${method} ${path}`, data)

		// 路由匹配
		switch (path) {
			// 登录相关
			case '/app/login':
				return this.handleLogin(data)
			case '/app/modifyPassword':
				return this.handleModifyPassword(data)
			case '/app/user/getUserMsg':
				return this.handleGetUserInfo(data)
			case '/app/user/editUser':
				return this.handleEditUser(data)

			// 地图和机器人相关
			case '/app/realtimePositioning/queryGpsList':
				return this.handleGetMapData(data)
			case '/app/realtimePositioning/dataTree':
				return this.handleGetOrgData(data)
			case '/app/realtimePositioning/searchVehicle':
				return this.handleSearchVehicle(data)
			case '/app/realtimePositioning/queryVehicleList':
				return this.handleGetVehicleList(data)

			// 用机器人申请相关
			case '/app/vehicleApplication/vehicleApplyList':
				return this.handleGetVehicleApplyList(data)
			case '/app/vehicleApplication/getVehicleApplyInfoByApplyId':
				return this.handleGetVehicleApplyDetail(data)
			case '/app/vehicleApplication/saveVehicleApply':
				return this.handleSaveVehicleApply(data)
			case '/app/vehicleApplication/updateVehicleApply':
				return this.handleUpdateVehicleApply(data)
			
			// 调度相关
			case '/app/vehicleApplication/getDispatchVehiclesByApplyId':
				return this.handleGetDispatchVehicles(data)
			case '/app/vehicleApplication/saveDispatchVehicles':
				return this.handleSaveDispatchVehicles(data)
			case '/app/vehicleApplication/updateDispatchVehicles':
				return this.handleUpdateDispatchVehicles(data)

			// 驾驶员相关
			case '/app/vehicleApplication/getDriverByCompanyId':
				return this.handleGetDriverByCompanyId(data)

			// 机器人选择相关
			case '/app/vehicleApplication/getVehicleSelectList':
				return this.handleGetVehicleSelectList(data)

			// 轨迹查询相关
			case '/app/realtimePositioning/getVehicleHisSegmentTracksAPP':
				return this.handleGetVehicleHisSegmentTracksAPP(data)

			// 轨迹详情相关
			case '/app/realtimePositioning/getVehicleHisTracksDetail':
				return this.handleGetVehicleHisTracksDetail(data)

			default:
				console.warn(`[Mock] 未匹配的路径: ${path}`)
				return this.successResponse({})
		}
	}

	// 登录
	async handleLogin(data) {
		console.log('[Mock] 登录请求数据:', data)
		
		// 支持的测试账号
		const testAccounts = [
			{ username: 'admin', password: '123456' },
			{ username: 'test', password: '123456' },
			{ username: 'demo', password: '123456' }
		]
		
		// 检查用户名和加密密码
		const account = testAccounts.find(acc => acc.username === data.username)
		if (!account) {
			return this.errorResponse("用户名不存在", 401)
		}
		
		// 验证密码（支持明文和加密密码）
		const encryptedPassword = this.encryptByAES(account.password)
		console.log('[Mock] 期望的加密密码:', encryptedPassword)
		console.log('[Mock] 接收到的密码:', data.password)
		
		if (data.password !== encryptedPassword && data.password !== account.password) {
			return this.errorResponse("密码错误", 401)
		}
		
		// 获取用户信息并进行字段映射
		const userInfo = this.data.user.userInfo;
		const mappedUserInfo = {
			...userInfo,
			name: userInfo.realName || userInfo.name || "未知用户",       // 姓名
			phoneNumber: userInfo.phone || userInfo.phoneNumber || "",   // 电话号码
			companyName: userInfo.deptName || userInfo.companyName || "未知部门", // 公司/部门名称
			userType: userInfo.userType || 1,                           // 用户类型
			email: userInfo.email || "",                                // 邮箱
			photo: userInfo.avatar || userInfo.photo || "",             // 头像
			username: userInfo.username || "unknown",                   // 用户账号
			id: userInfo.id || 1                                      // 用户ID
		};
		
		// 登录成功，返回用户信息和token
		return this.successResponse({
			token: this.data.user.token,
			phoneNumber: mappedUserInfo.phoneNumber,
			userType: String(mappedUserInfo.userType),
			...mappedUserInfo
		})
	}

	// 修改密码
	async handleModifyPassword(data) {
		return this.successResponse("密码修改成功")
	}

	// 获取用户信息
	async handleGetUserInfo(data) {
		const userInfo = this.data.user.userInfo;
		
		// 字段映射以匹配前端需求
		const mappedUserInfo = {
			...userInfo,
			name: userInfo.realName || userInfo.name || "未知用户",       // 姓名
			phoneNumber: userInfo.phone || userInfo.phoneNumber || "",   // 电话号码
			companyName: userInfo.deptName || userInfo.companyName || "未知部门", // 公司/部门名称
			userType: userInfo.userType || 1,                           // 用户类型
			email: userInfo.email || "",                                // 邮箱
			photo: userInfo.avatar || userInfo.photo || "",             // 头像
			username: userInfo.username || "unknown",                  // 用户账号
			id: userInfo.id || 1                                       // 用户ID
		};
		
		return this.successResponse(mappedUserInfo);
	}

	// 编辑用户信息
	async handleEditUser(data) {
		// 更新用户信息，进行字段映射
		const updatedUserInfo = {
			...this.data.user.userInfo,
			...(data.nickName !== undefined && {realName: data.nickName}),  // nickName 映射到 realName
			...(data.sex !== undefined && {sex: data.sex}),
			...(data.email !== undefined && {email: data.email}),
			...(data.photo !== undefined && {avatar: data.photo}),          // photo 映射到 avatar
			...(data.companyName !== undefined && {deptName: data.companyName}) // companyName 映射到 deptName
		};
		
		// 更新数据
		this.data.user.userInfo = updatedUserInfo;
		
		// 返回完整的更新后的用户信息，确保前端能获取到最新的完整数据
		const mappedUserInfo = {
			...updatedUserInfo,
			name: updatedUserInfo.realName || updatedUserInfo.name || "未知用户",       // 姓名
			phoneNumber: updatedUserInfo.phone || updatedUserInfo.phoneNumber || "",   // 电话号码
			companyName: updatedUserInfo.deptName || updatedUserInfo.companyName || "未知部门", // 公司/部门名称
			userType: updatedUserInfo.userType || 1,                           // 用户类型
			email: updatedUserInfo.email || "",                                // 邮箱
			photo: updatedUserInfo.avatar || updatedUserInfo.photo || "",             // 头像
			username: updatedUserInfo.username || "unknown",                  // 用户账号
			id: updatedUserInfo.id || 1                                       // 用户ID
		};
		
		return this.successResponse(mappedUserInfo);
	}

	// 获取地图数据
	async handleGetMapData(data) {
		const vehicles = this.data.vehicles
		
		// 计算统计数据
		const onlineCount = vehicles.filter(v => v.isOnline > 0).length
		const offlineCount = vehicles.filter(v => v.isOnline === 0).length
		const freeCount = vehicles.filter(v => v.vehicleTaskStatus === 0).length // TASK_STATUS_FREE
		const taskCount = vehicles.filter(v => v.vehicleTaskStatus === 1).length // TASK_STATUS_TASKING
		
		return this.successResponse({
			onlineCount,
			offlineCount,
			freeCount,
			taskCount,
			list: vehicles
		})
	}

	// 获取组织架构
	async handleGetOrgData(data) {
		return this.successResponse(this.data.orgTree)
	}

	// 搜索机器人
	async handleSearchVehicle(data) {
		const keyword = data.keyword || ''
		const filtered = this.data.vehicles.filter(v => 
			v.numberPlate.includes(keyword) || v.driver.includes(keyword)
		)
		return this.successResponse(filtered)
	}

	// 获取机器人列表
	async handleGetVehicleList(data) {
		const page = data.page || 1
		const size = data.size || 10
		return this.pageResponse(this.data.vehicles, page, size)
	}

	// 获取用机器人申请列表
	async handleGetVehicleApplyList(data) {
		const page = data.page || 1
		const size = data.size || 10
		
		// 映射字段以匹配前端需求
		const mappedApplications = this.data.vehicleApplications.map(app => {
			return {
				...app,
				// 字段映射
				applyName: app.applicant,         // 申请人姓名
				applyTel: app.phone,              // 申请人电话
				useName: app.applicant,           // 申请人 -> 用机器人人姓名
				useTel: app.phone,               // 电话 -> 用机器人人电话
				companyName: app.department,     // 部门 -> 所属部门
				companyId: 1,                    // 默认公司ID
				purpose: app.purpose,            // 用途
				orderStatus: this.convertStatusToOrderStatus(app.status), // 状态映射
				boardingTime: `${app.startTime} 至 ${app.endTime}`, // 用机器人时间
				vehicleNum: app.passengerCount,  // 乘客数量作为机器人数量
				numberPlate: "等待调度机器人...",   // 添加默认机器人编号
				remark: app.remark,              // 用机器人事由
				boardingLocation: app.destination || "公司总部", // 上车地点
				destination: [{                 // 目的地列表
					name: "目的地",
					address: app.destination || "目的地地址"
				}],
				returnTime: app.endTime,        // 预计返回时间
				userNum: app.passengerCount || 1, // 用机器人人数
				imageList: app.images || [],    // 申请照片列表
				imageReturn: app.returnImages || [], // 回收照片列表
				applyId: app.id                 // 申请ID
			}
		})
		
		// 如果指定了特定状态，过滤数据
		if (data.orderStatus !== undefined && data.orderStatus !== null) {
			const filteredApplications = mappedApplications.filter(app => 
				app.orderStatus === data.orderStatus
			)
			return this.pageResponse(filteredApplications, page, size)
		}
		
		return this.pageResponse(mappedApplications, page, size)
	}
	
	// 状态转换辅助函数
	convertStatusToOrderStatus(status) {
		// 根据状态字符串映射到对应的订单状态常量
		switch(status) {
			case "待审批":
				return 0; // ORDER_STATUS_APPLY
			case "已审批":
			case "待调度":
				return 1; // ORDER_STATUS_APPROVAL
			case "待接单":
				return 2; // ORDER_STATUS_SCHEDULING
			case "待派遣":
				return 3; // ORDER_STATUS_TAKE
			case "待回收":
				return 4; // ORDER_STATUS_SEND_CAR
			case "已完成":
				return 5; // ORDER_STATUS_RETURN_CAR
			case "已撤销":
				return 6; // ORDER_STATUS_CANCEL
			case "已驳回":
				return 7; // ORDER_STATUS_REJECTED
			default:
				return 0; // 默认为待审批
		}
	}

	// 获取用机器人申请详情
	async handleGetVehicleApplyDetail(data) {
		const apply = this.data.vehicleApplications.find(a => a.id == data.applyId)
		if (!apply) {
			return this.successResponse({})
		}
		
		// 映射字段以匹配前端需求
		const mappedApply = {
			...apply,
			// 字段映射
			applyName: apply.applicant,         // 申请人姓名
			applyTel: apply.phone,              // 申请人电话
			useName: apply.applicant,           // 申请人 -> 用机器人人姓名
			useTel: apply.phone,               // 电话 -> 用机器人人电话
			companyName: apply.department,     // 部门 -> 所属部门
			companyId: 1,                      // 默认公司ID
			purpose: apply.purpose,            // 用途
			orderStatus: this.convertStatusToOrderStatus(apply.status), // 状态映射
			boardingTime: `${apply.startTime} 至 ${apply.endTime}`, // 用机器人时间
			vehicleNum: apply.passengerCount,  // 乘客数量作为机器人数量
			numberPlate: "等待调度机器人...",   // 添加默认机器人编号
			remark: apply.remark,              // 用机器人事由
			boardingLocation: apply.destination || "公司总部", // 上车地点
			destination: [{                   // 目的地列表
				name: "目的地",
				address: apply.destination || "目的地地址"
			}],
			returnTime: apply.endTime,        // 预计返回时间
			userNum: apply.passengerCount || 1, // 用机器人人数
			imageList: apply.images || [],    // 申请照片列表
			imageReturn: apply.returnImages || [], // 回收照片列表
			applyId: apply.id                 // 申请ID
		}
		
		return this.successResponse(mappedApply)
	}

	// 保存用机器人申请
	async handleSaveVehicleApply(data) {
		const newApply = {
			id: Date.now(),
			applyNo: `YC${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(new Date().getDate()).padStart(2, '0')}${String(this.data.vehicleApplications.length + 1).padStart(4, '0')}`,
			...data,
			status: "待审批",
			createTime: new Date().toLocaleString()
		}
		this.data.vehicleApplications.unshift(newApply)
		return this.successResponse(newApply)
	}

	// 更新用机器人申请
	async handleUpdateVehicleApply(data) {
		const index = this.data.vehicleApplications.findIndex(a => a.id == data.id)
		if (index !== -1) {
			this.data.vehicleApplications[index] = { ...this.data.vehicleApplications[index], ...data }
		}
		return this.successResponse("更新成功")
	}

	// 获取调度机器人信息
	async handleGetDispatchVehicles(data) {
		// 根据申请ID查找对应的调度信息
		const applyId = data.applyId;
		
		// 模拟调度数据 - 如果存在调度信息则返回，否则返回空数组
		const existingDispatch = this.data.dispatches ? this.data.dispatches.find(d => d.applyId == applyId) : null;
		
		if (existingDispatch) {
			// 返回已有的调度信息
			return this.successResponse([existingDispatch]);
		} else {
			// 如果没有调度信息，根据申请ID生成一个模拟的调度信息
			const vehicle = this.data.vehicles[Math.floor(Math.random() * this.data.vehicles.length)];
			const driver = this.data.drivers[Math.floor(Math.random() * this.data.drivers.length)];
			
			// 创建模拟的调度信息
			const mockDispatch = {
				applyId: applyId,
				dispatchId: Date.now(),
				numberPlate: vehicle ? vehicle.numberPlate : "粤A12345",  // 机器人编号
				driverName: driver ? driver.name : "张师傅",             // 驾驶员姓名
				contactNumber: driver ? driver.phone : "13800138000",    // 驾驶员联系方式
				dispatchTime: new Date().toLocaleString(),              // 调度时间
				status: "已调度"                                         // 调度状态
			};
			
			// 如果还没有调度数据数组，创建一个
			if (!this.data.dispatches) {
				this.data.dispatches = [];
			}
			
			// 添加到调度数据中
			this.data.dispatches.push(mockDispatch);
			
			// 返回调度信息数组
			return this.successResponse([mockDispatch]);
		}
	}

	// 保存调度机器人
	async handleSaveDispatchVehicles(data) {
		const newDispatch = {
			dispatchId: Date.now(),
			...data,
			dispatchTime: new Date().toLocaleString(),
			status: "已调度"
		};
		
		// 如果还没有调度数据数组，创建一个
		if (!this.data.dispatches) {
			this.data.dispatches = [];
		}
		
		// 添加到调度数据中
		this.data.dispatches.push(newDispatch);
		
		return this.successResponse(newDispatch);
	}

	// 更新调度机器人
	async handleUpdateDispatchVehicles(data) {
		if (!this.data.dispatches) {
			this.data.dispatches = [];
		}
		
		const index = this.data.dispatches.findIndex(d => d.dispatchId == data.dispatchId || d.applyId == data.applyId);
		if (index !== -1) {
			this.data.dispatches[index] = { ...this.data.dispatches[index], ...data };
		}
		
		return this.successResponse("更新成功");
	}

	// 获取维修列表
	async handleGetRepairList(data) {
		const page = data.page || 1
		const size = data.size || 10
		return this.pageResponse(this.data.repairApplications, page, size)
	}

	// 保存维修申请
	async handleSaveRepair(data) {
		const newRepair = {
			id: Date.now(),
			repairNo: `WX${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(new Date().getDate()).padStart(2, '0')}${String(this.data.repairApplications.length + 1).padStart(4, '0')}`,
			...data,
			status: "待审批",
			createTime: new Date().toLocaleString()
		}
		this.data.repairApplications.unshift(newRepair)
		return this.successResponse(newRepair)
	}

	// 获取维修详情
	async handleGetRepairDetail(data) {
		const repair = this.data.repairApplications.find(r => r.id == data.repairId)
		return this.successResponse(repair || {})
	}

	// 获取驾驶员列表
	async handleGetDriverByCompanyId(data) {
		// 根据公司ID获取驾驶员列表，如果没有指定公司ID则返回所有驾驶员
		const companyId = data.companyId;
		const driverTaskStatus = data.driverTaskStatus;
		const name = data.name || '';
		const pageNum = data.pageNum || 1;
		const pageSize = data.pageSize || 10;
		
		// 如果有公司ID，可以根据需要进行过滤，但现在我们返回所有驾驶员
		// 因为mock数据中没有将驾驶员与公司关联
		let drivers = this.data.drivers || [];
		
		// 根据任务状态过滤（如果提供了状态）
		if (driverTaskStatus !== undefined && driverTaskStatus !== null) {
			// 这里我们简单地根据状态过滤，实际中可能需要更复杂的逻辑
			// 使用status字段进行过滤（空闲或任务中）
			if (driverTaskStatus === 0) { // 空闲
				drivers = drivers.filter(driver => driver.status === '空闲');
			} else if (driverTaskStatus === 1) { // 任务中
				drivers = drivers.filter(driver => driver.status === '使用中');
			}
		}
		
		// 根据姓名关键词过滤
		if (name) {
			drivers = drivers.filter(driver => 
				driver.name.toLowerCase().includes(name.toLowerCase()) || 
				(driver.phone && driver.phone.includes(name))
			);
		}
		
		// 将驾驶员数据映射到页面期望的字段格式
		const mappedDrivers = drivers.map(driver => ({
			...driver,
			name: driver.name || "未知驾驶员",
			contactNumber: driver.phone || driver.contactNumber || "", // 将phone映射为contactNumber
			companyName: driver.companyName || "未知部门", // 添加所属部门信息
			sex: driver.sex || 0, // 默认为男性
			age: driver.age || 30, // 默认年龄
			id: driver.id
		}));
		
		// 分页处理
		const start = (pageNum - 1) * pageSize;
		const end = start + pageSize;
		const pagedDrivers = mappedDrivers.slice(start, end);
		
		// 返回符合分页格式的响应
		return this.successResponse({
			rows: pagedDrivers,
			total: mappedDrivers.length,
			pageNum: pageNum,
			pageSize: pageSize,
			pages: Math.ceil(mappedDrivers.length / pageSize)
		});
	}

	// 获取机器人选择列表
	async handleGetVehicleSelectList(data) {
		// 获取参数
		const companyId = data.companyId;
		const vehicleTaskStatus = data.vehicleTaskStatus;
		const numberPlate = data.numberPlate || '';
		const pageNum = data.pageNum || 1;
		const pageSize = data.pageSize || 10;
		
		// 通常返回所有机器人的基本信息，用于下拉选择等场景
		let vehicles = this.data.vehicles || [];
		
		// 根据任务状态过滤
		if (vehicleTaskStatus !== undefined && vehicleTaskStatus !== null) {
			if (vehicleTaskStatus === 0) { // 空闲
				vehicles = vehicles.filter(vehicle => vehicle.vehicleTaskStatus === 0);
			} else if (vehicleTaskStatus === 1) { // 任务中
				vehicles = vehicles.filter(vehicle => vehicle.vehicleTaskStatus === 1);
			}
		}
		
		// 根据机器人编号关键词过滤
		if (numberPlate) {
			vehicles = vehicles.filter(vehicle => 
				vehicle.numberPlate.toLowerCase().includes(numberPlate.toLowerCase()) || 
				(vehicle.plateNumber && vehicle.plateNumber.toLowerCase().includes(numberPlate.toLowerCase()))
			);
		}
		
		// 将机器人数据映射到页面期望的字段格式
		const selectList = vehicles.map(vehicle => ({
			...vehicle,
			numberPlate: vehicle.numberPlate || vehicle.plateNumber || "未知机器人",
			companyName: vehicle.companyName || "未知部门", // 添加所属部门信息
			deviceId: vehicle.equipmentId || vehicle.deviceId || vehicle.id, // 将equipmentId映射为deviceId
			id: vehicle.id,
			plateNumber: vehicle.plateNumber || vehicle.numberPlate || "未知机器人"
		}));
		
		// 分页处理
		const start = (pageNum - 1) * pageSize;
		const end = start + pageSize;
		const pagedVehicles = selectList.slice(start, end);
		
		// 返回符合分页格式的响应
		return this.successResponse({
			rows: pagedVehicles,
			total: selectList.length,
			pageNum: pageNum,
			pageSize: pageSize,
			pages: Math.ceil(selectList.length / pageSize)
		});
	}

	// 获取机器人历史轨迹分段数据
	async handleGetVehicleHisSegmentTracksAPP(data) {
		// 获取参数
		const dvo = data.dvo; // 设备ID
		const numberPlate = data.numberPlate; // 机器人编号
		const startTime = data.startTime || new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0]; // 默认昨天
		const endTime = data.endTime || new Date().toISOString().split('T')[0]; // 默认今天
		
		// 查找匹配的机器人
		const matchedVehicle = this.data.vehicles.find(vehicle => 
			vehicle.equipmentId === dvo || vehicle.numberPlate === numberPlate
		);
		
		if (!matchedVehicle) {
			// 前端期望直接返回数组，而不是分页对象
			return this.successResponse([]);
		}
		
		// 创建示例轨迹数据
		const tracks = this.data.trajectories.find(t => t.vehicleId === matchedVehicle.id);
		
		if (!tracks) {
			// 如果没有预设的轨迹数据，创建一个默认的轨迹段
			const defaultTrack = {
				vehicleId: matchedVehicle.id,
				plateNumber: matchedVehicle.numberPlate,
				mileageSum: 120, // 总里程
				beginTime: startTime + " 08:00:00", // 开始时间
				endTime: startTime + " 18:00:00", // 结束时间
				startAddress: matchedVehicle.location, // 起始地址
				endAddress: "深圳市南山区科技园", // 最终地址
				trackSegments: [{
					segmentId: 1,
					startTime: `${startTime} 08:00:00`,
					endTime: `${startTime} 18:00:00`,
					points: [
						{
							lat: matchedVehicle.latitude || matchedVehicle.lat,
							lng: matchedVehicle.longitude || matchedVehicle.lng,
							speed: 0,
							direction: 0,
							time: `${startTime} 08:00:00`,
							address: matchedVehicle.location
						},
						{
							lat: (matchedVehicle.latitude || matchedVehicle.lat) + 0.001,
							lng: (matchedVehicle.longitude || matchedVehicle.lng) + 0.001,
							speed: 30,
							direction: 45,
							time: `${startTime} 10:00:00`,
							address: "深圳市南山区深南大道"
						},
						{
							lat: (matchedVehicle.latitude || matchedVehicle.lat) + 0.002,
							lng: (matchedVehicle.longitude || matchedVehicle.lng) + 0.002,
							speed: 40,
							direction: 90,
							time: `${startTime} 12:00:00`,
							address: "深圳市南山区科技园"
						}
					]
				}]
			};
			
			// 前端期望直接返回数组，而不是分页对象
			return this.successResponse([defaultTrack]);
		}
		
		// 构建轨迹数据响应
		const trackData = {
			vehicleId: tracks.vehicleId,
			plateNumber: tracks.plateNumber,
			mileageSum: 85, // 总里程
			beginTime: startTime + " 08:00:00", // 开始时间
			endTime: startTime + " 18:00:00", // 结束时间
			startAddress: tracks.tracks[0]?.address || matchedVehicle.location, // 起始地址
			endAddress: tracks.tracks[tracks.tracks.length - 1]?.address || "目的地", // 最终地址
			trackSegments: tracks.tracks ? [{
				segmentId: 1,
				startTime: `${startTime} 08:00:00`,
				endTime: `${startTime} 18:00:00`,
				points: tracks.tracks
			}] : []
		};
		
		// 前端期望直接返回数组，而不是分页对象
		return this.successResponse([trackData]);
	}

	// 获取机器人历史轨迹详情
	async handleGetVehicleHisTracksDetail(data) {
		// 获取参数
		const dvo = data.dvo; // 设备ID
		const numberPlate = data.numberPlate; // 机器人编号
		let startTime = data.startTime; // 开始时间
		let endTime = data.endTime; // 结束时间
		
		// 修复时间格式问题：如果时间格式不正确，尝试提取正确部分
		if (startTime && typeof startTime === 'string' && startTime.includes(' 00:00:00')) {
			// 如果格式是 'YYYY-MM-DD 00:00:00 HH:mm:ss'，提取后面的部分
			const parts = startTime.split(' 00:00:00');
			if (parts.length > 1) {
				startTime = parts[1].trim();
			}
		}
		
		if (endTime && typeof endTime === 'string' && endTime.includes(' 00:00:00')) {
			// 如果格式是 'YYYY-MM-DD 00:00:00 HH:mm:ss'，提取后面的部分
			const parts = endTime.split(' 00:00:00');
			if (parts.length > 1) {
				endTime = parts[1].trim();
			}
		}
		
		// 如果仍然格式不正确，使用默认时间
		if (!startTime || startTime.length < 8) {
			startTime = new Date().toISOString().split('T')[0] + " 08:00:00";
		}
		if (!endTime || endTime.length < 8) {
			endTime = new Date().toISOString().split('T')[0] + " 18:00:00";
		}
		
		// 确保时间格式正确
		if (startTime && !startTime.includes(':')) {
			startTime += " 08:00:00";
		}
		if (endTime && !endTime.includes(':')) {
			endTime += " 18:00:00";
		}
		
		// 查找匹配的机器人
		const matchedVehicle = this.data.vehicles.find(vehicle => 
			vehicle.equipmentId === dvo || vehicle.numberPlate === numberPlate
		);
		
		if (!matchedVehicle) {
			// 返回空的轨迹详情
			return this.successResponse({
				tracks: []
			});
		}
		
		// 创建详细的轨迹数据
		const tracks = this.data.trajectories.find(t => t.vehicleId === matchedVehicle.id);
		
		if (!tracks) {
			// 如果没有预设的轨迹数据，创建详细的轨迹点
			// 注意：前端模板使用 gdt(时间), spd(速度), ars(地址) 字段
			const detailedTracks = [
				{
					lat: matchedVehicle.latitude || matchedVehicle.lat,
					lng: matchedVehicle.longitude || matchedVehicle.lng,
					spd: 0, // 前端使用的速度字段名
					direction: 0,
					gdt: startTime || `${new Date().toISOString().split('T')[0]} 08:00:00`, // 前端使用的时间字段名
					ars: matchedVehicle.location, // 前端使用的位置字段名
					altitude: 100, // 海拔
					gpsTime: startTime || `${new Date().toISOString().split('T')[0]} 08:00:00` // GPS时间
				},
				{
					lat: (matchedVehicle.latitude || matchedVehicle.lat) + 0.0005,
					lng: (matchedVehicle.longitude || matchedVehicle.lng) + 0.0005,
					spd: 20, // 前端使用的速度字段名
					direction: 45,
					gdt: startTime || `${new Date().toISOString().split('T')[0]} 09:00:00`, // 前端使用的时间字段名
					ars: "深圳市南山区深南大道入口", // 前端使用的位置字段名
					altitude: 105,
					gpsTime: startTime || `${new Date().toISOString().split('T')[0]} 09:00:00`
				},
				{
					lat: (matchedVehicle.latitude || matchedVehicle.lat) + 0.001,
					lng: (matchedVehicle.longitude || matchedVehicle.lng) + 0.001,
					spd: 40, // 前端使用的速度字段名
					direction: 90,
					gdt: startTime || `${new Date().toISOString().split('T')[0]} 10:00:00`, // 前端使用的时间字段名
					ars: "深圳市南山区科技园", // 前端使用的位置字段名
					altitude: 110,
					gpsTime: startTime || `${new Date().toISOString().split('T')[0]} 10:00:00`
				},
				{
					lat: (matchedVehicle.latitude || matchedVehicle.lat) + 0.0015,
					lng: (matchedVehicle.longitude || matchedVehicle.lng) + 0.0015,
					spd: 30, // 前端使用的速度字段名
					direction: 180,
					gdt: startTime || `${new Date().toISOString().split('T')[0]} 11:00:00`, // 前端使用的时间字段名
					ars: "深圳市南山区高新技术园", // 前端使用的位置字段名
					altitude: 95,
					gpsTime: startTime || `${new Date().toISOString().split('T')[0]} 11:00:00`
				},
				{
					lat: (matchedVehicle.latitude || matchedVehicle.lat) + 0.002,
					lng: (matchedVehicle.longitude || matchedVehicle.lng) + 0.002,
					spd: 0, // 前端使用的速度字段名
					direction: 0,
					gdt: endTime || `${new Date().toISOString().split('T')[0]} 12:00:00`, // 前端使用的时间字段名
					ars: "深圳市南山区某大厦", // 前端使用的位置字段名
					altitude: 100,
					gpsTime: endTime || `${new Date().toISOString().split('T')[0]} 12:00:00`
				}
			];
			
			return this.successResponse({
				tracks: detailedTracks,
				vehicleInfo: {
					id: matchedVehicle.id,
					numberPlate: matchedVehicle.numberPlate,
					driver: matchedVehicle.driver
				}
			});
		}
		
		// 使用现有的轨迹数据构建详情响应，映射字段名以匹配前端需求
		const detailedTracks = tracks.tracks.map((point, index) => ({
			...point,
			spd: point.speed || point.spd || 0, // 映射速度字段
			gdt: point.time || point.gdt || `${new Date().toISOString().split('T')[0]} 08:00:00`, // 映射时间字段
			ars: point.address || point.ars || "暂无位置信息", // 映射位置字段
			altitude: 100 + index * 5, // 添加海拔信息
			gpsTime: point.time || point.gpsTime // GPS时间
		}));
		
		return this.successResponse({
			tracks: detailedTracks,
			vehicleInfo: {
				id: tracks.vehicleId,
				numberPlate: tracks.plateNumber,
				driver: matchedVehicle.driver
			}
		});
	}
}

export default new MockService()