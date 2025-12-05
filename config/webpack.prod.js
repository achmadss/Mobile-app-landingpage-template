/* eslint-disable import/no-extraneous-dependencies */
const { merge: Merge } = require('webpack-merge');
const CommonConfig = require('./webpack.common.js');
const path = require('path');
const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const ImageminPlugin = require('imagemin-webpack-plugin').default;
const TerserPlugin = require("terser-webpack-plugin");
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
    filename: '[name]-[hash].bundle.js',
    path: path.resolve('assets'),
    publicPath: `${baseurl}/assets/`,
  },
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin({
      terserOptions: {
        keep_fnames: true
      }
    })]
  },
  plugins: [
    new CleanWebpackPlugin({ cleanOnceBeforeBuildPatterns: ['assets'], verbose: true }),
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false,
    }),
    new ImageminPlugin({ test: /\.(jpe?g|png|gif|svg)$/i }),
  ],
});
