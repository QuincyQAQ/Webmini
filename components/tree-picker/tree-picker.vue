<!-- 支持nvue的树选择器 -->
<!-- Create by ZhangPing -->
<template>
	<view>
		<view class="mask" :class="{'show': showPopup}"  @click="showPopup = false"></view>
		<view class="tree-view" :style="'height:' + height + 'px'" :class="{'show': showPopup}">
			<view class="tree-picker_header">
				<view class="cancel" @click="showPopup = false">
					<text class="cancel-text">取消</text>
				</view>
				<text class="tree-picker_title">{{title}}</text>
				<view class="confirm" @click="confirm">
					<text class="confirm-text">确定</text>
				</view>
			</view>
			<view class="divider"></view>
			<view class="tree-picker_search">
				<u-search placeholder="请输入关键字" v-model="keyword" @clear="onSearchClear" @search="onSearch" :actionText="actionText" @custom="onActionClick"></u-search>
			</view>
			<view class="divider"></view>
			<scroll-view class="list" scroll-y="true" :style="'height:' + listHeight + 'px'">
				<view v-if="item.isShow" class="item" v-for="(item,index) in treeList" :key="index">
					<view @tap.stop="onItemClick(index)" :style="'width:' + (item.level * 20) + 'px'"></view>
					<image @tap.stop="onItemClick(index)" class="item-icon-size" :src="item.hasChildren ? (item.expand ? '/static/images/tree-picker/tree_down.png' : '/static/images/tree-picker/tree_right.png') : ''"></image>
					<text @tap.stop="onItemClick(index)" class="item-label">{{item.label}}</text>
					<checkbox-group v-if="multiple" @change="onItemChecked" :data-position="index">
						<checkbox :checked="item.checked"></checkbox>
					</checkbox-group>
					<radio-group v-else @change="onItemChecked" :data-position="index">
						<radio :checked="item.checked"/>
					</radio-group>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	
	export default {
		name:"tree-picker",
		props: {
			height: {
				type: Number,
				default: 500
			},
			title: {
				type: String,
				default: ""
			},
			actionText: {
				type: String,
				default: "搜索"
			},
			treeData: {
				type: Array,
				default: function(){
					return []
				}
			},
			idKey: {
				type: String,
				default: "id"
			},
			labelKey: {
				type: String,
				default: "label"
			},
			childrenKey: {
				type: String,
				default: "children"
			},
			multiple: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				showPopup: false,
				treeList: [],
				lastCheckedIndex: -1,
				keyword: "",
				listHeight: 0
			}
		},
		created() {
			this.listHeight = this.height - 100
		},
		methods: {
			show(){
				this.showPopup = true
			},
			dismiss(){
				this.showPopup = false
			},
			initTree(){
				if(!this.treeData || this.treeData.length == 0) return
				var treeList = []
				this._formatData(treeList, this.treeData)
				this.treeList = treeList
			},
			_formatData(list, childList, parentId = 0, level = 0){
				childList.forEach((item, index) => {
					var children = item[this.childrenKey]
					var treeItem = {
						id: item[this.idKey],
						label: item[this.labelKey],
						level: level,
						checked: false,
						expand: false,
						isShow: level == 0,
						parentId: parentId,
						hasChildren: children && children.length > 0
					}
					list.push(treeItem)
					if(children && children.length > 0){
						this._formatData(list, children, item.id, level + 1)
					}
				})
			},
			onItemClick(index){
				var clickItem = this.treeList[index]
				clickItem.expand = !clickItem.expand
				if(!clickItem.hasChildren) return
				this.treeList.forEach(item => {
					if(item.parentId == clickItem.id){
						item.isShow = clickItem.expand
					}
				})
			},
			onItemChecked(e){
				var checkedIndex = e.target.dataset.position
				var checkedItem = this.treeList[checkedIndex]
				if(!this.multiple){
					//单选
					checkedItem.checked = true
					if(this.lastCheckedIndex > -1){
						this.treeList[this.lastCheckedIndex].checked = false
					}
					this.lastCheckedIndex = checkedIndex
					this.dismiss()
					this.$emit("onChecked", {
						checkedIds: [checkedItem.id],
						checkedLabels: [checkedItem.label]
					})
					return
				}
				//多选
				checkedItem.checked = !checkedItem.checked
				if(!checkedItem.hasChildren) return
				this._itemChildChecked(checkedItem.id, checkedItem.checked)
			},
			_itemChildChecked(parentId, checked){
				this.treeList.forEach(item => {
					if(item.parentId == parentId){
						item.checked = checked
						if(item.hasChildren) this._itemChildChecked(item.id, checked)
					}
				})
			},
			confirm(e){
				this.dismiss()
				var checkedIds = []
				var checkedLabels = []
				this.treeList.forEach(item => {
					if(item.checked){
						checkedIds.push(item.id)
						checkedLabels.push(item.label)
					}
				})
				this.$emit("onChecked", {
					checkedIds: checkedIds,
					checkedLabels: checkedLabels
				})
			},
			onSearchClear(e){
				this.treeList.forEach(item => {
					item.isShow = item.level == 0
				})
			},
			onSearch(){
				if(!this.keyword){
					this.treeList.forEach(item => {
						item.isShow = item.level == 0
					})
				}else{
					this.treeList.forEach(item => {
						item.isShow = item.label.indexOf(this.keyword) != -1
					})
				}
			},
			onActionClick(){
				if(this.actionText == '搜索'){
					this.onSearch()
				}
				this.$emit("onActionClick")
			}
		},
		watch: {
			treeData(){
				this.initTree()
			}
		},
		mounted() {
			this.initTree()
		}
	}
</script>

<style scoped>
	.mask{
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(0, 0, 0, .4);
		opacity: 0;
		transition: all 0.3s ease;
		visibility: hidden;
	}
	
	.mask.show{
		opacity: 1;
		visibility: visible;
	}
	
	.tree-view{
		position: fixed;
		right: 0;
		bottom: 0;
		left: 0;
		background-color: #fff;
		border-top-left-radius: 10px;
		border-top-right-radius: 10px;
		display: flex;
		flex-direction: column;
		z-index: 102;
		transition: all 0.3s ease;
		transform: translateY(100%);
	}
	
	.tree-view.show{
		transform: translateY(0);
	}
	
	.tree-picker_header{
		height: 44px;
		display: flex;
		flex-direction: row;
		align-items: center;
	}

	.cancel{
		width: 75px;
		height: 44px;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 16px;
		color: #757575;
	}
	
	.cancel-text{
		font-size: 16px;
		color: #757575;
	}
	
	.tree-picker_title{
		width: 100%;
		font-size: 18px;
		flex: 1;
		text-align: center;
	}
	
	.confirm{
		width: 75px;
		height: 44px;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	
	.confirm-text{
		font-size: 16px;
		color: #0055ff;
	}
	
	.divider{
		height: 1px;
		box-sizing: border-box;
		background-color: #e8e8e8;
	}
	
	.tree-picker_search{
		box-sizing: border-box;
		padding: 10px;
	}
	
	.list{
		display: flex;
		flex-direction: column;
		box-sizing: border-box;
		padding: 10px 0;
	}
	
	.item{
		display: flex;
		flex-direction: row;
		align-items: center;
		height: 36px;
		box-sizing: border-box;
		padding: 0 20px;
	}
	
	.item-icon-size{
		width: 13px;
		height: 13px;
	}
	
	.item-label{
		font-size: 14px;
		flex: 1;
		padding: 10px 0;
		box-sizing: border-box;
		margin: 0 10px;
	}
</style>