import codedemo from '../../../src/components/Codedemo.vue'
import {getPropsVm, getRenderedVm} from './utils.js'
var assert = require('assert')

describe('codedemo props的WIDTH', function () {
    let vm
    it('组件加载后WIDTH的type是Number', () => {
        vm = getPropsVm(codedemo, {
            WIDTH: {
                type: Number,
                default: 600
            }
        })
        assert.equal(Number, vm.WIDTH.type)
    })

    it('组件加载后WIDTH的default是600', () => {
        vm = getPropsVm(codedemo, {
            WIDTH: {
                type: Number,
                default: 600
            }
        })
        assert.equal(600, vm.WIDTH.default)
    })
})

describe('codedemo props的HEIGHT', function () {
    let vm
    it('组件加载后HEIGHT的type是Number', () => {
        vm = getPropsVm(codedemo, {
            HEIGHT: {
                type: Number,
                default: 400
            }
        })
        assert.equal(Number, vm.HEIGHT.type)
    })

    it('组件加载后HEIGHT的default是400', () => {
        vm = getPropsVm(codedemo, {
            HEIGHT: {
                type: Number,
                default: 400
            }
        })
        assert.equal(400, vm.HEIGHT.default)
    })
})

describe('codedemo data', function () {
    let vm
    it('mode初始值为javascript', function () {
        vm = getRenderedVm(codedemo)
        assert.equal('javascript', vm.mode)
    })

    it('codedemo的skipNextChangeEvent为false', function () {
        vm = getRenderedVm(codedemo)
        assert.equal(false, vm.skipNextChangeEvent)
    })

    it('codedemo的value为String', function () {
        vm = getRenderedVm(codedemo)
        assert.equal(String, vm.value)
    })

    it('codedemo的options', function () {
        vm = getRenderedVm(codedemo)
        assert.equal('text/javascript', vm.options.mode)
        assert.equal(true, vm.options.lineNumbers)
        assert.equal(true, vm.options.lineWrapping)
    })
})