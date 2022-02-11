<template>
  <div class="wrap">
    <div class="left">
      <pending />
    </div>
    <div class="right">
      <group />
    </div>
  </div>
</template>

<script>
import Group from "../components/Group";
import Pending from "../components/Pending";
export default {
  name: "Home",
  components: {
    Group,
    Pending
  },

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
  width: 280px;
  height: 100%;
}
.right {
  width: 80%;
  height: auto;
  margin-left: 20px;
}
</style>
