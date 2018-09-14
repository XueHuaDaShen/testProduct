<template>
  <div class="loginBox" :style="loginbox">
    <span class="website-log"></span>
    <el-col :span="6" class="login" v-loading="loading" :style="login">
      <div class="grid-content bg-purple">
        <div className="myLogo" class="my-title">
          <h4>登录管理</h4>
        </div>
        <el-form :model="loginForm" ref="loginForm" class="demo-dynamic" style="position:relative;">
          <el-form-item prop="username" :rules="[
                        { required: true, message: 'Please input your E-mail!', trigger: 'blur' },
                        { type: 'email', message: 'The input is not valid E-mail!', trigger: 'blur,change' }
                        ]">
            <el-input v-model.trim="loginForm.username">
              <i slot="suffix" class="icon-account"></i>
            </el-input>
          </el-form-item>
          <el-form-item prop="password" :rules="{
                            required: true, message: 'Please input your Password!', trigger: 'blur'
                        }">
            <el-input type="password" v-model.trim="loginForm.password">
              <i slot="suffix" class="icon-psd"></i>
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button @click="submitForm('loginForm')" class="login-btn" plain>登录</el-button>
          </el-form-item>
          <el-alert :title="loginStatus" v-if="isLoginError" type="error" center show-icon>
          </el-alert>
        </el-form>
      </div>
    </el-col>
  </div>
</template>
<style lang="scss">
  $blur-width: 500px;
  $blur-height: 400px;
  $blur-offset: 0;
  $blur-padding: 62px;
  $img-width: 1920px;
  $img-height: 947px;

  html,
  body {
    width: 100%;
    height: 100%;
  }

  .website-log {
    width: 198px;
    height: 40px;
    background: url("../img/logo.png") no-repeat;
    background-size: cover;
    position: absolute;
    left: 45px;
    top: 31px;
    display: block;
  }

  .my-title {
    font-size: 20px;
    font-weight: 700;
    color: #fff;
    margin: 60px 0;
  }

  .loginBox .el-input__inner {
    border: 1px solid #cccccc;
    border-radius: 2px;
  }

  .loginBox .icon-account {
    display: inline-block;
    width: 21px;
    height: 16px;
    background: url("../assets/icon_Email@3x.png") no-repeat;
    background-size: contain;
    vertical-align: middle;
  }

  .loginBox .icon-psd {
    display: inline-block;
    width: 18px;
    height: 22px;
    background: url("../assets/icon_Password@3x.png") no-repeat;
    background-size: contain;
    vertical-align: middle;
  }

  .loginBox .el-input__suffix {
    right: 10px;
  }

  .loginBox {
    z-index: 1;
    position: relative;
    width: $img-width;
    height: $img-height;
    margin: auto;
    background-image: url("../assets/BackgroundImage.png");
    background-size: $img-width $img-height;
  }

  .grid-content {
    z-index: 100;
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    padding: 0 62px;
  }

  .loginBox .el-button.login-btn {
    width: 100%;
    border: none;
    background: #c83a4c;
    border-radius: 4px;
    font-size: 16px;
    color: #ffffff;
  }

  .login {
    padding: 62px;
    padding-top: 0;
    background: rgba(30, 30, 40, 0.2) !important;
    border-radius: 8px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
    position: absolute;
    width: $blur-width;
    height: $blur-height;
    top: ($img-height - $blur-height) / 2;
    left: ($img-width - $blur-width) / 2;
    overflow: hidden;
  }

  .login:after {
    content: "";
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    background: inherit;
    filter: blur(10px);
    -webkit-filter: blur(10px);
    z-index: 2;

    top: -$blur-offset;
    left: -$blur-offset;
    bottom: -$blur-offset;
    right: -$blur-offset;
    background-image: url("../assets/BackgroundImage.png");
    background-position: (($blur-width + $blur-offset - $img-width) / 2) (($blur-height + $blur-offset - $img-height) / 2);
    background-size: $img-width $img-height;
    filter: blur(10px);

    .loginBox input.el-input__inner {
      background: #fff;
    }
  }

</style>

<script>
  import request from "../axios/axios.js";
  export default {
    data() {
      return {
        loginForm: {
          username: "",
          password: ""
        },
        isLoginError: false,
        duration: 1000,
        loginStatus: "",
        loading: false,
        loginbox: {
          height: "947px",
          width: "1920px",
          backgroundSize: "1920px 947px"
        },
        login: {
          width: "500px",
          height: "400px",
          top: "273.5px",
          left: "710px"
        }
      };
    },
    mounted() {
      // 动态设置背景图的高度为浏览器可视区域高度
      // 首先在Virtual DOM渲染数据时，设置下背景图的高度．
      let height = `${document.documentElement.clientHeight}`;
      let width = `${document.documentElement.clientWidth}`;
      this.loginbox.height = height + "px";
      this.loginbox.width = width + "px";
      this.loginbox.backgroundSize =
        this.loginbox.width + " " + this.loginbox.height;
      let loginWidth = 500,
        loginHeight = 400;
      let loginTop = (parseFloat(height) - loginHeight) / 2;
      this.login.top = loginTop + "px";
      let loginLeft = (parseFloat(width) - loginWidth) / 2;
      this.login.left = loginLeft + "px";
      // 然后监听window的resize事件．在浏览器窗口变化时再设置下背景图高度．
      const vm = this;
      window.onresize = function temp() {
        vm.loginbox.height = `${document.documentElement.clientHeight}` + "px";
        vm.loginbox.width = `${document.documentElement.clientWidth}` + "px";
        vm.loginbox.backgroundSize = vm.loginbox.width + " " + vm.loginbox.height;
        vm.login.top =
          (parseFloat(`${document.documentElement.clientHeight}`) - loginHeight) /
          2 +
          "px";
        vm.login.left =
          (parseFloat(`${document.documentElement.clientWidth}`) - loginWidth) /
          2 +
          "px";
        // console.log("loginbox", vm.loginbox);
        // console.log("login", vm.login);
      };
      this.handleKeyup();
    },
    methods: {
      error() {
        const vm = this;
        this.$message({
          message: "请求错误",
          type: "error",
          duration: vm.duration,
          center: true
        });
      },
      submitForm(formName) {
        const vm = this;
        this.$refs[formName].validate(valid => {
          if (valid) {
            vm.loading = true;
            request.login(
              "post",
              "/admin/random", {
                loginname: vm.loginForm.username
              },
              success => {
                if (success.returncode == "200") {
                  let random = success.data.random;
                  let new_password = CryptoJS.HmacMD5(
                    CryptoJS.MD5(vm.loginForm.password).toString(),
                    random
                  ).toString();
                  request.login(
                    "post",
                    "/admin/login", {
                      loginname: vm.loginForm.username,
                      password: new_password
                    },
                    success => {
                      let code = success.returncode;
                      vm.loading = false;
                      if (code == "304") {
                        vm.isLoginError = true;
                        vm.loginStatus = "用户不存在";
                        setTimeout(function () {
                          vm.isLoginError = false;
                          vm.loginStatus = "";
                        }, 2000);
                      } else if (code == "305") {
                        vm.isLoginError = true;
                        vm.loginStatus = "密码错误";
                        setTimeout(function () {
                          vm.isLoginError = false;
                          vm.loginStatus = "";
                        }, 2000);
                      } else if (code == "200") {
                        localStorage.setItem("cms-token", success.data.token);
                        localStorage.setItem(
                          "cms-loginname",
                          vm.loginForm.username
                        );
                        vm.getMenuList();
                      } else if (code == "306") {
                        vm.isLoginError = true;
                        vm.loginStatus = "您的账号被禁止登陆，请联系管理员";
                        setTimeout(function () {
                          vm.isLoginError = false;
                          vm.loginStatus = "";
                        }, 2000);
                      }
                    },
                    error => {
                      vm.error();
                      vm.loading = false;
                      console.log("/user/login---error", error);
                    }
                  );
                } else {
                  vm.error();
                  vm.loading = false;
                }
                // console.log('/user/random---success', success)
              },
              error => {
                vm.error();
                vm.loading = false;
                console.log("/user/random---error", error);
              }
            );
            // request.login(
            //     'get',
            //     '/user/random',
            //     {
            //         email: vm.loginForm.username
            //     },
            //     (success)=>{
            //         if( success.returncode == '200' ){
            //             let salt = success.data.salt;
            //             let new_password = CryptoJS.HmacMD5(CryptoJS.MD5(vm.loginForm.password).toString(), salt).toString();
            //             request.login(
            //                 'post',
            //                 '/user/login',
            //                 {
            //                     username: vm.loginForm.username,
            //                     password: new_password
            //                 },
            //                 (success)=>{
            //                     let code = success.returncode;
            //                     if (code == '304') {
            //                         vm.isLoginError = true;
            //                         vm.loginStatus = '用户不存在';
            //                         setTimeout(function(){
            //                             vm.isLoginError = false;
            //                             vm.loginStatus = '';
            //                         },2000)
            //                     } else if (code == '305') {
            //                         vm.isLoginError = true;
            //                         vm.loginStatus = '密码错误';
            //                         setTimeout(function(){
            //                             vm.isLoginError = false;
            //                             vm.loginStatus = '';
            //                         },2000)
            //                     } else if (code == '200') {
            //                         vm.getToken(success.data.bearer, vm.loginForm.username);
            //                     } else if (code == '306') {
            //                         vm.isLoginError = true;
            //                         vm.loginStatus = '您的账号被禁止登陆，请联系管理员';
            //                         setTimeout(function(){
            //                             vm.isLoginError = false;
            //                             vm.loginStatus = '';
            //                         },2000)
            //                     } else {
            //                         request.handleLogOut(code, vm);
            //                     }
            //                 },
            //                 (error)=>{
            //                     vm.error();
            //                     vm.loading = false;
            //                     console.log('/user/login---error', error)
            //                 }
            //             )
            //         }else{
            //             vm.error();
            //             vm.loading = false;
            //         }
            //         // console.log('/user/random---success', success)
            //     },
            //     (error)=>{
            //         vm.error();
            //         vm.loading = false;
            //         console.log('/user/random---error', error)
            //     }
            // )
          } else {
            vm.loading = false;
            // console.log('error submit!!');
            return false;
          }
        });
      },
      handleKeyup() {
        const vm = this;
        document.onkeyup = function (e) {
          // console.log(e.keyCode)
          if (e.keyCode == 13) {
            vm.submitForm("loginForm");
          }
        };
      },
      getMenuList() {
        const vm = this;
        this.menuData = [];
        request.http(
          "get",
          "/auth/role/menu/list", {},
          success => {
            let code = success.returncode;
            if (code === 200) {
              // console.log(success)
              localStorage.setItem("menus", JSON.stringify(success.data));
              vm.$router.push({
                path: "/home"
              });
            } else if (code === 101 || code === 103 || code === 106) {
              request.loginAgain(vm);
            } else if (code === 305) {
              alert("请联系管理员为该用户添加角色");
            } else if (code === 306) {
              alert("角色尚未配置菜单");
            } else {
              alert(success.returncode);
              // vm.$router.push({path:'/home'})
            }
          },
          error => {
            vm.error();
            console.log(error);
          }
        );
      },
      setUserMenu(data) {
        let arr = [];
        data.filter(v => {
          arr.push(v.url);
        });
        localStorage.setItem("cms-user-menu", arr.join(","));
      }
    }
  };

</script>
