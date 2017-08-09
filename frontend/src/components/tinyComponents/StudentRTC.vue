<template>
    <div class="studentRTC">
            <Card class="video" :style="position1">
                <div id="agora_remote" :style="position2" :disabled="!(screen)"></div>
            </Card>
            <br><br>
            <Button class="join" :disabled="isJoin" @click="join()">开始观看</Button>
            <Button class="leave" :disabled="!(isJoin)" @click="leave()">结束观看</Button>
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
            screen: false,
            isJoin: false,
            sound: true,
            appKey: '0c6a0a8f844c49d78a9aac0907dfc1d8',
            client: undefined,
            remoteStream: undefined,
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

            // 远程音视频流已添加回调事件
            this.client.on('stream-added', function (evt) {
                let stream = evt.stream
                console.log('New stream added: ' + stream.getId())
                console.log('Subscribe ', stream)
                // 订阅远端视频流
                that.client.subscribe(stream, function (err) {
                    console.log('Subscribe stream failed', err)
                })
            })

            // 远程音视频流已订阅回调事件
            this.client.on('stream-subscribed', function (evt) {
                let stream = evt.stream
                console.log('Subscribe remote stream successfully: ' + stream.getId())
                // 播放远端视频流
                that.$Message.info('直播即将开始')
                that.screen = true
                that.remoteStream = stream
                stream.play('agora_remote')
            })

            // 远程音视频流已删除回调事件
            this.client.on('stream-removed', function (evt) {
                let stream = evt.stream
                stream.stop()
                that.$Message.info('老师暂停直播')
                that.screen = false
                console.log('Remote stream is removed ' + stream.getId())
            })

            // 对方调用了client.leave()结束直播
            this.client.on('peer-leave', function (evt) {
                let stream = evt.stream
                if (stream) {
                    that.$Message.info('直播结束')
                    stream.stop()
                    that.screen = false
                    console.log(evt.uid + ' leaved from this channel')
                }
            })
        },
        leave () {
            this.$Modal.confirm({
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
                    this.$Message.info('请继续直播')
                }
            })
        },
        speak () {
            this.sound = true
            this.remoteStream.enableAudio()
        },
        mute () {
            this.sound = false
            this.remoteStream.disableAudio()
        }
    }
}
</script>

<style scoped>
.video {
    background-color: rgb(200, 200, 200);
}
</style>