<template>
  <div class="public-select-components">
    <input class="option-view-input" @click="setListHeight($event)" :placeholder="placeholder" :class="(selectedValue && selectedValue !== placeholder)?'selected':''" readonly @blur="ol_height=0" type="text" v-model="selectedText">
    <em class="slide-down-em slide-down-em-white"></em>
    <ol class="public-select-option" :style="{height: ol_height+'rem', top: optionHeight+'rem'}">
      <li :style="{minHeight: optionHeight+'rem'}" :class="(item[value]!==''&&selectedValue===item[value])?'active':''" v-for="(item, index) in copy_list" :key="index" @click="selectOptions(item, $event)">{{item[label]}}</li>
    </ol>
  </div>
</template>
<script>
export default {
  name: 'publicSelectComponents',
  props: {
    // 列表数据
    selectList: {
      type: Array,
      required: true
    },
    // 变量名
    // bianliang: {
    //   type: String,
    //   required: true
    // },
    // 列表每项的高度 单位rem
    optionHeight: {
      type: String,
      default: '0.88'
    },
    // 默认选中项
    defaultSelected: {
      // default: ''
    },
    // 默认文本
    placeholder: {
      type: String
    },
    // 数据为空的显示文本
    emptyTExt: {
      type: String,
      default: '暂无数据'
    },
    // 显示文本
    label: {
      type: String,
      required: true
    },
    // 选中值
    value: {
      type: String,
      required: true
    },
    // 回调
    callback: {
      type: Function,
    },
  },
  created() {
    let o = {};
    this.copy_list = [];
    if(this.selectList.length === 0){
      o[this.label] = this.emptyTExt;
      o[this.value] = '';
      this.copy_list.push(o);
    }else{
      for(let i in this.selectList[0]){
        if(i===this.label){
          o[i]=this.placeholder;
        }else{
          o[i] = '';
        }
      }
      this.copy_list.push(o);
    }
    this.selectedValue = this.copy_list[0][this.value];
    this.selectedText = this.copy_list[0][this.label];
    this.selectList.filter(v => {
      this.copy_list.push(v);
      if(this.defaultSelected){
        if(this.defaultSelected.toString() === v[this.value]){
          this.selectedValue = v[this.value]
          this.selectedText = v[this.label];
        }
      }
    })
  },
  data() {
    return {
      selectedValue: '', // 选中项的值
      selectedText: '', // 选中项的文字
      copy_list: [],
      optionsTitle: '',
      ol_height: 0,
      isShowOptions: false,
    }
  },
  methods: {
    // 选择性别
    selectOptions(item, e) {
      e.stopPropagation();
      this.selectedValue = item[this.value];
      this.selectedText = item[this.label];
      this.optionsTitle = '';
      this.ol_height = 0;
      // this.$emit('sendSelectedOption', [item, this.bianliang, this.value])
      this.callback(item)
    },
    // 设置ol 列表的高度
    setListHeight(e) {
      const vm = this;
      let len = this.copy_list.length;
      if(this.copy_list.length>4){len = 4}
      if(this.ol_height == 0){
        let h = this.optionHeight; // 单位rem
        this.ol_height = h * len;
      }else{
        this.ol_height = 0;
      }
      // console.log(this.ol_height)
      
    }
  }
}
</script>
<style lang="scss" scoped>
.public-select-components{
  width:100%;
  height:100%;
  position: relative;
  display:-webkit-box;
  -webkit-box-align:center;
  .option-view-input{
    display: block;
    padding-left:.1rem;
    color:#646464;
    width:100%;
    height:100%;
    background:none;
    border:none;
    outline: none;
  }
  input.selected{
    color:#c7c7c7;
  }
  em{
    position: absolute;
    width:.243rem;
    height:.163rem;
    background:#c7c7c7;
    right:.309rem;
    top:.357rem;
  }
  ol{
    display:block;
    position: absolute;
    overflow: hidden;
    right:0;
    top:.88rem;
    width:100%;
    height:0;
    transition: all .3s;
    padding-left:.1rem;
    padding-right:.3rem;
    z-index:10000;
    overflow-y: auto;
    li{
      margin:0;
      padding-left:.1rem;
      padding-right:.3rem;
      background:#fff;
      color:#000;
      line-height:.88rem;
    }
    li.active{
      background:#c7c7c7;
    }
  }
}
</style>


