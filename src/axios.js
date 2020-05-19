import axios from 'axios'
import { Message } from 'element-ui'
import r from './router'

axios.defaults.baseURL = process.env.VUE_APP_BASE_URL

axios.defaults.withCredentials = true

axios.interceptors.response.use(null, function (error) {
  if ('data' in error.response) {
    switch (error.response.data.errorCode) {
      case 90001: // 管理员账户未登录
        Message.error('登陆过期, 请重新登陆')
        r.push('/Login')
        break
      case 90002: // 用户账户未登录
        Message.error('登陆过期, 请重新登陆')
        r.push('/UserLogin')
        break
    }
  }

  return error
})

export default axios
