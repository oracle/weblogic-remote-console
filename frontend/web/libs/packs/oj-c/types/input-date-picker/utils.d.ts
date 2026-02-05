/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { type CalendarDate, type CalendarDateRequired } from '@oracle/oraclejet-preact/utils/UNSAFE_calendarDateUtils';
/**
 * Compares two dates of type CalendarDateRequired.
 * @param val1 first calendar date
 * @param val2 second calendar date
 * @returns 0 if the same calendar date. 1 if val1 > val2. -1 if val1 < val2.
 */
export declare const compareCalendarDates: (val1: CalendarDateRequired, val2: CalendarDateRequired) => 0 | 1 | -1;
/**
 * Makes sure that the provided date is a complete date.
 * Note: The function needs to be declared this way for TS assertion to work correctly.
 * @param date The date to check
 * @throws {Error} if the provided date is not a complete date
 */
export declare const assertCompleteDate: (date: CalendarDate) => asserts date is CalendarDateRequired;
