/**
  Copyright (c) 2015, 2025, Oracle and/or its affiliates.
  Licensed under The Universal Permissive License (UPL), Version 1.0
  as shown at https://oss.oracle.com/licenses/upl/

*/
'use strict';

const fs = require('fs-extra');
const CONSTANTS = require('./constants');
const path = require('path');

const config = function (prop, value) {
  if (arguments.length === 2) {
    return config.set(prop, value);
  }
  return config.get(prop);
};
module.exports = config;

config.data = {};

/**
 * Get the config value
 * @param  {String} prop property to get
 * @returns {String} return
 */
config.get = function (prop) {
  if (prop) {
    return config.data[prop];
  }
  return config.data;
};

/**
 * Set the config value
 * @param  {String} prop property to set
 * @param  {*} value value to set
 * @returns {String} return
 */
config.set = function (prop, value) {
  config.data[prop] = value;
  return config.data[prop];
};

config.loadOraclejetConfig = () => {
  config.data.paths = config.getConfiguredPaths();
};

config.getConfiguredPaths = () => {
  const configJson = _readConfigJson();
  const src = {};
  const staging = {};

  const srcConfig = configJson.paths ? configJson.paths.source : {};
  const stagingConfig = configJson.paths ? configJson.paths.staging : {};

  src.common = srcConfig.common ? path.normalize(srcConfig.common) : CONSTANTS.APP_SRC_DIRECTORY;
  src.javascript = srcConfig.javascript ? path.normalize(srcConfig.javascript) : 'js';
  src.typescript = srcConfig.typescript ? path.normalize(srcConfig.typescript) : 'ts';
  src.styles = srcConfig.styles ? path.normalize(srcConfig.styles) : 'css';
  src.themes = srcConfig.themes ? path.normalize(srcConfig.themes) : 'themes';
  src.web = srcConfig.web ? path.normalize(srcConfig.web) : CONSTANTS.APP_SRC_WEB_DIRECTORY;

  staging.web = stagingConfig.web ? path.normalize(stagingConfig.web) : CONSTANTS.WEB_DIRECTORY;
  staging.themes = stagingConfig.themes ? path.normalize(stagingConfig.themes) :
    CONSTANTS.APP_STAGED_THEMES_DIRECTORY;

  staging.stagingPath = staging.web;
  src.platformSpecific = src.web;

  const components = srcConfig.components ?
    path.normalize(srcConfig.components) : CONSTANTS.JET_COMPOSITE_DIRECTORY;
  const exchangeComponents = srcConfig.exchangeComponents ?
    path.normalize(srcConfig.exchangeComponents) : CONSTANTS.JET_COMPONENTS_DIRECTORY;

  return {
    src,
    staging,
    components,
    exchangeComponents
  };
};

function _readConfigJson() {
  const configPath = path.join(process.cwd(), CONSTANTS.ORACLE_JET_CONFIG_JSON);
  const configJson = fs.existsSync(configPath) ? fs.readJsonSync(configPath) : {};
  config.set('defaultBrowser', configJson.defaultBrowser || CONSTANTS.DEFAULT_BROWSER);
  config.set('sassVer', configJson.sassVer || CONSTANTS.PACKAGE_VERSION.SASS);
  config.set('fontUrl', configJson.fontUrl || CONSTANTS.FONT_URL);
  config.set('typescriptLibraries', configJson.typescriptLibraries || CONSTANTS.TYPESCRIPT_LIBARIES);
  config.set('defaultTheme', configJson.defaultTheme || CONSTANTS.DEFAULT_THEME);
  config.set('installer', configJson.installer || CONSTANTS.DEFAULT_INSTALLER);
  config.set('webpackLibraries', configJson.webpackLibraries || CONSTANTS.WEBPACK_LIBRARIES);
  config.set('jsdocLibraries', configJson.jsdocLibraries || CONSTANTS.JSDOC_LIBRARIES);
  config.set('translationIcuLibraries', configJson.translationIcuLibraries || CONSTANTS.TRANSLATION_ICU_LIBRARIES);
  config.set('jestTestingLibraries', configJson.jestTestingLibraries);
  // We need to add typescript libraries because karma-typescript has
  // a dependency on typescript. And since we do not add typescript
  // when creating a JS app, then we will need to do so when add the
  // testing libraries.
  config.set('mochaTestingLibraries', `${configJson.mochaTestingLibraries} ${configJson.typescriptLibraries}`);

  return configJson;
}
