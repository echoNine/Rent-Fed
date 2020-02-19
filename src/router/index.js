import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

export const routers = {
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/Login.vue')
    },
    {
      path: '/ShowData',
      component: () => import('../views/LayOut.vue'),
      meta: {
        icon: 'el-icon-s-data',
        title: '数据统计'
      },
      children: [
        {
          path: '/ShowData',
          name: 'ShowData',
          component: () => import('../views/ShowData.vue')
        }
      ]
    },
    {
      path: '/InfoSetting',
      component: () => import('../views/LayOut.vue'),
      meta: {
        icon: 'el-icon-setting',
        title: '信息设置'
      },
      children: [
        {
          path: '/InfoSetting',
          name: 'InfoSetting',
          component: () => import('../views/InfoSetting.vue')
        }
      ]
    },
    {
      path: '/User',
      component: () => import('../views/LayOut.vue'),
      meta: {
        icon: 'el-icon-user-solid',
        title: '用户管理'
      },
      children: [
        {
          path: 'Owner',
          name: 'Owner',
          meta: {
            title: '房主管理'
          },
          component: () => import('../views/User/Owner.vue')
        },
        {
          path: 'Tenant',
          name: 'Tenant',
          meta: {
            title: '租户管理'
          },
          component: () => import('../views/User/Tenant.vue')
        }
      ]
    },
    {
      path: '/House',
      component: () => import('../views/LayOut.vue'),
      meta: {
        icon: 'el-icon-office-building',
        title: '房源管理'
      },
      children: [
        {
          path: 'OpHouse',
          name: 'OpHouse',
          meta: {
            title: '房源列表'
          },
          component: () => import('../views/House/OpHouse.vue')
        },
        {
          path: 'AddHouse',
          name: 'AddHouse',
          meta: {
            title: '发布房源'
          },
          component: () => import('../views/House/AddHouse.vue')
        }
      ]
    },
    {
      path: '/Contract',
      component: () => import('../views/LayOut.vue'),
      meta: {
        icon: 'el-icon-notebook-2',
        title: '合同管理'
      },
      children: [
        {
          path: 'WithOwner',
          name: 'WithOwner',
          meta: {
            title: '委托招租合同'
          },
          component: () => import('../views/Contract/WithOwner.vue')
        },
        {
          path: 'WithTenant',
          name: 'WithTenant',
          meta: {
            title: '房屋租赁合同'
          },
          component: () => import('../views/Contract/WithTenant.vue')
        }
      ]
    },
    {
      path: '/Finance',
      component: () => import('../views/LayOut.vue'),
      meta: {
        icon: 'el-icon-money',
        title: '财务管理'
      },
      children: [
        {
          path: 'RentOut',
          name: 'RentOut',
          meta: {
            title: '委托招租财务'
          },
          component: () => import('../views/Finance/RentOut.vue')
        },
        {
          path: 'RentIn',
          name: 'RentIn',
          meta: {
            title: '房屋出租财务'
          },
          component: () => import('../views/Finance/RentIn.vue')
        }
      ]
    }
  ]
}

export default new VueRouter(routers)
