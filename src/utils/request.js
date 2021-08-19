import axios from 'axios'
import {
	Message
} from 'element-ui'
// import {
// 	getToken
// } from '@/utils/auth'


// create an axios instance
const service = axios.create({
	baseURL: '/api/', // api 的 base_url
	//timeout: 10000 // request timeout
})

// request interceptor
service.interceptors.request.use(
	config => {
		//config.headers['Authorization'] = 'Bearer ' + getToken()
		console.log("请求数据----")
		console.log(JSON.stringify(config.data))
		console.log(JSON.stringify(config.params))
		return config
	},
	error => {
		// Do something with request error
		console.log(error) // for debug
		Promise.reject(error)
	}
)

// response interceptor
service.interceptors.response.use(
	// response => response,
	/**
	 * 下面的注释为通过在response里，自定义code来标示请求状态
	 * 当code返回如下情况则说明权限有问题，登出并返回到登录页
	 * 如想通过 xmlhttprequest 来状态码标识 逻辑可写在下面error中
	 * 以下代码均为样例，请结合自生需求加以修改，若不需要，则可删除
	 */
	response => {
		const res = response.data
		console.log("返回数据-----")
		console.log(("url=======" + response.config.url))
		console.log(JSON.stringify(res))
		if (response.code == 500) {
			Message({
				message: res.message,
				type: 'error',
				duration: 5 * 1000
			})
			return Promise.reject('error')
		} else {
			if (res.status_code > 280) {
				let message = '访问错误'
				switch (res.status_code) {
					case 204:
						message = '删除成功-' + res.message
						break
					case 400:
						message = '请求错误-' + res.message
						break
					case 401:
						message = res.message
						// router.replace({
						// 	path: '/login',
						// 	query: {
						// 		redirect: router.currentRoute.fullPath
						// 	}
						// })
						break
					case 403:
						message = '权限不足-' + res.message
						break
					case 404:
						message = '记录不存-' + res.message
						break
					case 406:
						message = '请求格式错误-' + res.message
						break
					case 422:
						message = '创建失败-' + res.message
						break
					case 500:
						message = '服务器错误'
						if (res.error == 'SERVER ERROR')
							// router.replace({
							// 	path: '/login',
							// 	query: {
							// 		redirect: router.currentRoute.fullPath
							// 	}
							// })
							break
				}
				Message({
					message: message,
					type: 'error',
					duration: 8 * 1000
				})
				return Promise.reject('error')
			} else {
				return response
			}
		}

	},
	error => {
		console.log('err' + error) // for debug
		Message({
			message: '操作无响应，请联系管理员',
			type: 'error',
			duration: 5 * 1000
		})
		return Promise.reject(error)
	}
)

export default service
