<template>
  <el-container style="height : 100%">
    <el-header height="8%" class="header_text">
      Excel上传
    </el-header>
    <el-container>
      <el-aside width="10%">

      </el-aside>
      <!--            数据审核表格区域-->
      <el-col :span="17" class="table_cell">
        <div class="table_header">
          <h1 class="tablehead">待审核数据共{{Node_lenth}}条</h1>
        </div>
        <div class="main_table">
          <el-table
              ref="multipleTable"
              stripe=true
              :data="tableData"
              height="500px"
              border
              style="width: 100%;"
              tooltip-effect="dark"
              @selection-change="handleSelectionChange">
            <el-table-column
                type="selection"
                width="55">
            </el-table-column>
            <el-table-column
                prop="startNodeName"
                label="节点1"
                width="120"
                align="center">
            </el-table-column>
            <el-table-column
                prop="startNodeType"
                label="节点1类型"
                width="120"
                align="center">
            </el-table-column>
            <el-table-column
                prop="endNodeName"
                label="节点2"
                width="120"
                align="center">
            </el-table-column>
            <el-table-column
                prop="endNodeType"
                label="节点2类型"
                width="120"
                align="center">
            </el-table-column>
            <el-table-column
                prop="relation"
                label="关系"
                align="center">
            </el-table-column>
            <el-table-column
                label="操作"
                width="160"
                align="center">
              <template slot-scope="scope">
                <el-button @click="updateUnchecked(tableData[scope.$index])" type="text" size="small">编辑</el-button>
                <el-button @click="addIntoDatabase(tableData[scope.$index])" type="text" size="small">添加</el-button>
                <!--                                <el-button type="text" size="small" @click="handleEdit(scope.$index,scope.row)">编辑</el-button>-->
                <el-button type="text" size="small" @click="deleteRow(tableData[scope.$index])">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <el-button type="primary" round=true  @click="deleteMultiRow" class="el-button–multidelete">批量删除
          <!--          <i class="el-icon-coin el-icon&#45;&#45;right"></i>-->
        </el-button>

        <el-button type="primary" round=true  @click="cancelMultiSelection" class="el-button–cancel">取消选择
          <!--          <i class="el-icon-coin el-icon&#45;&#45;right"></i>-->
        </el-button>
        <el-dialog title="确认添加关系" :visible.sync="showRelationsForCheckRelation" class="addDialog">
<!--          <span>请确认是否需要添加如下关系，若与已存在矛盾关系可删除已存在的矛盾关系或者取消添加本条关系</span>-->
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>关系信息</span>
            </div>
            <el-form :label-position="left" label-width="150px" :model="EditModeAddFormItem" >
              <el-form-item label="起始节点:">{{this.addStartNodeName}}</el-form-item>
              <el-form-item label="终止节点:">{{this.addEndNodeName}}</el-form-item>
              <el-form-item label="待添加关系:">{{this.addRelation}}</el-form-item>
            </el-form>
          </el-card>

          <div class="titleForBeforeRel">节点间已有关系</div>
          <div>
            <el-checkbox-group v-model="checkboxGroup">
              <el-checkbox-button class="beforeRelationItem" v-for="(att, ket, index) in relationsBefore" :label="att" :key="att">{{ att.relationName }}</el-checkbox-button>
            </el-checkbox-group>
          </div>
          <div slot="footer" class="dialog-footer">
            <el-button @click="deleteBeforeRealation" v-if="checkboxGroup.length !==0">删除已有关系</el-button>
            <el-button @click="canleAddRealation">返 回</el-button>
            <el-button type="primary" @click="addRelationConfirm">添 加</el-button>
          </div>
        </el-dialog>

        <el-dialog width="30%" title="编辑当前关系" :visible.sync="showUpdateUnchecked" center>
          <el-form :label-position="left" label-width="190px" :model="updateUncheckedItem">
            <el-form-item class="UncheckedItemInput"
                prop="startNodeName"
                label="起始节点名称:"
            >
              <el-input class="updateUncheckedItemInput" v-model="this.updateUncheckedItem['startNodeName']"></el-input>
            </el-form-item>

            <el-form-item class="UncheckedItemInput"
                prop="startNodeType"
                label="起始节点类型:"
            >
              <el-input class="updateUncheckedItemInput" v-model="this.updateUncheckedItem['startNodeType']"></el-input>
            </el-form-item>

            <el-form-item class="UncheckedItemInput"
                prop="endNodeName"
                label="终止节点名称:"
            >
              <el-input class="updateUncheckedItemInput" v-model="this.updateUncheckedItem['endNodeName']"></el-input>
            </el-form-item>

            <el-form-item class="UncheckedItemInput"
                prop="endNodeType"
                label="终止节点类型:"
            >
              <el-input class="updateUncheckedItemInput" v-model="this.updateUncheckedItem['endNodeType']"></el-input>
            </el-form-item>

            <el-form-item class="UncheckedItemInput"
                prop="relation"
                label="关系:"
            >
              <el-input class="updateUncheckedItemInput" v-model="this.updateUncheckedItem['relation']"></el-input>
            </el-form-item>

          </el-form>

          <div slot="footer" class="dialog-footer_for_update">
            <el-button @click="cancleUpdateRelation">返 回</el-button>
            <el-button type="primary" @click="updateRelation">确定</el-button>


          </div>
        </el-dialog>

      </el-col>
      <el-col :span="7" class="right-side" >
        <!-- 基本功能按钮区域-->
        <div class="buttons">
<!--          <el-upload-->
<!--              ref="upload"-->
<!--              action="/"-->
<!--              :show-file-list="false"-->
<!--              :on-change="ExcelUpload"-->
<!--              :auto-upload="false">-->
<!--            <el-button-->
<!--                type="primary"-->
<!--                round=true-->
<!--                slot="trigger"-->
<!--                class="Excelupload">-->
<!--              Excel上传-->
<!--              <i class="el-icon-s-order el-icon&#45;&#45;right"></i>-->
<!--            </el-button>-->
<!--          </el-upload>-->

          <el-button type="primary" round=true  @click="Back_to_lastpage" class="back_to_lastpage">返回上一页
            <i class="el-icon-position el-icon--right"></i>
          </el-button>


          <el-button type="primary" round=true  @click="Back_to_homepage" class="back_to_homepage">返回首页
            <i class="el-icon-s-promotion el-icon--right"></i>
          </el-button>
        </div>
      </el-col>

    </el-container>

  </el-container>

</template>

<style>
.UncheckedItemInput{
  padding-bottom: 15px;
}
.updateUncheckedItemInput{
  width: 80%;
}
.el-checkbox-button__inner {
  border: 1px solid #DCDFE6;
  border-radius: 4px;
  box-shadow: none!important;
  inline-size: 460px;
}
.el-checkbox-button:last-child{
  border-radius: 4px;
}
.titleForBeforeRel{
  font-family: Helvetica, sans-serif;
  font-size: medium;
  margin-top: 25px;
  margin-bottom: 15px;
}
.el-card__body{
  padding: 13px;
}
.beforeRelationItem{
  margin-bottom: 10px;
}
.el-form-item{
  margin: 0;
}
.addDialog{
  width: 60%;
  position: absolute;
  margin-left: 20%;
}
.table_cell{
  background-color: #15161F;
}
.tablehead{
  float: left;
  color: #ffffff;
}
.table_header{
  background-color: #15161F;
  float: right;
  width: 80%;
  height: 10%;
}
/*表格的主体区域*/
.main_table{
  background-color: #15161F;
  float: right;
  width: 80%;
  /*height: 60%;*/
}
.header_text{
  /*font-family: "PingFang SC";*/
  font-size: 30px;
  letter-spacing: 5px;
  color: #ffffff;
}
.right-side {
  position: relative;
}
/* 按钮区域 */
.buttons {
  background-color: #15161F;
  height: 100%;
  position: relative;
}
/* 插入按钮的相关设置 */
.el-button–insert{
  position: absolute;
  top:15%;
  left:22%;
  color: #fff;
  background-color: #303252;
  border-color: #9593A7;
  border-width: 2px;
}
/*跳过按钮样式*/
.el-button-skip {
  position: absolute;
  top: 30%;
  left:20%;

  color: #fff;
  background-color: #303252;
  border-color: #9593A7;
  border-width: 2px;
}
/*放弃按钮设置*/
.el-button–save {
  position: absolute;
  top: 83%;
  left: 37%;
  color: #fff;
  background-color: #303252;
  border-color: #9593A7;
  border-width: 2px;
}
.el-button–multidelete{
  position: absolute;
  top: 83%;
  left: 40%;
  color: #fff;
  background-color: #303252;
  border-color: #9593A7;
  border-width: 2px;
}
.el-button–cancel{
  position: absolute;
  top: 83%;
  left: 50%;
  color: #fff;
  background-color: #303252;
  border-color: #9593A7;
  border-width: 2px;
}
/*返回上一页按钮设置*/
.back_to_lastpage {
  position: absolute;
  top: 58%;
  left: 20%;
  color: #fff;
  background-color: #303252;
  border-color: #9593A7;
  border-width: 2px;
}
/*返回首页按钮设置*/
.back_to_homepage {
  position: absolute;
  top: 73%;
  left: 20%;
  color: #fff;
  background-color: #303252;
  border-color: #9593A7;
  border-width: 2px;
}
.Excelupload{
  position: absolute;
  top: 43%;
  left: 20%;

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

.personal_Information {
  background-color: #15161F;
  height: 55%;
}


</style>

<!-- 查询框-->
<script>
import XLSX from "xlsx";

export default {
  name:"excel_upload",
  data() {
    return {
      Node_lenth: 0,
      tableData:[
      ],
      multipleSelection:[],
      multipleSelectionIndex: [],
      relationsBefore:[],
      showRelationsForCheckRelation:false,
      showUpdateUnchecked:false,

      addStartNodeName:'',
      addEndNodeName:'',
      addStartNodeId:'',
      addEndNodeId:'',
      addRelation:'',

      checkboxGroup:[],

      updateUncheckedItem:{}
    }
  },
  mounted() {
    this.getAllUnchecked()
    this.getAllUncheckedNodes()
  },
  methods: {
    // =============按钮功能实现==================
    //跳转审核界面
    Back_to_lastpage: function () {
      this.$router.push("/Check_1")
    },

    //返回主页
    Back_to_homepage: function () {
      this.$router.push("/")
    },

    //文件上传
    ExcelUpload:function (file) {
      const types = file.name.split('.')[1]
      const fileType = ['xlsx', 'xlc', 'xlm', 'xls', 'xlt', 'xlw', 'csv'].some(item => item === types)
      if (!fileType) {
        this.$message('格式错误！请重新选择')
        return
      }
      this.file2Xce(file).then(tabJson => {
        if (tabJson && tabJson.length > 0) {
          this.xlsxJson = tabJson
          console.log('数据', this.xlsxJson[0].sheet)

        }
        var sheetDates = this.xlsxJson[0].sheet
        for (var sd in sheetDates){
          //先转为数组、再加入tableData
          this.tableData.push(sheetDates[sd])
        }
      })
    },
    file2Xce:function (file) {
      return new Promise(function (resolve, reject) {
        const reader = new FileReader()
        reader.onload = function (e) {
          const data = e.target.result
          this.wb = XLSX.read(data, {
            type: 'binary'
          })
          const result = []
          this.wb.SheetNames.forEach((sheetName) => {
            result.push({
              sheetName: sheetName,
              sheet: XLSX.utils.sheet_to_json(this.wb.Sheets[sheetName])
            })
          })
          resolve(result)
        }
        reader.readAsBinaryString(file.raw)
        // reader.readAsBinaryString(file) // 传统input方法
      })
    },

    //=================表格中的操作==============
    // 编辑数据
    updateUnchecked(data){
      console.log(data)
      this.showUpdateUnchecked = true
      this.updateUncheckedItem = data
    },

    //取消编辑关系
    cancleUpdateRelation(){
      this.showUpdateUnchecked = false
      this.updateUncheckedItem = {}
    },

    //确认修改
    updateRelation:async function(){
      console.log(this.updateUncheckedItem)
      await this.$axios({
        method:'post',
        url:'http://10.24.82.10:8088/updateUncheckedRelationById',
        data: [this.updateUncheckedItem]
      }).then(res=>{
        console.log(res.data)
      })
      this.updateUncheckedItem = {}
      this.showUpdateUnchecked =false
    },

    // 删除行（与后端数据交流）
    deleteRow(data) {
      console.log(data)
      var unCheckedId = data['unCheckedId']
      // console.log("接口bug待修复，跨源问题")
      this.$axios({
        method: 'get',
        url: 'http://10.24.82.10:8088/deleteUncheckedRelation/' + unCheckedId
      }).then(res => {
        console.log(res.data)
      })
        // this.$message("删除成功")
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
      // })
    },

    // 批量删除选择的数据
    deleteMultiRow(){
      console.log("接口bug待修复")
      // var i =0 //当前元素索引
      // var minNum = 0; //当前元素左侧小于该元素的元素的个数
      // this.multipleSelectionIndex.forEach(idx=>{
      //   //找出当前元素左侧小于该元素的元素的个数
      //   for (var j = 0; j<i;j++){
      //     if (this.multipleSelectionIndex[j]< idx){
      //       minNum+=1
      //     }
      //   }
      //   //从tableData中删除
      //   this.deleteRow(idx-minNum)
      //   i +=1
      // })
      // this.cancelMultiSelection()
      // this.multipleSelection = []
      // this.multipleSelectionIndex = []
    },

    //对于已存在关系的节点确认添加关系
    addRelationConfirm(){
      //添加关系到数据库
      console.log("添加新关系",this.addStartNodeName,this.addStartNodeId,this.addEndNodeName,this.addEndNodeId,this.addRelation)
      this.$axios({
        method:'post',
        url:'http://10.24.82.10:8088/addRelationTuple',
        data:{
          "fatherName":this.addStartNodeName,
          "fatherId":this.addStartNodeId,
          "childName":this.addEndNodeName,
          "childId":this.addEndNodeId,
          "relationName":this.addRelation
        }
      }).then(res=>{
        console.log(res.data)
        if (res.data['errno'] === 0){
          this.$message({
            type:'success',
            message: '添加成功'
          })
          this.showRelationsForCheckRelation = false
          //TODO 删除这条数据
          console.log("删除这条数据  待完成")
          // 清空缓存数据
          this.addStartNodeName = ''
          this.addStartNodeId=''
          this.addEndNodeName=''
          this.addEndNodeId=''
          this.addRelation=''

        }else {
          this.$message({
            type:'error',
            message: '存在重复关系，添加失败！'
          })
        }

      })

      //从待审核数据库中删除该项
    },


    canleAddRealation(){
      this.showRelationsForCheckRelation = false
      this.checkboxGroup = []
    },

    //删除已有关系
    deleteBeforeRealation:async function(){
      console.log('删除已有关系',this.checkboxGroup)
      //调用删除关系接口
      for (var i =this.checkboxGroup.length-1;i>=0;i--){
        await this.$axios({
          method:'post',
          data:this.checkboxGroup[i],
          url:'http://10.24.82.10:8088/deleteRelationTuple'
        }).then(res=>{
          console.log("关系删除结果",res.data)
        })
      }

      //更新面板中的已有关系
      await this.$axios({
        method:'get',
        url:'http://10.24.82.10:8088/queryRelationTupleByFatherNameChildName/'+this.addStartNodeName + '/' + this.addEndNodeName
      }).then(res=>{
        console.log("已有关系：",res.data.data)
        this.relationsBefore = res.data.data
      })
      //去除按钮
      //清空选项
      this.checkboxGroup = []
      console.log('删除之后的已有关系',this.relationsBefore)
    },

    //表格中每一项的“添加”按钮
    addIntoDatabase:async function (data){
      console.log(data)
      this.addStartNodeName = data['startNodeName']
      this.addEndNodeName = data['endNodeName']
      this.addRelation = data['relation']

      // 判断节点是否存在
      var isExistFatherNode = 0
      var isExistchildNode = 0
      console.log("，判断父节点是否存在")
      await this.$axios({
        method:'get',
        url:'http://10.24.82.10:8088/getNodeAttributeByName/'+data['startNodeName']
      }).then(res=>{
        console.log("查询父节点结果",res.data)
        if (res.data['errno'] === 0 ){
          isExistFatherNode = 1
          // 获取父节点ID
          var Object_key = Object.keys(res.data.data)
          for (var i = 0; i < Object_key.length; i++){
            if(res.data.data[Object_key[i]].length > 0){
              switch (Object_key[i]) {
                case 'unitSequenceList':
                  this.addStartNodeId = res.data.data[Object_key[i]][0]['unitId']
                  break
                case 'characterList':
                  this.addStartNodeId = res.data.data[Object_key[i]][0]['personId']
                  break
                case 'equipmentTree':
                  this.addStartNodeId = res.data.data[Object_key[i]][0]['equipmentId']
              }
            }
          }
        }
      })

      await this.$axios({
        method:'get',
        url:'http://10.24.82.10:8088/getNodeAttributeByName/'+data['endNodeName']
      }).then(res=>{
        console.log("查询子节点结果",res.data)
        if (res.data['errno'] === 0 ){
          isExistchildNode = 1
          // 获取子节点ID
          var Object_key = Object.keys(res.data.data)
          for (var i = 0; i < Object_key.length; i++){
            if(res.data.data[Object_key[i]].length > 0){
              switch (Object_key[i]) {
                case 'unitSequenceList':
                  this.addEndNodeId = res.data.data[Object_key[i]][0]['unitId']
                  break
                case 'characterList':
                  this.addEndNodeId = res.data.data[Object_key[i]][0]['personId']
                  break
                case 'equipmentTree':
                  this.addEndNodeId = res.data.data[Object_key[i]][0]['equipmentId']
              }
            }
          }
        }
      })

      // 找关系
      await this.$axios({
        method:'get',
        url:'http://10.24.82.10:8088/queryRelationTupleByTwoName/'+data['startNodeName'] + '/' + data['endNodeName']
      }).then(res=>{
        console.log("关系查询结果：",res.data.data)
        this.relationsBefore = res.data.data
      })

      if (this.relationsBefore.length >0){
        //弹出弹窗判断
        console.log("节点存在，且已存在关系，需要进行弹窗判断")
        this.showRelationsForCheckRelation = true
        this.checkboxGroup = []
        console.log(this.addStartNodeId,this.addEndNodeId)

      }else {
        if (isExistFatherNode === 0 && isExistchildNode === 1 ){
          //父节点不存在，确认添加新节点
          this.$confirm('父节点不存在，确认添加新节点?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            //添加新节点
            this.addNodeAndRelation('father',data['startNodeType'])
            // 清空缓存数据
            this.addStartNodeName = ''
            this.addStartNodeId=''
            this.addEndNodeName=''
            this.addEndNodeId=''
            this.addRelation=''

            this.$message({
              type: 'success',
              message: '关系添加成功!'
            });
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            });
          });
          // this.$message({
          //   type:'error',
          //   message: '父节点不存在'
          // })
        }
        if(isExistchildNode === 0 && isExistFatherNode === 1){
          //子节点不存在，确认添加新节点
          this.$confirm('子节点不存在，确认添加新节点?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.addNodeAndRelation('father')
            // 清空缓存数据
            this.addStartNodeName = ''
            this.addStartNodeId=''
            this.addEndNodeName=''
            this.addEndNodeId=''
            this.addRelation=''

            this.$message({
              type: 'success',
              message: '关系添加成功!'
            });
          }).catch(() => {
            this.$message({

              type: 'info',
              message: '已取消删除'
            });
          });
          // this.$message({
          //   type:'error',
          //   message: '子节点不存在'
          // })
        }

        if(isExistchildNode === 0 && isExistFatherNode === 0){
          //子节点不存在，确认添加新节点
          this.$confirm('父子节点均不存在，确认添加新节点?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.addNodeAndRelation('both')
            // 清空缓存数据
            this.addStartNodeName = ''
            this.addStartNodeId=''
            this.addEndNodeName=''
            this.addEndNodeId=''
            this.addRelation=''

            this.$message({
              type: 'success',
              message: '关系添加成功!'
            });
          }).catch(() => {
            this.$message({

              type: 'info',
              message: '已取消删除'
            });
          });
        }

        if (isExistFatherNode && isExistchildNode){
          console.log("父子节点均存在，可以直接添加关系")
          console.log(this.addStartNodeName,this.addStartNodeId,this.addEndNodeName,this.addEndNodeId,this.addRelation)
          await this.$axios({
            method:'post',
            url:'http://10.24.82.10:8088/addRelationTuple',
            data:{
              "fatherName":this.addStartNodeName,
              "fatherId":this.addStartNodeId,
              "childName":this.addEndNodeName,
              "childId":this.addEndNodeId,
              "relationName":this.addRelation
            }
          }).then(res=>{
            console.log(res.data)
            this.$message({
              type:'succes',
              message: '添加成功'
            })
            //TODO 删除这条数据
            console.log("删除这条数据  待完成")
            // 清空缓存数据
            this.addStartNodeName = ''
            this.addStartNodeId=''
            this.addEndNodeName=''
            this.addEndNodeId=''
            this.addRelation=''
          })
        }
      }

    },

    //添加节点及关系
    addNodeAndRelation(node, nodetype){
      console.log(this.addStartNodeName,this.addStartNodeId,this.addEndNodeName,this.addEndNodeId,this.addRelation)
    },
    //获取多选的行中的数据
    handleSelectionChange(rows) {
      this.multipleSelection = rows;
      this.multipleSelectionIndex = []
      rows.forEach(row=>{
        this.multipleSelectionIndex.push(this.tableData.indexOf(row))
      })

      console.log(this.multipleSelection, this.multipleSelectionIndex)
    },

    //取消多选
    cancelMultiSelection() {
      this.$refs.multipleTable.clearSelection();
    },

    // ============后台数据读取========
    //更新待审核节点数目
    getAllUnchecked:function() {
      this.$axios({
        method:'get',
        url:'http://10.24.82.10:8088/getAllUncheckedRelation'
      }).then(res=>{
        console.log("待审核关系数目",res.data.data)
        this.Node_lenth = res.data.data.length
      })
    },

    //获取所有待审核数据
    getAllUncheckedNodes:function () {
      this.$axios({
        method:'get',
        url:'http://10.24.82.10:8088/getAllUncheckedRelation'
      }).then(res=>{
        console.log("待审核关系",res.data.data)
        this.tableData = res.data.data
      })
    }
  }
}
</script>

<style scoped>

</style>
