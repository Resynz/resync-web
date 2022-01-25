<template>
  <div class="wrap_group" v-loading="loading">
    <div style="text-align: left;">
      <el-button type="primary" size="small" plain @click="newGroup">创建分组</el-button>
    </div>
    <el-tabs v-model="activeTab" type="card" @tab-click="handleTabClick" style="margin-top: 10px;" @edit="onTabEdit">
      <el-tab-pane v-for="(item,index) in groups" :key="index" :label="item.name" :name="item.id" :closable="item.id!=='0'">
        <span slot="label">
          {{item.name}}
          <i v-if="item.id!=='0'" class="el-icon-edit" style="margin-left: 5px;" @click="editGroup(item)" />
        </span>
        <div class="tab-content">
          <task-table :group-id="parseInt(item.id)" :group-name="item.name" />
        </div>
      </el-tab-pane>
    </el-tabs>

    <!-- 新建/编辑 分组弹窗 -->
    <group-dialog ref="groupDialog" @on-success="getGroupList" @on-cancel="getGroupList"/>
  </div>
</template>

<script>
import GroupDialog from "./dialog/GroupDialog";
import TaskTable from "./TaskTable";
import {ApiEnums} from "../configs/api";
export default {
  name: "Group",
  components: {
    GroupDialog,
    TaskTable
  },
  async created() {
    await this.getGroupList()
  },
  data () {
    return {
      loading: true,
      activeTab: "0",
      groups: [
        {
          id: "0",
          name: '全部'
        }
      ]
    }
  },
  methods: {
    handleTabClick (tab,event) {
      if (tab.index === this.activeTab) {
        return null;
      }
      console.log('handleTabClick:',tab.index);
    },
    async getGroupList () {
      this.groups = [
        {
          id: "0",
          name: '全部'
        }
      ];
      const res = await this.$networkHandler.sendRequest(ApiEnums.GetGroupList,null,null,'loading',this);
      if (res && res.list) {
        res.list.forEach(v=>v.id = v.id.toString());
        this.groups.push(...res.list);
        console.log('===groups',this.groups);
      }
    },
    newGroup () {
      this.$refs.groupDialog.open("新建分组");
    },
    editGroup (data) {
      this.$refs.groupDialog.open('编辑分组',data)
    },
    onTabEdit (tabName) {
      let item = this.groups.find(v=>v.id === tabName)
      if (!item) {
        return null;
      }
      this.$confirm(`确定要删除分组【${item.name}】?`,'提示',{type:'warning'}).then(async ()=>{
        const res = await this.$networkHandler.sendRequest(ApiEnums.RemoveGroup,item,null,'loading',this);
        if (res && res.result) {
          this.$message.success('操作成功');
          await this.getGroupList();
        }
      }).catch(e=>{})
    },
  }
}
</script>

<style scoped>
.wrap_group {
  width: 100%;
  height: 100%;
}
.tab-content{
  border: 1px solid #E4E7ED;
  border-top: none;
  height: calc(100vh - 243px);
  overflow-y: scroll;
}
.wrap_group >>> .el-tabs__header {
  margin: 0;
}
</style>
