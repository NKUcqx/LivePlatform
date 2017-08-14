<template>
    <div class="dialog" id='test':style="position">
        <div class="head">
            <h1>
                <Icon class="icon" type="chevron-up" id="lefticon" @click.native="up()"></Icon>
            </h1>
            <h1>
                <Dropdown trigger="click" @on-click="speakall">
                    <Icon class="icon" type="chatboxes" id="midicon"></Icon>
<<<<<<< Updated upstream
                    <Dropdown-menu slot="list" v-if="role">
                        <Dropdown-item v-if="speak">全体禁言</Dropdown-item>
                        <Dropdown-item v-if="silence">取消全体禁言</Dropdown-item>
=======
                    <Dropdown-menu slot="list" v-if="ROLE">
                        <Dropdown-item v-if="allspeak" name="allsilence">全体禁言</Dropdown-item>
                        <Dropdown-item v-if="allsilence" name='allspeak'>取消全体禁言</Dropdown-item>
>>>>>>> Stashed changes
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
                    <Dropdown trigger="click" style="margin-left: 20px" id='test1' @on-click="click">
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
            <Input :class="input1 === true ? 'messageInput1' : 'messageInput2'" v-model="message" :placeholder='holder' :disabled='silence'@on-enter='sendmsg()'>
                <Button id="sendBtn" type="primary" slot="append" @click='sendmsg()':disabled="message.trim()==''">Send</Button>
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
                allsilece:false,
                allspeak: true,
                speak: true,
                holder:'请输入',
                input1:true,
                input2:false,
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
            if (localStorage.silence)
            {
                console.log('ok')
                this.silence=localStorage.silence;
                if (this.silence) {
                    this.speak = false
                }
                else {
                    this.speak = true;
                }
            }
            else {
                this.silence=false
                this.speak=true
            }
        },
        methods: {
            send (data) {
                this.$emit('send', data)
            },
            sendmsg () {
                console.log(this.ROLE)
                localStorage.removeItem('silence');
                localStorage.removeItem('out');
                if (this.silence === false) {
                    if(this.message.trim() !== ''){
                    this.send({chattype: 'message', message: this.message, username: this.USERNAME})
                    this.message = ''
                    document.getElementById('history').scrollTop = document.getElementById('history').scrollHeight
                    }
                else {
                    console.log('kong')
                    this.holder='输入内容不能为空'
                    this.input1=false
                    this.input2=true
                    console.log(this.input1)
                    console.log(this.input2)
                }
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
            click : function(name) {
                if (name === 'banspeak') {
                    this.dialog1 = true
                    console.log('234')
                } else this.dialog2 = true
            },
            speakall: function (name) {
                console.log(name)
                if (this.ROLE === true) {
                    if (name === 'allsilence') {
                        this.send({chattype: 'allsilence'})
                    } else {
                        this.send({chattype: 'allspeak'})
                    }
                }
            },
            banspeakone (name) {
                if (this.ROLE === true) {
                    this.send({chattype: 'banspeakone', username: name})
                }
            },
            outone (name) {
                if (this.ROLE === true) {
                    this.send({chattype: 'outone', username: name})
                }
            },
            receive (data) {
                if (data.data.chattype === 'message') {
                    this.history.push({username: data.data.username, message: data.data.message})
                }
                if (data.data.chattype === 'outone') {
                    if (data.data.username === this.USERNAME) {
                        localStorage['out'] = true
                        this.$router.go(-1)
                        }

                }
                if (data.data.chattype === 'banspeakone') {
                    if (data.data.username === this.USERNAME) {
                        localStorage['silence'] = true
                        this.silence = true
                        this.speak=false
                       }


                }
                if (data.data.chattype === 'allsilence') {
                    localStorage['silence'] = true
                    this.allsilece=true;
                    this.allspeak=false;
                    this.silence = true
                    this.speak = false

                }
                if (data.data.chattype === 'allspeak') {
                    localStorage['silence'] = false
                    this.allsilece=false;
                    this.allspeak=true;
                    this.silence = false
                    this.speak = true
                }
                if(data.data.chattype==='allspeak'){
                    console.log('allspeak');
                    this.silence=false
                    this.speak=true


                }
                if (data.data.chattype === 'allspeak') {
                    console.log('allspeak')
                    this.silence = false
                    this.speak = true
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
    .messageInput2::-webkit-input-placeholder { 
        color:red;
        }
    .messageInput2:-moz-placeholder { 
        color:#999;
        }
    .messageInput2::-moz-placeholder {
        color:#999;
        }
    .messageInput2:-ms-input-placeholder {        
        color:#999;
        }
    .messageInput1 {
        margin-left: 1px;
        height: 90%;
    }
    .messageInput2 {
        margin-left: 1px;
        height: 90%;
        border-color:red;
        border-width:1px;
    }
    a{
        display:inline;
        font-size:10px;
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
        display: inline;
        width: 90%;
        word-wrap: break-word;
        white-space: normal;
        font-size:10px;
    }
    li {
        list-style-type: none;
    }
    p {
        word-break: break-word;
        display: inline;
        margin-top: 2px;
        text-align: left;
        font-size:10px;
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