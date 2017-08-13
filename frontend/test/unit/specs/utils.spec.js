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
    let myObj1 = {
        key: {id: 1}
    }
    let myObj2 = {
        key1: {id: 1},
        key2: {id: 2}
    }
    it('仅有一个内层key', function () {
        assert.equal(1, utils.getListFromDB(myObj1).id)
    })
    it('有两个内层key', function () {
        assert.equal(1, utils.getListFromDB(myObj2).id)
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