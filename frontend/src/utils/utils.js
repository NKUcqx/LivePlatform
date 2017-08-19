// 工具函数放在这里
// 用于POST请求之前发送csrf的那个函数

/**
 * Module utils
 *
 * @module utils
 * @class utils
 * @constructor
 */

/**
 *获取储存在用户本地终端上的数据，返回cookieValue
 *@method getCookie
 *@param {string} name
 *@return {string|null} 返回cookieValue,如果不存在就返回null
 *@example
 * // getcookie1为null
 * var getcookie1 = getCookie('csrftoken')
 * // getcookie2为null
 * var getcookie2 = getCookie('xxx')
 */
export const getCookie = (name) => {
    let cookieValue = null
    if (document.cookie && document.cookie !== '') {
        let cookies = document.cookie.split(';')
        for (let i = 0; i < cookies.length; i++) {
            let cookie = (new String(cookies[i])).trim()
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1))
                break
            }
        }
    }
    return cookieValue
}

/**
 *防御CSRF攻击
 *@event beforePost
 *@param {object} request
 */
export const beforePost = (request) => {
    if (!(/^http:.*/.test(request.url) || /^https:.*/.test(request.url))) {
    // Only send the token to relative URLs i.e. locally.
        request.headers.set('X-CSRFToken', getCookie('csrftoken'))
    }
}

/**
 *从数据库获取信息
 *@event getListFromDB
 *@param {object} obj
 *@return {object} 返回数据库中的信息
 *@example
 * // res1.id为1
 * var res1 = getListFromDB({
 *     key: {id: 1}
 * })
 * // res2.id为1
 * var res2 = getListFromDB({
 *     key1: {id: 1},
 *     key2: {id: 2}
 * })
 * // res3为null
 * var res3 = getListFromDB(null)
 */
export const getListFromDB = (obj) => {
    if (obj == null) {
        return
    }
    for (let key in obj) {
        return obj[key]
    }
}

/**
 *如果是JSON字符串，那么返回给定 JSON 字符串转换后的对象
 *@method isJSON
 *@param {string} str
 *@return {object|boolean} 返回给定 JSON 字符串str转换后的对象
 *@example
 * // res1.a为"Hello",res1.b为"World"
 * var res1 =isJSON('{"a": "Hello", "b": "World"}')
 * // res2为false
 * var res2 = isJSON('Hello World')
 * // res3为false
 * var res3 = isJSON(123)
 */
export const isJSON = (str) => {
    console.log('thisis test:    ' + str)
    let result = false
    if (Object.prototype.toString.call(str) === '[object String]') {
        try {
            result = JSON.parse(str)
        } catch (e) {
            console.log(e)
            result = false
        }
    }
    return result
}

export const Obj2JSON = (obj) => {
    console.log((typeof obj))
    let result = false
    if ((typeof obj) === 'object') {
        try {
            result = JSON.stringify(obj)
        } catch (e) {
            console.log(e)
            result = false
        }
    }
    return result
}

export const getFormatTime = (inTime) => {
    let time = inTime || 0
    let h = parseInt(time / 3600)
    let m = parseInt(time % 3600 / 60)
    let s = parseInt(time % 60)
    h = h < 10 ? '0' + h : h
    m = m < 10 ? '0' + m : m
    s = s < 10 ? '0' + s : s
    return h + ':' + m + ':' + s
}

export const getFormatDate = (inDate) => {
    let date = inDate.split(' ')[0].split('-')
    let year = date[0]
    let month = date[1]
    let day = date[2]
    if (month.length === 1) {
        month = '0' + month
    }
    return year + month + day
}

export const getFileNameFromPath = (path) => {
    let strArray = path.split('/')
    return strArray[strArray.length - 1]
}