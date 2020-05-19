<template>
  <div class="OpHouseDiv"><el-row class="searchTag">
    <el-col :span="15">
      <el-input placeholder="请输入内容" v-model="input" @clear="handleClear" clearable>
        <el-select v-model="select" slot="prepend" placeholder="请选择">
          <el-option label="房主编号" value="1"></el-option>
          <el-option label="房主姓名" value="2"></el-option>
        </el-select>
        <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
      </el-input>
    </el-col>
  </el-row>
    <div class="tag">
      <span class="head">城市</span>
      <el-select v-model="atCity" placeholder="请选择" @change="getCity" clearable @clear="clearCity">
        <el-option
          v-for="(item,index) in cityList"
          :key="index"
          :label="item"
          :value="item">
        </el-option>
      </el-select>
    </div>
    <div class="tag">
      <span class="head">类型</span>
      <span v-for="(item,index) in typeList" :key="index" class="main" @click="getRentType(index, item)"
            :class="active1 == index ? 'addclass' : '' ">
        {{ item }}
      </span>
    </div>
    <div class="tag">
      <span class="head">房源状态</span>
      <span v-for="(item,index) in statusList" :key="index" class="main" @click="getRentStatus(index, item)"
            :class="active2 == index ? 'addclass' : '' ">
        {{ item }}
      </span>
    </div>
    <div class="tag">
      <span class="head">租金</span>
      <span v-for="(item, index) in priceList" :key="index" class="main" @click="getRentPrice(index, item.value)"
            :class="active3 == index ? 'addclass' : '' ">
        {{ item.label }}
      </span>
    </div>
    <el-row>
      <el-col :span="7" v-for="(item,index) in cardData" :key="index" style="margin: 15px 22px;">
        <el-card :body-style="{ padding: '0px'}" shadow="hover">
          <img :src="getUrl(item.cover)" class="image">
          <div style="padding: 15px 20px">
            <el-row class="title">
              <span>{{item.id}} </span>
              <span>{{item.rentType}}</span>
              <span> - </span>
              <span>{{item.community}}</span>
              <span> - </span>
              <span>{{item.orientation}}</span>
            </el-row>
            <el-row>
              <el-col :span="12" class="detail">
                <span>{{item.area}}</span>
                <span>㎡ | </span>
                <span>{{item.floor}}</span>
                <span>层</span>
              </el-col>
              <el-col :span="12" class="price">
                <span>￥</span>
                <span>{{item.rentPrice}}</span>
                <span>/月</span>
              </el-col>
            </el-row>
            <el-row class="map">
              <span class="el-icon-location">{{item.address}}</span>
            </el-row>
            <div style="float: right; margin-bottom: 18px;">
              <el-button type="info" plain size="mini" @click="getDetail(item)">详情</el-button>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-pagination
      @current-change="pageChange"
      background
      layout="prev, pager, next"
      :page-size="queryData.pageSize"
      :total="queryData.totalCount">
    </el-pagination>
  </div>
</template>

<script>
export default {
  name: 'OpHouse',
  inject: ['reload'],
  data () {
    return {
      cardData: [{
        cover: '',
        rentType: '',
        community: '',
        orientation: '',
        area: '',
        floor: '',
        rentPrice: '',
        address: ''
      }],
      atCity: '',
      cityList: ['北京', '上海', '深圳', '杭州', '南京', '广州', '武汉', '成都', '天津'],
      typeList: ['不限', '合租', '整租'],
      statusList: ['不限', '未发布', '空闲', '已租用'],
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
      input: '',
      select: '',
      active1: 0,
      active2: 0,
      active3: 0,
      queryData: {
        userId: '',
        userName: '',
        atCity: '',
        rentType: '',
        rentStatus: '',
        priceStart: '',
        priceEnd: '',
        pageNum: 1,
        pageSize: 6,
        totalCount: 0
      }
    }
  },
  created: function () {
    this.search()
  },
  methods: {
    search () {
      this.queryData.pageNum = 1
      this.getHouseList()
    },
    getHouseList: function () {
      if (this.select === '1') {
        this.queryData.userId = Number(this.input.replace(/(^Owner_*)/g, ''))
        this.queryData.userName = ''
      } else if (this.select === '2') {
        this.queryData.userId = ''
        this.queryData.userName = this.input
      } else {
        this.queryData.userId = ''
        this.queryData.userName = ''
      }
      this.$ajax.get('/backend/house/getHouseListByOptions', {
        params: {
          userId: this.queryData.userId,
          userName: this.queryData.userName,
          atCity: this.queryData.atCity,
          rentType: this.convertBackRentType(this.queryData.rentType),
          rentStatus: this.convertRentStatus(this.queryData.rentStatus),
          priceStart: this.queryData.priceStart,
          priceEnd: this.queryData.priceEnd,
          pageNum: this.queryData.pageNum,
          pageSize: this.queryData.pageSize
        }
      })
        .then(res => {
          this.queryData.totalCount = res.data.msg.totalCount
          this.cardData = res.data.msg.data.table.map(item => {
            if (item.rentStatus === 'activated') {
              item.cover = ''
            }
            item.id = 'House_' + item.id
            item.rentType = this.convertRentType(item.rentType)
            return item
          })
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
    convertBackRentType (rentType) {
      switch (rentType) {
        case '整租':
          return 'wholeRented'
        case '合租':
          return 'cotenancy'
      }
    },
    convertRentStatus (rentStatus) {
      switch (rentStatus) {
        case '未发布':
          return 'activated'
        case '空闲':
          return 'empty'
        case '已租用':
          return 'rented'
      }
    },
    getUrl (img) {
      if (img) {
        return process.env.VUE_APP_RESOURCE_URL + img
      }
      return require('@/assets/imgs/defalutHouse.png')
    },
    getCity () {
      this.queryData.atCity = this.atCity
      this.search()
    },
    getRentType (index, rentType) {
      this.queryData.rentType = rentType === '不限' ? '' : rentType
      this.active1 = index
      this.search()
    },
    getRentStatus (index, rentStatus) {
      this.queryData.rentStatus = rentStatus === '不限' ? '' : rentStatus
      this.active2 = index
      this.search()
    },
    getRentPrice (index, rentPrice) {
      this.queryData.priceStart = rentPrice.priceStart
      this.queryData.priceEnd = rentPrice.priceEnd
      this.active3 = index
      this.search()
    },
    pageChange (val) {
      this.queryData.pageNum = val
      this.getHouseList()
    },
    clearCity () {
      this.atCity = ''
      this.getHouseList()
    },
    handleClear () {
      this.select = ''
      this.input = ''
      this.queryData.pageNum = 1
      this.getHouseList()
    },
    getDetail: function (item) {
      this.$router.push({ path: '/AdminHouseDetail', query: { houseId: Number(item.id.replace(/(^House_*)/g, '')) } })
    }
  }
}
</script>

<style lang="scss">
  .OpHouseDiv {
    .image {
      width: 100%;
      height: 240px;
      display: block;
    }

    .searchTag {
      margin: 15px 0px 25px 26px;
    }

    .el-select .el-input {
      width: 130px;
    }

    .input-with-select .el-input-group__prepend {
      background-color: #fff;
    }

    .title {
      font-weight: bold;
      font-size: 17px;
      margin-bottom: 2px;
    }

    .title:hover {
      color: rgb(64, 158, 255);
      cursor: pointer;
    }

    .detail {
      color: rgba(0, 0, 0, .4);
      font-size: 14px;
      line-height: 2.5em;
    }

    .price {
      color: rgb(64, 158, 255);
      text-align: right;
      font-size: 22px;
    }

    .map {
      color: rgba(0, 0, 0, .4);
      font-size: 14px;
      line-height: 1.6em;
      margin-bottom: 15px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .tag {
      font-size: 15px;
      margin: 0px 23px 15px 26px;
      line-height: 40px;
      border-bottom: 2px solid #e2e2e2;
      padding: 3px 20px 10px;
    }

    .head {
      font-weight: bold;
      margin-right: 30px;
    }

    .main {
      color: rgba(0, 0, 0, .6);
      margin-right: 20px;
    }

    .main:hover {
      cursor: pointer;
      color: rgb(64, 158, 255);
    }

    .addclass {
      color: rgb(64, 158, 255);
    }
  }
</style>
