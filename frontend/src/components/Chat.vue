<template>
    <div class="dialog">
        <div class="head">
            <h1>
                <Icon type="chevron-up" id="lefticon" @click.native="up()"></Icon>
            </h1>
            <h1>
                <Dropdown @on-click="banspeakall()">
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
                    <Dropdown @on-click="click(name)">
                        <a href="javascript:void(0)" id="name">{{ hist.username }}</a>
                        <Dropdown-menu slot="list" v-if="role">
                            <Dropdown-item>禁言</Dropdown-item>
                            <Modal v-model="dialog1" title="提示" @on-ok="banspeakone()" @on-cancel="cancel()">
                                <p>您确定要禁言{{hist.username}}这位同学吗？</p>
                            </Modal>
                            <Dropdown-item>踢出房间</Dropdown-item>
                            <Modal v-model="dialog2" title="提示" @on-ok="outone()" @on-cancel="cancel()">
                                <p>您确定要踢出{{hist.username}}这位同学吗？</p>
                            </Modal>
                        </Dropdown-menu>
                    </Dropdown>
                    <p id="content">{{ hist.message }}</p>
                </li>
            </ul>
        </div>
        <div class="input">
            <textarea id="messageInput" v-model="message" placeHolder="enter to send"></textarea>
            <Button id="sendBtn" type="primary" size="small" @click='send()'>send</Button>
        </div>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                message: '',
                history: [],
                username: 'li',
                silenc: [],
                out: [],
                role: true,
                dialog1: false,
                dialog2: false,
                silence: false,
                speak: true
            }
        },
        methods: {
            send() {
                this.history.push({
                    username: this.username,
                    message: this.message
                })
                this.message = ''
                document.getElementById('history').scrollTop = document.getElementById('history').scrollHeight
            },
            up() {
                document.getElementById('history').scrollTop = 0
            },
            down() {
                document.getElementById('history').scrollTop = document.getElementById('history').scrollHeight
            },
            dialog1change() {
                this.dialog1 = true
                console.log('HIHA')
            },
            click(name) {
                console.log('123')
                if (name === '禁言') {
                    this.dialog1 = true
                    console.log('234')
                } else this.dialog2 = true
            },
            banspeakall(name) {
                if (name === '全体禁言') {
                    this.silence = true
                    this.speak = false
                } else {
                    this.silence = false
                    this.speak = true
                }
            },
            banspeakone() {},
            outone() {},
            cancel() {}
        }
    }
</script>
<style>
    .dialog {
        width: 500px;
        height: 400px;
        padding: 5px;
        margin: 0 auto;
        border: 1px;
    }
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