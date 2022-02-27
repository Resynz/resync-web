<template>
  <div class="account_wrap">
    <el-button type="primary" size="small" @click="newAccount" plain>新建账号</el-button>
    <account-table ref="accountTable" style="margin: 10px"/>

    <!-- 创建账号 -->
    <account-detail ref="accountDetail" @on-confirm="onConfirm"/>
  </div>
</template>

<script>
import AccountTable from "../components/AccountTable";
import AccountDetail from "../components/AccountDetail";
export default {
  name: "AccountManage",
  components: {
    AccountTable,
    AccountDetail,
  },
  methods: {
    newAccount () {
      this.$refs.accountDetail.open();
    },
    onConfirm () {
      this.$refs.accountTable.reset();
    }
  }
}
</script>

<style scoped>
.account_wrap {
  text-align: left;
}
</style>