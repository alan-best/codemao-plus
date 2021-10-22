<template>
  <div class="search">
    <div id="top"/>
    <v-row>
      <v-col :cols="9">
        <v-text-field dense :key="1" v-model="input" label="搜索"
                      prepend-icon="mdi-database-search"
                      placeholder="输入关键字" @keypress.enter="start"
                      :loading="loading" :disabled="step>0" id="input"/>
      </v-col>
      <v-col :cols="3">
        <v-btn @click="step>0?reset():start()" :color="step>0?'red':'green'"
               :disabled="noInput"
               width="100%" :dark="!noInput">
          <v-icon>
            {{
              step > 0 ? "mdi-close" : 'mdi-arrow-right-bold-hexagon-outline'
            }}
          </v-icon>
          {{
            $vuetify.breakpoint.mdAndDown ? "" : (step > 0 ? "关闭搜索并返回" : "开始")
          }}
        </v-btn>
      </v-col>
    </v-row>
    <v-slide-x-transition group mode="out-in" leave-absolute>
      <div :key="0" v-if="step===0"
      >

        <v-alert type="info">
          输入关键词即可开始搜索...<br/>
          你可以用以下内容作为关键字
          <ul>
            <li>帖子标题</li>
            <!--            <li>帖子内容</li>-->
            <li>Box3用户</li>
          </ul>
          输入内容后按Enter开始检索
        </v-alert>

      </div>
      <div :key="2" v-if="loading">
        <!--        <v-progress-circular indeterminate/>-->
        正在查找有关"{{ input }}"的内容
        <v-btn outlined color="error" rounded x-small @click="loading=false">
          停止查找
        </v-btn>
      </div>
      {{ scrollOffset }}

      <div :key="3" v-if="step===1&&!noResult"
           v-scroll.self="e=>this.scrollOffset=e.target.scrollTop"
           style="max-height: 93%;overflow-y: auto">

        <SearchResult v-for="(item,index) of result"
                      :key="index" :item="item"/>
      </div>
      <div :key="4" v-else-if="step===1&&noResult&&!loading">没有找到任何相关信息
      </div>
    </v-slide-x-transition>
    <v-fab-transition>
      <v-btn fab color="secondary" bottom right fixed v-show="scrollOffset>0"
             style="bottom: 45px" link href="#top">
        <v-icon>mdi-arrow-up</v-icon>
      </v-btn>
    </v-fab-transition>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "search",
  layout: "index",
  data: () => ({
    step: 0,
    input: "",
    loading: false,
    result: [],

    scrollOffset: 0
  }),
  methods: {
    reset() {
      this.result = [];
      this.loading = false;
      this.input = "";
      this.step = 0;

    },
    async start() {
      this.step = 1;
      if (this.noInput) return
      this.loading = true;
      let page = 1;
      this.done = false;
      this.result = [];
      let title = this.input.toString();
      let offset = 0;
      const limit = 5;
      while (true) {


        const {rows} = (await axios.post("https://box3.fun/api/api/user-server-rpc", {
          "type": "search",
          "data": {limit, offset, "targetName": this.input}
        })).data.data.data;
        if (!this.loading) return
        rows.forEach(user => {
          // noinspection SpellCheckingInspection
          this.result.push({
            type: "box3User", ...user,
            title: user['displayname']
          });
        });
        if (rows.length < limit) break
        offset += limit

      }
      while (true) {

        const result = (await axios.get(`https://api.codemao.cn/web/forums/posts/search?title=${title}&limit=30&page=${page}`)).data
        if (!this.loading) return
        for (const item of result["items"]) {
          try {
            const post = (await axios.get(`https://api.codemao.cn/web/forums/posts/${item.id}/details`)).data
            this.result.push({type: "post", ...post});
          } catch (e) {
            console.log(e);
          }
        }
        if (result['items'].length === 0) {
          this.loading = false;
          break;
        } else page++
      }

      this.done = true;
    }
  },
  computed: {
    noInput() {
      return this.input.length === 0
    },
    noResult() {
      return this.result.length === 0
    }
  }
}
</script>

<style scoped lang="sass">
.content
  max-height: 80vh
  overflow-y: auto
  overflow-x: auto
  text-overflow: clip
  user-select: text
  word-break: break-word

.search
  height: 100%

#content-planes
  height: 90%
  overflow-y: auto

</style>
