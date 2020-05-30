<template>
    <div>
        <div class="header_text">知识图谱系统</div>
<!--        <el-container>-->
        <div class="container">
            <div class = 'left'>
<!--                上传文本的文本框和按钮-->
                <div class="inputText">
                    <div class="textUpLoader">
<!--                        文本框的参数直接在这里面调-->
                        <el-input clearable
                                  type="textarea"
                                  class="textarea"
                                  style="left:5%; top:20%; width: 73%"
                                  :rows="10"
                                  placeholder="请输入内容"
                                  v-model="textarea">
                        </el-input>
                    </div>
                    <div class="textExtract">
                        <div class="extractButton">
                            <el-button class="buttons" type="primary" round=true @click="begin_upload">开始抽取
                                <i class="el-icon-caret-right el-icon--right"></i>
                            </el-button>
                        </div>
                        <div class="backButton" >
                            <el-button class="buttons" type="primary" round=true @click="return_home">返回
                                <i class="el-icon-caret-right el-icon--right"></i>
                            </el-button>
                        </div>
                    </div>
                </div>
<!--                现有知识图谱放置在这个区域-->
                <div class="temp_Graph">

                </div>
            </div>

            <div class="right">
<!--                将抽取出的实体信息放置在这个位置-->
                <div class="table_area">
                    <el-table stripe=true
                              :data="tableData"
                              height="100%"
                              border
                              style="width: 95%;">
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
                                <el-button @click="handleClick(scope.row)" type="text" size="small">预览</el-button>
                                <!--                                <el-button type="text" size="small" @click="handleEdit(scope.$index,scope.row)">编辑</el-button>-->
                                <el-button type="text" size="small" @click="deleteRow(scope.$index, tableData)">保存</el-button>
                                <el-button type="text" size="small" @click="deleteRow(scope.$index, tableData)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
<!--                这里放预览的图-->
                <div class="newGraph">

                </div>
            </div>
<!--                最初的节点信息，我这边先注释掉，如果有需要再取消注释即可-->
<!--                <div class="buttons">-->
<!--&lt;!&ndash;                    //发送数据&ndash;&gt;-->
<!--                    <el-button type="primary" round=true @click="begin_upload" >确认上传-->
<!--                        <i class="el-icon-upload el-icon&#45;&#45;right"></i>-->
<!--                    </el-button>-->
<!--                </div>-->
<!--                <div class="buttons">-->
<!--                    <el-button type="primary" round=true @click="extract">开始抽取-->
<!--                        <i class="el-icon-caret-right el-icon&#45;&#45;right"></i>-->
<!--                    </el-button>-->
<!--                </div>-->
<!--                <div class="buttons" style="left: auto">-->
<!--                    <el-button type="primary" round=true @click="return_home">返回-->
<!--                        <i class="el-icon-caret-right el-icon&#45;&#45;right"></i>-->
<!--                    </el-button>-->
<!--                </div>-->

        </div>
    </div>
<!--        </el-container>-->
<!--    </el-container>-->
</template>

<script>
    export default {
        data() {
            return {
                textarea: '',
                tid:'',
                extractNode:'',
                extractTeam:'',
                tableData: []
            }
        },
        mounted() {
            this.getAllTexts()
        },
        methods: {
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
            extract:function(){
                this.$axios({
                    method:'get',
                    url:'http://10.24.82.10:8088/showExtractNode/' + this.tid,

                }).then(res => {
                    if(res.errno==-1){
                        this.$message("文本有问题")
                    }
                    else{
                        this.extractNode = res.data.data.extractNode
                        this.extractTeam = res.data.data.extractTeam
                        console.log(res)
                        if (this.extractTeam)
                            this.$message('抽取信息：球员：' + this.extractNode + ';   球队: ' + this.extractTeam)
                        else {
                            this.$message('抽取失败')
                        }
                    }
                })
            },

            begin_upload:function(){
                this.$axios({
                    method:'post',
                    url:'http://10.24.82.10:8088/uploadText',
                    data:{
                        content:this.textarea
                    }
                }).then(res => {
                    this.tid = res.data.data.id
                    console.log(res.data)
                    if (!res.errno){
                        this.$message('信息上传成功！正在抽取实体信息');
                        this.extract()
                    }
                    else{
                        this.$message('上传失败！');
                    }
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
    .header_text{
        font-family: "PingFang SC";
        font-size: 30px;
        letter-spacing: 6px;
        color: #ffffff;
        height: 15%;
        background-color: #15161F;
    }
    .inputText{
        height:45%;
        /*background-color: #ff7f0e;*/
    }
    .container {
        display: table;
        width: 100%;
        /*height: 100%;*/
        /*background-color: #15161F;*/
    }

    .container .left {
        width: 45%;
        height: 100%;
        position:absolute;
        background-color: #15161F;
    }

    .container .right {
        height:100%;
        position:absolute;
        left: 45%;
        width: 55%;
        /*right: 3%;*/
        background-color: #15161F;
    }
    .container .right .table_area{
        width: 100%;
        height: 40%;
        position: absolute;
        top:5%;
        right: 3%;
        background-color: #15161F;
    }
    .container .right .newGraph{
        width: 100%;
        height: 55%;
        position: absolute;
        top: 45%;
        background-color: aqua;
    }
    .el-main {
        /*position: absolute;*/
        height: 100%;
        background-color: #15161F;
        color: #333;
        text-align: center;
        line-height: 160px;
    }
    .buttons {
        /*background-color: #15161F;*/
        /*top : 5%;*/
        /*height: 200px;*/
        /*position: relative;*/
        position: absolute;
        top: 40%;
        left: 0%;
        bottom: 40%;
        color: #fff;
        background-color: #303252;
        border-color: #9593A7;
        border-width: 2px;

    }
    .el-button {
        /*position: absolute;*/
        /*top: 40%;*/
        /*left: 0%;*/
        /*bottom: 40%;*/
        /*color: #fff;*/
        /*background-color: #303252;*/
        /*border-color: #9593A7;*/
        /*border-width: 2px;*/
    }
    .temp_Graph{
        /*float: right;*/
        position: relative;
        background-color: #ff7f0e;
        height: 55%;
        width: 100%;
    }
    .inputText .textExtract .extractButton{
        position: absolute;
        left: 30%;
        top:5%;
        width: 50%;
        right:24%;
        height: 200px;
    }
    .inputText .textExtract .backButton{
        position: absolute;
        left: 30%;
        top:35%;
        right:22%;
        width: 50%;
        height: 200px;
    }
    .textarea{
        position: absolute;
        top: 10%;
        left: 10%;
        /*background-color: pink;*/
        height: 50%;
        width: 100%;
        background-color: #ff7f0e;
    }
    .inputText .textUpLoader{
        float: left;
        position: absolute;
        left: 5%;
        width: 70%;
        height: 50%;
        background-color: #15161F;
    }
    .inputText .textExtract{
        float: left;
        position: absolute;
        left: 60%;
        width: 30%;
        height: 50%;
        background-color: #15161F;
    }
    /*.graph_temp{*/
    /*    position: relative;*/
    /*    float: bottom;*/
    /*    height: 50%;*/
    /*    background-color: aqua;*/
    /*}*/

    .el-header, .el-footer {
        background-color: #15161F;
        text-align: center;
        line-height: 60px;
    }

    .el-aside {
        position: relative;
        background-color: #15161F;
        color: #333;
        text-align: center;
        line-height: 200px;
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
</style>