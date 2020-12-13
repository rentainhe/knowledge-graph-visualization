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
                  v-for="(kw, idx) in tkw.Keyword"
                  :label="'Keyword ' + (idx+1)"
                  :key="kw.key"
                  :prop="'Keyword.' + idx + '.value'"
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
        <el-button @click="submitForm" type="primary">确定</el-button>
        <div style="height: 100px"></div>
      </div>

    </div>
    <div id="buttons">
      <el-button @click="addTable" type="primary" icon="el-icon-plus" circle></el-button>
      <el-button @click="showTabelList" type="primary" icon="el-icon-tickets" circle></el-button>
    </div>

  </div>


</template>

<script>
export default {
  name: "init_database",
  data() {
    return {
      //Table List
      tabelName: [
          '人员',
          '装备',
          '关系'
      ],

      //Form
      TableKeyWords: [{
        Keyword: [{
          value: ''
        }],
        tableName: ''
      }]
    };
  },
  methods: {
    submitForm() {
      for (var i = 0; i < this.TableKeyWords.length; i++){
        var formName = 'TableKeyWords' + i
        // console.log(formName)
        this.$refs[formName][0].validate((valid) => {
          if (valid) {
            alert('submit!');
            console.log(this.TableKeyWords)
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      }

    },
    resetForm(formName) {
      this.$refs[formName][0].resetFields();
    },
    removeItem(idx, item) {
      var index = this.TableKeyWords[idx].Keyword.indexOf(item)
      if (index !== -1) {
        this.TableKeyWords[idx].Keyword.splice(index, 1)
      }
    },
    addItem(index) {
      this.TableKeyWords[index].Keyword.push({
        value: '',
        key: Date.now()
      });
    },
    addTable(){
      this.TableKeyWords.push({
        Keyword: [{
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