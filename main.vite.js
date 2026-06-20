import App from './App.vue'
import Vue from 'vue'
import uView from '@/uni_modules/uview-ui'

Vue.config.productionTip = false
Vue.use(uView)

// 注册 uni-app 基础组件别名
Vue.component('view', { template: '<div><slot /></div>' })
Vue.component('text', { template: '<span><slot /></span>' })
Vue.component('image', {
  props: ['src', 'mode', 'class', 'style'],
  template: '<img :src="src" :class="class" :style="style" />'
})

import './uni.promisify.adaptor'
import utils from '@/static/js/utils'
import dateUtils from '@/static/js/dateUtils'
import api from '@/network/api.js'
import apiUrl from '@/network/apiUrl.js'
import config from '@/config/config'
import constant from '@/config/constant.js'
import share from '@/static/js/share.js'
import mapService from '@/static/js/mapService.js'
import uniMapService from '@/static/js/uniMapService.js'
import locationService from '@/static/js/locationService.js'
Vue.prototype.utils = utils
Vue.prototype.dateUtils = dateUtils
Vue.prototype.api = api
Vue.prototype.apiUrl = apiUrl
Vue.prototype.config = config
Vue.prototype.constant = constant
Vue.prototype.mapService = mapService
Vue.prototype.uniMapService = uniMapService
Vue.prototype.locationService = locationService
Vue.mixin(share)

App.mpType = 'app'
const app = new Vue({ ...App })
app.$mount('#app')
