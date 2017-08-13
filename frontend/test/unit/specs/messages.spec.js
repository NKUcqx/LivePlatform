import * as messages from '../../../src/utils/messages.js'
let assert = require('assert')

describe('makeCanvasInfo()', function () {
    let parameter1 = {
        type: 'pen',
        ox: 6,
        oy: 6,
        ex: 6,
        ey: 6,
        width: 6,
        fontSize: 6,
        text: 'hello',
        color: {
            hex: '#666666',
            a: 6
        },
        isFill: true
    }
    it('正常传入所有参数', function () {
        assert.equal('pen', messages.makeCanvasInfo(parameter1).type)
        assert.deepEqual([6, 6], messages.makeCanvasInfo(parameter1).start)
        assert.deepEqual([6, 6], messages.makeCanvasInfo(parameter1).end)
        assert.equal(6, messages.makeCanvasInfo(parameter1).width)
        assert.equal(6, messages.makeCanvasInfo(parameter1).fontSize)
        assert.equal('hello', messages.makeCanvasInfo(parameter1).text)
        assert.equal('#666666', messages.makeCanvasInfo(parameter1).color.hex)
        assert.equal(6, messages.makeCanvasInfo(parameter1).color.a)
        assert.equal(true, messages.makeCanvasInfo(parameter1).isFill)
    })
    let parameter2 = {
        type: 'pen',
        ox: 6,
        oy: 6,
        ex: 6,
        fontSize: 6,
        text: 'hello',
        color: {
            hex: '#666666',
            a: 6
        }
    }
    it('少传入部分参数', function () {
        assert.equal('pen', messages.makeCanvasInfo(parameter2).type)
        assert.deepEqual([6, 6], messages.makeCanvasInfo(parameter2).start)
        assert.equal(undefined, messages.makeCanvasInfo(parameter2).end)
        assert.equal(undefined, messages.makeCanvasInfo(parameter2).width)
        assert.equal(6, messages.makeCanvasInfo(parameter2).fontSize)
        assert.equal('hello', messages.makeCanvasInfo(parameter2).text)
        assert.equal('#666666', messages.makeCanvasInfo(parameter2).color.hex)
        assert.equal(6, messages.makeCanvasInfo(parameter2).color.a)
        assert.equal(undefined, messages.makeCanvasInfo(parameter2).isFill)
    })
    let parameter3 = {
        type: '',
        ox: 0,
        oy: 0,
        ex: 6,
        ey: 6,
        width: 6,
        fontSize: 6,
        text: '',
        color: {
            hex: '',
            a: 0
        },
        isFill: false
    }
    it('参数传入空值', function () {
        assert.equal('', messages.makeCanvasInfo(parameter3).type)
        assert.equal(undefined, messages.makeCanvasInfo(parameter3).start)
        assert.deepEqual([6, 6], messages.makeCanvasInfo(parameter3).end)
        assert.equal(6, messages.makeCanvasInfo(parameter3).width)
        assert.equal(6, messages.makeCanvasInfo(parameter3).fontSize)
        assert.equal(undefined, messages.makeCanvasInfo(parameter3).text)
        assert.equal('', messages.makeCanvasInfo(parameter3).color.hex)
        assert.equal(0, messages.makeCanvasInfo(parameter3).color.a)
        assert.equal(undefined, messages.makeCanvasInfo(parameter3).isFill)
    })
    let parameter4 = {
        type: null,
        ox: null,
        oy: null,
        ex: null,
        ey: null,
        width: null,
        fontSize: null,
        text: null,
        color: {
            hex: null,
            a: null
        },
        isFill: null
    }
    it('参数传入null', function () {
        assert.equal(null, messages.makeCanvasInfo(parameter4).type)
        assert.equal(undefined, messages.makeCanvasInfo(parameter4).start)
        assert.equal(undefined, messages.makeCanvasInfo(parameter4).end)
        assert.equal(undefined, messages.makeCanvasInfo(parameter4).width)
        assert.equal(undefined, messages.makeCanvasInfo(parameter4).fontSize)
        assert.equal(undefined, messages.makeCanvasInfo(parameter4).text)
        assert.equal(null, messages.makeCanvasInfo(parameter4).color.hex)
        assert.equal(null, messages.makeCanvasInfo(parameter4).color.a)
        assert.equal(undefined, messages.makeCanvasInfo(parameter4).isFill)
    })
})