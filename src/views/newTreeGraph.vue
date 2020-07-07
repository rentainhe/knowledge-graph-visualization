<template>
    <div>
        <div class="header_text">知识图谱系统</div>
        <div class="container">
            <!--            <div class="left"></div>-->
            <div class="main">
                <div id="myChart" style="position: absolute;top:6%;left: 20%" :style="{width: '60%', height: '80%'}"></div>
                <el-button type="primary" round=true  @click="Back_to_homepage" class="back_to_homepage">返回首页
                    <i class="el-icon-s-promotion el-icon--right"></i>
                </el-button>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "newTreeGraph",
        data() {
            return {
                myChart: '',
                data:{
                    "name": "太平洋舰队司令部",
                    "children": [
                        {
                            "name": "基地",
                            "children": [
                                {
                                    "name": "班戈海军基地"
                                },
                                {
                                    "name": "樟宜海军基地"
                                },
                                {
                                    "name": "佐世保海军基地"
                                },
                                {
                                    "name": "珍珠港海军基地"
                                },
                                {
                                    "name": "圣迭戈海军基地"
                                },
                                {
                                    "name": "横须贺海军基地"
                                },
                                {
                                    "name": "关岛阿普拉港海军基地"
                                },
                                {
                                    "name": "冲绳白滩海军基地"
                                }
                            ]
                        },
                        {
                            "name": "舰队",
                            "children":[
                                {
                                    "name": "第七舰队",
                                    "children": [
                                        {
                                            "name": "第五航母打击群",
                                            "children":[
                                                {
                                                    "name": "舰艇",
                                                    "children":[

                                                    ]
                                                },
                                                {
                                                    "name": "部队",
                                                    "children": [
                                                        {
                                                            // "name": ,
                                                        }
                                                    ]
                                                }
                                            ]
                                        }
                                    ]

                                },
                                {
                                    "name": "第三舰队",
                                    "children": [
                                        {
                                            "name": "第一航母打击群"
                                        },
                                        {
                                            "name": "第三航母打击群"
                                        },
                                        {
                                            "name": "第九航母打击群"
                                        },
                                        {
                                            "name": "第十一航母打击群"
                                        },
                                        {
                                            "name": "第三远征打击群"
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            }
        },
        mounted() {
            this.Draw_graph(this.data);
        },
        methods: {
            Draw_graph:function(data){
                this.myChart = this.$echarts.init(document.getElementById('myChart'))
                var option = {
                    tooltip: {
                        trigger: 'item',
                        triggerOn: 'mousemove'
                    },
                    series:[
                        {
                            type: 'tree',
                            id: 0,
                            name: 'tree1',
                            data: [data],

                            top: '10%',
                            left: '8%',
                            bottom: '22%',
                            right: '20%',

                            symbolSize: 7,

                            edgeShape: 'polyline',
                            edgeForkPosition: '63%',
                            initialTreeDepth: 3,

                            lineStyle: {
                                width: 2
                            },

                            label: {
                                backgroundColor: '#fff',
                                position: 'left',
                                verticalAlign: 'middle',
                                align: 'right'
                            },

                            leaves: {
                                label: {
                                    position: 'right',
                                    verticalAlign: 'middle',
                                    align: 'left'
                                }
                            },

                            expandAndCollapse: true,
                            animationDuration: 550,
                            animationDurationUpdate: 750
                        }
                    ]
                };
                this.myChart.setOption(option);
            },
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
        left: 85%;
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
    .container .main{
        position: relative;
        float: right;
        width: 100%;
        height: 100%;
        background-color: #15161F;
    }
</style>