var path = require('path')
var webpack = require('webpack')
var ExtractTextPlugin = require("extract-text-webpack-plugin")

module.exports = {
  entry: './src/main.js',
  output: {
    path: path.resolve(__dirname, './dist'),
    publicPath: '/dist/',
    filename: 'build.js'
  },
  plugins:[
    new webpack.ProvidePlugin({   
        jQuery: 'jquery',
        $: 'jquery',
        jquery: 'jquery'
    }),
    new ExtractTextPlugin("style.css")
  ],
  module: {
    rules: [
      { test: /\.vue$/, loader: 'vue-loader', options: { loaders: { css: ExtractTextPlugin.extract({ loader: 'css-loader', fallbackLoader: 'vue-style-loader'})}} },
      { test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/ },
      { test: /\.(png|jpg|gif|svg)$/, loader: 'file', options: {name: '[name].[ext]?[hash]'} }
    ]
  },
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue'
    }
  },
  devServer: {
    inline: true,
    historyApiFallback: true,
    noInfo: true,
    port: 80,
    host: 'www.sharinfo.io',
    watchOptions: {
      aggregateTimeout: 300,
      poll: 1000
    }
  },
  devtool: '#eval-source-map'
}

if (process.env.NODE_ENV === 'production') {
  module.exports.devtool = '#source-map'
  // http://vue-loader.vuejs.org/en/workflow/production.html
  module.exports.plugins = (module.exports.plugins || []).concat([
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    })
  ])
}
