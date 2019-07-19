<template>
  <v-app>
    <v-toolbar color="indigo" app>
      <v-toolbar-title class="headline white--text">
        <v-icon class="white--text">fas fa-toolbox</v-icon>
        <span> Elias Toolbox</span>
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
  }
}
</script>
