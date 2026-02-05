/**
 * @license
 * Copyright (c) 2004 %CURRENT_YEAR%, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { NativeDateTimeOptions } from './NativeDateTimeOptions';
import { NativeDateTimeResolvedOptions } from './NativeDateTimeOptions';
/**
 * Create an Intl.DateTimeFormat from the options.
 */
export declare const getFormatter: (options: NativeDateTimeOptions) => Intl.DateTimeFormat;
/**
 * Get the resolved options from the Intl.DateTimeFormat instance, plus any custom options used by our implementation.
 */
export declare const getResolvedOptions: (formatter: Intl.DateTimeFormat, options: NativeDateTimeOptions) => NativeDateTimeResolvedOptions;
/**
 * Create an Intl.DateTimeFormat that can merge in the year in the desired format during the call to 'format'.
 * This is useful if you always want year: 'numeric' for dateStyle: 'short' even if
 * in some locales dateStyle: 'short' yields a 2-digit year. 2-digit years are ambiguous.
 */
export declare const getYearFormatter: (options: NativeDateTimeOptions, resOptions: NativeDateTimeResolvedOptions) => Intl.DateTimeFormat | null;
/**
 * Merge in the year in the desired format rather than whatever the locale default is for dateStyle: 'short'.
 */
export declare const formatWithYearFormat: (formatInstance: Intl.DateTimeFormat, yearInstance: Intl.DateTimeFormat, value: Date) => string;
/**
 * Formats a date time string based on the given options.
 */
export declare const formatDateTimeWithOptions: (options: NativeDateTimeOptions, value: string) => string;
/**
 * Formats a date time string using Intl.DateTimeFormat.
 */
export declare const formatDateTime: (intlFormatter: Intl.DateTimeFormat, yearFormatter: Intl.DateTimeFormat | null, timeZone: string, value: string) => string;
/**
 * Parses a string into an iso string based on the given options.
 */
export declare const parseDateTimeWithOptions: (options: NativeDateTimeOptions, str: string) => string;
/**
 * Parses the formatted string, and returns an iso string.
 * @returns an iso string
 * @throws Error if undefined, null, or '' or not an iso string, or if something went wrong in the call to parse.
 */
export declare const parseDateTime: (locale: string, formatter: Intl.DateTimeFormat, resOptions: NativeDateTimeResolvedOptions, str: string) => string;
/**
 * Checks if it is a valid iso string.
 * Also fixes up the iso string if needed, i.e. if local and timezone are specified in the options.
 * @param timeZone
 * @param value
 * @returns
 * @throws Error if undefined, null, or '' or if it is an invalid iso string.
 */
export declare const normalizeIsoString: (timeZone: string, value: string) => string;
