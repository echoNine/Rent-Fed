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
        label="付款金额（元）">
      </el-table-column>
      <el-table-column
        prop="date"
        label="付款日期">
      </el-table-column>
      <el-table-column
        prop="status"
        label="支付状态"
        :filters="[{ text: '已付款', value: '已付款' }, { text: '待付款', value: '待付款' }]"
        :filter-method="filterTag"
        filter-placement="bottom-end">
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.status === '已付款' ? 'primary' : 'success'"
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
      name: 'RentOut',
      tableData: [{
        id: '12987122',
        payType: '季付价',
        amount: '3000',
        date: '2019.06.15',
        status: '已付款'
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
