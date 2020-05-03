<template>
  <v-card color="brown lighten-2" dark>
    <v-card-title class="headline brown lighten-3">
      <v-icon left>fas fa-address-card</v-icon>
      Gerar CNPJ
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
      <v-btn color="green darken-3" @click="cnpj()">
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

    cnpj() {
      let n = 9;
      let n1  = this.gera_random(n);
      let n2  = this.gera_random(n);
      let n3  = this.gera_random(n);
      let n4  = this.gera_random(n);
      let n5  = this.gera_random(n);
      let n6  = this.gera_random(n);
      let n7  = this.gera_random(n);
      let n8  = this.gera_random(n);
      let n9  = 0;
      let n10 = 0;
      let n11 = 0;
      let n12 = 1;
      let d1 = n12*2+n11*3+n10*4+n9*5+n8*6+n7*7+n6*8+n5*9+n4*2+n3*3+n2*4+n1*5;
      d1 = 11 - ( this.mod(d1,11) );
      if (d1>=10) d1 = 0;
      let d2 = d1*2+n12*3+n11*4+n10*5+n9*6+n8*7+n7*8+n6*9+n5*2+n4*3+n3*4+n2*5+n1*6;
      d2 = 11 - ( this.mod(d2,11) );
      if (d2>=10) d2 = 0;

      if (this.mascara)
        this.value = ''+n1+n2+'.'+n3+n4+n5+'.'+n6+n7+n8+'/'+n9+n10+n11+n12+'-'+d1+d2;
      else
        this.value = ''+n1+n2+n3+n4+n5+n6+n7+n8+n9+n10+n11+n12+d1+d2;
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
