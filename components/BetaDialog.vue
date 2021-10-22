<template>
  <v-dialog v-model="dialog" persistent width="400">
    <v-card v-if="expired" color="red" dark>
      <v-card-title>试用结束</v-card-title>
      <v-card-text>
        由于安全考虑, 在公测期间, 每个版本你只能试用10天. 因此, 你必须等待下一个版本的发布, 或请管理员为你提供试用密码.
        <v-text-field label="试用密码" prepend-icon="mdi-shield-key"
                      :placeholder="keySrc" @change="submitKey"
                      v-model="keyInput" type="password" color="white"/>
      </v-card-text>
      <v-card-actions>
        <v-btn width="100%" color="white" outlined rounded @click="exit">退出
        </v-btn>
      </v-card-actions>
    </v-card>
    <v-card v-else>
      <v-card-title>欢迎</v-card-title>
      <v-card-text>
        欢迎使用此工具, 使用期间请注意:
        <ul>
          <li>由于安全考虑, 在公测期间, 每个版本你只能试用1天</li>
          <li>试用到期后可联系作者获取试用密码以继续试用</li>
          <li>使用本工具产生的一切后果由你自己负责</li>
        </ul>
      </v-card-text>
      <v-card-actions>
        <v-btn color="success" @click="dialog=false" :disabled="!exitButton">
          我已阅读并同意 {{ exitButton ? '' : '(至少阅读3秒)' }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import md5 from "js-md5"
import VERSION from "assets/version";

export default {
  name: "BetaDialog",
  data: () => ({
    dialog: false,
    expired: false,
    keySrc: Math.floor(Math.random() * 300).toString(),
    keyInput: '',
    exitButton: false
  }),
  mounted() {
    let savedVersion = JSON.parse(localStorage.getItem("savedVersion") || '0');
    if (savedVersion < VERSION) {
      localStorage.setItem("savedVersion", JSON.stringify(VERSION));
      localStorage.removeItem("tryTime")
    }
    let startTime = localStorage.getItem('tryTime');
    startTime = JSON.parse(startTime || 'null')
    if (!startTime) {
      startTime = JSON.stringify(new Date().getTime());
      localStorage.setItem("tryTime", startTime);
      this.dialog = true;
    } else {
      this.expired = new Date().getTime() - startTime >
        3600e3 * 24
      if (!this.expired) return
    }

    setTimeout(() => {
      this.exitButton = true
    }, 3e3)

  },
  methods: {
    exit() {
      close()
    },
    submitKey() {
      // noinspection JSValidateTypes
      let right = md5(String(Number(this.keySrc) + 1024));
      if (this.keyInput.toString() === right) {
        localStorage.removeItem("tryTime");
        location.href = '/startup'
      }
    }
  }
}
</script>

<style scoped>

</style>
