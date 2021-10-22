<template>
  <div class="d-flex align-center justify-center fill-height">
    <div style="text-align: center" v-if="latest===true" :key="0">
      <v-icon x-large>mdi-code-braces-box</v-icon>
      <br/>
      <span class="text-h5">编程猫辅助工具</span>
      <br/>
      <span class="text-h6 grey--text">Codemao Plus</span>
      <br/>

    </div>
    <div style="text-align: center" v-else-if="latest===false" :key="1">
      <v-icon x-large>mdi-star</v-icon>
      <br/>
      <span class="text-h5">发现新版本!</span>
      <br/>
      <v-btn color="primary" @click="downloadNewVersion">下载</v-btn>
    </div>
    <div style="text-align: center" v-else-if="latest===null" :key="2">
      <v-progress-circular indeterminate/>
      正在检查新版本...
    </div>
    <SimpleSnackbar ref="snackbar"/>

  </div>
</template>
<script>
import Login from "~/components/Login";
// import axios from "axios";
import VERSION from "assets/version";

// noinspection UnreachableCodeJS
export default {
  layout: "index",
  components: {
    Login
  },
  data: () => ({
    latest: null,
  }),
  methods: {
    downloadNewVersion() {
      this.$refs.snackbar.showInfo("正在默认浏览器中打开下载地址(请允许程序通过杀毒软件)", 5e3);
      (require("open"))("https://github.com/alan-best/codemao-plus/releases")
    }
  },
  async mounted() {


    /////////
    const data = "0"
    this.latest = true;
    return
    ///////

    // noinspection UnreachableCodeJS
    const taskKey = new Date().getTime()
    this.$store.commit("tasks/addTask", {
      label: "检查更新",
      icon: "mdi-update",
      process: -1,
      key: taskKey
    });
    // const {data} = await axios.get("https://gist.githubusercontent.com/alan-best/a02a1970b446cb647bb026d317ad434e/raw/5383fc67ff52198b24166dab9405738d338cbd64/CodemaoPlusVersion")

    this.$store.commit("tasks/removeTask", taskKey)
    if (JSON.parse(data) <= VERSION) {
      this.latest = true;
      this.$refs.snackbar.showSuccess("更新检查: 当前是最新版本");

    } else {
      this.latest = false;

    }
  }
}
</script>
