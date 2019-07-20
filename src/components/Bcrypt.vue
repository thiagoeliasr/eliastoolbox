<template>
  <v-card color="teal lighten-2" dark>
    <v-card-title class="headline teal lighten-3">Bcrypt Generator</v-card-title>
    <v-card-text>
      <v-text-field
        label="String"
        prepend-icon="fas fa-key"
        v-model="string"
        placeholder="String a ser criptografada"
      ></v-text-field>
    </v-card-text>
    <v-divider></v-divider>
    <v-expand-transition>
      <v-list v-if="encodedString" class="teal lighten-3">
        <v-list-tile>
          <v-list-tile-content>
            <v-list-tile-title>Senha Criptografada</v-list-tile-title>
            <v-list-tile-sub-title v-text="encodedString">{{ encodedString }}</v-list-tile-sub-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-expand-transition>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn :disabled="!string" color="green darken-3" @click="encode()">
        Ok
        <v-icon right>fas fa-check</v-icon>
      </v-btn>
      <v-btn :disabled="!encodedString" color="grey darken-3" @click="clear()">
        Limpar
        <v-icon right>fas fa-times-circle</v-icon>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  data: () => ({
    string: '',
    encodedString: null
  }),
  methods: {
    encode() {
      let bcrypt = require("bcryptjs");
      this.encodedString = bcrypt.hashSync(this.string, bcrypt.genSaltSync(10));
    },
    clear() {
      this.string = '';
      this.encodedString = null;
    }
  },
};
</script>

<style>
</style>
