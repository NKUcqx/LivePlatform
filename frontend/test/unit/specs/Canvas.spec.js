import Canvas from '../../../src/components/tinyComponents/Canvas.vue'
import Vue from 'vue'
import { getPropsVm, getRenderedVm } from './utils.js'
let assert = require("assert")

describe('画板工具栏按钮', function() {
    let canvasVm = getRenderedVm(Canvas)
    let toolButton = canvasVm.$el.querySelector('#show-tool')
    it('画板工具栏按钮加载情况', function() {
        assert.equal('absolute', toolButton.style.position)
        assert.equal('5px', toolButton.style.left)
        assert.equal('5px', toolButton.style.top)
        assert.equal(999, toolButton.style.zIndex)
    })
    it('模拟鼠标进入', function() {
        let event = new window.Event('mouseenter')
        toolButton.dispatchEvent(event)
        canvasVm._watcher.run()
        assert.equal(true, canvasVm.toolBar)
    })
    it('模拟鼠标退出', function() {
        let event = new window.Event('mouseleave')
        toolButton.dispatchEvent(event)
        canvasVm._watcher.run()
        assert.equal(false, canvasVm.toolBar)
    })
})

describe('画板工具栏', function() {
    let canvasVm =getRenderedVm(Canvas)
    it('画板工具栏默认不显示',function() {
        assert.equal(null, canvasVm.$el.querySelector('#tool-bar'))
    })
    it('画板工具栏异步加载情况', done => {
        canvasVm.toolBar = true
        Vue.nextTick(()=>{
            let toolBar = canvasVm.$el.querySelector('#tool-bar')
            assert.equal('absolute', toolBar.style.position)
            assert.equal('0px',toolBar.style.left)
            assert.equal('0px',toolBar.style.top)
            assert.equal(999,toolBar.style.zIndex)
            done()
        })
    })
    it('异步模拟鼠标进出', done => {
        canvasVm.toolBar = true
        let toolBar = canvasVm.$el.querySelector('#tool-bar')
        let event = new window.Event('mouseenter')
        toolBar.dispatchEvent(event)
        canvasVm._watcher.run()
        assert.equal(true, canvasVm.toolBar)
        Vue.nextTick(()=>{
            let event = new window.Event('mouseleave')
            toolBar.dispatchEvent(event)
            canvasVm._watcher.run()
            assert.equal(false, canvasVm.toolBar)
            Vue.nextTick(()=>{
                assert.equal(null, canvasVm.$el.querySelector('#tool-bar'))
                done()
            })
            done()
        })
    })
})

describe('画板', function() {
    let canvasVm = getPropsVm(Canvas, {WIDTH: 500, HEIGHT: 500})
    let myCanvas = canvasVm.$el.querySelector('#board')
    it('props传值加载', function() {
        assert.equal(500, myCanvas.width)
        assert.equal(500, myCanvas.height)
    })
})

describe('文字输入框', function() {
    let canvasVm = getRenderedVm(Canvas)
    it('文字输入框默认不显示',function() {
        assert.equal(null, canvasVm.$el.querySelector('#text'))
    })
    it('文字输入框异步加载情况', done => {
        canvasVm.canvas.isInput = true
        Vue.nextTick(()=>{
            let text = canvasVm.$el.querySelector('#text')
            assert.equal('absolute', text.style.position)
            assert.equal('30px', text.style.left)
            assert.equal('30px', text.style.top)
            assert.equal(999, text.style.zIndex)
            assert.equal('100px', text.style.width)
            done()
        })
    })
})

describe('widthSliderFomat()', function(){
    let canvasVm = getRenderedVm(Canvas)
    it('6', function() {
        assert.equal('width: 6px', canvasVm.widthSliderFomat('6'))
    })
})

describe('fontSliderFomat()', function(){
    let canvasVm = getRenderedVm(Canvas)
    it('6', function() {
        assert.equal('font: 6px', canvasVm.fontSliderFomat('6'))
    })
})

describe('checkType()', function(){
    let canvasVm = getRenderedVm(Canvas)
    it('相等情况', function() {
        assert.equal('primary', canvasVm.checkType('pen'))
    })
    it('不等情况', function() {
        assert.equal('ghost', canvasVm.checkType('line'))
    })
})

describe('changeType()', function(){
    let canvasVm = getRenderedVm(Canvas)
    it('changeType("line")', function() {
        canvasVm.changeType('line')
        assert.equal('line', canvasVm.type)
    })
})

describe('checkFill()', function(){
    let canvasVm = getRenderedVm(Canvas)
    it('默认非填充情况', function() {
        assert.equal('ghost', canvasVm.checkFill())
    })
    it('填充情况', function() {
        canvasVm.canvas.isFill=true
        assert.equal('primary', canvasVm.checkFill())
    })
})

describe('changeFill()', function(){
    let canvasVm = getRenderedVm(Canvas)
    it('初始值为false', function() {
        assert.equal(false, canvasVm.canvas.isFill)
    })
    it('变true',function() {
        canvasVm.changeFill()
        assert.equal(true, canvasVm.canvas.isFill)  
    })
    it('变false',function() {
        canvasVm.changeFill()
        assert.equal(false, canvasVm.canvas.isFill)  
    })
})

describe('addWidth()', function(){
    let canvasVm = getRenderedVm(Canvas)
    it('20', function() {
        canvasVm.canvas.width=20
        canvasVm.addWidth()
        assert.equal(21, canvasVm.canvas.width)
    })
    it('24', function() {
        canvasVm.canvas.width=24
        canvasVm.addWidth()
        assert.equal(24, canvasVm.canvas.width)
    })
})

describe('minusWidth()', function(){
    let canvasVm = getRenderedVm(Canvas)
    it('20', function() {
        canvasVm.canvas.width=20
        canvasVm.minusWidth()
        assert.equal(19, canvasVm.canvas.width)
    })
    it('1', function() {
        canvasVm.canvas.width=1
        canvasVm.minusWidth()
        assert.equal(1, canvasVm.canvas.width)
    })
})

describe('addFontSize()', function(){
    let canvasVm = getRenderedVm(Canvas)
    it('20', function() {
        canvasVm.canvas.fontSize=20
        canvasVm.addFontSize()
        assert.equal(21, canvasVm.canvas.fontSize)
    })
    it('35', function() {
        canvasVm.canvas.fontSize=35
        canvasVm.addFontSize()
        assert.equal(35, canvasVm.canvas.fontSize)
    })
})

describe('minusFontSize()', function(){
    let canvasVm = getRenderedVm(Canvas)
    it('20', function() {
        canvasVm.canvas.fontSize=20
        canvasVm.minusFontSize()
        assert.equal(19, canvasVm.canvas.fontSize)
    })
    it('15', function() {
        canvasVm.canvas.fontSize=15
        canvasVm.minusFontSize()
        assert.equal(15, canvasVm.canvas.fontSize)
    })
})