// 工具函数放在这里
// 用于POST请求之前发送csrf的那个函数
export const beforePost = (request) => {
    function getCookie (name) {
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
    if (!(/^http:.*/.test(request.url) || /^https:.*/.test(request.url))) {
    // Only send the token to relative URLs i.e. locally.
        request.headers.set('X-CSRFToken', getCookie('csrftoken'))
    }
}

export const getListFromDB = (obj) => {
    if (obj == null) {
        return
    }
    for (let key in obj) {
        return obj[key]
    }
}

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

export default {
    beforePost
}
