<template>
  <div class="wrap">
    <group />
  </div>
</template>

<script>
import Group from "../components/Group";
export default {
  name: "Home",
  components: {
    Group,
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
</style>
