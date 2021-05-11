module.exports = {
    configureWebpack: {
      devtool: 'source-map'
    },
    pluginOptions: {
      electronBuilder: {
        builderOptions: {
          mac: {
            icon: './src/icon/icon.icns'
          },
          win: {
            icon: './src/icon/icon.png'
          }
        }
      }
    }
  }