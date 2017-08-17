<template>
<div id="topbar">
    <Menu  ref="topmenu" mode="horizontal" active-name="3" class="menu" theme="light" id="topmenu">
        <Menu-item class="longer">
            <img src="../../assets/logo1.png" class="logo-image" alt="head-image" :width="img.size" :height="img.size"> 
        </Menu-item>
        <Menu-item name="1">
            教育直播平台
        </Menu-item>
        <Menu-item name="2" class="top-right" v-if="user.role==='T'">
            <span id="createroom" @click="createModal = true"><Icon type="ios-plus" size="30" color="#5cadff" v-if="TYPE === 'home'"></Icon></span>
            <span id="startlive" @click="startLive()"><Icon type="ios-play" size="30" color="rgb(0,180,0)" v-if="TYPE==='studio'&&!liveState.isStart"></Icon></span>
            <span @click="endLive()"><Icon  id="endlive" type="android-exit" size="25" color="rgb(210,100,100)" v-if="TYPE==='studio'&&liveState.isStart"></Icon></span>
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
        <Submenu name="3" class="top-right" id="submenu">
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
                <span @click="modal = true" class="item">Modify Password</span>
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
                <span @click="logout()" class="item">
                <Icon type="power" size="10" color="rgb(210,100,100)"></Icon>
                Logout
                </span>           
            </Menu-item>
        </Submenu>
        <Menu-item name="2" class="top-right longer">
            <img :src="user.avatar" class="head-image" alt="head-image" :width="img.size" :height="img.size" @click="avatarModal = true"  id="avatar" ref="avatar">
            <Modal v-model="avatarModal" title="Upload Avatar" :width="300" id="avatar-modal">
                <upload-button UPLOADTYPE="avatar" :ONSUCCESS="changeAvatar" IMGSRC="user.avatar"></upload-button>
                <div slot="footer"></div>
            </Modal>
        </Menu-item>
    </Menu>
</div>
</template>

<script>
    import { beforePost, getListFromDB, getCookie } from '../../utils/utils'
    import { CONST } from '../../utils/const'
    import { checkPassword, checkRePassword, checkForm } from '../../utils/checks'
    import { mapGetters, mapActions, mapMutations } from 'vuex'
    import UploadButton from './UploadButton'

    export default {
        components: {
            UploadButton
        },
        props: {
            TYPE: 'home'
        },
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
                user: 'getUser',
                liveState: 'getLiveState'
            })
        },
        methods: {
            ...mapMutations({
                addLiveRoom: 'addLiveRoom',
                setAvatar: 'setAvatar',
                startLive: 'startLive'
            }),
            ...mapActions({
                logoutSubmit: 'logout',
                changePass: 'changePass',
                changeInfo: 'changeInfo',
                destroyLive: 'destroyLive'
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
                const that = this
                this.logoutSubmit().then(function () {
                    alert(CONST.success('Logout'))
                    that.$router.push({path: '/'})
                }, function (res) {
                    alert(res)
                })
            },
            modifyInfo () {
                checkForm(this, this.$refs.infoForm, () => {
                    let gender = (this.person.gender === 'male') ? true : false
                    let data = {
                        nickname: this.person.nickname,
                        gender: gender
                    }
                    this.changeInfo(data).then(function () {
                        alert(CONST.success('Modify Infomation'))
                    }, function (res) {
                        alert(res)
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
                    this.changePass(data).then(function () {
                        alert(CONST.success('Modify Password'))
                    }, function (res) {
                        alert(res)
                    })
                })
            },
            createRoom () {
                if (true) {
                    let formData = new FormData()
                    formData.append('name', this.createForm.title)
                    this.$http({
                        url: '/createroom/',
                        method: 'POST',
                        body: formData,
                        before: function (request) { beforePost(request) }
                    }).then(function (res) {
                        console.log(getListFromDB(res.body))
                        this.$router.push({ name: 'studio', query: getListFromDB(res.body) })
                    }, function (res) {
                        alert(res.status)
                    })
                }
            },
            changeAvatar (res, file) {
                let that = this
                setTimeout(function () {
                    console.log(that.user)
                    that.setAvatar('static/users/' + that.user.username + '/' + file.name)
                }, 4000)
                this.$Message.success(CONST.success('Upload Success!'))
                console.log('static/users/' + this.user.username + '/' + file.name)
                console.log(this.user.avatar)
            },
            avatarSizeError (file, fileList) {
                this.$Message.error('Image size must be under 200K')
            },
            avatarTypeError (file, fileList) {
                this.$Message.error('Image must be jpg jpeg png gif bmp')
            },
            endLive () {
                console.log('topbar endLive')
                this.$router.push({ path: '/home' })
            }
        },
        mounted () {
            console.log(this.user)
        }
        /* updated () {
            this.$refs.avatar.src = this.user.avatar
            this.$refs.bigAvatar.src = this.user.avatar
        } */
    }
</script>

<style scoped>
* {
    font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
}

#topmenu {
    overflow: hidden;
}

#createroom, #startlive {
    display: inline-block;
    padding-top: 5px;
}

#endlive {
    padding-top: 16px;
    padding-right: 7px;
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
    border: 1px solid rgba(180,230,180,0.7);
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

#submenu {
    text-align: center;
}
</style>