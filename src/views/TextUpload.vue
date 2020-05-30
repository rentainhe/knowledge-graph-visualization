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
                                  style="left:1%; top:10%; width: 80%"
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
            </div>

            <div class="right">
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
    .inputText{
        height: 50%;
    }
    .container {
        display: table;
        width: 100%;
    }

    .container .left {
        width: 50%;
        height: 100%;
        position:absolute;
        background-color: #15161F;
    }

    .container .right {
        height:100%;
        position:absolute;
        left: 50%;
        width: 50%;
        background-color: #15161F;
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
    .inputText .textExtract .extractButton{
        position: absolute;
        left: 40%;
        top:0%;
        width: 50%;
        right:24%;
        height: 200px;
    }
    .inputText .textExtract .backButton{
        position: absolute;
        left: 40%;
        top:30%;
        right:22%;
        width: 50%;
        height: 200px;
    }
    /*.textarea{*/
    /*    position: absolute;*/
    /*    top: 10%;*/
    /*    left: 10%;*/
    /*    background-color: pink;*/
    /*    height: 50%;*/
    /*    width: 50%;*/
    /*    !*background-color: #ff7f0e;*!*/
    /*}*/
    .inputText .textUpLoader{
        float: left;
        position: absolute;
        left: 5%;
        width: 60%;
        height: 50%;
        background-color: #15161F;
    }
    .inputText .textExtract{
        float: left;
        position: absolute;
        left: 60%;
        width: 40%;
        height: 50%;
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
        height: 10%;
        background-color: #15161F;
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