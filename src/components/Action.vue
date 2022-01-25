<template>
  <div class="action">
    <el-input type="textarea" v-model="action.content" placeholder="请输入Shell命令"/>
  </div>
</template>

<script>
export default {
  name: "Action",
  props: {
    action: {
      type: Object,
      default () {
        return {
          id: 0,
          task_id: 0,
          type: 1,
          content: ''
        }
      }
    }
  },
  data () {
    return {
      // action: {
      //   id: 0,
      //   task_id: 0,
      //   type: 1,
      //   content: ''
      // }
    }
  },
  methods: {

  }
}
</script>

<style scoped>

</style>
