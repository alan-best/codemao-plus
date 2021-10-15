<template>
  <div>
    <TaskList/>
    <v-btn @click="$store.commit('tasks/setProcess',{process:2,index:0})">+</v-btn>
  </div>
</template>

<script>
export default {
  name: "tasks",
  layout: "index",
  mounted() {

  }
}
</script>

<style scoped>

</style>
