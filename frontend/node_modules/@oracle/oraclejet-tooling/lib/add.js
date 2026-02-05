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
 * # Switch for 'ojet.add()'
 *
 * @public
 * @param {string} scope
 * @param {Array} parameters
 * @param {Object} options

 * @returns {Promise}
 */
module.exports = function (scope, parameters, options) {
  switch (scope) {
    case (CONSTANTS.API_SCOPES.COMPONENT):
      return component.add(parameters, options);
    case (CONSTANTS.API_SCOPES.PACK):
      return pack.add(parameters, options);
    default:
      util.log.error(`Please specify ojet.${CONSTANTS.API_TASKS.ADD}() 'scope' parameter.`);
      return false;
  }
};
