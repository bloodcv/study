const {
  override,
  addDecoratorsLegacy,
  addWebpackAlias,
  fixBabelImports,
  // addLessLoader,
} = require("customize-cra");

const path = require("path");

module.exports = override(
  (config) => {
    const oneOf_loc= config.module.rules.findIndex(n=>n.oneOf)
    config.module.rules[oneOf_loc].oneOf=[    //例如要增加处理less的配置
        {
            test: /\.less$/,
            use: [
                require.resolve('style-loader'),
                {
                    loader: require.resolve('css-loader'),
                    options: {
                        importLoaders: 1,
                    },
                },
                {
                  loader: 'less-loader', // compiles Less to CSS
                  options: {
                    lessOptions: { // 如果使用less-loader@5，请移除 lessOptions 这一级直接配置选项。
                      modifyVars: {
                        'primary-color': '#1BC7DB',
                      },
                      javascriptEnabled: true,
                    },
                  }
                }
            ],
        },
        ...config.module.rules[oneOf_loc].oneOf
    ]
    const devtoolMap = {
      development: "cheap-module-source-map",
    };
    config.devtool = devtoolMap[config.mode] || false;
    return config;
  },
  // 针对antd 实现按需打包：根据import来打包 (使用babel-plugin-import)
  fixBabelImports("import", {
    libraryName: "antd",
    libraryDirectory: "es",
    style: true, // 自动打包相关的样式 默认为 style:'css'
  }),
  // 使用less-loader对源码重的less的变量进行重新制定，设置antd自定义主题
  /* addLessLoader({
    lessOptions: {
      javascriptEnabled: true,
      modifyVars: {
        "@primary-color": "#1BC7DB",
      },
    },
  }), */
  addWebpackAlias({
    // "@": path.resolve(__dirname, "src"),
    "@": path.resolve("./src"),
  }),
  addDecoratorsLegacy(),
);
