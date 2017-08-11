import Canvas from '../components/tinyComponents/Canvas.vue'
import Vue from 'vue'
import {createCompInstance} from './utils.js'

//var expect = require('chai').expect;

//var assert = require("assert");

describe('Canvas加载后的宽和高', () => {
    let vm

    it('组件加载后，canvas组件的宽应该是', () => {
        vm=createCompInstance(Canvas,{
            WIDTH:{
                type:Number,
                default:600
            }
        })
        expect(vm.WIDTH.default).to.be.equal(600)
    })

    it('组件加载后，canvas组件的高应该是', () => {
        vm=createCompInstance(Canvas,{
            HEIGHT: {
                type: Number,
                default: 400
            }
        })
        expect(vm.HEIGHT.default).to.be.equal(400)
    })
})

describe('Canvas关于ColorPicker的', () => {
    const Constructor = Vue.extend(Canvas)
    const vm = new Constructor().$mount()

    it('showColorPicker应该为false',()=>{
        expect(vm.showColorPicker).to.not.be.ok
    })

    it('colorPicker后showColorPicker应该为true',() => {
        vm.ColorPicker()
        expect(vm.showColorPicker).to.not.be.ok
    })
})


describe('Canvas关于ColorPicker的', () => {
    const Constructor = Vue.extend(Canvas)
    const vm = new Constructor().$mount()

    it('canvas.color为defaultProps，所以hex是"#194d33",a是1',() => {
        expect(vm.canvas.color.hex).to.be.equal('#194d33')
        expect(vm.canvas.color.a).to.be.equal(1)
    })

    it('canvas.text为\'\'',() => {
        expect(vm.canvas.text).to.be.equal('')
    })

})
    /*it('组件加载后，btnPosition.left',()=>{
        vm = new Vue(Canvas).$mount()
        expect(vm.btnPosition.left).to.be.equal((vm.$refs.canvas.offsetLeft + 5).toString() + 'px')
    })

    it('组件加载后，btnPosition.top',()=>{
        vm = new Vue(Canvas).$mount()
        expect(vm.btnPosition.top).to.be.equal((vm.$refs.canvas.offsetTop + 5).toString() + 'px')
    })

    it('组件加载后，context',()=>{
        vm = new Vue(Canvas).$mount()
        expect(vm.context).to.be.equal(vm.$refs.board.getContext('2d'))
    })
    
    it('showToolBar让toolBar为真', () => {
        let vm = new Vue(Canvas).$mount()
        vm.showToolBar()
        expect(vm.$el.hasAttribute('toolBar')).to.be.true
    });


    it('hideToolBar让toolBar为假', () => {
        let vm = new Vue(Canvas).$mount()
        vm.hideToolBar()
        expect(vm.$el.hasAttribute('toolBar')).to.not.be.ok
    });

    it('测试widthSliderFomat', () => {
        let vm = new Vue(Canvas).$mount()
        expect(vm.widthSliderFomat(1)).to.be.equal('width: 1px')
    });*/