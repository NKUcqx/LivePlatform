<template>
    <div class="dialog" :style="position">
        <div class="head">
            <h1>
                <Icon class="icon" type="chevron-up" id="lefticon" @click.native="up()"></Icon>
            </h1>
            <h1>
                <Dropdown trigger="click" @on-click="speakall">
                    <Icon class="icon" type="chatboxes" id="midicon"></Icon>
                    <Dropdown-menu slot="list" v-if="ROLE">
                        <Dropdown-item v-if="speak" name="allsilence">全体禁言</Dropdown-item>
                        <Dropdown-item v-if="silence" name='allspeak'>取消全体禁言</Dropdown-item>
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
                        <Dropdown-menu slot="list" v-if="ROLE">
                            <Dropdown-item name='banspeak'>禁言</Dropdown-item>
                            <Modal v-model="dialog1" title="提示" @on-ok="banspeakone(hist.username)" @on-cancel="cancel()">
                                <p>您确定要禁言{{hist.username}}这位同学吗？</p>
                            </Modal>
                            <Dropdown-item name='out'>踢出房间</Dropdown-item>
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
            <Input id="messageInput" v-model="message" placeHolder="Enter To Send" :disabled='silence'>
                <Button id="sendBtn" type="primary" slot="append" @click='sendmsg()'>Send</Button>
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
        },
        methods: {
            send (data) {
            this.$emit('send', data)
            },
            sendmsg () {
                console.log(this.ROLE)
                if (this.silence === false) {
                    this.send({chattype:'message',message:this.message,username:this.USERNAME})
                    this.message = ''
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
            click(name){
                if (name === 'banspeak') {
                    this.dialog1 = true
                    console.log('234')
                } else this.dialog2 = true
            },
            speakall:function (name) {
                console.log(name)
                if (this.ROLE === true) {
                    if (name === 'allsilence') {
                        this.send({chattype:'allsilence'})
                    } else {
                        this.send({chattype:'allspeak'})
                    }
                }
            },
            banspeakone (name) {
                if (this.ROLE === true) {
                    this.send({chattype:'banspeakone',username:name})
                }
            },
            outone (name) {
                if (this.ROLE === true) {
                    this.send({chattype:'outone',username:name})
                }
            },
            receive (data) {
                console.log(data.data.chattype)
                if (data.data.chattype==='message'){
                    console.log('message');
                    this.history.push({username:data.data.username,message:data.data.message})
                }
                if(data.data.chattype==='outone'){
                    if(data.data.username===this.USERNAME){
                        console.log('outone');
                        this.$route.go(-1)
                        }

                }
                if(data.data.chattype==='banspeakone'){
                    if(data.data.username===this.USERNAME){
                        console.log('banspeakone');
                        this.silence=true
                        this.speak=false
                        }


                }
                if(data.data.chattype==='allsilence'){
                    console.log('allsilence');
                    this.silence=true
                    this.speak=false

                }
                if(data.data.chattype==='allspeak'){
                    console.log('allspeak');
                    this.silence=false
                    this.speak=true


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