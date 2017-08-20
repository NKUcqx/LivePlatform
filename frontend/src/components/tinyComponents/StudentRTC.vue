<template>
    <div class="studentRTC" @mouseenter="showToolBar()" @mouseleave="hideToolBar()">
        <div class="video">
            <div id="agora_remote" :style="position2" :disabled="!(screen)"></div>
        </div>
        <!--Button class="join" :disabled="isJoin" @click="join()" type="circle" class="buttons left">开</Button>
        <Button class="leave" :disabled="!(isJoin)" @click="leave()">结束观看</Button-->
         <div id="relative">
            <div id="toolbar" :style="toolbarStyle" v-show="isBarShown">

                <Button icon="arrow-right-b" v-show="hasVideo===false" @click="enableVideo()" type="circle" class="buttons left" size="small"></Button>
                <Button icon="ios-pause" v-show="hasVideo===true" @click="disableVideo()" type="circle" class="buttons left" size="small"></Button>
                <Button icon="ios-mic-outline" v-show="hasAudio===false" @click="enableAudio()" type="circle" class="buttons right" size="small"></Button>
                <Button icon="ios-mic-off" v-show="hasAudio===true" @click="disableAudio()" type="circle" class="buttons right" size="small"></Button>
            </div>
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

/**
 *学生端直播组件
 *@class StudentRTC
 *@constructor
 */
export default {
    props: {
        WIDTH: {
            type: Number,
            default: 280
        },
        HEIGHT: {
            type: Number,
            default: 182
        },
        ROOM: {
            type: String,
            default: '1000'
        }
    },
    watch: {
        'HEIGHT': function () {
            this.position2.width = this.WIDTH.toString() + 'px'
            this.position2.height = (this.HEIGHT).toString() + 'px'
            this.toolbarStyle.width = (this.WIDTH - 50).toString() + 'px'
        }
    },
    data () {
        return {
            isBarShown: false,
            screen: false,
            isJoin: false,
            hasVideo: true,
            hasAudio: true,
            appKey: '0c6a0a8f844c49d78a9aac0907dfc1d8',
            client: undefined,
            remoteStream: undefined,
            toolbarStyle: {
                width: ''
            },
            position2: {
                width: '280px',
                height: '182px',
                display: 'inline-block'
            }
        }
    },
    computed: {
        ...mapGetters({
            isLiveStart: 'isLiveStart'
        })
    },
    methods: {
        /**
         *显示工具栏
         *@event showToolBar
         */
        showToolBar () {
            this.isBarShown = true
        },
        /**
         *隐藏工具栏
         *@event hideToolBar
         */
        hideToolBar () {
            this.isBarShown = false
        },
        /**
         *学生加入房间
         *@event join
         */
        join () {
            this.isJoin = true
            let dynamicKey = null
            // 创建客户端
            this.client = AgoraRTC.createClient({mode: 'interop'})
            let that = this
            // 初始化客户端
            this.client.init(this.appKey, function () {
                console.log('AgoraRTC client initialized')
                // 加入频道，uid由系统返还
                that.client.join(dynamicKey, that.ROOM, null, function (uid) {
                    console.log('User ' + uid + ' join channel successfully')
                }, function (err) {
                    console.log('Join channel failed', err)
                })
            }, function (err) {
                console.log('AgoraRTC client init failed', err)
            })
            this.client.on('error', function (err) { that.onError(err) })
            this.client.on('stream-added', function (evt) { that.onAdd(evt) })
            this.client.on('stream-subscribed', function (evt) { that.onSubscribe(evt) })
            this.client.on('stream-removed', function (evt) { that.onRemove(evt) })
            this.client.on('peer-leave', function (evt) { that.onLeave(evt) })
        },
        /**
         *声网报错回调事件,控制台输出错误原因
         *@event onError
         *@param {Object} err
         */
        onError (err) {
            console.log('Got error msg:', err.reason)
        },
        /**
         *远程音视频流已添加回调事件,订阅远端视频流
         *@event onAdd
         *@param {Object} evt
         */
        onAdd (evt) {
            let stream = evt.stream
            console.log('New stream added: ' + stream.getId())
            console.log('Subscribe ', stream)
            // 订阅远端视频流
            this.client.subscribe(stream, function (err) {
                console.log('Subscribe stream failed', err)
            })
        },
        /**
         *远程音视频流已订阅回调事件,播放远端视频流
         *@event onSubscribe
         *@param {Object} evt
         */
        onSubscribe (evt) {
            let stream = evt.stream
            console.log('Subscribe remote stream successfully: ' + stream.getId())
            // 播放远端视频流
            this.$Message.info('直播即将开始')
            this.screen = true
            this.remoteStream = stream
            stream.play('agora_remote')
        },
        /**
         *远程音视频流已删除回调事件,即远端暂停推流
         *@event onRemove
         *@param {Object} evt
         */
        onRemove (evt) {
            let stream = evt.stream
            stream.stop()
            this.$Message.info('老师暂停直播')
            this.screen = false
            console.log('Remote stream is removed ' + stream.getId())
        },
        /**
         *老师结束直播回调事件
         *@event onLeave
         *@param {Object} evt
         */
        onLeave (evt) {
            let stream = evt.stream
            if (stream) {
                this.$Message.info('直播结束')
                stream.stop()
                this.screen = false
                console.log(evt.uid + ' leaved from this channel')
            }
        },
        /**
         *学生退出房间
         *@event leave
         */
        leave () {
            this.isJoin = false
            this.screen = false
            this.client.leave(function () {
                console.log('Leavel channel successfully')
            }, function (err) {
                console.log('Leave channel failed: ', err)
            })
            /* this.$Modal.confirm({
                title: '教育直播平台提醒您：',
                content: '<p>确定退出直播吗？</p>',
                onOk: () => {
                    this.isJoin = false
                    this.screen = false
                    this.client.leave(function () {
                        console.log('Leavel channel successfully')
                    }, function (err) {
                        console.log('Leave channel failed: ', err)
                    })
                },
                onCancel: () => {
                    this.$Message.info('请继续观看直播')
                }
            }) */
        },
        /**
         *学生重启视频教学
         *@event enableVideo
         */
        enableVideo () {
            if (this.isLiveStart) {
                this.$Modal.info({
                    title: '教育直播平台提醒您：',
                    content: '<p>您已经重启了视频教学</p>'
                })
                this.hasVideo = true
                this.remoteStream.enableVideo()
            } else {
                this.$Modal.warning({
                    title: '教育直播平台提醒您：',
                    content: '<p>老师尚未开启直播</p>'
                })
            }
        },
        /**
         *学生暂停视频教学
         *@event disableVideo
         */
        disableVideo () {
            if (this.isLiveStart) {
                this.$Modal.info({
                    title: '教育直播平台提醒您：',
                    content: '<p>您已经暂停了视频教学</p>'
                })
                this.hasVideo = false
                this.remoteStream.disableVideo()
            } else {
                this.$Modal.warning({
                    title: '教育直播平台提醒您：',
                    content: '<p>老师尚未开启直播</p>'
                })
            }
        },
        /**
         *学生开启声音
         *@event enableAudio
         */
        enableAudio () {
            if (isLiveStart) {
                this.hasAudio = true
                this.remoteStream.enableAudio()
            }
        },
        /**
         *学生静音
         *@event disableAudio
         */
        disableAudio () {
            if (isLiveStart) {
                this.hasAudio = false
                this.remoteStream.disableAudio()
            }
        }
    },
    mounted () {
        this.join()
        console.log(this.ROOM)
    },
    beforeDestroy () {
        this.leave()
    }
}
</script>

<style scoped>
.studentRTC .video {
}

.studentRTC #relative {
    width: 0;
    height: 0;
    display: block;
    float: left;
}

.studentRTC #toolbar {
    position: relative;
    top: -30px;
    left: 0px;
    height: 32px;
    float: left;
    overflow: hidden;
}

.studentRTC .left {
}

.studentRTC .right {
}

.studentRTC .buttons {
    color: rgb(45,140,240);
    background-color: rgba(0,0,0,0) !important;
    margin: 0px 10px 0px 5px;
}
</style>