<template>
  <el-container>
    <el-header>
      <el-row class="headerIndex">
        <el-col :span="10">
          <img src="../assets/imgs/logo2.png" class="logo">
        </el-col>
        <el-col :span="10">
          <ul>
            <li @click="toIndex">首页</li>
            <li @click="toHouseIndex">租房</li>
            <li @click="toBeOwner">成为房主</li>
          </ul>
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
      <div class="select-option">
        <div class="filter-option">
          <div class="filter-type">
            <span class="filter-title">类型：</span>
            <span v-for="(item,index) in type" :key="index" class="main" @click="getType(index, item)"
                  :class="active1 == index ? 'tagActive' : '' ">
        {{ item }}
      </span>
          </div>
          <div class="filter-type">
            <span class="filter-title">价格：</span>
            <span v-for="(item, index) in price" :key="index" class="main" @click="getPrice(index, item.value)"
                  :class="active2 == index ? 'tagActive' : '' ">
        {{ item.label }}
      </span>
          </div>
          <div class="filter-type">
            <span class="filter-title">面积：</span>
            <span v-for="(item, index) in area" :key="index" class="main" @click="getArea(index, item.value)"
                  :class="active3 == index ? 'tagActive' : '' ">
        {{ item.label }}
      </span>
          </div>
          <div class="filter-type">
            <span class="filter-title">付价：</span>
            <span v-for="(item,index) in payMethod" :key="index" class="main" @click="getPay(index, item)"
                  :class="active4 == index ? 'tagActive' : '' ">
        {{ item }}
      </span>
          </div>
        </div>
      </div>
      <div class="house-container">
        <div v-for="(item,index) in cardData" :key="index">
          <el-card style="margin-bottom: 40px">
            <el-row>
              <el-col :span="8">
                <img :src="getUrl(item.cover)" style="width: 280px; height: 200px">
              </el-col>
              <el-col :span="9">
                <div class="house-title">{{item.rentType}}·{{item.community}}-{{item.orientation}}</div>
                <div class="house-location"><i class="el-icon-location" style="color: #ff961e; padding-right: 8px; font-size: 20px"></i>{{item.address}}</div>
                <div class="house-detail">
                  <span class="rent-type">{{item.rentType}}</span>
                  <span>建筑面积{{item.area}}㎡ | </span>
                  <span>{{item.floor}}层 | </span>
                  <span>{{item.layout}}</span>
                </div>
              </el-col>
              <el-col :span="7">
                <div class="house-price">
                  <span class="price-num">{{item.price}}</span>
                  <span class="price-unit">元/月</span>
                </div>
                <el-button type="warning" plain @click="toDetail(item)">查看详情</el-button>
              </el-col>
            </el-row>
          </el-card>
        </div>
        <el-pagination
          @current-change="pageChange"
          background
          layout="prev, pager, next"
          :page-size="queryData.pageSize"
          :total="queryData.totalCount">
        </el-pagination>
      </div>
    </el-main>
  </el-container>
</template>

<script>
export default {
  name: 'RentDetail',
  inject: ['reload'],
  data () {
    return {
      logined: false,
      avatarImg: '',
      userName: '',
      cardData: [{
        cover: '',
        community: '',
        orientation: '',
        area: '',
        floor: '',
        layout: '',
        price: '',
        address: ''
      }],
      type: ['不限', '合租', '整租'],
      payMethod: ['不限', '月付价', '季付价', '年付价'],
      price: [
        {
          label: '不限',
          value: {
            priceStart: '',
            priceEnd: ''
          }
        },
        {
          label: '1500元以下',
          value: {
            priceStart: '',
            priceEnd: '1500'
          }
        },
        {
          label: '1500-2500元',
          value: {
            priceStart: '1500',
            priceEnd: '2500'
          }
        },
        {
          label: '2500-4000元',
          value: {
            priceStart: '2500',
            priceEnd: '4000'
          }
        },
        {
          label: '4000-6000元',
          value: {
            priceStart: '4000',
            priceEnd: '6000'
          }
        },
        {
          label: '6000-8000元',
          value: {
            priceStart: '6000',
            priceEnd: '8000'
          }
        },
        {
          label: '8000元以上',
          value: {
            priceStart: '8000',
            priceEnd: ''
          }
        }
      ],
      area: [
        {
          label: '不限',
          value: {
            areaStart: '',
            areaEnd: ''
          }
        },
        {
          label: '10㎡以下',
          value: {
            areaStart: '',
            areaEnd: '10'
          }
        },
        {
          label: '10-12㎡',
          value: {
            areaStart: '10',
            areaEnd: '12'
          }
        },
        {
          label: '12-15㎡',
          value: {
            areaStart: '12',
            areaEnd: '15'
          }
        },
        {
          label: '15-20㎡',
          value: {
            areaStart: '15',
            areaEnd: '20'
          }
        },
        {
          label: '20㎡以上',
          value: {
            areaStart: '20',
            areaEnd: ''
          }
        }
      ],
      queryData: {
        rentType: '',
        inputInfo: '',
        priceStart: '',
        priceEnd: '',
        areaStart: '',
        areaEnd: '',
        payMethod: '',
        pageNum: 1,
        pageSize: 2,
        totalCount: 0
      },
      active1: 0,
      active2: 0,
      active3: 0,
      active4: 0
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
          let type = this.$route.query.rentType
          let inputInfo = this.$route.query.inputInfo
          if (type && inputInfo) {
            this.queryData.rentType = type === '不限' ? '' : type
            this.queryData.inputInfo = inputInfo
            this.active1 = this.type.indexOf(type)
          }
          this.search()
        }
      })
  },
  methods: {
    pageChange (val) {
      this.queryData.pageNum = val
      this.getInitData()
    },
    search () {
      this.queryData.pageNum = 1
      this.getInitData()
    },
    handleClear () {
      this.select = ''
      this.input = ''
      this.queryData.pageNum = 1
      this.getInitData()
    },
    getInitData () {
      this.$ajax.get('/userHouse/userHouseList', {
        params: {
          rentType: this.queryData.rentType,
          priceStart: this.queryData.priceStart,
          priceEnd: this.queryData.priceEnd,
          areaStart: this.queryData.areaStart,
          areaEnd: this.queryData.areaEnd,
          payMethod: this.queryData.payMethod,
          inputInfo: this.queryData.inputInfo,
          pageNum: this.queryData.pageNum,
          pageSize: this.queryData.pageSize
        }
      })
        .then(res => {
          this.queryData.totalCount = res.data.msg.totalCount
          this.cardData = res.data.msg.data.table
          this.queryData.rentType = ''
          this.queryData.inputInfo = ''
        })
    },
    getUrl (img) {
      return process.env.VUE_APP_RESOURCE_URL + img
    },
    getType (index, rentType) {
      this.queryData.rentType = rentType === '不限' ? '' : rentType
      this.active1 = index
      this.search()
    },
    getPrice (index, price) {
      this.queryData.priceStart = price.priceStart
      this.queryData.priceEnd = price.priceEnd
      this.active2 = index
      this.search()
    },
    getArea (index, area) {
      this.queryData.areaStart = area.areaStart
      this.queryData.areaEnd = area.areaEnd
      this.active3 = index
      this.search()
    },
    getPay (index, payMethod) {
      this.queryData.payMethod = payMethod === '不限' ? '' : payMethod
      this.active4 = index
      this.search()
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
    handleCommand (command) {
      if (command === 'center') {
        this.$router.push('/TenantCenter')
      } else {
        sessionStorage.removeItem('token')
        sessionStorage.removeItem('email')
        this.$router.push('/Index')
        this.reload()
      }
    },
    toDetail: function (item) {
      this.$router.push({ path: '/HouseDetail', query: { houseId: item.id } })
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
    width: 88%;
    margin: 0 auto;
  }

  /deep/ .el-input__inner {
    height: 50px;
    line-height: 50px;
    font-size: 16px;
  }

  .user-name {
    position: absolute;
    width: 42px;
    top: 17px;
  }

  .btn {
    height: 50px;
    line-height: 50px;
    padding: 0 28px;
    font-size: 18px;
  }

  .filter-option {
    border: 2px solid #f0f0f0;
    padding: 20px 30px;
    margin: 0 auto;
    color: #333;
    background-color: #fff;
  }

  .filter-title {
    line-height: 32px;
    padding-bottom: 12px;
    font-size: 14px;
    font-weight: 700;
    margin-right: 20px;
    color: #666;
  }

  .filter-type {
    height: 45px;
  }

  .filter-type .main {
    line-height: 32px;
    font-size: 14px;
    height: 32px;
    padding: 5px 18px;
    cursor: pointer;
  }

  /deep/ .tagActive {
    border-radius: 6px;
    background: #ff961e;
    color: #fff;
  }

  .house-container {
    margin-top: 40px;
  }

  /deep/ .el-card__body {
    padding: 25px 40px;
  }

  .house-title {
    height: 3em;
    line-height: 3em;
    font-weight: 700;
    font-size: 18px;
  }

  .house-title:hover {
    cursor: pointer;
    color: #ff961e;
  }

  .house-location {
    font-size: 14px;
    color: #666;
    margin-top: 10px;
  }

  .house-detail {
    font-size: 14px;
    color: #666;
    margin-top: 15px;
  }

  .house-detail .rent-type{
    background-color: #ff961e;
    font-size: 12px;
    color: #fff;
    padding: 1px;
    border-radius: 2px;
    margin-right: 11px;
    margin-left: 3px;
  }

  .house-price {
    height: 75px;
    line-height: 75px;
  }

  .price-num {
    font-size: 30px;
    color: #ff961e;
  }

  .price-unit {
    font-size: 16px;
  }

  .headerIndex {
    background-color: white;
    width: 100%;
    box-shadow: 0 2px 8px 0 rgba(0, 0, 0, .08);
  }

  .logo {
    width: 160px;
    margin-top: 8px;
    margin-left: 18%;
  }

  .headerIndex ul {
    list-style: none;
    height: 26px;
    line-height: 26px;
  }

  .headerIndex ul li {
    float: left;
    margin-right: 50px;
    font-size: 15px;
    font-weight: 500;
    color: black;
    cursor: pointer;
  }

  .headerIndex ul li:nth-child(2) {
    border-bottom: 2px solid #ff961e;
  }

  .headerIndex ul li:hover {
    border-bottom: 2px solid #ff961e;
  }

  .el-dropdown-link {
    margin: 8px;
  }
</style>
