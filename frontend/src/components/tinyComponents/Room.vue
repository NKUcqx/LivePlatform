<template>
<div id="roomitem" @click="enterRoom()">
    <div id="scene" :style="background">
        <div id="gray">
        <div id="icon">
        </div>
        </div>
    </div>
    <div id="footer">
        <span id="title">{{ item.name }}</span>
        <span id="teacher"><Icon type="person"></Icon> {{ item.creator_nickname }}</span>
        <span id="audiences" v-if="item.is_living">
            <Icon type="eye"></Icon>
            {{ item.audience_amount }}
        </span>
        <span id="endtime" v-else>
            <Icon type="clock"></Icon>
            {{ item.create_time }}
        </span>
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
/**
 *首页的房间组件
 *@class Room
 *@constructor
 */
export default {
    props: {
        item: Object
    },
    data () {
        return {
            background: {
                backgroundImage: ''
            }
        }
    },
    computed: {
        ...mapGetters({
            userid: 'getUserId'
        })
    },
    methods: {
        ...mapActions({
            checkEnter: 'checkEnter'
        }),
        ...mapMutations({
            setRoomInfo: 'setRoomInfo'
        }),
        /**
         *进入房间
         *@event enterRoom
         */
        enterRoom () {
            this.setRoomInfo(this.item)
            this.checkEnter({user_id: this.userid, room_id: this.item.id.toString()})
        }
    },
    mounted () {
        this.background.backgroundImage = 'url(' + this.item.thumbnail_path + ')'
        console.log(this.background.backgroundImage)
    },
    beforeUpdate () {
        this.background.backgroundImage = 'url(' + this.item.thumbnail_path + ')'
    }
}
</script>

<style scoped>
#roomitem {
    display: inline-block;
    width: 240px;
    margin: 15px 15px 15px 15px;
    -moz-box-shadow:0px 0px 5px #878787;
    -webkit-box-shadow:0px 0px 5px #878787;
    box-shadow:0px 0px 5px #878787;
}

#scene {
    background-repeat: no-repeat;
    background-size: 100% 100%;
    height: 150px;
}

#icon {
    height: 150px;
    background-repeat: no-repeat;
    background-position: center center;
    background-image: url(../../assets/live.png);
    display: none;
}

#gray {
    height: 150px;
    background-color: rgba(100,100,100,0.4);
    display: none;
}

#title {
    display: block;
    padding: 0px 6px;
    font-size: 15px;
    color: black;
    text-align: left;
}

#footer {
    height: 45px;
    background-color: white;
}

#teacher {
    padding: 0px 6px;
    float: left;
}

#endtime {
    display: block;
    padding: 0px 6px;
    float: right;
}

#audiences {
    padding: 0px 6px;
    float: right;
}

#roomitem:hover #icon {
    display: block;
}

#roomitem:hover #gray {
    display: block;
}

#roomitem:hover {
    cursor:pointer;
    -moz-box-shadow:2px 2px 5px #333333;
    -webkit-box-shadow:2px 2px 5px #333333; 
    box-shadow:2px 2px 5px #333333;
}

</style>
