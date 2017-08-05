<template>
    <div class="layout">
        <div class="topbar">
                <Menu mode="horizontal" active-name="3" class="menu" ref="topmenu">
                    <Submenu name="1">
                        <template slot="title">
                            教育直播平台
                        </template>
                        <Menu-item name="3-1"><span>Lives</span></Menu-item>
                        <Menu-item name="3-2"><span>Videos</span></Menu-item>
                    </Submenu>
                    <Submenu name="3" class="top-right">
                        <template slot="title">
                            <Icon type="ios-paper"></Icon>
                            个人中心
                        </template>
                        <Menu-item name="3-1"><span>{{person.username}}</span></Menu-item>
                        <Menu-item name="3-2"><span>{{person.nickname}}</span></Menu-item>
                        <Menu-item name="3-3"><span>{{person.gender}}</span></Menu-item>
                        <Menu-item name="3-4">
                            <span @click="modal = true">修改密码</span>
                            <Modal v-model="modal" title="修改密码" :width="400">
                                <Form ref="form" :model="form" :rules="rule" :label-width="80">
                                    <Form-item label="密码:" prop="password">
                                        <Input type="password" v-model="form.password" size="large" placeholder="Password"></Input>
                                    </Form-item>
                                    <Form-item label="心密码:" prop="newPassword">
                                        <Input type="password" v-model="form.newPassword" size="large" placeholder="New Password"></Input>
                                    </Form-item>
                                    <Form-item label="心心密码:" prop="reNewPassword">
                                        <Input type="password" v-model="form.reNewPassword" size="large" placeholder="Repeat New password"></Input>
                                    </Form-item>
                                </Form>
                            </Modal>
                        </Menu-item>
                        <Menu-item>
                            <span @click="createModal = true">Create Room</span>
                            <Modal v-model="createModal" title="Create Room" :width="400" @on-ok="createRoom()">
                                <Form ref="form" :model="form" :rules="rule" :label-width="80">
                                    <Form-item label="title:" prop="password">
                                        <Input v-model="createForm.title" size="large" placeholder="Title"></Input>
                                    </Form-item>
                                    <Form-item label="teacher:" prop="newPassword">
                                        <Input v-model="person.username" size="large" placeholder="Teacher" disabled></Input>
                                    </Form-item>
                                    <Form-item label="img:" prop="reNewPassword">
                                        <input type="file" name="img" v-model="createForm.img"/>
                                    </Form-item>
                                    <Form-item label="slide:" prop="reNewPassword">
                                        <input type="file" name="slide" v-model="createForm.slide"/>
                                    </Form-item>
                                </Form>
                            </Modal>
                        </Menu-item>
                    </Submenu>
                    <Menu-item name="2" class="head top-right">
                        <img src="../assets/logo.png" class="head-image" alt="head-image" :width="img.size" :height="img.size" @click="avatarModal = true">
                        <Modal v-model="avatarModal" title="Upload Avatar" :width="300" id="avatar-modal">
                                <img src="../assets/addroom.png">
                        </Modal>
                    </Menu-item>
            </Menu>
        </div>
        <div class="container">
            <!--div class="operation" align="right">
                <Button style="shape:circle;" type="primary" @click="addVedio">创建直播</Button>
                <Button style="shape:circle;" type="primary" @click="deleteVedio">删除直播</Button>
            </div-->
            <br><br><br>
            <div class="headersection">
                <h1>
                    <Icon type="social-twitch-outline"></Icon>
                    正在直播
                </h1>
            </div>
            <br>
            <section class="flexcontainer">
                <room v-for="(livesItem, index) in livesList" :item="livesItem"></room>
            </section>
            <br><br>
            <div class="headersection">
                <h1>
                    <Icon type="ios-videocam"></Icon>
                    录播视频
                </h1>
            </div>
            <section class="flexcontainer">
                <room v-for="(vedioItem, index) in vedioList" :item="vedioItem"></room>
            </section>
        </div>
            </i-col>
    </div>
</template>
<script>
    import { mapGetters, mapActions, } from 'vuex'    
    import Room from './tinyComponents/Room'
    import { beforePost } from '../utils/utils'
    import record from './record'
    export default {
        name: 'vedioList',
        components: {
            Room,
            record,
        },
        data () {
            return {
                person:{
                    username : '13513616830',
                    nickname: 'name',
                    gender: 'gender',
                },
                img: {
                    size: 40,
                },
                theme1: 'light',
                modal: false,
                avatarModal: false,
                createModal: false,
                form: {
                    username: '',
                    password: '',
                    newPassword: '',
                    reNewPassword: '',
                },
                createForm: {
                    title: '',
                    slide: '',
                    img: '',
                }
            }
        },
        computed: {
            ...mapGetters({
                getLiveRooms: 'getLiveRooms',
                getVideoRooms: 'getVideoRooms',
            }),
            livesList () {
                return this.getLiveRooms
            },
            videosList () {
                return this.getVideoRooms
            },
        },
        methods: {
            ...mapActions({
                getRoomsFromDB: 'getRoomsFromDB',
            }),
            createRoom() {
                let formData = new FormData()
                formData.append('thumbnail', this.createForm.img) 
                formData.append('slide', this.createForm.slide) 
                formData.append('name', this.createForm.title) 
                //formData.append('creater_id',1)  
                this.$http({
                    url:'/createroom/',
                    method:'POST',
                    body:formData,
                    before:function(request){beforePost(request)},
                }).then(function (res) {
                    alert(res.body)
                }, function (res) {
                    alert(res.status)
                })
            },
            toggleClick () {
                if (this.spanLeft === 5) {
                    this.spanLeft = 2;
                    this.spanRight = 22;
                } else {
                    this.spanLeft = 5;
                    this.spanRight = 19;
                }
            },
        },
        mounted: function() {
            this.getRoomsFromDB(true)
            this.getRoomsFromDB(false)
        }
    }
</script>
<style scoped>
* {
    font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
}

.top-right {
    float: right !important;
}

.menu {
}

.head {
}

.head-image {
    border-radius: 50%;
    margin-top: 9px;
    background-color: gray;
}
.headersection{
    color: white;
}
.flexcontainer{
    display: flex;
    flex-wrap: wrap;
    margin:auto;
    justify-content: space-between;
    width: 80%;
}
.topbar{
}
.vedio{
    flex: 0 0;
}
.record{
    flex:0 0;
}
.container{
    background-image: url(../assets/bg7.jpg);
    background-repeat: no-repeat;
}
#avatar-modal {
    text-align: center;
}
/*.operation{
}
.layout{
    border: 1px solid #d7dde4;
    background: #f5f7f9;
    position: relative;
    border-radius: 4px;
    overflow: hidden;
}
.layout-hide-text .layout-text{
    display: none;
}
.layout-menu-left{
    background: #464c5b;
}
.layout-logo-left{
    width: 90%;
    height: 30px;
    background: #5b6270;
    border-radius: 3px;
    margin: 15px auto;
}
.layout-hide-text .layout-text{
    display: none;
}*/
</style>
