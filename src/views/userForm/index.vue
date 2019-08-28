<template>
    <div class="app-container calendar-list-container">  
        <basic-container>
            <div class="filter-container crud-menu" >
                <div class="clearfix">
                    <input type="file" class="form-control" id="upload_file" name="upload_file" accept=".xlsx"
                           style="display: none;" @change='changeExcel'>
                    <!--检索框-->
                    <el-input @keyup.enter.native="handleFilter"
                              style="width: 200px;"
                              class="filter-item fl"
                              size="small"
                              suffix-icon="el-icon-search"
                              placeholder="输入姓名搜索"
                              v-model="listQuery.name">
                    </el-input>

                    <!-- 日期筛选 -->
                    <div class="block">
                      <el-date-picker
                        ref='input'
                        value-format='yyyy-MM-dd'
                        @blur="timeRange" 
                        v-model="dateInfo"
                        type="daterange"
                        size="small"
                        align="right"
                        unlink-panels
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        :picker-options="pickerOptions2">
                      </el-date-picker>
                    </div>

                    <!-- 字段选择框按钮 -->
<!--                    <el-button @click="selectFileds"-->
<!--                               icon="el-icon-menu"-->
<!--                               circle size="small"-->
<!--                               style="margin-right: 0px;float: right">-->
<!--                    </el-button>-->
                   <!--  <el-button class="controller_button"
                               size="small"
                               style="margin-right: 0;float: right">
                        <a @click="downloadExcel">导出(复杂表头)</a>
                    </el-button>
                    <el-button class="controller_button"
                               size="small"
                               @click="selectExcel"
                               style="margin-right: 5px;float: right">上传
                    </el-button> -->
                    <!--批量删除-->
                    <!-- <el-button class="basic_button" type="danger"
                               size="small"
                               @click="handleDeletes"
                               style="margin-right: 0px;float: right">批量删除
                    </el-button> -->
                    <!--导出功能-->
                    <el-button v-waves :loading="downloadLoading"
                               class="controller_button"
                               @click="handleDownload"
                               style="margin-right: 0px;float: right"
                               type="primary"
                               size="small">导出表格
                    </el-button>
                    <!--新增功能-->
                    <!-- <el-button class="basic_button"
                               @click="handleAdd"
                               style="margin-right: 0px;float: right"
                               icon="edit"
                               size="small">新增
                    </el-button> -->
                </div>
            </div>
            <!--表格控件-->
            <el-table
                    @selection-change="handleSelectionChange"
                    border
                    :key="tableKey"
                    :data="tableData"
                    v-loading="tableLoading"
                    element-loading-text="给我一点时间"
                    fit
                    height="calc(100% - 80px)"
                    size="mini"
                    tooltip-effect="dark"
                    :cell-style="{paddingLeft: '5px',paddingRight: '5px'}"
                    style="width: 100%;font-size: 12px;margin-bottom:15px;border-radius:3px;"
                    :header-cell-style="tableHeaderColor">
                <!--索引列-->
                <el-table-column type="selection"
                                :reserve-selection="true"
                                width="40"
                                align="center"
                                >
                </el-table-column>
                <!-- 表头循环渲染 -->
                
                    <el-table-column 
                    align="center"                   
                    fixed 
                    propoty="name"
                    label="姓名"
                    width="95">
                    <template slot-scope="scope">
                        <!-- <router-link :to="{name:'img',params:{userCode:scope.row.dwenrollnumber,startTime:listQuery.startTime,endTime:listQuery.endTime,name:scope.row.name}}">    
                        </router-link> -->
                        <!-- <el-button
                            type='text'
                            @click="handletoImg({userCode:scope.row.dwenrollnumber,startTime:listQuery.startTime,endTime:listQuery.endTime,name:scope.row.name})">
                                {{scope.row.name}}
                        </el-button> -->
                        <p class='p' @click="handletoImg({userCode:scope.row.dwenrollnumber,startTime:listQuery.startTime,endTime:listQuery.endTime,name:scope.row.name})">{{scope.row.name}}</p>
                        
                    </template>
                </el-table-column>
                
                <el-table-column 
                    width='85' align="center"                  
                    v-for="tableitem in formThead" 
                    :key="tableitem.key" 
                    :label="tableitem.label" 
                    :prop="tableitem.key">
                    <template slot-scope="scope">
                        {{ scope.row[tableitem.key] }}
                    </template>
                </el-table-column>
            </el-table>
            <!--分页控件-->
            <div v-show="!tableLoading"
                 class="pagination-container">
                <el-pagination @size-change="sizeChange"
                               @current-change="currentChange"
                               :current-page.sync="listQuery.page"
                               :page-sizes="[10,20,30,50]"
                               :page-size="listQuery.limit"
                               background
                               class="pull-center"
                               layout="total, sizes, prev, pager, next, jumper"
                               :total="page.total">
                </el-pagination>
            </div>

        </basic-container>
        <!--新增或编辑修改弹出框-->
        <div class="dialog_mask_mine">
            <!-- visible:控制弹出框是否可见 -->
        <el-dialog :visible.sync="dialogFormVisible" width="35%">
            <!-- 标题的显示 -->
            <div slot="title">
                <span class="preTitle"></span>
                <!-- 显示为编辑还是创建 -->
                <span class="nextTitle">{{textMap[dialogStatus]}}</span>
            </div>
            <!-- 表单数据 -->
            <el-form :model="form"   
                     :rules="rules"
                     size="mini"
                     ref="form"
                     label-width="100px">
                        <el-form-item label="工号" prop="dwenrollnumber">
                            <el-input v-model="form.dwenrollnumber"  placeholder=""></el-input>
                        </el-form-item>

                        <el-form-item label="姓名" prop="name">
                            <el-input v-model="form.name"  placeholder="姓名"></el-input>
                        </el-form-item>

                        <el-form-item label="设备"  prop="machinename">
                            <el-input v-model="form.machinename"  placeholder="设备"></el-input>
                        </el-form-item>
            </el-form>
            <div slot="footer"
                 class="dialog-footer">
                 <!-- 取消按钮业务逻辑 -->
                <el-button @click="cancel('form')" size="small">取 消</el-button>
                <!-- 添加表单调用的方法 -->
                <el-button v-if="dialogStatus=='create'"
                           type="primary"
                           size="small"
                           @click="create('form')">确 定</el-button>
                <!-- 修改表单调用的方法 -->
                <el-button v-else
                           type="primary"
                           size="small"
                           @click="update('form')">修 改</el-button>
            </div>
        </el-dialog>
        </div>
        <!--表格字段多选弹出框-->
        <el-dialog title="字段选择" width="480px"
                   :visible.sync="dialogFieldsVisible">
            <el-checkbox-group v-model="checkboxVal">
                <el-checkbox label="dwenrollnumber">工号</el-checkbox>
                <el-checkbox label="name">姓名</el-checkbox>  
            </el-checkbox-group>
        </el-dialog>
        <!-- drawer弹出框结构 -->
        <Drawer
            v-model="isShow"
            direction="rtl"
            width="74%">
            <showImg :params='params'></showImg>
        </Drawer>    
    </div>
</template>

<script>
//引入showimg这个组件
    import showImg  from './showimg'
    import { fetchList, getObj, addObj, putObj, delObj,delObjs } from '@/api/student'
    import { mapGetters } from 'vuex'
    import waves from "@/directive/waves/index.js"; // 水波纹指令
    //引入url常量
    import {URL} from './const'
     //引入请求数据方法
    import {getUserform,downloadUserform} from '@/api/getdata/index'
    //引入去除空白字符的方法  一些过滤格式的方法
    import{removeWhite,getDoubleNum} from '@/api/validator/validator'
    //表单迭代展示的列
    const defaultFormThead = [
              { key: 'dwenrollnumber', label: '工号' },
            ];
    //默认当前选中的显示列
    const defaultFormTheadKey = [
        'dwenrollnumber',
        "name"
    ];

    export default {
        name: 'student',
        components:{
            showImg
        },
        data() {
            return {
                multipleSelection: [],//全选存储数组
                /*1.表格参数初始化*/
                tableKey:0,
                tableData:null,
                formTheadOptions:defaultFormThead,
                checkboxVal: defaultFormTheadKey, // 默认全选中
                formThead: defaultFormThead, // 默认表头 Default header
                page: {
                    total: 0, // 总页数
                    currentPage: 1, // 当前页数
                    pageSize: 10 // 每页显示多少条
                },
                listQuery:{
                    page: 1,
                    limit: 10,
                    startTime:'',
                    endTime:''
                },
                tableLoading: true,
                downloadLoading: false,
                /*表单参数初始化*/
                form: {
                    /*name: undefined,*/
                },
                rules: {
                    /*校验初始化*/
                    //键值指的prop的值，数组里是验证规则
                    name: [
                        //是否为必须，为空则显示的mesage，失去焦点时验证
                        {required: true,message: "请输入姓名",trigger: "blur"} ,
                        // 输入内容的验证
                        {min: 3,max: 20,message: "长度在 3 到 20 个字符",trigger: "blur"}
                    ],
                    //工号验证
                   /*  dwenrollnumber:[
                        {required:true,message:'请输入工号',trigger:'blur'},    
                    ] */

                },
                /*弹窗初始化*/
                dialogFormVisible: false,
                dialogFieldsVisible:false,
                dialogStatus: "",
                textMap: {
                    update: "编辑",
                    create: "创建"
                },
                //日期筛选
                pickerOptions2: {
                  shortcuts: [{
                    text: '最近一周',
                    onClick(picker) {
                      const end = new Date();
                      const start = new Date();
                      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                      picker.$emit('pick', [start, end]);
                    }
                  }, {
                    text: '最近一个月',
                    onClick(picker) {
                      const end = new Date();
                      const start = new Date();
                      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                      picker.$emit('pick', [start, end]);
                    }
                  }, {
                    text: '最近三个月',
                    onClick(picker){
                      const end = new Date();
                      const start = new Date();
                      start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                      picker.$emit('pick', [start, end]);
                    }
                  }]
                },
                //搜索文本
                dateInfo:'',
                //表头重置
                head:'',
                key:'',
                isShow:false,
                params:''
            }
        },
        //观察函数
        watch: {
            //字段选择方法
            checkboxVal(valArr) {
                this.formThead = this.formTheadOptions.filter(i => valArr.indexOf(i.key) >= 0)
                this.tableKey = this.tableKey + 1// 为了保证table 每次都会重渲 In order to ensure the table will be re-rendered each time
            },
            searchValue(curVal,oldVal){
                //console.log(curVal,oldVal);
            }
        },
        // 计算属性
        computed:{
            ...mapGetters(["permissions"])
        },
        created(){
            this.getmonth();
            this.getList();
        },
        mounted: function() { 
        },
        methods: {
            //获取传过去的时间段参数
            timeRange(){
                //没有参数 就将现在的事件传递过去
                if(!this.dateInfo[0] || !this.dateInfo[1]){
                    this.getmonth();
                }else{
                    this.listQuery.startTime=this.dateInfo[0]
                    this.listQuery.endTime = this.dateInfo[1]
                }
                // console.log(this.listQuery.startTime,this.listQuery.endTime)  
                this.getList(this.listQuery);
            },
            //获取当前月份第一天和最后一天
            getmonth(){
                var date = new Date(); //当前日期 
                var year = date.getFullYear(); //获取当前的年份
                var Month = getDoubleNum(date.getMonth() + 1); //当前月 
                var day = getDoubleNum(date.getDate()) //当前日
                //将获取到的当前年月日赋值给传递参数
                // console.log(year+'-'+Month+'-01', year+'-'+Month+'-'+day)
                this.listQuery.startTime = year+'-'+Month+'-01';
                this.listQuery.endTime = year+'-'+Month+'-'+day;
                // console.log(this.listQuery.endTime)
            },
            //表头时间列表的渲染
            getHead(){
                //重置表头数据
                this.formThead = [{ key: 'dwenrollnumber', label: '工号' } ];
                for(var i = 0;i < this.head.length;i++){
                    this.formThead.push({key:this.head[i],label:this.head[i]})
                    // console.log(this.tableData[i].dateTime,this.head[i])
                }
            },
            //上传EXCEL
            upExcel(){
                var excelFile = document.getElementById("upload_file").files[0];
                var formData = new FormData() // 声明一个FormData对象
                var formData = new window.FormData()
                formData.append('file', excelFile);
                var options = {  // 设置axios的参数
                    url: 'http://localhost:8001/admin/student/uploadExcel',
                    data: formData,
                    method: 'post',
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
                this.axios(options).then((res) => {
                    this.$notify({
                    title: "成功",
                    message: "上传成功",
                    type: "success",
                    duration: 2000
                });
            })
            },
            changeExcel() {
                var excelFile = document.getElementById("upload_file").files[0];
                this.fileName = document.getElementById("upload_file").files[0].name;
                this.upExcel();
            },
            selectExcel() {
                upload_file.click();
            },
            downloadExcel() {
                window.location.href = "http://localhost:8001/admin/student/downloadExcel";
            },
            handleSelectionChange(val) {
                this.multipleSelection = val.map(item => item.id);
            },
            handleDeletes: function () {
                this.$confirm(
                        "将批量删除 " + this.multipleSelection.length + " 条数据, 是否继续?",
                        "提示",
                        {
                            confirmButtonText: "确定",
                            cancelButtonText: "取消",
                            type: "warning"
                        }
                ).then(() => {
                    let checks = this.multipleSelection.join(',')
                    delObjs({ids:checks}).then(() => {
                    this.getList();
                this.$notify({
                    title: "成功",
                    message: "删除成功",
                    type: "success",
                    duration: 2000
                });
            }).catch(() => {
                    this.$notify({
                    title: "失败",
                    message: "删除失败",
                    type: "error",
                    duration: 2000
                });
            });
            });
            },
            //请求数据
            getList() {
                this.tableLoading = true
                // getUser,fetchList
                // console.log(this.listQuery.startTime,this.listQuery.endTime)
                getUserform(this.listQuery).then(response => {
                    //再给head赋新值
                    this.head = response.data.spareObj
                    this.tableData = response.data.records
                    // console.log(response.data)
                    this.page.total = response.data.total
                    this.getHead();
                    this.tableLoading = false
                })
            },
            handleFilter(){
                this.listQuery.page = 1;
                //将查询的字符去空格
                this.listQuery.name = removeWhite(this.listQuery.name)
                this.getList();
            },
            //当前页数改变，更新请求的最新页数
            currentChange(val) {
                this.page.currentPage = val
                this.listQuery.page = val
                this.getList()
            },
            //每页显示的数据limit发生改变，将最新的limit传递过去
            sizeChange(val) {
                this.page.pageSize = val
                this.listQuery.limit = val
                this.getList()
            },
            /**
             * @title 打开新增窗口
             *
             **/
            //重置表单
            handleAdd: function() {
                //标记的form存在，就重置表单
                if( this.$refs['form']){
                    // resetFields：重置表单，elementUI提供
                    this.$refs['form'].resetFields();
                }
                this.dialogStatus = "create";
                this.dialogFormVisible = true;
            },
            // 编辑表格
            handleEdit(row, index) {
                getObj(row.id).then(response => {
                    this.form = response.data.data;
                    this.dialogFormVisible = true;
                    this.dialogStatus = "update";
                });
            },
            //删除表格
            handleDel(row, index){
                this.$confirm(
                        "是否确认删除ID为" + row.id + ", 是否继续?",
                        "提示",
                        {
                            confirmButtonText: "确定",
                            cancelButtonText: "取消",
                            type: "warning"
                        }
                ).then(() => {
                    delObj(row.id)
                            .then(() => {
                                //调用删除接口
                                this.getList();
                                this.$notify({
                                    title: "成功",
                                    message: "删除成功",
                                    type: "success",
                                    duration: 2000
                                });
                            })
                            .catch(() => {
                                this.$notify({
                                    title: "失败",
                                    message: "删除失败",
                                    type: "error",
                                    duration: 2000
                                });
                            });
                });

            },
            //下载表格
            handleDownload() {
                let {startTime,endTime} = this.listQuery
                //点击直接下载成表格
                window.open(URL+"/clocking/ifaceclock/clockReportWriter?startTime="+startTime+"&endTime="+endTime) 
            },
            //Excel插件的转json方法
            formatJson(filterVal, jsonData) {
                return jsonData.map(v => filterVal.map(j => {
                    if (j === 'timestamp') {
                        return parseTime(v[j])
                    } else {
                        return v[j]
                    }
                }))
            },
            //编辑菜单后，点击取消按钮后的业务逻辑
            cancel (formName) {
                this.dialogFormVisible = false;
            },
            /**
             * @title 数据更新
             * @param row 为当前的数据
             * @param index 为当前更新数据的行数
             * @param done 为表单关闭函数
             *
             **/
            // 更新表单操作
            update (formName) {
                const set = this.$refs;
                set[formName].validate(valid => {
                    //如果验证通过，valid为是否通过验证的值：true  false
                    if (valid) {
                        this.dialogFormVisible = false;
                        //请求数据接口，将新增的form数据传过去
                        putObj(this.form).then(() => {
                            this.dialogFormVisible = false;
                            this.getList();
                            this.$notify({
                                title: "成功",
                                message: "修改成功",
                                type: "success",
                                duration: 2000
                            });
                        });
                    } else {
                        return false;
                    }
                });
            },
            /**
             * @title 数据添加
             * @param row 为当前的数据
             * @param done 为表单关闭函数
             *
             **/
            //创建新的数据
            create (formName) {
                const set = this.$refs;
                // 验证表单，是一个回调函数，函数的参数值为true或者false
                set[formName].validate(valid =>{
                    //如果验证通过
                    if (valid){
                        //将数据存入数据库
                        addObj(this.form).then(() => {
                            this.dialogFormVisible = false;
                            this.getList();
                            //成功之后的弹出框
                            this.$notify({
                                title: "成功",
                                message: "创建成功",
                                type: "success",
                                duration: 2000
                            });
                        });
                    } else {
                        return false;
                    }
                });
            },
            /**
             * 刷新回调
             */
            refreshChange() {
                this.getList()
            },
            selectFileds(){
                this.dialogFieldsVisible = true
            },
            // 修改table header的背景色
            tableHeaderColor({row, column, rowIndex, columnIndex}) {
                if (rowIndex === 0) {
                    return 'background-color: #fafafa;color:#999; font-size:12px;'
                }
            },
            handletoImg(obj){
                this.params = obj;
                this.isShow = true;
            }
            
        }
    }
</script>

<style lang="scss" scoped>
    .app-container{
        /deep/ .filter-container{
            .filter-item{
                margin-bottom: 0;
            }
        }

        /deep/ .role_menu{
            .el-dialog{
                height: 70vh;
                margin: 0 auto;
                .el-dialog__header{
                    height: 58px;
                }
                .el-dialog__body{
                    height: calc(100% - 124px);
                    padding:10px 20px;
                    .dialog_tree{
                        height:99%;
                        #areaTree{
                            height: 100%;
                            border-width: 0;
                            .el-header{
                                padding: 0 !important;
                            }
                            .el-main{
                                padding:0 200px !important;
                            }
                        }
                    }
                }
            }
        }
        /deep/ .role_dept{
            .el-dialog{
                height: 70vh;
                margin: 0 auto;
                .el-dialog__header{
                    height: 58px;
                }
                .el-dialog__body{
                    height: calc(100% - 124px);
                    padding:10px 20px;
                    .dialog_form_select{
                        .el-col:first-child{
                            text-align: right;
                        }
                    }
                    .dialog_tree{
                        height:99%;
                        #areaTree{
                            height: 100%;
                            border-width: 0;
                            .el-header{
                                padding: 0 !important;
                            }
                            .el-main{
                                padding:0 200px !important;
                            }
                        }
                    }
                }
            }
        }

      .basic-container{
        height: 100%;
        .el-button:nth-child(-n+4){
          margin: 0 0 0 10px !important;
        }
      }
    }

    /deep/ .drawer_permission{
        .ivu-drawer-header{
            padding:10px 16px;
            .drawer_title{
                line-height: 30px;
                .titleSpan{
                    padding: 0;
                    font-size: 14px;
                    font-weight: bold;
                    text-align: center;
                    color: #3a8ee6;
                }
                .titleSpan:before {
                    content: '';
                    height: 16px;
                    width: 5px;
                    background-color: #3a8ee6;
                    display: block;
                    float: left;
                    text-align: center;
                    margin: 7px 5px 7px 0;
                }
            }
        }
        .ivu-drawer-body{
            padding:16px 0 10px 16px;
            .drawer_tree{
                #areaTree{
                    height: 100%;
                    border-width: 0;
                    padding:0 0 10px 0;
                    .el-header{
                        padding: 0 !important;
                    }
                    .el-main{
                        padding:0 2px !important;
                    }
                }
            }
            .drawer_button{
                text-align: center;
            }
        }
    }
    /deep/ .drawer_data{
        .ivu-drawer-header{
            padding:10px 16px;
            .drawer_title{
                line-height: 30px;
                .titleSpan{
                    padding: 0;
                    font-size: 14px;
                    font-weight: bold;
                    text-align: center;
                    color: #3a8ee6;
                }
                .titleSpan:before {
                    content: '';
                    height: 16px;
                    width: 5px;
                    background-color: #3a8ee6;
                    display: block;
                    float: left;
                    text-align: center;
                    margin: 7px 5px 7px 0;
                }
            }
        }
        .ivu-drawer-body{
            padding:16px 0 10px 16px;
            .drawer_main{
                .dialog_form_select{
                    .el-col:first-child{
                        text-align: right;
                        padding: 8px 1px!important;
                    }
                    .el-select{
                        width: 160px !important;
                    }
                }
                .dialog_tree{
                    height:99%;
                    #areaTree{
                        height: 100%;
                        border-width: 0;
                        .el-header{
                            padding: 0 !important;
                        }
                        .el-main{
                            padding:0 2px !important;
                        }
                    }
                }
            }
            .drawer_button{
                text-align: center;
            }
        }
    }
    .titleSpan{
        padding: 0;
        font-size: 14px;
        font-weight: bold;
        text-align: center;
        color: #3a8ee6;
    }
    .titleSpan:before {
        content: '';
        height: 16px;
        width: 5px;
        background-color: #3a8ee6;
        display: block;
        float: left;
        text-align: center;
        margin: 6px 5px 6px 0;
    }

    .dialog_mask_mine >>> .el-dialog__title {
        font-size: 14px;
    }

    .dialog_mask_mine >>> .el-dialog__title:before {
        width: 5px;
        height: 16px;
        background-color: #409eff;
    }
    .preTitle {
        height: 16px;
        width: 5px;
        background-color: #3a8ee6;
        display: block;
        float: left;
        text-align: center;
        margin: 4px 0;
    }
    .nextTitle {
        float: left;
        padding: 0 0 0 5px;
        line-height: 24px;;
        font-size: 14px;
        font-weight: bold;
        text-align: center;
        color: #666;
    }


    .fr {
        float: right;
    }
    .fl {
        float: left;
    }
    /* 清浮动 */
    .clearfix:after {
        visibility: hidden;
        display: block;
        font-size: 0;
        content: " ";
        clear: both;
        height: 0;
    }
    .clearfix {
        zoom: 1; /* for IE6 IE7 */
    }

    .el-table::before {
        height: 0;
    }
    .el-table {
        border: 1px solid #e5e5e5;
    }
    .button_edit {
        padding: 0;
        border: none;
        color: #66B1FF;
    }
    .button_delete {
        padding: 0;
        border: none;
        color: #F78989;
        background-color: #fff;
    }
    .button_delete:hover {
        color: #F78989;
    }
    .is-circle{
        padding:9px;
    }
    .block{
      display:inline-block;
      margin-left:10px;
    }
    .el-table .cell{
        overflow:visible !important;
    }
    /* .app-container .basic-container .el-button[data-v-299c7a4b]:nth-child(1) {
        margin: 0 0 0 0px !important;
    } */
    .p{
        //文本样式设置成小手形状 可点击
        cursor: pointer;
    }
</style>



