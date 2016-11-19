module.exports = {
  entry: {
    main: './src/index.js'
  },
  output: {
    path: __dirname + '/build',
    filename: "[name].js",
    library: 'Switcher'
  },
  module: {
    loaders: [
      { test: /\.scss$/, loaders: ["style", "css", "sass"] },
      { test: './src/index', },
      { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" }
    ]
  },
  devServer: {
    inline: true
  },
};
