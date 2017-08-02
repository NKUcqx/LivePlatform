<template>
  	<!--div>
  	<p>Welcome To Our Demo</p>
	<router-link to="/hello" class="link">Go to Hello&nbsp;&nbsp;&nbsp;</router-link>
	<router-link to="/signup" class="link">Go to Signup</router-link>
	<div-->
	<Carousel id="carousel" :height="auto" v-model="page" trigger="click" arrow="never" :height="this.height">
        <Carousel-item :height="this.height">
            <div class="demo-carousel" id="carousel1">
            	<login></login>
            </div>
        </Carousel-item>
        <Carousel-item>
            <div class="demo-carousel" id="carousel2">
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
	padding-top: calc(25% - 100px);
}

.link {
    padding-top: 30px;
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

</style>
