<template>
  <div>
    <data-card/>
    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <finance-chart/>
    </el-row>
    <el-row :gutter="32">
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <user-chart/>
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <house-chart/>
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <contract-chart/>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import DataCard from './components/DataCard'
import FinanceChart from './components/FinanceChart'
import UserChart from './components/UserChart'
import HouseChart from './components/HouseChart'
import ContractChart from './components/ContractChart'

export default {
  name: 'Data',
  inject: ['reload'],
  components: {
    DataCard,
    FinanceChart,
    UserChart,
    HouseChart,
    ContractChart
  }
}
</script>

<style>
  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }

  @media (max-width:1024px) {
    .chart-wrapper {
      padding: 8px;
    }
  }
</style>
