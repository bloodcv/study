const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  mode: "development",
  devtool: "cheap-module-source-map",
  entry: "./src/react.js",
  output: {
    path: path.resolve(__dirname, "output"),
    filename: "main.js",
    // publicPath: '/' // 导入静态资源时的路径前缀，本教程使用相对路径，可不配置
  },
  devServer: {
    port: 8100,
    hot: true
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[id].css",
    }),
    new HtmlWebpackPlugin({
      template: './template.html'
    })
  ],

  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: "babel-loader",
          /* options: {
            presets: ["@babel/preset-env", "@babel/preset-react"],
          }, */
        },
      },
      {
        test: /\.css$/,
        // use: ["style-loader", "css-loader"],
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
    ],
  },

  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          filename: "vendor.js",
          chunks: "all",
          test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
        },
      },
    },
  },
};
