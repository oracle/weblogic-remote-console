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
const config = require('./config');

/**
 * # 'addSass'
 *
 * @public
 * @param {Object} options
 * @returns {Promise}
 */
module.exports = function (options) {
  config.loadOraclejetConfig();
  const sassVer = config.data.sassVer;
  const installer = util.getInstallerCommand({ options });
  const { enableLegacyPeerDeps } = util.getOraclejetConfigJson();

  const installFlags = [installer.flags.save];

  if (enableLegacyPeerDeps && installer.installer === 'npm') {
    installFlags.push(installer.flags.legacy);
  }

  util.log('Installing sass');
  return util.spawn(
    installer.installer,
    [
      installer.verbs.install,
      `sass@${sassVer}`,
      ...installFlags
    ]
  );
};
