const webpack = require('webpack');

module.exports = {
  configureWebpack: {
    devtool: 'source-map',
    plugins: [
      new webpack.DefinePlugin({
        'process.env.FLUENTFFMPEG_COV': false
      })
    ]
  },
  pluginOptions: {

    electronBuilder: {
      nodeIntegration: true,
      contextIsolation: false,
      builderOptions: {
        mac: {
          icon: './src/icon/icon.icns'
        },
        win: {
          icon: './src/icon/icon.png',
          target: 'nsis'
        },
        nsis: {//https://www.electron.build/generated/nsisoptions
          oneClick: false,
          allowToChangeInstallationDirectory: true,
          createDesktopShortcut: true
        }
      }
    }
  }
}