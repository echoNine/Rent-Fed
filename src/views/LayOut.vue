<template>
  <el-container style="height:100%">
    <el-aside width="200px" style="background-color: rgb(84, 92, 100)">
      <el-menu
        background-color="#545c64"
        text-color="#fff"
        active-text-color="rgb(64, 158, 255)"
        :default-active="activeIndex"
        :unique-opened="true"
        router
      >
        <NavMenu :navMenus="menuData" style="width: 200px"></NavMenu>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header>
        <el-row>
          <el-col :span="22">
            <BreadCrumb></BreadCrumb>
          </el-col>
          <el-col :span="2">
            <el-dropdown @command="handleCommand">
              <el-avatar class="el-dropdown-link " icon="el-icon-user-solid"></el-avatar>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="a">黄金糕</el-dropdown-item>
                <el-dropdown-item command="b">狮子头</el-dropdown-item>
                <el-dropdown-item command="c">螺蛳粉</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </el-col>
        </el-row>
      </el-header>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import NavMenu from '../components/NavMenu.vue'
import BreadCrumb from '../components/BreadCrumb'
import { routers } from '../router'

export default {
  components: {
    NavMenu: NavMenu,
    BreadCrumb: BreadCrumb
  },
  data () {
    return {
      activeIndex: '',
      menuData: []
    }
  },
  watch: {
    $route: {
      handler: function (route) {
        this.activeIndex = this.$route.path
      },
      immediate: true
    }
  },
  created () {
    this.activeIndex = this.$route.path
    let menuData = routers.routes.map(routes => {
      if (routes.meta === undefined) return
      let layer = {}
      let entity = {
        name: routes.path,
        alias: routes.meta.title,
        icon: routes.meta.icon,
        value: ''
      }
      let children = []
      if (routes.children === undefined) return []
      routes.children.forEach(route => {
        if (route.path === routes.path) return
        let item = {
          name: routes.path + '/' + route.path,
          alias: route.meta.title,
          icon: '',
          value: ''
        }
        children.push({ entity: item })
      })
      layer.entity = entity
      if (children.length) {
        layer.children = children
      }
      return layer
    }).filter(item => item)
    this.menuData = menuData
  },
  methods: {
    handleCommand (command) {
      this.$message('click on item ' + command)
    }
  }
}
</script>

<style scoped>
  .el-menu {
    border: none;
    text-align: left;
  }

  .el-header {
    border-bottom: 1.5px solid rgba(197, 197, 197, 0.41);
  }

  .el-dropdown-link {
    cursor: pointer;
    margin-top: 10px;
  }

  .el-icon-arrow-down {
    font-size: 12px;
  }
</style>
