/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import type { FormatObj } from '@oracle/oraclejet-preact/UNSAFE_IntlFormatParse';
import type { CalendarMonthRequired } from '@oracle/oraclejet-preact/UNSAFE_InputDateMask';
import type { BundleType } from '@oracle/oraclejet-preact/resources/nls/bundle';
/**
 * Parameters that are passed into the dateRangeOverflowMessageDetail callback function.
 */
type OverflowMessageDetailParameters = {
    /**
     * The value entered by the user.
     */
    value: string;
    /**
     * The maximum allowed value.
     */
    max: string;
};
/**
 * Parameters the are passed into the dateRangeUnderflowMessageDetail callback function.
 */
type UnderflowMessageDetailParameters = {
    /**
     * The value entered by the user.
     */
    value: string;
    /**
     * The minimum allowed value.
     */
    min: string;
};
type MessageDetailFn<T> = (p: T) => string;
type CalendarMonthRangeValidatorOptions = {
    /**
     * The default message detail callback function when the date range validation fails when the input value is greater than the max.
     * The function should return a translated string.
     */
    defaultRangeOverflowMessageDetailFn: BundleType['inputMonthMask_dateRangeOverflowMessageDetail'];
    /**
     * The default message detail callback function when the date range validation fails when the input value is less than the min.
     * The function should return a translated string.
     */
    defaultRangeUnderflowMessageDetailFn: BundleType['inputMonthMask_dateRangeUnderflowMessageDetail'];
    /**
     * The maximum year and month date value allowed.
     */
    max?: CalendarMonthRequired;
    /**
     * The minimum year and month date value allowed.
     */
    min?: CalendarMonthRequired;
    /**
     * A callback function that returns a component-specific message detail when the date range validation fails when the input value is greater than the max.
     * If the component needs a date range validation error message for overflow that is different from the default,
     * set this property. The function should return a translated string.
     */
    dateRangeOverflowMessageDetail?: MessageDetailFn<OverflowMessageDetailParameters>;
    /**
     * A callback function that returns a component-specific message detail when the date range validation fails when the input value is less than the min.
     * If the component needs a date range validation error message for underflow that is different from the default,
     * set this property. The function should return a translated string.
     */
    dateRangeUnderflowMessageDetail?: MessageDetailFn<UnderflowMessageDetailParameters>;
    /**
     * An object of type FormatObj<CalendarMonthRequired> is a required prop for CalendarMonthRangeValidator.
     * It is an object that has a format function that formats the value, min, and max properties into strings to be used in the error message.
     */
    formatObj: FormatObj<CalendarMonthRequired>;
};
declare class CalendarMonthRangeValidator {
    private defaultRangeOverflowMessageDetailFn;
    private defaultRangeUnderflowMessageDetailFn;
    private min;
    private max;
    private dateRangeOverflowMessageDetail;
    private dateRangeUnderflowMessageDetail;
    private formatObj;
    constructor(options: CalendarMonthRangeValidatorOptions);
    validate(value: CalendarMonthRequired | null): Required<import("@oracle/oraclejet-preact/UNSAFE_InputDateMask").CalendarMonth> | undefined;
    /**
     * Compares two dates of type CalendarMonthRequired.
     * @param {CalendarMonthRequired} val1 first month/year value
     * @param {CalendarMonthRequired} val2 second month/year value
     * @return {number} 0 if the same month and year. 1 if val1 > val2. -1 if val1 < val2.
     * @private
     * @static
     */
    private static _compareCalendarMonths;
}
export { CalendarMonthRangeValidator, CalendarMonthRangeValidatorOptions, OverflowMessageDetailParameters, UnderflowMessageDetailParameters };
