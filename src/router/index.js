import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

export const routers = {
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/Login',
      name: 'Login',
      component: () => import('../adminViews/Login.vue')
    },
    {
      path: '/AdminHouseDetail',
      name: 'AdminHouseDetail',
      component: () => import('../adminViews/House/AdminHouseDetail.vue')
    },
    {
      path: '/ShowData',
      component: () => import('../adminViews/LayOut.vue'),
      meta: {
        icon: 'el-icon-s-data',
        title: '数据统计'
      },
      children: [
        {
          path: '/ShowData',
          name: 'ShowData',
          component: () => import('../adminViews/Data/ShowData.vue')
        }
      ]
    },
    {
      path: '/Info',
      component: () => import('../adminViews/LayOut.vue'),
      meta: {
        icon: 'el-icon-setting',
        title: '个人中心'
      },
      children: [
        {
          path: 'PersonalCenter',
          name: 'PersonalCenter',
          meta: {
            title: '个人空间'
          },
          component: () => import('../adminViews/Info/PersonalCenter.vue')
        },
        {
          path: 'PersonalSetting',
          name: 'PersonalSetting',
          meta: {
            title: '个人信息'
          },
          component: () => import('../adminViews/Info/PersonalSetting.vue')
        }
      ]
    },
    {
      path: '/User',
      component: () => import('../adminViews/LayOut.vue'),
      meta: {
        icon: 'el-icon-user-solid',
        title: '用户管理'
      },
      children: [
        {
          path: 'ToBeOwner',
          name: 'ToBeOwner',
          meta: {
            title: '房主申请'
          },
          component: () => import('../adminViews/User/ToBeOwner.vue')
        },
        {
          path: 'Owner',
          name: 'Owner',
          meta: {
            title: '房主管理'
          },
          component: () => import('../adminViews/User/Owner.vue')
        },
        {
          path: 'Tenant',
          name: 'Tenant',
          meta: {
            title: '租户管理'
          },
          component: () => import('../adminViews/User/Tenant.vue')
        }
      ]
    },
    {
      path: '/House',
      component: () => import('../adminViews/LayOut.vue'),
      meta: {
        icon: 'el-icon-office-building',
        title: '房源管理'
      },
      children: [
        {
          path: 'ApplyForHouse',
          name: 'ApplyForHouse',
          meta: {
            title: '房源操作'
          },
          component: () => import('../adminViews/House/ApplyForHouse.vue')
        },
        {
          path: 'OpHouse',
          name: 'OpHouse',
          meta: {
            title: '房源列表'
          },
          component: () => import('../adminViews/House/OpHouse.vue')
        },
        {
          path: 'AddHouse',
          name: 'AddHouse',
          meta: {
            title: '发布房源'
          },
          component: () => import('../adminViews/House/AddHouse.vue')
        },
        {
          path: 'OrderHouse',
          name: 'OrderHouse',
          meta: {
            title: '约看申请'
          },
          component: () => import('../adminViews/House/OrderHouse.vue')
        }
      ]
    },
    {
      path: '/Contract',
      component: () => import('../adminViews/LayOut.vue'),
      meta: {
        icon: 'el-icon-notebook-2',
        title: '合同管理'
      },
      children: [
        {
          path: 'ApplyRenewal',
          name: 'ApplyRenewal',
          meta: {
            title: '合同续签申请'
          },
          component: () => import('../adminViews/Contract/ApplyRenewal.vue')
        },
        {
          path: 'WithOwner',
          name: 'WithOwner',
          meta: {
            title: '委托招租合同'
          },
          component: () => import('../adminViews/Contract/WithOwner.vue')
        },
        {
          path: 'WithTenant',
          name: 'WithTenant',
          meta: {
            title: '房屋租赁合同'
          },
          component: () => import('../adminViews/Contract/WithTenant.vue')
        }
      ]
    },
    {
      path: '/Finance',
      component: () => import('../adminViews/LayOut.vue'),
      meta: {
        icon: 'el-icon-money',
        title: '财务管理'
      },
      children: [
        {
          path: 'Pay',
          name: 'Pay',
          meta: {
            title: '委托招租财务'
          },
          component: () => import('../adminViews/Finance/Pay.vue')
        },
        {
          path: 'Income',
          name: 'Income',
          meta: {
            title: '房屋出租财务'
          },
          component: () => import('../adminViews/Finance/Income.vue')
        }
      ]
    },
    {
      path: '/UserLogin',
      name: 'UserLogin',
      component: () => import('../userViews/UserLogin.vue')
    },
    {
      path: '/',
      name: 'Index',
      component: () => import('../userViews/Index.vue')
    },
    {
      path: '/HouseIndex',
      name: 'HouseIndex',
      component: () => import('../userViews/HouseIndex.vue')
    },
    {
      path: '/HouseDetail',
      name: 'HouseDetail',
      component: () => import('../userViews/HouseDetail.vue')
    },
    {
      path: '/ToBeOwner',
      name: 'ToBeOwner',
      component: () => import('../userViews/ToBeOwner.vue')
    },
    {
      path: '/LeaseCommission',
      name: 'LeaseCommission',
      component: () => import('../userViews/LeaseCommission.vue')
    },
    {
      path: '/TenantCenter',
      name: 'TenantCenter',
      component: () => import('../userViews/Info/TenantCenter.vue')
    }
  ]
}

let vueRouter = new VueRouter(routers)

// vueRouter.beforeEach((to, from, next) => {
//   if (to.path === '/UserLogin') { return next() }
//   const tokenStr = window.sessionStorage.getItem('token')
//   if (!tokenStr) { return next('/UserLogin') }
//   next()
// })

export default vueRouter
