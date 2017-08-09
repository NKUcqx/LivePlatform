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

export const getSessionKey = (state) => {
    let sessionKey = Vue.localStorage.get('session_key')
    if (sessionKey !== null && sessionKey !== '') {
        state.session.sessionKey = sessionKey
        state.session.hasSession = true
    } else {
        state.session.hasSession = false
        state.session.sessionKey = null
    }
    return state.session.sessionKey
}

export const hasSession = (state) => {
    return state.session.hasSession
}
