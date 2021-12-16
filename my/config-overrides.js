const {
  override,
  addDecoratorsLegacy,
  fixBabelImports,
  addLessLoader,
  addWebpackAlias,
} = require('customize-cra');
const path = require('path')

module.exports = override(
  fixBabelImports("import", {
    libraryName: 'antd',
    libraryDirectory: 'es',
    style: true
  }),
  addDecoratorsLegacy(),
  addLessLoader({
    javascriptEnabled: true,
    modifyVars: {
      "@primary-color": "#1BC7DB", // for example, you use Ant Design to change theme color.
    },
    cssLoaderOptions: {}, // .less file used css-loader option, not all CSS file.
  }),
  addWebpackAlias({
    '@': path.resolve('./src')
  }),
  (config) => {
    const sourceMap = {
      development: 'cheap-module-source-map'
    }
    // 关闭生产的source-map
    config.devtool = sourceMap[config.mode] || false
    return config;
  }
)