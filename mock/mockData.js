// Mock测试数据 — 香港科技大学（广州）机器人管理系统
module.exports = {
	// 用户相关
	user: {
		userInfo: {
			id: 1,
			username: "testuser",
			realName: "测试用户",
			phone: "13800138000",
			email: "test@example.com",
			avatar: "/static/images/avatar.png",
			deptName: "技术部",
			roleName: "普通用户",
			userType: 1
		},
		token: "mock_token_123456789"
	},

	// 机器人相关 — 香港科技大学（广州）
	vehicles: [
		{
			id: 1,
			equipmentId: "1001",
			numberPlate: "JQR-001",
			plateNumber: "JQR-001",
			vehicleType: "轻量型",
			brand: "宇树",
			model: "Go2",
			status: "空闲",
			companyName: "行政部",
			location: "香港科技大学（广州）学术楼",
			driver: "张师傅",
			driverPhone: "13800138001",
			lat: 22.889043,
			lng: 113.484507,
			longitude: 113.484507,
			latitude: 22.889043,
			spd: 0,
			speed: 0,
			dre: 0,
			direction: 0,
			isOnline: 1,
			vehicleTaskStatus: 0,
			remark: "设备正常",
			updateTime: "2026-06-19 14:30:00"
		},
		{
			id: 2,
			equipmentId: "1002",
			numberPlate: "JQR-002",
			plateNumber: "JQR-002",
			vehicleType: "多功能型",
			brand: "优必选",
			model: "Walker X",
			status: "任务中",
			companyName: "学生事务处",
			location: "香港科技大学（广州）学生宿舍区",
			driver: "李师傅",
			driverPhone: "13800138002",
			lat: 22.8903,
			lng: 113.4855,
			longitude: 113.4855,
			latitude: 22.8903,
			spd: 25,
			speed: 25,
			dre: 45,
			direction: 45,
			isOnline: 1,
			vehicleTaskStatus: 1,
			remark: "迎新物资搬运中",
			updateTime: "2026-06-19 14:28:00"
		},
		{
			id: 3,
			equipmentId: "1003",
			numberPlate: "JQR-003",
			plateNumber: "JQR-003",
			vehicleType: "多功能型",
			brand: "达闼",
			model: "Cloud Ginger",
			status: "维修中",
			companyName: "图书馆",
			location: "香港科技大学（广州）图书馆",
			driver: "王师傅",
			driverPhone: "13800138003",
			lat: 22.8883,
			lng: 113.4858,
			longitude: 113.4858,
			latitude: 22.8883,
			spd: 0,
			speed: 0,
			dre: 0,
			direction: 0,
			isOnline: 0,
			vehicleTaskStatus: 0,
			remark: "电池更换中",
			updateTime: "2026-06-19 14:25:00"
		},
		{
			id: 4,
			equipmentId: "1004",
			numberPlate: "JQR-004",
			plateNumber: "JQR-004",
			vehicleType: "轻量型",
			brand: "小米",
			model: "CyberDog 2",
			status: "空闲",
			companyName: "体育部",
			location: "香港科技大学（广州）体育中心",
			driver: "赵师傅",
			driverPhone: "13800138004",
			lat: 22.8876,
			lng: 113.4835,
			longitude: 113.4835,
			latitude: 22.8876,
			spd: 0,
			speed: 0,
			dre: 180,
			direction: 180,
			isOnline: 1,
			vehicleTaskStatus: 0,
			remark: "待命中",
			updateTime: "2026-06-19 14:32:00"
		},
		{
			id: 5,
			equipmentId: "1005",
			numberPlate: "JQR-005",
			plateNumber: "JQR-005",
			vehicleType: "载重型",
			brand: "松灵",
			model: "Scout Mini",
			status: "离线",
			companyName: "校园管理处",
			location: "香港科技大学（广州）行政楼",
			driver: "钱师傅",
			driverPhone: "13800138005",
			lat: 22.8895,
			lng: 113.4860,
			longitude: 113.4860,
			latitude: 22.8895,
			spd: 0,
			speed: 0,
			dre: 270,
			direction: 270,
			isOnline: 0,
			vehicleTaskStatus: 0,
			remark: "设备离线",
			updateTime: "2026-06-19 13:45:00"
		}
	],

	// 用机器人申请（覆盖全部状态：待审批→已审批→已调度→已接单→已派遣→已完成→已驳回）
	vehicleApplications: [
		{
			id: 1,
			applyNo: "JQR20260619001",
			applicant: "陈小明",
			department: "行政部",
			phone: "13901001001",
			purpose: "实验室巡检",
			destination: "香港科技大学（广州）学术楼",
			startTime: "2026-06-20 08:00:00",
			endTime: "2026-06-20 12:00:00",
			passengerCount: 2,
			status: "待审批",
			createTime: "2026-06-19 09:00:00",
			remark: "周一例行实验室安全巡检"
		},
		{
			id: 2,
			applyNo: "JQR20260619002",
			applicant: "林小华",
			department: "学生事务处",
			phone: "13901001002",
			purpose: "迎新活动物资搬运",
			destination: "香港科技大学（广州）学生宿舍区",
			startTime: "2026-06-20 14:00:00",
			endTime: "2026-06-20 18:00:00",
			passengerCount: 3,
			status: "已审批",
			createTime: "2026-06-19 10:00:00",
			remark: "新生报到物资配送至各宿舍楼"
		},
		{
			id: 3,
			applyNo: "JQR20260619003",
			applicant: "黄教授",
			department: "技术部",
			phone: "13901001003",
			purpose: "科研设备转运",
			destination: "香港科技大学（广州）实验楼B栋",
			startTime: "2026-06-19 15:00:00",
			endTime: "2026-06-19 17:00:00",
			passengerCount: 1,
			status: "已调度",
			createTime: "2026-06-19 08:30:00",
			remark: "运送精密仪器至微纳实验室"
		},
		{
			id: 4,
			applyNo: "JQR20260619004",
			applicant: "赵同学",
			department: "体育部",
			phone: "13901001004",
			purpose: "校运会器材运送",
			destination: "香港科技大学（广州）体育中心",
			startTime: "2026-06-19 13:00:00",
			endTime: "2026-06-19 14:00:00",
			passengerCount: 2,
			status: "待派遣",
			createTime: "2026-06-19 07:00:00",
			remark: "篮球架、计时器等器材从仓库搬运至操场"
		},
		{
			id: 5,
			applyNo: "JQR20260619005",
			applicant: "王老师",
			department: "图书馆",
			phone: "13901001005",
			purpose: "图书批量搬运",
			destination: "香港科技大学（广州）图书馆新馆",
			startTime: "2026-06-19 09:00:00",
			endTime: "2026-06-19 11:00:00",
			passengerCount: 2,
			status: "待回收",
			createTime: "2026-06-18 16:00:00",
			remark: "旧馆3000册藏书搬迁至新馆三楼"
		},
		{
			id: 6,
			applyNo: "JQR20260618006",
			applicant: "周博士",
			department: "校园管理处",
			phone: "13901001006",
			purpose: "校园绿化维护",
			destination: "香港科技大学（广州）校园道路",
			startTime: "2026-06-18 06:00:00",
			endTime: "2026-06-18 08:00:00",
			passengerCount: 1,
			status: "已完成",
			createTime: "2026-06-17 18:00:00",
			remark: "校园主干道绿化带自动洒水作业"
		},
		{
			id: 7,
			applyNo: "JQR20260618007",
			applicant: "刘同学",
			department: "学生事务处",
			phone: "13901001007",
			purpose: "社团活动器材运输",
			destination: "香港科技大学（广州）学生活动中心",
			startTime: "2026-06-18 18:00:00",
			endTime: "2026-06-18 20:00:00",
			passengerCount: 1,
			status: "已驳回",
			createTime: "2026-06-18 12:00:00",
			remark: "申请理由不充分，需补充活动审批文件"
		},
		{
			id: 8,
			applyNo: "JQR20260619008",
			applicant: "吴经理",
			department: "行政部",
			phone: "13901001008",
			purpose: "校外来宾参观接待",
			destination: "香港科技大学（广州）学术楼至行政楼",
			startTime: "2026-06-21 09:30:00",
			endTime: "2026-06-21 11:30:00",
			passengerCount: 1,
			status: "待审批",
			createTime: "2026-06-19 11:00:00",
			remark: "教育部领导来访校园参观引导"
		},
		{
			id: 9,
			applyNo: "JQR20260619009",
			applicant: "郑老师",
			department: "技术部",
			phone: "13901001009",
			purpose: "机器人协同实验",
			destination: "香港科技大学（广州）机器人研究中心",
			startTime: "2026-06-20 10:00:00",
			endTime: "2026-06-20 16:00:00",
			passengerCount: 3,
			status: "待审批",
			createTime: "2026-06-19 13:00:00",
			remark: "多机器人协同SLAM导航实验"
		},
		{
			id: 10,
			applyNo: "JQR20260619010",
			applicant: "钱工",
			department: "校园管理处",
			phone: "13901001010",
			purpose: "校园路灯检修",
			destination: "香港科技大学（广州）全校道路",
			startTime: "2026-06-19 20:00:00",
			endTime: "2026-06-20 02:00:00",
			passengerCount: 1,
			status: "已审批",
			createTime: "2026-06-19 14:00:00",
			remark: "夜间校园照明设施全面巡检"
		},
		{
			id: 11,
			applyNo: "JQR20260618011",
			applicant: "孙同学",
			department: "体育部",
			phone: "13901001011",
			purpose: "篮球比赛器材撤回",
			destination: "香港科技大学（广州）体育中心仓库",
			startTime: "2026-06-18 20:00:00",
			endTime: "2026-06-18 21:00:00",
			passengerCount: 1,
			status: "待接单",
			createTime: "2026-06-18 18:00:00",
			remark: "校际篮球赛结束后器材归还仓库"
		},
		{
			id: 12,
			applyNo: "JQR20260617012",
			applicant: "马老师",
			department: "行政部",
			phone: "13901001012",
			purpose: "校外学术会议接送",
			destination: "广州南沙大酒店",
			startTime: "2026-06-17 08:00:00",
			endTime: "2026-06-17 17:00:00",
			passengerCount: 2,
			status: "已撤销",
			createTime: "2026-06-16 10:00:00",
			remark: "会议取消，申请已撤回"
		}
	],

	// 维修申请
	repairApplications: [
		{
			id: 1,
			repairNo: "WX20260619001",
			plateNumber: "JQR-001",
			applicant: "张师傅",
			phone: "13800138001",
			faultDescription: "机械臂关节电机异响",
			urgencyLevel: "紧急",
			status: "待审批",
			createTime: "2026-06-19 09:00:00",
			estimatedCost: 3500,
			repairShop: "",
			remark: "巡检中发现左臂第三关节转动时有异响"
		},
		{
			id: 2,
			repairNo: "WX20260619002",
			plateNumber: "JQR-002",
			applicant: "李师傅",
			phone: "13800138002",
			faultDescription: "底盘履带磨损严重",
			urgencyLevel: "一般",
			status: "维修中",
			createTime: "2026-06-18 15:30:00",
			estimatedCost: 1800,
			repairShop: "南沙机器人维保中心",
			remark: "需更换左右两侧履带"
		},
		{
			id: 3,
			repairNo: "WX20260619003",
			plateNumber: "JQR-004",
			applicant: "赵师傅",
			phone: "13800138004",
			faultDescription: "LiDAR传感器数据漂移",
			urgencyLevel: "高",
			status: "已审批",
			createTime: "2026-06-19 10:00:00",
			estimatedCost: 2500,
			repairShop: "广州南沙机器人科技公司",
			remark: "定位精度下降约30%，需校准或更换LiDAR模块"
		},
		{
			id: 4,
			repairNo: "WX20260617004",
			plateNumber: "JQR-003",
			applicant: "王师傅",
			phone: "13800138003",
			faultDescription: "电池续航骤降",
			urgencyLevel: "紧急",
			status: "已完成",
			createTime: "2026-06-17 08:00:00",
			estimatedCost: 4200,
			repairShop: "南沙机器人维保中心",
			remark: "锂电池组老化，已更换全新电池组，续航恢复至8小时"
		}
	],

	// 任务列表
	tasks: [
		{
			id: 1,
			taskNo: "RW20260619001",
			taskType: "用机器人审批",
			title: "陈小明的实验室巡检申请待审批",
			content: "申请2台轻量型机器人进行周一例行实验室安全巡检",
			status: "待处理",
			priority: "高",
			createTime: "2026-06-19 09:00:00",
			deadline: "2026-06-19 18:00:00",
			relatedId: 1
		},
		{
			id: 2,
			taskNo: "RW20260619002",
			taskType: "维修审批",
			title: "JQR-001机械臂关节维修待审批",
			content: "左臂第三关节异响需紧急维修",
			status: "待处理",
			priority: "紧急",
			createTime: "2026-06-19 09:00:00",
			deadline: "2026-06-19 17:00:00",
			relatedId: 1
		},
		{
			id: 3,
			taskNo: "RW20260619003",
			taskType: "调度任务",
			title: "黄教授的科研设备转运需调度",
			content: "已审批通过，需调度多功能型机器人运送精密仪器至微纳实验室",
			status: "处理中",
			priority: "高",
			createTime: "2026-06-19 08:30:00",
			deadline: "2026-06-19 15:00:00",
			relatedId: 3
		},
		{
			id: 4,
			taskNo: "RW20260619004",
			taskType: "用机器人审批",
			title: "吴经理的来宾接待申请待审批",
			content: "教育部领导来访校园参观需用机器人引导",
			status: "待处理",
			priority: "高",
			createTime: "2026-06-19 11:00:00",
			deadline: "2026-06-19 17:00:00",
			relatedId: 8
		},
		{
			id: 5,
			taskNo: "RW20260619005",
			taskType: "用机器人审批",
			title: "郑老师的机器人协同实验申请待审批",
			content: "多机器人协同SLAM实验需用3台载重型机器人",
			status: "待处理",
			priority: "一般",
			createTime: "2026-06-19 13:00:00",
			deadline: "2026-06-20 10:00:00",
			relatedId: 9
		},
		{
			id: 6,
			taskNo: "RW20260619006",
			taskType: "派遣回收",
			title: "王老师的图书搬运已派遣待回收",
			content: "JQR-001已派遣至图书馆执行3000册图书搬迁任务",
			status: "待回收",
			priority: "一般",
			createTime: "2026-06-19 09:00:00",
			deadline: "2026-06-19 11:00:00",
			relatedId: 5
		},
		{
			id: 7,
			taskNo: "RW20260619007",
			taskType: "维修审批",
			title: "JQR-004 LiDAR传感器数据漂移待处理",
			content: "定位精度下降约30%需校准或更换LiDAR模块",
			status: "待处理",
			priority: "高",
			createTime: "2026-06-19 10:00:00",
			deadline: "2026-06-20 10:00:00",
			relatedId: 3
		},
		{
			id: 8,
			taskNo: "RW20260619008",
			taskType: "调度任务",
			title: "林小华的迎新物资搬运需调度",
			content: "已审批通过，需安排2台载重型机器人配送新生报到物资至各宿舍楼",
			status: "处理中",
			priority: "高",
			createTime: "2026-06-19 10:00:00",
			deadline: "2026-06-20 14:00:00",
			relatedId: 2
		},
		{
			id: 9,
			taskNo: "RW20260618009",
			taskType: "派遣任务",
			title: "孙同学的篮球器材撤回待派遣",
			content: "校际篮球赛结束后需机器人将器材归还仓库",
			status: "待派遣",
			priority: "一般",
			createTime: "2026-06-18 18:00:00",
			deadline: "2026-06-18 21:00:00",
			relatedId: 11
		},
		{
			id: 10,
			taskNo: "RW20260617010",
			taskType: "用机器人审批",
			title: "马老师的学术会议接送申请已撤销",
			content: "校外学术会议已取消，用机器人申请同步撤销",
			status: "已撤销",
			priority: "一般",
			createTime: "2026-06-16 10:00:00",
			deadline: "2026-06-17 08:00:00",
			relatedId: 12
		}
	],

	// 驾驶员列表
	drivers: [
		{
			id: 1,
			name: "张师傅",
			phone: "13800138001",
			licenseType: "C1",
			experience: 10,
			status: "空闲",
			currentVehicle: "",
			companyName: "行政部"
		},
		{
			id: 2,
			name: "李师傅",
			phone: "13800138002",
			licenseType: "B2",
			experience: 15,
			status: "使用中",
			currentVehicle: "JQR-002",
			companyName: "学生事务处"
		},
		{
			id: 3,
			name: "王师傅",
			phone: "13800138003",
			licenseType: "A2",
			experience: 8,
			status: "空闲",
			currentVehicle: "",
			companyName: "图书馆"
		}
	],

	// 轨迹数据 — 香港科技大学（广州）校内行驶
	trajectories: [
		{
			vehicleId: 1,
			plateNumber: "JQR-001",
			date: "2026-06-19",
			tracks: [
				{
					lat: 22.889043,
					lng: 113.484507,
					speed: 0,
					direction: 0,
					time: "09:00:00",
					address: "香港科技大学（广州）学术楼"
				},
				{
					lat: 22.8893,
					lng: 113.4848,
					speed: 20,
					direction: 45,
					time: "09:05:00",
					address: "香港科技大学（广州）校内道路"
				},
				{
					lat: 22.8888,
					lng: 113.4855,
					speed: 25,
					direction: 120,
					time: "09:10:00",
					address: "香港科技大学（广州）图书馆附近"
				},
				{
					lat: 22.8883,
					lng: 113.4858,
					speed: 0,
					direction: 0,
					time: "09:15:00",
					address: "香港科技大学（广州）图书馆"
				}
			]
		}
	],

	// 组织架构
	orgTree: [
		{
			id: 1,
			name: "香港科技大学（广州）",
			children: [
				{
					id: 2,
					name: "行政部",
					children: []
				},
				{
					id: 3,
					name: "学生事务处",
					children: [
						{
							id: 4,
							name: "宿舍管理组",
							children: []
						},
						{
							id: 5,
							name: "学生活动组",
							children: []
						}
					]
				},
				{
					id: 6,
					name: "图书馆",
					children: []
				},
				{
					id: 7,
					name: "体育部",
					children: []
				},
				{
					id: 8,
					name: "校园管理处",
					children: []
				}
			]
		}
	]
}
