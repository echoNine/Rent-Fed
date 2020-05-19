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
    drawHouseChart: function () {
      let myChart = this.$echarts.init(document.getElementById('myContractChart'))
      this.$ajax.get('/backend/data/getContractCountByType')
        .then(res => {
          let monthData = []
          let tenantData = new Array(12).fill(0)
          let ownerData = new Array(12).fill(0)
          for (var i = 0; i < 12; i++) {
            monthData.push(res.data.msg.monthArray[i] + '月')
          }
          for (var j = 0; j < res.data.msg.tenantData.table.length; j++) {
            var tenantIndex = monthData.indexOf(res.data.msg.tenantData.table[j].month + '月')
            tenantData[tenantIndex] = res.data.msg.tenantData.table[j].count
          }
          for (var k = 0; k < res.data.msg.ownerData.table.length; k++) {
            var ownerIndex = monthData.indexOf(res.data.msg.ownerData.table[k].month + '月')
            ownerData[ownerIndex] = res.data.msg.ownerData.table[k].count
          }
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
                data: monthData
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
                data: ownerData
              },
              {
                name: '租户合同',
                type: 'line',
                color: '#b6a2de',
                data: tenantData
              }
            ]
          })
        })
    },
    convertMonth (monthNum) {
      switch (monthNum) {
        case '1':
          return 'Jan'
        case '2':
          return 'Feb'
        case '3':
          return 'Mar'
        case '4':
          return 'Apr'
        case '5':
          return 'May'
        case '6':
          return 'Jun'
        case '7':
          return 'Jul'
        case '8':
          return 'Aug'
        case '9':
          return 'Sep'
        case '10':
          return 'Oct'
        case '11':
          return 'Nov'
        case '12':
          return 'Dec'
      }
    }
  }
}
</script>
