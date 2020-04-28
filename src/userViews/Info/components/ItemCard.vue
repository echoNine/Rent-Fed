<template>
  <el-card>
    <ul class="itemUL">
      <li @click="showCollect" :class="this.isCollect ? 'addShowLi' : '' "><i class="el-icon-mylike"/>我的收藏</li>
      <li @click="showOrder" :class="this.isOrder ? 'addShowLi' : '' "><i class="el-icon-myorder"/>我的约看</li>
      <li @click="showContract" :class="this.isContract ? 'addShowLi' : '' "><i class="el-icon-mycontract"/>我的合同</li>
      <li @click="showPay" :class="this.isPay ? 'addShowLi' : '' "><i class="el-icon-mypay"/>缴费记录</li>
    </ul>
  </el-card>
</template>

<script>
import Bus from '../../../assets/js/bus.js'
export default {
  name: 'ItemCard',
  data () {
    return {
      isCollect: true,
      isOrder: false,
      isContract: false,
      isPay: false
    }
  },
  methods: {
    showCollect () {
      this.isCollect = true
      this.isOrder = false
      this.isContract = false
      this.isPay = false
      Bus.$emit('isActive', 1)
    },
    showOrder () {
      this.isCollect = false
      this.isOrder = true
      this.isContract = false
      this.isPay = false
      Bus.$emit('isActive', 2)
    },
    showContract () {
      this.isCollect = false
      this.isOrder = false
      this.isContract = true
      this.isPay = false
      Bus.$emit('isActive', 3)
    },
    showPay () {
      this.isCollect = false
      this.isOrder = false
      this.isContract = false
      this.isPay = true
      Bus.$emit('isActive', 4)
    }
  }
}
</script>

<style>
  .itemUL {
    list-style: none;
    display: block;
    font-size: 16px;
    color: #666;
  }

  .itemUL li {
    line-height: 45px;
    padding: 0 10px 0 20px;
    border: 2px solid transparent;
  }

  .itemUL li:hover {
    background-color: #fdfbf6;
    cursor: pointer;
    color: #ffba15;
    border: 2px solid #f6f4ef;
  }

  .addShowLi {
    background-color: #fdfbf6;
    cursor: pointer;
    color: #ffba15;
    border: 2px solid #f6f4ef;
  }
  .itemUL i {
    padding-right: 10px;
  }
</style>
