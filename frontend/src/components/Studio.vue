<template>
    <div id="studio" :style="wholeHEIGHT">
        <topbar TYPE="unstart" id="topbar"></topbar>
        <div id="fortop"></div>
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
                <close-button class="close-button" @close="closeMain" @change="changePanel" :isWork="(style<3)?true:false" v-if="isMouseOnMain"></close-button>

                <keep-alive>
                    <ppt :WIDTH="mainWIDTH" :HEIGHT="mainWIDTH * 0.65"  @send="emitCode" v-if="style===0"></ppt>
                </keep-alive>
                <keep-alive>
                    <codedemo ref="code" :WIDTH="mainWIDTH" :HEIGHT="mainWIDTH * 0.65" @send="emitCode" v-if="style===1"></codedemo>
                </keep-alive>
                <keep-alive>
                    <my-canvas ref="canvas" :WIDTH="mainWIDTH" :HEIGHT="mainWIDTH * 0.65" SIZE="" @send="emitCanvas" v-if="style===2"></my-canvas>
                </keep-alive>
                <keep-alive>
                    <teacher-rtc  :WIDTH="mainWIDTH * 0.7" :HEIGHT="minorWIDTH * 0.65" v-if="style>2">
                </teacher-rtc>
            </div>
        </div>
        <div id="right-part" ref="rightPart">
            <div id="minor-section" ref="minor" v-show="isShow"  @mouseenter="isMouseOnMinor = true" @mouseleave = "isMouseOnMinor = false">
                <close-button class="close-button" @close="closeMinor"  @change="changePanel" :isWork="(style>2)?true:false" v-if="isMouseOnMinor"></close-button>

                <keep-alive>
                    <ppt :WIDTH="minorWIDTH" :HEIGHT="minorWIDTH * 0.65"  @send="emitCode" v-if="style===3"></ppt>
                </keep-alive>
                <keep-alive>
                    <codedemo ref="code" :WIDTH="minorWIDTH" :HEIGHT="minorWIDTH * 0.65" @send="emitCode" v-if="style===4"></codedemo>
                </keep-alive>
                <keep-alive>
                    <my-canvas ref="canvas" :WIDTH="minorWIDTH" :HEIGHT="minorWIDTH * 0.65" SIZE="" @send="emitCanvas" v-if="style===5"></my-canvas>
                </keep-alive>
                <keep-alive>
                    <teacher-rtc  :WIDTH="minorWIDTH" :HEIGHT="minorWIDTH * 0.65" v-if="style<3"></teacher-rtc>
                </keep-alive>
            </div>
            <div id="chat-section">
                <chatdemo ref="chat" :ROLE="true" :USERNAME="user.nickname" :ROOM="100" :WIDTH="minorWIDTH" :HEIGHT="chatHeight" @send="emitChat"></chatdemo>
            
            </div>      
        </div>
    </div>
</template>

<script>
import Topbar from './tinyComponents/Topbar'
import MyCanvas from './tinyComponents/Canvas'
import CloseButton from './tinyComponents/CloseButton'
import TeacherRtc from './tinyComponents/TeacherRTC'
import StudentRtc from './tinyComponents/StudentRTC'
import Codedemo from './Codedemo'
import Chatdemo from './Chat'
import io from 'socket.io-client'
import { mapGetters } from 'vuex'
import { isValid } from '../utils/checks'
import { beforePost } from '../utils/utils'

const STYLESTATES = {
    0: 'ppt and video',
    1: 'code and video',
    2: 'canvas and video',
    3: 'video and ppt',
    4: 'video and code',
    5: 'video and canvas'
}

export default {
    components: {
        Topbar,
        MyCanvas,
        CloseButton,
        Codedemo,
        Chatdemo,
        TeacherRtc,
        StudentRtc
    },
    data () {
        return {
            style: 1,
            isShow: true,
            isMouseOnMain: false,
            isMouseOnMinor: false,
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
                room_id: '',
                creator_id: 0
            }
        }
    },
    computed: {
        ...mapGetters({
            user: 'getUser'
        })
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
            this.style = (this.style < 3) ? this.style + 3 : this.style - 3
        },
        changePanel (index) {
            this.style = (this.style < 3) ? index : index + 3
        },
        endRoom () {
            console.log('endroom')
            this.$http({
                url: '/endroom/',
                method: 'POST',
                before: function (request) { beforePost(request) }
            }).then(function (res) {
                console.log('endroom')
                this.$router.push({path: '/home'})
            }, function (res) {
                alert(res.status)
            })
        },
        buildConnect () {
            this.socket = io('http://localhost:8002')
            this.listen('connect', () => {
                this.emit(this.user.id, null, '', 0, 'join')
                this.listen('loadHistory', (data) => {
                    const toWhom = data
                    // get current content
                    this.emit(history, 'code', toWhom)
                    this.emit(history, 'canvas', toWhom)
                    // this.emit(history, 'chat')
                    console.log('loadHistory: ', toWhom)
                })
                this.listen('Error', (data) => { // this receiver will get error msg directly
                    console.log('Error: ', data)
                })
                this.listen('updateMessage', (data) => {
                    this.$refs[data.dataType].receive(data)
                })
            })
        },
        emitCanvas (data) {
            this.emit(data, 'canvas', null)
        },
        emitChat (data, to = null) {
            this.emit(data, 'chat', to, 2)
        },
        emitCode (data) {
            this.emit(data, 'code') // default is 1
        },
        emitSlide (data) {
            this.emit(data, 'slide')
        },
        emit (data, dataType, to = null, type = 1, signal = 'sendMessage') { // to which user he wanna send to
            const pack = {
                id: this.user.userid,
                room_name: 'static/rooms/51e2593b505c8ed141ee3f500f2691b4',
                content: {
                    id: this.user.userid,
                    nickname: this.user.nickname,
                    data: data,
                    dataType: dataType
                },
                type: type,
                signal: signal,
                to: to // that user's id, once it is a valid id, server will use type 0 directly whatever the 'type' is !!!
            }
            this.socket.emit(signal, pack)
        },
        listen (signal, func) { // func is a callback
            if (isValid(signal) && isValid(func, 'function')) {
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
        this.roomInfo.teacher = this.$route.params.creater_name
        this.roomInfo.audience = this.$route.params.audience_amount
        this.roomInfo.title = this.$route.params.name
        this.roomInfo.creator_id = this.$route.params.creater
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
    },
    beforeDestroy () {
        console.log(this.roomInfo.creator_id, this.user.userid)
        if (this.roomInfo.creator_id.toString() === this.user.userid.toString()) {
            this.endRoom()
        }
    }
}
</script>

<style scoped>
    #topbar {
        min-width: 800px;
        width: 100%;
        position: fixed;
        z-index: 60;
        overflow: hidden;
    }
    #fortop{
        min-width: 800px;
        width: 100%;
        height: 60px;
    }
    #studio {
        width: 100%;
        min-width: 800px;
        min-height: 600px;
        text-align: left;
        background-color: rgb(239,239,239);
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
        width: 100%;
        height: 0;
        padding-bottom: 65%;
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
