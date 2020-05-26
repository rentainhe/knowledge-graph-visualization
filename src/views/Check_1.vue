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
<!--                            <el-button type="primary" round=true @click="user_Check" class="el-button-save">保存-->
<!--                                <i class="el-icon-success el-icon&#45;&#45;right"></i>-->
<!--                            </el-button>-->
                            <el-button type="primary" round=true  @click="return_home" class="el-button–go_back">返回
                                <i class="el-icon-position el-icon--right"></i>
                            </el-button><!--              <el-row class="col1"></el-row>-->
                        </div>
                    </div>
                </div>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
    export default {
        data() {
            return {
                textarea: '',
                Node_lenth: 0,
                tableData: []
            }
        },
        mounted() {
            this.getAllTexts()
        },
        methods: {
            getAllTexts:function() {
                var _this = this
                _this.$axios.get("http://10.24.82.10:8088/allText").then(response => {
                    var jsonObj = JSON.parse(JSON.stringify(response.data.data));
                    // console.log(jsonObj)
                    this.tableData = jsonObj
                    _this.Node_lenth = _this.tableData.length
                }, response => {
                    console.log("error")
                })
            },
            //上传成功提示
            successMessage() {
                this.$message('上传成功')
            },
            errorMessage() {
                this.$message('上传失败')
            },
            //上传文件
            begin_upload: function () {
                this.$axios({
                    method: 'post',
                    url: 'http://10.24.82.10:8088/uploadText',
                    data: {
                        content: this.textarea
                    }
                }).then(res => {
                    if (!res.data.ennro) {
                        this.successMessage()
                    } else {
                        this.errorMessage()
                    }
                    console.log(res)
                })
            },
            //点击回主界面
            return_home: function () {
                this.$router.push("/Home")
                location.reload()
            },
            //点击开始审核
            begin_to_check: function () {
                this.$router.push("/Check_2")
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
        left: 35%;
        bottom: 30%;
        background-color: #303252;
        border-color: #9593A7;
        border-width: 2px;
    }
    /*保存按钮样式*/
    .el-button-save {
        color: #fff;
        background-color: #303252;
        border-color: #9593A7;
        border-width: 2px;
        position: absolute;
        left: 46%;
        bottom: 30%;
    }
    /*返回按钮设置*/
    .el-button–go_back {
        color: #fff;
        background-color: #303252;
        border-color: #9593A7;
        border-width: 2px;
        position: absolute;
        right: 35%;
        bottom: 30%;
    }

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