<template>
  <li class="recorditem">
    <img class="record-preview" src="../assets/v1.png"></img>
    <div class="property">
        <h4>"夏天为什么这么热"</h4>
        <span>
            <div class="teacher-name">
                <span>主讲教师：Mr White</span>
            </div>
            <div class="time" style="float:right;">
                <div>
                    <Icon type="clock"></Icon>
                    2017-08-03  14：16  
                </div>
            </div>
        </span>
    </div>
  </li>
</template>

<script>
export default {
  props: {
    recordItem: Object,
    index: Number
  }
}
</script>

<style scoped>
.recorditem {
  height: 220px;
  width: 200px;
  border: none;
}
.recorditem:hover{
  cursor: pointer;
  border: 3px;
  border-color: #A9A9A9;
  transform: scale(1.1,1.1);
}
.record-preview {
  height:128px;
  width: 200px;
}
.teacher-name{
  color:#A9A9A9;
}
.time{
  color:#A9A9A9;
}
.property{
  background-color: white;
  height: 54px;
}
h4:hover {
  color: blue;
}
</style>
