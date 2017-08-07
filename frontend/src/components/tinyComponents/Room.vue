<template>
<div id="roomitem">
    <div id="scene">
        <div id="gray">
        <div id="icon">
        </div>
        </div>
    </div>
    <div id="footer">
        <span id="title">{{ item.name }}</span>
        <span id="teacher"><Icon type="person"></Icon> {{ item.creater }}</span>
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

export default {
    props: {
        item: Object,
    },
    mounted(){
        console.log(this.item)
    }
}

</script>

<style scoped>
#roomitem {
    display: inline-block;
    width: 240px;
    margin: 10px 15px 10px 15px;
    -moz-box-shadow:0px 0px 5px #878787;
    -webkit-box-shadow:0px 0px 5px #878787;
    box-shadow:0px 0px 5px #878787;
}

#scene {
    background-repeat: no-repeat;
    background-size: 100% 100%;
    background-image: url(../../assets/v1.jpg);
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


/*.vedioitem {
  height: 200px;
  width: 180px;
  border: none;
}
.vedioitem:hover{
  cursor: pointer;
  border: 3px;
  border-color: #A9A9A9;
  transform: scale(1.1,1.1);
}
.video-preview {
  height:128px;
  width: 180px;
}
.teacher-name{
  color:#A9A9A9;
}
.viewers-count{
  color:#A9A9A9;
}
.property{
  background-color: rgba(255,255,255);
}
h4:hover {
  color: blue;
}*/
</style>
