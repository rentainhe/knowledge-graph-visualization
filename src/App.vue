<template>
    <div id="app">
        <el-container style="height : 100%">
            <el-header height="48px">
                知识图谱展示
            </el-header>
            <el-container>
                <el-aside width="20%">
<!--                    <el-container>-->
                    <el-col :span="4" :offset="3">
                        <el-form :model="formInline" class="text_search">
                            <el-form-item>
                                <el-input v-model="formInline.user" placeholder="查询" clearable=1></el-input>
                            </el-form-item>
                            <el-form-item>
                                <el-button icon="el-icon-upload" type="primary" @click="onSubmit">节点查询</el-button>
                            </el-form-item>

                        </el-form>
                    </el-col>
<!--                        <el-switch-->
<!--                                v-model="value1" active-text="Text" inactive-text="Nodes" active-color="#F0FFFF">-->
<!--                        </el-switch>-->
<!--                    </el-container>-->
                </el-aside>
                <!--主要区域-->
<!--                <el-main>-->
                    <!--图谱放置的主要区域-->
                    <el-col :span="15" class="graph">
                        <!--这是我的图！！！！！！！！！-->
<!--                        <div class="cc"></div>-->
                    </el-col>
                    <el-col :span="7" class="right-side" >
                        <!-- 节点信息区域-->
                        <div class="personal_Information">
                        </div>
                        <!-- 基本功能按钮区域-->
                        <div class="buttons">
                            <el-button type="primary" round=true @click="printData" class="el-button–upload">文本导入
                                <i class="el-icon-upload el-icon--right"></i>
                            </el-button>
                            <el-button type="primary" round=true @click="user_Check" class="el-button-check">人工审核
                            <i class="el-icon-user el-icon--right"></i>
                            </el-button>
                            <el-button type="primary" round=true  @click="put_into_Database" class="el-button–mysql">数据库导入
                                <i class="el-icon-coin el-icon--right"></i>
                            </el-button><!--              <el-row class="col1"></el-row>-->
                        </div>
                    </el-col>
<!--                </el-main>-->

            </el-container>

        </el-container>
    </div>
</template>

<style>
    .right-side {
        position: relative;
    }
    /* el-switch 开关的相关设置 */
    .el-switch {
        position:relative;
        top:30px;
        left:20px;
    }
    .el-switch__label--left{
        position: relative;
        left: 60px;
        color: #fff;
        z-index: -1111;
    }
    .el-switch__label--right{
        position: relative;
        right: 60px;
        color: #fff;
        z-index: -1111;
    }
    .el-switch__label.is-active{
        z-index: 1111;
        color: #fff;
    }
    /* 搜索框的相关设置 */
    .text_search {
        position: absolute;
        top: 20%;
    }
    /* 按钮区域 */
    .buttons {
        background-color: #15161F;
        height: 45%;
        position: relative;
    }
    /* 上传文件框的相关设置 */
    .el-button–upload{
        position: absolute;
        top:15%;
        left:27%;
        color: #fff;
        background-color: #303252;
        border-color: #9593A7;
        border-width: 2px;
    }
    /*人工检查按钮样式*/
    .el-button-check {
        position: absolute;
        top: 40%;
        left: 25%;
        color: #fff;
        background-color: #303252;
        border-color: #9593A7;
        border-width: 2px;
    }
    /*导入数据库按钮设置*/
    .el-button–mysql {
        position: absolute;
        top: 65%;
        left: 24%;
        color: #fff;
        background-color: #303252;
        border-color: #9593A7;
        border-width: 2px;
    }

    .el-header, .el-footer {
        background-color: #B3C0D1;
        color: #333;
        text-align: center;
        line-height: 60px;
    }

    .el-aside {
        background-color: #15161F;
        color: #333;
        position: relative;
        text-align: center;
        line-height: 50px;
    }

    /*.el-main {*/
    /*    background-color: #15161F;*/
    /*    color: #333;*/
    /*    text-align: center;*/
    /*    line-height: 160px;*/
    /*}*/

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

    .el-col {
        /*height: 640px;*/
    }

    .graph {
        background-color: #15161F;
    }

    .personal_Information {
        background-color: #15161F;
        height: 55%;
    }


</style>

<!-- 查询框-->
<script>
    // 画图
    import * as d3 from 'd3'
    // var _this = this
    export default {
        data() {
            return {
                value : '0',
                formInline: {
                    user: '',
                    region: ''
                },
                value1: true,
                width: 800,
                height: 800,
                //示例数据的地方
                testGraph: {
                    "nodes": [{"id": "a", "group": 1}, {"id": "b", "group": 1}, {
                        "id": "c",
                        "group": 1
                    }, {"id": "d", "group": 1}, {"id": "e", "group": 1}, {
                        "id": "f",
                        "group": 1
                    }],
                    "links": [{"source": "a", "target": "b", "value": 1}, {
                        "source": "a",
                        "target": "c",
                        "value": 8
                    }, {"source": "b", "target": "d", "value": 10} ]
                },
                newGraph: {
                    "nodes" : [{"name":"巴塞罗那","group":1},{"name":"皮克","group":2}
                    ,{"name":"菲尔波","group":2},{"name":"格里兹曼","group":2}
                    //     {"id":"弗兰基·德容","group":2},{"id":"阿图尔","group":2},{"id":"乌姆蒂蒂","group":2},{"id":"罗贝托","group":2},{"id":"朗格莱","group":2},
                    //     {"id":"卡尔莱斯·佩雷兹","group":2},{"id":"塞梅多","group":2},{"id":"布斯克茨","group":2},{"id":"安苏·法蒂","group":2},
                    //     {"id":"苏亚雷斯","group":2},{"id":"拉基蒂奇","group":2},{"id":"阿尔巴","group":2},{"id":"梅西","group":2},{"id":"特尔施特根","group":2}
                        ],
                    "links" : [{"source":"皮克","target":"巴塞罗那","lineWord":"效力"}
                    // ,{"source":"菲尔波","target":"巴塞罗那","value":"效力"},{"source":"格里兹曼","target":"巴塞罗那","value":"效力"},{"source":"弗兰基·德容","target":"巴塞罗那","value":"效力"},{"source":"阿图尔","target":"巴塞罗那","value":"效力"},{"source":"乌姆蒂蒂","target":"巴塞罗那","value":"效力"},
                    //     {"source":"罗贝托","target":"巴塞罗那","value":"效力"},{"source":"朗格莱","target":"巴塞罗那","value":"效力"},{"source":"卡尔莱斯·佩雷兹","target":"巴塞罗那","value":"效力"},
                    //     {"source":"塞梅多","target":"巴塞罗那","value":"效力"},{"source":"布斯克茨","target":"巴塞罗那","value":"效力"},{"source":"安苏·法蒂","target":"巴塞罗那","value":"效力"},
                    //     {"source":"苏亚雷斯","target":"巴塞罗那","value":"效力"},{"source":"拉基蒂奇","target":"巴塞罗那","value":"效力"},{"source":"阿尔巴","target":"巴塞罗那","value":"效力"},
                    //     {"source":"梅西","target":"巴塞罗那","value":"效力"},{"source":"特尔施特根","target":"巴塞罗那","value":"效力"}
                        ]

                },
                myGraph:{
                    "nodes": [],
                    "links": []
                }

            }
        },
        mounted() {
            // var _this = this
            this.getData()
            this.printData()
            // this.initGraph(this.myGraph)
        },
        methods: {
            // axios读取本地static文件夹下的json文件
            printData(){
                console.log(this.myGraph["links"])
            },
            // setData(),
            getData(){
                var _this = this
                this.$axios.get("http://10.24.82.10:8081/initNodes").then( response =>{
                    // 处理json数据
                    var jsonObj = JSON.parse(JSON.stringify(response.data.data));
                    _this.myGraph["nodes"] = jsonObj
                    console.log("成功获取节点")
                    // console.log(response.data.data)
                    this.$axios.get("http://10.24.82.10:8081/initLinks").then( response =>{
                    // 处理json数据
                    var jsonObj = JSON.parse(JSON.stringify(response.data.data));
                    _this.myGraph["links"] = jsonObj
                    // console.log(_this.newGraph.links)
                    console.log(_this.myGraph.links)
                    console.log("成功获取关系")
                    _this.initGraph(_this.myGraph)
                    },response=>{
                    console.log("error")
                    })
                },response=>{
                    console.log("error")
                })


            },
            initGraph(data) {
                var _this = this
                const links = data.links.map(d => Object.create(d));
                const nodes = data.nodes.map(d => Object.create(d));

                const simulation = d3.forceSimulation(nodes)
                    .force("link", d3.forceLink(links).id(d => d.name).distance(200))
                    .force("charge", d3.forceManyBody().strength(-600))
                    .force("x", d3.forceX())
                    .force("y", d3.forceY())
                    .force("center", d3.forceCenter(_this.width / 2 - 10, _this.height / 2));


                // const sv
                // g = d3.create("svg")
                //     .attr("viewBox", [0, 0, width, height]);

                const svg = d3.select(".graph")
                    // .attr("width",200)
                    // .attr("height",564)
                    .append("svg")
                    // .attr("preserveAspectRatio", "xMidYMid meet")
                    .attr("viewBox", [0,0,_this.width ,_this.height]);
                // svg.call(d3.zoom().on("zoom", function () {
                //     g.attr("transform", d3.event.transform)
                // }))
                const g = svg.append("g")
                const link = g.append("g")

                    .attr("stroke", "#999")
                    .attr("stroke-opacity", 0.6)
                    .selectAll("line")
                    .data(links)
                    .join("line")
                    .attr("stroke-width", d => Math.sqrt(d.value));

                const node = g.append("g")
                    .attr("stroke", "#fff")
                    .attr("stroke-width", 1.5)
                    .selectAll("circle")
                    .data(nodes)
                    .join("circle")
                    .attr("r", 30)
                    .attr("fill", _this.color())
                    .call(_this.drag(simulation));


                // node.append("title")
                //     .text(d => d.name);

                const nodeNameText = g.append("g")
                    .selectAll("text")
                    .data(nodes)
                    .join("text")
                    .attr("dx", (function (d) {
                        return -d.name.length * 5
                    }))
                    .attr("dy", 1)
                    .style('font-size', 12)
                    // .style('font-weight', 400)
                    .attr("fill","white")
                    .attr("class", "node-name")
                    .text(function (d) {
                        return d.name
                    })

                simulation.on("tick", () => {
                    link
                        .attr("x1", d => d.source.x)
                        .attr("y1", d => d.source.y)
                        .attr("x2", d => d.target.x)
                        .attr("y2", d => d.target.y);

                    node
                        .attr("cx", d => d.x)
                        .attr("cy", d => d.y);

                    nodeNameText
                        .attr("x", d => d.x)
                        .attr("y", d => d.y);
                });

            },

            color() {
                const scale = d3.scaleOrdinal(d3.schemeCategory10);
                return d => scale(d.group);
            },
            drag(simulation) {
                function dragstarted(d) {
                    if (!d3.event.active) simulation.alphaTarget(0.3).restart();
                    d.fx = d.x;
                    d.fy = d.y;
                }

                function dragged(d) {
                    d.fx = d3.event.x;
                    d.fy = d3.event.y;
                }

                function dragended(d) {
                    if (!d3.event.active) simulation.alphaTarget(0);
                    d.fx = null;
                    d.fy = null;
                }

                return d3.drag()
                    .on("start", dragstarted)
                    .on("drag", dragged)
                    .on("end", dragended);
            },
            onSubmit() {
                console.log('节点搜索');
            },
            Submit_text(){
                console.log('文本导入')
            },
            user_Check(){
                console.log('人工审核')
            },
            put_into_Database() {
                console.log('导入数据库')
            }
        }
    }
</script>

<style>
    #app {
        font-family: Helvetica, sans-serif;
        text-align: center;
        height: 100%;
    }
</style>
