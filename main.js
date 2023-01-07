import Vue from 'vue'
import App from './App'
import store from './store';

import uView from '@/uni_modules/uview-ui'




// import {http} from "utils/luch-request/index.js"
// Vue.prototype.$http = http;

Vue.config.productionTip = false
Vue.prototype.$store = store
App.mpType = 'app'
Vue.use(uView)
// import vConsole from './common/vconsole.min.js';
// var VConsole = new vConsole();

const app = new Vue({
	store,
	...App
})

// 引入请求封装，将app参数传递到配置中
import {initRequest} from '@/utils/request/index'
initRequest(app)
app.$mount()
