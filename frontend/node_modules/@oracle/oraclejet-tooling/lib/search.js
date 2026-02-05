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
const exchange = require('./scopes/exchange');
const CONSTANTS = require('./constants');
const util = require('./util');

/**
 * # Switch for 'ojet.search()'
 *
 * @public
 * @param {string} scope
 * @param {string} parameter
 * @param {Object} options
 * @returns {Promise}
 */
module.exports = function (scope, parameter, options) {
  switch (scope) {
    case (CONSTANTS.API_SCOPES.EXCHANGE):
      return exchange.search(parameter, options);
    default:
      util.log.error(`Please specify ojet.${CONSTANTS.API_TASKS.SEARCH}() 'scope' parameter.`);
      return false;
  }
};
