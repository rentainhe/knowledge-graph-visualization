<template>
    <div>
        <div class="header_text">知识图谱系统</div>
        <div class="container">
<!--            <div class="left"></div>-->
            <div class="right">
                <el-button type="primary" round=true  @click="Back_to_homepage" class="back_to_homepage">返回首页
                    <i class="el-icon-s-promotion el-icon--right"></i>
                </el-button>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "Newgraph",
        methods:{
            Back_to_homepage:function () {
                this.$router.push("/Home")
            }
        }
    }

</script>

<style scoped>
    .back_to_homepage {
        position: absolute;
        top: 73%;
        left: 20%;
        color: #fff;
        background-color: #303252;
        border-color: #9593A7;
        border-width: 2px;
    }
    .header_text{
        font-family: "PingFang SC";
        font-size: 30px;
        letter-spacing: 6px;
        color: #ffffff;
        position: absolute;
        top: 0%;
        width: 100%;
        height: 6%;
        background-color: #15161F;
    }
    .container{
        position: absolute;
        top:6%;
        background-color: #15161F;
        width: 100%;
        height: 100%;
    }
    /*.container .left{*/
    /*    position: relative;*/
    /*    float: left;*/
    /*    width: 50%;*/
    /*    height: 100%;*/
    /*    background-color: #15161F;*/
    /*}*/
    .container .right{
        position: relative;
        float: right;
        width: 100%;
        height: 100%;
        background-color: #15161F;
    }
</style>