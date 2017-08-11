import * as checks from '../../../src/utils/checks.js'
var assert = require('assert')

describe('checkSpecialChar()', function() {
    it('合法字符串返回true', function() {
        assert.equal(true, checks.checkSpecialChar('123dfg'))
    }),
    it('含特殊字符返回false', function() {
        assert.equal(false, checks.checkSpecialChar('$145sdf'))
    }),
    it('空字符串返回false', function() {
        assert.equal(false, checks.checkSpecialChar(''))
    }),
    it('null字符串返回false', function() {
        assert.equal(false, checks.checkSpecialChar(null))
    })   
})

describe('checkPhone()', function() {
    it('15112345678', function() {
        assert.equal(checks.checkPhone('15112345678')).toEqual(true)
    }),
    it('13112345678', function() {
        assert.equal(checks.checkPhone('13112345678')).toEqual(true)
    }),
    it('18112345678', function() {
        assert.equal(checks.checkPhone('18112345678')).toEqual(true)
    }),
    it('1511234567', function() {
        assert.equal(checks.checkPhone('1511234567')).toEqual(false)
    }),
    it('12345678901', function() {
        assert.equal(checks.checkPhone('12345678901')).toEqual(false)
    }),
    it('1511234567o', function() {
        assert.equal(checks.checkPhone('1511234567o')).toEqual(false)
    })
})

describe('checkEmail()', function() {
    it('合法返回true', function() {
        assert.equal(checks.checkEmail('1511423@mail.nankai.edu.cn')).toEqual(true)
    }),
    it('非法返回false', function() {
        assert.equal(checks.checkEmail('gyg128o126.com')).toEqual(false)
    })
})

describe('checkObjLegal()',function() {
    it('对象中不含字符串返回true', function() {
        assert.equal(checks.checkObjLegal({id:123,number:456})).toEqual(true)
    }),
    it('对象中字符串合法返回true', function() {
        assert.equal(checks.checkObjLegal({id:123,name:'my123'})).toEqual(true)
    }),
    it('对象中字符串含特殊字符返回false', function() {
        assert.equal(checks.checkObjLegal({id:123,name:'my&123'})).toEqual(false)
    }),
    it('对象中含空字符串返回false', function() {
        assert.equal(checks.checkObjLegal({id:123,name:'my&123'})).toEqual(false)
    })
})