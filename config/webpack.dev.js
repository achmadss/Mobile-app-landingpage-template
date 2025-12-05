/* eslint-disable import/no-extraneous-dependencies */
const { merge: Merge } = require('webpack-merge');
const CommonConfig = require('./webpack.common.js');
const path = require('path');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const webpack = require('webpack');
const fs = require('fs');

// Read baseurl from _config.yml
let baseurl = '';
try {
  const configContent = fs.readFileSync(path.resolve(__dirname, '../_config.yml'), 'utf8');
  const baseurlMatch = configContent.match(/baseurl:\s*["']?([^"'\s]+)["']?/);
  if (baseurlMatch) {
    baseurl = baseurlMatch[1];
  }
} catch (e) {
  console.warn('Could not read baseurl from _config.yml, using default');
}

module.exports = Merge(CommonConfig, {
  output: {
    filename: '[name].bundle.js',
    path: path.resolve('assets'),
    publicPath: `${baseurl}/assets/`,
  },
  devtool: 'inline-source-map',
  plugins: [
    new BrowserSyncPlugin(
      {
        host: 'localhost',
        port: 3000,
        proxy: 'http://localhost:8080',
        files: ['_site', '_src'],
      },
      {
        reload: false,
      },
    ),
    new webpack.HotModuleReplacementPlugin(),
  ],
  module: {},
  devServer: {
    static: {
      directory: path.resolve('_site'),
    },
    hot: true,
    client: {
      overlay: {
        errors: true,
        warnings: false,
      },
    },
  },
});
