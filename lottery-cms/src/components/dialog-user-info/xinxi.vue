<template>
  <div style="width:100%;height:100%;">
    <div class="xinxi-wrap">
      <el-table :data="tableData" v-loading="dataLoading" style="width: 100%">
        <el-table-column prop="admin.loginname" label="操作人" align="center" width="180">
        </el-table-column>
        <el-table-column prop="date" label="添加时间" :formatter="formatTime" align="center" width="180">
        </el-table-column>
        <el-table-column prop="detail" align="center" label="备注内容">
        </el-table-column>
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click="deleteDetail(scope.row)" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <table class="xinxi-table" v-loading="subLoading">
        <tbody>
          <tr>
            <th>备注内容：</th>
            <td style="position:relative">
              <el-input ref="textArea" type="textarea" :rows="3" style="width:574px" placeholder="请输入内容" @change="handleTextChange"
                v-model.trim="textarea">
              </el-input>
              <div class="xinxi-alert-tip" v-if="(textarea==''?isTextEmpty:textarea=='')">
                <span class="sanjiao"></span>
                <i class="el-icon-warning" style="color:#E6A23C"></i>
                请填写此字段。
              </div>
            </td>
          </tr>
          <tr>
            <th></th>
            <td>
              <el-button class="yes" @click="handleCreateXinxi" style="margin-left:10px">提交</el-button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<script>
  import tableBtn from '../littleStyle/tableBtn.vue';
  import request from '../../axios/axios.js';
  import moment from 'moment'
  export default {
    name: 'xinxi',
    props: {
      userid: {
        type: String,
        required: true
      }
    },
    components: {
      tableBtn
    },
    data() {
      return {
        tableData: [],
        textarea: '',
        isTextEmpty: false,
        setTime: null,
        subLoading: false,
        dataLoading: false,
      }
    },
    created() {
      this.getxinxi();
    },
    methods: {
      getxinxi() {
        var vm = this;
        vm.tableData = [];
        vm.dataLoading = true;
        request.http(
          'get',
          '/user/userRemark/list', {
            loginid: vm.userid
          },
          (success) => {
            vm.dataLoading = false;
            // console.log('xinxi--------', success);
            let code = success.returncode;
            if (code === 200) {
              vm.tableData = success.data
              // vm.setXinxiData(success.data)
            } else if (code === 101 || code === 103 || code === 106) {
              request.loginAgain(vm)
            }
          },
          (error) => {
            vm.dataLoading = false;
            console.log(error)
          }
        )
      },
      deleteDetail(row) {
        const vm = this;
        this.$alert('确定删除该内容吗？', '提示', {
          confirmButtonText: '确定',
          callback: action => {
            if (action === 'confirm') {
              request.http(
                'post',
                '/user/userRemark/remove', {
                  id: row._id
                },
                (success) => {
                  let code = success.returncode;
                  if (code === 200) {
                    vm.getxinxi();
                    // vm.setXinxiData(success.data)
                  } else if (code === 101 || code === 103 || code === 106) {
                    request.loginAgain(vm)
                  }
                },
                (error) => {
                  console.log(error)
                }
              )
            }
          }
        });
      },
      formatTime(row, column, cellValue) {
        return moment(cellValue).format('YYYY-MM-DD HH:mm:ss')
        // return moment(cellValue).format('YYYY-MM-DD')
      },
      handleCreateXinxi() {
        const vm = this;
        if (!vm.textarea) {
          vm.isTextEmpty = true;
          vm.$refs.textArea.focus();
          vm.setTime = setTimeout(function () {
            vm.isTextEmpty = false;
          }, 5000)
        } else {
          vm.subLoading = true;
          request.http(
            'post',
            '/user/userRemark/add', {
              loginid: vm.userid,
              detail: vm.textarea
            },
            (success) => {
              vm.subLoading = false;
              let code = success.returncode;
              if (code === 200) {
                vm.textarea = '';
                vm.getxinxi();
              } else if (code === 101 || code === 103 || code === 106) {
                request.loginAgain(vm)
              }
            },
            (error) => {
              vm.subLoading = false;
              console.log(error)
            }
          )
        }
      },
      handleTextChange(val) {
        const vm = this;
        vm.isTextEmpty = false;
      }
    }
  }

</script>
<style scoped>
  .xinxi-wrap {
    background-color: #fff;
    /* width: 96%; */
    margin: 10px auto 30px;
    /* box-shadow: 0 2px 4px -1px rgba(0, 0, 0, .2), 0 4px 5px 0 rgba(0, 0, 0, .14), 0 1px 10px 0 rgba(0, 0, 0, .12); */
  }

  .xinxi-table {
    width: 100%;
    border-collapse: collapse;
    border-spacing: 0;
    border-collapse: collapse;
    border-spacing: 0;
  }

  .xinxi-table th {
    font-weight: 500;
    border-bottom: 1px solid rgba(0, 0, 0, .12);
    width: 120px;
    max-width: 120px;
    text-align: right;
    font-size: 14px;
  }

  .xinxi-table td {
    padding: 16px 8px;
    border-bottom: 1px solid rgba(0, 0, 0, .12);
    text-align: left;
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

  .xinxi-alert-tip {
    position: absolute;
    padding-left: 10px;
    margin-left: -50px;
    bottom: -36px;
    left: 35%;
    width: 140px;
    height: 60px;
    border: 1px solid #999;
    border-radius: 5px;
    background: #fff;
    display: -webkit-box;
    /* -webkit-box-pack:center; */
    -webkit-box-align: center;
  }

  .xinxi-alert-tip>.sanjiao {
    position: absolute;
    width: 13px;
    height: 13px;
    left: 20px;
    top: -8px;
    border-top: 1px solid #999;
    border-left: 1px solid #999;
    background: #fff;
    transform: rotate(45deg);
    -ms-transform: rotate(45deg);
    /* IE 9 */
    -moz-transform: rotate(45deg);
    /* Firefox */
    -webkit-transform: rotate(45deg);
    /* Safari 和 Chrome */
    -o-transform: rotate(45deg);
  }

</style>
