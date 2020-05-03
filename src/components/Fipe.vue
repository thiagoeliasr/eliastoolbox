<template>
  <v-card color="red lighten-2" dark>
    <v-card-title class="headline red lighten-3">
      <v-icon left>fas fa-car-alt</v-icon>Consulta FIPE
    </v-card-title>

    <v-card-text>
      <v-select prepend-icon="fas fa-truck-pickup" :items="items.tipos" label="Tipo" v-model="tipo"></v-select>
    </v-card-text>

    <v-card-text v-if="tipo">
      <v-autocomplete
        v-model="marca"
        :items="items.marcas"
        color="white"
        hide-no-data
        hide-selected
        label="Marca"
        placeholder="Comece a digitar para pesquisar"
        prepend-icon="fas fa-angle-right"
      ></v-autocomplete>
    </v-card-text>

    <v-card-text v-if="marca">
      <v-autocomplete
        prepend-icon="fas fa-car-side"
        :items="items.modelos"
        color="white"
        hide-no-data
        hide-selected
        label="Modelo"
        v-model="modelo"
        placeholder="Comece a digitar para pesquisar"
      ></v-autocomplete>
    </v-card-text>

    <v-card-text v-if="modelo">
      <v-select prepend-icon="fas fa-search" :items="items.anos" label="Ano" v-model="ano"></v-select>
    </v-card-text>

    <v-divider></v-divider>

    <div v-if="!loaded" class="center-loading">
      <v-icon center class="rotating">fas fa-spinner</v-icon>
    </div>

    <div v-if="resultados">
      <v-expand-transition>
        <v-list v-if="resultados" class="red lighten-2">
          <v-list-tile v-for="(field, i) in fields" :key="i">
            <v-list-tile-content>
              <v-list-tile-sub-title v-text="field.key"></v-list-tile-sub-title>
              <v-list-tile-title v-text="field.value"></v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-expand-transition>
    </div>
  </v-card>
</template>

<script>
import { EventBus } from "@/main.js";
const axios = require("axios");
export default {
  mounted: function() {
    this.fetch_marcas();
  },
  data: () => ({
    items: {
      tipos: [
        { value: "carros", text: "Carros" },
        { value: "motos", text: "Motos" },
        { value: "caminhoes", text: "Caminhões" }
      ],
      marcas: [],
      modelos: [],
      anos: []
    },
    tipo: "carros",
    marca: null,
    modelo: null,
    ano: null,
    resultados: null,
    isLoading: false,
    loaded: false
  }),
  methods: {
    clear() {
      this.isLoading = false;
      this.items = {
        tipos: [
          { value: "carros", text: "Carros" },
          { value: "motos", text: "Motos" },
          { value: "caminhoes", text: "Caminhões" }
        ],
        marcas: [],
        modelos: [],
        anos: []
      };
      this.marca = null;
      this.modelo = null;
      this.ano = null;
      this.resultados = null;

      this.fetch_marcas();

      setTimeout(() => {
        EventBus.$emit("redraw");
      }, 500);
    },
    fetch_marcas() {
      this.isLoading = true;
      this.loaded = false;
      const url = `https://parallelum.com.br/fipe/api/v1/${this.tipo}/marcas`;
      axios
        .get(url)
        .then(res => {
          if (!res.hasOwnProperty("data")) {
            return;
          }

          res.data.forEach(marca => {
            this.items.marcas.push({
              value: marca.codigo,
              text: marca.nome
            });
          });

          this.loaded = true;
          this.isLoading = false;
        })
        .catch(() => {
          EventBus.$emit('snackbar', { 
            text: "Erro ao obter as marcas da FIPE", 
            color: "red lighten-2"
          });
        })
        .finally(() => {
          EventBus.$emit("redraw");
        });
    },
    fetch_modelos() {
      this.isLoading = true;
      this.loaded = false;
      const url = `https://parallelum.com.br/fipe/api/v1/${this.tipo}/marcas/${this.marca}/modelos`;
      axios
        .get(url)
        .then(res => {
          if (
            !res.hasOwnProperty("data") &&
            !res.data.hasOwnProperty("modelos")
          ) {
            return;
          }

          res.data.modelos.forEach(modelo => {
            this.items.modelos.push({
              value: modelo.codigo,
              text: modelo.nome
            });
          });

          this.loaded = true;
          this.isLoading = false;
        })
        .catch(() => {
          EventBus.$emit('snackbar', { 
            text: "Erro ao obter os modelos da FIPE", 
            color: "red lighten-2"
          });
        })
        .finally(() => {
          EventBus.$emit("redraw");
        });
    },
    fetch_anos() {
      this.isLoading = true;
      this.loaded = false;
      const url = `https://parallelum.com.br/fipe/api/v1/${this.tipo}/marcas/${this.marca}/modelos/${this.modelo}/anos`;
      axios
        .get(url)
        .then(res => {
          if (!res.hasOwnProperty("data")) {
            return;
          }

          res.data.forEach(ano => {
            this.items.anos.push({
              value: ano.codigo,
              text: ano.nome
            });
          });

          this.loaded = true;
          this.isLoading = false;
        })
        .catch(() => {
          EventBus.$emit('snackbar', { 
            text: "Erro ao obter os anos para o modelo escolhido", 
            color: "red lighten-2"
          });
        })
        .finally(() => {
          EventBus.$emit("redraw");
        });
    },
    fetch_result() {
      this.isLoading = true;
      this.loaded = false;
      const url = `https://parallelum.com.br/fipe/api/v1/${this.tipo}/marcas/${this.marca}/modelos/${this.modelo}/anos/${this.ano}`;
      axios
        .get(url)
        .then(res => {
          if (!res.hasOwnProperty("data")) {
            return;
          }

          this.resultados = res.data;

          this.loaded = true;
          this.isLoading = false;
        })
        .catch(() => {
          EventBus.$emit('snackbar', { 
            text: "Erro ao obter os valores da FIPE para o veículo", 
            color: "red lighten-2"
          });
        })
        .finally(() => {
          EventBus.$emit("redraw");
        });
    }
  },
  watch: {
    tipo: function() {
      this.clear();
      this.fetch_marcas();
    },
    marca: function() {
      this.fetch_modelos();
    },
    modelo: function() {
      this.fetch_anos();
    },
    ano: function() {
      this.fetch_result();
    }
  },
  computed: {
    fields() {
      if (!this.resultados) return [];

      return Object.keys(this.resultados).map(key => {
        return {
          key,
          value: this.resultados[key] || "n/a"
        };
      });
    }
  }
};
</script>

<style>
@keyframes rotating {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.rotating {
  animation: rotating 2s linear infinite;
}

.center-loading {
  text-align: center;
  padding: 15px;
}
.pointer {
  cursor: pointer;
}
</style>
