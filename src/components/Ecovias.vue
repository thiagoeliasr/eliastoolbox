<template>
  <v-card color="green lighten-2" dark>
    <v-card-title class="headline green lighten-3">Status Ecovias</v-card-title>
    <v-divider></v-divider>

    <div v-if="!loaded" class="center-loading">
      <v-icon center class="rotating">fas fa-spinner</v-icon>
    </div>

    <div v-if="loaded">
      <v-list-tile v-if="data.status != null">
        <v-list-tile-content>
          <v-list-tile-title>Operação:</v-list-tile-title>
          <v-list-tile-sub-title>{{ data.status }} - {{ data.operation }}</v-list-tile-sub-title>
        </v-list-tile-content>
      </v-list-tile>
      <v-spacer></v-spacer>

      <v-list-tile v-if="data.operation_imigrantes != null">
        <v-list-tile-content>
          <v-list-tile-title>Imigrantes:</v-list-tile-title>
          <v-list-tile-sub-title>{{ data.operation_imigrantes }}</v-list-tile-sub-title>
        </v-list-tile-content>
      </v-list-tile>
      <v-spacer></v-spacer>

      <v-list-tile v-if="data.operation_anchieta != null">
        <v-list-tile-content>
          <v-list-tile-title>Anchieta:</v-list-tile-title>
          <v-list-tile-sub-title>{{ data.operation_anchieta }}</v-list-tile-sub-title>
        </v-list-tile-content>
      </v-list-tile>
      <v-spacer></v-spacer>

      <v-list-tile>
        <v-list-tile-content>
          <v-list-tile-title v-if="data.has_convoy">Operação Comboio em Vigor</v-list-tile-title>
          <v-list-tile-title v-if="!data.has_convoy">Sem operação comboio</v-list-tile-title>
          <v-list-tile-sub-title v-if="data.convoy_message != null">{{ data.convoy_message }}</v-list-tile-sub-title>
        </v-list-tile-content>
      </v-list-tile>
      <v-spacer></v-spacer>

    </div>

    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn :disabled="isLoading" color="grey darken-3" @click="fetch()">
        Atualizar
        <v-icon right>fas fa-sync</v-icon>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { EventBus } from "@/main.js";
const axios = require("axios");
export default {
  mounted: function() {
    this.fetch();
  },
  data: () => ({
    data: {
      status: null,
      operation: null,
      operation_imigrantes: null,
      operation_anchieta: null,
      has_convoy: false,
      convoy_message: null
    },
    isLoading: false,
    loaded: false
  }),
  methods: {
    clear() {
      this.isLoading = false;
      this.data = {
        status: null,
        operation: null,
        operation_imigrantes: null,
        operation_anchieta: null,
        has_convoy: false,
        convoy_message: null
      };

      setTimeout(() => {
        EventBus.$emit("redraw");
      }, 500);
    },
    fetch() {
      this.isLoading = true;
      this.loaded = false;
      const url = `https://api.ecorodovias.com.br/anonymous/ecorodovias-portal/ecovias/playful-map`;
      axios
        .get(url)
        .then(res => {
          this.data.status = res.data.TrafficOperation.Name;
          this.data.operation = res.data.TrafficOperation.Description;
          this.data.has_convoy = res.data.Convoy.HasConvoy;
          this.data.convoy_message = res.data.Convoy.Message;

          res.data.TrafficOperation.Roads.forEach(el => {
            if (el.Name == 'Imigrantes') {
              this.data.operation_imigrantes = this.convertLanes(el.Lanes);
            }
            if (el.Name =='Anchieta') {
              this.data.operation_anchieta = this.convertLanes(el.Lanes)
            }
          })

          this.loaded = true;
          this.isLoading = false;
        })
        .catch(error => {
          console.log(error);
        })
        .finally(() => {
          EventBus.$emit("redraw");
        });
    },
    convertLanes(lanes) {
        let str_lanes = lanes.replace(/S/g, '↑')
        str_lanes = str_lanes.replace(/D/g, '↓')
        str_lanes = str_lanes.replace(/X/g, 'x')
        str_lanes = str_lanes.replace(/Z/g, 'x')
        return str_lanes;
    }
  },

};
</script>

<style>
@-webkit-keyframes rotating {
    from{
        -webkit-transform: rotate(0deg);
    }
    to{
        -webkit-transform: rotate(360deg);
    }
}

.rotating {
    -webkit-animation: rotating 2s linear infinite;
}

.center-loading {
  text-align: center;
  padding: 15px;
}
</style>
