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
 * # 'addPcss'
 *
 * @public
 * @param {Object} options
 * @returns {Promise}
 */
module.exports = function (options) {
  const installer = util.getInstallerCommand({ options });
  util.log('Installing sass and pcss');
  config.loadOraclejetConfig();
  const sassVer = config.data.sassVer;
  const { enableLegacyPeerDeps } = util.getOraclejetConfigJson();

  const installFlags = [installer.flags.save];

  if (enableLegacyPeerDeps && installer.installer === 'npm') {
    installFlags.push(installer.flags.legacy);
  }

  return util.spawn(
    installer.installer,
    [
      installer.verbs.install,
      `sass@${sassVer}`,
      'postcss-calc@6.0.1',
      'autoprefixer@9.1.5',
      ...installFlags
    ]
  );
};
