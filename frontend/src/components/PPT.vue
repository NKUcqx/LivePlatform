<template>
<div>
    <div id="slide" v-if="!LOADING">
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
    <div id="spin" :style="position" v-else>
        <div id="loading-text">
            <div id="content">{{ 'Converting\n' + '....'.slice(0,stepCurrent+1) }}</div>
        </div>
        <Steps :current="stepCurrent" id="steps">
            <Step title="First" :content="(stepCurrent===0)?'Start Live':''"></Step>
            <Step title="Second" :content="(stepCurrent===1)?'Open Camara':''"></Step>
            <Step title="Third" :content="(stepCurrent===2)?'Test Sound':''"></Step>
            <Step title="Forth" :content="(stepCurrent===3)?'Lets Beigin':''"></Step>
        </Steps>
    </div>
</div>
</template>
<script>
    /**
     *Module TinyComponents
     *
     *@module TinyComponents
     *@requires Utils
     */
    import { mapGetters } from 'vuex'
    import { getFileNameFromPath } from '../utils/utils'
    /**
     *PPT
     *@class PPT
     *@constructor
     */
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
            },
            LOADING: {
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
                },
                stepCurrent: 0
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
            },
            LOADING: function () {
                let that = this
                if (this.LOADING) {
                    window.setInterval(function () {
                        console.log('yes')
                        that.stepCurrent = (that.stepCurrent < 3) ? that.stepCurrent + 1 : 0
                    }, 2000)
                }
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
            for (let i = 1; i <= parseInt(this.slideInfo.slide_num); i++) {
                this.imgs.push(this.binpath + '/rooms/room1/' + 'bg' + i + '.jpg')
            }
            this.updateSlide()
        },
        methods: {
            /**
             *更新幻灯片，从指定文件夹获取图片地址push到this.imgs里
             *@event updateSlide
             */
            updateSlide () {
                // *************** NEED MODIFY ***************  this.slideInfo.slide_num
                this.imgs = []
                for (let i = 1; i <= parseInt(this.slideInfo.slide_num); i++) {
                    console.log(this.slideInfo.slide_path + '/' + getFileNameFromPath(this.slideInfo.slide_path) + '-' + i + '.jpg')
                    this.imgs.push(this.slideInfo.slide_path + '/' + getFileNameFromPath(this.slideInfo.slide_path) + '-' + i + '.jpg')
                }
            },
            /**
             *返回现在是ppt的第几页
             *@method getHistory
             *@return {Object} this.index
             */
            getHistory () {
                return this.index
            },
            /**
             *发送现在是ppt的第几页的消息
             *@event reloadClear
             */
            reloadClear () {
                this.send(this.index)
            },
            /**
             *设置自动播放功能
             *@event changeAuto
             */
            changeAuto () {
                this.setautoplay = true
            },
            /**
             *关闭自动播放功能
             *@event changePause
             */
            changePause () {
                this.setautoplay = false
            },
            /**
             *减慢自动播放功能的播放速度
             *@event minusSpeed
             */
            minusSpeed () {
                this.autoplayspeed = (this.autoplayspeed < 10000) ? this.autoplayspeed + 1000 : this.autoplayspeed
            },
            /**
             *加快自动播放功能的播放速度
             *@event addSpeed
             */
            addSpeed () {
                this.autoplayspeed = (this.autoplayspeed > 1000) ? this.autoplayspeed - 1000 : this.autoplayspeed
            },
            /**
             *发送消息
             *@event send
             */
            send (data) {
                this.$emit('send', data)
            },
            /**
             *接收消息（给this.index赋值）
             *@event send
             */
            receive (data) {
                this.index = data.data
            },
            /**
             *对权限进行判断，只有老师才能用socketio发送对ppt进行操作的消息
             *@event changeppt
             */
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

#spin {
    text-align: center;
}

#spin #loading-text {
    width: 100%;
    height: 31%;
    margin-top: 10%;
    text-align: center;
}

#spin #loading-text #content{
    display: inline-block;
    height: 100%;
    width: 21%;
    font-size: 1.3em;
    color: #5cadff;
    border: 2px #5cadff solid;
    border-radius: 50%;
    padding: 8% 0px;
    -moz-box-shadow:1px 1px 6px #5cadff;
    -webkit-box-shadow:1px 1px 6px #5cadff; 
    box-shadow: 1px 1px 6px #5cadff;
    text-shadow:2px 2px 2px rgb(180,240,180);
}

#spin #steps {
    margin-top: 20%;
}
</style>