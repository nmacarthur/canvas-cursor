const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin;
const CompressionPlugin = require('compression-webpack-plugin');
var path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  mode: process.env.NODE_ENV,
  module: {
    rules: [
      {
        test: /\.js$/,
        use: ['babel-loader'],
      }
    ],
  },
  output: {
    path: __dirname + '/dist',
    library: 'canvas-cursor',
    libraryTarget: 'umd',
    filename: 'canvas-cursor.js',
  },
  plugins: [
    new CleanWebpackPlugin(),
    new CompressionPlugin(),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'src/index.html',
    }),
  ],
  devServer: {
    contentBase: path.join(__dirname, 'src'),
    compress: true,
    port: 3001,
    host: '0.0.0.0',
  },
};
