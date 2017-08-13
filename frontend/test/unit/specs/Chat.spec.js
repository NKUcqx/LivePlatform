import Chat from '../../../src/components/tinyComponents/Canvas.vue'
import Vue from 'vue'
import { getPropsVm, getRenderedVm } from './utils.js'
let assert = require('assert')
describe('样式', function () {
    let chatVm = getRenderedVm(Chat, {WIDTH: 500, HEIGHT: 500, ROLE: true, USERNAME: 'li', BORDER: 2})
    let totaldiv = chatVm.$el.querySelector('.dialog')
    it('props传值加载', function () {
        assert.equal(500, totaldiv.style.width)
        assert.equal(500, totaldiv.style.height)
        assert.equal(1, totaldiv.style.border)
    })
})
