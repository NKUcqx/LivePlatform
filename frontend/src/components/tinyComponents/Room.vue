<template>
  <li class="vedioitem">
    <img class="video-preview" :src="'./files/' + item.thumbnail_path"></img>
    <div class="property">
        <h4>{{'./files/' + item.thumbnail_path }}</h4>
        <span>
            <div class="teacher-name">
                <span>主讲教师: {{ item.creater_id }}</span>
            </div>
            <div class="viewers-count">
                <div>
                    在线人数
                    <Icon type="person"></Icon>
                    {{ item.audience_amount }}
                </div>
            </div>
        </span>
    </div>
  </li>
</template>

<script>

export default {
  props: {
    item: Object,
  }
}

</script>

<style scoped>
.vedioitem {
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
}
</style>
