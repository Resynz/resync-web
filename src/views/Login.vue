<template>
  <div class="wrap">
    <div class="login_field">
      <div class="title">
        <div class="dot">></div>
        <h1>Resync</h1>
        <span class="cmd">&nbsp;</span>
      </div>
      <div v-loading="loading" element-loading-text="登录中，请稍后">
        <div class="form">
          <el-form size="medium" ref="form" label-width="80px" :model="form" :rules="rules">
            <el-form-item label="账号" prop="name">
              <el-input placeholder="请输入账号" v-model="form.name" clearable/>
            </el-form-item>
            <el-form-item label="密码" prop="password">
              <el-input placeholder="请输入密码" v-model="form.password" clearable type="password" show-password/>
            </el-form-item>
          </el-form>
        </div>
        <el-button type="primary" plain class="btn" @click="login">登录</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import {ApiEnums} from "../configs/api";
import {EventEnums} from "../configs/event";

export default {
  name: "Login",
  data () {
    return {
      loading: false,
      form: {
        name: '',
        password: ''
      },
      rules: {
        name: [
          {required: true,message: '请输入账号',trigger: 'blur'},
        ],
        password: [
          {required: true,message: '请输入密码',trigger: 'blur'},
        ]
      }
    }
  },
  methods:{
    login () {
      this.$refs.form.validate(async valid=>{
        if (!valid) {
          return null;
        }
        const res = await this.$networkHandler.sendRequest(ApiEnums.Login,this.form,null,'loading',this);
        if (res && res.token) {
          await this.$listener.$emit(EventEnums.DoLogin,res.token);
        }
      });
    }
  }
}
</script>

<style scoped>
.wrap {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.login_field {
  width: 500px;
  height: auto;
  border: 1px solid #E4E7ED;
  border-radius: 8px;
  padding:50px 0;
}
.title {
  font-weight: bolder;
  user-select: none;
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
.title > h1 {
  background-image: linear-gradient(to right,  #C260D6,#BBD5FF);
  color: transparent;
  -webkit-background-clip: text;
  display: inline-block;
  margin-left: 5px;
}
.title .dot {
  font-weight: bolder;font-size: 28px;
}
.title .cmd {
  margin-left: 5px;
  width: 14px;
  border-bottom: 3px solid #C260D6;
  animation: flash 800ms infinite;
  -webkit-animation: flash 800ms infinite;
}
@keyframes flash {
  from {
    opacity: 1.0;
  }
  50% {
    opacity: 0.1;
  }
  to {
    opacity: 1.0;
  }
}
@-webkit-keyframes flash {
  from {
    opacity: 1.0;
  }
  50% {
    opacity: 0.1;
  }
  to {
    opacity: 1.0;
  }
}
.form {
  width: 460px;
  margin-top: 20px;
}
.btn {
  width: 100px;
}
</style>
