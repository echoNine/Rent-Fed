<template>
  <div class="PersonCenterDiv">
    <div class="app-container">
      <div v-if="user">
        <el-row :gutter="20">
          <el-col :span="7" :xs="24">
            <user-card :user="user" />
          </el-col>

          <el-col :span="17" :xs="24">
            <el-card>
              <el-tabs v-model="activeTab">
                <el-tab-pane label="房源" name="House">
                  <house />
                </el-tab-pane>
                <el-tab-pane label="合同" name="Contract">
                  <contract />
                </el-tab-pane>
              </el-tabs>
            </el-card>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
import UserCard from './components/UserCard'
import House from './components/House'
import Contract from './components/Contract'
export default {
  name: 'PersonalCenter',
  components: { UserCard, House, Contract },
  data () {
    return {
      user: {},
      activeTab: 'House'
    }
  },
  created () {
    this.getUser()
  },
  methods: {
    getUser () {
      this.user = {
        name: '袁安婷'
      }
    }
  }
}
</script>
<style lang="scss">
  .PersonCenterDiv {
    width: 100%;
    height: 100%;
  }
</style>
