import Vue from 'vue'

export const setSessionState = (state, {
    id, username, gender, avatar, nickname
}, sessionKey) => {
    state.user.userid = id
    state.user.username = username
    state.user.gender = gender
    state.user.avatar = avatar
    state.user.nickname = nickname
    state.user.isLogin = true
    state.session.sessionKey = sessionKey
    state.session.hasSession = true
    Vue.localStorage.set('session_key', sessionKey)
}

export const setUserState = (state, {
    id, username, gender, avatar, nickname
}) => {
    state.user.userid = id
    state.user.username = username
    state.user.gender = gender
    state.user.avatar = avatar
    state.user.nickname = nickname
    state.user.isLogin = true
}

export const emptyUser = (state) => {
    state.user.userid = ''
    state.user.username = ''
    state.user.gender = 0
    state.user.avatar = ''
    state.user.nickname = ''
    state.user.isLogin = false
    state.session.sessionKey = ''
    state.session.hasSession = false
    Vue.localStorage.set('session_key', null)
}