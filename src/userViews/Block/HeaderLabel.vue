<template>
  <ul class="header-label">
    <li @click="toIndex" class="header-label-li" :class="activeIndex === 0 ? 'active' : ''">首页</li>
    <li @click="toHouseIndex" class="header-label-li" :class="activeIndex === 1 ? 'active' : ''">租房</li>
    <li @click="toBeOwner" class="header-label-li" v-if="!isOwner" :class="activeIndex === 2 ? 'active' : ''">成为房主</li>
    <li @click="leaseCommission" class="header-label-li" :class="activeIndex === 2 ? 'active' : ''" v-else>申请委托房源</li>
  </ul>
</template>

<script>
export default {
  name: 'HeaderLabel',
  props: {
    activeIndex: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      isOwner: this.$store.getters.userInfo ? this.$store.getters.userInfo.type === 'owner' : false
    }
  },
  methods: {
    toIndex () {
      this.$router.push('/')
    },

    toHouseIndex () {
      this.$router.push('/HouseIndex')
    },

    toBeOwner () {
      this.$router.push('/toBeOwner')
    },

    leaseCommission () {
      this.$router.push('/leaseCommission')
    }
  }
}
</script>

<style>
  .header-label {
    list-style: none;
    height: 26px;
    line-height: 26px;
    color: #fff;
  }
  .header-label-li {
    float: left;
    margin-right: 50px;
    font-size: 15px;
    font-weight: 500;
    cursor: pointer;
  }
  .header-label .active {
    border-bottom: 2px solid #ff961e;
  }

  .header-label .header-label-li :hover {
    border-bottom: 2px solid #ff961e;
  }
</style>
