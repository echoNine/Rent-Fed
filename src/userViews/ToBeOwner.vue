<template>
  <el-container>
    <el-header>
      <el-row class="headerOwner">
        <el-col :span="10">
          <img src="../assets/imgs/logo2.png" class="logo">
        </el-col>
        <el-col :span="6">
          <ul>
            <li @click="toIndex">首页</li>
            <li @click="toHouseIndex">租房</li>
            <li @click="toBeOwner">成为房主</li>
          </ul>
        </el-col>
        <el-col :span="4" style="line-height: 60px">
          <el-button type="warning" @click="dialogFormVisible = true">立即委托</el-button>
          <el-dialog title="在线委托" :visible.sync="dialogFormVisible" width="40%">
            <el-form :model="entrustForm" :rules="rules" ref="entrustForm">
              <el-form-item label="业主姓名：" :label-width="formLabelWidth" prop="name" required>
                <el-input v-model="entrustForm.name" clearable></el-input>
              </el-form-item>
              <el-form-item label="联系电话：" :label-width="formLabelWidth" prop="phone" required>
                <el-input v-model="entrustForm.phone" clearable></el-input>
              </el-form-item>
              <el-form-item label="房屋城市：" :label-width="formLabelWidth" prop="city" required>
                <el-select v-model="entrustForm.city" clearable>
                  <el-option v-for="(item, index) in cityList" :key="index" :label="item" :value="item"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="小区名称：" :label-width="formLabelWidth" prop="community" required>
                <el-input v-model="entrustForm.community" clearable></el-input>
              </el-form-item>
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
</template>

<script>
export default {
  name: 'ToBeOwner',
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
        name: '',
        phone: '',
        city: '',
        community: ''
      }
    }
  },
  created () {
    let token = sessionStorage.getItem('token')
    this.$ajax.get('/user/userList', {
      params: {
        email: sessionStorage.getItem('email')
      }
    })
      .then(res => {
        if (token != null) {
          this.logined = true
          this.userName = res.data.msg.table[0].name
          this.avatarImg = this.getUrl(res.data.msg.table[0].avatar)
        }
      })
  },
  methods: {
    getUrl (img) {
      return process.env.VUE_APP_RESOURCE_URL + img
    },

    toIndex () {
      this.$router.push('/Index')
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
          this.$ajax.post('/userHouse/entrustHouse', {
            name: this.entrustForm.name,
            phone: this.entrustForm.phone,
            city: this.entrustForm.city,
            community: this.entrustForm.community
          })
            .then(res => {
              if (res.data.success) {
                this.$message.success({
                  duration: 1000,
                  message: '已成功提交您的委托申请！',
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

    handleCommand (command) {
      if (command === 'center') {
        this.$router.push('/TenantCenter')
      } else {
        sessionStorage.removeItem('token')
        sessionStorage.removeItem('email')
        this.$router.push('/Index')
        this.reload()
      }
    }
  }
}
</script>

<style scoped>
  /deep/ #app, .el-container {
    background-color: #fdfbf6;
  }

  /deep/ .el-header {
    padding: 0;
    margin-bottom: 40px;
  }

  /deep/ .el-main {
    width: 95%;
    margin: 0 auto;
  }

  /deep/ .el-dialog__body {
    padding: 15px 20px;
  }
  /deep/ .el-dialog__footer {
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

  .logo {
    width: 160px;
    margin-top: 8px;
    margin-left: 18%;
  }

  .headerOwner ul {
    list-style: none;
    height: 26px;
    line-height: 26px;
  }

  .headerOwner ul li {
    float: left;
    margin-right: 50px;
    font-size: 15px;
    font-weight: 500;
    color: black;
    cursor: pointer;
  }

  .headerOwner ul li:nth-child(3) {
    border-bottom: 2px solid #ff961e;
  }

  .headerOwner ul li:hover {
    border-bottom: 2px solid #ff961e;
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
</style>
