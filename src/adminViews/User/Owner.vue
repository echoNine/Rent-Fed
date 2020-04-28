<template>
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
        <el-table-column prop="id" label="房源编号"></el-table-column>
        <el-table-column prop="status" label="房源状态"></el-table-column>
        <el-table-column prop="rentType" label="租赁类型"></el-table-column>
        <el-table-column label="详情"><el-button type="primary" size="mini" plain>查看</el-button></el-table-column>
      </el-table>
    </el-dialog>
    <el-table
      :data="tableData"
      border
      stripe>
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
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
      <el-table-column
        label="房主编号"
        prop="id">
      </el-table-column>
      <el-table-column
        label="用户账户"
        prop="email">
      </el-table-column>
      <el-table-column
        label="姓名"
        prop="username">
      </el-table-column>
      <el-table-column
        label="操作"
        prop="done">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="showHouseList(scope.row)">查看房源</el-button>
          <el-button size="mini" type="danger" @click="deleteOwnerById(scope.row)">注销用户</el-button>
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
      gridData: [{
        id: '',
        status: '',
        rentType: ''
      }],
      dialogTableVisible: false,
      tableData: [{
        id: '',
        email: '',
        username: '',
        sex: '',
        cardNum: '',
        phone: '',
        native: '',
        job: '',
        createdAt: ''
      }],
      queryData: {
        id: '',
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
    pageChange (val) {
      this.queryData.pageNum = val
      this.getOwnerList()
    },
    search () {
      this.queryData.pageNum = 1
      this.getOwnerList()
    },
    getOwnerList: function () {
      this.$ajax.get('/user/userList', {
        params: {
          id: Number(this.queryData.id.replace(/(^O_*)/g, '')),
          pageNum: this.queryData.pageNum,
          pageSize: this.queryData.pageSize,
          type: 2
        }
      })
        .then(res => {
          this.queryData.totalCount = res.data.msg.totalCount
          this.tableData = res.data.msg.data.table.map(item => {
            item.id = 'O_' + item.id
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
      console.log(row.id)
      this.$ajax.get('/list/houseList', {
        params: {
          id: Number(row.id.replace(/(^O_*)/g, ''))
        }
      }).then(res => {
        this.gridData = res.data.msg.table.map(item => {
          item.id = 'H_' + item.id
          return item
        })
      })
    },
    deleteOwnerById: function (row) {
      this.$loading({ text: '正在注销, 请稍等...' })
      this.$ajax.post('/owner/deleteOwner', {
        id: Number(row.id.replace(/(^O_*)/g, ''))
      })
        .then(res => {
          console.log(res.data)
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
