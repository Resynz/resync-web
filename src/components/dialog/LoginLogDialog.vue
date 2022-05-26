<template>
  <div>
    <el-dialog :title="title" width="800" center :visible.sync="visible" :close-on-click-modal="false" :close-on-press-escape="false" :before-close="beforeClose">
      <login-log-table ref="loginLogTable" :admin-id="id" />
    </el-dialog>
  </div>
</template>

<script>
import LoginLogTable from "../LoginLogTable";
export default {
  name: "LoginLogDialog",
  components: {
    LoginLogTable
  },
  data () {
    return {
      title: '登录日志',
      visible: false,
      name: '',
      id: null,
    }
  },
  methods: {
    open (id,name) {
      this.id = id;
      this.name = name;
      this.visible = true;
      this.$nextTick(()=>{
        this.$refs.loginLogTable.reset();
      })
    },
    beforeClose () {
      this.visible = false;
    }
  }
}
</script>

<style scoped>

</style>
