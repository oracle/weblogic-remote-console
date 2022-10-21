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
 * @type {{putAll, i18n}}
 */
const I18NUtils = (() => {

  let _root = {};

  return {
    putAll: async (root) => {
      _root = root;
    },
    i18n:  _root.i18n
  };

})();

module.exports = I18NUtils;
