<template>
	<view class="page" :style="{'height': pageH + 'px'}">
		<view class="nav-bar" :style="{'padding-top': statusBarH + 'px'}">
			<text class="nav-title">AI 对话</text>
		</view>

		<scroll-view
			class="chat-scroll"
			:style="{'height': scrollH + 'px'}"
			scroll-y="true"
			:scroll-into-view="scrollTo"
			:scroll-with-animation="true"
		>
			<view class="welcome" v-if="msgList.length === 0">
				<image class="welcome-logo" src="/static/images/nav_ai_checked.png" mode="aspectFit"></image>
				<text class="welcome-title">嗨！我是 AI 助手</text>
				<text class="welcome-desc">我可以帮你回答问题、写代码、翻译、写诗等。</text>
			</view>

			<view v-for="(m, i) in msgList" :key="i" :id="'m-' + i">
				<view class="u-msg" v-if="m.role === 'user'">
					<text class="u-text">{{m.content}}</text>
				</view>
				<view class="a-msg" v-else>
					<image class="a-avatar" src="/static/images/nav_ai_checked.png" mode="aspectFit"></image>
					<view class="a-body">
						<view class="a-text" v-if="!m.thinking" v-html="md2html(m.content)"></view>
						<view class="a-dots" v-else>
							<view class="d"></view><view class="d"></view><view class="d"></view>
						</view>
					</view>
				</view>
			</view>
			<view id="bot" style="height:16px;"></view>
		</scroll-view>

		<view class="bottom-bar">
			<view class="input-line">
				<textarea
					class="inp" v-model="inputText" placeholder="给 AI 发送消息"
					placeholder-class="inp-ph" :auto-height="true" :maxlength="2000"
					:adjust-position="true" confirm-type="send" @confirm="onSend"
				></textarea>
				<view class="s-btn" :class="{'s-on': canSend}" @click="onSend" v-if="!loading">
					<view class="s-arr"></view>
				</view>
				<view class="st-btn" @click="onStop" v-else>
					<view class="st-sq"></view>
				</view>
			</view>
			<view class="tool-line">
				<view class="t-btn" :class="{'t-on': deepThink}" @click="deepThink = !deepThink">
					<text class="t-ico">🧠</text><text class="t-lbl">深度思考</text>
				</view>
				<view class="t-btn" :class="{'t-on': webSearch}" @click="webSearch = !webSearch">
					<text class="t-ico">🌐</text><text class="t-lbl">联网搜索</text>
				</view>
				<view class="t-btn" :class="{'t-on': ragOpen}" @click="ragOpen = true">
					<text class="t-ico">📄</text><text class="t-lbl">RAG</text>
				</view>
			</view>
			<text class="tip">内容由 AI 生成，仅供参考</text>
		</view>

		<!-- RAG 弹窗 -->
		<view class="rag-mask" v-if="ragOpen" @click="ragOpen = false">
			<view class="rag-popup" @click.stop>
				<view class="rag-head">
					<text class="rag-title">📄 知识库 (RAG)</text>
					<text class="rag-close" @click="ragOpen = false">✕</text>
				</view>
				<view class="rag-body">
					<text class="rag-desc">勾选要检索的知识库文件夹：</text>
					<view class="rag-folder" v-for="(f, i) in kbFolders" :key="i" @click="f.checked = !f.checked">
						<view class="rag-check" :class="{'rag-check-on': f.checked}">{{f.checked ? '✓' : ''}}</view>
						<text class="rag-folder-icon">📁</text>
						<view class="rag-folder-info">
							<text class="rag-folder-name">{{f.name}}</text>
							<text class="rag-folder-count">{{f.files.length}} 个文件</text>
						</view>
					</view>
					<view class="rag-divider"></view>
					<text class="rag-desc">或上传新文件：</text>
					<view class="rag-upload" @click="pickPdf">
						<text class="rag-upload-icon">+</text>
						<text class="rag-upload-text">上传 PDF</text>
					</view>
					<view class="rag-item" v-for="(f, i) in pdfList" :key="'up-' + i">
						<text class="rag-item-icon">📄</text>
						<text class="rag-item-name">{{f.name}}</text>
						<text class="rag-item-del" @click="pdfList.splice(i,1)">✕</text>
					</view>
				</view>
			</view>
		</view>

		<tabbar name="ai"></tabbar>
	</view>
</template>

<script>
import config from '@/config/config'

export default {
	data() {
		return {
			statusBarH: 0,
			pageH: 0,
			scrollH: 0,
			inputText: '',
			msgList: [],
			loading: false,
			scrollTo: '',
			deepThink: false,
			webSearch: false,
			ragOpen: false,
			pdfList: [],
			kbFolders: [
				{ name: '安全技术规范', checked: false, files: ['危险爆炸作业场所智能巡检机器人系统安全技术要求.pdf'] },
				{ name: '操作手册', checked: false, files: [] },
				{ name: '维护指南', checked: false, files: [] }
			],
			requestTask: null
		}
	},
	computed: {
		canSend() { return this.inputText.trim() && !this.loading }
	},
	mounted() {
		const sys = uni.getSystemInfoSync()
		this.statusBarH = sys.statusBarHeight || 20
		const safeB = sys.safeAreaInsets?.bottom || parseInt(uni.getStorageSync("safeAreaBottomHeight")) || 0
		this.pageH = (sys.screenHeight || sys.windowHeight || 667) - (safeB + 50)
		const navH = this.statusBarH + 54
		const inputH = 140
		this.scrollH = this.pageH - navH - inputH
		// #ifdef H5
		window.addEventListener('resize', this.onResize)
		// #endif
	},
	beforeDestroy() {
		// #ifdef H5
		window.removeEventListener('resize', this.onResize)
		// #endif
	},
	methods: {
		onResize() {
			const sys = uni.getSystemInfoSync()
			const safeB = sys.safeAreaInsets?.bottom || 0
			this.pageH = (sys.screenHeight || sys.windowHeight || 667) - (safeB + 50)
			this.scrollH = this.pageH - (this.statusBarH + 54) - 140
		},
		async onSend() {
			const t = this.inputText.trim(); if (!t || this.loading) return
			this.msgList.push({ role: 'user', content: t }); this.inputText = ''; this.loading = true; this.goBottom()
			const ai = this.msgList.length; this.msgList.push({ role: 'assistant', content: '', thinking: true }); this.goBottom()
			try {
				const reply = await this.callDeepSeek(t)
				this.msgList.splice(ai, 1, { role: 'assistant', content: reply, thinking: false })
			} catch (e) {
				this.msgList.splice(ai, 1, { role: 'assistant', content: '请求失败：' + (e.message || '网络错误'), thinking: false })
			}
			this.loading = false; this.requestTask = null; this.$nextTick(() => this.goBottom())
		},
		callDeepSeek(userMsg) {
			return new Promise(async (resolve, reject) => {
				let sys = '你是一个有帮助的AI助手。请用中文回答。回答要准确、简洁、有条理。'
				// RAG: 加载勾选知识库的文本内容
				const checked = this.kbFolders.filter(f => f.checked)
				if (checked.length > 0 || this.pdfList.length > 0) {
					sys += '\n\n【知识库参考】'
					for (const f of checked) {
						for (const file of f.files) {
							const txtName = file.replace('.pdf', '.txt')
							try {
								const res = await uni.request({ url: '/static/kb/' + txtName, method: 'GET', timeout: 5000 })
								if (res.statusCode === 200 && res.data) {
									sys += '\n\n【' + file + '】\n' + (typeof res.data === 'string' ? res.data.substring(0, 5000) : '')
								}
							} catch(e) {}
						}
					}
					if (this.pdfList.length > 0) sys += '\n\n上传文件: ' + this.pdfList.map(f => f.name).join(', ')
				}
				const msgs = [{ role: 'system', content: sys }]
				this.msgList.filter(m => !m.thinking).slice(-20).forEach(m => msgs.push({ role: m.role, content: m.content }))
				const model = this.deepThink ? config.deepseek.reasonerModel : config.deepseek.model
				const t = uni.request({
					url: config.deepseek.baseUrl + '/chat/completions', method: 'POST', timeout: 60000,
					header: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + config.deepseek.apiKey },
					data: { model, messages: msgs, stream: false, temperature: 0.7, max_tokens: 2048 },
					success(r) {
						if (r.statusCode === 200 && r.data?.choices?.[0]) resolve(r.data.choices[0].message.content)
						else reject(new Error(r.data?.error?.message || 'HTTP ' + r.statusCode))
					},
					fail(e) { reject(new Error(e.errMsg || '请求失败')) }
				})
				this.requestTask = t
			})
		},
		onStop() {
			if (this.requestTask) { this.requestTask.abort(); this.requestTask = null }
			this.loading = false
			const last = this.msgList[this.msgList.length - 1]
			if (last?.thinking) this.$set(this.msgList, this.msgList.length - 1, { role: 'assistant', content: '已停止回复。', thinking: false })
		},
		goBottom() { this.scrollTo = ''; this.$nextTick(() => { this.scrollTo = 'bot' }) },
		md2html(md) {
			if (!md) return ''
			let h = md
			h = h.replace(/```(\w*)\n([\s\S]*?)```/g, '<pre><code>$2</code></pre>')
			h = h.replace(/`([^`]+)`/g, '<code>$1</code>')
			h = h.replace(/\*\*(.+?)\*\*/g, '<b>$1</b>')
			h = h.replace(/\*(.+?)\*/g, '<i>$1</i>')
			h = h.replace(/^#### (.+)$/gm, '<h4>$1</h4>')
			h = h.replace(/^### (.+)$/gm, '<h3>$1</h3>')
			h = h.replace(/^## (.+)$/gm, '<h2>$1</h2>')
			h = h.replace(/^# (.+)$/gm, '<h1>$1</h1>')
			h = h.replace(/^[*-] (.+)$/gm, '<li>$1</li>')
			h = h.replace(/\n\n/g, '<br><br>')
			return h
		},
		readPdfText(file) {
			// #ifdef H5
			return new Promise((resolve) => {
				const reader = new FileReader()
				reader.onload = (e) => {
					// PDF binary can't be easily parsed without pdf.js
					// Just pass the filename as context
					resolve('')
				}
				reader.readAsArrayBuffer(file)
			})
			// #endif
			// #ifndef H5
			return Promise.resolve('')
			// #endif
		},
		pickPdf() {
			// #ifdef H5
			const input = document.createElement('input')
			input.type = 'file'; input.accept = '.pdf'
			input.onchange = (e) => {
				const file = e.target.files[0]
				if (file) this.pdfList.push({ name: file.name, file })
			}
			input.click()
			// #endif
			// #ifndef H5
			uni.chooseFile({
				extension: ['.pdf'],
				success: (res) => {
					const f = res.tempFiles[0]
					this.pdfList.push({ name: f.name, path: f.path })
				}
			})
			// #endif
		},
	}
}
</script>

<style>
.page { width: 100vw; background: #FFF; box-sizing: border-box; display: flex; flex-direction: column; overflow: hidden; }
.nav-bar { padding: 0 16px 10px; background: #FFF; flex-shrink: 0; }
.nav-title { font-size: 18px; font-weight: 700; color: #18191A; line-height: 44px; }
.chat-scroll { width: 100%; padding: 0 12px; box-sizing: border-box; flex-shrink: 0; }
.welcome { display: flex; flex-direction: column; align-items: center; padding-top: 80px; }
.welcome-logo { width: 52px; height: 52px; border-radius: 50%; background: #FFF; padding: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.06); margin-bottom: 16px; }
.welcome-title { font-size: 20px; font-weight: 700; color: #222; margin-bottom: 6px; }
.welcome-desc { font-size: 14px; color: #999; padding: 0 30px; text-align: center; line-height: 1.5; }
.u-msg { display: flex; justify-content: flex-end; margin-bottom: 14px; }
.u-text { max-width: 75%; background: #2F7FF0; color: #FFF; font-size: 15px; line-height: 1.6; padding: 10px 14px; border-radius: 14px 4px 14px 14px; word-break: break-word; overflow-wrap: break-word; user-select: text; -webkit-user-select: text; }
.a-msg { display: flex; flex-direction: row; align-items: flex-start; margin-bottom: 14px; }
.a-avatar { width: 28px; height: 28px; border-radius: 50%; background: #FFF; padding: 4px; margin-right: 10px; margin-top: 4px; flex-shrink: 0; box-shadow: 0 1px 3px rgba(0,0,0,0.06); }
.a-body { flex: 1; min-width: 0; }
.a-text { font-size: 15px; color: #222; line-height: 1.7; user-select: text; -webkit-user-select: text; }
.a-dots { display: flex; flex-direction: row; padding: 4px 0; }
.d { width: 6px; height: 6px; border-radius: 50%; background: #BBB; margin-right: 5px; animation: b 1.4s ease-in-out infinite both; }
.d:nth-child(1) { animation-delay: 0s; } .d:nth-child(2) { animation-delay: 0.2s; } .d:nth-child(3) { animation-delay: 0.4s; }
@keyframes b { 0%,80%,100% { transform:scale(0.5); opacity:0.3; } 40% { transform:scale(1); opacity:1; } }
.bottom-bar { background: #FFF; border-top: 1px solid #EEE; padding: 8px 12px; box-sizing: border-box; flex-shrink: 0; }
.tool-line { display: flex; padding-bottom: 6px; }
.t-btn { display: flex; align-items: center; padding: 5px 12px; border-radius: 20px; background: #F3F4F6; margin-right: 8px; }
.t-on { background: #DBEAFE; }
.t-ico { font-size: 13px; margin-right: 3px; }
.t-lbl { font-size: 12px; color: #666; }
.input-line { display: flex; align-items: flex-end; background: #F4F5F7; border-radius: 18px; padding: 6px 10px; }
.inp { flex: 1; min-height: 22px; max-height: 110px; font-size: 15px; color: #222; background: transparent; line-height: 1.5; }
.inp-ph { color: #BBB; font-size: 14px; }
.s-btn { width: 30px; height: 30px; border-radius: 50%; background: #DDD; display: flex; align-items: center; justify-content: center; margin-left: 8px; flex-shrink: 0; }
.s-on { background: #2F7FF0; }
.s-arr { width: 0; height: 0; border-left: 6px solid #FFF; border-top: 4px solid transparent; border-bottom: 4px solid transparent; margin-left: 2px; }
.st-btn { width: 30px; height: 30px; border-radius: 50%; background: #FA3B30; display: flex; align-items: center; justify-content: center; margin-left: 8px; flex-shrink: 0; }
.st-sq { width: 10px; height: 10px; background: #FFF; border-radius: 2px; }
.tip { font-size: 10px; color: #CCC; text-align: center; display: block; margin-top: 5px; }
.rag-mask { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.4); z-index: 999; display: flex; align-items: center; justify-content: center; }
.rag-popup { width: 85vw; max-width: 360px; background: #FFF; border-radius: 14px; overflow: hidden; }
.rag-head { display: flex; justify-content: space-between; align-items: center; padding: 16px 18px; border-bottom: 1px solid #EEE; }
.rag-title { font-size: 16px; font-weight: 600; color: #222; }
.rag-close { font-size: 18px; color: #999; padding: 4px; }
.rag-body { padding: 18px; }
.rag-desc { font-size: 13px; color: #999; margin-bottom: 12px; display: block; }
.rag-folder { display: flex; align-items: center; padding: 12px 0; border-bottom: 1px solid #F5F5F5; }
.rag-check { width: 22px; height: 22px; border-radius: 4px; border: 2px solid #DDD; display: flex; align-items: center; justify-content: center; margin-right: 12px; font-size: 13px; color: #FFF; flex-shrink: 0; }
.rag-check-on { background: #2F7FF0; border-color: #2F7FF0; }
.rag-folder-icon { font-size: 22px; margin-right: 10px; }
.rag-folder-info { flex: 1; }
.rag-folder-name { font-size: 14px; color: #333; display: block; }
.rag-folder-count { font-size: 11px; color: #BBB; }
.rag-divider { height: 1px; background: #EEE; margin: 14px 0; }
.rag-upload { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 20px; border: 2px dashed #DDD; border-radius: 10px; margin-bottom: 10px; }
.rag-upload-icon { font-size: 24px; color: #2F7FF0; margin-bottom: 4px; }
.rag-upload-text { font-size: 13px; color: #2F7FF0; }
.rag-item { display: flex; align-items: center; padding: 8px 0; border-bottom: 1px solid #F5F5F5; }
.rag-item-icon { font-size: 16px; margin-right: 8px; }
.rag-item-name { flex: 1; font-size: 13px; color: #333; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.rag-item-del { font-size: 14px; color: #FA3B30; padding: 4px; }
.a-text h1 { font-size: 20px; font-weight: 700; margin: 8px 0; }
.a-text h2 { font-size: 17px; font-weight: 700; margin: 6px 0; }
.a-text h3 { font-size: 15px; font-weight: 700; margin: 4px 0; }
.a-text p { margin: 4px 0; }
.a-text ul { padding-left: 16px; margin: 4px 0; }
.a-text li { margin: 2px 0; }
.a-text code { background: #F0F0F0; padding: 1px 4px; border-radius: 3px; font-size: 13px; }
.a-text pre { background: #F5F5F5; padding: 10px; border-radius: 6px; overflow-x: auto; margin: 6px 0; }
.a-text pre code { background: none; padding: 0; }
.a-text table { border-collapse: collapse; width: 100%; margin: 6px 0; }
.a-text td, .a-text th { border: 1px solid #DDD; padding: 4px 8px; font-size: 13px; }
.a-text strong { font-weight: 700; }
.a-text em { font-style: italic; }
</style>
