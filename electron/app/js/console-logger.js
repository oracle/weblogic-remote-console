/**
 * @license
 * Copyright (c) 2022, 2025, Oracle and/or its affiliates.
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
let _isStdoutEnabled;

(function () {
  _loggingLevel = 'info';
  _isHeadlessMode = false;
  _isStdoutEnabled = false;
  const _error = console.error;
  const _warning = console.warning;
  const _debug = console.debug;
  const _trace = console.trace;

  console.error = function (line) {
    fs.appendFileSync(_logFilename, line + os.EOL);
    if (_useConsoleLogging()) _error.apply(console, arguments);
  };

  console.warning = function (line) {
    fs.appendFileSync(_logFilename, line + os.EOL);
    if (_useConsoleLogging()) _warning.apply(console, arguments);
  };

  console.debug = function (line) {
    fs.appendFileSync(_logFilename, line + os.EOL);
    if (_useConsoleLogging()) _debug.apply(console, arguments);
  };

  console.trace = function (line) {
    fs.appendFileSync(_logFilename, line + os.EOL);
    if (_useConsoleLogging()) _trace.apply(console, arguments);
  };

  // Handle error on stdout and also prevent a dialog box when using console logging functions...
  process.stdout.on('error', function (error) {
    if (error.code == 'EPIPE') _isStdoutEnabled = false;
    const caller = _getCaller((new Error('StackLog')));
    const line = `${getLogEntryDateTime()} ${getLogEntryLevel('error')} ${caller} ${error}`;
    fs.appendFileSync(_logFilename, line + os.EOL);
  });
})();

function _useConsoleLogging() {
  return (_isStdoutEnabled && !_isHeadlessMode);
}

function initializeLog(options) {
  _logFilename = _getLogFileName(options.appPaths.userData, options.baseFilename);
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

function _getCaller(stacklog) {
  let caller = '';
  const stackParts = stacklog.stack.split('\n');
  if (stackParts.length > 2) {
    const matched = stackParts[2].match(/([^/]+\.js)/);
    caller = (matched ? matched[0] : stackParts[2]);
  }
  return caller;
}

/**
 *
 * @param {string} [level='info']
 * @param {string} message
 */
function log(level = 'info', message, infoUseTimeStamp = true) {
  function isLoggableLevel(level) {
    return (LoggingLevels.indexOf(level) <= LoggingLevels.indexOf(_loggingLevel));
  }

  if (isLoggableLevel(level)) {
    const caller = _getCaller((new Error('StackLog')));
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
        let msg = message;
        if (infoUseTimeStamp) {
          msg = `${getLogEntryDateTime()} ${getLogEntryLevel('info')} ${caller} ${message}`;
        }
        if (_useConsoleLogging()) {
          ((line) => { console.log(line); })(msg);
        }
        ((line) => { fs.appendFileSync(_logFilename, line + os.EOL); })(msg);
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

function getLoggingLevel() {
  return _loggingLevel;
}

function setOptions(options) {
  if (options) {
    if (options.loggingLevel) _loggingLevel = options.loggingLevel;
    if (options.isHeadlessMode) _isHeadlessMode = options.isHeadlessMode;
  }
}

function setStdoutEnabled() {
  _isStdoutEnabled = true;
}

function rotateLog(options) {
  _logFilename = _rotateLogfile(options.appPaths.userData, options.baseFilename);
  if (options.loggingLevel) _loggingLevel = options.loggingLevel;
  if (options.isHeadlessMode) _isHeadlessMode = options.isHeadlessMode;
}

function _getLogFileName(userDataPath, baseFilename) {
  const filename = `${baseFilename}.log`;
  return `${userDataPath}/${filename}`;
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

  const file = _getLogFileName(userDataPath, baseFilename);

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
  getLoggingLevel,
  setOptions,
  setStdoutEnabled,
  rotateLog
};
