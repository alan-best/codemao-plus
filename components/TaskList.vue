<template>
  <v-list key="0" class="fill-height" dense>
    <v-slide-x-transition group leave-absolute>
      <v-list-item :key="-1" v-if="tasks.length===0">
        <v-list-item-avatar>
          <v-icon>mdi-minus-circle</v-icon>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title>没有正在运行的任务</v-list-item-title>
          <v-list-item-subtitle>任务列表将会显示程序正在运行的任务</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
      <v-list-item v-for="task of tasks" :key="'t'+task.key">
        <v-list-item-avatar>
          <v-icon>{{ task.icon || "mdi-alpha-t-circle" }}</v-icon>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title>{{ task.label }}</v-list-item-title>
          <v-progress-linear v-if="task.process"
                             :indeterminate="task.process<0"
                             :value="task.process"
                             :color="task.process<100?'primary':'success'"/>
        </v-list-item-content>
        <v-list-item-action>
          <v-btn v-if="task.canCancel" icon color="error"
                 @click="task.cancel()">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-list-item-action>
      </v-list-item>
    </v-slide-x-transition>
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
