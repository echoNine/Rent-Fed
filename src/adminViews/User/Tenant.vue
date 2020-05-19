<template>
  <div class="TenantDiv">
    <el-card>
      <el-row style="margin: 5px 0px 20px">
        <el-col :span="8">
          <el-input placeholder="请输入租户编号" v-model="queryData.id" @clear="handleClear" clearable>
            <el-button slot="append" icon="el-icon-search" @click="getTenantList"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <el-table
        :data="tableData"
        border
        stripe>
        <el-table-column align="center"  type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="table-expand">
              <el-form-item label="性别">
                <span>{{ props.row.sex }}</span>
              </el-form-item>
              <el-form-item label="身份证号">
                <span>{{ props.row.cardNum }}</span>
              </el-form-item>
              <el-form-item label="职业">
                <span>{{ props.row.job }}</span>
              </el-form-item>
              <el-form-item label="联系电话">
                <span>{{ props.row.phone }}</span>
              </el-form-item>
              <el-form-item label="籍贯">
                <span>{{ props.row.native }}</span>
              </el-form-item>
              <el-form-item label="注册日期">
                <span>{{ props.row.createdAt }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column align="center"
          label="租户编号"
          prop="id">
        </el-table-column>
        <el-table-column align="center"
          label="用户账户"
          prop="email">
        </el-table-column>
        <el-table-column align="center"
          label="姓名"
          prop="name">
        </el-table-column>
        <el-table-column align="center"
          label="操作"
          prop="done">
          <template slot-scope="scope">
            <el-button size="mini" type="danger" @click="deleteTenantById(scope.row)">注销用户</el-button>
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

  </div>
</template>

<script>
export default {
  name: 'Tenant',
  inject: ['reload'],
  data () {
    return {
      tableData: [],
      queryData: {
        id: '',
        pageNum: 1,
        pageSize: 2,
        totalCount: 0
      }
    }
  },
  created: function () {
    this.getTenantList()
  },
  methods: {
    pageChange (val) {
      this.queryData.pageNum = val
      this.getTenantList()
    },
    search () {
      this.queryData.pageNum = 1
      this.getTenantList()
    },
    getTenantList: function () {
      this.$ajax.get('/backend/user/getUserList', {
        params: {
          id: Number(this.queryData.id.replace(/(^Tenant_*)/g, '')),
          pageNum: this.queryData.pageNum,
          pageSize: this.queryData.pageSize,
          type: 'tenant'
        }
      })
        .then(res => {
          this.queryData.totalCount = res.data.msg.totalCount
          this.tableData = res.data.msg.data.table.map(item => {
            item.id = 'Tenant_' + item.id
            item.createdAt = this.$moment(item.createdAt).format('YYYY-MM-DD hh:mm:ss')
            return item
          })
        })
    },
    handleClear () {
      this.queryData.id = ''
      this.queryData.pageNum = 1
      this.getTenantList()
    },
    deleteTenantById: function (row) {
      this.$loading({ text: '正在注销, 请稍等...' })
      this.$ajax.post('/backend/user/deleteTenant', {
        id: Number(row.id.replace(/(^Tenant_*)/g, ''))
      })
        .then(res => {
          if (res.data) {
            this.$message.success({
              duration: 1000,
              message: '注销成功！',
              onClose: () => {
                this.$loading().close()
                this.reload()
              }
            })
          } else {
            this.$message.error({
              message: '该租户有未到期的租房协议，不可注销..',
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
    }
  }
}
</script>
<style lang="scss">
  .TenantDiv {
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
