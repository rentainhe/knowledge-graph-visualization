<template>
  <el-container style="height : 100%">
    <el-header height="8%" class="header_text">
      知识图谱展示
    </el-header>
    <el-container>
      <el-aside width="10%">

      </el-aside>
      <!--            数据审核表格区域-->
      <el-col :span="17" class="table_cell">
        <div class="table_header">
          <h1 class="tablehead">剩余上传数据{{tableData.length}}条</h1>
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
                width="120"
                align="center">
              <template slot-scope="scope">
                <el-button @click="addUnchecked([scope.row],[scope.$index])" type="text" size="small">添加</el-button>
                <!--                                <el-button type="text" size="small" @click="handleEdit(scope.$index,scope.row)">编辑</el-button>-->
                <el-button type="text" size="small" @click="deleteRow(scope.$index, tableData)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <el-button type="primary" round=true  @click="addUnchecked(multipleSelection,multipleSelectionIndex)" class="el-button–save">批量添加
<!--          <i class="el-icon-coin el-icon&#45;&#45;right"></i>-->
        </el-button>

        <el-button type="primary" round=true  @click="deleteMultiRow" class="el-button–multidelete">批量删除
          <!--          <i class="el-icon-coin el-icon&#45;&#45;right"></i>-->
        </el-button>

        <el-button type="primary" round=true  @click="cancelMultiSelection" class="el-button–cancel">取消选择
<!--          <i class="el-icon-coin el-icon&#45;&#45;right"></i>-->
        </el-button>

      </el-col>
      <el-col :span="7" class="right-side" >
        <!-- 基本功能按钮区域-->
        <div class="buttons">
          <el-upload
              ref="upload"
              action="/"
              :show-file-list="false"
              :on-change="ExcelUpload"
              :auto-upload="false">
            <el-button
                type="primary"
                round=true
                slot="trigger"
                class="Excelupload">
              Excel上传
              <i class="el-icon-s-order el-icon--right"></i>
            </el-button>
          </el-upload>

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
  left: 33%;
  color: #fff;
  background-color: #303252;
  border-color: #9593A7;
  border-width: 2px;
}

.el-button–multidelete{
  position: absolute;
  top: 83%;
  left: 45%;
  color: #fff;
  background-color: #303252;
  border-color: #9593A7;
  border-width: 2px;
}

.el-button–cancel{
  position: absolute;
  top: 83%;
  left: 57%;
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
      tableData:[
      ],
      multipleSelection:[],
      multipleSelectionIndex:[]

    }
  },
  mounted() {

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

    //Excel上传
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
    // 删除行（本地）
    deleteRow(index) {
      console.log("删除的元素索引", index)
      this.tableData.splice(index, 1);
      this.Node_lenth -= 1;
    },

    //增加新待审核数据（单行+批量）
    addUnchecked:async function(unchecked_data,indexs){
      console.log('要添加的待审核数据',unchecked_data,indexs)
      if (unchecked_data.length>0){
        await this.$axios({
          method:'post',
          data:unchecked_data
          ,
          url:"http://10.24.82.10:8088/insertUncheckedRelation"
        }).then(res=>{
          console.log(res.data)
          var i =0 //当前元素索引
          var minNum = 0; //当前元素左侧小于该元素的元素的个数
          indexs.forEach(idx=>{
            //找出当前元素左侧小于该元素的元素的个数
            for (var j = 0; j<i;j++){
              if (indexs[j]< idx){
                minNum+=1
              }
            }
            //从tableData中删除
            this.deleteRow(idx-minNum)
            i +=1
          })
          this.cancelMultiSelection()
          this.multipleSelection = []
          this.multipleSelectionIndex = []
        })
      }else {
        this.$message({
          type:'error',
          message: '请选择需要上传的待审核数据'
        })
      }

    },

    //批量删除选择的数据
    deleteMultiRow(){
      if (this.multipleSelectionIndex.length>0){
        var i =0 //当前元素索引
        var minNum = 0; //当前元素左侧小于该元素的元素的个数
        this.multipleSelectionIndex.forEach(idx=>{
          //找出当前元素左侧小于该元素的元素的个数
          for (var j = 0; j<i;j++){
            if (this.multipleSelectionIndex[j]< idx){
              minNum+=1
            }
          }
          //从tableData中删除
          this.deleteRow(idx-minNum)
          i +=1
        })
        this.cancelMultiSelection()
        this.multipleSelection = []
        this.multipleSelectionIndex = []
      }else {
        this.$message({
          type:'error',
          message: '请选择需要删除的待审核数据'
        })
      }

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

  }
}
</script>

<style scoped>

</style>
