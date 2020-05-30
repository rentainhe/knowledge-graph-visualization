<template>
    <div>
        <div class="header_text">知识图谱系统</div>
<!--        <el-container>-->
        <div class="container">
            <div class = 'left'>
<!--                上传文本的文本框和按钮-->
                <div class="inputText">
                    <div class="textUpLoader">
<!--                        文本框的参数直接在这里面调-->
                        <el-input clearable
                                  type="textarea"
                                  class="textarea"
                                  style="left:5%; top:20%; width: 73%"
                                  :rows="10"
                                  placeholder="请输入内容"
                                  v-model="textarea">
                        </el-input>
                    </div>
                    <div class="textExtract">
                        <div class="extractButton">
                            <el-button class="buttons" type="primary" round=true @click="begin_upload">开始抽取
                                <i class="el-icon-caret-right el-icon--right"></i>
                            </el-button>
                        </div>
                        <div class="backButton" >
                            <el-button class="buttons" type="primary" round=true @click="return_home">返回
                                <i class="el-icon-caret-right el-icon--right"></i>
                            </el-button>
                        </div>
                    </div>
                </div>
<!--                现有知识图谱放置在这个区域-->
                <div class="temp_Graph">

                </div>
            </div>

            <div class="right">
<!--                将抽取出的实体信息放置在这个位置-->
                <div class="table_area">
                    <el-table stripe=true
                              :data="tableData"
                              height="100%"
                              border
                              style="width: 95%;">
                        <el-table-column
                                prop="id"
                                label="序号"
                                width="120"
                                align="center">
                        </el-table-column>
                        <el-table-column
                                prop="extractNode"
                                label="球员"
                                width="120"
                                align="center">
                        </el-table-column>
                        <el-table-column
                                prop="extractTeam"
                                label="球队"
                                width="120"
                                align="center">
                        </el-table-column>
                        <el-table-column
                                prop="content"
                                label="转会内容"
                                align="center">
                        </el-table-column>
                        <el-table-column
                                fixed="right"
                                label="操作"
                                width="180"
                                align="center">
                            <template slot-scope="scope">
                                <el-button @click="handleClick(scope.row)" type="text" size="small">预览</el-button>
                                <!--                                <el-button type="text" size="small" @click="handleEdit(scope.$index,scope.row)">编辑</el-button>-->
                                <el-button type="text" size="small" @click="deleteRow(scope.$index, tableData)">保存</el-button>
                                <el-button type="text" size="small" @click="deleteRow(scope.$index, tableData)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
<!--                这里放预览的图-->
                <div class="newGraph">

                </div>
            </div>
<!--                最初的节点信息，我这边先注释掉，如果有需要再取消注释即可-->
<!--                <div class="buttons">-->
<!--&lt;!&ndash;                    //发送数据&ndash;&gt;-->
<!--                    <el-button type="primary" round=true @click="begin_upload" >确认上传-->
<!--                        <i class="el-icon-upload el-icon&#45;&#45;right"></i>-->
<!--                    </el-button>-->
<!--                </div>-->
<!--                <div class="buttons">-->
<!--                    <el-button type="primary" round=true @click="extract">开始抽取-->
<!--                        <i class="el-icon-caret-right el-icon&#45;&#45;right"></i>-->
<!--                    </el-button>-->
<!--                </div>-->
<!--                <div class="buttons" style="left: auto">-->
<!--                    <el-button type="primary" round=true @click="return_home">返回-->
<!--                        <i class="el-icon-caret-right el-icon&#45;&#45;right"></i>-->
<!--                    </el-button>-->
<!--                </div>-->

        </div>
    </div>
<!--        </el-container>-->
<!--    </el-container>-->
</template>

<script>
    import * as d3 from "d3";

    export default {
        data() {
            return {
                width: 800,
                height: 800,
                g:'',
                svg:'',
                textarea: '',
                tid:'',
                extractNode:'',
                extractTeam:'',
                tableData: [],
                newGraph: {
                    "nodes" : [{"name":"巴塞罗那","group":1,'country':'西班牙','year':1899},{"name":"皮克","group":2,'country':'西班牙','year':1987}
                        ,{"name":"菲尔波","group":2,'country':'西班牙','year':1996},{"name":"格里兹曼","group":2,'country':'法国','year':1991},
                        {"name":"弗兰基·德容","group":2,'country':'荷兰','year':1997},{"name":"阿图尔","group":2,'country':'巴西','year':1996},{"name":"乌姆蒂蒂","group":2,'country':'法国','year':1993},{"name":"罗贝托","group":2,'country':'西班牙','year':1992},{"name":"朗格莱","group":2,'country':'法国','year':1995},
                        // {"name":"卡尔莱斯·佩雷兹","group":2,'country':'西班牙','year':1899},
                        // {"name":"塞梅多","group":2},{"name":"布斯克茨","group":2},{"name":"安苏·法蒂","group":2}
                        // {"id":"苏亚雷斯","group":2},{"id":"拉基蒂奇","group":2},{"id":"阿尔巴","group":2},{"id":"梅西","group":2},{"id":"特尔施特根","group":2}
                    ],
                    "links" : [{"source":"皮克","target":"巴塞罗那","value":"效力"}
                        ,{"source":"菲尔波","target":"巴塞罗那","value":"效力"},{"source":"格里兹曼","target":"巴塞罗那","value":"效力"},{"source":"弗兰基·德容","target":"巴塞罗那","value":"效力"},{"source":"阿图尔","target":"巴塞罗那","value":"效力"},{"source":"乌姆蒂蒂","target":"巴塞罗那","value":"效力"},
                        {"source":"罗贝托","target":"巴塞罗那","value":"效力"},{"source":"朗格莱","target":"巴塞罗那","value":"效力"}
                        // {"source":"塞梅多","target":"巴塞罗那","value":"效力"},{"source":"布斯克茨","target":"巴塞罗那","value":"效力"},{"source":"安苏·法蒂","target":"巴塞罗那","value":"效力"},
                        //     {"source":"苏亚雷斯","target":"巴塞罗那","value":"效力"},{"source":"拉基蒂奇","target":"巴塞罗那","value":"效力"},{"source":"阿尔巴","target":"巴塞罗那","value":"效力"},
                        //     {"source":"梅西","target":"巴塞罗那","value":"效力"},{"source":"特尔施特根","target":"巴塞罗那","value":"效力"}
                    ]

                }
            }
        },
        mounted() {
            this.getAllTexts()
            this.init()
            this.initGraph(this.newGraph)
        },
        methods: {
            //初始图画布
            init:function(){
                this.svg = d3.select(".temp_Graph")
                    .append("svg")
                    .attr("viewBox", [0,0,this.width  ,this.height ])
                    .attr("height", 428)

            },
            //画图
            initGraph(data) {
                var _this = this
                console.log(data)
                this.svg.selectAll("*").remove();
                const links = data.links.map(d => Object.create(d));
                const nodes = data.nodes.map(d => Object.create(d));
                const simulation = d3.forceSimulation(nodes)
                    .force("link", d3.forceLink(links).id(d => d.name).distance(200))
                    .force("charge", d3.forceManyBody().strength(-1500))
                    .force("x", d3.forceX())
                    .force("y", d3.forceY())
                    .force("center", d3.forceCenter(this.width / 2 - 10, this.height / 2));

                this.g = this.svg.append("g")
                const link = this.g.append("g")
                    .attr("stroke", "#999")
                    .attr("stroke-opacity", 0.6)
                    .selectAll("line")
                    .data(links)
                    .join("line")
                    .attr("stroke-width", d => Math.sqrt(d.value));

                const node = this.g.append("g")
                    .attr("stroke", "#fff")
                    .attr("stroke-width", 1.5)
                    .selectAll("circle")
                    .data(nodes)
                    .join("circle")
                    .attr("r", 30)
                    .attr("fill", this.color())
                    .on("click",_this.queryTest)
                    .call(this.drag(simulation))

                const nodeNameText = this.g.append("g")
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
            queryTest(d){
                console.log(d.name);
                this.currentNode.country = d.country;
                this.currentNode.year = d.year;
                this.currentNode.name = d.name;
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
            //获取所有未审核的节点
            getAllTexts:function(){
                var _this = this
                _this.$axios.get("http://10.24.82.10:8088/allText").then(response =>{
                    var jsonObj = JSON.parse(JSON.stringify(response.data.data));
                    console.log(jsonObj)
                    this.tableData = jsonObj
                    _this.Node_lenth = _this.tableData.length
                },response=>{
                    console.log("error")
                })
            },
            extract:function(){
                this.$axios({
                    method:'get',
                    url:'http://10.24.82.10:8088/showExtractNode/' + this.tid,

                }).then(res => {
                    if(res.errno==-1){
                        this.$message("文本有问题")
                    }
                    else{
                        this.extractNode = res.data.data.extractNode
                        this.extractTeam = res.data.data.extractTeam
                        console.log(res)
                        if (this.extractTeam)
                            this.$message('抽取信息：球员：' + this.extractNode + ';   球队: ' + this.extractTeam)
                        else {
                            this.$message('抽取失败')
                        }
                    }
                })
            },

            begin_upload:function(){
                this.$axios({
                    method:'post',
                    url:'http://10.24.82.10:8088/uploadText',
                    data:{
                        content:this.textarea
                    }
                }).then(res => {
                    this.tid = res.data.data.id
                    console.log(res.data)
                    if (!res.errno){
                        this.$message('信息上传成功！正在抽取实体信息');
                        this.extract()
                    }
                    else{
                        this.$message('上传失败！');
                    }
                })
            },
            //点击回主界面
            return_home: function () {
                this.$router.push("/Home")
                location.reload()
            }
        }
    }
</script>

<style>
    .temp_Graph{
        background-color: #15161F;
        /*height: 40%;*/
    }
    .header_text{
        font-family: "PingFang SC";
        font-size: 30px;
        letter-spacing: 6px;
        color: #ffffff;
        height: 15%;
        background-color: #15161F;
    }
    .inputText{
        height:45%;
        /*background-color: #ff7f0e;*/
    }
    .container {
        display: table;
        width: 100%;
        /*height: 100%;*/
        /*background-color: #15161F;*/
    }

    .container .left {
        width: 45%;
        height: 95%;
        position:absolute;
        background-color: #15161F;
    }

    .container .right {
        height:95%;
        position:absolute;
        left: 45%;
        width: 55%;
        /*right: 3%;*/
        background-color: #15161F;
    }
    .container .right .table_area{
        width: 100%;
        height: 40%;
        position: absolute;
        top:5%;
        right: 3%;
        background-color: #15161F;
    }
    .container .right .newGraph{
        width: 100%;
        height: 55%;
        position: absolute;
        top: 45%;
        background-color: aqua;
    }
    .el-main {
        /*position: absolute;*/
        height: 100%;
        background-color: #15161F;
        color: #333;
        text-align: center;
        line-height: 160px;
    }
    .buttons {
        /*background-color: #15161F;*/
        /*top : 5%;*/
        /*height: 200px;*/
        /*position: relative;*/
        position: absolute;
        top: 40%;
        left: 0%;
        bottom: 40%;
        color: #fff;
        background-color: #303252;
        border-color: #9593A7;
        border-width: 2px;

    }
    .el-button {
        /*position: absolute;*/
        /*top: 40%;*/
        /*left: 0%;*/
        /*bottom: 40%;*/
        /*color: #fff;*/
        /*background-color: #303252;*/
        /*border-color: #9593A7;*/
        /*border-width: 2px;*/
    }
    .temp_Graph{
        /*float: right;*/
        position: relative;
        background-color: #ff7f0e;
        height: 55%;
        width: 100%;
    }
    .inputText .textExtract .extractButton{
        position: absolute;
        left: 30%;
        top:5%;
        width: 50%;
        right:24%;
        height: 200px;
    }
    .inputText .textExtract .backButton{
        position: absolute;
        left: 30%;
        top:35%;
        right:22%;
        width: 50%;
        height: 200px;
    }
    .textarea{
        position: absolute;
        top: 10%;
        left: 10%;
        /*background-color: pink;*/
        height: 50%;
        width: 100%;
        background-color: #ff7f0e;
    }
    .inputText .textUpLoader{
        float: left;
        position: absolute;
        left: 5%;
        width: 70%;
        height: 50%;
        background-color: #15161F;
    }
    .inputText .textExtract{
        float: left;
        position: absolute;
        left: 60%;
        width: 30%;
        height: 50%;
        background-color: #15161F;
    }
    /*.graph_temp{*/
    /*    position: relative;*/
    /*    float: bottom;*/
    /*    height: 50%;*/
    /*    background-color: aqua;*/
    /*}*/

    .el-header, .el-footer {
        background-color: #15161F;
        text-align: center;
        line-height: 60px;
    }

    .el-aside {
        position: relative;
        background-color: #15161F;
        color: #333;
        text-align: center;
        line-height: 200px;
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
</style>