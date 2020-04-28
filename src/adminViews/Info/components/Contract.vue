<template>
  <div class="block">
    <el-timeline>
      <el-timeline-item v-for="(item,index) of timeline" :key="index" :timestamp="item.startAt" placement="top">
        <el-card>
          <div class="lineFirst">{{ item.username }}——{{ item.houseId}} 房源</div>
          <div class="lineSecond">admin 办理 {{ item.parentNum }} </div>
        </el-card>
      </el-timeline-item>
    </el-timeline>
  </div>
</template>

<script>
export default {
  data () {
    return {
      timeline: [
        {
          startAt: '',
          username: '',
          houseId: '',
          parentNum: ''
        }
      ]
    }
  },
  created: function () {
    this.getContractData()
  },
  methods: {
    getContractData: function () {
      this.$ajax.get('/admin/contractOfAdmin', {
        params: {
          email: sessionStorage.getItem('adminEmail')
        }
      })
        .then(res => {
          console.log(res.data.msg.table)
          this.timeline = res.data.msg.table.map(item => {
            item.startAt = this.$moment(item.startAt).format('YYYY-MM-DD')
            item.houseId = 'H_' + item.houseId
            if (item.parentNum == null) {
              item.parentNum = '签约'
            } else {
              item.parentNum = '续签'
            }
            return item
          })
        })
    }
  }
}
</script>

<style>
  .lineFirst {
    font-weight: 400;
    color: #1f2f3d;
    margin-top: 12px;
    margin-bottom: 18px;
  }

  .lineSecond {
    font-size: 14px;
    color: #5e6d82;
    margin-top: 18px;
    margin-bottom: 12px;
  }
</style>
