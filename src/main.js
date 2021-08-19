import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { Message } from 'element-ui';
Vue.prototype.$message = Message;
import "./css/normalize.css"
import "./css/common.css"
import tools from "./utils/tools"
console.log(tools)
Vue.prototype.$tools = tools

Vue.config.productionTip = false
import * as echarts from 'echarts'
Vue.prototype.$echarts = echarts

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
