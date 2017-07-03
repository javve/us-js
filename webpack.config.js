var webpack = require('webpack');

const path = require('path');

module.exports = {
  entry: {
    us: './src/index.js',
    'us.min': './src/index.js'
  },
  output: {
    path: __dirname + '/dist',
    filename: '[name].js',
    library: 'us'
  },
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'eslint-loader',
        options: {
          fix: true,
        }
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      }
    ]
  },
  devServer: {
    inline: true
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      include: /\.min\.js$/,
      minimize: true
    })
  ]
};
