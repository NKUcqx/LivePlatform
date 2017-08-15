import Vue from 'vue'
import { beforePost } from '../../utils/utils'

const state = {
    isStart: false
}

const getters = {
    getLiveState: (state) => {
        return state
    }
}

const mutations = {
    startLive: (state) => {
        state.isStart = true
    },
    endLive: (state) => {
        (state.isStart === true) ? state.isStart = false : ''
    }
}

const actions = {
    BeginLive: (staet) => {

    },
    destroyLive: ({ state, commit }) => {
        return new Promise((resolve, reject) => {
            Vue.http({
                url: '/endroom/',
                method: 'POST',
                before: function (request) { beforePost(request) }
            }).then(function (res) {
                console.log('endroom')
                resolve()
                commit('endLive')
            }, function (res) {
                reject()
            })
        })
    }
}

export default {
    state,
    getters,
    mutations,
    actions
}