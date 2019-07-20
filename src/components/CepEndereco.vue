<template>
  <v-card color="indigo lighten-2" dark>
    <v-card-title class="headline indigo lighten-3">Pesquisar por Endereço</v-card-title>
    <v-card-text>
      <v-select prepend-icon="fas fa-flag" :items="estados" label="Estado" v-model="pesquisa.uf"></v-select>
    </v-card-text>
    <v-card-text>
      <v-autocomplete
        v-model="pesquisa.cidade"
        :items="cidades"
        color="white"
        hide-no-data
        hide-selected
        label="Cidade"
        placeholder="Comece a digitar para pesquisar"
        prepend-icon="fas fa-city"
        return-object
      ></v-autocomplete>
    </v-card-text>
    <v-card-text>
      <v-autocomplete
        v-model="pesquisa.rua"
        :items="items"
        :loading="isLoading"
        :search-input.sync="search"
        color="white"
        hide-no-data
        hide-selected
        item-text="Description"
        item-value="API"
        label="Endereço"
        placeholder="Comece a digitar para pesquisar"
        prepend-icon="fas fa-map-marker"
        return-object
      ></v-autocomplete>
    </v-card-text>
    <v-divider></v-divider>
    <v-expand-transition>
      <v-list v-if="pesquisa.rua" class="indigo lighten-3">
        <v-list-tile v-for="(field, i) in fields" :key="i">
          <v-list-tile-content>
            <v-list-tile-sub-title v-text="field.key"></v-list-tile-sub-title>
            <v-list-tile-title v-text="field.value"></v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-expand-transition>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn :disabled="!pesquisa.rua" color="grey darken-3" @click="clear()">
        Limpar
        <v-icon right>fas fa-times-circle</v-icon>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import brasil from "../assets/brasil.json";
import estados from "../assets/estados.json";
import { EventBus } from "@/main.js";
export default {
  data: () => ({
    descriptionLimit: 60,
    entries: [],
    cidades: [],
    brasil,
    estados,
    isLoading: false,
    search: null,
    pesquisa: {
      cidade: null,
      uf: null
    }
  }),
  methods: {
    clear() {
      this.pesquisa.rua = "";
      this.pesquisa.uf = "";
      this.pesquisa.cidade = "";
      this.isLoading = false;
      this.search = null;
      this.entries = [];
      setTimeout(() => {
        EventBus.$emit("redraw");
      }, 500);
    },
    fetch(val) {
      this.isLoading = true;

      // Removendo acentos da cidade
      const cidade = this.pesquisa.cidade
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");

      // Lazily load input items
      const url = `https://viacep.com.br/ws/${this.pesquisa.uf}/${cidade}/${val}/json`;
      fetch(url)
        .then(res => res.json())
        .then(res => {
          this.count = res.length;
          this.entries = res;
        })
        .catch(err => {})
        .finally(() => (this.isLoading = false));
    },
    fetchEntriesDebounced(val) {
      // cancel pending call
      clearTimeout(this._timerId);

      // delay new call 500ms
      this._timerId = setTimeout(() => {
        this.fetch(val);
      }, 400);
    }
  },

  computed: {
    fields() {
      if (!this.pesquisa.rua) return [];

      const fields = Object.keys(this.pesquisa.rua).map(key => {
        return {
          key,
          value: this.pesquisa.rua[key] || "n/a"
        };
      });

      setTimeout(() => {
        EventBus.$emit("redraw");
      }, 400);

      return fields;
    },
    items() {
      return this.entries.map(entry => {
        let Description =
          entry.logradouro.length > this.descriptionLimit
            ? entry.logradouro.slice(0, this.descriptionLimit) + "..."
            : entry.logradouro;

        Description += ` - ${entry.complemento} (${entry.cep})`;

        return Object.assign({}, entry, { Description });
      });
    }
  },

  watch: {
    search: function(val) {
      if (val.length < 3) return;
      if (this.isLoading) return;

      this.fetchEntriesDebounced(val);
    },

    "pesquisa.uf": function() {
      this.cidades = this.brasil[this.pesquisa.uf].cidades;
    }
  }
};
</script>

<style>
</style>
