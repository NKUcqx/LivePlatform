// 这个文件是路由,主要是用于当后端返回数据时候改变页面url以及页面内的组件用的
import Vue from 'vue'
import Router from 'vue-router'
import Welcome from '@/components/Welcome'
import Home from '@/components/Home'
import Studio from '@/components/Studio'
import Codedemo from '@/components/Codedemo'
import Chat from '@/components/Chat'
import Canvas from '@/components/tinyComponents/Canvas'
import CloseButton from '@/components/tinyComponents/CloseButton'
import TeacherRTC from '@/components/tinyComponents/TeacherRTC'
import StudentRTC from '@/components/tinyComponents/StudentRTC'
import store from '../store'
import { CONST } from '../utils/const'

Vue.use(Router)

export default new Router({
    routes: [
        {
            path: '',
            name: 'welcome',
            component: Welcome,
            beforeEnter: (to, from, next) => {
                if (store.getters.isLogin) {
                    next('/home')
                } else {
                    next()
                }
            }
        },
        {
            path: '/home',
            name: 'home',
            component: Home,
            beforeEnter: (to, from, next) => {
                if (!store.getters.isLogin) {
                    alert(CONST.login)
                    next('/')
                } else {
                    next()
                }
            }
        },
        {
            path: '/studio',
            name: 'studio',
            component: Studio,
            beforeEnter: (to, from, next) => {
                if (!store.getters.isLogin) {
                    alert(CONST.login)
                    next('/')
                } else {
                    next()
                }
            }
        },
        {
            path: '/canvas',
            name: 'canvas',
            component: Canvas
        },
        {
            path: '/code',
            name: 'code',
            component: Codedemo
        },
        {
            path: '/teacher',
            name: 'teacher',
            component: TeacherRTC
        },
        {
            path: '/student',
            name: 'student',
            component: StudentRTC
        },
        {
            path: '/chat',
            name: 'chat',
            component: Chat
        }
    ]
})
