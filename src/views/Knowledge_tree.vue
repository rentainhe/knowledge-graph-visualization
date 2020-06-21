<template>
    <div>
        <div class="header_text">知识图谱系统</div>
        <div class="container">

            <el-dialog
                    title="添加节点"
                    :visible.sync="dialogVisible"
                    width="20%"
                    :before-close="DialogClose">
                <div class="NodeNameInput">
                    <el-input placeholder="需要插入的节点名称" v-model="Nodename" clearable>
                        <template slot="prepend">节点名</template>
                    </el-input>
                </div>
<!--                <div class="MySQLNameInput">-->
<!--                    <p></p>-->
<!--&lt;!&ndash;                    加入一个空行，看起来更舒服&ndash;&gt;-->
<!--                    <el-input placeholder="节点对应的属性表名" v-model="MySQLName" clearable>-->
<!--                        <template slot="prepend">属性表</template>-->
<!--                    </el-input>-->
<!--                </div>-->
                <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="add_node">确 定</el-button>
                </span>
            </el-dialog>

            <div class="left">
                <div id="myChart" style="position: absolute;top:5%;left: 20%" :style="{width: '537px', height: '500px'}"></div>
<!--                <el-radio-group id="El-radio-group" class="header_button" v-model="isCollapse" style="margin-bottom: 20px;display: block" @change="Edit">-->
<!--                    <el-radio-button :label="false" >展开</el-radio-button>-->
<!--                    <el-radio-button :label="true" >收起</el-radio-button>-->
<!--                </el-radio-group>-->
                <div class="buttons" id="buttons" style="display: none">
                    <el-button round  class="addNodes" @click="OpenDialog">添加节点</el-button>
                    <el-button round class="deleteNodes" @click="delete_node">删除节点</el-button>
                </div>
                <el-switch
                        class="header_button"
                        v-model="isCollapse"
                        active-text="展开"
                        :width="54"
                        inactive-text="收起">
                </el-switch>
                <el-menu id="El-menu"  style="display:block;" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose" :collapse="isCollapse">
                    <el-menu-item index="1">
<!--                        <template slot="title">-->
<!--                            <i class="el-icon-location"></i>-->
<!--                            <span slot="title">导航一</span>-->
<!--                        </template>-->
<!--                        <el-menu-item-group>-->
<!--                            <span slot="title">分组一</span>-->
<!--                            <el-menu-item index="1-1">选项1</el-menu-item>-->
<!--                            <el-menu-item index="1-2">选项2</el-menu-item>-->
<!--                        </el-menu-item-group>-->
<!--                        <el-menu-item-group title="分组2">-->
<!--                            <el-menu-item index="1-3">选项3</el-menu-item>-->
<!--                        </el-menu-item-group>-->
<!--                        <el-submenu index="1-4">-->
<!--                            <span slot="title">选项4</span>-->
<!--                            <el-menu-item index="1-4-1">选项1</el-menu-item>-->
<!--                        </el-submenu>-->
                        <i class="el-icon-s-flag"></i>
                        <span slot="title">联赛</span>
                    </el-menu-item>
                    <el-menu-item index="2">
                        <i class="el-icon-football"></i>
                        <span slot="title">球队</span>
                    </el-menu-item>
                    <el-submenu index="3">
                        <template slot="title">
                            <i class="el-icon-user-solid"></i>
                            <span slot="title">球员</span>
                        </template>
                        <el-menu-item-group>
                            <span slot="title" style="text-align: center">球员位置</span>
                            <el-menu-item index="3-1" @click.native="Edit_Q">前锋</el-menu-item>
                            <el-menu-item index="3-2">后卫</el-menu-item>
                            <el-menu-item index="3-3">守门员</el-menu-item>
                        </el-menu-item-group>
                    </el-submenu>
                </el-menu>

                <el-button type="primary" round=true  @click="back_home" class="el-button–Edit">返回
                    <i class="el-icon-coin el-icon--right"></i>
                </el-button>

            </div>
            <div class="right">
                <el-card id="Attribute" class="box-card" style="display: none">
                    <div slot="header" class="clearfix">
                        <span>{{currentNode}}节点属性</span>
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
    import Vue from "vue";

    export default {
        data() {
            return {
                Nodename:"", // 输入的节点名字
                MySQLName:"", // 在后端创建的表的名字
                dialogVisible:false,
                currentNode:"",
                currentNodeid:"",
                currentNodeAttribute:[],
                isCollapse: true,
                isClick:false,
                Node:'',
                treeData:'',
                myChart:''

            }
        },
        mounted() {
            this.getTree();
            // console.log(this.treeData);

        },
        methods: {
            getTree:function(){
                // console.log(1111);
                this.$axios({
                    method:'get',
                    url:"http://10.24.82.10:8088/getLevelRelation/"
                }).then(res =>{
                    this.treeData = toTree(res.data.data);
                    console.log(this.treeData);
                    console.log(1);
                    this.drawLine(this.treeData);
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
            editAttribute(index){
                this.$prompt('请输入属性值', '修改属性', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    inputPattern: /^[\u4e00-\u9fa5]+$/,
                    inputErrorMessage:'请输入中文'
                }).then(({value}) => {
                    this.$message({
                        type: 'success',
                        message: '成功修改属性: ' + value
                    });
                    // 新增属性
                    this.$axios({
                        method:'post',
                        url:"http://10.24.82.10:8088/updateAttribute/"+this.currentNode+"/"+this.currentNodeAttribute[index]+"/"+value
                    }).then(()=>{
                        this.currentNodeAttribute[index]=value
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '取消输入'
                    });
                });
            },
            open() { //添加属性提示
                this.$prompt('请输入属性值', '新增属性', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                }).then(({value}) => {
                    this.$message({
                        type: 'success',
                        message: '成功添加属性: ' + value
                    });
                    this.currentNodeAttribute.push(value)
                    // 新增属性
                    this.$axios({
                        method:'post',
                        url:"http://10.24.82.10:8088/addAttribute/"+this.currentNode+"/"+value
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '取消输入'
                    });
                });
            },
            addAttrubute:function(){ //添加属性
                this.open()
            },
            deleteAttribute:function(index){
                this.$confirm("确认删除该属性？").then(()=>{ //需要加()=>
                    this.$axios({
                        method:'post',
                        url:"http://10.24.82.10:8088/deleteAttribute/"+this.currentNode+"/"+this.currentNodeAttribute[index]
                    })
                    this.currentNodeAttribute.splice(index,1)
                    this.$message("删除成功！")
                })
            },
            DialogClose:function(done){
                this.$confirm('确认关闭？').then(_=>{
                    done();
                }).catch(_=>{})
            },
            OpenDialog:function(){
                this.Nodename = ""
                this.MySQLName = ""
                this.dialogVisible = true
            },
            add_node:function(){
                this.$confirm('确认添加节点？').then(_=>{
                    this.dialogVisible = false
                    this.MySQLName = this.Nodename
                    console.log(this.Nodename)
                    console.log(this.MySQLName)
                    this.$axios({
                        method:'post',
                        url:"http://10.24.82.10:8088/addNodeType/",
                        data:{
                            "name": this.Nodename, //放插入节点的名字
                            "attributeTableName":this.MySQLName, //属性表 也是用户输入
                            "pid": this.currentNodeid

                        }
                    }).then(res =>{
                        console.log(res);
                        this.$message("添加成功！")
                        this.getTree();
                        // location.reload() //我这里是添加了一个页面刷新，不然好像没办法在tree上体现已经添加的节点

                    })
                }).catch(_=>{})
                // this.$prompt('请输入节点名字','添加节点', {
                //     confirmButtonText: '确定',
                //     cancelButtonText: '取消',
                //
                // }).then(({ value,value2 }) => {
                //     console.log('id');
                //     console.log(this.currentNodeid);
                //     console.log(value2)
                //     this.$axios({
                //         method:'post',
                //         url:"http://10.24.82.10:8088/addNodeType/",
                //         data:{
                //             "name": 1, //放插入节点的名字
                //             "attribute_table_name":value, //属性表 也是用户输入
                //             "pid": this.currentNodeid
                //
                //         }
                //     }).then(res =>{
                //         console.log(res);
                //     })
                //     this.$message({
                //         type: 'success',
                //         message: '添加节点: ' + value,
                //     });
                // }).catch(() => {
                //     this.$message({
                //         type: 'info',
                //         message: '取消输入'
                //     });
                // });

            },
            delete_node:function(){
                this.$alert("确认删除该节点？")
                .then( _ => {
                    this.$axios({
                        method: 'post',
                        url: "http://10.24.82.10:8088/deleteNodeType/" + this.currentNode,
                    }).then(res => {
                        console.log(res);
                        this.$message("删除成功！")
                        this.getTree();
                        // location.reload() //我这里是添加了一个页面刷新，不然好像没办法在tree上体现已经添加的节点

                    })
                });

            },
            Edit_Q:function(){
                console.log("1111")
            },
            handleOpen(key, keyPath) {
                console.log(key, keyPath);
            },
            handleClose(key, keyPath) {
                console.log(key, keyPath);
            },
            Edit:function () {
                document.getElementById("El-menu").style.display='block'
                document.getElementById("El-radio-group").style.display='block'
                // this.isCollapse=false
            },
            Open:function () {
                this.isCollapse = true
                document.getElementById("El-menu").style.display='block'
            },
            Close:function () {
                this.isCollapse = false
                document.getElementById("El-menu").style.display='block'
            },
            drawLine(treedata) {
                console.log(2)
                console.log(treedata)
                var checkName = '';
                // 基于准备好的dom，初始化echarts实例
                this.myChart = this.$echarts.init(document.getElementById('myChart'))
                // 绘制图表
                var Option = ({
                        calculable: false,
                        series: [
                            {
                                name: '树',
                                type: 'tree',
                                symbolSize: [60, 30],
                                edgeShape: 'polyline',
                                expandAndCollapse: false,
                                symbol: 'roundRect',
                                orient: 'vertical',  // vertical horizontal
                                rootLocation: {x: 'center', y: 50}, // 根节点位置  {x: 100, y: 'center'}
                                nodePadding: 20,
                                itemStyle: {
                                    normal: {
                                        color: function (param) {
                                            console.log(checkName)
                                            //通过判断选中的名字改变柱子的颜色样式
                                            if (checkName === param.name) {
                                                return '#ff8040';
                                            } else {
                                                return '#c23531';
                                            }
                                        },
                                        label: {
                                            show: true,
                                            formatter: "{b}",
                                            color: "#fff"
                                        },
                                        lineStyle: {
                                            shadowColor: '#000',
                                            shadowBlur: 3,
                                            shadowOffsetX: 3,
                                            shadowOffsetY: 5,
                                            // curveness: 0.5,
                                            // type: 'broken' // 'curve'|'broken'|'solid'|'dotted'|'dashed'

                                        }
                                    },
                                    emphasis: {
                                        label: {
                                            show: true
                                        }
                                    }
                                },
                                data: treedata
                            }
                        ]

                    }
                );
                this.myChart.setOption(Option);

                //点击事件
                let that = this //echart中无法调用this的解决方法 let that = this, 然后再用this.
                this.myChart.on("click", function (param) {
                    checkName = param.name;
                    that.currentNode = param.name;
                    that.currentNodeid = param.data.id;
                    console.log('options')
                    Option.series[0].data = that.treeData;
                    console.log(Option.series[0].data)
                    that.myChart.setOption(Option);
                    // that.$confirm('请选择操作类型', {
                    //     confirmButtonText: '添加节点',
                    //     cancelButtonText: '查看属性',
                    // }).then(() => {
                    // that.$prompt('请输入节点名字','添加节点', {
                    //     confirmButtonText: '确定',
                    //     cancelButtonText: '取消',
                    // }).then(({ value }) => {
                    //     console.log(param.data);
                    //     if (param.data.children === null)
                    //     {
                    //         param.data.children={"name":value,"value":3};
                    //     }
                    //     else {
                    //         param.data.children.push({"name": value, "value": 3});
                    //     }
                    //     let options = myChart.getOption();//获取已生成图形的Option param
                    //     myChart.setOption(options,true);
                    //     that.$message({
                    //         type: 'success',
                    //         message: '添加节点: ' + value,
                    //     });
                    // });

                    document.getElementById('buttons').style.display = 'block'
                    document.getElementById('Attribute').style.display = 'block'
                    document.getElementById('addAttribute').style.display = 'block'
                    Vue.prototype.$axios.get("http://10.24.82.10:8088/getAttributeByName/" + param.name).then(response => { //Echart的特性，不能用this调用axios，应该用Vue.prototype.$axios
                            console.log(response.data.data)
                            var jsonObj = JSON.parse(JSON.stringify(response.data.data))
                            that.currentNodeAttribute = jsonObj
                            that.currentNodeAttribute.shift()
                            console.log(that.currentNodeAttribute[1])
                        }, response => {
                            console.log('error')
                        }
                    )

                });
            },
            back_home:function () {
                this.$router.push("/Home")
                location.reload()
            }
        }
    }
</script>

<style>
    .NodeNameInput{
        /*float: right;*/
        width: 100%;
    }
    .MySQLNameInput{
        /*float: right;*/
        width: 100%;
    }
    .text {
        font-size: 14px;
        text-align: left;
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
        clear: both
    }

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
    .el-switch__label--left{
        position: relative;
        left: 57px;
        color: #fff;
        z-index: -1111;
    }
    .el-switch__label--right{
        position: relative;
        right: 57px;
        color: #fff;
        z-index: -1111;
    }
    .el-switch__label--right.is-active{
        z-index: 1111;
        color: #fff !important;
    }
    .el-switch__label--left.is-active{
        z-index: 1111;
        color: #9c9c9c !important;
    }

    .header_button{
        position: absolute;
        left: -4%;
        top:  22%;
    }
    .el-menu--collapse{
        position: absolute;
        top:30%;
    }
    .el-menu-vertical-demo:not(.el-menu--collapse) {
        position: absolute;
        top:30%;
        width: 30%;
        min-height: 24%;
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
    .container .left{
        position: relative;
        float: left;
        width: 50%;
        height: 100%;
        background-color: #15161F;
    }
    .container .right{
        position: relative;
        float: right;
        width: 50%;
        height: 100%;
        background-color: #15161F;
    }
    .buttons{
        position: absolute;
        top:80%;
        left: 20%;
    }
    .buttons .addNodes{
        color: #fff;
        background-color: #303252;
        border-color: #9593A7;
        border-width: 2px;
    }
    .buttons .deleteNodes{
        color: #fff;
        background-color: #303252;
        border-color: #9593A7;
        border-width: 2px;
    }
</style>