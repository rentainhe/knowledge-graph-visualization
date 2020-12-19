<template>
  <div id="container">
    <div id="header">
      <i class="el-icon-ship"></i>
      <p style="font-size: larger; color: #FFFFFF">Initiate Data Table</p>
<!--      <el-divider></el-divider>-->
    </div>
    <div id="main">
      <div class="add_form">
        <div v-for="(tkw, index) in TableKeyWords" :key="tkw.key">
          <p style="color: #FFFFFF;font-size: larger">
            Table {{index+1}}
            <el-button @click="deleteTable(index)" v-if="index > 0" icon="el-icon-close" circle style="background-color: #30325200; border: none; margin-left: -10px; margin-top: -10px"></el-button>
          </p>


          <el-form :model="tkw" :ref="'TableKeyWords'+index" label-width="100px" class="demo-dynamic">
            <div class="inputs" style="text-align: left">
              <el-form-item
                  prop="tableName"
                  label="Table Name"
                  :rules="[
                      { required: true, message: 'Please input the table name', trigger: 'blur' }]"
              >
                <el-input v-model="tkw.tableName" style="width: 85%"></el-input>
              </el-form-item>
              <el-form-item
                  v-for="(kw, idx) in tkw.keyWords"
                  :label="'keyWords ' + (idx+1)"
                  :key="kw.key"
                  :prop="'keyWords.' + idx + '.value'"
                  :rules="{
                    required: true, message: 'Please input the keyword', trigger: 'blur'}"
              >
                <el-input v-model="kw.value" style="width: 85%"></el-input>
                <el-button v-if="idx>0" @click.prevent="removeItem(index, kw)" icon="el-icon-delete" circle style="margin-left: 20px"></el-button>
              </el-form-item>
            </div>
            <el-form-item style="margin-left: -100px" >
<!--              <el-button type="primary" @click="submitForm('dynamicValidateForm')">提交</el-button>-->
              <el-button @click="addItem(index)">新增字段</el-button>
              <el-button @click="resetForm('TableKeyWords'+index)">重置</el-button>
            </el-form-item>
          </el-form>
          <div style="height: 100px"></div>
        </div>
        <el-button @click="submitForm" type="primary">创建数据库</el-button>
        <div style="height: 100px"></div>
      </div>

    </div>
    <div id="buttons">
      <el-button @click="addTable" type="primary" icon="el-icon-plus" circle></el-button>
      <el-button @click="showTabelList" type="primary" icon="el-icon-tickets" circle></el-button>
    </div>
<!--    <div id="dialog">-->
<!--      <el-dialog-->
<!--          title="上传成功"-->
<!--          :visible.sync="centerDialogVisible"-->
<!--          width="30%"-->
<!--          center>-->
<!--        <span>是否继续创建新表？</span>-->
<!--        <span slot="footer" class="dialog-footer">-->
<!--    <el-button @click="continueInit">继续创建</el-button>-->
<!--    <el-button type="primary" @click="uploadInitData">上传数据</el-button>-->
<!--  </span>-->
<!--      </el-dialog>-->

<!--    </div>-->

  </div>


</template>

<script>
export default {
  name: "init_database",
  data() {
    return {
      //Form
      TableKeyWords: [{
        keyWords: [{
          value: ''
        }],
        tableName: ''
      }],
      centerDialogVisible: false,
    };
  },
  methods: {
    uploadInitData(){
      this.centerDialogVisible = false
      this.$router.push('/uploadInitData')
    },
    continueInit(){
      this.centerDialogVisible = false
      this.TableKeyWords = [{
        keyWords: [{
          value: ''
        }],
        tableName: ''
      }]
    },
    submitForm() {
      var val_table = 0
      for (var i = 0; i < this.TableKeyWords.length; i++){
        // 依次验证所有表单
        var formName = 'TableKeyWords' + i
        // console.log(formName)
        this.$refs[formName][0].validate((valid) => {
          if (valid) {
            // console.log(this.TableKeyWords[i])
            // alert('submit!');
            val_table ++
          } else {
            alert('error submit!! ');
            console.log('error submit!!');
            return false;
          }
        });
      }
      //所有表单通过验证才上传数据
      if (val_table === this.TableKeyWords.length){
        console.log("上传空表字段信息")
        this.$axios({
          method: 'post',
          url:'http://10.24.82.10:8088/addListNewNodeType',
          data: this.TableKeyWords
        }).then(res=>{
          console.log('空表上传结果：',res.data)
          if(res.data.errno ===0){
            this.$router.push('/excel_upload')
          }
        })

      }
    },
    resetForm(formName) {
      this.$refs[formName][0].resetFields();
    },
    removeItem(idx, item) {
      var index = this.TableKeyWords[idx].keyWords.indexOf(item)
      if (index !== -1) {
        this.TableKeyWords[idx].keyWords.splice(index, 1)
      }
    },
    addItem(index) {
      this.TableKeyWords[index].keyWords.push({
        value: '',
        key: Date.now()
      });
    },
    addTable(){
      this.TableKeyWords.push({
        keyWords: [{
          value: ''
        }],
        tableName: '',
        key: Date.now()
      })
    },
    deleteTable(index){
      this.$delete(this.TableKeyWords, index)
    }
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
  #buttons{
    position: fixed;
    top: 85%;
    left: 85%;
  }
</style>