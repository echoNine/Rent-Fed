<template>
  <div class="UserPersonSpaceDiv">
    <div class="space-content">
      <div class="collect" v-show="isCollect">
        <h3 class="collect-house">收藏房源</h3>
        <el-table
          :data="collectData"
          max-height="550"
          stripe
          border>
          <el-table-column align="center"  label="房源信息" width="280px">
            <template slot-scope="item">
              <el-row>
                <el-col :span="10">
                  <img :src="getUrl(item.row.cover)" width="100px">
                </el-col>
                <el-col :span="14">
                  <el-row>{{item.row.community}}</el-row>
                  <el-row>{{item.row.floor}}层 | {{item.row.area}}㎡ | {{item.row.rentType}}</el-row>
                </el-col>
              </el-row>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="rentPrice"
            label="价格">
          </el-table-column>
          <el-table-column
            align="center"
            prop="rentStatus"
            label="状态">
          </el-table-column>
          <el-table-column
            align="center"
            prop="createdAt"
            label="收藏时间">
          </el-table-column>
          <el-table-column
            align="center"
            prop="addCount"
            label="收藏热度">
          </el-table-column>
          <el-table-column align="center" label="操作" width="180px">
            <template slot-scope="scope">
              <el-button plain
                         size="mini"
                         type="warning"
                         @click="goDetail(scope.row.houseId)">详情
              </el-button>
              <el-button plain
                         size="mini"
                         type="warning"
                         @click="removeCollect(scope.row.houseId)">取消
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div class="order" v-show="isOrder">
        <h3 class="order-house">约看订单</h3>
        <el-table
          :data="orderData"
          max-height="550"
          stripe
          border>
          <el-table-column align="center" prop="id" label="约看单号"/>
          <el-table-column align="center" prop="houseId" label="房源编号"/>
          <el-table-column align="center" prop="community" label="小区名称"/>
          <el-table-column align="center" prop="name" label="负责人">
            <template slot-scope="scope">
              <el-popover trigger="hover" placement="top">
                <p>电话: {{ scope.row.phone }}</p>
                <div slot="reference" class="name-wrapper">
                  <el-tag type="warning" size="medium">{{ scope.row.name }}</el-tag>
                </div>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="orderTime" label="约看时间"/>
          <el-table-column align="center" prop="orderStatus" label="约看状态"/>
          <el-table-column align="center" label="操作" width="180px">
            <template slot-scope="scope">
              <el-button plain size="mini" type="warning" @click="goDetail(scope.row.houseId)">详情</el-button>
              <el-button plain size="mini" type="warning" v-show="scope.row.orderStatus === '待处理'" @click="removeOrder(scope.row)">取消</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div class="contract" style="margin-top: 3%" v-show="isContract">
        <el-tabs type="border-card">
          <el-tab-pane label="租赁记录">
            <el-table
              :data="contractForTenantData"
              max-height="360"
              stripe
              border>
              <el-table-column align="center" prop="id" label="合同编号"/>
              <el-table-column align="center" prop="houseId" label="房源编号"/>
              <el-table-column align="center" prop="community" label="房源小区"/>
              <el-table-column align="center" prop="startAt" label="签约日期"/>
              <el-table-column align="center" prop="endAt" label="到期时间"/>
              <el-table-column align="center" prop="contractStatus" label="合同状态"/>
              <el-table-column align="center" prop="isDisabled" label="操作" width="160px">
                <template slot-scope="scope">
                  <el-button :disabled="scope.row.contractStatus !=='已到期'" plain size="mini" type="warning" @click="renewalTenant(scope.row)">申请续签</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="委托记录">
            <el-table
              :data="contractForOwnerData"
              max-height="360"
              stripe
              border>
              <el-table-column align="center" prop="id" label="合同编号"/>
              <el-table-column align="center" prop="houseId" label="房源编号"/>
              <el-table-column align="center" prop="community" label="房源小区"/>
              <el-table-column align="center" prop="startAt" label="签约日期"/>
              <el-table-column align="center" prop="endAt" label="到期时间"/>
              <el-table-column align="center" prop="contractStatus" label="合同状态"/>
              <el-table-column align="center" prop="isDisabled" label="操作" width="160px">
                <template slot-scope="scope">
                  <el-button :disabled="scope.row.contractStatus !=='已到期'" plain size="mini" type="warning" @click="renewalOwner(scope.row)">申请续签</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
        </div>

      <div class="finance" style="margin-top: 3%" v-show="isFinance">
        <el-tabs type="border-card">
          <el-tab-pane label="交租记录">
            <el-input class="search-input" placeholder="请输入合同编号" v-model="tenantInput" @clear="handleClear" clearable>
              <el-button slot="append" icon="el-icon-search" @click="searchTenantFinance"></el-button>
            </el-input>
            <el-table
              :data="payData"
              max-height="360"
              border
              stripe>
              <el-table-column
                align="center"
                prop="id"
                label="交易编号">
              </el-table-column>
              <el-table-column
                align="center"
                prop="contractId"
                label="合同编号">
              </el-table-column>
              <el-table-column
                align="center"
                prop="payType"
                label="付款类型">
              </el-table-column>
              <el-table-column
                align="center"
                prop="amount"
                label="付款金额">
              </el-table-column>
              <el-table-column
                align="center"
                prop="endDate"
                label="最迟付款日期">
              </el-table-column>
              <el-table-column
                align="center"
                prop="tranDate"
                label="实付日期">
              </el-table-column>
              <el-table-column
                align="center"
                prop="tranStatus"
                label="付款状态">
              </el-table-column>
              <el-table-column align="center"
                               fixed="right"
                               label="操作">
                <template slot-scope="scope">
                  <el-button type="warning" @click="handlePay(scope.row.id)" :disabled="scope.row.tranStatus !== '待支付'" size="mini">支付</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="收租记录">
            <el-input class="search-input" placeholder="请输入合同编号" v-model="ownerInput" @clear="handleClear" clearable>
              <el-button slot="append" icon="el-icon-search" @click="searchOwnerFinance"></el-button>
            </el-input>
            <el-table
              :data="incomeData"
              max-height="360"
              border
              stripe>
              <el-table-column
                align="center"
                prop="id"
                label="交易编号">
              </el-table-column>
              <el-table-column
                align="center"
                prop="contractId"
                label="合同编号">
              </el-table-column>
              <el-table-column
                align="center"
                prop="incomeType"
                label="收款类型">
              </el-table-column>
              <el-table-column
                align="center"
                prop="amount"
                label="收款金额">
              </el-table-column>
              <el-table-column
                align="center"
                prop="endDate"
                label="最迟收款日期">
              </el-table-column>
              <el-table-column
                align="center"
                prop="tranDate"
                label="实收日期">
              </el-table-column>
              <el-table-column
                align="center"
                prop="tranStatus"
                label="收款状态">
              </el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
    </div>
    </div>
  </div>
</template>

<script>
import Bus from '../../../assets/js/bus.js'
export default {
  name: 'PersonalSpace',
  inject: ['reload'],
  data () {
    return {
      uploadUrl: process.env.VUE_APP_BASE_URL + '/file/upload',
      collectData: [],
      orderData: [],
      contractForOwnerData: [],
      contractForTenantData: [],
      isCollect: true,
      isOrder: false,
      isContract: false,
      isFinance: false,
      isPay: false,
      tenantInput: '',
      ownerInput: '',
      payData: [],
      incomeData: [],
      payFormMap: {
        byMonth: '月付',
        byYear: '年付'
      },
      payStatusMap: {
        paid: '已付款',
        unpaid: '待支付',
        invalid: '已失效'
      },
      incomeFormMap: {
        byMonth: '月收',
        byYear: '年收'
      },
      incomeStatusMap: {
        paid: '已到账',
        unpaid: '未到账',
        invalid: '已失效'
      },
      queryData: {
        pageNum: 1,
        pageSize: 100,
        totalCount: 0,
        ownerContractId: '',
        tenantContractId: ''
      }
    }
  },
  created () {
    this.getCollectData()
    this.getOrderData()
    this.getOwnerContractData()
    this.getTenantContractData()
    this.getPayData()
    this.getIncomeData()
  },
  mounted () {
    Bus.$on('isActive', this.dealBusData)
  },

  beforeDestroy: function () {
    Bus.$off('isActive', this.dealBusData)
  },
  methods: {
    searchOwnerFinance: function () {
      this.queryData.pageNum = 1
      this.getIncomeData()
    },
    searchTenantFinance: function () {
      this.queryData.pageNum = 1
      this.getPayData()
    },
    getUrl (img) {
      if (img) {
        return process.env.VUE_APP_RESOURCE_URL + img
      } else {
        return require('@/assets/imgs/defaultHead.png')
      }
    },
    dealBusData: function (val) {
      switch (val) {
        case 1: {
          this.isCollect = true
          this.isOrder = false
          this.isContract = false
          this.isFinance = false
          break
        }
        case 2: {
          this.isCollect = false
          this.isOrder = true
          this.isContract = false
          this.isFinance = false
          break
        }
        case 3: {
          this.isCollect = false
          this.isOrder = false
          this.isContract = true
          this.isFinance = false
          break
        }
        case 4: {
          this.isCollect = false
          this.isOrder = false
          this.isContract = false
          this.isFinance = true
          break
        }
      }
    },
    getCollectData: function () {
      this.$ajax.get('/frontend/house/getCollectList')
        .then(res => {
          let addNumMap = {}
          res.data.msg.addNum.table.forEach(numItem => {
            addNumMap[numItem.houseId] = numItem.count
          })
          let objects = []
          res.data.msg.self.table.forEach(item => {
            let temp = item
            temp['addCount'] = addNumMap[item.houseId]
            temp.houseId = 'House_' + item.houseId
            temp.rentType = this.convertRentType(temp.rentType)
            temp.rentStatus = this.convertRentStatus(temp.rentStatus)
            temp.rentPrice = '￥' + temp.rentPrice + '/月'
            temp.createdAt = this.$moment(temp.createdAt).format('YYYY-MM-DD')
            objects.push(temp)
          })
          this.collectData = objects
        })
    },
    goDetail: function (id) {
      this.$router.push({ path: '/HouseDetail', query: { houseId: Number(id.replace(/(^House_*)/g, '')) } })
    },
    removeCollect: function (id) {
      this.$ajax.post('/frontend/house/removeCollect', {
        houseId: Number(id.replace(/(^House_*)/g, ''))
      })
        .then(res => {
          if (res.data.success) {
            this.$message.success({
              message: '已取消收藏！'
            })
            this.reload()
          }
        })
    },
    getOrderData: function () {
      this.$ajax.get('/frontend/house/getOrderList')
        .then(res => {
          this.orderData = res.data.msg.table.map(item => {
            item.id = 'OS_' + item.id
            item.houseId = 'House_' + item.houseId
            item.orderTime = this.$moment(item.orderTime).format('YYYY-MM-DD')
            item.orderStatus = this.convertOrderStatus(item.orderStatus)
            return item
          })
        })
    },
    removeOrder: function (row) {
      this.$ajax.post('/frontend/house/removeOrder', {
        houseId: Number(row.houseId.replace(/(^House_*)/g, ''))
      })
        .then(res => {
          if (res.data.success) {
            this.$message.success({
              message: '已取消约看！'
            })
            this.reload()
          }
        })
    },
    getOwnerContractData: function () {
      this.$ajax.get('/frontend/contract/getContractList', {
        params: {
          type: 'withOwner'
        }
      })
        .then(res => {
          this.contractForOwnerData = res.data.msg.table.map(item => {
            item.id = 'OC_' + item.id
            item.houseId = 'House_' + item.houseId
            item.contractStatus = this.convertContractStatus(item.contractStatus)
            item.startAt = this.$moment(item.startAt).format('YYYY-MM-DD')
            item.endAt = this.$moment(item.endAt).format('YYYY-MM-DD')
            return item
          })
        })
    },
    getTenantContractData: function () {
      this.$ajax.get('/frontend/contract/getContractList', {
        params: {
          type: 'withTenant'
        }
      })
        .then(res => {
          this.contractForTenantData = res.data.msg.table.map(item => {
            item.id = 'TC_' + item.id
            item.houseId = 'House_' + item.houseId
            item.contractStatus = this.convertContractStatus(item.contractStatus)
            item.startAt = this.$moment(item.startAt).format('YYYY-MM-DD')
            item.endAt = this.$moment(item.endAt).format('YYYY-MM-DD')
            return item
          })
        })
    },
    renewalTenant: function (row) {
      this.$ajax.get('/frontend/contract/checkRenewal', {
        params: {
          contractId: Number(row.id.replace(/(^TC_*)/g, ''))
        }
      })
        .then(res => {
          if (res.data) {
            this.$ajax.post('/frontend/contract/applyRenewal', {
              contractId: Number(row.id.replace(/(^TC_*)/g, '')),
              houseId: Number(row.houseId.replace(/(^House_*)/g, '')),
              type: 'withTenant'
            })
              .then(res => {
                if (res.data.success) {
                  this.$message.success({
                    message: '已申请续约！'
                  })
                }
              })
          } else {
            this.$message.warning({
              message: '您已提交续约申请，但目前暂未处理，请稍等！'
            })
          }
        })
    },
    renewalOwner: function (row) {
      this.$ajax.get('/frontend/contract/checkRenewal', {
        params: {
          contractId: Number(row.id.replace(/(^OC_*)/g, ''))
        }
      })
        .then(res => {
          if (res.data) {
            this.$ajax.post('/frontend/contract/applyRenewal', {
              contractId: Number(row.id.replace(/(^OC_*)/g, '')),
              houseId: Number(row.houseId.replace(/(^House_*)/g, '')),
              type: 'withOwner'
            })
              .then(res => {
                if (res.data.success) {
                  this.$message.success({
                    message: '已申请续约！'
                  })
                }
              })
          } else {
            this.$message.warning({
              message: '您已提交续约申请，但目前暂未处理，请稍等！'
            })
          }
        })
    },
    getPayData () {
      if (this.tenantInput) {
        this.queryData.tenantContractId = Number(this.tenantInput.replace(/(^TC_*)/g, ''))
      } else {
        this.queryData.tenantContractId = ''
      }
      this.$ajax.get('/frontend/finance/getFinanceList', {
        params: {
          tranType: 'withTenant',
          contractId: this.queryData.tenantContractId,
          pageNum: this.queryData.pageNum,
          pageSize: this.queryData.pageSize
        }
      }).then(res => {
        this.queryData.totalCount = res.data.msg.totalCount
        this.payData = res.data.msg.data.table.map(item => {
          return {
            id: item.id,
            contractId: 'TC_' + item.contractId,
            payType: this.payFormMap[item.payForm],
            amount: item.account,
            endDate: this.$moment(item.endDate ? item.endDate : item.startDate).format('YYYY-MM-DD'),
            tranDate: item.tranDate ? this.$moment(item.tranDate).format('YYYY-MM-DD') : '--',
            tranStatus: this.payStatusMap[item.tranStatus]
          }
        })
      }).finally(() => {
        this.$loading().close()
      })
    },
    getIncomeData () {
      if (this.ownerInput) {
        this.queryData.ownerContractId = Number(this.ownerInput.replace(/(^OC_*)/g, ''))
      } else {
        this.queryData.ownerContractId = ''
      }
      this.$ajax.get('/frontend/finance/getFinanceList', {
        params: {
          tranType: 'withOwner',
          contractId: this.queryData.ownerContractId,
          pageNum: this.queryData.pageNum,
          pageSize: this.queryData.pageSize
        }
      }).then(res => {
        this.countArray = res.data.msg.countArray
        this.queryData.totalCount = res.data.msg.totalCount
        this.incomeData = res.data.msg.data.table.map(item => {
          return {
            id: item.id,
            contractId: 'OC_' + item.contractId,
            incomeType: this.incomeFormMap[item.payForm],
            amount: item.account,
            endDate: this.$moment(item.endDate ? item.endDate : item.startDate).format('YYYY-MM-DD'),
            tranDate: item.tranDate ? this.$moment(item.tranDate).format('YYYY-MM-DD') : '--',
            tranStatus: this.incomeStatusMap[item.tranStatus]
          }
        })
      }).finally(() => {
        this.$loading().close()
      })
    },
    handleClear () {
      this.ownerInput = ''
      this.tenantInput = ''
      this.queryData.pageNum = 1
      this.getPayData()
      this.getIncomeData()
    },
    handlePay (id) {
      this.$ajax.post('/frontend/finance/changePayStatus', {
        id: id,
        currentTime: this.$moment(new Date()).format('YYYY-MM-DD')
      })
        .then(res => {
          if (res.data.success) {
            this.$message.success({
              duration: 2000,
              message: '支付成功！'
            })
          } else {
            this.$message.error({
              duration: 2000,
              message: '支付失败..'
            })
          }
          this.getPayData()
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
    convertRentType (rentType) {
      switch (rentType) {
        case 'wholeRented':
          return '整租'
        case 'cotenancy':
          return '合租'
      }
    },
    convertRentStatus (rentStatus) {
      switch (rentStatus) {
        case 'empty':
          return '空闲'
        case 'rented':
          return '已租用'
        case 'invalid':
          return '已失效'
      }
    },
    convertContractStatus (contractStatus) {
      switch (contractStatus) {
        case 'fallDue':
          return '已到期'
        case 'undue':
          return '未到期'
        case 'invalid':
          return '已失效'
      }
    }
  }
}
</script>

<style lang="scss">
  .UserPersonSpaceDiv {
    width: 100%;
    height: 100%;
    .space-content {
      padding: 0 40px;
      background-color: white;
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
      border: 1px solid #EBEEF5;
      height: 570px;
      border-radius: 5px;
    }

    .collect, .order, .contract, .finance {
      width: 100%;
    }
    .collect-house, .order-house {
      font-size: 25px;
      font-weight: 400;
      color: #666;
    }

    .el-tabs__item {
      font-size: 15px;
    }

    .el-tabs--border-card > .el-tabs__header {
      background-color: #faf8f3;
    }

    .el-tabs--border-card>.el-tabs__header .el-tabs__item.is-active {
      color: #ff961e;
      height: 55px;
      line-height: 55px;
    }

    .el-tabs--border-card > .el-tabs__header .el-tabs__item:not(.is-disabled):hover {
      color: #ff961e;
    }

    .el-radio__input.is-checked .el-radio__inner {
      border-color: #ff961e;
      background: #ff961e;
    }

    .el-radio__input.is-checked + .el-radio__label {
      color: #ff961e;
    }

    .el-cascader-node.in-active-path, .el-cascader-node.is-active, .el-cascader-node.is-selectable.in-checked-path {
      color: #ff961e;
    }

    .search-input {
      width: 60%;
      margin-top: 10px;
      margin-bottom: 25px;
    }
  }

</style>
