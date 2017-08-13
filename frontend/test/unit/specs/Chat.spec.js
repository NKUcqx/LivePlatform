import Chat from '../../../src/components/tinyComponents/Canvas.vue'
import Vue from 'vue'
import { getPropsVm, getRenderedVm } from './utils.js'
let assert = require('assert')
describe('样式', function () {
    let chatVm = getRenderedVm(Chat, {WIDTH: 500, HEIGHT: 500, ROLE: true, USERNAME: 'li', BORDER: 2})
    let totaldiv = chatVm.$el.querySelector('.dialog')
    let historydiv = chatVm.$el.querySelector('.historymessage')
    let titlediv = chatVm.$el.querySelector('.head')
    let inputdiv = chatVm.$el.querySelector('.input')
    it('props传值加载', function () {
        assert.equal(500, totaldiv.width)
        assert.equal(500, totaldiv.height)
        assert.equal(1, totaldiv.border)
    })
    it('聊天区', function () {
        assert.equal(500, historydiv.width)
        assert.equal(434, historydiv.height)
    })
    it('标题', function () {
        assert.equal(500, historydiv.width)
        assert.equal(150, historydiv.height)
    })
    it('输入', function () {
        assert.equal(500, inputdiv.width)
        assert.equal(36, inputdiv.height)
    })
})
