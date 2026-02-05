import { FormatObj } from '@oracle/oraclejet-preact/UNSAFE_IntlFormatParse';
import type { CalendarMonthRequired } from '@oracle/oraclejet-preact/UNSAFE_InputDateMask';
import { CalendarMonthRangeValidator } from './CalendarMonthRangeValidator';
import type { CalendarMonthRangeValidatorOptions } from './CalendarMonthRangeValidator';
/**
 * Props for the useImplicitCalendarMonthRangeValidator hook.
 */
type UseImplicitCalendarMonthRangeValidatorProps = {
    /**
     * An object of type FormatObj<CalendarMonthRequired> is a required prop for CalendarMonthRangeValidator.
     * It is an object that has a format function that formats the value, min, and max properties into strings to be used in the error message.
     */
    formatObj: FormatObj<CalendarMonthRequired>;
    /**
     * A callback function that returns a component-specific message detail when the date range validation fails when the input value is greater than the max.
     * If the component needs a date range validation error message for overflow that is different from the default,
     * set this property. The function should return a translated string.
     */
    dateRangeOverflowMessageDetail?: CalendarMonthRangeValidatorOptions['dateRangeOverflowMessageDetail'];
    /**
     * A callback function that returns a component-specific message detail when the date range validation fails when the input value is less than the min.
     * If the component needs a date range validation error message for underflow that is different from the default,
     * set this property. The function should return a translated string.
     */
    dateRangeUnderflowMessageDetail?: CalendarMonthRangeValidatorOptions['dateRangeUnderflowMessageDetail'];
    /**
     * The maximum year and month date value allowed.
     */
    max?: CalendarMonthRangeValidatorOptions['max'];
    /**
     * The minimum year and month date value allowed.
     */
    min?: CalendarMonthRangeValidatorOptions['min'];
};
/**
 * Custom hook that creates an implicit CalendarMonthRangeValidator for oj-c-input-month-mask if there is a min or max property.
 * Otherwise it will return null.
 *
 * @returns A CalendarMonthRangeValidator instance or null
 */
export declare function useImplicitCalendarMonthRangeValidator({ formatObj, dateRangeOverflowMessageDetail, dateRangeUnderflowMessageDetail, max, min }: UseImplicitCalendarMonthRangeValidatorProps): CalendarMonthRangeValidator | null;
export {};
