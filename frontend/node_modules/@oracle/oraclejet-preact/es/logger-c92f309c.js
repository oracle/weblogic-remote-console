/* @oracle/oraclejet-preact: undefined */
/**
 * @license
 * Copyright (c) 2011 %CURRENT_YEAR%, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
/**
 * Log level none (least verbose)
 */
const NONE = 0;
/**
 * Log level error
 */
const ERROR = 1;
/**
 * Log level warn
 */
const WARN = 2;
/**
 * Log level info
 */
const INFO = 3;
/**
 * Log level log
 */
const LOG = 4;

/**
 * @license
 * Copyright (c) 2011 %CURRENT_YEAR%, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
/*
 * Helper method that retrieves and parses session storage setting
 */
const _getSessionStorage = () => {
    let logLevel;
    try {
        const sessionValue = window?.sessionStorage?.getItem('ojet.logLevel');
        switch (sessionValue) {
            case 'none':
                logLevel = NONE;
                break;
            case 'error':
                logLevel = ERROR;
                break;
            case 'warning':
                logLevel = WARN;
                break;
            case 'info':
                logLevel = INFO;
                break;
            case 'log':
                logLevel = LOG;
                break;
            default:
                logLevel = undefined;
        }
        // eslint-disable-next-line no-empty
    }
    catch (e) { }
    return logLevel;
};
/**
 * SessionStorage setting
 */
const sessionStorageLevel = _getSessionStorage();

/**
 * @license
 * Copyright (c) 2011 %CURRENT_YEAR%, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
let _logLevel = ERROR;
let _writer = null;
/**
 * Sets log level
 * @param level NONE=0, ERROR=1, WARN=2, INFO=3, LOG=4
 */
const setLogLevel = (level) => {
    _logLevel = level;
};
/**
 * Gets log level
 * @returns  NONE=0, ERROR=1, WARN=2, INFO=3, LOG=4
 */
const getLogLevel = () => {
    return sessionStorageLevel === undefined ? _logLevel : sessionStorageLevel;
};
/**
 * Sets a custom writer for the logger. The custom writer should be an object
 * that either implements 'log', 'info', 'warn' and 'error' methods
 * or that implements 'write' method used for all levels of logging.
 * @param writer
 */
const setLogWriter = (writer) => {
    _writer = writer;
};
const _getWriter = () => {
    let writer;
    if (_writer) {
        writer = _writer;
    }
    else if (typeof window !== 'undefined' && window.console !== undefined) {
        writer = window.console;
    }
    return writer;
};
const _write = (method, logLevel, message, ...optionalParams) => {
    if (getLogLevel() < logLevel) {
        return;
    }
    const writer = _getWriter();
    if (writer) {
        let args = [message];
        if (optionalParams) {
            args = args.concat(optionalParams);
        }
        if (args.length === 1 && args[0] instanceof Function) {
            const msg = args[0]();
            args = Array.isArray(msg) ? msg : [msg];
        }
        if (writer['write']) {
            args.unshift(logLevel);
            writer['write'](...args);
        }
        else {
            writer[method].apply(writer, args);
        }
    }
};
/**
 * Outputs log messages to the browser console or custom writer.
 */
const log = _write.bind(null, 'log', LOG);
/**
 * Outputs info messages to the browser console or custom writer.
 */
const info = _write.bind(null, 'info', INFO);
/**
 * Outputs warn messages to the browser console or custom writer.
 */
const warn = _write.bind(null, 'warn', WARN);
/**
 * Outputs error messages to the browser console or custom writer.
 */
const error = _write.bind(null, 'error', ERROR);

export { ERROR as E, INFO as I, LOG as L, NONE as N, WARN as W, setLogWriter as a, error as e, getLogLevel as g, info as i, log as l, setLogLevel as s, warn as w };
//# sourceMappingURL=logger-c92f309c.js.map
