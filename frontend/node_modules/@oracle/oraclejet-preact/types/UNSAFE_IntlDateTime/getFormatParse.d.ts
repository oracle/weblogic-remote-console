/**
 * @license
 * Copyright (c) 2004 %CURRENT_YEAR%, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { formatDateTime, parseDateTime } from './formatParse';
import { NativeDateTimeOptions } from './NativeDateTimeOptions';
/**
 * This function is used to retrieve 'format'and 'parse' methods for formatting or parsing date,
 * time, or datetime values according to the provided options. The options may include:
 *
 * Using the standard date, datetime and time format lengths defined by Unicode CLDR; these
 * include the dateStyle and timeStyle properties (full | long | medium | short).
 *
 * Using options defined by the ECMA 402 Specification, including the properties year,
 * month, day, hour, minute, second, weekday, era, timeZoneName, hour12, timeZone.
 *
 * Passing the BCP47Locale is the only required option. If no other options are specified,
 * the default is to use the 'short' format length for the provided locale.
 *
 * Once the function has been called with a set of options, there is no need to call it again unless
 * you want to change the options being used to format and parse, or the locale.
 */
export declare function getFormatParse(options: NativeDateTimeOptions): {
    format: (value: Parameters<typeof formatDateTime>[3]) => string;
    parse: (str: Parameters<typeof parseDateTime>[3]) => string;
    resolvedOptions: import("./NativeDateTimeOptions").NativeDateTimeResolvedOptions;
    formatter: Intl.DateTimeFormat;
};
