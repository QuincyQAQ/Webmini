// Mock数据生成器
class MockGenerator {
	constructor() {
		this.plateNumbers = ['粤A', '粤B', '粤C', '粤D', '粤E', '粤F', '粤G', '粤H', '粤J', '粤K']
		this.vehicleTypes = ['轻量型', 'SUV', '多功能型', '载重型', '货车']
		this.brands = ['丰田', '本田', '大众', '奔驰', '宝马', '奥迪', '别克', '福特', '现代', '起亚']
		this.models = ['凯美瑞', 'CR-V', '帕萨特', 'C级', '3系', 'A4L', 'GL8', '蒙迪欧', '途胜', 'K5']
		this.statuses = ['空闲', '使用中', '维修中', '保养中']
		this.locations = ['深圳市南山区', '深圳市福田区', '深圳市罗湖区', '深圳市宝安区', '深圳市龙岗区']
		this.driverNames = ['张师傅', '李师傅', '王师傅', '刘师傅', '陈师傅', '杨师傅', '赵师傅', '孙师傅']
		this.departments = ['行政部', '销售部', '技术部', '财务部', '人事部', '市场部']
		this.purposes = ['出差办事', '客户拜访', '会议接送', '机场接送', '商务洽谈', '培训学习']
	}

	// 生成随机数
	random(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min
	}

	// 随机选择数组元素
	randomChoice(arr) {
		return arr[this.random(0, arr.length - 1)]
	}

	// 生成随机机器人编号
	generatePlateNumber() {
		const prefix = this.randomChoice(this.plateNumbers)
		const suffix = String(this.random(10000, 99999))
		return prefix + suffix
	}

	// 生成随机手机号
	generatePhone() {
		const prefixes = ['138', '139', '150', '151', '152', '188', '189']
		const prefix = this.randomChoice(prefixes)
		const suffix = String(this.random(10000000, 99999999))
		return prefix + suffix
	}

	// 生成随机日期时间
	generateDateTime(daysOffset = 0) {
		const date = new Date()
		date.setDate(date.getDate() + daysOffset)
		date.setHours(this.random(8, 18))
		date.setMinutes(this.random(0, 59))
		return date.toLocaleString()
	}

	// 生成随机坐标（深圳范围内）
	generateCoordinate() {
		return {
			lat: 22.5 + Math.random() * 0.1,
			lng: 113.9 + Math.random() * 0.2
		}
	}

	// 生成机器人数据
	generateVehicle(id) {
		const coord = this.generateCoordinate()
		return {
			id: id,
			plateNumber: this.generatePlateNumber(),
			vehicleType: this.randomChoice(this.vehicleTypes),
			brand: this.randomChoice(this.brands),
			model: this.randomChoice(this.models),
			status: this.randomChoice(this.statuses),
			location: this.randomChoice(this.locations),
			driver: this.randomChoice(this.driverNames),
			driverPhone: this.generatePhone(),
			lat: coord.lat,
			lng: coord.lng,
			speed: this.random(0, 60),
			direction: this.random(0, 360),
			updateTime: this.generateDateTime()
		}
	}

	// 生成用机器人申请数据
	generateVehicleApplication(id) {
		const startDate = this.random(-5, 5)
		const endDate = startDate + this.random(0, 2)
		
		return {
			id: id,
			applyNo: `YC${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(new Date().getDate()).padStart(2, '0')}${String(id).padStart(4, '0')}`,
			applicant: this.randomChoice(this.driverNames).replace('师傅', ''),
			department: this.randomChoice(this.departments),
			phone: this.generatePhone(),
			purpose: this.randomChoice(this.purposes),
			destination: this.randomChoice(this.locations),
			startTime: this.generateDateTime(startDate),
			endTime: this.generateDateTime(endDate),
			passengerCount: this.random(1, 5),
			status: this.randomChoice(['待审批', '已审批', '已拒绝', '使用中', '已完成']),
			createTime: this.generateDateTime(-this.random(1, 10)),
			remark: this.random(1, 3) === 1 ? '紧急用机器人' : ''
		}
	}

	// 生成维修申请数据
	generateRepairApplication(id) {
		const faults = ['发动机异响', '刹车片磨损', '轮胎磨损', '空调故障', '电瓶老化', '变速箱故障']
		const urgencyLevels = ['紧急', '重要', '一般']
		
		return {
			id: id,
			repairNo: `WX${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(new Date().getDate()).padStart(2, '0')}${String(id).padStart(4, '0')}`,
			plateNumber: this.generatePlateNumber(),
			applicant: this.randomChoice(this.driverNames),
			phone: this.generatePhone(),
			faultDescription: this.randomChoice(faults),
			urgencyLevel: this.randomChoice(urgencyLevels),
			status: this.randomChoice(['待审批', '已审批', '维修中', '已完成']),
			createTime: this.generateDateTime(-this.random(1, 15)),
			estimatedCost: this.random(500, 5000),
			repairShop: this.random(1, 2) === 1 ? 'XX汽修厂' : '',
			remark: this.random(1, 3) === 1 ? '需要紧急处理' : ''
		}
	}

	// 生成驾驶员数据
	generateDriver(id) {
		const licenseTypes = ['C1', 'C2', 'B1', 'B2', 'A1', 'A2']
		const statuses = ['空闲', '使用中', '休假']
		
		return {
			id: id,
			name: this.randomChoice(this.driverNames),
			phone: this.generatePhone(),
			licenseType: this.randomChoice(licenseTypes),
			experience: this.random(3, 20),
			status: this.randomChoice(statuses),
			currentVehicle: this.random(1, 3) === 1 ? this.generatePlateNumber() : ''
		}
	}

	// 生成任务数据
	generateTask(id) {
		const taskTypes = ['用机器人审批', '维修审批', '调度任务', '检查任务']
		const priorities = ['高', '中', '低']
		const statuses = ['待处理', '处理中', '已完成']
		
		return {
			id: id,
			taskNo: `RW${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(new Date().getDate()).padStart(2, '0')}${String(id).padStart(4, '0')}`,
			taskType: this.randomChoice(taskTypes),
			title: `${this.randomChoice(taskTypes)}任务`,
			content: '任务详细内容描述',
			status: this.randomChoice(statuses),
			priority: this.randomChoice(priorities),
			createTime: this.generateDateTime(-this.random(1, 7)),
			deadline: this.generateDateTime(this.random(1, 3)),
			relatedId: id
		}
	}

	// 批量生成数据
	generateBatchData(type, count) {
		const data = []
		for (let i = 1; i <= count; i++) {
			switch (type) {
				case 'vehicle':
					data.push(this.generateVehicle(i))
					break
				case 'application':
					data.push(this.generateVehicleApplication(i))
					break
				case 'repair':
					data.push(this.generateRepairApplication(i))
					break
				case 'driver':
					data.push(this.generateDriver(i))
					break
				case 'task':
					data.push(this.generateTask(i))
					break
			}
		}
		return data
	}
}

export default new MockGenerator()