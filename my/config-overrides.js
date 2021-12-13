// 修改webpack默认配置，目的：按需引入antdesign
// customize-cra包含很多api
const {
  override,
  addDecoratorsLegacy
} = require('customize-cra');
// const { injectBabelPlugin } = require("react-app-rewired");

/* const rewiredMap = () => config => {
  // config为所有的webpack配置
  config.devtool = config.mode === 'development' ? 'cheap-module-source-map' : false // 生产环境关闭sourcemap关闭
  return config
} */

module.exports = override(
  // rewiredMap()
  // 暴露webpack中的config配置
  (config) => {
    // config为所有的webpack配置
    // 生产环境关闭sourcemap关闭
    config.devtool = config.mode === 'development' ? 'cheap-module-source-map' : false
    return config
  },
  /* fixBabelImports("antd", {
    libraryName: "antd",
    libraryDirectory: "es",
    style: true
  }), */
  addDecoratorsLegacy()
);
