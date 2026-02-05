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
 * # Switch for 'ojet.list()'
 *
 * @public
 * @param {string} scope
 * @returns {Promise}
 */
module.exports = function (scope) {
  switch (scope) {
    case (CONSTANTS.API_SCOPES.COMPONENT):
      return component.list();
    case (CONSTANTS.API_SCOPES.PACK):
      return pack.list();
    default:
      util.log.error(`Please specify ojet.${CONSTANTS.API_TASKS.LIST}() 'scope' parameter.`);
      return false;
  }
};
