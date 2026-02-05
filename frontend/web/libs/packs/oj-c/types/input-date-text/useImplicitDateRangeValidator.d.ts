import { ComponentProps } from 'preact';
import { LocalDateRangeValidator } from 'ojs/ojvalidator-localdaterange';
import { InputDateText } from './input-date-text';
import { FormatObj } from '@oracle/oraclejet-preact/UNSAFE_IntlFormatParse';
type InputDateTextProps = ComponentProps<typeof InputDateText>;
/**
 * Props for the useImplicitDateRangeValidator hook.
 */
type UseImplicitDateRangeValidatorProps = {
    /**
     * An object of type FormatObj<string> is a required prop for DateRangeValidator.
     */
    formatObj: FormatObj<string>;
    /**
     * The component-specific message detail when the date range validation fails when the input value is greater than the max.
     * If the component needs a date range validation error message for overflow that is different from the default,
     * set this property. It should be a translated string.
     * </p>
     * Tokens:<br/>
     * {value} - value entered by the user<br/>
     * {max} - the maximum allowed value<p>
     * Usage: <br/>
     * The date must be less than or equal to {max}.
     */
    dateRangeOverflowMessageDetail?: string;
    /**
     * The component-specific message detail when the date range validation fails when the input value is less than the min.
     * If the component needs a date range validation error message for underflow that is different from the default,
     * set this property. It should be a translated string.
     * </p>
     * Tokens:<br/>
     * {value} - value entered by the user<br/>
     * {min} - the minimum allowed value<p>
     * Usage: <br/>
     * The date must be greater than or equal to {min}.
     */
    dateRangeUnderflowMessageDetail?: string;
    /**
     * The maximum date value allowed.
     */
    max?: Exclude<InputDateTextProps['max'], null>;
    /**
     * The minimum date value allowed.
     */
    min?: Exclude<InputDateTextProps['min'], null>;
};
/**
 * Custom hook that creates an implicit DateTimeRangeValidator for oj-c-input-date if there is a min or max property.
 * Otherwise it will return null.
 *
 * @returns A DateTimeRangeValidator instance or null
 */
export declare function useImplicitDateRangeValidator({ formatObj, dateRangeOverflowMessageDetail, dateRangeUnderflowMessageDetail, max, min }: UseImplicitDateRangeValidatorProps): LocalDateRangeValidator | null;
export {};
