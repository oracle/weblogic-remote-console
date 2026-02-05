/**
 * @license
 * Copyright (c) 2004 %CURRENT_YEAR%, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { CalendarNodeType } from './CalendarUtils';
import { NativeDateTimeResolvedOptions } from './NativeDateTimeOptions';
interface ParsedObjectType {
    value: string;
    warning: string;
}
export declare class NativeParserImpl {
    static parseImpl(str: string, pattern: string, resOptions: NativeDateTimeResolvedOptions, cal: CalendarNodeType): ParsedObjectType;
    private static _appendPreOrPostMatch;
    private static _validateRange;
    private static _throwInvalidDateFormat;
    private static _throwWeekdayMismatch;
    private static _throwDateFormatMismatch;
    private static _parseTimezoneOffset;
    private static _expandYear;
    private static _arrayIndexOfMonthOrDay;
    private static toUpperTrimmedNoPeriod;
    private static _getDayIndex;
    private static _getMonthIndex;
    private static _getParseRegExp;
    private static _getTokenIndex;
    private static _parseLenienthms;
    private static _getWeekdayName;
    private static _parseLenientyMEd;
    private static _parseLenientyMMMEd;
    private static _parseLenient;
    private static _getNameIndex;
    private static _validateTimePart;
    private static _dateTimeStyle;
    private static _matchPMSymbol;
    private static _parseExact;
    private static _isoStrDateTimeStyle;
    private static _getTimeZoneOffset;
    private static _getAdjustedOffset;
    private static _adjustHours;
    private static _createISOStrParts;
    private static _getParseISOStringOffset;
    private static _createParseISOStringFromDate;
    static getTimeZoneCurrentDate(tzName: string | null): string;
    static getTimeZoneCurrentOffset(timezone: string, timeOnlyIsoString?: string): number;
    static getLocalSystemTimeZone(): string;
}
export {};
