<template>
    <div :style='position'>
        <Tag background-color="blue">自动播放</Tag>
        <i-switch v-model="setautoplay">
            <span slot="open">开</span>
            <span slot="close">关</span>
        </i-switch>
        <Tag background-color="blue">跳转</Tag>
        <Input-number v-model="index" :max="sources.length-1" :min="0" size="small"></Input-number>
        <Tag background-color="blue">播放速度</Tag>
        <Slider v-model="autoplayspeed" :min="500" :max="10000" :step="100" :length='400'></Slider>
       <Carousel v-model="index" :autoplay="setautoplay" :autoplay-speed="autoplayspeed" :dots='setdots' trigger="click" arrow="hover" @on-change='changeppt'>
            <Carousel-item v-for='source of sources'>
                <img :src="source">
            </Carousel-item>
        </Carousel>
        <div>
</template>
<script>
    export default {
        props: {
            WIDTH: {
                type: Number,
                default: 400
            },
            HEIGHT: {
                type: Number,
                default: 200
            },
            INDEX: {
                type: Number,
                default: 0
            },
            SOURCES: {
                type: String,
                defalut: ''
            }
        },
        data() {
            return {
                index: 0,
                sources: [require('../assets/bg3.jpg'), require('../assets/bg4.jpg'), require('../assets/bg5.jpg'), require('../assets/bg6.jpg')],
                setautoplay: false,
                autoplayspeed: 0,
                setdots:'inside',
                position: {
                    width: '',
                    height: ''
                }
            }
        },
        mounted() {
            this.position.width = this.WIDTH
            this.position.height = this.HEIGHT
            //this.sources=this.SOURCES
        },
        methods: {
            send(data) {
                this.$emit('send', data)
            },
            changeppt:function(oldValue, value){
                console.log(value)
                console.log('çhange')
            }
        },
        watch:{
            index:function(oldValue, value){
                console.log(value)
                console.log('numberchange')
            }
        }
    }
</script>
<style>
   Slider{
       display:inline;
   }
</style>