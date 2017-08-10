// 这个文件是路由,主要是用于当后端返回数据时候改变页面url以及页面内的组件用的
import Vue from 'vue'
import Router from 'vue-router'
import Welcome from '@/components/Welcome'
import Home from '@/components/Home'
import Studio from '@/components/Studio'
import Codedemo from '@/components/Codedemo'
import Canvas from '@/components/tinyComponents/Canvas'
import TeacherRTC from '@/components/tinyComponents/TeacherRTC'
import StudentRTC from '@/components/tinyComponents/StudentRTC'

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
            path: '/studio',
            name: 'studio',
            component: Studio
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
        }
    ]
})
