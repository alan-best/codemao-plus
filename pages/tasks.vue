<template>
  <div class="tasks fill-height">
    <TaskList/>
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

<style scoped lang="sass">
.tasks
  overflow-y: auto
</style>
