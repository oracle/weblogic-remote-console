/**
  Copyright (c) 2015, 2025, Oracle and/or its affiliates.
  Licensed under The Universal Permissive License (UPL), Version 1.0
  as shown at https://oss.oracle.com/licenses/upl/

*/
'use strict';

const buildCommon = require('./buildCommon');
const hookRunner = require('./hookRunner');
const config = require('./config');
const constants = require('constants');
const generateComponentsCache = require('./buildCommon/generateComponentsCache');

function _runReleaseBuildTasks(context) {
  return new Promise((resolve, reject) => {
    const opts = context.opts;
    if (opts.bundler === 'webpack') {
      hookRunner('before_release_build', context)
        .then(buildCommon.webpack)
        .then(buildCommon.cleanTemp)
        .then(buildCommon.cleanTypescript)
        .then(data => resolve(data))
        .catch(err => reject(err));
    } else if (opts.buildType === 'release') {
      hookRunner('before_release_build', context)
        .then(buildCommon.stripLocalCcaComponentJson)
        .then(buildCommon.minifyLocalCca)
        .then(buildCommon.restoreLocalCcaComponentJson)
        .then(buildCommon.minifyLocalVComponents)
        .then(buildCommon.terser)
        .then(buildCommon.requireJs)
        .then(buildCommon.cleanTemp)
        .then(buildCommon.cleanTypescript)
        .then(data => resolve(data))
        .catch(err => reject(err));
    } else {
      resolve(context);
    }
  });
}

function _runCommonBuildTasks(context) {
  return buildCommon.clean(context)
    .then(data => hookRunner('before_build', data))
    .then(buildCommon.buildICUTranslationsBundle)
    .then(buildCommon.copy)
    .then(buildCommon.copyLibs)
    .then(buildCommon.copyReferenceCca)
    .then(buildCommon.copyLocalCca)
    .then(buildCommon.copyLocalVComponents)
    .then(buildCommon.copyLocalResourceComponents)
    .then(buildCommon.spriteSvg)
    .then(data => hookRunner('before_injection', data))
    .then(buildCommon.injectTs)
    .then(buildCommon.compileApplicationTypescript)
    .then(buildCommon.css)
    .then(buildCommon.injectTheme)
    .then(buildCommon.injectFont)
    .then(buildCommon.copyThemes)
    .then(buildCommon.injectScripts)
    .then(buildCommon.injectPaths)
    .then(data => Promise.resolve(data))
    .catch(err => Promise.reject(err));
}

module.exports = function buildWeb(buildType, opts) {
  const context = { buildType, opts, platform: constants.SUPPORTED_WEB_PLATFORM };
  config.set('componentsCache', generateComponentsCache({ context }));
  return _runCommonBuildTasks(context)
    .then(_runReleaseBuildTasks)
    .then(buildCommon.runAllComponentHooks)
    .then(data => hookRunner('after_build', data))
    .then(data => Promise.resolve(data))
    .catch(err => Promise.reject(err));
};
