<template>
  <el-dialog :title="title" :visible.sync="visible" width="660px" :before-close="beforeClose" :close-on-click-modal="false" :close-on-press-escape="false" center>
    <div v-loading="loading">
      <el-form ref="form" :model="form" :rules="formRules" element-loading-text="正在提交">
        <el-form-item label="账号" prop="name">
          <el-input clearable v-model="form.name" size="small" placeholder="请输入账号" />
        </el-form-item>
        <el-form-item label="密码" :prop="isEdit ? '' : 'password'">
          <el-input clearable v-model="form.password" size="small" type="password" :placeholder="isEdit ? '如不修改密码，请留空' : '请设置密码'" show-password />
        </el-form-item>
        <el-form-item>
          <el-button type="default" plain size="small" @click="cancel">取消</el-button>
          <el-button type="primary" plain size="small" @click="confirm">确定</el-button>
        </el-form-item>
      </el-form>
    </div>
  </el-dialog>
</template>

<script>
import {ApiEnums} from "../configs/api";

export default {
  name: "AccountDetail",
  computed:{
    isEdit () {
      return this.form.id !== 0
    }
  },
  data () {
    return {
      visible: false,
      loading:false,
      title: '',
      form: {
        id: 0,
        name: "",
        password: ''
      },
      formRules: {
        name: [
          {
            required: true,
            message: '请输入账号',
            trigger: 'blur'
          }
        ],
        password: [
          {
            required: true,
            message: '密码不可为空',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    open (title='创建账号',admin= {}) {
      this.title = title;
      this.form = Object.assign({},this.form,admin);
      this.visible = true;
    },
    beforeClose () {
      this.form = {id: 0,name: '',password: ''};
      this.visible = false;
    },
    cancel () {
      this.$emit('on-cancel');
      this.beforeClose();
    },
    confirm () {
      this.$refs.form.validate(async valid=>{
        if (!valid) {
          return null;
        }
        const param = Object.assign({},this.form);
        const res = await this.$networkHandler.sendRequest(this.isEdit ? ApiEnums.UpdateAdmin : ApiEnums.AddAdmin,param,null,'loading',this);
        if (res && res.result) {
          this.$message.success('操作成功');
          this.$emit('on-confirm');
          this.beforeClose();
        }
      });
    }
  }
}
</script>

<style scoped>

</style>