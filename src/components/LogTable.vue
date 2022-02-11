<template>
  <div class="log_table">
    <el-table
        v-loading="loading"
        :data="list"
        border
        width="100%"
    >
      <el-table-column
          align="center"
          label="ID"
      >
        <template v-slot="scope">
          <el-link style="color: #C260D6">{{scope.row.id}}</el-link>
        </template>
      </el-table-column>
      <el-table-column
          align="center"
          prop="last_record.status"
          label="状态"
          width="120"
      >
        <template v-slot="scope">
          <el-tag :type="computeStatusTagType(scope.row.status)">{{computeStatusTag(scope.row.status)}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
          align="center"
          prop="creator_name"
          label="执行人"
      />
      <el-table-column
          align="center"
          label="执行时间"
      >
        <template v-slot="scope">
          {{scope.row.start_time && $globalFunction.formatTime(scope.row.start_time * 1000) || '-'}}
        </template>
      </el-table-column>
      <el-table-column
          align="center"
          label="执行耗时"
      >
        <template v-slot="scope">
          {{scope.row.start_time && scope.row.end_time && `${scope.row.end_time - scope.row.start_time}s` || '-'}}
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
  </div>
</template>

<script>
import {ApiEnums} from "../configs/api";

export default {
  name: "LogTable",
  props: {
    taskId: {
      type: Number,
      default: 0
    }
  },
  created() {
    this.getTaskLogList();
  },
  data () {
    return {
      loading: false,
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
      this.getTaskLogList()
    },
    paginationCurrentChange (val) {
      this.pagination.page = val;
      this.getTaskLogList()
    },
    async getTaskLogList () {
      const param = Object.assign({},{task_id: this.taskId},this.pagination);
      const res = await this.$networkHandler.sendRequest(ApiEnums.GetTaskLogList,param,null,'loading',this);
      this.list = res && res.list || [];
      this.pagination.total = res && res.total || 0;
    },
  }
}
</script>

<style scoped>

</style>
