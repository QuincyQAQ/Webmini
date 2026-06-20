<template>
	<image style="width: 100vw;" mode="widthFix" :src="photoUrl"></image>
</template>

<script>
	export default {
		data() {
			return {
				photoUrl: ''
			}
		},
		onLoad(options) {
			this.photoUrl = decodeURI(options.url)
			uni.setNavigationBarTitle({
				title: options.title
			})
		},
		methods: {
			
		}
	}
</script>

<style>

</style>
