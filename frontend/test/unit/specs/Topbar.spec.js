import Topbar from '../../../src/components/tinyComponents/Topbar.vue'
import Vue from 'vue'
import { getPropsVm, getRenderedVm } from './utils.js'
let assert = require('assert')

describe('logo加载情况', function () {
    let topbarVm = getRenderedVm(Topbar)
    it('SIZE', function () {
        assert.equal(40, topbarVm.img.size)
    })
})