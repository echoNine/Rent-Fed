<template>
<div class="OrderHouseDiv">
  <el-card>
  <el-table
    :data="orderData" stripe border>
    <el-table-column align="center" prop="id" label="约看编号"/>
    <el-table-column align="center" prop="houseId" label="房源编号"/>
    <el-table-column align="center" prop="community" label="小区名称"/>
    <el-table-column align="center" prop="userId" label="约看用户"/>
    <el-table-column align="center" prop="orderTime" label="约看时间"/>
    <el-table-column align="center" prop="orderStatus" label="约看状态"/>
    <el-table-column align="center" prop="adminId" label="处理人"/>
    <el-table-column align="center" label="操作">
      <template slot-scope="scope">
        <el-button plain size="mini" type="primary" v-show="scope.row.orderStatus === '待处理'" @click="pass(scope.row.id)">接受</el-button>
        <el-button plain size="mini" type="danger" v-show="scope.row.orderStatus === '待处理'" @click="reject(scope.row.id)">退回</el-button>
      </template>
    </el-table-column>
  </el-table>
  </el-card>
</div>
</template>

<script>
export default {
  name: 'OrderHouse',
  inject: ['reload'],
  data () {
    return {
      orderData: []
    }
  },
  created () {
    this.getOrderData()
  },
  methods: {
    getOrderData: function () {
      this.$ajax.get('/backend/house/getOrderList')
        .then(res => {
          this.orderData = res.data.msg.table.map(item => {
            item.id = 'OS_' + item.id
            item.houseId = 'House_' + item.houseId
            item.userId = 'Tenant_' + item.userId
            if (item.adminId === null) {
              item.adminId = ''
            } else {
              item.adminId = 'Admin_' + item.adminId
            }
            item.orderTime = this.$moment(item.orderTime).format('YYYY-MM-DD')
            item.orderStatus = this.convertOrderStatus(item.orderStatus)
            return item
          })
        })
    },
    convertOrderStatus: function (orderStatus) {
      switch (orderStatus) {
        case 'todo':
          return '待处理'
        case 'done':
          return '已通过'
        case 'reject':
          return '已退回'
      }
    },
    pass: function (id) {
      this.$ajax.post('/backend/house/passHouseOrder', {
        id: Number(id.replace(/(^OS_*)/g, ''))
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
      this.$ajax.post('/backend/house/rejectHouseOrder', {
        id: Number(id.replace(/(^OS_*)/g, ''))
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
    }
  }
}
</script>

<style lang="scss">
  .OrderHouseDiv {
    width: 100%;
    height: 100%;
  }
</style>
