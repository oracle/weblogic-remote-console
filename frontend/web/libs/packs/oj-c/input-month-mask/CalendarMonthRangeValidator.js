define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.CalendarMonthRangeValidator = void 0;
    // This class is used to validate that a value falls within
    // the range specified by min and max. If it doesn't, an Error is thrown with a message detail.
    class CalendarMonthRangeValidator {
        constructor(options) {
            if (options.min &&
                options.max &&
                CalendarMonthRangeValidator._compareCalendarMonths(options.min, options.max) > 0) {
                // this is an app developer error, so it doesn't need to be translated.
                throw new Error('min must be less than max');
            }
            this.defaultRangeOverflowMessageDetailFn = options.defaultRangeOverflowMessageDetailFn;
            this.defaultRangeUnderflowMessageDetailFn = options.defaultRangeUnderflowMessageDetailFn;
            this.min = options.min;
            this.max = options.max;
            this.dateRangeOverflowMessageDetail = options.dateRangeOverflowMessageDetail;
            this.dateRangeUnderflowMessageDetail = options.dateRangeUnderflowMessageDetail;
            this.formatObj = options.formatObj;
        }
        // Validates the minimum + maximum conditions. If the value is null, just return.
        validate(value) {
            const messageDetailRangeOverflow = this.dateRangeOverflowMessageDetail;
            const messageDetailRangeUnderflow = this.dateRangeUnderflowMessageDetail;
            const min = this.min;
            const max = this.max;
            if (value === null) {
                return;
            }
            const valStr = value ? this.formatObj.format(value) : value;
            if (max && CalendarMonthRangeValidator._compareCalendarMonths(value, max) > 0) {
                const maxStr = this.formatObj.format(max);
                const detail = messageDetailRangeOverflow
                    ? messageDetailRangeOverflow({ max: maxStr, value: valStr })
                    : this.defaultRangeOverflowMessageDetailFn({ max: maxStr });
                throw new Error(detail);
            }
            if (min && CalendarMonthRangeValidator._compareCalendarMonths(value, min) < 0) {
                const minStr = this.formatObj.format(min);
                const detail = messageDetailRangeUnderflow
                    ? messageDetailRangeUnderflow({ min: minStr, value: valStr })
                    : this.defaultRangeUnderflowMessageDetailFn({ min: minStr });
                throw new Error(detail);
            }
            return value;
        }
        /**
         * Compares two dates of type CalendarMonthRequired.
         * @param {CalendarMonthRequired} val1 first month/year value
         * @param {CalendarMonthRequired} val2 second month/year value
         * @return {number} 0 if the same month and year. 1 if val1 > val2. -1 if val1 < val2.
         * @private
         * @static
         */
        static _compareCalendarMonths(val1, val2) {
            if (val1.year === val2.year && val1.month === val2.month) {
                return 0;
            }
            if (val1.year === val2.year) {
                return val1.month > val2.month ? 1 : -1;
            }
            return val1.year > val2.year ? 1 : -1;
        }
    }
    exports.CalendarMonthRangeValidator = CalendarMonthRangeValidator;
});
