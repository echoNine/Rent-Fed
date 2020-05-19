<template>
  <el-row class="panel-group">
    <el-col :span="6" class="card-panel-col">
      <div class="card-panel">
        <div class="card-panel-icon-wrapper icon-people">
          <i class="el-icon-people" style="font-size: 45px"></i>
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            用户
          </div>
          <count-to :start-val="0" :end-val='userCount' :duration="2000" class="card-panel-num" />
        </div>
      </div>
    </el-col>
    <el-col :span="6" class="card-panel-col">
      <div class="card-panel">
        <div class="card-panel-icon-wrapper icon-house">
          <i class="el-icon-house" style="font-size: 45px"></i>
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            房源
          </div>
          <count-to :start-val="0" :end-val='houseCount' :duration="3000" class="card-panel-num" />
        </div>
      </div>
    </el-col>
    <el-col :span="6" class="card-panel-col">
      <div class="card-panel">
        <div class="card-panel-icon-wrapper icon-contract">
          <i class="el-icon-contract" style="font-size: 45px"></i>
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            合同
          </div>
          <count-to :start-val="0" :end-val="contractCount" :duration="3200" class="card-panel-num" />
        </div>
      </div>
    </el-col>
    <el-col :span="6" class="card-panel-col">
      <div class="card-panel">
        <div class="card-panel-icon-wrapper icon-money">
          <i class="el-icon-money" style="font-size: 45px"></i>
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            交易额
          </div>
          <count-to :start-val="0" :end-val="financeCount" :duration="3600" class="card-panel-num" />
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import CountTo from 'vue-count-to'

export default {
  name: 'DataCard',
  data () {
    return {
      userCount: 0,
      houseCount: 0,
      contractCount: 0,
      financeCount: 0
    }
  },
  components: {
    CountTo
  },
  created () {
    this.getUserCount()
    this.getHouseCount()
    this.getContractCount()
    this.getFinanceCount()
  },
  methods: {
    getUserCount () {
      this.$ajax.get('/backend/data/getUserCount')
        .then(res => {
          this.userCount = res.data.msg
        })
    },
    getHouseCount () {
      this.$ajax.get('/backend/data/getHouseCount')
        .then(res => {
          this.houseCount = res.data.msg
        })
    },
    getContractCount () {
      this.$ajax.get('/backend/data/getContractCount')
        .then(res => {
          this.contractCount = res.data.msg
        })
    },
    getFinanceCount () {
      this.$ajax.get('/backend/data/getFinanceCount')
        .then(res => {
          this.financeCount = res.data.msg
        })
    }
  }
}
</script>

<style lang="scss" scoped>
  .panel-group {
    margin-top: 18px;

    .card-panel-col {
      margin-bottom: 32px;
    }

    .card-panel {
      height: 108px;
      cursor: pointer;
      font-size: 12px;
      position: relative;
      overflow: hidden;
      color: #666;
      background: #fff;
      box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
      border-color: rgba(0, 0, 0, 0.05);
      margin: 0 20px;
      border-radius: 8px;

      &:hover {
        .card-panel-icon-wrapper {
          color: #fff;
        }

        .icon-people {
          background: #ffc535
        }

        .icon-house {
          background: #36a3f7
        }

        .icon-contract {
          background: #34bfa3
        }

        .icon-money {
          background: #f4516c
        }
      }

      .icon-people {
        color: #ffc535
      }

      .icon-house {
        color: #36a3f7
      }

      .icon-contract {
        color: #34bfa3
      }

      .icon-money {
        color: #f4516c
      }

      .card-panel-icon-wrapper {
        float: left;
        margin: 14px 0 0 14px;
        padding: 16px;
        transition: all 0.38s ease-out;
        border-radius: 6px;
      }

      .card-panel-icon {
        float: left;
        font-size: 48px;
      }

      .card-panel-description {
        float: right;
        font-weight: bold;
        margin: 26px;
        margin-left: 0px;

        .card-panel-text {
          line-height: 18px;
          color: rgba(0, 0, 0, 0.45);
          font-size: 16px;
          margin-bottom: 12px;
        }

        .card-panel-num {
          font-size: 20px;
        }
      }
    }
  }

  @media (max-width:550px) {
    .card-panel-description {
      display: none;
    }

    .card-panel-icon-wrapper {
      float: none !important;
      width: 100%;
      height: 100%;
      margin: 0 !important;

      .svg-icon {
        display: block;
        margin: 14px auto !important;
        float: none !important;
      }
    }
  }
</style>
