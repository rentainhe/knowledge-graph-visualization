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

                function setData(arr, n) {
                    for (var i = 0; i < arr.length; i++) {
                        const flag = arr[i] === "disease"
                        listdata.push({
                            x: i*30,
                            y: 30 + i * 10,
                            "name": arr[i], // 各个节点的name参数不能重复，
                            "symbolSize": size, // 该类目节点标记的大小
                            "category": -n, // 该节点所在类目的index
                            "nodeType" : flag, //
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

                //著需要设定一下四个参数
                //设定疾病名称
                var headquarter = "太平洋舰队\n司令部";
                //设定传入的药品数组
                var meds = ["med1", "med2", "med3", "med4"];
                //设定传入的操作数组
                var opes = ["第三舰队", "第七舰队"];
                var CSG1 = ["第一航母打击群","第三航母打击群","第九航母打击群","第十一航母打击群","第三远征打击群"]
                var CSG2 = ["第五航母打击群"]
                //设定传入的检查数组
                var base = ["冲绳白滩海军基地", "关岛阿普拉港海军基地", "横须贺海军基地", "圣坛戈海军基地","珍珠港海军基地","佐世保海军基地","樟宜海军基地","班戈海军基地"];

                var legendes = ["司令部", "舰队", "基地", "舰艇","部队"];
                var texts = [];
                for (var i = 0; i < legendes.length; i++) {
                    texts.push({
                        "name": legendes[i],
                    })
                }

                var cat1 = ["舰艇"];
                // for (var i = 0; i < meds.length; i++) {
                //     cat1.push(meds[i]);
                // }

                var fleet = ["舰队"];
                for (var i = 0; i < opes.length; i++) {
                    fleet.push(opes[i]);
                }

                var basement = ["基地"];
                for (var i = 0; i < base.length; i++) {
                    basement.push(base[i]);
                }

                var cat4 = [];
                cat4.push(headquarter);

                // setData(cat1, 3);
                // setData()
                setData(cat1,4)
                setData(CSG2,3)
                setData(CSG1,3)
                setData(fleet, 1);
                setData(basement, 2);
                setData(cat4, 0);

                setLinkData(cat1,CSG2[0])
                setLinkData(CSG2,fleet[2])
                setLinkData(CSG1.slice(0,5), fleet[1]); // 第三舰队
                setLinkData(fleet.slice(1,3), fleet[0]); // 舰队
                setLinkData(basement.slice(1,9), basement[0]);
                setLinkData(legendes.slice(0,4), cat4[0]);

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

                this.myChart = this.$echarts.init(document.getElementById('myChart'))
                console.log(legendes)
                const option = ({
                        title: {
                            text: "知识图谱系统", //主标题文本
                            top: "top", // 距离容器组件上侧的距离
                            left: "left", // 距离容器组件左侧的距离
                            textStyle: { // 文字样式，字体风格颜色等参数设置
                                color: '#f7f7f7'
                            }
                        },
                        tooltip: { // 提示框浮层内容格式器
                            formatter: '{b}' // 鼠标悬浮在节点上，所显示的内容
                        },
                        toolbox: { // 工具栏，可以在里面添加，导出图片，数据视图等功能
                            show: true,
                            feature: { // 工具项配置，工具按钮
                                restore: { // 还原配置项
                                    show: true
                                },
                                saveAsImage: { // 保存图片
                                    show: true // 是否显示该工具
                                }
                            }
                        },
                        backgroundColor: '#15161F',
                        legend: { // 图例组件，显示图例
                            data: legendes,
                            textStyle: {
                                color: '#fff'
                            },
                            icon: 'circle', // 图例标记，有 circle、rect、roundRect、triangle等
                            type: 'scroll', // 图例类型，有 plain 和 scroll 两种
                            orient: 'vertical', // 图例的布局朝向，有 vertical 和 horizontal 两种
                            left: 10, // 距离容器左侧的距离，可以是10这种具体的像素值，也可以是10%这样的比例
                            top: 20, // 距离容器上侧的距离
                            bottom: 20, // 距离容器下侧的距离
                            itemWidth: 15, // 图例标记的图形宽度
                            itemHeight: 20 // 图例标记的图形高度
                        },
                        animationDuration: 1000, // 初始动画时长
                        animationEasingUpdate: 'quinticInOut', // 数据更新时的动画效果
                        series: [{
                            name: '知识图谱',
                            type: 'graph',
                            layout: 'force', // 图的布局，force：力导向图，circular：环形布局
                            force: { // 模拟电荷，给两个节点间添加斥力，给相连节点添加引力
                                repulsion: 50, // 斥力大小
                                gravity: 0.1, // 受到中心节点引力的大小
                                edgeLength: 30, // 节点之间的距离，也会受到replusion的影响
                                layoutAnimation: true, // 显示布局的迭代动画
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