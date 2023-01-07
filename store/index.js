import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
import user from '@/store/modules/user.js';
// import http from "@/utils/luch-request/index.js"
// Vue.prototype.$http = http;

export default new Vuex.Store({
	modules:{
		user
	}
})