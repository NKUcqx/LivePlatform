//这个文件是路由,主要是用于当后端返回数据时候改变页面url以及页面内的组件用的

import Vue from 'vue'
import Router from 'vue-router'
import Welcome from '@/components/Welcome'
import Home from '@/components/Home'
import Codedemo from '@/components/Codedemo'


Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '',
      name: 'Welcome',
      component: Welcome
    },
    {
      path: '/home',
      name: 'home',
      component: Home
    },
    {
      path: '/code',
      name: 'code',
      component: Codedemo
    }
  ]
})
