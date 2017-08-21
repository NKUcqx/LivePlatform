import StudentRTC from '../../../src/components/tinyComponents/StudentRTC.vue'
import Vue from 'vue'
import { getPropsVm, getRenderedVm } from './utils.js'
let assert = require('assert')

describe('学生端视频工具栏', function () {
    let studentVm = getRenderedVm(StudentRTC)
    it('工具栏默认不显示', function () {
        assert.equal(false, studentVm.isBarShown)
    })
    it('showToolBar()', function () {
        studentVm.showToolBar()
        assert.equal(true, studentVm.isBarShown)
    })
    it('hideToolBar()', function () {
        studentVm.hideToolBar()
        assert.equal(false, studentVm.isBarShown)
    })
})