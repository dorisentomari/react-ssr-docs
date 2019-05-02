const path = require('path');
const merge = require('webpack-merge');
const WebpackNodeExternals = require('webpack-node-externals');
const baseConfig = require('./webpack.base');

module.exports = merge(baseConfig, {
  target: 'node',
  entry: './src/server/index.js',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'server.js'
  },
  externals: [WebpackNodeExternals()],
});