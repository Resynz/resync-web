<template>
  <el-dialog :title="title" :visible.sync="visible" :before-close="beforeClose" width="550px" center :append-to-body="true" :close-on-press-escape="false" :close-on-click-modal="false">
    <div v-loading="loading">
      <el-form label-width="80px">
        <el-form-item label="账号">
          <el-input v-model="form.user_name" placeholder="请输入账号" size="small" clearable/>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="form.password" placeholder="请输入密码" type="password" show-password size="small" clearable/>
        </el-form-item>
      </el-form>
      <div style="text-align: center">
        <el-button type="primary" plain size="small" @click="save">保存</el-button>
        <el-button type="default" plain size="small" @click="cancel">取消</el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import {ApiEnums} from "../../configs/api";

export default {
  name: "CodeAuthDialog",
  data () {
    return {
      title: '',
      visible: false,
      loading: false,
      form: {
        id: 0,
        auth_type: 1,
        user_name: '',
        password: ''
      }
    }
  },
  methods: {
    open (title,form=null) {
      this.title = title
      if (form) {
        this.form = form;
      }
      this.visible = true;
    },
    beforeClose() {
      this.form = {
        id: 0,
        auth_type: 1,
        user_name: '',
        password: ''
      };
      this.visible = false;
    },
    async save () {
      if (!this.form.user_name) {
        return this.$message.warning('请填写账号');
      }
      if (!this.form.password) {
        return this.$message.warning('请填写密码');
      }
      const res = await this.$networkHandler.sendRequest(ApiEnums.AddCodeAuth,this.form,null,'loading',this);
      if (res && res.result) {
        this.$message.success('操作成功');
        this.$emit('on-success');
        this.beforeClose();
      }
    },
    cancel () {
      this.$emit('on-cancel')
      this.beforeClose();
    }
  }
}
</script>

<style scoped>

</style>
