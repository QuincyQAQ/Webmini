module.exports = {
	debug: false,
	// Mock开关：true=使用mock数据，false=使用真实后端
	useMock: true,
	//正式环境
	baseUrl: "https://127.0.0.1:8080/szgwc/prod-api",
	photoUrl: "https://127.0.0.1:2800",
	//测试环境
	// baseUrl: "http://127.0.0.1:8080", 
	// photoUrl: "https://tscm316.com:2800",
	loginBgUrl: "https://127.0.0.1:2800/gwcfile/1.png",
	userAgreementUrl: "https://127.0.0.1:2800/gwcfile/2.png",
	privacyAgreementUrl: "https://127.0.0.1:2800/gwcfile/3.png",
	// DeepSeek API 配置
	deepseek: {
		apiKey: "sk-34e47f76f6fc405f83a1f7253f43f388",
		baseUrl: "https://api.deepseek.com",
		model: "deepseek-chat",
		reasonerModel: "deepseek-reasoner"
	},
}