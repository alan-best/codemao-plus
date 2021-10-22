<template>
  <v-app style="height: 100vh;width: 100vw" class="app">
    <v-app-bar
      dense
      app
      :color="focused? 'primary':''"
      dark
      clipped-left
      style="-webkit-app-region: drag"
      :flat="$vuetify.breakpoint.smAndDown"
    >

      <h3>Codemao Plus</h3>
      <v-spacer/>
      <div style="-webkit-app-region: no-drag">
        <v-btn icon @click="reloadConfirm=true">
          <v-icon>mdi-reload</v-icon>
        </v-btn>
        <v-btn icon @click="windowMinimize">
          <v-icon>mdi-minus</v-icon>
        </v-btn>
        <v-btn icon @click="windowMaximize">
          <v-icon>mdi-window-maximize</v-icon>
        </v-btn>
        <v-btn icon @click="windowClose">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </div>
    </v-app-bar>
    <v-navigation-drawer :mini-variant="$vuetify.breakpoint.smAndDown"
                         app clipped permanent>
      <v-list :dense="$vuetify.breakpoint.mdAndDown">
        <v-list-item-group v-if="selectedNav>=0" v-model="selectedNav" mandatory
                           color="primary">
          <v-list-item v-for="(item,index) of nav"
                       :key="index"
                       @click="selectedNav=index;item.path===$route.path?void 0:$router.replace(item.path)">
            <v-list-item-avatar>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-avatar>
            <v-list-item-title>{{ item.label }}</v-list-item-title>
          </v-list-item>
        </v-list-item-group>
        <div v-else>
          <v-list-item>
            <v-list-item-avatar>
              <v-icon>mdi-help-circle</v-icon>
            </v-list-item-avatar>
            <v-list-item-content>

              <v-list-item-title>特殊页面</v-list-item-title>
              <v-list-item-subtitle>{{ $route.path }}</v-list-item-subtitle>

            </v-list-item-content>

          </v-list-item>
        </div>
      </v-list>
    </v-navigation-drawer>

    <v-main style="height: 100%;">
      <v-container
        style="height: 100%;overflow-x: hidden !important;overflow-y: hidden">
        <v-slide-x-transition>
          <Nuxt keep-alive/>
        </v-slide-x-transition>
      </v-container>
    </v-main>
    <v-footer
      app
      :height="$vuetify.breakpoint.smAndDown?'36px':'48px'"
    >
      <span class="text-sm-body-1">Made by Alan_Best</span>
      <v-spacer/>
      <v-scroll-y-transition>
        <v-btn outlined :x-small="$vuetify.breakpoint.smAndDown" color="success"
               @click="taskList=true"
               v-show="tasks.length>0"
               v-click-outside="taskListCheckOutside">
          <v-progress-circular indeterminate
                               :size="$vuetify.breakpoint.smAndDown?10:20"
                               :width="$vuetify.breakpoint.smAndDown?1:3"/>
          正在运行{{ tasks.length }}个任务
        </v-btn>
      </v-scroll-y-transition>


    </v-footer>
    <v-scroll-y-reverse-transition>
      <v-card
        :style="`max-height:50vh;width:350px;position: fixed;right: 8px;bottom: ${$vuetify.breakpoint.smAndDown?38:50}px;overflow-y: auto;z-index:999`"

        min-height="300"
        :min-width="$vuetify.breakpoint.smAndDown?300:400"
        v-show="taskList">
        <TaskList/>
      </v-card>
    </v-scroll-y-reverse-transition>
    <v-dialog v-model="reloadConfirm" width="300">
      <v-card>
        <v-card-title>确认重启程序吗?</v-card-title>
        <v-card-text>
          {{
            $store.state.tasks.list.length > 0 ? "正在运行的任务可能会无法查询进度, 且会驻留后台或被中断" : "数据将会安全地保存"
          }}

        </v-card-text>
        <v-card-actions>
          <v-btn width="50%" color="error" text @click="reload">确定</v-btn>
          <v-btn width="50%" color="primary" text @click="reloadConfirm=false">
            取消
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-overlay :value="loading" opacity="1">
      <v-progress-circular
        indeterminate
        size="100"
      ></v-progress-circular>
    </v-overlay>
    <v-overlay :value="!focused"></v-overlay>
    <SimpleSnackbar ref="snackbar" style="transform: translateY(-50px);z-index: 999"/>
    <BetaDialog/>
  </v-app>
</template>

<script>
import {ipcRenderer} from "electron";

export default {
  data() {
    return {
      drawer: false,
      group: null,
      selectedNav: 0,
      loading: false,
      nav: [
        {label: "主页", path: "/", icon: "mdi-home"},
        {label: "账号管理", path: "/accounts", icon: "mdi-account"},
        {label: "进程管理器", path: "/tasks", icon: "mdi-wrench"},
        {label: "开始运行", path: "/start", icon: "mdi-animation-play"},
        {label: "超级搜索", path: "/search", icon: "mdi-database-search"}
      ],
      taskList: false,
      reloadConfirm: false,
      focused: true
    }
  },
  mounted() {

    this.selectedNav = this.nav.map(i => i.path).indexOf(this.$route.path);
    const {ipcRenderer} = require("electron");
    window.addEventListener("focus", () => {
      this.focused = true
    })
    window.addEventListener("blur", () => {
      this.focused = false
    })
    this.loadData();
    ipcRenderer.on("will-open-url",()=>{
      this.$refs.snackbar.showInfo("将在默认浏览器中打开链接, 请允许程序通过杀毒软件")
    })

  },
  methods: {
    stopTasks(){
      this.$store.state.tasks.list.forEach(t => t.cancel())
    },
    saveData() {
      localStorage.setItem("accounts", JSON.stringify([...this.$store.state.accounts.list]));
    },
    loadData() {
      // const accountData = JSON.parse(localStorage.getItem("accounts") || "[]")
      // console.log(accountData)
      // this.$store.commit("accounts/load",accountData)
    },
    windowMinimize() {
      const {ipcRenderer} = require("electron");
      ipcRenderer.send("minimize")

    },
    windowMaximize() {
      const {ipcRenderer} = require("electron");
      ipcRenderer.send("maximize")
    },
    windowClose() {
      this.loading = true;
      this.saveData();
      this.stopTasks()
      close();
    },
    reload() {

      this.reloadConfirm = false
      this.loading = true;
      this.saveData();
      this.stopTasks();
      setTimeout(() => {
        location.href = '/startup'
      }, Math.random()*1e3);

    },
    taskListCheckOutside() {
      this.taskList = false
    }
  },
  computed: {
    tasks() {
      return this.$store.state.tasks.list
    }
  }
}
</script>
<style lang="sass">
.app
  overflow-y: auto !important
  overflow-x: hidden !important
  user-select: none

html
  overflow: hidden !important

::-webkit-scrollbar
  width: 8px

::-webkit-scrollbar-button
  display: none

::-webkit-scrollbar-track
  background: none

::-webkit-scrollbar-thumb
  background: #aaa

::-webkit-scrollbar-thumb:hover
  background: #ccc

::-webkit-scrollbar-thumb:active
  background: #eee
</style>
