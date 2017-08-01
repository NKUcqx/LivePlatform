<template>
    <div class="login">
        <Row>
            <Col span="6" offset="9">
                <Card shadow class="card">
                    <p slot="title" class="title">Log in</p>
                    <Form ref="form" :model="form" :rules="rule">
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
                        <Form-item prop="verification">
                            <Row>
                                <Col span="18">
                                    <Input type="verification" v-model="form.verification" size="large" placeholder="Verification">
                                        <Icon type="star" slot="prepend"></Icon>
                                    </Input>
                                </Col>
                            </Row>
                        </Form-item>
                        <Form-item>
                            <Button type="primary" @click="handleSubmit('formInline')" class="button">登录</Button>
                            <Button type="primary" class="button">找回密码</Button>
                        </Form-item>
                    </Form>
                </Card>
            </Col>
        </Row>
    </div>
</template>

<script>
export default {
    data () {
        return {
            form: {
                user: '',
                password: ''
            },
            rule: {
                user: [
                    { required: true, message: '请填写用户名', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '请填写密码', trigger: 'blur' },
                    { type: 'string', min: 6, message: '密码长度不能小于6位', trigger: 'blur' }
                ]
            }
        }
    },
    methods: {
        handleSubmit(name) {
            this.$refs[name].validate((valid) => {
                if (valid) {
                    this.$Message.success('提交成功!');
                } else {
                    this.$Message.error('表单验证失败!');
                }
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

.title {
    font-size: 30px;
    color: white;
    text-align: left;
    height: 35px;
}

.login {
    height: 840px;
    background-image: url(../assets/images.jpg);
}

.card {
    margin-top: 180px;
    background-color: rgba(169, 215, 238, 0.7);
}

.button {
    background-color: rgb(200, 200, 200);
}
</style>
