<template>
    <div class="dialog" id='test' :style="position">
        <div class="head">
            <h1>
                <Icon class="icon" type="chevron-up" id="lefticon" @click.native="up()"></Icon>
            </h1>
            <h1>
                <Dropdown trigger="click" @on-click="speakall">
                    <Icon class="icon" type="chatboxes" id="midicon"></Icon>
                    <Dropdown-menu slot="list" v-if="USERID===CREATERID">
                        <Dropdown-item v-if="allspeak" name="allsilence">全体禁言</Dropdown-item>
                        <Dropdown-item v-if="allsilence" name='allspeak'>取消全体禁言</Dropdown-item>
                    </Dropdown-menu>
                </Dropdown>
            </h1>
            <h1>
                <Icon class="icon" type="chevron-down" id="righticon" @click.native="down()"></Icon>
            </h1>
        </div>
        <div class="historymessage">
            <ul id="history">
                <li v-for="hist of history" id="message">
                    <Dropdown v-if='hist.userid!==CREATERID' trigger="click" style="margin-left: 20px" id='test1' @on-click="click">
                        <a href="javascript:void(0)" id="name">{{ hist.username }}</a>
                        <Dropdown-menu slot="list" v-if="USERID===CREATERID">
                            <Dropdown-item name='banspeak'>test</Dropdown-item>
                            <Modal v-model="dialog1" title="提示" @on-ok="banspeakone(hist.userid,hist.username)" @on-cancel="cancel()">
                                <p>您确定要禁言{{hist.username}}这位同学吗？</p>
                            </Modal>
                            <Dropdown-item name='out'>踢出房间</Dropdown-item>
                            <Modal v-model="dialog2" title="提示" @on-ok="outone(hist.userid)" @on-cancel="cancel()">
                                <p>您确定要踢出{{hist.username}}这位同学吗？</p>
                            </Modal>
                            <Dropdown-item name='out'>解除禁言</Dropdown-item>
                            <Modal v-model="dialog2" title="提示" @on-ok="canspeak" @on-cancel="cancel()">
                                <p>您要解除下面哪位同学的禁言</p>
                                <div style="border-bottom: 1px solid #e9e9e9;padding-bottom:6px;margin-bottom:6px;">
                                    <Checkbox @click.prevent.native="handleCheckAll">全选</Checkbox>
                                </div>
                                <Checkbox-group v-for="ban of bans" @on-change="checkchange">
                                    <Checkbox :label='ban.userid'>{{ban.username}}</Checkbox>
                                </Checkbox-group>
                            </Modal>
                        </Dropdown-menu>
                    </Dropdown>
                    <Dropdown v-if='hist.userid===CREATERID' trigger="click" style="margin-left: 20px" id='test1' @on-click="click">
                        <a href="javascript:void(0)" id="name" class='teacher'>{{ hist.username }}</a>
                        <Dropdown-menu slot="list" v-if="this.USERID===this.CREATERID">
                            <Dropdown-item name='banspeak'>禁言</Dropdown-item>
                            <Modal v-model="dialog1" title="提示" @on-ok="banspeakone(hist.userid,hist.username)" @on-cancel="cancel()">
                                <p>您确定要禁言{{hist.username}}这位同学吗？</p>
                            </Modal>
                            <Dropdown-item name='out'>踢出房间</Dropdown-item>
                            <Modal v-model="dialog2" title="提示" @on-ok="outone(hist.userid)" @on-cancel="cancel()">
                                <p>您确定要踢出{{hist.username}}这位同学吗？</p>
                            </Modal>
                            <Dropdown-item name='out'>解除禁言</Dropdown-item>
                            <Modal v-model="dialog2" title="提示" @on-ok="canspeak" @on-cancel="cancel()">
                                <p>您要解除下面哪位同学的禁言</p>
                                <div style="border-bottom: 1px solid #e9e9e9;padding-bottom:6px;margin-bottom:6px;">
                                    <Checkbox @click.prevent.native="checkAllGroupChange">全选</Checkbox>
                                </div>
                                <Checkbox-group v-for="ban of bans" @on-change="checkchange">
                                    <Checkbox :label='ban.userid'>{{ban.username}}</Checkbox>
                                </Checkbox-group>
                            </Modal>
                        </Dropdown-menu>
                    </Dropdown>
                    <p v-if='hist.userid===CREATERID' id="content" class='teacher'>{{ hist.message }}</p>
                    <p v-if='hist.userid!==CREATERID' id="content">{{ hist.message }}</p>
                </li>
            </ul>
        </div>
        <div class="input">
            <Input class="messageInput" v-model="message" placeholder='please enter' :disabled='silence' @on-enter='sendmsg()'>
            <Button id="sendBtn" type="primary" slot="append" @click='sendmsg()' :disabled="message.trim()==''">Send</Button>
            </Input>
        </div>
    </div>
</template>
<script src="/socket.io/socket.io.js">

</script>
<script>
    export default {
        props: {
            CREATERID: {
                type: Number,
                default: 0
            },
            USERNAME: {
                type: String,
                default: 'lili'
            },
            USERID: {
                type: Number,
                default: 0
            },
            ROOM: {
                type: Number,
                default: 10
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
            }
        },
        data() {
            return {
                message: '',
                history: [],
                out: [],
                dialog1: false,
                dialog2: false,
                silence: false,
                allsilece: false,
                allspeak: true,
                speak: true,
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
            'HEIGHT': function() {
                this.position.width = this.WIDTH.toString() + 'px'
                this.position.height = (this.HEIGHT).toString() + 'px'
            }
        },
        mounted() {
            this.position.width = this.WIDTH.toString() + 'px'
            this.position.height = (this.HEIGHT).toString() + 'px'
            this.position.border = this.BORDER + 'px'
            /*if (localStorage.silence) {
                this.silence = localStorage.silence
                if (this.silence) {
                    this.speak = false
                } else {
                    this.speak = true
                }
            } else {
                this.silence = false
                this.speak = true
            }*/
        },
        methods: {
            send(data) {
                this.$emit('send', data)
            },
            sendmsg() {
                localStorage.removeItem('silence')
                localStorage.removeItem('out')
                if (this.silence === false) {
                    if (this.message.trim() !== '') {
                        this.send({
                            chattype: 'message',
                            message: this.message,
                            username: this.USERNAME,
                            userid: this.USERID
                        })
                        console.log(this.CREATERID)
                        console.log(this.USERID)
                        this.message = ''
                        document.getElementById('history').scrollTop = document.getElementById('history').scrollHeight
                        console.log('chat send')
                    }
                }
            },
            up() {
                document.getElementById('history').scrollTop = 0
            },
            down() {
                document.getElementById('history').scrollTop = document.getElementById('history').scrollHeight
            },
            dialog1change() {
                this.dialog1 = true
            },
            click: function(name) {
                if (name === 'banspeak') {
                    this.dialog1 = true
                } else this.dialog2 = true
            },
            speakall: function(name) {
                if (this.USERID === this.CREATERID) {
                    if (name === 'allsilence') {
                        this.send({
                            chattype: 'allsilence',
                            userid: this.USERID
                        })
                    } else {
                        this.send({
                            chattype: 'allspeak'
                        })
                    }
                }
            },
            handleCheckAll: function(data) {
                this.cans = data
            },
            checkchange: function(data) {
                this.cans = data
                console.log('canspeak')
                console.log(data)
            },
            canspeak: function() {
                for (var index = 0; index < this.cans.length; index++) {
                    this.send({
                        chattype: 'canspeak',
                        userid: this.cans[index]
                    })
                    console.log('canspeak;;')
                    console.log(this.cans[index])
                }
            },
            banspeakone(id, name) {
                if (this.USERID === this.CREATERID) {
                    this.send({
                        chattype: 'banspeakone',
                        userid: id,
                        username: name
                    })
                }
            },
            outone(id) {
                if (this.USERID === this.CREATERID) {
                    this.send({
                        chattype: 'outone',
                        userid: id
                    })
                }
            },
            receive(data) {
                if (data.data.chattype === 'message') {
                    console.log('chat recive')
                    console.log(data.data.userid)
                    console.log(this.CREATERID)
                    console.log(data.data.message)
                    this.history.push({
                        username: data.data.username,
                        message: data.data.message,
                        userid: data.data.userid
                    })
                }
                if (data.data.chattype === 'outone') {
                    if (data.data.userid === this.USERID) {
                        localStorage['out'] = true
                        this.$router.go(-1)
                    }
                }
                if (data.data.chattype === 'banspeakone') {
                    if (data.data.userid === this.USERID) {
                        localStorage['silence'] = true
                        this.silence = true
                        this.speak = false
                    }
                    this.bans.push({
                        userid: data.data.userid,
                        username: data.data.username
                    })
                }
                if (data.data.chattype === 'allsilence') {
                    if (data.data.userid !== this.USERID) {
                        localStorage['silence'] = true
                        this.allsilece = true
                        this.allspeak = false
                        this.silence = true
                        this.speak = false
                    }
                }
                if (data.data.chattype === 'allspeak') {
                    localStorage['silence'] = false
                    this.allsilece = false
                    this.allspeak = true
                    this.silence = false
                    this.speak = true
                }
                if (data.data.chattype === 'allspeak') {
                    this.silence = false
                    this.speak = true
                }
                if (data.data.chattype === 'canspeak') {
                    console.log("canspeak--recive")
                    console.log(this.bans)
                    for (var index = 0; index < this.bans.length; index++) {
                        if (this.bans[index].userid === data.data.userid) {
                            this.bans.splice(index, 1)
                            console.log(index)
                            console.log(this.bans)
                        }
                    }
                    if (data.data.userid === this.USERID) {
                        this.silence = false
                        this.speak = true
                        localStorage['silence'] = false
                    }
                    console.log("canspeak--recive")
                }
            },
            cancel() {}
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
        font-size: 14px;
    }
    a {
        display: inline;
        font-size: 10px;
    }
    h1 {
        display: inline;
        font-size: 200px;
        margin: 200px;
    }
    ul {
        width: 100%;
        height: 100%;
        list-style: none;
        background-color: white;
        overflow: auto;
    }
    h1 {
        cursor: pointer;
    }
    #content {
        display: inline;
        width: 90%;
        word-wrap: break-word;
        white-space: normal;
        font-size: 10px;
    }
    li {
        list-style-type: none;
    }
    p {
        word-break: break-word;
        display: inline;
        margin-top: 2px;
        text-align: left;
        font-size: 10px;
    }
    /*end custom file input*/
    .icon {
        color: #5cadff;
    }
    #lefticon {
        margin-left: 5px;
        float: left;
    }
    #righticon {
        margin-right: 5px;
        float: right;
    }
    #midicon {}
    #sendBtn {
        background-color: #5cadff;
        color: white;
        border: none;
    }
    #name {
        float: left;
        display: inline;
        margin-top: 2px;
    }
</style>