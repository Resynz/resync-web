<template>
  <el-dialog :visible.sync="visible" width="550px" :title="title" :before-close="beforeClose" :close-on-click-modal="false" :close-on-press-escape="false">
    <div v-loading="loading">
      <el-form label-width="70px" size="small">
        <el-form-item label="分组名称">
          <el-input v-model="data.name" style="width: 400px" maxlength="20" placeholder="请输入分组名称" clearable show-word-limit />
        </el-form-item>
        <el-button type="primary" plain size="small" @click="save">保存</el-button>
        <el-button type="default" plain size="small" @click="cancel">取消</el-button>
      </el-form>
    </div>
  </el-dialog>
</template>

<script>
import {ApiEnums} from "../../configs/api";

export default {
  name: "GroupDialog",
  data () {
    return {
      title: '',
      visible: false,
      data: {},
      loading: false,
    }
  },
  methods: {
    beforeClose () {
      this.title = '';
      this.data = {};
      this.visible = false;
    },
    open (title,data={}) {
      this.title = title;
      this.data = data;
      this.visible = true;
    },
    async save () {
      this.data.name = this.data.name && this.data.name.trim() || ''
      if (!this.data.name) {
        return this.$message.warning('分组名称不可为空');
      }
      if (!this.data.id) {
        const res = await this.$networkHandler.sendRequest(ApiEnums.AddGroup,this.data,null,'loading',this);
        if (res && res.result) {
          this.$message.success('操作成功');
          this.$emit('on-success');
          this.beforeClose();
        }
        return null;
      }
      const res = await this.$networkHandler.sendRequest(ApiEnums.UpdateGroup,this.data,null,'loading',this);
      if (res && res.result) {
        this.$message.success('操作成功');
        this.$emit('on-success');
        this.beforeClose();
      }
    },
    cancel () {
      this.beforeClose();
      this.$emit('on-cancel');
    }
  }
}
</script>

<style scoped>

</style>
