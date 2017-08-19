import { isJSON, Obj2JSON } from '../../utils/utils'
import { isNotNull } from '../../utils/checks'

const setRoomSessionStorage = (data) => {
    console.log(Obj2JSON(data))
    window.sessionStorage.setItem('roomInfo', Obj2JSON(data))
}

const getRoomSessionStorage = () => {
    console.log(isJSON(window.sessionStorage.getItem('roomInfo')))
    return isJSON(window.sessionStorage.getItem('roomInfo'))
}

const isStorage = () => {
    if (getRoomSessionStorage()) {
        return true
    } else {
        return false
    }
}

const state = {
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
    getRoomInfo: (state) => {
        if (isStorage() && state.roomInfo.id === 0) {
            state.roomInfo = getRoomSessionStorage()
        }
        return state.roomInfo
    },
    getSlideInfo: (state) => {
        return {
            slide_path: state.roomInfo.slide,
            slide_num: state.roomInfo.slide_num
        }
    },
    getRoomId: (state) => {
        return state.roomInfo.id
    }
}

const mutations = {
    setRoomInfo (state, { id,
        creator_nickname,
        audience_amount,
        name,
        creator_id,
        is_living,
        thumbnail_path,
        slide_path,
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
        (isNotNull(file_name)) ? state.roomInfo.room_name = file_name : '';
        (isNotNull(create_time)) ? state.roomInfo.create_time = create_time : ''
        console.log(state.roomInfo)
        setRoomSessionStorage(state.roomInfo)
    },
    emptyRoonInfo (state) {
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