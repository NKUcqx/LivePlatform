<template>
    <div class="dialog" id='test' :style="position">
        <div class="head">
            <h1>
                <Icon type="android-notifications" v-if='allspeak' class='icon' id='midicon' @click.native='banspeakpublic'></Icon>
                <Icon type="android-notifications-off" v-if='allsilence' class='icon' id='midicon' @click.native='canspeakpublic'></Icon>
            </h1>
        </div>
        <div class="historymessage">
            <ul id="history">
                <li v-for="hist of history" id="message">
                    <Dropdown trigger="click" style="margin-left: 20px" id='test1' @on-click="click">
                        <a href="javascript:void(0)" v-if="hist.role" class="teacher" id="name" @click='foucs(hist.userid,hist.nickname)'>{{ hist.nickname }}:{{hist.message}}</a>
                        <a href="javascript:void(0)" v-if="hist.role===false" class="student" id="name"@click='foucs(hist.userid,hist.nickname)'>{{ hist.nickname }}:{{hist.message}}</a>
                        <Dropdown-menu slot="list" v-if="AUTHORITY">
                            <Dropdown-item name='banspeak'>禁言</Dropdown-item>
                            <Modal v-model="dialog1" title="提示" @on-ok="banspeakone(foucsid,foucsname)" @on-cancel="cancel">
                                <p>您确定要禁言{{foucsname}}这位同学吗？</p>
                            </Modal>
                            <Dropdown-item name='out'>踢出房间</Dropdown-item>
                            <Modal v-model="dialog2" title="提示" @on-ok="outone(foucsid,foucsname)" @on-cancel="cancel">
                                <p>您确定要踢出{{foucsname}}这位同学吗？</p>
                            </Modal>
                            <Dropdown-item name='canspeak'>解除禁言</Dropdown-item>
                            <Modal v-model="dialog3" title="提示" @on-ok="canspeak" @on-cancel="cancel()">
                                <p>您要解除下面哪位同学的禁言</p>
                                <div style="border-bottom: 1px solid #e9e9e9;padding-bottom:6px;margin-bottom:6px;">
                                    <Checkbox :indeterminate="indeterminate" :value="checkAll" @click.prevent.native="handleCheckAll">全选</Checkbox>
                                </div>
                                <Checkbox-group v-for="ban of bans" @on-change="checkchange">
                                    <Checkbox :label='ban.userid'>{{ban.nickname}}</Checkbox>
                                </Checkbox-group>
                            </Modal>
                        </Dropdown-menu>
                    </Dropdown>
                </li>
            </ul>
        </div>
        <div class="input">
            <Input class="messageInput" v-model="message" placeholder='please enter' :disabled='silence ||!isLiveStart ' @on-enter='sendmsg'>
            <Button id="sendBtn" type="primary" slot="append" @click='sendmsg' :disabled="message.trim()==''">Send</Button>
            </Input>
        </div>
    </div>
</template>
<script src="/socket.io/socket.io.js">

</script>
<script>
    /**
     *Module TinyComponents
     *
     *@module TinyComponents
     *@requires Utils
     */
    import {
        wsConnect,
        wsSend,
        wsClose
    } from '../utils/websockets'
    import {
        mapGetters
    } from 'vuex'
    /**
     *聊天室
     *@class Chat
     *@constructor
     */
    export default {
        props: {
            AUTHORITY: {
                type: Boolean,
                default: false
            },
            WIDTH: {
                type: Number,
                default: 280
            },
            HEIGHT: {
                type: Number,
                default: 144.6
            }
        },
        computed: {
            ...mapGetters({
                user: 'getUser',
                isLiveStart: 'isLiveStart',
                roomid: 'getRoomId'
            })
        },
        data () {
            return {
                message: '',
                history: [],
                out: [],
                dialog1: false,
                dialog2: false,
                dialog3: false,
                silence: false,
                allsilence: false,
                allspeak: true,
                speak: true,
                indeterminate: true,
                foucsid: 0,
                foucsname: '',
                checkAll: false,
                bans: [],
                cans: [],
                position: {
                    width: '',
                    height: '',
                    border: ''
                }
            }
        },
        watch: {
            'HEIGHT': function () {
                this.position.width = this.WIDTH.toString() + 'px'
                this.position.height = (this.HEIGHT).toString() + 'px'
            },
            'roomid': function () {
                const that = this
                if (isLiveStart) {
                    console.log('MOUNTED :', this.roomid)
                    this.$http({
                        url: '/echo/',
                        method: 'GET',
                        params: {
                            username: this.user.userid,
                            roomid: this.roomid
                        }
                    }).then(function (res) {
                        var k = res.body
                        console.log(k)
                        if (k === 'allslience') {
                            this.allsilence = true
                            this.allspeak = false
                            if (!this.AUTHORITY) {
                                this.speak = false
                                this.silence = true
                            }
                        } else if (k === 'banone') {
                            this.speak = false
                            this.silence = true
                        }
                    }, function () {
                        alert('ajax failure')
                    })
                }
                console.log(this.isLiveStart)
            }
        },
        mounted () {
            console.log('--mounted--')
            this.position.width = this.WIDTH.toString() + 'px'
            this.position.height = (this.HEIGHT).toString() + 'px'
            this.position.border = this.BORDER + 'px'
            console.log(this.isLiveStart)
        },
        methods: {
            /**
             *发送数据（被调用的工具函数）
             *@event send
             *@param {Object} data（想要发送的数据）
             */
            send (data) {
                this.$emit('send', data)
            },
            /**
             *获取被点击的学生的id和昵称
             *@event foucs
             *@param {Number} userid
             *@param {String} nickname
             */
            foucs (userid, nickname) {
                this.foucsid = userid
                this.foucsname = nickname
                console.log(this.foucsid)
                console.log(this.foucsname)
            },
            /**
             *发送消息，对消息的内容，聊天室的状态加以判断限制消息的发送
             *@event sendmsg
             */
            sendmsg: function () {
                if (this.silence === false) {
                    if (this.message.trim() !== '') {
                        this.send({
                            chattype: 'message',
                            message: this.message,
                            userid: this.user.userid,
                            nickname: this.user.nickname,
                            role: this.AUTHORITY
                        })
                        this.message = ''
                        document.getElementById('history').scrollTop = document.getElementById('history').scrollHeight
                    }
                }
            },
            /**
             *设置用户被禁言、踢出、解除禁言
             *@event click
             *@param {String} name
             */
            click: function (name) {
                if (name === 'banspeak') {
                    this.dialog1 = true
                } else if (name === 'out') {
                    this.dialog2 = true
                } else this.dialog3 = true
            },
            /**
             *设置全局禁言，发送消息全局禁言
             *@event banspeakpublic
             */
            banspeakpublic: function () {
                if (this.AUTHORITY) {
                    this.send({
                        chattype: 'allsilence'
                    })
                    this.$http({
                        url: '/banpublic/',
                        method: 'GET',
                        params: {
                            roomid: this.roomid
                        }
                    }).then(function (res) {}, function () {
                        alert('ajax failure')
                    })
                    this.$Message.info('您已全局禁言')
                }
            },
            /**
             *设置全局解禁
             *@event canspeakpublic
             */
            canspeakpublic: function () {
                if (this.AUTHORITY) {
                    this.send({
                        chattype: 'allspeak'
                    })
                    this.$http({
                        url: '/canpublic/',
                        method: 'GET',
                        params: {
                            username: this.user.userid,
                            roomid: this.roomid
                        }
                    }).then(function (res) {
                    }, function () {
                        alert('ajax failure')
                    })
                    this.$Message.info('您已全局解禁')
                }
                // this.socket.send({type:'canspeakpublic',roomid:this.ROOMID})
            },
            /**
             *处理解禁时的全选事件
             *@event handleCheckAll
             *@param {Object} data
             */
            handleCheckAll: function (data) {
                if (this.indeterminate) {
                    this.checkAll = false
                } else {
                    this.checkAll = !this.checkAll
                }
                this.indeterminate = false
                console.log(data)
                for (var i = 0; i < this.bans.length; i++) { this.cans.push(this.bans[i].userid) }
                console.log(this.cans)
            },
            /**
             *处理解禁时的单个解禁按钮被点击的事件（如果每个被禁言的人都被点击解禁，即为全选）
             *@event checkchange
             *@param {Object} data
             */
            checkchange: function (data) {
                console.log('---checkchange---')
                console.log(data.length)
                console.log(this.bans.length)
                if (data.length === this.bans.length) {
                    this.indeterminate = false
                    this.checkAll = true
                } else if (data.length > 0) {
                    this.indeterminate = true
                    this.checkAll = false
                } else {
                    this.indeterminate = false
                    this.checkAll = false
                }
                for (var i = 0; i < data.length; i++) { this.cans.push(data[i]) }
                console.log(data)
                console.log('---checkchange---')
            },
            /**
             *处理解禁时的单个解禁的事件，发送被解禁的信息
             *@event canspeak
             */
            canspeak: function () {
                console.log('---canspeak---')
                for (var index = 0; index < this.cans.length; index++) {
                    console.log(this.cans[index])
                    this.send({
                        chattype: 'canspeak',
                        userid: this.cans[index]
                    })
                    this.$http({
                        url: '/canspeakone/',
                        method: 'GET',
                        params: {
                            username: this.cans[index],
                            roomid: this.roomid
                        }
                    }).then(function (res) {
                    }, function () {
                        alert('ajax failure')
                    })
                    // this.socket.send({type:'canspeak',userid:this.cans[index].userid,roomid:this.roomid})
                    this.indeterminate = true
                    this.checkAll = false
                }
                console.log('---canspeak---')
            },
            /**
             *如果点击取消的话就什么都不做
             *@event cancel
             */
            cancel: function () {},
            /**
             *处理单个禁言的事件，发送被禁言的人的id和昵称
             *@event banspeakone
             *@param {Number} userid
             *@param {String} nickname
             */
            banspeakone (userid, nickname) {
                console.log('--banspeakone--')
                console.log(nickname)
                console.log(userid)
                console.log(this.user.userid)
                console.log('--banspeakone--')
                var self = this
                for (let i = 0; i < self.bans.length; i++) {
                    if (this.bans[i].userid === userid) {
                        return
                    }
                }
                if (this.AUTHORITY) {
                    this.send({
                        chattype: 'banspeakone',
                        userid: userid,
                        nickname: nickname
                    })
                    this.$http({
                        url: '/banone/',
                        method: 'GET',
                        params: {
                            username: userid,
                            roomid: this.roomid
                        }
                    }).then(function (res) {
                        this.$Message.info('you have been banned to speak')
                    }, function () {
                        alert('ajax failure')
                    })
                }
            },
            /**
             *处理踢人的事件，发送被踢的人的id
             *@event outone
             *@param {Number} userid
             *@param {String} nickname
             */
            outone (userid, nickname) {
                if (this.AUTHORITY) {
                    this.send({
                        chattype: 'outone',
                        userid: userid
                    })
                    this.$http({
                        url: '/outone/',
                        method: 'GET',
                        params: {
                            username: userid,
                            roomid: this.roomid
                        }
                    }).then(function (res) {
                        this.$Message.info('you out!')
                    }, function () {
                        alert('ajax failure')
                    })
                }
            },
            /**
             *处理被发送的消息，在历史消息区域传递被发送的消息的相关信息
             *@event messolve
             *@param {Object} data
             */
            messolve (data) {
                this.history.push({
                    message: data.data.message,
                    userid: data.data.userid,
                    nickname: data.data.nickname,
                    role: data.data.role
                })
            },
            /**
             *处理被踢的事件，如果用户被踢，则自动返回首页
             *@event outsolve
             *@param {Object} data
             */
            outsolve (data) {
                if (data.data.userid === this.user.userid) {
                    this.$router.go(-1)
                }
            },
            /**
             *处理被禁言的事件，如果用户被禁言，那么不能发送信息且个人的id和昵称被记录
             *@event banonesolve
             *@param {Object} data
             */
            banonesolve (data) {
                if (data.data.userid === this.user.userid) {
                    this.silence = true
                    this.speak = false
                }
                this.bans.push({
                    userid: data.data.userid,
                    nickname: data.data.nickname
                })
            },
            /**
             *处理被全局禁言的事件，那么所有学生不能发送信息
             *@event banpublicsolve
             *@param {Object} data
             */
            banpublicsolve (data) {
                this.allsilence = true
                this.allspeak = false
                if (this.AUTHORITY === false) {
                    this.silence = true
                    this.speak = false
                    this.$Message.info('全局禁言')
                }
            },
            /**
             *处理被全局解禁的事件，那么所有学生都可以发送信息
             *@event allspeaksolve
             *@param {Object} data
             */
            allspeaksolve (data) {
                this.allsilence = false
                this.allspeak = true
                if (this.AUTHORITY === false) {
                    this.$Message.info('全局解禁')
                }
            },
            /**
             *处理单人被解禁的事件，被解禁后可以发送信息，且关于禁言的记录里信息被移除
             *@event canspeaksolve
             *@param {Object} data
             */
            canspeaksolve (data) {
                console.log('--canspeaksolve---')
                console.log(data.data.userid)
                console.log(this.user.userid)
                for (var index = 0; index < this.bans.length; index++) {
                    console.log(this.bans[index].userid)
                    console.log(data.data.userid)
                    if (this.bans[index].userid === data.data.userid) {
                        console.log(this.bans[index].userid)
                        this.bans.splice(index, 1)
                    }
                    console.log(this.bans.length)
                }
                if (data.data.userid === this.user.userid && this.isLiveStart) {
                    this.silence = false
                    this.speak = true
                    this.$Message.info('您被解除禁言')
                }
                console.log('--canspeaksolve---')
            },
            /**
             *接收消息，并按照消息的chattype属性进行分类处理
             *@event receive
             *@param {Object} data（接受的信息）
             */
            receive (data) {
                if (data.data.chattype === 'message') {
                    console.log('recive')
                    this.messolve(data)
                }
                if (data.data.chattype === 'outone') {
                    this.outsolve(data)
                }
                if (data.data.chattype === 'banspeakone') {
                    this.banonesolve(data)
                }
                if (data.data.chattype === 'allsilence') {
                    console.log('allsilence')
                    this.banpublicsolve(data)
                }
                if (data.data.chattype === 'allspeak') {
                    this.allspeaksolve(data)
                }
                if (data.data.chattype === 'canspeak') {
                    this.canspeaksolve(data)
                }
            }
        }
    }
</script>
<style>
    .head {
        height: 30px;
        width: 100%;
        margin: 0 auto;
        /*background-color: #87CEFA;*/
        text-align: center;
    }
    .historymessage {
        width: 100%;
        height: calc(100% - 30px - 36px);
        margin: 0 auto;
        background-color: white;
        font-family: "微软雅黑";
        font-size: 12px;
        /*border should be 3 values for example border:1px solid red;*/
        border: 10px;
    }
    .input {
        height: 36px;
        margin: 0 auto;
        width: 100%;
        background-color: #FAFAFA;
    }
    .teacher {
        color: blue;
        font-size: 12px;
    }
    a {
        display: inline;
        font-size: 12px;
        word-break: break-word;
        text-align: left;
        font-size: 12px;
        word-wrap: break-word;
    }
    h1 {
        display: inline;
        font-size: 200px;
        margin: 200px;
        cursor: pointer;
    }
    ul {
        width: 100%;
        height: 100%;
        list-style: none;
        background-color: white;
        overflow: auto;
    }
    #content {
        display: inline;
        width: 90%;
        word-wrap: break-word;
        white-space: normal;
        font-size: 12px;
    }
    li {
        list-style-type: none;
    }
    p {
        word-break: break-word;
        display: inline;
        text-align: left;
        font-size: 12px;
    }
    /*end custom file input*/
    .icon {
        color: #5cadff;
    }
    .teacher {
        color: #5cadff;
    }
    .student {
        color: black;
    }
    #midicon {
        margin-left: 5px;
        float: left;
    }
    #sendBtn {
        background-color: #5cadff;
        color: white;
        border: none;
    }
    #name {
        float: left;
        display: inline;
    }
</style>