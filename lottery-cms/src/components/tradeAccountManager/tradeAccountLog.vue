<template>
  <div class="rechargeLot-wrap el-custom">
    <div class="content-header">
      <div class="title">
        <h2>{{titleName}}</h2>
      </div>
      <div class="search-wrap">
        <div class="nav-title">
          <span :class="item.checked?'current':''" v-for="(item, index) in routerArr" :key="index" @click="handleChangeRouter(item.name)">{{item.title}}</span>
        </div>
        <div class="search-content">
          <div class="search-inner-wrap">
            <label>平台：</label>
            <el-input clearable v-model="platform" placeholder="平台" style="width:114px;"></el-input>
          </div>
          <div class="search-inner-wrap">
            <label>id：</label>
            <el-input clearable v-model="id" placeholder="id" style="width:114px;"></el-input>
          </div>
          <div class="search-inner-wrap">
            <label>类型：</label>
            <el-select clearable v-model="type" placeholder="请选择类型" class="small">
              <el-option v-for="item in typeArr" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </div>
          <div class="search-inner-wrap">
            <el-button type="danger" @click="handleSearch" size="medium" class="yes small">搜索</el-button>
            <el-button type="info" @click="handleReset" size="medium" class="no small">重置</el-button>
          </div>
        </div>
      </div>
    </div>
    <div class="content-middle">
      <div class="search-wrap">
        <div class="search-inner-wrap">
          <el-button type="success" size="medium" class="edit">新增账户类型</el-button>
        </div>
      </div>
    </div>
    <div class="data-table" v-loading="loading">
      <el-table :data="withdrawListData" header-row-class-name="table-header" stripe border style="width: 100%;font-size:12px;">
        <el-table-column align="center" prop="code" label="代号">
        </el-table-column>
        <el-table-column align="center" prop="name" label="名称">
        </el-table-column>
        <el-table-column align="center" prop="status" label="状态">
        </el-table-column>
        <el-table-column align="center" prop="type" label="类型">
        </el-table-column>
        <el-table-column align="center" fixed="right" label="操作" width="110">
          <template slot-scope="scope">
            <div class="flex-row">
              <el-button class="small edit">编辑</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <!-- <div class="fenye">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageNum" :page-size="pageSize"
          :page-sizes="[10, 20, 40, 80,160,350,700,1000]" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </div> -->
    </div>
  </div>
</template>
<script>
  import request from '../../axios/axios.js'
  import DialogUserInfo from '../dialog-user-info/DialogUserInfo';
  import tableBtn from '../littleStyle/tableBtn.vue';
  import moment from 'moment'
  import {
    trim
  } from "../../lib/utils/validator";
  export default {
    name: 'tradeAccountLog',
    components: {
      tableBtn,
      DialogUserInfo
    },
    data() {
      return {
        index1: '',
        index2: '',
        titleName: '收款账户管理',
        routerArr: [{
          title: '收款账户管理',
          name: 'tradeAccountLog',
          checked: false
        }],
        loading: false,
        pageNum: 1,
        pageSize: 10,
        total: 10,
        withdrawListData: [],
        typeArr: [{
          value: '1',
          label: '微信'
        }, {
          value: '2',
          label: '支付宝'
        }, {
          value: '3',
          label: '银行卡转账'
        }],
        type: '',
        platform: '',
        id: '',
        duration: 1000,
      }
    },
    created() {
      this.routerArr = [];
      let query = this.$route.query;
      this.index1 = Number(query.index1);
      this.index2 = Number(query.index2);
      const menus = JSON.parse(localStorage.getItem('menus'));
      menus[this.index1].child[this.index2].child.filter((v, vi) => {
        let o = new Object();
        if (v.url === 'outcomeLog') {
          this.titleName = v.menu_name;
        }
        o.title = v.menu_name;
        o.name = v.url;
        o.checked = false;
        this.routerArr.push(o);
      })
      this.routerArr.filter(v => {
        if (this.titleName === v.title) {
          v.checked = true
        } else {
          v.checked = false
        }
      })
      this.getWithdrawLotList();
    },
    methods: {
      handleChangeRouter(name) {
        this.$router.push({
          name: name,
          query: {
            index1: this.index1,
            index2: this.index2
          }
        })
      },
      success() {
        const vm = this;
        this.$message({
          message: '加载成功',
          type: 'success',
          duration: vm.duration,
          center: true
        })
      },
      error() {
        const vm = this;
        this.$message({
          message: '加载失败',
          type: 'error',
          duration: vm.duration,
          center: true
        })
      },
      isStatusFn(row, column, cellValue) {
        switch (cellValue) {
          case 0:
            return '默认';
          case 1:
            return '申请';
          case 2:
            return '一审通过';
          case 3:
            return '二审通过';
          case 4:
            return '终审通过';
          case 5:
            return '出账';
          case 6:
            return '银行退单';
          case 7:
            return '审核失败';
        }
      },
      getStatus(status) {
        // console.log(typeof cellValue)
        switch (status) {
          case 1:
            return '申请';
          case 2:
            return '一审通过';
          case 3:
            return '二审通过';
          case 4:
            return '终审通过';
          case 5:
            return '出账';
          case 6:
            return '银行退单';
          case 7:
            return '审核失败';
            // case 8:
            //   return '到账';
        }
      },
      getTime(time) {
        return moment(time).format('YYYY-MM-DD HH:mm:ss')
      },
      handleSizeChange(val) {
        this.pageSize = val;
        this.getWithdrawLotList();
      },
      handleCurrentChange(val) {
        this.pageNum = val;
        this.getWithdrawLotList();
      },
      formatTime(row, column, cellValue) {
        if (cellValue) {
          return moment(cellValue).format('YYYY-MM-DD HH:mm:ss')
        }
        return "--"
      },
      formatTime2(cellValue) {
        if (cellValue) {
          return moment(cellValue).format('YYYY-MM-DD HH:mm:ss')
        }
        return "--"
      },
      getWithdrawLotList() {
        const vm = this;
        vm.loading = true;
        request.http(
          'get',
          '/trade/accountType/list', {
            platform: vm.platform,
            type: vm.type,
            id: vm.id,
          },
          (success) => {
            vm.loading = false;
            let code = success.returncode;
            if (code === 200) {
              vm.withdrawListData = success.data;
              vm.success();
            } else if (code === 101 || code === 103 || code === 106) {
              request.loginAgain(vm)
            }
          },
          (error) => {
            vm.loading = false;
            vm.error();
            console.log(error)
          }
        )
      },
      handleReset() {
        this.type = '';
        this.platform = '';
        this.id = '';
      },
      handleSearch() {
        this.pageNum = 1;
        this.getWithdrawLotList();
      },
      handleClose() {
        this.resetForm('form')
      },
    },
  }

</script>
<style>
  .rechargeLot-wrap .el-form-item__content {
    text-align: left;
  }

  .rechargeLot-wrap .flex-row {
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }

  .rechargeLot-wrap .flex-row>button {
    flex: 1;
    padding: 0;
  }

</style>

<style scoped lang="scss">
  li {
    list-style: none;
  }

  .cell {
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }

  .detail-title {
    text-align: left;
    p {
      font-family: PingFangSC-Medium;
      font-size: 16px;
      color: #191919;
      margin-left: 30px;
      font-weight: 700;
    }
  }

  .dialog-table {
    width: 100%;
    border-collapse: collapse;
    border-bottom: 1px solid #e6e6e6;
  }

  .dialog-table td {
    font-size: 12px;
    line-height: 38px;
    height: 40px;
    text-align: center;
    color: #191919;
    border-left: 1px solid #e6e6e6;
    border-bottom: 1px solid #e6e6e6;
  }

  .dialog-table tfoot td {
    border: none;
  }

  .dialog-table td.title {
    border: none;
    line-height: 38px;
    height: 40px;
    background: #f0f0f0;
    text-align: center;
    font-size: 12px;
    color: #191919;
  }

  .dialog-table .td-left {
    background: #f2f2f2;
  }

  .dialog-table .td-right {
    text-align: center;
  }

</style>
