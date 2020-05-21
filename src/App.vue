<!--<template>-->
<!--    <div id = "app">-->
<!--        hi-->
<!--    </div>-->

<!--</template>-->

<!--<script>-->
<!--    export default {-->
<!--        name: "app"-->
<!--    }-->
<!--</script>-->

<!--<style>-->

<!--</style>-->
<template>
    <div id="app">
<!--        <button type="button"></button>-->
        <router-view></router-view>
<!--        <el-container style="height : 100%">-->
<!--            <el-header height="48px">-->
<!--                知识图谱展示-->
<!--            </el-header>-->
<!--            <el-container>-->
<!--                <el-aside width="20%">-->
<!--                    &lt;!&ndash;                    <el-container>&ndash;&gt;-->
<!--                    <el-col :span="4" :offset="3">-->
<!--                        <el-form :model="formInline" class="text_search">-->
<!--                            <el-form-item>-->
<!--                                <el-input v-model="formInline.user" placeholder="查询" clearable=1></el-input>-->
<!--                            </el-form-item>-->
<!--                            <el-form-item>-->
<!--                                <el-button icon="el-icon-upload" type="primary" @click="onSubmit">节点查询</el-button>-->
<!--                            </el-form-item>-->

<!--                        </el-form>-->
<!--                    </el-col>-->
<!--                    &lt;!&ndash;                        <el-switch&ndash;&gt;-->
<!--                    &lt;!&ndash;                                v-model="value1" active-text="Text" inactive-text="Nodes" active-color="#F0FFFF">&ndash;&gt;-->
<!--                    &lt;!&ndash;                        </el-switch>&ndash;&gt;-->
<!--                    &lt;!&ndash;                    </el-container>&ndash;&gt;-->
<!--                </el-aside>-->
<!--                &lt;!&ndash;主要区域&ndash;&gt;-->
<!--                &lt;!&ndash;                <el-main>&ndash;&gt;-->
<!--                &lt;!&ndash;图谱放置的主要区域&ndash;&gt;-->
<!--                <el-col :span="15" class="graph">-->
<!--                    &lt;!&ndash;这是我的图！！！！！！！！！&ndash;&gt;-->
<!--                    &lt;!&ndash;                        <div class="cc"></div>&ndash;&gt;-->
<!--                </el-col>-->
<!--                <el-col :span="7" class="right-side" >-->
<!--                    &lt;!&ndash; 节点信息区域&ndash;&gt;-->
<!--                    <div class="personal_Information">-->
<!--                    </div>-->
<!--                    &lt;!&ndash; 基本功能按钮区域&ndash;&gt;-->
<!--                    <div class="buttons">-->
<!--                        <el-button type="primary" round=true @click="printData" class="el-button–upload">文本导入-->
<!--                            <i class="el-icon-upload el-icon&#45;&#45;right"></i>-->
<!--                        </el-button>-->
<!--                        <el-button type="primary" round=true @click="user_Check" class="el-button-check">人工审核-->
<!--                            <i class="el-icon-user el-icon&#45;&#45;right"></i>-->
<!--                        </el-button>-->
<!--                        <el-button type="primary" round=true  @click="put_into_Database" class="el-button–mysql">数据库导入-->
<!--                            <i class="el-icon-coin el-icon&#45;&#45;right"></i>-->
<!--                        </el-button>&lt;!&ndash;              <el-row class="col1"></el-row>&ndash;&gt;-->
<!--                    </div>-->
<!--                </el-col>-->
<!--                &lt;!&ndash;                </el-main>&ndash;&gt;-->

<!--            </el-container>-->

<!--        </el-container>-->
        </div>
</template>


<!-- 查询框-->
<script>

</script>

<style>
    #app {
        font-family: Helvetica, sans-serif;
        text-align: center;
        height: 100%;
    }
</style>