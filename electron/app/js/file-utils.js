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
 * @type {{fileExtensions, createFileReadingResponse, writeFileAsync}}
 */
const FileUtils = (() => {
  const fs = require('fs');
  const {log} = require('./console-logger');

  function _readContentFile(filepath) {
    return {
      file: filepath,
      fileContents: fs.readFileSync(filepath, 'utf8'),
      mediaType: (filepath.endsWith(".json") ? "application/json" :  "application/x-yaml")
    };
  }

  return {
    fileExtensions: ['yml', 'yaml', 'json', 'props', 'properties'],
    writeFileAsync: (filepath, fileContents) => {
      return new Promise((resolve, reject) => {
        fs.writeFile(
          filepath,
          fileContents,
          {encoding: "utf8", flag: "w", mode: 0o666},
          (err) => {
            if (err) {
              reject({
                succeeded: false,
                failure: {
                  transport: {statusText: err.code},
                  failureType: "UNEXPECTED",
                  failureReason: err.stack
                }
              });
            }
            else {
              resolve({ succeeded: true, filePath: filepath});
            }
          });
      });
    },
    createFileReadingResponse: (filepath) => {
      const response = {};
      if (fs.existsSync(filepath)) {
        try {
          const results = _readContentFile(filepath);
          response["file"] = results.file;
          response["fileContents"] = results.fileContents;
          response["mediaType"] = results.mediaType;
          return Promise.resolve(response);
        }
        catch(err) {
          response["transport"] = {statusText: err};
          response["failureType"] = "UNEXPECTED";
          response["failureReason"] = err;
          return Promise.reject(response);
        }
      }
      else {
        response["transport"] = {statusText: `File does not exist: ${filepath}`};
        response["failureType"] = "NOT_FOUND";
        response["failureReason"] = `File does not exist: ${filepath}`;
        return Promise.reject(response);
      }
    }

  };

})();

module.exports = FileUtils;