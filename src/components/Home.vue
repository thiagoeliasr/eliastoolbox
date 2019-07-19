<template>
  <v-container grid-list-md>
    <v-layout row wrap>
      <v-flex xs12 md6 lg6>
        <CepEndereco/>
      </v-flex>
      <v-flex xs12 md6 lg6>
        <EnderecoCep/>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import CepEndereco from './CepEndereco'
import EnderecoCep from './EnderecoCep'
export default {
  data: () => ({ }),
  components: {
    CepEndereco,
    EnderecoCep
  }
};
</script>

<style>
</style>
