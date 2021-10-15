<template>
  <div>
    <v-dialog v-model="loginDialog" width="400">
      <Login @cancel="loginDialog=false" @login="loginCallback"/>
    </v-dialog>
    <v-toolbar>
      <v-toolbar-title>账号管理</v-toolbar-title>
      <v-spacer/>
      <div v-if="loadingAccounts">

        <v-progress-circular indeterminate/>
        正在加载账号信息
      </div>
      <div v-else>
        <v-btn rounded color="primary" @click="newAccount">
          <v-icon>mdi-plus</v-icon>
          添加账号
        </v-btn>
      </div>

    </v-toolbar>
    <v-list v-if="loadingAccounts" max-height="100%" class="overflow-y-auto">
      <v-skeleton-loader v-for="i of 30" :key="i" type="list-item-avatar, list-item-title"/>
    </v-list>
    <v-list v-show="!loadingAccounts">
      <v-list-item v-if="accounts.length===0">
        <v-list-item-avatar>
          <v-icon>mdi-cube</v-icon>
        </v-list-item-avatar>
        <v-list-item-title>
          没有账号信息
        </v-list-item-title>
        <v-list-item-subtitle>
          请点击"添加账号"来新增账号信息
        </v-list-item-subtitle>
      </v-list-item>
      <v-list-item v-for="(item,index) of accounts" :key="index">
        <v-list-item-avatar>
          <v-img :src="item['user_info']['avatar_url']"/>
        </v-list-item-avatar>
        <v-list-item-title>{{ item['user_info']['nickname'] }}</v-list-item-title>
      </v-list-item>
    </v-list>
    <SimpleSnackbar ref="snackbar"/>
  </div>
</template>

<script>
export default {
  name: "accounts",
  layout: "index",
  data: () => ({
    loginDialog: false,
    loginCallback: () => {
    },
    accounts: [],
    loadingAccounts: true,
  }),

  methods: {
    getAccount() {
      return new Promise(r => {
        this.loginDialog = true;
        this.loginCallback = r

      })
    },
    async newAccount() {
      this.$refs.snackbar.reset()
      const data = (await this.getAccount())

      console.log(data);
      this.loginDialog = false;
      console.log(this.accounts.map(i => i["user_info"]["nickname"]).includes(data["user_info"]["nickname"]))
      if (this.accounts.map(i => i["user_info"]["nickname"]).includes(data["user_info"]["nickname"])) {
        this.$refs.snackbar.showError("无法添加账号: 账号已经存在")
      } else {
        this.accounts.push(data);
      }
    }
  },
  mounted() {
    this.loadingAccounts = false;
  }
}
</script>

<style scoped>

</style>
