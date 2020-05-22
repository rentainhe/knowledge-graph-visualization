<template>
    <el-container>
        <el-header class="el-header">人工审核</el-header>
        <el-container class="el-container">
            <el-main class="el-main">
<!--                <el-col class="col">-->

                    <el-card class="box-card">
                        <div class="clearfix">
                            <span>审核</span>
<!--                            <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>-->
                        </div>
                        <div class="text_item">

                        </div>
                    </el-card>

<!--                </el-col>-->
            </el-main>
            <el-aside class="el-aside">
                <div class="buttons">
<!--                    //发送数据-->
                    <el-button @click="begin_upload" round=true type="primary">添加
                        <i class="el-icon-upload el-icon--right"></i>
                    </el-button>
                </div>
                <div class="buttons">
                    <el-button @click="extract" round=true type="primary">跳过
                        <i class="el-icon-caret-right el-icon--right"></i>
                    </el-button>
                </div>
                <div class="buttons">
                    <el-button @click="return_home" round=true type="primary">返回
                        <i class="el-icon-caret-right el-icon--right"></i>
                    </el-button>
                </div>
            </el-aside>
        </el-container>
    </el-container>
</template>

<script>
    export default {
        data() {
            return {
                textarea: ''
            }
        },
        methods: {
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
            }
        }
    }
</script>

<style>

    .el-header, .el-footer {
        background-color: #B3C0D1;
        color: #333;
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
    .buttons {
        background-color: #15161F;
        /*top : 5%;*/
        height: 200px;
        position: relative;
    }

    .el-button {
        position: absolute;
        top: 40%;
        left: 25%;
        bottom: 40%;
        color: #fff;
        background-color: #303252;
        border-color: #9593A7;
        border-width: 2px;
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