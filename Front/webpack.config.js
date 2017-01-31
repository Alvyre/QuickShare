'use strict';

var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require("extract-text-webpack-plugin");

// Common Configuration

var config = {
  plugins:[
    new webpack.ProvidePlugin({  
      jQuery: 'jquery',
      $: 'jquery',
      jquery: 'jquery'
    }),
    new ExtractTextPlugin("style.css"),
    new webpack.optimize.CommonsChunkPlugin({ name: 'vendor', filename: "vendor.bundle.js" })
  ],
  module: {
    rules: [
      { test: /\.css$/, loader: ExtractTextPlugin.extract({fallbackLoader: "style-loader", loader: "css-loader"}) },
      { test: /\.vue$/, loader: 'vue-loader', options: { loaders: { css: ExtractTextPlugin.extract({ loader: 'css-loader', fallbackLoader: 'vue-style-loader'})}} },
      { test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/ },
      { test: /\.(png|jpg|gif|svg)$/, loader: 'file-loader', options: {name: '[name].[ext]?[hash]'} },
      { test: /\.(eot|svg|ttf|woff|woff2)$/, loader: 'file-loader?name=public/fonts/[name].[ext]' }
    ]
  },
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.common.js'
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
};

if (process.env.NODE_ENV === 'production') {
  config.devtool = '#source-map';
  // http://vue-loader.vuejs.org/en/workflow/production.html
  config.plugins = (config.plugins || []).concat([
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
  ]);
}


// Build Configuration

var mainConfig = Object.assign({}, config, {
  name: 'main',
  entry: { 
    main: "./src/main.js",
    vendor: ['jquery', 'moment', 'bootstrap']
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    publicPath: '/dist/',
    filename: 'build.js'
  }
});

module.exports = [mainConfig];