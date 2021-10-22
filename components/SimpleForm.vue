<template>
  <v-form v-model="valid" @submit="e=>{$emit('submit');e.preventDefault()}">
    <div v-for="(field,index) of fields" :key="index">
      <v-text-field
        v-if="field.type==='text'"
        :prepend-icon="field.icon||'mdi-format-text'"
        :type="field.inputType"
        v-model="field.value"
      />
      <v-text-field
        v-else-if="field.type==='postId'"
        :prepend-icon="field.icon||'mdi-note-text'"
        v-model="field.value"
        :label="field.label||'贴号'"
        type="number"
        @change="checkPostId(field.value)"
        :rules="[v=>!v?'必填':true]"
        :error="postIdError===true"
        :error-messages="postIdError? '帖子不存在':''"
        :success="postIdError===false"
        :success-messages="postTitle||''"
        :loading="postLoading"
      />
      <v-text-field
        v-else-if="field.type==='number'"
        :prepend-icon="field.icon||'mdi-numeric'"
        v-model="field.value"
        :label="field.label||'数量'"

        :rules="[v=>(v<=field.max&&v>=field.min)?true:`数字不在范围之内(${field.min}~${field.max})`]"
        type="number"
      />
      <AccountSelector
        v-else-if="field.type==='account'"
        v-model="field.value"
      />

    </div>
    <v-btn @click="$emit('submit')" :disabled="!valid||postLoading"
           color="primary" width="100%">{{ submitText || "确定" }}
    </v-btn>
  </v-form>
</template>

<script>
import axios from "axios";

export default {
  name: "SimpleForm",
  props: {
    fields: Array,
    submitText: String

  },
  data: () => ({
    valid: false,
    postIdError: null,
    postTitle: "",
    postLoading: false,

    postIdRule: v => {
      if (v <= 0) return "贴号错误"
      else return true

    }
  }),
  methods: {
    async checkPostId(v) {
      this.postLoading = true;
      this.postTitle = ""
      this.postIdError = null;
      try {

        this.postTitle = (await axios.get("https://api.codemao.cn/web/forums/posts/" + v + "/details")).data["title"];
        this.postIdError = false;
      } catch (e) {
        this.postIdError = true;
      } finally {
        this.postLoading = false
      }
    }
  }
}
</script>

<style scoped>

</style>
