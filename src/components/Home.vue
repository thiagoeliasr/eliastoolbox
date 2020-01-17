<template>
  <div>
    <div v-masonry transition-duration="0.3s" item-selector=".item">
      <div v-masonry-tile class="item" v-for="tile in tiles" :key="tile.selector">
        <CepEndereco v-if="tile.selector == 'cep-endereco' && tile.active == true" />
        <EnderecoCep v-if="tile.selector == 'endereco-cep' && tile.active == true" />
        <Cnpj v-if="tile.selector == 'cnpj' && tile.active == true" />
        <Bcrypt v-if="tile.selector == 'bcrypt-generator' && tile.active == true" />
        <BcryptDecrypt v-if="tile.selector == 'bcrypt-decrypt' && tile.active == true" />
        <QrCode v-if="tile.selector == 'qrcode-generator' && tile.active == true" />
        <Ecovias v-if="tile.selector == 'ecovias' && tile.active == true" />
      </div>
    </div>
    <v-bottom-sheet v-model="sheet">
      <template v-slot:activator>
        <v-btn color="blue darken-3" dark small fixed top right fab>
          <v-icon>fas fa-filter</v-icon>
        </v-btn>
      </template>
      <v-list>
        <v-subheader>
          <v-btn color="blue darken-3" dark small right @click="sheet = false">Fechar</v-btn>
        </v-subheader>
        <v-list-tile v-for="(tile, index) in tiles" :key="tile.title">
          <v-list-tile-avatar>
            <v-avatar size="32px" tile>
              <v-icon>{{ tile.icon }}</v-icon>
            </v-avatar>
          </v-list-tile-avatar>
          <div @click="lazyRedraw()">
            <v-switch v-model="tiles[index].active" :label="tile.title"></v-switch>
          </div>
        </v-list-tile>
      </v-list>
    </v-bottom-sheet>
  </div>
</template>

<script>
import CepEndereco from "./CepEndereco";
import EnderecoCep from "./EnderecoCep";
import Bcrypt from "./Bcrypt";
import Cnpj from "./Cnpj";
import BcryptDecrypt from "./BcryptDecrypt";
import QrCode from "./QrCode";
import Ecovias from "./Ecovias";
import { EventBus } from "@/main.js";
import { setTimeout } from "timers";

export default {
  data: () => ({
    sheet: false,
    tiles: [
      {
        selector: "cep-endereco",
        icon: "fas fa-map-marker",
        title: "CEP pelo Endereço",
        active: true
      },
      {
        selector: "endereco-cep",
        icon: "fas fa-city",
        title: "Endereço pelo CEP",
        active: true
      },
      {
        selector: "cnpj",
        icon: "fas fa-briefcase",
        title: "Consulta Empresa por CNPJ",
        active: true
      },
      {
        selector: "bcrypt-generator",
        icon: "fas fa-key",
        title: "Bcrypt Generator",
        active: true
      },
      {
        selector: "bcrypt-decrypt",
        icon: "fas fa-key",
        title: "Bcrypt Decrypt",
        active: true
      },
      {
        selector: "qrcode-generator",
        icon: "fas fa-qrcode",
        title: "QRCode Generator",
        active: true
      },
      {
        selector: "ecovias",
        icon: "fas fa-road",
        title: "Status Ecovias",
        active: true
      }
    ]
  }),
  components: {
    CepEndereco,
    EnderecoCep,
    Cnpj,
    Bcrypt,
    BcryptDecrypt,
    QrCode,
    Ecovias
  },
  created: function() {
    EventBus.$on("redraw", this.redraw);
  },
  beforeDestroy: function() {
    EventBus.off("redraw");
  },
  methods: {
    lazyRedraw() {
      setTimeout(() => {
        this.redraw();
      }, 250);
    },
    redraw() {
      this.$redrawVueMasonry();
    }
  }
};
</script>

<style lang="scss">
</style>
