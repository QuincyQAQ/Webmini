import App from './App'

// #ifndef VUE3
import Vue from 'vue'
import './uni.promisify.adaptor'
Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
  ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif


// main.js，注意要在use方法之后执行
import uView from '@/uni_modules/uview-ui'
Vue.use(uView)
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