import CloseButton from '../../../src/components/tinyComponents/CloseButton.vue'
import Vue from 'vue'
import { getPropsVm, getRenderedVm } from './utils.js'
let assert = require('assert')

describe('位置加载', function () {
    let closeButtonVm = getRenderedVm(CloseButton)
    let switchDiv = closeButtonVm.$el.querySelector('#switch')
    it('数据计算', function () {
        assert.equal('-26px', switchDiv.style.left)
        assert.equal('3px', switchDiv.style.top)
    })
})