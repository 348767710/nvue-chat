const requestInterceptors=(vm)=>{
	/**
	 * 请求拦截
	 * @param {Object} http
	 */
	uni.$u.http.interceptors.request.use((config) => { // 可使用async await 做异步操作
		// debugger
		// 初始化请求拦截器时，会执行此方法，此时data为undefined，赋予默认{}
		config.data = config.data || {}
		if(config.custom.auth) {
			// token鉴权
			let Authorization = uni.getStorageSync('Authorization');
			config.params.Authorization = Authorization;
		}
		// console.log(config);
		return config
	}, (config) => // 可使用async await 做异步操作
		Promise.reject(config))
}
const responseInterceptors=(vm)=>{
	/**
	 * 响应拦截
	 * @param {Object} http 
	 */
	uni.$u.http.interceptors.response.use((response) => { 
		/* 对响应成功做点什么 可使用async await 做异步操作,我这里没有做任何操作*/
		const data = response.data
		return data || {}
	}, (response) => { /*  对响应错误做点什么 （statusCode !== 200）*/
		return Promise.reject(response)
	})
}


export {
	requestInterceptors,
	responseInterceptors
}