<template>
    <div id="studio">
        <topbar id="topbar"></topbar>
        <div id="left-part" ref="leftPart">
            <div id="infobar">
                <img src="../assets/logo.png" id="teacher-avatar" alt="head-image" :width="img.size" :height="img.size" @click="avatarModal = true">
                <div id="studio-info">
                    <div id="title">
                        <h2 id="title-content">{{roomInfo.title}}</h2>
                        <Button id="switch-section" type="ghost" @click="switchSection()"><Icon type="arrow-swap"></Icon></Button>
                    </div>
                    <div id="footer">
                        <Tag type="border" color="yellow" id="roomid"><Icon type="home"></Icon> {{roomInfo.id}}</Tag>
                        <Tag type="border" color="red" id="vip"><Icon type="trophy"></Icon> vip</Tag>
                        <Tag type="border" color="green" id="audience"><Icon type="person-stalker"></Icon> {{roomInfo.audience}}</Tag>
                        <Tag type="border" color="blue" id="teacher"><Icon type="person"></Icon> {{roomInfo.teacher}}</Tag>
                    </div>
                </div>
            </div>
            <div id="main-section">
                <my-canvas :WIDTH="mainWIDTH" :HEIGHT="mainWIDTH * 0.65"></my-canvas>
            </div>
        </div>
        <div id="right-part" ref="rightPart">
            <div id="minor-section">
                <my-canvas :WIDTH="minorWIDTH" :HEIGHT="minorWIDTH * 0.65"></my-canvas>

            </div>
            <div id="chat-section">
                <img src="../../static/white.png" :width="minorWIDTH" :height="chatHeight">

            </div>      
        </div>
    </div>
</template>

<script>
import Topbar from './tinyComponents/Topbar'
import myCanvas from './tinyComponents/Canvas'
export default {
    components: {
        Topbar,
        myCanvas
    },
    watch: {
        /* WIDTH: function (val, oldVal) {
            let infoBarWidth = val/2
            let titleWidth = infoBarWidth * 0.8
            let charNum = Math.floor(titleWidth/26) - 4
            this.roomInfo.title = this.roomInfo.title.substr(0, charNum) + '...'
            console.log(singleCharWidth)
        } */
    },
    data () {
        return {
            mainWIDTH: 0,
            minorWIDTH: 0,
            chatHeight: 0,
            img: {
                size: 50
            },
            roomInfo: {
                id: 500,
                title: 'Welcome To Our World',
                teacher: 'gongyansongisgood',
                audience: 3000
            }
        }
    },
    computed: {
    },
    methods: {
    },
    mounted () {
        this.mainWIDTH = this.$refs.leftPart.getBoundingClientRect().width
        this.minorWIDTH = this.$refs.rightPart.getBoundingClientRect().width
        this.chatHeight = this.$refs.leftPart.getBoundingClientRect().width * 0.195 + 90
        window.addEventListener('resize', () => {
            this.mainWIDTH = this.$refs.leftPart.getBoundingClientRect().width
            this.minorWIDTH = this.$refs.rightPart.getBoundingClientRect().width
            this.chatHeight = this.$refs.leftPart.getBoundingClientRect().width * 0.195 + 90
        })
    }
}
</script>

<style scoped>
    #studio {
        width: 100%;
        min-width: 800px;
        text-align: left;
        background-color: rgb(239,239,239);
    }
    #topbar {
        min-width: 800px;
    }
    #left-part {
        margin: 20px 5% 20px 5%; 
        display: inline-block;
        width: 50%;
        min-width: 400px;
    }
    #infobar {
        width: 100%;
        height: 80px;
        border: 1px solid rgb(241,241,241);
    }
    #teacher-avatar {  
        padding: 0px;
        border: 2px solid rgba(180,230,180,0.7);
        background-color: rgb(210,210,210);
        border-radius: 50%;
        margin: 15px 10px 15px 10px;
    }
    #studio-info {
        display: inline-block;
        width: calc(100% - 50px - 30px);
        height: 80px;
    }
    #studio-info *{
       overflow: hidden;
    }
    #studio-info #title {
        width: 100%;
        height: 48px;
    }
    #studio-info #title #title-content{
        float: left;
        font-size: 26px;
        padding: 5px 0px 5px 30px;
        width: 85%;
        height: 48px;
    }
    #studio-info #footer {
        width: 100%;
        height: 32px;
    }
    #studio-info #switch-section {
        height: 30px;
        float: right;
        margin: 9px 5px 9px 5px;
    }
    #studio-info #teacher {
        height: 26px;
        float: right;
    }
    #studio-info #audience {
        height: 26px;
        float: right;
    }
    #studio-info #vip {
        float: left;
        height: 24px;
    }
    #studio-info #roomid {
        margin-left: 30px;
        float: left;
        height: 24px;
    }
    #main-section {
        margin: 30px 0px 0px 0px;
        width: 100%;
        height: 0;
        padding-bottom: 65%;
        background-color: white;
    }
    #right-part {
        margin: 20px 5% 20px 0%; 
        display: inline-block;
        width: 35%;
        min-width: 280px;
        float: right;
    }
    #infobar, #minor-section, #chat-section, #main-section {
        -moz-box-shadow:2px 2px 10px #A1A1A1;
        -webkit-box-shadow:2px 2px 10px #A1A1A1; 
        box-shadow: 2px 2px 10px #A1A1A1;
        background-color: white;
    }
    #chat-section {
        margin: 10px 0px 0px 0px;
    }
</style>
