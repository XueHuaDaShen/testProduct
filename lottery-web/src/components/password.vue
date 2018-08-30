<template>
  <div class="psd-wrap search-form" v-loading="loading">
    <el-row class="wrap-outer">
      <div class="item">
        <div class="tab-line">
          <p>个人资料</p>
        </div>
        <div class="table-xinxi">
          <div class="table-row">
            <div class="row-item">
              <span class="exp">用户名：</span>
              <el-input placeholder="请输入用户名" v-model="loginname" class="content" type="text" disabled></el-input>
            </div>
            <div class="row-item">
              <span class="exp">生日：</span>
              <el-date-picker v-model="birthday" align="right" type="date" placeholder="选择日期" class="content date">
              </el-date-picker>
            </div>
          </div>
          <div class="table-row">
            <div class="row-item">
              <span class="exp">昵称：</span>
              <el-input placeholder="请输入内容" v-model="nickname" class="content" type="text"></el-input>
            </div>
            <div class="row-item">
              <span class="exp">手机号：</span>
              <el-input placeholder="请输入手机号" v-model="phone" class="content" type="text"></el-input>
            </div>
          </div>
          <div class="table-row">
            <div class="row-item">
              <span class="exp">真实姓名：</span>
              <el-input placeholder="请输入真实姓名" v-model="realname" class="content" type="text"></el-input>
            </div>
            <div class="row-item">
              <span class="exp">邮箱：</span>
              <el-input placeholder="请输入邮箱" v-model="email" class="content" type="text"></el-input>
            </div>
          </div>
          <div class="table-row">
            <div class="row-item">
              <span class="exp">性别：</span>
              <el-select v-model="sex.value" clearable placeholder="请选择" class="content">
                <el-option v-for="item in sex.options" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </div>
            <div class="row-item"></div>
          </div>
        </div>
        <div class="submit-line">
          <a class="submit" type="submit" @click="modifiedName()">提交修改</a>
        </div>
      </div>
    </el-row>
    <div class="user-split-line"></div>
    <el-row class="wrap-outer">
      <div class="item">
        <div class="tab-line">
          <p>账户安全</p>
        </div>
        <div v-if="profile.lastTimeVisible" class="time-row">
          <span class="last-exp">上次登录时间：</span>
          <el-input v-model="profile.lastTime" class="content" disabled style="font-weight:700"></el-input>
        </div>
        <div v-else class="time-row">
          <span class="last-login-time">初次登录</span>
        </div>
      </div>
    </el-row>
    <div class="user-split-line"></div>
    <el-row class="wrap-outer">
      <div class="item">
        <div class="tab-line">
          <p>修改登录密码</p>
        </div>
        <div class="time-row mb-20">
          <span class="last-exp">输入旧登录密码：</span>
          <el-input placeholder="请输入旧密码" v-model.trim="oldPsd" class="content" type="password" clearable></el-input>
        </div>
        <div class="time-row mb-20">
          <span class="last-exp">输入新登录密码：</span>
          <el-input placeholder="请输入新密码" v-model.trim="newPsd" class="content" type="password" clearable></el-input>
        </div>
        <div class="time-row mb-20">
          <span class="last-exp"></span>
          <span class="last-tip">6-16位字符，可使用字母或数字，不能和资金密码相同</span>
        </div>
        <div class="time-row">
          <span class="last-exp">确认新登录密码：</span>
          <el-input placeholder="请输入新密码" v-model.trim="newPsd2" class="content" type="password" clearable></el-input>
        </div>
        <div class="submit-line">
          <a class="submit" type="submit" @click="modifiedLoginPsd()">提交修改</a>
        </div>
      </div>
    </el-row>
    <div class="user-split-line"></div>
    <el-row class="wrap-outer">
      <div class="item" v-if="isSetBankPsd">
        <div class="tab-line">
          <p>修改资金密码</p>
        </div>
        <div class="time-row mb-20">
          <span class="last-exp">输入旧资金密码：</span>
          <el-input placeholder="请输入旧密码" v-model.trim="oldPsdzj" class="content" type="password" clearable></el-input>
        </div>
        <div class="time-row mb-20">
          <span class="last-exp">输入新资金密码：</span>
          <el-input placeholder="请输入旧密码" v-model.trim="newPsdzj" class="content" type="password" clearable></el-input>
        </div>
        <div class="time-row mb-20">
          <span class="last-exp"></span>
          <span class="last-tip">6-16位字符，可使用字母或数字，不能和登录密码相同</span>
        </div>
        <div class="time-row">
          <span class="last-exp">确认新资金密码：</span>
          <el-input placeholder="请输入旧密码" v-model.trim="newPsd2zj" class="content" type="password" clearable></el-input>
        </div>
        <div class="submit-line">
          <a class="submit" type="submit" @click="modifiedZJPsd()">提交修改</a>
        </div>
      </div>
      <div class="item" v-if="!isSetBankPsd">
        <div class="setting-wrap">
          <span class="" align="left">为了保障您的资金安全，请立即设置您的资金密码</span>&nbsp;&nbsp;
          <router-link :to="{name:'resetPsd'}" class="submit">立即设置</router-link>
        </div>
      </div>
    </el-row>
  </div>
</template>
<script>
  import request from '../axios/axios';
  import moment from 'moment';
  import * as validator from "../lib/utils/validator";
  import paramCryptFn from '../lib/cryptData'

  export default {
    data() {
      return {
        loading: false,
        loginname: '',
        nickname: '', //昵称
        realname: "",
        phone: "",
        email: "",
        birthday: "",
        sex: {
          value: "",
          options: [
            { label: "男", value: "1" },
            { label: "女", value: "2" },
          ]
        },
        isSetBankPsd: 0,
        oldPsd: '', //旧密码
        newPsd: '', //新密码
        newPsd2: '', //确认新密码
        oldPsdzj: '', //旧资金密码
        newPsdzj: '', //新资金密码
        newPsd2zj: '', //确认新资金密码，
        profile: {
          lastTimeVisible: false,
          lastTime: ''
        }
      }
    },
    methods: {
      resetPsdzj() {
        this.oldPsdzj = '';
        this.newPsdzj = '';
        this.newPsd2zj = '';
      },
      //修改昵称
      modifiedName() {
        if (!this.nickname) {
          this.$message({
            showClose: true,
            message: '请输入用户昵称',
            type: 'error'
          });
          return;
        }
        if (!validator.minLength(this.nickname, 2)) {
          this.$message({
            showClose: true,
            message: '用户昵称长度不得小于2位字符',
            type: 'error'
          });
          return;
        }
        if (!validator.maxLength(this.nickname, 12)) {
          this.$message({
            showClose: true,
            message: '用户昵称长度不得大于11位字符',
            type: 'error'
          });
          return;
        }
        if (this.phone) {
          if (!validator.cellphone(this.phone)) {
            this.$message({
              showClose: true,
              message: '手机号码要求11位数字',
              type: 'error'
            });
            return;
          }
        }
        if (this.realname) {
          if (!validator.hanzi(this.realname)) {
            this.$message({
              showClose: true,
              message: '真实姓名要求2-6位汉字',
              type: 'error'
            });
            return;
          }
        }
        if (this.email) {
          if (!validator.email(this.email)) {
            this.$message({
              showClose: true,
              message: '请输入正确的邮箱',
              type: 'error'
            });
            return;
          }
        }
        let url = '/user/profile/update';
        let self = this;
        this.loading = true;
        request.http('post', url, {
          avatar: '',
          signature: '',
          birthday: self.birthday,
          phone: self.phone,
          nickname: self.nickname,
          realname: self.realname,
          email: self.email,
          sex: self.sex.value,
        }, (success) => {
          self.loading = false;
          if (success.returncode) {
            if (success.returncode == 103 || success.returncode == 106 || success.returncode == 101) {
              request.loginAgain(self);
            } else if (success.returncode == 200) {
              self.$alert('修改成功', '系统提醒', {
                confirmButtonText: '确定',
                center: true,
                callback: action => {
                  // localStorage.removeItem('nickName');
                  // self.nickname = '';
                }
              });
            } else {
              self.$message({
                showClose: true,
                message: success.returncode,
                type: "error"
              });
            }
          }
        }, (error) => {
          self.loading = false;
          console.log('error', error);
        })
      },
      //修改登录密码
      modifiedLoginPsd() {
        if (!this.oldPsd) {
          this.$message({
            showClose: true,
            message: '旧密码不能为空',
            type: 'error'
          });
          return;
        }
        if (!this.newPsd) {
          this.$message({
            showClose: true,
            message: '新密码不能为空',
            type: 'error'
          });
          return;
        }
        if (!this.newPsd) {
          this.$message({
            showClose: true,
            message: '确认新密码不能为空',
            type: 'error'
          });
          return;
        }
        if (this.newPsd !== this.newPsd2) {
          this.$message({
            showClose: true,
            message: '两次输入的新密码不一致',
            type: 'error'
          });
          return;
        }
        if (this.oldPsd === this.newPsd) {
          this.$message({
            showClose: true,
            message: '新旧密码不可以相同',
            type: 'error'
          });
          return;
        }
        if (!validator.regexpPsd(this.newPsd)) {
          this.$message({
            showClose: true,
            message: '新密码需6-16位字符，只能且必须同时包含数字和字母，不允许连续三位相同',
            type: 'error'
          });
          return;
        }
        if (!validator.regexpPsd(this.newPsd2)) {
          this.$message({
            showClose: true,
            message: '确认新密码需6-16位字符，只能且必须同时包含数字和字母，不允许连续三位相同',
            type: 'error'
          });
          return;
        }
        let url = '/user/password/change';
        let self = this;
        self.loading = true;
        request.login(
          'post',
          '/user/random',
          {
            loginname: localStorage.getItem('loginname')
          },
          (success) => {
            if (success.returncode == '200') {
              let random = success.data.random;
              // console.log('old', CryptoJS.MD5(self.oldPsd).toString());
              // console.log('oldhmac', CryptoJS.HmacMD5(CryptoJS.MD5(self.oldPsd).toString(), random).toString());
              // console.log('new', CryptoJS.MD5(self.newPsd).toString());
              let old_password = CryptoJS.HmacMD5(CryptoJS.MD5(self.oldPsd).toString(), random).toString();
              let new_password = CryptoJS.MD5(self.newPsd).toString();

              var data = {
                oldpw: old_password,
                newpw: new_password
              }
              request.http(
                'post',
                url,
                paramCryptFn(data),
                (success) => {
                  self.loading = false;
                  if (success.returncode) {
                    if (success.returncode == 103 || success.returncode == 106 || success.returncode == 101) {
                      request.loginAgain(self);
                    } else if (success.returncode == 200) {
                      self.$alert('密码修改成功！', '系统提醒', {
                        confirmButtonText: '确定',
                        center: true,
                        callback: action => {
                          // request.loginAgain(self);
                        }
                      });
                    } else if (success.returncode == 307) {
                      self.$alert('资金密码和登录密码不能相同', '系统提醒', {
                        confirmButtonText: '确定',
                        center: true,
                        callback: action => {
                          self.resetPsdzj()
                        }
                      });
                    } else {
                      console.log('error', success.returncode);
                    }
                  }
                }, (error) => {
                  self.loading = false;
                  console.log('error', error);
                }
              )
            } else {
              self.loading = false;
              self.$message({
                showClose: true,
                message: success.returncode,
                type: "error"
              });
            }
          },
          (error) => {
            self.loading = false;
            console.log('/user/random---error', error)
          }
        )
      },
      //修改资金密码
      modifiedZJPsd() {
        if (!this.oldPsdzj) {
          this.$message({
            showClose: true,
            message: '旧资金密码不能为空',
            type: 'error'
          });
          return;
        }
        if (!this.newPsdzj) {
          this.$message({
            showClose: true,
            message: '新资金密码不能为空',
            type: 'error'
          });
          return;
        }
        if (!this.newPsdzj) {
          this.$message({
            showClose: true,
            message: '确认新资金密码不能为空',
            type: 'error'
          });
          return;
        }
        if (this.newPsdzj !== this.newPsd2zj) {
          this.$message({
            showClose: true,
            message: '两次输入的新资金密码不一致',
            type: 'error'
          });
          return;
        }
        if (this.oldPsdzj === this.newPsdzj) {
          this.$message({
            showClose: true,
            message: '新旧资金密码不可以相同',
            type: 'error'
          });
          return;
        }
        if (!validator.regexpPsd(this.newPsdzj)) {
          this.$message({
            showClose: true,
            message: '新资金密码需6-16位字符，只能且必须同时包含数字和字母，不允许连续三位相同',
            type: 'error'
          });
          return;
        }
        if (!validator.regexpPsd(this.newPsd2zj)) {
          this.$message({
            showClose: true,
            message: '确认新资金密码需6-16位字符，只能且必须同时包含数字和字母，不允许连续三位相同',
            type: 'error'
          });
          return;
        }
        let url = '/user/bankcard/password/update';
        let self = this;
        request.login(
          'post',
          '/user/random',
          {
            loginname: localStorage.getItem('loginname')
          },
          (success) => {
            if (success.returncode == '200') {
              let random = success.data.random;
              // console.log('old', CryptoJS.MD5(self.oldPsdzj).toString());
              // console.log('oldhmac', CryptoJS.HmacMD5(CryptoJS.MD5(self.oldPsdzj).toString(), random).toString());
              // console.log('new', CryptoJS.MD5(self.newPsdzj).toString());
              let old_password = CryptoJS.HmacMD5(CryptoJS.MD5(self.oldPsdzj).toString(), random).toString();
              let new_password = CryptoJS.MD5(self.newPsdzj).toString();

              var data = {
                oldpw: old_password,
                newpw: new_password
              }
              request.http('post', url, paramCryptFn(data), (success) => {
                self.loading = false;
                if (success.returncode) {
                  if (success.returncode == 103 || success.returncode == 106 || success.returncode == 101) {
                    request.loginAgain(self);
                  } else if (success.returncode == 200) {
                    self.$alert('修改成功', '系统提醒', {
                      confirmButtonText: '确定',
                      center: true,
                      callback: action => {
                        self.resetPsdzj()
                      }
                    });
                  } else if (success.returncode == 305) {
                    self.$alert('旧密码不正确，请重新输入', '系统提醒', {
                      confirmButtonText: '确定',
                      center: true,
                      callback: action => {
                        self.resetPsdzj()
                      }
                    });
                  } else if (success.returncode == 307) {
                    self.$alert('资金密码和登录密码不能相同', '系统提醒', {
                      confirmButtonText: '确定',
                      center: true,
                      callback: action => {
                        self.resetPsdzj()
                      }
                    });
                  } else {
                    console.log('error', success.returncode);
                  }
                }
              }, (error) => {
                self.loading = false;
                console.log('error', error);
              })
            } else {
              self.loading = false;
              self.$message({
                showClose: true,
                message: success.returncode,
                type: "error"
              });
            }
          },
          (error) => {
            self.loading = false;
            console.log('/user/random---error', error)
          }
        )
      },
      //用户是否设置资金密码
      isSetBankPassword() {
        let self = this;
        request.http('get', '/user/bankcard/password/isSet', {},
          (success) => {
            if (success.returncode == 200) {
              self.isSetBankPsd = success.data.isSet;
            } else if (success.returncode == 101 || success.returncode == 103 || success.returncode == 106) {
              request.loginAgain(self)
            } else {
              self.$message({
                showClose: true,
                message: success.returncode,
                type: "error"
              });
            }
          },
          (error) => {
            console.log('数据异常', error)
          }
        )
      },
      //获取用户信息
      getProfile() {
        let self = this;
        self.loading = true;
        request.http('get', '/user/profile', {},
          (success) => {
            self.loading = false;
            if (success.returncode == 200) {
              let profile = success.data;
              if (profile.nickname) {
                localStorage.setItem('nickName', profile.nickname);
              }
              if (profile.birthday) {
                localStorage.setItem('birthday', profile.birthday);
              }
              if (profile.phone) {
                localStorage.setItem('phone', profile.phone);
              }
              if (profile.realname) {
                localStorage.setItem('realname', profile.realname);
              }
              if (profile.email) {
                localStorage.setItem('email', profile.email);
              }
              if (profile.sex) {
                localStorage.setItem('sex', profile.sex);
              }
              this.birthday = localStorage.getItem('birthday');
              this.nickname = localStorage.getItem('nickName');
              this.phone = localStorage.getItem('phone');
              this.realname = localStorage.getItem('realname');
              this.email = localStorage.getItem('email');
              this.sex.value = localStorage.getItem('sex');
              if (profile.log) {
                this.profile.lastTimeVisible = true;
                let time = moment(profile.log).format('YYYY-MM-DD HH:mm:ss');
                localStorage.setItem('lastTime', time);
                self.profile.lastTime = localStorage.getItem('lastTime');
              } else {
                this.profile.lastTimeVisible = false;
              }
            } else if (success.returncode == 101 || success.returncode == 103 || success.returncode == 106) {
              request.loginAgain(self)
            } else {
              self.$message({
                showClose: true,
                message: success.returncode,
                type: "error"
              });
            }
          },
          (error) => {
            self.loading = false;
            console.log('获取用户信息失败', error)
          }
        )
      },
      hasProfile() {
        // let nickName = localStorage.getItem('nickName');
        // this.birthday = localStorage.getItem('birthday');
        // this.nickname = nickName;
        // this.phone = localStorage.getItem('phone');
        // this.realname = localStorage.getItem('realname');
        // this.email = localStorage.getItem('email');
        // this.sex.value = localStorage.getItem('sex');
        // let lastLoginTime = localStorage.getItem('lastTime');
        this.getProfile();
        // if (lastLoginTime) {
        //   this.profile.lastTimeVisible = true;
        //   this.profile.lastTime = lastLoginTime;
        // } else {
        //   this.profile.lastTimeVisible = false;
        // }
      },
    },
    mounted() {
      this.loginname = localStorage.getItem('loginname');
      this.hasProfile();
      this.isSetBankPassword();
    },
  }
</script>
<style scoped lang="scss">
  .ml-60 {
    margin-left: 60px;
  }

  .table-xinxi {
    padding: 0 122px;
    width: 100%;

    .table-row {
      display: flex;
      justify-content: space-around;
      align-items: center;

      .row-item {
        flex: 0.5;

        .exp {
          text-align: left;
          font-family: PingFangSC-Regular;
          font-size: 12px;
          color: #191919;
          width: 120px;
          display: inline-block;
        }
      }
    }
  }

  .wrap-outer {
    padding: 30px 20px;
  }

  .psd-wrap {
    color: #333333;
    min-height: 731px;
  }

  .item {
    width: 100%;
  }

  .tab-line {
    font-family: PingFangSC-Regular;
    font-weight: 700;
    font-size: 16px;
    color: #191919;
    text-align: left;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .user-split-line {
    background: #ddd;
    height: 1px;
    border: none;
    width: 944px;
    margin: 0 auto;
  }

  .submit-line {
    width: 100%;
    margin-top: 60px;
  }

  .submit {
    width: 115px;
    height: 40px;
    line-height: 40px;
    display: inline-block;
    text-align: center;
    cursor: pointer;
    text-decoration: none;
    background: #CC3447;
    border-radius: 2px;
    font-family: PingFangSC-Regular;
    font-size: 14px;
    font-weight: 700;
    color: #FFFFFF;
    margin: 0 auto;
  }

  .input-nick {
    height: 32px;
    border: 1px solid #999799;
    padding: 0 8px;
    float: left;
  }

  .input-nick:focus,
  input-nick:hover {
    border-color: #D4914D;
  }

  .time-row {
    text-align: left;

    .last-login-time {
      width: 200px;
      height: 40px;
      line-height: 40px;
      display: inline-block;
      text-align: center;
      font-family: PingFangSC-Regular;
      font-weight: 700;
      font-size: 12px;
      color: #191919;
      background: #FFFFE1;
      border: 1px solid #C8C8C8;
      border-radius: 4px;
    }

    .last-exp {
      font-size: 12px;
      color: #191919;
      display: inline-block;
      width: 120px;
      text-align: left;
      font-family: PingFangSC-Regular;
    }

    .last-tip {
      font-family: PingFangSC-Regular;
      font-size: 12px;
      color: #777777;
    }
  }

  .mb-20 {
    margin-bottom: 20px;
  }

  .tip {
    height: 33px;
    font-size: 12px;
    font-family: MicrosoftYaHei;
    color: rgba(153, 153, 153, 1);
    line-height: 20px;
    width: 200px;
    display: inline-block;
  }

  .keyboard-icon {
    display: inline-block;
    font-size: 28px;
    text-align: center;
    vertical-align: middle;
    padding-left: 10px;
    cursor: pointer;
  }

  .setting-wrap {
    width: 471px;
    height: 260px;
    background: #f2f2f2;
    margin-top: 90px;
    margin-right: 50px;
  }

  .setting-wrap>span {
    text-align: center;
    display: inline-block;
    line-height: 260px;
    vertical-align: middle;
    font-size: 12px;
  }
</style>