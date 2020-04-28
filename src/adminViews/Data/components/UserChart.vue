<template>
  <div id="myUserChart" :style="{width: '300px', height: '300px'}"></div>
</template>

<script>
export default {
  name: 'UserChart',
  mounted () {
    this.drawUserChart()
  },
  methods: {
    drawUserChart () {
      let myChart = this.$echarts.init(document.getElementById('myUserChart'))
      myChart.setOption({
        title: {
          text: '用户类型占比',
          left: 'center',
          top: '5'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          left: 10,
          bottom: 10,
          data: ['房主', '租户']
        },
        series: [
          {
            name: '用户数量',
            type: 'pie',
            radius: [60, 90],
            center: ['50%', '48%'],
            color: ['#5ab1ef', '#b6a2de'],
            avoidLabelOverlap: false,
            label: {
              normal: {
                show: false,
                position: 'center'
              },
              emphasis: {
                show: true,
                textStyle: {
                  fontSize: '20'
                }
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            data: [
              { value: 335, name: '房主' },
              { value: 310, name: '租户' }
            ]
          }
        ]
      })
    }
  }
}
</script>
