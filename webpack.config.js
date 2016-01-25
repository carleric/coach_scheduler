var webpack = require('webpack');

module.exports = {
  entry: [
    'webpack-dev-server/client?http://localhost:8080',
    'webpack/hot/only-dev-server',
    './src/index.jsx'
  ],
  module: {
    loaders: [
    {
      test: /\.jsx?$/,
      exclude: /node_modules/,
      loader: 'babel'
    },
    { 
      test: /\.css$/, 
      loader: "style-loader!css-loader" 
    },
    { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: "file" },
    { test: /\.(woff|woff2)$/, loader:"url?prefix=font/&limit=5000" },
    { test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&mimetype=application/octet-stream" },
    { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&mimetype=image/svg+xml" }
    ]
  },
  resolve: {
    extensions: ['', '.js', '.jsx', 'css'],
    modulesDirectories: ['node_modules', 'src']
  },
  output: {
    path: __dirname + '/dist',
    publicPath: '/',
    filename: 'bundle.js'
  },
  devServer: {
    contentBase: './dist'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    // new webpack.ProvidePlugin({
    //         $: "jquery",
    //         jQuery: "jquery"
    //     }),
    // new webpack.ProvidePlugin({
    //         FC: "fullCalendar",
    //         fullCalendar: "fullCalendar"
    //     }),
  ]
};