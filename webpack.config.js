var path = require('path');
var webpack = require('webpack');

module.exports = {
  context: path.join(__dirname, 'static'),
  entry: './app/app.ts',
  output: {
    path: path.join(__dirname, '/dist'),
    publicPath: 'dist/',
    filename: 'app.js',
  },
  module: {
    loaders: [
      {
        test: /\.ts$/,
        loader: 'babel-loader!ts-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(css|less)$/,
        loader: 'style-loader!css-loader',
      },
      { test: /\.less$/, loader: 'less-loader' },
      { test: /\.(woff|eot|ttf|woff2)$/, loader: "file-loader" },
      { test: /\.(png|gif|ico|svg)$/, loader: "url-loader" },
      { test: /\.(html)$/, loader: "html-loader" }
    ],
  },
  resolve: {
    extensions: ['', '.ts', '.js'],
    fallback: path.join(__dirname, 'node_modules'),
    alias: {
      'material-design-icons.css': 'material-design-icons-iconfont/dist/material-design-icons.css',
      'materialize.css': 'materialize-css/dist/css/materialize.css',
      'materialize.js': 'materialize-css/dist/js/materialize.js',
      'materialize-tabs.js': 'materialize-css/js/tabs.js',
    }
  },
  resolveLoader: {
    fallback: path.join(__dirname, 'node_modules')
  },
  devtool: "#source-map",
  plugins: [
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery",
      "window.jQuery": "jquery",
      "root.jQuery": "jquery"
    })
  ],
  devServer: {
    proxy: {
      "/api/*": "http://localhost:8081"
    },
  }
};

