<template>
  <v-card color="cyan lighten-2" dark>
    <v-card-title class="headline cyan lighten-3">Pesquisar CNPJ</v-card-title>
    <v-card-text>
      <v-text-field
        label="CNPJ"
        prepend-icon="fas fa-search"
        v-model="pesquisa.cnpj"
        mask="##.###.###/####-##"
        placeholder="Informe o CNPJ"
      ></v-text-field>
    </v-card-text>

    <v-divider></v-divider>

    <div v-if="data">
      <v-list-tile v-for="(field, i) in data" :key="i">
        <v-list-tile-content v-if="i != 'atividade_principal' && i != 'atividades_secundarias'">
          <v-list-tile-sub-title v-text="i"></v-list-tile-sub-title>
          <v-list-tile-title v-text="field"></v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>

      <div v-for="(field, i) in data.atividade_principal" :key="i">
        <v-list-tile v-for="(subfield, j) in field" :key="j">
          <v-list-tile-content>
            <v-list-tile-sub-title v-text="j == 'code' ? 'CNAE' : 'Ativ. Primária'"></v-list-tile-sub-title>
            <v-list-tile-title v-text="subfield"></v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-divider></v-divider>
      </div>

      <div v-for="(field, i) in data.atividades_secundarias" :key="i + '-field-' + field.code">
        <v-list-tile v-for="(subfield, j) in field" :key="j">
          <v-list-tile-content>
            <v-list-tile-sub-title v-text="j == 'code' ? 'CNAE' : 'Ativ. Secundária'"></v-list-tile-sub-title>
            <v-list-tile-title v-text="subfield"></v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-divider></v-divider>
      </div>
    </div>

    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn :disabled="!pesquisa.cnpj" color="grey darken-3" @click="clear()">
        Limpar
        <v-icon right>fas fa-times-circle</v-icon>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { EventBus } from "@/main.js";
const axios = require("axios");
export default {
  data: () => ({
    data: null,
    isLoading: false,
    search: null,
    pesquisa: {
      cnpj: ""
    }
  }),
  methods: {
    clear() {
      this.pesquisa.cnpj = "";
      this.isLoading = false;
      this.search = null;
      this.data = null;

      setTimeout(() => {
        EventBus.$emit("redraw");
      }, 500);
    },
    fetch(val) {
      this.isLoading = true;
      const url = `http://thiagoelias.org:8000/fetch?url=https://www.receitaws.com.br/v1/cnpj/${val}?callback`;
      axios
        .get(url)
        .then(res => {
          this.data = res.data;
        })
        .catch(error => {
          console.log(error);
        })
        .finally(() => {
          EventBus.$emit("redraw");
        });
    },
    fetchEntriesDebounced(val) {
      clearTimeout(this._timerId);
      this._timerId = setTimeout(() => {
        this.fetch(val);
      }, 400);
    }
  },

  watch: {
    "pesquisa.cnpj": function(val) {
      if (val.length != 14) return;
      if (this.isLoading) return;
      this.fetchEntriesDebounced(val);
    }
  }
};
</script>

<style>
</style>
