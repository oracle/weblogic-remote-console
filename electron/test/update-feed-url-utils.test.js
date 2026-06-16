/**
 * @license
 * Copyright (c) 2026, Oracle and/or its affiliates.
 * Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.
 * @ignore
 */

'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');

const {
  HTTPS_REQUIRED_MESSAGE,
  validateUpdateFeedURL
} = require('../app/js/update-feed-url-utils');

test('validateUpdateFeedURL accepts HTTPS URLs', () => {
  const feedURL = 'https://github.com/oracle/weblogic-remote-console/releases';

  assert.equal(validateUpdateFeedURL(feedURL), feedURL);
});

test('validateUpdateFeedURL rejects HTTP URLs', () => {
  assert.throws(
    () => validateUpdateFeedURL('http://github.com/oracle/weblogic-remote-console/releases'),
    { message: HTTPS_REQUIRED_MESSAGE }
  );
});

test('validateUpdateFeedURL rejects malformed URLs', () => {
  assert.throws(
    () => validateUpdateFeedURL('not a url'),
    { message: HTTPS_REQUIRED_MESSAGE }
  );
});

test('validateUpdateFeedURL rejects missing URLs', () => {
  assert.throws(
    () => validateUpdateFeedURL(undefined),
    { message: HTTPS_REQUIRED_MESSAGE }
  );
});