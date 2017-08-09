// these files is for vuex but I have not coded in here
// I only make example in moudules because it is more complex
import Vue from 'vue'
import { getSessionKey } from './getters'
import { setSessionState, setUserState } from './mutations'

export const initState = ({ state }) => {
    return new Promise((resolve, reject) => {
        let sessionKey = getSessionKey(state)
        if (sessionKey !== null) {
            Vue.http.get('/getsession/?session_key=' + sessionKey).then(function (res) {
                console.log(res.body.user)
                setSessionState(state, res.body.user, sessionKey)
                resolve()
            }, function (res) {
                reject()
            })
        }
    })
}

export const initUser = ({ state }, data) => {
    console.log(data);
    (data.session_key) ? setSessionState(state, data.user, data.session_key) : setUserState(state, data.user)
}