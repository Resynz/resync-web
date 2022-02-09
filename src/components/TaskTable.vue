<template>
  <div class="task_table">
    <el-button size="small" plain type="primary" @click="createTask">创建任务</el-button>
    <el-table
        v-loading="loading"
        :data="list"
        border
        width="100%"
        style="margin-top: 10px"
    >
      <el-table-column
        align="center"
        prop="name"
        label="任务名称"
      >
        <template v-slot="scope">
          <el-link style="color: #C260D6">{{scope.row.name}}</el-link>
        </template>
      </el-table-column>
      <el-table-column
          align="center"
          prop="last_record.status"
          label="状态"
          width="120"
      >
        <template v-slot="scope">
          <el-tag v-if="scope.row.last_record.status !== undefined" :type="computeStatusTagType(scope.row.last_record.status)">{{computeStatusTag(scope.row.last_record.status)}}</el-tag>
          <span v-else> - </span>
        </template>
      </el-table-column>

      <el-table-column
          align="center"
          prop="creator_name"
          label="创建人"
      />
      <el-table-column
          align="center"
          prop="last_record.creator_name"
          label="执行人"
      />
      <el-table-column
          align="center"
          label="执行时间"
      >
        <template v-slot="scope">
          {{scope.row.last_record.start_time && $globalFunction.formatTime(scope.row.last_record.start_time * 1000) || '-'}}
        </template>
      </el-table-column>
      <el-table-column
          align="center"
          label="执行耗时"
      >
        <template v-slot="scope">
          {{scope.row.last_record.start_time && scope.row.last_record.end_time && `${scope.row.last_record.end_time - scope.row.last_record.start_time}s` || '-'}}
        </template>
      </el-table-column>
      <el-table-column
          align="center"
          label="操作"
          width="220"
          fixed="right"
      >
        <template v-slot="scope">
          <el-button @click="editTask(scope.row.id)" size="small" plain type="success">编辑</el-button>
          <el-button v-if="scope.row.last_record.status !== 2" @click="startTask(scope.row.id)" size="small" plain type="primary" :loading="lockId === scope.row.id">执行</el-button>
          <el-button v-if="scope.row.last_record.status !== 2" @click="removeTask(scope.row)" size="small" plain type="danger" :loading="lockId === scope.row.id">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
        style="margin-top:10px;text-align: center"
        @size-change="paginationSizeChange"
        @current-change="paginationCurrentChange"
        :current-page="pagination.page"
        :page-sizes="pagination.sizes"
        :page-size="pagination.limit"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pagination.total">
    </el-pagination>

    <!-- 创建任务弹窗 -->
    <task-dialog ref="taskDialog" @on-success="onCreateTaskSuccess" />
    <!-- 任务详情组建 -->
    <task-detail ref="taskDetail" />
  </div>
</template>

<script>
import {ApiEnums} from "../configs/api";
import TaskDialog from "./dialog/TaskDialog";
import TaskDetail from "./TaskDetail";
export default {
  name: "TaskTable",
  components: {
    TaskDialog,
    TaskDetail,
  },
  props: {
    groupId: {
      type: Number,
      default: 0
    },
    groupName: {
      type: String,
      default: ''
    }
  },
  created() {
    this.getTaskList();
  },
  data () {
    return {
      loading: false,
      lockId:0,
      list: [],
      pagination: {
        page: 1,
        pages: 0,
        limit: 10,
        sizes: [10, 20, 50, 100],
        total: 0
      },
    }
  },
  methods: {
    computeStatusTagType (status) {
      return ["info","warning","primary","success","danger","info"][status];
    },
    computeStatusTag (status) {
      return ["-","等待中","执行中","成功","失败","已取消"][status];
    },
    paginationSizeChange (val) {
      this.pagination.limit = val;
      this.getTaskList()
    },
    paginationCurrentChange (val) {
      this.pagination.page = val;
      this.getTaskList()
    },
    async getTaskList () {
      const param = Object.assign({},{group_id: this.groupId},this.pagination);
      const res = await this.$networkHandler.sendRequest(ApiEnums.GetTaskList,param,null,'loading',this);
      this.list = res && res.list || [];
      this.pagination.total = res && res.total || 0;
    },
    createTask () {
      this.$refs.taskDialog.open(this.groupId,this.groupName);
    },
    onCreateTaskSuccess (id) {
      this.getTaskList();
      this.$refs.taskDetail.open('完善信息',id);
    },
    editTask (id) {
      this.$refs.taskDetail.open('编辑任务',id);
    },
    async startTask (id) {
      this.lockId = id;
      const res = await this.$networkHandler.sendRequest(ApiEnums.StartTask,{id},null,'btnLock',this);
      this.lockId = null;
      if (res && res.result) {
        await this.getTaskList();
      }
    },
    removeTask (item) {
      this.$confirm(`确定要删除任务【${item.name}】?`,'提示',{type:'warning'}).then(async ()=>{
        this.lockId = item.id;
        const res = await this.$networkHandler.sendRequest(ApiEnums.RemoveTask,{id: item.id});
        this.lockId = null;
        if (res && res.result) {
          this.$message.success('操作成功');
          await this.getTaskList();
        }
      }).catch(e=>{})
    }
  }
}
</script>

<style scoped>
.task_table {
  margin: 10px;
  text-align: left;
}
</style>
