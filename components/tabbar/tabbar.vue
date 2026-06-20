<template>
	<u-tabbar
		ref="tabbar"
		:value="name"
		@change="onTabChange"
		:fixed="true"
		:placeholder="true"
		:safeAreaInsetBottom="true"
	>
		<u-tabbar-item v-for="(item,index) in tabList" :key="index" :name="item.name" :text="item.text">
			<image slot="active-icon" class="tabbar-icon" :src="item.checkedIcon"></image>
			<image slot="inactive-icon" class="tabbar-icon" :src="item.icon"></image>
		</u-tabbar-item>
	</u-tabbar>
</template>

<script>
	export default {
		name: "tabbar",
		props: {
			name: {
				type: String,
				default: 'map'
			}
		},
		data() {
			return {
				tabList: [],
				contentHeight: 0
			}
		},
		created() {
			let list = [
					{
						name: 'map',
						text: '巡检地图',
						icon: '/static/images/nav_map.png',
						checkedIcon: '/static/images/nav_map_checked.png',
						pagePath: 'pages/index/index',
					},
					{
						name: 'task',
						text: '巡检任务',
						icon: '/static/images/nav_task.png',
						checkedIcon: '/static/images/nav_task_checked.png',
						pagePath: 'pages/task/task',
					},
					{
						name: 'apply',
						text: '任务申请',
						icon: '/static/images/nav_apply.png',
						checkedIcon: '/static/images/nav_apply_checked.png',
						pagePath: 'pages/apply/applyList',
					},
					{
						name: 'fix',
						text: '维修工单',
						icon: '/static/images/nav_fix.png',
						checkedIcon: '/static/images/nav_fix_checked.png',
						pagePath: 'pages/fix/list',
					},
					{
						name: 'ai',
						text: 'AI对话',
						icon: '/static/images/nav_ai.png',
						checkedIcon: '/static/images/nav_ai_checked.png',
						pagePath: 'pages/ai/ai',
					},
					{
						name: 'mine',
						text: '个人中心', 
						icon: '/static/images/nav_mine.png',
						checkedIcon: '/static/images/nav_mine_checked.png',
						pagePath: 'pages/mine/mine',
					}
				]
			let userType = uni.getStorageSync("userType")
			if(userType == this.constant.USER_TYPE_SYS){
				this.tabList = list
			}else if(userType == this.constant.USER_TYPE_MOBILE){
				this.tabList = [list[0],list[2],list[4],list[5]]
			} if(userType == this.constant.USER_TYPE_DRIVER){
				this.tabList = [list[1],list[3],list[4],list[5]]
			}else if(userType == this.constant.USER_TYPE_ADMIN){
				this.tabList = list
			}
			uni.hideTabBar()
		},
		methods: {
			onTabChange(name){
				let item = this.tabList.find(it => it.name == name)
				uni.switchTab({
					url: '/' + item.pagePath
				})
			}
		}
	}
</script>

<style>
	.page{
		width: 100vw;
		height: 100vh;
		display: flex;
		flex-direction: column;
	}
	
	.map{
		width: 100%;
		height: 100%;
	}
	
	.content{
		width: 100vw;
	}
	
	.tabbar-icon{
		width: 20px;
		height: 20px;
	}

</style>
