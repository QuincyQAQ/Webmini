module.exports = {
	//用户类型
	USER_TYPE_SYS: 0,//系统用户
	USER_TYPE_MOBILE: 1,//移动端用户
	USER_TYPE_DRIVER: 2,//驾驶员
	USER_TYPE_ADMIN: 3,//管理员
	//订单状态
	ORDER_STATUS_APPLY: 0, //已申请（待审批）
	ORDER_STATUS_APPROVAL: 1, //已审批（待调度）
	ORDER_STATUS_SCHEDULING: 2, //已调度（待接单）
	ORDER_STATUS_TAKE: 3, //已接单（待派遣）
	ORDER_STATUS_SEND_CAR: 4, //已派遣（充电中）
	ORDER_STATUS_RETURN_CAR: 5, //已回收（完成）
	ORDER_STATUS_CANCEL: 6, //撤销订单
	ORDER_STATUS_REJECTED: 7, //已驳回
	//审批状态
	APPROVAL_PASS: 0, //审批通过
	APPROVAL_REJECT: 1, //审批拒绝
	//搜索类型
	SEARCH_VEHICLE: 0, //搜索机器人
	SEARCH_DRIVER: 1, //搜索驾驶员
	//机器人状态
	VEHICLE_ORDER_STATUS_FREE: 0, //空闲
	VEHICLE_ORDER_STATUS_TASKING: 1, //任务中
	VEHICLE_ORDER_STATUS_ONLINE: 2, //在线
	VEHICLE_ORDER_STATUS_OFFLINE: 3, //离线
	//任务状态
	TASK_STATUS_FREE: 0, //空闲
	TASK_STATUS_TASKING: 1, //任务中
	//维修原因
	REPAIR_REASON_BUTAI: 0, //轮胎补修
	REPAIR_REASON_BUQI: 1, //剐蹭补漆
	REPAIR_REASON_DAXIU: 2, //事故大修
	REPAIR_REASON_BOLI: 3, //玻璃破碎
	REPAIR_REASON_OTHER: 4, //其他原因
	//维修状态
	REPAIR_STATUS_APPLY: 0, //已申请（待审批）
	REPAIR_STATUS_APPROVAL: 1, //已审批（待送修）
	REPAIR_STATUS_FIXING: 2, //已送修（待完成）
	REPAIR_STATUS_FINISH: 3, //已完成
	REPAIR_STATUS_CANCEL: 4, //已撤销
	REPAIR_STATUS_REJECTED: 5, //已驳回
	getOnlineStatusColor(model, statusIndex = 0){
		if(statusIndex == 0 || statusIndex == 1){
			//在线状态
			return model.isOnline > 0 ? "#52C132" : "#999999"
		}else if(statusIndex == 2 || statusIndex == 3){
			//任务状态
			return model.vehicleTaskStatus == this.constant.TASK_STATUS_TASKING ? '#327EEF' : '#EAB446' 
		}
		return ''
	},
	getPurposeName(code, def = ''){
		let data = {0:"设备巡检",1:"管道检查",2:"仪表读数",3:"隐患排查",4:"环境监测",5:"资产盘点"}
		return data[code] || def
	},
	getOrderStatusText(code){
		let data = {0:"待审批",1:"待调度",2:"待接单",3:"待派遣",4:"充电中",5:"已完成",6:"已撤销",7:"已驳回"}
		return data[code]
	},
	getOrderStatusColor(code){
		let data = {0:"#EBA52B",1:"#EBA52B",2:"#EBA52B",3:"#2F7FF0",4:"#2F7FF0",5:"#52C132",6:"#FA3B30",7:"#FA3B30"}
		return data[code]
	},
	getRepairReasonList(){
		return [
			{
				id: 0,
				name: '电机故障'
			},
			{
				id: 1,
				name: '传送带磨损'
			},
			{
				id: 2,
				name: '液压漏油'
			},
			{
				id: 3,
				name: '传感器失灵'
			},
			{
				id: 4,
				name: '机械臂校准'
			}
		]
	},
	getRepairReasonText(code){
		let data = {0:"电机故障",1:"传送带磨损",2:"液压漏油",3:"传感器失灵",4:"机械臂校准",5:"其他"}
		return data[code]
	},
	getRepairStatusText(code){
		let data = {0:"待审批",1:"待送修",2:"待完成",3:"已完成",4:"已撤销",5:"已驳回"}
		return data[code]
	},
	getRepairStatusColor(code){
		let data = {0:"#EBA52B",1:"#EBA52B",2:"#2F7FF0",3:"#2F7FF0",4:"#FA3B30",5:"#FA3B30"}
		return data[code]
	},
}