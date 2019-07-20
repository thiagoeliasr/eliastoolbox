<template>

<div v-masonry transition-duration="0.3s" item-selector=".item">
    <div v-masonry-tile class="item">
      <CepEndereco/>
    </div>
    <div v-masonry-tile class="item">
      <EnderecoCep/>
    </div>
    <div v-masonry-tile class="item">
      <Bcrypt/>
    </div>
    <div v-masonry-tile class="item">
      <BcryptDecrypt/>
    </div>
</div>

</template>

<script>
import CepEndereco from "./CepEndereco";
import EnderecoCep from "./EnderecoCep";
import Bcrypt from "./Bcrypt";
import BcryptDecrypt from "./BcryptDecrypt";
import { EventBus } from "@/main.js"

export default {
  data: () => ({}),
  components: {
    CepEndereco,
    EnderecoCep,
    Bcrypt,
    BcryptDecrypt
  },
  created: function() {
    EventBus.$on('redraw', this.redraw);
  },
  beforeDestroy: function() {
    EventBus.off('redraw');
  },
  methods: {
    redraw() {
      console.log('Redrawing Grid');
      this.$redrawVueMasonry();
    }
  }
};
</script>

<style lang="scss">
</style>
