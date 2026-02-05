/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import type { BundleType } from '@oracle/oraclejet-preact/resources/nls/bundle';
import { FormatObj } from '@oracle/oraclejet-preact/UNSAFE_IntlFormatParse';
import type Validator = require('ojs/ojvalidator');
import { type TimeWithValidIsoStrParts } from '@oracle/oraclejet-preact/utils/UNSAFE_timeUtils';
import type { TimeConverter } from './TimeConverter';
/**
 * Parameters that are passed into the timeRangeOverflowMessageDetail callback function.
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
 * Parameters the are passed into the timeRangeUnderflowMessageDetail callback function.
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
export type TimeRangeValidatorOptions = {
    /**
     * A converter instance for converting a time string to Time and vice versa.
     */
    converter: TimeConverter;
    /**
     * A callback function that returns a component-specific message detail when the time range validation fails when the input value is greater than the max.
     * If the component needs a time range validation error message for overflow that is different from the default,
     * set this property. The function should return a translated string.
     */
    timeRangeOverflowMessageDetail?: MessageDetailFn<OverflowMessageDetailParameters>;
    /**
     * A callback function that returns a component-specific message detail when the time range validation fails when the input value is less than the min.
     * If the component needs a time range validation error message for underflow that is different from the default,
     * set this property. The function should return a translated string.
     */
    timeRangeUnderflowMessageDetail?: MessageDetailFn<UnderflowMessageDetailParameters>;
    /**
     * The default message detail callback function when the time range validation fails when the input value is greater than the max.
     * The function should return a translated string.
     */
    defaultRangeOverflowMessageDetailFn: BundleType['inputTimeMask_timeRangeOverflowMessageDetail'];
    /**
     * The default message detail callback function when the time range validation fails when the input value is less than the min.
     * The function should return a translated string.
     */
    defaultRangeUnderflowMessageDetailFn: BundleType['inputTimeMask_timeRangeUnderflowMessageDetail'];
    /**
     * Format a time as a string to show in the error message, like "Enter a time that's 2:00 AM or earlier."
     */
    formatObj: FormatObj<string>;
    /**
     * The maximum time value allowed where hour and minute are required.
     */
    max?: TimeWithValidIsoStrParts;
    /**
     * The minimum time value allowed where hour and minute are required.
     */
    min?: TimeWithValidIsoStrParts;
};
/**
 * Constructs a TimeRangeValidator that ensures the time provided is
 * within the range specified using min and max. This throws an error if min is not less than max.
 * @template V type of the value to be validated. This is a time only iso string.
 * @implements {Validator}
 */
export declare class TimeRangeValidator<V extends string | null = string | null> implements Validator<V> {
    #private;
    private options;
    /**
     * Instantiates the TimeRangeValidator
     * @param options The validator options
     */
    constructor(options: TimeRangeValidatorOptions);
    /**
     * Validates that the provided time is within the range.
     * @param value The time to be validated. V is a time-only iso string.
     * @throws {Error} when the time is not within the range
     */
    validate(value: V): void;
}
export {};
