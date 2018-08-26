<template>
  <div class="edit-up-model">
    <div class="dialog-bj"></div>
    <div class="dialog-content" v-loading="loading">
      <i class="el-icon-close dialog-close" @click="handleCloseClick"></i>
      <div class="dialog-title">修改qw6632039所属代理</div>
      <div class="edit-up-content">
        <div class="edit-up-detail">
          <table class="edit-up-table">
            <tbody>
              <tr>
                <th>用户名：</th>
                <td>
                  <label class="lable-danger">{{username}}</label>
                </td>
              </tr>
              <tr>
                <th>当前代理：</th>
                <td>
                  <span class="lable-success">{{nexus}}</span>
                </td>
              </tr>
              <tr>
                <th>修改代理：</th>
                <td>
                  <tableInput :inputModel="editDaili"></tableInput>
                  <span class="lable-desc">如果需要修改为总代请输入中文“总代”</span>
                </td>
              </tr>
              <tr>
                <th></th>
                <td>
                  <tableBtn :text="'修改'" :size="'medium'" :btnType="'success'" :plain="false" :func="handleReset"></tableBtn>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import statusziliao from '../dialog-user-info/ziliao';
  import tableInput from '../littleStyle/tableInput.vue';
  import tableBtn from '../littleStyle/tableBtn.vue';
  import request from '../../axios/axios.js';
  export default {
    components: {
      statusziliao,
      tableInput,
      tableBtn,
    },
    data() {
      return {
        ziliao: false,
        username: 'qw6632039',
        nexus: 'ceshi110',
        editDaili: '',
        loading: false,
        duration: 1000
      }
    },
    methods: {
      alertSuccess() {
        const vm = this;
        this.$message({
          message: '请求成功',
          type: 'success',
          duration: vm.duration,
          center: true
        })
      },
      alertError() {
        const vm = this;
        this.$message({
          message: '请求错误',
          type: 'error',
          duration: vm.duration,
          center: true
        })
      },
      handleClickUserStatus(ref) {
        this.setUserInfoStatus(ref);
      },
      handleCloseClick() {
        this.$emit('closeDialog', false);
      },
      setUserInfoStatus(ref) {
        this.ziliao = false;
      },
      handleReset() {
        const vm = this;
        // console.log('修改')
        vm.loading = true;
        setTimeout(function () {
          vm.loading = false;
          vm.alertSuccess();
          vm.$emit('closeDialog', false);
        }, 1500)
      }
    },
    mounted() {

    }
  }

</script>

<style scoped>
  .el-aside .el-menu .el-submenu .el-submenu__title {
    display: -webkit-box !important;
  }

  .el-header,
  .el-footer {
    color: #333;
  }

  .el-aside {
    background-color: #D3DCE6;
    color: #333;
  }

  * {
    box-sizing: border-box;
  }

  .edit-up-model {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
  }

  .edit-up-model>.dialog-bj {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    z-index: 103;
    background: #000;
    opacity: .3;
  }

  .edit-up-model>.dialog-content {
    width: 600px;
    height: 400px;
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    z-index: 104;
    border-radius: 5px;
    box-shadow: 0px 0px 5px #000;
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
  }

  .edit-up-model .dialog-close {
    position: absolute;
    top: 12px;
    right: 12px;
    cursor: pointer;
    /* z-index:101; */
    color: #fff;
  }

  .edit-up-model .dialog-title {
    width: 100%;
    height: 48px;
    line-height: 48px;
    color: #fff;
    text-align: left;
    padding-left: 20px;
    background: #409EFF;
  }

  .edit-up-model .user-info-title {
    width: 100%;
    height: 64px;
    color: #fff;
    background: #409EFF;
    display: -webkit-box;
    -webkit-box-pack: end;
  }

  .user-info-title .user-status {
    padding: .5rem 0;
    margin: 0 12px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-box-pack: justify;
    -webkit-box-align: center;
    cursor: pointer;
  }

  .user-status>i {
    font-size: 26px;
  }

  .user-info-title .user-status:hover {
    color: lightsalmon;
  }

  .user-info-title .user-status-active {
    color: lightsalmon;
  }

  .user-status>span {
    font-weight: normal;
    font-size: 12px;
    display: block;
    line-height: normal;
  }

  .edit-up-model .edit-up-content {
    -webkit-box-flex: 1;
    background: #fff;
    overflow-y: auto;
  }

  .edit-up-content>.edit-up-detail {
    background-color: #fff;
    width: 96%;
    margin: 15px auto 42px;
    box-shadow: 0 2px 4px -1px rgba(0, 0, 0, .2), 0 4px 5px 0 rgba(0, 0, 0, .14), 0 1px 10px 0 rgba(0, 0, 0, .12);
  }

  .edit-up-table {
    width: 100%;
    border-collapse: collapse;
    border-spacing: 0;
    border-collapse: collapse;
    border-spacing: 0;
  }

  .edit-up-table th {
    font-weight: 500;
    border-bottom: 1px solid rgba(0, 0, 0, .12);
    width: 120px;
    max-width: 120px;
    text-align: right;
    font-size: 14px;
  }

  .edit-up-table td {
    padding: 16px 8px;
    border-bottom: 1px solid rgba(0, 0, 0, .12);
    text-align: left;
  }

  .edit-up-table label {
    display: inline-block;
    font-weight: 600;
    margin-bottom: 5px;
  }

  .edit-up-table .lable-danger {
    color: #F56C6C;
  }

  .edit-up-table .lable-success {
    color: #67C23A;
  }

  .edit-up-table .lable-desc {
    color: #aaa;
    font-size: 12px;
    margin-left: 12px;
  }

</style>
