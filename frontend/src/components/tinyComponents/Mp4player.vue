<template>
<div class="player">
    <video ref="video" :src="getVideoSrc" :style="position" 
        @canplay="initPlay" @timeupdate="changeTime" @ended="restore" id="video"></video>
    <!--progress-bar></progress-bar-->
</div>
</template>


<script>
/**
 *Module TinyComponents
 *
 *@module TinyComponents
 *@requires Utils
 */
import { mapGetters, mapMutations } from 'vuex'
import { getFormatTime, getFormatDate } from '../../utils/utils'
import ProgressBar from './ProgressBar'

/**
 *Mp4播放器
 *@class Mp4Player
 *@constructor
 */
export default {
    components: {
        ProgressBar
    },
    props: {
        WIDTH: {
            type: Number,
            default: 280
        },
        HEIGHT: {
            type: Number,
            default: 182
        }
    },
    data () {
        return {
            position: {
                width: '280px',
                height: '182px',
                display: 'inline-block'
            }
        }
    },
    computed: {
        ...mapGetters({
            isPlay: 'getPlayState',
            currentTime: 'getCurrentTime',
            totalTime: 'getTotalTime',
            playerInfo: 'getPlayerInfo'
        }),
        /**
         *获取视频路径
         *@method getVideoSrc
         *@return {String} 由房间创建时间和房间id组合生成的视频路径
         */
        getVideoSrc () {
            console.log('gyg' + getFormatDate(this.playerInfo.create_time))
            return 'static/record/' + getFormatDate(this.playerInfo.create_time) + '/' + this.playerInfo.id + '/' + this.playerInfo.id + '.mp4'
        }
    },
    methods: {
        ...mapMutations([
            'setPlayState',
            'setCurrentTime',
            'setTotalTime'
        ]),
        /**
         *初始化视频总时长
         *@event initPlay
         */
        initPlay () {
            this.setTotalTime(this.$refs['video'].duration)
        },
        /**
         *随视频进度更改当前播放时间
         *@event changeTime
         */
        changeTime () {
            this.setCurrentTime(this.$refs['video'].currentTime)
        },
        /**
         *播放完毕还原设置
         *
         *切换播放按钮状态，还原当前播放时间并将视频恢复到播放开始状态
         *@event restore
         */
        restore () {
            this.setPlayState(false)
            this.setCurrentTime(0)
            this.$refs['video'].currentTime = 0
        }
    },
    watch: {
        HEIGHT: function () {
            this.position.width = this.WIDTH.toString() + 'px'
            this.position.height = this.HEIGHT.toString() + 'px'
        },
        isPlay: function (newVal, oldVal) {
            if (newVal === true && oldVal === false) {
                this.$refs['video'].play()
            } else if (newVal === false && oldVal === true) {
                this.$refs['video'].pause()
            }
        },
        currentTime: function (newVal, oldVal) {
            this.$refs['video'].currentTime = newVal
        }
    },
    mounted () {
        // this.setPlayState(true)
    }
}
</script>

<style scoped>
</style>
