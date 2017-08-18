const state = {
    isPlay: false,
    currentTime: 0,
    totalTime: 0
}

const getters = {
    getPlayState: (state) => {
        return state.isPlay
    },
    getCurrentTime: (state) => {
        return state.currentTime
    },
    getTotalTime: (state) => {
        return state.totalTime
    }
}

const mutations = {
    setPlayState: (state, newPlayState) => {
        state.isPlay = newPlayState
    },
    setCurrentTime: (state, newCurrent) => {
        state.currentTime = newCurrent
    },
    setTotalTime: (state, newTotal) => {
        state.totalTime = newTotal
    }
}

export default {
    state,
    getters,
    mutations
}