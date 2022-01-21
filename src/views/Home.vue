<template>
  <div class="wrap">
    <div class="left">
      <div class="queue">构建队列</div>
      <div class="status">执行状态</div>
    </div>
    <div class="right">
      <group />
    </div>
  </div>
</template>

<script>
import Group from "../components/Group";
export default {
  name: "Home",
  components: {
    Group
  }
}
</script>

<style scoped>
.wrap {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
}
.left{
  width: 320px;
  height: auto;
  border: 1px solid #C260D6;
  display: flex;
  flex-direction: column;
}
.right {
  width: 100%;
  height: auto;
  border: 1px solid #C260D6;
  margin-left: 20px;
}
</style>
