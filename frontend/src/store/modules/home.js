import Vue from 'vue'
import { getListFromDB } from '../../utils/utils'

const state = {
    liveRooms: [],
    videoRooms: [],
    mostPopular: [],
    roomAmount: {
        liveAmount: 0,
        videoAmount: 0
    },
    showNum: 8
}

const getters = {
    getLiveRooms: (state) => {
        return state.liveRooms
    },
    getVideoRooms: (state) => {
        return state.videoRooms
    },
    getRoomAmount: (state) => {
        return state.roomAmount
    },
    getPageSize: (state) => {
        return state.showNum
    },
    getMostPopular: (state) => {
        return state.mostPopular
    }
}

const mutations = {
    addLiveRoom: (state, newRoom) => {
        state.liveRooms.push(newRoom)
    },
    closeLiveRoom: (state, index) => {
        state.liveRooms.splice(index, 1)
    },
    addMostPopular: (state) => {
        state.mostPopular = state.liveRooms.slice(0, 4)
    }
}

const actions = {
    getRoomsFromDB: ({ state, commit }, { isLive, start = 0 }) => {
        console.log(start)
        Vue.http({
            url: '/getroom/',
            method: 'GET',
            params: {
                is_living: isLive,
                limit: state.showNum,
                start: start,
                order_by: (isLive) ? '-audience_amount' : '-end_time'
            }
        }).then(function (res) {
            (isLive) ? state.liveRooms = getListFromDB(res.body) : state.videoRooms = getListFromDB(res.body);
            (start === 0) ? commit('addMostPopular') : ''
            console.log(res.body)
        }, function () {
            alert('ajax failure')
        })
    },
    getRoomAmountFromDB: ({ state }) => {
        Vue.http({
            url: '/getroomamount/',
            method: 'GET'
        }).then(function (res) {
            state.roomAmount.liveAmount = res.body.living_amount
            state.roomAmount.videoAmount = res.body.end_amount
        }, function (res) {
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