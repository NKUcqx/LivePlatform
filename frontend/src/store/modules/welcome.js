/**
 *Module Store
 *
 *@module Store
 *@requires Utils
 *@class Welcome
 *@constructor
 */
const state = {
    /**
     *欢迎界面走马灯页码
     *@property page
     *@type Number
     *@default 1
     */
    page: 1
}

const getters = {
    /**
     *获取欢迎界面走马灯页码
     *@method getPage
     *@return {Number} page
     */
    getPage: (state) => {
        return state.page
    }
}

const mutations = {
    /**
     *欢迎界面走马灯向左切换
     *@event goLeft
     */
    goLeft: (state) => {
        state.page = (state.page - 1 < 0) ? 2 : state.page - 1
    },
    /**
     *欢迎界面走马灯向右切换
     *@event goRight
     */
    goRight: (state) => {
        state.page = (state.page + 1 > 2) ? 0 : state.page + 1
    }
}

export default {
    state,
    getters,
    mutations
}