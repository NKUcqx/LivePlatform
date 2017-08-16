<template>
    <div :style='position'>
        <Tag background-color="blue">自动播放</Tag>
        <i-switch v-model="setautoplay">
            <span slot="open">开</span>
            <span slot="close">关</span>
        </i-switch>
        <Tag background-color="blue">跳转</Tag>
        <Input-number v-model="index" :max="imgs.length" :min="1" size="small"></Input-number>
        <Tag background-color="blue">播放速度</Tag>
        <Slider v-model="autoplayspeed" :min="500" :max="10000" :step="100" :length='400'></Slider>
        <Carousel v-model="index" :autoplay="setautoplay" :autoplay-speed="autoplayspeed" :dots='setdots' trigger="click" arrow="hover" @on-change='changeppt'>
            <Carousel-item v-for='img of imgs'>
                <img :src='img'>
            </Carousel-item>
        </Carousel>
        <div>
</template>
<script>
    export default {
        props: {
            INDEX: {
                type: Number,
                default: 0
            },
            NUM: {
                type: Number,
                defalut: 7
            },
            SOU: {
                type: String,
                defalut: '/rooms/room1/'
            },
            WIDTH: {
                type: Number,
                default: 600
            },
            HEIGHT: {
                type: Number,
                default: 400
            }
        },
        data () {
            return {
                index: 0,
                imgs: [],
                binpath: '/static',
                setautoplay: false,
                autoplayspeed: 0,
                setdots: 'inside',
                position: {
                    width: '',
                    height: ''
                },
                ppt: {
                    source: '',
                    number: 0
                }
            }
        },
        watch: {
            'SOU': function () {
                this.position.width = this.WIDTH.toString() + 'px'
                this.position.height = (this.HEIGHT).toString() + 'px'
                this.ppt.source = this.SOU
                this.ppt.number = this.NUM
                console.log(this.position.height)
                console.log(this.position.width)
                console.log(this.ppt.source)
                console.log(this.ppt.number)
                console.log(this.NUM)
                console.log(this.SOU)
                for (let i = 1; i <= this.ppt.number; i++) {
                    this.imgs.push(this.binpath + this.ppt.source + 'bg' + i + '.jpg')
                }
            },
            NUM: function () {
                this.position.width = this.WIDTH.toString() + 'px'
                this.position.height = (this.HEIGHT).toString() + 'px'
                this.ppt.source = this.SOU
                this.ppt.number = this.NUM
                console.log(this.position.height)
                console.log(this.position.width)
                console.log(this.ppt.source)
                console.log(this.ppt.number)
                console.log(this.NUM)
                console.log(this.SOU)
                for (let i = 1; i <= 7; i++) {
                    this.imgs.push(this.binpath +'/rooms/room1/'+ 'bg' + i + '.jpg')
                }
            }
        },
        mounted () {
            this.position.width = this.WIDTH.toString() + 'px'
            this.position.height = (this.HEIGHT).toString() + 'px'
            for (let i = 1; i <= 7; i++) {
                this.imgs.push(this.binpath + '/rooms/room1/' + 'bg' + i + '.jpg')
            }
        },
        methods: {
            send (data) {
                this.$emit('send', data)
            },
            changeppt: function (oldValue, value) {
                console.log(value)
                console.log('çhange')
            }
        }
    }
</script>
<style>
    Slider {
        display: inline;
    }
</style>