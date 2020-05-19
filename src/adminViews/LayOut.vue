<template>
  <div class="LayOutDiv">
    <el-container class="home-container">
      <el-header>
        <div>
          <img src="../assets/imgs/logo.png" width="40px"/>
          <span>Fox后台管理系统</span>
        </div>
        <el-dropdown @command="handleCommand" class="icon">
        <span class="el-dropdown-link">
              <el-avatar class="el-dropdown-link" :src="this.avatarImg"/>
              <span class="name">{{this.name}}</span>
            </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="center">个人中心</el-dropdown-item>
            <el-dropdown-item command="exit">退出</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-header>
      <el-container>
        <el-aside :width="asideWidth">
          <div class="toggle-button" @click="toggleCollapse">|||</div>
          <el-menu
            background-color="#373d41"
            text-color="#fff"
            active-text-color="rgb(64, 158, 255)"
            :default-active="activeIndex"
            :unique-opened="true"
            :collapse-transition="false"
            router
            :collapse="!sidebar.opened"
            mode="vertical"
          >
            <NavMenu :navMenus="menuData" :opened="sidebar.opened"></NavMenu>
          </el-menu>
        </el-aside>
        <el-main>
          <bread-crumb></bread-crumb>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import NavMenu from '../components/NavMenu.vue'
import BreadCrumb from '../components/BreadCrumb.vue'

import { routers } from '../router'
export default {
  inject: ['reload'],
  components: {
    NavMenu,
    BreadCrumb
  },
  data () {
    return {
      activeIndex: '',
      menuData: [],
      sidebar: {
        opened: true
      },
      asideWidth: '210px',
      name: '',
      avatarImg: ''
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
  mounted () {
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
    this.$ajax.get('/backend/admin/getAdminInfo')
      .then(res => {
        if (res.data.msg.table.length > 0) {
          this.name = res.data.msg.table[0].name
          if (res.data.msg.table[0].avatar) {
            this.avatarImg = this.getUrl(res.data.msg.table[0].avatar)
          } else {
            this.avatarImg = require('@/assets/imgs/defaultHead.png')
          }
        } else {
          this.$message.error('登陆过期, 请重新登陆')
          this.$router.push('/Login')
        }
      })
  },
  methods: {
    toggleCollapse () {
      this.sidebar.opened = !this.sidebar.opened
      this.asideWidth = this.sidebar.opened ? '210px' : ''
      let dataIndex = document.querySelectorAll('i')
      for (let i = 0; i < dataIndex.length; i++) {
        if (!dataIndex[i].getAttribute('display')) {
          dataIndex[i].setAttribute('display', 'none')
        }
      }
    },
    getUrl (img) {
      return process.env.VUE_APP_RESOURCE_URL + img
    },
    handleCommand (command) {
      if (command === 'center') {
        this.$router.push('/TenantCenter')
      } else {
        this.$router.push('/Login')
        this.reload()
      }
    }
  }
}
</script>

<style lang="scss">
  .LayOutDiv {
    width: 100%;
    height: 100%;
    .home-container {
      height: 100%;
    }
    .el-header {
      background-color: #373d41;
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: #fff;
      font-size: 20px;
    }
    .el-header div {
      display: flex;
      align-items: center;
    }
    .el-header div span {
      margin-left: 15px;
    }

    .el-aside {
      background-color: #373d41;
    }
    .el-aside .el-menu {
      border-right: none;
    }

    .toggle-button {
      background-color: #46474a;
      font-size: 10px;
      line-height: 40px;
      color: #fff;
      text-align: center;
      letter-spacing: 0.2em;
      cursor: pointer;
    }

    .el-main {
      padding-top: 5px;
      background-color: #f5f5f5;
    }

    .icon {
      margin-right: 6%;
    }

    .name {
      color: #fff;
      position: absolute;
      width: 42px;
      top: 12px;
    }
  }
</style>
