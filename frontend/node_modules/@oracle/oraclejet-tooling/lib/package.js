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
const component = require('./scopes/component');
const CONSTANTS = require('./constants');
const pack = require('./scopes/pack');
const util = require('./util');

/**
 * # Switch for 'ojet.package()'
 *
 * @public
 * @param {string} scope
 * @param {Array} parameters
 * @param {Object} options
 * @returns {Promise}
 */
class Package {
  package(scope, parameters, options) { // eslint-disable-line
    switch (scope) {
      case (CONSTANTS.API_SCOPES.COMPONENT):
        return component.package(parameters, options);
      case (CONSTANTS.API_SCOPES.PACK):
        return pack.package(parameters, options);
      default:
        util.log.error(`Please specify ojet.${CONSTANTS.API_TASKS.PACKAGE}() 'scope' parameter.`);
        return Promise.reject();
    }
  }
}

module.exports = Package;
