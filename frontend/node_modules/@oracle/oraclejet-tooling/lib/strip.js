/**
  Copyright (c) 2015, 2025, Oracle and/or its affiliates.
  Licensed under The Universal Permissive License (UPL), Version 1.0
  as shown at https://oss.oracle.com/licenses/upl/

*/

'use strict';

const glob = require('glob');
const fs = require('fs-extra');
const util = require('./util');
const path = require('path');

function _getGitIgnore() {
  const pathTogGitIgnore = util.destPath('.gitignore');
  if (util.fsExistsSync(pathTogGitIgnore)) {
    return util.readFileSync(pathTogGitIgnore).split(/\r?\n/);
  }
  util.log.warning('No .gitignore file found.  No files will be cleaned');
  return [];
}

function _getStripList() {
  // Check for the presence of a 'stripList' property in oraclejetconfig.json.
  // If there, return its array
  return util.getOraclejetConfigJson().stripList;
}

function _getCleanFileList(list) {
  let fileList = [];
  list.forEach((file) => {
    if (file.length !== 0 && !/Thumbs\.db|\.DS_Store/.test(file)) {
      const exclusion = file.indexOf('!') === 0;
      let srcPattern = exclusion ? file.slice(1) : file;
      // .gitignore file pattern may start with '/', remove it for glob matching

      srcPattern = srcPattern[0] === '/' ? srcPattern.slice(1) : srcPattern;
      const match = glob.sync(util.posixPattern(util.destPath(srcPattern)),
        { cwd: util.destPath() });
      fileList = exclusion ? util.difference(fileList, match) : util.union(fileList, match);
    }
  });
  return fileList;
}

module.exports = function strip() {
  const stripList = _getStripList();
  const fileList = _getCleanFileList(stripList || _getGitIgnore());
  return new Promise((resolve, reject) => {
    fileList.forEach((file) => {
      if (path.extname(file) === '') {
        fs.removeSync(file);
      } else {
        fs.remove(file, (err) => {
          if (err) reject(err);
        });
      }
    });

    resolve();
  });
};
