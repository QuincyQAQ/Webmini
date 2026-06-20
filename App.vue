<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style lang="scss">
	/* 注意要写在第一行，同时给style标签加入lang="scss"属性 */
	@import "@/uni_modules/uview-ui/theme.scss";
	@import "@/uni_modules/uview-ui/index.scss";
	@import "@/static/css/index.css";

	.page{
		width: 100vw;
		height: 100vh;
		background-color: #F2F2F2;
		display: flex;
		flex-direction: column;
		box-sizing: border-box;
	}

	.divider{
		background-color: #DAE0E6;
	}
</style>
