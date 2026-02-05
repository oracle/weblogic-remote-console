/**
  Copyright (c) 2015, 2025, Oracle and/or its affiliates.
  Licensed under The Universal Permissive License (UPL), Version 1.0
  as shown at https://oss.oracle.com/licenses/upl/

*/
const path = require('path');
const ojetUtils = require('../../util');
const webpackUtils = require('../utils');

// eslint-disable-next-line import/no-dynamic-require
const decoratorTransformer = require(path.join(webpackUtils.oracleJetDistPath, 'custom-tsc/decoratorTransformer'));
// eslint-disable-next-line import/no-dynamic-require
const metadataTransformer = require(path.join(webpackUtils.oracleJetDistPath, 'custom-tsc/metadataTransformer'));
const constants = require('../../constants');

const configPaths = ojetUtils.getConfiguredPaths();

const buildOptions = {
  version: '',
  jetVersion: '',
  debug: false,
  dtDir: path.join(configPaths.staging.web, configPaths.src.typescript, constants.COMPONENTS_DT),
  templatePath: path.join(ojetUtils.getOraclejetPath(), constants.PATH_TO_CUSTOM_TSC_TEMPLATES),
  tsBuiltDr: path.join(configPaths.staging.web, configPaths.src.javascript, configPaths.components),
  ...(ojetUtils.needsMainEntryFile() && { mainEntryFile: 'loader.d.ts' }),
  typesDir: path.join(configPaths.staging.web, configPaths.src.javascript, configPaths.components)
};

function createTransformer(baseTransformer) {
  return program => (baseTransformer.default(program, buildOptions));
}

module.exports = {
  metadataTransformer: createTransformer(metadataTransformer),
  decoratorTransformer: createTransformer(decoratorTransformer)
};
