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
            data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            axisPointer: {
              type: 'shadow'
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '金额（￥）',
            min: 0,
            max: 250,
            interval: 50,
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
            data: [2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3]
          },
          {
            name: '房租收入',
            type: 'bar',
            color: '#b6a2de',
            data: [2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3]
          },
          {
            name: '收益',
            type: 'line',
            color: '#ffb980',
            data: [2.0, 2.2, 3.3, 4.5, 6.3, 10.2, 20.3, 23.4, 23.0, 16.5, 12.0, 6.2]
          }
        ]
      })
    }
  }
}
</script>
