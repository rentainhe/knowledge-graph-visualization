<template>
    <el-container>
        <el-header>文本导入</el-header>
        <el-container>
            <el-main>
                <el-col  class ="col">
                    <el-col  class="col">
                        <el-input
                                type="textarea"
                                class="textarea"
                                :rows="25"
                                placeholder="请输入内容"
                                v-model="textarea">
                        </el-input>
                    </el-col>
                </el-col>
            </el-main>
            <el-aside>
                <div class="buttons">
                    //发送数据
                    <el-button type="primary" round=true @click="begin_upload" >确认上传
                        <i class="el-icon-upload el-icon--right"></i>
                    </el-button>
                </div>
                <div class="buttons">
                    <el-button type="primary" round=true @click="extract">开始抽取
                        <i class="el-icon-caret-right el-icon--right"></i>
                    </el-button>
                </div>
                <div class="buttons">
                    <el-button type="primary" round=true @click="return_home">返回
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
                    this.extractNode = res.data.data.extractNode
                    this.extractTeam = res.data.data.extractTeam
                    console.log(res)
                    if (this.extractTeam)
                    this.$message('抽取信息：球员：'+ this.extractNode + ';   球队: ' + this.extractTeam)
                    else {
                        this.$message('抽取失败')
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
                        this.$message('成功！请点击"开始抽取"按钮完成抽取');
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
    .el-header, .el-footer {
        background-color: #B3C0D1;
        color: #333;
        text-align: center;
        line-height: 60px;
    }

    .el-aside {
        background-color: #15161F;
        color: #333;
        text-align: center;
        line-height: 200px;
    }

    .el-main {
        background-color: #15161F;
        color: #333;
        text-align: center;
        line-height: 160px;
    }
    /*.textarea{*/
    /*    !*position: absolute;*!*/
    /*    top: 20%;*/
    /*    left: 20%;*/
    /*    bottom: 20%;*/
    /*}*/
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