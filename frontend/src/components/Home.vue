<template>
    <div id="home">
        <topbar></topbar>
        <div id="showbar">
            <div id="carousel-containter">
                <Carousel v-model="carousel" id="carousel" trigger="hover" arrow="always">
                    <Carousel-item v-for="(livesItem, index) in livesList.slice(0,4)" class="carousel-item" >
                        <div class="carousl-background" :style="carouselStyle(index)"></div>
                    </Carousel-item>
                </Carousel>
            </div>
            <div id="carousel-aside">
                <div class="aside-item" v-for="(livesItem, index) in livesList.slice(0,4)" @mouseover="flipOver(index)" :style="asideStyle(index)">
                </div>
            </div>
        </div>
        <div id="container">
            <div class="headersection">
                <h1>
                    <Icon type="social-twitch-outline"></Icon>
                    正在直播
                </h1>
            </div>
            <section class="flexcontainer">
                <room v-for="livesItem in livesList" :item="livesItem"></room>
            </section>
            <div class="headersection">
                <h1>
                    <Icon type="ios-videocam"></Icon>
                    录播视频
                </h1>
            </div>
            <section class="flexcontainer">
                <room v-for="videoItem in videosList" :item="videoItem"></room>
            </section>
        </div>
    </div>
</template>

<script>
    import { mapGetters, mapActions, } from 'vuex'    
    import Room from './tinyComponents/Room'
    import Topbar from './tinyComponents/Topbar'
    import { beforePost } from '../utils/utils'

    export default {
        name: 'videoList',
        components: {
            Room,
            Topbar,
        },
        data () {
            return {
                WIDTH: window.document.documentElement.clientWidth,
                HEIGHT: document.documentElement.clientHeight,
                carousel: 0,

                //delete later
                background: new Array(4)
            }
        },
        computed: {
            ...mapGetters({
                getLiveRooms: 'getLiveRooms',
                getVideoRooms: 'getVideoRooms',
            }),
            livesList () {
                return this.getLiveRooms
            },
            videosList () {
                return this.getVideoRooms
            },
        },
        methods: {
            ...mapActions({
                getRoomsFromDB: 'getRoomsFromDB',
            }),
            flipOver(index) {
                this.carousel = index
            },
            carouselStyle(index) {
                return {
                    backgroundImage: 'url( ../../static/bg' + (index + 3) + '.jpg)'
                }
            },
            asideStyle(index) {
                if(index === this.carousel) {
                    console.log(this.background[index])
                    return {
                        backgroundImage: 'url( ../../static/bg' + (index + 3) + '.jpg)',
                        border : '3px solid rgb(0, 180, 0)'
                    }
                }
                else {
                    return {
                        backgroundImage: 'url( ../../static/bg' + (index + 3) + '.jpg)',
                        border : '1px solid rgb(191, 191, 191)'
                    } 
                }
            },
        },
        mounted: function() {
            this.getRoomsFromDB(true)
            this.getRoomsFromDB(false)
        }
    }
</script>
<style scoped>
* {
    font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
}

#showbar {
    margin-top:;
    text-align: left;
    padding: 0% 10%;
    clear: both;
    overflow: hidden;
    background-size: 100% 100%;
    background-repeat: no-repeat;
    background-image: url(../assets/bg5.jpg);
}

#carousel {
    height: 500px;
    background-color: rgb(1, 1, 1);
}

.carousl-background {
    height: 500px;
    width: 100%;
    background-size: 100% 100%;
    background-repeat: no-repeat;
}

#carousel-containter {
    display: inline-block;
    width: 75%;
    float: left;
}

#carousel-aside {
    display: inline-block;
    width: calc(25% - 5px);
    height: 500px;
    background-color: rgb(120, 120, 120);
    float: right;
}

.aside-item {
    width: 100%;
    height: calc(500px / 4 + 1px);
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
    background-color: rgb(249, 249, 249);
}

#containter {

}

.headersection {
    /*border: 1px red solid;*/
    padding: 30px 120px 30px 120px;
    text-align: left;
}

.flexcontainer {
    text-align: left;
    margin: 0px 0px 0px 120px;
    /*border: 1px red solid;*/
}
</style>