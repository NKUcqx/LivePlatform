<template>
<div>
	<Form ref="verification" :model="form" :rules="ruleVerification">
	<Form-item prop="verification">
	 	<Row>
		    <Col span="12">
		    	<Input v-model="form.verification" placeholder="Input VERIFICATION"><Icon id="star" type="star" slot="prepend" v-if="this.father==='login'"></Icon></Input>
		    </Col>
		    <Col span="6" offset="6">
			    <Button id="achieve" type="primary" v-if="this.state === 'unsent'" @click="testUsername()" class="buttons">Achieve</Button>
			    <Button id="time" type="primary" disabled v-else class="buttons">{{time}}</Button>
		    </Col>
		</Row>
	</Form-item>
	</Form>
</div>
</template>

<script>
import { mapActions } from 'vuex'
import { checkVerification, checkPhone, checkEmail, checkForm } from '../../utils/checks'
import { beforePost } from '../../utils/utils'
const countDownNum = 60
export default {
    data () {
        const validateVerification = (rule, value, callback) => {
            checkVerification(rule, value, callback, this.code)
        }
        return {
            form: {
                verification: ''
            },
            time: countDownNum,
            code: '4444',
            state: 'unsent',
            ruleVerification: {
                verification: [
                    { required: true, validator: validateVerification, trigger: 'blur' },
                    { type: 'string', min: 4, max: 4, message: 'verification must be 4 numbers', trigger: 'blur' }
                ]
            }
        }
    },
    props: {
        sendType: Number,
        username: String,
        father: String
    },
    computed: {
        randomCode () {
            return Math.floor(Math.random() * 8999 + 1000)
        }
    },
    methods: {
        ...mapActions({
            testUser: 'testUsername'
        }),
        beginCountdown () {
            const countDown = () => {
                this.time -= 1
                if (this.time <= 0) {
                    this.state = 'unsent'
                    clearInterval(interval)
                    this.time = countDownNum
                }
            }
            let interval = setInterval(function () { countDown() }, 1000)
        },
        achieveVerification () {
            if (this.sendType === 0 && checkPhone(this.username)) {
                this.state = 'sent'
                this.beginCountdown()
                this.sendMessage()
            } else if (this.sendType === 1 && checkEmail(this.username)) {
                this.state = 'sent'
                this.beginCountdown()
                this.sendEmail()
                this.$Message.success('Send Success')
            }
        },
        validateForm (todo) {
            return checkForm(this, this.$refs['verification'], todo)
        },
        sendEmail () {
            this.code = this.randomCode
            let data = {
                email: this.username,
                code: this.code
            }
            this.$http({
                url: '/sendemail/',
                method: 'POST',
                body: data,
                before: function (request) { beforePost(request) }
            }).then(function (res) {
                console.log(res.body)
            }, function (res) {
                alert(res.body)
            })
        },
        sendMessage () {
            this.code = this.randomCode
            let data = {
                account: 'C78894239',
                password: '25ff6ea6a323a00581db9424daefb7c9',
                content: 'Your verification code is ' + this.code + '. Do not reveal to others',
                mobile: this.username,
                format: 'json'
            }
            this.$http.jsonp(
                'http://106.ihuyi.com/webservice/sms.php?method=Submit',
                {
                    params: data,
                    jsonp: 'cb'
                }).then(function (res) {
                    this.$Message.success('Send Success')
                    // console.log(res.body)
                }, function (res) {
                    this.$Message.success('Send Success')
                    // console.log(res.status)
                })
        },
        testUsername () {
            let that = this
            let data = {
                username: this.username,
                father: this.father
            }
            this.testUser(data).then(function () {
                that.achieveVerification()
            }, function (res) {
                (res) ? alert('username does exist') : alert('username does not exist')
            })
        }
    }
}
</script>

<style scoped>

.buttons{
	float: right;
}

</style>
