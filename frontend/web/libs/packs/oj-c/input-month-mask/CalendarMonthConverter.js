define(["require", "exports", "@oracle/oraclejet-preact/utils/UNSAFE_calendarDateUtils", "ojs/ojconfig"], function (require, exports, UNSAFE_calendarDateUtils_1, ojconfig_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.CalendarMonthConverter = void 0;
    // A converter for the oj-c-input-month-mask component. It throws an error on parse if it is incomplete. It must have year and month.
    class CalendarMonthConverter {
        constructor(options) {
            this.locale = options?.locale ?? (0, ojconfig_1.getLocale)();
            this.calendarMonthConverter_parseErrorFn = options?.calendarMonthConverter_parseErrorFn;
            this.customMask = options?.customMask;
        }
        format(value) {
            // Check if the value is a complete object
            if (!(0, UNSAFE_calendarDateUtils_1.isCompleteCalendarMonth)(value)) {
                throw new Error('value must have year and month');
            }
            return value;
        }
        // throws an error if the input does not have both year and month.
        parse(input) {
            // if calendar date is not complete, throw an error which we will catch and format into a better error.
            if (input !== undefined && !(0, UNSAFE_calendarDateUtils_1.isCompleteCalendarMonth)(input)) {
                const now = new Date();
                // getFullYear returns the year for the date according to local time.
                const currentYear = now.getFullYear();
                const formattedDateExample = (0, UNSAFE_calendarDateUtils_1.formatIsoDateStrAsExample)(this.locale, `${currentYear}-11-29`, this.customMask, 'month');
                const errorStr = this.calendarMonthConverter_parseErrorFn &&
                    this.calendarMonthConverter_parseErrorFn({
                        dateExample: formattedDateExample
                    });
                throw new Error(errorStr ?? 'parse failed');
            }
            // At this point we know that the input has year and month, but typescript does not know, so tell it.
            return input;
        }
    }
    exports.CalendarMonthConverter = CalendarMonthConverter;
});
