<template>
<div class="player">
    <video ref="video" :src="getVideoSrc" :style="position" 
        @canplay="initPlay" @timeupdate="changeTime" @ended="restore"></video>
    <progress-bar></progress-bar>
</div>
</template>


<script>
import { mapGetters, mapMutations } from 'vuex'
import { getFormatTime, getFormatDate } from '../../utils/utils'
import ProgressBar from './ProgressBar'

export default {
    components: {
        ProgressBar
    },
    props: {
        WIDTH: {
            type: Number,
            default: 600
        },
        HEIGHT: {
            type: Number,
            default: 400
        },
        CREATETIME: {
            type: String,
            default: ''
        },
        ROOMID: {
            type: Number,
            default: 1
        }
    },
    data () {
        return {
            position: {
                width: '600px',
                height: '500px',
                display: 'inline-block'
            }
        }
    },
    computed: {
        ...mapGetters({
            isPlay: 'getPlayState',
            currentTime: 'getCurrentTime',
            totalTime: 'getTotalTime'
        }),
        getVideoSrc () {
            console.log('gyg' + getFormatDate(this.CREATETIME))
            return 'static/record/' + getFormatDate(this.CREATETIME) + '/' + this.ROOMID + '/' + this.ROOMID + '.mp4'
        }
    },
    methods: {
        ...mapMutations([
            'setPlayState',
            'setCurrentTime',
            'setTotalTime'
        ]),
        initPlay () {
            this.setTotalTime(this.$refs['video'].duration)
        },
        changeTime () {
            this.setCurrentTime(this.$refs['video'].currentTime) // 当前播放时间
        },
        // 播放完毕还原设置
        restore () {
            // 切换播放按钮状态
            this.setPlayState(false)
            // 还原当前播放时间
            this.setCurrentTime(0)
            // 视频恢复到播放开始状态
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
    }
}
</script>

<style scoped>

</style>