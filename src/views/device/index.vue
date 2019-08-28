<template>
    <div class="app-container calendar-list-container">
        <basic-container>
            <div class="filter-container crud-menu" >
                <div class="clearfix">
                    <!-- <input type="file" class="form-control" id="upload_file" name="upload_file" accept=".xlsx"
                           style="display: none;" @change='changeExcel'>
                    <el-button class="controller_button"
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
                   <!--  <el-button class="basic_button" type="danger"
                               size="small"
                               @click="handleDeletes"
                               style="margin-right: 0px;float: right">批量删除
                    </el-button> -->
                    <!--导出功能-->
                   <!--  <el-button v-waves :loading="downloadLoading"
                               class="controller_button"
                               @click="handleDownload"
                               style="margin-right: 0px;float: right"
                               type="primary"
                               size="small">导出
                    </el-button> -->
                    <!--新增功能-->
                   <!--  <el-button class="basic_button"
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
                    :key="tableKey"
                    :data="tableData"
                    v-loading="tableLoading"
                    element-loading-text="给我一点时间"
                    fit
                    height="calc(100% - 80px)"
                    size="mini"
                    tooltip-effect="dark"
                    style="width: 100%;font-size: 12px;margin-bottom:15px;border-radius:3px;"
                    :header-cell-style="tableHeaderColor">
                <!--索引列-->
                <el-table-column type="selection"
                                 :reserve-selection="true"
                                 width="40"
                                 align="center">
                </el-table-column>

                <el-table-column align="center" v-for="tableitem in formThead" :key="tableitem.key" :label="tableitem.label" :prop="tableitem.key">
                    <template slot-scope="scope">
                        {{ scope.row[tableitem.key] }}
                    </template>
                </el-table-column>

            
                <!--操作列-->
                <el-table-column align="center"
                                 label="查看"
                                 width="200">
                    <template slot-scope="scope">
                        <el-button size="mini"
                                   type="text"
                                   style="color: #66B1FF"
                                   @click="handleSearch(scope.row)"
                                    >
                                    所有人员
                        </el-button>
                        <!-- 筛选设备号的人员显示 -->
                        <!-- direction:可以决定弹出的方向 -->
                        <Drawer
                            :title=machinenumber
                            v-model="isShow"
                            direction="rtl"
                            width="50%">
                            
                            <el-table :data="nextTableData">
                                <el-table-column align='center' property="dwenrollnumber" label="工号" width="200"></el-table-column>
                                <el-table-column align='center' property="name" label="姓名" width="150"></el-table-column>
                                <el-table-column align='center' property="enabled" label="是否启用">
                                    <template slot-scope="scope">
                                        {{changeChanses(scope.row.enabled)}}
                                    </template>
                                </el-table-column>
                                <el-table-column align='center' property="privilege" label="用户权限"></el-table-column>

                            </el-table>

                        </Drawer>
                        <el-button size="mini"
                                   type="text"
                                   style="color: #F78989"
                                   disabled
                                @click="handleDel(scope.row,scope.index)">删除人员
                        </el-button>
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
        <el-dialog :visible.sync="dialogFormVisible" width="35%">
            <div slot="title">
                <span class="preTitle"></span>
                <span class="nextTitle">{{textMap[dialogStatus]}}</span>
            </div>
            <el-form :model="form"
                     :rules="rules"
                     size="mini"
                     ref="form"
                     label-width="100px">
                    <el-form-item label="设备编号"  prop="dwmachinenumber">
                        <el-input v-model="form.dwmachinenumber"  placeholder=""></el-input>
                    </el-form-item>

                    <el-form-item label="设备名称"  prop="machinename">
                        <el-input v-model="form.machinename" placeholder="设备名称(所属项目)"></el-input>
                    </el-form-item>

                    <el-form-item label="IP、端口"  prop="cardnumber"> 
                        <el-input v-model="form.cardnumber" placeholder="IP、端口"></el-input>
                    </el-form-item>
            </el-form>
            <div slot="footer"
                 class="dialog-footer">
                <el-button @click="cancel('form')"
                           size="small">取 消</el-button>
                <el-button v-if="dialogStatus=='create'"
                           type="primary"
                           size="small"
                           @click="create('form')">确 定</el-button>
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
                <el-checkbox label="dwmachinenumber">设备编号</el-checkbox>
                <el-checkbox label="machinename">设备名称</el-checkbox>
                <el-checkbox label="cardnumber">IP、端口</el-checkbox>     
            </el-checkbox-group>
        </el-dialog>

    </div>
</template>

<script>
    import { fetchList, getObj, addObj, putObj, delObj,delObjs } from '@/api/student'
    import { mapGetters } from 'vuex'
    import waves from "@/directive/waves/index.js"; // 水波纹指令
    //引入请求数据的方法
    import {getDevice} from '@/api/getdata/index';
    //引入根据设备查询人员的接口
    import {getByDevice} from '@/api/getdata/index';
    //表单迭代展示的列
    const defaultFormThead = [
              { key: 'dwmachinenumber', label: '设备编号' },
              { key: 'machinename', label: '设备名称' },
              { key: 'ip', label: 'IP' },
              { key: 'com', label: '端口号' },
            ];
    //默认当前选中的显示列
    const defaultFormTheadKey = [
                    'dwmachinenumber',
                    'machinename',
                    'cardnumber'
            ];

    export default {
        name: 'student',
        data() {
            return {
                multipleSelection: [],//全选存储数组
                /*1.表格参数初始化*/
                tableKey:0,
                tableData: [],
                formTheadOptions:defaultFormThead,
                checkboxVal: defaultFormTheadKey, // 默认全选中
                formThead: defaultFormThead, // 默认表头 Default header
                page: {
                    total: 0, // 总页数
                    currentPage: 1, // 当前页数
                    pageSize: 20 // 每页显示多少条
                },
                listQuery: {
                    page: 1,
                    limit: 20
                },
                tableLoading: true,
                downloadLoading: false,
                /*表单参数初始化*/
                form: {
                    /*name: undefined,*/
                },
                rules: {
                    /*校验初始化*/
                    name: [
                        {
                            required: true,
                            message: "请输入姓名",
                            trigger: "blur"
                        } ,
                        {
                            min: 3,
                            max: 20,
                            message: "长度在 3 到 20 个字符",
                            trigger: "blur"
                        }
                    ]

                },
                /*弹窗初始化*/
                dialogFormVisible: false,
                dialogFieldsVisible:false,
                dialogStatus: "",
                textMap: {
                    update: "编辑",
                    create: "创建"
                },
                //折叠面板显示所需数据
                isShow: false,
                nextTableData: [],
                machinenumber:''
            }
        },
        //观察函数
        watch: {
            checkboxVal(valArr) {
                this.formThead = this.formTheadOptions.filter(i => valArr.indexOf(i.key) >= 0)
                this.tableKey = this.tableKey + 1// 为了保证table 每次都会重渲 In order to ensure the table will be re-rendered each time
            },

            searchValue(curVal,oldVal){
                // console.log(curVal,oldVal);
            }
        },
        computed: {
            ...mapGetters(["permissions"])
        },
        created() {
            this.getList()
        },
        mounted: function() { },
        methods: {
            //英文TRue转换为中文
            changeChanses(val){
                if(val==='True'){
                    return '是'
                }
                return '否'
                
            },
            //上传EXCEL
            upExcel() {
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
            getList() {
                this.tableLoading = true
                //fetchList
                getDevice(this.listQuery).then(response =>{
                    // console.log(response.data.records)
                    this.tableData = response.data.records;
                    this.page.total = response.data.total
                    this.tableLoading = false
                })
            },
            //当前页数改变，传递新的页数的方法
            currentChange(val) {
                this.page.currentPage = val
                this.listQuery.page = val
                this.getList()
            },
            //当前条数改变设置新的条数的方法
            sizeChange(val) {
                this.page.pageSize = val
                this.listQuery.limit = val
                this.getList()
            },
            /**
             * @title 打开新增窗口
             *
             **/
            handleAdd: function() {
                //重置表单
                if( this.$refs['form']){
                    this.$refs['form'].resetFields();
                }
                this.dialogStatus = "create";
                this.dialogFormVisible = true;
            },
            //根据设备号查询人员名单
            handleSearch(row) {
                this.isShow = true ;
                this.machinenumber = row.dwmachinenumber + '号设备所有人员列表';
                // console.log(this.machinenumber)
                getByDevice(row.dwmachinenumber).then(res => {
                    this.nextTableData = res.data
                    // console.log(this.nextTableData)
                });
                
            },
            handleDel(row, index) {
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
            handleDownload() {
                this.downloadLoading = true
                import('@/vendor/Export2Excel').then(excel => {
                    //获取当前选中的动态列
                    // console.log(this.checkboxVal);
                    const tHeader =this.checkboxVal
                    const filterVal =this.checkboxVal
                    const data = this.formatJson(filterVal, this.tableData)
                    excel.export_json_to_excel({
                        header: tHeader,
                        data,
                        filename: 'table-list'
                    })
                    this.downloadLoading = false
                })
            },
            formatJson(filterVal, jsonData) {
                return jsonData.map(v => filterVal.map(j => {
                    if (j === 'timestamp') {
                        return parseTime(v[j])
                    } else {
                        return v[j]
                    }
                }))
            },
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
            update (formName) {
                const set = this.$refs;
                set[formName].validate(valid => {
                    if (valid) {
                        this.dialogFormVisible = false;
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
            create (formName) {
                const set = this.$refs;
                set[formName].validate(valid => {
                    if (valid) {
                        addObj(this.form).then(() => {
                            this.dialogFormVisible = false;
                            this.getList();
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
    .img{
         width:100px;
        height:100px;
        img{
            width:100px;
            height:100px;
        }
    }
</style>



