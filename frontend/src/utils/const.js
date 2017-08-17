/**
 * Module CONST
 *
 * @module CONST
 * @class CONST
 * @constructor
 */
export const CONST = {
    /**
     *@property success
     *@type function
     */
    /**
     *代表成功
     *@method success
     *@param {string} str 字符串
     *@return {string} 返回str + ' Success'
     */
    success: (str) => {
        return str + ' Success'
    },
    /**
     *@property failure
     *@type function
     */
    /**
     *代表失败
     *@method failure
     *@param {string} str 字符串
     *@return {string} 返回str + ' Failure'
     */
    failure: (str) => {
        return str + ' Failure'
    },
    /**
     *@property login
     *@type string 'Please Login First'
     */
    login: 'Please Login First',
    /**
     *@property permission
     *@type string 'Permission Denied'
     */
    permission: 'Permission Denied'
}