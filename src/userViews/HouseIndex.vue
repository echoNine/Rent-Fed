<template>
  <div class="HouseIndexDiv">
    <el-container>
      <el-header>
        <el-row class="headerIndex">
          <el-col :span="10">
            <logo></logo>
          </el-col>
          <el-col :span="8">
            <header-label :active-index="1"></header-label>
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
              <span class="filter-title">房屋城市：</span>
              <el-select v-model="queryData.atCity" placeholder="请选择" @change="search" clearable @clear="clearCity">
                <el-option
                  v-for="(item,index) in cityList"
                  :key="index"
                  :label="item"
                  :value="item">
                </el-option>
              </el-select>
            </div>
            <div class="filter-type">
              <span class="filter-title">租赁类型：</span>
              <el-radio-group v-model="queryData.rentType" @change="search" size="small">
                <el-radio-button  v-for="(item, index) in typeList" :key="index" :label="item"></el-radio-button>
              </el-radio-group>
            </div>
            <div class="filter-type">
              <span class="filter-title">月租价格：</span>
              <el-radio-group v-model="queryData.priceLabel" @change="search" size="small">
                <el-radio-button  v-for="(item, index) in priceList" :key="index" :label="item.label"></el-radio-button>
              </el-radio-group>
            </div>
            <div class="filter-type">
              <span class="filter-title">使用面积：</span>
              <el-radio-group v-model="queryData.areaLabel" @change="search" size="small">
                <el-radio-button  v-for="(item, index) in areaList" :key="index" :label="item.label"></el-radio-button>
              </el-radio-group>
            </div>
            <div class="filter-type">
              <span class="filter-title">付价方式：</span>
              <el-radio-group v-model="queryData.payForm" @change="search" size="small">
                <el-radio-button  v-for="(item, index) in payFormList" :key="index" :label="item"></el-radio-button>
              </el-radio-group>
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
                  <div class="house-title">{{item.id}} {{item.rentType}}·{{item.community}}-{{item.orientation}}</div>
                  <div class="house-location"><i class="el-icon-location" style="color: #ff961e; padding-right: 8px; font-size: 20px"/>{{item.address}}</div>
                  <div class="house-detail">
                    <i class="el-icon-more" style="color: #ff961e; padding-right: 8px; font-size: 20px"/>
                    <span>建筑面积{{item.area}}㎡ | </span>
                    <span>{{item.floor}}层 | </span>
                    <span>{{item.layout}}</span>
                  </div>
                </el-col>
                <el-col :span="7">
                  <div class="house-price">
                    <span class="price-num">{{item.rentPrice}}</span>
                    <span class="price-unit">元/月</span>
                  </div>
                  <el-button type="warning" plain @click="getDetail(item)">查看详情</el-button>
                </el-col>
              </el-row>
            </el-card>
          </div>
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
  name: 'RentDetail',
  inject: ['reload'],
  data () {
    return {
      logined: false,
      avatarImg: '',
      userName: '',
      cardData: [],
      atCity: '',
      cityList: ['北京', '上海', '深圳', '杭州', '南京', '广州', '武汉', '成都', '天津'],
      typeList: ['不限', '合租', '整租'],
      payFormList: ['不限', '月付', '年付'],
      priceList: [
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
            priceStart: '1501',
            priceEnd: '2500'
          }
        },
        {
          label: '2500-4000元',
          value: {
            priceStart: '2501',
            priceEnd: '4000'
          }
        },
        {
          label: '4000-6000元',
          value: {
            priceStart: '4001',
            priceEnd: '6000'
          }
        },
        {
          label: '6000-8000元',
          value: {
            priceStart: '6001',
            priceEnd: '8000'
          }
        },
        {
          label: '8000元以上',
          value: {
            priceStart: '8001',
            priceEnd: ''
          }
        }
      ],
      areaList: [
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
          label: '10-20㎡',
          value: {
            areaStart: '11',
            areaEnd: '20'
          }
        },
        {
          label: '20-30㎡',
          value: {
            areaStart: '21',
            areaEnd: '30'
          }
        },
        {
          label: '30-40㎡',
          value: {
            areaStart: '31',
            areaEnd: '40'
          }
        },
        {
          label: '40㎡以上',
          value: {
            areaStart: '41',
            areaEnd: ''
          }
        }
      ],
      queryData: {
        inputCommunity: '',
        atCity: '',
        rentType: '不限',
        priceLabel: '不限',
        areaLabel: '不限',
        payForm: '不限'
      },
      active1: 0,
      active2: 0,
      active3: 0,
      active4: 0
    }
  },
  created () {
    this.getUserInfo()
    this.search()
  },
  methods: {
    getUserInfo () {
      let userInfo = this.$store.getters.userInfo
      if (userInfo) {
        this.avatarImg = this.userAvatarUrl(userInfo.avatar)
        this.userName = userInfo.name
        this.logined = true

        let type = this.$route.query.rentType
        let inputCommunity = this.$route.query.inputCommunity
        if (type && inputCommunity) {
          this.queryData.rentType = type === '不限' ? '' : type
          this.queryData.inputCommunity = inputCommunity
          this.active1 = this.typeList.indexOf(type)
        }
      }
    },
    userAvatarUrl (img) {
      if (img) {
        return process.env.VUE_APP_RESOURCE_URL + img
      }
      return require('@/assets/imgs/defaultHead.png')
    },
    search () {
      this.queryData.pageNum = 1
      this.getHouseList()
    },
    getHouseList () {
      let params = {
        atCity: this.queryData.atCity,
        rentType: this.queryData.rentType !== '不限' ? this.convertBackRentType(this.queryData.rentType) : '',
        priceStart: '',
        priceEnd: '',
        areaStart: '',
        areaEnd: '',
        payForm: this.queryData.payForm !== '不限' ? this.convertPayForm(this.queryData.payForm) : '',
        inputCommunity: this.queryData.inputCommunity
      }

      this.priceList.forEach(item => {
        if (item.label === this.queryData.priceLabel) {
          params.priceStart = item.value.priceStart
          params.priceEnd = item.value.priceEnd
        }
      })

      this.areaList.forEach(item => {
        if (item.label === this.queryData.areaLabel) {
          params.areaStart = item.value.areaStart
          params.areaEnd = item.value.areaEnd
        }
      })

      this.$ajax.get('/frontend/house/getHouseListByOptions', {
        params: params
      })
        .then(res => {
          this.queryData.totalCount = res.data.msg.totalCount
          this.cardData = res.data.msg.data.table.map(item => {
            item.id = 'House_' + item.id
            item.rentType = this.convertRentType(item.rentType)
            return item
          })
        })
    },
    convertBackRentType (rentType) {
      switch (rentType) {
        case '整租':
          return 'wholeRented'
        case '合租':
          return 'cotenancy'
      }
    },
    convertRentType (rentType) {
      switch (rentType) {
        case 'wholeRented':
          return '整租'
        case 'cotenancy':
          return '合租'
      }
    },
    convertPayForm (payForm) {
      switch (payForm) {
        case '月付':
          return 'byMonth'
        case '年付':
          return 'byYear'
      }
    },
    clearCity () {
      this.atCity = ''
      this.getHouseList()
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
    handleCommand (command) {
      if (command === 'center') {
        this.$router.push('/TenantCenter')
      } else {
        this.$store.dispatch('clearUser')
        if (this.$route.path !== '/') {
          this.$router.push('/')
        }
      }
      this.reload()
    },
    getDetail: function (item) {
      this.$router.push({ path: '/HouseDetail', query: { houseId: Number(item.id.replace(/(^House_*)/g, '')) } })
    }
  }
}
</script>

<style lang="scss">
  .HouseIndexDiv {
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
      width: 88%;
      margin: 0 auto;
    }

    .user-name {
      position: absolute;
      width: 100px;
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
      height: 55px;
    }

    .filter-type .main {
      line-height: 32px;
      font-size: 14px;
      height: 32px;
      padding: 5px 18px;
      cursor: pointer;
    }

    .el-select-dropdown__item.selected {
      color: #ff961e;
    }

    .tagActive {
      border-radius: 6px;
      background: #ff961e;
      color: #fff;
    }

    .house-container {
      margin-top: 40px;
    }

    .el-card__body {
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

    .house-detail .rent-type {
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

    .el-select-dropdown__item.selected {
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

    .header-label {
      color: black;
    }

    .logo {
      width: 160px;
      margin-top: 8px;
      margin-left: 18%;
    }

    .el-dropdown-link {
      margin: 8px;
    }

    .el-radio-button__orig-radio:checked + .el-radio-button__inner {
      color: #FFF;
      background-color: #ff961e;
      border-color: #ff961e;
      box-shadow: -1px 0 0 0 #ff961e;
    }

    .el-radio-button__inner:hover {
      color: #ff961e;
    }

    .el-select-dropdown__item.selected {
      color: #ff961e;
      font-weight: 700;
    }
  }
</style>
