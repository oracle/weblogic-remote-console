import { TimeWithValidIsoStrParts } from '@oracle/oraclejet-preact/utils/UNSAFE_timeUtils';
import { BundleType } from '@oracle/oraclejet-preact/resources/nls/bundle';
import type { TimeISOStr } from '@oracle/oraclejet-preact/UNSAFE_IntlDateTime';
type TimeConverterOptions = {
    timeConverter_parseErrorFn?: BundleType['timeConverter_parseError'];
};
/**
 * A converter for oj-c-input-time-mask. TimeISOStr <--> Time Object.
 */
export declare class TimeConverter {
    private timeConverter_parseErrorFn;
    constructor(options?: TimeConverterOptions);
    /**
     * This method takes a time-only local iso string and returns a Time Object with
     * hour and minute defined
     * which can then be passed to the InputTimeMask component.
     * For example, given 'T19:23:59', return {hour: 19, minute: 23, second: 59}.
     * @param value {TimeISOStr} time-only local iso string.
     * @returns {TimeWithValidIsoStrParts} The Time will have hour and minute.
     * @throws {Error} if the value is not a time-only ISO string with no offset.
     */
    format(value: TimeISOStr): TimeWithValidIsoStrParts;
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
    parse(input: TimeWithValidIsoStrParts): TimeISOStr;
}
export {};
