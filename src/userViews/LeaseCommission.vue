<template>
  <div class="LeaseCommissionDiv">
    <el-container>
      <el-header>
        <el-row class="headerOwner">
          <el-col :span="10">
            <logo></logo>
          </el-col>
          <el-col :span="6">
            <header-label :active-index="2"></header-label>
          </el-col>
          <el-col :span="4" style="line-height: 60px">
            <el-button type="warning" @click="dialogFormVisible = true">立即申请</el-button>
            <el-dialog title="委托房源" :visible.sync="dialogFormVisible" width="60%">
              <el-form :model="entrustForm" ref="entrustForm">
                <el-row :gutter="30">
                  <el-col :span="12">
                    <el-form-item label="房屋城市：" :label-width="formLabelWidth" prop="atCity" required>
                      <el-select v-model="entrustForm.atCity" clearable>
                        <el-option v-for="(item, index) in cityList" :key="index" :label="item" :value="item"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="小区名称：" :label-width="formLabelWidth" prop="community" required>
                      <el-input v-model="entrustForm.community" clearable></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="30">
                  <el-col :span="12">
                    <el-form-item label="详细地址：" :label-width="formLabelWidth" prop="address" required>
                      <el-input v-model="entrustForm.address" clearable></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="所在楼层：" :label-width="formLabelWidth" prop="floor" required>
                      <el-input v-model="entrustForm.floor" clearable></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="30">
                  <el-col :span="12">
                    <el-form-item label="房屋户型：" :label-width="formLabelWidth" prop="layout" required>
                      <el-input v-model="entrustForm.layout" clearable></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="房屋朝向：" :label-width="formLabelWidth" prop="orientation" required>
                      <el-select v-model="entrustForm.orientation" placeholder="请选择房源朝向">
                        <el-option label="朝南" value="朝南"></el-option>
                        <el-option label="朝北" value="朝北"></el-option>
                        <el-option label="朝东" value="朝东"></el-option>
                        <el-option label="朝西" value="朝西"></el-option>
                        <el-option label="东南朝向" value="东南朝向"></el-option>
                        <el-option label="西南朝向" value="西南朝向"></el-option>
                        <el-option label="东北朝向" value="东北朝向"></el-option>
                        <el-option label="西北朝向" value="西北朝向"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="30">
                  <el-col :span="12">
                    <el-form-item label="使用面积：" :label-width="formLabelWidth" prop="area" required>
                      <el-input v-model="entrustForm.area" clearable></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="建筑年份：" :label-width="formLabelWidth" prop="buildAt" required>
                      <el-date-picker type="date" placeholder="选择日期" v-model="entrustForm.buildAt"/>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="30">
                  <el-col :span="12">
                    <el-form-item label="门牌号码：" :label-width="formLabelWidth" prop="houseNum" required>
                      <el-input v-model="entrustForm.houseNum" clearable></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="房间号码：" :label-width="formLabelWidth" prop="roomNum">
                      <el-input v-model="entrustForm.roomNum" clearable></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="30">
                  <el-col :span="12">
                    <el-form-item label="配置独卫：" :label-width="formLabelWidth" prop="toilet" required>
                      <el-switch v-model="entrustForm.toilet"></el-switch>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="配置阳台：" :label-width="formLabelWidth" prop="balcony" required>
                      <el-switch v-model="entrustForm.balcony"></el-switch>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-form-item label="租用类型：" :label-width="formLabelWidth" prop="rentType" required>
                    <el-radio-group v-model="entrustForm.rentType">
                      <el-radio label="整租"></el-radio>
                      <el-radio label="合租"></el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-row>
              </el-form>
              <div slot="footer" class="dialog-footer">
                <el-button type="warning" @click="submitEntrust">提交申请</el-button>
              </div>
            </el-dialog>
          </el-col>
          <el-col :span="4">
            <el-dropdown @command="handleCommand" v-show="logined">
            <span class="el-dropdown-link">
              <el-avatar class="el-dropdown-link" :src="this.avatarImg"/>
              <span class="user-name">{{this.userName}}</span>
            </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="center">个人中心</el-dropdown-item>
                <el-dropdown-item command="exit">退出</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </el-col>
        </el-row>
      </el-header>
      <el-main>
        <div class="step">
          <div class="step-title">安心委托 Fox四步起</div>
          <el-row class="step-row">
            <el-col :span="5">
              <el-row>
                <img src="../assets/imgs/step1.jpg">
              </el-row>
              <el-row>
                <span>提交委托信息</span>
              </el-row>
            </el-col>
            <el-col :span="1" style="margin-top: 4%; font-size: 30px">
              <i class="el-icon-arrow-right"/>
            </el-col>
            <el-col :span="5">
              <el-row>
                <img src="../assets/imgs/step2.jpg">
              </el-row>
              <el-row>
                <span>与管家沟通</span>
              </el-row>
            </el-col>
            <el-col :span="2" style="margin-top: 4%; font-size: 30px">
              <i class="el-icon-arrow-right"/>
            </el-col>
            <el-col :span="5">
              <el-row>
                <img src="../assets/imgs/step3.jpg">
              </el-row>
              <el-row>
                <span>制定出租方案</span>
              </el-row>
            </el-col>
            <el-col :span="1" style="margin-top: 4%; font-size: 30px">
              <i class="el-icon-arrow-right"/>
            </el-col>
            <el-col :span="5">
              <el-row>
                <img src="../assets/imgs/step4.jpg">
              </el-row>
              <el-row>
                <span>成为FOX房主</span>
              </el-row>
            </el-col>
          </el-row>
        </div>
        <div class="feedBack">
          <div class="feedBack-title">业主说故事</div>
          <el-row :gutter="40">
            <el-col :span="8" v-for="o in 3" :key="o">
              <el-card>
                <div class="feedBack-header">一家三口定居香港，她说北京的房子交给自如很安心</div>
                <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"></el-avatar>
                <div class="feedBack-owner">范先生 | 北京业主</div>
                <div class="feedBack-content">“当时上门的是一位年轻的小伙子，办事速度特别快，而且特别专业，还特地拿了卷尺现场开始测绘。”张女士说。“整个沟通到签约的过程都非常顺畅，提出的所有问题都有法律知识作为支撑，让我特别安心。”</div>
                <el-rate
                  v-model="rateValue"
                  disabled
                  text-color="#ff9900"
                  score-template="{value}">
                </el-rate>
              </el-card>
            </el-col>
          </el-row>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import Logo from './Block/Logo'
import HeaderLabel from './Block/HeaderLabel'

export default {
  components: {
    Logo,
    HeaderLabel
  },
  name: 'LeaseCommission',
  inject: ['reload'],
  data () {
    return {
      logined: false,
      avatarImg: '',
      userName: '',
      rateValue: 5,
      dialogFormVisible: false,
      formLabelWidth: '100px',
      cityList: ['北京', '上海', '深圳', '杭州', '南京', '广州', '武汉', '成都', '天津'],
      entrustForm: {
        atCity: '',
        address: '',
        area: '',
        community: '',
        floor: '',
        layout: '',
        orientation: '',
        buildAt: '',
        toilet: false,
        balcony: false,
        rentType: '整租',
        houseNum: '',
        roomNum: ''
      }
    }
  },
  created () {
    let userInfo = this.$store.getters.mustGetUser
    this.logined = true
    this.userName = userInfo.name
    this.avatarImg = this.getUrl(userInfo.avatar)
  },
  methods: {
    userAvatarUrl (img) {
      if (img) {
        return process.env.VUE_APP_RESOURCE_URL + img
      }

      return require('@/assets/imgs/defaultHead.png')
    },
    getUrl (img) {
      return process.env.VUE_APP_RESOURCE_URL + img
    },

    toIndex () {
      this.$router.push('/')
    },

    toHouseIndex () {
      this.$router.push('/HouseIndex')
    },

    toBeOwner () {
      this.$router.push('/toBeOwner')
    },

    submitEntrust () {
      this.$refs.entrustForm.validate((valid) => {
        if (valid) {
          this.$loading({ text: '正在提交, 请稍等...' })
          this.dialogFormVisible = false
          this.$ajax.post('/frontend/house/createHouseCommission', {
            atCity: this.entrustForm.atCity,
            address: this.entrustForm.address,
            area: this.entrustForm.area,
            community: this.entrustForm.community,
            floor: this.entrustForm.floor,
            layout: this.entrustForm.layout,
            orientation: this.entrustForm.orientation,
            buildAt: this.$moment(this.entrustForm.buildAt).format('YYYY-MM-DD'),
            toilet: this.convertBoolStatus(this.entrustForm.toilet),
            balcony: this.convertBoolStatus(this.entrustForm.balcony),
            rentType: this.convertRentType(this.entrustForm.rentType),
            houseNum: this.entrustForm.houseNum,
            roomNum: this.entrustForm.roomNum
          })
            .then(res => {
              if (res.data.success) {
                this.$message.success({
                  duration: 1000,
                  message: '已成功提交您的房源！',
                  onClose: () => {
                    this.$loading().close()
                    this.dialogFormVisible = false
                    this.reload()
                  }
                })
              }
            })
            .catch(() => {
              this.$loading().close()
            })
        } else {
          return false
        }
      })
    },

    convertRentType: function (rentType) {
      switch (rentType) {
        case '整租':
          return 'wholeRented'
        case '合租':
          return 'cotenancy'
      }
    },
    convertBoolStatus: function (boolStatus) {
      switch (boolStatus) {
        case true:
          return 1
        case false:
          return 0
      }
    },

    handleCommand (command) {
      if (command === 'center') {
        this.$router.push('/TenantCenter')
      } else {
        this.$store.dispatch('clearUser')
        if (this.$route.path !== '/') {
          this.$router.push('/')
        }
        this.reload()
      }
    }
  }
}
</script>

<style lang="scss">
  .LeaseCommissionDiv {
    width: 100%;
    height: 100%;
    #app, .el-container {
      background-color: #fdfbf6;
    }

    .el-header {
      padding: 0;
      margin-bottom: 40px;
    }

    .el-main {
      width: 95%;
      margin: 0 auto;
    }

    .el-dialog__body {
      padding: 15px 20px;
    }
    .el-dialog__footer {
      text-align: center;
    }

    .user-name {
      position: absolute;
      width: 42px;
      top: 17px;
    }

    .headerOwner {
      background-color: white;
      width: 100%;
      box-shadow: 0 2px 8px 0 rgba(0, 0, 0, .08);
    }

    .header-label {
      color: black;
    }

    .el-dropdown-link {
      margin: 8px;
    }

    .step {
      text-align: center;
      margin-top: 2%;
      margin-bottom: 10%;
    }

    .step-row {
      background-color: #f5e3ba;
      padding: 25px 10px 45px;
      border-radius: 5px;
    }

    .step-title, .feedBack-title {
      font-size: 32px;
      line-height: 38px;
      position: relative;
      color: #696969;
      margin-bottom: 60px;
    }

    .step-title:before, .feedBack-title:before, .step-title:after, .feedBack-title:after {
      height: 3px;
      content: "";
      background-color: #696969;
      position: absolute;
      top: 50%;
    }
    .step-title:before {
      left: 33%;
      width: 60px;
    }
    .step-title:after {
      right: 33%;
      width: 60px;
    }
    .feedBack-title:before {
      left: 39%;
      width: 40px;
    }
    .feedBack-title:after {
      right: 39%;
      width: 40px;
    }

    .feedBack {
      text-align: center;
      line-height: 32px;
      color: #444444;
    }

    .feedBack-header {
      padding: 18px 22px;
      font-size: 18px;
      font-weight: 500;
    }

    .feedBack-owner {
      font-size: 14px;
    }

    .feedBack-content {
      font-size: 14px;
      padding: 15px 24px;
      text-align:justify;
      line-height: 26px;
      color: gray;
    }

    .el-switch.is-checked .el-switch__core {
      border-color: #f9c341;
      background-color: #f9c341;
    }

    .el-radio__input.is-checked .el-radio__inner {
      border-color: #f9c341;
      background: #f9c341 ;
    }

    .el-radio__input.is-checked+.el-radio__label {
      color: #f9c341;
    }
  }
</style>
