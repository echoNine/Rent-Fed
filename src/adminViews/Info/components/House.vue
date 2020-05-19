<template>
  <div class="HouseDiv">
    <el-row>
      <el-col :span="11" v-for="(item,index) in cardData" :key="index" style="margin: 0 15px">
        <el-card :body-style="{ padding: '0px'}" shadow="hover">
          <img :src="getUrl(item.cover)" class="image">
          <div style="padding: 15px 20px;">
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
                <span>{{item.rentPrice}}</span>
                <span>/月</span>
              </el-col>
            </el-row>
            <el-row class="map">
              <span class="el-icon-location">{{item.address}}</span>
            </el-row>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>

export default {
  data: function () {
    return {
      cardData: []
    }
  },

  created: function () {
    this.getHouseData()
  },

  methods: {
    getUrl (img) {
      return process.env.VUE_APP_RESOURCE_URL + img
    },
    getHouseData: function () {
      this.$ajax.get('/backend/house/getHouseListOfAdmin')
        .then(res => {
          this.cardData = res.data.msg.table.map(item => {
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
    }
  }
}
</script>

<style lang="scss">
  .HouseDiv {
    width: 100%;
    height: 100%;
    .image {
      width: 100%;
      height: 240px;
      display: block;
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
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

</style>
