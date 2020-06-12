<template>
    <el-container style="height : 100%">
        <el-header height="8%" class="header_text">
            知识图谱展示
        </el-header>
        <el-container>
            <el-aside width="25%">
                <!--                    <el-container>-->
                <div class="indicator">
                    <div><span class="span" style="background-color: white"></span>节点列表</div>
                    <div><span class="span" style="background-color: #ff7f0e"></span>球员</div>
                    <div><span class="span" style="background-color: #1f77b4"></span>所属球队</div>
<!--                    <div><el-button>一级关系</el-button></div>-->
<!--                    <div><el-button>二级关系</el-button></div>-->
                </div>
                <div class="relation_change">
                    <div><el-button type="primary" round=true class="one_relation" @click="oneRelation">一级关系</el-button></div>
                    <div><el-button type="primary" round=true class="second_relation" @click="secondRelation">二级关系</el-button></div>
                </div>
                <el-col :span="4" :offset="3">
                    <el-form :model="formInline" class="text_search">
                        <el-form-item>
                            <el-input v-model="ask" placeholder="查询" clearable=1></el-input>
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
                    <el-card class="box-card" id="Player_info" style="display: none">
                        <div slot="header" class="clearfix">
                            <span class="text item">节点信息</span>
                        </div>
                        <div class="text item" v-for="(val,key,i) in currentPlayerNode" >
                            {{key}}:{{val}}
                        </div>
                    </el-card>
                    <el-card class="box-card" id="Team_info" style="display: none">
                        <div slot="header" class="clearfix">
                            <span class="text item">节点信息</span>
                        </div>
                        <div class="text item" v-for="(val,key,i) in currentTeamNode" >
                            {{key}}:{{val}}
                        </div>
                    </el-card>
                </div>
                <!-- 基本功能按钮区域-->
                <div class="buttons">
                    <el-button type="primary" round=true @click="change_to_text" class="el-button–upload">文本导入
                        <i class="el-icon-upload el-icon--right"></i>
                    </el-button>
                    <el-button type="primary" round=true @click="user_Check" class="el-button-check">人工审核
                        <i class="el-icon-user el-icon--right"></i>
                    </el-button>
                    <el-button type="primary" round=true  @click="put_into_Database" class="el-button–mysql">数据库导入
                        <i class="el-icon-coin el-icon--right"></i>
                    </el-button><!--              <el-row class="col1"></el-row>-->
                    <el-button type="primary" round=true  @click="Edit_knowledge_tree" class="el-button–Knowledge_tree">知识树编辑
                        <i class="el-icon-coin el-icon--right"></i>
                    </el-button>
                </div>
            </el-col>
            <!--                </el-main>-->

        </el-container>

    </el-container>
</template>

<style>
    .text {
        font-size: 14px;
        color: #ffffff;
    }

    .item {
        margin-bottom: 18px;
    }

    .clearfix:before,
    .clearfix:after {
        display: table;
        content: "";
    }
    .clearfix:after {
        color : #ffffff;
        clear: both
    }

    .box-card {
        background-color: #15161F;

        width: 80%;
    }
    .one_relation{
        left: 25%;

        color: #fff;
        background-color: #303252;
        border-color: #9593A7;
        border-width: 2px;
    }
    .second_relation{
        left: 25%;

        color: #fff;
        background-color: #303252;
        border-color: #9593A7;
        border-width: 2px;
    }
    .header_text{
        font-family: "PingFang SC";
        font-size: 30px;
        letter-spacing: 5px;
        color: #ffffff;
    }
    .relation_change{
        text-align: left;
        color: #f2f2f2;
        font-size: 12px;
        position: absolute;
        top: 70%;
        left: 30%;
    }
    /*节点列表*/
    .indicator{
        text-align: left;
        color: #f2f2f2;
        font-size: 12px;
        position: absolute;
        left: 30%;
        bottom: 40%;
    }
    /*节点样式*/
    .span{
        display: inline-block;
        width: 30px;
        height: 14px;
        position: relative;
        top:2px;
        margin-right: 8px;
    ;
    }
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
        top:5%;
        left:27%;
        color: #fff;
        background-color: #303252;
        border-color: #9593A7;
        border-width: 2px;
    }
    /*人工检查按钮样式*/
    .el-button-check {
        position: absolute;
        top: 27%;
        left: 25%;
        color: #fff;
        background-color: #303252;
        border-color: #9593A7;
        border-width: 2px;
    }
    /*导入数据库按钮设置*/
    .el-button–mysql {
        position: absolute;
        top: 49%;
        left: 24%;
        color: #fff;
        background-color: #303252;
        border-color: #9593A7;
        border-width: 2px;
    }
    .el-button–Knowledge_tree{
        position: absolute;
        top: 71%;
        left: 24%;
        color: #fff;
        background-color: #303252;
        border-color: #9593A7;
        border-width: 2px;
    }
    .el-header, .el-footer {
        background-color: #15161F;
        color: #ffffff;
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
                ask:'',
                value1: true,
                width: 800,
                height: 800,
                currentPlayerNode:{
                },
                currentTeamNode:{
                },
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
                firstGraph: {
                    "nodes" : [],
                    "links" : []
                },
                myGraph:{
                    "nodes": [],
                    "links": []
                },
                g:'',
                svg:'',
            }
        },
        mounted() {
            // var _this = this
            // this.getData()
            // this.printData()
            this.init()
            this.getData()
            // location.reload()
            // this.initGraph(this.newGraph)
        },
        methods: {
            init:function(){
                // this.svg.selectAll("*").remove();
                this.svg = d3.select(".graph")
                    .append("svg")
                    .attr("viewBox", [0,0,this.width ,this.height]);

            },
            //一级关系
            oneRelation:function(){
                console.log(this.ask)
                this.$axios({
                    method:'get',
                    url:'http://10.24.82.10:8088/getOneLevelNode/' + this.ask,

                }).then(res => {
                    console.log(res.data)
                    if (!res.data.errno){
                        // this.$message("查询成功！")
                        this.myGraph["nodes"] = JSON.parse(JSON.stringify(res.data.data));
                        // console.log(this.myGraph["nodes"])
                        this.$axios({
                            method:'get',
                            url:'http://10.24.82.10:8088/getOneLevelRelation/' + this.ask,

                        }).then(res => {
                            this.myGraph["links"] = JSON.parse(JSON.stringify(res.data.data));
                            this.initGraph(this.myGraph)
                        })
                    }
                })
            },
            //二级关系
            secondRelation:function(){
                console.log(this.ask)
                this.$axios({
                    method:'get',
                    url:'http://10.24.82.10:8088/getTwoLevelNode/' + this.ask,

                }).then(res => {
                    console.log(res.data)
                    if (!res.data.errno){
                        this.myGraph["nodes"] = JSON.parse(JSON.stringify(res.data.data));
                        // console.log(this.myGraph["nodes"])
                        this.$axios({
                            method:'get',
                            url:'http://10.24.82.10:8088/getTwoLevelRelation/' + this.ask,

                        }).then(res => {
                            this.myGraph["links"] = JSON.parse(JSON.stringify(res.data.data));
                            this.initGraph(this.myGraph)
                        })
                    }
                })

            },

            //上传文件界面
            change_to_text:function(){
                this.$router.push("/TextUpload")
                location.reload()
            },
            // axios读取本地static文件夹下的json文件
            printData(){
                console.log(this.myGraph["links"])
            },
            // setData(),
            getData(){
                // var _this = this
                this.$axios.get("http://10.24.82.10:8088/initNodes").then( response =>{
                    // 处理json数据
                    var jsonObj = JSON.parse(JSON.stringify(response.data.data));
                    this.myGraph["nodes"] = jsonObj
                    console.log(this.myGraph.nodes)
                    console.log("成功获取节点")
                    // console.log(response.data.data)
                    this.$axios.get("http://10.24.82.10:8088/initRelations").then( response =>{
                        // 处理json数据
                        var jsonObj = JSON.parse(JSON.stringify(response.data.data));
                        this.myGraph["links"] = jsonObj
                        // console.log(_this.newGraph.links)
                        console.log(this.myGraph.links)
                        console.log("成功获取关系")
                        this.initGraph(this.myGraph)
                    },response=>{
                        console.log("error")
                    })
                },response=>{
                    console.log("error")
                })
            },
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
                console.log(d.name)
                console.log(d.id)
                console.log(d.group)
                // this.currentPlayerNode.country = d.country;
                // this.currentPlayerNode.year = d.year;
                // this.currentPlayerNode.name = d.name;
                // document.getElementById
                if(d.group==1){
                    this.$axios.get("http://10.24.82.10:8088/getAttribute/"+String(d.id)).then(response=>{
                        console.log(response.data.data)
                        document.getElementById('Team_info').style.display = 'none'
                        document.getElementById('Player_info').style.display = 'block'
                        // this.currentPlayerNode.number = response.data.data['球员编号']
                        var jsonObj = JSON.parse(JSON.stringify(response.data.data));
                        // console.log(jsonObj)
                        this.currentPlayerNode = jsonObj
                        // this.currentPlayerNode.PlayerName = d.name
                        // this.currentPlayerNode.number = jsonObj['球员编号']
                        // this.currentPlayerNode.age = jsonObj['年龄']
                        // this.currentPlayerNode.country = jsonObj['国籍']
                        // this.currentPlayerNode.TeamName = jsonObj['球队名']
                        // this.currentPlayerNode.responsibility = jsonObj['职责']
                    },response=>{
                        console.log('error')
                    })
                }
                else {
                    this.$axios.get("http://10.24.82.10:8088/getAttribute/"+String(d.id)).then(response=>{
                        console.log(response.data.data)
                        document.getElementById('Player_info').style.display = 'none'
                        document.getElementById('Team_info').style.display = 'block'
                        // this.currentPlayerNode.number = response.data.data['球员编号']
                        // console.log(response.data.data)
                        var jsonObj = JSON.parse(JSON.stringify(response.data.data))
                        this.currentTeamNode = jsonObj


                    },response=>{
                        console.log('error')
                    })
                }
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
            onSubmit:function(){
                console.log(this.ask)
                this.$axios({
                    method:'get',
                    url:'http://10.24.82.10:8088/getOneLevelNode/' + this.ask,

                }).then(res => {
                    console.log(res.data)
                    if (!res.data.errno){
                        this.$message("查询成功！")
                        this.myGraph["nodes"] = JSON.parse(JSON.stringify(res.data.data));
                        // console.log(this.myGraph["nodes"])
                        this.$axios({
                            method:'get',
                            url:'http://10.24.82.10:8088/getOneLevelRelation/' + this.ask,

                        }).then(res => {
                            this.myGraph["links"] = JSON.parse(JSON.stringify(res.data.data));
                            this.initGraph(this.myGraph)
                        })
                        this.initGraph(this.myGraph)
                    }
                    else{
                        this.$message('无此节点！');
                    }
                })
                // if(this.ask === "皮克"){
                //     this.firstGraph["nodes"] = [{"name":"巴塞罗那","group":1,'country':'西班牙','year':1899},{"name":"皮克","group":2,'country':'西班牙','year':1987}];
                //     this.firstGraph["links"] = [{"source":"皮克","target":"巴塞罗那","value":"效力"}];
                //     this.initGraph(this.firstGraph);
                // }
            },
            Submit_text(){
                console.log('文本导入')
            },
            //跳转审核界面
            user_Check:function(){
                this.$router.push("/Check_1")
            },
            put_into_Database() {
                console.log('导入数据库')
            },
            Edit_knowledge_tree(){
                this.$router.push("/Knowledge_tree")
                location.reload()
            }
        }
    }
</script>

<style scoped>

</style>
