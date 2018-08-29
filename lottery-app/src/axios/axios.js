import request from 'axios'
import Config from '@/config/config.js'

request.defaults.baseURL = Config.login
const loginReq = request.create({
  baseURL: Config.login
})

const chessReq = request.create({
  baseURL: Config.chess
})
export default {
  http (method, url, params, callback, fallback, headers) {
    var header = { authorization: localStorage.getItem('phone-token') }
    var o = {}
    let data = {}
    for (let i in params) {
      data[i] = params[i]
    }
    data.mobile = 1
    // console.log(data)
    if (method === 'get') {
      o = {
        method: method,
        headers: header,
        url: url,
        params: data
      }
    } else if (method === 'post') {
      o = {
        method: method,
        headers: header,
        url: url,
        data: data
      }
    }
    request(o).then((res) => {
      let result = res.data
      callback(result)
    }).catch(error => {
      fallback(error)
    })
  },
  login (method, url, params, callback, fallback, headers) {
    var o = {}
    if (method === 'get') {
      o = {
        method: method,
        headers: headers,
        url: url,
        params: params
      }
    } else if (method === 'post') {
      o = {
        method: method,
        headers: headers,
        url: url,
        data: params
      }
    }
    loginReq(o).then((res) => {
      let result = res.data
      callback(result)
    }).catch(error => {
      fallback(error)
    })
  },
  loginAgain (vm) {
    localStorage.setItem('islogout', true)
    localStorage.removeItem('phone-token')
    localStorage.removeItem('refund')
    localStorage.removeItem('loginname')
    localStorage.removeItem('nickName')
    localStorage.removeItem('lastTime')
    localStorage.removeItem('blance')
    vm.$router.push('/login')
  },

  logout (vm) {
    localStorage.setItem('islogout', true)
    localStorage.removeItem('phone-token')
    localStorage.removeItem('refund')
    localStorage.removeItem('loginname')
    localStorage.removeItem('nickName')
    localStorage.removeItem('lastTime')
    localStorage.removeItem('blance')
    vm.$router.push('/login')
  },

  handlerErr (vm, code, func) {
    var suc = false
    if (code) {
      if (code === 304 || code === 102 || code === 106) {
        this.loginAgain(vm)
      } else if (code === 104 || code === 103) {
        this.refresh(vm, func)
      } else if (code === 303) {
        vm.$message({
          message: '服务器内部错误',
          type: 'error',
          duration: 1000
        })
      } else if (code === 200) {
        suc = true
      } else {
        // console.log('returncode-----' + code)
      }
    } else {
      vm.$message({
        message: '请求服务异常',
        type: 'error',
        duration: 1000
      })
    }
    return suc
  },

  handleLogOut (code, vm) {
    // console.log(code)
    if (code === 102 || code === 106 || code === 101 || code === 304) {
      // console.log('code:', code)
      this.loginAgain(vm)
    } else if (code === 303) {
      vm.$message({
        message: '服务器内部错误',
        type: 'error',
        duration: 1000
      })
    } else if (code === 109) {
      vm.$message({
        message: '此账号不具有相应的权限，请重新登录！',
        type: 'error',
        duration: 1000
      })
      this.loginAgain(vm)
    }
  },
  chess (params, callback, fallback, headers) {
    var header = {
      'Accept': 'application/json, text/javascript, */*; q=0.01',
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
    }
    var o = {}
    o = {
      method: 'post',
      headers: header,
      data: params
    }
    chessReq(o).then((res) => {
      let result = res.data
      callback(result)
    }).catch(error => {
      fallback(error)
    })
  }
}
