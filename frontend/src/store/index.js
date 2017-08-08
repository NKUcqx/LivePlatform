// this is for vuex and it is main file in vuex
// you can find greater examples and explanations in https://vuex.vuejs.org/zh-cn/
import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions'
import * as getters from './getters'
import * as states from './states'
import * as mutations from './mutations'
import home from './modules/home'
import welcome from './modules/welcome'
// import * as mutations from './mutations'
// import tests from './modules/testmodules'

Vue.use(Vuex)

export default new Vuex.Store({
    states,
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
