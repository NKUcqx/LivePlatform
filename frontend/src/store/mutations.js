import Vue from 'vue'

export const setUser = (state, {
    userId, username, gender, avatar, nickname
}, sessionId) => {
    state.user.userid = userId
    state.user.username = username
    state.user.gender = gender
    state.user.avatar = avatar
    state.user.nickname = nickname
    state.session.sessionId = sessionId
    state.session.isSession = true
    Vue.localStorage.set('session_id', sessionId)
}
