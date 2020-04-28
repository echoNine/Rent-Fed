<template>
  <div id="myContractChart" :style="{width: '300px', height: '300px'}"></div>
</template>

<script>
export default {
  name: 'ContractChart',
  mounted () {
    this.drawHouseChart()
  },
  methods: {
    drawHouseChart () {
      let myChart = this.$echarts.init(document.getElementById('myContractChart'))
      myChart.setOption({
        title: {
          text: '合同签订数量',
          left: 'center',
          top: '5'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: {
          left: 'center',
          bottom: '10',
          data: ['房主合同', '租户合同']
        },
        grid: {
          left: '0',
          right: '5%',
          bottom: '15%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: '房主合同',
            type: 'line',
            color: '#5ab1ef',
            data: [320, 332, 301, 334, 390, 330, 320, 132, 101, 134, 90, 230]
          },
          {
            name: '租户合同',
            type: 'line',
            color: '#b6a2de',
            data: [120, 132, 101, 134, 90, 230, 210, 332, 301, 334, 390, 330]
          }
        ]
      })
    }
  }
}
</script>
