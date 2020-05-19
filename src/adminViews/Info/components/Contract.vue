<template>
  <div class="ContractDiv">
    <div class="block">
      <el-timeline>
        <el-timeline-item v-for="(item,index) of timeline" :key="index" :timestamp="item.startAt" placement="top">
          <el-card>
            <div class="lineFirst">{{ item.name }}——{{ item.houseId}} {{item.community}}</div>
            <div class="lineSecond">admin 办理——{{item.type}} （{{ item.parentNum }}）</div>
          </el-card>
        </el-timeline-item>
      </el-timeline>
    </div>
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
      this.$ajax.get('/backend/contract/getContractListOfAdmin')
        .then(res => {
          this.timeline = res.data.msg.table.map(item => {
            item.houseId = 'House_' + item.houseId
            item.type = this.convertUserType(item.type)
            if (item.parentNum == null) {
              item.parentNum = '签约'
            } else {
              item.parentNum = '续签'
            }
            return item
          })
        })
    },
    convertUserType (userType) {
      switch (userType) {
        case 'withOwner':
          return '房主委托'
        case 'withTenant':
          return '租户租房'
      }
    }
  }
}
</script>

<style lang="scss">
  .ContractDiv{
    width: 100%;
    height: 100%;
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
  }
</style>
