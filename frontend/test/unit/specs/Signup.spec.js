import Signup from '../../../src/components/Signup.vue'
import Vue from 'vue'
import { getPropsVm, getRenderedVm } from './utils.js'
let assert = require('assert')

describe('切换注册方式', function () {
    let signupVm = getRenderedVm(Signup)
    it('换手机', function () {
        assert.equal(0, signupVm.type)
        signupVm.changeType()
        assert.equal(1, signupVm.type)
    })
    it('换邮箱', function () {
        signupVm.changeType()
        assert.equal(0, signupVm.type)
    })
})