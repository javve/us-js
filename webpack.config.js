module.exports = {
  entry: {
    us: './src/index.js'
  },
  output: {
    path: __dirname + '/build',
    filename: "[name].js",
    library: 'us'
  },
  module: {
    loaders: [
      { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" }
    ]
  },
  devServer: {
    inline: true
  },
};
