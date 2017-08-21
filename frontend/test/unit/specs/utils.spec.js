import * as utils from '../../../src/utils/utils.js'
let assert = require('assert')

describe('getCookie()', function () {
    it('csrftoken', function () {
        assert.equal(null, utils.getCookie('csrftoken'))
    })
    it('xxx', function () {
        assert.equal(null, utils.getCookie('xxx'))
    })
})

describe('getListFromDB()', function () {
    let testObj1 = {
        key: {id: 1}
    }
    let testObj2 = {
        key1: {id: 1},
        key2: {id: 2}
    }
    it('仅有一个内层key', function () {
        assert.equal(1, utils.getListFromDB(testObj1).id)
    })
    it('有两个内层key', function () {
        assert.equal(1, utils.getListFromDB(testObj2).id)
    })
    it('null', function () {
        assert.equal(null, utils.getListFromDB(null))
    })
})

describe('isJSON()', function () {
    it('{"a": "Hello", "b": "World"}', function () {
        assert.equal('Hello', utils.isJSON('{"a": "Hello", "b": "World"}').a)
        assert.equal('World', utils.isJSON('{"a": "Hello", "b": "World"}').b)
    })
    it('Hello World', function () {
        assert.equal(false, utils.isJSON('Hello World'))
    })
    it('123', function () {
        assert.equal(false, utils.isJSON(123))
    })
    it('null', function () {
        assert.equal(false, utils.isJSON(null))
    })
})

describe('Obj2JSON()', function () {
    it('{"a":"Hello","b":"World"}', function () {
        assert.equal('{"a":"Hello","b":"World"}', utils.Obj2JSON({a: 'Hello', b: 'World'}))
    })
    it('Hello World', function () {
        assert.equal(false, utils.Obj2JSON('Hello World'))
    })
    it('null', function () {
        assert.equal('null', utils.Obj2JSON(null))
    })
})

describe('getFormatTime()', function () {
    it('不传入参数', function () {
        assert.equal('00:00:00', utils.getFormatTime())
    })
    it('传入0', function () {
        assert.equal('00:00:00', utils.getFormatTime(0))
    })
    it('秒数小于10', function () {
        assert.equal('00:00:05', utils.getFormatTime(5))
    })
    it('秒数不小于10', function () {
        assert.equal('00:00:15', utils.getFormatTime(15))
    })
    it('分钟数小于10', function () {
        assert.equal('00:01:20', utils.getFormatTime(80))
    })
    it('分钟数不小于10', function () {
        assert.equal('00:10:06', utils.getFormatTime(606))
    })
    it('小时数小于10', function () {
        assert.equal('01:00:00', utils.getFormatTime(3600))
    })
    it('小时数不小于10', function () {
        assert.equal('11:01:00', utils.getFormatTime(39660))
    })
})