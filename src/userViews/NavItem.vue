<template>
  <ul>
    <li @click="toIndex">首页</li>
    <li @click="toHouseIndex">租房</li>
    <li @click="toBeOwner">成为房主</li>
  </ul>
</template>

<script>
export default {
  name: 'NavItem',

  methods: {
    toIndex () {
      this.$router.push('/')
    },
    toHouseIndex () {
      this.$router.push('/HouseIndex')
    },
    toBeOwner () {
      this.$router.push('/toBeOwner')
    }
  }
}
</script>

<style>

</style>
