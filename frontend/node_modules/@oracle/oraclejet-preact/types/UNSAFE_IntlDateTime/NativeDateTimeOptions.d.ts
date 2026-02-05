/**
 * @license
 * Copyright (c) 2019 %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
type PickOptionsType = Pick<Intl.DateTimeFormatOptions, 'weekday' | 'era' | 'year' | 'month' | 'day' | 'hour' | 'minute' | 'second' | 'timeZoneName' | 'hour12' | 'timeZone'>;
export type BCP47Locale = string;
export type DateTimeStyleType = 'full' | 'long' | 'medium' | 'short';
/**
 * Options related to parsing/formatting of dates with times (zulu, offset, or local).
 */
export type NativeDateTimeOptions = PickOptionsType & {
    calendar?: 'buddhist' | 'chinese' | 'coptic' | 'ethiopia' | 'ethiopic' | 'gregory' | 'hebrew' | 'indian' | 'islamic' | 'iso8601' | 'japanese' | 'persian' | 'roc';
    hourCycle?: 'h11' | 'h12' | 'h23' | 'h24';
    numberingSystem?: 'arab' | 'arabext' | 'bali' | 'beng' | 'deva' | 'fullwide' | 'gujr' | 'guru' | 'hanidec' | 'khmr' | 'knda' | 'laoo' | 'latn' | 'limb' | 'mlym' | 'mong' | 'mymr' | 'orya' | 'tamldec' | 'telu' | 'thai' | 'tibt';
    dateStyle?: DateTimeStyleType;
    dateStyleShortYear?: PickOptionsType['year'];
    timeStyle?: DateTimeStyleType;
    fractionalSecondDigits?: 1 | 2 | 3;
    twoDigitYearStart?: number;
    isoStrFormat?: 'zulu' | 'offset' | 'local' | 'auto';
    lenientParse?: 'full' | 'none';
    locale: BCP47Locale;
};
/**
 * This is the type returned by Intl.DateTimeFormat.resolvedOptions, plus some custom props specific to our implementation.
 */
export type NativeDateTimeResolvedOptions = Intl.ResolvedDateTimeFormatOptions & {
    hourCycle?: 'h11' | 'h12' | 'h23' | 'h24';
    dateStyle?: 'full' | 'long' | 'medium' | 'short';
    timeStyle?: 'full' | 'long' | 'medium' | 'short';
    fractionalSecondDigits?: 1 | 2 | 3;
    twoDigitYearStart?: number;
    isoStrFormat?: string;
    lenientParse?: string;
    patternFromOptions?: string;
};
export {};
