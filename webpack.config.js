const path                   = require('path')
const webpack                = require('webpack')
const postcssUse             = require('postcss-use')
const postcssImport          = require('postcss-import')
const postcssSimpleVars      = require('postcss-simple-vars')
const postcssUrl             = require('postcss-url')
const postcssAutoreset       = require('postcss-autoreset')
const postcssNested          = require('postcss-nested')
const postcssFontMagician    = require('postcss-font-magician')
const postcssColorFunction   = require('postcss-color-function')
const autoprefixer           = require('autoprefixer')
const postcssReporter        = require('postcss-reporter')
const postcssBrowserReporter = require('postcss-browser-reporter')
const HtmlWebpackPlugin      = require('html-webpack-plugin')
const ExtractTextPlugin      = require('extract-text-webpack-plugin')

const NODE_ENV = process.env.NODE_ENV || 'development'

var configuration = {
  entry: {
    widget: ['./src/index.js'],
    vendor: ["react", "react-dom", "react-css-modules", "highcharts"],
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
    preLoaders: [
      {
        test: /\.jsx$|\.js$/,
        loader: 'eslint-loader',
        include: process.cwd() + '/src'
      }
    ],
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel'
      },
      {
        test: /\.css$/,
        include: [
          path.resolve(process.cwd(), 'src'),
        ],
        loader: ExtractTextPlugin.extract('style-loader', 'css-loader?modules&localIdentName=[local]__[hash:base64:5]!postcss-loader')
      }
    ]
  },
  postcss: () => {
    return [
      postcssUse({modules: ['postcss-short']}),
      postcssImport,
      postcssSimpleVars,
      postcssUrl,
      postcssNested,
      postcssFontMagician,
      postcssColorFunction,
      autoprefixer,
      postcssReporter,
      postcssBrowserReporter,
      postcssAutoreset({
        reset: 'initial'
      })
    ]
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
      disable: false
    }),
    new webpack.optimize.CommonsChunkPlugin("vendor", "vendor.bundle.js")
  ]
};

if (NODE_ENV === 'production') {
  const plugins = [
    new webpack.optimize.UglifyJsPlugin({
        compress: {warnings: false}
    }),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    })
  ]

  // configuration.plugins.push(...plugins) // with Node 5.11 or above
  configuration.plugins = configuration.plugins.concat(plugins)
}

module.exports = configuration
