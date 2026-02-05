/**
  Copyright (c) 2015, 2025, Oracle and/or its affiliates.
  Licensed under The Universal Permissive License (UPL), Version 1.0
  as shown at https://oss.oracle.com/licenses/upl/

*/
'use strict';

const util = require('./util');

module.exports = {
  getInjectorTagsRegExp: _getInjectorTagsRegExp,
  getLineEnding: _getLineEnding,
  replaceInjectorTokens: _replaceInjectorTokens,
  createScriptElementString: _createScriptElementString
};

function _getInjectorTagsRegExp(starttag, endtag) {
  const start = _escapeForRegExp(starttag);
  const end = _escapeForRegExp(endtag);
  const startNoSpace = _escapeForRegExp(starttag.replace(/\s/g, ''));
  const endNoSpace = _escapeForRegExp(endtag.replace(/\s/g, ''));
  return new RegExp(`([\t ]*)(${start}|${startNoSpace})((\\n|\\r|.)*?)(${end}|${endNoSpace})`, 'gi');
}

function _escapeForRegExp(str) {
  return str.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
}

function _getLineEnding(content) {
  return /\r\n/.test(String(content)) ? '\r\n' : '\n';
}

function _checkTags(content, startTag, endTag) {
  // Check for one or the other missing--both may be ok
  const missingStartTag = startTag && content.indexOf(startTag) < 0;
  const missingEndTag = endTag && content.indexOf(endTag) < 0;
  if (missingStartTag && !missingEndTag) {
    util.log.error(`Missing start tag '${startTag}'`);
  } else if (!missingStartTag && missingEndTag) {
    util.log.error(`Missing end tag '${endTag}'`);
  }
}

function _replaceInjectorTokens({ content, pattern, replace, eol, startTag, endTag }) {
  // Check for tags
  _checkTags(content, startTag, endTag);

  // remove the existing content, if any
  let injectResult = content.replace(pattern, () =>
    startTag + eol + endTag
  );
  // actual injection of new content
  injectResult = injectResult.replace(pattern, () =>
    startTag + eol + replace + eol + endTag
  );
  return injectResult;
}

function _createScriptElementString(scriptSrc, type) {
  const scriptType = type === null ? 'text/javascript' : type;
  return `<script type='${scriptType}' src='${scriptSrc}'></script>`;
}
