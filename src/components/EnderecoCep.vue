<template>
  <v-card color="blue-grey lighten-2" dark>
    <v-card-title class="headline blue-grey lighten-3">Pesquisar endereço pelo CEP</v-card-title>
    <v-card-text>
      <v-text-field
        label="CEP"
        prepend-icon="fas fa-search"
        v-model="pesquisa.cep"
        mask="#####-###"
        placeholder="Informe o CEP"
      ></v-text-field>
    </v-card-text>
    <v-divider></v-divider>
    <v-expand-transition>
      <v-list v-if="pesquisa.cep" class="blue-grey lighten-3">
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
      <v-btn :disabled="!pesquisa.cep" color="grey darken-3" @click="clear()">
        Limpar
        <v-icon right>fas fa-times-circle</v-icon>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  data: () => ({
    entries: [],
    isLoading: false,
    search: null,
    pesquisa: {
      cep: '',
    }
  }),
  methods: {
    clear() {
      this.pesquisa.cep = "";
      this.isLoading = false;
      this.search = null;
      this.entries = [];
    },
    fetch(val) {
      this.isLoading = true;

      const url = `https://viacep.com.br/ws/${this.pesquisa.cep}/json/`
      fetch(url)
        .then(res => res.json())
        .then(res => {
          this.count = res.length;
          this.entries = res;
        })
        .catch(err => console.log(err))
        .finally(() => (this.isLoading = false));
    },
    fetchEntriesDebounced(val) {
      clearTimeout(this._timerId);
      this._timerId = setTimeout(() => {
        this.fetch(val);
      }, 400);
    }
  },

  computed: {
    fields() {
      if (!this.entries) return [];

      return Object.keys(this.entries).map(key => {
        return {
          key,
          value: this.entries[key] || "n/a"
        };
      });
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
    'pesquisa.cep': function(val) {
      if (val.length != 8) return;
      if (this.isLoading) return;

      this.fetchEntriesDebounced(val);
    },
  }
};
</script>

<style>
</style>
