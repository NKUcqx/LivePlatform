<template>
<div>
    <Row>
        <Col span="1" offset="0">
            <Button type="text" class="link" @click="goLeft()" id="go-left"><Icon type="reply"></Icon> Introduce</Button>
        </Col>
        <Col span="1" offset="22">
            <Button type="text" class="link" @click="goRight()" id="go-right">Login <Icon type="forward"></Icon></Button>
        </Col>
    </Row>
    <Row id="signup-row">
        <Col span="8" offset="8">
        <Card id="signup" shadow>
            <p slot="title" id="title">Sign Up</p>
            <Form ref="signinfo" :label-width="90" :model="signinfo" :rules="ruleSignup">
                <Form-item>
                <Button-group id="select-type">
                    <Button :type="phoneButton" @click="changeType()">Phone</Button>
                    <Button :type="emailButton" @click="changeType()">Email</Button>
                </Button-group>
                </Form-item>
                <Form-item label="email:" v-if="this.type === 1" prop="email">
                    <Input v-model="signinfo.email" placeholder="please input your EMAIL"></Input>
                </Form-item>
                <Form-item label="phone:" v-else prop="phone">
                    <Input v-model="signinfo.phone" placeholder="please input your PHONE"></Input>
                </Form-item>
                <Form-item label="password:" prop="password">
                    <Input v-model="signinfo.password" placeholder="please input your PASSWORD" type="password"></Input>
                </Form-item>
                <Form-item label="repeat:" prop="passwordCheck"> 
                    <Input v-model="signinfo.passwordCheck" placeholder="please repeat your PASSWORD" type="password"></Input>
                </Form-item>
                <Form-item label="nickname:" prop="nickname">
                    <Input v-model="signinfo.nickname" placeholder="please input your NICKNAME"></Input>
                </Form-item>
                <Form-item label="gender:" prop="gender">
                    <Radio-group v-model="signinfo.gender">
                        <Radio label="female"></Radio>
                        <Radio label="male"></Radio>
                    </Radio-group>
                </Form-item>
                <Form-item label="verification:" prop="verification">
                    <verification :send-type="type" :username="getUsername" father="signup" ref="veri"></verification>
                </Form-item>
                <Form-item id="submit-item">
                    <Button type="primary" @click="signup()" id="submit">Signup</Button>
                </Form-item>
            </Form>
        </Card>    
        </Col>
    </Row>
</div>
</template>

<script>
    /**
     *Module TinyComponents
     *
     *@module TinyComponents
     *@requires Utils
     */
    import Verification from './tinyComponents/Verification'
    import { checkPassword, checkRePassword, checkVerification, checkForm, checkPhone, checkEmail, checkUsername } from '../utils/checks'
    import { beforePost } from '../utils/utils'
    import { CONST } from '../utils/const'
    import { mapGetters, mapMutations, mapActions } from 'vuex'
    /**
     *SignUp
     *@class SignUp
     *@constructor
     */
    export default {
        components: {
            Verification
        },
        data () {
            // this is for check password
            const validateEmail = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('please input email'))
                } else if (!checkEmail(value)) {
                    callback(new Error('this is not email'))
                } else {
                    checkUsername(rule, value, callback, 'signup')
                }
            }
            const validatePass = (rule, value, callback) => {
                checkPassword(rule, value, callback, this.signinfo.passwordCheck, this.$refs.signinfo, 'passwordCheck')
            }
            const validatePassCheck = (rule, value, callback) => {
                checkRePassword(rule, value, callback, this.signinfo.password)
            }
            const validatePhone = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('please input phone'))
                } else if (!checkPhone(value)) {
                    callback(new Error('this is not phone numbers'))
                } else {
                    checkUsername(rule, value, callback, 'signup')
                }
            }
            return {
                // 0 means phone 1 means email
                type: 0,
                signinfo: {
                    email: '',
                    phone: '',
                    password: '',
                    passwordCheck: '',
                    nickname: '',
                    gender: 'female',
                    verification: ''
                },
                ruleSignup: {
                    email: [
                        { required: true, type: 'string', validator: validateEmail, trigger: 'blur' }
                    ],
                    phone: [
                        { required: true, type: 'string', validator: validatePhone, trigger: 'blur' }
                    ],
                    password: [
                        { required: true, validator: validatePass, trigger: 'blur' },
                        { type: 'string', min: 6, max: 25, message: 'password must be more than 6 chars less than 25', trigger: 'blur' }
                    ],
                    passwordCheck: [
                        { required: true, validator: validatePassCheck, trigger: 'blur' }
                    ],
                    nickname: [
                        { type: 'string', min: 6, max: 20, message: 'nickname must be more than 6 chars less than 20', trigger: 'blur' }
                    ]
                }
            }
        },
        computed: {
            ...mapGetters({
                page: 'getPage'
            }),
            phoneButton () {
                return (this.type === 0) ? 'primary' : 'ghost'
            },
            emailButton () {
                return (this.type === 1) ? 'primary' : 'ghost'
            },
            randomCode () {
                this.code = Math.random() * 8999 + 1000
                return Math.floor(this.code)
            },
            getUsername () {
                return (this.type === 0) ? this.signinfo.phone : this.signinfo.email
            }
        },
        methods: {
            ...mapMutations({
                goLeft: 'goLeft',
                goRight: 'goRight'
            }),
            ...mapActions({
                signupSummit: 'signup'
            }),
            /**
             *更改注册方式（是手机还是邮箱注册）
             *@event changeType
             */
            changeType () {
                this.type = (this.type === 0) ? 1 : 0
            },
            /**
             *注册函数（注册有效的话，激活表单，并让用户进入主页）
             *@event signup
             */
            signup () {
                const that = this
                checkForm(this, this.$refs['signinfo'], () => {
                    this.$refs['veri'].validateForm(() => {
                        let data = {
                            username: this.getUsername,
                            password: this.signinfo.password,
                            gender: (this.signinfo.gender === 'male'),
                            nickname: this.signinfo.nickname
                        }
                        this.signupSummit(data).then(function () {
                            that.$Message.success(CONST.success('Signup'))
                            that.$router.push({path: '/home'})
                        }, function (res) {
                            alert(res)
                        })
                    })
                })
            }
    
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#signup{
    background-color: rgba(255,255,255,0.95);
    margin-top: 3%;
    text-align: left;
}
#signup-row {
    clear: both;
}
#select-type{
    float: right;
}
#title {
    margin-left:20px;
}
#submit{
    float: right;
}
#submit-item{
    margin-top: 10%;
}
#time-button {
    float: right;
}
.link {
    /*padding-top: 30px;*/
    color: rgba(255, 255, 255, 0.3);
    font-size: 20px;
}
.link:hover {
    color: rgb(255, 255, 255);
    font-size: 22px;
    padding-bottom: 0px;
}
#go-right {
    float: right;
}
#go-left {
    float: left;
}
</style>
