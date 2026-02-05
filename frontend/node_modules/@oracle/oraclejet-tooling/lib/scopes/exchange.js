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
// Oracle
const CONSTANTS = require('../constants');
const exchangeUtils = require('../utils.exchange');
const util = require('../util');

/**
 * # Exchange
 *
 * @public
 */
const exchange = module.exports;

/**
 * ## configure
 *
 * @public
 * @param {string} url - exchange url
 */
exchange.configureUrl = function (url) {
  const configObj = util.getOraclejetConfigJson();
  configObj[CONSTANTS.EXCHANGE_URL_PARAM] = url;
  // Because a new url has been set, delete the 'cached' local components support flag.
  delete configObj[CONSTANTS.EXCHANGE_LOCAL_COMPONENTS_SUPPORT];
  try {
    util.writeFileSync(`./${CONSTANTS.ORACLE_JET_CONFIG_JSON}`, JSON.stringify(configObj, null, 2));
    util.log.success(`Exchange url set: ${url}`);
    return Promise.resolve();
  } catch (e) {
    util.log.error(`Exchange url could not be set. ${e}`, true);
    return Promise.reject();
  }
};

/**
 * ## search
 *
 * @public
 * @param {string} parameter
 * @param {Object} options
 * @returns {Promise}
 */
exchange.search = function (parameter, options) {
  return new Promise((resolve, reject) => {
    util.ensureParameters(parameter, CONSTANTS.API_TASKS.SEARCH);
    util.log(`Searching for '${parameter}' in the Exchange ...`);

    // The first level function stores user input for the session
    process.env.options = JSON.stringify(options);

    util.loginIfCredentialsProvided()
      .then(() => { // eslint-disable-line
        return util.request({
          path: `/components/?q=${parameter}*&format=compact&extraFields=tags&componentFields=displayName,description`,
        })
          .then((responseData) => {
            const response = responseData.response;
            const responseBody = responseData.responseBody;
            return exchangeUtils.validateAuthenticationOfRequest(
              response,
              () => { return this.search(parameter, options); }, // eslint-disable-line
              () => {
                util.checkForHttpErrors(response, responseBody);

                const components = JSON.parse(responseBody).items;
                if (components.length === 0) {
                  util.log.success('No components found.');
                } else {
                  _customisePrintOutput(options);
                  _printHead();
                  _printResults(components, parameter);
                }
              }
            );
          });
      })
      .then(() => {
        resolve();
      })
      .catch((error) => {
        reject();
        util.log.error(error, true);
      });
  });
};

// When modifying, make sure the search url includes required fields
const table = {
  fullName: 40,
  displayName: 40,
  tags: 40,
  description: 40
};

const space = ' ';

/**
 * ## _customisePrintOutput
 *
 * @private
 * @param {Object} options
 */

function _customisePrintOutput(options) {
  // Versions
  if (options.versions) {
    // Do not show tags and description
    delete table.tags;
    delete table.description;

    // Use this space to show all available versions
    table.versions = 80;
  }
}

/**
 * ## _printHead
 *
 * @private
 */
function _printHead() {
  let headLine = '';
  Object.keys(table).forEach((key) => {
    const colSpaces = table[key] - key.length;
    if (colSpaces < 0) {
      headLine += `<${key.substring(0, table[key] - 2)}>${space}`;
    } else {
      headLine += `<${key}>${space.repeat(colSpaces - 2)}${space}`;
    }
  });
  util.log(headLine);
}

/**
 * ## _printResults
 *
 * @private
 * @param {Array} components
 * @param {string} parameter
 */
function _printResults(components, parameter) {
  components.forEach((component) => {
    const comp = component;
    let line = '';

    Object.keys(table).forEach((key) => {
      // 'displayName' and 'description' are within metadata[component] scope
      if (['displayName', 'description'].indexOf(key) > -1) {
        comp.component = comp.component || {};
        comp[key] = comp.component[key] || '';
      }

      if (util.hasProperty(comp, key)) {
        // Custom handling for 'tags'
        if (key === 'tags') {
          comp[key] = _processTags(comp[key], parameter);
        }

        const colSpaces = table[key] - comp[key].length;

        if (colSpaces < 0) {
          line += comp[key].substring(0, table[key]) + space;
        } else {
          line += comp[key] + space.repeat(colSpaces) + space;
        }
      }
    });

    util.log(line);
  });
}

/**
 * ## _processTags
 *
 * @private
 * @param {Array} tags
 * @param {string} parameter
 */
function _processTags(tags, parameter) {
  const lowerCaseTags = tags.map(value => value.toLowerCase());

  function matchTag(tag) {
    return tag.match(parameter.toLowerCase());
  }

  const i = lowerCaseTags.findIndex(matchTag);

  return i > -1 ? tags[i] : tags[0] || '';
}
