<template>
  <div id="container">
    <div id="header">
      <i class="el-icon-ship"></i>
      <p style="font-size: larger; color: #FFFFFF">初始化数据库</p>
<!--      <el-divider></el-divider>-->
    </div>
    <div id="main">
      <div class="add_form">
        <div v-for="(tkw, index) in nodeTableKeyWords" :key="tkw.key">
          <p style="color: #FFFFFF;font-size: larger;margin-bottom: 0px">
            节点表 {{index+1}}
            <el-button @click="deleteNodeTable(index)" icon="el-icon-close" circle style="background-color: #30325200; border: none; margin-left: -10px; margin-top: -10px"></el-button>
          </p>
          <p style="color: #FFFFFF;font-size: medium; margin-top: 0px">(属性1必须设置为主键)</p>
          <el-form :model="tkw" :ref="'nodeTableKeyWords'+index" label-width="100px" class="demo-dynamic">
            <div class="inputs" style="text-align: left">
              <el-form-item
                  prop="tableName"
                  label="节点表名称"
                  :rules="[
                      { required: true, message: 'Please input the table name', trigger: 'blur' }]"
              >
                <el-input v-model="tkw.tableName" style="width: 85%"></el-input>
              </el-form-item>
              <el-form-item
                  v-for="(kw, idx) in tkw.keyWords"
                  :label="'节点属性 ' + (idx+1)"
                  :key="kw.key"
                  :prop="'keyWords.' + idx + '.value'"
                  :rules="{
                    required: true, message: 'Please input the keyword', trigger: 'blur'}"
              >
                <el-input v-model="kw.value" style="width: 85%"></el-input>
                <el-button v-if="idx>0" @click.prevent="removeNodeItem(index, kw)" icon="el-icon-delete" circle style="margin-left: 20px"></el-button>
              </el-form-item>
            </div>
            <el-form-item style="margin-left: -100px" >
<!--              <el-button type="primary" @click="submitForm('dynamicValidateForm')">提交</el-button>-->
              <el-button @click="addNodeItem(index)">新增字段</el-button>
              <el-button @click="resetForm('nodeTableKeyWords'+index)">重置</el-button>
            </el-form-item>
          </el-form>
          <div style="height: 100px"></div>
        </div>
        <div v-for="(tkw, index) in relationTableKeyWords" :key="tkw.key">
          <p style="color: #FFFFFF;font-size: larger;margin-bottom: 0px">
            关系类型表 {{index+1}}
            <el-button @click="deleteRelationTable(index)" icon="el-icon-close" circle style="background-color: #30325200; border: none; margin-left: -10px; margin-top: -10px"></el-button>
          </p>
<!--          <p style="color: #FFFFFF;font-size: medium; margin-top: 0px">(属性1必须设置为主键)</p>-->
          <el-form :model="tkw" :ref="'relationTableKeyWords'+index" label-width="100px" class="demo-dynamic">
            <div class="inputs" style="text-align: left">
              <el-form-item
                  prop="tableName"
                  label="关系表名称"
                  :rules="[
                      { required: true, message: 'Please input the table name', trigger: 'blur' }]"
              >
                <el-input v-model="tkw.tableName" style="width: 85%"></el-input>
              </el-form-item>
              <el-form-item
                  v-for="(kw, idx) in tkw.keyWords"
                  :label="'关系属性' + (idx+1)"
                  :key="kw.key"
                  :prop="'keyWords.' + idx + '.value'"
                  :rules="{
                    required: true, message: 'Please input the keyword', trigger: 'blur'}"
              >
                <el-input v-model="kw.value" style="width: 85%"></el-input>
                <el-button @click.prevent="removeRelationItem(index, kw)" icon="el-icon-delete" circle style="margin-left: 20px"></el-button>
              </el-form-item>
            </div>
            <el-form-item style="margin-left: -100px" >
              <!--              <el-button type="primary" @click="submitForm('dynamicValidateForm')">提交</el-button>-->
              <el-button @click="addRelationItem(index)">新增字段</el-button>
              <el-button @click="resetForm('relationTableKeyWords'+index)">重置</el-button>
            </el-form-item>
          </el-form>
          <div style="height: 100px"></div>
        </div>
        <el-button @click="submitForm" type="primary">创建数据库</el-button>
        <div style="height: 100px"></div>
      </div>

    </div>
    <div id="buttons">
      <el-button id="button1" @click="addNodeTable" type="primary">添加节点表</el-button>
      <el-button id="button2" @click="addRelationTable" type="primary">添加关系表</el-button>
<!--      <el-button @click="showTabelList" type="primary" icon="el-icon-tickets" circle></el-button>-->
    </div>

  </div>


</template>

<script>
export default {
  name: "init_database",
  data() {
    return {
      //Form
      //节点表
      nodeTableKeyWords: [{
        keyWords: [{value: ''}],
        tableName: ''
      }],

      //关系表
      relationTableKeyWords: [{
        keyWords: [{value: ''}],
        tableName: ''
      }],
    };
  },
  methods: {
    //数据库初始化设置提交
    submitForm() {
      console.log(this.relationTableKeyWords)
      var val_nodeTable = 0
      var val_relTable = 0
      var uploadTableNum = 0
      if (this.nodeTableKeyWords.length>0){
        for (var i = 0; i < this.nodeTableKeyWords.length; i++){
          // 依次验证所有Node表单
          var formName = 'nodeTableKeyWords' + i
          // console.log(formName)
          this.$refs[formName][0].validate((valid) => {
            if (valid) {
              // console.log(this.nodeTableKeyWords[i])
              // alert('submit!');
              val_nodeTable ++
            } else {
              return false;
            }
          });
        }
        if (val_nodeTable === this.nodeTableKeyWords.length){
          console.log("上传Node表字段信息")
          this.$axios({
            method: 'post',
            url:'http://10.24.82.10:8088/addListNewNodeType',
            data: this.nodeTableKeyWords
          }).then(res=>{
            console.log('Node表上传结果：',res.data)
          })
        }
      }
      if (this.relationTableKeyWords.length>0){
        for (var j = 0; j < this.relationTableKeyWords.length; j++){
          // 依次验证所有relation表单
          var formRelName = 'relationTableKeyWords' + j
          // console.log(formName)
          this.$refs[formRelName][0].validate((valid) => {
            if (valid) {
              // console.log(this.nodeTableKeyWords[i])
              // alert('submit!');
              val_relTable ++
            } else {
              return false;
            }
          });
        }
        if (val_relTable === this.relationTableKeyWords.length){
          console.log("上传relation表字段信息")
          this.$axios({
            method: 'post',
            url:'http://10.24.82.10:8088/addListNewRelationType',
            data: this.relationTableKeyWords
          }).then(res=>{
            console.log('relation表上传结果：',res.data)
          })
        }
      }

      //所有表单通过验证才上传数据
      if (val_nodeTable + val_relTable === this.nodeTableKeyWords.length + this.relationTableKeyWords.length){
        this.$router.push('/excel_upload')
      }
      else {
        alert('error submit!! ');
        console.log('error submit!!');
      }
    },

    //重置表格（节点表+关系表）
    resetForm(formName) {
      this.$refs[formName][0].resetFields();
    },

    //删除节点属性关键字
    removeNodeItem(idx, item) {
      var index = this.nodeTableKeyWords[idx].keyWords.indexOf(item)
      if (index !== -1) {
        this.nodeTableKeyWords[idx].keyWords.splice(index, 1)
      }
    },

    //添加节点属性关键字
    addNodeItem(index) {
      this.nodeTableKeyWords[index].keyWords.push({
        value: '',
        key: Date.now()
      });
    },

    //删除关系属性关键字
    removeRelationItem(idx, item) {
      var index = this.relationTableKeyWords[idx].keyWords.indexOf(item)
      if (index !== -1) {
        this.relationTableKeyWords[idx].keyWords.splice(index, 1)
      }
    },

    //添加关系属性关键字
    addRelationItem(index) {
      this.relationTableKeyWords[index].keyWords.push({
        value: '',
        key: Date.now()
      });
    },

    //添加节点表
    addNodeTable(){
      this.nodeTableKeyWords.push({
        keyWords: [{
          value: ''
        }],
        tableName: '',
        key: Date.now()
      })
    },

    //添加关系表
    addRelationTable(){
      this.relationTableKeyWords.push({
        keyWords: [{value: ''}],
        tableName: '',
        key: Date.now()
      })
    },

    //删除节点表
    deleteNodeTable(index){
      this.$delete(this.nodeTableKeyWords, index)
    },

    //删除关系表
    deleteRelationTable(index){
      this.$delete(this.relationTableKeyWords, index)
    },
  }
}
</script>

<style scoped>
  #container{
    width: 100%;
    height: 90%;
  }

  /*header*/
  .el-icon-ship{
    color: #FFFFFF;
    font-size: 50px;
    margin: 8% auto 0% auto;
  }
  /deep/.el-divider{
    box-shadow: 0 2px 12px 0 rgba(255, 255, 255, 0.5);
    background-color: #FFFFFF22;
    margin-top: 3%;
  }

  /*Form*/
  .add_form{
    margin:6% auto 5% 25% ;
    width: 50%;
  }
  /deep/.el-form-item label{
    color: #FFFFFF;
  }

  /*buttons*/
  /deep/.el-button--primary {
    color: #FFF;
    background-color: rgb(84, 92, 100);
    border-color: rgb(84, 92, 100);
  }
  #button1{
    position: fixed;
    top: 80%;
    left: 85%;
  }
  #button2{
    position: fixed;
    top: 87%;
    left: 84.35%;
  }
</style>