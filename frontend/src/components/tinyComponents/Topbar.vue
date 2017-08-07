<template>
<div class="topbar">
    <Menu mode="horizontal" active-name="3" class="menu" ref="topmenu" theme="light" id="topmenu">
        <Menu-item class="longer">
            <img src="../../assets/logo1.png" class="logo-image" alt="head-image" :width="img.size" :height="img.size"> 
        </Menu-item>
        <Submenu name="1">
            <template slot="title" id="header">
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
                    <Form ref="form"  ref="newPass" :model="form" :rules="ruleNewpass" :label-width="80">
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
                    <Form ref="form" :model="form" :label-width="80" :rules="ruleRoomname">
                        <Form-item label="title:" prop="roomname">
                            <Input v-model="createForm.title" size="large" placeholder="Title"></Input>
                        </Form-item>
                        <Form-item label="teacher:">
                            <Input v-model="person.username" size="large" placeholder="Teacher" disabled></Input>
                        </Form-item>
                        <Form-item label="img:">
                            <div>
                            <Upload
                                action="">
                                <Button type="ghost" icon="ios-cloud-upload-outline">选择要上传文件的文件</Button>
                            </Upload>
                            <div v-if="file !== null">待上传文件：{{ file.name }} <Button type="text" @click="upload" :loading="loadingStatus">{{ loadingStatus ? '上传中' : '点击上传' }}</Button></div>
                        </Form-item>
                        <Form-item label="slide:">
                            <div>
                            <Upload
                                action="">
                                <Button type="ghost" icon="ios-cloud-upload-outline">选择要上传文件的文件</Button>
                            </Upload>
                            <div v-if="file !== null">待上传文件：{{ file.name }} <Button type="text" @click="upload" :loading="loadingStatus">{{ loadingStatus ? '上传中' : '点击上传' }}</Button></div>
                        </Form-item>
                    </Form>
                </Modal>
            </Menu-item>
        </Submenu>
        <Menu-item name="2" class="head top-right longer">
            <img src="../../assets/logo.png" class="head-image" alt="head-image" :width="img.size" :height="img.size" @click="avatarModal = true">
            <Modal v-model="avatarModal" title="Upload Avatar" :width="300" id="avatar-modal">
                    <img src="../../assets/addroom.png">
            </Modal>
        </Menu-item>
    </Menu>
</div>
</template>

<script>
    import { beforePost } from '../../utils/utils'
    import { checkPassword, checkRePassword} from '../../utils/checks'

    export default {
        data () {
            const validatePass = (rule, value, callback) => {
                checkPassword(rule, value, callback, this.form.reNewPassword, this.$refs.newPass, 'reNewPassword')
            }
            const validatePassCheck = (rule, value, callback) => {
                checkRePassword(rule, value, callback, this.form.newPassword)
            }
            return {
                file: null,
                loadingStatus: false,
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
                },
                ruleNewpass: {
                    password: [
                        { required: true, type: 'string', min: 6, max: 40, message: 'password is not legal', trigger: 'blur'},
                    ],
                    newPassword: [
                        { required: true, validator: validatePass, trigger: 'blur' },
                        { type: 'string', min: 6, max: 25, message: 'password must be more than 6 chars less than 25', trigger: 'blur' }
                    ],
                    reNewPassword: [
                        { required: true, validator: validatePassCheck, trigger: 'blur' }
                    ],
                },
                ruleRoomname: {
                    roomname: [
                        { required: true, type: 'string', min: 6, max: 40, message: 'roomname must be more than 6 chars less than 25', trigger: 'blur' }
                    ],
                }
            }
        },
        computed: {
        },
        methods: {
            createRoom() {
                let formData = new FormData()
                formData.append('thumbnail', this.createForm.img) 
                formData.append('slide', this.createForm.slide) 
                formData.append('name', this.createForm.title) 
                //formData.append('creater_id',1)  
                this.$http({
                    url: '/createroom/',
                    method: 'POST',
                    body:formData,
                    before:function(request){ beforePost(request) },
                }).then(function (res) {
                    alert(res.body)
                }, function (res) {
                    alert(res.status)
                })
            },
            /*toggleClick () {
                let file = files[0]
                let formData = new FormData()
                formData.append('avatar', file) 
                //formData.append('creater_id',1)  
                this.$http({
                    url:'/avatar/',
                    method:'POST',
                    body:formData,
                    before:function(request){beforePost(request)},
                }).then(function (res) {
                    alert(res.body)
                }, function (res) {
                    alert(res.status)
                })
                if (this.spanLeft === 5) {
                    this.spanLeft = 2;
                    this.spanRight = 22;
                } else {
                    this.spanLeft = 5;
                    this.spanRight = 19;
                }
            },*/
        },
    }
</script>

<style scoped>
* {
    font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
}

.top-right {
    float: right !important;
}

.head-image {
    border-radius: 50%;
    margin-top: 9px;
    background-color: gray;
}

.logo-image {
    margin-top: 9px;
}

#avatar-modal {
    text-align: center;
}

.longer {
    height: 60px;
}
</style>

