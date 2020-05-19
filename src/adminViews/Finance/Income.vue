<template>
  <div class="IncomeDiv">
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
          label="租户编号">
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
          label="付款状态">
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
      name: 'RentIn',
      tableData: [],
      payFormMap: {
        byMonth: '月收',
        byYear: '年收'
      },
      tranStatusMap: {
        paid: '已到账',
        unpaid: '未到账',
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
      this.getIncomeList()
    },
    getIncomeList () {
      this.$ajax.get('/backend/finance/getFinanceList', {
        params: {
          tranType: 'withTenant',
          pageNum: this.queryData.pageNum,
          pageSize: this.queryData.pageSize
        }
      }).then(res => {
        this.queryData.totalCount = res.data.msg.totalCount
        this.tableData = res.data.msg.data.table.map(item => {
          return {
            id: item.id,
            userId: 'Tenant_' + item.userId,
            contractId: 'TC_' + item.contractId,
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
      this.getIncomeList()
    }
  }
}
</script>

<style lang="scss">
  .IncomeDiv {
    width: 100%;
    height: 100%;
    .el-pagination {
      margin-top: 20px;
    }
  }
</style>
