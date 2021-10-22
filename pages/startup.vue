<template>
  <v-app style="height: 100vh;width: 100vw">
    <v-app-bar
      dense
      app
      dark
      clipped-left
      color="primary"
      style="-webkit-app-region: drag"
      flat
    >

      <h3>Codemao Plus</h3>
      <v-spacer/>
      <v-skeleton-loader v-for="i of 4" :key="i" type="avatar" class="mr-2"/>
    </v-app-bar>
    <v-navigation-drawer app clipped permanent>
      <v-list dense>
        <v-list-item v-for="i of 5" :key="i">
          <v-list-item-avatar>
            <v-skeleton-loader type="avatar"/>
          </v-list-item-avatar>
          <v-list-item-title>
            <v-skeleton-loader type="text"/>
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main style="height: 100%;">

    </v-main>
    <v-footer
      app
    >
      <span>Made by Alan_Best</span>
      <v-spacer/>
      <v-skeleton-loader type="text" width="150px"/>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  name: "startup",
  mounted() {
    const mediaQueryListDark = window.matchMedia('(prefers-color-scheme: dark)');
    this.$vuetify.theme.dark = mediaQueryListDark.matches;
    setTimeout(()=>{
      this.$router.push('/')
    },Math.random()*500)

  }
}
</script>

<style scoped>

</style>
