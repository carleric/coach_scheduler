var path = require('path');
var webpack = require('webpack');

module.exports = {
  devtool: 'source-map',
  entry: [
    './client/src/index.jsx'
  ],
  output: {
    path: path.join(__dirname, './client/public'),
    filename: 'bundle.js',
    publicPath: '/'
  },
  resolve: {
    extensions: ['', '.js', '.jsx', 'css', '.node'],
    modulesDirectories: ['node_modules', './client/src']
  },
  module: {
    loaders: [{
      test: /\js|\.jsx?/,
      loaders: ['babel'],
      include: path.join(__dirname, './client/src'),
      exclude: /node_modules/,
    },
    { 
      test: /\.css$/, 
      loader: "style-loader!css-loader" 
    }
    ]
  }
};
