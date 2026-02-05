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
const CONSTANTS = require('./constants');
const util = require('./util');
const component = require('./scopes/component');

/**
 * # Adds label to given component in exchange'
 *
 * @public
 * @param {string} scope
 * @returns {Promise}
 */
module.exports = function (scope, parameter, option) {
  switch (scope) {
    case (CONSTANTS.API_SCOPES.COMPONENT):
    case (CONSTANTS.API_SCOPES.PACK):
      return component.label(parameter, option);
    default:
      util.log.error(`Please specify ojet.${CONSTANTS.API_TASKS.LIST}() 'scope' parameter.`);
      return false;
  }
};
