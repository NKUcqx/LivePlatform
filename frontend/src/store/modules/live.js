/**
 *Module Store
 *
 *@module Store
 *@requires Utils
 *@class Live
 *@constructor
 */
import Vue from 'vue'
import { beforePost } from '../../utils/utils'

const state = {
    /**
     *标记直播是否开始
     *@property isStart
     *@type Boolean
     *@default false
     */
    isStart: false
}

const getters = {
    /**
     *获取直播是否开始
     *@method isLiveStart
     *@return {Boolean} 返回isStart
     */
    isLiveStart: (state) => {
        return state.isStart
    }
}

const mutations = {
    /**
     *设置直播状态为开始直播
     *@event startLive
     */
    startLive: (state) => {
        state.isStart = true
    },
    /**
     *如果已经开始直播则设置直播状态为结束
     *@event endLive
     */
    endLive: (state) => {
        console.log('in Live.js', state.isStart);
        (state.isStart === true) ? state.isStart = false : ''
    }
}

const actions = {
    /**
     *创建直播房间
     *@event createLive
     *@param {Object} formData 房间名
     */
    createLive: ({ state, commit }, formData) => {
        return new Promise((resolve, reject) => {
            Vue.http({
                url: '/createroom/',
                method: 'POST',
                body: formData,
                before: function (request) { beforePost(request) }
            }).then(function (res) {
                resolve(res)
            }, function (res) {
                reject(res)
            })
        })
    },
    /**
     *关闭直播房间
     *@event destroyLive
     */
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
                reject(res)
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