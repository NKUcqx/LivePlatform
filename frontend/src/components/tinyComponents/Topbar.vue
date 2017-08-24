<template>
<div id="topbar">
    <Menu  ref="topmenu" mode="horizontal" active-name="3" class="menu" theme="light" id="topmenu">
        <Menu-item class="longer">
            <img src="../../assets/logo2.png" class="logo-image" :height="img.size" @click="goHome()"> 
        </Menu-item>
        <!--<Menu-item name="1">
            <span @click="goHome()" id = "ourtitle">DebugNow</span>
        </Menu-item>-->
        <Menu-item name="2" class="top-right" v-if="user.role==='T'">
            <span id="createroom" @click="createModal = true"><Icon type="ios-plus" size="30" color="#5cadff" v-if="TYPE === 'home'"></Icon></span>
            <span id="startlive" @click="startLive()"><Icon type="ios-play" size="30" color="rgb(0,180,0)" v-if="TYPE==='studio'&&!isLiveStart&&AUTHORITY"></Icon></span>
            <span @click="endLive()"><Icon  id="endlive" type="android-exit" size="25" color="rgb(210,100,100)" v-if="TYPE==='studio'&&isLiveStart&&AUTHORITY"></Icon></span>
            <Modal v-model="createModal" title="Create Room" :width="400" @on-ok="createRoom()">
                <Form ref="createForm" :model="createform" :rules="ruleRoomname" :label-width="80">
                    <Form-item label="title:" prop="title">
                        <Input v-model="createform.title" size="large" placeholder="Title"></Input>
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
                <upload-button UPLOADTYPE="avatar" :ONSUCCESS="changeAvatar" :IMGSRC="user.avatar"></upload-button>
                <div slot="footer"></div>
            </Modal>
        </Menu-item>
    </Menu>
</div>
</template>

<script>
    /**
     *Module TinyComponents
     *
     *@module TinyComponents
     *@requires Utils
     */
    import { beforePost, getListFromDB, getCookie } from '../../utils/utils'
    import { CONST } from '../../utils/const'
    import { checkPassword, checkRePassword, checkForm } from '../../utils/checks'
    import { mapGetters, mapActions, mapMutations } from 'vuex'
    import UploadButton from './UploadButton'
    /**
     *顶栏
     *@class Topbar
     *@constructor
     */
    export default {
        components: {
            UploadButton
        },
        props: {
            TYPE: 'home',
            AUTHORITY: {
                type: Boolean,
                default: false
            }
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
                createform: {
                    title: ''
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
                    title: [
                        { required: true, message: 'Please input roomname', trigger: 'blur' },
                        { type: 'string', min: 6, max: 25, message: 'roomname should be 6 to 25 chars', trigger: 'blur' }
                    ]
                }
            }
        },
        computed: {
            ...mapGetters({
                user: 'getUser',
                isLiveStart: 'isLiveStart'
            })
        },
        methods: {
            ...mapMutations({
                addLiveRoom: 'addLiveRoom',
                setAvatar: 'setAvatar',
                startLive: 'startLive',
                endTheLive: 'endLive',
                setRoomInfo: 'setRoomInfo'
            }),
            ...mapActions({
                logoutSubmit: 'logout',
                changePass: 'changePass',
                changeInfo: 'changeInfo',
                destroyLive: 'destroyLive',
                createLive: 'createLive',
                checkEnter: 'checkEnter'
            }),
            /**
             *获取cookie
             *@method getCookie
             *@return {String} coockieValue
             */
            getCookie () {
                return getCookie('csrftoken')
            },
            /**
             *返回首页
             *@event goHome
             */
            goHome () {
                if (this.AUTHORITY) {
                    (confirm('Are you sure to leave home ?')) ? this.$router.push({name: 'home'}) : ''
                } else {
                    this.$router.push({name: 'home'})
                }
            },
            /**
             *触发修改个人信息的弹出框
             *@event makeIndoModal
             */
            makeIndoModal () {
                this.person.nickname = this.user.nickname
                this.person.gender = (this.user.gender) ? 'male' : 'female'
                this.infoModal = true
            },
            /**
             *注销账号，登出
             *@event logout
             */
            logout () {
                const that = this
                this.logoutSubmit().then(function () {
                    that.$Message.success(CONST.success('Logout'))
                    that.$router.push({path: '/'})
                }, function (res) {
                    alert(res)
                })
            },
            /**
             *可以修改昵称和性别，也可以不修改
             *@event modifyInfo
             */
            modifyInfo () {
                checkForm(this, this.$refs.infoForm, () => {
                    const that = this
                    let gender = (this.person.gender === 'male') ? true : false
                    let data = {
                        nickname: this.person.nickname,
                        gender: gender
                    }
                    this.changeInfo(data).then(function () {
                        that.$Message.success(CONST.success('Modify Infomation'))
                    }, function (res) {
                        alert(res)
                    })
                })
            },
            /**
             *修改密码
             *@event modifyPass
             */
            modifyPass () {
                let that = this
                checkForm(this, this.$refs.modifyForm, () => {
                    let data = {
                        username: this.user.username,
                        password: this.form.password,
                        new_password: this.form.newPassword
                    }
                    this.changePass(data).then(function () {
                        that.$Message.success(CONST.success('Modify Password'))
                    }, function (res) {
                        alert(res)
                    })
                })
            },
            /**
             *创建房间
             *@event createRoom
             */
            createRoom () {
                let that = this
                checkForm(this, this.$refs.createForm, () => {
                    let formData = new FormData()
                    formData.append('name', that.createform.title)
                    this.createLive(formData).then(function (res) {
                        that.setRoomInfo(getListFromDB(res.body))
                        that.checkEnter({user_id: that.user.userid, room_id: res.body.room.id})
                    }, function (res) {
                        alert(res.body)
                    })
                })
            },
            /**
             *换头像
             *@event changeAvatar
             */
            changeAvatar (res, file) {
                let that = this
                setTimeout(function () {
                    console.log(that.user)
                    that.setAvatar('static/users/' + that.user.username + '/' + file.name)
                }, 4000)
                this.$Message.success(CONST.success('Upload Success!'))
            },
            /**
             *响应头像太大的错误事件
             *@event avatarSizeError
             */
            avatarSizeError (file, fileList) {
                this.$Message.error('Image size must be under 200K')
            },
            /**
             *响应头像的文件格式错误事件
             *@event avatarTypeError
             */
            avatarTypeError (file, fileList) {
                this.$Message.error('Image must be jpg jpeg png gif bmp')
            },
            /**
             *结束直播
             *@event endLive
             */
            endLive () {
                let that = this
                this.$Modal.confirm({
                    title: '教育直播平台提醒您：',
                    content: '<p>确定退出直播吗？</p>',
                    onOk: () => {
                        console.log('topbar endlive in mutation')
                        that.endTheLive()
                    },
                    onCancel: () => {
                        this.$Message.info('Continue')
                    }
                })
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

#topbar #topmenu {
    overflow: hidden;
}

#topbar #createroom, #startlive {
    display: inline-block;
    padding-top: 5px;
}

#topbar #endlive {
    padding-top: 16px;
    padding-right: 7px;
}

#topbar .menu-item {
    height: 30px !important;
    padding-top: 0px !important;
    padding-bottom: 0px !important;
    padding-left: 0px !important;
    padding-right: 0px !important;
}

#topbar .item {
    display: inline-block;
    padding: 5px 0px;
    width: 100%;
    height: 100%;
    /*border: 1px red solid;*/
}

#topbar .top-right {
    float: right !important;
}

#topbar .head-image {
    border-radius: 50%;
    margin-top: 9px;
    border: 1px solid rgba(180,230,180,0.7);
    /*background-color: gray;*/
}

#topbar .logo-image {
    margin-top: 9px;
}

#topbar #avatar-modal {
    text-align: center;
}

#topbar .longer {
    height: 60px;
}

#topbar #submenu {
    text-align: center;
}
</style>