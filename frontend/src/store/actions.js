/**
 *Module Store
 *
 *@module Store
 *@requires Utils
 *@class Actions
 *@constructor
 */
import Vue from 'vue'
import { getSessionKey } from './getters'
import { setSessionState, setUserState, emptyUser } from './mutations'
import { beforePost } from '../utils/utils'
import { CONST } from '../utils/const'

/**
 *通过向后端请求根据sessionKey初始化用户信息
 *@method initState
 *@return {Object} promise
 */
export const initState = ({ state }) => {
    return new Promise((resolve, reject) => {
        let sessionKey = getSessionKey(state)
        if (sessionKey !== null) {
            Vue.http.get('/getsession/?session_key=' + sessionKey).then(function (res) {
                console.log(res.body.user)
                setSessionState(state, res.body.user, sessionKey)
                resolve()
            }, function (res) {
                reject(res)
            })
        } else {
            reject()
        }
    })
}

/**
 *通过传入的data初始化用户信息
 *@event initUser
 *@param {Object} data 包括user和session_key
 */
const initUser = ({ state }, data) => {
    console.log(data)
    if (!data.user) {
        emptyUser(state)
    } else {
        ((data.session_key) ? setSessionState(state, data.user, data.session_key) : setUserState(state, data.user))
    }
}

/**
 *封装好的向后端请求的通用函数
 *@method commitPostRequest
 *@param {String} url
 *@param {Object} data
 *@return {Object} promise
 */
const commitPostRequest = (state, url, data) => {
    return new Promise((resolve, reject) => {
        Vue.http({
            url: url,
            method: 'POST',
            body: data,
            before: function (request) { beforePost(request) }
        }).then(function (res) {
            initUser({ state }, res.body)
            resolve()
        }, function (res) {
            reject(res.body)
        })
    })
}

/**
 *登录请求
 *@method login
 *@param {Object} data
 *@return {Object} promise
 */
export const login = async ({ state }, data) => {
    return commitPostRequest(state, '/login/', data)
}

/**
 *找回密码请求
 *@method findBackPass
 *@param {Object} data
 *@return {Object} promise
 */
export const findBackPass = async ({ state }, data) => {
    return commitPostRequest(state, '/changepass/', data)
}

/**
 *注册请求
 *@method signup
 *@param {Object} data
 *@return {Object} promise
 */
export const signup = async ({ state }, data) => {
    return commitPostRequest(state, '/signup/', data)
}

/**
 *修改密码请求
 *@method changePass
 *@param {Object} data
 *@return {Object} promise
 */
export const changePass = async ({ state }, data) => {
    return commitPostRequest(state, '/changepass/', data)
}

/**
 *修改个人信息请求
 *@method changeInfo
 *@param {Object} data
 *@return {Object} promise
 */
export const changeInfo = async ({ state }, data) => {
    return commitPostRequest(state, '/changeinfo/', data)
}

/**
 *注销请求
 *@method logout
 *@return {Object} promise
 */
export const logout = async ({ state }) => {
    return commitPostRequest(state, '/logout/', {})
}

/**
 *检测用户名是否存在
 *@method testUsername
 *@param {Object} data
 *@return {Object} promise
 */
export const testUsername = async ({ state }, data) => {
    return new Promise((resolve, reject) => {
        Vue.http.get('/testusername?username=' + data.username).then(function (res) {
            if (res.status === 200 && data.father === 'signup') {
                reject(true)
            } else {
                resolve()
            }
        }, function (res) {
            if (res.status === 401 && data.father === 'login') {
                reject(false)
            } else {
                resolve()
            }
        })
    })
}