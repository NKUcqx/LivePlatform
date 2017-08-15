const state = {
    isStart: false
    /* isPlay: false,
    isSilence: false */
}

const getters = {
    getLiveState: (state) => {
        return state
    }
    /* // 0 means silence 1 means have sound
    getSoundState: (state) => {
        return (state.isSilence) ? 0 : 1
    } */
}

const mutations = {
    startLive: (state) => {
        state.isStart = true
        state.isPlay = true
    },
    /* pauseLive: (state) => {
        state.isPlay = false
    },
    replayLive: (state) => {
        state.isPlay = (state.isStart) ? true : false
    },
    SilenceLive: (state) => {
        state.isSilence = (state.isStart) ? true : false
    },
    speakLive: (state) => {
        state.isSilence = false
    }, */
    endLive: (state) => {
        state.isStart = false
        state.isPlay = false
        state.isSilence = false
    }
}

export default {
    state,
    getters,
    mutations
}