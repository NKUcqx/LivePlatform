/**
 *Module Store
 *
 *@module Store
 *@requires Utils
 *@class Getters
 *@constructor
 */
import Vue from 'vue'

/**
 *获取用户全部信息
 *@method getUser
 *@return {Object} user
 */
export const getUser = (state) => {
    return state.user
}

/**
 *获取用户id
 *@method getUserId
 *@return {Number}
 */
export const getUserId = (state) => {
    return state.user.userid
}

/**
 *获取用户名
 *@method getUserName
 *@return {String}
 */
export const getUserName = (state) => {
    return state.user.username
}

/**
 *获取用户性别
 *@method getGender
 *@return {String}
 */
export const getGender = (state) => {
    return state.user.gender
}

/**
 *获取用户昵称
 *@method getNickname
 *@return {String}
 */
export const getNickname = (state) => {
    return state.user.nickname
}

/**
 *获取用户头像路径
 *@method getAvatar
 *@return {String}
 */
export const getAvatar = (state) => {
    return state.user.avatar
}

/**
 *获取用户权限角色
 *@method getRole
 *@return {String} 'S'/'T'
 */
export const getRole = (state) => {
    return state.user.role
}

/**
 *获取用户登录状态
 *@method isLogin
 *@return {Boolean}
 */
export const isLogin = (state) => {
    return state.user.isLogin
}

/**
 *获取sessionKey
 *@method getSessionKey
 *@return {String}
 */
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

/**
 *@method hasSession
 *@return {Boolean}
 */
export const hasSession = (state) => {
    return state.session.hasSession
}

export const getSocket = (state) => {
    return state.socket
}