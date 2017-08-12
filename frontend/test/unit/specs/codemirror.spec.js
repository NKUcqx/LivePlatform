import codemirror from '../../../src/components/codemirror.vue'
import {getPropsVm, getRenderedVm} from './utils.js'
var assert = require('assert')

describe('codemirror props',function() {
    let vm
	it('组件加载后value',() => {
	    vm = getPropsVm(codemirror,{
	        value:String
	    })
	    assert.equal(String, vm.value)
	})

	it('组件加载后options的type',() => {
	    vm = getPropsVm(codemirror,{
	        options: {
	            type: Object,
                default: function () {
                    return {
                        mode: 'text/javascript',
                        lineNumbers: true,
                        lineWrapping: true
                    }
                }
	        }
	    })
	    assert.equal(Object, vm.options.type)
	})

	it('组件加载后mode为text/javascript',() => {
	    vm = getPropsVm(codemirror,{
	        options: {
	            type: Object,
                default: function () {
                    return {
                        mode: 'text/javascript',
                        lineNumbers: true,
                        lineWrapping: true
                    }
                }
	        }
	    })
	    assert.equal('text/javascript', vm.options.default().mode)
	})

	it('组件加载后lineNumbers为true',() => {
	    vm = getPropsVm(codemirror,{
	        options: {
	            type: Object,
                default: function () {
                    return {
                        mode: 'text/javascript',
                        lineNumbers: true,
                        lineWrapping: true
                    }
                }
	        }
	    })
	    assert.equal(true, vm.options.default().lineNumbers)
	})

	it('组件加载后lineWrapping为true',() => {
	    vm = getPropsVm(codemirror,{
	        options: {
	            type: Object,
                default: function () {
                    return {
                        mode: 'text/javascript',
                        lineNumbers: true,
                        lineWrapping: true
                    }
                }
	        }
	    })
	    assert.equal(true, vm.options.default().lineWrapping)
	})

})

describe('codemirror data', function() {
    let vm
	it('skipNextChangeEvent初始值为false',function() {
        vm = getRenderedVm(codemirror)
        assert.equal(false,vm.skipNextChangeEvent)
	})

	it('socket初始值为空',function() {
        vm = getRenderedVm(codemirror)
        assert.equal('',vm.socket)
	})
})