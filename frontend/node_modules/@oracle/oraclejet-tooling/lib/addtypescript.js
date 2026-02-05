#! /usr/bin/env node
/**
  Copyright (c) 2015, 2025, Oracle and/or its affiliates.
  Licensed under The Universal Permissive License (UPL), Version 1.0
  as shown at https://oss.oracle.com/licenses/upl/

*/

'use strict';

/**
 * ## Dependencies
 */

const util = require('./util');
const fs = require('fs-extra');
const path = require('path');
const CONSTANTS = require('./constants');
const config = require('./config');

/**
 * ## Helpers
 */

/**
 * ## _installTypescript
 *
 * Install Typescript locally if environment does not
 * have a valid global version
 *
 * @private
 * @param {Object} options
 * @returns {Promise}
 */
function installTypescipt(options) {
  util.log('Installing Typescript');
  const installer = util.getInstallerCommand({ options });
  config.loadOraclejetConfig();
  const typescriptLibraries = config.data.typescriptLibraries;
  const { enableLegacyPeerDeps } = util.getOraclejetConfigJson();

  let command = `${installer.installer} ${installer.verbs.install} ${typescriptLibraries} ${installer.flags.save} ${installer.flags.exact}`;

  if (enableLegacyPeerDeps && installer.installer === 'npm') {
    command += ` ${installer.flags.legacy}`; // putting extra space to ensure the flag is properly appended
  }

  return util.exec(command);
}

/**
 * ## injectTypescriptConfig
 *
 * Inject preset tsconfig.json file into the application
 *
 * @private
 * @returns {Promise}
 */
function injectTypescriptConfig() {
  return util.injectFileIntoApplication({
    name: CONSTANTS.TSCONFIG,
    src: path.join(util.getToolingPath(), CONSTANTS.PATH_TO_TSCONFIG_TEMPLATE),
    dest: CONSTANTS.TSCONFIG
  });
}

/**
 * ## updateTypescriptConfig
 *
 * Update the injected tsconfig.json
 *
 * @public
 * @returns {Promise}
 */
function updateTypescriptConfig(options) {
  try {
    // Use oraclejetconfig.json for application paths since util.getConfiguredPaths might not
    // be setup yet
    const oraclejetJetConfigJson = util.readJsonAndReturnObject(CONSTANTS.ORACLE_JET_CONFIG_JSON);
    const tsConfigPath = util.getPathToTsConfig();
    const tsconfigJson = util.readJsonAndReturnObject(tsConfigPath);
    if (options && options.command === 'migrate') {
      let pathToTsconfigTemplate;
      const tsConfigTemplatePath = path.join(
        util.getToolingPath(), CONSTANTS.PATH_TO_TSCONFIG_TEMPLATE
      );
      const tsConfigTemplateCliPath = path.join(
        CONSTANTS.OJET_CLI_PATH,
        CONSTANTS.TOOLING_PATH,
        CONSTANTS.PATH_TO_TSCONFIG_TEMPLATE
      );

      if (fs.existsSync(tsConfigTemplatePath)) {
        pathToTsconfigTemplate = tsConfigTemplatePath;
      } else if (fs.existsSync(tsConfigTemplateCliPath)) {
        pathToTsconfigTemplate = tsConfigTemplateCliPath;
      }

      const tsConfigTemplateJson = util.readJsonAndReturnObject(pathToTsconfigTemplate);

      const merged = util.deepMerge(tsConfigTemplateJson, tsconfigJson);

      fs.writeJSONSync(tsConfigPath, merged, { spaces: 2 });
    } else {
      // set tsconfig "include" option to reference typescript folder based
      // on values in oraclejetconfig.json
      tsconfigJson.include = [
        util.pathJoin(
          '.',
          oraclejetJetConfigJson.paths.source.common,
          oraclejetJetConfigJson.paths.source.typescript,
          '**',
          '*'
        )
      ];
      fs.writeJSONSync(tsConfigPath, tsconfigJson, { spaces: 2 });
    }
    return Promise.resolve();
  } catch (error) {
    return Promise.reject(error);
  }
}

/**
 * ## addTypescript
 *
 * Add Typescript support to an application
 *
 * @public
 * @param {Object} options
 * @returns {Promise}
 */
module.exports = function (options) {
  if (options && options.template === 'webdriver-ts') {
    return installTypescipt(options)
      .catch(util.log.error);
  }

  if (options && options.command === 'migrate') {
    const currentTypescriptVersion = util.getNodeModuleVersion('typescript');

    if (currentTypescriptVersion === CONSTANTS.PACKAGE_VERSION.TYPESCRIPT) {
      // just update the tsconfig file, there is no need to re-install typescript
      return updateTypescriptConfig(options)
        .catch(util.log.error);
    }

    return installTypescipt(options)
      .then(updateTypescriptConfig)
      .catch(util.log.error);
  }

  return installTypescipt(options)
    .then(injectTypescriptConfig)
    .then(updateTypescriptConfig)
    .catch(util.log.error);
};
