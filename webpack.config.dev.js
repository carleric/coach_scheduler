var path = require('path');
var webpack = require('webpack');

module.exports = {
  devtool: 'cheap-module-eval-source-map',
  entry: [
    'eventsource-polyfill', // necessary for hot reloading with IE
    'webpack-hot-middleware/client',
    './src/index'
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ],
  resolve: {
    extensions: ['', '.js', '.jsx', 'css'],
    modulesDirectories: ['node_modules', 'src']
  },
  module: {
    loaders: [{
      test: /\js|\.jsx?/,
      loaders: ['babel'],
      include: path.join(__dirname, 'src'),
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
