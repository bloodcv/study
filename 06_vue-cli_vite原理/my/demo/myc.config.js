const CleanPlugin = require('./plugins/clean.plugin');

const CleanPluginOptions = {
  msg: 'Say hello Clean!'
}

module.exports = {
  plugins: {
    commands: [
      CleanPlugin(CleanPluginOptions)
    ]
  }
}