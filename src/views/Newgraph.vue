<template>
    <div>
        <div class="header_text">知识图谱系统</div>
        <div class="container">
<!--            <div class="left"></div>-->
            <div class="main">
                <el-col :span="3" :offset="3">
                    <el-form :model="formInline" class="text_search">
                        <el-form-item>
                            <el-input v-model="default_ask" placeholder="查询" clearable=1></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button icon="el-icon-upload" type="primary" @click="onSubmit">节点查询</el-button>
                        </el-form-item>
                    </el-form>
                </el-col>

                <div id="myChart" style="position: absolute;top:6%;left: 20%" :style="{width: '60%', height: '80%'}"></div>

                <el-card class="box-card" id="Player_info" style="display: block">
                    <div slot="header" class="clearfix">
                        <span class="text item">节点信息</span>
                    </div>
<!--                    <div class="text item" v-for="(val,key,i) in currentPlayerNode" >-->
<!--                        {{key}}:{{val}}-->
<!--                    </div>-->
                    <div></div>
                </el-card>

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
            console.log(this.myChart.getOption());
        },
        methods:{
            Draw_graph:function(){

                var size = 60;
                var size1 = 30;
                var yy = 200;
                var yy1 = 250;

                var listdata = [];
                var links = [];


                function setData(arr, n) {
                    for (var i = 0; i < arr.length; i++) {
                        const flag = arr[i] === "disease"
                        listdata.push({
                            x: i*25,
                            y: 30 + i * 10,
                            "name": arr[i], // 各个节点的name参数不能重复，
                            "symbolSize": size, // 该类目节点标记的大小
                            "category": -n, // 该节点所在类目的index
                            "nodeType" : flag, //
                            "draggable": "true"
                        })
                    }
                }

                function setLinkData(arr, title,relation) {
                    for (var i = 0; i < arr.length; i++) {
                        links.push({
                            "source": arr[i],
                            "target": title,
                            label:{
                                show: true,
                                formatter:relation // 在formatter中添加文字可以实现将文字显示在关系上
                            },
                            lineStyle: {
                                normal: {
                                    color: 'source',
                                }
                            }
                        })
                    }
                }

                //著需要设定一下四个参数
                //设总部名称
                var headquarter = "太平洋舰队\n司令部";
                // 二级节点
                var second_nodes = ["基地","舰队"]

                var CSGS = ["第三舰队", "第七舰队"];
                var CSG1 = ["第三舰队","第一航母打击群","第三航母打击群","第九航母打击群","第十一航母打击群","第三远征打击群"]
                var first_troop = ["第一航母打击群","第一航母打击群舰艇","第一航母打击群部队","尚普兰湖号巡洋舰","卡尔文森号航空母舰","邦克山号巡洋舰",
                                "第一驱逐舰中队"]
                // 第三航母打击群
                var third_troop = ["第三航母打击群","第三航母打击群舰艇","第三航母打击群部队","斯坦尼斯号航空母舰","莫比尔湾号巡洋舰","安蒂特姆河号巡洋舰"
                                ,"第22驱逐舰中队"]
                // 第九航母打击群
                var ninth_troop = ["第九航母打击群","第九航母打击群舰艇","第九航母打击群部队","里根号航空母舰","钱思勒斯维尔号巡洋舰","圣乔治角号巡洋舰"
                                ,"第九驱逐舰中队"]
                // 第十一航母打击群
                var eleventh_troop = ["第11航母打击群","第11航母打击群舰艇","第11航母打击群部队","尼米兹号航空母舰","普林斯顿号巡洋舰","希金斯号驱逐舰"
                                ,"第23驱逐舰中队"]
                // 第三远征打击群舰艇
                var third_ESG_troop = ["第三远征打击群","第三远征打击群舰艇","第三远征打击群部队","独立级濒海战斗舰"
                                ,"第1爆炸军械处理大队","海军航空与导弹防御司令部","第1濒海战斗舰中队","水雷及反潜作战司令部","第1沿海江河作战部队","海上攻击直升机联队","中太平洋水面大队"]
                // 第五航母打击群
                var fifth_troop = ["第五航母打击群","第五航母打击群舰艇","第五航母打击群部队","华盛顿号航空母舰","华盛顿号航空母舰2","华盛顿号航空母舰3",
                                "第15驱逐舰中队"]
                // 基地
                var basement = ["基地","冲绳白滩海军基地", "关岛阿普拉港海军基地", "横须贺海军基地", "圣坛戈海军基地","珍珠港海军基地","佐世保海军基地","樟宜海军基地","班戈海军基地"];

                var legendes = ["司令部", "基地", "舰队","第三舰队","第一航母打击群","第三航母打击群","第九航母打击群","第11航母打击群","第三远征打击群"
                    ,"第七舰队","第五航母打击群"];
                var texts = [];
                for (var i = 0; i < legendes.length; i++) {
                    texts.push({
                        "name": legendes[i],
                    })
                }

                var Headquarter = []; // 司令部节点
                Headquarter.push(headquarter);


                // 设置节点信息
                setData(Headquarter, 0); //司令部节点，类别0
                setData(basement,1); // 基地节点，类别1
                setData(second_nodes.slice(1,2), 2); // 舰队节点，类别2
                setData(CSGS.slice(0,1),3); // 第三舰队节点，类别3
                setData(CSGS.slice(1,2),9); // 第七舰队节点，类别9（对应legend上位置9）
                setData(first_troop,4) // 第一航母打击群，类别4
                setData(third_troop,5) // 第三航母打击群，类别5
                setData(ninth_troop,6) // 第九航母打击群，类别6
                setData(eleventh_troop,7) // 第11航母打击群，类别7
                setData(third_ESG_troop,8) // 第三远征打击群，类别8
                setData(fifth_troop,10) // 第五航母打击群，类别10
                // 设置节点关系
                setLinkData(second_nodes, Headquarter[0],"");
                setLinkData(basement.slice(1,9), second_nodes[0],"所属基地");
                setLinkData(CSGS.slice(1,2),second_nodes[1],"下辖\n舰队") // 舰队 -> 第七舰队
                setLinkData(CSGS.slice(0,1),second_nodes[1],"下辖\n舰队") // 舰队 -> 第三舰队



                setLinkData(first_troop.slice(0,1),"第三舰队","下辖\n打击群") // 第三舰队 -> 第一航母打击群
                setLinkData(first_troop.slice(1,3),first_troop[0],"") // 第一航母打击群 -> 舰艇/部队
                setLinkData(first_troop.slice(3,6),first_troop[1],"下辖\n舰队")
                setLinkData(first_troop.slice(6,7),first_troop[2],"下辖\n部队")
                //
                setLinkData(third_troop.slice(0,1),"第三舰队","下辖\n打击群") // 第三舰队 -> 第三航母打击群
                setLinkData(third_troop.slice(1,3),third_troop[0],"") // 第三航母打击群 -> 舰艇/部队
                setLinkData(third_troop.slice(3,6),third_troop[1],"下辖\n舰队")
                setLinkData(third_troop.slice(6,7),third_troop[2],"下辖\n部队")
                //
                setLinkData(ninth_troop.slice(0,1),"第三舰队","下辖\n打击群") // 第三舰队 -> 第九航母打击群
                setLinkData(ninth_troop.slice(1,3),ninth_troop[0],"") // 第九航母打击群 -> 舰艇/部队
                setLinkData(ninth_troop.slice(3,6),ninth_troop[1],"下辖\n舰队")
                setLinkData(ninth_troop.slice(6,7),ninth_troop[2],"下辖\n部队")
                //
                setLinkData(eleventh_troop.slice(0,1),"第三舰队","下辖\n打击群") // 第三舰队 -> 第11航母打击群
                setLinkData(eleventh_troop.slice(1,3),eleventh_troop[0],"") // 第11航母打击群 -> 舰艇/部队
                setLinkData(eleventh_troop.slice(3,6),eleventh_troop[1],"下辖\n舰队")
                setLinkData(eleventh_troop.slice(6,7),eleventh_troop[2],"下辖\n部队")
                //
                setLinkData(third_ESG_troop.slice(0,1),"第三舰队","下辖\n打击群") // 第三舰队 -> 第三远征打击群
                setLinkData(third_ESG_troop.slice(1,3),third_ESG_troop[0],"") // 第三远征打击群 -> 舰艇/部队
                setLinkData(third_ESG_troop.slice(3,4),third_ESG_troop[1],"下辖\n舰队")
                setLinkData(third_ESG_troop.slice(4,11),third_ESG_troop[2],"下辖\n部队")
                //
                setLinkData(fifth_troop.slice(0,1),"第七舰队","下辖\n打击群") // 第七舰队 -> 第五航母打击群
                setLinkData(fifth_troop.slice(1,3),fifth_troop[0],"") // 第五航母打击群 -> 舰艇/部队
                setLinkData(fifth_troop.slice(3,6),fifth_troop[1],"下辖\n舰队")
                setLinkData(fifth_troop.slice(6,7),fifth_troop[2],"下辖\n部队")
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
                    // console.log("open:" + open);
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
                            text: "节点列表", //主标题文本
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
                            type: 'scroll', // 图例类型，有 plain 和 scroll 两种，当图例较多的时候可以使用scroll，然后对其具体的属性再进行设置
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
                                    fontSize: 12,
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
    .nodeRelationSearch{
        position: absolute;
        top:23%;
        left:7.7%;
    }
    .box-card{
        position: absolute;
        top:10%;
        right: 2%;
        background-color: #15161F;
        width: 15%;
    }

    .text {
        font-size: 14px;
        color: #ffffff;
    }

    .item {
        margin-bottom: 18px;
    }

    .text_search {
        position: absolute;
        left:3%;
        top: 10%;
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