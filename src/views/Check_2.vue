<template>
    <el-container style="height : 100%">
        <el-header height="8%" class="header_text">
            知识图谱展示
        </el-header>
        <el-container>
            <el-aside width="10%">

            </el-aside>
<!--            数据审核表格区域-->
            <el-col :span="17" class="table_cell">
                <div class="table_header">
                    <h1 class="tablehead">待审核的节点共{{Node_lenth}}条</h1>
                </div>
                <div class="main_table">
                    <el-table stripe=true
                            :data="tableData"
                                height="500px"
                                border
                                style="width: 100%;">
                        <el-table-column
                                prop="id"
                                label="序号"
                                width="120"
                                align="center">
                        </el-table-column>
                        <el-table-column
                                prop="extractNode"
                                label="球员"
                                width="120"
                                align="center">
                        </el-table-column>
                        <el-table-column
                                prop="extractTeam"
                                label="球队"
                                width="120"
                                align="center">
                        </el-table-column>
                        <el-table-column
                                prop="content"
                                label="转会内容"
                                align="center">
                        </el-table-column>
                        <el-table-column
                                fixed="right"
                                label="操作"
                                width="180"
                                align="center">
                            <template slot-scope="scope">
                                <el-button @click="handleClick(scope.row)" type="text" size="small">添加</el-button>
<!--                                <el-button type="text" size="small" @click="handleEdit(scope.$index,scope.row)">编辑</el-button>-->
                                <el-button type="text" size="small" @click="deleteRow(scope.$index, tableData)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </el-col>
            <el-col :span="7" class="right-side" >
                <!-- 基本功能按钮区域-->
                <div class="buttons">
<!--                    <el-button type="primary" round=true @click="insert_nodes" class="el-button–insert">插入-->
<!--                        <i class="el-icon-upload el-icon&#45;&#45;right"></i>-->
<!--                    </el-button>-->
<!--                    <el-button type="primary" round=true @click="Skip" class="el-button-skip">跳过-->
<!--                        <i class="el-icon-user el-icon&#45;&#45;right"></i>-->
<!--                    </el-button>-->
                    <el-button type="primary" round=true  @click="Give_up" class="el-button–save">保存
                        <i class="el-icon-coin el-icon--right"></i>
                    </el-button>
                    <el-button type="primary" round=true  @click="Back_to_lastpage" class="back_to_lastpage">返回上一页
                        <i class="el-icon-position el-icon--right"></i>
                    </el-button>
                    <el-button type="primary" round=true  @click="Back_to_TextUpload" class="back_to_textupload">返回文本上传界面
                        <i class="el-icon-s-order el-icon--right"></i>
                    </el-button>
                    <el-button type="primary" round=true  @click="Back_to_homepage" class="back_to_homepage">返回首页
                        <i class="el-icon-s-promotion el-icon--right"></i>
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
    .tablehead{
        float: left;
        color: #ffffff;
    }
    .table_header{
        background-color: #15161F;
        float: right;
        width: 80%;
        height: 10%;
    }
    /*表格的主体区域*/
    .main_table{
        background-color: #15161F;
        float: right;
        width: 80%;
        height: 60%;
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
    .el-button–save {
        position: absolute;
        top: 28%;
        left: 22%;
        color: #fff;
        background-color: #303252;
        border-color: #9593A7;
        border-width: 2px;
    }
    /*返回上一页按钮设置*/
    .back_to_lastpage {
        position: absolute;
        top: 43%;
        left: 20%;
        color: #fff;
        background-color: #303252;
        border-color: #9593A7;
        border-width: 2px;
    }
    /*返回首页按钮设置*/
    .back_to_homepage {
        position: absolute;
        top: 73%;
        left: 20%;
        color: #fff;
        background-color: #303252;
        border-color: #9593A7;
        border-width: 2px;
    }
    .back_to_textupload{
        position: absolute;
        top: 58%;
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
                Node_lenth: 0, // default = 0
                tableData: []
            // {
            //     id:'1',
            //         extractNode: '卡卡',
            //     extractTeam: '米兰',
            //     content: '卡卡转会米兰',
            // },
        }
        },
        mounted() {
            this.getAllTexts()
        },
        methods: {
            // 删除行
            deleteRow(index, rows) {
                console.log(rows[index].extractNode);
                console.log(rows[index].extractTeam);
                rows.splice(index, 1);
                this.Node_lenth-=1;
            },
            //获取所有未审核的节点
            getAllTexts:function(){
                var _this = this
                _this.$axios.get("http://10.24.82.10:8088/allText").then(response =>{
                    var jsonObj = JSON.parse(JSON.stringify(response.data.data));
                    console.log(jsonObj)
                    this.tableData = jsonObj
                    _this.Node_lenth = _this.tableData.length
                },response=>{
                    console.log("error")
                })
            },
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
            },
            //跳回文本审核界面
            Back_to_TextUpload:function () {
                this.$router.push("/TextUpload")
                location.reload()
            }
        }
    }
</script>

<style scoped>

</style>
