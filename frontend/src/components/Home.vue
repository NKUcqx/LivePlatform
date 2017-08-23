<template>
    <div id="home">
        <topbar TYPE="home" id="topbar"></topbar>
        <div id="fortop"></div>
        <div id="showbar" :style="style">
            <div id="carousel-containter">
                <Carousel v-model="carousel" autoplay="auto" :autoplay-speed="3000" id="carousel" trigger="hover" arrow="always" dots="none" :style="height">
                    <Carousel-item v-for="(livesItem, index) in mostPopular" class="carousel-item" >
                        <div class="carousl-background" :style="carouselStyle(index)" @click="enterRoom(index)"></div>
                    </Carousel-item>
                </Carousel>
            </div>
            <div id="carousel-aside">
                <div class="aside-item" v-for="(livesItem, index) in mostPopular" @mouseover="flipOver(index)" :style="asideStyle(index)" @click="enterRoom(index)">
                </div>
            </div>
        </div>
        <div id="container" :style="style">
            <Card dis-hover class="card" id="live">
                <h3 slot="title" class="headersection">
                    <Icon type="social-twitch-outline"></Icon>
                    正在直播
                </h3>
                <section class="flexcontainer">
                    <room v-for="livesItem in livesList" :item="livesItem"></room>
                    <div class="pagediv">
                        <Page :current="1" :total="roomAmount.liveAmount" :page-size="pageSize" @on-change="changeLivePage" simple></Page>
                    </div>
                </section>
            </Card>
            <Card dis-hover class="card" id="video">
                <h3 slot="title" class="headersection">
                    <Icon type="ios-videocam"></Icon>
                    录播视频
                </h3>
                <section class="flexcontainer">
                    <room v-for="videoItem in videosList" :item="videoItem"></room>
                    <div class="pagediv">
                        <Page :current="1" :total="roomAmount.videoAmount" :page-size="pageSize" @on-change="changeVideoPage" simple></Page>
                    </div>
                </section>
            </Card>
        </div>
    </div>
</template>

<script>
    /**
     *Module TinyComponents
     *
     *@module TinyComponents
     *@requires Utils
     */
    import { mapGetters, mapActions, mapMutations } from 'vuex'
    import Room from './tinyComponents/Room'
    import Topbar from './tinyComponents/Topbar'
    import { beforePost } from '../utils/utils'
    /**
     *主页
     *@class Home
     *@constructor
     */
    export default {
        name: 'videoList',
        components: {
            Room,
            Topbar
        },
        data () {
            return {
                WIDTH: window.document.documentElement.clientWidth,
                HEIGHT: document.documentElement.clientHeight,
                carousel: 0,
                numOfLine: 0,
                livePage: 1,
                videoPage: 1,
                style: {
                    width: '600px'
                }
            }
        },
        watch: {
            WIDTH: function (newVal, oldVal) {
                this.numOfLine = parseInt((newVal - 35) / 270)
                this.style.width = (this.numOfLine * 270 + 35).toString() + 'px'
            },
            numOfLine: function () {
                this.setPageSize(this.numOfLine * 2)
                this.changeLivePage(this.livePage)
                this.changeVideoPage(this.videoPage)
            }
        },
        computed: {
            ...mapGetters({
                livesList: 'getLiveRooms',
                videosList: 'getVideoRooms',
                roomAmount: 'getRoomAmount',
                pageSize: 'getPageSize',
                mostPopular: 'getMostPopular',
                userid: 'getUserId'
            })
        },
        methods: {
            ...mapMutations({
                setPageSize: 'setPageSize',
                setRoomInfo: 'setRoomInfo'
            }),
            ...mapActions({
                getRoomsFromDB: 'getRoomsFromDB',
                getRoomAmountFromDB: 'getRoomAmountFromDB',
                checkEnter: 'checkEnter'
            }),
            /**
             *依据index，返回轮播的背景图片
             *@method carouselBackground
             *@param {Number} index
             *@return {String} url(路径)
             */
            carouselBackground (index) {
                return 'url(' + this.mostPopular[index].thumbnail_path + ')'
            },
            /**
             *处理鼠标悬停在轮播的其中一个图片上的事件
             *@event flipOver
             *@param {Number} index
             */
            flipOver (index) {
                this.carousel = index
            },
            /**
             *依据index，设置轮播的index为index的图的式样(返回一个对象有高度和背景图属性)
             *@method carouselStyle
             *@param {Number} index
             *@return {Object} {height:...px,backgroundImage:url(...)}
             */
            carouselStyle (index) {
                const that = this
                return {
                    height: ((this.numOfLine * 270 + 35) * 0.75 * 0.60).toString() + 'px',
                    backgroundImage: that.carouselBackground(index)
                }
            },
            /**
             *设置轮播的侧栏式样
             *@method asideStyle
             *@param {Number} index
             *@return {Object} {height:...px,backgroundImage:url(...),border:...}
             */
            asideStyle (index) {
                const that = this
                if (index === this.carousel) {
                    return {
                        height: ((this.numOfLine * 270 + 35) * 0.75 * 0.60 * 0.25).toString() + 'px',
                        backgroundImage: that.carouselBackground(index),
                        border: '3px solid #5cadff'
                    }
                } else {
                    return {
                        height: ((this.numOfLine * 270 + 35) * 0.75 * 0.60 * 0.25).toString() + 'px',
                        backgroundImage: that.carouselBackground(index),
                        border: '1px solid rgb(191, 191, 191)'
                    }
                }
            },
            /**
             *进入房间事件（设置房间信息，进入房间页面）
             *@event enterRoom
             *@param {Number} index
             */
            enterRoom (index) {
                this.setRoomInfo(this.mostPopular[index])
                this.checkEnter({user_id: this.userid, room_id: this.mostPopular[index].id})
            },
            /**
             *改变录播区域的所处第几页，房间随着页数变化
             *@event changeVideoPage
             *@param {Number} page
             */
            changeVideoPage (page) {
                this.livePage = page
                this.getRoomsFromDB({ isLive: false, start: (page - 1) * this.pageSize })
            },
            /**
             *改变直播区域的所处第几页，房间随着页数变化
             *@event changeLivePage
             *@param {Number} page
             */
            changeLivePage (page) {
                this.videoPage = page
                this.getRoomsFromDB({ isLive: true, start: (page - 1) * this.pageSize })
            }
        },
        mounted: function () {
            this.getRoomsFromDB({ isLive: true })
            this.getRoomsFromDB({ isLive: false })
            this.getRoomAmountFromDB()
            window.addEventListener('resize', () => {
                this.WIDTH = (document.documentElement.clientWidth < 800) ? 800 : document.documentElement.clientWidth
            })
        },
        created: function () {
            this.WIDTH = (document.documentElement.clientWidth < 800) ? 800 : document.documentElement.clientWidth
            this.numOfLine = parseInt((this.WIDTH - 35) / 270)
            this.setPageSize(this.numOfLine * 2)
            this.style.width = (this.numOfLine * 270 + 35).toString() + 'px'
        }
    }
</script>
<style scoped>
* {
    font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
}
#topbar {
    width: 100%;
    position: fixed;
    z-index: 500;
    overflow: hidden;
}
#fortop{
    width: 100%;
    height: 60px;
}
#showbar {
    display: inline-block;
    clear: both;
    overflow: hidden;
    -moz-box-shadow:2px 2px 10px #A1A1A1;
    -webkit-box-shadow:2px 2px 10px #A1A1A1; 
    box-shadow: 2px 2px 10px #A1A1A1;
    /*background-size: 100% 100%;
    background-repeat: no-repeat;
    background-image: url(../assets/bg5.jpg);*/
}

#carousel {
    background-color: rgb(1, 1, 1);
}

.carousl-background {
    width: 100%;
    background-size: 100% 100%;
    background-repeat: no-repeat;
}

#carousel-containter {
    display: inline-block;
    width: 75%;
    float: left;
}

#carousel-containter:hover {
    cursor: pointer;
}

#carousel-aside {
    display: inline-block;
    width: calc(25% - 5px);
    background-color: rgba(0, 0, 0, 0);
    float: right;
}

#carousel-aside:hover {
    cursor: pointer;
}

.aside-item {
    width: 100%;
    background-color: rgb(255, 255, 255);
    background-repeat: no-repeat;
    background-size: 100% 100%;
    border: 1px solid rgb(191, 191, 191);
}

.aside-item:hover {
    border: 3px solid rgb(0, 180, 0);
    -moz-box-shadow:0px 0px 5px #878787;
    -webkit-box-shadow:0px 0px 5px #878787;
    box-shadow:0px 0px 5px #878787;
}


#home {
    background: rgb(249,249,249);
    text-align: center;
    min-width: 800px;
}

#container {
    display: inline-block;
    text-align: center;
}

.card {
    display: inline-block;
    width: 100%;
    margin: 30px 0px;
    /*-moz-box-shadow:2px 2px 10px #A1A1A1;
    -webkit-box-shadow:2px 2px 10px #A1A1A1; 
    box-shadow: 2px 2px 10px #A1A1A1;*/
}

.headersection {
    /*border: 1px red solid;*/
    padding: 10px 15px;
    text-align: left;
}

.flexcontainer {
    text-align: left;
}

.pagediv {
    margin-top: 30px;
    width: 100%;
    text-align: center;
}

.line-center {
    text-align: center
}
</style>