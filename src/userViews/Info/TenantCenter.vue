<template>
  <el-container class="out-container">
    <el-header>
      <info-header @getSettingStatus="getSettingStatus"/>
    </el-header>
    <el-container class="in-container">
      <el-aside width="320px">
        <user-card v-show="isSetting"/>
        <item-card v-show="!isSetting"/>
      </el-aside>
      <el-main>
        <personal-setting v-show="isSetting"/>
        <personal-space v-show="!isSetting"/>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import InfoHeader from './components/InfoHeader'
import UserCard from './components/UserCard'
import PersonalSetting from './components/PersonalSetting'
import ItemCard from './components/ItemCard'
import PersonalSpace from './components/PersonalSpace'

export default {
  name: 'TenantCenter',
  components: { InfoHeader, UserCard, PersonalSetting, ItemCard, PersonalSpace },
  data () {
    return {
      activeName: 'first',
      isSetting: true
    }
  },
  methods: {
    getSettingStatus (msg) {
      this.isSetting = msg
    }
  }
}
</script>

<style scoped>
  /deep/ #app, .out-container {
    background-color: #fdfbf6;
  }

  .in-container {
    margin: 10px 4%;
    border-radius: 5px;
  }

  /deep/ .el-header {
    padding: 0;
  }

  /deep/ .el-main {
    padding: 0;
    margin-left: 10px;
  }

  /deep/ .el-card__header {
    padding: 20px 30px;
    color: #efac27;
  }

  /deep/ .el-card__body {
    padding: 20px 40px 40px 30px;
  }
</style>
