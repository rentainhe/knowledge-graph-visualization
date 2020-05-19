<template>
  <div id="app">
    <el-container style="height : 100%">
      <el-header height="48px">
          知识图谱展示
      </el-header>
      <el-container>
        <el-aside width="200px">
          <el-container>
          <el-form :inline="true" :model="formInline" class="text_search">
            <el-form-item>
              <el-input v-model="formInline.user" placeholder="查询" clearable=1></el-input>
            </el-form-item>
            <el-form-item>
              <el-button icon="el-icon-upload" type="primary" @click="onSubmit">节点查询</el-button>
            </el-form-item>
          </el-form>
          <el-switch
                  v-model="value1" active-text="Text" inactive-text="Nodes">
          </el-switch>
          </el-container>
        </el-aside>
          <!--主要区域-->
          <el-main>
            <!--图谱放置的主要区域-->
            <el-col :span="18" class="graph"></el-col>
            <el-col :span="5" :offset="1" class="right-side">
                <!-- 节点信息区域-->
                <el-col class="article"></el-col>
                <!-- 基本功能按钮区域-->
                <el-button type="primary" round=1 @click="Submit_text" class="el-button–upload">文本导入</el-button>
                <el-button type="primary" round=1 @click="user_Check" class="el-button-check">人工审核
                    <i class="el-icon-user el-icon--right"></i>
                </el-button>
                <el-button type="primary" round=1  @click="put_into_Database" class="el-button–mysql">数据库导入
                    <i class="el-icon-coin el-icon--right"></i>
                </el-button>
              <el-row class="col1"></el-row>
            </el-col>
          </el-main>

        </el-container>

      </el-container>
  </div>
</template>

<style>
    .text_search{
        position: absolute;
        top:60px;
    }
    .el-button–upload{
        position: absolute;
        top:400px;
        left:90px;
        color: #fff;
        background-color: #303252;
        border-color: #9593A7;
        border-width: 2px;
    }
    .el-button-check{
        position: absolute;
        top:600px;
        left:90px;
        color: #fff;
        background-color: #303252;
        border-color: #9593A7;
        border-width: 2px;
    }
    .el-button–mysql{
        position: absolute;
        top:200px;
        left: 85px;
        color: #fff;
        background-color: #303252;
        border-color: #9593A7;
        border-width: 2px;
    }
  .el-header, .el-footer {
      background-color: #B3C0D1;
      color: #333;
      text-align: center;
      line-height: 60px;
  }

  .el-aside {
    background-color: #D3DCE6;
    color: #333;
    position:relative;
    text-align: center;
    line-height: 50px;
  }

  .el-main {
    background-color: #E9EEF3;
    color: #333;
    text-align: center;
    line-height: 160px;
  }

  body > .el-container {
    margin-bottom: 40px;
  }

  .el-container:nth-child(5) .el-aside,
  .el-container:nth-child(6) .el-aside {
    line-height: 260px;
  }

  .el-container:nth-child(7) .el-aside {
    line-height: 320px;
  }
  .el-col{
    height:640px;
  }
  .graph {
    background-color: teal;
  }
  .right-side {
    position: absolute;
    right:12px;
  }
  .article {
    background-color: thistle;
    height:55%;
  }
  .buttons{
    background-color: #15161F;
    height: 45%;
    position: relative;
  }
</style>

<!-- 查询框-->
<script>
  export default {
    data() {
      return {
          formInline: {
              user: '',
              region: ''
          },
          value1:true
      }
    },
    methods: {
      onSubmit() {
        console.log('节点搜索');
      },
      Submit_text(){
        console.log('文本导入')
      },
      user_Check(){
          console.log('人工审核')
      },
      put_into_Database(){
          console.log('导入数据库')
      }
    }
  }
</script>

<!--上传文件-->
<!--<script>-->
<!--  export default {-->
<!--    data() {-->
<!--      return {-->
<!--        fileList: [{name: 'food.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}, {name: 'food2.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}]-->
<!--      };-->
<!--    },-->
<!--    methods: {-->
<!--      handleRemove(file, fileList) {-->
<!--        console.log(file, fileList);-->
<!--      },-->
<!--      handlePreview(file) {-->
<!--        console.log(file);-->
<!--      },-->
<!--      handleExceed(files, fileList) {-->
<!--        this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);-->
<!--      },-->
<!--      beforeRemove(file, fileList) {-->
<!--        return this.$confirm(`确定移除 ${ file.name }？`);-->
<!--      }-->
<!--    }-->
<!--  }-->
<!--</script>-->
<style>
#app {
  font-family: Helvetica, sans-serif;
  text-align: center;
  height: 100%;
}
</style>
