/**
 *Module Store
 *
 *@module Store
 *@requires Utils
 *@class Getters
 *@constructor
 */
import Vue from 'vue'
import io from 'socket.io-client'

/**
 *设置session并将sessionKey存入localStorage
 *@event setSessionState
 *@param {Object} user 包括id、username、gender、avatar、nickname、role
 *@param {String} sessionKey
 */
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

/**
 *设置用户信息
 *@event setUserState
 *@param {Object} user 包括id、username、gender、avatar、nickname、role
 */
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

/**
 *清空用户信息并将localStorage中的session_key置为null
 *@event emptyUser
 */
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

/**
 *设置头像路径
 *@event setAvatar
 *@param {String} url
 */
export const setAvatar = (state, url) => {
    if (state.user.isLogin) {
        state.user.avatar = url
    }
}

export const setSocket = (state) => {
    state.socket = io('http://192.168.1.144:8002', {transports: ['websocket'], upgrade: false})
}