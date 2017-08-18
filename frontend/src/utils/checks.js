/**
 * Module check
 *
 * @module check
 */
import Vue from 'vue'

/**
 * 测试类；
 * @class check
 * @constructor
 */

// 测试一个字符串是否含有特殊字符
/**
 *测试一个字符串是否含有特殊字符
 *@method checkSpecialChar
 *@param {string} str 字符串
 *@return {boolean} 返回是否含有特殊字符
 *@example
 * // string1为真
 * var string1 = checkSpecialChar('123dfg')
 * // string2为假
 * var string2 = checkSpecialChar('$145sdf')
 */
export const checkSpecialChar = (str) => {
    let pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）――|{}【】‘；：”“'。，、？]")
    if (str === '' || str === null || str === undefined) {
        return false
    } else if (pattern.test(str)) {
        return false
    }
    return true
}

/**
 *测试一个字符串是否是一个手机号
 *@method checkPhone
 *@param {string} phone 手机号
 *@return {boolean} 返回这个字符串是否符合手机号规范
 *@example
 * // phone1为假
 * var phone1 = checkPhone('12356667')
 * // phone2为真
 * var phone2 = checkPhone('18923458765')
 */
export const checkPhone = (phone) => {
    let phoneRe = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/
    return phoneRe.test(phone)
}

/**
 *测试一个字符串是否是一个email
 *@method checkEmail
 *@param {string} email Email账号
 *@return {boolean} 返回这个字符串是否符合Email账号规范
 */
export const checkEmail = (email) => {
    let emailRe = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
    return emailRe.test(email)
}

/**
 *测试一个对象是否有效
 *@method checkObjLegal
 *@param {object} obj 对象名
 *@return {boolean} 返回这个对象是否有效
 *@example
 * // 对象中字符串合法返回true,obj1为真
 * var obj1 = checkObjLegal({id: 123, name: 'my123'})
 * // 对象中字符串含特殊字符返回false,obj2为假
 * var obj2 = checkObjLegal({id: 123, name: 'my&123'})
 */
export const checkObjLegal = (obj) => {
    for (let item in obj) {
        if (Object.prototype.toString.call(obj[item]) === '[object String]') {
            if (!checkSpecialChar(obj[item])) {
                return false
            }
        }
    }
    return true
}

/**
 *测试密码
 *@event checkPassword
 *@param {object} rule 包含user，password和pin
 *@param {string} value 输入的值
 *@param {function} callback 回调函数
 *@param {string} rePass 重设密码的值
 *@param {object} obj 重设密码的对象
 *@param {object} rePassProp 重设密码的prop验证
 */
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

/**
 *测试第二次输入密码
 *@event checkRePassword
 *@param {object} rule 包含user，password和pin
 *@param {string} value 输入的值
 *@param {function} callback 回调函数
 *@param {string} password 第一次输入密码的值
 */
export const checkRePassword = (rule, value, callback, password) => {
    if (value === '') {
        callback(new Error('please repeat password'))
    } else if (value !== password) {
        callback(new Error('not same as before'))
    } else {
        callback()
    }
}

/**
 *测试验证码
 *@event checkVerification
 *@param {object} rule 包含user，password和pin
 *@param {string} value 输入的值
 *@param {function} callback 回调函数
 *@param {string} code 验证码的值
 */
export const checkVerification = (rule, value, callback, code) => {
    if (code === '' || value.toString().toLowerCase() !== code.toString().toLowerCase()) {
        callback(new Error('verification error'))
    } else {
        callback()
    }
}

/**
 *测试用户名是否已存在（用于注册和登录），如果注册时已存在，显示username does exist!，
 *如果登录时不存在，显示username never exists!
 *@event checkUsername
 *@param {object} rule 包含user，password和pin
 *@param {string} value 输入的值
 *@param {function} callback 回调函数
 *@param {string} status 判断是登陆还是注册
 */
export const checkUsername = (rule, value, callback, status) => {
    Vue.http.get('/testusername?username=' + value).then(function (res) {
        if (res.status === 200 && status === 'signup') {
            callback(new Error('username does exist!'))
        } else {
            callback()
        }
    }, function (res) {
        if (res.status === 401 && status === 'login') {
            callback(new Error('username never exists!'))
        } else {
            callback()
        }
    })
}

export const checkForm = (obj, formRef, todo) => {
    formRef.validate((valid) => {
        if (valid) {
            obj.$Message.success('Form legal')
            todo()
        } else {
            obj.$Message.error('Form illegal')
        }
    })
}

/**
 *测试content是否有效（不为null不为undefined不为''）
 *@method isValid
 *@param {type} content 需检测的内容
 *@param {string} [type = 'string']
 *@return {boolean} 返回这个content是否有效
 */
export const isValid = (content, type = 'string') => {
    return content !== undefined &&
    content !== null &&
    typeof content === type &&
    content !== ''
}
