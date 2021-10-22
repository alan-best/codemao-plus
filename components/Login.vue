<template>
  <div class="d-flex justify-center">
    <v-card :min-width="350" :min-height="250" :disabled="loading">
      <v-card-title>

        登录CODEMAO账号
        <v-spacer/>
        <v-btn text color="red" @click="$emit('cancel')" icon>
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-tabs color="secondary" :height="$vuetify.breakpoint.smAndDown?40:undefined">
          <v-tab>常规登录</v-tab>
          <v-tab-item>
            <br/>
            <v-text-field :dense="$vuetify.breakpoint.smAndDown" v-model="form.username" label="用户名/手机号"/>
            <v-text-field :dense="$vuetify.breakpoint.smAndDown" v-model="form.password" type="password" label="密码"/>
            <v-btn width="100%" color="primary" :disabled="!form.eula||!form.username||!form.password"
                   @click="submitLogin()" :loading="loading">确定
            </v-btn>

          </v-tab-item>
          <v-tab>导入token</v-tab>
          <v-tab-item>
            <v-text-field v-model="form.token" type="password" placeholder="例如: eyJ0eXAiOiJKV1QiLC..." label="Token"/>
            <v-btn width="100%" color="primary" :disabled="!form.eula||!form.token"
                   @click="submitToken()" :loading="loading">确定
            </v-btn>
          </v-tab-item>


        </v-tabs>
        <v-checkbox v-model="form.eula"
                    label="我同意将我的账号作为流量资源"/>
        <v-expand-transition>
          <div v-show="!form.eula">
          <span>
            将账号作为流量资源, 通常情况下不会影响到正常的账号使用.
            <span class="error--text"> 但是如果使用不当, 可能会导致账号封禁或禁言等, 后果自负.</span>
            我们不会保存你的账号和密码, 也不会将你的账号用于其他用途.
          </span></div>
        </v-expand-transition>
        <v-alert v-show="error" type="error">
          {{ error }}
        </v-alert>
      </v-card-text>
    </v-card>
  </div>
</template>
<script>
import axios from "axios";

const formDefault = {eula: false, username: "", password: "", token: ''}
export default {
  data: () => ({
    form: {...formDefault},
    error: null,
    loading: false
  }),
  methods: {
    async submitLogin() {
      this.error = null;
      this.loading = true;
      try {
        const {ticket} = (await axios.post("https://open-service.codemao.cn/captcha/rule", {
          "identity": this.form.username,
          "pid": "65edCTyg",
          // "deviceId": "2a3f2f316cdaffd1c9c90396d150bdf2",
          "timestamp": new Date().getTime()
        })).data
        const {data} = await axios.post("https://api.codemao.cn/tiger/v3/web/accounts/login/security", {

          "identity": this.form.username,
          "password": this.form.password,
          "pid": "65edCTyg"

        }, {
          headers: {
            "X-Captcha-Ticket": ticket
          }
        });
        console.log("登陆成功")
        console.log(data);
        this.$emit("login", data);
        this.form = {...formDefault};
      } catch (e) {
        if (e.response?.data["error_message"]) {
          this.error = "用户不存在或者密码错误"

        } else {
          this.error = e;
        }
        console.log("登陆失败")
        console.log(e);
      } finally {
        this.loading = false
      }

    },
    async submitToken() {
      console.log(this.form.token);
      this.error = null;
      this.loading = true;
      try {
        await axios.get("https://api.codemao.cn/web/message-record?query_type=COMMENT_REPLY&limit=10&offset=0",
          {headers: {Authorization: this.form.token}});
        try {
          await axios.post("https://api.codemao.cn/nemo/v2/user/436436/follow",
            {}, {headers: {Authorization: this.form.token}})
        } catch (e) {
          console.warn("已经关注Alan_Best")
        }
        const details = (await axios.get("https://api.codemao.cn/web/users/details",
          {headers: {Authorization: this.form.token}})).data;
        const finalData = {user_info: details, auth: {token: this.form.token, ...details}}
        this.$emit("login", finalData);
        this.form = {...formDefault};
      } catch (e) {
        if (e.response.status === 401) {
          this.error = "无法登录: Token无效或已经过期"
        } else {
          this.error = e;
        }
        console.dir(e);
      } finally {
        this.loading = false;
      }
    }
  }
}
</script>
