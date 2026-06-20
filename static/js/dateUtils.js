module.exports = {
	//是否是今天
	isToday(dateStr){
		var date = new Date(dateStr);
		var today = new Date();
		today.setHours(0, 0, 0, 0);
		date.setHours(0, 0, 0, 0);
		return date.getTime() === today.getTime()
	},
	//获取日期
	getDateStr(date = new Date()){
		return date.getFullYear() + "-" + String(date.getMonth() + 1).padStart(2, '0') + "-" + String(date.getDate()).padStart(2, '0')
	},
	//获取时间
	getTimeStr(date = new Date()){
		return date.getHours().padStart(2, '0') + ":" +  String(date.getMinutes()).padStart(2, '0') + ":" +  String(date.getSeconds()).padStart(2, '0')
	},
	//获取日期时间
	getDateTimeStr(date = new Date()){
		return date.getFullYear() + "-" + String(date.getMonth() + 1).padStart(2, '0') + "-" + String(date.getDate()).padStart(2, '0') 
		+ " " +  String(date.getHours()).padStart(2, '0') + ":" +  String(date.getMinutes()).padStart(2, '0') + ":" +  String(date.getSeconds()).padStart(2, '0')
	},
	//获取星期几
	getWeek(dateStr, prefix = "星期"){
		var date = new Date(dateStr);
		var daysOfWeek = ['日', '一', '二', '三', '四', '五', '六'];
		return prefix + daysOfWeek[date.getDay()];
	},
	//获取是不是今日、昨日、明日
	getRelativeDay(dateStr) {
	    // 将输入的字符串转换为Date对象
	    var date = new Date(dateStr);
	    // 获取当前日期
	    var today = new Date();
	    // 清除时间部分，只保留日期
	    today.setHours(0, 0, 0, 0);
	    date.setHours(0, 0, 0, 0);
	    // 计算昨天和明天的日期
	    var yesterday = new Date(today);
	    yesterday.setDate(yesterday.getDate() - 1);
	    var tomorrow = new Date(today);
	    tomorrow.setDate(tomorrow.getDate() + 1);
	    // 比较日期
	    if (date.getTime() === today.getTime()) {
	        return '今天';
	    } else if (date.getTime() === yesterday.getTime()) {
	        return '昨天';
	    } else if (date.getTime() === tomorrow.getTime()) {
	        return '明天';
	    }
		return ''
	},
	getDayCount(startDateStr, endDateStr = null){
		// 将输入的字符串转换为Date对象
		var startDate = new Date(startDateStr);
		var endDate = endDateStr ? new Date(endDateStr) : new Date();
		// 计算毫秒差
		var diffMs = Math.abs(endDate - startDate);
		// 转换为天数
		var diffDays = Math.ceil((diffMs + 1) / (1000 * 60 * 60 * 24));
		return diffDays;
	},
	formatHMS(milliseconds) {
		let seconds = milliseconds / 1000
	    const pad = (num, size) => num.toString().padStart(size, '0');
	    const hours = Math.floor(seconds / 3600);
	    const minutes = Math.floor((seconds % 3600) / 60);
	    const remainingSeconds = seconds % 60;
	    return `${pad(hours, 2)}:${pad(minutes, 2)}:${pad(remainingSeconds, 2)}`;
	},
	formatYMDHMS(date = new Date()) {
		let year = date.getFullYear();
		let month = ("0" + (date.getMonth() + 1)).slice(-2);
		let day = ("0" + date.getDate()).slice(-2);
		let hours = ("0" + date.getHours()).slice(-2);
		let minutes = ("0" + date.getMinutes()).slice(-2);
		let seconds = ("0" + date.getSeconds()).slice(-2);
		return `${year}${month}${day}${hours}${minutes}${seconds}`;
	}
}