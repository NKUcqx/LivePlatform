/**
 *Module Store
 *
 *@module Store
 *@requires Utils
 *@class Index
 *@constructor
 */
import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions'
import * as getters from './getters'
import * as mutations from './mutations'
import home from './modules/home'
import welcome from './modules/welcome'
import live from './modules/live'
import progress from './modules/progress'
import room from './modules/room'
// import * as mutations from './mutations'
// import tests from './modules/testmodules'

Vue.use(Vuex)

const state = {
    /**
     *@property session
     *@type {Object}
     *@default {hasSession: false, sessionKey: null}
     */
    session: {
        hasSession: false,
        sessionKey: null
    },
    /**
     *用户信息，包括userid、username、nickname、avatar、gender、isLogin、role
     *@property user
     *@type {Object}
     */
    user: {
        userid: null,
        username: null,
        nickname: '',
        avatar: null,
        gender: '',
        isLogin: false,
        role: 'S'
    },
    socket: null
}

export default new Vuex.Store({
    state,
    actions,
    getters,
    mutations,
    modules: {
        welcome,
        home,
        live,
        progress,
        room
    }
    /* :debug,
    plugins: [localStoragePlugin] */
})
