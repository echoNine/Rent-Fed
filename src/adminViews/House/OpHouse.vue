<template>
  <div>
    <el-row class="searchTag">
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
      <span class="head">类型</span>
      <span v-for="(item,index) in type" :key="index" class="main" @click="getType(index, item)"
            :class="active1 == index ? 'addclass' : '' ">
        {{ item }}
      </span>
    </div>
    <div class="tag">
      <span class="head">房源状态</span>
      <span v-for="(item,index) in status" :key="index" class="main" @click="getStatus(index, item)"
            :class="active2 == index ? 'addclass' : '' ">
        {{ item }}
      </span>
    </div>
    <div class="tag">
      <span class="head">租金</span>
      <span v-for="(item, index) in price" :key="index" class="main" @click="getPrice(index, item.value)"
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
                <span>{{item.price}}</span>
                <span>/月</span>
              </el-col>
            </el-row>
            <el-row class="map">
              <span class="el-icon-location">{{item.address}}</span>
            </el-row>
            <div style="float: right; margin-bottom: 18px;">
              <el-button type="info" plain size="mini">详情</el-button>
              <el-button type="danger" plain size="mini" @click="dropHouse(item)">删除</el-button>
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
        community: '',
        orientation: '',
        area: '',
        floor: '',
        price: '',
        address: ''
      }],
      type: ['不限', '合租', '整租'],
      status: ['不限', '空闲', '已租用', '未激活'],
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
      input: '',
      select: '',
      active1: 0,
      active2: 0,
      active3: 0,
      queryData: {
        userId: '',
        userName: '',
        type: '',
        status: '',
        priceStart: '',
        priceEnd: '',
        pageNum: 1,
        pageSize: 2,
        totalCount: 0
      }
    }
  },
  created: function () {
    this.search()
  },
  methods: {
    pageChange (val) {
      this.queryData.pageNum = val
      this.getHouseList()
    },
    search () {
      this.queryData.pageNum = 1
      this.getHouseList()
    },
    handleClear () {
      this.select = ''
      this.input = ''
      this.queryData.pageNum = 1
      this.getHouseList()
    },
    getHouseList: function () {
      if (this.select === '1') {
        this.queryData.userId = Number(this.input.replace(/(^O_*)/g, ''))
        this.queryData.userName = ''
      } else if (this.select === '2') {
        this.queryData.userId = ''
        this.queryData.userName = Number(this.input.replace(/(^H_*)/g, ''))
      } else {
        this.queryData.userId = ''
        this.queryData.userName = ''
      }
      this.$ajax.get('/house/houseList', {
        params: {
          userId: this.queryData.userId,
          userName: this.queryData.userName,
          rentType: this.queryData.type,
          houseStatus: this.queryData.status,
          priceStart: this.queryData.priceStart,
          priceEnd: this.queryData.priceEnd,
          pageNum: this.queryData.pageNum,
          pageSize: this.queryData.pageSize
        }
      })
        .then(res => {
          this.queryData.totalCount = res.data.msg.totalCount
          this.cardData = res.data.msg.data.table
        })
    },
    getUrl (img) {
      return process.env.VUE_APP_RESOURCE_URL + img
    },
    getType (index, rentType) {
      this.queryData.type = rentType === '不限' ? '' : rentType
      this.active1 = index
      this.search()
    },
    getStatus (index, houseStatus) {
      this.queryData.status = houseStatus === '不限' ? '' : houseStatus
      this.active2 = index
      this.search()
    },
    getPrice (index, price) {
      this.queryData.priceStart = price.priceStart
      this.queryData.priceEnd = price.priceEnd
      this.active3 = index
      this.search()
    },
    dropHouse: function (item) {
      this.$loading({ text: '正在删除, 请稍等...' })
      this.$ajax.post('/house/dropHouse', {
        id: item.id
      })
        .then(res => {
          if (res.data) {
            this.$message.success({
              duration: 1000,
              message: '删除成功！',
              onClose: () => {
                this.$loading().close()
                this.reload()
              }
            })
          } else {
            this.$message.error({
              message: '已激活房源不可直接删除..',
              onClose: () => {
                this.$loading().close()
                this.reload()
              }
            })
          }
        })
        .catch(() => {
          this.$loading().close()
        })
    }
  }
}
</script>

<style>
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
    border: 1px solid #e2e2e2;
    border-radius: 5px;
    background-color: #fff;
    padding: 3px 20px;
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
</style>
