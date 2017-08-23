/**
 *Module Store
 *
 *@module Store
 *@requires Utils
 *@class Room
 *@constructor
 */
import { isJSON, Obj2JSON } from '../../utils/utils'
import { isNotNull } from '../../utils/checks'

/**
 *将房间信息存入sessionStorage
 *@event setRoomSessionStorage
 *@param {Object} data roomInfo
 */
const setRoomSessionStorage = (data) => {
    window.sessionStorage.setItem('roomInfo', Obj2JSON(data))
}

/**
 *从sessionStorage中取房间信息
 *@method getRoomSessionStorage
 *@return {String} 从JSON格式转成字符串的roomInfo
 */
const getRoomSessionStorage = () => {
    console.log(isJSON(window.sessionStorage.getItem('roomInfo')))
    return isJSON(window.sessionStorage.getItem('roomInfo'))
}

/**
 *判断sessionStorage中是否有房间信息
 *@method isStorage
 *@return {Boolean}
 */
const isStorage = () => {
    if (getRoomSessionStorage()) {
        return true
    } else {
        return false
    }
}

const state = {
    /**
     *房间信息（id、title、teacher/教师昵称、audience/在线人数、
     *room_name、creator_id、is_living、img/缩略图路径、slide/幻灯片路径、
     *create_time、slide_num/幻灯片张数
     *@property roomInfo
     *@type Object
     */
    roomInfo: {
        id: 0,
        title: 'Welcome To Our World',
        teacher: 'gongyansongisgood',
        audience: 3000,
        room_name: '',
        creator_id: 0,
        is_living: false,
        img: '',
        slide: '',
        create_time: '',
        slide_num: ''
    }
}

const getters = {
    /**
     *获取房间信息
     *@method getRoomInfo
     *@return {Object} roomInfo
     */
    getRoomInfo: (state) => {
        if (isStorage() && state.roomInfo.id === 0) {
            state.roomInfo = getRoomSessionStorage()
        }
        return state.roomInfo
    },
    /**
     *获取幻灯片信息
     *@method getSlideInfo
     *@return {Object} 返回的对象中包括slide_path和slide_num
     */
    getSlideInfo: (state) => {
        return {
            slide_path: state.roomInfo.slide,
            slide_num: state.roomInfo.slide_num
        }
    },
    /**
     *获取MediaPlayer信息
     *@method getPlayerInfo
     *@return {Object} 返回的对象中包括create_time和id
     */
    getPlayerInfo: (state) => {
        return {
            create_time: state.roomInfo.create_time,
            id: state.roomInfo.id
        }
    },
    /**
     *获取房间id
     *@method getRoomId
     *@return {Number} roomInfo.id
     */
    getRoomId: (state) => {
        return state.roomInfo.id
    }
}

const mutations = {
    /**
     *设置房间信息并存入sessionStorage
     *@event setRoomInfo
     *@param {Object} 包括id、creator_nickname(对应teacher)、audience_amount、
     *name(对应title)、creator_id、is_living、thumbnail_path、slide_path、
     *file_name(对应room_name)、create_time
     */
    setRoomInfo (state, { id,
        creator_nickname,
        audience_amount,
        name,
        creator_id,
        is_living,
        thumbnail_path,
        slide_path,
        slide_num,
        file_name,
        create_time }) {
        (isNotNull(id)) ? state.roomInfo.id = id : '';
        (isNotNull(creator_nickname)) ? state.roomInfo.teacher = creator_nickname : '';
        (isNotNull(audience_amount)) ? state.roomInfo.audience = audience_amount : '';
        (isNotNull(name)) ? state.roomInfo.title = name : '';
        (isNotNull(creator_id)) ? state.roomInfo.creator_id = creator_id : '';
        (isNotNull(is_living)) ? state.roomInfo.is_living = is_living : '';
        (isNotNull(thumbnail_path)) ? state.roomInfo.img = thumbnail_path : '';
        (isNotNull(slide_path)) ? state.roomInfo.slide = slide_path : '';
        (isNotNull(slide_num)) ? state.roomInfo.slide_num = slide_num : '';
        (isNotNull(file_name)) ? state.roomInfo.room_name = file_name : '';
        (isNotNull(create_time)) ? state.roomInfo.create_time = create_time : ''
        console.log(state.roomInfo)
        setRoomSessionStorage(state.roomInfo)
    },
    /**
     *清空房间信息并清空sessionStorage
     *@event emptyRoomInfo
     */
    emptyRoomInfo (state) {
        state.roomInfo.id = 0
        state.roomInfo.teacher = ''
        state.roomInfo.audience = 0
        state.roomInfo.title = ''
        state.roomInfo.creator_id = 0
        state.roomInfo.is_living = false
        state.roomInfo.img = ''
        state.roomInfo.slide = ''
        state.roomInfo.room_name = ''
        state.roomInfo.create_time = ''
        setRoomSessionStorage(null)
    }
}

export default {
    state,
    getters,
    mutations
}