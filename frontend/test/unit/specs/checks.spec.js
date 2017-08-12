import * as checks from '../../../src/utils/checks.js'
let assert = require('assert')

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
    }),
    it('undefined字符串返回false', function() {
        assert.equal(false, checks.checkSpecialChar(undefined))
    })   
})

describe('checkPhone()', function() {
    it('15112345678', function() {
        assert.equal(true, checks.checkPhone('15112345678'))
    }),
    it('13112345678', function() {
        assert.equal(true, checks.checkPhone('13112345678'))
    }),
    it('18112345678', function() {
        assert.equal(true, checks.checkPhone('18112345678'))
    }),
    it('1511234567', function() {
        assert.equal(false, checks.checkPhone('1511234567'))
    }),
    it('12345678901', function() {
        assert.equal(false, checks.checkPhone('12345678901'))
    }),
    it('1511234567o', function() {
        assert.equal(false, checks.checkPhone('1511234567o'))
    })
})

describe('checkEmail()', function() {
    it('合法返回true', function() {
        assert.equal(true, checks.checkEmail('1511423@mail.nankai.edu.cn'))
    }),
    it('无@返回false', function() {
        assert.equal(false, checks.checkEmail('gyg128o126.com'))
    }),
    it('无.返回false', function() {
        assert.equal(false, checks.checkEmail('gyg128@126com'))
    })
})

describe('checkObjLegal()',function() {
    it('对象中不含字符串返回true', function() {
        assert.equal(true, checks.checkObjLegal({id:123,number:456}))
    }),
    it('对象中字符串合法返回true', function() {
        assert.equal(true, checks.checkObjLegal({id:123,name:'my123'}))
    }),
    it('对象中字符串含特殊字符返回false', function() {
        assert.equal(false, checks.checkObjLegal({id:123,name:'my&123'}))
    }),
    it('对象中含空字符串返回false', function() {
        assert.equal(false, checks.checkObjLegal({id:123,name:'my&123'}))
    })
})