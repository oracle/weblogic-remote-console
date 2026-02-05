/**
  Copyright (c) 2015, 2025, Oracle and/or its affiliates.
  Licensed under The Universal Permissive License (UPL), Version 1.0
  as shown at https://oss.oracle.com/licenses/upl/

*/
const ojetUtils = require('../util');
const common = require('./webpack.common.js');

const PreactRefreshPlugin = ojetUtils.requireLocalFirst('@prefresh/webpack');
const {
  merge
} = ojetUtils.requireLocalFirst('webpack-merge');
const configPaths = ojetUtils.getConfiguredPaths();
const MiniCssExtractPlugin = ojetUtils.requireLocalFirst('mini-css-extract-plugin');

module.exports = merge(common, {
  mode: 'development',
  output: {
    filename: 'js/[name].bundle.js',
    clean: true
  },
  devServer: {
    static: {
      directory: configPaths.staging.web
    },
    client: {
      overlay: {
        errors: true,
        warnings: false,
      },
    },
    compress: true,
    port: 8000,
    open: true,
    hot: true
  },
  plugins: [
    new PreactRefreshPlugin(),
    new MiniCssExtractPlugin({
      filename: `${configPaths.src.styles}/[name].css`
    }),
  ],
});
