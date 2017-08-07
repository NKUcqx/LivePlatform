import Vue from 'vue'

// 测试一个字符串是否含有特殊字符
export const checkSpecialChar = (str) => {
    let pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）――|{}【】‘；：”“'。，、？]")
    if (str !== '' && str !== null) {
        if (pattern.test(str)) {
            return false
        }
    }
    return true
}

export const checkPhone = (phone) => {
    let phoneRe = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/
    return phoneRe.test(phone)
}

export const checkEmail = (email) => {
    let emailRe = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/
    return emailRe.test(email)
}

export const checkObjLegal = (obj) => {
    for (let item in obj) {
        if (Object.prototype.toString.call(item) === '[object String]') {
            if (item === '' || !checkSpecialChar(item)) {
                return false
            }
        }
    }
    return true
}

export const checkPassword = (rule, value, callback, rePass, obj, rePassProp) => {
    if (value === '') {
        callback(new Error('please input password'))
    } else {
        if (rePass !== '') {
            // 对第二个密码框单独验证
            obj.validateField(rePassProp)
        }
        callback()
    }
}

export const checkRePassword = (rule, value, callback, password) => {
    if (value === '') {
        callback(new Error('please repeat password'))
    } else if (value !== password) {
        callback(new Error('not same as before'))
    } else {
        callback()
    }
}

export const checkVerification = (rule, value, callback, code) => {
    if (code === '' || value.toString().toLowerCase() !== code.toString().toLowerCase()) {
        callback(new Error('verification error'))
    } else {
        callback()
    }
}

export const checkUsername = (rule, value, callback, status) => {
    Vue.http.get('/testusername?username=' + value).then(function (res) {
       if (res.status === 200 && status === 'signup'){
            callback(new Error('username does exist!'))
        }
        else {
            callback()
        }
    }, function (res) {
        if (res.status === 401 && status === 'login'){
            callback(new Error('username never exists!'))
        }
        else {
            callback()
        }
    })
}

export const checkForm = (obj, formRef) => {
    let result = ''
    formRef.validate((valid) => {
        result = valid
        if (valid) {
            obj.$Message.success('Form legal')
        } else {
            obj.$Message.error('Form illegal')
        }
    })
    return result
}

export default {
    checkSpecialChar
}