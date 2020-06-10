<template>
    <div>
        <div class="header_text">知识图谱系统</div>
        <div class="container">
            <div class="left"></div>
            <div class="right"></div>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {

            }
        },
        mounted() {
        },
        methods: {

        }
    }
</script>

<style>
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
    .container .left{
        position: relative;
        float: left;
        width: 50%;
        height: 100%;
        background-color: #ff7f0e;
    }
    .container .right{
        position: relative;
        float: right;
        width: 50%;
        height: 100%;
        background-color: #1f77b4;
    }
</style>