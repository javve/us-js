var webpack = require('webpack');

module.exports = {
  entry: {
    us: './src/index.js',
    "us.min": './src/index.js'
  },
  output: {
    path: __dirname + '/dist',
    filename: "[name].js",
    library: 'us'
  },
  module: {
    loaders: [
      { test: /\.scss$/, loaders: ["style", "css", "sass"] },
      { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" }
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
