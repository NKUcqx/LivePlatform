<template>
    <div class="teacherRTC"  @mouseenter="showToolBar()" @mouseleave="hideToolBar()">
            <div class="video">
                <div id="agora_local" :style="position2"></div>
            </div>
            <div id="relative">
                <div id="toolbar" :style="toolbarStyle" v-show="isBarShown">
                    <!--Button class="join buttons" :disabled="isJoin" @click="join()" type="ghost">Start</Button>
                    <Button class="leave buttons" :disabled="!(isJoin)" @click="leave()" type="ghost">End</Button-->
                    <Button icon="arrow-right-b" v-show="hasVideo===false" @click="enableVideo()" type="circle" class="buttons left" size="small"></Button>
                    <Button icon="ios-pause" v-show="hasVideo===true" @click="disableVideo()" type="circle" class="buttons left" size="small"></Button>
                    <Button icon="ios-mic-off" v-show="hasAudio===false" @click="enableAudio()" type="circle" class="buttons right" size="small"></Button>
                    <Button icon="ios-mic-outline" v-show="hasAudio===true" @click="disableAudio()" type="circle" class="buttons right" size="small"></Button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
    props: {
        WIDTH: {
            type: Number,
            default: 600
        },
        HEIGHT: {
            type: Number,
            default: 500
        },
        ROOM: {
            type: String,
            default: '1000'
        }
    },
    computed: {
        ...mapGetters({
            user: 'getUser',
            liveState: 'getLiveState'
        })
    },
    watch: {
        'HEIGHT': function () {
            this.position2.width = this.WIDTH.toString() + 'px'
            this.position2.height = (this.HEIGHT).toString() + 'px'
            this.toolbarStyle.width = this.WIDTH.toString() + 'px'
        },
        'liveState.isStart': function (newVal, oldVal) {
            if (oldVal === false && newVal === true) {
                this.$Message.success('Live has already started !')
                this.join()
            } else if (oldVal === true && newVal === false) {
                this.$Message.success('Live has already ended !')
                console.log('teacher leave')
                this.leave()
            }
        }
    },
    data () {
        return {
            isBarShown: false,
            isJoin: false,
            hasVideo: true,
            hasAudio: true,
            appKey: '0c6a0a8f844c49d78a9aac0907dfc1d8',
            client: undefined,
            localStream: undefined,
            toolbarStyle: {
                width: ''
            },
            position2: {
                width: '600px',
                height: '500px',
                display: 'inline-block'
            }
        }
    },
    methods: {
        showToolBar () {
            this.isBarShown = true
        },
        hideToolBar () {
            this.isBarShown = false
        },
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
                    // 创建本地音视频流
                    that.localStream = AgoraRTC.createStream({streamID: uid,
                        audio: true,
                        video: true,
                        screen: false})
                    that.localStream.setVideoProfile('720p_3')
                    that.localStream.init(function () {
                        console.log('getUserMedia successfully')
                        // 播放本地音视频流
                        that.localStream.play('agora_local')
                        // 将本地音视频流发布到agora服务器
                        that.client.publish(that.localStream, function (err) {
                            console.log('Publish local stream error: ' + err)
                        })
                        // 本地音视频已上传回调事件
                        that.client.on('stream-published', function (evt) {
                            console.log('Publish local stream successfully')
                        })
                    }, function (err) {
                        console.log('getUserMedia failed', err)
                    })
                }, function (err) {
                    console.log('Join channel failed', err)
                })
            }, function (err) {
                console.log('AgoraRTC client init failed', err)
            })
            this.client.on('error', function (err) {
                console.log('Got error msg:', err.reason)
            })
        },
        leave () {
            this.isJoin = false
            this.client.leave(function () {
                console.log('Leavel channel successfully')
                // add by gongyansong
                that.$router.push({path: '/home'})
            }, function (err) {
                console.log('Leave channel failed: ', err)
            })
            /* let that = this
            this.$Modal.confirm({
                title: '教育直播平台提醒您：',
                content: '<p>确定退出直播吗？</p>',
                onOk: () => {
                    this.isJoin = false
                    this.client.leave(function () {
                        console.log('Leavel channel successfully')
                        // add by gongyansong
                        that.$router.push({path: '/home'})
                    }, function (err) {
                        console.log('Leave channel failed: ', err)
                    })
                },
                onCancel: () => {
                    this.$Message.info('请继续直播')
                }
            }) */
        },
        enableVideo () {
            this.$Modal.info({
                title: '教育直播平台提醒您：',
                content: '<p>您已经重启了视频教学</p>'
            })
            this.hasVideo = true
            this.localStream.enableVideo()
        },
        disableVideo () {
            this.$Modal.info({
                title: '教育直播平台提醒您：',
                content: '<p>您已经暂停了视频教学</p>'
            })
            this.hasVideo = false
            this.localStream.disableVideo()
        },
        enableAudio () {
            this.hasAudio = true
            this.localStream.enableAudio()
        },
        disableAudio () {
            this.hasAudio = false
            this.localStream.disableAudio()
        }
    }
}
</script>

<style scoped>
.video {
}

#relative {
    width: 0;
    height: 0;
    display: block;
    float: left;
}

#toolbar {
    position: relative;
    top: -30px;
    left: 0px;
    height: 32px;
    float: left;
    overflow: hidden;
}

.buttons {
    color: rgb(45,140,240);
    background-color: rgba(0,0,0,0) !important;
    margin: 0px 10px 0px 10px;
}

.left {
}

.right {
    float: right;
}
</style>