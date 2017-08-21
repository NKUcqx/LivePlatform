import TeacherRTC from '../../../src/components/tinyComponents/TeacherRTC.vue'
import Vue from 'vue'
import { getPropsVm, getRenderedVm } from './utils.js'
let assert = require('assert')

describe('教师端视频工具栏', function () {
    let teacherVm = getRenderedVm(TeacherRTC)
    it('工具栏默认不显示', function () {
        assert.equal(false, teacherVm.isBarShown)
    })
    it('showToolBar()', function () {
        teacherVm.showToolBar()
        assert.equal(true, teacherVm.isBarShown)
    })
    it('hideToolBar()', function () {
        teacherVm.hideToolBar()
        assert.equal(false, teacherVm.isBarShown)
    })
})