import config from '@/config/config'

module.exports = {
	baseUrl: config.baseUrl,
	login: config.baseUrl + '/app/login', //账号密码登录
	modifyPwd: config.baseUrl + '/app/modifyPassword', //修改密码
	avatarUpload: config.baseUrl + '/app/user/upload', //头像上传
	userInfoGet: config.baseUrl + '/app/user/getUserMsg', //用户信息
	userInfoSave: config.baseUrl + '/app/user/editUser', //用户信息保存
	oneKeyLogin: config.baseUrl + '/app/user/WXregAndlogin', //微信一键登录
	mapData: config.baseUrl + '/app/realtimePositioning/queryGpsList', //地图数据
	orgData: config.baseUrl + '/app/realtimePositioning/dataTree', //组织架构
	mapSearch: config.baseUrl + '/app/realtimePositioning/searchVehicle', //机器人搜索
	vehicleList: config.baseUrl + '/app/realtimePositioning/queryVehicleList', //机器人列表
	vehicleApplyList: config.baseUrl + '/app/vehicleApplication/vehicleApplyList', //用机器人申请列表
	vehicleApplyGet: config.baseUrl + '/app/vehicleApplication/getVehicleApplyInfoByApplyId', //用机器人申请详情
	vehicleApplySave: config.baseUrl + '/app/vehicleApplication/saveVehicleApply', //用机器人申请/补单
	vehicleApplyUpdate: config.baseUrl + '/app/vehicleApplication/updateVehicleApply', //更新用机器人申请
	vehicleApplyUpload: config.baseUrl + '/app/vehicleApplication/uploadVoucher', //用机器人申请上传图片
	dispatchGet: config.baseUrl + '/app/vehicleApplication/getDispatchVehiclesByApplyId', //调度机器人信息
	approvalApply: config.baseUrl + '/app/vehicleApplication/saveApprovalApply', //用机器人审批
	searchVehicleList: config.baseUrl + '/app/vehicleApplication/getVehicleSelectList', //搜索机器人列表
	searchDriverList: config.baseUrl + '/app/vehicleApplication/getDriverByCompanyId', //搜索驾驶员列表
	dispatchVehicle: config.baseUrl + '/app/vehicleApplication/saveDispatchVehicles', //调度机器人
	dispatchVehicleAdjust: config.baseUrl + '/app/vehicleApplication/updateDispatchVehicles', //调度转派机器人
	dispatchVehicleList: config.baseUrl + '/app/vehicleApplication/getDispatchVehiclesByApplyId', //调度机器人列表
	repairList: config.baseUrl + '/app/repairManagement/repairApplyList', //维修列表
	repairSave: config.baseUrl + '/app/repairManagement/saveRepairApply', //添加维修
	repairGet: config.baseUrl + '/app/repairManagement/getRepairApplyByRepairId', //维修详情
	repairUpdate: config.baseUrl + '/app/repairManagement/updateRepairApply', //更新维修
	repairApproval: config.baseUrl + '/app/repairManagement/saveRepairApproval', //维修审批
	trajectoryList: config.baseUrl + '/app/realtimePositioning/getVehicleHisSegmentTracksAPP', //轨迹查询
	trajectoryDetail: config.baseUrl + '/app/realtimePositioning/getVehicleHisTracksDetail', //轨迹详情
}
