<template>
<div class="player">
    <video ref="video" src="../../../static/1.mp4" :style="position" @canplay="initPlay" @timeupdate="changeTime" @ended="restore"></video>
    <div class="controls">
        <Button icon="arrow-right-b" v-show="!(isPlay)" type="circle" @click="play" size="small"></Button>
        <Button icon="ios-pause" v-show="isPlay" type="circle" @click="pause" size="small"></Button>
        <div class="progress" ref="progress" @click="skipTime">
            <div class="loaded" ref="loaded"></div>
            <div class="line"></div>
            <div class="bar"></div>
        </div>
        <div class="timer">
            <span class="current">{{currentTime}}</span>
            <span class="total">{{totalTime}}</span>
        </div>
    </div>
</div>
</template>


<script>
export default {
    props: {
        WIDTH: {
            type: Number,
            default: 600
        },
        HEIGHT: {
            type: Number,
            default: 500
        }
    },
    data () {
        return {
            currentTime: '00:00:00',
            totalTime: '00:00:00',
            isPlay: false,
            position: {
                width: '600px',
                height: '500px',
                display: 'inline-block'
            }
        }
    },
    computed: {

    },
    methods: {
        initPlay () {
            this.totalTime = this.getFormatTime(this.$refs['video'].duration)
        },
        play () {
            this.isPlay = true
            this.$refs['video'].play()
        },
        pause () {
            this.isPlay = false
            this.$refs['video'].pause()
        },
        getFormatTime (inTime) {
            let time = inTime || 0
            let h = parseInt(time / 3600)
            let m = parseInt(time % 3600 / 60)
            let s = parseInt(time % 60)
            h = h < 10 ? '0' + h : h
            m = m < 10 ? '0' + m : m
            s = s < 10 ? '0' + s : s
            return h + ':' + m + ':' + s
        },
        // 播放进度
        changeTime () {
            let currTime = this.$refs['video'].currentTime // 当前播放时间
            let duration = this.$refs['video'].duration // 视频总时长
            // 百分比
            let timePercent = currTime / duration * 100 + '%'
            // 显示进度条
            this.$refs['loaded'].style.width = timePercent
            // 显示当前播放进度时间
            this.currentTime = this.getFormatTime(currTime)
        },

        // 跳跃播放
        skipTime (inEvent) {
            let event = inEvent || window.event
            this.$refs['video'].currentTime = (event.offsetX / this.$refs['progress'].offsetWidth) * this.$refs['video'].duration
        },

        // 播放完毕还原设置
        restore () {
        // 切换播放按钮状态
            this.isPlay = false

            this.$refs['loaded'].style.width = 0
            // 还原当前播放时间
            this.currentTime = this.getFormatTime()
            // 视频恢复到播放开始状态
            this.$refs['video'].currentTime = 0
        }
    }
}
</script>

<style scoped>
.player {
    width: 720px;
    height: 360px;
    margin: 0 auto;
    position: relative;
}

.controls {
    width: 720px;
    height: 40px;
    background-color: #2196F3;
    position: absolute;
    left: 0;
    bottom: -40px;
    z-index: 99;
    opacity: 0.7;
}

.player:hover .controls {
    opacity: 1;
}

/*进度条*/
.progress {
    width: 430px;
    height: 10px;
    border-radius: 3px;
    overflow: hidden;
    background-color: #555;
    cursor: pointer;
    position: absolute;
    top: 16px;
    left: 45px;
}

/*下载进度*/
.progress .loaded {
    width: 0;
    height: 100%;
    background-color: blue;
}

/*播放进度*/
.progress .line {
    width: 0;
    height: 100%;
    background-color: #FFF;
    position: absolute;
    top: 0;
    left: 0;
}

/**/
.progress .bar {
    width: 100%;
    height: 100%;
    opacity: 0;
    position: absolute;
    left: 0;
    top: 0;
    z-index: 1;
}

/*时间*/
.timer {
    height: 20px;
    line-height: 20px;
    position: absolute;
    left: 490px;
    top: 11px;
    color: #FFF;
    font-size: 14px;
}
</style>