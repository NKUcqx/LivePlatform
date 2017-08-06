import Vue from 'vue'
import { getListFromDB } from '../../utils/utils'

const state = {
    liveRooms: [],
    videoRooms: [],
    showNum: 10,
}

const getters = {
    getLiveRooms: (state) => {
        return state.liveRooms
    },
    getVideoRoom: (state) => {
        return state.videoRooms
    }
}

const mutations = {
    addLiveRoom: (state, newRoom) => {
        state.liveRooms.push(newRoom)
    },
    closeLiveRoom: (state, index) => {
        state.liveRooms.splice(index, 1)
    }
}

const actions = {
    getRoomsFromDB: ({ state, commit }, isLive) => {
        Vue.http({
            url: '/getroom/',
            method: 'GET',
            params: {
                is_living: isLive,
                limit: state.showNum
            }
        }).then(function (res) {
            console.log(getListFromDB(res.body));
            (isLive)? state.liveRooms = getListFromDB(res.body) : state.videoRooms = getListFromDB(res.body)
        }, function () {
            alert("ajax failure")
        })
    },
}

export default {
    state,
    getters,
    actions,
    mutations
}























/*import VueLocalStorage from 'vue-localstorage'
Vue.use(VueLocalStorage)

const debug = process.env.NODE_ENV !== 'production'
const STORAGE_KEY = 'vedios-vuejs'
const state = {
    vedios: JSON.parse(window.localStorage.getItem(STORAGE_KEY) || '[]')
}
const getters = {
    vedios:  state => state.vedios
} 
const mutations = {
    addVedio (state, room , teacher, viewers) {
        state.vedios.push({
            room,
            teacher,
            viewers
        })
    },
    deleteVedio (state, index) {
        state.vedios.splice(index, 1)
    }
}
const localStoragePlugin = store => {
  store.subscribe((mutation, { vedios }) => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(vedios))
  })
}*/