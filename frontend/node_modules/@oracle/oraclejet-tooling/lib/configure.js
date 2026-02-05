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
 * # Switch for 'ojet.configure()'
 *
 * @public
 * @param {string} scope
 * @param {Object} parameters
 */
module.exports = function (scope, parameters) {
  switch (scope) {
    case (CONSTANTS.API_SCOPES.EXCHANGE): {
      const exchangeUrl = CONSTANTS.EXCHANGE_URL_PARAM;
      if (parameters && util.hasProperty(parameters, exchangeUrl)) {
        return exchange.configureUrl(parameters[exchangeUrl]);
      }
      util.log.error(`Please specify ojet.${CONSTANTS.API_TASKS.CONFIGURE}() '${exchangeUrl}' parameter.`);
      return false;
    }
    default:
      util.log.error(`Please specify ojet.${CONSTANTS.API_TASKS.CONFIGURE}() 'scope' parameter.`);
      return false;
  }
};
