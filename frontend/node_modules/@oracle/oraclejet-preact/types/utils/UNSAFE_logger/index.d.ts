/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
export { NONE, ERROR, WARN, INFO, LOG } from './logLevels';
export { setLogLevel, getLogLevel, setLogWriter, log, info, warn, error } from './logger';
export type { LoggerType, LoggerAltType } from './logger';
