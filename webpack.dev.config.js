const path              = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

const NODE_ENV = process.env.NODE_ENV || 'development'

module.exports = {
  entry: {
    widget: ['./src/index.js']
  },
  output: {
    path: path.join(process.cwd(), 'build'),
    filename: '[name].js',
    chunkFilename: '[id].js',
    library: '[name]'
  },
  devtool: 'source-map',
  debug: true,
  module: {
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Widget Browser Render',
      filename: 'index.html',
      template: path.join(process.cwd(), 'index.html')
    }),
    new ExtractTextPlugin('[name].css', {
      publicPath: '/',
      allChunks: true,
      disable: true
    })
  ]
};
