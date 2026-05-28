/**
 * @license
 * Copyright (c) 2026, Oracle and/or its affiliates.
 * Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.
 * @ignore
 */

'use strict';

const { shell } = require('electron');
const logger = require('./console-logger');

const ALLOWED_EXTERNAL_URL_PROTOCOLS = ['http:', 'https:'];

const ExternalUrlUtils = (() => {
  function validateExternalURL(url) {
    const parsed = new URL(url);
    const protocol = parsed.protocol.toLowerCase();
    if (!ALLOWED_EXTERNAL_URL_PROTOCOLS.includes(protocol)) {
      throw new Error(`Invalid protocol '${parsed.protocol}'`);
    }
    return parsed.toString();
  }

  async function openExternalURL(url, context) {
    try {
      const validatedURL = validateExternalURL(url);
      await shell.openExternal(validatedURL);
      return true;
    } catch (err) {
      logger.log('error', `${context || 'external-url'} rejected external URL: ${err}`);
      return false;
    }
  }

  return {
    validateExternalURL: validateExternalURL,
    openExternalURL: openExternalURL
  };
})();

module.exports = ExternalUrlUtils;