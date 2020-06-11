<template>
    <div>
        <div class="header_text">知识图谱系统</div>
        <div class="container">

            <div class="left">
                <div id="myChart" style="position: absolute;top:5%;left: 20%" :style="{width: '537px', height: '500px'}"></div>
<!--                <el-radio-group id="El-radio-group" class="header_button" v-model="isCollapse" style="margin-bottom: 20px;display: block" @change="Edit">-->
<!--                    <el-radio-button :label="false" >展开</el-radio-button>-->
<!--                    <el-radio-button :label="true" >收起</el-radio-button>-->
<!--                </el-radio-group>-->
                <el-switch
                        class="header_button"
                        v-model="isCollapse"
                        active-text="展开"
                        :width="54"
                        inactive-text="收起">
                </el-switch>
                <el-menu id="El-menu"  style="display:block;" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose" :collapse="isCollapse">
                    <el-menu-item index="1">
<!--                        <template slot="title">-->
<!--                            <i class="el-icon-location"></i>-->
<!--                            <span slot="title">导航一</span>-->
<!--                        </template>-->
<!--                        <el-menu-item-group>-->
<!--                            <span slot="title">分组一</span>-->
<!--                            <el-menu-item index="1-1">选项1</el-menu-item>-->
<!--                            <el-menu-item index="1-2">选项2</el-menu-item>-->
<!--                        </el-menu-item-group>-->
<!--                        <el-menu-item-group title="分组2">-->
<!--                            <el-menu-item index="1-3">选项3</el-menu-item>-->
<!--                        </el-menu-item-group>-->
<!--                        <el-submenu index="1-4">-->
<!--                            <span slot="title">选项4</span>-->
<!--                            <el-menu-item index="1-4-1">选项1</el-menu-item>-->
<!--                        </el-submenu>-->
                        <i class="el-icon-s-flag"></i>
                        <span slot="title">联赛</span>
                    </el-menu-item>
                    <el-menu-item index="2">
                        <i class="el-icon-football"></i>
                        <span slot="title">球队</span>
                    </el-menu-item>
                    <el-submenu index="3">
                        <template slot="title">
                            <i class="el-icon-user-solid"></i>
                            <span slot="title">球员</span>
                        </template>
                        <el-menu-item-group>
                            <span slot="title" style="text-align: center">球员位置</span>
                            <el-menu-item index="3-1" @click.native="Edit_Q">前锋</el-menu-item>
                            <el-menu-item index="3-2">后卫</el-menu-item>
                            <el-menu-item index="3-3">守门员</el-menu-item>
                        </el-menu-item-group>
                    </el-submenu>
                </el-menu>

                <el-button type="primary" round=true  @click="back_home" class="el-button–Edit">返回
                    <i class="el-icon-coin el-icon--right"></i>
                </el-button>

            </div>
            <div class="right"></div>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                isCollapse: true
            }
        },
        mounted() {
            this.drawLine();
        },
        methods: {
            Edit_Q:function(){
                console.log("1111")
            },
            handleOpen(key, keyPath) {
                console.log(key, keyPath);
            },
            handleClose(key, keyPath) {
                console.log(key, keyPath);
            },
            Edit:function () {
                document.getElementById("El-menu").style.display='block'
                document.getElementById("El-radio-group").style.display='block'
                // this.isCollapse=false
            },
            Open:function () {
                this.isCollapse = true
                document.getElementById("El-menu").style.display='block'
            },
            Close:function () {
                this.isCollapse = false
                document.getElementById("El-menu").style.display='block'
            },
            drawLine(){
                // 基于准备好的dom，初始化echarts实例
                let myChart = this.$echarts.init(document.getElementById('myChart'))
                // 绘制图表
                myChart.setOption({
                    calculable : false,
                    series : [
                        {
                            name:'树',
                            type:'tree',
                            symbolSize: [60,30],
                            edgeShape:'polyline',
                            symbol : 'roundRect',
                            orient: 'vertical',  // vertical horizontal
                            rootLocation: {x: 'center',y: 50}, // 根节点位置  {x: 100, y: 'center'}
                            nodePadding: 20,
                            itemStyle: {
                                normal: {
                                    color : 'rgba(128,0,0)', //节点的颜色在这里改
                                    label: {
                                        show: true,
                                        formatter: "{b}",
                                        color : "#fff"
                                    },
                                    lineStyle: {
                                        color: '#48b',
                                        shadowColor: '#000',
                                        shadowBlur: 3,
                                        shadowOffsetX: 3,
                                        shadowOffsetY: 5,
                                        curveness: 0.5,
                                        // type: 'broken' // 'curve'|'broken'|'solid'|'dotted'|'dashed'

                                    }
                                },
                                emphasis: {
                                    label: {
                                        show: true
                                    }
                                }
                            },

                            data: [
                                {
                                    name: '所有节点',
                                    value: 100,
                                    children: [
                                        {
                                            name: '俱乐部',
                                            value: 4,
                                            children: [

                                            ]
                                        },
                                        {
                                            name: '球员',
                                            value: 4,
                                            children: [{
                                                name: '前锋',
                                                value: 4
                                            },
                                                {
                                                    name: '后卫',
                                                    value: 4
                                                },
                                                {
                                                    name: '守门员',
                                                    value: 4
                                                }]
                                        },
                                        {
                                            name: '联赛',
                                            value: 1,
                                            children: [

                                            ]
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                });
            },
            back_home:function () {
                this.$router.push("/Home")
                location.reload()
            }
        }
    }
</script>

<style>
    .el-button–Edit{
        position: absolute;
        top: 85%;
        right: 10%;
        color: #fff;
        background-color: #303252;
        border-color: #9593A7;
        border-width: 2px;
    }
    .el-switch__label--left{
        position: relative;
        left: 57px;
        color: #fff;
        z-index: -1111;
    }
    .el-switch__label--right{
        position: relative;
        right: 57px;
        color: #fff;
        z-index: -1111;
    }
    .el-switch__label--right.is-active{
        z-index: 1111;
        color: #fff !important;
    }
    .el-switch__label--left.is-active{
        z-index: 1111;
        color: #9c9c9c !important;
    }

    .header_button{
        position: absolute;
        left: -4%;
        top:  22%;
    }
    .el-menu--collapse{
        position: absolute;
        top:30%;
    }
    .el-menu-vertical-demo:not(.el-menu--collapse) {
        position: absolute;
        top:30%;
        width: 30%;
        min-height: 24%;
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
    .container .left{
        position: relative;
        float: left;
        width: 50%;
        height: 100%;
        background-color: #15161F;
    }
    .container .right{
        position: relative;
        float: right;
        width: 50%;
        height: 100%;
        background-color: #1f77b4;
    }
</style>