<template>
  <div class="TobeOwnerDiv">
    <el-card>
      <el-table
        :data="tableData"
        border
        stripe>
        <el-table-column align="center"
          label="申请编号"
          prop="id">
        </el-table-column>
        <el-table-column align="center"
          label="用户编号"
          prop="userId">
        </el-table-column>
        <el-table-column align="center"
          label="城市"
          prop="houseCity">
        </el-table-column>
        <el-table-column align="center"
          label="小区"
          prop="houseCommunity">
        </el-table-column>
        <el-table-column align="center"
          label="提交时间"
          prop="createdAt">
        </el-table-column>
        <el-table-column align="center"
          label="状态"
          prop="applyStatus">
        </el-table-column>
        <el-table-column align="center"
          label="意见"
          prop="done">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" v-show="scope.row.applyStatus === '待处理'" @click="pass(scope.row.id)">通过</el-button>
            <el-button size="mini" type="danger" v-show="scope.row.applyStatus === '待处理'" @click="reject(scope.row.id)">拒绝</el-button>
          </template>
        </el-table-column>
        <el-table-column align="center"
          label="审核人"
          prop="adminId">
        </el-table-column>
      </el-table>
      <el-pagination
        @current-change="pageChange"
        background
        layout="prev, pager, next"
        :page-size="queryData.pageSize"
        :total="queryData.totalCount">
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'Tenant',
  inject: ['reload'],
  data: function () {
    return {
      tableData: [],
      queryData: {
        pageNum: 1,
        pageSize: 10,
        totalCount: 0
      }
    }
  },
  created: function () {
    this.getOwnerList()
  },
  methods: {
    pass (id) {
      this.$ajax.post('/backend/user/passTobeOwnerApply', {
        id: id
      })
        .then(res => {
          if (res.data) {
            this.$message.success({
              duration: 1000,
              message: '操作成功',
              onClose: () => {
                this.$loading().close()
                this.reload()
              }
            })
          } else {
            this.$message.error({
              message: '操作失败',
              onClose: () => {
                this.$loading().close()
                this.reload()
              }
            })
          }
        })
        .catch(() => {
          this.$loading().close()
        })
    },
    reject (id) {
      this.$ajax.post('/backend/user/rejectTobeOwnerApply', {
        id: id
      })
        .then(res => {
          if (res.data) {
            this.$message.success({
              duration: 1000,
              message: '操作成功',
              onClose: () => {
                this.$loading().close()
                this.reload()
              }
            })
          } else {
            this.$message.error({
              message: '操作失败',
              onClose: () => {
                this.$loading().close()
                this.reload()
              }
            })
          }
        })
        .catch(() => {
          this.$loading().close()
        })
    },
    pageChange (val) {
      this.queryData.pageNum = val
      this.getOwnerList()
    },
    search () {
      this.queryData.pageNum = 1
      this.getOwnerList()
    },
    getOwnerList: function () {
      this.$ajax.get('/backend/user/getTobeOwnerApplyList', {
        params: {
          pageNum: this.queryData.pageNum,
          pageSize: this.queryData.pageSize
        }
      })
        .then(res => {
          this.queryData.totalCount = res.data.msg.totalCount
          this.tableData = res.data.msg.data.table.map(item => {
            item.userId = 'Tenant_' + item.userId
            if (item.adminId === null) {
              item.adminId = ''
            } else {
              item.adminId = 'Admin_' + item.adminId
            }
            item.createdAt = this.$moment(item.createdAt).format('YYYY-MM-DD hh:mm:ss')
            item.applyStatus = this.convert(item.applyStatus)
            return item
          })
        })
    },
    convert: function (status) {
      switch (status) {
        case 'todo':
          return '待处理'
        case 'pass':
          return '已通过'
        case 'reject':
          return '已拒绝'
      }
    }
  }
}
</script>

<style lang="scss">
  .TobeOwnerDiv {
    width: 100%;
    height: 100%;
    .el-pagination {
      margin-top: 20px;
    }
    .table-expand {
      font-size: 0;
    }

    .table-expand label {
      width: 90px;
      color: #99a9bf;
    }

    .table-expand .el-form-item {
      margin-right: 0;
      margin-bottom: 0;
      width: 50%;
    }
  }
</style>
