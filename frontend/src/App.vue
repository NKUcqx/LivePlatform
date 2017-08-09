<!--整个程序的入口-->

<template>
    <div id="app">
        <router-view></router-view>
    </div>
</template>

<script>
import { mapActions } from 'vuex'
export default {
    name: 'app',
    methods: {
        ...mapActions({
            initState: 'initState'
        })
    },
    mounted () {
        let that = this
        this.initState().then(function () {
            that.$router.push({path: '/home'})
        }, function () {
            that.$router.push({path: ''})
        })
    }
}
</script>

<style>
#app {
    text-align: center;
    color: #2c3e50;
}
</style>
