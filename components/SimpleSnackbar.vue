<template>
  <div>
    <v-snackbar v-bind="defaultAttrs" v-model="error" color="error"
                :timeout="timeout">
      <v-icon>mdi-alert-octagon</v-icon>
      {{ message }}
    </v-snackbar>
    <v-snackbar v-bind="defaultAttrs" v-model="success" color="success"
                :timeout="timeout">
      <v-icon>mdi-check-circle</v-icon>
      {{ message }}
    </v-snackbar>
    <v-snackbar v-bind="defaultAttrs" v-model="warning" color="warning"
                :timeout="timeout">
      <v-icon>mdi-alert</v-icon>
      {{ message }}
    </v-snackbar>
    <v-snackbar v-bind="defaultAttrs" v-model="info" color="info"
                :timeout="timeout">
      <v-icon>mdi-information</v-icon>
      {{ message }}
    </v-snackbar>
  </div>
</template>

<script>
export default {
  name: "SimpleSnackbar",
  data: () => ({
    error: false,
    success: false,
    warning: false,
    message: "[NO TEXT]",
    timeout: 3e3,
    info: false,
    defaultAttrs: {
      bottom: true, right: true, absolute: true,transition:"slide-x-reverse-transition"
    }
  }),
  methods: {
    reset() {
      this.error = false;
      this.success = false;
      this.warning = false;
      this.timeout = 3e3;
      this.message = ""
    },
    showError(message, timeout = 3e3) {
      this.timeout = timeout;
      this.error = true;
      this.message = message;
    },
    showWarning(message, timeout = 3e3) {
      this.timeout = timeout;
      this.warning = true;
      this.message = message;
    },
    showSuccess(message, timeout = 3e3) {
      this.timeout = timeout;
      this.success = true;
      this.message = message;
    },
    showInfo(message, timeout = 3e3) {
      this.timeout = timeout;
      this.info = true;
      this.message = message;
    },
  }
}
</script>

<style scoped>

</style>
