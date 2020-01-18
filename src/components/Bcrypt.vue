<template>
  <v-card color="teal lighten-2" dark>
    <v-card-title class="headline teal lighten-3">
      <v-icon left>fas fa-key</v-icon>
      Bcrypt Generator
    </v-card-title>
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
            <v-list-tile-sub-title>
              <v-icon left @click="copyClipboard()" class="copy-clipboard" title="Copiar para área de transferência">fas fa-copy</v-icon>
              {{ encodedString }}
            </v-list-tile-sub-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile v-if="copied">
          <v-list-tile-content>
            <v-list-tile-sub-title>
              Copiado para área de transferência
            </v-list-tile-sub-title>
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
import { EventBus } from "@/main.js";
export default {
  data: () => ({
    string: "",
    encodedString: null,
    copied: false,
  }),
  methods: {
    encode() {
      let bcrypt = require("bcryptjs");
      this.encodedString = bcrypt.hashSync(this.string, bcrypt.genSaltSync(10));

      setTimeout(() => {
        EventBus.$emit("redraw");
      }, 500);
    },
    clear() {
      this.string = "";
      this.encodedString = null;
      this.copied = false;

      setTimeout(() => {
        EventBus.$emit("redraw");
      }, 500);
    },
    copyClipboard() {
      this.$clipboard(this.encodedString);
      this.copied = true;
      setTimeout(() => {
        EventBus.$emit("redraw");
        setTimeout(() => {
          this.copied = false;
          EventBus.$emit("redraw");
        }, 3000)
      }, 500);
    }
  }
};
</script>

<style>
.copy-clipboard {
  font-size: 18px;
  margin-right: 0px;
}
</style>
