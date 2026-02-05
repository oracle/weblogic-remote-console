/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import type { BundleType } from '@oracle/oraclejet-preact/resources/nls/bundle';
import type { CalendarDateRequired } from '@oracle/oraclejet-preact/utils/UNSAFE_calendarDateUtils';
import { FormatObj } from '@oracle/oraclejet-preact/UNSAFE_IntlFormatParse';
import type { CalendarDateConverter } from 'oj-c/input-date-mask/CalendarDateConverter';
import type Validator = require('ojs/ojvalidator');
/**
 * Parameters that are passed into the dateRangeOverflowMessageDetail callback function.
 */
export type OverflowMessageDetailParameters = {
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
export type UnderflowMessageDetailParameters = {
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
export type DateRangeValidatorOptions = {
    /**
     * A converter instance for converting a date string to CalendarDate and vice versa.
     */
    converter: CalendarDateConverter;
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
     * The default message detail callback function when the date range validation fails when the input value is greater than the max.
     * The function should return a translated string.
     */
    defaultRangeOverflowMessageDetailFn: BundleType['inputDatePicker_dateRangeOverflowMessageDetail'];
    /**
     * The default message detail callback function when the date range validation fails when the input value is less than the min.
     * The function should return a translated string.
     */
    defaultRangeUnderflowMessageDetailFn: BundleType['inputDatePicker_dateRangeUnderflowMessageDetail'];
    /**
     * Format a date as a string.
     */
    formatObj: FormatObj<string>;
    /**
     * The maximum year and month date value allowed.
     */
    max?: CalendarDateRequired;
    /**
     * The minimum year and month date value allowed.
     */
    min?: CalendarDateRequired;
};
/**
 * Constructs a DateRangeValidator that ensures the date provided is
 * within the range specified using min and max.
 * @template V type of the value to be validated
 * @implements {Validator}
 */
export declare class DateRangeValidator<V extends string | null = string | null> implements Validator<V> {
    #private;
    private options;
    /**
     * Instantiates the DateRangeValidator
     * @param options The validator options
     */
    constructor(options: DateRangeValidatorOptions);
    /**
     * Validates that the provided date is within the range
     * @param value The date to be validated
     * @throws {Error} when the date is not within the range
     */
    validate(value: V): void;
}
export {};
