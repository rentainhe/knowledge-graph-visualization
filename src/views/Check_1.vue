<template>
    <el-container>
        <el-header class="header_text">知识图谱系统</el-header>
        <el-container class="el-container">
            <el-main class="el-main">
                <div class="divBox">
                    <div class="left"></div>
                    <div class="right"></div>
                    <div class="center">
                        <div class="up">
                            <p class="P-position">目前待审核节点共{{Node_lenth}}条！</p>
                        </div>
                        <div class="down">
                            <el-button type="primary" round=true @click="begin_to_check" class="el-button–begin_check">开始审核
                                <i class="el-icon-caret-right el-icon--right"></i>
                            </el-button>

                            <el-button type="primary" round=true @click="excel_upload" class="el-button–excel_upload">Excel上传
                              <i class="el-icon-caret-right el-icon--right"></i>
                            </el-button>

                            <el-button type="primary" round=true  @click="return_home" class="el-button–go_back">返回
                                <i class="el-icon-position el-icon--right"></i>
                            </el-button>
                        </div>
                    </div>
                </div>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
    /**
     * 展示待审核信息界面
     * @module Check_1
     */
    export default {
        name:"Check_1",
        data() {
            return {
                textarea: '',
                Node_lenth: 0,
                tableData: []
            }
        },
        mounted() {
            this.getAllUnchecked()
        },
        methods: {
            /**
             * 页面打开时执行
             * 获取所有未审核的节点关系
             * @function getAllTexts
             */
            getAllUnchecked:function() {
              this.$axios({
                method:'get',
                url:'http://10.24.82.10:8088/getAllUncheckedRelation'
              }).then(res=>{
                console.log("待审核关系数目",res.data.data)
                this.Node_lenth = res.data.data.length
              })
            },
            //点击回主界面

          /**
             * 返回主页面
             * @function return_home
             */
            return_home: function () {
                this.$router.push("/")
                location.reload()
            },

            /**
             * 跳转到审核界面
             * @function begin_to_check
             */
            begin_to_check: function () {
                this.$router.push("/Check_2")
                location.reload()
            },

          /**
           * 跳转到Excel上传界面
           */
            excel_upload: function () {
              this.$router.push("/excel_upload")
              location.reload()
            }

        }
    }
</script>

<style>
    .P-position{
        position: absolute;
        top:30%;
        left: 38%;
        font-family: "PingFang SC";
        font-size: 30px;
        letter-spacing: 5px;
        color: #ffffff;
    }
    .divBox{
        height: 100%;
    }
    .left{
        float: left;
        background-color: #15161F;
        width: 10%;
        height: 100%;
    }
    .center{
        margin: 0 200px;
        height: 100%;
        background-color: #15161F;
    }
    .center .up{
        height: 70%;
        background-color: #15161F;
        text-align: center;
    }
    .right{
        float: right;
        width: 10%;
        height: 100%;
        background-color: #15161F;
    }
    .header_text{
        font-family: "PingFang SC";
        font-size: 30px;
        letter-spacing: 5px;
        color: #ffffff;
    }
    .el-header, .el-footer {
        background-color: #15161F;
        text-align: center;
        line-height: 60px;
        height: 10%;
    }

    .el-aside {
        background-color: #15161F;
        color: #333;
        text-align: center;
        line-height: 200px;
        height: 100%;
    }

    .el-main {
        background-color: #15161F;
        color: #333;
        text-align: center;
        line-height: 160px;
        height: 100%;
    }
    /* 开始审核的相关设置 */
    .el-button–begin_check{
        color: #fff;
        position: absolute;
        left: 46%;
        bottom: 30%;
        background-color: #303252;
        border-color: #9593A7;
        border-width: 2px;
    }

    .el-button–excel_upload{
      color: #fff;
      position: absolute;
      left: 30%;
      bottom: 30%;
      background-color: #303252;
      border-color: #9593A7;
      border-width: 2px;
    }

    /*返回按钮设置*/
    .el-button–go_back {
      color: #fff;
      background-color: #303252;
      border-color: #9593A7;
      border-width: 2px;
      position: absolute;
      left: 60%;
      bottom: 30%;
    }
    /*保存按钮样式
    .el-button-save {
        color: #fff;
        background-color: #303252;
        border-color: #9593A7;
        border-width: 2px;
        position: absolute;
        left: 46%;
        bottom: 30%;
    }*/


    .el-container {
        /*margin-bottom: 40px;*/
        height: 100%;
    }

    .el-container:nth-child(5) .el-aside,
    .el-container:nth-child(6) .el-aside {
        line-height: 260px;
    }

    .el-container:nth-child(7) .el-aside {
        line-height: 320px;
    }
    .text {
        font-size: 14px;
    }

    .item {
        margin-bottom: 18px;
    }

    .clearfix:before,
    .clearfix:after {
        display: table;
        content: "";
    }
    .clearfix:after {
        clear: both;
        height: 20px;
    }
    .text_item{
        height: 20px;
    }
    .clearfix{
        height: 20px;
    }
    .box-card {
        position: relative;
        width: 480px;
        height: 50%;
    }
</style>