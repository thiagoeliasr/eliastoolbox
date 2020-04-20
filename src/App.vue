<template>
  <v-app>
    <v-toolbar color="indigo" app>
      <v-toolbar-title class="headline white--text">
        <v-icon class="white--text icon-title">fas fa-toolbox</v-icon>
        <span class="title"> Elias Toolbox</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
    </v-toolbar>

    <v-content>
      <Home/>
    </v-content>

  </v-app>
</template>

<script>
import Home from './components/Home'

export default {
  name: 'App',
  components: {
    Home
  },
  data () {
    return {
      //
    }
  },
  created() {
    if (this.$workbox) {
      this.$workbox.addEventListener("waiting", () => {
        this.showUpgradeUI = true;
      });
    }
  },
  methods: {
    async accept() {
      this.showUpgradeUI = false
      await this.$workbox.messageSW({ type: "SKIP_WAITING" });
    }
  },
}
</script>
<style lang="scss">
@import '@/scss/main.scss';
</style>