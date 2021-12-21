const {
  override,
  addDecoratorsLegacy,
  addWebpackAlias,
  fixBabelImports,
  addLessLoader,
} = require("customize-cra")

const path = require("path");

module.exports = override(
  fixBabelImports("import", {
    libraryName: "antd",
    libraryDirectory: "es",
    style: true,
  }),
  addLessLoader({
    javascriptEnabled: true,
    modifyVars: {
      "@primary-color": "#1BC7DB"
    },
    cssLoaderOptions: {},
  }),
  addWebpackAlias({
    "@": path.resolve(__dirname, "src"),
  }),
  addDecoratorsLegacy(),
  (config) => {
    const devtoolMap = {
      development: "cheap-module-source-map",
    };
    config.devtool = devtoolMap[config.mode] || false;
    return config;
  }
);
