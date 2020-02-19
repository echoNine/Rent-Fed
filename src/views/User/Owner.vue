<template>
  <el-table
    :data="tableData"
    style="width: 100%">
    <el-table-column type="expand">
      <template slot-scope="props">
        <el-form label-position="left" inline class="demo-table-expand">
          <el-form-item label="性别">
            <span>{{ props.row.mgrSex }}</span>
          </el-form-item>
          <el-form-item label="身份证号">
            <span>{{ props.row.mgrCardNum }}</span>
          </el-form-item>
          <el-form-item label="联系电话">
            <span>{{ props.row.mgrPhone }}</span>
          </el-form-item>
          <el-form-item label="籍贯">
            <span>{{ props.row.mgrNative }}</span>
          </el-form-item>
          <el-form-item label="注册日期">
            <span>{{ props.row.createdAt }}</span>
          </el-form-item>
        </el-form>
      </template>
    </el-table-column>
    <el-table-column
      label="序号"
      prop="mgrId">
    </el-table-column>
    <el-table-column
      label="用户名"
      prop="mgrEmail">
    </el-table-column>
    <el-table-column
      label="姓名"
      prop="mgrTrueName">
    </el-table-column>
    <el-table-column
      label="操作"
      prop="done">
      <template slot-scope="scope">
        <el-button
          size="mini"
        type="primary">查看房源</el-button>
        <el-button
          size="mini"
          type="danger"
          @click="handleDelete(scope.$index, scope.row)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
export default {
  name: 'Owner',
  data () {
    return {
      tableData: [{
        mgrId: '',
        mgrTrueName: '',
        mgrSex: '',
        mgrCardNum: '',
        mgrPhone: '',
        mgrNative: '',
        createdAt: ''
      }]
    }
  },
  created: function () {
    this.getDataInfo()
  },
  methods: {
    getDataInfo: function () {
      this.$ajax.get('/list/owner')
        .then(res => {
          this.tableData = res.data.msg.table
        })
    },
    handleDelete (index, row) {
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
