<template>
  <el-card>
    <el-row style="margin: 5px 0px 20px">
      <el-col :span="8">
        <el-select v-model="status" placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-col>
    </el-row>
    <el-table
      :data="tableData"
      border
      stripe>
      <el-table-column
        label="申请编号"
        prop="id">
      </el-table-column>
      <el-table-column
        label="用户编号"
        prop="userId">
      </el-table-column>
      <el-table-column
        label="城市"
        prop="city">
      </el-table-column>
      <el-table-column
        label="小区"
        prop="community">
      </el-table-column>
      <el-table-column
        label="提交时间"
        prop="createdAt">
      </el-table-column>

      <el-table-column
          label="状态"
          prop="status">
      </el-table-column>
      <el-table-column
        label="审核"
        prop="done">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" v-show="scope.row.status === '待处理'" @click="pass(scope.row.id)">通过</el-button>
          <el-button size="mini" type="danger" v-show="scope.row.status === '待处理'" @click="reject(scope.row.id)">拒绝</el-button>
        </template>
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
</template>

<script>
export default {
  name: 'Tenant',
  inject: ['reload'],
  data: function () {
    return {
      options: [],
      status: '',
      tableData: [],
      queryData: {
        pageNum: 1,
        pageSize: 2,
        totalCount: 0
      }
    }
  },
  created: function () {
    this.getOwnerList()
  },
  methods: {
    pass (id) {
      this.$ajax.post('/user/passOwnerApply', {
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
      return ''
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
      this.$ajax.get('/user/toBeOwnerList', {
        params: {
          pageNum: this.queryData.pageNum,
          pageSize: this.queryData.pageSize,
          type: 2
        }
      })
        .then(res => {
          this.queryData.totalCount = res.data.msg.totalCount
          this.tableData = res.data.msg.data.table.map(item => {
            item.userId = 'T_' + item.userId
            item.status = this.convert(item.status)
            return item
          })
        })
    },
    convert: function (status) {
      switch (status) {
        case 'todo':
          return '待处理'
        case 'done':
          return '已完成'
      }
    }
  }
}
</script>

<style>
  .demo-table-expand {
    font-size: 0;
  }

  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }

  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
</style>
