<template>
  <div class="ApplyForHouseDiv">
    <el-card>
      <div style="margin-bottom: 20px">
        <span style="margin-right: 20px">房源状态</span>
        <el-select v-model="queryData.status" multiple placeholder="请选择" @change="getHouseList" clearable @clear="getHouseList">
          <el-option
            v-for="(item,index) in Object.values(statusMap)"
            :key="index"
            :label="item"
            :value="item">
          </el-option>
        </el-select>
      </div>
      <el-table
        :data="tableData"
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
          label="房源编号"
          prop="id">
        </el-table-column>
        <el-table-column align="center"
          label="房主编号"
          prop="userId">
        </el-table-column>
        <el-table-column align="center"
          label="提交时间"
          prop="createdAt">
        </el-table-column>
        <el-table-column align="center"
          label="状态"
          prop="rentStatus">
        </el-table-column>
        <el-table-column align="center"
          label="审核人"
          prop="adminId">
        </el-table-column>
        <el-table-column align="center"
          label="操作"
          prop="done">
          <template slot-scope="scope">
            <el-dropdown @command="handleCommand">
            <span class="el-dropdown-link">
              操作<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item :command="{ type: 'pass', id: scope.row.id }" :disabled="scope.row.rentStatus !== '待处理'">通过申请</el-dropdown-item>
                <el-dropdown-item :command="{ type: 'reject', id: scope.row.id }" :disabled="scope.row.rentStatus !== '待处理'">拒绝申请</el-dropdown-item>
                <el-dropdown-item :command="{ type: 'signing', id: scope.row.id }" :disabled="scope.row.rentStatus !== '未激活'">委托签约</el-dropdown-item>
                <el-dropdown-item :command="{ type: 'publish', id: scope.row.id }" :disabled="scope.row.rentStatus !== '未发布'">发布房源</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
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
      tableData: [],
      statusMap: {
        todo: '待处理', // 还未通过申请
        unactivated: '未激活', // 已通过申请但还未签约激活
        activated: '未发布', // 已签订合同激活但未发布房源
        empty: '空闲', // 已发布房源但未被租用
        rented: '已租用', // 已被租用
        invalid: '已失效', // 到期 解除合同
        reject: '已拒绝' // 拒绝委托申请
      },
      queryData: {
        pageNum: 1,
        pageSize: 10,
        totalCount: 0,
        status: []
      }
    }
  },
  created: function () {
    this.getHouseList()
  },
  methods: {
    pass (id) {
      this.$ajax.post('/backend/house/passHouseCommission', {
        id: Number(id.replace(/(^House_*)/g, ''))
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
      this.$ajax.post('/backend/house/rejectHouseCommission', {
        id: Number(id.replace(/(^House_*)/g, ''))
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
    signing (id) {
      this.$router.push({ path: '/Contract/WithOwner', query: { houseId: Number(id.replace(/(^House_*)/g, '')) } })
    },
    publish (id) {
      this.$ajax.get('/backend/contract/getContractIdByHouseId', {
        params: {
          houseId: Number(id.replace(/(^House_*)/g, ''))
        }
      })
        .then(res => {
          if (res.data.success) {
            this.$router.push({ path: '/House/AddHouse', query: { contractId: res.data.msg.table[0].id } })
          }
        })
    },
    handleCommand (cmdItem) {
      switch (cmdItem.type) {
        case 'pass':
          return this.pass(cmdItem.id)
        case 'reject':
          return this.reject(cmdItem.id)
        case 'signing':
          return this.signing(cmdItem.id)
        case 'publish':
          return this.publish(cmdItem.id)
      }
    },
    pageChange (val) {
      this.queryData.pageNum = val
      this.getHouseList()
    },
    search () {
      this.queryData.pageNum = 1
      this.getHouseList()
    },
    objectFlip (object) {
      let map = {}
      Object.keys(object).forEach(key => {
        map[object[key]] = key
      })
      return map
    },
    getHouseList: function () {
      let statusMap = this.objectFlip(this.statusMap)
      this.$ajax.post('/backend/house/getHouseListToTable', {
        pageNum: this.queryData.pageNum,
        pageSize: this.queryData.pageSize,
        status: this.queryData.status.map(item => { return statusMap[item] })
      })
        .then(res => {
          this.queryData.totalCount = res.data.msg.totalCount
          this.tableData = res.data.msg.data.table.map(item => {
            item.id = 'House_' + item.id
            item.userId = 'Owner_' + item.userId
            if (item.adminId === null) {
              item.adminId = ''
            } else {
              item.adminId = 'Admin_' + item.adminId
            }
            item.createdAt = this.$moment(item.createdAt).format('YYYY-MM-DD hh:mm:ss')
            item.buildAt = this.$moment(item.buildAt).format('YYYY-MM-DD')
            item.rentStatus = this.statusMap[item.rentStatus]
            item.toilet = this.convertBoolStatus(item.toilet)
            item.balcony = this.convertBoolStatus(item.balcony)
            item.rentType = this.convertRentType(item.rentType)
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
    convertBoolStatus: function (boolStatus) {
      switch (boolStatus) {
        case true:
          return '已配置'
        case false:
          return '未配置'
      }
    }
  }
}
</script>

<style lang="scss">
  .ApplyForHouseDiv {
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

    .el-pagination {
      margin-top: 20px;
    }
  }
</style>
