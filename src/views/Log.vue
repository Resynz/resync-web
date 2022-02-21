<template>
  <div class="log_wrap">
    <div class="left">
      <pending />
    </div>
    <div class="right">
      <div style="height: 24px;width:600px;text-align: left;">
        <el-link style="color: #C260D6" class="el-icon-back" @click="$router.back()">返回</el-link>
      </div>
      <div class="logs">
        <div class="log_item" :class="`log_type_${item.type}`" v-for="(item,index) in logs" :key="index">
          {{item.txt}}
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import {ApiEnums} from "../configs/api";
import Pending from "../components/Pending";
export default {
  name: "Log",
  created() {
    if (!this.$route.params.id) {
      return this.$router.back();
    }
    this.id = this.$route.params.id;
    this.getTaskLogInfo();
  },
  components: {
    Pending,
  },
  beforeDestroy() {
    this.closeSSEClient();
  },
  data () {
    return {
      id: null,
      sseClient: null,
      loading: false,
      logs: []
    }
  },
  methods: {
    closeSSEClient () {
      if (this.sseClient) {
        this.sseClient.close();
        this.sseClient = null;
      }
    },
    getTaskLogInfo () {
      if (this.sseClient || this.loading) {
        return null;
      }
      this.loading = true;
      const token = localStorage.getItem('token');
      const reqUrl = this.$networkHandler.genGetRequestUrl(ApiEnums.GetTaskLogInfo,{token,id: this.id});
      this.sseClient = new EventSource(reqUrl);
      this.sseClient.onopen = ()=> {
        this.loading = false;
      }
      this.sseClient.onerror = ()=>{
        this.$message.error('连接服务器失败');
        this.closeSSEClient();
      };
      this.sseClient.onmessage = d=>{
        const msg = JSON.parse(d.data);
        if (msg.action === 'finish') {
          return this.closeSSEClient();
        }
        if (msg.action === 'process') {
          return this.logs.push({
            type: 'info',
            txt:msg.txt,
          });
        }
        if (msg.action === 'error') {
          this.logs.push({
            type: 'danger',
            txt: msg.msg,
          })
          return this.closeSSEClient();
        }
      }
    }
  }
}
</script>

<style scoped>
.log_wrap {
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 100%;
}
.logs {
  text-align: left;
  /*width: 580px;*/
  border: 1px solid #C260D6;
  height: calc(100vh - 181px - 24px);
  overflow-y: scroll;
  padding: 10px;
  border-radius: 5px;
}
.log_type_info {
  font-size: 14px;
  color: #606266;
}
.log_type_danger {
  font-size: 14px;
  color: #F56C6C;
}
.left{
  width: 280px;
  height: 100%;
}
.right {
  width: 80%;
  height: auto;
  margin-left: 20px;
}
</style>
