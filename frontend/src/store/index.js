// this is for vuex and it is main file in vuex
// you can find greater examples and explanations in https://vuex.vuejs.org/zh-cn/
import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions'
import * as getters from './getters'
import * as mutations from './mutations'
import home from './modules/home'
import welcome from './modules/welcome'
// import * as mutations from './mutations'
// import tests from './modules/testmodules'

Vue.use(Vuex)

const state = {
    session: {
        hasSession: false,
        sessionKey: null
    },
    user: {
        userid: null,
        username: null,
        nickname: '',
        avatar: null,
        gender: '',
        isLogin: false
    }
}

export default new Vuex.Store({
    state,
    actions,
    getters,
    mutations,
    modules: {
        welcome,
        home
    }
    /* :debug,
    plugins: [localStoragePlugin] */
})
