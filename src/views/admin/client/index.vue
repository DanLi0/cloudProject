<template>
  <div class="app-container pull-auto">
    <basic-container>
      <avue-crud ref="crud"
                 :page="page"
                 :data="tableData"
                 :table-loading="tableLoading"
                 :option="tableOption"
                 @current-change="currentChange"
                 @refresh-change="refreshChange"
                 @size-change="sizeChange"
                 @row-update="handleUpdate"
                 @row-save="handleSave"
                 @row-del="rowDel">
        <template slot-scope="scope"
                  slot="menu">
          <el-button type="primary"
                     v-if="permissions.sys_client_edit"
                     icon="el-icon-check"
                     size="mini"
                     plain
                     @click="handleEdit(scope.row,scope.index)">编辑</el-button>
          <el-button type="danger"
                     v-if="permissions.sys_client_del"
                     icon="el-icon-delete"
                     size="mini"
                     plain
                     @click="handleDel(scope.row,scope.index)">删除</el-button>
        </template>
      </avue-crud>
    </basic-container>
  </div>
</template>

<script>
import { fetchList, addObj, putObj, delObj } from '@/api/client'
import { tableOption } from '@/const/crud/client'
import { mapGetters } from 'vuex'
export default {
  name: 'client',
  data() {
    return {
      tableData: [],
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20 // 每页显示多少条
      },
      tableLoading: false,
      tableOption: tableOption
    }
  },
  created() {
    this.getList()
  },
  mounted: function() { },
  computed: {
    ...mapGetters(['permissions'])
  },
  methods: {
    getList() {
      this.tableLoading = true
      fetchList({
        page: this.page.currentPage,
        limit: this.page.pageSize
      }).then(response => {
        this.tableData = response.data.records
        this.page.total = response.data.total
        this.tableLoading = false
      })
    },
    currentChange(val) {
      this.page.currentPage = val
      this.getList()
    },
    sizeChange(val) {
      this.page.pageSize = val
      this.getList()
    },
    /**
     * @title 打开新增窗口
     * @detail 调用crud的handleadd方法即可
     *
     **/
    handleAdd: function() {
      this.$refs.crud.rowAdd()
    },
    handleEdit(row, index) {
      this.$refs.crud.rowEdit(row, index)
    },
    handleDel(row, index) {
      this.$refs.crud.rowDel(row, index)
    },
    rowDel: function(row, index) {
      var _this = this
      this.$confirm('是否确认删除ID为' + row.clientId, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(function() {
          return delObj(row.clientId)
        })
        .then(data => {
          _this.tableData.splice(index, 1)
          _this.$message({
            showClose: true,
            message: '删除成功',
            type: 'success'
          })
        })
        .catch(function(err) { })
    },
    /**
     * @title 数据更新
     * @param row 为当前的数据
     * @param index 为当前更新数据的行数
     * @param done 为表单关闭函数
     *
     **/
    handleUpdate: function(row, index, done) {
      putObj(row).then(data => {
        this.tableData.splice(index, 1, Object.assign({}, row))
        this.$message({
          showClose: true,
          message: '修改成功',
          type: 'success'
        })
        done()
      })
    },
    /**
     * @title 数据添加
     * @param row 为当前的数据
     * @param done 为表单关闭函数
     *
     **/
    handleSave: function(row, done) {
      addObj(row).then(data => {
        this.tableData.push(Object.assign({}, row))
        this.$message({
          showClose: true,
          message: '添加成功',
          type: 'success'
        })
        done()
      })
    },
    /**
     * 刷新回调
     */
    refreshChange() {
      this.getList()
    }
  }
}
</script>

<style lang="scss" scoped>
</style>

