<template>
<div class="topbar">
    <Menu  ref="topmenu" mode="horizontal" active-name="3" class="menu" theme="light" id="topmenu">
        <Menu-item class="longer">
            <img src="../../assets/logo1.png" class="logo-image" alt="head-image" :width="img.size" :height="img.size"> 
        </Menu-item>
        <Menu-item name="1">
            教育直播平台
        </Menu-item>
        <Submenu name="3" class="top-right">
            <template slot="title">
                <Icon type="ios-paper"></Icon>
                个人中心
            </template>
            <Menu-item name="3-1" class="menu-item"><span @click="infoModal = true" class="item">{{person.username}}</span></Menu-item>
            <Menu-item name="3-2" class="menu-item"><span @click="infoModal = true" class="item">{{person.nickname}}</span></Menu-item>
            <Menu-item name="3-3" class="menu-item"><span @click="infoModal = true" class="item">{{person.gender}}</span></Menu-item>
            <Modal v-model="infoModal" title="Modify Infomation" :width="400" @on-ok="modifyInfo()">
                <Form  ref="infoForm" :model="form" :rules="ruleInfo" :label-width="80" >
                    <Form-item label="username:">
                        <Input v-model="person.username" size="large" disabled></Input>
                    </Form-item>
                    <Form-item label="nickname:" prop="nickname">
                        <Input v-model="person.nickname" size="large" placeholder="nickname"></Input>
                    </Form-item>
                    <Form-item label="gender:" prop="gender">
                        <Radio-group v-model="person.gender">
                        <Radio label="female"></Radio>
                        <Radio label="male"></Radio>
                    </Radio-group>
                    </Form-item>
                </Form>
            </Modal>
            <Menu-item name="3-4" class="menu-item">
                <span @click="modal = true" class="item">修改密码</span>
                <Modal v-model="modal" title="修改密码" :width="400" @on-ok="modifyPass()">
                    <Form  ref="modifyForm" :model="form" :rules="ruleNewpass" :label-width="80" >
                        <Form-item label="password:" prop="password">
                            <Input type="password" v-model="form.password" size="large" placeholder="Password"></Input>
                        </Form-item>
                        <Form-item label="new pass:" prop="newPassword">
                            <Input type="password" v-model="form.newPassword" size="large" placeholder="New Password"></Input>
                        </Form-item>
                        <Form-item label="re pass:" prop="reNewPassword">
                            <Input type="password" v-model="form.reNewPassword" size="large" placeholder="Repeat New password"></Input>
                        </Form-item>
                    </Form>
                </Modal>
            </Menu-item>
            <Menu-item class="menu-item">
                <span @click="createModal = true" class="item">Create Room</span>
                <Modal v-model="createModal" title="Create Room" :width="400" @on-ok="createRoom()">
                    <Form ref="createForm" :model="createForm" :label-width="80" :rules="ruleRoomname">
                        <Form-item label="title:" prop="roomname">
                            <Input v-model="createForm.title" size="large" placeholder="Title"></Input>
                        </Form-item>
                        <Form-item label="teacher:">
                            <Input v-model="person.username" size="large" placeholder="Teacher" disabled></Input>
                        </Form-item>
                        <Upload
                            type="drag"
                            action="/img/">
                            <div>
                                <Icon type="ios-cloud-upload" size="60" style="color: #3399ff"></Icon>
                                <p>Upload Your Avatar</p>
                            </div>
                        </Upload>
                        <Upload
                            type="drag"
                            action="/slide/">
                            <div>
                                <Icon type="ios-cloud-upload" size="60" style="color: #777777"></Icon>
                                <p>Upload Your Silde</p>
                            </div>
                        </Upload>
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
    import { checkPassword, checkRePassword, checkForm } from '../../utils/checks'

    export default {
        data () {
            const validatePass = (rule, value, callback) => {
                checkPassword(rule, value, callback, this.form.reNewPassword, this.$refs.modifyForm, 'reNewPassword')
            }
            const validatePassCheck = (rule, value, callback) => {
                checkRePassword(rule, value, callback, this.form.newPassword)
            }
            return {
                file: null,
                loadingStatus: false,
                person: {
                    username: '13513616850',
                    nickname: 'name',
                    gender: 0
                },
                img: {
                    size: 40
                },
                theme1: 'light',
                infoModal: false,
                modal: false,
                avatarModal: false,
                createModal: false,
                form: {
                    username: '',
                    password: '',
                    newPassword: '',
                    reNewPassword: ''
                },
                createForm: {
                    title: '',
                    slide: '',
                    img: ''
                },
                ruleInfo: {
                    nickname: [
                        { require: true, type: 'string', min: 6, max: 20, message: 'nickname must be more than 6 chars less than 20', trigger: 'blur' }
                    ]
                },
                ruleNewpass: {
                    password: [
                        { required: true, type: 'string', min: 6, max: 40, message: 'password is not legal', trigger: 'blur' }
                    ],
                    newPassword: [
                        { required: true, validator: validatePass, trigger: 'blur' },
                        { type: 'string', min: 6, max: 25, message: 'password must be more than 6 chars less than 25', trigger: 'blur' }
                    ],
                    reNewPassword: [
                        { required: true, validator: validatePassCheck, trigger: 'blur' }
                    ]
                },
                ruleRoomname: {
                    roomname: [
                        { required: true, type: 'string', min: 6, max: 40, message: 'roomname must be more than 6 chars less than 25', trigger: 'blur' }
                    ]
                }
            }
        },
        computed: {
        },
        methods: {
            modifyInfo () {
                if (checkForm(this, this.$refs.infoForm)) {
                    let data = {
                        username: this.person.username,
                        nickname: this.person.nickname,
                        gender: this.person.gender
                    }
                    console.log(data)
                    this.$http({
                        url: '//',
                        method: 'POST',
                        body: data,
                        before: function (request) { beforePost(request) }
                    }).then(function (res) {
                        alert(res.body)
                    }, function (res) {
                        alert(res.body)
                    })
                }
            },
            modifyPass () {
                if (checkForm(this, this.$refs.modifyForm)) {
                    let data = {
                        username: this.person.username,
                        password: this.form.password,
                        new_password: this.form.newPassword
                    }
                    console.log(data)
                    this.$http({
                        url: '/changepass/',
                        method: 'POST',
                        body: data,
                        before: function (request) { beforePost(request) }
                    }).then(function (res) {
                        alert(res.body)
                    }, function (res) {
                        alert(res.body)
                    })
                }
            },
            createRoom () {
                if (checkForm(this, this.$refs.createForm)) {
                    let formData = new FormData()
                    formData.append('thumbnail', this.createForm.img)
                    formData.append('slide', this.createForm.slide)
                    formData.append('name', this.createForm.title)
                    // formData.append('creater_id',1)
                    this.$http({
                        url: '/createroom/',
                        method: 'POST',
                        body: formData,
                        before: function (request) { beforePost(request) }
                    }).then(function (res) {
                        alert(res.body)
                    }, function (res) {
                        alert(res.status)
                    })
                }
            }
            /* toggleClick () {
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
            }, */
        }
    }
</script>

<style scoped>
* {
    font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
}

.menu-item {
    height: 30px !important;
    padding-top: 0px !important;
    padding-bottom: 0px !important;
    padding-left: 0px !important;
    padding-right: 0px !important;
}

.item {
    display: inline-block;
    padding: 5px 0px;
    width: 100%;
    height: 100%;
    /*border: 1px red solid;*/
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

