<template>
  <div>
    <div style="text-align: left;">
      <el-button type="primary" size="small" plain>创建群组</el-button>
    </div>
    <el-tabs v-model="activeTab" type="card" @tab-click="handleTabClick" style="margin-top: 10px;">
      <el-tab-pane v-for="(item,index) in groups" :key="index" :label="item.name" :name="item.id" :closable="item.id==='0'">
        <span slot="label">
          {{item.name}}
          <i class="tab_edit el-icon-edit" />
        </span>
        TODO:{{item.name}}
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  name: "Group",
  data () {
    return {
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
    }
  }
}
</script>

<style scoped>
.tab_edit {
  display: none;
}
</style>
