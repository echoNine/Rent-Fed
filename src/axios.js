import axios from 'axios'

axios.defaults.baseURL = process.env.VUE_APP_BASE_URL

axios.defaults.withCredentials = true

export default axios
