<template>
  <div>
    <el-dialog title="修改密码" width="428px" :visible.sync="visible" :before-close="beforeClose" center :close-on-press-escape="false" :close-on-click-modal="false">
      <el-form :model="form" ref="form" :rules="formRules" label-width="80px" label-position="left">
        <el-form-item label="原密码" prop="old_pass">
          <el-input type="password" style="width: 300px" show-password clearable size="small" v-model="form.old_pass" placeholder="请输入原密码"/>
        </el-form-item>
        <el-form-item label="新密码" prop="new_pass">
          <el-input type="password" style="width: 300px" show-password clearable size="small" v-model="form.new_pass" placeholder="请输入新密码"/>
        </el-form-item>
        <el-form-item label="确认密码" prop="re_pass">
          <el-input type="password" style="width: 300px" show-password clearable size="small" v-model="form.re_pass" placeholder="请重新输入新密码"/>
        </el-form-item>
      </el-form>
      <div style="text-align: center">
        <el-button size="small" plain type="primary" @click="submit">保存</el-button>
        <el-button size="small" @click="beforeClose">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {ApiEnums} from "../../configs/api";

export default {
  name: "ModifyPassword",
  data () {
    return {
      visible: false,
      form: {
        old_pass: '',
        new_pass: '',
        re_pass: ''
      },
      formRules: {
        old_pass: [
          {required: true,trigger: 'blur',message: '请输入原密码'}
        ],
        new_pass: [
          {required: true,trigger: 'blur',message: '请输入新密码'},
          {validator: (rule,value,cb)=>{
              if (value === this.form.old_pass) {
                return cb(new Error('新密码不可与原密码相同'));
              }
              cb()
            },
            trigger: 'blur'
          }
        ],
        re_pass: [
          {required: true,trigger: 'blur',message: '请重新输入新密码'},
          {validator: (rule,value,cb)=>{
              if (value !== this.form.new_pass) {
                return cb(new Error('两次输入的密码不一致'));
              }
              cb()
            },
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    open () {
      this.visible = true;
    },
    beforeClose () {
      this.$refs.form.resetFields();
      this.visible = false;
    },
    submit () {
      this.$refs.form.validate(valid=>{
        if (!valid) {
          return null;
        }
        this.$confirm('确定要修改密码吗？','提示',{
          type: 'warning',
        }).then(async ()=>{
          const res = await this.$networkHandler.sendRequest(ApiEnums.ModifyPassword,this.form)
          if (res && res.result) {
            this.$message.success('修改密码成功')
            return this.beforeClose();
          }
        }).catch(e=>{})
      });
    }
  }
}
</script>

<style scoped>

</style>
