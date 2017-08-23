import Vue from 'vue'
import { getListFromDB } from '../../utils/utils'

/**
 * Module Store
 *
 * @module Store
 * @requires Utils
 * @class Home
 * @constructor
 */
const state = {
    /**
     *@property liveRooms
     *@type []
     */
    liveRooms: [],
    /**
     *@property videoRooms
     *@type []
     */
    videoRooms: [],
    /**
     *@property mostPopular
     *@type []
     */
    mostPopular: [],
    /**
     *@property roomAmount{liveAmount,videoAmount}
     *@type {Number,Number}
     */
    roomAmount: {
        liveAmount: 0,
        videoAmount: 0
    },
    /**
     *@property showNum
     *@type Number
     */
    showNum: 8
}

const getters = {
    /**
     *获取直播房间
     *@method getLiveRooms
     *@return {list} 返回现有的直播房间
     *@example
     * // room为[room1,room2]
     *
     * var room = getLiveRooms({liveRooms:[room1,room2]})
     */
    getLiveRooms: (state) => {
        return state.liveRooms
    },
    /**
     *获取录播房间
     *@method getVideoRooms
     *@return {list} 返回现有的录播房间
     *@example
     * // room为[room1,room2]
     *
     * var room = getVideoRooms({videoRooms:[room1,room2]})
     */
    getVideoRooms: (state) => {
        return state.videoRooms
    },
    /**
     *获取房间数量
     *@method getRoomAmount
     *@return {Number} 返回房间数量
     *@example
     * // roomamount为8
     *
     * var roomamount = getVideoRooms({roomAmount:8})
     */
    getRoomAmount: (state) => {
        return state.roomAmount
    },
    /**
     *获取每一页的房间数
     *@method getPageSize
     *@return {Number} 返回每一页的房间数
     *@example
     * // roomamount为8
     *
     * var roomamount = getVideoRooms({showNum: 8)
     */
    getPageSize: (state) => {
        return state.showNum
    },
    /**
     *获取最受欢迎的四个直播
     *@method getMostPopular
     *@return {list} 返回最受欢迎的四个直播
     *@example
     * // popularroom为[room3,room2,room1,room4]
     *
     * var popularroom = getMostPopular({mostPopular: [room3,room2,room1,room4])
     */
    getMostPopular: (state) => {
        return state.mostPopular
    }
}

const mutations = {
    /**
     *增加一个直播房间
     *@event addLiveRoom
     *@param {object} newRoom
     *@example
     * // state.liveRooms原先为[],执行后state.liveRooms为[room1]
     *
     * getMostPopular(state,room1)
     */
    addLiveRoom: (state, newRoom) => {
        state.liveRooms.push(newRoom)
    },
    /**
     *关闭一个直播房间
     *@event addLiveRoom
     *@param {Number} index
     *@example
     * // state.liveRooms原先为[room1,room2,room3],执行后state.liveRooms为[room1,room3]
     *
     * closeLiveRoom(state,1)
     */
    closeLiveRoom: (state, index) => {
        state.liveRooms.splice(index, 1)
    },
    /**
     *更新最受欢迎的四个房间
     *@event addMostPopular
     *@example
     * // state.liveRooms为[room1,room2,room3,room5,room4],执行后state.mostPopular为[room1,room2,room3,room5]
     *
     * addMostPopular(state)
     */
    addMostPopular: (state) => {
        state.mostPopular = state.liveRooms.slice(0, 4)
    },
    /**
     *设置显示页数
     *@event setPageSize
     *@param {Number} num
     */
    setPageSize: (state, num) => {
        state.showNum = num
    }
}

const actions = {
    /**
     *从数据库获取房间信息(包括直播和录播的信息，分别放到state.liveRooms和state.videoRooms里)
     *@event getRoomsFromDB
     *@param {object} {isLive,[start = 0]}
     */
    getRoomsFromDB: ({ state, commit }, { isLive, start = 0 }) => {
        console.log(start)
        Vue.http({
            url: '/getroom/',
            method: 'GET',
            params: {
                is_living: isLive,
                limit: state.showNum,
                start: start,
                order_by: (isLive) ? '-audience_amount' : '-create_time'
            }
        }).then(function (res) {
            (isLive) ? state.liveRooms = getListFromDB(res.body) : state.videoRooms = getListFromDB(res.body);
            (start === 0) ? commit('addMostPopular') : ''
            console.log(res.body)
        }, function () {
            //alert('getRoomsFrom DBajax failure')
        })
    },
    /**
     *从数据库获取直播和录播各有多少房间
     *@event getRoomAmountFromDB
     */
    getRoomAmountFromDB: ({ state }) => {
        Vue.http({
            url: '/getroomamount/',
            method: 'GET'
        }).then(function (res) {
            state.roomAmount.liveAmount = res.body.living_amount
            state.roomAmount.videoAmount = res.body.end_amount
        }, function (res) {
            //alert('getRoomAmountFromDB ajax failure')
        })
    },
    checkEnter: ({state}, {user_id, room_id}) => {
        Vue.http({
            url: '/checkpermission/',
            method: 'GET',
            params: {
                user_id: user_id,
                room_id: room_id,
                punishment: 'K'
            }
        }).then(function (res) {
            window.open('/#/studio')
        }, function () {
            alert('You can\'t enter the room where you get kicked !')
        })
    }
}

export default {
    state,
    getters,
    actions,
    mutations
}