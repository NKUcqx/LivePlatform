// these files is for vuex but I have not coded in here
// I only make example in moudules because it is more complex
import Vue from 'vue'
import { getSessionId } from './getters'
import { setUser } from './mutations'

export const initSession = (state) => {
    if (getSessionId() !== null) {
        Vue.http({
            url: '/getSession/',
            method: 'POST'
        }).then(function (res) {
            setUser(res.body)
        }, function (res) {
            alert(res.body)
        })
    }
}
