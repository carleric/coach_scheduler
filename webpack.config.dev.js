var path = require('path');
var webpack = require('webpack');

module.exports = {
  devtool: 'cheap-module-eval-source-map',
  entry: [
    'eventsource-polyfill', // necessary for hot reloading with IE
    'webpack-hot-middleware/client',
    './client/src/index.jsx'
  ],
  output: {
    path: path.join(__dirname, './client/dist'),
    filename: 'bundle.js',
    publicPath: '/'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ],
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
      test: /\.less$/,
      loader: "style!css!less"
    },
    { 
      test: /\.css$/, 
      loader: "style-loader!css-loader" 
    }
    ]
  }
};
