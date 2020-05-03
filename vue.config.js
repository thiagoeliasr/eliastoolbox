const { GenerateSW } = require("workbox-webpack-plugin");

module.exports = {

  configureWebpack: {
    plugins: [new GenerateSW()]
  },

  css: {
    loaderOptions: {
      sass: {
        data: `
          @import "@/scss/_variables.scss";
          @import "@/scss/_mixins.scss";
        `
      }
    }
  }

}
