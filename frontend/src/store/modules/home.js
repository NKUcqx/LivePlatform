import Vue from 'vue'
import { getListFromDB } from '../../utils/utils'

const state = {
    liveRooms: [],
    videoRooms: [],
    showNum: 10
}

const getters = {
    getLiveRooms: (state) => {
        return state.liveRooms
    },
    getVideoRooms: (state) => {
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
            (isLive) ? state.liveRooms = getListFromDB(res.body) : state.videoRooms = getListFromDB(res.body)
            console.log(res.body)
        }, function () {
            alert('ajax failure')
        })
    }
}

export default {
    state,
    getters,
    actions,
    mutations
}