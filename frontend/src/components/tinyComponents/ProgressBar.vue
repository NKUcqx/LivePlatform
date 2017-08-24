<template>
    <div class="controls" @mouseleave="isShow=false">
        <span class="squire" @mouseenter="isShow=true">
            <span @click="play"><Icon type="arrow-right-b" size="20" class="icons" v-show="!(isPlay)"></Icon></span>
            <span @click="pause"><Icon type="ios-pause" size="20" class="icons" v-show="isPlay"></Icon></span>
        </span>
        <span class="timer" v-show="isShow">
            <span class="time current">{{ currentTimeStr }}</span>
            <span class="time total">{{ totalTimeStr }}</span>
        </span>
        <span class="progress" ref="progress" @click="skipTime"  v-show="isShow">
            <div class="loaded" ref="loaded"></div>
            <div class="line"></div>
            <div class="bar"></div>
        </span>
        <span class="triangle" @mouseenter="isShow=true"></span>
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
            totalTimeStr: '00:00:00',
            isShow: false
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
    width: 100%;
    min-width: 800px;
    height: 32px;
    position: fixed;
    left: 0;
    bottom: 0px;
    z-index: 555;
    /* border: 1px blue solid; */
    opacity: 0.7;
}

.controlButton {
    display: inline-block;
    width: 40px;
    height: 32px;
    background-color: #5cadff;
    color: white;
    float: left;
    /* border: 1px red solid; */
}

.squire {
    display: inline-block;
    float: left;
    width: 40px;
    height: 32px;
    background-color: #5cadff;
    color: white;
}

.squire .icons {
    margin-left: 12px;
    margin-top: 8px;
    cursor: pointer;
}

.squire .icons:hover {
    color: gray;
}

.triangle {
    display: inline-block;
    width: 0;
    height: 0;
    border-bottom: 32px solid #5cadff;
    border-right: 32px solid transparent;
    float: left;
}

.progress {
    width: 50%;
    height: 5px;
    border-radius: 3px;
    overflow: hidden;
    background-color: #5cadff;
    cursor: pointer;
    position: absolute;
    top: 23px;
    right: 5%;
}

/*已播放进度*/
.progress .loaded {
    width: 0;
    height: 100%;
    background-color: gray;
}

.progress .line {
    width: 0;
    height: 100%;
    background-color: #5cadff;
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
    height: 32px;
    width: 150px;
    background-color: #5cadff;
    color: white;
    font-size: 16px;
    float: left;
}

.timer .time {
    display: inline-block;
    margin-top: 6px;
}
</style>