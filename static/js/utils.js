import CryptoJS from 'crypto-js';
import api from '@/network/api';
import apiUrl from '@/network/apiUrl'
import dateUtils from '@/static/js/dateUtils';

module.exports = {
	isEmpty(str){
		return str == undefined || str == null || str == ""
	},
	isEmptyObject(obj) {  
	    return obj && Object.keys(obj).length === 0 && obj.constructor === Object;  
	},
	//AES对称加密-加密方法
	encryptByAES: (word) => {
	  // 默认的 KEY 与 iv 如果没有给
	  const key = CryptoJS.enc.Utf8.parse("tHisidddEY12568d")
	  const iv = CryptoJS.enc.Utf8.parse('')
	  const srcs = CryptoJS.enc.Utf8.parse(word)
	  const encrypted = CryptoJS.AES.encrypt(srcs, key, {
	    iv: iv,
	    mode: CryptoJS.mode.CBC,
	    padding: CryptoJS.pad.Pkcs7
	  })
	  return encrypted.ciphertext.toString().toUpperCase();
	},
	//获取Url上的参数
	getUrlParam(key){
		var result = {}
		var href = window.location.href.replace("#/", "")
		if(href.indexOf("?") > -1){
			var params = href.split("?")[1].split("&")
			params.forEach(item => {
				var arr = item.split("=")
				result[arr[0]] = arr[1]
			})
		}
		return key ? result[key] : result
	},
	//计算两个经纬度的直线距离
	computeDistance(lat1, lon1, lat2, lon2) {
	    const R = 6371; // 地球半径，单位为公里
	    const dLat = (lat2 - lat1) * Math.PI / 180;
	    const dLon = (lon2 - lon1) * Math.PI / 180;
	    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
	              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
	              Math.sin(dLon/2) * Math.sin(dLon/2);
	    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
	    const distance = R * c;
	    return distance;
	},
	//创建MarkerId
	getDeviceMarkerId(device){
		var hash = CryptoJS.MD5(device.equipmentId + device.dvo).toString()
		const hashId = parseInt(hash, 16) % 100000000
		return {
			statusMarkerId: parseInt("1" + hashId),
			avatarMarkerId: parseInt("2" + hashId)
		}
	},
	/**
	 * 图片裁剪成圆形
	 * @param {Object} file
	 * @param {Object} callback
	 */
	imageCircle(file, callback){
		const reader = new FileReader();
		reader.onload = (e) => {
			const image = new Image();
			image.src = e.target.result;
			image.onload = () => {
				const diameter = Math.min(image.width, image.height);
				const canvas = document.createElement('canvas');
				canvas.width = diameter;
				canvas.height = diameter;
				const ctx = canvas.getContext('2d');

				// 清空 canvas 为透明
				ctx.clearRect(0, 0, canvas.width, canvas.height);

				// 绘制圆形
				ctx.beginPath();
				ctx.arc(diameter / 2, diameter / 2, diameter / 2, 0, Math.PI * 2);
				ctx.closePath();
				ctx.clip();
				ctx.drawImage(image, (image.width - diameter) / 2, (image.height - diameter) / 2, diameter, diameter, 0, 0, diameter, diameter);
				
				// 将圆形图像导出
				canvas.toBlob((blob) => {
				  callback(blob)
				}, 'image/png', 1);
			};
		};
		reader.readAsDataURL(file);
	},
	/**
	 * 图片压缩
	 * @param {Object} blob
	 * @param {Object} maxKB
	 * @param {Object} callback
	 */
	imageCompress(blob, maxKB, callback){
		const maxSize = maxKB * 1024;
		const image = new Image();
		image.src = URL.createObjectURL(blob);
		image.onload = () => {
		  const canvas = document.createElement('canvas');
		  const ctx = canvas.getContext('2d');
		  const scaleFactor = Math.sqrt(maxSize / blob.size);
		  canvas.width = image.width * scaleFactor;
		  canvas.height = image.height * scaleFactor;
		  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
		  canvas.toBlob((compressedBlob) => {
			callback(compressedBlob)
		  }, 'image/png', 0.8);
		};
	},
	formatWeekText(week){
		var arr = week.split(",")
		if(arr.length == 7){
			return "周一至周日"
		}
		var text = ''
		arr.forEach((item, index) => {
			if(item == '1'){
				text += '周一'
			}else if(item == '2'){
				text += '周二'
			}else if(item == '3'){
				text += '周三'
			}else if(item == '4'){
				text += '周四'
			}else if(item == '5'){
				text += '周五'
			}else if(item == '6'){
				text += '周六'
			}else if(item == '7'){
				text += '周日'
			}
			if(index < arr.length - 1){
				text += ","
			}
		})
		return text
	},
	/**
	 * 经纬度转度分格式
	 */
	latLngToDMS(decimal, isLat) {  
	    const degrees = Math.floor(Math.abs(decimal));  
	    const minutes = Math.floor((Math.abs(decimal) - degrees) * 60);  
	    const seconds = ((Math.abs(decimal) - degrees - minutes / 60) * 3600).toFixed(4);  
	    const direction = isLat ? 'N' : 'E'; // 纬度用N（北）或S（南），经度用E（东）或W（西）  
	    return `${degrees}°${minutes.toString().padStart(2, '0')}′${seconds.toString().padStart(6, '0')}″${direction}`;  
	},
	/**
	 * ArrayBuffer转字符串
	 * @param {ArrayBuffer} buffer
	 */
	arrayBufferToStr(buffer) {
		const hexArr = Array.prototype.map.call(
			new Uint8Array(buffer),
			function(bit) {
				return ('00' + bit.toString(16)).slice(-2)
			}
		)
		// 将十六进制字符串分割成每两个字符一组，并转换为对应的十进制数值
		const hexArray = hexArr.map(hex => parseInt(hex, 16));
		// 使用 String.fromCharCode 方法将十进制数值转换为对应的 ASCII 字符
		const asciiString = String.fromCharCode(...hexArray);
		return asciiString
	},
	/**
	 * 字符串转ArrayBuffer
	 * @param {String} str
	 */
	strToArrayBuffer(str) {
		const buffer = new ArrayBuffer(str.length);
		// 创建一个 DataView 对象，关联到新创建的 ArrayBuffer
		const dataView = new DataView(buffer);
		// 将字符串的每个字符的 ASCII 值写入到 ArrayBuffer 中
		for (let i = 0; i < str.length; i++) {
			dataView.setUint8(i, str.charCodeAt(i));
		}
		return buffer
	},
	/**
	 * 打开第三方地图
	 */
	openMapApp(data){
		let appList = []
		if(plus.runtime.isApplicationExist({ pname: 'com.baidu.BaiduMap' })){
			appList.push({
				name: '百度地图',
				packageName: 'com.baidu.BaiduMap',
				url: `baidumap://map/direction?destination=name:${data.name}|latlng:${data.latitude},${data.longitude}&coord_type=gcj02&mode=driving`
			})
		}
		if(plus.runtime.isApplicationExist({ pname: 'com.autonavi.minimap' })){
			appList.push({
				name: '高德地图',
				packageName: 'com.autonavi.minimap',
				url: `amapuri://route/plan/?sid=&did=&dlat=${data.latitude}&dlon=${data.longitude}&dname=${data.name}&dev=0&t=0`
			})
		}
		if(plus.runtime.isApplicationExist({ pname: 'com.tencent.map' })){
			appList.push({
				name: '腾讯地图',
				packageName: 'com.tencent.map',
				url: `qqmap://map/routeplan?type=drive&to=${data.name}&tocoord=${data.latitude},${data.longitude}`,
			})
		}
		if(appList.length == 0){
			uni.showToast({
				title: "您的手机未安装地图应用，暂不支持一键导航",
				icon: "none"
			})
			return
		}
		uni.showActionSheet({
			itemList: appList.map(i => i.name),
			success(res) {
				let app = appList[res.tapIndex]
				plus.runtime.openURL(app.url, function(res) {
					console.log(res);
				}, app.packageName)
			}
		})
	},
	formCheck(value, rule){
		var checkPass = true
		var errMsg = ''
		rule.forEach(item => {
			if(!item.type){ 
				//非空判断
				checkPass = !uni.$u.test.isEmpty(value)
			}else if(item.type == 'mobile'){
				//是否手机号
				checkPass = uni.$u.test.mobile(value)
			}else if(item.type == 'idCard'){
				//是否身份证号
				// checkPass = uni.$u.test.idCard(value)
				let regex = /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
				checkPass = regex.test(value)
			}else if(item.type == 'rangeLength'){
				//字符串长度是否在某个范围内
				checkPass = uni.$u.test.rangeLength(value, item.range);
			}
			if(!checkPass){
				errMsg = item.msg
				return
			}
		})
		if(!checkPass){
			uni.showToast({
				title: errMsg,
				icon: 'none'
			})
		}
		return checkPass
	}
}