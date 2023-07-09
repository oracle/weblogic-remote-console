/**
 * @license
 * Copyright (c) 2022, 2023, Oracle and/or its affiliates.
 * Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.
 */

'use strict';

const fs = require('fs');
const os = require('os');

const LoggingLevels = [
  'error',
  'warning',
  'info',
  'debug',
  'trace'
];

let _logFilename;
let _loggingLevel;
let _isHeadlessMode;

(function () {
  _loggingLevel = 'info';
  _isHeadlessMode = false;
  const _error = console.error;
  const _warning = console.warning;
  const _debug = console.debug;
  const _trace = console.trace;

  console.error = function (line) {
    fs.appendFileSync(_logFilename, line + os.EOL);
    if (!_isHeadlessMode) _error.apply(console, arguments);
  };

  console.warning = function (line) {
    fs.appendFileSync(_logFilename, line + os.EOL);
    if (!_isHeadlessMode) _warning.apply(console, arguments);
  };

  console.debug = function (line) {
    fs.appendFileSync(_logFilename, line + os.EOL);
    if (!_isHeadlessMode) _debug.apply(console, arguments);
  };

  console.trace = function (line) {
    fs.appendFileSync(_logFilename, line + os.EOL);
    if (!_isHeadlessMode) _trace.apply(console, arguments);
  };
})();

function initializeLog(options) {
  _logFilename = _rotateLogfile(options.appPaths.userData, options.baseFilename);
  if (options.loggingLevel) _loggingLevel = options.loggingLevel;
  if (options.isHeadlessMode) _isHeadlessMode = options.isHeadlessMode;
}

/**
 *
 * @param {'utc'|'local'} type
 * @returns
 */
function getLogEntryDateTime(type = 'local') {
  let date = new Date();
  if (type !== 'utc') {
    const now = new Date();
    const offsetMs = now.getTimezoneOffset() * 60 * 1000;
    date = new Date(now.getTime() - offsetMs);
  }
  return (date).toISOString().slice(0, 19).replace(/-/g, '.').replace('T', ' ');
}

function getLogEntryLevel(level = 'info') {
  const levelSwitch = (value) => ({
    'error': 'ERROR',
    'warning': 'WARNING',
    'info': 'INFO',
    'debug': 'DEBUG',
    'trace': 'TRACE'
  })[value];
  return levelSwitch(level);
}

/**
 *
 * @param {string} [level='info']
 * @param {string} message
 */
function log(level = 'info', message) {
  function isLoggableLevel(level) {
    return (LoggingLevels.indexOf(level) <= LoggingLevels.indexOf(_loggingLevel));
  }

  function getCaller(stacklog) {
    let caller = '';
    const stackParts = stacklog.stack.split('\n');
    if (stackParts.length > 2) {
      caller = stackParts[2].match(/([^/]+\.js)/)[0];
    }
    return caller;
  }

  if (isLoggableLevel(level)) {
    const caller = getCaller((new Error('StackLog')));
    switch (level) {
      case 'error':
        ((line) => {
          console.error(line);
        })(`${getLogEntryDateTime()} ${getLogEntryLevel(level)} ${caller} ${message}`);
        break;
      case 'warning':
        ((line) => {
          console.warning(line);
        })(`${getLogEntryDateTime()} ${getLogEntryLevel(level)} ${caller} ${message}`);
        break;
      case 'debug':
        ((line) => {
          console.debug(line);
        })(`${getLogEntryDateTime()} ${getLogEntryLevel(level)} ${caller} ${message}`);
        break;
      case 'trace':
        ((line) => {
          console.trace(line);
        })(`${getLogEntryDateTime()} ${getLogEntryLevel(level)} ${caller} ${message}`);
        break;
      default:
        if (!_isHeadlessMode) {
          ((line) => { console.log(line); })(message);
        }
        ((line) => { fs.appendFileSync(_logFilename, line + os.EOL); })(message);
    }
  }
}

/**
 *
 * @returns {string[]}
 */
function getLogLevels() {
  return ['error', 'warning', 'info', 'debug', 'trace'];
}

/**
 *
 * @param {'error'|'warning'|'info'|'debug'|'trace'} level
 */
function setLoggingLevel(level) {
  _loggingLevel = level;
}

function setOptions(options) {
  if (options) {
    if (options.loggingLevel) _loggingLevel = options.loggingLevel;
    if (options.isHeadlessMode) _isHeadlessMode = options.isHeadlessMode;
  }
}

function _rotateLogfile(userDataPath, baseFilename) {
  function appendLogEntries(file, rotateFilename) {
    const w = fs.createWriteStream(rotateFilename, {flags: 'a'});
    const r = fs.createReadStream(file);
    r.pipe(w);
    w.on('close', () => {
      fs.unlink(file, (err) => {
        if (err) {
          console.error(err);
        }
      });
    });
  }

  const filename = `${baseFilename}.log`;
  const file = `${userDataPath}/${filename}`;

  const logDate = (new Date()).toISOString().slice(0, 10);
  const rotateFilename = `${userDataPath}/${baseFilename}-${logDate}.log`;

  if (fs.existsSync(file)) {
    if (!fs.existsSync(rotateFilename)) {
      fs.closeSync(fs.openSync(rotateFilename, 'w'));
    }
    appendLogEntries(file, rotateFilename);
  }

  return file;
}

module.exports = {
  initializeLog,
  log,
  getLogLevels,
  setLoggingLevel,
  setOptions
};
