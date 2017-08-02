<template>
    <Menu mode="horizontal" :theme="theme1" active-name="3" class="menu">
        <Row>
        <Col xs="20" :sm="16" :md="12" :lg="20">
            <Menu-item name="1">
                <p>教育直播平台</p>
            </Menu-item>
        </Col>
        <Col>
            <Menu-item name="2" class="head">
                <img src="../assets/logo.png" class="head-image" alt="head-image">
            </Menu-item>
        </Col>
        <Col>
            <Submenu name="3">
                <template slot="title">
                    <Icon type="ios-paper"></Icon>
                    个人中心
                </template>
                <Menu-item name="3-1">昵称</Menu-item>
                <Menu-item name="3-2">性别</Menu-item>
                <Menu-item name="3-3">身份</Menu-item>
                <Menu-item name="3-4">
                    <span @click="modal1 = true">修改密码</span>
                </Menu-item>
                <Modal v-model="modal1" title="修改密码" @on-ok="ok" @on-cancel="cancel">
                <p>对话框内容</p>
                <p>对话框内容</p>
                <p>对话框内容</p>
                </Modal>
            </Submenu>
        </Col>
        </Row>
    </Menu>
</template>
<script>
    export default {
        data () {
            return {
                theme1: 'light',
                modal1: false
            }
        },
        methods: {
            ok () {
                this.$Message.info('点击了确定');
            },
            cancel () {
                this.$Message.info('点击了取消');
            }
        }
    }
</script>
<style scoped>
* {
    font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
}

.menu {
    height: 80px;
}

.head {
    border-radius: 50%;
}

.head-image {
    margin-top: 10px;
    height: 45px;
    width: auto;
    background-color: rgb(230, 230, 230);
    border-radius: 50%;
}
</style>
