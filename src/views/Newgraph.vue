<template>
  <div class="container">
    <div class="header_text">知识图谱系统</div>

    <div class="main">

      <div class="search">
        <el-tabs id="searchNodeInfo" class="searchNodeInfo" v-model="activateName" type="card" @tab-click="handleClick" style="display: block">
          <el-tab-pane label="节点信息查询" name="first">
            <el-col :span="24">
              <!--                            通过el-col+span的组合来限制输入框的宽度-->
              <el-input id="single_node_search_input" v-model="single_node_search_temp" placeholder="查询" clearable="1"></el-input>
              <el-button id="nodeSearch" style="display: block" class="nodeSearch" icon="el-icon-upload" type="primary" @click="singleNodeSearch">节点查询</el-button>
              <el-button id="canclenodeSearch" style="display: none" class="nodeSearch"  type="primary" @click="cancleNodeSearch">取消</el-button>

            </el-col>
          </el-tab-pane>
          <el-tab-pane label="节点关系查询" name="second">
            <el-col :span="24">
              <el-input v-model="start_node_temp" placeholder="起始节点" clearable="1"></el-input>
              <p></p>
              <el-input v-model="end_node_temp" placeholder="终止节点" clearable="1"></el-input>
              <el-button id="nodeRelationSearch" style="display: none" class="nodeSearch" icon="el-icon-upload" type="primary" @click="relationSearch">节点关系查询</el-button>
              <el-button id="canclenodeRelationSearch" style="display: none" class="nodeSearch"  type="primary" @click="canclerelationSearch">取消</el-button>

            </el-col>
          </el-tab-pane>

        </el-tabs>
        <!--        控制显示点的个数-->
<!--        <el-input-number class = "el-input-number" v-model="num" @change="handleChange" :min="1" :max=this.maxx label="控制显示点的个数"></el-input-number>-->


        <!--        更改节点信息框-->
        <div id="changeOption" class="changeOption" style="display: none">
          <!--                    <el-radio v-model="option" label="Information" border>更改节点信息</el-radio>-->
          <!--                    <el-radio v-model="option" label="Relation" border>添加节点关系</el-radio>-->
          <!--                    这里必须使用 @change 来绑定方法-->
          <el-radio-group v-model="option" @change="changeOption">
            <el-radio-button label="更改节点信息"></el-radio-button>
            <el-radio-button label="添加节点关系"></el-radio-button>
          </el-radio-group>
          <p></p>
          <div id="EditModeNodeInfoChange" style="display:block;">
            <el-input v-model="EditNodeName" placeholder="输入节点名称" clearable="1"></el-input>
            <P></P>
            <el-button class="nodeSearch2" type="primary" @click="EditNode">更改信息</el-button>
          </div>
          <div id="EditModeAddNodeRelation" style="display: none">
            <el-input v-model="EditModeAddFormItem.source" placeholder="起始节点名称" clearable="1"></el-input>
            <p></p>
            <el-input v-model="EditModeAddFormItem.target" placeholder="终止节点名称" clearable="1"></el-input>
            <p></p>
            <el-button class="nodeSearch2" type="primary" @click="EditModeAddRelation">添加关系</el-button>
          </div>
      </div>


<!--        增加节点关系弹框-->
        <el-dialog width="30%" title="添加关系" :visible.sync="EditModeAddRelationVisible">
          <!--                    <div>起始节点: {{EditSourceNode}}</div>-->
          <!--                    <p></p>-->
          <!--                    <div>终止节点: {{EditTargetNode}}</div>-->
          <!--                    <p></p>-->
          <!--                    <div>-->
          <!--                        添加关系:-->
          <!--                        <el-col :span="6">-->
          <!--                            <el-input width="50%" v-model="EditModeAddNewRelation" placeholder="请输入新增关系" clearable=1></el-input>-->
          <!--                        </el-col>-->
          <!--                    </div>-->
          <el-form :label-position="left" label-width="80px" :model="EditModeAddFormItem">
            <el-form-item label="起始节点:">{{this.EditModeAddFormItem.source}}</el-form-item>
            <el-form-item label="终止节点:">{{this.EditModeAddFormItem.target}}</el-form-item>
            <el-form-item label="新增关系:">
<!--              <el-input v-model="EditModeAddFormItem.relation" clearable></el-input>-->
              <el-autocomplete
                  v-model="EditModeAddFormItem.relation"
                  :fetch-suggestions="querySearchAsync"
                  placeholder="请输入内容"
                  @select="handleSelect"
              ></el-autocomplete>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="canleAddRealation()">返 回</el-button>
            <el-button type="primary" @click="EditModeAddRelationConfirm()">添 加</el-button>
          </div>
        </el-dialog>

        <el-dialog width="30%" title="更改节点信息" :visible.sync="EditNodeVisible">
          <!--                    <div>起始节点: {{EditSourceNode}}</div>-->
          <!--                    <p></p>-->
          <!--                    <div>终止节点: {{EditTargetNode}}</div>-->
          <!--                    <p></p>-->
          <!--                    <div>-->
          <!--                        添加关系:-->
          <!--                        <el-col :span="6">-->
          <!--                            <el-input width="50%" v-model="EditModeAddNewRelation" placeholder="请输入新增关系" clearable=1></el-input>-->
          <!--                        </el-col>-->
          <!--                    </div>-->
          <el-form :label-position="left" label-width="120px" :model="EditNodeName">
            <el-form-item
                prop="nodeName"
                label="节点名称:"
            >{{this.EditNodeName}}</el-form-item>

            <el-form-item
                v-for="(att,key, index) in EditNodeAttribute"
                :label="key"
                :key="key"
                :prop="'att.' + index"
                :rules="{
                // required: true, message: '属性不能为空', trigger: 'blur'
              }"
            >
              <el-input class="editNodeAttrib" v-model="EditNodeAttribute[key]"></el-input>
              <el-button @click.prevent="removeAttrib(key)">删除</el-button>
            </el-form-item>

            <div v-for="(att,key, index) in   newNodeAttribute">
              <el-input class="editNodeAttrib1" v-model="att.attName"></el-input>
              <el-input class="editNodeAttrib" v-model="att.value"></el-input>
              <el-button @click.prevent="removenewAttrib(att)">删除</el-button>
              <p></p>
            </div>


          </el-form>

          <div slot="footer" class="dialog-footer">
            <el-button @click="cancleEditNodeAttrib">返 回</el-button>
            <el-button @click="addAttrib">新增属性</el-button>
            <el-button type="primary" @click="EditModeAddNodeAttribConfirm()">确定</el-button>


          </div>
        </el-dialog>

<!--        <el-button id="enterEditMode" type="primary" round=true  @click="EnterEditMode" class="EditModeButtom" style="display: block">进入编辑模式-->
<!--          <i class="el-icon-s-promotion el-icon&#45;&#45;right"></i>-->
<!--        </el-button>-->

        <el-button id="quitEditMode" type="primary" round=true  @click="QuitEditMode" class="QuitEditMode" style="display: none">退出编辑模式
          <i class="el-icon-s-promotion el-icon--right"></i>
        </el-button>


      </div>

      <div class="mainGragh">
        <div id="myChart" style="position: absolute;top:20%;left: 22%" :style="{width: '72%', height: '70%'}"></div>
        <!--                展示及编辑节点关系的弹窗-->
        <el-dialog width="30%" title="节点关系" :visible.sync="NodeRelationVisible">
          <el-dialog width="30%" title="请输入修改的内容" :visible.sync="NodeRelationChangeVisible" append-to-body>
            <div>当前关系为: {{relation}}</div>
            <p></p>
            <div>更改关系为:
<!--              <el-select v-model="value" placeholder="请选择一个关系">-->
<!--                <el-option v-for="item in ExistedRelation"-->
<!--                           :key="item.value"-->
<!--                           :label="item.label"-->
<!--                           :value="item.value">-->
<!--                </el-option>-->
<!--              </el-select>-->
                <el-input class="modify_relation" v-model="new_relation_value" placeholder="更改的关系"></el-input>
            </div>
            <div slot="footer" class="dialog-footer">
              <el-button @click="NodeRelationChangeVisible = false">返 回</el-button>
              <el-button type="primary" @click="ChangeRelation">修 改</el-button>
            </div>
          </el-dialog>
          <div>起始节点: {{source}}</div>
          <p></p>
          <div>终止节点: {{target}}</div>
          <p></p>
          <div>关系: {{relation}}</div>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="NodeRelationVisible = false">返 回</el-button>
            <el-button type="danger" @click="DeleteRelation">删除关系</el-button>
            <el-button type="warning" @click="NodeRelationChangeVisible = true">修改关系</el-button>
          </div>
        </el-dialog>
        <el-card class="box-card" id="Player_info" style="display: none">
          <div slot="header" class="clearfix">
            <span class="Attribute_item Attribute_text">节点信息</span>
          </div>
          <!--                    <div class="text item" v-for="(val,key,i) in currentPlayerNode" >-->
          <!--                        {{key}}:{{val}}-->
          <!--                    </div>-->
          <div class="Attribute_text Attribute_item"  v-for="(val,key,i) in currentNode">
            {{key}}:{{val}}
          </div>
        </el-card>

      </div>

      <div class="extensionButtons">
<!--        展示节点信息-->

        <el-button id="goToTextUpload" v-show="false" type="primary" round=true  @click="goToTextUpload" class="text_upload">文本导入
          <i class="el-icon-s-promotion el-icon--right"></i>
        </el-button>
        <el-button id="manualCheck" v-show="false" type="primary" round=true  @click="manualCheck" class="manual_check">人工审核
          <i class="el-icon-s-promotion el-icon--right"></i>
        </el-button>
        <el-button id="goToKnowledgeTree" v-show="false" type="primary" round=true  @click="goToKnowledgeTree" class="to_TreeGraph">知识树展示
          <i class="el-icon-s-promotion el-icon--right"></i>
        </el-button>
        <el-button id="Back_to_homepage" v-show="false" type="primary" round=true  @click="Back_to_homepage" class="back_to_homepage">返回首页
          <i class="el-icon-s-promotion el-icon--right"></i>
        </el-button>
      </div>

    </div>
  </div>
</template>

<script>
export default {
  name: "Newgraph",
  data (){
    return{

      // 控制最多显示节点数量
      maxx:5,     // TODO 新视图时更新

      //控制模式切换 show/edit
      mode: "show",
      // flag: 0,

      /**************************
      对视图进行点击时的一些变量******
       **************************/

      option: "更改节点信息",    //控制修改模式下面板的切换

      // 点击节点之间的连线展示节点关系所需要的变量
      source:null, // 源节点
      target:null,  // 目标节点
      relation:null,  // 关系
      fatherId:"",
      childId: "",

      NodeRelationVisible: false, // 是否展示关系
      NodeRelationChangeVisible:false, // 是否打开关系修改界面
      // TempHash:[], // 为了去除数组中重复的关系，使用一个hash表

      // TODO 存放已存在的关系用于新增关系
      ExistedRelation:[
        {value:'属于',label:'属于'},
        {value:'驻扎于',label:'驻扎于'},
        {value:'拥有',label:'拥有'},
        {value:'使用',label:'使用'},
      ],
      new_relation_value:null,
      new_relation_chooses:null,

      RelationIndex:null,

      // ChosenNodeName: "", //存储所选择节点的名称


      EditNodeName:'', //需要编辑信息的节点名称
      EditNodeVisible:false,
      //动态保存当点节点的属性
      EditNodeAttribute:{},
      newNodeAttribute:[],//保存新增节点的属性

      EditTargetNode:'',
      EditSourceNode:'',
      EditModeAddRelationVisible:false,
      EditModeAddNewRelation:'',
      EditModeAddFormItem:{
        source:'',
        target:'',
        relation:''
      },
      AddNewRelation:{
        fatherNode:'',
          childNode:'',
        nodeRelationType:'',
      },


      // 展示当前节点信息
      num:"5",  //TODO 还需在每次查询时更新

      //存储当前节点的属性信息
      currentNode:{

      },

      currentNodeInfo:[],

      // 画图变量
      myChart:'',

      new_data1:[
          {nodeName:'美军',
            label:0,
            attributlist:{
              atrb1:'节点信息1',
            }
          },
        {nodeName: '武器',
          label:1,
          attributlist:{
            atrb2:'节点信息2',
            atrb3:'节点信息3',
          }
        },
        {nodeName: '基地',
          label: 2,
          attributlist:{
            atrb1:'节点信息1',
            atrb3:'节点信息3',
          }
        },
        {nodeName:'枪',
          label:2,
          attributlist:{
            atrb1:'节点信息1',
            atrb2:'节点信息2',
            atrb3:'节点信息3',
          }
        }
        ,{nodeName:'炮',
          label:2,
          attributlist:{
            atrb1:'节点信息1',
            atrb2:'节点信息2',
          }
        }
        ],
      new_data:[],
      new_links1:[
          {fatherNode:'武器',childNode:'美军',nodeRelationType:'拥有'},
        {fatherNode:'基地',childNode:'美军',nodeRelationType:'属于'},
        {fatherNode:'美军',childNode:'武器',nodeRelationType:'装备'},
        {fatherNode:'武器',childNode:'美军',nodeRelationType:'部署'},
        {fatherNode:'美军',childNode:'枪',nodeRelationType:'使用'},
        {fatherNode:'炮',childNode:'美军',nodeRelationType:'使用'},
        {fatherNode:'炮',childNode:'基地',nodeRelationType:'有'},
        {fatherNode:'枪',childNode:'武器',nodeRelationType:'包括'},
        {fatherNode:'炮',childNode:'武器',nodeRelationType:'包括'},
        {fatherNode:'基地',childNode:'美军',nodeRelationType:'有'},
      ],
      new_links:[],

      allTableName:[],
      init_data:[], // 存储初始所有节点的列表
      init_links:[], // 存储初始所有的relation列表

      // init_node_Name:"",
      init_node_Id:"DW1",

      //控制两个搜索面板的切换
      activateName:'first',

      single_node_search_temp:"", // 如果不设置default_a sk 与 input的v-model 绑定的话，在前端ui部分无法输入
      single_node_search:"",

      single_node_data:[], // 单个节点查询的存储列表
      single_node_links:[], // 单个节点查询，存储其子节点关系

      start_node_temp:"",
      end_node_temp:"",
      start_node:"",
      end_node:"",
      search_node_data:[], // 查询到的节点列表
      search_node_relation:[], // 查询到的节点关系列表
      ask_nodes : "",
      ask_links : "",
      // 控制graph的参数
      ifUnfold:false,
      X : 30,
      Y : 30,
      Z : 20,

      search_nodes:[],
      search_links:[],
      search_node_Name:"",
      search_node_Id:"",
    }
  },
  mounted() {
    this.initWarning()
    this.InitGraph()

  },
  methods:{
    //===========================关系编辑====================================

    // √编辑模式添加节点关系的提交按钮，符合要求则将数据添加到数据库并刷新视图
    EditModeAddRelationConfirm: async function(){
      if(this.EditModeAddFormItem.relation===''){
        this.$message({
          type:'error',
          message: '添加的新关系不能为空'
        })
        // this.EditModeAddRelationVisible = false
      }
      else{
        //找两个节点对应的ID
        //TODO 现在是认为没有同名节点
        await this.$axios({
          method:'get',
          url:"http://10.24.82.10:8088/getNodeAttributeByName/" + this.EditModeAddFormItem.source
        }).then(res => {
          var Object_key = Object.keys(res.data.data)
          console.log(res.data.data)
          for (var i = 0; i < Object_key.length; i++){
            if(res.data.data[Object_key[i]].length > 0){
              switch (Object_key[i]) {
                case 'unitSequenceList':
                  this.EditModeAddFormItem['sourceId'] = res.data.data[Object_key[i]][0]['unitId']
                  break
                case 'characterList':
                  this.EditModeAddFormItem['sourceId'] = res.data.data[Object_key[i]][0]['personId']
                  break
                case 'equipmentTree':
                  this.EditModeAddFormItem['sourceId'] = res.data.data[Object_key[i]][0]['equipmentId']
              }
            }
          }
        })

        await this.$axios({
          method:'get',
          url:"http://10.24.82.10:8088/getNodeAttributeByName/" + this.EditModeAddFormItem.target
        }).then(res => {
          var Object_key = Object.keys(res.data.data)
          console.log(res.data.data)
          for (var i = 0; i < Object_key.length; i++){
            if(res.data.data[Object_key[i]].length > 0){
              switch (Object_key[i]) {
                case 'unitSequenceList':
                  this.EditModeAddFormItem['targetId'] = res.data.data[Object_key[i]][0]['unitId']
                  break
                case 'characterList':
                  this.EditModeAddFormItem['targetId'] = res.data.data[Object_key[i]][0]['personId']
                  break
                case 'equipmentTree':
                  this.EditModeAddFormItem['targetId'] = res.data.data[Object_key[i]][0]['equipmentId']
              }
            }
          }

        })

        console.log(this.EditModeAddFormItem)

        // 传入数据库新增加的关系
        await this.$axios({
          method:'post',
          data:{
            "fatherName":this.EditModeAddFormItem['source'],
            "fatherId":this.EditModeAddFormItem['sourceId'],
            "childName":this.EditModeAddFormItem['target'],
            "childId":this.EditModeAddFormItem['targetId'],
            "relationName":this.EditModeAddFormItem.relation
          },
          url:'http://10.24.82.10:8088/addRelationTuple'
        }).then(res=>{
          console.log("关系添加结果",res.data)
          this.EditModeAddRelationVisible = false
          this.EditModeAddFormItem.source = ''
          this.EditModeAddFormItem.target = ''
          this.EditModeAddFormItem.relation = ''
          this.EditModeAddFormItem.sourceId = ''
          this.EditModeAddFormItem.targetId = ''
          this.InitGraph()
        })

      }

    },

    // √编辑模式下的“添加关系”按钮（相当于搜索节点），target、source不为空则显示添加关系面板
    EditModeAddRelation(){
      if(this.EditModeAddFormItem.target === '' || this.EditModeAddFormItem.source === ''){
        this.$message({
          type:'error',
          message:'源节点和目标节点不能为空'
        })
      }else{
        this.EditModeAddRelationVisible = true

        //查找相对应的节点
        //TODO 这里可能存在多个同名，但ID不相同的节点，节点间的已有关系也需要显示，后续做
      }
    },

    // √编辑模式下的删除关系
    DeleteRelation: function(){
      this.$confirm('是否删除这该关系','提示',{
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type:'warning'
      }).then(()=>{


        this.$axios({
          method:'post',
          data:{
            "fatherName":this.source,
            "fatherId":this.fatherId,
            "childName":this.target,
            "childId":this.childId,
            "relationName":this.relation
          },
          url:"http://10.24.82.10:8088/deleteRelationTuple"
        }).then(res=>{
          console.log("关系删除结果",res.data)
          //TODO 这里要判断删除是否成功
          this.$message({
            type:'success',
            message:'修改成功'
          })
          this.InitGraph()
          this.NodeRelationChangeVisible = false
          this.NodeRelationVisible = false
          // console.log(this.source,this.childId,this.target,this.fatherId,this.relation)
        })


      }).catch(()=>{
        this.$message({
          type: 'info',
          message: '已取消修改'
        })
      })
    },

    // √编辑模式下的更改关系
    ChangeRelation(){
      this.$confirm('此操作将更新该关系为'+'，是否继续','提示',{
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type:'warning'
      }).then(()=>{
        if(this.new_relation_value==null){
          this.$message({
            type : 'warning',
            // message: '所选的属性值不能为空，请选择一个属性值'
            message:'输入的属性不能为空'
          })
          // this.NodeRelationChangeVisible = false
        }
        else{
          this.$message({
            type:'success',
            message:'修改成功'
          })
          console.log(this.new_relation_value, this.source, this.target)
          // this.new_links[this.RelationIndex].nodeRelationType = this.value
          // this.Draw_graph(this.new_data,this.new_links)

          // 将修改的关系传入后台数据库
          this.$axios({
            method:'post',
            data:{
              "fatherName":this.source,
              "fatherId":this.fatherId,
              "childName":this.target,
              "childId":this.childId,
              "relationName":this.relation
            },
            url:"http://10.24.82.10:8088/changeRelation/" + this.new_relation_value
          }).then(res=>{
            console.log("关系修改结果",res.data)
            this.InitGraph()
            this.NodeRelationChangeVisible = false
            this.NodeRelationVisible = false
            this.new_relation_value = null
          })

        }

      }).catch(()=>{
        this.$message({
          type: 'info',
          message: '已取消修改'
        })
      })
    },

    //√找到需要更改的关系的下标
    findRelationIndex(relation){
      return relation.fatherName == this.source && relation.childName == this.target && relation.relationName == this.relation
    },

    //取消“添加关系”的返回按钮
    canleAddRealation(){
      this.EditModeAddRelationVisible = false
      this.EditModeAddFormItem.relation = ''
    },

    //=======================节点编辑========================
    // 编辑模式修改节点信息的提交按钮，符合要求则将数据添加到数据库并刷新视图
    EditModeAddNodeAttribConfirm(){
      var isEmpty=false  //判断是否存在为空的新增属性
      for (var item in this.newNodeAttribute){
        if(this.newNodeAttribute[item].attName ==='' || this.newNodeAttribute[item].value ===''){
          isEmpty= true
        }
      }
      if (isEmpty){
        this.$message({
          type:'error',
          message: '添加的新属性不能为空'
        })}
      else {
        //将新增属性添加到EditNodeAttribute
        for(let index in this.newNodeAttribute){
          this.$set(this.EditNodeAttribute,this.newNodeAttribute[index].attName,this.newNodeAttribute[index].value)
        }
        //TODO 将新增节点属性更新到数据库中
        this.new_data.filter(ele => ele.nodeName === this.EditNodeName)[0].attributlist = this.EditNodeAttribute
        this.EditNodeVisible = false
        // console.log(this.EditNodeAttribute)
        // console.log(this.new_data.filter(ele => ele.nodeName === this.EditNodeName)[0])
        this.Draw_graph(this.new_data,this.new_links)  //TODO 更新视图
        this.currentNode = this.new_data.filter(ele => ele.nodeName === this.EditNodeName)[0].attributlist
        //TODO 目前节点信息中没有属性列表，都设置为{}
        //清空临时数据
        this.EditNodeAttribute = {}
        this.newNodeAttribute =[]
        this.EditNodeName=''
      }

    },

    // √编辑模式下的“更改信息”按钮，不为空显示节点编辑对话框√
    EditNode(){
      if(this.EditNodeName === ''){
        this.$message({
          type:'error',
          message:'节点名称不能为空'
        })
      }else{
        this.EditNodeVisible = true

        //找到这个节点的相关属性信息
        var nodeTemp = this.init_data.filter(ele => ele.nodeName===this.EditNodeName)  //TODO 现在是从init_data中找，可以改成从数据库中找
        this.EditNodeAttribute=JSON.parse(JSON.stringify(nodeTemp[0].attributlist))

      }
    },
    //√编辑节点信息面板中的原有属性删除按钮√
    removeAttrib(item) {
      //删除相应元素
      this.$delete(this.EditNodeAttribute,item)

    },

    //√编辑节点信息面板中的新属性的删除√
    removenewAttrib(item) {

      var index = this.newNodeAttribute.indexOf(item)
      if (index !== -1) {
        this.newNodeAttribute.splice(index, 1)
      }
    },

    //√编辑节点面板中的新增属性，新增了一个空白属性√
    addAttrib(){
      this.newNodeAttribute.push({
        attName: '',
        value: ''
      });
    },

    //√取消编辑节点的属性：返回按钮√
    cancleEditNodeAttrib(){
      this.EditNodeVisible = false
      //重新获得原有节点
      var nodeTemp = this.new_data.filter(ele => ele.nodeName===this.EditNodeName)  //TODO 从后台数据库中获取
      this.EditNodeAttribute=JSON.parse(JSON.stringify(nodeTemp[0].attributlist))

      this.newNodeAttribute = []
    },

    //=====================节点查询===========================
    //√节点查询
    singleNodeSearch:async function(){
      console.log('find nodes');

      console.log(this.single_node_search_temp)  //输入框中的内容
      if(this.single_node_search_temp) {
        //如果输入框中有数据
        //关闭“节点查询”
        document.getElementById("nodeSearch").style.display = 'none'
        //打开“取消”按钮
        document.getElementById("canclenodeSearch").style.display = 'block'

        //获得根节点的tableKeyWords格式
        await this.$axios({
          method:'get',
          url:'http://10.24.82.10:8088/getNodeByKeyValue/'+this.single_node_search_temp
        }).then(res=>{
          console.log("查询结果",res.data.data)
          this.single_node_search = res.data.data
          // //获得查询节点ID
          // var Object_key = Object.keys(res.data.data)
          // for (var i = 0; i < Object_key.length; i++){
          //   if(res.data.data[Object_key[i]].length > 0){
          //     switch (Object_key[i]) {
          //       case 'unitSequenceList':
          //         this.search_node_Name = res.data.data[Object_key[i]][0]['unitName']
          //         this.search_node_Id = res.data.data[Object_key[i]][0]['unitId']
          //         break
          //       case 'characterList':
          //         // console.log(search_node_data)
          //         this.search_node_Name = res.data.data[Object_key[i]][0]['personName']
          //         this.search_node_Id = res.data.data[Object_key[i]][0]['personId']
          //         break
          //       case 'equipmentTree':
          //         this.search_node_Name = res.data.data[Object_key[i]][0]['equipmentName']
          //         this.search_node_Id = res.data.data[Object_key[i]][0]['equipmentId']
          //     }
          //   }
          // }
          // console.log(this.search_node_Name, this.search_node_Id)
        })

        //根据ID获得一阶关系
        await this.$axios({
          method:'post',
          url:"http://10.24.82.10:8088/searchNodeEntityOneStageRelation",
          data:this.single_node_search
        }).then(res=>{
          console.log('dd',res.data.data)
          this.search_links = []
          this.search_links = res.data.data
        })

        // 找到与查询节点有关的所有节点信息
        await this.get_related_nodes(this.search_links).then(res=>{
          this.search_nodes = res
        })

        this.Draw_graph(this.search_nodes, this.search_links)

        this.maxx = this.search_nodes.length
        this.num = this.maxx
      }
      else{
        this.$message({
          type:'error',
          message: '查询节点不能为空'
        })
      }
    },

    //√取消节点搜索
    cancleNodeSearch:function(){
      //改变计数器
      this.num = this.init_data.length
      //关闭“取消”按钮
      document.getElementById("canclenodeSearch").style.display = 'none'
      //显示“节点查询”按钮
      document.getElementById("nodeSearch").style.display = 'block'
      //显示初始节点视图
      this.InitGraph()
      //清空输入框
      this.single_node_search_temp = ""
    },

    //=====================关系查询=============================
    //√关系查询
    relationSearch:async function(){
      console.log('find links');
      console.log(this.start_node_temp);
      console.log(this.end_node_temp);

      if(this.start_node_temp && this.end_node_temp)  {
        //关闭“节点关系查询”
        document.getElementById("nodeRelationSearch").style.display = 'none'
        //打开“取消”按钮
        document.getElementById("canclenodeRelationSearch").style.display = 'block'
        //从后台获取关系--找到这些关系中包含的所有节点
        //根据两个节点名找关系
        await this.$axios({
          method:'get',
          url:'http://10.24.82.10:8088/queryRelationTupleByTwoName/'+this.start_node_temp + '/' + this.end_node_temp
        }).then(res=>{
          console.log("关系查询结果："+res.data.data)
          this.ask_links = []
          this.ask_links = res.data.data
        })

        //找到关系中包含的所有节点
        this.ask_nodes = []
        await this.get_related_nodes(this.ask_links).then(res=>{
          this.ask_nodes = res
        })
        this.Draw_graph(this.ask_nodes, this.ask_links)

        this.maxx = this.ask_nodes.length
        this.num = this.maxx
      }
      else{
        this.$message({
          type:'error',
          message: '查询节点不能为空'
        })
      }
    },

    //√取消关系搜索
    canclerelationSearch:function(){
      //关闭“取消”按钮
      document.getElementById("canclenodeRelationSearch").style.display = 'none'
      //显示“节点查询”按钮
      document.getElementById("nodeRelationSearch").style.display = 'block'
      //显示全部节点信息
      this.InitGraph()
      //清空输入框
      this.start_node_temp = ""
      this.end_node_temp = ""

      this.num = this.init_data.length
    },

    //===================界面显示===============================
    // 未初始化数据库时的提示
    initWarning:async function(){
      await this.$axios({
        method: 'get',
        url:'http://10.24.82.10:8088/getAllDataBaseAndAttribute',
      }).then(res=>{

        // console.log(res.data)
        // if (tableData.length > 0){
        if (res.data.errmsg !=='null database'){
        // if (1){
          var tableData = res.data.data
          this.allTableName = []
          tableData.forEach(td=>{
            this.allTableName.push(td.tableName)
          })
        }
        else{
          this.$confirm('还未创建数据库，请前往创建！', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            center: true
          }).then(() => {
            this.$router.push('/init_database')
          }).catch(() => {
            this.initWarning()
          });
        }
      })

    },

    //√查询模式下的面板切换
    handleClick(tab,event){
      if(tab.name==="first"){
        this.activateName = 'first'
        document.getElementById("nodeSearch").style.display='block'
        document.getElementById("nodeRelationSearch").style.display='none'
        document.getElementById("canclenodeRelationSearch").style.display='none'
      }
      else if(tab.name==="second"){
        this.activateName = 'second'
        document.getElementById("nodeSearch").style.display='none'
        document.getElementById("canclenodeSearch").style.display='none'
        document.getElementById("nodeRelationSearch").style.display='block'
      }
    },

    //√编辑模式下“更改节点信息”与“添加节点关系”面板的显示√
    changeOption(param){
      // console.log(param.type) // undefined
      // console.log(param)
      if(param==="更改节点信息"){
        console.log(456)
        document.getElementById("EditModeNodeInfoChange").style.display='block'
        document.getElementById("EditModeAddNodeRelation").style.display='none'
        document.getElementById("Player_info").style.display='block'
      } else if(param==="添加节点关系"){
        console.log(123)
        document.getElementById("EditModeNodeInfoChange").style.display='none'
        document.getElementById("EditModeAddNodeRelation").style.display='block'
        document.getElementById("Player_info").style.display='none'
      }
    },

    //√退出编辑模式：操作各组件的显示与否√
    QuitEditMode(){
      document.getElementById("Player_info").style.display='none'
      document.getElementById("searchNodeInfo").style.display = 'block'
      document.getElementById("nodeSearch").style.display = 'block'
      document.getElementById("quitEditMode").style.display = 'none'
      // document.getElementById("goToTextUpload").style.display = 'block'
      // document.getElementById("manualCheck").style.display = 'block'
      // document.getElementById("Back_to_homepage").style.display = 'block'
      // document.getElementById("goToKnowledgeTree").style.display = 'block'
      document.getElementById("changeOption").style.display = 'none'
      document.getElementById("enterEditMode").style.display = 'block'
      if(this.activateName=='second'){
        // document.getElementById("nodeSearch").style.display = 'none'
        document.getElementById("nodeRelationSearch").style.display = 'block'
        document.getElementById("nodeSearch").style.display = 'none'
      } else{
        document.getElementById("nodeSearch").style.display = 'block'
        // document.getElementById("nodeRelationSearch").style.display = 'none'
      }
      this.mode = 'show'
    },

    //√进入编辑模式：操作各组件的显示与否 √
    EnterEditMode(){
      // document.getElementById("Player_info").style.display='block'
      document.getElementById("searchNodeInfo").style.display = 'none'
      document.getElementById("nodeSearch").style.display = 'none'
      document.getElementById("quitEditMode").style.display = 'block'
      document.getElementById("goToTextUpload").style.display = 'none'
      document.getElementById("manualCheck").style.display = 'none'
      document.getElementById("Back_to_homepage").style.display = 'none'
      document.getElementById("goToKnowledgeTree").style.display = 'none'
      document.getElementById("changeOption").style.display = 'block'
      document.getElementById("enterEditMode").style.display = 'none'
      if(this.activateName=='second'){
        // document.getElementById("nodeSearch").style.display = 'none'
        document.getElementById("nodeRelationSearch").style.display = 'none'
      } else{
        document.getElementById("nodeSearch").style.display = 'none'
        // document.getElementById("nodeRelationSearch").style.display = 'none'
      }
      this.mode = 'edit'
    },


    //TODO 计数器变动，要改成阶数的显示
    handleChange(value) {
      this.maxx = this.ask_nodes.length
      console.log("JI SHU")
      console.log(this.ask_nodes)

      console.log(value);    //这里的value应该是this.num
      var nodes = this.ask_nodes.slice(0,value);   //显示前value个节点
      var names = [];
      for (let i = 0; i < nodes.length; i++){
        names.push(nodes[i].nodeName)
      }
      console.log(names);
      var links = this.ask_links.filter(ele =>
          names.includes(ele.fatherName) && names.includes(ele.childName)
      )
      // for (let i = 0; i < this.new_links.length; i++){
      //     if (names.find(this.new_links[i].childNode) != null && names.find(this.new_links[i].fatherNode) != null){
      //         links.push(this.new_links[i])
      //     }
      // }
      console.log(links);
      this.Draw_graph(nodes,links);
    },

    //√初始视图
    InitGraph:async function(){
      this.init_data = []
      this.init_links = []

      //所有节点
      await this.$axios({
        method:'get',
        url:"http://10.24.82.10:8088/initGraphNodesInfo"
      }).then(res=>{
        res.data.data.forEach(nodeData=>{
          var dataTemp = {}
          dataTemp['nodeName'] = nodeData.keyWords[0][Object.keys(nodeData.keyWords[0])]
          dataTemp['label'] = this.allTableName.indexOf(nodeData.tableName)
          dataTemp['attributlist'] = nodeData.keyWords
          this.init_data.push(dataTemp)
        })
      })

      //所有关系
      await this.$axios({
        method:'get',
        url:'http://10.24.82.10:8088/initGraphRelationTuple'
      }).then(res=>{
        console.log(res.data.data)
        res.data.data.forEach(linkData=>{
          var dataTemp = {}
          dataTemp['fatherName'] = linkData['fatherNodeKey']
          dataTemp['childName'] = linkData['childNodeKey']
          dataTemp['relationName'] =linkData['relationTypeName']
          this.init_links.push(dataTemp)
        })
      })
      //获得初始节点的一阶关系
      // await this.$axios({
      //   method:'get',
      //   url:"http://10.24.82.10:8088/getOneStageNodeRelationTupleById/" + this.init_node_Id
      // }).then(res=>{
      //   console.log('get links of init node')
      //   this.init_links = res.data.data
      // })

      //获得与初始节点有关的节点信息
      // await this.get_related_nodes(this.init_links).then(res=>{
      //   this.init_data = res
      // })

      this.Draw_graph(this.init_data, this.init_links)
      this.maxx = this.init_data.length
      this.num = this.maxx

    },

    //√绘图
    Draw_graph:function(allNodes,allLinks){

      console.log("当前视图所有节点");
      console.log(allNodes);
      console.log("当前视图所有关系")
      console.log(allLinks);

      var size = 50;

      var listdata = [];
      var links = [];

      function setData(nodeName, label,i,X,Y,Z,Unfold) {
        if(Unfold === false){
          label = -parseInt(label)
        }
        const flag = nodeName === "disease"   //TODO ???
        listdata.push({
          x: X*i,
          y: Y + Z*i,
          // attributlist:nodeAttributes,
          "name":nodeName, // 各个节点的name参数不能重复
          "symbolSize":size, // 该类目节点标记的大小
          "category": -label, // 该节点所在类目的index
          "nodeType": flag, //
          "draggable": "true",
          "open" : "true"
        })
      }
      function setLinkData(chileId, fatherId,relationName,curveness) {
        links.push({
          "source": fatherId,
          "target": chileId,
          label:{
            show: true,
            formatter:relationName // 在formatter中添加文字可以实现将文字显示在关系上
          },
          lineStyle: {
            normal: {
              color: 'source',
              curveness:curveness,
            },
          }
        })
      }

      for(let i=0,len=allNodes.length;i<len;i++){
        setData(allNodes[i].nodeName, allNodes[i].label, i, this.X, this.Y, this.Z, this.ifUnfold)
      }
      // console.log(listdata)
      for(let i=0,len=allLinks.length;i<len;i++){
        setLinkData(allLinks[i].childName, allLinks[i].fatherName, allLinks[i].relationName,0.1*i+0.1)
      }
      var legendes = this.allTableName
      var texts = [];
      for (var i =0; i<legendes.length;i++){
        texts.push({
          "name":legendes[i],
        })
      }

      let that = this
      // function showNodeAttribute(chart) { // 展示节点属性
      //   chart.on('mouseover',function (params) {
      //     // console.log(params.name)
      //     this.$axios({
      //       method:'get',
      //       url:'http://39.108.102.157:8088/getAttributeValueByNodeName/' + params.name
      //     }).then(response=>{
      //       that.currentNode = response.data.data // 这里不能用this, 必须用that，否则数据传输不到currentNode
      //       console.log(this.currentNode)
      //       document.getElementById("Node_Attribute_Info").style.display = 'block'
      //     })
      //   })
      //
      // }

      // /**
      //  * 绑定图表的点击事件
      //  * @param chart
      //  */
      // function bindChartClickEvent(chart) {
      //   chart.on('click', function (params) {
      //
      //     console.log(params)
      //     var category = params.data.category,
      //         nodeType = params.data.nodeType;
      //     // console.log(nodeType);
      //     toggleShowNodes(chart, params);
      //     // if (category === 0 || nodeType === 1) {
      //     //     toggleShowNodes(chart, params);
      //     // }
      //   });
      // }
      //
      // /**
      //  * 展开或关闭节点
      //  * @param chart
      //  * @param params
      //  */
      // function toggleShowNodes(chart, params) {
      //   var open = !!params.data.open,
      //
      //       options = chart.getOption(),
      //       seriesIndex = params.seriesIndex,
      //       srcLinkName = params.name,
      //       serieLinks = options.series[seriesIndex].links,
      //       serieData = options.series[seriesIndex].data,
      //       serieDataMap = new Map(),
      //       serieLinkArr = [];
      //   // console.log("open:" + open);
      //   console.log(options);
      //   // 当前根节点是展开的，那么就需要关闭所有的根节点
      //   if (open) {
      //     // 递归找到所有的link节点的target的值
      //     findLinks(serieLinkArr, srcLinkName, serieLinks, true);
      //     if (serieLinkArr.length) {
      //       serieData.forEach(sd => serieDataMap.set(sd.name, sd));
      //       for (var i = 0; i < serieLinkArr.length; i++) {
      //         if (serieDataMap.has(serieLinkArr[i])) {
      //           var currentData = serieDataMap.get(serieLinkArr[i]);
      //           currentData.category = -Math.abs(currentData.category);
      //           if (currentData.nodeType === 1) {
      //             currentData.open = false;
      //           }
      //         }
      //       }
      //       serieDataMap.get(srcLinkName).open = false;
      //       chart.setOption(options);
      //     }
      //   } else {
      //     // 当前根节点是关闭的，那么就需要展开第一层根节点
      //     // console.log(open);
      //     findLinks(serieLinkArr, srcLinkName, serieLinks, false);
      //     if (serieLinkArr.length) {
      //       serieData.forEach(sd => serieDataMap.set(sd.name, sd));
      //       for (var j = 0; j < serieLinkArr.length; j++) {
      //         if (serieDataMap.has(serieLinkArr[j])) {
      //           var currentData = serieDataMap.get(serieLinkArr[j]);
      //           currentData.category = Math.abs(currentData.category);
      //         }
      //       }
      //       serieDataMap.get(srcLinkName).open = true;
      //       chart.setOption(options);
      //     }
      //   }
      // }
      //
      // /**
      //  * 查找连接关系
      //  * @param links 返回的节点放入此集合
      //  * @param srcLinkName 源线的名称
      //  * @param serieLinks 需要查找的集合
      //  * @param deep 是否需要递归进行查找
      //  */
      // function findLinks(links, srcLinkName, serieLinks, deep) {
      //   var targetLinks = [];
      //   serieLinks.filter(link => link.target === srcLinkName).forEach(link => {
      //     targetLinks.push(link.source);
      //     links.push(link.source)
      //   });
      //   console.log(targetLinks);
      //   if (deep) {
      //     for (var i = 0; i < targetLinks.length; i++) {
      //       findLinks(links, targetLinks[i], serieLinks, deep);
      //     }
      //   }
      //   console.log(targetLinks);
      // }

      this.myChart = this.$echarts.init(document.getElementById('myChart'))
      console.log(legendes)
      const option = ({
            title: {
              text: "节点列表", //主标题文本
              top: 0, // 距离容器组件上侧的距离
              right: 100, // 距离容器组件左侧的距离
              textStyle: { // 文字样式，字体风格颜色等参数设置
                color: '#f7f7f7'
              }
            },
            tooltip: { // 提示框浮层内容格式器
              formatter:'{b}'
              //     function (params) {
              //   // 鼠标悬浮在节点上，所显示的内容
              //   // console.log(params.data.attributlist)
              //   var showAttrib = ''
              //   for(var attr in params.data.attributlist){
              //     showAttrib += attr + '：' + params.data.attributlist[attr] + '<br/>'
              //   }
              //   return showAttrib
              // }
            },
            toolbox: { // 工具栏，可以在里面添加，导出图片，数据视图等功能
              show: true,
              feature: { // 工具项配置，工具按钮
                restore: { // 还原配置项
                  show: true
                },
                saveAsImage: { // 保存图片
                  show: true // 是否显示该工具
                }
              }
            },
            // backgroundColor: '#15161F',
            legend: { // 图例组件，显示图例
              data: legendes,
              textStyle: {
                color: '#fff'
              },
              icon: 'circle', // 图例标记，有 circle、rect、roundRect、triangle等
              type: 'scroll', // 图例类型，有 plain 和 scroll 两种，当图例较多的时候可以使用scroll，然后对其具体的属性再进行设置
              orient: 'vertical', // 图例的布局朝向，有 vertical 和 horizontal 两种
              // left: 900, // 距离容器左侧的距离，可以是10这种具体的像素值，也可以是10%这样的比例
              right: 100,
              top: 30, // 距离容器上侧的距离
              bottom: 20, // 距离容器下侧的距离
              itemWidth: 15, // 图例标记的图形宽度
              itemHeight: 20 // 图例标记的图形高度
            },
            animationDuration: 1000, // 初始动画时长
            animationEasingUpdate: 'quinticInOut', // 数据更新时的动画效果
            series: [{
              name: '知识图谱',
              type: 'graph',
              layout: 'force', // 图的布局，force：力导向图，circular：环形布局
              force: { // 模拟电荷，给两个节点间添加斥力，给相连节点添加引力
                repulsion: 10, // 斥力大小
                gravity: 0.1, // 受到中心节点引力的大小
                edgeLength: 10, // 节点之间的距离，也会受到replusion的影响
                layoutAnimation: true, // 显示布局的迭代动画
              },
              data: listdata,
              links: links,
              categories: texts,
              roam: false,
              edgeSymbol:['circle','arrow'], // 设置连线两端的箭头样式
              edgeSymbolSize:[5,15],
              label: {
                normal: {
                  show: true,
                  position: 'inside',
                  formatter: '{b}',
                  fontSize: 12,
                  fontStyle: '600',
                }
              },
              lineStyle: {
                normal: {
                  opacity: 0.9,
                  width: 1.5
                }
              }
            }]
          }
      );

      //控制点击的函数
      this.myChart.off('click')

      this.myChart.on('click', function (params) {
        if(that.mode==='show'){
          if(params.dataType==='node'){
            that.$message({
              type: 'info',
              message: '这是一个节点'
            })
          }
          else if(params.dataType==='edge'){
            that.$message({
              type: 'info',
              message: '这是一条关系'
            })
          }
        }
            // console.log(params);
            // console.log(params.dataType);
            // console.log(params.data.source)
            // console.log(params.data.target)
        // console.log(params.data.label.formatter)
        else if(that.mode === 'edit'){
          if(params.dataType === 'node'){
            if(that.option === '更改节点信息'){
              that.EditNodeName = params.name
              // console.log(params)
            }

            if(that.option === '添加节点关系'){
              if(that.EditModeAddFormItem.source === ''){
                that.EditModeAddFormItem.source = params.name
              }
              else if (that.EditModeAddFormItem.target === ''){
                that.EditModeAddFormItem.target = params.name
              }
            }
            document.getElementById("Player_info").style.display='block'
            that.currentNode = params.data.attributlist
          }
          if(params.dataType==='edge'){
            console.log("params",params.data)
            that.source = params.data.source
            that.target = params.data.target
            that.relation = params.data.label.formatter
            that.RelationIndex = that.init_links.findIndex(that.findRelationIndex)
            that.fatherId = that.init_links[that.RelationIndex]["fatherId"]
            that.childId = that.init_links[that.RelationIndex]["childId"]
            console.log("对应的关系下标是: ",that.RelationIndex)
            console.log(that.init_links[that.RelationIndex])
            that.NodeRelationVisible = true
          }
        }

      });
      this.myChart.setOption(option);
      // bindChartClickEvent(this.myChart);
      // showNodeAttribute(this.myChart);
    },

    //=================数据处理=======================
    //根据属性列表组织用于显示的节点数据结构{节点名、label、属性列表}
    get_node:function(node_attr_data){
      var node_data = {}
      var Object_key = Object.keys(node_attr_data)

      if (Object_key.indexOf('unitId') !== -1 && Object_key.indexOf('equipmentId') === -1){
        // console.log(res.data.data['unitName'])
        node_data["nodeName"] = node_attr_data['unitName']
        node_data["label"] = 0
        node_data["attributlist"] = node_attr_data
      }
      else if(Object_key.indexOf('personId') !== -1){
        // console.log(res.data.data['personName'])
        node_data["nodeName"] = node_attr_data['personName']
        node_data["label"] = 1
        node_data["attributlist"] = node_attr_data
      }
      else if(Object_key.indexOf('equipmentId')!== -1){
        // console.log(res.data.data)
        node_data["nodeName"] = node_attr_data['equipmentName']
        node_data["label"] = 2
        node_data["attributlist"] = node_attr_data
      }
      return node_data
    },

    //获得某节点一阶关系中包含的所有节点
    get_related_nodes:async function(links){
      var nodes = []
      //得到这些节点得到ID
      var nodes_temp = []
      for(var i = 0; i< links.length;i++){
        nodes_temp.push(links[i]['childId'])
        nodes_temp.push(links[i]['fatherId'])
      }
      //去重
      nodes_temp = this.unique(nodes_temp)
      console.log(nodes_temp)

      //根据ID组织数据结构
      for(var j = 0; j<nodes_temp.length; j++){
        await this.$axios({
              method:'get',
              url:"http://10.24.82.10:8088/getNodeAttributeById/" + nodes_temp[j]
            }).then(res=>{
              // console.log(res.data.data)
          nodes.push(this.get_node(res.data.data))
        })
      }
      return nodes
    },

    //数组去重
    unique: function (arr){
      return Array.from(new Set(arr))
    },



    //=================页面跳转=======================

    goToTextUpload:function(){
      this.$router.push("/TextUpload")
    },
    goToKnowledgeTree:function(){
      this.$router.push("/newTreeGraph")
    },
    manualCheck:function(){
      this.$router.push("/excel_upload")
    },
    Back_to_homepage:function () {
      this.$router.push("/Check_2")
    }
  }
}

</script>

<style scoped>

.changeOption,.searchNodeInfo{
  position: absolute;
  top:20%;
  left: 2%;
}
.el-input-number {
  position: absolute;
  top: 70%;
  left: 4.5%;

}
.nodeSearch{
  margin-top: 15px;
  margin-left: 0px;
  width: 251px;
}
.nodeSearch2{
  margin-top: 0px;
  width: 251px;
}
/*.nodeSearch1{*/
/*  margin-top: 15px;*/
/*  width: 245px;*/
/*}*/

.box-card{
  position: absolute;
  top:10%;
  right: 2%;
  /*background-color: #15161F;*/
  width: 15%;
}
.Attribute_text{
  font-size: 14px;
  color: #ffffff;
}
.Attribute_item{
  margin-bottom: 18px;
}

.text {
  font-size: 14px;
  color: #ffffff;
}

.item {
  margin-bottom: 18px;
}

.text_search {
  position: absolute;
  left:3%;
  top: 30%;
}
.QuitEditMode{
  position: absolute;
  top:80%;
  left:4.5%;
  color:#ffffff;
  background-color: #303252;
  border-color: #9593A7;
  border-width: 2px;
}
.EditModeButtom{
  position: absolute;
  top:80%;
  left:5.2%;
  color:#ffffff;
  background-color: #303252;
  border-color: #9593A7;
  border-width: 2px;
}
.text_upload{
  position: absolute;
  top:53%;
  left:85.5%;
  color:#ffffff;
  background-color: #303252;
  border-color: #9593A7;
  border-width: 2px;
}
.manual_check{
  position: absolute;
  top:63%;
  left:85%;
  color:#fff;
  background-color: #303252;
  border-color: #9593A7;
  border-width: 2px;
}
.to_TreeGraph{
  position: absolute;
  top:73%;
  left:85%;
  color:#fff;
  background-color: #303252;
  border-color: #9593A7;
  border-width: 2px;
}
.back_to_homepage {
  position: absolute;
  top: 83%;
  left: 85%;
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
  top: 10%;
  width: 100%;
  height: 6%;
  /*background-color: #15161F;*/
}
.container{
  /*background-color: #15161F ;*/
  width: 100%;
  height: 100%;
}
.editNodeAttrib{
  width: 50%;
}
.editNodeAttrib1{
  width: 20%;
}
.modify_relation{
  width: 60%;
}
</style>