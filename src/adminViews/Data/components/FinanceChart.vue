<template>
  <div id="myFinanceChart" :style="{width: '100%', height: '400px'}"></div>
</template>

<script>
export default {
  name: 'FinanceChart',
  mounted () {
    this.drawFinanceChart()
  },
  methods: {
    drawFinanceChart: function () {
      let myChart = this.$echarts.init(document.getElementById('myFinanceChart'))
      this.$ajax.get('/backend/data/getFinanceCountByType')
        .then(res => {
          let monthData = []
          let payData = new Array(12).fill(0)
          let incomeData = new Array(12).fill(0)
          let profitData = []
          for (var i = 0; i < 12; i++) {
            monthData.push(res.data.msg.monthArray[i] + '月')
          }
          for (var j = 0; j < res.data.msg.payData.table.length; j++) {
            var payIndex = monthData.indexOf(res.data.msg.payData.table[j].month + '月')
            payData[payIndex] = res.data.msg.payData.table[j].account
          }
          for (var k = 0; k < res.data.msg.incomeData.table.length; k++) {
            var incomeIndex = monthData.indexOf(res.data.msg.incomeData.table[k].month + '月')
            incomeData[incomeIndex] = res.data.msg.incomeData.table[k].account
          }
          for (var n = 0; n < 12; n++) {
            profitData[n] = incomeData[n] - payData[n]
          }
          myChart.setOption({
            title: {
              text: '交易额汇总',
              left: 'center',
              top: '10'
            },
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                type: 'cross',
                crossStyle: {
                  color: '#999'
                }
              }
            },
            toolbox: {
              feature: {
                dataView: { show: true, readOnly: false },
                magicType: { show: true, type: ['line', 'bar'] },
                restore: { show: true },
                saveAsImage: { show: true }
              }
            },
            legend: {
              left: 'center',
              bottom: '15',
              data: ['招租支出', '房租收入', '收益']
            },
            grid: {
              left: '4%',
              right: '6%',
              bottom: '13%',
              containLabel: true
            },
            xAxis: [
              {
                type: 'category',
                data: monthData,
                axisPointer: {
                  type: 'shadow'
                }
              }
            ],
            yAxis: [
              {
                type: 'value',
                name: '金额（￥）',
                interval: 50000,
                axisLabel: {
                  formatter: '{value}'
                }
              }
            ],
            series: [
              {
                name: '招租支出',
                type: 'bar',
                color: '#5ab1ef',
                data: payData
              },
              {
                name: '房租收入',
                type: 'bar',
                color: '#b6a2de',
                data: incomeData
              },
              {
                name: '收益',
                type: 'line',
                color: '#ffb980',
                data: profitData
              }
            ]
          })
        })
    }
  }
}
</script>
