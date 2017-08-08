import Vue from 'vue'

export const getUser = (state) => {
    return state.user
}

export const getUserId = (state) => {
    return state.user.userid
}

export const getUserName = (state) => {
    return state.user.username
}

export const getGender = (state) => {
    return state.user.gender
}

export const getNickname = (state) => {
    return state.user.nickname
}

export const getAvatar = (state) => {
    return state.user.avatar
}

export const isLogin = (state) => {
    return state.user.isLogin
}

export const getSessionId = (state) => {
    let sessionId = Vue.localStorage.get('session_id')
    if (sessionId !== null && sessionId !== '') {
        state.session.sessionId = sessionId
        state.session.isSession = true
    } else {
        state.session.isSession = false
        state.session.sessionId = null
    }
    return state.session.sessionId
}

export const isSession = (state) => {
    return state.session.isSession
}
