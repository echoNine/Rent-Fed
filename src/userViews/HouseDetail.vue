<template>
  <el-container>
    <el-header>
      <el-page-header @back="goBack" content="详情页面">
      </el-page-header>
    </el-header>
    <el-main>
        <el-row :gutter="40">
          <el-col :span="15">
            <iframe src='https://www.thingjs.com/s/3b94ed5156e4a452e52923b7' width="100%" height="500px"></iframe>
            <div class="favor" @click="addCollect"><i v-show="!liked" class="el-icon-nolike"/><i v-show="liked" class="el-icon-yeslike" style="color: #ffba15"/><span>收藏</span></div>
            <el-carousel v-show="false" :interval="5000" arrow="always">
              <el-carousel-item v-for="(item, index) in sliderList" :key="index">
                <img :src="item.url" class="slider-img"/>
              </el-carousel-item>
            </el-carousel>
          </el-col>
          <el-col :span="9">
            <div class="house-title">
              <span class="rent-type">{{houseData.rentType}}</span>
              <span>{{houseData.community}}-</span>
              <span>{{houseData.houseNum}}</span>
              <span v-show="isPart">-{{houseData.roomNum}}-</span>
            </div>
            <div class="house-price">￥{{houseData.price}}/月（{{houseData.payMethod}}）</div>
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
                  <el-col class="title" :span="6">建筑日期</el-col>
                  <el-col class="content" :span="18">{{houseData.buildTime}}</el-col>
                </el-row>
              </div>
            </div>
            <el-button type="warning" class="order-btn" @click="dialogFormVisible = true">预约看房</el-button>
            <el-dialog title="房源约看" :visible.sync="dialogFormVisible" width="35%">
              <el-form :model="orderData" ref="orderData">
                <el-form-item prop="orderData.orderTime" required clearable>
                  <el-date-picker
                    v-model="orderData.orderTime"
                    type="date"
                    placeholder="选择约看时间">
                  </el-date-picker>
                </el-form-item>
                <el-form-item prop="orderData.orderPhone" required>
                  <el-input v-model="orderData.orderPhone" prefix-icon="el-icon-phone-outline" clearable></el-input>
                </el-form-item>
              </el-form>
              <div slot="footer" class="dialog-footer">
                <el-button type="warning" @click="submitOrder">提交约看</el-button>
              </div>
            </el-dialog>
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
        <el-row style="color: #ffba15; text-align: center; font-size: 60px; margin-bottom: 16px">
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
      <div class="house-mate">
        <div class="mate-title">
          <i class="el-icon-friends" style="margin-right: 15px; font-size: 22px"></i>
          <span style="font-size: 20px">租约信息</span>
        </div>
        <el-table :data="mateData" style="width: 100%">
          <el-table-column align="center" prop="room" label="房间"/>
          <el-table-column align="center" prop="sex" label="室友"/>
          <el-table-column align="center" prop="area" label="面积"/>
          <el-table-column align="center" prop="washroom" label="独卫"/>
          <el-table-column align="center" prop="balcony" label="阳台"/>
          <el-table-column align="center" prop="status" label="租金"/>
        </el-table>
      </div>
    </el-footer>
  </el-container>
</template>

<script>
export default {
  name: 'HouseDetail',
  data () {
    return {
      sliderList: [
        { url: require('../assets/imgs/p1.jpg') },
        { url: require('../assets/imgs/p2.jpg') },
        { url: require('../assets/imgs/p3.jpg') },
        { url: require('../assets/imgs/p4.jpg') }
      ],
      mateData: [{
        room: '房间A',
        sex: '男',
        area: '约10㎡',
        washroom: '+',
        balcony: '+',
        status: '已租用'
      }, {
        room: '房间A',
        sex: '男',
        area: '约10㎡',
        washroom: '-',
        balcony: '-',
        status: '已租用'
      }, {
        room: '房间C',
        sex: '--',
        area: '约8㎡',
        washroom: '+',
        balcony: '-',
        status: '2890元/月'
      }],
      isPart: '',
      houseData: {
        rentType: '',
        community: '',
        houseNum: '',
        roomNum: '',
        price: '',
        payMethod: '',
        area: '',
        orientation: '',
        layout: '',
        address: '',
        floor: '',
        buildTime: '',
        intro: ''
      },
      liked: '',
      dialogFormVisible: false,
      orderData: {
        orderTime: '',
        orderPhone: ''
      }
    }
  },
  methods: {
    goBack: function () {
      this.$router.push('/HouseIndex')
    },
    getInitData: function () {
      this.$ajax.get('/house/houseDetail', {
        params: {
          houseId: this.$route.query.houseId,
          email: sessionStorage.getItem('email')
        }
      })
        .then(res => {
          if (res.data.msg.liked) {
            this.liked = true
          } else {
            this.liked = false
          }
          if (res.data.msg.self.table[0].rentType === '合租') {
            this.isPart = true
          } else {
            this.isPart = false
          }
          this.houseData.rentType = res.data.msg.self.table[0].rentType
          this.houseData.community = res.data.msg.self.table[0].community
          this.houseData.houseNum = res.data.msg.self.table[0].houseNum
          this.houseData.roomNum = res.data.msg.self.table[0].roomNum
          this.houseData.price = res.data.msg.self.table[0].price
          this.houseData.payMethod = res.data.msg.self.table[0].payMethod
          this.houseData.area = res.data.msg.self.table[0].area
          this.houseData.orientation = res.data.msg.self.table[0].orientation
          this.houseData.layout = res.data.msg.self.table[0].layout
          this.houseData.address = res.data.msg.self.table[0].address
          this.houseData.floor = res.data.msg.self.table[0].floor
          this.houseData.buildTime = res.data.msg.self.table[0].buildTime
          this.houseData.intro = res.data.msg.self.table[0].intro
        })
    },
    addCollect: function () {
      this.liked = !this.liked
      this.$ajax.post('/house/addCollect', {
        liked: this.liked,
        houseId: this.$route.query.houseId,
        email: sessionStorage.getItem('email'),
        createdAt: this.$moment(new Date()).format('YYYY-MM-DD')
      })
        .then(res => {
          if (res.data.success && this.liked) {
            this.$message.success({
              message: '已收藏该房源！'
            })
          } else {
            this.$message.success({
              message: '已取消该房源收藏！'
            })
          }
        })
    },
    submitOrder: function () {
      this.dialogFormVisible = false
      this.$ajax.post('/house/addOrder', {
        houseId: this.$route.query.houseId,
        email: sessionStorage.getItem('email'),
        orderTime: this.$moment(this.orderData.orderTime).format('YYYY-MM-DD'),
        orderPhone: this.orderData.orderPhone
      })
        .then(res => {
          if (res.data.success) {
            this.$message.success({
              message: '已完成约看！'
            })
            this.orderData.orderTime = ''
            this.orderData.orderPhone = ''
          }
        })
    }
  },
  created () {
    this.getInitData()
  }
}
</script>

<style scoped>
  /deep/ .el-header {
    padding: 0;
    margin-bottom: 20px;
    width: 100%;
    box-shadow: 0 2px 8px 0 rgba(0, 0, 0, .08);
  }

  /deep/ .el-main, /deep/ .el-footer {
    width: 92%;
    margin: 0 auto;
  }

  /deep/ .el-page-header {
    height: 60px;
    line-height: 60px;
    padding-left: 2%;
  }

  /deep/ .el-carousel__container {
    height: 500px;
  }

  .slider-img {
    width: 100%;
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
    background-color: #ffba15;
    color: #fff;
    padding: 4px 6px;
    border-radius: 5px;
    margin-right: 10px;
    margin-left: 5px;
    font-weight: 500;
  }

  .house-price {
    color: #ffba15;
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

  /deep/ .el-footer {
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

  /deep/ .el-date-editor.el-input, .el-date-editor.el-input__inner {
    width: 100%;
  }

  /deep/ .el-dialog__body {
    padding: 30px 20px 10px;
  }
</style>
