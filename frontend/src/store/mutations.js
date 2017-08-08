export const setUser = (state, {
    user_id, username, gender, avatar, nickname
}, sessionId) => {
    state.user.userid = user_id
    state.user.username = username
    state.user.gender = gender
    state.user.avatar = avatar
    state.user.nickname = nickname
    state.session.sessionId = sessionId
    state.session.isSession = true
}
