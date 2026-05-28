/**
 * @license
 * Copyright (c) 2026, Oracle and/or its affiliates.
 * Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.
 * @ignore
 */

'use strict';

const HTTPS_REQUIRED_MESSAGE = 'Update feed URL must use HTTPS.';

function validateUpdateFeedURL(feedURL) {
  let parsedURL;
  try {
    parsedURL = new URL(feedURL);
  } catch (_err) {
    throw new Error(HTTPS_REQUIRED_MESSAGE);
  }

  if (parsedURL.protocol !== 'https:') {
    throw new Error(HTTPS_REQUIRED_MESSAGE);
  }

  return feedURL;
}

module.exports = {
  HTTPS_REQUIRED_MESSAGE,
  validateUpdateFeedURL
};