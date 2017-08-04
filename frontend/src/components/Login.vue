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
                            <Input type="text" v-model="form.user" size="large" placeholder="Username">
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
                            <Button type="primary" @click="login()" class="button">Login</Button>
                            <Button type="text" class="button" @click="changeState()">Retrieve</Button>
                        </Form-item>
                        <input type="file" name="awd" @change="sendFile($event.target.files)"/>
                    </Form>
                </Card>
                <Card shadow class="card" v-else>
                    <p slot="title" class="title">Retrieve password</p>
                    <Form ref="retrieveForm" :model="retrieve" :rules="rule2" class="form">
                        <Form-item prop="user">
                            <Input type="text" v-model="retrieve.user" size="large" placeholder="Username">
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
                                <Icon type="eye-disabled" slot="prepend"></Icon>
                            </Input>
                        </Form-item>
                        <Form-item prop="pin">
                            <!--NEED MODIFY-->
                            <verification :send-type="typeOfUsername" :username="retrieve.user" father="login" ref="veri"></verification>
                        </Form-item>
                        <Form-item id="buttons-item">
                            <Button type="primary" @click="confirm()" class="button">Confirm</Button>
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
import { checkPassword, checkRePassword, checkVerification, checkForm, checkPhone, checkEmail } from '../utils/checks'
import { beforePost } from '../utils/utils'
import { mapGetters, mapMutations } from 'vuex'
import Verification from './tinyComponents/Verification'   //component

export default {
    components: {
        Verification
    },
    data () {
        const validatePin = (rule, value, callback) => {
            checkVerification(rule, value, callback, this.pincode)
        }
        const validatePass = (rule, value, callback) => {
            checkPassword(rule, value, callback, this.retrieve.reNewPassword, this.$refs.retrieveForm, 'reNewPassword')
        }
        const validatePassCheck = (rule, value, callback) => {
            checkRePassword(rule, value, callback, this.retrieve.newPassword)
        }
        const validateUsername = (rule, value, callback) => {
            if(value === ''){
                callback(new Error('please input username'))
            }
            else if(!(checkPhone(value) || checkEmail(value))){
                callback(new Error('this is not phone or email'))
            }
            else{
                callback()
            }
        }
        return {
            // 0 means login 1 means retrieve password
            state: 0,
            form: {
                user: '',
                password: '',
                pin: '',
            },
            retrieve: {
                user: '',
                newPassword: '',
                reNewPassword: '',
            },
            rule: {
                user: [
                    { required: true, validator: validateUsername, trigger: 'blur' }
                ],
                password: [
                    { required: true, message: 'Please input password', trigger: 'blur' },
                    { type: 'string', min: 6, max:25, message: 'Password should be 6 to 25 chars', trigger: 'blur' }
                ],
                pin: [
                    { required: true, validator: validatePin, trigger: 'blur' },
                    { type: 'string', min: 4, max: 4, message: 'pin code must be 4 numbers', trigger: 'blur' }
                ],
            },
            rule2: {
                user: [
                    { required: true, validator: validateUsername, trigger: 'blur' }
                ],
                newPassword: [
                    { required: true, validator: validatePass, trigger: 'blur' },
                    { type: 'string', min: 6, max: 25, message: 'password must be more than 6 chars less than 25', trigger: 'blur' }
                ],
                reNewPassword: [
                    { required: true, validator: validatePassCheck, trigger: 'blur' }
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
        typeOfUsername() {
            return 0
        },
    },
    methods: {
        ...mapMutations({
          goLeft: 'goLeft',
          goRight: 'goRight'
        }),
        showPinImg() {
            let result = verification.create()
            this.pincode = result.code
            this.pinurl = result.dataURL
            //console.log(this.pinurl)
        },
        changeState() {
            this.state = (this.state === 0)? 1 : 0;
            this.retrieve.user = (this.state === 1)? this.form.user : this.retrieve.user
            this.form.user = (this.state === 0)? this.retrieve.user : this.form.user
        },
        isUsernameExist() {

        },
        login() {
            if(checkForm(this, this.$refs['form'])){
                let data = {
                    username: this.form.user,
                    password: this.form.password
                }
                console.log(data)
                this.$http({
                    url: '/login/',
                    method: 'POST',
                    body: data,
                    before: function(request){beforePost(request)},
                }).then(function (res) {
                    console.log(res.body)
                    this.$router.push({path: '/home'})
                }, function (res) {
                    alert(res.body)
                })
            }
        },
        confirm() {
            if(checkForm(this, this.$refs['retrieveForm']) && this.$refs['veri'].validateForm()){

            }
        },
        sendFile(files){
            let file = files[0]
            let formData = new FormData()
            formData.append('thumbnail', file) 
            formData.append('name','fuckRoom2') 
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
        }
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
