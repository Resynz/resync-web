<template>
  <div class="pending_wrap">
    <div class="queue">
      <div class="title">构建队列</div>
      <div class="content" v-loading="loading" :element-loading-text="loadingText">
        <el-empty description="暂无信息" v-if="pendingList.length === 0" />
        <div class="task_obj" v-for="(item,index) in pendingList" :key="index">
          <div class="head">
            <i class="el-icon-s-promotion"></i>
            <el-link>#{{item.id}}</el-link>
          </div>
          <div style="width: 160px;display: flex;flex-direction: column;margin:0 10px;justify-content: space-between;height: 30px;">
            <div class="info_title">{{item.name}}</div>
          </div>
          <i class="i_remove el-icon-delete" @click="cancelTask(item.id,item.name)"/>
        </div>
      </div>
    </div>
    <div class="status">
      <div class="title">执行状态</div>
      <div class="content" v-loading="loading" :element-loading-text="loadingText">
        <el-empty description="暂无信息" v-if="processList.length === 0" />
        <div class="task_obj" v-for="(item,index) in processList" :key="index">
          <div class="head">
            <i class="el-icon-s-promotion"></i>
            <el-link style="color: #C260D6" @click="toLog(item.id)">#{{item.id}}</el-link>
          </div>
          <div style="width: 160px;display: flex;flex-direction: column;margin:0 10px;justify-content: space-between;height: 30px;">
            <div class="info_title">{{item.name}}</div>
            <div @click="toLog(item.id)" class="info_bar">
              <el-progress :text-inside="true" :show-text="false" :percentage="item.percent/item.percent_total*100"/>
            </div>
          </div>
          <i class="i_remove el-icon-delete" @click="cancelTask(item.id,item.name)"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {ApiEnums} from "../configs/api";

export default {
  name: "Pending",
  created() {
    this.taskDump();
  },
  beforeDestroy() {
    this.closeSSEClient();
  },
  data () {
    return {
      processList: [],
      pendingList: [],
      sseClient: null,
      loading: false,
      loadingText: '连接服务器中,请稍后...'
    }
  },
  methods: {
    closeSSEClient() {
      if (this.sseClient) {
        this.sseClient.close();
        this.sseClient = null;
      }
    },
    taskDump () {
      if (this.sseClient || this.loading) {
        return null;
      }
      this.loading = true;
      const token = localStorage.getItem('token');
      const reqUrl = this.$networkHandler.genGetRequestUrl(ApiEnums.TaskDump,{token});
      this.sseClient = new EventSource(reqUrl);
      this.sseClient.onopen = ()=> {
        this.loading = false;
      }
      this.sseClient.onerror = ()=>{
        this.loading = true;
      };
      this.sseClient.onmessage = d=>{
        const msg = JSON.parse(d.data);
        this.processList = msg.process_list && msg.process_list.sort((a,b)=>a.id-b.id) || [];
        this.pendingList = msg.pending_list && msg.pending_list.sort((a,b)=>a.id-b.id) || [];
      }
    },
    cancelTask (id,name) {
      this.$confirm(`确定要停止【${name}】?`,'提示',{type:"warning"}).then(async ()=>{
        const res = await this.$networkHandler.sendRequest(ApiEnums.CancelTask,{id});
        if (res && res.result) {
          this.$message.success('操作成功');
        }
      }).catch(e=>{});
    },
    toLog (id) {
      this.$router.push({name:'Log',params:{id}})
    }
  }
}
</script>

<style scoped>
.pending_wrap{
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}
.queue {
  width: 280px;
  height: 100%;
  border: 1px solid #E4E7ED;
  overflow-y: scroll;
  border-radius: 4px 4px 0 0;
}
.status {
  width: 280px;
  border: 1px solid #E4E7ED;
  border-radius: 4px 4px 0 0;
  margin-top: 20px;
  height: 100%;
  overflow-y: scroll;
}
.title {
  font-size: 16px;
  font-weight: bold;
  border-bottom: 1px solid #E4E7ED;
  color: #C260D6;
}
.task_obj {
  display: flex;
  border-top: 1px solid #E4E7ED;
  border-bottom: 1px solid #E4E7ED;
  margin-top: 10px;
  padding: 10px;
  height: 38px;
  justify-content: center;
  align-items: center;
}
.info_title {
  font-size: 14px;
  text-align: left;
}
.head {
  width: 50px;
  font-size: 22px;
  font-weight: bold;
}
.head > i {
  animation: flash 1000ms infinite;
  color: #C260D6;
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
.i_remove {
  color: #F56C6C;
}
.i_remove:hover {
  cursor: pointer;
}
.info_bar:hover{
  cursor: pointer;
}
</style>
