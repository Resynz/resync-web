<template>
  <div class="wrap">
    <el-container>
      <el-header style="padding:0;height: 60px">
        <div class="header">
          <div class="logo">
            <h1 @click="toHome()">Resync</h1>
          </div>
          <div class="menu"></div>
          <div class="mine">
            <el-dropdown v-if="userInfo" @command="handleClick"  trigger="click">
                            <span class="el-dropdown-link">
                                {{userInfo.name}} <i class="el-icon-arrow-down" />
                            </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="modifyPassword">
                  <span>修改密码</span>
                </el-dropdown-item>
                <el-dropdown-item command="logout">
                  <span>安全退出</span>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <div v-else class="login-field">
              <el-button size="small" type="primary" plain @click="$router.push({name: 'Login'})">立即登录</el-button>
              <el-button size="small" type="warning" plain @click="$router.push({name: 'Apply'})">账号申请</el-button>
            </div>
          </div>
        </div>
      </el-header>
      <el-main class="main">
        <router-view/>
      </el-main>
      <el-footer class="footer">Powered by Resynz.</el-footer>
    </el-container>

    <!-- 修改密码 -->
    <modify-password ref="modifyPassword" />
  </div>
</template>

<script>
import {ApiEnums} from "../configs/api";
import {EventEnums} from "../configs/event";
import ModifyPassword from "../components/dialog/ModifyPassword";
export default {
  name: "Index",
  async created() {
    if (this.$store.token) {
      this.$nextTick(()=>{
        this.getUserInfo();
      })
    }
    if (this.$route.name === 'Index') {
      return await this.$router.replace({name: 'Home'});
    }
  },
  components: {
    ModifyPassword
  },
  data () {
    return {
      userInfo: null
    }
  },
  methods: {
    async getUserInfo () {
      const res = await this.$networkHandler.sendRequest(ApiEnums.GetUserInfo);
      this.userInfo = res || null;
      const markerName = `[Resync]${this.userInfo && this.userInfo.name}`;
      __svgWM('300px','200px',markerName,document.body,'10px Microsoft Yahei')
    },
    toModifyPassword () {
      this.$refs.modifyPassword.open();
    },
    toLogout () {
      this.$confirm(`确定退出当前账号?`,'提示',{
        type:'warning'
      }).then(()=>{
        this.$listener.$emit(EventEnums.AuthExpire);
        this.userInfo = null;
        this.$message.success('退出成功');
        __svgWM('300px','200px','Resync',document.body,'10px Microsoft Yahei')
      }).catch(e=>{})
    },
    toHome(){
      if (this.$route.name === 'Home') {
        return null;
      }
      this.$router.push({name: 'Home'})
    },
    handleClick (val) {
      switch (val) {
        case "modifyPassword":
          this.toModifyPassword();
          break;
        case "logout":
          this.toLogout();
          break;
      }
    }
  }
}
</script>

<style scoped>
.wrap {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
}
.header {
  height: 60px;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #DCDFE6;
}
.header >>> .el-dropdown-link {
  color: #C260D6;
}
.logo {
  width: 180px;
  user-select: none;
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
}
.logo > h1 {
  background-image: linear-gradient(to right,  #C260D6,#BBD5FF);
  color: transparent;
  -webkit-background-clip: text;
  display: inline-block;
  cursor: pointer;
}
.mine {
  width: 180px;
}
.el-dropdown-link{
  cursor: pointer;
  color: #409EFF
}
.el-icon-arrow-down {
  font-size: 12px;
}
.main {
  height: calc(100vh - 150px);
  width: 100%;
  overflow: scroll;
}

.footer {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  border-top: 1px solid #DCDFE6;
}
.login-field {
  width: 120px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
</style>
