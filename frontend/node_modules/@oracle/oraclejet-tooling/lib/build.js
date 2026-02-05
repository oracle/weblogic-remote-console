/**
  Copyright (c) 2015, 2025, Oracle and/or its affiliates.
  Licensed under The Universal Permissive License (UPL), Version 1.0
  as shown at https://oss.oracle.com/licenses/upl/

*/
'use strict';

const buildWeb = require('./buildWeb');
const buildComponent = require('./buildComponent');
const buildWebpack = require('./webpack/build');
const valid = require('./validations');
const config = require('./config');
const util = require('./util');
const constants = require('./constants');

/**
* # API
* ## ojet.build([platform],[options])
* @public
* @param {string} [platform='web']           - Platform, defaults to 'web'
* @param {Object} [options]                  - Options object
* @param {string} [options.buildType]        - buildType 'dev' or 'release'
* @param {string} [options.theme]            - Theme, default to alta:platform
* @param {Array} [options.themes]            - Themes, default to first theme in the array
* @param {boolean} [options.sassCompile]     - Whether to compile sass
* @param {string} [options.buildConfig]      - Path to build configuration file
* @param {boolean} [options.buildForServe]   - Whether to invoke build just for Serve
* @param {string} [options.setDefaultConfig] - String path to default json file
* @param {string} [options.staingPath]       - Path to the staging directory
* @param {object} [options.inject]           - Object for inject task configuration
* @param {object} [options.terser]           - Object for terser task configuration
* @param {object} [options.copyToRelase]     - Object for copyToRelease task configuration
* @param {object} [options.requireJs]        - Object for requireJs task configuration
* @param {object} [options.sass]             - Object for sass task configuration
* @returns {Promise}
*/
module.exports = function build(platform, options) {
  if (util.buildWithWebpack()) {
    return buildWebpack(options);
  }
  if (options.buildType === 'release' && util.bundleWithWebpack()) {
    // when building in release mode with webpack as the bundler,
    // we need to run a debug build so that webpack can bundle and optimize
    // debug files (and not minified files)
    // eslint-disable-next-line no-param-reassign
    options.buildType = 'debug';
    // eslint-disable-next-line no-param-reassign
    options.release = false;
    // eslint-disable-next-line no-param-reassign
    options.bundler = 'webpack';
  }

  const isComponentBuild = util.hasProperty(options, 'component');
  config.loadOraclejetConfig(constants.SUPPORTED_WEB_PLATFORM);
  const validPlatform = constants.SUPPORTED_WEB_PLATFORM;
  const validOptions = valid.buildOptions(options, validPlatform);
  const validBuildType = valid.buildType(validOptions);
  if (isComponentBuild) {
    valid.component(options);
    config.set('platform', constants.SUPPORTED_WEB_PLATFORM);
    return buildComponent(options.component, validOptions);
  }
  config.set('platform', validPlatform);
  return buildWeb(validBuildType, validOptions);
};
