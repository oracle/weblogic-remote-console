define(["require", "exports", "@oracle/oraclejet-preact/utils/UNSAFE_calendarDateUtils", "ojs/ojconfig"], function (require, exports, UNSAFE_calendarDateUtils_1, ojconfig_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.CalendarDateConverter = void 0;
    // A converter for the oj-c-input-date-mask component. It throws an error on parse if it is an incomplete date.
    class CalendarDateConverter {
        constructor(options) {
            this.locale = options?.locale ?? (0, ojconfig_1.getLocale)();
            this.calendarDateConverter_parseErrorFn = options?.calendarDateConverter_parseErrorFn;
            this.customMask = options?.customMask;
        }
        format(value) {
            const calendarDate = (0, UNSAFE_calendarDateUtils_1.getCalendarDateFromIso)(value);
            if (!calendarDate) {
                throw new Error('value must be a date-only ISO string');
            }
            return calendarDate;
        }
        // throws an error if the input is not a complete calendar date.
        parse(input) {
            // if calendar date is not complete, throw an error which we will catch and format into a better error.
            if (input !== undefined && !(0, UNSAFE_calendarDateUtils_1.isCompleteCalendarDate)(input)) {
                const now = new Date();
                // getFullYear returns the year for the date according to local time.
                const currentYear = now.getFullYear();
                const formattedDateExample = (0, UNSAFE_calendarDateUtils_1.formatIsoDateStrAsExample)(this.locale, `${currentYear}-11-29`, this.customMask);
                const errorStr = this.calendarDateConverter_parseErrorFn &&
                    this.calendarDateConverter_parseErrorFn({
                        dateExample: formattedDateExample
                    });
                throw new Error(errorStr ?? 'parse failed');
            }
            // At this point we know that the input is a complete date, but typescript does not know, so tell it.
            const completeDate = input;
            // parse a full CalendarDate to an ISO string.
            return (0, UNSAFE_calendarDateUtils_1.getIsoDateStr)(completeDate.year, completeDate.month, completeDate.day);
        }
    }
    exports.CalendarDateConverter = CalendarDateConverter;
});
