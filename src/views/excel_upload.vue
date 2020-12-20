<template>
  <el-container style="height : 100%">
    <el-header height="8%" class="header_text">
      Excel上传
    </el-header>
    <el-container>
      <el-aside width="5%">

      </el-aside>
      <!--            数据审核表格区域-->
      <el-col :span="20" class="table_cell">
        <div class="upload_main" v-show="showTable">
          <div class="table_header">
            <h1 class="tablehead">剩余上传数据{{tableData.length}}条</h1>
          </div>
          <div class="main_table">
            <el-table
                ref="multipleTable"
                stripe=true
                :data="tableData"
                height="570px"
                border
                style="width: 100%;"
                tooltip-effect="dark"
                @selection-change="handleSelectionChange">
              <el-table-column
                  type="selection"
                  width="55">
              </el-table-column>
              <el-table-column
                  sortable
                  v-for="(item,index) in tableColumnList"
                  :label="selectkeysName[index]"
                  :prop= "item"
                  :key="item"
                  align="center">
              </el-table-column>
              <el-table-column
                  label="操作"
                  width="150"
                  align="center">
                <template slot-scope="scope">
                  <el-button @click="updateUnchecked(tableData[scope.$index],scope.$index)" type="text" size="small">编辑</el-button>
                  <el-button @click="addUnchecked([scope.row],[scope.$index])" type="text" size="small">添加</el-button>
                  <!--                                <el-button type="text" size="small" @click="handleEdit(scope.$index,scope.row)">编辑</el-button>-->
                  <el-button type="text" size="small" @click="deleteRow(scope.$index, tableData)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-dialog width="30%" title="编辑当前关系" :visible.sync="showUpdateUnchecked" center v-if="updateUncheckedItem">
              <el-form :label-position="left" label-width="190px" :model="updateUncheckedItem">
                <el-form-item v-for="item in tableColumnList" class="UncheckedItemInput"
                              :prop="item"
                              :label="item"
                              :key="item"
                >
                  <el-input class="updateUncheckedItemInput" v-model="updateUncheckedItem[item]"></el-input>

                </el-form-item>


              </el-form>

              <div slot="footer" class="dialog-footer_for_update">
                <el-button @click="cancleUpdateRelation">返 回</el-button>
                <el-button type="primary" @click="updateRelation">确定</el-button>
              </div>
            </el-dialog>
          </div>
          <div class="table_buttons">
            <el-button type="primary" round=true  @click="addUnchecked(multipleSelection,multipleSelectionIndex)" class="el-button–save">批量添加
              <!--          <i class="el-icon-coin el-icon&#45;&#45;right"></i>-->
            </el-button>

            <el-button type="primary" round=true  @click="deleteMultiRow" class="el-button–multidelete">批量删除
              <!--          <i class="el-icon-coin el-icon&#45;&#45;right"></i>-->
            </el-button>

            <el-button type="primary" round=true  @click="cancelMultiSelection" class="el-button–cancel">取消选择
            <!--          <i class="el-icon-coin el-icon&#45;&#45;right"></i>-->
          </el-button>

          <el-button type="primary" round=true  @click="reUpload" class="el-button–reUpload">重新上传
            <!--          <i class="el-icon-coin el-icon&#45;&#45;right"></i>-->
          </el-button>

          </div>
        </div>

        <el-dialog
            title="提示"
            :visible.sync="showSuccessUpload"
            width="30%"
            :before-close="successUploadHandleClose">
          <span>需要关联表头才能继续，点击【确认】开始进行关联</span>
          <span slot="footer" class="dialog-footer">
            <el-button @click="successUploadHandleClose">取 消</el-button>
            <el-button type="primary" @click="matchKeys">确 定</el-button>
          </span>
        </el-dialog>

        <el-dialog
            title="请对以下表头进行匹配"
            :visible.sync="showMatching"
            width="30%"
            :before-close="matchingClose">
          <div class="input-group el-input-group--prepend" style="margin-top: 15px;" v-for="(item,index) in tableColumnList">
            <div class="el-input-group__prepend" >{{item}}</div>
            <el-cascader
                ref="cascader"
                v-model="allKeys[index]"
                :options="options"
                :props="{ expandTrigger: 'hover' }"
                clearable
                @change="handleChangeForMatching(allKeys[index],index)">
            </el-cascader>
<!--            <el-input placeholder="请选择相应字段名" v-model="input1">-->

<!--              <template slot="prepend">Http://</template>-->
<!--            </el-input>-->
          </div>
          <span slot="footer" class="dialog-footer">
            <el-button @click="matchingClose">取 消</el-button>
            <el-button type="primary" @click="matchingConfirm">确 定</el-button>
          </span>
        </el-dialog>

        <el-dialog
            title="存在错误"
            :visible.sync="showError"
            width="47%"
            :before-close="showErrorHandleClose"
            v-if="showError">
          <span>各数据上传状态如下，若要重新上传错误项，请完善相关信息。</span>
          <el-table
              :data="selectData"
              style="width: 100%">
            <el-table-column
                prop="startNodeName"
                width="160">
            </el-table-column>
            <el-table-column
                prop="startNodeId"
                width="120">
            </el-table-column>
            <el-table-column
                prop="endNodeName"
                width="160">
            </el-table-column>
            <el-table-column
                prop="endNodeId"
                width="120">
            </el-table-column>
            <el-table-column
                prop="relation"
                width="130">
            </el-table-column>
            <el-table-column>
              <template slot-scope="scope">
                <div v-if="(errno_detail_list[scope.$index] === 0)" :key="1">
                  <el-button
                      class="successButton"
                      size="mini"
                      type="success"
                      icon="el-icon-check"
                      circle
                  ></el-button>
                </div>
                <div v-else :key="2">
                  <el-button
                      class="warningButton"
                      size="mini"
                      type="warning"
                      icon="el-icon-warning"
                      circle
                      @click="showErrorDetail(scope.$index)"></el-button>
                  <el-button
                      class="deleteButton"
                      size="mini"
                      type="danger"
                      icon="el-icon-delete"
                      circle
                      @click="errorDelete(scope.$index)"></el-button>
                </div>

              </template>
            </el-table-column>
          </el-table>
          <span slot="footer" class="dialog-footer">
            <el-button @click="showErrorHandleClose">取 消</el-button>
            <el-button type="primary" @click="addNewRelationConfirm">确 定</el-button>
          </span>
        </el-dialog>

        <el-dialog
            title="请完善节点信息"
            :visible.sync="showCompleteErrorNode"
            width="30%"
            :before-close="CompleteErrorNodeHandleClose">

          <div v-show="showFather">
<!--            <span>父节点</span>-->
<!--            <p></p>-->
            <el-form :label-position="left" label-width="190px" :model="errorData">
              <el-form-item label="父节点名称：">
                <el-input style="width: 60%" v-model="errorData['startNodeName']"></el-input>
              </el-form-item>
              <el-form-item label="父节点ID：">
                <el-input style="width: 60%" v-model="errorData['startNodeId']"></el-input>
              </el-form-item>
              <el-form-item label="父节点类型：">
                <el-select style="width: 60%" v-model="selectFatherType" clearable placeholder="请选择">
                  <el-option
                      v-for="type in nodeTypeData"
                      :key="type.value"
                      :label="type.label"
                      :value="type.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-form>
          </div>
          <div v-show="showChild">
            <el-form label-width="190px" :model="errorData">
              <el-form-item label="子节点名称：">
                <el-input style="width: 60%" v-model="errorData['endNodeName']"></el-input>
              </el-form-item>
              <el-form-item label="子节点ID：">
                <el-input style="width: 60%" v-model="errorData['endNodeId']"></el-input>
              </el-form-item>
              <el-form-item label="子节点类型：">
                <el-select style="width: 60%" v-model="selectChildType" clearable placeholder="请选择">
                  <el-option
                      v-for="type in nodeTypeData"
                      :key="type.value"
                      :label="type.label"
                      :value="type.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-form>
          </div>

          <span slot="footer" class="dialog-footer">
            <el-button @click="CompleteErrorNodeHandleClose">取 消</el-button>
            <el-button type="primary" @click="CompleteErrorNodeConfirm">确 定</el-button>
          </span>
        </el-dialog>



        <div v-show="showUploadButton">
          <el-upload
              ref="upload"
              drag
              action="/"
              :show-file-list="false"
              :on-change="ExcelUpload"
              :auto-upload="false">
            <div class="upload_button_text">
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">将Excel文件拖到此处，或<em>点击上传</em></div>
            </div>

  <!--          <el-button-->
  <!--              type="primary"-->
  <!--              round=true-->
  <!--              slot="trigger"-->
  <!--              class="Excelupload">-->
  <!--            Excel上传-->
  <!--            <i class="el-icon-s-order el-icon&#45;&#45;right"></i>-->
  <!--          </el-button>-->
          </el-upload>
        </div>

      </el-col>
      <el-col :span="7" class="right-side" >
        <!-- 基本功能按钮区域-->
        <div class="buttons">

<!--          <el-button type="primary" round=true  @click="Back_to_lastpage" class="back_to_lastpage">返回上一页-->
<!--            <i class="el-icon-position el-icon&#45;&#45;right"></i>-->
<!--          </el-button>-->


          <el-button type="primary" round=true  @click="Back_to_homepage" class="back_to_homepage">返回首页
            <i class="el-icon-s-promotion el-icon--right"></i>
          </el-button>
        </div>
      </el-col>


    </el-container>

  </el-container>

</template>

<style>
.warningButton{
  margin: 0px;
}
.input-group{
  line-height: normal;
  display: inline-table;
  border-spacing: 0;
}
.el-input-group__prepend{
  width: 90px;
}
.upload_button_text{
  padding-top: 60px;
}
.el-upload-dragger{
  margin-top: 250px;
  margin-left: 300px;
  background-color: #0b2838;
  width: 600px;
  height: 300px;
}
.table_cell{
  background-color: #0b2838;
}
.tablehead{
  float: left;
  color: #ffffff;
}
.table_header{
  background-color: #0b2838;
  float: right;
  width: 80%;
  height: 10%;
}
/*表格的主体区域*/
.main_table{
  background-color: #0b2838;
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
  background-color: #0b2838;
  height: 100%;
  position: relative;
}
/* 插入按钮的相关设置 */
.el-button–insert{
  position: absolute;
  top:15%;
  left:22%;
  color: #fff;
  background-color: rgb(84, 92, 100);
  border-color: rgb(84, 92, 100);
  border-width: 2px;
}
/*跳过按钮样式*/
.el-button-skip {
  position: absolute;
  top: 30%;
  left:20%;

  color: #fff;
  background-color: rgb(84, 92, 100);
  border-color: rgb(84, 92, 100);
  border-width: 2px;
}
/*放弃按钮设置*/
.el-button–save {
  position: absolute;
  top: 80%;
  left: 30%;
  color: #fff;
  background-color: rgb(84, 92, 100);
  border-color: rgb(84, 92, 100);
  border-width: 2px;
}
.el-button–reUpload{
  position: absolute;
  top: 80%;
  left: 60%;
  color: #fff;
  background-color: rgb(84, 92, 100);
  border-color: rgb(84, 92, 100);
  border-width: 2px;
}
.el-button–multidelete{
  position: absolute;
  top: 80%;
  left: 40%;
  color: #fff;
  background-color: rgb(84, 92, 100);
  border-color: rgb(84, 92, 100);
  border-width: 2px;
}

.el-button–cancel{
  position: absolute;
  top: 80%;
  left: 50%;
  color: #fff;
  background-color: rgb(84, 92, 100);
  border-color: rgb(84, 92, 100);
  border-width: 2px;
}
/*返回上一页按钮设置*/
.back_to_lastpage {
  position: absolute;
  top: 58%;
  left: 20%;
  color: #fff;
  background-color: rgb(84, 92, 100);
  border-color: rgb(84, 92, 100);
  border-width: 2px;
}
/*返回首页按钮设置*/
.back_to_homepage {
  position: absolute;
  top: 91%;
  left: 20%;
  color: #fff;
  background-color: rgb(84, 92, 100);
  border-color: rgb(84, 92, 100);
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
  background-color: #0b2838;
  color: #ffffff;
  text-align: center;
  line-height: 60px;
}

.el-aside {
  background-color: #0b2838;
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
      //节点选择下拉框数据：
      nodeTypeData:[{
        value:'unit',
        label:"单位"
      },{
        value: 'person',
        label: "人员"
      },{
        value: 'employment',
        label: '装备'
      }],
      //完善节点类型：父节点
      selectFatherType:'',
      //完善节点类型：子节点
      selectChildType:'',
      //当前选择的错误数据行
      errorData:[],
      errorDataIndex: -1,
      // showSuccessButton:false,
      // showWarningButton:false,
      // showDangerButton:false,
      //是否展示子节点上传编辑面板
      showChild:false,
      //是否展示父节点上传编辑面板
      showFather:false,
      //上传时选中的数据，用于错误上传显示
      selectData:[],
      selectDataIdx:[],
      selectErrorlist:[],
      showError:false,
      showCompleteErrorNode:false,
      //上传数据结果状态：0- 成功 -1-父节点不存在 1-子节点不存在 2-父子节点均不存在
      errno_detail_list:[],
      show_errno:[],
      showUploadButton:true,
      showTable:false,
      //表格中要显示的数据
      tableData:[],
      //动态表头
      tableColumnList:["endNodeName", "endNodeType", "relation", "startNodeName", "startNodeType"],
      //选择的项
      multipleSelection:[],
      //选择项的序号
      multipleSelectionIndex:[],
      // 编辑表项的弹窗
      showUpdateUnchecked:false,
      //编辑表项的当前项
      updateUncheckedItem:{},
      //编辑表项当前项在tableData中的序号
      updateUncheckedItemIndex:'',
      //上传Excel成功后提示框
      showSuccessUpload:false,
      //匹配表头弹窗
      showMatching:false,
      //当前标签页
      // activeName: 0,
      //某表头的key的名称
      selectkeysName:[],
      // 保存所有key
      allKeys:[],
      //所有实体的所有key
      options: [],
      table_name:'',
      table_column:[],
      option_base_format:{
        value:'',
        label:''
      },
      option_final_format:{
        value:'',
        label:'',
        children:[]
      },

      options_origin: [{
        value:'person',
        label:"人物资料",
        children:[{
          value:'personId',
          label:'personId'
        },{
          value: "personName",
          label: "人员姓名"
        },{
          value: "basicInfo",
          label: "基本资料"
        },{
          value: "resume",
          label: "履历"
        },{
          value: "others",
          label: "其他"
        }]
      },{
        value:'relation',
        label:"关系",
        children:[{
          value:'fatherId',
          label:'父节点ID'
        },{
          value: "fatherName",
          label: "父节点名称"
        },{
          value: "childId",
          label: "子节点ID"
        },{
          value: "childName",
          label: "子节点名称"
        },{
          value: "relationName",
          label: "关系名称"
        }]
      },{
        value:'unit',
        label:"单位序列",
        children:[{
          value:'unitId',
          label:'单位ID'
        },{
          value: "unitName",
          label: "单位名称"
        },{
          value: "pid",
          label: "PID"
        },{
          value: "unitFullName",
          label: "单位全称"
        },{
          value: "attribute",
          label: "属性"
        },{
          value: "nature",
          label: "性质"
        },{
          value: "services",
          label: "军种"
        },{
          value: "arms",
          label: "兵种"
        },{
          value: "categoryId",
          label: "类别ID"
        },{
          value: "category",
          label: "类别"
        },{
          value: "commendRelationship",
          label: "指挥关系"
        },{
          value: "warZone",
          label: "战区"
        },{
          value: "campId",
          label: "营区ID"
        },{
          value: "camp",
          label: "营区"
        },{
          value: "task",
          label: "任务 "
        },{
          value: "concreteTasks",
          label: "具体任务"
        },{
          value: "establishment",
          label: "编制"
        },{
          value: "peacetimeGarrison",
          label: "平时驻地"
        },{
          value: "peacetimeGarrisonLongitude",
          label: "平时驻地经度"
        },{
          value: "peacetimeGarrisonLatitude",
          label: "平时驻地纬度"
        },{
          value: "wartimeGarrison",
          label: "战时驻地"
        },{
          value: "wartimeGarrisonLongitude",
          label: "战时驻地经度"
        },{
          value: "wartimeGarrisonLatitude",
          label: "战时驻地纬度"
        },{
          value: "establishmentDate",
          label: "成立日期"
        },{
          value: "abolitionDate",
          label: "裁撤日期"
        },{
          value: "baseInfo",
          label: "基本情况"
        },{
          value: "detailedInfo",
          label: "详细情况"
        },{
          value: "remarks1",
          label: "备注1"
        },{
          value: "remarks2",
          label: "备注2"
        }]
      },{
        value:'EquipmentTree',
        label:"装备树",
        children:[{
          value:'equipmentId',
          label:'装备ID'
        },{
          value: "equipmentName",
          label: "装备名称"
        },{
          value: "equipmentTypeId",
          label: "装备类型ID"
        },{
          value: "equipmentMajorType",
          label: "装备大类"
        },{
          value: "equipmentType",
          label: "装备类型"
        },{
          value:'equipmentPurpose',
          label:'装备用途'
        },{
          value: "baseInfo",
          label: "基本情况"
        },{
          value: "structureFeature",
          label: "结构特征"
        },{
          value: "systemComposition",
          label: "系统组成"
        },{
          value: "deployment",
          label: "部署运用"
        },{
          value: "development",
          label: "未来发展"
        },{
          value: "combatTechnicalPerformance",
          label: "战技性能"
        },{
          value: "basicParams",
          label: "基本参数"
        },{
          value:'dynamicPerformance',
          label:'动力性能'
        },{
          value: "specialPerformance",
          label: "特殊性能"
        },{
          value: "equippedWeapons",
          label: "配备武器"
        },{
          value: "commandAndControlSystem",
          label: "指挥系统"
        },{
          value: "reconnaissanceEquipment",
          label: "侦搜装备"
        },{
          value: "ewEquipment",
          label: "电子战装备"
        },{
          value:'communicationEquipment',
          label:'通信装备'
        },{
          value: "iffEquipment",
          label: "敌我识别装备"
        },{
          value: "defenseSystem",
          label: "防护系统"
        },{
          value: "extensionName",
          label: "扩展名"
        }]
      },],
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

    reUpload:function(){
      //组件显示控制
      this.showUploadButton = true
      this.showTable = false

      //数据清零
      this.tableColumnList = []
      this.tableData = []
      this.multipleSelection = []
      this.multipleSelectionIndex = []
      this.allKeys = []
      this.options = JSON.parse(JSON.stringify(this.options_origin))   // todo 动态options
    },
    //=================Excel上传=========
    //Excel上传
    ExcelUpload:function (file) {
      //组件显示控制
      this.showUploadButton = false
      this.showTable = true
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
        this.tableColumnList = []
        for (var sh in this.xlsxJson[0].sheetHeader){
          this.tableColumnList.push(this.xlsxJson[0].sheetHeader[sh])
        }
        this.selectkeysName = JSON.parse(JSON.stringify(this.tableColumnList))

        for (var sd in sheetDates){
          //先转为数组、再加入tableData
          this.tableData.push(sheetDates[sd])
        }
      })

      //上传完成弹出弹窗
      this.showSuccessUpload = true
      console.log("上传成功，打开弹窗")
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
              sheet: XLSX.utils.sheet_to_json(this.wb.Sheets[sheetName]),
              sheetHeader : Object.keys(XLSX.utils.sheet_to_json(this.wb.Sheets[sheetName])[0])
            })
          })
          resolve(result)
        }
        reader.readAsBinaryString(file.raw)
        // reader.readAsBinaryString(file) // 传统input方法
      })
    },

    successUploadHandleClose:function (){
      this.$confirm('确认关闭？')
          .then(_ => {
            console.log("取消上传")
            //关闭界面
            this.showSuccessUpload = false
            //重新上传
            this.tableData = []
            this.tableColumnList =[]
            this.showUploadButton = true
            this.showTable = false
          })
          .catch(_ => {});

    },

    matchKeys:function (){
      //关闭提示面板 显示新面板
      this.showSuccessUpload =false
      this.showMatching = true

      //动态添加空[]，用于存储所选的key
      for(var i = 0; i < this.tableColumnList.length; i++){
        this.allKeys.push([])
      }

      this.$axios({
        method:"get",
        url:"http://10.24.82.10:8088/getAllDataBaseAndAttribute"
      }).then(res=>{
        // 一定要用深拷贝！！！
        for (var i = 0; i < res.data.data.length; i++) {
          this.option_final_format.label = JSON.parse(JSON.stringify(res.data.data[i].tableName))
          this.option_final_format.value = JSON.parse(JSON.stringify(res.data.data[i].tableName))
          for(var j = 0; j < res.data.data[i].keyWords.length; j++){

            this.option_base_format.label = JSON.parse(JSON.stringify(res.data.data[i].keyWords[j].value))
            this.option_base_format.value = JSON.parse(JSON.stringify(res.data.data[i].keyWords[j].value))
            this.option_final_format.children.push(JSON.parse(JSON.stringify(this.option_base_format)))
          }

          this.options.push(JSON.parse(JSON.stringify(this.option_final_format)))
          this.option_final_format.children = []
        }

      })

      console.log(this.allKeys)
      //现在用的是自己手工添加的
      // this.options = JSON.parse(JSON.stringify(this.options_origin))  //深拷贝
      // console.log(this.options)
      // this.$axios({
      //   method:"get",
      //   url:"http://10.24.82.10:8088/showAllTableColumns"
      // }).then(res=>{
      //   console.log("字段数据",res.data.data)
      // })
    },

    handleChangeForMatching:function (changedkey,index){
      this.selectkeysName[index] = this.$refs['cascader'][index].getCheckedNodes()[0].label
      console.log("keysName",this.selectkeysName)
      console.log( "当前allkeys",this.allKeys)
      console.log("改变了的key",changedkey)
      var nodeType = changedkey[0]
      var nodeAttib = changedkey[1]
      var key_list = this.allKeys.flat()

      //禁用已选择的key，取消未选择key的禁用
      console.log(key_list)
      for (var i = 0; i<this.options.length;i++){
        for (var j = 0; j< this.options[i].children.length; j++){
          if (key_list.indexOf(this.options[i].children[j].value) !== -1){
            this.options[i].children[j].disabled = true
          }else {
            this.options[i].children[j].disabled = false
          }
        }

      }
    },

    //匹配窗口取消
    matchingClose:function (){
       this.$confirm('确认关闭？')
           .then(_ => {
             console.log("取消上传")
             //关闭界面
             this.showSuccessUpload = false
             //重新上传
             this.tableData = []
             this.tableColumnList =[]
             this.showUploadButton = true
             this.showTable = false
             this.showMatching = false
             this.allKeys = []
             this.options = JSON.parse(JSON.stringify(this.options_origin))
             this.selectkeysName = []
           })
           .catch(_ => {});

    },
    matchingConfirm:function (){
      //要判断所有的key不能为空才算匹配完成========不用判断了，已保存属性 返回成功信息即可
      // var nullkey = []
      // //所有为空的表头
      // this.keys.forEach((key, index)=>{
      //   if (key === ''){nullkey.push(index)}
      // })
      // console.log(nullkey)
      // if (nullkey.length > 0){
      //   this.activeName = nullkey[0].toString()
      //   console.log(this.activeName)
      //   this.$message({
      //     type:'error',
      //     message: this.tableColumnList[nullkey[0]] + '没有进行匹配，请匹配后提交'
      //   })
      // }else {
      //   console.log("匹配完成")
      //   //关闭面板
      //   this.showMatching = false
      //   //修改动态表头数据
      //   // this.tableColumnList.forEach((colName, index) => {
      //   //   this.tableColumnList[index] = this.keys[index]
      //   // }
      //判断是否有表头没有匹配
      //判断为空
      var i = 0
      for (i; i < this.allKeys.length; i++){
        console.log(this.allKeys[i])
        if(this.allKeys[i].length === 0){
          this.$message({
            type:'error',
            message: this.tableColumnList[i]+"没有进行匹配，请匹配后提交！"
          })
          break
        }
      }
      if (i===this.allKeys.length){
        this.$message({
          type:'success',
          message: "匹配完成"
        })
        this.showMatching = false
        console.log(this.allKeys)

      }
    },

    //=================表格中的操作==============
    //上传错误弹窗关闭1
    showErrorHandleClose(){
      this.$confirm('确认放弃上传？')
          .then(_ => {
            //关闭界面
            this.showError = false
          })
          .catch(_ => {});
    },
    //  添加节点后确认
    addNewRelationConfirm:function(){
      console.log('确认后errnolist',this.errno_detail_list)
      //检查errnolist是不是都是0
      let isFinish = true;
      for (let i = 0; i< this.errno_detail_list.length; i++){
        if (this.errno_detail_list[i] !== 0){
          isFinish = false
        }
      }
      if (isFinish){
        //删除完善了节点的数据行
        var delete_col = []
        this.selectErrorlist.forEach(idx=>{
          delete_col.push(this.selectDataIdx[idx])
        })
        console.log("待删除的行：",delete_col)
        for (var m = 0 ; m < delete_col.length ;m ++){
          var minNum = 0; //待删除列表中，当前元素左侧小于该元素的元素的个数，没有比当前元素小的直接删，有小的要减去个数，不然会删错
          for (var n = 0; n < delete_col[m];n++){
            if (delete_col[n]< delete_col[m]){
              minNum+=1
            }
          }
          this.deleteRow(delete_col[m]-minNum)
        }
        // 关闭窗口
        this.showError = false
        // 数据清零
        this.errno_detail_list = []
        this.selectData = []

      }else {
        this.$message({
          type:'error',
          message: '有节点信息待完善'
        })
      }
    },
    //删除错误上传行（忽略本错误，不上传）
    errorDelete(index){
      console.log("删除的元素索引", index)
      this.selectData.splice(index, 1);
      this.Node_lenth -= 1;
    },

    //展示父子节点错误细节，显示完善节点窗口
    showErrorDetail(index){
      this.showCompleteErrorNode = true
      console.log('当前错误行的错误代码：',this.errno_detail_list[index])
      console.log('当前错误行数据：',this.selectData[index])
      this.errorData = this.selectData[index]
      this.errorDataIndex = index
      this.errorData['fatherType'] = ''
      this.errorData['childType'] = ''
      if (this.errno_detail_list[index] === -1){
        this.showFather = true
        this.showChild = false
      }else if (this.errno_detail_list[index] === 1){
        this.showChild = true
        this.showFather = false
      }else {
        this.showChild = true
        this.showFather = true
      }
    },
    //关闭完善节点窗口
    CompleteErrorNodeHandleClose(){
      this.$confirm('确认放弃上传？')
          .then(_ => {
            //关闭界面
            this.showCompleteErrorNode = false
            this.selectFatherType = ''
            this.selectChildType = ''
            this.errorData = []
            this.errorDataIndex = -1
            this.showChild = false
            this.showFather = false
          })
          .catch(_ => {});
    },
    //错误上传数据 节点完善确认
    CompleteErrorNodeConfirm:async function(){
      this.errorData['fatherType'] = this.selectFatherType
      this.errorData['childType'] = this.selectChildType
      //判断父节点是否完善完成 show为true但是 type为空 则无法上传
      var fatherFinish = (this.showFather === true) && (this.errorData['fatherType'] === '')
      var childFinish = (this.showChild === true) && (this.errorData['childType'] === '')

      console.log(fatherFinish, childFinish)
      console.log(this.errorData)

      if ((!fatherFinish)&&(!childFinish)){
        var objtoIndex = ["unit","person","employment"]
        //调用接口
        if (this.showFather){
          var fatherIdx = objtoIndex.indexOf(this.errorData['fatherType'])
          var fatherObj = {}
          if (fatherIdx === 0){
            fatherObj = {
              unitId:this.errorData['startNodeId'],
              unitName:this.errorData['startNodeName']
            }
          }else if (fatherIdx === 1){
            fatherObj = {
              personId:this.errorData['startNodeId'],
              personName:this.errorData['startNodeName'],
            }
          }else {
            fatherObj = {
              equipmentId:this.errorData['startNodeId'],
              equipmentName:this.errorData['startNodeName'],
            }
          }
          await this.uploadForDifObj(fatherObj,fatherIdx)
        }
        if (this.showChild){
          console.log("添加子节点")
          var childIdx = objtoIndex.indexOf(this.errorData['childType'])
          var childObj = {}
          if (childIdx === 0){
            childObj = {
              unitId:this.errorData['endNodeId'],
              unitName:this.errorData['endNodeName']
            }
          }else if (childIdx === 1){
            childObj = {
              personId:this.errorData['endNodeId'],
              personName:this.errorData['endNodeName'],
            }
          }else {
            childObj = {
              equipmentId:this.errorData['endNodeId'],
              equipmentName:this.errorData['endNodeName'],
            }
          }
          await this.uploadForDifObj(childObj,childIdx)
        }
        //添加关系
        var relObj = {
          "fatherName":this.errorData['startNodeName'],
          "fatherId":this.errorData['startNodeId'],
          "childName":this.errorData['endNodeName'],
          "childId":this.errorData['endNodeId'],
          "relationName":this.errorData['relationName']

        }
        await this.uploadForDifObj(relObj,3)
        this.errno_detail_list[this.errorDataIndex] = 0
        console.log(this.errno_detail_list)

        // 关闭窗口
        this.showCompleteErrorNode = false
        // 数据清空
        this.showChild = false
        this.showFather = false
        this.errorData = []
        this.selectChildType = ''
        this.errorDataIndex = -1
        this.selectFatherType = ''


        //提示信息
        await this.$message({
            type:'success',
            message: '关系添加成功！'
          })
        this.showError = false
        this.$nextTick(()=>{
          this.showError = true
        })
      }else{
        this.$message({
          type:'error',
          message: '请完善节点信息'
        })
      }
    },
    // 编辑数据
    updateUnchecked(data,index){
      console.log(data)
      this.showUpdateUnchecked = true
      this.updateUncheckedItem = data
      this.updateUncheckedItemIndex = index
    },
    //取消编辑关系
    cancleUpdateRelation(){
      this.showUpdateUnchecked = false
      this.updateUncheckedItem = {}
      this.updateUncheckedItemIndex = ''  //todo bug
    },

    //确认修改
    updateRelation: function(){
      console.log(this.updateUncheckedItem,this.updateUncheckedItemIndex)
         // await this.$axios({
      //   method:'post',
      //   url:'http://10.24.82.10:8088/updateUncheckedRelationById',
      //   data: [this.updateUncheckedItem]
      // }).then(res=>{
      //   console.log(res.data)
      // })

      console.log(this.tableData[this.updateUncheckedItemIndex])
      this.updateUncheckedItem = {}
      this.updateUncheckedItemIndex = ''
      this.showUpdateUnchecked =false
    },

    // 删除行（本地）
    deleteRow(index) {
      console.log("删除的元素索引", index)
      this.tableData.splice(index, 1);
      this.Node_lenth -= 1;
    },

    //上传数据（单行+批量）
    addUnchecked:async function(unchecked_data,indexs){
      this.errno_detail_list = []
      if (unchecked_data.length>0){
        console.log('选中的数据',unchecked_data,indexs)
        // var errno_list = []
        for (const data of unchecked_data) {
          let cl_idx = unchecked_data.indexOf(data);
          //调用表格对象分离函数
          var objectList = this.splitObjects(data)
          //分对象上传, splitObjects函数返回的对象类别是固定的，根据这个来传
          for (const obj of objectList) {
            let idx = objectList.indexOf(obj);
            if (Object.keys(obj).length > 0){
              console.log(obj,'类型序号',idx)
              //返回上传结果状态，这一步主要针对添加关系时可能会出现节点不存在的情况
              await this.uploadForDifObj(obj,idx).then(errno=>{
                this.errno_detail_list.push(errno)
                if (errno === 0){
                  //删除该行数据
                  var minNum = 0; //待删除列表中，当前元素左侧小于该元素的元素的个数，没有比当前元素小的直接删，有小的要减去个数，不然会删错
                  for (var j = 0; j<cl_idx;j++){
                    if (indexs[j]< indexs[cl_idx]){
                      minNum+=1
                    }
                  }
                  this.deleteRow(indexs[cl_idx]-minNum)
                }
              })
            }
          }
        }
        console.log("errno_list", this.errno_detail_list)

        //找有无上传失败的关系（节点不存在）
        let errno_idxes = []

        for (let i = 0; i <this.errno_detail_list.length;i++){
          //找父子节点哪个不存在
          var fatherExit = 0
          var childExit = 0
          if (this.errno_detail_list[i] === -1){
            errno_idxes.push(i)
            //找父节点是否存在
            await this.isExitForNodes(unchecked_data[i]["startNodeId"]).then(e=>{
              fatherExit = e
            })
            await this.isExitForNodes(unchecked_data[i]["endNodeId"]).then(e=>{
              childExit = e
            })
            console.log("父子节点的存在性",unchecked_data[i]["startNodeId"],unchecked_data[i]["endNodeId"],fatherExit,childExit)
          }
          if (fatherExit + childExit === -2){
            //父子节点均不存在
            this.errno_detail_list[i] = 2
          }
          else {
            if (childExit === -1){
              this.errno_detail_list[i] = 1
            }
          }
        }

        if (errno_idxes.length>0){
          console.log("选择上传的数据中存在错误的数据行：",errno_idxes)
          console.log("选择的上传数据各行的上传状态：",this.errno_detail_list)
          // 弹出对话框提示各行上传状态
          //各行数据
          this.selectData = unchecked_data
          this.selectDataIdx = indexs
          this.selectErrorlist = errno_idxes
          this.showError = true

        }else {

          this.cancelMultiSelection()
          this.multipleSelection = []
          this.multipleSelectionIndex = []

          this.$message({
            type:'success',
            message: '上传成功！'
          })
          // var i =0 //当前元素索引
          // indexs.forEach(idx=>{
          //   //找出当前元素左侧小于该元素的元素的个数
          //   //从tableData中删除
          //
          //   i +=1
          // })
        }
      }else {
        this.$message({
          type:'error',
          message: '请选择需要上传的待审核数据'
        })
      }

    },
    //上传数据之表格对象分离
    splitObjects:function (data) {
      //先创建几种对象，最后返回key不为空的
      var unit = {}
      var person = {}
      var relation = {}
      var EquipmentTree = {}

      console.log("本项数据对应的key表头",Object.keys(data))
      console.log('上面表头对应的对象映射关系',this.allKeys)
      //根据映射关系创建对象，分别调用不同的接口 todo
      this.allKeys.forEach((item,idx)=>{
        //unit
        if (item[0] === 'unit'){
          unit[item[1]] = data[Object.keys(data)[idx]]
        }
        else if (item[0]==='person'){
          person[item[1]] = data[Object.keys(data)[idx]]
        }
        else if (item[0]==='EquipmentTree'){
          EquipmentTree[item[1]] = data[Object.keys(data)[idx]]
        }
        else {
          relation[item[1]] = data[Object.keys(data)[idx]]
        }
      })
      return [unit,person,EquipmentTree,relation]
    },

    // 上传数据之分对象上传
    uploadForDifObj:async function (obj,idx){
      var funcs = ["addUnitSequenceNode", "addCharacterDataNode","addEquipmentTreeNode","addRelationTuple"]
      var errno = 0
      // 根据idx调用相应的接口
      await this.$axios({
        method:"post",
        data:obj,
        url:"http://10.24.82.10:8088/"+funcs[idx]
      }).then(res=>{
        console.log("分对象数据上传结果",res.data)
        errno = res.data.errno
      })
      return errno
    },

    //找节点是否存在（ById方式）
    isExitForNodes:async function(nodeId){
      var errno = 0
      await this.$axios({
        method:"get",
        url:'http://10.24.82.10:8088/getNodeAttributeById/'+nodeId
      }).then(res=>{
        errno = res.data.errno
      })
      return errno
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
