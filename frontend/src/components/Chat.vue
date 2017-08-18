<template>
    <div class="dialog" id='test' :style="position">
        <div class="head">
            <h1>
                <Icon class="icon" type="chevron-up" id="lefticon" @click.native="up"></Icon>
            </h1>
            <h1>
                <Icon type="android-notifications" v-if='allspeak' class='icon' id='midicon' @click.native='banspeakpublic'></Icon>
                <Icon type="android-notifications-off" v-if='allsilence' class='icon' id='midicon' @click.native='canspeakpublic'></Icon>
            </h1>
            <h1>
                <Icon class="icon" type="chevron-down" id="righticon" @click.native="down"></Icon>
            </h1>
        </div>
        <div class="historymessage">
            <ul id="history">
                <li v-for="hist of history" id="message">
                    <Dropdown trigger="click" style="margin-left: 20px" id='test1' @on-click="click">
                        <a href="javascript:void(0)" v-if="hist.role" class="teacher" id="name">{{ hist.nickname }}:{{hist.message}}</a>
                        <a href="javascript:void(0)" v-if="hist.role===false" class="student" id="name">{{ hist.nickname }}:{{hist.message}}</a>
                        <Dropdown-menu slot="list" v-if="AUTHORITY">
                            <Dropdown-item name='banspeak'>禁言</Dropdown-item>
                            <Modal v-model="dialog1" title="提示" @on-ok="banspeakone(hist.userid,hist.nickname)" @on-cancel="cancel">
                                <p>您确定要禁言{{hist.nickname}}这位同学吗？</p>
                            </Modal>
                            <Dropdown-item name='out'>踢出房间</Dropdown-item>
                            <Modal v-model="dialog2" title="提示" @on-ok="outone(hist.userid,hist.nickname)" @on-cancel="cancel">
                                <p>您确定要踢出{{hist.nickname}}这位同学吗？</p>
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
            <Input class="messageInput" v-model="message" placeholder='please enter' :disabled='silence' @on-enter='sendmsg'>
            <Button id="sendBtn" type="primary" slot="append" @click='sendmsg' :disabled="message.trim()==''">Send</Button>
            </Input>
        </div>
    </div>
</template>
<script src="/socket.io/socket.io.js">

</script>
<script>
    import {
        wsConnect,
        wsSend,
        wsClose
    } from '../utils/websockets'
    import {
        mapGetters
    } from 'vuex'
    export default {
        props: {
            AUTHORITY: {
                type: Boolean,
                default: false
            },
            WIDTH: {
                type: Number,
                default: 600
            },
            HEIGHT: {
                type: Number,
                default: 400
            },
            BORDER: {
                type: Number,
                default: 1
            },
            ROOMID: {
                type: Number,
                default: 0
            }
        },
        computed: {
            ...mapGetters({
                user: 'getUser',
                liveState: 'getLiveState'
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
                roomid: 0,
                speak: true,
                indeterminate: true,
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
            }
        },
        mounted () {
            console.log('--mounted--')
            this.position.width = this.WIDTH.toString() + 'px'
            this.position.height = (this.HEIGHT).toString() + 'px'
            this.position.border = this.BORDER + 'px'
            this.roomid = this.ROOMID
            console.log(this.ROOMID)
            const that = this
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
        },
        methods: {
            send (data) {
                this.$emit('send', data)
            },
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
            up: function () {
                document.getElementById('history').scrollTop = 0
            },
            down: function () {
                document.getElementById('history').scrollTop = document.getElementById('history').scrollHeight
            },
            click: function (name) {
                if (name === 'banspeak') {
                    this.dialog1 = true
                } else if (name === 'out') {
                    this.dialog2 = true
                } else this.dialog3 = true
            },
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
                // this.socket.send({type:'banspeakpublic',roomid:this.ROOMID})
            },
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
            handleCheckAll: function (data) {
                if (this.indeterminate) {
                    this.checkAll = false
                } else {
                    this.checkAll = !this.checkAll
                }
                this.indeterminate = false
                this.cans = this.bans
            },
            checkchange: function (data) {
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
                this.cans = data
            },
            canspeak: function () {
                for (var index = 0; index < this.cans.length; index++) {
                    this.send({
                        chattype: 'canspeak',
                        userid: this.cans[index].userid
                    })
                    this.$http({
                        url: '/canspeakone/',
                        method: 'GET',
                        params: {
                            username: this.cans[index].userid,
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
            },
            cancel: function () {},
            banspeakone (userid, nickname) {
                if (this.AUTHORITY) {
                    this.send({
                        chattype: 'banspeakone',
                        userid: userid,
                        nickname: nickname
                    })
                    // this.socket.send({type:'banspeak',userid:userid.userid,roomid:this.roomid})
                    this.$http({
                        url: '/banone/',
                        method: 'GET',
                        params: {
                            username: userid,
                            roomid: this.roomid
                        }
                    }).then(function (res) {
                        this.$message.info('you have been banned to speak')
                    }, function () {
                        alert('ajax failure')
                    })
                    this.$Message.info('您已禁言' + nickname + '同学')
                }
            },
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
                        this.$message.info('you out!')
                    }, function () {
                        alert('ajax failure')
                    })
                    this.$Message.info('您已踢出' + nickname + '同学')
                }
            },
            messolve (data) {
                this.history.push({
                    message: data.data.message,
                    userid: data.data.userid,
                    nickname: data.data.nickname,
                    role: data.data.role
                })
            },
            outsolve (data) {
                if (data.data.userid === this.user.userid) {
                    this.$Message.info('您已被踢出去')
                    this.$router.go(-1)
                }
            },
            banonesolve (data) {
                if (data.data.userid === this.user.userid) {
                    this.silence = true
                    this.speak = false
                    this.$Message.info('您已被禁言')
                }
                this.bans.push({
                    userid: data.data.userid,
                    nickname: data.data.nickname
                })
            },
            banpublicsolve (data) {
                this.allsilence = true
                this.allspeak = false
                if (this.AUTHORITY === false) {
                    this.silence = true
                    this.speak = false
                    this.$Message.info('全局禁言')
                }
            },
            allspeaksolve (data) {
                this.allsilence = false
                this.allspeak = true
                this.silence = false
                this.speak = true
                if (this.AUTHORITY === false) {
                    this.$Message.info('全局解禁')
                }
            },
            canspeaksolve (data) {
                for (var index = 0; index < this.bans.length; index++) {
                    if (this.bans[index].userid === data.data.userid) {
                        this.bans.splice(index, 1)
                    }
                }
                if (data.data.userid === this.userid) {
                    this.silence = false
                    this.speak = true
                    this.$Message.info('您被解除禁言')
                }
            },
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
    .dialog {}
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
    #lefticon {
        margin-left: 5px;
        float: left;
    }
    #righticon {
        margin-right: 5px;
        float: right;
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