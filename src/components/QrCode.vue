<template>
  <v-card color="cyan lighten-2" dark>
    <v-card-title class="headline cyan lighten-3">
      <v-icon left>fas fa-qrcode</v-icon>
      Gerar QRCode
    </v-card-title>
    <v-card-text>
      <v-text-field
        label="Valor"
        prepend-icon="fas fa-align-left"
        v-model="value"
        placeholder="Informe a string para gerar o QRCode"
      ></v-text-field>
    </v-card-text>

    <v-divider></v-divider>

    <div v-if="value">
      <div class="qrcenter">
        <qrcode-vue :value="value" size="300" level="H"></qrcode-vue>
      </div>
    </div>

    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn :disabled="!value" color="grey darken-3" @click="clear()">
        Limpar
        <v-icon right>fas fa-times-circle</v-icon>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { EventBus } from "@/main.js";
import QrcodeVue from 'qrcode.vue';
export default {
  data: () => ({
    value: null
  }),
  components: {
    QrcodeVue,
  },
  methods: {
    clear() {
      this.value = "";

      setTimeout(() => {
        EventBus.$emit("redraw");
      }, 500);
    },
    fetch() {
      setTimeout(() => {
        EventBus.$emit("redraw");
      }, 500);
    }
  },
  watch: {
    'value': function() {
      setTimeout(() => {
        EventBus.$emit("redraw");
      }, 500);
    }
  }
};
</script>

<style>
.qrcenter {
  text-align: center;
}
</style>
