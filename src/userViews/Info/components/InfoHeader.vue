<template>
  <div class="header">
    <el-row>
      <el-col :span="6">
        <logo></logo>
      </el-col>
      <el-col :span="14">
        <ul>
          <li @click="showSetting" :class="this.isSetting ? 'addLi' : '' ">我的资料</li>
          <li @click="showSpace" :class="!this.isSetting ? 'addLi' : '' ">我的空间</li>
        </ul>
      </el-col>
      <el-col :span="4" style="line-height: 60px">
        <el-button type="warning" size="small" @click="toIndex">返回首页</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Logo from '../../Logo'

export default {
  components: {
    Logo
  },
  name: 'InfoHeader',
  data () {
    return {
      activeName: 'first',
      isSetting: true
    }
  },
  methods: {
    toIndex () {
      this.$router.push('/')
    },

    showSetting () {
      this.isSetting = true
    },

    showSpace () {
      this.isSetting = false
    }
  },

  watch: {
    'isSetting': function () {
      this.$emit('getSettingStatus', this.isSetting)
    }
  }
}
</script>

<style>
  .header {
    background-color: white;
    width: 100%;
    box-shadow: 0 2px 8px 0 rgba(0, 0, 0, .08);
  }

  .logo {
    width: 160px;
    margin-top: 8px;
    margin-left: 16%;
  }

  .header ul {
    list-style: none;
    height: 26px;
    line-height: 26px;
  }

  .header ul li {
    float: left;
    margin-right: 50px;
    font-size: 15px;
    font-weight: 500;
    color: black;
    cursor: pointer;
  }

  .header ul li:hover {
    border-bottom: 2px solid #ff961e;
  }

  .addLi {
    border-bottom: 2px solid #ff961e;
  }
</style>
