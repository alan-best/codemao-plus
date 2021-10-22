<template>

  <v-card class="mb-1" tile :color="typeColorMap[item.type]" dark>
    <v-card-title @click="expand=!expand" style="cursor: pointer">
      <v-chip>{{
          typeLabelMap[item.type]
        }}
      </v-chip>
      <span class="mr-2">{{ item.title }}</span>

    </v-card-title>
    <v-expand-transition>
      <v-card-text
        v-show="expand"
      >
        <v-container class="content" v-if="item.type==='post'">
          <v-card light>
            <v-card-title>帖子详情</v-card-title>
            <v-card-text>
              <v-chip v-if="item['is_pinned']" v-text="'置顶'" color="purple"
                      outlined/>
              <v-chip v-if="item['is_authorized']" v-text="'官方'" color="orange"
                      outlined/>
              <v-chip v-if="item['is_featured']" v-text="'精品'" color="blue"
                      outlined/>
              <v-chip v-if="item['is_hotted']" v-text="'热帖'" color="red"
                      outlined/>
              <v-chip v-if="item['tutorial_flag']" v-text="'教程'" color="green"
                      outlined/>
              <v-chip v-if="item['ask_help_flag']" v-text="'求助'" color="grey"
                      outlined/>

              <v-list dense>
                <v-list-item>
                  <v-list-item-avatar>
                    <v-img :src="item['user']['avatar_url']"></v-img>
                  </v-list-item-avatar>
                  <v-list-item-content>
                    <v-list-item-title>{{item['user']['nickname']}}</v-list-item-title>
                    <v-list-item-subtitle>发贴用户</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item
                  v-for="l of postInfoList"
                  :key="l['name']">
                  <v-list-item-avatar>
                    <v-icon v-text="l.icon"/>
                  </v-list-item-avatar>
                  <v-list-item-content>
                    <v-list-item-title v-text="l.name"/>
                    <v-list-item-subtitle v-text="l.fun(item)"/>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-card-text>
            <v-card-actions>
              <v-btn link :href="`https://shequ.codemao.cn/community/${item['id']}`"
                     color="primary" text>
                <v-icon>mdi-open-in-new</v-icon>
                在浏览器中打开帖子
              </v-btn>
            </v-card-actions>
          </v-card>
          <v-divider light/>
          <div v-html="item.content"/>
        </v-container>
        <v-card v-else-if="item.type==='box3User'">
          <v-card-title>
            <v-avatar class="mr-1">
              <v-img
                :src="`https://static.box3.codemao.cn/img/${item['avatar_hash'].replace('.png','')}_64_64_cover.png`"/>
            </v-avatar>
            {{
              // noinspection SpellCheckingInspection
              item['displayname']
            }}
          </v-card-title>
          <v-card-text>
            <v-list dense>
              <v-list-item>
                <v-list-item-avatar>
                  <v-icon>mdi-cake-variant</v-icon>
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-content>生日</v-list-item-content>
                  <v-list-item-subtitle>
                    {{ new Date(item['birthday']).toLocaleDateString() }}
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-avatar>
                  <v-icon>mdi-text</v-icon>
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-content>描述</v-list-item-content>
                  <v-list-item-subtitle>{{ item['description'] || '[无]' }}
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-avatar>
                  <v-icon>mdi-numeric</v-icon>
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-content>ID</v-list-item-content>
                  <v-list-item-subtitle>{{ item['id'] }}
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-avatar>
                  <v-icon>mdi-account-circle</v-icon>
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-content>用户名称(BoxId)</v-list-item-content>
                  <v-list-item-subtitle>{{ item['username'] }}
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-card-text>
          <v-card-actions>
            <v-btn link :href="`https://box3.fun/u/${item['id']}`"
                   color="primary" text>
              <v-icon>mdi-open-in-new</v-icon>
              打开用户主页
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-card-text>
    </v-expand-transition>
  </v-card>
</template>

<script>
export default {
  name: "SearchResult",
  props: {
    item: Object
  },
  data: () => ({
    typeLabelMap: {"post": "帖子", "box3User": "神奇代码岛用户"},
    typeColorMap: {"post": "orange", "box3User": "orange darken-3"},
    expand: false,
    postInfoList: [
      {
        name: '贴号(ID)',
        fun: v => v['id'],
        icon: 'mdi-numeric'
      },
      {
        name: '浏览量',
        fun: v => v['n_views'],
        icon: 'mdi-eye'
      },
      {
        name: '回帖',
        fun: v => v['n_replies'],
        icon: 'mdi-comment-multiple'
      },
      {
        name: '评论',
        fun: v => v['n_comments'],
        icon: 'mdi-comment-flash'
      },
      {
        name: '发布时间',
        fun: v => new Date(v['created_at']).toLocaleString(),
        icon: 'mdi-calendar'
      },
      {
        name: '板块名称',
        fun: v => v['board_name'],
        icon: 'mdi-bulletin-board'
      },

    ]
  }),
  methods: {
    intersect(entries) {
      this.show = entries[0].isIntersecting
      console.log(entries)
    }
  },

}
</script>

<style scoped lang="sass">
.content
  max-height: 60vh
  overflow-y: auto
  background-color: #eee
  color: #888
  user-select: text
</style>
