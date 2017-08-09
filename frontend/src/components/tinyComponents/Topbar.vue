<template>
<div id="topbar">
    <Menu  ref="topmenu" mode="horizontal" active-name="3" class="menu" theme="light" id="topmenu">
        <Menu-item class="longer">
            <img src="../../assets/logo1.png" class="logo-image" alt="head-image" :width="img.size" :height="img.size"> 
        </Menu-item>
        <Menu-item name="1">
            教育直播平台
        </Menu-item>
        <Menu-item name="2" class="top-right">
            <span @click="logout()" id="logout"><Icon type="power" size="20" color="rgb(210,100,100)"></Icon></span>
        </Menu-item>
        <Submenu name="3" class="top-right">
            <template slot="title">
                <Icon type="ios-paper"></Icon>
                个人中心
            </template>
            <Menu-item name="3-1" class="menu-item"><span @click="makeIndoModal()" class="item">{{user.username}}</span></Menu-item>
            <Menu-item name="3-2" class="menu-item"><span @click="makeIndoModal()" class="item">{{user.nickname}}</span></Menu-item>
            <!--Menu-item name="3-3" class="menu-item"><span @click="makeIndoModal()" class="item">{{(user.gender)?'male':'female'}}</span></Menu-item>
            <Menu-item name="3-4" class="menu-item"><span @click="makeIndoModal()" class="item">{{(user.role === 'S')?'student':'teacher'}}</span></Menu-item-->
            <Modal v-model="infoModal" title="Modify Infomation" :width="400" @on-ok="modifyInfo()">
                <Form  ref="infoForm" :model="person" :rules="ruleInfo" :label-width="80" >
                    <Form-item label="username:">
                        <Input v-model="user.username" size="large" disabled></Input>
                    </Form-item>
                    <Form-item label="role:">
                        <Input :value="(user.role === 'S')?'student':'teacher'" size="large" disabled></Input>
                    </Form-item>
                    <Form-item label="nickname:" prop="nickname">
                        <Input v-model="person.nickname" size="large"></Input>
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
                    <Form ref="createForm" :model="createForm" :rules="ruleRoomname" :label-width="80">
                        <Form-item label="title:" prop="roomname">
                            <Input v-model="createForm.title" size="large" placeholder="Title"></Input>
                        </Form-item>
                        <Form-item label="teacher:">
                            <Input v-model="user.username" size="large" placeholder="Teacher" disabled></Input>
                        </Form-item>
                    </Form>
                </Modal>
            </Menu-item>
        </Submenu>
        <Menu-item name="2" class="head top-right longer">
            <img :src="user.avatar" class="head-image" alt="head-image" :width="img.size" :height="img.size" @click="avatarModal = true">
            <Modal v-model="avatarModal" title="Upload Avatar" :width="300" id="avatar-modal">
                    <Upload
                        :headers = "{
                            'X-CSRFToken': getCookie() 
                        }"
                        name="avatar"
                        type="drag"
                        action="/changeavatar/">
                        <div>
                            <img src="../../assets/addroom.png">
                        </div>
                    </Upload>
            </Modal>
        </Menu-item>
    </Menu>
</div>
</template>

<script>
    import { beforePost, getListFromDB, getCookie } from '../../utils/utils'
    import { checkPassword, checkRePassword, checkForm } from '../../utils/checks'
    import { mapGetters, mapActions, mapMutations } from 'vuex'

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
                img: {
                    size: 40
                },
                theme1: 'light',
                infoModal: false,
                modal: false,
                avatarModal: false,
                createModal: false,
                person: {
                    nickname: null,
                    gender: null
                },
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
                        { required: true, message: 'Please input nickname', trigger: 'blur' },
                        { type: 'string', min: 6, max: 25, message: 'nickname should be 6 to 25 chars', trigger: 'blur' }
                    ]
                },
                ruleNewpass: {
                    password: [
                        { required: true, type: 'string', min: 6, max: 25, message: 'password is not legal', trigger: 'blur' }
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
                        { required: true, message: 'Please input roomname', trigger: 'blur' },
                        { type: 'string', min: 6, max: 25, message: 'roomname should be 6 to 25 chars', trigger: 'blur' }
                    ]
                }
            }
        },
        computed: {
            ...mapGetters({
                user: 'getUser'
            })
        },
        methods: {
            ...mapMutations({
                addLiveRoom: 'addLiveRoom'
            }),
            ...mapActions({
                initUser: 'initUser'
            }),
            getCookie () {
                return getCookie('csrftoken')
            },
            makeIndoModal () {
                this.person.nickname = this.user.nickname
                this.person.gender = (this.user.gender) ? 'male' : 'female'
                this.infoModal = true
            },
            logout () {
                alert('logout')
            },
            modifyInfo () {
                checkForm(this, this.$refs.infoForm, () => {
                    let gender = (this.person.gender === 'male') ? true : false
                    let data = {
                        nickname: this.person.nickname,
                        gender: gender
                    }
                    console.log(data)
                    this.$http({
                        url: '/changeinfo/',
                        method: 'POST',
                        body: data,
                        before: function (request) { beforePost(request) }
                    }).then(function (res) {
                        alert('Success!')
                        this.initUser(res.body)
                        console.log(this.user)
                    }, function (res) {
                        alert(res.body)
                    })
                })
            },
            modifyPass () {
                checkForm(this, this.$refs.modifyForm, () => {
                    let data = {
                        username: this.user.username,
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
                        alert('Success!')
                        this.initUser(res.body)
                    }, function (res) {
                        alert(res.body)
                    })
                })
            },
            createRoom () {
                if (true) {
                    let formData = new FormData()
                    formData.append('name', this.createForm.title)
                    // formData.append('creater_id',1)
                    this.$http({
                        url: '/createroom/',
                        method: 'POST',
                        body: formData,
                        before: function (request) { beforePost(request) }
                    }).then(function (res) {
                        console.log(res.body)
                        this.addLiveRoom(getListFromDB(res.body))
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

#logout {
    display: inline-block;
    padding-top: 2px;
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
    /*background-color: gray;*/
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

