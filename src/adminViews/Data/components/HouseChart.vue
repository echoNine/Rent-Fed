<template>
  <div id="myHouseChart" :style="{width: '300px', height: '300px'}"></div>
</template>

<script>
export default {
  name: 'HouseChart',
  mounted () {
    this.drawHouseChart()
  },
  methods: {
    drawHouseChart () {
      let myChart = this.$echarts.init(document.getElementById('myHouseChart'))
      myChart.setOption({
        title: {
          text: '房源状态分布',
          left: 'center',
          top: '5'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          left: 'center',
          bottom: '10',
          data: ['未激活', '空闲', '已租用']
        },
        series: [
          {
            name: '房源状态',
            type: 'pie',
            roseType: 'radius',
            radius: [28, 80],
            center: ['50%', '45%'],
            color: ['#2ec7c9', '#b6a2de', '#5ab1ef'],
            data: [
              { value: 320, name: '未激活' },
              { value: 250, name: '空闲' },
              { value: 290, name: '已租用' }
            ],
            animationEasing: 'cubicInOut',
            animationDuration: 2600
          }
        ]
      })
    }
  }
}
</script>
