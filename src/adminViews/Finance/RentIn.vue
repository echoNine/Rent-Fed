<template>
  <el-card>
    <el-table
      :data="tableData"
      :span-method="objectSpanMethod"
      border
      stripe>
      <el-table-column
        prop="id"
        label="合同编号">
      </el-table-column>
      <el-table-column
        prop="payType"
        label="支付类型">
      </el-table-column>
      <el-table-column
        prop="amount"
        label="收款金额（元）">
      </el-table-column>
      <el-table-column
        prop="date"
        label="收款日期">
      </el-table-column>
      <el-table-column
        prop="status"
        label="支付状态"
        :filters="[{ text: '已收款', value: '已收款' }, { text: '待收款', value: '待收款' }]"
        :filter-method="filterTag"
        filter-placement="bottom-end">
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.status === '已收款' ? 'primary' : 'success'"
            disable-transitions>{{scope.row.status}}</el-tag>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script>
export default {
  data () {
    return {
      name: 'RentIn',
      tableData: [{
        id: '12987122',
        payType: '季收价',
        amount: '3000',
        date: '2019.06.15',
        status: '已收款'
      }]
    }
  },
  methods: {
    objectSpanMethod ({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0 || columnIndex === 1) {
        if (rowIndex % 2 === 0) {
          return {
            rowspan: 2,
            colspan: 1
          }
        } else {
          return {
            rowspan: 0,
            colspan: 0
          }
        }
      }
    }
  }
}
</script>
