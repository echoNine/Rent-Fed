<template>
  <el-container>
    <el-header>
      <el-row class="header">
        <el-col :span="10">
          <logo></logo>
        </el-col>
        <el-col :span="10">
          <ul>
            <li @click="toIndex">首页</li>
            <li @click="toHouseIndex">租房</li>
            <li @click="toBeOwner">成为房主</li>
          </ul>
        </el-col>
        <el-col :span="4">
          <el-dropdown v-show="logined" @command="handleCommand">
            <span class="el-dropdown-link">
              <el-avatar class="el-dropdown-link" :src="this.avatarImg"/>
              <span class="user-name">{{this.userName}}</span>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="center">个人中心</el-dropdown-item>
              <el-dropdown-item command="exit">退出</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <div class="firstAction" v-show="!logined">
            <el-button size="mini" type="warning" @click="firstLogin">登录</el-button>
            <el-button size="mini" type="warning" @click="firstRegister">注册</el-button>
          </div>
        </el-col>
      </el-row>
    </el-header>
    <el-main style="margin-top: -64px;">
      <el-dialog title="完善个人信息" :visible.sync="dialogFormVisible">
        <el-form :model="infoForm" ref="infoForm" label-width="95px">
          <el-form-item label="姓名" prop="name" required>
            <el-input v-model="infoForm.name" clearable></el-input>
          </el-form-item>
          <el-form-item label="性别" prop="sex" required>
            <el-radio-group v-model="infoForm.sex">
              <el-radio label="男" value="男"></el-radio>
              <el-radio label="女" value="女"></el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="身份证号" prop="cardNum" required>
            <el-input v-model="infoForm.cardNum" clearable></el-input>
          </el-form-item>
          <el-form-item label="联系电话" prop="phone" required>
            <el-input v-model="infoForm.phone" clearable></el-input>
          </el-form-item>
          <el-form-item label="所属省市" prop="native" required>
            <el-cascader :options="options" v-model="infoForm.native" ref="nativeCascader" clearable></el-cascader>
          </el-form-item>
          <el-form-item label="个人头像" prop="avatarURL" required>
            <el-upload
              name="files"
              class="avatar-uploader"
              :action="uploadUrl"
              :show-file-list="false"
              :on-success="getFilePath"
              :on-remove="handleRemove">
              <img v-if="infoForm.avatarURL" :src="infoForm.avatarURL" class="avatar">
              <span v-if="infoForm.avatarURL" class="el-upload-action" @click.stop="handleRemove()">
                    <i class="el-icon-delete"></i>
                </span>
              <i v-else class="el-icon-upload2 avatar-uploader-icon" stop></i>
            </el-upload>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="warning" @click="submitInfo">提 交</el-button>
        </div>
      </el-dialog>
      <el-carousel :interval="5000" arrow="always">
        <el-carousel-item v-for="(item, index) in indexBgList" :key="index">
          <img :src="item.url" class="bgImg"/>
        </el-carousel-item>
      </el-carousel>
      <div class="wrap">
        <h1 class="wrapTitle">安全房源 安心居住</h1>
        <ul>
          <li :class="{ wrapActive: isAll }" @click="showAll">全部</li>
          <li :class="{ wrapActive: isTogether }" @click="showTogether">合租</li>
          <li :class="{ wrapActive: isOnly }" @click="showOnly">整租</li>
        </ul>
        <el-row :gutter="5">
          <el-col :span="18">
            <el-autocomplete
              class="inline-input"
              v-model="inputInfo"
              :fetch-suggestions="querySearch"
              placeholder="请输入内容"
            ></el-autocomplete>
          </el-col>
          <el-col :span="6">
            <el-button type="warning" @click="searchByRentType">查找房源</el-button>
          </el-col>
        </el-row>
      </div>
      <div class="estimate">
        <el-row :gutter="30">
          <el-col :span="6">
            <h3 class="title">用户反馈</h3>
            <div class="tag-list">
              <div class="tag-link" :class="{ tagActive: isShowOwner }" @click="showOwnerEstimate">房主评价</div>
              <div class="tag-link" :class="{ tagActive: !isShowOwner }" @click="showTenantEstimate">租户评价</div>
            </div>
          </el-col>
          <el-col :span="18">
            <div class="owner-estimate" v-if="isShowOwner">
              <el-row>
                <div class="image-effect">
                  <img src="../assets/imgs/owner4.jpg" alt="">
                  <div class="image-effect__content">
                    <span>品质</span>
                    <el-rate
                      v-model="value"
                      disabled
                      show-score
                      text-color="#ff9900"
                      score-template="{value}">
                    </el-rate>
                  </div>
                </div>
              </el-row>
              <el-row :gutter="20" style="margin-top: 20px">
                <el-col :span="8">
                  <div class="image-effect">
                    <img src="../assets/imgs/owner1.jpg" style="width: 270px;height: 250px" alt="">
                    <div class="image-effect__content">
                      <span>服务</span>
                      <el-rate
                        v-model="value"
                        disabled
                        show-score
                        text-color="#ff9900"
                        score-template="{value}">
                      </el-rate>
                    </div>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div class="image-effect">
                    <img src="../assets/imgs/owner2.jpg" style="width: 270px;height: 250px" alt="">
                    <div class="image-effect__content">
                      <span>效率</span>
                      <el-rate
                        v-model="value"
                        disabled
                        show-score
                        text-color="#ff9900"
                        score-template="{value}">
                      </el-rate>
                    </div>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div class="image-effect">
                    <img src="../assets/imgs/owner3.jpg" style="width: 270px;height: 250px" alt="">
                    <div class="image-effect__content">
                      <span>安全</span>
                      <el-rate
                        v-model="value"
                        disabled
                        show-score
                        text-color="#ff9900"
                        score-template="{value}">
                      </el-rate>
                    </div>
                  </div>
                </el-col>
              </el-row>
            </div>
            <div class="tenant-estimate" v-if="!isShowOwner">
              <el-row :gutter="20">
                <el-col :span="8">
                  <div class="image-effect">
                    <img src="../assets/imgs/tenant4.jpg" style="width: 270px;height: 250px" alt="">
                    <div class="image-effect__content">
                      <span>品质</span>
                      <el-rate
                        v-model="value"
                        disabled
                        show-score
                        text-color="#ff9900"
                        score-template="{value}">
                      </el-rate>
                    </div>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div class="image-effect">
                    <img src="../assets/imgs/tenant5.jpg" style="width: 270px;height: 250px" alt="">
                    <div class="image-effect__content">
                      <span>安全</span>
                      <el-rate
                        v-model="value"
                        disabled
                        show-score
                        text-color="#ff9900"
                        score-template="{value}">
                      </el-rate>
                    </div>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div class="image-effect">
                    <img src="../assets/imgs/tenant6.jpg" style="width: 270px;height: 250px" alt="">
                    <div class="image-effect__content">
                      <span>效率</span>
                      <el-rate
                        v-model="value"
                        disabled
                        show-score
                        text-color="#ff9900"
                        score-template="{value}">
                      </el-rate>
                    </div>
                  </div>
                </el-col>
              </el-row>
              <el-row :gutter="20" style="margin-top: 20px">
                <el-col :span="12">
                  <div class="image-effect">
                    <img src="../assets/imgs/tenant1.jpg" alt="">
                    <div class="image-effect__content">
                      <span>安全</span>
                      <el-rate
                        v-model="value"
                        disabled
                        show-score
                        text-color="#ff9900"
                        score-template="{value}">
                      </el-rate>
                    </div>
                  </div>
                </el-col>
                <el-col :span="12">
                  <div class="image-effect">
                    <img src="../assets/imgs/tenant2.jpg" alt="">
                    <div class="image-effect__content">
                      <span>实惠</span>
                      <el-rate
                        v-model="value"
                        disabled
                        show-score
                        text-color="#ff9900"
                        score-template="{value}">
                      </el-rate>
                    </div>
                  </div>
                </el-col>
              </el-row>
            </div>
          </el-col>
        </el-row>
      </div>
    </el-main>
  </el-container>
</template>

<script>
import Logo from './Logo'
let nativeList = require('@/assets/js/city.json')
export default {
  components: {
    Logo
  },
  name: 'Index',
  inject: ['reload'],
  data () {
    return {
      uploadUrl: process.env.VUE_APP_BASE_URL + '/file/upload',
      logined: false,
      isAll: true,
      isTogether: false,
      isOnly: false,
      indexBgList: [
        { url: require('../assets/imgs/indexBg1.jpg') },
        { url: require('../assets/imgs/indexBg2.jpg') }
      ],
      isShowOwner: true,
      rentType: '不限',
      inputInfo: '',
      communityList: [],
      dialogFormVisible: false,
      options: nativeList,
      infoForm: {
        name: '',
        sex: '',
        cardNum: '',
        phone: '',
        native: '',
        avatar: '',
        avatarURL: ''
      },
      userName: '',
      avatarImg: '',
      value: 5
    }
  },
  methods: {
    getFilePath (res, file) {
      this.infoForm.avatarURL = URL.createObjectURL(file.raw)
      this.infoForm.avatar = res.msg[0]
    },
    userAvatarUrl (img) {
      if (img) {
        return process.env.VUE_APP_RESOURCE_URL + img
      }

      return require('@/assets/imgs/defaultHead.png')
    },
    getUrl (img) {
      return process.env.VUE_APP_RESOURCE_URL + img
    },
    handleRemove () {
      this.infoForm.avatar = ''
    },
    submitInfo () {
      let node = this.$refs['nativeCascader'].getCheckedNodes()[0]
      this.$ajax.post('/user/perfectInfo', {
        email: sessionStorage.getItem('email'),
        name: this.infoForm.name,
        sex: this.infoForm.sex,
        cardNum: this.infoForm.cardNum,
        phone: this.infoForm.phone,
        native: node.pathLabels[0] + node.pathLabels[1],
        avatar: this.infoForm.avatar
      })
        .then(res => {
          if (res.data.success) {
            this.$message.success({
              duration: 1000,
              message: '个人信息已完善！',
              onClose: () => {
                this.dialogFormVisible = false
                this.$loading().close()
                this.reload()
              }
            })
          }
        })
        .catch(() => {
          this.$loading().close()
        })
    },
    firstLogin () {
      this.$router.push({ path: '/UserLogin', query: { isLogin: true } })
    },
    firstRegister () {
      this.$router.push({ path: '/UserLogin', query: { isLogin: false } })
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
    },
    showAll () {
      this.isAll = true
      this.isTogether = false
      this.isOnly = false
      this.rentType = '不限'
    },
    showTogether () {
      this.isAll = false
      this.isTogether = true
      this.isOnly = false
      this.rentType = '合租'
    },
    showOnly () {
      this.isAll = false
      this.isTogether = false
      this.isOnly = true
      this.rentType = '整租'
    },
    searchByRentType () {
      this.$router.push({ path: '/HouseIndex', query: { rentType: this.rentType, inputInfo: this.inputInfo } })
    },
    showOwnerEstimate () {
      this.isShowOwner = true
    },
    showTenantEstimate () {
      this.isShowOwner = false
    },
    querySearch (queryString, cb) {
      let communityList = this.communityList
      let results = queryString ? communityList.filter(this.createFilter(queryString)) : communityList
      cb(results)
    },
    createFilter (queryString) {
      return (communityList) => {
        return (communityList.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
      }
    },
    async loadAll () {
      let res = await this.$ajax.get('/userHouse/houseCommunityList')
      return res.data.msg.table.map(item => {
        item.value = item.community
        return item
      })
    }
  },
  created: function () {
    let userInfo = this.$store.getters.userInfo
    if (userInfo) {
      this.avatarImg = this.userAvatarUrl(userInfo.avatar)
      this.userName = userInfo.name
      console.log(userInfo)
      this.logined = true

      this.dialogFormVisible = this.userName == null
    }
  },
  mounted () {
    this.loadAll().then(res => {
      this.communityList = res
    })
  }
}
</script>

<style scoped>
  /deep/ .el-header, /deep/ .el-main {
    padding: 0;
    margin: 0;
  }

  /deep/ .inline-input {
    width: 100%;
  }

  .header {
    color: #fff;
    background-color: rgba(0, 0, 0, .06);
    width: 100%;
    z-index: 11;
  }

  .logo {
    width: 160px;
    margin-top: 8px;
    margin-left: 18%;
  }

  .header ul {
    list-style: none;
    height: 26px;
    line-height: 26px;
  }

  .header ul li {
    float: left;
    margin-right: 50px;
    font-size: 15px;
    font-weight: 500;
    color: #fff;
    cursor: pointer;
  }

  .header ul li:first-child {
    border-bottom: 2px solid #ff961e;
  }

  .header ul li:hover {
    border-bottom: 2px solid #ff961e;
  }

  .firstAction {
    line-height: 60px;
  }

  .el-dropdown-link {
    margin: 8px;
  }

  /deep/ .el-carousel__container {
    height: 500px;
  }

  .bgImg {
    height: 500px;
    filter: brightness(0.8);
  }

  .wrap {
    z-index: 2;
    color: white;
    position: absolute;
    width: 40%;
    top: 11%;
    left: 8%;
  }

  .wrapTitle {
    font-size: 60px;
    text-shadow: 0 1px 2px rgba(0, 0, 0, .06);
    font-weight: 600;
    margin-bottom: 12%;
  }

  .wrap ul {
    list-style: none;
    height: 26px;
    line-height: 26px;
    font-size: 18px;
    font-weight: 500;
    padding-left: 10px;
  }

  .wrap ul li {
    float: left;
    margin-right: 50px;
    color: #fff;
    cursor: pointer;
  }

  .wrapActive {
    border-bottom: 3px solid #ff961e;
  }

  .wrap ul li:hover {
    border-bottom: 3px solid #ff961e;
  }

  .estimate {
    color: #474747;
    margin-top: 4%;
    padding: 4% 8%;
    background-size: cover;
    background: #f6f7fb no-repeat center;
  }

  .estimate .title {
    font-weight: 600;
    font-size: 3rem;
    margin-bottom: 2.6rem;
    text-transform: capitalize;
  }

  .estimate .tag-link {
    padding: 0.6rem 1.2rem;
    border-radius: 1.5rem;
    display: block;
    cursor: pointer;
    margin-bottom: 0.625rem;
  }

  /deep/ .tagActive {
    background-color: transparent;
    border: 1px solid #474747;
    color: #474747;
  }

  /* image effect */
  .image-effect {
    position: relative;
    text-align: center;
    overflow: hidden;
    cursor: pointer;
  }

  .image-effect:after {
    content: "";
    width: 100%;
    height: 100%;
    background: linear-gradient(45deg, rgba(91, 101, 233, 0.33) 0, rgba(23, 143, 94, 0.4) 100%);
    position: absolute;
    top: 0;
    left: 0;
    opacity: 0;
    transition: all 0.5s ease 0s;
  }

  .image-effect:hover:after {
    opacity: 1;
  }

  .image-effect img {
    width: 100%;
    transition: all 0.5s ease;
  }

  .image-effect__content {
    position: absolute;
    width: 100%;
    padding: 1rem 0;
    background: rgba(0, 0, 0, 0.55);
    bottom: -100px;
    left: 0;
    z-index: 1;
    transition: all 0.6s ease;
  }

  .image-effect__content span {
    font-size: 1rem;
    color: #ffffff;
    margin: 0;
  }

  .image-effect:hover .image-effect__content {
    bottom: 0;
  }

  .avatar-uploader {
    width: 120PX;
    height: 120px;
    border-radius: 50%;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    background: url('../assets/imgs/defaultHead.png') no-repeat;
    background-size: 100% 100%;
  }

  .avatar-uploader-icon {
    font-size: 0;
    color: #fff;
    width: 120px;
    height: 120px;
    line-height: 120px;
    text-align: center;
  }

  .avatar-uploader-icon:hover {
    font-size: 28px;
    background-color: rgba(0, 0, 0, .3);
  }

  .user-name {
    color: #fff;
    position: absolute;
    width: 42px;
    top: 17px;
  }

  .avatar {
    position: relative;
    width: 120px;
    height: 120px;
    display: block;
  }

  .el-upload-action {
    position: absolute;
    top: 0;
    left: 0;
    display: block;
    width: 100%;
    height: 100%;
    font-size: 0;
    color: #fff;
    text-align: center;
    line-height: 120px;

  }

  .el-upload-action:hover {
    font-size: 20px;
    background-color: #000;
    background-color: rgba(0, 0, 0, .3)
  }
</style>
