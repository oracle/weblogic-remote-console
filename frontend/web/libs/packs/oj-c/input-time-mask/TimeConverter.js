define(["require", "exports", "@oracle/oraclejet-preact/utils/UNSAFE_timeUtils"], function (require, exports, UNSAFE_timeUtils_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TimeConverter = void 0;
    /**
     * A converter for oj-c-input-time-mask. TimeISOStr <--> Time Object.
     */
    class TimeConverter {
        constructor(options) {
            this.timeConverter_parseErrorFn = options?.timeConverter_parseErrorFn;
        }
        /**
         * This method takes a time-only local iso string and returns a Time Object with
         * hour and minute defined
         * which can then be passed to the InputTimeMask component.
         * For example, given 'T19:23:59', return {hour: 19, minute: 23, second: 59}.
         * @param value {TimeISOStr} time-only local iso string.
         * @returns {TimeWithValidIsoStrParts} The Time will have hour and minute.
         * @throws {Error} if the value is not a time-only ISO string with no offset.
         */
        format(value) {
            const time = (0, UNSAFE_timeUtils_1.getTimeObjFromTimeOnlyISOStr)(value);
            if (!time) {
                throw new Error('value must be a time-only ISO string with no offset');
            }
            return time;
        }
        /**
         * This method takes a Time object with hour and minute defined and optionally with second and millisecond defined
         * and returns a local time-only iso string.
         * For example, given {hour: 19, minute: 23, second: 59, millisecond: 888} return 'T19:23:59.888'
         * @param input {TimeWithValidIsoStrParts} a Time object with hour and minute defined and optionally with second and millisecond defined.
         * @returns a local time-only iso string
         * @throws {Error} if the input does not have hour and minute defined, since you cannot have an iso string without hour and minute.
         * If milliseconds is defined but its value is out of range of 0-999. This could happen because the allowed range is too large to express in Typescript;
         * this would be an application developer error.
         */
        parse(input) {
            const timeStr = (0, UNSAFE_timeUtils_1.getTimeOnlyISOStrFromTimeObj)(input);
            if (timeStr === undefined) {
                const errorStr = this.timeConverter_parseErrorFn && this.timeConverter_parseErrorFn();
                // This error could happen if the user clears out the hour field, for example, and the time is not complete. This error is shown to the user.
                throw new Error(errorStr ?? 'parse failed');
            }
            return timeStr;
        }
    }
    exports.TimeConverter = TimeConverter;
});
