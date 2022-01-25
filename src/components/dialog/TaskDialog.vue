<template>
  <el-dialog :visible.sync="visible" title="创建任务" center width="530px" :before-close="beforeClose" :close-on-press-escape="false" :close-on-click-modal="false">
    <div v-loading="loading">
      <el-form label-width="70px" size="small">
        <el-form-item label="所属分组">
          {{groupName}}
        </el-form-item>
        <el-form-item label="任务名称">
          <el-input v-model="form.name" style="width: 400px" maxlength="20" placeholder="请输入任务名称" clearable show-word-limit />
        </el-form-item>
        <div style="text-align: center">
          <el-button type="primary" plain size="small" @click="save">保存</el-button>
          <el-button type="default" plain size="small" @click="cancel">取消</el-button>
        </div>
      </el-form>
    </div>
  </el-dialog>
</template>

<script>
import {ApiEnums} from "../../configs/api";

export default {
  name: "TaskDialog",
  data () {
    return {
      visible: false,
      loading: false,
      groupName: '',
      form: {
        group_id: 0,
        name: ''
      }
    }
  },
  methods: {
    beforeClose () {
      this.groupName = '';
      this.form =  {
        group_id: 0,
        name: ''
      }
      this.visible = false;
    },
    open (groupId,groupName) {
      this.form.group_id = groupId;
      this.groupName = groupName;
      this.visible = true;
    },
    async save () {
      if (!this.form.name) {
        return this.$message.warning('请输入任务名称');
      }
      const res = await this.$networkHandler.sendRequest(ApiEnums.AddTask,this.form,null,'loading',this);
      if (res && res.task_id) {
        this.$emit('on-success',res.task_id);
        this.$message.success('操作成功');
        this.beforeClose();
      }
    },
    cancel () {
      this.$emit('on-cancel');
      this.beforeClose();
    }
  }
}
</script>

<style scoped>

</style>
