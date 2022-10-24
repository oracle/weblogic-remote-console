/**
 * @license
 * Copyright (c) 2022, Oracle and/or its affiliates.
 * Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.
 * @ignore
 */

'use strict';

/**
 *
 * See {@link https://stackabuse.com/javascripts-immediately-invoked-function-expressions/}
 * @type {{isMacOS}}
 */
const OSUtils = (() => {
  return {
    isMacOS: () => { return (process.platform === 'darwin'); }
  };

})();

module.exports = OSUtils;
