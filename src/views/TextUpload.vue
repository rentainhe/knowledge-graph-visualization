<template>
    <el-container>
        <el-header class="header_text">知识图谱系统</el-header>
        <el-container>
            <el-aside width="50%">
                <div class="textarea">
                    <div class="textUpLoader">
                        <el-input clearable
                                  type="textarea"
                                  class="textarea"
                                  style="width: 100%"
                                  :rows="10"
                                  placeholder="请输入内容"
                                  v-model="textarea">
                        </el-input>
                    </div>
                    <div class="textExtract">
                        <div class="extractButton">
                            <el-button type="primary" round=true @click="begin_upload">开始抽取
                                <i class="el-icon-caret-right el-icon--right"></i>
                            </el-button>
                        </div>
                        <div class="backButton" >
                            <el-button type="primary" round=true @click="return_home">返回
                                <i class="el-icon-caret-right el-icon--right"></i>
                            </el-button>
                        </div>
                    </div>
                </div>
<!--                现有知识图谱-->
                <div class="graph_temp">

                </div>
            </el-aside>
            <el-main>
<!--                最初的节点信息，我这边先注释掉，如果有需要再取消注释即可-->
                <div class="buttons">
<!--                    //发送数据-->
                    <el-button type="primary" round=true @click="begin_upload" >确认上传
                        <i class="el-icon-upload el-icon--right"></i>
                    </el-button>
                </div>
                <div class="buttons">
                    <el-button type="primary" round=true @click="extract">开始抽取
                        <i class="el-icon-caret-right el-icon--right"></i>
                    </el-button>
                </div>
                <div class="buttons" style="left: auto">
                    <el-button type="primary" round=true @click="return_home">返回
                        <i class="el-icon-caret-right el-icon--right"></i>
                    </el-button>
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
                tid:'',
                extractNode:'',
                extractTeam:'',
            }
        },
        methods: {
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
        height: 200px;
        position: relative;
    }
    .el-button {
        position: absolute;
        top: 40%;
        left: 0%;
        bottom: 40%;
        color: #fff;
        background-color: #303252;
        border-color: #9593A7;
        border-width: 2px;
    }
    .table_temp{
        float: right;
        position: relative;
        background-color: #ff7f0e;
        height: 50%;
        width: 100%;
    }
    .textarea .textExtract .extractButton{
        position: absolute;
        top:0%;
        right:24%;
        height: 200px;
    }
    .textarea .textExtract .backButton{
        position: absolute;
        top:30%;
        right:22%;
        height: 200px;
    }
    .textarea{
        float: top;
        /*float: left;*/
        position: relative;
        background-color: #15161F;
        height: 50%;
        width: 100%;
        /*background-color: #ff7f0e;*/
    }
    .textarea .textUpLoader{
        float: left;
        position: relative;
        left: 5%;
        width: 65%;
        height: 100%;
        background-color: #15161F;
    }
    .textarea .textExtract{
        float: right;
        /*position: relative;*/
        width: 30%;
        height: 100%;
        background-color: #15161F;
    }
    /*.graph_temp{*/
    /*    position: relative;*/
    /*    float: bottom;*/
    /*    height: 50%;*/
    /*    background-color: aqua;*/
    /*}*/
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