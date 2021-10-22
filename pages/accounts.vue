<template>
  <div>
    <v-dialog v-model="loginDialog" :width="350">
      <Login @cancel="loginDialog=false" @login="loginCallback"/>
    </v-dialog>
    <v-fade-transition leave-absolute>
      <v-toolbar :dense="$vuetify.breakpoint.smAndDown" flat
                 v-if="selects.length===0" :key="0">
        <v-toolbar-title>
          <v-icon>mdi-account</v-icon>
          账号管理
        </v-toolbar-title>
        <v-spacer/>
        <div v-if="loadingAccounts">
          <v-progress-circular indeterminate/>
          <span v-if="!$vuetify.breakpoint.smAndDown">
          正在加载账号信息</span>
        </div>
        <div v-else>
          <v-btn rounded color="primary" @click="newAccount">
            <v-icon>mdi-plus</v-icon>
            <span v-if="!$vuetify.breakpoint.smAndDown">添加账号</span>
          </v-btn>
        </div>

      </v-toolbar>
      <v-toolbar :dense="$vuetify.breakpoint.smAndDown" flat v-else :key="1">
        <v-toolbar-title>
          已选择{{ selects.length }}项
        </v-toolbar-title>
        <v-spacer/>
        <div>
          <v-btn text @click="selects=[]">
            <v-icon>mdi-close</v-icon>
            <span v-if="!$vuetify.breakpoint.smAndDown">取消选择</span>
          </v-btn>
          <v-btn text color="error" @click="deleteSelected">
            <v-icon>mdi-delete</v-icon>
            <span v-if="!$vuetify.breakpoint.smAndDown">删除</span>
          </v-btn>
        </div>
      </v-toolbar>
    </v-fade-transition>
    <v-divider/>
    <v-list v-if="loadingAccounts" max-height="100%" class="overflow-y-auto">
      <v-skeleton-loader v-for="i of 5" :key="i"
                         type="list-item-avatar, list-item-title"/>
    </v-list>
    <v-list v-show="!loadingAccounts">
      <v-list-item v-if="accounts.length===0">
        <v-list-item-avatar>
          <v-icon>mdi-cube</v-icon>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title>
            没有账号信息
          </v-list-item-title>
          <v-list-item-subtitle>
            请点击"添加账号"来新增账号信息
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
      <v-list-item-group v-model="selects" multiple color="primary">
        <v-scroll-y-transition group leave-absolute>
          <v-list-item :dense="$vuetify.breakpoint.smAndDown"
                       v-for="(item,index) of accounts" :key="index"
                       :three-line="!$vuetify.breakpoint.smAndDown">
            <template v-slot:default="{ active }">

              <v-list-item-avatar>
                <v-img :src="item['user_info']['avatar_url']"/>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title>{{
                    item['user_info']['nickname']
                  }}
                </v-list-item-title>
                <v-list-item-subtitle>ID: {{ item["user_info"]['id'] }}<br/>
                  <span v-if="!$vuetify.breakpoint.smAndDown">
                  Token: {{ item['auth']['token'].slice(0, 30) }}...</span>
                </v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-action>
                <v-checkbox :input-value="active"/>
              </v-list-item-action>
            </template>
          </v-list-item>
        </v-scroll-y-transition>
      </v-list-item-group>
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
    loadingAccounts: true,
    selects: []
  }),
  computed: {
    accounts() {
      return this.$store.state.accounts.list
    }
  },
  methods: {
    getAccount() {
      return new Promise(r => {
        this.loginDialog = true;
        this.loginCallback = r
      })
    },
    deleteSelected() {
      const old = [...this.accounts];
      this.selects.forEach(i => {
        old[i] = null;
      })
      // noinspection JSCheckFunctionSignatures
      while (old.indexOf(null) !== -1) {
        // noinspection JSCheckFunctionSignatures
        old.splice(old.indexOf(null), 1)
      }
      this.$store.commit("accounts/load", old);
      this.selects = [];
    },
    async newAccount() {
      this.$refs.snackbar.reset()
      const data = (await this.getAccount())
      this.loginDialog = false;
      console.log([...this.accounts].map(i => i["user_info"]["nickname"]).includes(data["user_info"]["nickname"]))
      if ([...this.accounts].map(i => i["user_info"]["nickname"]).includes(data["user_info"]["nickname"])) {
        this.$refs.snackbar.showError("无法添加账号: 账号已经存在")
      } else {
        this.$store.commit("accounts/add", data)
      }
    }
  },
  mounted() {
    setTimeout(() => {

      this.loadingAccounts = false
    }, Math.random() * 500)

  }
}
</script>

<style scoped lang="sass">
.scroll-y-transition-move
  transition: transform 1s
</style>
