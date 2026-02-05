import { ComponentProps } from 'preact';
import NumberRangeValidator = require('ojs/ojvalidator-numberrange');
import { InputNumber } from './input-number';
type InputNumberProps = ComponentProps<typeof InputNumber>;
import Converter = require('ojs/ojconverter');
/**
 * Props for the useImplicitNumberRangeValidator hook
 */
type UseImplicitNumberRangeValidatorProps = {
    /**
     * An instance implementation of Converter<number>. It is used to format the value in error message.
     * It is optional for the validator that a converter is passed in.
     */
    converter?: Converter<number>;
    /**
     * The minimum number value allowed.
     */
    min?: Exclude<InputNumberProps['min'], null>;
    /**
     * The maximum number value allowed.
     */
    max?: Exclude<InputNumberProps['max'], null>;
    /**
     * The component-specific message detail when the number range validation fails when the input value is not between min and max
     * when min and max are equal.
     * If the component needs a number range validation error message for an exact number that is different from the default,
     * set this property. It should be a translated string.
     * Tokens:<br/>
     * {num} - the allowed value<p>
     * Usage: <br/>
     * The number must be {num}.
     */
    numberRangeExactMessageDetail?: string;
    /**
     * The component-specific message detail when the number range validation fails when the input value is greater than the max.
     * If the component needs a number range validation error message for overflow that is different from the default,
     * set this property. It should be a translated string.
     * Tokens:<br/>
     * {value} - value entered by the user<br/>
     * {max} - the maximum allowed value<p>
     * Usage: <br/>
     * The number must be less than or equal to {max}.
     */
    numberRangeOverflowMessageDetail?: string;
    /**
     * The component-specific message detail when the number range validation fails when the input value is less than the min.
     * If the component needs a number range validation error message for underflow that is different from the default,
     * set this property. It should be a translated string.
     * Tokens:<br/>
     * {value} - value entered by the user<br/>
     * {min} - the minimum allowed value<p>
     * Usage: <br/>
     * The number must be greater than or equal to {min}.
     */
    numberRangeUnderflowMessageDetail?: string;
};
/**
 * A custom hook the creates an implicit new NumberRangeValidator for oj-c-input-number if there is a min or max property.
 * Otherwise it will return null.
 *
 * @param param0 The props for the export function useImplicitNumberRangeValidator({
 hook
 * @returns A NumberRangeValidator instance or null
 */
export declare function useImplicitNumberRangeValidator({ converter, max, min, numberRangeExactMessageDetail, numberRangeOverflowMessageDetail, numberRangeUnderflowMessageDetail }: UseImplicitNumberRangeValidatorProps): NumberRangeValidator | null;
export {};
