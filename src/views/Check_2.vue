<template>
    <el-container style="height : 100%">
        <el-header height="8%" class="header_text">
            知识图谱展示
        </el-header>
        <el-container>
            <el-aside width="10%">

            </el-aside>
            <el-col :span="15" class="table_cell">
                <div class="main1"></div>
            </el-col>
            <el-col :span="7" class="right-side" >
                <!-- 基本功能按钮区域-->
                <div class="buttons">
                    <el-button type="primary" round=true @click="insert_nodes" class="el-button–insert">插入
                        <i class="el-icon-upload el-icon--right"></i>
                    </el-button>
                    <el-button type="primary" round=true @click="Skip" class="el-button-skip">跳过
                        <i class="el-icon-user el-icon--right"></i>
                    </el-button>
                    <el-button type="primary" round=true  @click="Give_up" class="el-button–give-up">放弃
                        <i class="el-icon-coin el-icon--right"></i>
                    </el-button>
                    <el-button type="primary" round=true  @click="Back_to_lastpage" class="back_to_lastpage">返回上一页
                        <i class="el-icon-coin el-icon--right"></i>
                    </el-button>
                    <el-button type="primary" round=true  @click="Back_to_homepage" class="back_to_homepage">返回首页
                        <i class="el-icon-coin el-icon--right"></i>
                    </el-button>
                </div>
            </el-col>
        </el-container>

    </el-container>
</template>

<style>
    .table_cell{
        background-color: #15161F;
    }
    .main1{
        background-color: #ff7f0e;
        float: right;
        width: 80%;
        height: 100%;
    }
    .header_text{
        font-family: "PingFang SC";
        font-size: 30px;
        letter-spacing: 5px;
        color: #ffffff;
    }
    .right-side {
        position: relative;
    }
    /* 按钮区域 */
    .buttons {
        background-color: #15161F;
        height: 100%;
        position: relative;
    }
    /* 插入按钮的相关设置 */
    .el-button–insert{
        position: absolute;
        top:15%;
        left:22%;
        color: #fff;
        background-color: #303252;
        border-color: #9593A7;
        border-width: 2px;
    }
    /*跳过按钮样式*/
    .el-button-skip {
        position: absolute;
        top: 30%;
        left:20%;

        color: #fff;
        background-color: #303252;
        border-color: #9593A7;
        border-width: 2px;
    }
    /*放弃按钮设置*/
    .el-button–give-up {
        position: absolute;
        top: 45%;
        left: 20%;
        color: #fff;
        background-color: #303252;
        border-color: #9593A7;
        border-width: 2px;
    }
    /*返回上一页按钮设置*/
    .back_to_lastpage {
        position: absolute;
        top: 60%;
        left: 20%;
        color: #fff;
        background-color: #303252;
        border-color: #9593A7;
        border-width: 2px;
    }
    /*返回首页按钮设置*/
    .back_to_homepage {
        position: absolute;
        top: 75%;
        left: 20%;
        color: #fff;
        background-color: #303252;
        border-color: #9593A7;
        border-width: 2px;
    }

    .el-header, .el-footer {
        background-color: #15161F;
        color: #ffffff;
        text-align: center;
        line-height: 60px;
    }

    .el-aside {
        background-color: #15161F;
        color: #333;
        position: relative;
        text-align: center;
        line-height: 50px;
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

    .el-col {
        /*height: 640px;*/
    }

    .personal_Information {
        background-color: #15161F;
        height: 55%;
    }


</style>

<!-- 查询框-->
<script>
    export default {
        data() {
            return {
                value : '0',
                formInline: {
                    user: '',
                    region: ''
                },
                value1: true,
                width: 800,
                height: 800,
            }
        },
        mounted() {
        },
        methods: {

            //上传文件界面
            insert_nodes:function(){
                console.log("这是插入节点")
            },
            Skip() {
                console.log('跳过');
            },
            Give_up(){
                console.log('这是放弃节点')
            },
            //跳转审核界面
            Back_to_lastpage:function(){
                this.$router.push("/Check_1")
            },
            Back_to_homepage:function () {
                this.$router.push("/Home")
            }
        }
    }
</script>

<style scoped>

</style>
