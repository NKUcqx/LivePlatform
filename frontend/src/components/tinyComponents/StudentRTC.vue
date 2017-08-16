<template>
    <div class="studentRTC">
            <Card class="video" :style="position1">
                <div id="agora_remote" :style="position2" :disabled="!(screen)"></div>
            </Card>
            <br><br>
            <Button class="join" :disabled="isJoin" @click="join()">开始观看</Button>
            <Button class="leave" :disabled="!(isJoin)" @click="leave()">结束观看</Button>
            <Button-group shape="circle">
                <Button icon="arrow-right-b" :disabled="hasVideo" @click="enableVideo()" type="ghost" class="buttons"></Button>
                <Button icon="ios-pause" :disabled="!(hasVideo)" @click="disableVideo()" type="ghost" class="buttons"></Button>
            </Button-group>
            <Button-group shape="circle">
                <Button icon="ios-mic-outline" :disabled="hasAudio" @click="enableAudio()"></Button>
                <Button icon="ios-mic-off" :disabled="!(hasAudio)" @click="disableAudio()"></Button>
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
            hasVideo: true,
            hasAudio: true,
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
            this.client.on('error', function (err) { that.onError(err) })
            this.client.on('stream-added', function (evt) { that.onAdd(evt) })
            this.client.on('stream-subscribed', function (evt) { that.onSubscribe(evt) })
            this.client.on('stream-removed', function (evt) { that.onRemove(evt) })
            this.client.on('peer-leave', function (evt) { that.onLeave(evt) })
        },
        onError (err) {
            console.log('Got error msg:', err.reason)
        },
        // 远程音视频流已添加回调事件
        onAdd (evt) {
            let stream = evt.stream
            console.log('New stream added: ' + stream.getId())
            console.log('Subscribe ', stream)
            // 订阅远端视频流
            this.client.subscribe(stream, function (err) {
                console.log('Subscribe stream failed', err)
            })
        },
        // 远程音视频流已订阅回调事件
        onSubscribe (evt) {
            let stream = evt.stream
            console.log('Subscribe remote stream successfully: ' + stream.getId())
            // 播放远端视频流
            this.$Message.info('直播即将开始')
            this.screen = true
            this.remoteStream = stream
            stream.play('agora_remote')
        },
        // 远程音视频流已删除回调事件
        onRemove (evt) {
            let stream = evt.stream
            stream.stop()
            this.$Message.info('老师暂停直播')
            this.screen = false
            console.log('Remote stream is removed ' + stream.getId())
        },
        // 对方调用了client.leave()结束直播
        onLeave (evt) {
            let stream = evt.stream
            if (stream) {
                this.$Message.info('直播结束')
                stream.stop()
                this.screen = false
                console.log(evt.uid + ' leaved from this channel')
            }
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
                    this.$Message.info('请继续观看直播')
                }
            })
        },
        enableVideo () {
            this.$Modal.info({
                title: '教育直播平台提醒您：',
                content: '<p>您已经重启了视频教学</p>'
            })
            this.hasVideo = true
            this.remoteStream.enableVideo()
        },
        disableVideo () {
            this.$Modal.info({
                title: '教育直播平台提醒您：',
                content: '<p>您已经暂停了视频教学</p>'
            })
            this.hasVideo = false
            this.remoteStream.disableVideo()
        },
        enableAudio () {
            this.hasAudio = true
            this.remoteStream.enableAudio()
        },
        disableAudio () {
            this.hasAudio = false
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