import Vue from 'vue'

export const setSessionState = (state, {
    id, username, gender, avatar, nickname, role
}, sessionKey) => {
    state.user.userid = id
    state.user.username = username
    state.user.gender = gender
    state.user.avatar = avatar
    state.user.nickname = nickname
    state.user.role = role
    state.user.isLogin = true
    state.session.sessionKey = sessionKey
    state.session.hasSession = true
    Vue.localStorage.set('session_key', sessionKey)
}

export const setUserState = (state, {
    id, username, gender, avatar, nickname, role
}) => {
    state.user.userid = id
    state.user.username = username
    state.user.gender = gender
    state.user.avatar = avatar
    state.user.nickname = nickname
    state.user.isLogin = true
    state.user.role = role
}

export const emptyUser = (state) => {
    state.user.userid = ''
    state.user.username = ''
    state.user.gender = 0
    state.user.avatar = ''
    state.user.nickname = ''
    state.user.role = 'S'
    state.user.isLogin = false
    state.session.sessionKey = ''
    state.session.hasSession = false
    Vue.localStorage.set('session_key', null)
}

export const setAvatar = (state, url) => {
    if (state.user.isLogin) {
        state.user.avatar = url
    }
}