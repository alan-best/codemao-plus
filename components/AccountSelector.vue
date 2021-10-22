<template>
  <v-autocomplete no-data-text="没有搜索到指定的帐号" v-model="value" :items="options" prepend-icon="mdi-account"
                  placeholder="键入以搜索" clearable label="账号" item-text="user_info.nickname"
                  item-value="user_info.nickname"
                  color="primary" :menu-props="{transition:'scroll-y-transition'}">
    <template v-slot:item="data">
      <v-list-item-avatar>
        <v-img :src="data.item['user_info']['avatar_url']"/>
      </v-list-item-avatar>
      <v-list-item-content>
        <v-list-item-title>{{ data.item["user_info"]["nickname"] }}</v-list-item-title>
        <v-list-item-subtitle>ID: {{ data.item["user_info"]["id"] }}</v-list-item-subtitle>
      </v-list-item-content>
    </template>
  </v-autocomplete>
</template>

<script>
export default {
  name: "AccountSelector",
  data: () => ({
    options: [],
    value: null
  }),
  mounted() {
    this.options = [...this.$store.state.accounts.list];
    console.log(this.options)
  }
}
</script>

<style scoped>

</style>
