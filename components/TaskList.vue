<template>
  <v-list v-if="tasks.length">
    <v-list-item v-for="(task,index) of tasks" :key="index">
      <v-list-item-avatar>
        <v-icon>{{ task.icon || "mdi-alpha-t-circle" }}</v-icon>
      </v-list-item-avatar>
      <v-list-item-content>
        <v-list-item-title>{{ task.label }}</v-list-item-title>
        <v-progress-linear v-if="task.process" :indeterminate="task.process<0" :value="task.process" color="primary"/>
      </v-list-item-content>
    </v-list-item>
  </v-list>
  <v-list v-else>
    <v-list-item>
      <v-list-item-avatar><v-icon>mdi-cube</v-icon></v-list-item-avatar>
      <v-list-item-title>没有正在运行的任务</v-list-item-title>
    </v-list-item>
  </v-list>
</template>

<script>
export default {
  name: "TaskList",
  computed: {
    tasks() {
      return this.$store.state.tasks.list
    }
  }
}
</script>

<style scoped>

</style>
