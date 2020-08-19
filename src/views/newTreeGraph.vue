<template>
    <div>
        <div class="header_text">知识图谱系统</div>
        <div class="container">
            <!--            <div class="left"></div>-->
            <div class="main">
                <div class="label" style="position: absolute; top: 1.8%; left: 5%">
                    <el-tabs v-model="activateName" type="card" @tab-click="handleClick">
                        <el-tab-pane label="装备类型树" name="equipmentType"></el-tab-pane>
                        <el-tab-pane label="装备树" name="equipmentTree"></el-tab-pane>
                        <el-tab-pane label="单位树" name="unitTree"></el-tab-pane>
                    </el-tabs>
                </div>
                <div id="knowledgeTreeSet" style="position: absolute;top:6%;left: 5%;background-color: #15161F; border:1px solid #ffffff" :style="{width: '50%', height: '85%'}">
                    <div id="myChart" style="position: absolute;top:0%;left: 0%;" :style="{width: '100%', height: '100%'}"></div>
                </div>
                <div class="attributeList">
<!--                    节点属性列表-->
                    <el-table :data="attributeTable" highlight-current-row height="100%" border style="width: 100%">
                        <el-table-column prop="attributeName" label="当前节点对应属性" width="150"></el-table-column>
                        <el-table-column prop="content" label="属性内容" width="300"></el-table-column>
                        <el-table-column prop="content" label="可选操作">
                            <template slot-scope="scope">
                                <el-button
                                    size="mini"
                                    @click="editCurrentNodeAttribute(scope.$index,scope.row)">编辑</el-button>
                                <el-button
                                    size="mini"
                                    type="danger"
                                    @click="deleteCurrentNodeAttribute(scope.$index,scope.row)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
                <div class="operation" style="border:2px solid #ffffff">
                    <div class="chosenNodeName">当前选择节点:{{this.currentNodeName}}</div>
                    <el-button type="primary" round=true @click="addChildNode" class="addChildNode">添加子节点
                        <i class="el-icon-s-promotion el-icon-circle-plus-outline"></i>
                    </el-button>
<!--                    添加一个对话框来进行节点属性填充-->
                    <el-dialog title="添加节点属性" :visible.sync="addNodeFormVisible" width="30%">
                        <el-form ref="form" label-width="100px">
                            <el-form-item v-for="(key,value,index) in addnewNodeWithAttribute" :key="index">
                                <div v-if="key.attributeName!==currentParentId">
                                    <el-form-item :label="key.attributeName" class="attributeNameText">
                                        <el-input v-model="key.content"></el-input>
                                    </el-form-item>
                                </div>
                            </el-form-item>
                        </el-form>
                        <div slot="footer" class="dialog-footer">
                            <el-button @click="addNodeFormVisible = false">取消</el-button>
                            <el-button tyoe="primary" @click="uploadNewNode">确定</el-button>
                        </div>
                    </el-dialog>
                    <el-button type="danger" round=true @click="deleteCurrentNode" class="deleteCurrentNode">删除当前节点
                        <i class="el-icon-s-promotion el-icon-delete"></i>
                    </el-button>
                </div>
                <el-button type="primary" round=true @click="Back_to_homepage" class="back_to_homepage">返回首页
                    <i class="el-icon-s-promotion el-icon--right"></i>
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
                treeData:'',
                activateName:'equipmentType',
                addNodeFormVisible:false, // 用于控制对话框是否弹出
                currentNodeName:"", // 当前选中的节点名字
                currentNodeType:"EquipmentType", //当前选中的节点属于哪个知识树， 默认值为EquipmentType、

                currentAddChildNodeOperation:"/addEquipmentType", // 后端添加节点的URL不同，所以添加一个变量来进行控制
                currentDeleteNodeOperation:"/deleteEquipmentType/",
                currentParentId:'pid', // 存放对应当前节点id的那个attribute的值
                currentParentAttributeName:'装备类型ID', // 存放当前节点对应父亲节点id的那个attribute的值
                addnewNodeWithAttribute:[], // 存放添加节点的属性
                attributeTable:[] // 存放读取到的属性列表
            }
        },
        mounted() {
            this.getEquipmentTypeTree()
            // this.Draw_graph(this.data);
        },
        methods: {
            editCurrentNodeAttribute:function(){
                console.log(index,row)
                this.$prompt('请输入修改的值','修改'+row.attributeName,{
                    confirmButtonText:'确定',
                    cancelButtonText:'取消'
                }).then(({value})=>{
                    this.$message({
                        type:'success',
                        message:'修改的信息为'+value
                    });
                }).catch(()=>{
                    this.$message({
                        type:'info',
                        message:'取消输入'
                    })
                })
            },
            deleteCurrentNodeAttribute:function(index,row){
                // row.splice(index,1)
                console.log(index,row)
                this.$confirm('此操作将永久删除该属性，是否继续？','提示',{
                    confirmButtonText:'确定',
                    cancelButtonText:'取消',
                    type:'warning'
                }).then(({value})=>{
                    this.$message({
                        type:'success',
                        message:'删除成功！'
                    });
                }).catch(()=>{
                    this.$message({
                        type:'info',
                        message:'已取消删除'
                    })
                })
            },
            deleteCurrentNode:function(){
                this.$confirm("确认删除该节点？").then(()=>{
                    this.$axios({
                        method:'post',
                        url:"http://192.168.1.2:8088/"+this.currentDeleteNodeOperation+this.currentNodeName
                    }).then(res=>{
                        this.myChart.clear()
                        if(this.currentNodeType=="EquipmentType"){
                            this.getEquipmentTypeTree()
                        }
                        else if(this.currentNodeType=="EquipmentTree"){
                            this.getEquipmentTree()
                        }
                        else if(this.currentNodeType=="UnitSequence"){
                            this.getUnitTree()
                        }
                        this.$message("删除成功")
                    })
                })
            },
            uploadNewNode:function(){
                console.log(this.addnewNodeWithAttribute)
                console.log(this.currentNodeName)
                var obj = new Object()
                for(var i in this.addnewNodeWithAttribute){
                    obj[this.addnewNodeWithAttribute[i].attributeName] = this.addnewNodeWithAttribute[i].content;
                }
                console.log(obj)
                this.$axios({
                    method:'post',
                    url:"http://192.168.1.2:8088/"+this.currentAddChildNodeOperation,
                    data:obj
                }).then(res=>{
                    this.$message("添加成功")
                    this.addNodeFormVisible=false
                    this.myChart.clear()
                    if(this.currentNodeType=="EquipmentType"){
                        this.getEquipmentTypeTree();
                    }
                    else if(this.currentNodeType=="EquipmentTree"){
                        this.getEquipmentTree();
                    }
                    else if(this.currentNodeType=="UnitSequence"){
                        this.getUnitTree();
                    }
                }).catch(error=>{
                    console.log(error.config)
                })
            },
            addChildNode:function(){
                this.$axios({
                    method:'get',
                    url:'http://192.168.1.2:8088/getEmptyAttributeByTable/'+this.currentNodeType
                }).then(res=>{
                    this.addnewNodeWithAttribute = res.data.data
                    for(let i=0,len=this.addnewNodeWithAttribute.length;i<len;i++){
                        if(this.addnewNodeWithAttribute[i].attributeName == this.currentParentId){
                            // 先找到当前所点击节点中，自身id
                            for(let j=0,leng = this.attributeTable.length; j<len;j++){
                                if(this.attributeTable[j].attributeName==this.currentParentAttributeName){
                                    // 再找到子节点对应其父亲节点id的部分，让其子节点的pid与自身id相同
                                    this.addnewNodeWithAttribute[i].content = this.attributeTable[j].content
                                    console.log(this.addnewNodeWithAttribute[i].content)
                                }
                            }
                        }
                    }
                })
                this.addNodeFormVisible = true
            },
            handleClick(tab,event){
                if(tab.name=="equipmentType"){
                    this.myChart.clear()
                    this.currentNodeType = "EquipmentType"
                    this.currentAddChildNodeOperation = "/addEquipmentType"
                    this.currentDeleteNodeOperation = "/deleteEquipmentType/"
                    this.currentParentId = "pid"
                    this.currentParentAttributeName = "装备类型ID"
                    this.getEquipmentTypeTree()
                }
                else if(tab.name=="equipmentTree"){
                    this.myChart.clear()
                    this.currentNodeType = "EquipmentTree"
                    this.currentAddChildNodeOperation = "/addEquipmentTree"
                    this.currentDeleteNodeOperation = "/deleteEquipmentTree/"
                    this.currentParentId = "装备类型ID"
                    this.currentParentAttributeName = "装备ID"
                    this.getEquipmentTree()
                }
                else if(tab.name=="unitTree"){
                    this.myChart.clear()
                    this.currentNodeType = "UnitSequence"
                    this.currentAddChildNodeOperation = "/addUnitSequence"
                    this.currentDeleteNodeOperation = "/deleteUnitSequence/"
                    this.currentParentId = "pid"
                    this.currentParentAttributeName = "装备类型ID"
                    this.getUnitTree()
                }
            },
            // 获取装备类型树节点信息
            getEquipmentTypeTree:function(){
                // console.log(1111);
                this.$axios({
                    method:'get',
                    url:"http://192.168.1.2:8088/getEquipmentTypeLevelRelation"
                }).then(res =>{
                    this.treeData = ''
                    this.treeData = toTree(res.data.data);
                    console.log(this.treeData);
                    console.log(1);
                    this.Draw_graph(this.treeData);
                    function toTree(data) {
                        // console.log(data);
                        // 删除 所有 children,以防止多次调用
                        data.forEach(function (item) {
                            delete item.children;
                        });

                        // 将数据存储为 以 id 为 KEY 的 map 索引数据列
                        var map = {};
                        data.forEach(function (item) {
                            map[item.id] = item;
                        });
                        // console.log(map);

                        var val = [];
                        data.forEach(function (item) {

                            // 以当前遍历项，的pid,去map对象中找到索引的id
                            var parent = map[item.pid];
                            // console.log(parent);
                            // 好绕啊，如果找到索引，那么说明此项不在顶级当中,那么需要把此项添加到，他对应的父级中
                            if (parent !== item) {

                                (parent.children || ( parent.children = [] )).push(item);
                                // console.log(parent);
                            } else {
                                //如果没有在map中找到对应的索引ID,那么直接把 当前的item添加到 val结果集中，作为顶级
                                val.push(item);
                            }
                        });
                        return val;
                    }
                })
            },
            // 获取装备类型树节点信息
            getUnitTree:function(){
                // console.log(1111);
                this.$axios({
                    method:'get',
                    url:"http://192.168.1.2:8088/getUnitSequenceLevelRelation"
                }).then(res =>{
                    this.treeData = ''
                    this.treeData = toTree(res.data.data);
                    console.log(this.treeData);
                    console.log(1);
                    this.Draw_graph(this.treeData);
                    function toTree(data) {
                        // console.log(data);
                        // 删除 所有 children,以防止多次调用
                        data.forEach(function (item) {
                            delete item.children;
                        });

                        // 将数据存储为 以 id 为 KEY 的 map 索引数据列
                        var map = {};
                        data.forEach(function (item) {
                            map[item.id] = item;
                        });
                        // console.log(map);

                        var val = [];
                        data.forEach(function (item) {

                            // 以当前遍历项，的pid,去map对象中找到索引的id
                            var parent = map[item.pid];
                            // console.log(parent);
                            // 好绕啊，如果找到索引，那么说明此项不在顶级当中,那么需要把此项添加到，他对应的父级中
                            if (parent !== item) {

                                (parent.children || ( parent.children = [] )).push(item);
                                // console.log(parent);
                            } else {
                                //如果没有在map中找到对应的索引ID,那么直接把 当前的item添加到 val结果集中，作为顶级
                                val.push(item);
                            }
                        });
                        return val;
                    }
                })
            },
            // 获取装备类型树节点信息
            getEquipmentTree:function(){
                // console.log(1111);
                this.$axios({
                    method:'get',
                    url:"http://192.168.1.2:8088/getEquipmentTreeLevelRelation"
                }).then(res =>{
                    this.treeData = ''
                    this.treeData = toTree(res.data.data);
                    console.log(this.treeData);
                    console.log(1);
                    this.Draw_graph(this.treeData);
                    function toTree(data) {
                        // console.log(data);
                        // 删除 所有 children,以防止多次调用
                        data.forEach(function (item) {
                            delete item.children;
                        });

                        // 将数据存储为 以 id 为 KEY 的 map 索引数据列
                        var map = {};
                        data.forEach(function (item) {
                            map[item.id] = item;
                        });
                        // console.log(map);

                        var val = [];
                        data.forEach(function (item) {

                            // 以当前遍历项，的pid,去map对象中找到索引的id
                            var parent = map[item.pid];
                            // console.log(parent);
                            // 好绕啊，如果找到索引，那么说明此项不在顶级当中,那么需要把此项添加到，他对应的父级中
                            if (parent !== item) {

                                (parent.children || ( parent.children = [] )).push(item);
                                // console.log(parent);
                            } else {
                                //如果没有在map中找到对应的索引ID,那么直接把 当前的item添加到 val结果集中，作为顶级
                                val.push(item);
                            }
                        });
                        return val;
                    }
                })
            },
            Draw_graph:function(treedata){
                var checkName= ' ';
                this.myChart = this.$echarts.init(document.getElementById('myChart'))
                let that = this
                var Option = {
                    calculable: false,
                    // tooltip: {
                    //     trigger: 'item',
                    //     triggerOn: 'mousemove'
                    // },
                    series:[
                        {
                            type: 'tree',
                            name: '装备树',
                            symbolSize:[60,30],
                            edgeShape: 'polyline',
                            expandAndCollapse: true,
                            initialTreeDepth: 0,      //控制树图有几层
                            symbol: 'roundRect',
                            orient: 'horizontal', // vertical horizontal
                            rootLocation:{x:'center', y:50}, //根节点位置
                            nodePadding:20,
                            itemStyle:{
                                normal:{
                                    color: function (param) {
                                        console.log(checkName)
                                        // 通过判断选中的名字改变柱子的颜色样式
                                        if(checkName===param.name){
                                            return '#ff8040';
                                        }else{
                                            return '#c23531';
                                        }
                                    },
                                    label:{
                                        show:true,
                                        formatter:"{b}",
                                        color: '#fff'
                                    },
                                    lineStyle:{
                                        shadowColor: '#000',
                                        shadowBlur: 3,
                                        shadowOffsetX: 3,
                                        shadowOffsetY: 5
                                    }
                                },
                                emphasis:{
                                    label:{
                                        show:true
                                    }
                                }
                            },
                            data:treedata,
                            animationDuration: 550,
                            animationDurationUpdate: 750
                        }
                    ]
                };
                this.myChart.setOption(Option);

                this.myChart('mouseup', function (param) {
                    that.currentNodeName = param.name
                    checkName = param.name
                    this.$axios({
                        method:'get',
                        url:'http://192.168.1.2:8088/getAttributeByTableAndName/'+that.currentNodeType+"/"+that.currentNodeName
                    }).then(res=>{
                        that.attributeTable = res.data.data
                    })
                })
            },
            Back_to_homepage:function () {
                this.$router.push("/")
            }
        }
    }
</script>

<style scoped>
    .deleteCurrentNode{
        position: absolute;
        right:20%;
        top:50%;
    }
    .addChildNode{
        position: absolute;
        left:19%;
        top:50%;
    }
    .attributeNameText{
        font-family: "PingFang SC";
        font-size: 25px;
        letter-spacing: 2px;
        text-align: left;
    }
    .chosenNodeName{
        font-family: "PingFang SC";
        font-size: 25px;
        letter-spacing: 6px;
        color:#ffffff;
        text-align: center;
        width:100%;
        height:27%;
        background-color: #15161F;
        border-bottom: 2px solid;
        border-color: white;
    }
    .operation{
        width: 37%;
        height:15%;
        position: absolute;
        left: 59%;
        top:50%;
        background-color: #15161F;
    }
    .attributeList{
        width: 37%;
        height:40%;
        position: absolute;
        left:59%;
        top:6%;
        background-color: #ff7f0e;
    }
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
        top: 87%;
        left: 87%;
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