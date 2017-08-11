import CloseButton from '../components/tinyComponents/CloseButton.vue'
import Vue from 'vue'

describe('CloseButton加载后iswork', () => {
    let vm

    it('CloseButton加载后iswork', () => {
        vm=createCompInstance(CloseButton,{
            isWork: {
                type: Boolean,
                default: false
            }
        })
        expect(vm.isWork.type).to.be.an(Boolean)
        expect(vm.isWork.default).to.be.not
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