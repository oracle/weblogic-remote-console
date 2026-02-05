/**
  Copyright (c) 2015, 2025, Oracle and/or its affiliates.
  Licensed under The Universal Permissive License (UPL), Version 1.0
  as shown at https://oss.oracle.com/licenses/upl/

*/
const constants = require('../constants');
const buildCommon = require('../buildCommon');

module.exports = (options) => {
  // eslint-disable-next-line global-require
  const ojetUtils = require('../util');
  // eslint-disable-next-line global-require
  const setup = require('./setup');
  // eslint-disable-next-line global-require
  const hookRunner = require('../hookRunner');
  // eslint-disable-next-line global-require
  const webpackUtils = require('./utils');
  return new Promise((resolve, reject) => {
    ojetUtils.log('Building with Webpack');
    const buildContext = webpackUtils.createContext({ options,
      platform: constants.SUPPORTED_WEB_PLATFORM });

    hookRunner('before_build', buildContext);

    const { context, webpack, webpackConfig } = setup(buildContext);

    buildCommon.buildICUTranslationsBundle(context)
      .then(webpack(webpackConfig, (err, stats) => {
        if (err) {
          console.error(err.stack || err);
          if (err.details) {
            console.error(err.details);
          }
          reject(err.details);
        }
        if (stats.compilation.errors && stats.compilation.errors.length > 0) {
          console.error(stats.compilation.errors);
          reject(stats.compilation.errors);
        }
        console.log(stats.toString());
        hookRunner('after_build', context);
        resolve(context);
      })).catch((error) => {
        ojetUtils.log.error(error);
        reject(error);
      });
  }).then(() => {
    if (ojetUtils.isTypescriptApplication()) {
      webpackUtils.organizeTypeDefinitions();
    }
  });
};
