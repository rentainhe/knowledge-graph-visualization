<template>
    <div id="app">
        <el-container style="height : 100%">
            <el-header height="48px">
                知识图谱展示
            </el-header>
            <el-container>
                <el-aside width="200px">
                    <el-container>
                        <el-form :inline="true" :model="formInline" class="text_search">
                            <el-form-item>
                                <el-input v-model="formInline.user" placeholder="查询" clearable=1></el-input>
                            </el-form-item>
                            <el-form-item>
                                <el-button icon="el-icon-upload" type="primary" @click="onSubmit">节点查询</el-button>
                            </el-form-item>
                        </el-form>
                        <el-switch
                                v-model="value1" active-text="Text" inactive-text="Nodes">
                        </el-switch>
                    </el-container>
                </el-aside>
                <!--主要区域-->
                <el-main>
                    <!--图谱放置的主要区域-->
                    <el-col :span="18" class="graph">
                        <!--                这是我的图！！！！！！！！！-->
                        <div class="cc"></div>
                    </el-col>
                    <el-col :span="5" :offset="1" class="right-side">
                        <!-- 节点信息区域-->
                        <el-col class="article"></el-col>
                        <!-- 基本功能按钮区域-->
                        <el-button type="primary" round=1 @click="Submit_text" class="el-button–upload">文本导入</el-button>
                        <el-button type="primary" round=1 @click="user_Check" class="el-button-check">人工审核
                            <i class="el-icon-user el-icon--right"></i>
                        </el-button>
                        <el-button type="primary" round=1  @click="put_into_Database" class="el-button–mysql">数据库导入
                            <i class="el-icon-coin el-icon--right"></i>
                        </el-button>
                        <!--              <el-row class="col1"></el-row>-->
                    </el-col>
                </el-main>

            </el-container>

        </el-container>
    </div>
</template>

<style>
    .text_search {
        position: absolute;
        top: 60px;
    }

    .el-button–upload{
        position: absolute;
        top:400px;
        left:90px;
        color: #fff;
        background-color: #303252;
        border-color: #9593A7;
        border-width: 2px;
    }

    .el-button-check {
        position: absolute;
        top: 600px;
        left: 90px;
        color: #fff;
        background-color: #303252;
        border-color: #9593A7;
        border-width: 2px;
    }

    .el-button–mysql {
        position: absolute;
        top: 200px;
        left: 85px;
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
        background-color: #D3DCE6;
        color: #333;
        position: relative;
        text-align: center;
        line-height: 50px;
    }

    .el-main {
        background-color: #E9EEF3;
        color: #333;
        text-align: center;
        line-height: 160px;
    }

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
        height: 640px;
    }

    .graph {
        background-color: teal;
    }

    .right-side {
        position: absolute;
        right: 12px;
    }

    .article {
        background-color: thistle;
        height: 55%;
    }

    .buttons {
        background-color: #15161F;
        height: 45%;
        position: relative;
    }
</style>

<!-- 查询框-->
<script>
    // 画图
    import * as d3 from 'd3'

    export default {
        data() {
            return {
                formInline: {
                    user: '',
                    region: ''
                },
                value1: true,
                width: 600,
                height: 600,
                //放数据的地方
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
                }


            }
        },
        mounted() {
            this.initGraph(this.testGraph)
        },
        methods: {
            initGraph(data) {
                var _this = this
                const links = data.links.map(d => Object.create(d));
                const nodes = data.nodes.map(d => Object.create(d));

                const simulation = d3.forceSimulation(nodes)
                    .force("link", d3.forceLink(links).id(d => d.id).distance(200))
                    .force("charge", d3.forceManyBody().strength(-500))
                    .force("x", d3.forceX())
                    .force("y", d3.forceY());

                // const sv
                // g = d3.create("svg")
                //     .attr("viewBox", [0, 0, width, height]);

                const svg = d3.select(".cc")
                    .append("svg")
                    .attr("viewBox", [-(_this.width) / 2, -(_this.height) / 2, _this.width, _this.height]);
                svg.call(d3.zoom().on("zoom", function () {
                    g.attr("transform", d3.event.transform)
                }))
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


                node.append("title")
                    .text(d => d.id);

                const nodeNameText = g.append("g")
                .selectAll("text")
                .data(nodes)
                .join("text")
                // .attr("dx", 4)
                // .attr("dy", 4)
                .attr("class", "node-name")
                .text(function (d) {
                   return d.id
                })
                // console.log(nodeNameText)
                    // .attr("x", 8)
                    // .attr("y", "0.31em")
                    // .text(d => d.id)
                    // .clone(true).lower()
                    // .attr("fill", "none")
                    // .attr("stroke", "#000")
                    // .attr("stroke-width", 3);

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
