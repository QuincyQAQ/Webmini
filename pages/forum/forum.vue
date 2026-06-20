<template>
	<view class="page">
		<!-- #ifdef H5 -->
		<iframe class="forum-frame" src="/stackoverflow.com/questions/927358/how-do-i-undo-the-most-recent-local-commits-in-git.html" frameborder="0"></iframe>
		<!-- #endif -->
		<!-- #ifndef H5 -->
		<web-view src="/stackoverflow.com/questions/927358/how-do-i-undo-the-most-recent-local-commits-in-git.html"></web-view>
		<!-- #endif -->
	</view>
</template>

<script>
export default {
	data() { return {} }
}
</script>

<style>
.page { width: 100vw; height: 100vh; }
.forum-frame { width: 100%; height: 100%; border: none; }
</style>
