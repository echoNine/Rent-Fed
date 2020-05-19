<template>
  <div id="myUserChart" :style="{width: '300px', height: '300px'}"></div>
</template>

<script>
export default {
  name: 'UserChart',
  data () {
    return {}
  },
  mounted () {
    this.drawUserChart()
  },
  methods: {
    drawUserChart: function () {
      let myChart = this.$echarts.init(document.getElementById('myUserChart'))
      this.$ajax.get('/backend/data/getUserCountByType')
        .then(res => {
          let chartData = res.data.msg.countArr
          let seriesData = []
          let typekey = ['租户', '房主']
          for (var i = 0; i < typekey.length; i++) {
            let outObj = {}
            outObj.name = typekey[i]
            outObj.value = chartData[i]
            seriesData.push(outObj)
          }
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
                data: seriesData
              }
            ]
          })
        })
    }
  }
}
</script>
