<template>
  <div class="ApplyRenewalDiv">
    <el-card>
      <el-tabs type="border-card">
        <el-tab-pane label="续签委托">
          <el-table
            :data="OwnerApplyData"
            border
            stripe>
            <el-table-column align="center"  type="expand">
              <template slot-scope="props">
                <el-form label-position="left" inline class="table-expand">
                  <el-form-item label="房屋城市">
                    <span>{{ props.row.atCity }}</span>
                  </el-form-item>
                  <el-form-item label="详细地址">
                    <span>{{ props.row.address }}</span>
                  </el-form-item>
                  <el-form-item label="使用面积">
                    <span>{{ props.row.area }}</span>
                  </el-form-item>
                  <el-form-item label="小区名称">
                    <span>{{ props.row.community }}</span>
                  </el-form-item>
                  <el-form-item label="所在楼层">
                    <span>{{ props.row.floor }}</span>
                  </el-form-item>
                  <el-form-item label="房屋户型">
                    <span>{{ props.row.layout }}</span>
                  </el-form-item>
                  <el-form-item label="房屋朝向">
                    <span>{{ props.row.orientation }}</span>
                  </el-form-item>
                  <el-form-item label="建筑年份">
                    <span>{{ props.row.buildAt }}</span>
                  </el-form-item>
                  <el-form-item label="配置独卫">
                    <span>{{ props.row.toilet }}</span>
                  </el-form-item>
                  <el-form-item label="配置阳台">
                    <span>{{ props.row.balcony }}</span>
                  </el-form-item>
                  <el-form-item label="出租类型">
                    <span>{{ props.row.rentType }}</span>
                  </el-form-item>
                  <el-form-item label="门牌号码">
                    <span>{{ props.row.houseNum }}</span>
                  </el-form-item>
                  <el-form-item label="房间号码">
                    <span>{{ props.row.roomNum }}</span>
                  </el-form-item>
                </el-form>
              </template>
            </el-table-column>
            <el-table-column align="center"
                             prop="id"
                             label="申请编号">
            </el-table-column>
            <el-table-column align="center"
                             prop="contractId"
                             label="原合同编号"
                             sortable>
            </el-table-column>
            <el-table-column align="center"
                             prop="userId"
                             label="房主编号">
            </el-table-column>
            <el-table-column align="center"
                             prop="houseId"
                             label="房源编号">
            </el-table-column>
            <el-table-column align="center"
                             label="状态"
                             prop="applyStatus">
            </el-table-column>
            <el-table-column align="center"
                             label="审核人"
                             prop="adminId">
            </el-table-column>
            <el-table-column align="center"
                             label="操作"
                             prop="done">
              <template slot-scope="scope">
                <el-dropdown @command="handleOwnerCommand">
            <span class="el-dropdown-link">
              操作<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item :command="{ type: 'passOwner', row: scope.row }" :disabled="scope.row.applyStatus !== '待处理'">通过申请</el-dropdown-item>
                    <el-dropdown-item :command="{ type: 'rejectOwner', row: scope.row }" :disabled="scope.row.applyStatus !== '待处理'">拒绝申请</el-dropdown-item>
                    <el-dropdown-item :command="{ type: 'signOwner', row: scope.row }" :disabled="scope.row.applyStatus !== '已通过' || scope.row.rentStatus !== 'unactivated'">激活房源</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="续签租赁">
          <el-table
            :data="TenantApplyData"
            border
            stripe>
            <el-table-column align="center"
                             prop="id"
                             label="申请编号">
            </el-table-column>
            <el-table-column align="center"
                             prop="contractId"
                             label="原合同编号"
                             sortable>
            </el-table-column>
            <el-table-column align="center"
                             prop="userId"
                             label="租户编号">
            </el-table-column>
            <el-table-column align="center"
                             prop="houseId"
                             label="房源编号">
            </el-table-column>
            <el-table-column align="center"
                             label="状态"
                             prop="applyStatus">
            </el-table-column>
            <el-table-column align="center"
                             label="审核人"
                             prop="adminId">
            </el-table-column>
            <el-table-column align="center"
                             label="操作"
                             prop="done">
              <template slot-scope="scope">
                <el-dropdown @command="handleTenantCommand">
            <span class="el-dropdown-link">
              操作<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item :command="{ type: 'passTenant', row: scope.row }" :disabled="scope.row.applyStatus !== '待处理'">通过</el-dropdown-item>
                    <el-dropdown-item :command="{ type: 'rejectTenant', row: scope.row }" :disabled="scope.row.applyStatus !== '待处理'">拒绝</el-dropdown-item>
                    <el-dropdown-item :command="{ type: 'signTenant', row: scope.row }" :disabled="scope.row.applyStatus !== '已通过'">去续签</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'ApplyRenewal',
  inject: ['reload'],
  data () {
    return {
      OwnerApplyData: [],
      TenantApplyData: []
    }
  },
  created: function () {
    this.getOwnerApplyData()
    this.getTenantApplyData()
  },
  methods: {
    getOwnerApplyData: function () {
      this.$ajax.get('/backend/contract/getApplyRenewalList', {
        params: {
          type: 'withOwner'
        }
      })
        .then(res => {
          this.OwnerApplyData = res.data.msg.table.map(item => {
            item.contractId = 'OC_' + item.contractId
            item.userId = 'Owner_' + item.userId
            item.houseId = 'House_' + item.houseId
            item.adminId && (item.adminId = 'Admin_' + item.adminId)
            item.applyStatus = this.convertApplyStatus(item.applyStatus)
            item.buildAt = this.$moment(item.buildAt).format('YYYY-MM-DD')
            item.toilet = this.convertBoolStatus(item.toilet)
            item.balcony = this.convertBoolStatus(item.balcony)
            item.rentType = this.convertRentType(item.rentType)
            return item
          })
        })
    },
    getTenantApplyData: function () {
      this.$ajax.get('/backend/contract/getApplyRenewalList', {
        params: {
          type: 'withTenant'
        }
      })
        .then(res => {
          this.TenantApplyData = res.data.msg.table.map(item => {
            item.contractId = 'TC_' + item.contractId
            item.userId = 'Tenant_' + item.userId
            item.houseId = 'House_' + item.houseId
            item.adminId && (item.adminId = 'Admin_' + item.adminId)
            item.applyStatus = this.convertApplyStatus(item.applyStatus)
            return item
          })
        })
    },
    convertApplyStatus (applyStatus) {
      switch (applyStatus) {
        case 'todo':
          return '待处理'
        case 'pass':
          return '已通过'
        case 'reject':
          return '已拒绝'
        case 'finished':
          return '已完成'
      }
    },
    convertRentType: function (rentType) {
      switch (rentType) {
        case 'wholeRented':
          return '整租'
        case 'cotenancy':
          return '合组'
      }
    },
    convertBoolStatus: function (boolStatus) {
      switch (boolStatus) {
        case true:
          return '已配置'
        case false:
          return '未配置'
      }
    },
    handleOwnerCommand (cmdItem) {
      switch (cmdItem.type) {
        case 'passOwner':
          return this.passOwner(cmdItem.row)
        case 'rejectOwner':
          return this.rejectOwner(cmdItem.row)
        case 'signOwner':
          return this.signOwner(cmdItem.row)
      }
    },
    passOwner (row) {
      this.$ajax.post('/backend/contract/passOwnerRenewalApply', {
        id: row.id,
        houseId: Number(row.houseId.replace(/(^House_*)/g, ''))
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
    rejectOwner (row) {
      this.$ajax.post('/backend/contract/rejectOwnerRenewalApply', {
        id: row.id
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
    signOwner (row) {
      this.$router.push({ path: '/Contract/WithOwner', query: { houseId: Number(row.houseId.replace(/(^House_*)/g, '')) } })
    },
    handleTenantCommand (cmdItem) {
      switch (cmdItem.type) {
        case 'passTenant':
          return this.passTenant(cmdItem.row)
        case 'rejectTenant':
          return this.rejectTenant(cmdItem.row)
        case 'signTenant':
          return this.signTenant(cmdItem.row)
      }
    },
    passTenant (row) {
      this.$ajax.post('/backend/contract/passOwnerRenewalApply', {
        id: row.id,
        houseId: Number(row.houseId.replace(/(^House_*)/g, ''))
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
    rejectTenant (row) {
      this.$ajax.post('/backend/contract/rejectOwnerRenewalApply', {
        id: row.id
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
    signTenant (row) {
      this.$router.push({ path: '/Contract/WithTenant',
        query: {
          houseId: Number(row.houseId.replace(/(^House_*)/g, '')),
          userId: Number(row.userId.replace(/(^Tenant_*)/g, ''))
        } })
    }
  }
}
</script>

<style lang="scss">
  .ApplyRenewalDiv {
    width: 100%;
    height: 100%;
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
