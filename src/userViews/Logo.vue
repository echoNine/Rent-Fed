<template>
  <img src="../assets/imgs/logo2.png" class="logo" @click="toHome">
</template>

<script>
export default {
  name: 'Logo',
  methods: {
    toHome () {
      if (this.$route.path !== '/') {
        this.$router.push('/')
      }
    }
  }
}
</script>

<style scoped>
  .logo {
    width: 160px;
    margin-top: 8px;
    margin-left: 18%;
    cursor: pointer;
  }
</style>
