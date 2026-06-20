import config from '@/config/config'
import mockService from '@/mock/mockService.js'

module.exports = {
	get: (url, data, showLoading = true, showToast = true) => {
		return request(url, data, "GET", false, showLoading, showToast)
	},
	postQuery: (url, data, showLoading = true, showToast = true) => {
		return request(url, data, "POST", false, showLoading, showToast)
	},
	postJson: (url, data, showLoading = true, showToast = true) => {
		return request(url, data, "POST", true, showLoading, showToast)
	},
	putJson: (url, data, showLoading = true, showToast = true) => {
		return request(url, data, "PUT", true, showLoading, showToast)
	},
	delete: (url, data, showLoading = true, showToast = true) => {
		return request(url, data, "DELETE", false, showLoading, showToast)
	},
	fileUpload: (url, filePaths, name) => {
		return singleFileUpload(url, filePaths, name)
	}
} 

function request(url, data, method, isJson, showLoading, showToast){
	// 检查是否使用Mock数据
	if (config.useMock) {
		return mockRequest(url, data, method, showLoading, showToast)
	}
	
	if(showLoading) uni.showLoading()
	console.log("HTTP " + method + " 请求，URL：" + url + "，参数：" + (data ? JSON.stringify(data) : "无"));
	return new Promise((resolve, reject) => {
		uni.request({
			url: url,
			method: method,
			data: data,
			timeout: 10000,
			header: {
			    'Content-Type': isJson ? 'application/json' : 'application/x-www-form-urlencoded',
				"token": uni.getStorageSync("token")
			},
			success(res) {
				if(showLoading) uni.hideLoading()
				if(res.data.code == 0 || res.data.code == 200){
					if('rows' in res.data || 'detail' in res.data){
						resolve(res.data)
					}else{
						resolve(res.data.data)
					}
				}else if(res.data.code == 401){
					//token失效，跳转到登录页面
					reject(res.data.msg)
					if(showToast){
						setTimeout(() => {
							uni.showToast({
								title: "身份认证已过期，请重新登录",
								icon: "none",
								duration: 2000
							})
						}, 500)
					}
					uni.reLaunch({
						url: "/pages/login/login"
					})
				}else{
					console.log("HTTP请求异常：" + JSON.stringify(res.data));
					if(showToast){
						uni.showToast({
							title: res.data.msg ? res.data.msg : "网络繁忙，请稍后再试",
							icon: "none"
						})
					}
					reject(res.data.msg)
				}
			},
			fail(e) {
				if(showLoading) uni.hideLoading()
				console.log("HTTP请求异常：" + e.errMsg);
				if(showToast){
					uni.showToast({
						title: "网络繁忙，请稍后再试",
						icon: "none"
					})
				}
				reject(e)
			}
		})
	})
}

// Mock请求处理
function mockRequest(url, data, method, showLoading, showToast) {
	if(showLoading) uni.showLoading()
	
	return new Promise(async (resolve, reject) => {
		try {
			const res = await mockService.handleRequest(url, data, method)
			
			if(showLoading) uni.hideLoading()
			
			if(res.code == 0 || res.code == 200){
				if('rows' in res || 'detail' in res){
					resolve(res)
				}else{
					resolve(res.data)
				}
			}else if(res.code == 401){
				//token失效，跳转到登录页面
				reject(res.msg)
				if(showToast){
					setTimeout(() => {
						uni.showToast({
							title: "身份认证已过期，请重新登录",
							icon: "none",
							duration: 2000
						})
					}, 500)
				}
				uni.reLaunch({
					url: "/pages/login/login"
				})
			}else{
				console.log("[Mock] 请求异常：" + JSON.stringify(res));
				if(showToast){
					uni.showToast({
						title: res.msg ? res.msg : "网络繁忙，请稍后再试",
						icon: "none"
					})
				}
				reject(res.msg)
			}
		} catch (error) {
			if(showLoading) uni.hideLoading()
			console.log("[Mock] 请求异常：" + error);
			if(showToast){
				uni.showToast({
					title: "网络繁忙，请稍后再试",
					icon: "none"
				})
			}
			reject(error)
		}
	})
}

function singleFileUpload(url, filePaths, name = "file"){
	// 如果使用Mock，模拟文件上传
	if (config.useMock) {
		return mockFileUpload(url, filePaths, name)
	}
	
	uni.showLoading()
	var count = 0
	console.log("HTTP文件上传，URL：" + url + "，文件路径：" +  filePaths);
	const promises = filePaths.map((filePath) => {
	    return new Promise((resolve, reject) => {
			let data = {
				url: url,
				name: name,
				timeout: 30000,
				header: {
					"token": uni.getStorageSync("token")
				},
				success(res){
					console.log("HTTP文件上传成功：" + JSON.stringify(res));
					count++
					if(count == filePaths.length){
						uni.hideLoading()
					}
					var resObj = JSON.parse(res.data)
					if(resObj.code == 0 || resObj.code == 200){
						resolve(resObj.data ? (Array.isArray(resObj.data) ? resObj.data[0] : resObj.data) : '')
					}else{
						reject(resObj.msg)
					}
				}, 
				fail(e){
					console.log("HTTP文件上传异常：" + e);
					count++
					if(count == filePaths.length){
						uni.hideLoading()
					}
					reject(e)
				}
			}
			if(typeof filePath === 'string'){
				//文件路径
				data.filePath = filePath
			}else{
				//文件类型
				data.file = filePath
			}
			uni.uploadFile(data)
	    })
	});
	return Promise.all(promises);
}

// Mock文件上传
function mockFileUpload(url, filePaths, name = "file") {
	uni.showLoading()
	
	return new Promise((resolve) => {
		setTimeout(() => {
			uni.hideLoading()
			// 模拟返回上传成功的文件URL
			const mockUrls = filePaths.map((filePath, index) => {
				return `/static/images/mock_upload_${Date.now()}_${index}.jpg`
			})
			resolve(mockUrls)
		}, 1000)
	})
}