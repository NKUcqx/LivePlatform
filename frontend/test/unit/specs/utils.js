import Vue from 'vue'

export const getPropsVm = (Component, propsData) => {
    const Constructor = Vue.extend(Component)
    return new Constructor({
        propsData
    }).$mount()
}

export const getRenderedVm = (Component) => {
    const Constructor = Vue.extend(Component)
    return new Constructor().$mount()
}