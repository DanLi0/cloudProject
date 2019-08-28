<template>
    <div  class="app-container calendar-list-container">
        <basic-container>
            <div class="h2">{{params.name}}</div>
            <!--表格控件-->
            <el-table
                    border
                    :data="tableData"
                    v-loading="tableLoading"
                    element-loading-text="给我一点时间"
                    fit
                    height="calc(100% - 80px)"
                    size="mini"
                    tooltip-effect="dark"
                    style="width: 100%;font-size: 12px;margin-bottom:15px;border-radius:3px;"
                    :header-cell-style="tableHeaderColor">

                <el-table-column align="center"  width='120' label="时间" prop="dateTime">
                    <template slot-scope="scope">
                        {{ scope.row.dateTime }}
                    </template>
                </el-table-column>
                <el-table-column align="center"  label="面容图片" prop="clocks">
                    <template slot-scope="scope">
                      <div class="contentBox">
                        <div class="content"
                          v-for="item in scope.row.clocks" 
                          v-show='item.byteString==null?false:true' 
                          :key='item.id'>

                          <div class="imgbox">
                            <img  :src=" 'data:image/jpeg;base64,'+item.byteString "  class="facePic">
                          </div>
                          <div class="infoBox">
                            <p class="p">{{item.sysName}}</p>
                            <p>{{item.ctime}}</p>  
                          </div>
                        </div> 
                      </div>
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
    </div>

</template>

<script>
    import waves from "@/directive/waves/index.js"; // 水波纹指令
    //引入请求图片的方法
    import {downloadImage} from '@/api/getdata/index';
    export default {
        name:'img',
        props:['params'],
        data(){ 
            return {
                tableData: [],
                page: {
                    total: 0, // 总页数
                    currentPage: 1, // 当前页数
                    pageSize: 10 // 每页显示多少条
                },
                listQuery: {
                    page: 1,
                    limit: 10
                },
                tableLoading: true,  
            }
        },
        created() {
            this.getList()
        },
        mounted: function() {
         },
        watch:{
          params:function(){
            this.getList();
          }
        },
        methods: {
            getList() {
                this.tableLoading = true
               //存在直接取数据
                let params = this.params
                if(!params){
                  return false
                }
        
                //参数从localstorage中取
                this.listQuery.userCode = params.userCode
                this.listQuery.startTime = params.startTime
                this.listQuery.endTime =params.endTime

                downloadImage(this.listQuery).then(response => {
                  // console.log("请求数据结果",response.data.records)
                  this.tableData = response.data.records;
                  this.page.total = response.data.total;
                  this.tableLoading = false
                })
            },
            currentChange(val) {
                this.page.currentPage = val
                this.listQuery.page = val
                this.getList()
            },
            sizeChange(val) {
                this.page.pageSize = val
                this.listQuery.limit = val
                this.getList()
            },
            /**
             * @title 打开新增窗口
             *
             **/
            /**
             * @title 数据更新
             * @param row 为当前的数据
             * @param index 为当前更新数据的行数
             * @param done 为表单关闭函数
             *
             **/
            /**
             * @title 数据添加
             * @param row 为当前的数据
             * @param done 为表单关闭函数
             *
             **/
            /**
             * 刷新回调
             */
            refreshChange() {
                this.getList()
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
      height:100%;
        /deep/ .filter-container{
            .filter-item{
                margin-bottom: 0;
            }
        }
      .basic-container{
        height: 100%;
        .el-button:nth-child(-n+4){
          margin: 0 0 0 10px !important;
        }
      }
      .contentBox{
        display:flex;
        align-items: center;
        .content{
          margin:0 20px;
          .imgbox{
            width:80px;
            height:80px;
            margin-bottom: 5px;
            .facePic{
              width:100%;
              height:100%;
              border-radius: 50%;
              overflow: hidden;

            }
          }
          .infoBox{
            text-align: center;
            margin:0 10px;
            p{
              text-align: center;
            }
            .p{
              color:#000;
            }
          }
        }
      }
      .h2{
        font-size:16px;
        width:100%;
        height:22px;
        margin-bottom: 10px;
        line-height: 22px;
        color:#1E1E1E;
        font-weight: bold;
      }
    }
</style>


