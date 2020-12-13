<template>
  <div id="app">
    <el-menu
        :default-active="activeIndex"
        class="el-menu-demo"
        mode="horizontal"
        @select="handleSelect"
        background-color="#545c64"
        text-color="#fff"
        active-text-color="#ffd04b"
        router
    >
      <el-menu-item index="/" class="item1">初始化</el-menu-item>
      <el-menu-item index="/excel_upload" class="item2">Excel上传</el-menu-item>
      <el-menu-item index="/2" class="item2">xx</el-menu-item>
      <el-menu-item index="/3" class="item2">xx</el-menu-item>
      <el-menu-item index="/4" class="item2">xx</el-menu-item>
    </el-menu>
      <router-view></router-view>
  </div>
</template>


<!-- 查询框-->
<script>
export default {
  name: "App",
  data(){
    return{
      activeIndex: '/',

    }
  },
  methods:{
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
    }
  }
}
</script>

<style>
#app {
    font-family: Helvetica, sans-serif;
    text-align: center;
    /*height: 100%;*/
}
html{
  margin: 0px;
  background-color: #0b2838;
}
body{
  margin:0px;
  height: auto;
}
#app .el-menu-demo{
  border-bottom: none;
}
.el-menu-demo{
  position: fixed;
  width: 100%;
  z-index: 100;
}
#app .el-menu-demo .item1{
  margin-left: 100px;
}
#app .el-menu-demo .item2{
  margin-left: 30px;
}
</style>