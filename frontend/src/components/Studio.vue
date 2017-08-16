<template>
    <div id="studio" :style="wholeSize">
        <topbar TYPE="studio" id="topbar" ref="topBar"></topbar>
        <Modal v-model="uploadModal" id="upload-modal">
            <Upload
                :headers = "{
                    'X-CSRFToken': getCookie() 
                }"
                name="thumbnail"
                type="drag"
                :on-success="changeThumbnail"
                :on-format-error="thumbnailTypeError"
                :on-exceeded-size="thumbnailSizeError"
                :show-upload-list="false"
                :format="['jpg','jpeg','png','gif','bmp']"
                :max-size="300"
                action="/setthumbnail/">
                <div>
                    <img :src="roomInfo.img" id="show-thumbnail">
                    <div class="upload-text">click image or drag to update your thumbnail of live</div>
                </div>
            </Upload>
            <Upload
                :headers = "{
                    'X-CSRFToken': getCookie() 
                }"
                name="silde"
                type="drag"
                :on-success="uploadSlide"
                :on-format-error="slideTypeError"
                :on-exceeded-size="slideSizeError"
                action="/uploadslide/"
                :show-upload-list="true"
                :format="['ppt','pptx','key']"
                :max-size="10*1024"
                id="upload-ppt">
                <div>
                    <img src="../assets/PPT.png" id="show-slide">
                    <div class="upload-text">click image or drag to upload your slide</div>
            </Upload>
            <div slot="footer" id="modal-footer">
                <Button type="primary" @click="readyForLive()">Ready</Button>
            </div>
        </Modal>
        <div id="fortop"></div>
            <div class="infobar left-part">
                <img src="../assets/logo.png" id="teacher-avatar" :class="(isCreator)?'creator-avatar':''" alt="head-image" :width="img.size" :height="img.size" @click="showUploadModal()">
                <div id="studio-info">
                    <div id="title">
                        <h2 id="title-content">{{roomInfo.title}}</h2>
                        <Button id="switch-section" type="ghost" @click="changeSection()" v-if="type===1"><Icon type="arrow-swap"></Icon></Button>
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
            <div :class="vedioClass" v-show="isVedioShow">
                <close-button class="close-button" @close="closeVideo()"  @change="changePanel" :isWork="false"></close-button>
                <keep-alive>
                    <teacher-rtc  :WIDTH="vedioSize.width" :HEIGHT="vedioSize.height"></teacher-rtc>
                </keep-alive>
            </div>
            <div :class="workClass" v-show="isWorkShow">
                <close-button class="close-button" @close="closeWork()" @change="changePanel" :isWork="true"></close-button>
                <keep-alive>
                    <ppt :WIDTH="workSize.width" :HEIGHT="workSize.height" @send="emitCode" v-if="style===0||style===3"></ppt>
                </keep-alive>
                <keep-alive>
                    <codedemo ref="code" :WIDTH="workSize.width" :HEIGHT="workSize.height" :CREATORID="roomInfo.creator_id" @send="emitCode" v-if="style===1||style===4"></codedemo>
                </keep-alive>
                <keep-alive>
                    <my-canvas ref="canvas" :SIZE="(style<3)?'':'small'" @send="emitCanvas" :WIDTH="workSize.width" :HEIGHT="workSize.height" id="canvas" v-if="style===2||style===5"></my-canvas>
                </keep-alive>
            </div>
            <div :class="chatClass">
                <chatdemo ref="chat" :ROLE="roomInfo.creator_id" :USERNAME="user.nickname" :ROOM="100" :WIDTH="chatSize.width" :HEIGHT="chatSize.height" @send="emitChat"></chatdemo>     
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
import { mapGetters, mapActions } from 'vuex'
import { isValid } from '../utils/checks'
import { beforePost, getCookie } from '../utils/utils'
import { CONST } from '../utils/const'

const STYLESTATES = {
    0: 'ppt and video',
    1: 'code and video',
    2: 'canvas and video',
    3: 'video and ppt',
    4: 'video and code',
    5: 'video and canvas'
}

const TYPESTATES = {
    0: 'work and chat',
    1: 'work and video and chat',
    2: 'video and chat,'
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
            type: 1,
            uploadModal: false,
            closePosition: {
                right: '',
                top: ''
            },
            wholeSize: {
                width: '100%',
                height: 0 + 'px'
            },
            WIDTH: 0,
            img: {
                size: 50
            },
            roomInfo: {
                id: 500,
                title: 'Welcome To Our World',
                teacher: 'gongyansongisgood',
                audience: 3000,
                room_id: '',
                creator_id: 0,
                is_living: false,
                img: '',
                slide: ''
            }
        }
    },
    computed: {
        ...mapGetters({
            user: 'getUser'
        }),
        workClass () {
            return (this.style < 3) ? 'main-section left-part' : 'minor-section right-part relative'
        },
        vedioClass () {
            return (this.style >= 3) ? 'main-section left-part' : 'minor-section right-part'
        },
        chatClass () {
            let str = 'chat-section right-part'
            if (this.style >= 3 || this.type !== 1) {
                str += ' relative'
            }
            return str
        },
        isWorkShow () {
            return (this.type <= 1) ? true : false
        },
        isVedioShow () {
            return (this.type >= 1) ? true : false
        },
        workSize () {
            return {
                width: (this.style < 3) ? this.WIDTH * 0.5 : this.WIDTH * 0.35,
                height: (this.style < 3) ? this.WIDTH * 0.5 * 0.65 : this.WIDTH * 0.35 * 0.65
            }
        },
        vedioSize () {
            return {
                width: (this.style >= 3) ? this.WIDTH * 0.5 : this.WIDTH * 0.35,
                height: (this.style >= 3) ? this.WIDTH * 0.5 * 0.65 : this.WIDTH * 0.35 * 0.65
            }
        },
        chatSize () {
            return {
                width: this.WIDTH * 0.35,
                height: (this.type === 1) ? this.WIDTH * 0.195 * 0.5 + 90 : this.WIDTH * 0.5 * 0.65 + 100
            }
        },
        isCreator () {
            return this.roomInfo.creator_id.toString() === this.user.userid.toString() && this.roomInfo.is_living
        }
    },
    methods: {
        ...mapActions({
            destroyLive: 'destroyLive'
        }),
        getCookie () {
            return getCookie('csrftoken')
        },
        openMinor () {
            this.type = 1
        },
        closeWork () {
            if (this.style < 3 && this.type === 1) {
                this.changeSection()
                this.type = 2
            } else if (this.style >= 3 && this.type === 1) {
                this.type = 2
            }
        },
        closeVideo () {
            console.log(this.type)
            if (this.style >= 3 && this.type === 1) {
                this.changeSection()
                this.type = 0
            } else if (this.style < 3 && this.type === 1) {
                this.type = 0
            }
        },
        changeSection () {
            this.style = (this.style < 3) ? this.style + 3 : this.style - 3
        },
        changePanel (index) {
            this.style = (this.style < 3) ? index : index + 3
        },
        endRoom () {
            let that = this
            this.destroyLive().then(function () {
                that.$router.push({ path: '/home' })
            }, function (res) {
                alert(res)
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
                room_name: 'static/rooms/da8b043782e79c9a00b87e6d333c67c2',
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
        },
        changeThumbnail (res, file) {
            console.log('static/users/' + this.user.username + '/' + file.name)
            let that = this
            setTimeout(function () {
                that.roomInfo.img = 'static/users/' + that.user.username + '/' + file.name
            }, 5000)
            this.$Message.success(CONST.success('Upload Thumbnail'))
        },
        uploadSlide (res, file) {
            this.$Message.success(CONST.success('Upload Slide'))
        },
        thumbnailTypeError (file, fileList) {
            this.$Message.error('thumbnail must be jpg jpeg png gif bmp')
        },
        thumbnailSizeError (file, fileList) {
            this.$Message.error('thumbnail must under 300K')
        },
        slideTypeError (file, fileList) {
            this.$Message.error('slide must be ppt pptx key')
        },
        slideSizeError (file, fileList) {
            this.$Message.error('slide must under 10M')
        },
        readyForLive () {
            this.uploadModal = false
            this.$Notice.info({
                title: 'Reopen the modal',
                desc: 'You can click the avatar on your left to change your thumbnail and ppt!',
                duration: 4
            })
        },
        showUploadModal () {
            if (this.roomInfo.creator_id.toString() === this.user.userid.toString() && this.roomInfo.is_living) {
                this.uploadModal = true
            }
        }
    },
    created () {
        console.log(this.$route.query)
        let room = this.$route.query
        // wating for optimization
        this.roomInfo.id = room.id
        this.roomInfo.teacher = (room.creater_name) ? room.creater_name : room.creater_nickname
        this.roomInfo.audience = room.audience_amount
        this.roomInfo.title = room.name
        this.roomInfo.creator_id = room.creater
        this.roomInfo.is_living = room.is_living
        this.roomInfo.img = room.thumbnail_path
        this.roomInfo.slide = room.slide_path
        //
    },
    mounted () {
        this.WIDTH = document.documentElement.clientWidth
        this.wholeSize.height = document.documentElement.clientHeight.toString() + 'px'
        window.addEventListener('resize', () => {
            this.WIDTH = document.documentElement.clientWidth
            this.wholeSize.height = document.documentElement.clientHeight.toString() + 'px'
        })
        this.buildConnect()
        if (this.isCreator) {
            this.uploadModal = true
        }
    },
    beforeDestroy () {
        console.log(this.roomInfo.is_living)
        if (this.isCreator) {
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
        vertical-align:left;
        overflow: hidden;
    }
    #upload-modal {
        text-align: center;
    }
    .left-part {
        margin: 20px 5% 20px 5%; 
        display: inline-block;
        width: 50%;
        min-width: 400px;
        float: left;
    }
    .infobar {
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
    .creator-avatar {
        cursor: pointer;
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
    .main-section {
        height: 0;
        padding-bottom: calc( 65% * 0.5 );
        background-color: white;
    }
    .right-part {
        display: inline-block;
        width: 35%;
        min-width: 280px;
        float: right;
    }
    .infobar, .minor-section, .chat-section, .main-section {
        -moz-box-shadow:2px 2px 10px #A1A1A1;
        -webkit-box-shadow:2px 2px 10px #A1A1A1; 
        box-shadow: 2px 2px 10px #A1A1A1;
        background-color: white;
    }
    .minor-section {
        margin: 20px 5% 0px 0%; 
        height: 0;
        padding-bottom: calc( 65% * 0.35 );
    }
    .chat-section {
        margin: 30px 5% 0px 0%; 
    }
    .relative {
        position: relative !important;
        top: -120px;
    }
    #show-slide {
        width: 64px;
        height: 64px;
        padding-top: 10px;
    }
    #show-thumbnail {
        width: 150px;
        height: 90px;
        padding-top: 10px;
    }
    .upload-text {
        font-size: 15px;
        margin-top: 10px;
        color: #5cadff;
    }
    #upload-ppt {
        margin-top: 40px;
    }
    #modal-footer {
        text-align: center;
        padding: 15px;
    }
</style>
