import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '@/styles/index.css'
import axios from './axios'
import moment from 'moment'
import Viewer from 'v-viewer'
import 'viewerjs/dist/viewer.css'
import '@/assets/iconfont/iconfont.css'
import myEcharts from 'echarts'

axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})

Vue.config.productionTip = false

Vue.use(ElementUI)

Vue.prototype.$ajax = axios
Vue.prototype.$moment = moment
Vue.prototype.$echarts = myEcharts

Vue.use(Viewer)
Viewer.setDefaults({
  toolbar: {
    zoomIn: true,
    zoomOut: true,
    oneToOne: false,
    reset: false,
    prev: false,
    play: false,
    next: false,
    rotateLeft: false,
    rotateRight: false,
    flipHorizontal: false,
    flipVertical: false
  }
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
