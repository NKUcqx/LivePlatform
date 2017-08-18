// these files is for vuex but I have not coded in here
// I only make example in moudules because it is more complex
import Vue from 'vue'
import { getSessionKey } from './getters'
import { setSessionState, setUserState, emptyUser } from './mutations'
import { beforePost } from '../utils/utils'
import { CONST } from '../utils/const'

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

const initUser = ({ state }, data) => {
    console.log(data)
    if (!data.user) {
        emptyUser(state)
    } else {
        ((data.session_key) ? setSessionState(state, data.user, data.session_key) : setUserState(state, data.user))
    }
}

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

export const login = async ({ state }, data) => {
    return commitPostRequest(state, '/login/', data)
}

export const findBackPass = async ({ state }, data) => {
    return commitPostRequest(state, '/changepass/', data)
}

export const signup = async ({ state }, data) => {
    return commitPostRequest(state, '/signup/', data)
}

export const changePass = async ({ state }, data) => {
    return commitPostRequest(state, '/changepass/', data)
}

export const changeInfo = async ({ state }, data) => {
    return commitPostRequest(state, '/changeinfo/', data)
}

export const logout = async ({ state }) => {
    return commitPostRequest(state, '/logout/', {})
}

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