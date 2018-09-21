<template>
  <div class="el-custom">
    <DialogUserInfo v-if="dialog" @sendDiglogShow="handleDialogShow" @closeDialog="handleCloseDialog"></DialogUserInfo>
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
            <label>游戏大类：</label>
            <el-select v-model="gameType.selected" clearable placeholder="选择游戏大类" @change="gameTypeChange" @focus="gameTypeFocus"
              :loading="gameType.loading" :loading-text="gameType.loadingText" class="small">
              <el-option v-for="item in gameType.options" :key="item._id" :label="item.name" :value="item._id">
              </el-option>
            </el-select>
          </div>
          <div class="search-inner-wrap">
            <label>游戏名称：</label>
            <el-select v-model="gameList.selected" clearable placeholder="选择游戏名称" class="small">
              <el-option v-for="item in gameList.options" :key="item._id" :label="item.name" :value="item._id">
              </el-option>
            </el-select>
          </div>
          <div class="search-inner-wrap">
            <el-button type="danger" @click="handleSearch" size="medium" class="small yes">搜索</el-button>
            <el-button type="info" @click="handleReset" size="medium" class="small no">重置</el-button>
          </div>
          <!-- <tableBtn :text="'搜索'" :plain="false" :btnType="'success'" :func="handleSearch"></tableBtn> -->
        </div>
      </div>
    </div>
    <div class="data-table" v-loading="loading">
      <el-table :data="getModifiedLotList" header-row-class-name="table-header" stripe border style="width: 100%;font-size:12px;">
        <!-- <el-table-column prop="code" align="center" label="代码">
        </el-table-column> -->
        <el-table-column prop="l2" align="center" label="彩种">
        </el-table-column>
        <el-table-column prop="l3" align="center" label="玩法分类">
        </el-table-column>
        <el-table-column prop="l4" label="二级分类" align="center">
        </el-table-column>
        <el-table-column align="center" label="玩法名称">
          <template slot-scope="scope">
            <el-input v-model.trim="scope.row.name" @blur="gameNameBlur(scope.row)" :data-code="scope.row.code+'name'"
              @focus="gameNameFocus" @keyup.enter.native="gameNameEnter" :ref="scope.row.code+'name'">
            </el-input>
          </template>
        </el-table-column>
        <el-table-column label="赔率" align="center">
        </el-table-column>
        <el-table-column align="center" label="最多投注">
          <template slot-scope="scope">
            <el-input v-model.trim="scope.row.max_votes" @blur="gameVoteBlur(scope.row)" :data-code="scope.row.code+'vote'"
              @focus="gameVoteFocus" @keyup.enter.native="gameVoteEnter" :ref="scope.row.code+'vote'">
            </el-input>
          </template>
        </el-table-column>
        <el-table-column align="center" label="排序值">
          <template slot-scope="scope">
            <el-input v-model.trim="scope.row.order" @blur="gameOrderBlur(scope.row)" :data-code="scope.row.code+'order'"
              @focus="gameOrderFocus" @keyup.enter.native="gameOrderEnter" :ref="scope.row.code+'order'">
            </el-input>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="max_prize" align="center" label="奖金">
        </el-table-column> -->
        <el-table-column label="开启玩法" align="center">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.enabled" @change="gameEnableChange(scope.row)">
            </el-switch>
          </template>
        </el-table-column>
        <!-- <el-table-column align="center" label="移动端">
        </el-table-column>
        <el-table-column align="center" label="微信">
        </el-table-column> -->
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <el-button class="small edit">测试</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- <div class="fenye">
         <el-pagination
           @size-change="handleSizeChange"
           @current-change="handleCurrentChange"
           :current-page="pageNum"
           :page-size="pageSize"
           layout="total, prev, pager, next, jumper"
           :total="total">
         </el-pagination>
       </div>-->
    </div>
  </div>
</template>
<script>
  import request from '../../axios/axios.js'
  import DialogUserInfo from '../dialog-user-info/DialogUserInfo';
  import tableBtn from '../littleStyle/tableBtn.vue';
  import moment from 'moment';

  export default {
    name: 'playType',
    components: {
      tableBtn,
      DialogUserInfo,
    },
    data() {
      return {
        index1: 0,
        index2: 0,
        titleName: '玩法管理',
        routerArr: [{
            title: '开奖管理',
            name: 'lottery',
            checked: false
          },
          {
            title: '彩种管理',
            name: 'lotteryType',
            checked: false
          },
          {
            title: '玩法管理',
            name: 'playType',
            checked: false
          },
        ],
        loading: false,
        logListData: [],
        username: '',
        searchTime: '',
        pickerOptions: {
          shortcuts: [{
            text: '今天',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '昨天',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              end.setTime(start.getTime() - 3600 * 1000 * 24);
              start.setTime(start.getTime() - 3600 * 1000 * 24);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
        duration: 1000,
        dialog: false,
        dialogIsShow: false,
        //游戏大类
        gameType: {
          options: [],
          selected: '',
          loading: false,
          loadingText: '搜索中...'
        },
        //游戏名称
        gameList: {
          options: [],
          selected: '',
        },
        blurGameName: '', //失去焦点时的游戏名称
        focusGameName: '', //获取焦点时的游戏名称
        blurMaxVote: '', //失去焦点的最大投注
        focusMaxVote: '', //获取焦点的最大投注
        blurOrder: '', //失去焦点的排序
        focusOrder: '', //获取焦点的排序
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
        if (v.url === 'playType') {
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
        // console.log(name)
      },
      //玩法名称监听enter事件
      gameNameEnter(event) {
        let ref_id = event.target.dataset.code;
        this.$refs[ref_id].blur();
      },
      //玩法名称失去焦点
      gameNameBlur(row) {
        this.blurGameName = row.name;
        if (!this.blurGameName) {
          //提示用户需要输入修改的文字
          this.$alert('请输入玩法名称', '系统提示', {
            confirmButtonText: '确定',
            callback: action => {
              row.name = this.focusGameName;
            }
          });
        } else {
          if (this.blurGameName != this.focusGameName) {
            //发起请求，修改该单元格的内容
            this.modifiedGameType('name', this.blurGameName, row._id)
          } else {
            //不做任何改变
            // console.log('失去焦点', '值未变化')
          }
        }

      },
      //玩法名称获取焦点
      gameNameFocus(event) {
        this.focusGameName = event.target.value;
      },
      //获取玩法状态
      getgameTypeStatus(value) {
        let status = false;
        if (value == 1) {
          status = true;
        } else if (value == 0) {
          status = false;
        }
        return status;
      },
      gameTypeFocus() {
        if (this.gameType.options.length === 0) {
          this.getGameType();
        }
      },
      gameTypeChange(value) {
        if (value) {
          let obj = {};
          obj = this.gameType.options.find((item) => {
            return item._id === value;
          });
          this.gameList.options = obj.childLotterys;
          this.gameList.selected = '';
        } else {
          this.gameList.options = [];
          this.gameList.selected = '';
        }
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
      //message
      message(text, type) {
        const vm = this;
        this.$message({
          message: text,
          type: type,
          duration: vm.duration,
          center: true
        })
      },
      /* handleSizeChange(val) {
         // console.log(`每页 ${val} 条`);
       },
       handleCurrentChange(val) {
         this.pageNum = val;
         this.getLotList();
        //  console.log(`当前页: ${val}`);
       },*/
      getUserInfoFn(row) {
        this.dialog = true;
      },
      handleCloseDialog(val) {
        this.dialog = val;
      },
      handleDialogShow(val) {
        this.dialogIsShow = val;
      },
      formatTime(row, column, cellValue) {
        return moment(cellValue).format('YYYY-MM-DD HH:mm:ss')
        // return moment(cellValue).format('YYYY-MM-DD')
      },
      getLotList(id) {
        const vm = this;
        vm.loading = true;
        request.http(
          'get',
          '/lottery/list', {
            id: id
          },
          (success) => {
            vm.loading = false;
            let code = success.returncode;
            if (code === 200) {
              vm.logListData = success.data;
              // console.log('logListData', vm.logListData)
              vm.success();
            } else if (code === 101 || code === 103 || code === 106) {
              request.loginAgain(vm)
            }
          },
          (error) => {
            vm.loading = false;
            vm.error();
          }
        )
      },
      //彩票种类
      getGameType() {
        const vm = this;
        vm.gameType.loading = true;
        request.http(
          'get',
          '/lottery/game/list', {},
          (success) => {
            vm.gameType.loading = false;
            let code = success.returncode;
            if (code === 200) {
              vm.gameType.options = success.data;
            } else if (code === 101 || code === 103 || code === 106) {
              request.loginAgain(vm)
            }
          },
          (error) => {
            vm.gameType.loading = false;
          }
        )
      },
      handleReset() {
        this.gameType.selected = "";
        this.gameList.options = [];
        this.gameList.selected = "";
      },
      handleSearch() {
        let id = this.gameList.selected;
        if (id) {
          this.getLotList(this.gameList.selected);
        } else {
          this.$alert('请选择游戏名称', '系统提示', {
            confirmButtonText: '确定',
          });
        }
      },
      //玩法修改
      modifiedGameType(key, value, id) {
        let self = this,
          data = {};
        let url = '/lottery/update';
        data['id'] = id;
        data[key] = value;
        request.http('post', url, data, (success) => {
          self.loading = false;
          let code = success.returncode;
          if (code === 200) {
            self.message('修改成功', 'success');
          } else if (code === 101 || code === 103 || code === 106) {
            request.loginAgain(self)
          }
        }, (error) => {
          self.loading = false;
          self.message('修改失败', 'error');
        })
      },
      //最多投注监听enter事件
      gameVoteEnter(event) {
        let ref_id = event.target.dataset.code;
        this.$refs[ref_id].blur();
      },
      //最多投注失去焦点
      gameVoteBlur(row) {
        this.blurMaxVote = row.max_votes;
        if (!this.blurMaxVote) {
          this.$alert('请输入一个正确的最大投注值', '系统提示', {
            confirmButtonText: '确定',
            callback: action => {
              row.max_votes = this.focusMaxVote;
            }
          });
        } else {
          if (this.blurMaxVote != this.focusMaxVote) {
            this.modifiedGameType('max_votes', this.blurMaxVote, row._id)
          }
        }
      },
      //最多投注获取焦点
      gameVoteFocus(event) {
        this.focusMaxVote = event.target.value;
      },
      //排序监听enter事件
      gameOrderEnter(event) {
        let ref_id = event.target.dataset.code;
        this.$refs[ref_id].blur();
      },
      //排序失去焦点
      gameOrderBlur(row) {
        this.blurOrder = row.order;
        if (!this.blurOrder) {
          this.$alert('请输入一个正确的排序值', '系统提示', {
            confirmButtonText: '确定',
            callback: action => {
              row.order = this.focusOrder;
            }
          });
        } else {
          if (this.blurOrder != this.focusOrder) {
            //发起请求，修改该单元格的内容
            this.modifiedGameType('order', this.blurOrder, row._id)
          }
        }
      },
      //排序获取焦点
      gameOrderFocus(event) {
        this.focusOrder = event.target.value;
      },
      gameEnableChange(row) {
        // console.log('value', value);
        let enabled = '';
        if (row.enabled) {
          enabled = '1';
        } else {
          enabled = '0'
        }
        this.modifiedGameType('enabled', enabled, row._id)
      }
    },
    computed: {
      getModifiedLotList() {
        let data = this.logListData;
        for (let i = 0; i < data.length; i++) {
          let item = data[i];
          data[i].enabled = this.getgameTypeStatus(item.enabled);
        }
        return data;
      }
    }
  }

</script>
<style>
  /* @import '../../publicCss/header.css'; */

</style>
