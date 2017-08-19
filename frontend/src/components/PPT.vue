<template>
    <div id="slide">
        <Carousel v-model="index" :autoplay="setautoplay" :autoplay-speed="autoplayspeed" :dots='setdots' trigger="click" :arrow="(AUTHORITY)?'hover':'never'" @on-change='changeppt'> 
            <Carousel-item v-for='img of imgs'>
                <img :src='img' :style="position" class="images">
            </Carousel-item>
        </Carousel>
        <div class="relative">
            <div id="showbar" :style="toolbarStyle">
            <div id="bottom-toolbar">
                <div id="controls">
                    <Poptip trigger="hover" :content="'speed: '+(11-autoplayspeed/1000)" placement="top">
                        <Button @click="minusSpeed()" type="text" class="buttons" :disabled="!AUTHORITY"><Icon type="minus-round":size="16"></Icon></Button>
                    </Poptip>
                    <Poptip trigger="hover" content="manul" placement="top">
                        <Button  v-show="setautoplay===false" @click="changeAuto()" type="text" class="buttons" :disabled="!AUTHORITY"><Icon type="play" :size="16"></Icon></Button>
                    </Poptip>
                    <Poptip trigger="hover" content="auto" placement="top">
                        <Button v-show="setautoplay===true" @click="changePause()" type="text" class="buttons" :disabled="!AUTHORITY"><Icon type="pause" :size="16"></Icon></Button>
                    </Poptip>
                    <Poptip trigger="hover" :content="'speed: '+(11-autoplayspeed/1000)" placement="top">
                        <Button @click="addSpeed()" type="text" class="buttons" :disabled="!AUTHORITY"><Icon type="plus-round" :size="20"></Icon></Button>
                    </Poptip>
                </div>
                <div id="slider">
                    <!-- 注意修改一下，不要传length，最好提前知道有几张图片然后传数，不然现在一开始会显示-1，有这样一个小Bug-->
                    <Slider v-model="index" :min="0" :max="imgs.length-1" :step="1" :disabled="!AUTHORITY"></Slider>
                </div>
            </div>
            </div>
        </div>
    </div>
</template>
<script>
    import { mapGetters } from 'vuex'
    import { getFileNameFromPath } from '../utils/utils'
    export default {
        props: {
            WIDTH: {
                type: Number,
                default: 400
            },
            HEIGHT: {
                type: Number,
                default: 260
            },
            AUTHORITY: {
                type: Boolean,
                default: false
            }
        },
        data () {
            return {
                toolbarStyle: {
                    width: '400px'
                },
                index: 0,
                imgs: [],
                binpath: '/static',
                setautoplay: false,
                autoplayspeed: 3000,
                setdots: 'none',
                position: {
                    width: '400px',
                    height: '260px'
                }
            }
        },
        computed: {
            ...mapGetters({
                slideInfo: 'getSlideInfo'
            })
        },
        watch: {
            slideInfo: function () {
                console.log(this.slideInfo)
                this.updateSlide()
            },
            WIDTH: function () {
                console.log('watch the size', this.WIDTH)
                this.position.width = this.WIDTH.toString() + 'px'
                this.toolbarStyle.width = this.WIDTH.toString() + 'px'
            },
            HEIGHT: function () {
                this.position.height = this.HEIGHT.toString() + 'px'
            }
        },
        mounted () {
            console.log('mounted the size', this.WIDTH)
            this.position.width = this.WIDTH.toString() + 'px'
            this.position.height = this.HEIGHT.toString() + 'px'
            console.log(this.slideInfo.slide_path)
            console.log(getFileNameFromPath(this.slideInfo.slide_path))
        },
        created () {
            // ***********NEED MODIFY***********
            for (let i = 1; i <= 7; i++) {
                this.imgs.push(this.binpath + '/rooms/room1/' + 'bg' + i + '.jpg')
            }
            this.updateSlide()
        },
        methods: {
            updateSlide () {
                // *************** NEED MODIFY ***************  this.slideInfo.slide_num
                this.imgs = []
                for (let i = 1; i <= 10; i++) {
                    console.log(this.slideInfo.slide_path + '/' + getFileNameFromPath(this.slideInfo.slide_path) + '-' + i + '.jpg')
                    this.imgs.push(this.slideInfo.slide_path + '/' + getFileNameFromPath(this.slideInfo.slide_path) + '-' + i + '.jpg')
                }
            },
            getHistory () {
                return this.index
            },
            reloadClear () {
                this.send(this.index)
            },
            changeAuto () {
                this.setautoplay = true
            },
            changePause () {
                this.setautoplay = false
            },
            minusSpeed () {
                this.autoplayspeed = (this.autoplayspeed < 10000) ? this.autoplayspeed + 1000 : this.autoplayspeed
            },
            addSpeed () {
                this.autoplayspeed = (this.autoplayspeed > 1000) ? this.autoplayspeed - 1000 : this.autoplayspeed
            },
            send (data) {
                this.$emit('send', data)
            },
            receive (data) {
                this.index = data.data
            },
            changeppt: function (oldValue, value) {
                console.log(value)
                console.log('çhange')
                if (this.AUTHORITY) {
                    this.send(value)
                }
            }
        }
    }
</script>

<style>
#slide .relative {
    width: 0;
    height: 0;
    float: left;
}

#slide #bottom-toolbar {
    display: none;
    margin-top: 40px;
    width: 100%;
    height: 36px;
    background: -webkit-linear-gradient(rgba(92, 173, 255, 0), rgba(92, 173, 255,1)); /* Safari 5.1 - 6.0 */
    background: -o-linear-gradient(rgba(92, 173, 255,0), rgba(92, 173, 255,1)); /* Opera 11.1 - 12.0 */
    background: -moz-linear-gradient(rgba(92, 173, 255,0), rgba(92, 173, 255,1)); /* Firefox 3.6 - 15 */
    background: linear-gradient(rgba(92, 173, 255,0), rgba(92, 173, 255,1)); /* 标准的语法 */
}
#slide #page {
    width: 45px;
}
#slide #slider {
    display: inline-block;
    width: calc(100% - 200px);
    float: right;
    margin-right: 10px;
}
#slide .buttons {
    color: white !important;
}
#slide .buttons:hover {
    color: #5cadff !important;
}
#slide #controls {
    float: left;
    margin-left: 10px;
}

#slide #showbar {
    position: relative;
    top: -80px;
    left: 0px;
    height: 76px;
    z-index: 400;
    text-align: center;
}

#slide #showbar:hover #bottom-toolbar {
    display: block;
}
</style>