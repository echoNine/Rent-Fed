<template>
    <el-breadcrumb separator-class="el-icon-arrow-right" class="app-breadcrumb">
    <el-breadcrumb-item :to="{ path: '/ShowData' }">首页</el-breadcrumb-item>
    <transition-group name="breadcrumb">
      <el-breadcrumb-item v-for="(item, index) in list" :key="index" :to="{path: item.path}" style="pointer-events: none;">{{item.name}}</el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>

<script>
export default {
  name: 'BreadCrumb',
  data () {
    return {
      list: []
    }
  },
  watch: {
    $route: {
      handler: function (route) {
        this.list = []
        let uniques = []
        route.matched.forEach(item => {
          let trimPath = item.path.replace('/', '')
          if (uniques.indexOf(trimPath) !== -1) {
            return
          }
          uniques.push(trimPath)
          this.list.push({ name: item.meta.title, path: item.path })
        })
      },
      immediate: true
    }
  }
}
</script>

<style>
  .app-breadcrumb {
    font-size: 14px;
    line-height: 60px;
    margin-left: 8px;
  }
  .el-breadcrumb__inner.is-link {
    font-weight: normal;
  }
</style>
