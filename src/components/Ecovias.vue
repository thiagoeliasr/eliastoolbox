<template>
  <v-card color="green lighten-2" dark>
    <v-card-title class="headline green lighten-3">
      <v-icon left>fas fa-road</v-icon>
      Status Ecovias
    </v-card-title>

    <v-card-text v-if="loaded">
      <v-select
        prepend-icon="fas fa-camera"
        :items="data.cameras"
        label="Câmeras"
        v-model="url_camera"
      ></v-select>
    </v-card-text>

    <v-divider></v-divider>

    <div v-if="!loaded" class="center-loading">
      <v-icon center class="rotating">fas fa-spinner</v-icon>
    </div>

    <div v-if="loaded && url_camera != null">
      <v-img width="100%" :src="url_camera" @click="dialog=true" class="pointer"></v-img>
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

    <div justify="center">
      <v-dialog v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition">
        <v-card>
          <v-toolbar dark color="primary">
            <v-btn icon dark @click="dialog = false">
              <v-icon>fas fa-times</v-icon>
            </v-btn>
            <v-toolbar-title>Imagem</v-toolbar-title>
            <v-spacer></v-spacer>
          </v-toolbar>
          <v-divider></v-divider>

          <div v-if="loaded && url_camera != null && dialog">
            <v-img height="100%" :src="url_camera"></v-img>
          </div>

        </v-card>
      </v-dialog>
    </div>
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
      convoy_message: null,
      cameras: []
    },
    url_camera: null,
    description_camera: null,
    isLoading: false,
    loaded: false,
    dialog: false
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
        convoy_message: null,
        cameras: []
      };

      setTimeout(() => {
        EventBus.$emit("redraw");
      }, 500);
    },
    fetch() {
      this.isLoading = true;
      this.loaded = false;
      this.url_camera = null;
      const url = `https://api.ecorodovias.com.br/anonymous/ecorodovias-portal/ecovias/playful-map`;
      axios
        .get(url)
        .then(res => {
          if (!res.data.hasOwnProperty("TrafficOperation")) {
            this.data.status = "Erro ao obter os dados da Ecovias";
            return;
          }

          this.data.status = res.data.TrafficOperation.Name;
          this.data.operation = res.data.TrafficOperation.Description;
          this.data.has_convoy = res.data.Convoy.HasConvoy;
          this.data.convoy_message = res.data.Convoy.Message;

          res.data.TrafficOperation.Roads.forEach(el => {
            if (el.Name == "Imigrantes") {
              this.data.operation_imigrantes = this.convertLanes(el.Lanes);
            }
            if (el.Name == "Anchieta") {
              this.data.operation_anchieta = this.convertLanes(el.Lanes);
            }
          });

          res.data.Cameras.forEach(el => {
            if (!el.hasOwnProperty("Cameras")) {
              return;
            }
            el.Cameras.forEach(camera => {
              this.data.cameras.push({
                text: camera.Description + " (Km: " + camera.KM + ")",
                value: camera.Url
              });
            });
          });

          this.loaded = true;
          this.isLoading = false;
        })
        .catch(() => {
          EventBus.$emit('snackbar', { 
            text: "Erro ao obter os dados da Ecovias. Tente novamente", 
            color: "red lighten-2"
          });
        })
        .finally(() => {
          EventBus.$emit("redraw");
        });
    },
    convertLanes(lanes) {
      let str_lanes = lanes.replace(/S/g, "↑");
      str_lanes = str_lanes.replace(/D/g, "↓");
      str_lanes = str_lanes.replace(/X/g, "x");
      str_lanes = str_lanes.replace(/Z/g, "x");
      return str_lanes;
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
