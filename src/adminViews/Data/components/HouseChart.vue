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
      this.$ajax.get('/backend/data/getHouseCountByType')
        .then(res => {
          let chartData = res.data.msg.countArr
          let seriesData = []
          let typekey = ['待发布', '空闲', '已租用']
          for (var i = 0; i < typekey.length; i++) {
            let outObj = {}
            outObj.name = typekey[i]
            outObj.value = chartData[i]
            seriesData.push(outObj)
          }
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
              data: ['待发布', '空闲', '已租用']
            },
            series: [
              {
                name: '房源状态',
                type: 'pie',
                roseType: 'radius',
                radius: [50, 80],
                center: ['50%', '45%'],
                color: ['#2ec7c9', '#b6a2de', '#5ab1ef'],
                data: seriesData,
                animationEasing: 'cubicInOut',
                animationDuration: 2600
              }
            ]
          })
        })
    }
  }
}
</script>
