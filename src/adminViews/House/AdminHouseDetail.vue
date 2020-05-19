<template>
  <div class="AdminHouseDetailDiv">
    <el-container>
      <el-header>
        <el-page-header @back="goBackToOpHouse" content="详情页面">
        </el-page-header>
      </el-header>
      <el-main>
        <el-row :gutter="40">
          <el-col :span="15">
            <el-carousel :interval="5000" arrow="always" v-show="isImg">
              <el-carousel-item v-for="(item, index) in resImg" :key="index">
                <img :src="getUrl(item)" width="100%" height="500px"/>
              </el-carousel-item>
            </el-carousel>
            <video :src="getUrl(resVideo)" controls="controls" width="100%" height="500px" v-show="isVideo"></video>
            <iframe :src="resModel" width="100%" height="500px" v-show="isModel"></iframe>
            <div class="resBtn">
              <span :class="{ addTagClass: isImg }" @click="showImg">图片</span>
              <span :class="{ addTagClass: isVideo }" @click="showVideo">视频</span>
              <span :class="{ addTagClass: isModel }" @click="showModel">3D模型</span>
            </div>
          </el-col>
          <el-col :span="9">
            <div class="house-title">
              <span class="rent-type">{{houseData.rentType}}</span>
              <span>{{houseData.community}}-</span>
              <span>{{houseData.houseNum}}</span>
              <span v-show="isPart">-{{houseData.roomNum}}</span>
            </div>
            <div class="house-price">￥{{houseData.rentPrice}}/月（{{houseData.payForm}}）</div>
            <div class="house-detail">
              <div class="house-detail-one">
                <el-row class="title">
                  <el-col :span="8">租用面积</el-col>
                  <el-col :span="8">朝向</el-col>
                  <el-col :span="8">户型</el-col>
                </el-row>
                <el-row class="content">
                  <el-col :span="8">{{houseData.area}}㎡</el-col>
                  <el-col :span="8">{{houseData.orientation}}</el-col>
                  <el-col :span="8">{{houseData.layout}}</el-col>
                </el-row>
              </div>
              <div class="house-detail-two">
                <el-row>
                  <el-col class="title" :span="6">位置</el-col>
                  <el-col class="content" :span="18">{{houseData.address}}</el-col>
                </el-row>
                <el-row>
                  <el-col class="title" :span="6">楼层</el-col>
                  <el-col class="content" :span="18">{{houseData.floor}}</el-col>
                </el-row>
                <el-row>
                  <el-col class="title" :span="6">建成年份</el-col>
                  <el-col class="content" :span="18">{{houseData.buildAt}}</el-col>
                </el-row>
                <el-row style="margin-left: 25%; margin-top: 10px">
                  <el-tag v-show="this.houseData.toilet">独卫</el-tag>
                  <el-tag v-show="this.houseData.balcony">阳台</el-tag>
                </el-row>
              </div>
            </div>
          </el-col>
        </el-row>
      </el-main>
      <el-footer>
        <h2>Fox房源详情</h2>
        <div class="house-intro">
          <div class="intro-title">
            <i class="el-icon-community" style="margin-right: 15px; font-size: 22px"></i>
            <span style="font-size: 20px">房源简介</span>
          </div>
          <div class="intro-content">{{houseData.intro}}</div>
        </div>
        <div class="house-config">
          <div class="config-title">
            <i class="el-icon-bed" style="margin-right: 15px; font-size: 22px"></i>
            <span style="font-size: 20px">房屋配置</span>
          </div>
          <el-row style="color: #409EFF; text-align: center; font-size: 60px; margin-bottom: 16px">
            <el-col :span="4"><i class="el-icon-bed"></i></el-col>
            <el-col :span="4"><i class="el-icon-tv"></i></el-col>
            <el-col :span="4"><i class="el-icon-wifi"></i></el-col>
            <el-col :span="4"><i class="el-icon-table"></i></el-col>
            <el-col :span="4"><i class="el-icon-air"></i></el-col>
            <el-col :span="4"><i class="el-icon-sofa"></i></el-col>
          </el-row>
          <el-row style="color: #666; text-align: center; font-size: 14px">
            <el-col :span="4">床</el-col>
            <el-col :span="4">电视</el-col>
            <el-col :span="4">wifi</el-col>
            <el-col :span="4">桌椅</el-col>
            <el-col :span="4">空调</el-col>
            <el-col :span="4">沙发</el-col>
          </el-row>
        </div>
      </el-footer>
    </el-container>
  </div>
</template>

<script>
export default {
  name: 'AdminHouseDetail',
  data () {
    return {
      resImg: [],
      resVideo: '',
      resModel: '',
      isImg: true,
      isVideo: false,
      isModel: false,
      isPart: '',
      houseData: {
        rentType: '',
        community: '',
        houseNum: '',
        roomNum: '',
        rentPrice: '',
        payForm: '',
        area: '',
        orientation: '',
        layout: '',
        address: '',
        floor: '',
        buildAt: '',
        intro: '',
        toilet: '',
        balcony: ''
      }
    }
  },
  methods: {
    getInitHouseData: function () {
      this.$ajax.get('backend/house/getHouseDetailInfo', {
        params: {
          houseId: this.$route.query.houseId
        }
      })
        .then(res => {
          if (res.data.msg.table[0].rentType === 'cotenancy') {
            this.isPart = true
          } else {
            this.isPart = false
          }
          this.houseData.rentType = this.convertRentType(res.data.msg.table[0].rentType)
          this.houseData.community = res.data.msg.table[0].community
          this.houseData.houseNum = res.data.msg.table[0].houseNum
          this.houseData.roomNum = res.data.msg.table[0].roomNum
          this.houseData.rentPrice = res.data.msg.table[0].rentPrice
          this.houseData.payForm = this.convertPayForm(res.data.msg.table[0].payForm)
          this.houseData.area = res.data.msg.table[0].area
          this.houseData.orientation = res.data.msg.table[0].orientation
          this.houseData.layout = res.data.msg.table[0].layout
          this.houseData.address = res.data.msg.table[0].address
          this.houseData.floor = res.data.msg.table[0].floor
          this.houseData.buildAt = this.$moment(res.data.msg.table[0].buildAt).format('YYYY年MM月DD日')
          this.houseData.intro = res.data.msg.table[0].intro
          this.houseData.toilet = res.data.msg.table[0].toilet
          this.houseData.balcony = res.data.msg.table[0].balcony
        })
    },
    convertRentType (rentType) {
      switch (rentType) {
        case 'wholeRented':
          return '整租'
        case 'cotenancy':
          return '合租'
      }
    },
    convertPayForm: function (payForm) {
      switch (payForm) {
        case 'byMonth':
          return '月付价'
        case 'byYear':
          return '年付价'
      }
    },
    getResImg: function () {
      this.$ajax.get('backend/house/getResOfHouse', {
        params: {
          houseId: this.$route.query.houseId,
          resType: 'img'
        }
      })
        .then(res => {
          if (res.data.success) {
            let imgArr = []
            res.data.msg.table.forEach(function (item) {
              imgArr.push(item.resPath)
            })
            this.resImg = imgArr
          }
        })
    },
    getResVideo: function () {
      this.$ajax.get('backend/house/getResOfHouse', {
        params: {
          houseId: this.$route.query.houseId,
          resType: 'video'
        }
      })
        .then(res => {
          if (res.data.success) {
            this.resVideo = res.data.msg.table[0].resPath
          }
        })
    },
    getResModel: function () {
      this.$ajax.get('backend/house/getResOfHouse', {
        params: {
          houseId: this.$route.query.houseId,
          resType: '3d'
        }
      })
        .then(res => {
          if (res.data.success) {
            this.resModel = res.data.msg.table[0].resPath
          }
        })
    },
    getUrl (res) {
      return process.env.VUE_APP_RESOURCE_URL + res
    },
    showImg () {
      this.isImg = true
      this.isVideo = false
      this.isModel = false
    },
    showVideo () {
      this.isImg = false
      this.isVideo = true
      this.isModel = false
    },
    showModel () {
      this.isImg = false
      this.isVideo = false
      this.isModel = true
    },
    goBackToOpHouse: function () {
      this.$router.push('/House/OpHouse')
    }
  },
  created () {
    this.getInitHouseData()
    this.getResImg()
    this.getResVideo()
    this.getResModel()
  }
}
</script>

<style lang="scss">
  .AdminHouseDetailDiv {
    width: 100%;
    height: 100%;
    .resBtn {
      background: rgba(0,0,0,.5);
      border-radius: 2px;
      bottom: 8%;
      left: 32%;
      padding: 6px;
      position: absolute;
      transform: translateX(-50%);
      z-index: 10;
    }

    .resBtn span {
      color: #fff;
      cursor: pointer;
      font-size: 15px;
      height: 24px;
      line-height: 24px;
      margin: 0 8px;
      text-align: center;
      padding: 2px 6px;
      border-radius: 4px;
    }

    .addTagClass {
      background-color: #3a8ee6;
    }

    .el-tag {
      margin-right: 10px;
    }
    .el-header {
      padding: 0;
      margin-bottom: 20px;
      width: 100%;
      box-shadow: 0 2px 8px 0 rgba(0, 0, 0, .08);
    }

    .el-main, .el-footer {
      width: 92%;
      margin: 0 auto;
    }

    .el-page-header {
      height: 60px;
      line-height: 60px;
      padding-left: 2%;
    }

    .el-carousel__container {
      height: 500px;
    }

    .house-title {
      font-size: 24px;
      color: #333;
      font-weight: 600;
      margin-bottom: 28px;
    }

    .house-title .rent-type{
      font-size: 22px;
      background-color: #409EFF;
      color: #fff;
      padding: 4px 6px;
      border-radius: 5px;
      margin-right: 10px;
      margin-left: 5px;
      font-weight: 500;
    }

    .house-price {
      color: #409EFF;
      font-size: 30px;
      margin-bottom: 24px;
    }

    .house-detail-one {
      text-align: center;
      padding: 15px 0;
      margin-bottom: 24px;
      border: 2px solid #f6f7fb;
      line-height: 30px;
    }

    .house-detail-two {
      margin-left: 15px;
    }

    .house-detail .title{
      color: rgba(0, 0, 0, 0.5);
      font-size: 18px;
      line-height: 45px;
      height: 45px;
    }

    .house-detail .content{
      color: rgba(0,0,0,.85);
      font-size: 16px;
      line-height: 45px;
      height: 45px;
    }

    .order-btn {
      height: 54px;
      width: 100%;
      margin: 40px 10px;
      font-size: 20px;
    }

    .el-footer {
      position: relative;
    }

    .el-footer h2 {
      font-size: 24px;
      color: #333;
      text-align: center;
      position: relative;
      font-weight: 400;
    }

    .el-footer h2:before,.el-footer h2:after {
      content: '';
      display: block;
      width: 500px;
      height: 2px;
      background-color: #d7d7d7;
      position: absolute;
      top: 50%;
    }

    .el-footer h2:before {
      left: 0;
    }

    .el-footer h2:after {
      right: 0;
    }

    .house-intro, .house-config, .house-mate {
      margin-bottom: 50px;
    }

    .intro-title, .config-title, .mate-title {
      padding-left: 10px;
      line-height: 80px;
      color: #333;
      border-bottom: 1px solid #d7d7d7;
      margin-bottom: 30px;
    }

    .intro-content {
      color: rgba(0,0,0,.6);
      line-height: 23px;
      margin-top: 30px;
      font-size: 18px;
      padding: 0px 45px;
    }

    .favor {
      background-color: #fff;
      border-radius: 2px;
      color: rgba(0,0,0,.6);
      font-size: 15px;
      height: 36px;
      line-height: 36px;
      position: absolute;
      right: 41%;
      top: 4%;
      z-index: 11;
      width: 82px;
      text-align: center;
      cursor: pointer;
    }

    .favor i {
      font-size: 18px;
      margin-right: 2px;
      position: relative;
      top: -2px;
      vertical-align: middle;
    }

    .el-date-editor.el-input, .el-date-editor.el-input__inner {
      width: 100%;
    }

    .el-dialog__body {
      padding: 30px 20px 10px;
    }
  }
</style>
