<template>
  <div class="space-content">
    <div class="like" v-show="isCollect">
      <h3 class="like-house">收藏房源</h3>
      <el-table
        :data="likeData" stripe border>
        <el-table-column label="房源信息" width="280px" align="center">
          <template slot-scope="item">
            <el-row>
              <el-col :span="10">
                <img :src="getUrl(item.row.cover)" width="100px">
              </el-col>
              <el-col :span="14">
                <el-row>{{item.row.community}}</el-row>
                <el-row>{{item.row.floor}}层 | {{item.row.area}}㎡ | {{item.row.rentType}}</el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="price"
          label="价格">
        </el-table-column>
        <el-table-column
          align="center"
          prop="status"
          label="状态">
        </el-table-column>
        <el-table-column
          align="center"
          prop="createdAt"
          label="收藏时间">
        </el-table-column>
        <el-table-column
          align="center"
          prop="addCount"
          label="收藏热度">
        </el-table-column>
        <el-table-column align="center" label="操作" width="180px">
          <template slot-scope="scope">
            <el-button plain
                       size="mini"
                       type="warning"
                       @click="goDetail(scope.row)">详情
            </el-button>
            <el-button plain
                       size="mini"
                       type="warning"
                       @click="delCollect(scope.row)">取消
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div class="order" v-show="isOrder">
      <h3 class="order-house">约看订单</h3>
      <el-table
        :data="orderData" stripe border>
        <el-table-column align="center" prop="id" label="约看单号"/>
        <el-table-column align="center" prop="houseId" label="约看房源"/>
        <el-table-column align="center" prop="adminName" label="负责人">
          <template slot-scope="scope">
            <el-popover trigger="hover" placement="top">
              <p>电话: {{ scope.row.phone }}</p>
              <div slot="reference" class="name-wrapper">
                <el-tag size="medium">{{ scope.row.adminName }}</el-tag>
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="orderTime" label="约看时间"/>
        <el-table-column align="center" prop="status" label="约看状态"/>
        <el-table-column  align="center" label="操作" width="180px">
          <template slot-scope="scope">
            <el-button plain size="mini" type="warning" @click="goDetail(scope.row)">详情</el-button>
            <el-button plain size="mini" type="warning" @click="delOrder(scope.row)">取消</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div class="rented" v-show="isContract">
      <h3 class="rented-house">租赁记录</h3>
      <el-table
        :data="rentedData" stripe border>
        <el-table-column align="center" prop="id" label="合同单号"/>
        <el-table-column align="center" prop="houseId" label="房源序号"/>
        <el-table-column align="center" prop="createdAt" label="签约日期"/>
        <el-table-column align="center" prop="endAt" label="到期时间"/>
        <el-table-column align="center" prop="contractStatus" label="合同状态"/>
        <el-table-column  align="center" label="缴费记录">
          <template>
            <el-button size="mini" type="warning">查看</el-button>
          </template>
        </el-table-column>
        <el-table-column  align="center" prop="isDisabled" label="操作" width="160px">
          <template slot-scope="scope">
            <el-button :disabled="scope.row.isDisabled" plain size="mini" type="warning" @click="renewal(scope.$index, scope.row)">申请续签</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import Bus from '../../../assets/js/bus.js'
export default {
  name: 'PersonalSpace',
  inject: ['reload'],
  data () {
    return {
      uploadUrl: process.env.VUE_APP_BASE_URL + '/file/upload',
      likeData: [
        {
          houseId: '',
          community: '',
          floor: '',
          area: '',
          rentType: '',
          price: '',
          status: '',
          createdAt: '',
          addCount: ''
        }
      ],
      orderData: [
        {
          id: '',
          houseId: '',
          adminName: '',
          phone: '',
          orderTime: '',
          status: ''
        }
      ],
      rentedData: [
        {
          id: '',
          houseId: '',
          createdAt: '',
          endAt: '',
          contractStatus: '',
          isDisabled: false
        }
      ],
      isCollect: true,
      isOrder: false,
      isContract: false,
      isPay: false
    }
  },
  created () {
    this.getLikeData()
    this.getOrderData()
    this.getRentedData()
  },
  mounted () {
    Bus.$on('isActive', this.dealBusData)
  },

  beforeDestroy: function () {
    Bus.$off('isActive', this.dealBusData)
  },
  methods: {
    getUrl (img) {
      if (img) {
        return process.env.VUE_APP_RESOURCE_URL + img
      } else {
        return require('@/assets/imgs/defaultHead.png')
      }
    },
    dealBusData: function (val) {
      switch (val) {
        case 1: {
          this.isCollect = true
          this.isOrder = false
          this.isContract = false
          this.isPay = false
          break
        }
        case 2: {
          this.isCollect = false
          this.isOrder = true
          this.isContract = false
          this.isPay = false
          break
        }
        case 3: {
          this.isCollect = false
          this.isOrder = false
          this.isContract = true
          this.isPay = false
          break
        }
        case 4: {
          this.isCollect = false
          this.isOrder = false
          this.isContract = false
          this.isPay = true
          break
        }
      }
    },
    getLikeData: function () {
      this.$ajax.get('house/likeList', {
        params: {
          email: sessionStorage.getItem('email')
        }
      })
        .then(res => {
          let addNumMap = {}
          res.data.msg.addNum.table.forEach(numItem => {
            addNumMap[numItem.houseId] = numItem.count
          })

          let objects = []
          res.data.msg.self.table.forEach(item => {
            let temp = item
            temp.price = '￥' + temp.price + '/月'
            temp.createdAt = this.$moment(temp.createdAt).format('YYYY-MM-DD')
            temp['addCount'] = addNumMap[item.houseId]
            objects.push(temp)
          })
          this.likeData = objects
        })
    },
    goDetail: function (row) {
      this.$router.push({ path: '/HouseDetail', query: { houseId: Number(row.houseId.replace(/(^H_*)/g, '')) } })
    },
    delCollect: function (row) {
      this.$ajax.post('/house/delCollect', {
        houseId: row.houseId,
        email: row.email
      })
        .then(res => {
          if (res.data.success) {
            this.$message.success({
              message: '已取消收藏！'
            })
            this.reload()
          }
        })
    },
    getOrderData: function () {
      this.$ajax.get('house/orderList', {
        params: {
          email: sessionStorage.getItem('email')
        }
      })
        .then(res => {
          this.orderData = res.data.msg.table.map(item => {
            item.id = 'OS_' + item.id
            item.houseId = 'H_' + item.houseId
            item.orderTime = this.$moment(item.orderTime).format('YYYY-MM-DD')
            return item
          })
        })
    },
    delOrder: function (row) {
      this.$ajax.post('/house/delOrder', {
        houseId: Number(row.houseId.replace(/(^H_*)/g, '')),
        email: row.email
      })
        .then(res => {
          if (res.data.success) {
            this.$message.success({
              message: '已取消约看！'
            })
            this.reload()
          }
        })
    },
    getRentedData: function () {
      this.$ajax.get('house/rentedList', {
        params: {
          email: sessionStorage.getItem('email')
        }
      })
        .then(res => {
          this.rentedData = res.data.msg.table.map(item => {
            item.id = 'C_' + item.id
            item.houseId = 'H_' + item.houseId
            item.createdAt = this.$moment(item.createdAt).format('YYYY-MM-DD')
            item.endAt = this.$moment(item.endAt).format('YYYY-MM-DD')
            return item
          })
        })
    },
    renewal: function (index, row) {
      console.log(row.id)
      row.isDisabled = true
      this.$ajax.post('/contract/applyTenantRenewal', {
        parentNum: Number(row.id.replace(/(^C_*)/g, ''))
      })
        .then(res => {
          if (res.data.success) {
            this.$message.success({
              message: '已申请续约！'
            })
          }
        })
    }
  }
}
</script>

<style>
  .space-content {
    padding: 0 40px;
    background-color: white;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
    border: 1px solid #EBEEF5;
    height: 555px;
    border-radius: 5px;
  }

  .like, .order, .rented {
    width: 100%;
  }
  .like-house, .order-house, .rented-house {
    font-size: 25px;
    font-weight: 500;
    color: #666;
  }
</style>
