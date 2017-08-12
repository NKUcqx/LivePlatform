<template>
    <div class="dialog" :style="position">
        <div class="head">
            <h1>
                <Icon type="chevron-up" id="lefticon" @click.native="up()"></Icon>
            </h1>
            <h1>
                <Dropdown trigger="click" style="margin-left: 20px" @on-click="speakall(name)">
                    <Icon type="chatboxes" id="midicon"></Icon>
                    <Dropdown-menu slot="list" v-if="role">
                        <Dropdown-item v-if="speak">全体禁言</Dropdown-item>
                        <Dropdown-item v-if="silence">取消全体禁言</Dropdown-item>
                    </Dropdown-menu>
                </Dropdown>
            </h1>
            <h1>
                <Icon type="chevron-down" id="righticon" @click.native="down()"></Icon>
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
            <textarea id="messageInput" v-model="message" placeHolder="enter to send":disable='speak'></textarea>
            <Button id="sendBtn" type="primary" size="small" @click='send()'>send</Button>
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
                tyle: Number,
                default: 0
            },
            WIDTH: {
                type: Number,
                default: '500px'
            },
            HEIGHT: {
                type: Number,
                default: '400px'
            },
            BORDER: {
                type: Number,
                default: '1px'
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
                    width: '500px',
                    height: '400px',
                    border: '1px'
                }
            }
        },
        mounted () {
            this.position.width = this.WIDTH
            this.position.height = this.HEIGHT
            this.position.border = this.BORDER
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
            speakall (name) {
                if (role === true) {
                    if (name === '全体禁言') {
                        emitChat({type: 'allSilence'})
                    } else {
                        emitChat({type: 'allspeak'})
                    }
                }
            },
            banspeakone (name) {
                if (role === true) {
                    emitChat({type: 'silence', username: name})
                }
            },
            outone (name) {
                if (role === true) {
                    emitChat({type: 'out', username: name})
                }
            },
            cancel () {}
        }
    }
</script>
<style>
    .head {
        height: 10%;
        width: 100%;
        margin: 0 auto;
        border: 1px;
        background-color: #87CEFA;
    }
    .historymessage {
        width: 100%;
        height: 70%;
        margin: 0 auto;
        background-color: white;
        font-family: "微软雅黑";
        font-size: 12px;
        border: 10px;
    }
    .input {
        height: 10%;
        margin: 0 auto;
        width: 100%;
        float: left;
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
    h1,
    Icon {
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
    #lefticon {
        float: left;
    }
    #righticon {
        float: right;
    }
    #midicon {
        align: center;
    }
    #messageInput {
        width: 88%;
        height: 80%;
        display: inline-block;
        margin-top: 4px;
        float: left;
    }
    #sendBtn {
        width: 10%;
        height: 80%;
        display: inline-block;
        background-color: #5cadff;
        color: white;
        margin-top: 4px;
        border: none;
        float: right;
    }
    #name {
        float: left;
        display: inline;
        margin-top: 2px;
    }
</style>