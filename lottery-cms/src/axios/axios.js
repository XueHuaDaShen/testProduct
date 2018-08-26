import request from 'axios'
import Config from '../config/config.js'
request.defaults.baseURL = Config.login
const loginReq = request.create({
  baseURL: Config.login
})

const chessReq = request.create({
  baseURL: Config.login
})

const uploadReq = request.create({
  baseURL: Config.login
})

export default {
  http (method, url, params, callback, fallback, headers) {
    var header = {
      authorization: localStorage.getItem('cms-token')
    }
    // console.log(header)
    var o = {}
    if (method === 'get') {
      o = {
        method: method,
        headers: header,
        url: url,
        params: params
      }
    } else if (method === 'post') {
      o = {
        method: method,
        headers: header,
        url: url,
        data: params
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
    vm.$router.push('/login')
    vm.$alert('token过期，请重新登录', '温馨提示', {
      confirmButtonText: '确定',
      callback: action => {
        localStorage.removeItem('cms-token')
        localStorage.removeItem('cms-loginname')
        localStorage.removeItem('cms-user-menu')
      }
    })
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

  chess (method, url, params, callback, fallback, headers) {
    var header = {
      'Accept': 'application/json, text/javascript, */*; q=0.01',
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
    }
    var o = {}
    o = {
      method: method,
      headers: header,
      url: url,
      data: params
    }
    chessReq(o).then((res) => {
      let result = res.data
      callback(result)
    }).catch(error => {
      fallback(error)
    })
  },

  upload (method, url, params, callback, fallback, headers) {
    var header = {
      'Content-Type': 'multipart/form-data', // 之前说的以表单传数据的格式来传递fromdata
      token: localStorage.getItem('cms-token')
    }
    var o = {}
    o = {
      method: method,
      headers: header,
      url: url,
      data: params
    }
    uploadReq(o).then((res) => {
      let result = res.data
      callback(result)
    }).catch(error => {
      fallback(error)
    })
  }
}
