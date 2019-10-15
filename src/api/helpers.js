import axios from 'axios'
//对axios进行封装


const urlMap = {
  development: '/',
  production: 'http://ustbhuangyi.com/sell/'
}
const baseUrl = urlMap[process.env.NODE_ENV]
const ERR_OK = 0


// get请求
export function get(url) {
  return function(params = {}) {
    return axios.get(baseUrl + url, {
      params
    }).then((res) => {
      const { errno, data } = res.data;
      if (errno === ERR_OK) {
        return data
      }
    }).catch((e) => {
      
    })
  }
}
