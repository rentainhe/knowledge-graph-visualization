<template>
    <div>
        <div class="header_text">知识图谱系统</div>
        <div class="container">
<!--            <div class="left"></div>-->
            <div class="main">
                <div id="myChart" style="position: absolute;top:15%;left: 20%" :style="{width: '537px', height: '500px'}"></div>
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
        data (){
            return{
                myChart:''
            }
        },
        mounted() {
            this.Draw_graph();
        },
        methods:{
            Draw_graph:function(){
                var size = 60;
                var size1 = 30;
                var yy = 200;
                var yy1 = 250;

                var listdata = [];
                var links = [];

                var med = "药品";
                var ope = "操作";
                var che = "检查";

//著需要设定一下四个参数
//设定疾病名称
                var diease = "diease";
//设定传入的药品数组
                var meds = ["med1", "med2", "med3", "med4"];
//设定传入的操作数组
                var opes = ["ope1", "ope2", "ope3"];
//设定传入的检查数组
                var ches = ["che1", "che2", "che3", "che4"];

                function setData(arr, n) {
                    for (var i = 0; i < arr.length; i++) {
                        listdata.push({
                            x: i * 50,
                            y: size + i * 10,
                            "name": arr[i],
                            "symbolSize": size,
                            "category": n,
                            "draggable": "true"
                        })
                    }
                }

                function setLinkData(arr, title) {
                    for (var i = 0; i < arr.length; i++) {
                        links.push({
                            "source": arr[i],
                            "target": title,
                            lineStyle: {
                                normal: {
                                    color: 'source',
                                }
                            }
                        })
                    }
                }

                var legendes = ["药物", "操作", "检查", "疾病"];
                var texts = [];
                for (var i = 0; i < legendes.length; i++) {
                    texts.push({
                        "name": legendes[i],
                    })
                }

                var cat1 = ["药物"];
                for (var i = 0; i < meds.length; i++) {
                    cat1.push(meds[i]);
                }
                var cat2 = ["操作"];
                for (var i = 0; i < opes.length; i++) {
                    cat2.push(opes[i]);
                }
                var cat3 = ["检查"];
                for (var i = 0; i < ches.length; i++) {
                    cat3.push(ches[i]);
                }
                var cat4 = [];
                cat4.push(diease);

                setData(cat1, 0);
                setData(cat2, 1);
                setData(cat3, 2);
                setData(cat4, 3);

                setLinkData(cat1, cat1[0]);
                setLinkData(cat2, cat2[0]);
                setLinkData(cat3, cat3[0]);
                setLinkData(legendes, cat4[0]);
                this.myChart = this.$echarts.init(document.getElementById('myChart'))
                console.log(legendes)
                const option = ({
                        title: {
                            text: "疾病知识图谱",
                            top: "top",
                            left: "left",
                            textStyle: {
                                color: '#f7f7f7'
                            }
                        },
                        tooltip: {
                            formatter: '{b}'
                        },
                        toolbox: {
                            show: true,
                            feature: {
                                restore: {
                                    show: true
                                },
                                saveAsImage: {
                                    show: true
                                }
                            }
                        },
                        backgroundColor: '#15161F',
                        legend: {
                            data: legendes,
                            textStyle: {
                                color: '#fff'
                            },
                            icon: 'circle',
                            type: 'scroll',
                            orient: 'vertical',
                            left: 10,
                            top: 20,
                            bottom: 20,
                            itemWidth: 10,
                            itemHeight: 10
                        },
                        animationDuration: 1000,
                        animationEasingUpdate: 'quinticInOut',
                        series: [{
                            name: '知识图谱',
                            type: 'graph',
                            layout: 'force',
                            force: {
                                repulsion: 60,
                                gravity: 0.1,
                                edgeLength: 15,
                                layoutAnimation: true,
                            },
                            data: listdata,
                            links: links,
                            categories: texts,
                            roam: false,
                            label: {
                                normal: {
                                    show: true,
                                    position: 'inside',
                                    formatter: '{b}',
                                    fontSize: 16,
                                    fontStyle: '600',
                                }
                            },
                            lineStyle: {
                                normal: {
                                    opacity: 0.9,
                                    width: 1.5,
                                    curveness: 0
                                }
                            }
                        }]
                    }
                );
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
        left: 80%;
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
    .container .main{
        position: relative;
        float: right;
        width: 100%;
        height: 100%;
        background-color: #15161F;
    }
</style>