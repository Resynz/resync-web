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
      />
      <el-table-column
          align="center"
          prop="last_record.status"
          label="状态"
          width="120"
      />

      <el-table-column
          align="center"
          prop="creator_name"
          label="创建人"
      />
      <el-table-column
          align="center"
          prop="create_time"
          label="创建时间"
      >
        <template v-slot="scope">
          {{scope.row.create_time && $globalFunction.formatTime(scope.row.create_time * 1000) || '-'}}
        </template>
      </el-table-column>
      <el-table-column
          align="center"
          prop="modifier_name"
          label="操作人"
      />
      <el-table-column
          align="center"
          label="操作时间"
      >
        <template v-slot="scope">
          {{scope.row.modify_time && $globalFunction.formatTime(scope.row.modify_time * 1000) || '-'}}
        </template>
      </el-table-column>
      <el-table-column
          align="center"
          label="操作"
          width="200"
          fixed="right"
      >
        <template v-slot="scope">
          <el-button @click="editTask(scope.row.id)" size="small" plain type="success">编辑</el-button>
          <el-button @click="startTask(scope.row.id)" size="small" plain type="primary" :loading="lockId === scope.row.id">执行</el-button>
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
