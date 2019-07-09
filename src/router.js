import Vue from 'vue'
import Router from 'vue-router';
import Login from './components/Login.vue'
// const Login = () => import(/* webpackChunkName: "login" */ './components/Login.vue')
import Home from './components/Home.vue'
import Welcome from './components/Welcome.vue'
import User from './components/user/User.vue'
import Rights from './components/rights/Rights.vue'
import Roles from './components/rights/Roles.vue'
import Categories from './components/goods/Categories.vue'
import Params from './components/goods/Params.vue'
import Goods from './components/goods/Goods.vue'
import Add from './components/goods/Add.vue'
import Order from './components/order/Order.vue'
import Report from './components/reports/Reports.vue'

Vue.use(Router)
const router = new Router({
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', component: Login },
    {
      path: '/home',
      redirect:'/welcome',
      component: Home,
      children: [
        { path: '/welcome', component: Welcome },
        { path: '/users',component:User},
        { path: '/rights',component:Rights},
        { path:'/roles',component:Roles},
        { path:'/categories',component:Categories},
        {path:'/params',component:Params},
        {path:'/goods',component:Goods},
        {path:'/goods/add',component:Add},
        {path:'/orders',component:Order},
        {path:'/reports',component:Report}
      ]
    }
  ]
})
//將before掛載到router實例上;
router.beforeEach((to, form, next) => {
  // before有三個參數to表示要去往的頁面；
  // form 表示從哪個地址來；
  let token = sessionStorage.getItem('token')
  if (to.path == '/login') {
    next()
  } else {
    if (token) {
      next()
    } else (
      next('/login')
    )
  }
})
// 導出路由規則
export default router