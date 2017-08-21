import CloseButton from '../../../src/components/tinyComponents/CloseButton.vue'
import Vue from 'vue'
import { getPropsVm, getRenderedVm } from './utils.js'
let assert = require('assert')

describe('getHistory()', function () {
    it('state默认为0', function () {
        let closeButtonVm = getRenderedVm(CloseButton)
        assert.equal(0, closeButtonVm.getHistory())
    })
    it('props传入state', function () {
        let closeButtonVm = getPropsVm(CloseButton, {INIT: 1})
        assert.equal(1, closeButtonVm.getHistory())
    })
})

describe('showIcon()', function () {
    let closeButtonVm = getRenderedVm(CloseButton)
    it('index===state返回true', function () {
        assert.equal(true, closeButtonVm.showIcon(0))
    })
    it('index!==state返回false', function () {
        assert.equal(false, closeButtonVm.showIcon(1))
    })
})