<template>
  <div class="OwnerDiv">
    <el-card>
      <el-row style="margin: 5px 0px 20px">
        <el-col :span="8">
          <el-input placeholder="请输入房主编号" v-model="queryData.id" @clear="handleClear" clearable>
            <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <el-dialog title="房源信息" :visible.sync="dialogTableVisible">
        <el-table :data="gridData" border>
          <el-table-column align="center"  prop="id" label="房源编号"></el-table-column>
          <el-table-column align="center"  prop="rentStatus" label="房源状态"></el-table-column>
          <el-table-column align="center"  prop="rentType" label="租赁类型"></el-table-column>
        </el-table>
      </el-dialog>
      <el-table
        :data="tableData"
        style="width: 100%"
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
          label="房主编号"
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
            <el-button size="mini" type="primary" @click="showHouseList(scope.row)">查看房源</el-button>
            <el-button size="mini" type="danger" @click="deleteOwnerToTenant(scope.row)">注销房主资格</el-button>
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
  data: function () {
    return {
      gridData: [],
      dialogTableVisible: false,
      tableData: [],
      queryData: {
        id: '',
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
    pageChange (val) {
      this.queryData.pageNum = val
      this.getOwnerList()
    },
    search () {
      this.queryData.pageNum = 1
      this.getOwnerList()
    },
    getOwnerList: function () {
      this.$ajax.get('/backend/user/getUserList', {
        params: {
          id: Number(this.queryData.id.replace(/(^Owner_*)/g, '')),
          pageNum: this.queryData.pageNum,
          pageSize: this.queryData.pageSize,
          type: 'owner'
        }
      })
        .then(res => {
          this.queryData.totalCount = res.data.msg.totalCount
          this.tableData = res.data.msg.data.table.map(item => {
            item.id = 'Owner_' + item.id
            item.createdAt = this.$moment(item.createdAt).format('YYYY-MM-DD hh:mm:ss')
            return item
          })
        })
    },
    handleClear () {
      this.queryData.id = ''
      this.queryData.pageNum = 1
      this.getOwnerList()
    },
    showHouseList: function (row) {
      this.dialogTableVisible = true
      this.$ajax.get('/backend/house/getHouseListByOwnerId', {
        params: {
          id: Number(row.id.replace(/(^Owner_*)/g, ''))
        }
      }).then(res => {
        this.gridData = res.data.msg.table.map(item => {
          item.id = 'H_' + item.id
          item.rentType = this.convertRentType(item.rentType)
          item.rentStatus = this.convertRentStatus(item.rentStatus)
          return item
        })
      })
    },
    convertRentType: function (rentType) {
      switch (rentType) {
        case 'wholeRented':
          return '整租'
        case 'cotenancy':
          return '合组'
      }
    },
    convertRentStatus: function (rentStatus) {
      switch (rentStatus) {
        case 'empty':
          return '空闲'
        case 'rented':
          return '已租用'
      }
    },
    deleteOwnerToTenant: function (row) {
      this.$loading({ text: '正在注销, 请稍等...' })
      this.$ajax.post('/backend/user/deleteOwnerToTenant', {
        id: Number(row.id.replace(/(^Owner_*)/g, ''))
      })
        .then(res => {
          if (res.data) {
            this.$message.success({
              duration: 1000,
              message: '资格注销成功！',
              onClose: () => {
                this.$loading().close()
                this.reload()
              }
            })
          } else {
            this.$message.error({
              message: '该房主持有激活房源，不可注销..',
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
  .OwnerDiv {
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
