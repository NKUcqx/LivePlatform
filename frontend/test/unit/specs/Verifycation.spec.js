import Verification from '../../../src/components/tinyComponents/Verification.vue'
import Vue from 'vue'
import { getPropsVm, getRenderedVm } from './utils.js'
let assert = require('assert')

describe('验证码输入icon', function () {
    it('props传值控制显示', function () {
        let verificationVm = getPropsVm(Verification,{father: 'login'})
        let star = verificationVm.$el.querySelector('#star')
        assert.notEqual(null, star)
    })
    it('props传值控制不显示', function () {
        let verificationVm = getPropsVm(Verification,{father: 'logi'})
        let star = verificationVm.$el.querySelector('#star')
        assert.equal(null, star)
    })
})

describe('state控制按钮显示', function () {
    let verificationVm = getRenderedVm(Verification)
    it('Achieve显示', function () {
        let achieve = verificationVm.$el.querySelector('#achieve')
        let time = verificationVm.$el.querySelector('#time')
        assert.notEqual(null, achieve)
        assert.equal(null, time)
    })
    it('time异步显示', function () {
    	verificationVm.state = 'sent'
        Vue.nextTick(() => {
            let achieve = verificationVm.$el.querySelector('#achieve')
            let time = verificationVm.$el.querySelector('#time')
            assert.notEqual(null, time)
            assert.equal(null, achieve)
            done()
        })
    })
})