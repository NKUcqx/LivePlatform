/**
 * Module Utils
 *
 * @module Utils
 */
import store from '../store'

/**
 * 检测类
 * @class Checks
 * @constructor
 */

/**
 *检测一个字符串是否含有特殊字符或为空
 *@method checkSpecialChar
 *@param {String} str 字符串
 *@return {Boolean} 传入字符串为空或null或undefined或含特殊字符则返回false,否则返回true
 *@example
 *  // string1为真
 *
 *  var string1 = checkSpecialChar('123dfg')
 *
 *  // string2为假
 *
 *  var string2 = checkSpecialChar('$145sdf')
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
 *检测一个字符串是否是一个手机号
 *@method checkPhone
 *@param {String} phone 手机号
 *@return {Boolean} 返回这个字符串是否符合手机号规范（位数合法且13/15/18开头）
 *@example
 *  // phone1为假
 *
 *  var phone1 = checkPhone('12356667')
 *
 *  // phone2为真
 *
 *  var phone2 = checkPhone('18923458765')
 */
export const checkPhone = (phone) => {
    let phoneRe = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/
    return phoneRe.test(phone)
}

/**
 *检测一个字符串是否是一个email
 *@method checkEmail
 *@param {String} email Email账号
 *@return {Boolean} 返回这个字符串是否符合Email账号规范
 */
export const checkEmail = (email) => {
    let emailRe = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
    return emailRe.test(email)
}

/**
 *检测一个对象中包含的字符串是否含特殊字符
 *@method checkObjLegal
 *@param {Object} obj 对象名
 *@return {Boolean} 传入对象中包含的字符串为空或含特殊字符则返回false,否则返回true
 *@example
 * // 对象中字符串合法返回true,obj1为真
 *
 * var obj1 = checkObjLegal({id: 123, name: 'my123'})
 *
 * // 对象中字符串含特殊字符返回false,obj2为假
 *
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
 *检测密码
 *@event checkPassword
 *@param {Object} rule 包含user，password和pin
 *@param {String} value 输入的值
 *@param {Function} callback 回调函数
 *@param {String} rePass 重设密码的值
 *@param {Object} obj 重设密码的对象
 *@param {Object} rePassProp 重设密码的prop验证
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
 *检测第二次输入密码
 *@event checkRePassword
 *@param {Object} rule 包含user，password和pin
 *@param {String} value 输入的值
 *@param {Function} callback 回调函数
 *@param {String} password 第一次输入密码的值
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
 *检测验证码
 *@event checkVerification
 *@param {Object} rule 包含user，password和pin
 *@param {String} value 输入的值
 *@param {Function} callback 回调函数
 *@param {String} code 验证码的值
 */
export const checkVerification = (rule, value, callback, code) => {
    if (code === '' || value.toString().toLowerCase() !== code.toString().toLowerCase()) {
        callback(new Error('verification error'))
    } else {
        callback()
    }
}

/**
 *检测用户名是否已存在（用于注册和登录），如果注册时已存在，显示username does exist!，
 *如果登录时不存在，显示username never exists!
 *@event checkUsername
 *@param {Object} rule 包含user，password和pin
 *@param {String} value 输入的值
 *@param {Function} callback 回调函数
 *@param {String} status 判断是登陆还是注册
 */
export const checkUsername = (rule, value, callback, status) => {
    store.dispatch('testUsername', { username: value, father: status }).then(function () {
        callback()
    }, function (res) {
        (res) ? callback(new Error('username does exist!')) : callback(new Error('username never exists!'))
    })
}

/**
 *检测表单正确性
 *@event checkForm
 *@param {Object} obj vue实例
 *@param {Object} formRef DOM中的form元素
 *@param {Function} todo 表单正确时的回调函数
 */
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
 *检测content类型是否有效（不为null不为undefined不为''）
 *@method isValid
 *@param {Type} content 需检测的内容
 *@param {String} [type = 'string']
 *@return {Boolean} 返回这个content类型是否有效
 */
export const isValid = (content, type = 'string') => {
    return content !== undefined &&
    content !== null &&
    typeof content === type &&
    content !== ''
}

export const isNotNull = (data) => {
    return data !== undefined && data !== null && data !== ''
}