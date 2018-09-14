<template>
  <div class="content">
    <div class="notice-wrap">
      <user-menu></user-menu>
      <div class="reward-wrap reward-list" v-loading="loading">
        <div class="salary-cell">
          <span class="salary">{{tables.refund}}</span>
          <span class="salary-unit">当前奖金组</span>
        </div>
        <div class="tab-line">
          <p>玩法奖金详情</p>
        </div>
        <table id="table">
        </table>
      </div>
    </div>
  </div>
</template>
<script>
  import request from '../axios/axios';
  import UserMenu from "./userMenu";

  export default {
    components: {
      UserMenu
    },
    data() {
      return {
        loading: false,
        tables: {
          items: [],
          arr: [],
          refund: ''
        }
      }
    },
    methods: {
      //获取奖金组列表
      getTables(id) {
        let self = this;
        let url = '/lottery/user/refund/detail';
        //三维数组
        this.loading = true;
        request.http('get', url, { id: id },
          (success) => {
            self.loading = false;
            if (success.returncode) {
              if (success.returncode == 103 || success.returncode == 106 || success.returncode == 101) {
                request.loginAgain(self);
              } else if (success.returncode == 200) {
                self.tables.items = success.data;
                for (let i = 0; i < self.tables.items.length; i++) {
                  let item = self.tables.items[i];
                  let child = { name: item.name, rowspan: 0, children: [] };
                  self.tables.arr.push(child);
                  let children = self.tables.items[i].children;
                  for (let j = 0; j < children.length; j++) {
                    let child2 = { name: children[j].name, rowspan: 0, children: [] };
                    child.children.push(child2);
                    let child_ = children[j].children;
                    for (let k = 0; k < child_.length; k++) {
                      let child__ = child_[k];
                      let child3 = { name: child__.name, refund: parseFloat(child__.refund).toFixed(2), rowspan: 0, children: [] };
                      child2.children.push(child3);
                      let child4 = {};
                      if (child__.extra && child__.extra != null) {
                        for (let v in child__.extra) {
                          child.rowspan += 1;
                          child2.rowspan += 1;
                          child3.rowspan += 1;
                          let extraItem = child__.extra[v];
                          child4 = { name: v, salary: extraItem, rowspan: 1, children: [] }
                          child3.children.push(child4);
                          let child5 = { name: parseFloat(child4.salary).toFixed(2), rowspan: 1 }
                          child4.children.push(child5);
                        }
                      } else {
                        child.rowspan += 1;
                        child2.rowspan += 1;
                        child3.rowspan = 1;
                        child4 = { name: '', salary: parseFloat(child3.refund).toFixed(2), rowspan: 1, children: [] }
                        child3.children.push(child4);
                        let child5 = { name: parseFloat(child4.salary).toFixed(2), rowspan: 1 }
                        child4.children.push(child5);
                      }
                    }
                  }
                }
                // console.log('items', self.tables.items);
                // console.log('arr', self.tables.arr);
                self.render(self.tables.arr, self);
              } else {
                self.$message({
                  showClose: true,
                  message: success.returncode,
                  type: "error"
                });
              }
            }
          },
          (error) => {
            self.loading = false;
            console.log('数据异常', error)
          })
      },
      // 输出table
      render(data, vm) {
        let Data = data; // 随机生成数据
        let templateStr = '<tr>' +
          '<th style="padding: 15px 0;background: #f6f6f6;color: #777;font-size: 14px;border: 1px solid #DADADA;border-collapse: collapse;"></th>' +
          '<th style="padding: 15px 0;background: #f6f6f6;color: #777;font-size: 14px;border: 1px solid #DADADA;border-collapse: collapse;width: 200px">类型</th>' +
          '<th style="padding: 15px 0;background: #f6f6f6;color: #777;font-size: 14px;border: 1px solid #DADADA;border-collapse: collapse;width: 282px">返点</th>' +
          '<th style="padding: 15px 0;background: #f6f6f6;color: #777;font-size: 14px;border: 1px solid #DADADA;border-collapse: collapse;width: 247px">玩法</th>' +
          '<th style="padding: 15px 0;background: #f6f6f6;color: #777;font-size: 14px;border: 1px solid #DADADA;border-collapse: collapse;width:161px">单注奖金/元</th>' +
          '</tr>';
        for (let i = 0, l = Data.length; i < l; i++) {
          let children = vm.getChildren(Data[i], true, vm); // 获取列尾部节点集合

          // 定义一个数组 用于存放每一列的rowspan
          let arrayRowspan = [];
          for (let si = 0; si < children.columns; si++) {
            arrayRowspan.push(0);
          }

          // 遍历行
          for (let j = 0, k = children.array.length; j < k; j++) {
            templateStr += '<tr>';
            let rowspan = vm.getRowspanOfMin(arrayRowspan);
            for (let ii = rowspan.index; ii < children.columns; ii++) {
              let parent = children.array[j].parents[ii];
              if (parent) {
                templateStr += '<td rowspan="' + parent.childrenLength + '" style="border: 1px solid #DADADA;color: #000;line-height: 42px;">' + parent.name + '</td>';
                arrayRowspan[ii] = arrayRowspan[ii] + parent.childrenLength;
              } else {
                templateStr += '<td style="border: 1px solid #DADADA;color: #000;line-height: 42px;">' + children.array[j].name + '</td>';
                arrayRowspan[ii] = arrayRowspan[ii] + 1;
              }
            }
            templateStr += '</tr>';
          }
        }
        document.getElementById('table').innerHTML = templateStr;
        // document.getElementById('table').className='#table';
      },

      /**
       * 获取rowspan最小的那一列
       */
      getRowspanOfMin(arrayRowspan) {
        let rowspan = Math.min.apply(null, arrayRowspan);
        return {
          index: arrayRowspan.indexOf(rowspan),
          rowspan: rowspan
        };
      },

      // 给定一个对象 返回该对象列尾部节点集合
      getChildren(data, update = false, vm) {
        let array = [],
          columns = 0,
          columnsTemp = 0;
        recursionFind(data);

        function recursionFind(data_) {
          columnsTemp++;

          if (!data_) {
            data_.childrenLength = vm.getChildrenLength(data_);
          }
          if (data_.children && data_.children.length) {
            let parents = [];
            if (update) {
              data_.childrenLength = vm.getChildrenLength(data_);
              parents = data_.parents ? vm.copeObj(data_.parents, vm) : [];
              parents.push(vm.copeObj(data_, vm));
            }
            for (let i = 0, l = data_.children.length; i < l; i++) {
              if (update) {
                data_.children[i].parents = parents;
              }
              recursionFind(data_.children[i]);
            }
          } else {
            array.push(data_);
            // 当遍历到列尾 锁定列数
            if (columnsTemp > columns) {
              columns = columnsTemp;
            }
            columnsTemp = 0;
          }
        }

        return {
          array: array,
          columns: columns
        };
      },

      getChildrenLength(data) {
        let num = 0;
        recursionFind2(data);

        function recursionFind2(data_) {
          if (data_.children && data_.children.length) {
            for (let i = 0, l = data_.children.length; i < l; i++) {
              recursionFind2(data_.children[i]);
            }
          } else {
            num++;
          }
        }

        return num;
      },

      // 拷贝
      copeObj(obj, vm) {
        let newObj;
        if (Object.prototype.toString.call(obj) === '[object Array]') {
          newObj = obj.slice(0);
          return newObj;
        } else if (Object.prototype.toString.call(obj) === '[object Object]') {
          newObj = {};
        } else {
          return obj;
        }
        Object.keys(obj).forEach(function(v) {
          if (v !== 'parents' && v !== 'children') {
            newObj[v] = vm.copeObj(obj[v], vm);
          }
        });
        return newObj;
      }
    },
    mounted() {
      let self = this;
      if (this.$route.query) {
        if (this.$route.query.refund) {
          let refund = this.$route.query.refund;
          this.tables.refund = refund.split('-')[0];
        }
        if (this.$route.query.id) {
          this.getTables(this.$route.query.id);
        } else {
          self.$alert('<div class="lottery-title">该奖金组不存在，请联系管理员</div>', '系统提醒', {
            confirmButtonText: '确定',
            center: true,
            dangerouslyUseHTMLString: true,
            customClass: "syxw-wrap-inner",
            callback: action => {
              setTimeout(function() {
                self.$router.push({ name: 'reward' });
              }, 1000)
            }
          })
        }
      }
    },
    created() {
      this.$store.dispatch('setbodyBG', 'no-bg');
      localStorage.setItem('bodyBG', 'no-bg');
    }
  }
</script>
<style scoped>
  .tab-line {
    font-family: PingFangSC-Regular;
    font-weight: 700;
    font-size: 16px;
    color: #191919;
    text-align: left;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
  }

  .salary-cell {
    font-size: 12px;
    color: rgba(51, 51, 51, 1);
    background: #F3F3F3;
    color: #333;
    border-radius: 50%;
    height: 123px;
    width: 123px;
    line-height: 35px;
    margin: 0 auto;
    padding-top: 30px;
  }

  .salary-cell .salary {
    font-size: 36px;
    display: block;
  }

  .salary-cell .salary-unit {
    font-size: 12px;
  }

  .reward-wrap {
    padding: 30px 20px;
    color: #333333;
    min-height: 500px;
    width: 1024px;
    background: #fff;
    margin: 0 auto;
  }

  .reward-list>table {
    width: 100%;
  }

  .clearfix:after {
    content: ".";
    display: block;
    height: 0;
    clear: both;
    overflow: hidden;
  }

  table,
  th,
  td {
    border: 1px solid #DADADA;
    border-collapse: collapse;
    font-size: 14px;
    color: #333;
  }

  .reward-list tr {
    background: #fff;
  }

  .reward-list td>a {
    display: inline-block;
    height: 25px;
    border-radius: 6px;
    font-family: MicrosoftYaHei;
    line-height: 25px;
    cursor: pointer;
    text-decoration: none;
    font-size: 14px;
    color: #333;
  }

  .reward-list td {
    height: 42px;
    line-height: 42px;
    width: 247px;
  }

  .reward-list .col1 {
    width: 180px;
  }

  .reward-list .col2 {
    width: 242px;
  }

  .reward-list .col3 {
    width: 312px;
  }

  .reward-list col4 {
    width: 252px;
  }

  .notice-wrap {
    font-family: MicrosoftYaHei;
    color: #191919;
    margin: 0 auto;
    width: 1090px;
    position: relative;
  }
</style>