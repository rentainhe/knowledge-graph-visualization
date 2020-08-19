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
            <div class="right">
                <el-card id="Attribute" class="box-card" >
                    <div slot="header" class="clearfix">
                        <span>节点属性</span>
                        <!--                        <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>-->
                    </div>
                    <div v-for="(item, index) in currentNodeAttribute"  class="text item">
                        {{item}}
                        <el-button style="float: right; padding: 3px 0 ;position: absolute;right: 20%" type="text" @click="editAttribute(index)">修改</el-button>
                        <el-button style="float: right; padding: 3px 0;position: absolute;right: 8%" type="text" @click="deleteAttribute(index)">删除</el-button>

                    </div>
                </el-card>
                <el-button id="addAttribute" style="display: none" type="primary" round=true  @click="addAttrubute" class="el-button–Edit">新增属性
                    <i class="el-icon-coin el-icon--right"></i>
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
            Draw_graph:function(data){
                this.myChart = this.$echarts.init(document.getElementById('myChart'))
                var option = {
                    tooltip: {
                        trigger: 'item',
                        triggerOn: 'mousemove'
                    },
                    series:[
                        {
                            type: 'tree',
                            id: 0,
                            name: 'tree1',
                            data: [data],

                            top: '10%',
                            left: '8%',
                            bottom: '22%',
                            right: '20%',
                            symbolSize: 7,

                            edgeShape: 'polyline',
                            edgeForkPosition: '63%',
                            initialTreeDepth: 0,      //控制树图有几层

                            lineStyle: {
                                width: 2
                            },

                            label: {
                                backgroundColor: '#15161F',
                                position: 'left',
                                verticalAlign: 'middle',
                                align: 'right',
                                color: '#fff'
                            },

                            leaves: {
                                label: {
                                    position: 'right',
                                    verticalAlign: 'middle',
                                    align: 'left',
                                    color: '#fff'
                                }
                            },

                            expandAndCollapse: true,
                            animationDuration: 550,
                            animationDurationUpdate: 750
                        }
                    ]
                };
                this.myChart.setOption(option);
            },
            Back_to_homepage:function () {
                this.$router.push("/Home")
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