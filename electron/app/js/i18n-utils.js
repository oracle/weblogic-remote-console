/**
 * @license
 * Copyright (c) 2022, 2026, Oracle and/or its affiliates.
 * Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.
 * @ignore
 */

'use strict';

const reader = require('properties-reader');
const fs = require('fs');

/**
 *
 * See {@link https://stackabuse.com/javascripts-immediately-invoked-function-expressions/}
 */
const I18NUtils = (() => {
  let properties;

  return {
    initialize: (resourceDir, locale) => {
      // The locale might be (though probably never 1 or 2):
      // 1. undefined
      // 2. language_dialect - e.g. en_US
      // 3. language-dialect - e.g. en-US
      // 4. language - e.g. en
      //
      // All of the property files look like either:
      // <resourceDir>/nls/electron_<language>.properties or
      // <resourceDir>/nls/electron_<language>_<dialect>.properties
      // <resourceDir>/nls/frontend_ja.properties

      // Read in the default strings and then replace with localized
      // ones, in case some strings haven't been translated yet
      properties = reader(`${resourceDir}/nls/electron.properties`);

      if (locale) {
        const lang = locale.substr(0, 2).toLowerCase();
        if (locale.length === 2) {
          const file = `${resourceDir}/nls/electron_${lang}.properties`;
          if (fs.existsSync(file))
            properties.append(file);
        }
        else if (locale.length === 5) {
          const dialect = locale.substr(3, 2).toUpperCase();
          let file = `${resourceDir}/nls/electron_${lang}_${dialect}.properties`;
          if (fs.existsSync(file))
            properties.append(file);
          else {
            file = `${resourceDir}/nls/electron_${lang}.properties`;
            if (fs.existsSync(file))
              properties.append(file);
          }
        }
      }
      // This converts from \uXXX format into UTF-8
      //     copied from create-translation-bundles.js
      properties.each((key, value) => {
        properties.set(key, JSON.parse('"' + value.replace(/\"/g, '\\"') + '"'));
      });
    },
    get: (prop, substitute1, substitute2) => {
      let ret = properties.get(prop);
      if (!ret || !substitute1)
        return ret;
      return ret.replace('{0}', substitute1).replace('{1}', substitute2);
    }
  };
})();

module.exports = I18NUtils;
