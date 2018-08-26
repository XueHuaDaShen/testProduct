<template>
  <div>
    <div class="bets-text-wrap">
      <hr class="my-split-line">
      <div class="import-text-wrap">
        <button class="import-btn">导入注单</button>
        <input type="file" @change="handleImportText($event)" class="hidden-file">
        <div class="optional-oprate" v-if="betsArr.item.checkBit">
          <span @click="handleClickLabel(k, i)" :class="setIsChecked(k)?'checked':''" v-for="(k, i) in optionalArr" :key="i"><input :checked="setIsChecked(k)" type="checkbox">{{k}}位</span>
        </div>
      </div>
      <!-- 01 02 03|03 04 05|07 08 11 -->
      <div v-if="lotteryType==='ssc'" class="show-betsNum-area" @drop="importBetsFile($event)">
        <textarea name=""
          placeholder="说明：
1、支持常见的各种单式格式，间隔符如： 换行符 回车 逗号 分号等
2、上传文件后缀必须是.txt格式,最大支持10万注，并支持拖拽文件到文本框进行上传
3、文件较大时会导致上传时间较长，请耐心等待！

格式范例：12345 23456 88767 33021 98897"
          v-model="betsNumber"
          ref="betsArea"
          @focus="handleTextareaFocus"
          @blur="handleTextareaBlur"
          @keyup="handleInputBetsNum"
          id="my-betsNumber-area"
          cols="30"
          rows="10"></textarea>
      </div>
      <div v-if="lotteryType==='syxw'" class="show-betsNum-area" @drop="importBetsFile($event)">
        <textarea name=""
          placeholder="说明：
1、支持常见的各种单式格式，间隔符如： 换行符 回车 逗号 分号等, 号码之间则使用空格隔开
2、上传文件后缀必须是.txt格式,最大支持10万注，并支持拖拽文件到文本框进行上传
3、文件较大时会导致上传时间较长，请耐心等待！

格式范例：01 02 03|03 04 05|07 08 11"
          v-model="betsNumber"
          ref="betsArea"
          @focus="handleTextareaFocus"
          @blur="handleTextareaBlur"
          @keyup="handleInputBetsNum"
          id="my-betsNumber-area"
          cols="30"
          rows="10"></textarea>
      </div>
      <div class="oprate-bets-wrap">
        <button @click="clearErrorTextFn">清理错误与重复</button>
        <button @click="clearTextFn">清空文本框</button>
      </div>
    </div>
    <el-dialog title="温馨提示" :center="true" :visible.sync="dialogFormVisible">
      <span class="error-tip-title">以下号码错误，已进行自动过滤</span>
      <textarea name=""
        v-model="filterNumber"
        cols="30"
        rows="10"></textarea>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogFormVisible = false">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import lottery from '../../static/lottery';
export default {
  name: 'betsText',
  props: {
    betsArr: {
      type: Object,
      required: true
    },
    lotteryType: {
      type: String,
    }
  },
  created() {
    var valueLen = 1;
    const vm = this;
    try{
      valueLen = this.betsArr.item.valueLen;
      this.isCheckOptional = this.betsArr.item.checkLen
    }catch(e){}
  },
  computed: {
    getclearBetsNum() {
      return this.$store.state.clearBetsNum;
    }
  },
  data() {
    return {
      dialogFormVisible: false,
      filterNumber: '',
      defaultText: '',
      betsNumber: '',
      optionalArr: ['万', '千', '百', '十', '个'],
      isCheckOptional: []
    }
  },
  methods: {
    importBetsFile(e) {
      e.preventDefault();
      var file = e.dataTransfer.files[0];
      this.loadBetsFile(file)
    },
    handleImportText(e) {
      var file = e.target.files[0];
      if(file){
        this.loadBetsFile(file)
        e.target.value = '';
      }
    },
    loadBetsFile(file) {
      const vm = this;
      var reader = new FileReader();//new一个FileReader实例
      if (/text+/.test(file.type)) {//判断文件类型，是不是text类型
        reader.onload = function() {
          vm.betsNumber = this.result;
          if(vm.lotteryType === 'ssc'){
            vm.ssc_checkBetsText(false);
          }else if(vm.lotteryType === 'syxw'){
            vm.syxw_checkBetsText(false);
          }
        }
        reader.readAsText(file);
      }else{
        alert('对不起，导入数据格式必须是.txt格式文件，请您调整格式后重新上传，谢谢 ！')
      }
    },
    handleTextareaFocus() {
      var text = this.$refs['betsArea'].placeholder;
      const vm = this;
      // if(!this.defaultText){
      //   this.defaultText = text;
      // }
      this.$refs['betsArea'].placeholder = '';
      document.onkeydown = e => {
        if(e.ctrlKey && e.code === 'KeyA'){
          vm.$refs['betsArea'].select();
        }
      }
    },
    handleInputBetsNum() {
      const vm = this;
      let len = 0;
      if(this.isCheckOptional){
        len = this.isCheckOptional.length
      }else{
        len = 0;
      }
      if(vm.lotteryType === 'ssc'){
        // console.log(this.isCheckOptional)
        vm.ssc_checkBetsText(false, len);
      }else if(vm.lotteryType === 'syxw'){
        vm.syxw_checkBetsText(false, len);
      }
    },
    handleTextareaBlur() {
      if(this.betsNumber===''){
        this.$refs['betsArea'].placeholder = this.defaultText;
      }
    },
    // ssc_checkBetsText(isCheck, optionalLen) {
    //   const item = this.betsArr.item
    //   const len = item.numLen;
    //   const isDouble = item.isDouble;
    //   const order = item.order;
    //   //分割符
    //   const sym = ' ';
    //   const opArrLen = optionalLen || 1;
    //   //将投注的号码进行检测
    //   var checkedBetsNum = this.betsNumber.replace(/[\W\_]+/g,function(n){
    //     if(!/[\u4e00-\u9fa5]/g.test(n)){
    //       return sym
    //     }else{
    //       return n
    //     }
    //   })
    //   //检测后的投注号码 数组
    //   var numArr = checkedBetsNum.split(sym);
    //   //被删除的元素集合，以及剩余有效元素集合
    //   var delArr = [], lifeArr = [];
    //   lifeArr = numArr.filter(v => {
    //     let value = Number(v);
    //     if(!isNaN(value)){
    //       if(v.length === len){
    //         return v
    //       }
    //     }
    //   })
    //   //排序后的数组
    //   var orderArr = [];
    //   if(order){
    //     //排序后的数组
    //     let arr = [];
    //     lifeArr.filter(v => {
    //       let s = v.split('');
    //       let n = s.sort((a, b) => {
    //         return a-b;
    //       }).join('');
    //       arr.push(n)
    //     })
    //     for(let i in arr){
    //       if(orderArr.indexOf(arr[i]) < 0){
    //         orderArr.push(arr[i])
    //       }
    //     }
    //   }else{
    //     orderArr = lifeArr;
    //   }
    //   //去重后的数组
    //   var reduceArr = [];
    //   if(isDouble === 0){
    //     //一注号码每一个都不能一样
    //     reduceArr = orderArr.filter(v => {
    //       let l = v.length;
    //       let arr = [];
    //       v.split('').filter(k => {
    //         if(arr.indexOf(k) < 0){
    //           arr.push(k)
    //         }
    //       })
    //       return arr.length === l;
    //     })
    //   }else if(isDouble === 1){
    //     //可以有两个一样(即可以有一个不一样)
    //     reduceArr = orderArr.filter(v => {
    //       let l = v.length;
    //       let arr = [];
    //       v.split('').filter(k => {
    //         if(arr.indexOf(k) < 0){
    //           arr.push(k)
    //         }
    //       })
    //       return arr.length !== 1;
    //     })
    //   }else if(isDouble === 3){
    //     //可以有两个一样(即可以有一个不一样)
    //     reduceArr = orderArr.filter(v => {
    //       let l = v.length;
    //       let arr = [];
    //       v.split('').filter(k => {
    //         if(arr.indexOf(k) < 0){
    //           arr.push(k)
    //         }
    //       })
    //       return arr.length === 2;
    //     })
    //   }else{
    //     reduceArr = orderArr;
    //   }
    //   var filterArr = [];
    //   for(let i in reduceArr){
    //     if(filterArr.indexOf(reduceArr[i]) < 0){
    //       filterArr.push(reduceArr[i])
    //     }
    //   }
    //   if(isCheck){
    //     let cloneFilterArr = [];
    //     for(let i in filterArr){
    //       cloneFilterArr.push(filterArr[i])
    //     }
    //     numArr.filter((v, i) => {
    //       let n = cloneFilterArr.indexOf(v)
    //       if(n < 0){
    //         delArr.push(v)
    //       }else{
    //         cloneFilterArr.splice(n, 1)
    //       }
    //     })
    //     this.dialogFormVisible = delArr.length>0&&delArr[0]!=='';
    //     this.betsNumber = filterArr.join(sym);
    //     this.filterNumber = delArr.join(sym);
    //     if(this.getclearBetsNum){
    //       this.betsNumber = '';
    //       this.$refs['betsArea'].placeholder = this.defaultText;
    //       this.$emit('eidtToBets', false)
    //       this.$store.dispatch('setclearBetsNum', false)
    //     }
    //   }
    //   this.betsArr.data = filterArr;
    //   var bets = filterArr.length || 0;
    //   this.$store.dispatch('setBets', bets * opArrLen);
    // },
    ssc_checkBetsText(isCheck, optionalLen) {
      const item = this.betsArr.item
      const len = item.numLen;
      const isDouble = item.isDouble;
      const order = item.order;
      //分割符
      const sym = ' ';
      const opArrLen = optionalLen || 1;
      //将投注的号码进行检测
      var checkedBetsNum = this.betsNumber.replace(/[\W\_]+/g,function(n){
        if(!/[\u4e00-\u9fa5]/g.test(n)){
          return sym
        }else{
          return n
        }
      })
      //检测后的投注号码 数组
      var numArr = checkedBetsNum.split(sym);
      var c_numArr = checkedBetsNum.split(sym);
      //被删除的元素集合，以及剩余有效元素集合
      var delArr = [], lifeArr = [];
      for(let i=numArr.length-1; i>=0; i--){
        for(let j=i-1; j>=0; j--){
          if(order){
            let currVal = c_numArr[i].split('').sort((a, b) => {return a-b}).join('');
            let nextVal = c_numArr[j].split('').sort((a, b) => {return a-b}).join('');
            if(nextVal === currVal){
              delArr.push(numArr[i])
              c_numArr.splice(i,1,'')
            }
          }else{
            if(c_numArr[j] === c_numArr[i]){
              delArr.push(numArr[i])
              c_numArr.splice(i,1,'')
            }
          }
        }
      }
      for(let i in c_numArr){
        let value = Number(c_numArr[i]);
        if(!isNaN(value)){
          if(c_numArr[i].length !== len){
            delArr.push(c_numArr[i])
            c_numArr.splice(i,1,'')
          }
        }else{
          delArr.push(c_numArr[i])
          c_numArr.splice(i,1,'')
        }
      }
      if(isDouble === 0){
        //一注号码每一个都不能一样
        for(let i=c_numArr.length-1; i>=0; i--){
          let val = c_numArr[i];
          let l = val.length;
          let arr = [];
          val.split('').filter(k => {
            if(arr.indexOf(k) < 0){
              arr.push(k)
            }
          })
          if(arr.length !== l){
            delArr.push(c_numArr[i])
            c_numArr.splice(i,1,'')
          }
        }
      }else if(isDouble === 1){
        //可以有两个一样(即可以有一个不一样)
        for(let i=c_numArr.length-1; i>=0; i--){
          let val = c_numArr[i];
          let l = val.length;
          let arr = [];
          val.split('').filter(k => {
            if(arr.indexOf(k) < 0){
              arr.push(k)
            }
          })
          if(arr.length === 1){
            delArr.push(c_numArr[i])
            c_numArr.splice(i,1,'')
          }
        }
      }else if(isDouble === 3){
        //必须有两个一样
        for(let i=c_numArr.length-1; i>=0; i--){
          let val = c_numArr[i];
          let l = val.length;
          let arr = [];
          val.split('').filter(k => {
            if(arr.indexOf(k) < 0){
              arr.push(k)
            }
          })
          if(arr.length !== 2){
            delArr.push(c_numArr[i])
            c_numArr.splice(i,1,'')
          }
        }
      }
      // numArr.filter((v, i) => {
      //   let n = delArr.indexOf(v)
      //   if(n < 0){
      //     lifeArr.push(v)
      //   }
      // })
      for(let i=delArr.length-1; i>=0; i--){
        if(delArr[i] === ''){
          delArr.splice(i,1)
        }
      }
      c_numArr.filter(v => {
        if(v !== ''){
          lifeArr.push(v)
        }
      })
      if(isCheck){
        this.dialogFormVisible = delArr.length>0&&delArr[0]!=='';
        this.betsNumber = lifeArr.join(sym);
        this.filterNumber = delArr.join(sym);
        if(this.getclearBetsNum){
          this.betsNumber = '';
          this.$refs['betsArea'].placeholder = this.defaultText;
          this.$emit('eidtToBets', false)
          this.$store.dispatch('setclearBetsNum', false)
        }
      }
      this.betsArr.data = lifeArr;
      var bets = lifeArr.length || 0;
      this.$store.dispatch('setBets', bets * opArrLen);
    },
    syxw_checkBetsText(isCheck, optionalLen) {
      // console.log(this.getclearBetsNum)
      const item = this.betsArr.item
      const len = item.numLen;
      const isDouble = item.isDouble;
      const order = item.order;
      // console.log('item-------',item)
      // console.log('len-------',len)
      // console.log('isDouble-------',isDouble)
      // console.log('order-------',order)
      //分割符
      const sym = 'mySym';
      const opArrLen = optionalLen || 1;
      //将投注的号码进行检测
      let c1, c2, c3, c4=[], c5=[];
      let copy_c4=[];
      c1 = this.betsNumber.replace(/\s+/g,function(v){return sym});
      c2 = c1.replace(/[\W\_]/g,(n)=>{
        if(!/[\u4e00-\u9fa5]/g.test(n)){
        return ' '
        }else{
          return n
        }
      });
      c3 = c2.split(' ');
      c3.filter(v => {
        c4.push(v.replace(/mySym/g,()=>{return ' '}))
      })
      c4.filter(v => {
        let num = v.replace(/(^\s*)|(\s*$)/g,()=>{return ''});
        if(num!==''){
          c5.push(num)
          copy_c4.push(num)
        }
      })
      //检测后的投注号码 数组 c5
      
      //被删除的元素集合，以及剩余有效元素集合
      var delArr = [], lifeArr = [];
      for(let i in copy_c4){
        let val = copy_c4[i];
        let isVaildVal = val.split(' ').every((n) => {
          return ( !isNaN (n) && Number(n) > 0 && Number(n) < 12 && n.toString().length === 2 )
        })
        if(isVaildVal){
          if(val.split(' ').length !== len){
            delArr.push(copy_c4[i])
            copy_c4.splice(i,1,'')
          }
        }else{
          delArr.push(copy_c4[i])
          copy_c4.splice(i,1,'')
        }
      }
      for(let i=copy_c4.length-1; i>=0; i--){
        for(let j=i-1; j>=0; j--){
          if(copy_c4[i] !== ''){
            if(order){
              let currVal = copy_c4[i].split(' ').sort((a, b) => {return a-b}).join('');
              let nextVal = copy_c4[j].split(' ').sort((a, b) => {return a-b}).join('');
              if(nextVal === currVal){
                delArr.push(copy_c4[i])
                copy_c4.splice(i,1,'')
              }
            }else{
              if(copy_c4[j] === copy_c4[i]){
                delArr.push(copy_c4[i])
                copy_c4.splice(i,1,'')
              }
            }
          }
        }
      }
      for(let i=copy_c4.length-1; i>=0; i--){
        let val = copy_c4[i];
        let l = val.split(' ').length;
        let arr = [];
        val.split(' ').filter(k => {
          if(arr.indexOf(k) < 0){
            arr.push(k)
          }
        })
        if(arr.length !== l){
          delArr.push(copy_c4[i])
          copy_c4.splice(i,1,'')
        }
      }
      for(let i=delArr.length-1; i>=0; i--){
        if(delArr[i] === ''){
          delArr.splice(i,1)
        }
      }
      copy_c4.filter((v, i) => {
        if(v !== ''){
          lifeArr.push(v)
        }
      })
      if(isCheck){
        this.dialogFormVisible = delArr.length>0&&delArr[0]!=='';
        this.betsNumber = lifeArr.join('|');
        this.filterNumber = delArr.join('|');
        if(this.getclearBetsNum){
          this.betsNumber = '';
          this.$refs['betsArea'].placeholder = this.defaultText;
          this.$emit('eidtToBets', false)
          this.$store.dispatch('setclearBetsNum', false)
        }
      }
      this.betsArr.data = lifeArr;
      var bets = lifeArr.length || 0;
      this.$store.dispatch('setBets', bets * opArrLen);
    },
    // syxw_checkBetsText(isCheck, optionalLen) {
    //   // console.log(this.getclearBetsNum)
    //   const item = this.betsArr.item
    //   const len = item.numLen;
    //   const isDouble = item.isDouble;
    //   const order = item.order;
    //   // console.log('item-------',item)
    //   // console.log('len-------',len)
    //   // console.log('isDouble-------',isDouble)
    //   // console.log('order-------',order)
    //   //分割符
    //   const sym = 'mySym';
    //   const opArrLen = optionalLen || 1;
    //   //将投注的号码进行检测
    //   let c1, c2, c3, c4=[], c5=[];
    //   let copy_c4=[];
    //   c1 = this.betsNumber.replace(/\s+/g,function(v){return sym});
    //   c2 = c1.replace(/[\W\_]/g,(n)=>{
    //     if(!/[\u4e00-\u9fa5]/g.test(n)){
    //     return ' '
    //     }else{
    //       return n
    //     }
    //   });
    //   c3 = c2.split(' ');
    //   c3.filter(v => {
    //     c4.push(v.replace(/mySym/g,()=>{return ' '}))
    //   })
    //   c4.filter(v => {
    //     let num = v.replace(/(^\s*)|(\s*$)/g,()=>{return ''});
    //     if(num!==''){
    //       c5.push(num)
    //       copy_c4.push(num)
    //     }
    //   })
    //   //检测后的投注号码 数组 c5
      
    //   //被删除的元素集合，以及剩余有效元素集合
    //   var delArr = [], lifeArr = [];
    //   lifeArr = c5.filter(v => {
    //     // console.log('每一项----', v)
    //     // console.log('每一项的长度----',v.length)
    //     // console.log('应该长度----',len)
    //     let isVaildVal = v.split(' ').every((n) => {
    //       return ( !isNaN (n) && Number(n) > 0 && Number(n) < 12 && n.toString().length === 2 )
    //     })
    //     if(isVaildVal){
    //       return v.split(' ').length === len
    //     }
    //   })
    //   // console.log('copy_c4--------',copy_c4)
    //   // console.log('lifeArr--------',lifeArr)
    //   //排序后的数组
    //   var orderArr = [];
    //   if(order){
    //     //排序后的数组
    //     let arr = [];
    //     lifeArr.filter(v => {
    //       let s = v.split(' ');
    //       let n = s.sort((a, b) => {
    //         return a-b;
    //       });
    //       arr.push(n.join(' '))
    //     })
    //     for(let i in arr){
    //       if(orderArr.indexOf(arr[i]) < 0){
    //         orderArr.push(arr[i])
    //       }
    //     }
    //   }else{
    //     orderArr = lifeArr;
    //   }
    //   // console.log('orderArr-排序后的数组-----------',orderArr)
    //   //去重后的数组
    //   var reduceArr = [];
    //     //一注号码每一个都不能一样
    //   reduceArr = orderArr.filter(v => {
    //     let l = v.split(' ').length;
    //     let arr = [];
    //     v.split(' ').filter(k => {
    //       if(arr.indexOf(k) < 0){
    //         arr.push(k)
    //       }
    //     })
    //     return arr.length === l;
    //   })
    //   // console.log('reduceArr-去重后的数组-----------',reduceArr)
    //   var filterArr = [];
    //   for(let i in reduceArr){
    //     if(filterArr.indexOf(reduceArr[i]) < 0){
    //       filterArr.push(reduceArr[i])
    //     }
    //   }
    //   if(isCheck){
    //     let cloneFilterArr = [];
    //     for(let i in filterArr){
    //       cloneFilterArr.push(filterArr[i])
    //     }
    //     // console.log(cloneFilterArr)
    //     // console.log(copy_c4)
    //     copy_c4.filter((v, i) => {
    //       let n = 1;
    //       n = cloneFilterArr.indexOf(v)
    //       if(n < 0){
    //         delArr.push(v)
    //       }else{
    //         cloneFilterArr.splice(n, 1)
    //       }
    //     })
    //     this.dialogFormVisible = delArr.length>0&&delArr[0]!=='';
    //     this.betsNumber = filterArr.join('|');
    //     this.filterNumber = delArr.join('|');
    //     if(this.getclearBetsNum){
    //       this.betsNumber = '';
    //       this.$refs['betsArea'].placeholder = this.defaultText;
    //       this.$emit('eidtToBets', false)
    //       this.$store.dispatch('setclearBetsNum', false)
    //     }
    //   }
    //   this.betsArr.data = filterArr;
    //   var bets = filterArr.length || 0;
    //   this.$store.dispatch('setBets', bets * opArrLen);
    // },
    clearErrorTextFn() {
      const vm = this;
      if(this.betsNumber){
        if(vm.lotteryType === 'ssc'){
          vm.ssc_checkBetsText(true);
        }else if(vm.lotteryType === 'syxw'){
          vm.syxw_checkBetsText(true);
        }
        this.$refs['betsArea'].placeholder = this.defaultText;
      }
    },
    clearTextFn() {
      this.betsNumber = '';
      this.$refs['betsArea'].placeholder = this.defaultText;
      this.$store.dispatch('setBets', 0);
      this.$emit('clearBetsNumber', '')
    },
    handleClickLabel(k) {
      const vm = this;
      var index = this.isCheckOptional.indexOf(k);
      var valueLen = this.betsArr.item.valueLen;
      if( index > -1 ){
        if(this.isCheckOptional.length < (valueLen+1)){
          this.isCheckOptional.splice(index,1)
          this.isCheckOptional.push(k);
        }else{
          this.isCheckOptional.splice(index,1)
        }
      }else{
        this.isCheckOptional.push(k);
      }
      var num2 = lottery.groupSelectOne(this.isCheckOptional.length, valueLen, 1);
      if(vm.lotteryType === 'ssc'){
        vm.ssc_checkBetsText(false, num2);
      }else if(vm.lotteryType === 'syxw'){
        vm.syxw_checkBetsText(false, num2);
      }
      // this.ssc_checkBetsText(false, num2);
    },
    setIsChecked(k) {
      var val = false;
      if(this.isCheckOptional.indexOf(k) > -1){
        val = true
      }else{
        val = false;
      }
      return val
    },
  },
  mounted() {
    let text = this.$refs['betsArea'].placeholder;
    this.defaultText = text;
  }
}
</script>

<style scoped>
.bets-text-wrap{
  width:100%;
  display:-webkit-box;
  -webkit-box-orient:vertical;
}
.my-split-line{
  width:100%;
  height:1px;
  background: #DDDDDD;
  margin-top:13px;
  /* margin-bottom:20px; */
  border:none;
}
.bets-text-wrap .import-btn{
  width:86px;
  height:34px;
  font-size:14px;
  margin-top:20px;
}
.bets-text-wrap button{
  width:115px;
  height:30px;
  background:#CC3447;
  color:#fff;
  cursor: pointer;
  border-radius:2px;
  font-size:12px;
}
.bets-text-wrap button:hover{
  color:#333;
}
.bets-text-wrap button, .bets-text-wrap input{
  border:none;
  outline: none;
}
.bets-text-wrap>div{
  display:-webkit-box;
  -webkit-box-pack:start;
}
.import-text-wrap{
  position: relative;
  /* margin-top:30px; */
  margin-bottom:10px;
}
.hidden-file{
  width:86px;
  height:34px;
  position: absolute;
  left:0;
  top:20px;
  z-index:33;
  opacity: 0;
  cursor: pointer;
}
.show-betsNum-area{
  width:100%;
  height:150px;
  border:1px solid #ccc;
  background:#F9F9F9;
  padding:5px;
  margin-bottom:15px;
}
#my-betsNumber-area{
  width:100%;
  height:100%;
  display:block;
  padding:5px;
  outline: none;
  resize: none;
  font-size:14px;
  font-weight:bold;
  color:#777;
}
textarea{
  width:100%;
  height:100%;
  display:block;
  padding:5px;
  outline: none;
  resize: none;
}
.oprate-bets-wrap button{
  margin-right:10px;
}

.optional-oprate{
  display: -webkit-box;
  -webkit-box-pack:end;
  position: absolute;
  right:0;
  top:0;
  text-align: right;
  padding:8px 0;
  color:#333;
}
.optional-oprate>span{
  cursor: pointer;
  border: 1px solid #ccc;
  background: #eee;
  padding: 5px 10px;
  margin-right: 7px;
  border-radius: 15px;
  font-size:12px;
}
.optional-oprate>span.checked{
  background: #D4914D;
  color: #fff;
  border:none;
}
.optional-oprate>span>input{
  margin-right: 3px;
  vertical-align: middle;
}
</style>

