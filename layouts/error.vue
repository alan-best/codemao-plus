<template>
  <v-app dark>
    <v-card color="error" class="d-flex justify-center align-center"
            style="height: 100vh;width: 100vw;-webkit-app-region: drag" dark>
      <div>
        <v-card-title>
          <v-icon>mdi-alert</v-icon>
          错误
        </v-card-title>
        <v-card-text>应用程序内部错误<br/> {{ error.message }}</v-card-text>
        <v-card-actions style="-webkit-app-region: no-drag">
          <v-btn outlined @click="back">返回首页</v-btn>
          <v-btn outlined @click="exitConfirm=true">退出</v-btn>
        </v-card-actions>
      </div>
    </v-card>
    <v-dialog v-model="exitConfirm" width="300">
      <v-card>
        <v-card-title>确认退出吗?</v-card-title>
        <v-card-text>在出错情况下退出可能会导致数据丢失</v-card-text>
        <v-card-actions>
          <v-btn width="50%" color="error" text @click="exit">确定</v-btn>
          <v-btn width="50%" color="primary" text @click="exitConfirm=false">取消</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script>

export default {
  layout: 'default',
  props: {
    error: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      exitConfirm: false
    }
  },
  head() {
    return {title: "@_@"}
  },
  methods: {
    exit() {
      close()
    },
    back() {
      location.href = '/'
    }
  }
}
</script>

<style scoped>
h1 {
  font-size: 20px;
}
</style>
