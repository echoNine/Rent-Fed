<template>
  <div class="PayDiv">
    <el-card>
      <el-table
        :data="tableData"
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
          prop="userId"
          label="房主编号">
        </el-table-column>
        <el-table-column
          align="center"
          prop="payType"
          label="付款类型">
        </el-table-column>
        <el-table-column
          align="center"
          prop="amount"
          label="付款金额（元）">
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
          label="支付状态">
        </el-table-column>
        <el-table-column align="center"
                         fixed="right"
                         label="操作">
          <template slot-scope="scope">
            <el-button type="primary" @click="handlePay(scope.row.id)" :disabled="scope.row.tranStatus !== '待支付'" size="mini">支付</el-button>
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
  data () {
    return {
      name: 'RentOut',
      tableData: [],
      payFormMap: {
        byMonth: '月收',
        byYear: '年收'
      },
      tranStatusMap: {
        paid: '已付款',
        unpaid: '待支付',
        invalid: '已失效'
      },
      queryData: {
        pageNum: 1,
        pageSize: 15,
        totalCount: 0
      }
    }
  },
  created () {
    this.loadList()
  },
  methods: {
    loadList () {
      this.queryData.pageNum = 1
      this.getPayList()
    },
    getPayList () {
      this.$loading()
      this.$ajax.get('/backend/finance/getFinanceList', {
        params: {
          tranType: 'withOwner',
          pageNum: this.queryData.pageNum,
          pageSize: this.queryData.pageSize
        }
      }).then(res => {
        this.queryData.totalCount = res.data.msg.totalCount
        this.tableData = res.data.msg.data.table.map(item => {
          return {
            id: item.id,
            userId: 'Owner_' + item.userId,
            contractId: 'OC_' + item.contractId,
            payType: this.payFormMap[item.payForm],
            amount: item.account,
            endDate: this.$moment(item.endDate ? item.endDate : item.startDate).format('YYYY-MM-DD'),
            tranDate: item.tranDate ? this.$moment(item.tranDate).format('YYYY-MM-DD') : '--',
            tranStatus: this.tranStatusMap[item.tranStatus]
          }
        })
      }).finally(() => {
        this.$loading().close()
      })
    },
    pageChange (val) {
      this.queryData.pageNum = val
      this.getPayList()
    },
    handlePay (id) {
      this.$ajax.post('/backend/finance/changePayStatus', {
        id: id,
        currentTime: this.$moment(new Date()).format('YYYY-MM-DD')
      })
        .then(res => {
          this.loadList()
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
        })
    }
  }
}
</script>

<style lang="scss">
  .PayDiv {
    width: 100%;
    height: 100%;
    .el-pagination {
      margin-top: 20px;
    }
  }
</style>
