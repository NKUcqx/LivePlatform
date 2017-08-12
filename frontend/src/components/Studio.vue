<template>
    <div id="studio" :style="wholeHEIGHT">
        <topbar id="topbar"></topbar>
        <div id="left-part" ref="leftPart">
            <div id="infobar">
                <img src="../assets/logo.png" id="teacher-avatar" alt="head-image" :width="img.size" :height="img.size" @click="avatarModal = true">
                <div id="studio-info">
                    <div id="title">
                        <h2 id="title-content">{{roomInfo.title}}</h2>
                        <Button id="switch-section" type="ghost" @click="changeSection()" v-if="isShow"><Icon type="arrow-swap"></Icon></Button>
                        <Button id="switch-section" type="ghost" @click="openMinor()" v-else><Icon type="android-open"></Icon></Button>
                    </div>
                    <div id="footer">
                        <Tag type="border" color="yellow" id="roomid"><Icon type="home"></Icon> {{roomInfo.id}}</Tag>
                        <Tag type="border" color="red" id="vip"><Icon type="trophy"></Icon> vip</Tag>
                        <Tag type="border" color="green" id="audience"><Icon type="person-stalker"></Icon> {{roomInfo.audience}}</Tag>
                        <Tag type="border" color="blue" id="teacher"><Icon type="person"></Icon> {{roomInfo.teacher}}</Tag>
                    </div>
                </div>
            </div>
            <div id="main-section" @mouseenter="isMouseOnMain = true" @mouseleave = "isMouseOnMain = false">
                <close-button class="close-button" @close="closeMain" :isWork="(isWorkOnMain)?true:false" v-if="isMouseOnMain"></close-button>
                <my-canvas :WIDTH="mainWIDTH" :HEIGHT="mainWIDTH * 0.65" SIZE="large" @send="sentMessage"></my-canvas>
            </div>
        </div>
        <div id="right-part" ref="rightPart">
            <div id="minor-section" ref="minor" v-if="isShow"  @mouseenter="isMouseOnMinor = true" @mouseleave = "isMouseOnMinor = false">
                <close-button class="close-button" @close="closeMinor" :isWork="(isWorkOnMain)?false:true" v-if="isMouseOnMinor"></close-button>
                <my-canvas ref="canvas" :WIDTH="mainWIDTH * 0.7" :HEIGHT="minorWIDTH * 0.65" SIZE=""></my-canvas>
            </div>
            <div id="chat-section">
                <img src="../../static/white.png" :width="minorWIDTH" :height="chatHeight">
            </div>      
        </div>
    </div>
</template>

<script>
import Topbar from './tinyComponents/Topbar'
import MyCanvas from './tinyComponents/Canvas'
import CloseButton from './tinyComponents/CloseButton'
import io from 'socket.io-client'
import { mapGetters } from 'vuex'
export default {
    components: {
        Topbar,
        MyCanvas,
        CloseButton
    },
    sockets: {
        connect: function () {
            this.$socket.emit('join', { room_name: '4acf53c3a68c554e51c38178d1b9b268' })
            console.log('connect to remote server')
        },
        disconnect: function () {
            console.log('disconnect with remote server')
        },
        loadHistory: function (data) {
            console.log(typeof data.messages)
        },
        updateMessage: function (data) {
            let component = ''
            switch (data.content.sendType) {
                case 0:
                    component = 'canvas'
                    break
                case 1:
                    component = 'canvas'
                    break
                case 2:
                    component = 'code'
                    break
            }
            this.$refs[component].reseive(data.content)
        },
        formatError: function (data) {
            console.log(data.message)
        }
    },
    data () {
        return {
            isShow: true,
            isMouseOnMain: false,
            isMouseOnMinor: false,
            isWorkOnMain: true,
            closePosition: {
                right: '',
                top: ''
            },
            wholeHEIGHT: {
                height: ''
            },
            mainWIDTH: 0,
            minorWIDTH: 0,
            chatHeight: 0,
            img: {
                size: 50
            },
            roomInfo: {
                id: 500,
                title: 'Welcome To Our World',
                teacher: 'gongyansongisgood',
                audience: 3000,
                room_id: ''
            }
        }
    },
    computed: {
        ...mapGetters({user: 'getUser'})
    },
    methods: {
        openMinor () {
            this.isShow = true
            this.chatHeight = this.$refs.leftPart.getBoundingClientRect().width * 0.195 + 90
        },
        closeMain () {
            this.isShow = false
            this.chatHeight = this.$refs.leftPart.getBoundingClientRect().height - 20
        },
        closeMinor () {
            this.isShow = false
            this.chatHeight = this.$refs.leftPart.getBoundingClientRect().height - 20
        },
        changeSection () {
            this.isWorkOnMain = (this.isWorkOnMain) ? false : true
        },
        buildConnect () {
            this.socket = io('http://localhost:8002')
            this.listen('connect', () => {
                this.emit('', 0, 'join')
                this.listen('Error', (data) => { // this receiver will get error msg directly
                    console.log('Error: ' + data)
                })
                this.listen('updateMessage', (data) => {
                    console.log('updateMessage: ' + data)
                })
                this.listen('loadHistory', (data) => {
                    console.log('loadHistory: ' + data)
                })
                this.listen('getAudience', (data) => {
                    console.log(data)
                })
                this.emit('123', 0, 'sendMessage')
                this.emit('123', 1, 'sendMessage')
                this.emit('123', 2, 'sendMessage')
                this.emit('123', 3, 'sendMessage')

                this.emit('123', 0, 'getAudience')
                this.emit('123', 0, 'leave')
                this.emit('123', 1, 'getAudience')
                this.emit('123', 1, 'leave')
                this.emit('123', 2, 'getAudience')
                this.emit('123', 2, 'leave')
                this.emit('123', 3, 'getAudience')
                this.emit('123', 3, 'leave')

                this.emit('123', 0, 'endRoom')
            })
        },
        isValid (content, type = 'string') {
            return content !== undefined && content !== null && typeof content === type && content !== ''
        },
        emit (content = '', type = 2, signal = 'sendMessage') {
            const pack = {
                'room_name': 'testroom',
                'nickname': 'this.user.nickname',
                'content': {'content': content},
                'type': type,
                'signal': signal
            }
            this.socket.emit(signal, pack)
        },
        listen (signal, func) { // func is a callback
            if (this.isValid(signal) && this.isValid(func, 'function')) {
                this.socket.on(signal, (data) => {
                    func(data)
                })
            } else {
                throw Error('param format error')
            }
        }
    },
    created () {
        console.log(this.$route.params)
        this.roomInfo.id = this.$route.params.id
        this.roomInfo.teacher = this.$route.params.creator
        this.roomInfo.audience = this.$route.params.audience_amount
        this.roomInfo.title = this.$route.params.name
        //
    },
    mounted () {
        this.mainWIDTH = this.$refs.leftPart.getBoundingClientRect().width
        this.minorWIDTH = this.$refs.leftPart.getBoundingClientRect().width * 0.7
        this.chatHeight = this.$refs.leftPart.getBoundingClientRect().width * 0.195 + 90
        this.wholeHEIGHT.height = document.documentElement.clientHeight.toString() + 'px'
        window.addEventListener('resize', () => {
            this.mainWIDTH = this.$refs.leftPart.getBoundingClientRect().width
            this.minorWIDTH = this.$refs.leftPart.getBoundingClientRect().width * 0.7
            this.wholeHEIGHT.height = document.documentElement.clientHeight.toString() + 'px'
            if (this.isShow) {
                this.chatHeight = this.$refs.leftPart.getBoundingClientRect().width * 0.195 + 90
            } else {
                this.chatHeight = this.$refs.leftPart.getBoundingClientRect().height - 20
            }
        })
        this.buildConnect()
    }
}
</script>

<style scoped>
    #studio {
        width: 100%;
        min-width: 800px;
        text-align: left;
        background-color: rgb(239,239,239);
    }
    #topbar {
        min-width: 800px;
    }
    #left-part {
        margin: 20px 5% 20px 5%; 
        display: inline-block;
        width: 50%;
        min-width: 400px;
    }
    #infobar {
        width: 100%;
        height: 80px;
        border: 1px solid rgb(241,241,241);
    }
    #teacher-avatar {  
        padding: 0px;
        border: 2px solid rgba(180,230,180,0.7);
        background-color: rgb(210,210,210);
        border-radius: 50%;
        margin: 15px 10px 15px 10px;
    }
    #studio-info {
        display: inline-block;
        width: calc(100% - 50px - 30px);
        height: 80px;
    }
    #studio-info *{
       overflow: hidden;
    }
    #studio-info #title {
        width: 100%;
        height: 48px;
    }
    #studio-info #title #title-content{
        float: left;
        font-size: 26px;
        padding: 5px 0px 5px 30px;
        width: 85%;
        height: 48px;
    }
    #studio-info #footer {
        width: 100%;
        height: 32px;
    }
    #studio-info #switch-section {
        height: 30px;
        float: right;
        margin: 9px 5px 9px 5px;
    }
    #studio-info #teacher {
        height: 26px;
        float: right;
    }
    #studio-info #audience {
        height: 26px;
        float: right;
    }
    #studio-info #vip {
        float: left;
        height: 24px;
    }
    #studio-info #roomid {
        margin-left: 30px;
        float: left;
        height: 24px;
    }
    #main-section {
        margin: 30px 0px 0px 0px;
        width: 100%;
        height: 0;
        padding-bottom: 65%;
        background-color: white;
    }
    #right-part {
        margin: 20px 5% 20px 0%; 
        display: inline-block;
        width: 35%;
        min-width: 280px;
        float: right;
    }
    #infobar, #minor-section, #chat-section, #main-section {
        -moz-box-shadow:2px 2px 10px #A1A1A1;
        -webkit-box-shadow:2px 2px 10px #A1A1A1; 
        box-shadow: 2px 2px 10px #A1A1A1;
        background-color: white;
    }
    #minor-section {
        display: block;
    }
    #chat-section {
        width: 100%;
        display: block;
        margin: 10px 0px 0px 0px;
    }
    #chat-close {
        position: absolute;
        color: red;
    }
</style>
