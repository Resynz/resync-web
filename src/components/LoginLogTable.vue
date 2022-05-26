<template>
  <div style="width: 100%">
    <el-table
      v-loading="loading"
      :data="list"
      border
      height="600"
      width="100%"
    >
      <el-table-column
          align="center"
          prop="id"
          label="ID"
          width="100"
      />
      <el-table-column
          align="center"
          prop="ip"
          label="IP"
      />
      <el-table-column
          align="center"
          prop="user_agent"
          label="UserAgent"
      />
      <el-table-column
          align="center"
          label="登录时间"
          width="200"
      >
        <template v-slot="scope">
          {{scope.row.create_time && $globalFunction.formatTime(scope.row.create_time * 1000) || '-'}}
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
  name: "LoginLogTable",
  created() {
  },
  props: {
    adminId: {
      type: Number,
      default: 0,
    }
  },
  data () {
    return {
      list: [],
      loading: false,
      pagination: {
        page: 1,
        pages: 0,
        limit: 10,
        sizes: [10, 20, 50, 100],
        total: 0
      }
    }
  },
  methods: {
    reset() {
      this.pagination.page = 1;
      console.log('====adminId:',this.adminId)
      this.getAdminLoginLog();
    },
    async getAdminLoginLog () {
      const param = Object.assign({},{admin_id: this.adminId},this.pagination);
      const res = await this.$networkHandler.sendRequest(ApiEnums.GetAdminLoginLog,param,null,'loading',this);
      this.list = res && res.list || [];
      this.pagination.total = res && res.total || 0;
    },
    paginationSizeChange (val) {
      this.pagination.limit = val;
      this.getAdminLoginLog()
    },
    paginationCurrentChange (val) {
      this.pagination.page = val;
      this.getAdminLoginLog()
    },
  }
}
</script>

<style scoped>

</style>
