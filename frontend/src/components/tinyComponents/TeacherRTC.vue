<template>
    <div class="teacherRTC">
            <Card class="video" :style="position1">
                <div id="agora_local" :style="position2"></div>
            </Card>
            <br><br>
            <Button class="join" :disabled="isJoin" @click="join()">开始直播</Button>
            <Button class="leave" :disabled="!(isJoin)" @click="leave()">结束直播</Button>
            <Button-group shape="circle">
                <Button icon="arrow-right-b" :disabled="isPublish" @click="publish()"></Button>
                <Button icon="ios-pause" :disabled="!(isPublish)" @click="unpublish()"></Button>
            </Button-group>
            <Button-group shape="circle">
                <Button icon="ios-mic-outline" :disabled="sound" @click="speak()"></Button>
                <Button icon="ios-mic-off" :disabled="!(sound)" @click="mute()"></Button>
            </Button-group>
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
            default: 400
        },
        ROOM: {
            type: String,
            default: '1000'
        }
    },
    data () {
        return {
            isJoin: false,
            isPublish: true,
            sound: true,
            appKey: '0c6a0a8f844c49d78a9aac0907dfc1d8',
            client: undefined,
            localStream: undefined,
            position1: {
                width: '650px',
                height: '450px',
                display: 'inline-block'
            },
            position2: {
                width: '600px',
                height: '400px',
                display: 'inline-block'
            }
        }
    },
    methods: {
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
                        audio: that.sound,
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

            let channelKey = ''
            this.client.on('error', function (err) {
                console.log('Got error msg:', err.reason)
                if (err.reason === 'DYNAMIC_KEY_TIMEOUT') {
                    that.client.renewChannelKey(channelKey, function () {
                        console.log('Renew channel key successfully')
                    }, function (err) {
                        console.log('Renew channel key failed: ', err)
                    })
                }
            })
        },
        leave () {
            this.$Modal.confirm({
                title: '教育直播平台提醒您：',
                content: '<p>确定退出直播吗？</p>',
                onOk: () => {
                    this.isJoin = false
                    this.client.leave(function () {
                        console.log('Leavel channel successfully')
                    }, function (err) {
                        console.log('Leave channel failed: ', err)
                    })
                },
                onCancel: () => {
                    this.$Message.info('请继续直播')
                }
            })
        },
        publish () {
            this.$Modal.info({
                title: '教育直播平台提醒您：',
                content: '<p>您已经重启了直播</p>'
            })
            this.isPublish = true
            this.client.publish(this.localStream, function (err) {
                console.log('Publish local stream error: ' + err)
            })
        },
        unpublish () {
            this.$Modal.info({
                title: '教育直播平台提醒您：',
                content: '<p>您已经暂停了直播</p>'
            })
            this.isPublish = false
            this.client.unpublish(this.localStream, function (err) {
                console.log('Unpublish local stream failed' + err)
            })
        },
        speak () {
            this.sound = true
            this.localStream.enableAudio()
        },
        mute () {
            this.sound = false
            this.localStream.disableAudio()
        }
    }
}
</script>

<style scoped>
.video {
    background-color: rgb(200, 200, 200);
}
</style>