<template>
    <div class="controls">
        <Button icon="arrow-right-b" class="controlButton" v-show="!(isPlay)" type="circle" @click="play" size="small"></Button>
        <Button icon="ios-pause" class="controlButton" v-show="isPlay" type="circle" @click="pause" size="small"></Button>
        <div class="progress" ref="progress" @click="skipTime">
            <div class="loaded" ref="loaded"></div>
            <div class="line"></div>
            <div class="bar"></div>
        </div>
        <div class="timer">
            <span class="current">{{ currentTimeStr }}</span>
            <span class="total">{{ totalTimeStr }}</span>
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
import { mapGetters, mapMutations } from 'vuex'
import { getFormatTime } from '../../utils/utils'

/**
 *进度条
 *@class ProgressBar
 *@constructor
 */
export default {
    props: {

    },
    data () {
        return {
            currentTimeStr: '00:00:00',
            totalTimeStr: '00:00:00'
        }
    },
    computed: {
        ...mapGetters({
            isPlay: 'getPlayState',
            currentTime: 'getCurrentTime',
            totalTime: 'getTotalTime',
            user: 'getUser',
            roomInfo: 'getRoomInfo',
            socket: 'getSocket'
        })
    },
    methods: {
        ...mapMutations([
            'setPlayState',
            'setCurrentTime',
            'setTotalTime'
        ]),
        emit () {
            const pack = {
                id: this.user.userid,
                room_name: this.roomInfo.room_name,
                content: {
                    id: this.user.userid,
                    nickname: this.user.nickname,
                    data: '',
                    dataType: ''
                },
                type: '',
                signal: 'pause',
                to: ''
            }
            this.socket.emit('pause', pack)
        },
        /**
         *更改录播状态为播放
         *@event play
         */
        play () {
            this.setPlayState(true)
            this.emit()
        },
        /**
         *更改录播状态为暂停
         *@event pause
         */
        pause () {
            this.setPlayState(false)
            this.emit()
        },
        /**
         *响应用户点击跳跃播放
         *@event skipTime
         *@param {Object} inEvent 用户点击事件
         */
        skipTime (inEvent) {
            let event = inEvent || window.event
            this.setCurrentTime((event.offsetX / this.$refs['progress'].offsetWidth) * this.totalTime)
        }
    },
    watch: {
        currentTime: function (newVal, oldVal) {
            // 百分比
            let timePercent = newVal / this.totalTime * 100 + '%'
            // 显示进度条
            this.$refs['loaded'].style.width = timePercent
            // 显示当前播放进度时间
            this.currentTimeStr = getFormatTime(newVal)
        },
        totalTime: function (newVal, oldVal) {
            this.totalTimeStr = getFormatTime(newVal)
        }
    }
}
</script>

<style scoped>
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

.controlButton {
    display: 'inline-block';
}

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

/*已播放进度*/
.progress .loaded {
    width: 0;
    height: 100%;
    background-color: blue;
}

.progress .line {
    width: 0;
    height: 100%;
    background-color: #FFF;
    position: absolute;
    top: 0;
    left: 0;
}

.progress .bar {
    width: 100%;
    height: 100%;
    opacity: 0;
    position: absolute;
    left: 0;
    top: 0;
    z-index: 1;
}

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