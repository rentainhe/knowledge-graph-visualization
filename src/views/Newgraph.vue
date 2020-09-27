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
        <el-input-number class = "el-input-number" v-model="num" @change="handleChange" :min="1" :max=this.maxx label="控制显示点的个数"></el-input-number>


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
              <el-input v-model="EditModeAddFormItem.relation"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="EditModeAddRelationVisible = false">返 回</el-button>
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
          <el-form :label-position="left" label-width="80px" :model="EditNodeName">
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

            <div v-for="(att,key, index) in newNodeAttribute">
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

        <el-button id="enterEditMode" type="primary" round=true  @click="EnterEditMode" class="EditModeButtom" style="display: block">进入编辑模式
          <i class="el-icon-s-promotion el-icon--right"></i>
        </el-button>

        <el-button id="quitEditMode" type="primary" round=true  @click="QuitEditMode" class="QuitEditMode" style="display: none">退出编辑模式
          <i class="el-icon-s-promotion el-icon--right"></i>
        </el-button>


      </div>

      <div class="mainGragh">
        <div id="myChart" style="position: absolute;top:10%;left: 22%" :style="{width: '60%', height: '80%'}"></div>
        <!--                展示及编辑节点关系的弹窗-->
        <el-dialog width="30%" title="节点关系" :visible.sync="NodeRelationVisible">
          <el-dialog width="30%" title="请输入修改的内容" :visible.sync="NodeRelationChangeVisible" append-to-body>
            <div>当前关系为: {{relation}}</div>
            <p></p>
            <div>更改关系为:
              <el-select v-model="value" placeholder="请选择一个关系">
                <el-option v-for="item in ExistedRelation"
                           :key="item.value"
                           :label="item.label"
                           :value="item.value">
                </el-option>
              </el-select>
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

        <el-button id="goToTextUpload" type="primary" round=true  @click="goToTextUpload" class="text_upload">文本导入
          <i class="el-icon-s-promotion el-icon--right"></i>
        </el-button>
        <el-button id="manualCheck" type="primary" round=true  @click="manualCheck" class="manual_check">人工审核
          <i class="el-icon-s-promotion el-icon--right"></i>
        </el-button>
        <el-button id="goToKnowledgeTree" type="primary" round=true  @click="goToKnowledgeTree" class="to_TreeGraph">知识树展示
          <i class="el-icon-s-promotion el-icon--right"></i>
        </el-button>
        <el-button id="Back_to_homepage" type="primary" round=true  @click="Back_to_homepage" class="back_to_homepage">返回首页
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

      // 用来控制模式转换 以及 点击的功能
      maxx:5,
      mode: "show",
      flag: 0,
      option: "更改节点信息",
      // 点击节点之间的连线展示节点关系所需要的变量
      source:null, // 源节点
      target:null,  // 目标节点
      relation:null,  // 关系
      NodeRelationVisible: false, // 是否展示关系
      NodeRelationChangeVisible:false, // 是否打开关系修改界面
      TempHash:[], // 为了去除数组中重复的关系，使用一个hash表
      ExistedRelation:[
        {value:'属于',label:'属于'},
        {value:'驻扎于',label:'驻扎于'},
        {value:'拥有',label:'拥有'},
        {value:'使用',label:'使用'},
      ], // 存放已存在的关系，先用手造的数据，之后需要一个接口返回数据库中存在的所有关系
      value:null,
      RelationIndex:null,


      // ChosenNodeName: "", //存储所选择节点的名称
      EditNodeName:'', //需要编辑信息的节点名称
      EditNodeVisible:false,
      //动态保存当点节点的属性
      EditNodeAttribute:{},
      newNodeAttribute:[],

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
      num:"5",

      //存储当前节点的信息
      currentNode:{

      },
      // 画图变量
      myChart:'',
      new_data:[
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

      new_links:[
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
      init_data:[], // 存储初始所有节点的列表
      init_links:[], // 存储初始所有的relation列表
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
    }
  },
  mounted() {
    this.Draw_graph(this.new_data,this.new_links);
    this.ask_nodes = this.new_data;
    this.ask_links = this.new_links;
  },
  methods:{
    EditModeAddRelationConfirm(){
      if(this.EditModeAddFormItem.relation===''){
        this.$message({
          type:'error',
          message: '添加的新关系不能为空'
        })
        // this.EditModeAddRelationVisible = false
      }
      else{
        console.log(this.new_links)

        // AddRelation.fatherNode = this.EditModeAddFormItem.source
        // console.log(AddRelation)
        // AddRelation.childNode = this.EditModeAddFormItem.target
        // AddRelation.nodeRelationType = this.EditModeAddFormItem.relation
        var AddRelation = {
          fatherNode : this.EditModeAddFormItem.source,
          childNode : this.EditModeAddFormItem.target,
          nodeRelationType : this.EditModeAddFormItem.relation
        }
        // this.AddNewRelation.fatherNode = this.EditModeAddFormItem.source
        // this.AddNewRelation.childNode = this.EditModeAddFormItem.target
        // this.AddNewRelation.nodeRelationType = this.EditModeAddFormItem.relation
        console.log(this.AddNewRelation)
        this.new_links.push(AddRelation)
        console.log(this.new_links)
        this.Draw_graph(this.new_data,this.new_links)
        this.EditModeAddRelationVisible = false
        this.EditModeAddFormItem.source = ''
        this.EditModeAddFormItem.target = ''
        this.EditModeAddFormItem.relation = ''
      }
      // this.AddNewRelation.childNode = this.
    },
    EditModeAddRelation(){
      if(this.EditModeAddFormItem.target === '' || this.EditModeAddFormItem.source === ''){
        this.$message({
          type:'error',
          message:'源节点和目标节点不能为空'
        })
      }else{
        this.EditModeAddRelationVisible = true
      }
    },
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
        message: '添加的新关系不能为空'
      })}
      else {
        //将新增属性添加到EditNodeAttribute
        for(let index in this.newNodeAttribute){
          this.$set(this.EditNodeAttribute,this.newNodeAttribute[index].attName,this.newNodeAttribute[index].value)
        }
        //将EditNodeAttribute更新到原数组中
        this.new_data.filter(ele => ele.nodeName === this.EditNodeName)[0].attributlist = this.EditNodeAttribute
        this.EditNodeVisible = false
        // console.log(this.EditNodeAttribute)
        console.log(this.new_data.filter(ele => ele.nodeName === this.EditNodeName)[0])
        this.Draw_graph(this.new_data,this.new_links)
        this.currentNode = this.new_data.filter(ele => ele.nodeName === this.EditNodeName)[0].attributlist
        //情况临时数据
        this.EditNodeAttribute = {}
        this.newNodeAttribute =[]
        this.EditNodeName=''
      }

    },
    //显示节点编辑对话框
    EditNode(){
      if(this.EditNodeName === ''){
        this.$message({
          type:'error',
          message:'节点名称不能为空'
        })
      }else{
        this.EditNodeVisible = true

        //找到这个节点的相关属性信息
        var nodeTemp = this.new_data.filter(ele => ele.nodeName===this.EditNodeName)
        this.EditNodeAttribute=JSON.parse(JSON.stringify(nodeTemp[0].attributlist))

        //动态添加相关组件

      }
    },

    //编辑节点信息中的删除按钮
    removeAttrib(item) {
      //删除相应元素
      this.$delete(this.EditNodeAttribute,item)

    },
    removenewAttrib(item) {

      var index = this.newNodeAttribute.indexOf(item)
      if (index !== -1) {
        this.newNodeAttribute.splice(index, 1)
      }
    },
    addAttrib(){
      this.newNodeAttribute.push({
        attName: '',
        value: ''
      });
    },
    cancleEditNodeAttrib(){
      this.EditNodeVisible = false
      //重新获得原有节点
      var nodeTemp = this.new_data.filter(ele => ele.nodeName===this.EditNodeName)
      this.EditNodeAttribute=JSON.parse(JSON.stringify(nodeTemp[0].attributlist))

      this.newNodeAttribute = []
    },

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
    QuitEditMode(){
      document.getElementById("Player_info").style.display='none'
      document.getElementById("searchNodeInfo").style.display = 'block'
      document.getElementById("nodeSearch").style.display = 'block'
      document.getElementById("quitEditMode").style.display = 'none'
      document.getElementById("goToTextUpload").style.display = 'block'
      document.getElementById("manualCheck").style.display = 'block'
      document.getElementById("Back_to_homepage").style.display = 'block'
      document.getElementById("goToKnowledgeTree").style.display = 'block'
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
    // 删除关系
    DeleteRelation(){
      this.$confirm('是否删除这该关系','提示',{
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type:'warning'
      }).then(()=>{
        this.$message({
          type:'success',
          message:'修改成功'
        })
        this.new_links.splice(this.RelationIndex,1)
        this.Draw_graph(this.new_data,this.new_links)
        this.NodeRelationChangeVisible = false
        this.NodeRelationVisible = false

      }).catch(()=>{
        this.$message({
          type: 'info',
          message: '已取消修改'
        })
      })
    },
    // 更改关系
    ChangeRelation(){
      this.$confirm('此操作将更新该关系为'+'，是否继续','提示',{
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type:'warning'
      }).then(()=>{
        if(this.value==null){
          this.$message({
            type : 'warning',
            message: '所选的属性值不能为空，请选择一个属性值'
          })
          // this.NodeRelationChangeVisible = false
        }
        else{
          this.$message({
            type:'success',
            message:'修改成功'
          })
          this.new_links[this.RelationIndex].nodeRelationType = this.value
          this.Draw_graph(this.new_data,this.new_links)
          this.NodeRelationChangeVisible = false
          this.NodeRelationVisible = false
        }

      }).catch(()=>{
        this.$message({
          type: 'info',
          message: '已取消修改'
        })
      })
    },
    //找到需要更改的关系的下标
    findRelationIndex(relation){
      return relation.fatherNode == this.target && relation.childNode == this.source && relation.nodeRelationType == this.relation
    },
    //计数器变动
    handleChange(value) {
      this.maxx = this.ask_nodes.length
      console.log("JI SHU")
      console.log(this.ask_nodes)

      console.log(value);
      var nodes = this.ask_nodes.slice(0,value);
      var names = [];
      for (let i = 0; i < nodes.length; i++){
        names.push(nodes[i].nodeName)
      }
      console.log(names);
      var links = this.ask_links.filter(ele =>
          names.includes(ele.fatherNode) && names.includes(ele.childNode)
      )
      // for (let i = 0; i < this.new_links.length; i++){
      //     if (names.find(this.new_links[i].childNode) != null && names.find(this.new_links[i].fatherNode) != null){
      //         links.push(this.new_links[i])
      //     }
      // }
      console.log(links);
      this.Draw_graph(nodes,links);
    },
    singleNodeSearch:function(){
      // this.$axios({
      //     method:'get',
      //     url:'http://39.108.102.157:8088/queryNodeLabelByName/'+this.single_node_search_temp
      // }) .then(res=>{
      //     if(res.status===200){
      //         this.single_node_data = res.data.data
      //         console.log(this.single_node_data)
      //         this.$axios({
      //             method:'get',
      //             url:'http://39.108.102.157:8088/queryNodeRelationByName/'+this.single_node_search_temp
      //         }).then(res=>{
      //             this.single_node_links = res.data.data
      //             if(res.data.data.length >= 20){
      //                 console.log(this.single_node_links)
      //                 this.X = 10
      //                 this.Y = 20
      //                 this.Z = 6
      //                 this.ifUnfold = false
      //             }else{
      //                 this.X = 80
      //                 this.Y = 80
      //                 this.Z = 10
      //                 this.ifUnfold = false
      //             }
      //             this.Draw_graph(this.single_node_data,this.single_node_links)
      //         })
      //     }
      // })

      console.log('find nodes');

      console.log(this.single_node_search_temp)  //输入框中的内容
      if(this.single_node_search_temp) {//如果输入框中有数据
        //关闭“节点查询”
        document.getElementById("nodeSearch").style.display = 'none'
        //打开“取消”按钮
        document.getElementById("canclenodeSearch").style.display = 'block'
        //显示筛选后的节点
        this.ask_links = this.new_links.filter(ele =>  //保留出点或者入点为该数据的关系
            ele.fatherNode === this.single_node_search_temp || ele.childNode === this.single_node_search_temp)
        var names = [];
        for (let i = 0; i < this.ask_links.length; i++) {  //存所有需要显示的节点(有重复)
          names.push(this.ask_links[i].fatherNode);
          names.push(this.ask_links[i].childNode);
        }
        this.ask_nodes = this.new_data.filter(ele =>
            names.includes(ele.nodeName));  //asknodes存所有要显示的节点（无重复）
        this.Draw_graph(this.ask_nodes, this.ask_links);   //显示
        this.num = this.ask_nodes.length   //更改节点计数器的最大值
      }
      else{
        this.$message({
          type:'error',
          message: '查询节点不能为空'
        })
      }
    },

    cancleNodeSearch:function(){
      //改变计数器
      this.num = this.new_data.length
      //关闭“取消”按钮
      document.getElementById("canclenodeSearch").style.display = 'none'
      //显示“节点查询”按钮
      document.getElementById("nodeSearch").style.display = 'block'
      //显示全部节点信息
      this.Draw_graph(this.new_data,this.new_links);
      //清空输入框
      this.single_node_search_temp = ""

    },

    relationSearch:function(){
      // this.start_node = this.start_node_temp
      // this.end_node = this.end_node_temp
      // console.log("end_node")
      // console.log(this.end_node_temp)
      // this.$axios({
      //     method:'get',
      //     url:'http://39.108.102.157:8088/queryNodeLabelBetweenTwoNodes/'+this.start_node+'/'+this.end_node
      // }).then(res=>{
      //     if(res.status === 200){
      //         console.log(res)
      //         console.log(res.data.data)
      //         this.search_node_data = res.data.data
      //         this.$axios({
      //             method:'get',
      //             url:'http://39.108.102.157:8088/queryNodeRelationBetweenTwoNodes/'+this.start_node+'/'+this.end_node
      //         }).then(response=>{
      //             console.log(response.data.data)
      //             this.search_node_relation = response.data.data
      //             this.X = 30
      //             this.Y = 30
      //             this.Z = 50
      //             this.ifUnfold = false
      //             this.Draw_graph(this.search_node_data,this.search_node_relation)
      //         })
      //     }
      // })

      console.log('find links');
      console.log(this.start_node_temp);

      console.log(this.end_node_temp);
      if(this.start_node_temp && this.end_node_temp) {
        //关闭“节点关系查询”
        document.getElementById("nodeRelationSearch").style.display = 'none'
        //打开“取消”按钮
        document.getElementById("canclenodeRelationSearch").style.display = 'block'
        //显示
        this.ask_nodes = this.new_data.filter(ele =>
            ele.nodeName === this.start_node_temp || ele.nodeName === this.end_node_temp
        );
        this.ask_links = this.new_links.filter(ele =>
            (ele.fatherNode === this.start_node_temp && ele.childNode === this.end_node_temp)
            || (ele.fatherNode === this.end_node_temp && ele.childNode === this.start_node_temp))
        this.Draw_graph(this.ask_nodes, this.ask_links);
        this.num = this.ask_nodes.length
      }
      else{
        this.$message({
          type:'error',
          message: '查询节点不能为空'
        })
      }
    },
    canclerelationSearch:function(){
      //关闭“取消”按钮
      document.getElementById("canclenodeRelationSearch").style.display = 'none'
      //显示“节点查询”按钮
      document.getElementById("nodeRelationSearch").style.display = 'block'
      //显示全部节点信息
      this.Draw_graph(this.new_data,this.new_links);
      //清空输入框
      this.start_node_temp = ""
      this.end_node_temp = ""

      this.num = this.new_data.length
    },

    handleClick(tab,event){
      if(tab.name==="first"){
        this.activateName = 'first'
        document.getElementById("nodeSearch").style.display='block'
        document.getElementById("nodeRelationSearch").style.display='none'
      }
      else if(tab.name==="second"){
        this.activateName = 'second'
        document.getElementById("nodeSearch").style.display='none'
        document.getElementById("nodeRelationSearch").style.display='block'
      }
    },
    getInitNodes:function(){
      this.$axios({
        method:'get',
        // url:"http://39.108.102.157:8088/queryAllNodesWithLabel"
        url:"http://39.108.102.157:8088/queryAllNodesWithLabel"
      }).then(res=>{
        console.log("get data")
        this.init_data = res.data.data
        // console.log(this.init_data)
        this.getInitRelation()
      })
    },
    getInitRelation:function(){
      this.$axios({
        method:'get',
        // url:"http://39.108.102.157:8088/queryAllNodesRelationship"
        url:"http://39.108.102.157:8088/queryAllNodesRelationship"
      }).then(res=>{
        this.init_links = res.data.data

        // console.log(1111)
        // console.log(this.init_links)
        this.X = 20
        this.Y = 20
        this.Z = 30
        this.ifUnfold = false
        this.Draw_graph(this.init_data,this.init_links);
      })
    },
    Draw_graph:function(allNodes,allLinks){

      console.log("nodes");
      console.log(allNodes);
      console.log("links")
      console.log(allLinks);

      var size = 60;
      var size1 = 30;
      var yy = 200;
      var yy1 = 250;

      var listdata = [];
      var links = [];

      var newdata=[];
      newdata = this.init_links

      // function setData(arr, n) {
      //     for (var i = 0; i < arr.length; i++) {
      //         const flag = arr[i] === "disease"
      //         listdata.push({
      //             x: i*25,
      //             y: 30 + i * 10,
      //             "name": arr[i], // 各个节点的name参数不能重复，
      //             "symbolSize": size, // 该类目节点标记的大小
      //             "category": -n, // 该节点所在类目的index
      //             "nodeType" : flag, //
      //             "draggable": "true"
      //         })
      //     }
      // }

      function setData(arr, al,n,i,X,Y,Z,Unfold) {
        if(Unfold === false){
          n = -n
        }
        const flag = arr === "disease"
        listdata.push({
          x: X*i,
          y: Y + Z*i,
          attributlist:al,
          "name":arr, // 各个节点的name参数不能重复
          "symbolSize":size, // 该类目节点标记的大小
          "category": -n, // 该节点所在类目的index
          "nodeType": flag, //
          "draggable": "true",
          "open" : "true"
        })
      }
      // function setLinkData(arr, title,relation) {
      //     for (var i = 0; i < arr.length; i++) {
      //         links.push({
      //             "source": arr[i],
      //             "target": title,
      //             label:{
      //                 show: true,
      //                 formatter:relation // 在formatter中添加文字可以实现将文字显示在关系上
      //             },
      //             lineStyle: {
      //                 normal: {
      //                     color: 'source',
      //                 }
      //             }
      //         })
      //     }
      // }
      function setLinkData(arr, title,relation,curveness) {
        links.push({
          "source": arr,
          "target": title,
          label:{
            show: true,
            formatter:relation // 在formatter中添加文字可以实现将文字显示在关系上
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
        setData(allNodes[i].nodeName,allNodes[i].attributlist, allNodes[i].label, i, this.X, this.Y, this.Z, this.ifUnfold)
      }
      for(let i=0,len=allLinks.length;i<len;i++){
        setLinkData(allLinks[i].childNode, allLinks[i].fatherNode, allLinks[i].nodeRelationType,0.1*i+0.1)
      }
      console.log(listdata)
      console.log(links)
      // 需要设定4个参数
      // 设总部名称
      var headquarter = "太平洋舰队\n司令部"
      var legendes = ["单位","人员","装备"]
      var texts = [];
      for (var i =0; i<legendes.length;i++){
        texts.push({
          "name":legendes[i],
        })
      }


      var Headquarter = []; // 司令部节点
      Headquarter.push(headquarter);

      let that = this
      function showNodeAttribute(chart) { // 展示节点属性
        chart.on('mouseover',function (params) {
          console.log(params.name)
          this.$axios({
            method:'get',
            url:'http://39.108.102.157:8088/getAttributeValueByNodeName/' + params.name
          }).then(response=>{
            that.currentNode = response.data.data // 这里不能用this, 必须用that，否则数据传输不到currentNode
            console.log(this.currentNode)
            document.getElementById("Node_Attribute_Info").style.display = 'block'
          })
        })

      }

      /**
       * 绑定图表的点击事件
       * @param chart
       */
      function bindChartClickEvent(chart) {
        chart.on('click', function (params) {

          console.log(params)
          var category = params.data.category,
              nodeType = params.data.nodeType;
          // console.log(nodeType);
          toggleShowNodes(chart, params);
          // if (category === 0 || nodeType === 1) {
          //     toggleShowNodes(chart, params);
          // }
        });
      }

      /**
       * 展开或关闭节点
       * @param chart
       * @param params
       */
      function toggleShowNodes(chart, params) {
        var open = !!params.data.open,

            options = chart.getOption(),
            seriesIndex = params.seriesIndex,
            srcLinkName = params.name,
            serieLinks = options.series[seriesIndex].links,
            serieData = options.series[seriesIndex].data,
            serieDataMap = new Map(),
            serieLinkArr = [];
        // console.log("open:" + open);
        console.log(options);
        // 当前根节点是展开的，那么就需要关闭所有的根节点
        if (open) {
          // 递归找到所有的link节点的target的值
          findLinks(serieLinkArr, srcLinkName, serieLinks, true);
          if (serieLinkArr.length) {
            serieData.forEach(sd => serieDataMap.set(sd.name, sd));
            for (var i = 0; i < serieLinkArr.length; i++) {
              if (serieDataMap.has(serieLinkArr[i])) {
                var currentData = serieDataMap.get(serieLinkArr[i]);
                currentData.category = -Math.abs(currentData.category);
                if (currentData.nodeType === 1) {
                  currentData.open = false;
                }
              }
            }
            serieDataMap.get(srcLinkName).open = false;
            chart.setOption(options);
          }
        } else {
          // 当前根节点是关闭的，那么就需要展开第一层根节点
          // console.log(open);
          findLinks(serieLinkArr, srcLinkName, serieLinks, false);
          if (serieLinkArr.length) {
            serieData.forEach(sd => serieDataMap.set(sd.name, sd));
            for (var j = 0; j < serieLinkArr.length; j++) {
              if (serieDataMap.has(serieLinkArr[j])) {
                var currentData = serieDataMap.get(serieLinkArr[j]);
                currentData.category = Math.abs(currentData.category);
              }
            }
            serieDataMap.get(srcLinkName).open = true;
            chart.setOption(options);
          }
        }
      }

      /**
       * 查找连接关系
       * @param links 返回的节点放入此集合
       * @param srcLinkName 源线的名称
       * @param serieLinks 需要查找的集合
       * @param deep 是否需要递归进行查找
       */
      function findLinks(links, srcLinkName, serieLinks, deep) {
        var targetLinks = [];
        serieLinks.filter(link => link.target === srcLinkName).forEach(link => {
          targetLinks.push(link.source);
          links.push(link.source)
        });
        console.log(targetLinks);
        if (deep) {
          for (var i = 0; i < targetLinks.length; i++) {
            findLinks(links, targetLinks[i], serieLinks, deep);
          }
        }
        console.log(targetLinks);
      }

      this.myChart = this.$echarts.init(document.getElementById('myChart'))
      console.log(legendes)
      const option = ({
            title: {
              text: "节点列表", //主标题文本
              top: "top", // 距离容器组件上侧的距离
              left: "left", // 距离容器组件左侧的距离
              textStyle: { // 文字样式，字体风格颜色等参数设置
                color: '#f7f7f7'
              }
            },
            tooltip: { // 提示框浮层内容格式器
              formatter: function (params) {
                // 鼠标悬浮在节点上，所显示的内容
                // console.log(params.data.attributlist)
                var showAttrib = ''
                for(var attr in params.data.attributlist){
                  showAttrib += attr + '：' + params.data.attributlist[attr] + '<br/>'
                }
                return showAttrib
              }
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
            backgroundColor: '#15161F',
            legend: { // 图例组件，显示图例
              data: legendes,
              textStyle: {
                color: '#fff'
              },
              icon: 'circle', // 图例标记，有 circle、rect、roundRect、triangle等
              type: 'scroll', // 图例类型，有 plain 和 scroll 两种，当图例较多的时候可以使用scroll，然后对其具体的属性再进行设置
              orient: 'vertical', // 图例的布局朝向，有 vertical 和 horizontal 两种
              left: 0, // 距离容器左侧的距离，可以是10这种具体的像素值，也可以是10%这样的比例
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
                repulsion: 50, // 斥力大小
                gravity: 0.1, // 受到中心节点引力的大小
                edgeLength: 30, // 节点之间的距离，也会受到replusion的影响
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
            that.source = params.data.source
            that.target = params.data.target
            that.relation = params.data.label.formatter
            that.RelationIndex = that.new_links.findIndex(that.findRelationIndex)
            console.log("对应的元素下标是: ",that.RelationIndex)
            that.NodeRelationVisible = true
          }
        }

      });
      this.myChart.setOption(option);
      // bindChartClickEvent(this.myChart);
      // showNodeAttribute(this.myChart);
    },
    goToTextUpload:function(){
      this.$router.push("/TextUpload")
    },
    goToKnowledgeTree:function(){
      this.$router.push("/newTreeGraph")
    },
    manualCheck:function(){
      this.$router.push("/Check_1")
    },
    Back_to_homepage:function () {
      this.$router.push("/Home")
    }
  }
}

</script>

<style scoped>

.changeOption,.searchNodeInfo{
  position: absolute;
  top:10%;
  left: 2%;
}
.el-input-number {
  position: absolute;
  top: 55%;
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
  background-color: #15161F;
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
  top:70%;
  left:4.5%;
  color:#ffffff;
  background-color: #303252;
  border-color: #9593A7;
  border-width: 2px;
}
.EditModeButtom{
  position: absolute;
  top:70%;
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
  top: 10px;
  width: 100%;
  height: 6%;
  background-color: #15161F;
}
.container{
  background-color: #15161F ;
  width: 100%;
  height: 100%;
}
.editNodeAttrib{
  width: 50%;
}
.editNodeAttrib1{
  width: 20%;
}
</style>