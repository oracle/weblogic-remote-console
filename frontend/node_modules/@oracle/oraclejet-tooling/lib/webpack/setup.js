/**
  Copyright (c) 2015, 2025, Oracle and/or its affiliates.
  Licensed under The Universal Permissive License (UPL), Version 1.0
  as shown at https://oss.oracle.com/licenses/upl/

*/
const path = require('path');
const ojetUtils = require('../util');
const webpackUtils = require('./utils');
const config = require('../config');
const generateComponentsCache = require('../buildCommon/generateComponentsCache');
const constants = require('../constants');
const fs = require('fs-extra');

const buildICUTranslationBundlePlugin = require('./plugins/buildICUTranslationsBundle');

module.exports = (context) => {
  config.set('componentsCache', generateComponentsCache({
    context
  }));
  config.set('_context', context);
  let webpackConfig;
  if (context.buildType === 'release') {
    // eslint-disable-next-line global-require
    webpackConfig = require('./webpack.production');
  } else {
    // eslint-disable-next-line global-require
    webpackConfig = require('./webpack.development');

    // Add the plugin to build the ICU translations if enabled
    // in the oraclejetconfig.json file:
    if (ojetUtils.buildICUTranslationsBundle()) {
      webpackConfig.plugins.push(
        buildICUTranslationBundlePlugin(context)
      );
    }
  }

  // Process theme files and copy them to staging:
  webpackUtils.copyRequiredAltaFilesToStaging(context);

  const pathToOjetConfig = path.resolve(constants.PATH_TO_OJET_CONFIG);

  // eslint-disable-next-line global-require, import/no-dynamic-require
  const ojetConfig = require(pathToOjetConfig);

  // This will have the new context and webpack config objects if any
  // changes will be made in the ojet.config.js file
  let newConfig;

  if (ojetConfig.webpack) {
    newConfig = ojetConfig.webpack({
      context,
      config: webpackConfig
    }) || webpackConfig;
  }

  // In cases where publicPath is declared, then the the html webpack plugin
  // will automatically inject the compiled styles; hence, there is no need
  // for style link tags:
  const outputConfig = newConfig.webpack.output;
  if (outputConfig && outputConfig.publicPath) {
    let fileContent = fs.readFileSync(webpackUtils.indexHtmlSrcPath, 'utf8');
    fileContent = fileContent.replace(/<\s*link\s*rel\s*=\s*["']\s*stylesheet\s*["']\s*>/, '')
      .replace(/<!--\s*Link-tag\s+flag\s+that\s+webpack\s+replaces\s+with\s+theme\s+style\s+links\s+during\s+build\s+time\s*-->/, '');

    fs.writeFileSync(webpackUtils.indexHtmlSrcPath, fileContent);
  }

  return {
    webpack: ojetUtils.requireLocalFirst('webpack'),
    webpackConfig: newConfig.webpack,
    context: newConfig.context
  };
};
