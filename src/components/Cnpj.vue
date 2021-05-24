<template>

  <v-card color="cyan lighten-2" dark>
    <v-card-title class="headline cyan lighten-3">
      <v-icon left>fas fa-briefcase</v-icon>
      Pesquisar CNPJ
    </v-card-title>
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
      const url = `https://brasilapi.com.br/api/cnpj/v1/${val}`;
      axios
        .get(url)
        .then(res => {
          this.data = {
            CNPJ: res.data.cnpj,
            FANTASIA: res.data.nome_fantasia,
            RAZAO_SOCIAL: res.data.razao_social,
            OPCAO_MEI: res.data.opcao_pelo_mei ? 'Sim' : 'Não',
            OPCAO_SIMPLES: res.data.opcao_pelo_simples ? 'Sim' : 'Não',
            TIPO: res.data.descricao_matriz_filial,
            LOGRADOURO: res.data.logradouro,
            NUMERO: res.data.numero,
            UF: res.data.uf,
            CEP: res.data.cep,
            COD_MUNICIPIO: res.data.codigo_municipio,
            TELEFONE1: res.data.ddd_telefone_1,
            TELEFONE2: res.data.ddd_telefone_2,
            TELEFONE_FAX: res.data.ddd_fax,
            CNAE_FISCAL: res.cnae_fiscal,
            DESCRICAO_CNAE: res.cnae_fiscal_descricao,
          };
        })
        .catch((error) => {
          EventBus.$emit('snackbar', {
            text: "Erro ao obter os dados para o CNPJ informado: " + error,
            color: "red lighten-2"
          });
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
