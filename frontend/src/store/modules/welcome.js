const state = {
    page: 1
}

const getters = {
    getPage: (state) => {
        return state.page
    }
}

const mutations = {
    goLeft: (state) => {
        state.page = (state.page-1 < 0)? 2 : state.page-1
    },
    goRight: (state) => {
        state.page = (state.page+1 > 2)? 0 : state.page+1
    }
}


export default {
    state,
    getters,
    mutations,
}