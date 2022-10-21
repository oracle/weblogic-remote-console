/**
 * @license
 * Copyright (c) 2022, Oracle and/or its affiliates.
 * Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.
 * @ignore
 */

'use strict';

/**
 * 
 * @param {Error|any} reason 
 * @param {string} failureType 
 * @returns
 */
function createFailure(reason, failureType = 'UNEXPECTED') {
  const failure = {};
  if (reason && (reason instanceof Error)) {
    failure['transport'] = {statusText: reason.code};
    failure['failureReason'] = reason.stack;
  }
  else if (reason && (typeof reason === 'string')) {
    failure['failureReason'] = reason;
  }
  failure['failureType'] = failureType;
  return failure;
}

function populateResponseFailure(err, response, failureType = 'UNEXPECTED') {
  response["transport"] = {statusText: err};
  response["failureType"] = failureType;
  response["failureReason"] = err;
}

module.exports = {
  createFailure,
  populateResponseFailure
};
