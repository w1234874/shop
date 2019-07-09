import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/css/global.css'
import axios from "axios";
import './assets/fonts/iconfont.css'
import ZkTable from "vue-table-with-tree-grid";
import dataFormat from './assets/time.js'
//导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
//导入富文本编辑器对应的css
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
// 引入进度条和样式
import  Nprogess from 'nprogress'
import 'nprogress/nprogress.css'
Vue.use(VueQuillEditor)
Vue.component('tree-grid',ZkTable)
Vue.prototype.axios = axios
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// axios.interceptors.request.use(config=>{
//     console.log(config)
//     config.headers.Authorization = sessionStorage.getItem('token')
//     return config
// })
//拦截所有请求为请求设置请求头Authorization
axios.interceptors.request.use(config=>{
  Nprogess.start()
  config.headers.Authorization = sessionStorage.getItem('token')
  return config
})
axios.interceptors.response.use(config =>{
  Nprogess.done()
  return config
})

Vue.config.productionTip = false
// 老师讲的过滤器(懒)
Vue.filter('dataformate',function(doc,formata){
  return dataFormat(doc,formata)
})
// 视频讲的过滤器
Vue.filter('dateformate',(time)=>{
  const dt = new Date(time)
  const y = dt.getFullYear()
  const M = dt.getMonth() +1 
  const d = dt.getDate()
  const h = dt.getHours()
  const m = dt.getMinutes()
  const s = dt.getSeconds()
  return `${y}${M}${d}${h}${m}${s}  `
})
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
