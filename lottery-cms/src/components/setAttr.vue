<template>
  <div>
    <div class="open-dialog"><span @click="handleOpenDialog" style="cursor: pointer;">设置属性</span></div>
    <DialogUserInfo v-if="dialog" @sendDiglogShow="handleDialogShow" @closeDialog="handleCloseDialog"></DialogUserInfo>
    <el-dialog
      title="提示"
      :visible.sync="dialogIsShow"
      width="30%"
      center>
      <span>确认进行该操作吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogIsShow = false">取 消</el-button>
        <el-button type="primary" @click="dialogIsShow = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import DialogUserInfo from './dialog-user-info/DialogUserInfo';
export default {
  name: 'setAttr',
  components: {
    DialogUserInfo
  },
  data() {
    return {
      dialog: false,
      dialogIsShow: false,
    }
  },
  methods: {
    handleOpenDialog() {
      this.dialog = true;
    },
    handleCloseDialog(val) {
      this.dialog = val;
    },
    handleDialogShow(val) {
      this.dialogIsShow = val;
    }
  }
}
</script>
<style>
.el-dialog--center .el-dialog__body{
  text-align:center;
}
</style>


