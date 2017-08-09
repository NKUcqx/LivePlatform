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