import Room from '../../../src/components/tinyComponents/Room.vue'
import Vue from 'vue'
import { getPropsVm, getRenderedVm } from './utils.js'
let assert = require("assert")

describe('footer加载情况', function() {
    it('直播props传值', function() {
    	let myItem = {
    		name: 'g128',
    		creater: 'gyg',
    		audience_amount: 666,
    		create_time: '2017-8-12 11:10:16',
    		is_living: true
    	}
    	let roomVm = getPropsVm(Room, {item: myItem}) 
        assert.equal('g128', roomVm.$el.querySelector('#title').textContent)
        assert.equal(' gyg', roomVm.$el.querySelector('#teacher').textContent)
        assert.equal('\n            666\n        ', roomVm.$el.querySelector('#audiences').textContent)
        assert.equal(null, roomVm.$el.querySelector('#endtime'))
    })
    it('录播props传值', function() {
    	let myItem = {
    		name: 'g128',
    		creater: 'gyg',
    		audience_amount: 666,
    		create_time: '2017-8-12 11:10:16',
    		is_living: false
    	}
    	let roomVm = getPropsVm(Room, {item: myItem}) 
        assert.equal('g128', roomVm.$el.querySelector('#title').textContent)
        assert.equal(' gyg', roomVm.$el.querySelector('#teacher').textContent)
        assert.equal(null, roomVm.$el.querySelector('#audiences'))
        assert.equal('\n            2017-8-12 11:10:16\n        ', roomVm.$el.querySelector('#endtime').textContent)
    })
})