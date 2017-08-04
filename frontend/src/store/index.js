//this is for vuex and it is main file in vuex
//you can find greater examples and explanations in https://vuex.vuejs.org/zh-cn/

import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions'
//import * as getters from './getters'
import * as states from './states'
//import * as mutations from './mutations'
import tests from './modules/testmodules'

Vue.use(Vuex)

//I don't know what this can do,maybe use for debug I guess
//this come from document from offcial web of vue
import VueLocalStorage from 'vue-localstorage'
Vue.use(VueLocalStorage)

const debug = process.env.NODE_ENV !== 'production'
const STORAGE_KEY = 'vedios-vuejs'
const state = {
    vedios: JSON.parse(window.localStorage.getItem(STORAGE_KEY) || '[]')
}
const getters = {
    vedios:  state => state.vedios
} 
const mutations = {
    addVedio (state, room , teacher, viewers) {
        state.vedios.push({
            room,
            teacher,
            viewers
        })
    },
    deleteVedio (state, index) {
        state.vedios.splice(index, 1)
    }
}
const localStoragePlugin = store => {
  store.subscribe((mutation, { vedios }) => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(vedios))
  })
}
export default new Vuex.Store({
  state,
  actions,
  getters,
  mutations,
  modules: {
    tests,
  },
  strict: debug,
  plugins: [localStoragePlugin]
})
