<template>
    <div class="dialog" :style="position">
        <div class="head">
            <h1>
                <Icon class="icon" type="chevron-up" id="lefticon" @click.native="up()"></Icon>
            </h1>
            <h1>
                <Dropdown trigger="click" @on-click="banspeakall()">
                    <Icon class="icon" type="chatboxes" id="midicon"></Icon>
                    <Dropdown-menu slot="list" v-if="role">
                        <Dropdown-item v-if="speak">全体禁言</Dropdown-item>
                        <Dropdown-item v-if="silence">取消全体禁言</Dropdown-item>
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
                    <Dropdown trigger="click" style="margin-left: 20px" @on-click="click(name)">
                        <a href="javascript:void(0)" id="name">{{ hist.username }}</a>
                        <Dropdown-menu slot="list" v-if="role">
                            <Dropdown-item>禁言</Dropdown-item>
                            <Modal v-model="dialog1" title="提示" @on-ok="banspeakone(hist.username)" @on-cancel="cancel()">
                                <p>您确定要禁言{{hist.username}}这位同学吗？</p>
                            </Modal>
                            <Dropdown-item>踢出房间</Dropdown-item>
                            <Modal v-model="dialog2" title="提示" @on-ok="outone(hist.username)" @on-cancel="cancel()">
                                <p>您确定要踢出{{hist.username}}这位同学吗？</p>
                            </Modal>
                        </Dropdown-menu>
                    </Dropdown>
                    <p id="content">{{ hist.message }}</p>
                </li>
            </ul>
        </div>
        <div class="input">
            <Input id="messageInput" v-model="message" placeHolder="Enter To Send">
                <Button id="sendBtn" type="primary" slot="append" @click='send()'>Send</Button>
            </Input>
        </div>
    </div>
</template>
<script src="/socket.io/socket.io.js">

</script>
<script>
    export default {
        props: {
            ROLE: {
                type: Boolean,
                default: false
            },
            USERNAME: {
                type: String,
                default: 'lili'
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
        data () {
            return {
                message: '',
                history: [],
                out: [],
                role: true,
                dialog1: false,
                dialog2: false,
                silence: false,
                speak: true,
                socket: '',
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
            this.position.width = this.WIDTH.toString() + 'px'
            this.position.height = (this.HEIGHT).toString() + 'px'
            this.position.border = this.BORDER + 'px'
            console.log(this.position)
            this.socket = io.connect('http://localhost:8002')
            this.socket.on('updateMessage', function (data) {
                if (data.room === this.ROOM) {
                    this.history.push({
                        usernmae: data.username,
                        message: data.message
                    })
                }
            })
            this.socket.on('silence', function (data) {
                if (data.username === this.username && data.room === this.ROOM) {
                    this.silence = true
                    this.speak = true
                }
            })
            this.socket.on('out', function (data) {
                if (data['username'] === this.username && data.room === this.ROOM) {
                    this.$router.go(-1)
                }
            })
            this.socket.on('allsilence', function (data) {
                if (data.room === this.ROOM) {
                    this.silence = true
                    this.speak = true
                }
            })
            this.silence.on('allspeak', function (data) {
                if (data.room === this.ROOM) {
                    this.speak = true
                    this.silence = false
                }
            })
        },
        methods: {
            send () {
                if (silence === false) {
                    this.socket.emit('sendMessage', {
                        username: this.username,
                        message: this.message,
                        room: this.ROOM
                    })
                    message = ''
                    document.getElementById('history').scrollTop = document.getElementById('history').scrollHeight
                }
            },
            up () {
                document.getElementById('history').scrollTop = 0
            },
            down () {
                document.getElementById('history').scrollTop = document.getElementById('history').scrollHeight
            },
            dialog1change () {
                this.dialog1 = true
                console.log('HIHA')
            },
            click (name) {
                console.log('123')
                if (name === '禁言') {
                    this.dialog1 = true
                    console.log('234')
                } else this.dialog2 = true
            },
            banspeakall () {
                if (role === true) {
                    if (name === '全体禁言') {
                        this.socket.emit('allSilence', {room: this.ROOM})
                    } else {
                        this.socket.emit('allspeak', {room: this.ROOM})
                    }
                }
            },
            banspeakone (name) {
                if (role === true) {
                    this.socket.emit('silence', {
                        username: name,
                        room: this.ROOM
                    })
                }
            },
            outone (name) {
                if (role === true) {
                    this.socket.emit('out', {
                        username: name,
                        room: this.ROOM
                    })
                }
            },
            cancel () {}
        }
    }
</script>
<style>
    .dialog {

    }
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
    h1{
        cursor: pointer;
    }
    #content {
        display: inline-block;
        width: 90%;
        word-wrap: break-word;
        white-space: normal
    }
    li {
        list-style-type: none;
    }
    p {
        word-break: break-word;
        display: inline;
        margin-top: 2px;
        text-align: left;
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
    #midicon { 
    }
    #messageInput {
        margin-left: 1px;
        height: 90%;
    }
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