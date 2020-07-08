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
            <div class="right">
                <el-card id="Attribute" class="box-card" >
                    <div slot="header" class="clearfix">
                        <span>节点属性</span>
                        <!--                        <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>-->
                    </div>
                    <div v-for="(item, index) in currentNodeAttribute"  class="text item">
                        {{item}}
                        <el-button style="float: right; padding: 3px 0 ;position: absolute;right: 20%" type="text" @click="editAttribute(index)">修改</el-button>
                        <el-button style="float: right; padding: 3px 0;position: absolute;right: 8%" type="text" @click="deleteAttribute(index)">删除</el-button>

                    </div>
                </el-card>
                <el-button id="addAttribute" style="display: none" type="primary" round=true  @click="addAttrubute" class="el-button–Edit">新增属性
                    <i class="el-icon-coin el-icon--right"></i>
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
                Nodename:"", // 输入的节点名字
                MySQLName:"", // 在后端创建的表的名字
                dialogVisible:false,
                currentNode:"",
                currentNodeid:"",
                currentNodeAttribute:[],
                isCollapse: true,
                isClick:false,
                Node:'',
                treeData:'',
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
                                                        {
                                                            "name": "华盛顿号航空母舰"
                                                        },
                                                        {
                                                            "name": "华盛顿号航空母舰2"
                                                        },
                                                        {
                                                            "name": "华盛顿号航空母舰3"
                                                        }
                                                    ]
                                                },
                                                {
                                                    "name": "部队",
                                                    "children": [
                                                        {
                                                            "name":"第15驱逐舰中队"
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
                                            "name": "第一航母打击群",
                                            "children": [
                                                {
                                                    "name": "舰艇",
                                                    "children":[
                                                        {
                                                            "name": "尚普兰湖号巡洋舰"
                                                        },
                                                        {
                                                            "name": "卡尔文森号航空母舰"
                                                        },
                                                        {
                                                            "name": "邦克山号巡洋舰"
                                                        }
                                                    ]
                                                },
                                                {
                                                    "name": "部队",
                                                    "children":[
                                                        {
                                                            "name": "第一驱逐舰中队"
                                                        }
                                                    ]
                                                },
                                            ]
                                        },
                                        {
                                            "name": "第三航母打击群",
                                            "children": [
                                                {
                                                    "name": "舰艇",
                                                    "children":[
                                                        {
                                                            "name": "独立级濒海战斗舰"
                                                        }
                                                    ]
                                                },
                                                {
                                                    "name": "部队",
                                                    "children":[
                                                        {
                                                            "name": "第1爆炸军械处理大队"
                                                        },
                                                        {
                                                            "name": "海军航空与导弹防御司令部"
                                                        },
                                                        {
                                                            "name": "第1濒海战斗舰中队"
                                                        },
                                                        {
                                                            "name": "水雷及反潜作战司令部"
                                                        },
                                                        {
                                                            "name": "第1沿海江河作战部队"
                                                        },
                                                        {
                                                            "name": "海上攻击直升机联队"
                                                        },
                                                        {
                                                            "name": "中太平洋水面大队"
                                                        }
                                                    ]
                                                },
                                            ]

                                        },
                                        {
                                            "name": "第九航母打击群",
                                            "children": [
                                                {
                                                    "name": "舰艇",
                                                    "children":[
                                                        {
                                                            "name": "里根号航空母舰"
                                                        },
                                                        {
                                                            "name": "钱思勒斯维尔号巡洋舰"
                                                        },
                                                        {
                                                            "name": "圣乔治角号巡洋舰"
                                                        }
                                                    ]
                                                },
                                                {
                                                    "name": "部队",
                                                    "children":[
                                                        {
                                                            "name": "第九驱逐舰中队"
                                                        }
                                                    ]
                                                },
                                            ]
                                        },
                                        {
                                            "name": "第十一航母打击群",
                                            "children": [
                                                {
                                                    "name": "舰艇",
                                                    "children":[
                                                        {
                                                            "name": "斯坦尼斯号航空母舰"
                                                        },
                                                        {
                                                            "name": "莫比尔湾号巡洋舰"
                                                        },
                                                        {
                                                            "name": "安蒂特姆河号巡洋舰"
                                                        }
                                                    ]
                                                },
                                                {
                                                    "name": "部队",
                                                    "children":[
                                                        {
                                                            "name": "第22驱逐舰中队"
                                                        }
                                                    ]
                                                },
                                            ]
                                        },
                                        {
                                            "name": "第三远征打击群",
                                            "children": [
                                                {
                                                    "name": "舰艇",
                                                    "children":[
                                                        {
                                                            "name": "尼米兹号航空母舰"
                                                        },
                                                        {
                                                            "name": "普林斯顿号巡洋舰"
                                                        },
                                                        {
                                                            "name": "希金斯号驱逐舰"
                                                        }
                                                    ]
                                                },
                                                {
                                                    "name": "部队",
                                                    "children":[
                                                        {
                                                            "name": "第23驱逐舰中队"
                                                        }
                                                    ]
                                                },
                                            ]
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
                            initialTreeDepth: 0,      //控制树图有几层

                            lineStyle: {
                                width: 2
                            },

                            label: {
                                backgroundColor: '#15161F',
                                position: 'left',
                                verticalAlign: 'middle',
                                align: 'right',
                                color: '#fff'
                            },

                            leaves: {
                                label: {
                                    position: 'right',
                                    verticalAlign: 'middle',
                                    align: 'left',
                                    color: '#fff'
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
    .text {
        font-size: 14px;
        text-align: left;
    }

    .item {
        margin-bottom: 18px;
    }

    /*.clearfix:before,*/
    /*.clearfix:after {*/
    /*    display: table;*/
    /*    content: "";*/
    /*}*/
    /*.clearfix:after {*/
    /*    clear: both*/
    /*}*/

    .box-card {
        position: absolute;
        top:15%;
        left: 25%;
        width: 50%;
    }
    .el-button–Edit{
        position: absolute;
        top: 85%;
        right: 10%;
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
    .container .right{
        position: absolute;
        float: right;
        right: 8%;
        width: 20%;
        height: 30%;
        background-color: #15161F;
    }
    .box-card {
        position: absolute;
        top:15%;

        left: 0%;
        width: 100%;
    }
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