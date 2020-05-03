<template>
  <v-card color="purple lighten-2" dark>
    <v-card-title class="headline purple lighten-3">
      <v-icon left>fas fa-address-card</v-icon>
      Gerar CPF
    </v-card-title>
    <v-card-text>
      <div class="value-holder">
        <v-text-field
          label="Valor"
          prepend-icon="fas fa-align-left"
          v-model="value"
          ></v-text-field>
          <v-icon left v-if="value" @click="copyClipboard()" class="copy-clipboard" title="Copiar para área de transferência">fas fa-copy</v-icon>
      </div>
      <v-checkbox v-model="mascara" label="Gerar com máscara"></v-checkbox>
    </v-card-text>

    <v-divider></v-divider>

    <div v-if="value">
      <div class="result">
      </div>
    </div>

    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="green darken-3" @click="cpf()">
        Gerar
        <v-icon right>fas fa-times-circle</v-icon>
      </v-btn>
      <v-btn :disabled="!value" color="grey darken-3" @click="clear()">
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
    value: null,
    mascara: true
  }),
  components: {
  },
  methods: {
    clear() {
      this.value = "";

      setTimeout(() => {
        EventBus.$emit("redraw");
      }, 500);
    },

    gera_random(n) {
      return Math.round(Math.random()*n);
    },

    mod(dividendo, divisor) {
      return Math.round(dividendo - (
        Math.floor(dividendo / divisor) * divisor)
      );
    },

    cpf() {
      let n = 9;
      let n1 = this.gera_random(n);
      let n2 = this.gera_random(n);
      let n3 = this.gera_random(n);
      let n4 = this.gera_random(n);
      let n5 = this.gera_random(n);
      let n6 = this.gera_random(n);
      let n7 = this.gera_random(n);
      let n8 = this.gera_random(n);
      let n9 = this.gera_random(n);
      let d1 = n9*2+n8*3+n7*4+n6*5+n5*6+n4*7+n3*8+n2*9+n1*10;
      d1 = 11 - (this.mod(d1,11));
      if (d1>=10) d1 = 0;
      let d2 = d1*2+n9*3+n8*4+n7*5+n6*6+n5*7+n4*8+n3*9+n2*10+n1*11;
      d2 = 11 - (this.mod(d2,11));
      if (d2>=10) d2 = 0;

      if (this.mascara)
        this.value = ''+n1+n2+n3+'.'+n4+n5+n6+'.'+n7+n8+n9+'-'+d1+d2;
      else
        this.value = ''+n1+n2+n3+n4+n5+n6+n7+n8+n9+d1+d2;

      setTimeout(() => {
        EventBus.$emit("redraw");
      }, 500);
    },

    copyClipboard() {
      this.$clipboard(this.value);
      EventBus.$emit("snackbar", { text: "Copiado para a área de transferência" });
      setTimeout(() => {
        EventBus.$emit("redraw");
      }, 500);
    }

  },
};
</script>

<style lang="scss">
div {
  &.value-holder {
    position: relative;
    .copy-clipboard {
      position: absolute;
      top: 20px;
      right: 10px;
      z-index: 5;
    }
  }
}
</style>
