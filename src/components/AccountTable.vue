<template>
  <div>
    <div>
      <el-form inline>
        <el-form-item label="账号">
          <el-input v-model="form.name" size="small" clearable />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="form.status" size="small" clearable>
            <el-option v-for="(item,index) in statusList" :key="index" :value="item.value" :label="item.name" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button size="small" type="primary" plain @click="search">搜索</el-button>
          <el-button size="small" type="default" plain @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table
        v-loading="loading"
        :data="list"
        border
        width="100%"
        style="margin-top: 10px"
    >
      <el-table-column
          align="center"
          prop="id"
          label="ID"
          width="150"
      />
      <el-table-column
          align="center"
          prop="name"
          label="账号"
      />
      <el-table-column
          align="center"
          prop="status"
          label="状态"
          width="150"
      >
        <template v-slot="scope">
          <el-tag v-if="scope.row.status === 1" type="success">正常</el-tag>
          <el-tag v-if="scope.row.status === 2" type="danger">禁用</el-tag>
          <span v-if="scope.row.status === 0">-</span>
        </template>
      </el-table-column>
     <el-table-column
         align="center"
         label="操作"
         width="240px"
     >
       <template v-slot="scope">
         <el-button v-if="scope.row.id !== 1" @click="edit(scope.row)" size="small" plain type="success">编辑</el-button>
         <el-button v-if="scope.row.status === 1" @click="disable(scope.row)" size="small" plain type="warning">禁用</el-button>
         <el-button v-if="scope.row.status === 2" @click="enable(scope.row)" size="small" plain type="primary">启用</el-button>
         <el-button v-if="scope.row.id !== 1" @click="remove(scope.row)" size="small" plain type="danger">删除</el-button>
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

    <account-detail ref="accountD" @on-confirm="getAdminList"/>
  </div>
</template>

<script>
import {ApiEnums} from "../configs/api";
import AccountDetail from "./AccountDetail";
export default {
  name: "Account",
  created() {
    this.getAdminList();
  },
  components: {
    AccountDetail
  },
  data () {
    return {
      form: {
        name: "",
        status: 0,
      },
      statusList: [
        {
          name: '全部',
          value: 0
        },
        {
          name: '正常',
          value: 1
        },
        {
          name: '禁用',
          value: 2
        }
      ],
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
    async getAdminList () {
      const param = Object.assign({},this.form,this.pagination);
      const res = await this.$networkHandler.sendRequest(ApiEnums.GetAdminList,param,null,'loading',this);
      this.list = res && res.list || [];
      this.pagination.total = res && res.total || 0;
    },
    search () {
      this.pagination.page = 1;
      this.getAdminList();
    },
    reset() {
      this.form = {
        account: "",
        status: 0,
      };
      this.search();
    },
    paginationSizeChange (val) {
      this.pagination.limit = val;
      this.getAdminList()
    },
    paginationCurrentChange (val) {
      this.pagination.page = val;
      this.getAdminList()
    },
    edit (row) {
      this.$refs.accountD.open('编辑账号',row);
    },
    remove (row) {
      this.$confirm(`确定要删除账号【${row.name}】?`,'提示',{
        type: "error"
      }).then(async ()=>{
        const res = await this.$networkHandler.sendRequest(ApiEnums.RemoveAdmin,{id:row.id});
        if (res && res.result) {
          this.$message.success('操作成功');
          await this.getAdminList();
        }
      }).catch(e=>{})
    },
    disable(row) {
      this.$confirm(`确定要禁用账号【${row.name}】?`,'提示',{
        type: "warning"
      }).then(async ()=>{
        const res = await this.$networkHandler.sendRequest(ApiEnums.DisableAdmin,{id:row.id});
        if (res && res.result) {
          this.$message.success('操作成功');
          await this.getAdminList();
        }
      }).catch(e=>{})
    },
    enable(row) {
      this.$confirm(`确定要启用账号【${row.name}】?`,'提示',{
        type: "warning"
      }).then(async ()=>{
        const res = await this.$networkHandler.sendRequest(ApiEnums.EnableAdmin,{id:row.id});
        if (res && res.result) {
          this.$message.success('操作成功');
          await this.getAdminList();
        }
      }).catch(e=>{})
    },
  }
}
</script>

<style scoped>

</style>