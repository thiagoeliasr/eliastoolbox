<template>
  <v-card color="orange lighten-2" dark>
    <v-card-title class="headline orange lighten-3">Bcrypt Decrypt</v-card-title>
    <v-card-text>
      <v-text-field
        label="String a ser comparada"
        prepend-icon="fas fa-key"
        v-model="string"
        placeholder="String a ser comparada"
      ></v-text-field>
    </v-card-text>
    <v-card-text>
      <v-text-field
        label="String criptografada"
        prepend-icon="fas fa-key"
        v-model="encryptedString"
        placeholder="String criptografada"
      ></v-text-field>
    </v-card-text>
    <v-divider></v-divider>
    <v-expand-transition>
      <v-list v-if="result" class="orange lighten-3">
        <v-list-tile>
          <v-list-tile-content>
            <v-list-tile-title>Resultado:</v-list-tile-title>
            <v-list-tile-sub-title>{{ result }}</v-list-tile-sub-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-expand-transition>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn :disabled="!string || !encryptedString" color="green darken-3" @click="encode()">
        Ok
        <v-icon right>fas fa-check</v-icon>
      </v-btn>
      <v-btn :disabled="!result" color="grey darken-3" @click="clear()">
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
    encryptedString: '',
    result: null
  }),
  methods: {
    encode() {
      let bcrypt = require("bcryptjs");
      this.result = bcrypt.compareSync(this.string, this.encryptedString) ? 
        'String bate com hash' : 'String NÃO bate com hash';
    },
    clear() {
      this.string = '';
      this.encryptedString = '';
      this.result = null;
    }
  },
};
</script>

<style>
</style>
