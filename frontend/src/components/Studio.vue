<template>
    <div id="studio" :style="wholeSize">
        <topbar TYPE="studio" id="topbar" ref="topBar" :AUTHORITY="authority"></topbar>
        <Modal v-model="uploadModal" id="upload-modal">
            <upload-button UPLOADTYPE="thumbnail" :ONSUCCESS="changeThumbnail" :IMGSRC="roomInfo.img"></upload-button>
            <upload-button UPLOADTYPE="slide" :ONSUCCESS="uploadSlide" :ONERROR="uploadSlideTimeout" :ONBEFORE="startLoading"></upload-button>
            <div slot="footer" id="modal-footer">
                <Button type="primary" @click="readyForLive()">Ready</Button>
            </div>
        </Modal>
        <div id="fortop"></div>
            <div class="infobar left-part">
                <img :src="roomInfo.img" id="teacher-avatar" :class="(authority)?'creator-avatar':''" alt="thum" :width="img.size" :height="img.size" @click="showUploadModal()">
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
                <close-button class="close-button" @close="closeVideo()" :isWork="false"></close-button>
                <keep-alive v-if="this.roomInfo.is_living">
                    <teacher-rtc :WIDTH="vedioSize.width" :HEIGHT="vedioSize.height" :ROOM="roomInfo.id+''" v-if="authority" @endroom='endRoom'></teacher-rtc>
                    <student-rtc :WIDTH="vedioSize.width" :HEIGHT="vedioSize.height" :ROOM="roomInfo.id+''" v-else></student-rtc>
                </keep-alive>
                <keep-alive v-else>
                    <mp4player :WIDTH="vedioSize.width" :HEIGHT="vedioSize.height"></mp4player>
                </keep-alive>
            </div>
            <div :class="workClass" v-show="isWorkShow">
                <close-button class="close-button" @close="closeWork()" @change="changePanel" @send="emitChangeSection" :isWork="true" :INIT="style" ref="closeButton" :AUTHORITY="authority"></close-button>
                <keep-alive>
                    <ppt ref="slide" :WIDTH="workSize.width" :HEIGHT="workSize.height" :LOADING="loading" @send="emitSlide" v-show="style===0||style===3" :AUTHORITY="authority"></ppt>
                </keep-alive>
                <keep-alive>
                    <codedemo ref="code" :WIDTH="workSize.width" :HEIGHT="workSize.height" @send="emitCode" v-show="style===1||style===4" :AUTHORITY="authority"></codedemo>
                </keep-alive>
                <keep-alive>
                    <my-canvas ref="canvas" :SIZE="(style<3)?'':'small'" @send="emitCanvas" :WIDTH="workSize.width" :HEIGHT="workSize.height" id="canvas" v-show="style===2||style===5" :AUTHORITY="authority"></my-canvas>
                </keep-alive>
            </div>
            <div :class="chatClass">
                <chatdemo ref="chat" :AUTHORITY="authority" :WIDTH="chatSize.width" :HEIGHT="chatSize.height" @send="emitChat"></chatdemo>     
            </div> 
            <div v-show="!(roomInfo.is_living)" id="progress-bar">
                <progress-bar></progress-bar>
            <div>
    </div>
</template>

<script>
/**
 *Module TinyComponents
 *
 *@module TinyComponents
 *@requires Utils
 */
import Topbar from './tinyComponents/Topbar'
import MyCanvas from './tinyComponents/Canvas'
import CloseButton from './tinyComponents/CloseButton'
import TeacherRtc from './tinyComponents/TeacherRTC'
import StudentRtc from './tinyComponents/StudentRTC'
import Mp4player from './tinyComponents/Mp4player'
import UploadButton from './tinyComponents/UploadButton'
import ProgressBar from './tinyComponents/ProgressBar'
import Codedemo from './Codedemo'
import Ppt from './PPT'
import Chatdemo from './Chat'
import { mapGetters, mapActions, mapMutations } from 'vuex'
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
/**
 *直播页
 *@class Studio
 *@constructor
 */
export default {
    components: {
        Topbar,
        MyCanvas,
        CloseButton,
        Codedemo,
        Chatdemo,
        Ppt,
        TeacherRtc,
        StudentRtc,
        UploadButton,
        Mp4player,
        ProgressBar
    },
    data () {
        return {
            loading: false,
            style: 0,
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
            isEnd: false,
            isFirtCodeMirror: true
        }
    },
    watch: {
        style: function (newVal, oldVal) {
            if ((newVal === 1 || newVal === 4) && this.isFirtCodeMirror) {
                let history = this.$refs['code'].getHistory()
                console.log(history)
                let that = this
                setTimeout(function () {
                    that.$refs['code'].receive({
                        data: {
                            type: 'code',
                            data: CONST.codeDrawing
                        }
                    })
                    setTimeout(function () {
                        that.$refs['code'].receive({
                            data: {
                                type: 'code',
                                data: history.data
                            }
                        })
                    }, 1500)
                }, 100)
                this.isFirtCodeMirror = false
            }
        },
        isLiveStart: function (newVal, oldVal) {
            if (oldVal === false && newVal === true) {
                this.buildConnect()
                this.emitStartLive()
            }
        }
    },
    computed: {
        ...mapGetters({
            user: 'getUser',
            roomInfo: 'getRoomInfo',
            socket: 'getSocket',
            isLiveStart: 'isLiveStart'
        }),
        workClass () {
            return (this.style < 3) ? 'main-section left-part' : 'minor-section right-part studio-relative'
        },
        vedioClass () {
            return (this.style >= 3) ? 'main-section left-part' : 'minor-section right-part'
        },
        chatClass () {
            let str = 'chat-section right-part'
            if (this.style >= 3 || this.type !== 1) {
                str += ' studio-relative'
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
            let theWidth = (this.WIDTH < 800) ? 800 : this.WIDTH
            return {
                width: (this.style < 3) ? theWidth * 0.5 : theWidth * 0.35,
                height: (this.style < 3) ? theWidth * 0.5 * 0.65 : theWidth * 0.35 * 0.65
            }
        },
        vedioSize () {
            let theWidth = (this.WIDTH < 800) ? 800 : this.WIDTH
            return {
                width: (this.style >= 3) ? theWidth * 0.5 : theWidth * 0.35,
                height: (this.style >= 3) ? theWidth * 0.5 * 0.65 : theWidth * 0.35 * 0.65
            }
        },
        chatSize () {
            let theWidth = (this.WIDTH < 800) ? 800 : this.WIDTH
            return {
                width: theWidth * 0.35,
                height: (this.type === 1) ? theWidth * 0.195 * 0.5 + 90 : theWidth * 0.5 * 0.65 + 100
            }
        },
        authority () {
            return this.roomInfo.creator_id.toString() === this.user.userid.toString() && this.roomInfo.is_living
        }
    },
    methods: {
        ...mapActions({
            destroyLive: 'destroyLive'
        }),
        ...mapMutations({
            emptyRoomInfo: 'emptyRoomInfo',
            setRoomInfo: 'setRoomInfo',
            setSocket: 'setSocket'
        }),
        /**
         *获取cookie
         *@method getCookie
         *@return {String} coockieValue
         */
        getCookie () {
            return getCookie('csrftoken')
        },
        /**
         *处理上传ppt的加载事件（弹出框区域，不是教学区域）
         *@method startLoading
         *@return {Boolean} true
         */
        startLoading () {
            this.loading = true
            console.log(this.loading)
            return true
        },
        /**
         *导出被关闭的教学/视频区域
         *@event openMinor
         */
        openMinor () {
            this.type = 1
        },
        /**
         *关闭教学区域
         *@event closeWork
         */
        closeWork () {
            if (this.style < 3 && this.type === 1) {
                this.changeSection()
                this.type = 2
            } else if (this.style >= 3 && this.type === 1) {
                this.type = 2
            }
        },
        /**
         *关闭视频区域
         *@event closeVideo
         */
        closeVideo () {
            console.log(this.type)
            if (this.style >= 3 && this.type === 1) {
                this.changeSection()
                this.type = 0
            } else if (this.style < 3 && this.type === 1) {
                this.type = 0
            }
        },
        /**
         *教学区域和视频区域的相关操作
         *@event changeSection
         */
        changeSection () {
            this.style = (this.style < 3) ? this.style + 3 : this.style - 3
        },
        /**
         *教学区域切换面板（ppt，画板，代码编辑器）
         *@event changePanel
         */
        changePanel (index) {
            this.style = (this.style < 3) ? index : index + 3
        },
        /**
         *结束直播
         *@event endRoom
         */
        endRoom () {
            let that = this
            this.destroyLive().then(function () {
                that.isEnd = true
                // window.location.reload(true)
                setTimeout(function () {
                    window.location.reload(true)
                }, 1000)
                // that.$router.push({ name: 'home' })
                window.close()
            }, function (res) {
                alert(res)
            })
        },
        /**
         *加载历史
         *@event loadHistory
         *@param {Object} toWhom
         */
        loadHistory (toWhom) {
            // get current content
            let slideHistory = this.$refs['slide'].getHistory()
            let canvasHistory = this.$refs['canvas'].getHistory()
            let codeHistory = this.$refs['code'].getHistory()
            let sectionHistory = this.$refs['closeButton'].getHistory()
            console.log(codeHistory)
            this.emit(slideHistory, 'slide', toWhom)
            this.emit(codeHistory, 'code', toWhom)
            this.emit(canvasHistory, 'canvas', toWhom)
            this.emit(sectionHistory, 'closeButton', toWhom)
            // this.emcanvasHistory(history, 'chat')
        },
        /**
         *重载，发送现在的状态
         *@event reloadClear
         */
        reloadClear () {
            this.$refs['slide'].reloadClear()
            this.$refs['canvas'].reloadClear()
            this.$refs['code'].reloadClear()
            this.$refs['closeButton'].reloadClear()
        },
        /**
         *和socketio服务端建立连接
         *@event buildConnect
         */
        buildConnect () {
            let that = this
            this.setSocket()
            this.listen('connect', () => {
                this.listen('loadHistory', (data) => {
                    const toWhom = data
                    this.loadHistory(toWhom)
                    console.log('loadHistory: ', toWhom)
                })
                this.listen('Error', (data) => { // this receiver will get error msg directly
                    console.log('Error: ', data)
                })
                this.listen('updateMessage', (data) => {
                    console.log('updateMessage:', data)
                    this.$refs[data.dataType].receive(data)
                })
                if (this.roomInfo.is_living) {
                    this.emit(this.user.id, null, '', 0, 'liveJoin')
                } else {
                    this.emit(this.user.id, null, '', 0, 'pastJoin')
                }
            })
        },
        /**
         *发出画板相应消息
         *@event emitCanvas
         */
        emitCanvas (data) {
            this.emit(data, 'canvas', null)
        },
        /**
         *发出聊天区相应消息
         *@event emitChat
         */
        emitChat (data, to = null, isKick = false) {
            this.emit(data, 'chat', to, 2, isKick ? 'kickout' : 'sendMessage')
        },
        /**
         *发出codemirror相应消息
         *@event emitCode
         */
        emitCode (data) {
            this.emit(data, 'code') // default is 1
        },
        /**
         *发出ppt相应消息
         *@event emitCode
         */
        emitSlide (data) {
            this.emit(data, 'slide')
        },
        /**
         *发出改变教学区和视频区的位置经过改变的相应消息
         *@event emitChangeSection
         */
        emitChangeSection (data) {
            this.emit(data, 'closeButton')
        },
        emitStartLive () {
            this.emit('', 'startLive') // just hold position
        },
        /**
         *发送消息
         *@event emit
         *@param {Object} data
         *@param {String} dataType
         *@param {Number} [to = null]
         *@param {Number} [type = 1]
         *@param {String} [signal = 'sendMessage']
         */
        emit (data, dataType, to = null, type = 1, signal = 'sendMessage') { // to which user he wanna send to
            const pack = {
                id: this.user.userid,
                room_name: this.roomInfo.room_name,
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
        /**
         *接收消息
         *@event listen
         *@param {String} signal
         *@param {Function} func
         */
        listen (signal, func) { // func is a callback
            if (isValid(signal) && isValid(func, 'function')) {
                this.socket.on(signal, (data) => {
                    func(data)
                })
            } else {
                throw Error('param format error')
            }
        },
        /**
         *更换房间缩略图
         *@event changeThumbnail
         *@param {Result} res
         *@param {File} file
         */
        changeThumbnail (res, file) {
            console.log(this.roomInfo.room_name + '/' + file.name)
            let that = this
            setTimeout(function () {
                that.setRoomInfo({ thumbnail_path: that.roomInfo.room_name + '/' + file.name })
            }, 5000)
            this.$Message.success(CONST.success('Upload Thumbnail'))
        },
        /**
         *上传ppt
         *@event uploadSlide
         *@param {Result} res
         *@param {File} file
         */
        uploadSlide (res, file) {
            console.log(res.room.slide_path)
            this.loading = false
            this.setRoomInfo({ slide_path: res.room.slide_path, slide_num: res.room.file_amount })
            this.$Message.success(CONST.success('Upload Slide'))
        },
        /**
         *上传ppt过大失败
         *@event uploadSlideTimeout
         *@param {Event} e
         *@param {Result} res
         *@param {File} file
         */
        uploadSlideTimeout (e, file, fileList) {
            this.loading = false
            alert(CONST.failure('Upload Slide') + 'Please upload smaller slide.')
        },
        /**
         *准备好直播（没有弹出框，信息准备好）
         *@event readyForLive
         */
        readyForLive () {
            this.uploadModal = false
            this.$Notice.info({
                title: 'Reopen the modal',
                desc: 'You can click the avatar on your left to change your thumbnail and ppt!',
                duration: 4
            })
        },
        /**
         *显示上传弹出框
         *@event showUploadModal
         */
        showUploadModal () {
            if (this.roomInfo.creator_id.toString() === this.user.userid.toString() && this.roomInfo.is_living) {
                this.uploadModal = true
            }
        }
    },
    created () {
        console.log(this.roomInfo)
    },
    mounted () {
        console.log('mounted')
        this.WIDTH = document.documentElement.clientWidth
        this.WIDTH = (this.WIDTH < 800) ? 800 : this.WIDTH
        this.wholeSize.height = document.documentElement.clientHeight.toString() + 'px'
        window.addEventListener('resize', () => {
            this.WIDTH = document.documentElement.clientWidth
            this.wholeSize.height = document.documentElement.clientHeight.toString() + 'px'
        })
        if (this.authority) {
            this.uploadModal = true
            this.reloadClear()
        } else {
            this.buildConnect()
        }
    },
    beforeDestroy () {
        this.emptyRoomInfo()
        console.log('distory:', this.roomInfo.is_living)
        if (this.authority && !(this.isEnd)) {
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
        z-index: 500;  /*middle*/
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
    #studio #upload-modal {
        text-align: center;
    }
    #studio .left-part {
        margin: 20px 5% 20px 5%; 
        display: inline-block;
        width: 50%;
        min-width: 400px;
        float: left;
    }
    #studio .infobar {
        height: 80px;
        border: 1px solid rgb(241,241,241);
    }
    #studio #teacher-avatar {  
        padding: 0px;
        border: 2px solid rgba(180,230,180,0.7);
        background-color: rgb(210,210,210);
        border-radius: 50%;
        margin: 15px 10px 15px 10px;
    }
    #studio .creator-avatar {
        cursor: pointer;
    }
    #studio #studio-info {
        display: inline-block;
        width: calc(100% - 50px - 30px);
        height: 80px;
    }
    #studio #studio-info *{
       overflow: hidden;
    }
    #studio #studio-info #title {
        width: 100%;
        height: 48px;
    }
    #studio #studio-info #title #title-content{
        float: left;
        font-size: 26px;
        padding: 5px 0px 5px 30px;
        width: 85%;
        height: 48px;
    }
    #studio #studio-info #footer {
        width: 100%;
        height: 32px;
    }
    #studio #studio-info #switch-section {
        height: 30px;
        float: right;
        margin: 9px 5px 9px 5px;
    }
    #studio #studio-info #teacher {
        height: 26px;
        float: right;
        cursor: default;
    }
    #studio #studio-info #audience {
        height: 26px;
        float: right;
        cursor: default;
    }
    #studio #studio-info #vip {
        float: left;
        height: 24px;
        cursor: default;
    }
    #studio #studio-info #roomid {
        margin-left: 30px;
        float: left;
        height: 24px;
        cursor: default;
    }
    #studio .main-section {
        height: 0;
        padding-bottom: calc( 65% * 0.5 );
        background-color: white;
    }
    #studio .right-part {
        display: inline-block;
        width: 35%;
        min-width: 280px;
        float: right;
    }
    #studio .infobar, .minor-section, .chat-section, .main-section {
        -moz-box-shadow:2px 2px 10px #A1A1A1;
        -webkit-box-shadow:2px 2px 10px #A1A1A1; 
        box-shadow: 2px 2px 10px #A1A1A1;
        background-color: white;
    }
    #studio .minor-section {
        margin: 20px 5% 0px 0%; 
        height: 0;
        padding-bottom: calc( 65% * 0.35 );
    }
    #studio .chat-section {
        margin: 30px 5% 0px 0%; 
    }
    #studio .studio-relative {
        position: relative !important;
        top: -120px;
    }
    #studio #upload-ppt {
        margin-top: 40px;
    }
    #modal-footer {
        text-align: center;
        padding: 15px;
    }
    #progress-bar {
    }
</style>
