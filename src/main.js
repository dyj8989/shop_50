import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import router from './router'
import axios from 'axios'

// import './styles/common.css'

Vue.config.productionTip = false

// 所有组件都是可复用的vue实例 this.$axios this.msg
// 将axios挂载到了vue原型上，将来所有的实例都可以共享
Vue.prototype.$axios = axios

// 配置axios的基准地址，效果：将来所有的请求，会自动在前面拼接上路径
axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'
// 只要是vue的插件, 如果是基于模块化的开发模式, 必须use一下, 才能使用
Vue.use(ElementUI)
// 配置请求拦截器：将每次的请求，进行拦截，可以对每次请求进行处理
axios.interceptors.request.use(function (config) {
  console.log(config)
  config.headers.Authorization = localStorage.getItem('token')
  return config
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error)
}
)

// 配置响应拦截器
axios.interceptors.response.use(function (response) {
  // 对响应数据做点什么
  console.log(response)
  response = response.data
  // 校验结果,如果响应时，发现状态码是401，说明是无效token,拦截到登录
  if (response.meta.status === 401) {
    router.push('/login')
    localStorage.removeItem('token')
    response.meta.msg = '登录状态已失效，请重新的登录'
  }
  return response
}, function (error) {
// 对响应错误做点什么
  return Promise.reject(error)
})
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
