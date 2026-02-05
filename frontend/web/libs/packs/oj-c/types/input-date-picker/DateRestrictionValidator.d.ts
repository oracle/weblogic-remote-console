/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import type { BundleType } from '@oracle/oraclejet-preact/resources/nls/bundle';
import type { CalendarDateConverter } from 'oj-c/input-date-mask/CalendarDateConverter';
import type { ComponentProps } from 'preact';
import type { InputDatePicker } from './input-date-picker';
import type Validator = require('ojs/ojvalidator');
type InputDatePickerProps = ComponentProps<typeof InputDatePicker>;
type DayFormatterOutput = NonNullable<ReturnType<NonNullable<InputDatePickerProps['dayFormatter']>>>;
type InvalidSelectionStates = Exclude<DayFormatterOutput['state'], 'enabled'>;
/**
 * Parameters that are passed into the dateRestrictionMessageDetail callback function.
 */
export type RestrictionMessageDetailParameters = {
    /**
     * The state of selected invalid value.
     */
    state: InvalidSelectionStates;
    /**
     * The value entered by the user.
     */
    value: string;
};
export type DateRestrictionValidatorOptions = {
    /**
     * A callback function that returns additional information for rendering a day in the Date Picker.
     * If you want to restrict or disable some of the days, set this property. When this property is set,
     * this will be used to validate the value. If a selected date is either 'disabled' or 'restricted',
     * it will fail the validation and a validation error will be shown.
     */
    dayFormatter: NonNullable<InputDatePickerProps['dayFormatter']>;
    /**
     * A callback function that returns a component-specific message detail when the date restriction validation
     * fails when the inputted date is not available. If the component needs a date restriction validation error
     * message that is different from the default, set this property. The function should return a translated string.
     */
    dateRestrictionMessageDetail?: InputDatePickerProps['dateRestrictionMessageDetail'];
    /**
     * The default message detail callback function when the date restriction validation fails when the inputted date is not available.
     * The function should return a translated string.
     */
    defaultRestrictionMessageDetail: BundleType['inputDatePicker_dateRestrictionMessageDetail'];
    /**
     * A converter instance for converting a date string to CalendarDate and vice versa.
     */
    converter: CalendarDateConverter;
};
/**
 * Constructs a DateRestrictionValidator that ensures the date provided is
 * not a disabled or restricted date.
 * @template V type of the value to be validated
 * @implements {Validator}
 */
export declare class DateRestrictionValidator<V extends string | null = string | null> implements Validator<V> {
    #private;
    private options;
    /**
     * Instantiates the DateRestrictionValidator
     * @param options The validator options
     */
    constructor(options: DateRestrictionValidatorOptions);
    /**
     * Validates that the provided date is not disabled or restricted
     * @param value The date to be validated
     * @throws {Error} when the date is disabled or restricted
     */
    validate(value: V): void;
}
export {};
