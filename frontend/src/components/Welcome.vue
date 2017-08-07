<template>
    <Carousel id="carousel" height="auto" v-model="page" trigger="click" arrow="never" :height="this.height">
        <Carousel-item :height="this.height">
            <div class="demo-carousel" id="carousel1">
                <login></login>
            </div>
        </Carousel-item>
        <Carousel-item>
            <div class="demo-carousel" id="carousel2">
                <Row>
                    <Col span="1" offset="0">
                        <Button type="text" class="top-link" @click="goLeft()" id="top-go-left"><Icon type="reply"></Icon> Login</Button>
                    </Col>
                    <Col span="1" offset="22">
                        <Button type="text" class="top-link" @click="goRight()" id="top-go-right">Signup <Icon type="forward"></Icon></Button>
                    </Col>
                </Row>
                <div id="welcome"><img src="../assets/welcome.gif"></div>
                <Button type="text" class="link" @click="goLeft()" id="go-left"><Icon type="reply"></Icon> Login</Button>
                <Button type="text" class="link" @click="goRight()" id="go-right">Signup <Icon type="forward"></Icon></Button>
            </div>
            </Carousel-item>
        <Carousel-item>
            <div class="demo-carousel" id="carousel3">
                <signup></signup>
            </div>
        </Carousel-item>
    </Carousel>
</template>

<script>

import Login from './Login'
import Signup from './Signup'
import { mapGetters, mapMutations } from 'vuex'

export default {
    components: {
        Login,
        Signup
    },
    data() {
        return {
            height: document.documentElement.clientHeight,
        }
    },
    computed:{
        ...mapGetters({
            page: 'getPage'
        }),
    },
    methods:{
        ...mapMutations({
            goLeft: 'goLeft',
            goRight: 'goRight'
        }),
    }
}
</script>

<style scoped>
.demo-carousel {
    background-repeat: no-repeat;
    background-size: 100% 100%; 
    height: 100%;
}

#carousel1 {
    background-image: url(../assets/bg3.jpg);
}

#carousel2 {
    background-image: url(../assets/bg2.jpg);
    color: white !important;
}

#carousel3 {
    background-image: url(../assets/bg1.jpg);
}

#welcome {
    padding-top: calc(25% - 100px - 20px);
}

.link {
    padding-top: 12%;
    color: white;
    font-size: 30px;
    animation: 2s opacity2 0s infinite;
    -webkit-animation: 2s opacity2 0s infinite;
    -moz-animation: 2s opacity2 0s infinite;
}

.link:hover {
    color: rgb(235, 235, 235);
    font-size: 32px;
    color: gray;
}

@keyframes opacity2 {
    0%{opacity:0}
    50%{opacity:.8;}
    100%{opacity:0;}
}

@-webkit-keyframes opacity2 {
    0%{opacity:0}
    50%{opacity:.8;}
    100%{opacity:0;}
}

@-moz-keyframes opacity2 {
    0%{opacity:0}
    50%{opacity:.8;}
    100%{opacity:0;}
}

.top-link {
    color: rgba(255, 255, 255, 0.3);
    font-size: 20px;
}

.top-link:hover {
    color: rgb(255, 255, 255);
    font-size: 22px;
    padding-bottom: 0px;
}

#top-go-left {
    float: left;
}

#top-go-right {
    float: right;
}
</style>
