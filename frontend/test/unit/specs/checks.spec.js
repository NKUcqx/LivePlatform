import * as checks from '../../../src/utils/checks.js'
let assert = require('assert')

describe('checkSpecialChar()', function () {
    it('合法字符串返回true', function () {
        assert.equal(true, checks.checkSpecialChar('123dfg'))
    })
    it('含特殊字符返回false', function () {
        assert.equal(false, checks.checkSpecialChar('$145sdf'))
    })
    it('空字符串返回false', function () {
        assert.equal(false, checks.checkSpecialChar(''))
    })
    it('null字符串返回false', function () {
        assert.equal(false, checks.checkSpecialChar(null))
    })
    it('undefined字符串返回false', function () {
        assert.equal(false, checks.checkSpecialChar(undefined))
    })
})

describe('checkPhone()', function () {
    it('15112345678', function () {
        assert.equal(true, checks.checkPhone('15112345678'))
    })
    it('13112345678', function () {
        assert.equal(true, checks.checkPhone('13112345678'))
    })
    it('18112345678', function () {
        assert.equal(true, checks.checkPhone('18112345678'))
    })
    it('1511234567', function () {
        assert.equal(false, checks.checkPhone('1511234567'))
    })
    it('12345678901', function () {
        assert.equal(false, checks.checkPhone('12345678901'))
    })
    it('1511234567o', function () {
        assert.equal(false, checks.checkPhone('1511234567o'))
    })
})

describe('checkEmail()', function () {
    it('合法返回true', function () {
        assert.equal(true, checks.checkEmail('1511423@mail.nankai.edu.cn'))
    })
    it('无@返回false', function () {
        assert.equal(false, checks.checkEmail('gyg128o126.com'))
    })
    it('多个@返回false', function () {
        assert.equal(false, checks.checkEmail('gyg128@126@.com'))
    })
    it('无.返回false', function () {
        assert.equal(false, checks.checkEmail('gyg128@126com'))
    })
})

describe('checkObjLegal()', function () {
    it('对象中不含字符串返回true', function () {
        assert.equal(true, checks.checkObjLegal({id: 123, number: 456}))
    })
    it('对象中字符串合法返回true', function () {
        assert.equal(true, checks.checkObjLegal({id: 123, name: 'my123'}))
    })
    it('对象中字符串含特殊字符返回false', function () {
        assert.equal(false, checks.checkObjLegal({id: 123, name: 'my&123'}))
    })
    it('对象中含空字符串返回false', function () {
        assert.equal(false, checks.checkObjLegal({id: 123, name: ''}))
    })
})

describe('isValid()', function () {
    it('content:true,type:boolean返回true', function () {
        let content = true
        assert.equal(true, checks.isValid(content, 'boolean'))
    })
    it('content:true返回false', function () {
        let content = true
        assert.equal(false, checks.isValid(content))
    })
    it('content:123,type:number返回true', function () {
        let content = 123
        assert.equal(true, checks.isValid(content, 'number'))
    })
    it('content:123返回false', function () {
        let content = 123
        assert.equal(false, checks.isValid(content))
    })
    it('content:"gyg"返回true', function () {
        let content = 'gyg'
        assert.equal(true, checks.isValid(content))
    })
    it('content:"gyg",type:string返回true', function () {
        let content = 'gyg'
        assert.equal(true, checks.isValid(content, 'string'))
    })
    it('content:"gyg",type:object返回false', function () {
        let content = 'gyg'
        assert.equal(false, checks.isValid(content, 'object'))
    })
    it('content:{id:5},type:object返回true', function () {
        let content = {id: 5}
        assert.equal(true, checks.isValid(content, 'object'))
    })
    it('content:{id:5}返回false', function () {
        let content = 123
        assert.equal(false, checks.isValid(content))
    })
    it('content:undefined返回false', function () {
        assert.equal(false, checks.isValid(undefined))
    })
    it('content:null返回false', function () {
        let content = null
        assert.equal(false, checks.isValid(content))
    })
})