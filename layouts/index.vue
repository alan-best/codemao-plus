<template>
  <v-app>
    <v-app-bar
      dense
      app
      :color="focused? 'primary':''"
      dark
      clipped-left
      style="-webkit-app-region: drag"
      flat
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
    <v-navigation-drawer app clipped permanent>
      <v-list dense>
        <v-list-item-group v-model="selectedNav" mandatory color="primary">
          <v-list-item v-for="(item,index) of nav"
                       :key="index"
                       @click="selectedNav=index;item.path===$route.path?void 0:$router.replace(item.path)">
            <v-list-item-avatar>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-avatar>
            <v-list-item-title>{{ item.label }}</v-list-item-title>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <v-container style="height: 100%">
        <v-slide-x-transition>
          <Nuxt keep-alive/>
        </v-slide-x-transition>
      </v-container>
    </v-main>
    <v-footer
      app
    >
      <span>Made by Alan_Best</span>
      <v-spacer/>
      <v-scroll-y-transition>
        <v-btn text tile x-small @click="taskList=!taskList" v-show="tasks.length>0">
          <v-progress-circular indeterminate size="10" width="1"/>
          正在运行{{ tasks.length }}个任务
        </v-btn>
      </v-scroll-y-transition>


    </v-footer>
    <v-scroll-y-reverse-transition>
      <v-card style="position: fixed;right: 8px;bottom: 44px" flat min-height="200" min-width="300" v-show="taskList">
        <TaskList/>
      </v-card>
    </v-scroll-y-reverse-transition>
    <v-dialog v-model="reloadConfirm" width="300">
      <v-card>
        <v-card-title>确认重启程序吗?</v-card-title>
        <v-card-text>部分正在运行的任务可能会被中断</v-card-text>
        <v-card-actions>
          <v-btn width="50%" color="error" text @click="reload">确定</v-btn>
          <v-btn width="50%" color="primary" text @click="reloadConfirm=false">取消</v-btn>
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
        {label: "进程管理器", path: "/tasks", icon: "mdi-wrench"}
      ],
      taskList: false,
      reloadConfirm: false,
      focused: true
    }
  },
  mounted() {
    const mediaQueryListDark = window.matchMedia('(prefers-color-scheme: dark)');
    this.$vuetify.theme.dark = mediaQueryListDark.matches;
    this.selectedNav = this.nav.map(i => i.path).indexOf(this.$route.path);
    const {ipcRenderer} = require("electron");
    window.addEventListener("focus", () => {
      this.focused = true
    })
    window.addEventListener("blur", () => {
      this.focused = false
    })
    ipcRenderer.on("focus", () => {
      this.focused = true
    })
    ipcRenderer.on("blur", () => {
      this.focused = false
    })
  },
  methods: {
    windowMinimize() {
      const {ipcRenderer} = require("electron");
      ipcRenderer.send("minimize")

    },
    windowMaximize() {
      const {ipcRenderer} = require("electron");
      ipcRenderer.send("maximize")
    },
    windowClose() {
      close()
    },
    reload() {
      this.reloadConfirm = false
      this.loading = true;
      setTimeout(() => {
        location.reload()
      }, 1e3)

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
html, body
  overflow-y: hidden !important
  user-select: none

</style>
