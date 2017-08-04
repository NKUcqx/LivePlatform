<template>
<div id="app">
    <div class="layout" :class="{'layout-hide-text': spanLeft < 5}">
        <Row type="flex">
            <i-col :span="spanLeft" class="layout-menu-left">
                <Menu active-name="1" theme="dark" width="auto">
                    <div class="layout-logo-left"></div>
                    <Menu-item name="1">
                        <Icon type="ios-navigate" :size="iconSize"></Icon>
                        <span class="layout-text">直播</span>
                    </Menu-item>
                    <Menu-item name="2">
                        <Icon type="ios-keypad" :size="iconSize"></Icon>
                        <span class="layout-text">录播</span>
                    </Menu-item>
                </Menu>
            </i-col>
            <i-col :span="spanRight">
                <div class="layout-header">
                    <i-button type="text" @click="toggleClick">
                        <Icon type="navicon" size="32"></Icon>
                    </i-button>
                </div>
                <div class="topbar">
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
                                    <span @click="addVedio">创建直播</span>
                                </Menu-item>
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
                </div>
                <div class="container">
                    <!--div class="operation" align="right">
                        <Button style="shape:circle;" type="primary" @click="addVedio">创建直播</Button>
                        <Button style="shape:circle;" type="primary" @click="deleteVedio">删除直播</Button>
                    </div-->
                    <br><br><br>
                    <div class="headersection">
                        <h1>
                            <Icon type="social-twitch-outline"></Icon>
                            正在直播
                        </h1>
                    </div>
                    <br>
                    <section class="flexcontainer">
                        <vedio v-for="(vedioItem, index) in vedioList" :vedioItem="vedioItem" :index="index"></vedio>
                    </section>
                    <br><br>
                    <div class="headersection">
                        <h1>
                            <Icon type="ios-videocam"></Icon>
                            录播视频
                        </h1>
                    </div>
                    <section class="flexcontainer">
                        <record></record><record></record><record></record><record></record><record></record><record></record><record></record><record></record><record></record><record></record><record></record><record></record>
                    </section>
                    <Page :total="10"></Page>
                </div>
            </i-col>
        </Row>
    </div>
</div>
</template>
<script>
    import Vedio from './vedio'
    import Reord from './record'
    export default {
        name: 'vedioList',
        components: {
            Vedio,
            'record':Reord
        },
        data () {
            return {
                theme1: 'light',
                modal1: false,
                spanLeft: 5,
                spanRight: 19
            }
        },
        computed: {
            vedioList () {
                return this.$store.getters.vedios
            },
            iconSize () {
                return this.spanLeft === 5 ? 14 : 24;
            }
        },
        methods: {
            ok () {
                this.$Message.info('点击了确定');
            },
            cancel () {
                this.$Message.info('点击了取消');
            },
            addVedio () {
                this.$store.commit('addVedio', '我们如何获得洪荒之力','Mr White',666)
            },
            deleteVedio (index) {
                this.$store.commit('deleteVedio', index)
            },
            toggleClick () {
                if (this.spanLeft === 5) {
                    this.spanLeft = 2;
                    this.spanRight = 22;
                } else {
                    this.spanLeft = 5;
                    this.spanRight = 19;
                }
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
.headersection{
    height: 72px;
    margin: auto;
    color: white;
}
.flexcontainer{
    display: flex;
    flex-wrap: wrap;
    margin:auto;
    justify-content: space-between;
    width: 80%;
}
.topbar{
    height: 62px;
}
.vedio{
    flex: 0 0;
}
.record{
    flex:0 0;
}
.container{
    background-image: url(../assets/bg7.jpg);
}
.operation{
    height: 62px;
}
.layout{
    border: 1px solid #d7dde4;
    background: #f5f7f9;
    position: relative;
    border-radius: 4px;
    overflow: hidden;
}
.layout-hide-text .layout-text{
    display: none;
}
.layout-menu-left{
    background: #464c5b;
}
.layout-logo-left{
        width: 90%;
        height: 30px;
        background: #5b6270;
        border-radius: 3px;
        margin: 15px auto;
}
.layout-hide-text .layout-text{
    display: none;
}
</style>
