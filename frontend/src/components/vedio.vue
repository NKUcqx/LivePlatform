<template>
  <li class="vedioitem">
    <img class="video-preview" src="../assets/v1.png"></img>
    <div class="property">
        <h4>{{ vedioItem.room }}</h4>
        <span>
            <div class="teacher-name">
                <span>主讲教师：Mr White</span>
            </div>
            <div class="viewers-count">
                <div>
                    在线人数
                    <Icon type="person"></Icon>
                    45667
                </div>
            </div>
        </span>
    </div>
  </li>
</template>

<script>
export default {
  props: {
    vedioItem: Object,
    index: Number
  }
}
</script>

<style scoped>
.vedioitem {
  height: 220px;
  width: 200px;
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
  width: 200px;
}
.teacher-name{
  color:#A9A9A9;
}
.viewers-count{
  color:#A9A9A9;
}
.property{
  background-color: white;
}
h4:hover {
  color: blue;
}
</style>
