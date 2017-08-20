/**
 * Module Store
 *
 * @module Store
 * @requires Utils
 * @class Progress
 * @constructor
 */
const state = {
    /**
     *标记录播状态
     *@property isPlay
     *@type Boolean
     *@default false
     */
    isPlay: false,
    /**
     *@property currentTime
     *@type Number
     *@default 0
     */
    currentTime: 0,
    /**
     *@property totalTime
     *@type Number
     *@default 0
     */
    totalTime: 0
}

const getters = {
    /**
     *获取录播页面状态
     *@method getPlayState
     *@return {Boolean} 返回isPlay
     */
    getPlayState: (state) => {
        return state.isPlay
    },
    /**
     *获取录播当前时间
     *@method getCurrentTime
     *@return {Number}
     */
    getCurrentTime: (state) => {
        return state.currentTime
    },
    /**
     *获取录播总时长
     *@method getTotalTime
     *@return {Number}
     */
    getTotalTime: (state) => {
        return state.totalTime
    }
}

const mutations = {
    /**
     *设置录播页面状态
     *@event setPlayState
     *@param {Boolean} newPlayState
     */
    setPlayState: (state, newPlayState) => {
        state.isPlay = newPlayState
    },
    /**
     *设置录播当前时间
     *@event setCurrentTime
     *@param {Number} newCurrent
     */
    setCurrentTime: (state, newCurrent) => {
        state.currentTime = newCurrent
    },
    /**
     *设置录播总时长
     *@event setTotalTime
     *@param {Number} newTotal
     */
    setTotalTime: (state, newTotal) => {
        state.totalTime = newTotal
    }
}

export default {
    state,
    getters,
    mutations
}