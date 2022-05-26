<template>
    <div class="wrap" v-loading="loading">
      <div style="height: 24px;width:600px;text-align: left;">
        <el-link style="color: #C260D6" class="el-icon-back" @click="$router.back()">返回</el-link>
      </div>
      <div class="head">
        <div style="font-size: 32px;font-weight: bold">{{info.task && info.task.name || '-'}}</div>
        <div style="font-size: 14px;color: #909399;">{{info.detail && info.detail.note || ''}}</div>
        <div style="margin-top: 10px">
          <el-button size="small" type="success" @click="editTask" plain>编辑</el-button>
          <el-button size="small" type="primary" v-if="!info.last_record || info.last_record.status !== 2" plain @click="startTask" :loading="lockId === id">执行</el-button>
          <el-button size="small" type="danger" v-if="!info.last_record || info.last_record.status !== 2" plain @click="removeTask">删除</el-button>
        </div>
      </div>
      <div class="bbody" style="margin-top: 10px">
        <div class="b_title">
          执行历史
        </div>
        <log-table :task-id="id" />
      </div>
      <!-- 任务详情组建 -->
      <task-detail ref="taskDetail" @on-save="getTaskInfo" />
    </div>
</template>

<script>
import TaskDetail from "../components/TaskDetail";
import {ApiEnums} from "../configs/api";
import LogTable from "../components/LogTable";
export default {
  name: "Detail",
  created() {
    console.log('detail created!');
    if (!this.$route.params.id) {
      return this.$router.back();
    }
    this.id = parseInt(this.$route.params.id);
    this.getTaskInfo();
  },
  components: {
    TaskDetail,
    LogTable
  },
  data () {
    return {
      id: null,
      loading: false,
      info: {},
      lockId: null,
    }
  },
  methods: {
    async getTaskInfo () {
      const res = await this.$networkHandler.sendRequest(ApiEnums.GetTaskInfo,{id:this.id},null,'loading',this);
      this.info  =  res || {};
    },
    editTask () {
      this.$refs.taskDetail.open('任务编辑',this.id);
    },
    async startTask () {
      let id = this.id;
      this.lockId = id;
      const res = await this.$networkHandler.sendRequest(ApiEnums.StartTask,{id},null,'btnLock',this);
      this.lockId = null;
      if (res && res.result) {
        await this.getTaskInfo();
      }
    },
    removeTask () {
      this.$confirm(`确定要删除任务【${this.info.task.name}】?`,'提示',{type:'warning'}).then(async ()=>{
        const res = await this.$networkHandler.sendRequest(ApiEnums.RemoveTask,{id: this.info.task.id});
        if (res && res.result) {
          this.$message.success('操作成功');
          this.$router.back();
        }
      }).catch(e=>{})
    },
  }
}
</script>

<style scoped>
.wrap {
  width: 100%;
  height: 100%;
}
.b_title {
  text-align: left;
  font-size: 14px;
  color: #909399;
  font-weight: bold;
}
</style>
