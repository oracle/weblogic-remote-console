/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
export type CalendarWidthNames = 'abbreviated' | 'narrow' | 'wide';
type MonthType = {
    '1': string;
    '2': string;
    '3': string;
    '4': string;
    '5': string;
    '6': string;
    '7': string;
    '8': string;
    '9': string;
    '10': string;
    '11': string;
    '12': string;
};
type DayType = {
    sun: string;
    mon: string;
    tue: string;
    wed: string;
    thu: string;
    fri: string;
    sat: string;
};
type DayPeriodType = {
    am: string;
    pm: string;
};
type ErasWidthType = {
    '0': string;
    '1': string;
};
type MonthWidthType = {
    abbreviated: MonthType;
    narrow: MonthType;
    wide: MonthType;
};
type DayWidthType = {
    abbreviated: DayType;
    narrow: DayType;
    wide: DayType;
};
type MonthsNodeType = {
    format: MonthWidthType;
    'stand-alone': MonthWidthType;
};
type DaysNodeType = {
    format: DayWidthType;
    'stand-alone': DayWidthType;
};
type DayPeriodFormatWidthType = {
    wide: DayPeriodType;
};
type DayPeriodsNodeType = {
    format: DayPeriodFormatWidthType;
};
type ErasType = {
    eraNarrow: ErasWidthType;
    eraAbbr: ErasWidthType;
    eraName: ErasWidthType;
};
export type CalendarNodeType = {
    months: MonthsNodeType;
    days: DaysNodeType;
    dayPeriods: DayPeriodsNodeType;
    eras: ErasType;
    locale: string;
};
export declare class CalendarUtils {
    static calendars: Record<string, Record<string, CalendarNodeType>> | undefined;
    private static readonly _monthNamesFormatMap;
    private static readonly _weekdaysFormatMap;
    private static exceptionLocales;
    private static _getDayPeriods;
    private static getFormatterLocale;
    private static _getEras;
    private static _fillMonthAndDays;
    private static _getFormatMonthAndDays;
    private static _getStandAloneDays;
    private static _getStandAloneMonths;
    /**
     * Fills in CalendarUtils.calendars[locale][calendar] public static object.
     * @param locale locale name
     * @param calendar calendar name
     */
    static getCalendar(locale: string, calendar: string): CalendarNodeType;
}
export {};
