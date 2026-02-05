/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(["require", "exports", "@oracle/oraclejet-preact/utils/UNSAFE_calendarDateUtils"], function (require, exports, UNSAFE_calendarDateUtils_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.assertCompleteDate = exports.compareCalendarDates = void 0;
    /**
     * Compares two dates of type CalendarDateRequired.
     * @param val1 first calendar date
     * @param val2 second calendar date
     * @returns 0 if the same calendar date. 1 if val1 > val2. -1 if val1 < val2.
     */
    const compareCalendarDates = (val1, val2) => {
        if (val1.year === val2.year && val1.month === val2.month && val1.day === val2.day) {
            return 0;
        }
        if (val1.year === val2.year) {
            if (val1.month === val2.month) {
                return val1.day > val2.day ? 1 : -1;
            }
            return val1.month > val2.month ? 1 : -1;
        }
        return val1.year > val2.year ? 1 : -1;
    };
    exports.compareCalendarDates = compareCalendarDates;
    /**
     * Makes sure that the provided date is a complete date.
     * Note: The function needs to be declared this way for TS assertion to work correctly.
     * @param date The date to check
     * @throws {Error} if the provided date is not a complete date
     */
    const assertCompleteDate = (date) => {
        if (!(0, UNSAFE_calendarDateUtils_1.isCompleteCalendarDate)(date))
            // no translation needed as this error is for the app developer.
            throw new Error('DateRestrictionValidator: Expected full date, but received partial date');
    };
    exports.assertCompleteDate = assertCompleteDate;
});
