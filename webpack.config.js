const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin')
// const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin')
const DashboardPlugin = require("webpack-dashboard/plugin")
const webpack = require("webpack");
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
// uglifyjs-webpack-plugin

module.exports = {
  entry: {
    page: './src/index.js',
    page1: './src/index1.js'
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'js/[chunkhash:10].js',
    assetModuleFilename: 'imgs/[name]-[hash:10][ext]',
    clean: true,
  },
  devServer: {
    open: true,
    host: '0.0.0.0',
    port: '6061',
    client: {
      progress: true,
    },
    hot: true
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      title: 'webpack title',
      inject: true,
      hash: false,
      chunks: [ 'page' ],
      minify: {
        collapseWhitespace: true,
        minifyCSS: true,
        minifyJS: true,
        removeComments: true
      }
    }),
    // new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: 'style/[chunkhash:10].css'
    }),
    new OptimizeCssAssetsWebpackPlugin(),
    // new DashboardPlugin(), // 用这个就要在package.json中改一下  "start": "webpack-dashboard -- webpack-dev-server --mode development",
    // new BundleAnalyzerPlugin()
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        // use: [ 'style-loader', 'css-loader' ]
        use: [ MiniCssExtractPlugin.loader, 'css-loader' ]
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/,
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 60 * 1024
          }
        },
        use: {
          loader: 'image-webpack-loader',
          options: {
            disabled: true
          }
        }
      },
      {
        test: /\.js$/,
        exclude: '/node_modules/',
        use: /* [
          {
            loader: 'thread-loader',
            options: {
              workers: 2
            }
          },
          {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true, // 开启babel 缓存，未修改的 js 文件直接取缓存
              presets: ['@babel/preset-env', {
                modules: false,
                useBuiltIns: 'usage',
                corejs: 3,
                targets: {}
              }]
            }
          }
        ] */
          {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true, // 开启babel 缓存，未修改的 js 文件直接取缓存
              presets: [
                /* [
                  "@babel/preset-env", {
                    modules: false, // 对ES6的模块文件不做转化，以便使用 tree shaking
                    useBuiltIns: "usage", // 取值可以是 false，"entry"，"usage"
                    corejs: 3, // corejs 版本号
                    targets: {} // 需要兼容的浏览器，若未配置，取 browserslist 中的值
                  }
                ] */
              ]
            }
          }
      }
      /* {
        test: /\.html$/,
        use: 'html-loader'
      } */
      /* {
        test: /\.(png|jpe?g|gif|svg)$/,
        use: {
          loader: "file-loader",
          options: {
            name: "[name]-[contenthash:10].[ext]" // ext表示文件的后缀名
          }
        }
      }, */
    ]
  }
}