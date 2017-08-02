<template>
    <div class="login">
    <Row>
        <Col span="1" offset="0">
            <Button type="text" class="link" @click="goLeft()" id="go-left"><Icon type="reply"></Icon> Signup</Button>
        </Col>
        <Col span="1" offset="22">
            <Button type="text" class="link" @click="goRight()" id="go-right">Introduce <Icon type="forward"></Icon></Button>
        </Col>
    </Row>
        <Row id="cardrow">
            <Col span="6" offset="9">
                <Card shadow class="card" v-if="state === 0">
                    <p slot="title" class="title">Log in</p>
                    <Form ref="form" :model="form" :rules="rule" class="form">
                        <Form-item prop="user">
                            <Input type="text" v-model="user" size="large" placeholder="Username">
                                <Icon type="ios-person-outline" slot="prepend"></Icon>
                            </Input>
                        </Form-item>
                        <Form-item prop="password">
                            <Input type="password" v-model="form.password" size="large" placeholder="Password">
                                <Icon type="ios-locked-outline" slot="prepend"></Icon>
                            </Input>
                        </Form-item>
                        <Form-item prop="pin">
                            <Row>
                                <Col span="18">
                                    <Input v-model="form.pin" size="large" placeholder="Verification">
                                        <Icon type="star" slot="prepend"></Icon>
                                    </Input>
                                </Col>
                                <Col span="6">
                                    <img :src="pinurl" id="pin-code"  @click="showPinImg()"/>
                                </Col>
                            </Row>
                        </Form-item>
                        <Form-item id="buttons-item">
                            <Button type="primary" @click="handleSubmit('form')" class="button">登录</Button>
                            <Button type="text" class="button" @click="changeState()">找回密码</Button>
                        </Form-item>
                    </Form>
                </Card>
                <Card shadow class="card" v-else>
                    <p slot="title" class="title">Retrieve password</p>
                    <Form ref="retrieveForm" :model="retrieve" :rules="rule2" class="form">
                        <Form-item prop="user">
                            <Input type="text" v-model="user" size="large" placeholder="Username">
                                <Icon type="ios-person-outline" slot="prepend"></Icon>
                            </Input>
                        </Form-item>
                        <Form-item prop="newPassword">
                            <Input type="password" v-model="retrieve.newPassword" size="large" placeholder="New Password">
                                <Icon type="ios-locked-outline" slot="prepend"></Icon>
                            </Input>
                        </Form-item>
                        <Form-item prop="reNewPassword">
                            <Input type="password" v-model="retrieve.reNewPassword" size="large" placeholder="Repeat New password">
                                <Icon type="ios-locked-outline" slot="prepend"></Icon>
                            </Input>
                        </Form-item>
                        <Form-item prop="pin">
                            <Row>
                                <Col span="12">
                                <Input v-model="retrieve.verification" placeholder="Verification"><Icon type="star" slot="prepend"></Icon></Input>
                                </Col>
                                <Col span="6" offset="6">
                                <Button type="primary" v-if="this.retrieve.isSent" @click="achieveVerification()">Achieve</Button>
                                <Button type="primary" disabled v-else id="time-button">{{retrieve.time}}</Button>
                                </Col>
                            </Row>
                        </Form-item>
                        <Form-item id="buttons-item">
                            <Button type="primary" @click="handleSubmit('retrieveForm')" class="button">登录</Button>
                            <Button type="text" class="button" @click="changeState()">Back</Button>
                        </Form-item>
                    </Form>
                </Card>
            </Col>
        </Row>
    </div>
</template>

<script>

import verification from 'verification-code'
import { checkPassword, checkRePassword, checkVerification } from '../utils/checks'
import { mapGetters, mapMutations } from 'vuex'
const countDownNum = 60

export default {
    data () {
        const validatePin = (rule, value, callback) => {
            checkVerification(rule, value, callback, this.pincode)
        }
        const validateVerification = (rule, value, callback) => {
            checkVerification(rule, value, callback, this.pincode)
        }
        const validatePass = (rule, value, callback) => {
            checkPassword(rule, value, callback, this.retrieve.reNewPassword, this.$refs.retrieveForm, 'reNewPassword')
        }
        const validatePassCheck = (rule, value, callback) => {
            checkRePassword(rule, value, callback, this.retrieve.newPassword)
        } 
        return {
            // 0 means login 1 means retrieve password
            state: 0,
            user: '',

            form: {
                password: '',
                pin: '',
            },
            retrieve: {
                newPassword: '',
                reNewPassword: '',
                verification: '',
                time: 60,
                isSent: false,
            },
            rule: {
                user: [
                    { required: true, message: '请填写用户名', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '请填写密码', trigger: 'blur' },
                    { type: 'string', min: 6, max:25, message: '密码长度不能小于6位', trigger: 'blur' }
                ],
                pin: [
                    { required: true, validator: validatePin, trigger: 'blur' },
                    { type: 'string', min: 4, max: 4, message: 'pin code must be 4 numbers', trigger: 'blur' }
                ],
            },
            rule2: {
                user: [
                    { required: true, message: 'please input username', trigger: 'blur' }
                ],
                newPassword: [
                    { required: true, validator: validatePass, trigger: 'blur' },
                    { type: 'string', min: 6, max: 25, message: 'password must be more than 6 chars less than 25', trigger: 'blur' }
                ],
                reNewPassword: [
                    { required: true, validator: validatePassCheck, trigger: 'blur' }
                ],
                verification: [
                    { required: true, validator: validatePin, trigger: 'blur' },
                    { type: 'string', min: 4, max: 4, message: 'verification must be 4 numbers', trigger: 'blur' }
                ],
            },
            pinurl: '',
            pincode: '',
        }
    },
    mounted: function() {
        this.showPinImg()
    },
    computed: {
         ...mapGetters({
            page: 'getPage'
        }),
    },
    methods: {
        ...mapMutations({
          goLeft: 'goLeft',
          goRight: 'goRight'
        }),
        handleSubmit(name) {
            this.$refs[name].validate((valid) => {
                if (valid) {
                    this.$Message.success('Form legal!');
                } else {
                    this.$Message.error('Form illegal!');
                }
            })
        },
        showPinImg() {
            let result = verification.create()
            this.pincode = result.code
            this.pinurl = result.dataURL
            //console.log(this.pinurl)
        },
        changeState() {
            this.state = (this.state == 0)? 1 : 0;
        },
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
* {
    font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
}

#cardrow {
    clear: both;
}

.title {
    /*font-size: 20px;*/
    /*color: white;*/
    text-align: left;
    /*height: 35px;*/
    margin-left: 3%;
}

.card {
    margin-top: 20%;
    background-color: rgba(255, 255, 255, 0.95);
}

.button {
    /*background-color: rgb(200, 200, 200);*/
    float: right;
}

.form {
    margin-top: 10%;
}

#buttons-item {
    margin-top: 20%;
}

#pin-code {
    display: inline-block;
    width: 100%;
    margin-top: 1px; 
    height: 36px;
    border-radius: 10%;
}

.link {
    /*padding-top: 30px;*/
    color: white;
    font-size: 20px;
}

.link:hover {
    color: rgb(235, 235, 235);
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
