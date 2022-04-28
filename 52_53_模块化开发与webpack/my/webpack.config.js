const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  devtool: 'cheap-module-source-map',
  // entry: './src',
  entry: './src/react.js',
  output: {
    path: path.resolve(__dirname, 'output'),
    filename: 'main.js',
    // publicPath: '/'  // 导入静态资源时的路径前缀，使用相对路径的时候可以不配置
  },
  devServer: {
    port: 8000,
    hot: true
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: {
          loader: 'babel-loader',
          /* options: {
            presets: [
              '@babel/preset-env', '@babel/preset-react'
            ],
            plugins: [
              ['@babel/plugin-proposal-decorators', { 'legacy': true }]
            ]
          } */
        }
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader, 'css-loader'
        ]
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css'
    }),
    new HtmlWebpackPlugin({
      template: './template.html'
    })
  ],
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          filename: 'vendor.js',
          chunks: 'all',
          test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/
        }
      }
    }
  }
}