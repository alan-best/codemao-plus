<template>
  <div>
    <v-expansion-panels>
      <v-expansion-panel v-for="(fun,index) of functions" :key="index">
        <v-expansion-panel-header>
          <span class="mr-5">{{ fun.title }}</span>
          <span class="mr text--secondary">{{ fun.desc }}</span>

        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <div>
            <span class="text-h6">注意</span><br/>
            <ul>
              <li>当线程较多时, 实际浏览量可能会远远超过设定的浏览量</li>
              <li class="red--text">过度操作可能导致网络被编程猫限速或阻断</li>
              <li>线程数量过多或同时进行多个任务时速度可能会非常缓慢, 这与设备的网络环境有关</li>
              <li class="blue--text">建议不要盲目增多线程数量, 推荐线程数量在10~100之间</li>
            </ul>
          </div>
          <SimpleForm :fields="fun.fields" @submit="fun.run(fun.fields,$store)"
                      submit-text="执行"/>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </div>
</template>

<script>
// import axios from "axios";
import {ipcRenderer} from "electron";

export default {
  name: "start",
  layout: "index",
  data: () => ({
    functions: [
      {
        title: "刷帖子浏览量", desc: "增加帖子浏览量", fields: [
          {type: 'postId', value: 0},
          {type: 'number', label: '浏览量', min: 1, max: Infinity, value: 100},
          {type: 'number', label: '最大线程数量', min: 1, max: 500, value: 10}
        ],
        async run(fields, $store) {
          const {ipcRenderer} = require("electron")
          const times = fields[1].value;
          const processKey = new Date().getTime();
          $store.commit("tasks/addTask", {
            label: `[刷浏览量] 贴号:${fields[0].value} 数量:${times}`,
            process: -1,
            icon: "mdi-eye-plus",
            key: processKey,
            canCancel: true,
            cancel() {
              ipcRenderer.send("function-views" + processKey + "cancel");
              ipcRenderer.removeAllListeners("function-views" + processKey);
              $store.commit("tasks/removeTask", processKey);
            }
          })
          ipcRenderer.send("function-views", {
            id: processKey,
            times,
            target: fields[0].value, maxRunning: fields[2].value
          })
          ipcRenderer.on("function-views" + processKey, (event, args) => {
            $store.commit("tasks/setProcess", {
              key: processKey,
              process: args.process + 0.01
            });
            if (args.process >= 100) {
              ipcRenderer.removeAllListeners("function-views" + processKey);
              setTimeout(() => $store.commit("tasks/removeTask", processKey), 500)

            }
          })

        }
      }
    ]
  }),
  methods: {
    run(f) {
      f.run(f.fields, this)
    }
  }
}
</script>

<style scoped>

</style>
