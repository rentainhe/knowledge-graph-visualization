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
                var diease = "disease";
//设定传入的药品数组
                var meds = ["med1", "med2", "med3", "med4"];
//设定传入的操作数组
                var opes = ["ope1", "ope2", "ope3"];
//设定传入的检查数组
                var ches = ["che1", "che2", "che3", "che4"];

                function setData(arr, n) {
                    for (var i = 0; i < arr.length; i++) {
                        const flag = arr[i] === "disease"
                        listdata.push({
                            x: i * 50,
                            y: size + i * 10,
                            "name": arr[i],
                            "symbolSize": size,
                            "category": -n,
                            "nodeType" : flag,
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
                /**
                 * 绑定图表的点击事件
                 * @param chart
                 */
                function bindChartClickEvent(chart) {
                    chart.on('click', function (params) {
                        console.log(params)
                        var category = params.data.category,
                            nodeType = params.data.nodeType;
                        // console.log(nodeType);
                        toggleShowNodes(chart, params);
                        // if (category === 0 || nodeType === 1) {
                        //     toggleShowNodes(chart, params);
                        // }
                    });
                }

                /**
                 * 展开或关闭节点
                 * @param chart
                 * @param params
                 */
                function toggleShowNodes(chart, params) {
                    var open = !!params.data.open,

                        options = chart.getOption(),
                        seriesIndex = params.seriesIndex,
                        srcLinkName = params.name,
                        serieLinks = options.series[seriesIndex].links,
                        serieData = options.series[seriesIndex].data,
                        serieDataMap = new Map(),
                        serieLinkArr = [];
                    console.log("open:" + open);
                    console.log(options);
                    // 当前根节点是展开的，那么就需要关闭所有的根节点
                    if (open) {
                        // 递归找到所有的link节点的target的值
                        findLinks(serieLinkArr, srcLinkName, serieLinks, true);
                        if (serieLinkArr.length) {
                            serieData.forEach(sd => serieDataMap.set(sd.name, sd));
                            for (var i = 0; i < serieLinkArr.length; i++) {
                                if (serieDataMap.has(serieLinkArr[i])) {
                                    var currentData = serieDataMap.get(serieLinkArr[i]);
                                    currentData.category = -Math.abs(currentData.category);
                                    if (currentData.nodeType === 1) {
                                        currentData.open = false;
                                    }
                                }
                            }
                            serieDataMap.get(srcLinkName).open = false;
                            chart.setOption(options);
                        }
                    } else {
                        // 当前根节点是关闭的，那么就需要展开第一层根节点
                        // console.log(open);
                        findLinks(serieLinkArr, srcLinkName, serieLinks, false);
                        if (serieLinkArr.length) {
                            serieData.forEach(sd => serieDataMap.set(sd.name, sd));
                            for (var j = 0; j < serieLinkArr.length; j++) {
                                if (serieDataMap.has(serieLinkArr[j])) {
                                    var currentData = serieDataMap.get(serieLinkArr[j]);
                                    currentData.category = Math.abs(currentData.category);
                                }
                            }
                            serieDataMap.get(srcLinkName).open = true;
                            chart.setOption(options);
                        }
                    }
                }

                /**
                 * 查找连接关系
                 * @param links 返回的节点放入此集合
                 * @param srcLinkName 源线的名称
                 * @param serieLinks 需要查找的集合
                 * @param deep 是否需要递归进行查找
                 */
                function findLinks(links, srcLinkName, serieLinks, deep) {
                    var targetLinks = [];
                    serieLinks.filter(link => link.target === srcLinkName).forEach(link => {
                        targetLinks.push(link.source);
                        links.push(link.source)
                    });
                    console.log(targetLinks);
                    if (deep) {
                        for (var i = 0; i < targetLinks.length; i++) {
                            findLinks(links, targetLinks[i], serieLinks, deep);
                        }
                    }
                    console.log(targetLinks);
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

                setData(cat1, 3);
                setData(cat2, 1);
                setData(cat3, 2);
                setData(cat4, 0);

                setLinkData(cat1.slice(1,4), cat1[0]);
                setLinkData(cat2.slice(1,4), cat2[0]);
                setLinkData(cat3.slice(1,4), cat3[0]);
                setLinkData(legendes.slice(0,3), cat4[0]);
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
                        backgroundColor: '#00000',
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
                bindChartClickEvent(this.myChart);
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