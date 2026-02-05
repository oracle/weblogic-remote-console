import { NONE, ERROR, WARN, INFO, LOG } from './logLevels';
/**
 * Logger object that writes into the native browser console or a custom writer, if a custom writer is specified.
 * When any of the logging methods is called, it compares the level of the message to the level of the logger and
 * logs the message if the logger level is at least as verbose as the message level.
 *
 * If the logging level is changed at a later point, the Logger will use the modified level for the subsequent log operations.
 *
 * The logging level can be overridden via sessionStorage.setItem() call for the current browser session.
 * Use 'ojet.logLevel' as the key with one of the following values: 'none' (least verbose), 'error', 'warning', 'info', 'log' (most verbose).
 * Set the value in the browser console and refresh the browser in order for the value to take effect.
 */
/**
 * Acceptable values for the log level
 */
export type LogLevelType = typeof NONE | typeof ERROR | typeof WARN | typeof INFO | typeof LOG;
/**
 * A type for the function that generates arguments for the Logger methods - 'log', 'info', 'warn', 'error', 'writer'.
 * You can pass this function to the logger method to avoid argument manipulation before log level is checked.
 */
type LogArgsFn = () => any | any[];
/**
 * Function type for the Logger methods - 'log', 'info', 'warn', 'error', 'writer'.
 * The first argument might be a function that returns arguments for logging, or
 * it might be a JavaScript string containing zero or more substitution strings.
 * When a callback function is specified as an argument, it will be lazily invoked
 * only if the logger level is at least as verbose as the message level.
 * We recommend using a function callback in Logger calls
 * to skip expensive manipulations of string arguments when log level is insuficient.
 */
type LogFn = (message?: any | LogArgsFn, ...optionalParams: any[]) => void;
/**
 * A type of the custom writer that can be passed to the Preact logger.
 * The writer should implement the following methods in order to be used - log, warn, info, error.
 */
export type LoggerType = {
    log: LogFn;
    warn: LogFn;
    info: LogFn;
    error: LogFn;
    write?: never;
};
/**
 * An alternative type of the custom writer that can be passed to the Preact logger.
 * The writer should implement method 'write' in order to be used.
 * The method will get log level as a first argument in addition to other logging arguments.
 */
export type LoggerAltType = {
    write: (logLevel: LogLevelType, message?: any | LogArgsFn, ...optionalParams: any[]) => void;
    log?: never;
    warn?: never;
    info?: never;
    error?: never;
};
/**
 * Sets log level
 * @param level NONE=0, ERROR=1, WARN=2, INFO=3, LOG=4
 */
export declare const setLogLevel: (level: LogLevelType) => void;
/**
 * Gets log level
 * @returns  NONE=0, ERROR=1, WARN=2, INFO=3, LOG=4
 */
export declare const getLogLevel: () => LogLevelType;
/**
 * Sets a custom writer for the logger. The custom writer should be an object
 * that either implements 'log', 'info', 'warn' and 'error' methods
 * or that implements 'write' method used for all levels of logging.
 * @param writer
 */
export declare const setLogWriter: (writer: LoggerType | LoggerAltType) => void;
/**
 * Outputs log messages to the browser console or custom writer.
 */
export declare const log: LogFn;
/**
 * Outputs info messages to the browser console or custom writer.
 */
export declare const info: LogFn;
/**
 * Outputs warn messages to the browser console or custom writer.
 */
export declare const warn: LogFn;
/**
 * Outputs error messages to the browser console or custom writer.
 */
export declare const error: LogFn;
export {};
