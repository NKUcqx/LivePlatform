import Login from '../../../src/components/Login.vue'
import Vue from 'vue'
import { getPropsVm, getRenderedVm } from './utils.js'
let assert = require('assert')

describe('changeState()', function () {
    let loginVm = getRenderedVm(Login)
    it('state=0', function () {
        loginVm.state = 0
        loginVm.form.user = 'formUser'
        loginVm.retrieve.user = 'retrieveUser'
        loginVm.changeState()
        assert.equal(1, loginVm.state)
        assert.equal('formUser', loginVm.retrieve.user)
        assert.equal('formUser', loginVm.form.user)
    })
    it('state=1', function () {
        loginVm.state = 1
        loginVm.form.user = 'formUser'
        loginVm.retrieve.user = 'retrieveUser'
        loginVm.changeState()
        assert.equal(0, loginVm.state)
        assert.equal('retrieveUser', loginVm.retrieve.user)
        assert.equal('retrieveUser', loginVm.form.user)
    })
})

describe('card加载情况', function () {
    let loginVm = getRenderedVm(Login)
    it('默认显示login', function () {
        assert.notEqual(null, loginVm.$el.querySelector('#login-card'))
        assert.equal(null, loginVm.$el.querySelector('#retrieve-card'))
    })
    it('异步更换card', done => {
        loginVm.state = 1
        Vue.nextTick(() => {
            assert.equal(null, loginVm.$el.querySelector('#login-card'))
            assert.notEqual(null, loginVm.$el.querySelector('#retrieve-card'))
            done()
        })
    })
})