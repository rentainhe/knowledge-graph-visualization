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
                                  style="left:5%; top:20%; width: 73%;  "
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
                                <i class="el-icon-s-promotion el-icon--right"></i>
                            </el-button>
                        </div>
                    </div>
                </div>
<!--                现有知识图谱放置在这个区域-->
                <div class="temp_Graph">
                    <p class="temp_Graph_Text"> 现有知识图谱如下所示</p>
                    <el-button id="delete_new_Nodes" class="delete_Nodes" style="display: none" type="primary" round=true @click="refuse_to_add_Node">删除该节点</el-button>
                    <el-button id="add_new_Nodes" class="add_Nodes" style="display: none" type="primary" round=true @click="confirm_to_add_Node">存入数据库</el-button>
                    <el-button id="save_it_later" class="save_nodes_later" style="display: none" type="primary" round=true @click="save_it_later">稍后审核</el-button>
                </div>
            </div>

            <div class="right">
                <div class="Nodes">
                    <h3 class="extractNodesInfo">所抽取到的节点如下</h3>
                    <el-button class="extractPlayer" type="primary"  @click="find_first_relation">{{player}}
                        <i class="el-icon-user el-icon--right"></i>
                    </el-button>
                    <el-button class="extractTeam" type="primary"  @click="find_second_relation">{{team}}
                        <i class="el-icon-football el-icon--right"></i>
                    </el-button>
                </div>
                <div class="Links">
                    <h3 class="extractNodesInfo">所抽取到的关系如下</h3>
                    <el-card class="box-card">
                        <ol>
<!--                            <div  v-for="links in this.table_Graph.links":key="links"  class="text item">-->
                            <div  class="text item">
                                <li>{{this.player+"转会至"+this.team}}</li>
                            </div>
                        </ol>
                    </el-card>
                </div>
                <div class="change_url_buttons">
                    <h3 class="extractNodesInfo">可选择的操作如下</h3>
                    <el-button class="Preview"  round=true type="primary"  @click="show_new_graph">实体预览
                        <i class="el-icon-edit el-icon--right"></i>
                    </el-button>
<!--                    dialogVisible = true-->
<!--                    <el-dialog-->
<!--                            title="预 览"-->
<!--                            :visible.sync="dialogVisible"-->
<!--                            width="30%"-->
<!--                            :before-close="handleClose">-->
<!--                        <span>这里放预览的图片</span>-->
<!--                        <span slot="footer" class="dialog-footer">-->
<!--                            <el-button type="primary" round=true @click="dialogVisible = false">返 回</el-button>-->
<!--                            <el-button type="primary" round=true @click="refuse_to_add_Node">删除该节点</el-button>-->
<!--                            <el-button type="primary" @click="confirm_to_add_Node">存入数据库</el-button>-->
<!--                        </span>-->
<!--                    </el-dialog>-->
                    <el-button class="move_to_check2_button"  round=true type="primary"  @click="move_to_check2">进入文本审核界面
                        <i class="el-icon-edit el-icon--right"></i>
                    </el-button>
                </div>
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
<!--        </el-container>-->
<!--    </el-container>-->
</template>

<script>
    import * as d3 from "d3";

    export default {
        data() {
            return {
                dialogVisible : false,
                player: "球员",
                team:"球队",
                width: 800,
                height: 800,
                g:'',
                svg:'',
                textarea: '',
                tid:'',
                extractNode:'',
                extractTeam:'',
                tableData: [],
                firstGraph: {
                    "nodes":[],
                    "links":[]
                },
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
                },
                table_Graph:{
                    "nodes" : [{"name":null,"group":1,"country":null,"year":null},
                                {"name":null,"group":2,"country":null,"year":null}],
                    "links" : [{"source":null,"target":null,"value":"效力"}]
                }
            }
        },
        mounted() {
            this.getAllTexts()
            this.init()
            this.initGraph(this.newGraph)
        },
        methods: {
            // Dialog的相关方法设置
            // handleClose(done) {
            //     this.$confirm('确认关闭？')
            //         .then(_ => {
            //             done();
            //         })
            //         .catch(_ => {});
            // },
            show_new_graph:function(){
                document.getElementById('delete_new_Nodes').style.display='block'
                document.getElementById('add_new_Nodes').style.display='block'
                document.getElementById('save_it_later').style.display='block'
            },
            save_it_later:function(){
                this.$message("请进入文本审核界面重新审核")
                location.reload()
            },
            refuse_to_add_Node:function(){
              this.$confirm('确认删除本条关系？')
                .then(_ => {
                    //这里传回去拒绝审核的操作
                    // this.dialogVisible = false
                    this.$message("删除成功！")
                    location.reload()
                })
                .catch(_ => {})
            },
            confirm_to_add_Node:function(){
                this.$confirm('确认在数据库中添加该节点关系？')
                    .then(_ => {
                        // 在这里添加入库操作
                        // this.dialogVisible = false
                        this.$message("添加成功！")
                        location.reload()
                    })
                    .catch(_ => {})
            },
            find_first_relation:function(){
                console.log(this.player)
                // this.$axios({
                //     method:'get',
                //     url:'http://10.24.82.10:8088/getNodesByName/' + this.player,
                //
                // }).then(res => {
                // console.log(res.data)
                // if (!res.data.errno){
                //     this.$message("查询成功！")
                //     this.myGraph["nodes"] = JSON.parse(JSON.stringify(res.data.data));
                //     // console.log(this.myGraph["nodes"])
                //     this.$axios({
                //         method:'get',
                //         url:'http://10.24.82.10:8088/getLinksByName/' + this.ask,
                //
                //     }).then(res => {
                //         this.myGraph["links"] = JSON.parse(JSON.stringify(res.data.data));
                //         this.initGraph(this.myGraph)
                //     })
                // }
                // else{
                //     this.$message('无此节点！');
                // }
                // })
                this.firstGraph["nodes"] = [{"name":"巴塞罗那","group":1,'country':'西班牙','year':1899},{"name":"皮克","group":2,'country':'西班牙','year':1987}];
                this.firstGraph["links"] = [{"source":"皮克","target":"巴塞罗那","value":"效力"}];
                this.initGraph(this.firstGraph);

            },
            find_second_relation:function(){
                console.log(this.team)
                // this.$axios({
                //     method:'get',
                //     url:'http://10.24.82.10:8088/getNodesByName/' + this.team,
                //
                // }).then(res => {
                // console.log(res.data)
                // if (!res.data.errno){
                //     this.$message("查询成功！")
                //     this.myGraph["nodes"] = JSON.parse(JSON.stringify(res.data.data));
                //     // console.log(this.myGraph["nodes"])
                //     this.$axios({
                //         method:'get',
                //         url:'http://10.24.82.10:8088/getLinksByName/' + this.ask,
                //
                //     }).then(res => {
                //         this.myGraph["links"] = JSON.parse(JSON.stringify(res.data.data));
                //         this.initGraph(this.myGraph)
                //     })
                // }
                // else{
                //     this.$message('无此节点！');
                // }
                // })
                this.newGraph= {
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

                };
                this.initGraph(this.newGraph);
            },
            //预览，显示一级关系
            showLinks(index, rows) {
                console.log(rows[index].extractNode);
                console.log(rows[index].extractTeam);
                this.table_Graph.nodes[0].name=rows[index].extractTeam
                this.table_Graph.nodes[1].name=rows[index].extractNode
                this.table_Graph.links[0].source=rows[index].extractNode
                this.table_Graph.links[0].target=rows[index].extractTeam
                console.log(this.table_Graph.nodes)
                console.log(this.table_Graph.links)
                this.initGraph(this.table_Graph)
            },
            // 删除行
            deleteRow(index, rows) {
                console.log(rows[index]);
                rows.splice(index, 1);
                this.Node_lenth-=1;
            },
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
                var _this = this
                this.$axios({
                    method:'get',
                    url:'http://10.24.82.10:8088/showExtractNode/' + this.tid,

                }).then(res => {
                    // 等后端
                    console.log("1111111")
                    _this.player=res.data.data.extractNode
                    _this.team=res.data.data.extractTeam
                    if(res.errno==-1){
                        this.$message("文本有问题")
                    }
                    else{
                        this.extractNode = res.data.data.extractNode
                        this.extractTeam = res.data.data.extractTeam
                        _this.player=this.extractNode
                        _this.team=this.extractTeam
                        console.log(res)
                        if (this.extractTeam)
                            {
                                this.$message('抽取信息：球员：' + this.extractNode + ';   球队: ' + this.extractTeam)
                            }
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
            },
            move_to_check2:function () {
                this.$router.push("/Check_2")
                location.reload()
            }
        }
    }
</script>

<style>
    /*.temp_Graph{*/
    /*    background-color: #15161F;*/
    /*    !*height: 40%;*!*/
    /*}*/
    .save_nodes_later{
        position: absolute;
        top:75%;
        left:9%;
        color: #fff;
        background-color: #303252;
        border-color: #9593A7;
        border-width: 2px;
    }
    .add_Nodes{
        position: absolute;
        top:55%;
        left:9%;
        color: #fff;
        background-color: #303252;
        border-color: #9593A7;
        border-width: 2px;
    }
    .delete_Nodes{
        position: absolute;
        top:35%;
        left:10%;
        color: #fff;
        background-color: #303252;
        border-color: #9593A7;
        border-width: 2px;
    }
    .text {
        font-size: 20px;
        font-family: "PingFang SC";
        float: left;
        /*这里的文字位置需要调整*/
        word-break: break-all;
        position: absolute;
        top:10%;
    }

    .item {
        padding: 10px 0;
    }

    .box-card {
        width: 80%;
        position: absolute;
        left: 5%;
        top:30%;
        color: #ffffff;
        background-color: #15161F;
    }

    .extractPlayer{
        position: absolute;
        top:15%;
        left:20%;
        color: #fff;
        background-color: #303252;
        border-color: #9593A7;
        border-width: 2px;
    }
    .extractTeam{
        position: absolute;
        top:15%;
        left:40%;
        color: #fff;
        background-color: #303252;
        border-color: #9593A7;
        border-width: 2px;
    }
    .extractNodesInfo{
        font-family: "PingFang SC";
        position: absolute;
        top:2%;
        left: 5%;
        float: left;
        font-size: 20px;
        letter-spacing: 3px;
        color: #ffffff;
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
        width: 60%;
        height: 100%;
        position:absolute;
        background-color: #15161F;
    }

    .container .right {
        height:100%;
        position:absolute;
        left: 60%;
        width: 40%;
        /*right: 3%;*/
        background-color: #15161F;
    }
    .container .right .Nodes{
        width: 100%;
        height: 30%;
        /*position: absolute;*/
        /*top:5%;*/
        /*right: 3%;*/
        background-color: #15161F;
    }
    .container .right .Links{
        width: 100%;
        height: 30%;
        position: relative;
        /*top: 45%;*/
        background-color: #15161F;
    }
    .container .right .change_url_buttons{
        width: 100%;
        height: 30%;
        position: relative;
        background-color: #15161F;
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
    .Preview{
        position: absolute;
        top:47%;
        right:55%;
        color: #fff;
        background-color: #303252;
        border-color: #9593A7;
        border-width: 2px;
    }
    .move_to_check2_button{
        position: absolute;
        top:85%;
        right:46%;
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
    .temp_Graph_Text{
        font-family: "PingFang SC";
        position: absolute;
        top:5%;
        left: 5%;
        float: left;
        font-size: 20px;
        letter-spacing: 3px;
        color: #ffffff;
    }
    .temp_Graph{
        /*float: right;*/
        position: relative;
        background-color: #15161F;
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
        background-color: pink;
        height: 50%;
        width: 100%;
        /*background-color: #ff7f0e;*/
    }
    .inputText .textUpLoader .textarea .el-textarea__inner{
        background-color: #15161F;
        color: white;
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